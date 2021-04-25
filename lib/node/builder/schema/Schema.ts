import { Cursor } from "../../../cursor";
import { AbstractNode, AnyRow } from "../../AbstractNode";
import { printChain, TemplateElement } from "../../util";
import { SchemaElement } from "./interface";
import { KeyPhrase } from "./KeyPhrase";
import { Value } from "./Value";
import { OneOf } from "./OneOf";
import { SchemaDescription } from "../NodeBuilder";

export interface SchemaRow {
    elements: SchemaElement[];
}

export class Schema
    extends AbstractNode<SchemaRow>
    implements SchemaElement {

    static entry(cursor: Cursor): boolean {
        return cursor.beforeOneOf([
            KeyPhrase,
            Value,
            OneOf
        ]);
    }

    static parse(cursor: Cursor): SchemaRow {
        const elements: SchemaElement[] = [];

        do {
            cursor.skipSpaces();

            const element = cursor.parseOneOf([
                KeyPhrase,
                Value,
                OneOf
            ], "required schema element");

            elements.push(element);

            cursor.skipSpaces();
        } while ( cursor.before(Schema) );

        return {elements};
    }

    template(): TemplateElement[] {
        return printChain(this.row.elements, " ");
    }

    hasValue(key: string): boolean {
        return hasValue(this, key);
    }

    validate(schema: string, description: SchemaDescription<AnyRow>): void {
        for (const element of this.row.elements) {
            element.validate(schema, description);
        }
    }

    toEntry(description: SchemaDescription<AnyRow>): string {
        return this.row.elements[0].toEntry(description);
    }

    toParse(description: SchemaDescription<AnyRow>): string {
        let output = "";

        for (const element of this.row.elements) {
            output += element.toParse(description);
            output += "\n";
        }

        return output;
    }

    toTemplate(description: SchemaDescription<AnyRow>): string {
        return this.row.elements.map((element) =>
            element.toTemplate(description)
        ).join(",\n");
    }
}

function hasValue(element: SchemaElement, key: string): boolean {

    if ( element instanceof Value ) {
        return element.row.key === key;
    }

    if ( element instanceof OneOf ) {
        return element.row.oneOf.some((child) => hasValue(child, key));
    }

    if ( element instanceof Schema ) {
        return element.row.elements.some((child) => hasValue(child, key));
    }

    return false;
}
