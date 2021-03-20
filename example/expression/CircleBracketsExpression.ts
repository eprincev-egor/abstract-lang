import { AbstractNode, Cursor, SpaceToken, TemplateElement } from "abstract-lang";
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
        cursor.skipAll(SpaceToken);

        const operandInBrackets = cursor.parse(Expression).row.operand;

        cursor.skipAll(SpaceToken);
        cursor.readValue(")");

        return {operandInBrackets};
    }

    template(): TemplateElement[] {
        return ["(", this.row.operandInBrackets, ")"];
    }
}