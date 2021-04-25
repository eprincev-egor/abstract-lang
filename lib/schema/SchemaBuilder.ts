/* eslint-disable @typescript-eslint/restrict-template-expressions */
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

                if ( cursor.beforeValue(":") ) {
                    cursor.readValue(":");
                    cursor.skipSpaces();

                    cursor.readValue("{");
                    cursor.skipSpaces();

                    const variants: string[] = [];
                    while ( !cursor.beforeEnd() && !cursor.beforeValue("}") ) {
                        const variant = cursor.read(WordToken).value;
                        variants.push(variant);

                        cursor.skipSpaces();
                        if ( cursor.beforeValue("|") ) {
                            cursor.readValue("|");
                            cursor.skipSpaces();
                        }
                        else {
                            break;
                        }
                    }

                    cursor.skipSpaces();
                    cursor.readValue("}");

                    schemaElements.push({ key, variants });
                }
                else {
                    schemaElements.push({ key });
                }

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

        const entryPhrase: string[] = [];
        for (const element of schemaElements) {
            if ( element && "word" in element ) {
                entryPhrase.push(element.word);
            }
            else {
                break;
            }
        }

        let endPhrase: string[] = [];
        for (const element of schemaElements.reverse()) {
            if ( element && "word" in element ) {
                endPhrase.push(element.word);
            }
            else {
                break;
            }
        }
        endPhrase = endPhrase.reverse();

        const firstElement = schemaElements.find((element) =>
            element && "key" in element
        );

        return {
            entry(cursor: Cursor) {
                return cursor.beforePhrase(...entryPhrase);
            },
            parse(cursor: Cursor) {
                const row: any = {};

                cursor.readPhrase(...entryPhrase);

                if ( firstElement.variants ) {
                    let variantValue: string | undefined;
                    for (const variant of firstElement.variants ) {
                        if ( cursor.beforeWord(variant) ) {
                            variantValue = cursor.readWord(variant);
                            break;
                        }
                    }

                    if ( !variantValue ) {
                        const nextToken = cursor.nextToken.value;
                        cursor.throwError([
                            `unexpected token: "${nextToken}",`,
                            `expected one of: ${ firstElement.variants.join(" | ") }`
                        ].join(" "));
                    }

                    row[ firstElement.key ] = variantValue;
                }
                else {
                    const value = +cursor.readAll(DigitsToken).join("");
                    row[ firstElement.key ] = value;
                }

                return row;
            },
            template(row: any) {
                const value = row[ firstElement.key ];

                return [
                    ...entryPhrase.map((someKeyword) =>
                        keyword(someKeyword)
                    ),
                    value.toString(),
                    ...endPhrase.map((someKeyword) =>
                        keyword(someKeyword)
                    )
                ];
            }
        } as Schema<TRow>;
    }
}
