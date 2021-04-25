/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Cursor } from "cursor";
import { SourceCode } from "source";
import { DigitsToken, WordToken } from "token";
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
    }

    private build(): Schema<TRow> {
        const {schema, description} = this;
        const {cursor} = new SourceCode(schema);

        const schemaElements: any[] = [];

        while ( !cursor.beforeEnd() ) {
            cursor.skipSpaces();

            if ( cursor.beforeToken(WordToken) ) {
                const word = cursor.read(WordToken).value;
                schemaElements.push({ word });
                continue;
            }

            if ( cursor.beforeValue("<") ) {
                cursor.readValue("<");
                cursor.skipSpaces();

                const key = cursor.read(WordToken).value;
                if ( !(key in description) ) {
                    throw new Error(
                        `required description for <${key}> inside schema: ${schema}`
                    );
                }
                schemaElements.push({ key });

                cursor.skipSpaces();
                cursor.readValue(">");
            }
        }

        for (const key in description) {
            const hasPlace = schemaElements.find((element) =>
                element &&
                "key" in element &&
                element.key === key
            );
            if ( !hasPlace ) {
                throw new Error(`required <${key}> inside schema: ${schema}`);
            }
        }

        const entryPhrase: string[] = schemaElements
            .filter((element) =>
                element && "word" in element
            )
            .map((element) =>
                element.word
            );

        const firstKey = schemaElements.find((element) =>
            element && "key" in element
        ).key;

        return {
            entry(cursor: Cursor) {
                return cursor.beforePhrase(...entryPhrase);
            },
            parse(cursor: Cursor) {
                const row: any = {};

                cursor.readPhrase(...entryPhrase);

                const value = +cursor.readAll(DigitsToken).join("");
                row[ firstKey ] = value;

                return row;
            },
            template(row: any) {
                const value = row[ firstKey ];

                return [
                    ...entryPhrase.map((someKeyword) =>
                        keyword(someKeyword)
                    ),
                    value.toString()
                ];
            }
        } as Schema<TRow>;
    }
}
