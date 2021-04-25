import { SchemaBuilder } from "../SchemaBuilder";
import { SchemaDescription } from "../interface";
import { AbstractNode, AnyRow, NodeJson } from "../../node";
import { assertNode, SuccessTest, ErrorTest } from "../../assert";

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

export function testSchema<TRow extends AnyRow>(test: SchemaTest<TRow>): void {
    const schema = SchemaBuilder.build<TRow>({
        schema: test.schema,
        where: test.where
    });

    class TestNode extends AbstractNode<TRow> {
        static entry = schema.entry;
        static parse = schema.parse;
        template() {
            return schema.template(this.row);
        }
    }

    for (const example of test.examples) {
        assertNode(TestNode, example);
    }
}