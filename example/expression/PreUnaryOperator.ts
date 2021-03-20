import {
    AbstractNode,
    Cursor,
    OperatorsToken,
    TemplateElement
} from "abstract-lang";
import { Expression } from "./Expression";
import { Operand } from "./Operand";
import assert from "assert";

const PRE_UNARY_OPERATORS = ["-", "+", "!", "--", "++"] as const;
type PreUnaryOperatorType = (typeof PRE_UNARY_OPERATORS)[number];
interface PreUnaryOperatorRow {
    preOperator: PreUnaryOperatorType;
    operand: Operand;
}

export class PreUnaryOperator extends AbstractNode<PreUnaryOperatorRow> {

    static entry(cursor: Cursor): boolean {
        return PRE_UNARY_OPERATORS.includes(
            cursor.nextToken.value as any
        );
    }

    static parse(cursor: Cursor): PreUnaryOperatorRow {
        const preOperator = PreUnaryOperator.parseOperator(cursor);
        const operand = Expression.parseOperand(cursor);
        return {
            preOperator,
            operand
        };
    }

    private static parseOperator(cursor: Cursor): PreUnaryOperatorType {
        let preOperator = cursor.read(OperatorsToken).value;

        if ( preOperator === "-" && cursor.beforeValue("-") ) {
            preOperator += "-";
            cursor.next();
        }
        else if ( preOperator === "+" && cursor.beforeValue("+") ) {
            preOperator += "+";
            cursor.next();
        }

        assert.ok( PRE_UNARY_OPERATORS.includes(preOperator as any) );
        return preOperator as PreUnaryOperatorType;
    }

    template(): TemplateElement[] {
        const {preOperator, operand} = this.row;
        return [preOperator, operand];
    }
}