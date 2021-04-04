import { AbstractNode, Cursor, TemplateElement } from "abstract-lang";
import { Expression } from "./Expression";
import { Operand } from "./Operand";

interface CircleBracketsExpressionRow {
    operandInBrackets: Operand;
}

export class CircleBracketsExpression
    extends AbstractNode<CircleBracketsExpressionRow> {

    static entry(cursor: Cursor): boolean {
        return cursor.beforeValue("(");
    }

    static parse(cursor: Cursor): CircleBracketsExpressionRow {
        cursor.readValue("(");
        cursor.skipSpaces();

        const operandInBrackets = cursor.parse(Expression).row.operand;

        cursor.skipSpaces();
        cursor.readValue(")");

        return {operandInBrackets};
    }

    template(): TemplateElement[] {
        return ["(", this.row.operandInBrackets, ")"];
    }
}