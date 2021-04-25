import { AbstractNode, AnyRow } from "../../AbstractNode";
import { SchemaElement } from "./interface";
import { Cursor } from "../../../cursor";
import { _, TemplateElement, printChain } from "../../util";
import { Schema } from "./Schema";
import { SchemaDescription } from "../NodeBuilder";

export interface OneOfRow {
    oneOf: Schema[];
}

export class OneOf
    extends AbstractNode<OneOfRow>
    implements SchemaElement {

    static entry(cursor: Cursor): boolean {
        return cursor.beforeValue("{");
    }

    static parse(cursor: Cursor): OneOfRow {

        cursor.readValue("{");
        const oneOf = cursor.parseChainOf(Schema, "|");
        cursor.readValue("}");

        return {oneOf};
    }

    template(): TemplateElement[] {
        return [
            "{",
            ...printChain(this.row.oneOf, _, "|", _),
            "}"
        ];
    }

    validate(schema: string, description: SchemaDescription<AnyRow>): void {
        for (const element of this.row.oneOf) {
            element.validate(schema, description);
        }
    }

    toEntry(description: SchemaDescription<AnyRow>): string {
        const oneOf = this.row.oneOf.map((schema) =>
            schema.toEntry(description)
        );

        return `(${oneOf.join(" || ")})`;
    }

    toParse(description: SchemaDescription<AnyRow>): string {
        const {oneOf} = this.row;
        let output = "";

        for (const element of oneOf) {
            const else_ = output ? "else " : "";
            output += `${ else_ }if ( ${ element.toEntry(description) } ) {\n`;
            output += element.toParse(description);
            output += "}\n";
        }

        output += "else {\n";
        output += "cursor.throwError('unexpected token: \"' + cursor.nextToken.value + '\"";
        output += `, expected one of: ${ oneOf.join(" | ") }');`;
        output += "}\n";

        return output;
    }

    // eslint-disable-next-line class-methods-use-this
    toTemplate(): string {
        throw new Error("{one of} should be inside <value: {...}>");
    }
}
