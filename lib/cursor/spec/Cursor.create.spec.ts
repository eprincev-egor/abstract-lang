import assert from "assert";
import { Cursor } from "../Cursor";
import { TestLang } from "./TestLang";
import { Operator } from "./fixture";

describe("Cursor.create.spec.ts create Node", () => {

    let cursor!: Cursor;
    beforeEach(() => {
        cursor = TestLang.code("hello world").cursor;
    });

    it("create node at token", () => {
        const startToken = cursor.nextToken;
        cursor.readAnyOne();

        const node = cursor.create(Operator, startToken, {
            left: "1", operator: "=", right: "2"
        });

        assert.ok(
            node instanceof Operator,
            "valid node instance"
        );
        assert.ok(
            node.source === cursor.source,
            "valid source"
        );
        assert.deepStrictEqual(
            node.position,
            {start: 0, end: 5},
            "valid position"
        );
    });

    it("create node at other node", () => {
        const startToken = cursor.nextToken;
        cursor.readAnyOne();

        const left = cursor.create(Operator, startToken, {
            left: "1", operator: "+", right: "2"
        });
        const right = cursor.create(Operator, startToken, {
            left: "3", operator: "-", right: "1"
        });
        const node = cursor.create(Operator, left, {
            left, operator: "*", right
        });

        assert.ok(
            node instanceof Operator,
            "valid node instance"
        );
        assert.ok(
            node.source === cursor.source,
            "valid source"
        );
        assert.deepStrictEqual(
            node.position,
            {start: 0, end: 5},
            "valid position"
        );
    });

    it("create node at number", () => {
        cursor.readAnyOne();

        const node = cursor.create(Operator, 0, {
            left: "1", operator: "=", right: "2"
        });

        assert.ok(
            node instanceof Operator,
            "valid node instance"
        );
        assert.ok(
            node.source === cursor.source,
            "valid source"
        );
        assert.deepStrictEqual(
            node.position,
            {start: 0, end: 5},
            "valid position"
        );
    });

    it("create node at other node without position", () => {
        const left = new Operator({
            row: {
                left: "1",
                operator: "+",
                right: "2"
            }
        });
        assert.throws(() => {
            cursor.create(Operator, left, {
                left, operator: "+", right: "3"
            });
        }, (err: Error) =>
            /cannot detect start node position/.test(err.message)
        );
    });

});
