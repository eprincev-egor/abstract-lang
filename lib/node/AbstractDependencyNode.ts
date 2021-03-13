import { AbstractNode, AnyRow } from "./AbstractNode";
import { shouldHaveScope } from "./util";

export abstract class AbstractDependencyNode<TRow extends AnyRow>
    extends AbstractNode<TRow> {

    abstract isDependentOn(
        declarationNode: AbstractNode<AnyRow>
    ): boolean;

    findDeclaration(): AbstractNode<AnyRow> | undefined {
        shouldHaveScope(this);
        return this.scope.findDeclaration(this);
    }
}