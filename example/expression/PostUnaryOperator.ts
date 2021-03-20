import {
    AbstractNode,
    Cursor,
    TemplateElement
} from "abstract-lang";
import { Operand } from "./Operand";

const POST_UNARY_OPERATORS = ["--", "++"] as const;
type PostUnaryOperatorType = (typeof POST_UNARY_OPERATORS)[number];
interface PostUnaryOperatorRow {
    postOperator: PostUnaryOperatorType;
    operand: Operand;
}

export class PostUnaryOperator extends AbstractNode<PostUnaryOperatorRow> {

    static entryOperator(cursor: Cursor): boolean {
        const token = cursor.nextToken;
        let entry = false;

        if ( cursor.beforeValue("+") ) {
            cursor.next();
            if ( cursor.beforeValue("+") ) {
                entry = true;
            }
        }
        else if ( cursor.beforeValue("-") ) {
            cursor.next();
            if ( cursor.beforeValue("-") ) {
                entry = true;
            }
        }

        cursor.setPositionBefore(token);
        return entry;
    }

    static parseOperator(cursor: Cursor): PostUnaryOperatorType {
        if ( cursor.beforeValue("+") ) {
            cursor.readValue("+");
            cursor.readValue("+");
            return "++";
        }

        cursor.readValue("-");
        cursor.readValue("-");
        return "--";
    }

    template(): TemplateElement[] {
        const {postOperator, operand} = this.row;
        return [operand, postOperator];
    }
}