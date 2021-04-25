/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { AbstractNode, AnyRow } from "../../AbstractNode";
import { SchemaElement } from "./interface";
import { Cursor } from "../../../cursor";
import { _, TemplateElement } from "../../util";
import { WordToken } from "../../../token";
import { Schema } from "./Schema";
import { OneOf } from "./OneOf";
import { SchemaDescription } from "../NodeBuilder";

export interface ValueRow {
    key: string;
    schema?: Schema;
}

let variableNameIndex = 0;

export class Value
    extends AbstractNode<ValueRow>
    implements SchemaElement {

    static entry(cursor: Cursor): boolean {
        return cursor.beforeValue("<");
    }

    static parse(cursor: Cursor): ValueRow {
        cursor.readValue("<");

        const key = cursor.read(WordToken).value;
        let schema: Schema | undefined;

        if ( cursor.beforeValue(":") ) {
            cursor.readValue(":");
            schema = cursor.parse(Schema);
            // validate schema content
            noValuesInside(cursor, schema.row.elements);
        }

        cursor.readValue(">");

        if ( schema ) {
            return {key, schema};
        }
        else {
            return {key};
        }
    }

    template(): TemplateElement[] {
        const output: TemplateElement[] = [
            "<", this.row.key
        ];

        if ( this.row.schema ) {
            output.push(":", _);
            output.push(this.row.schema);
        }

        output.push(">");

        return output;
    }

    validate(schema: string, description: SchemaDescription<AnyRow>): void {
        const {key} = this.row;
        if ( key in description ) {
            return;
        }

        throw new Error(`required description for <${key}> inside schema: ${schema}`);
    }

    toEntry(description: SchemaDescription<AnyRow>): string {
        const {key, schema} = this.row;
        const valueDescription = description[ key ];

        if ( schema ) {
            return schema.toEntry(description);
        }

        if ( valueDescription === Number ) {
            return "cursor.beforeToken(globalScope.DigitsToken)";
        }

        return "true";
    }

    toParse(description: SchemaDescription<AnyRow>): string {
        const {key, schema} = this.row;
        const valueDescription = description[ key ];

        if ( schema ) {
            const startVariable = `startPosition${variableNameIndex}`;
            const endVariable = `endPosition${variableNameIndex}`;
            variableNameIndex++;

            return [
                `var ${startVariable} = cursor.nextToken.position;`,
                schema.toParse(description),
                `var ${endVariable} = cursor.nextToken.position;`,
                `row.${key} = cursor.source.text.slice(${startVariable}, ${endVariable}).trim();`
            ].join("\n");
        }

        if ( valueDescription === Number ) {
            return `row.${key} = +cursor.readAll(globalScope.DigitsToken).join("");`;
        }

        return `row.${key} = cursor.readAnyOne().value;`;
    }

    toTemplate(): string {
        const {key} = this.row;
        return `this.row.${key}.toString()`;
    }
}

function noValuesInside(cursor: Cursor, elements: SchemaElement[]): void {
    for (const element of elements) {

        if ( element instanceof Schema ) {
            noValuesInside(cursor, element.row.elements);
        }

        if ( element instanceof OneOf ) {
            noValuesInside(cursor, element.row.oneOf);
        }

        if ( element instanceof Value ) {
            cursor.throwError(
                "<value> inside <value> is not allowed",
                element
            );
        }
    }
}