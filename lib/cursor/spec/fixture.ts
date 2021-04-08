import { Cursor } from "../Cursor";
import { AbstractNode } from "../../node";
import { WordToken } from "../../token";

interface WordRow {
    word: string;
}

export class WordNode extends AbstractNode<WordRow> {

    static entry(cursor: Cursor): boolean {
        return cursor.beforeToken(WordToken);
    }

    static parse(cursor: Cursor): WordRow {
        const word = cursor.read(WordToken).value;
        return {word};
    }

    // istanbul ignore next
    template(): string {
        return this.row.word;
    }
}

interface HelloRow {
    hello: true;
}

export class Hello extends AbstractNode<HelloRow> {
    static entry(cursor: Cursor): boolean {
        return cursor.beforeWord("hello");
    }

    static parse(cursor: Cursor): HelloRow {
        cursor.readWord("hello");
        return {hello: true};
    }

    template(): string {
        return "hello";
    }
}

interface WorldRow {
    world: true;
}

export class World extends AbstractNode<WorldRow> {
    static entry(cursor: Cursor): boolean {
        return cursor.beforeWord("world");
    }

    static parse(cursor: Cursor): WorldRow {
        cursor.readWord("world");
        return {world: true};
    }

    template(): string {
        return "world";
    }
}
