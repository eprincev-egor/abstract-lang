import { NullLiteral } from "./NullLiteral";
import { BooleanLiteral } from "./BooleanLiteral";
import { NumberLiteral } from "./NumberLiteral";
import { StringLiteral } from "./StringLiteral";
import { Identifier } from "./Identifier";
import { BinaryOperator } from "./BinaryOperator";
import { PostUnaryOperator } from "./PostUnaryOperator";
import { PreUnaryOperator } from "./PreUnaryOperator";
import { DotOperator } from "./DotOperator";
import { CircleBracketsExpression } from "./CircleBracketsExpression";

export type Operand = (
    NullLiteral |
    BooleanLiteral |
    NumberLiteral |
    StringLiteral |
    Identifier |
    BinaryOperator |
    PreUnaryOperator |
    PostUnaryOperator |
    DotOperator |
    CircleBracketsExpression
);