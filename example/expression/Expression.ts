import { AbstractNode, Cursor, SpaceToken } from "abstract-lang";
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
        return (
            cursor.before(Identifier) ||
            cursor.before(NumberLiteral) ||
            cursor.before(StringLiteral) ||
            cursor.before(PreUnaryOperator) ||
            cursor.before(CircleBracketsExpression)
        );
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
        cursor.skipAll(SpaceToken);

        operand = Expression.parseDotOperators(cursor, operand);

        if ( PostUnaryOperator.entryOperator(cursor) ) {
            const postOperator = PostUnaryOperator.parseOperator(cursor);
            const postUnary = new PostUnaryOperator({
                row: {
                    postOperator,
                    operand
                }
            });
            operand = postUnary;

            cursor.skipAll(SpaceToken);
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
        cursor.skipAll(SpaceToken);
        const property = cursor.parse(Identifier);

        const dotOperator = new DotOperator({
            row: {
                operand,
                property
            }
        });
        operand = dotOperator;

        operand = Expression.parseDotOperators(cursor, operand);
        return operand;
    }

    private static parseSimpleOperand(cursor: Cursor): Operand {
        if ( cursor.before(CircleBracketsExpression) ) {
            return cursor.parse(CircleBracketsExpression);
        }
        else if ( cursor.before(BooleanLiteral) ) {
            return cursor.parse(BooleanLiteral);
        }
        else if ( cursor.before(NullLiteral) ) {
            return cursor.parse(NullLiteral);
        }
        else if ( cursor.before(Identifier) ) {
            return cursor.parse(Identifier);
        }
        else if ( cursor.before(StringLiteral) ) {
            return cursor.parse(StringLiteral);
        }
        else {
            return cursor.parse(NumberLiteral);
        }
    }

    private static parseBinary(
        cursor: Cursor,
        left: Operand
    ): BinaryOperator | undefined {
        cursor.skipAll(SpaceToken);

        if ( !BinaryOperator.entryOperator(cursor) ) {
            return;
        }

        const operator = BinaryOperator.parseOperator(cursor);
        cursor.skipAll(SpaceToken);

        const binary = Expression.createBinaryOperator(
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
        left: Operand,
        operator: BinaryOperatorType,
        right: Operand
    ) {
        if (
            left.is(BinaryOperator) &&
            left.lessPrecedence(operator)
        ) {
            return new BinaryOperator({
                row: {
                    left: left.row.left,
                    operator: left.row.operator,
                    right: new BinaryOperator({
                        row: {
                            left: left.row.right,
                            operator,
                            right
                        }
                    })
                }
            });
        }

        return new BinaryOperator({
            row: {
                left,
                operator,
                right
            }
        });
    }

    template(): Operand {
        return this.row.operand;
    }
}