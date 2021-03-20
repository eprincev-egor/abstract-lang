import { AbstractNode, Cursor, WordToken } from "abstract-lang";

export interface IdentifierRow {
    name: string;
}

export class Identifier extends AbstractNode<IdentifierRow> {

    static entry(cursor: Cursor): boolean {
        return cursor.beforeToken(WordToken);
    }

    static parse(cursor: Cursor): IdentifierRow {
        const name = cursor.read(WordToken).value;
        return {name};
    }

    template(): string {
        return this.row.name;
    }
}
