/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { AbstractNode, Cursor } from "abstract-lang";
import { Operand } from "./Operand";
import { NumberLiteral } from "./NumberLiteral";
import { Identifier } from "./Identifier";
import { PreUnaryOperator } from "./PreUnaryOperator";
import { BinaryOperator, BinaryOperatorType } from "./BinaryOperator";
import { PostUnaryOperator } from "./PostUnaryOperator";
import { BooleanLiteral } from "./BooleanLiteral";
import { NullLiteral } from "./NullLiteral";
import { DotOperator } from "./DotOperator";
import { StringLiteral } from "./StringLiteral";
import { CircleBracketsExpression } from "./CircleBracketsExpression";

interface ExpressionRow {
    operand: Operand;
}

export class Expression extends AbstractNode<ExpressionRow> {

    static entry(cursor: Cursor): boolean {
        return cursor.beforeOneOf([
            Identifier, NumberLiteral,
            StringLiteral, PreUnaryOperator,
            CircleBracketsExpression
        ]);
    }

    static parse(cursor: Cursor): ExpressionRow {
        const operand: Operand = Expression.parseOperand(cursor);

        const binary = Expression.parseBinary(cursor, operand);
        if ( binary ) {
            return {operand: binary};
        }

        return {operand};
    }

    static parseOperand(cursor: Cursor): Operand {
        let operand: Operand = (
            cursor.before(PreUnaryOperator) ?
                cursor.parse(PreUnaryOperator) :
                Expression.parseSimpleOperand(cursor)
        );
        cursor.skipSpaces();

        operand = Expression.parseDotOperators(cursor, operand);

        if ( PostUnaryOperator.entryOperator(cursor) ) {
            const postOperator = PostUnaryOperator.parseOperator(cursor);
            const postUnary = cursor.create(PostUnaryOperator, operand, {
                postOperator,
                operand
            });
            operand = postUnary;

            cursor.skipSpaces();
        }

        return operand;
    }

    private static parseDotOperators(
        cursor: Cursor,
        operand: Operand
    ): Operand {
        if ( !cursor.beforeValue(".") ) {
            return operand;
        }

        cursor.readValue(".");
        cursor.skipSpaces();
        const property = cursor.parse(Identifier);

        const dotOperator = cursor.create(DotOperator, operand, {
            operand,
            property
        });
        operand = dotOperator;

        operand = Expression.parseDotOperators(cursor, operand);
        return operand;
    }

    private static parseSimpleOperand(cursor: Cursor): Operand {
        return cursor.parseOneOf([
            CircleBracketsExpression,
            BooleanLiteral, NullLiteral,
            Identifier, NumberLiteral,
            StringLiteral
        ], "expected expression operand");
    }

    private static parseBinary(
        cursor: Cursor,
        left: Operand
    ): BinaryOperator | undefined {
        cursor.skipSpaces();

        if ( !BinaryOperator.entryOperator(cursor) ) {
            return;
        }

        const operator = BinaryOperator.parseOperator(cursor);
        cursor.skipSpaces();

        const binary = Expression.createBinaryOperator(
            cursor,
            left,
            operator,
            Expression.parseOperand(cursor)
        );

        const nextBinary = Expression.parseBinary(cursor, binary);
        if ( nextBinary ) {
            return nextBinary;
        }

        return binary;
    }

    private static createBinaryOperator(
        cursor: Cursor,
        left: Operand,
        operator: BinaryOperatorType,
        right: Operand
    ) {
        if (
            left.is(BinaryOperator) &&
            left.lessPrecedence(operator)
        ) {
            return cursor.create(BinaryOperator, left.row.left, {
                left: left.row.left,
                operator: left.row.operator,
                right: cursor.create(BinaryOperator, left.row.right, {
                    left: left.row.right,
                    operator,
                    right
                })
            });
        }

        return cursor.create(BinaryOperator, left, {
            left,
            operator,
            right
        });
    }

    template(): Operand {
        return this.row.operand;
    }
}