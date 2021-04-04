import assert from "assert";
import { Cursor } from "../Cursor";
import { AbstractNode } from "../../node";
import { DigitsToken } from "../../token";
import { SourceCode } from "../../source";

describe("Cursor.node.parent.spec.ts set correct node.parent", () => {

    it("parse(Node) and check node.parent", () => {
        interface ItemRow {
            item: number;
            children: ItemNode[];
        }
        class ItemNode extends AbstractNode<ItemRow> {

            static entry(cursor: Cursor): boolean {
                return cursor.beforeValue("{");
            }

            static parse(cursor: Cursor): ItemRow {
                cursor.readValue("{");
                cursor.skipSpaces();

                cursor.readValue("item");
                cursor.readValue(":");
                cursor.skipSpaces();

                const item = +cursor.read(DigitsToken).value;

                cursor.skipSpaces();
                cursor.readValue(",");
                cursor.skipSpaces();

                cursor.readValue("children");
                cursor.readValue(":");
                cursor.skipSpaces();

                cursor.readValue("[");
                cursor.skipSpaces();

                let children: ItemNode[] = [];
                if ( cursor.before(ItemNode) ) {
                    children = cursor.parseChainOf(ItemNode, ",");
                }

                cursor.skipSpaces();
                cursor.readValue("]");

                cursor.skipSpaces();
                cursor.readValue("}");

                return {item, children};
            }

            // istanbul ignore next
            template() {
                return [];
            }
        }

        const code = new SourceCode({
            text: `{
                item: 1,
                children: [
                    {
                        item: 2,
                        children: []
                    },
                    {
                        item: 3,
                        children: [
                            {
                                item: 5,
                                children: []
                            }
                        ]
                    },
                    {
                        item: 6,
                        children: [
                            {
                                item: 7,
                                children: [
                                    {
                                        item: 8,
                                        children: []
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }`.trim()
        });
        const {cursor} = code;

        const root = cursor.parse(ItemNode);
        assert.deepStrictEqual(root.toJSON(), {
            item: 1,
            children: [
                {item: 2, children: []},
                {item: 3, children: [
                    {item: 5, children: []}
                ]},
                {item: 6, children: [
                    {item: 7, children: [
                        {item: 8, children: []}
                    ]}
                ]}
            ]
        });

        function assertChild(childNumber: number) {
            const children = root.filterChildren((child) =>
                child.row.item === childNumber
            );
            const child = children[0]!;
            return {
                hasParent(parentNumber: number) {
                    const parents = child.filterParents((parent) =>
                        parent.row.item === parentNumber
                    );

                    assert.ok(
                        parents.length === 1,
                        `${childNumber} has parent ${parentNumber}`
                    );
                }
            };
        }

        assertChild(2).hasParent(1);
        assertChild(3).hasParent(1);
        assertChild(5).hasParent(1);
        assertChild(6).hasParent(1);
        assertChild(7).hasParent(1);
        assertChild(8).hasParent(1);

        assertChild(5).hasParent(3);
        assertChild(7).hasParent(6);

        assertChild(8).hasParent(6);
        assertChild(8).hasParent(7);
    });

});
