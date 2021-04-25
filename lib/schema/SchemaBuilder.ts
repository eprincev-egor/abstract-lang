/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Cursor } from "cursor";
import { DigitsToken } from "token";
import { AnyRow, keyword } from "../node";
import { Schema, SchemaDescription } from "./interface";

export interface SchemaBuilderParams<TRow extends AnyRow> {
    schema: string;
    where: SchemaDescription<TRow>;
}

export class SchemaBuilder<TRow extends AnyRow> {

    static build<TRow extends AnyRow>(
        params: SchemaBuilderParams<TRow>
    ): Schema<TRow> {
        const builder = new SchemaBuilder<TRow>(params);
        const schema = builder.build();
        return schema;
    }

    private schema: string;
    private description: SchemaDescription<TRow>;
    private constructor(params: SchemaBuilderParams<TRow>) {
        this.schema = params.schema;
        this.description = params.where;

        for (const key in this.description) {
            const place = `<${key}>`;
            const hasPlace = this.schema.includes(place);
            if ( !hasPlace ) {
                throw new Error(`required ${place} inside schema: ${this.schema}`);
            }
        }
    }

    private build(): Schema<TRow> {
        const [someKeyword, wrappedKey] = this.schema.trim().split(" ");
        const key = wrappedKey.replace("<", "").replace(">", "");

        return {
            entry(cursor: Cursor) {
                return cursor.beforeWord(someKeyword);
            },
            parse(cursor: Cursor) {
                const row: any = {};
                cursor.readWord(someKeyword);

                const value = +cursor.readAll(DigitsToken).join("");
                row[ key ] = value;

                return row;
            },
            template(row: any) {
                const value = row[ key ];

                return [
                    keyword(someKeyword),
                    value.toString()
                ];
            }
        } as Schema<TRow>;
    }
}
