import { NodeBuilder, SchemaDescription } from "../NodeBuilder";
import { AbstractNode, AnyRow, NodeJson } from "../../AbstractNode";
import { assertNode, SuccessTest, ErrorTest } from "../../../assert";

export interface SchemaTest<TRow extends AnyRow> {
    schema: string;
    where: SchemaDescription<TRow>;
    examples: (SuccessTest<AbstractNode<TRow>> | ErrorTest)[];
}

export interface SchemaTestExample<TRow extends AnyRow> {
    input: string;
    shouldBe: {
        json: NodeJson<TRow>;
        pretty?: string;
        minify?: string;
    };
}

export function testBuilder<TRow extends AnyRow>(test: SchemaTest<TRow>): void {
    const TestNode = NodeBuilder.build<TRow>({
        schema: test.schema,
        where: test.where
    });

    for (const example of test.examples) {
        assertNode(TestNode, example);
    }
}