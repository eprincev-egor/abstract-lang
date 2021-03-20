import {
    AbstractNode,
    Cursor,
    OperatorsToken,
    TemplateElement, _
} from "abstract-lang";
import { Operand } from "./Operand";
import assert from "assert";

const MATH_BINARY_OPERATORS = ["+", "-", "*", "/", "%"] as const;
const LOGIC_BINARY_OPERATORS = ["&&", "||"] as const;
const COMPARE_BINARY_OPERATORS = [
    "===", "==",
    "!==", "!=",
    ">", "<",
    ">=", "<="
] as const;
const BINARY_OPERATORS = [
    ...MATH_BINARY_OPERATORS,
    ...LOGIC_BINARY_OPERATORS,
    ...COMPARE_BINARY_OPERATORS
] as const;
export type BinaryOperatorType = (typeof BINARY_OPERATORS)[number];

// https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Operators/Operator_Precedence
const OPERATORS_PRECEDENCE: BinaryOperatorType[][] = [
    ["||"],
    ["&&"],
    ["==", "===", "!=", "!=="],
    ["<", "<=", ">=", ">"],
    ["+", "-"],
    ["*", "%", "/"]
];

function precedence(operator: BinaryOperatorType) {
    const index = OPERATORS_PRECEDENCE.findIndex((operators) =>
        operators.some((someOperator) =>
            someOperator === operator
        )
    );
    return index;
}


interface BinaryOperatorRow {
    left: Operand;
    operator: BinaryOperatorType;
    right: Operand;
}

export class BinaryOperator extends AbstractNode<BinaryOperatorRow> {

    static entryOperator(cursor: Cursor): boolean {
        if ( !cursor.beforeToken(OperatorsToken) ) {
            return false;
        }

        const operator = BinaryOperator.readThreeSymbols(cursor);
        const hasEntry = (
            BINARY_OPERATORS.includes(operator as any) ||
            BINARY_OPERATORS.includes(operator.slice(0, -1) as any) ||
            BINARY_OPERATORS.includes(operator.slice(0, -2) as any)
        );
        return hasEntry;
    }

    static parseOperator(cursor: Cursor): BinaryOperatorType {
        let binaryOperator = cursor.read(OperatorsToken).value;

        if (
            ["&", "|", "=", "!", ">", "<"].includes(binaryOperator) &&
            cursor.beforeToken(OperatorsToken)
        ) {
            binaryOperator += cursor.read(OperatorsToken).value;
        }

        assert.ok( BINARY_OPERATORS.includes( binaryOperator as any ) );
        return binaryOperator as BinaryOperatorType;
    }

    private static readThreeSymbols(cursor: Cursor) {
        const token = cursor.nextToken;

        let nextThreeSymbols = cursor.read(OperatorsToken).value;

        if ( cursor.beforeToken(OperatorsToken) ) {
            nextThreeSymbols += cursor.nextToken.value;
            cursor.next();

            if ( cursor.beforeToken(OperatorsToken) ) {
                nextThreeSymbols += cursor.nextToken.value;
                cursor.next();
            }
        }

        cursor.setPositionBefore(token);
        return nextThreeSymbols;
    }

    lessPrecedence(someOperator: BinaryOperatorType): boolean {
        return precedence(this.row.operator) < precedence(someOperator);
    }

    template(): TemplateElement[] {
        const {left, operator, right} = this.row;
        return [left, _, operator, _, right];
    }
}