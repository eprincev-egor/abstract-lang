import { AbstractDeclarationNode } from "./AbstractDeclarationNode";
import { AbstractNode, AnyRow } from "./AbstractNode";
import { requiredFindScope } from "./util";

export abstract class AbstractDependencyNode<TRow extends AnyRow>
    extends AbstractNode<TRow> {

    abstract isDependentOn(
        declarationNode: AbstractDeclarationNode<AnyRow>
    ): boolean;

    get scope() {
        return requiredFindScope(this);
    }

    findDeclaration(): AbstractDeclarationNode<AnyRow> | undefined {
        return this.scope.findDeclaration(this);
    }
}