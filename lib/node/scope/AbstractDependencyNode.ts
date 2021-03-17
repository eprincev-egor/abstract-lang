import { AbstractScopeElement, AnyRow } from "./AbstractScopeElement";
import { AbstractDeclarationNode } from "./AbstractDeclarationNode";

export abstract class AbstractDependencyNode<TRow extends AnyRow>
    extends AbstractScopeElement<TRow> {

    abstract isDependentOn(
        declarationNode: AbstractDeclarationNode<AnyRow>
    ): boolean;

    findDeclaration(): AbstractDeclarationNode<AnyRow> | undefined {
        return this.findScope().findDeclaration(this);
    }
}