import { AbstractNode } from "../../AbstractNode";
import { SchemaElement } from "./interface";
import { Cursor } from "../../../cursor";
import { keyword, TemplateElement } from "../../util";
import { WordToken } from "../../../token";

export interface KeyPhraseRow {
    phrase: string[];
}

export class KeyPhrase
    extends AbstractNode<KeyPhraseRow>
    implements SchemaElement {

    static entry(cursor: Cursor): boolean {
        return cursor.beforeToken(WordToken);
    }

    static parse(cursor: Cursor): KeyPhraseRow {
        const phrase: string[] = [];

        do {
            const word = cursor.read(WordToken).value;
            phrase.push(word);

            cursor.skipSpaces();
        } while ( cursor.beforeToken(WordToken) );

        return {phrase};
    }

    template(): TemplateElement[] {
        return this.row.phrase.map((word) =>
            keyword(word)
        );
    }

    // eslint-disable-next-line class-methods-use-this
    validate(): void {
        return;
    }

    toEntry(): string {
        const {phrase} = this.row;
        const words = phrase.map((word) => `"${word}"`);

        if ( words.length === 1 ) {
            return `cursor.beforeWord(${ words[0] })`;
        }

        return `cursor.beforePhrase(${ words.join(", ") })`;
    }

    toParse(): string {
        const {phrase} = this.row;
        const words = phrase.map((word) => `"${word}"`);

        if ( words.length === 1 ) {
            return `cursor.readWord(${ words[0] });`;
        }

        return `cursor.readPhrase(${ words.join(", ") }).join("");`;
    }

    toTemplate(): string {
        const {phrase} = this.row;
        const words = phrase.map((word) => `globalScope.keyword("${word}")`);
        return words.join(", ");
    }
}
