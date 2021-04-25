/* eslint-disable @typescript-eslint/no-implied-eval */
/* eslint-disable max-classes-per-file */
import { AbstractNode, AnyRow, NodeClass } from "../AbstractNode";
import { DigitsToken } from "../../token";
import { Cursor } from "../../cursor";
import { SourceCode } from "../../source";
import { keyword, TemplateElement } from "../util";
import { Schema } from "./schema/Schema";

export type SchemaDescription<TRow extends AnyRow> = {
    [key in keyof TRow]: SchemaDescriptionValue<TRow[key]>;
}

export type NumberDescription = typeof Number;
export type StringDescription = typeof String;

export type SchemaDescriptionValue<T extends any> = (
    T extends number ?
        NumberDescription :
    T extends string ?
        StringDescription :
    T
);

export interface SchemaBuilderParams<TRow extends AnyRow> {
    schema: string;
    where: SchemaDescription<TRow>;
}

export class NodeBuilder<TRow extends AnyRow> {

    static build<TRow extends AnyRow>(
        params: SchemaBuilderParams<TRow>
    ): NodeClass<AbstractNode<TRow>> {
        const builder = new NodeBuilder<TRow>(params);
        const schema = builder.build();
        return schema;
    }

    private schema: Schema;
    private description: SchemaDescription<TRow>;
    private constructor(params: SchemaBuilderParams<TRow>) {

        const {cursor} = new SourceCode(params.schema);
        this.schema = cursor.parse(Schema);
        this.schema.validate(params.schema, params.where);

        this.description = params.where;

        for (const key in this.description) {
            if ( !this.schema.hasValue(key) ) {
                throw new Error(`required <${key}> inside schema: ${params.schema}`);
            }
        }
    }

    private build(): NodeClass<AbstractNode<TRow>> {
        const entryCode = this.schema.toEntry(this.description);
        const parseCode = this.schema.toParse(this.description);
        const templateCode = this.schema.toTemplate(this.description);

        // @see Value
        const globalScope = {
            DigitsToken,
            keyword
        };

        const entry = new Function(
            "globalScope", "cursor",
            `return (${entryCode})`
        ).bind(undefined, globalScope) as (cursor: Cursor) => boolean;

        const parse = new Function(
            "globalScope", "cursor", [
                "var row = {};",
                parseCode,
                "return row;"
            ].join("\n")
        ).bind(undefined, globalScope) as (cursor: Cursor) => TRow;

        const template = new Function(
            "globalScope", [
                "return [",
                templateCode,
                "]"
            ].join("\n")
        ) as (globalScope: unknown) => TemplateElement[];

        return class SchemaNode extends AbstractNode<TRow> {
            static entry = entry;
            static parse = parse;
            template() {
                return template.call(this, globalScope);
            }
        };
    }
}
