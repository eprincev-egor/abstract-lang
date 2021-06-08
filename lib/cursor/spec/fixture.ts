import { Cursor } from "../Cursor";
import { AbstractNode, TemplateElement } from "../../node";
import { WordToken, DigitsToken } from "../../token";

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


interface OperatorRow {
    left: string | Operator;
    operator: string;
    right: string | Operator;
}

export class Operator extends AbstractNode<OperatorRow> {
    // istanbul ignore next
    static entry(): boolean {
        return true;
    }

    static parse(cursor: Cursor): OperatorRow {
        const left = Operator.parseOperand(cursor);
        cursor.skipSpaces();

        const operator = cursor.nextToken.value;
        cursor.skipOne();

        cursor.skipSpaces();
        const right = Operator.parseOperand(cursor);

        return {left, operator, right};
    }

    static parseOperand(cursor: Cursor): string | Operator {
        if ( cursor.beforeValue("(") ) {
            cursor.skipOne();
            cursor.skipSpaces();

            const operator = cursor.parse(Operator);

            cursor.skipSpaces();
            cursor.readValue(")");

            return operator;
        }

        const numb = cursor.read(DigitsToken).value;
        return numb;
    }

    // istanbul ignore next
    template(): TemplateElement[] {
        const {left, operator, right} = this.row;
        return [left, operator, right];
    }
}