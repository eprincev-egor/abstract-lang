import {
    AbstractNode,
    TemplateElement
} from "abstract-lang";
import { Operand } from "./Operand";
import { Identifier } from "./Identifier";

interface DotOperatorRow {
    operand: Operand;
    property: Identifier;
}

export class DotOperator extends AbstractNode<DotOperatorRow> {
    template(): TemplateElement[] {
        const {operand, property} = this.row;
        return [operand, ".", property];
    }
}
