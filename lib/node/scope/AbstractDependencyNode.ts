import { AbstractScopeElement, AnyRow } from "./AbstractScopeElement";
import { AbstractDeclarationNode } from "./AbstractDeclarationNode";
import { AbstractScopeNode } from "./AbstractScopeNode";

export abstract class AbstractDependencyNode<TRow extends AnyRow>
    extends AbstractScopeElement<TRow> {

    abstract isDependentOn(
        declarationNode: AbstractDeclarationNode<AnyRow>
    ): boolean;

    findDeclaration(
        scope = this.findScope()
    ): AbstractDeclarationNode<AnyRow> | undefined {

        const declarations = scope.filterChildren((declarationNode) =>
            declarationNode.is(AbstractDeclarationNode) &&
            this.isDependentOn(declarationNode)
        ) as AbstractDeclarationNode<AnyRow>[];

        const thisDeclaration = declarations[0];
        if ( thisDeclaration ) {
            return thisDeclaration;
        }

        const parentScope = scope.findParentInstance(AbstractScopeNode);
        if ( parentScope && scope.hasClojure(parentScope) ) {
            return this.findDeclaration(parentScope);
        }
    }

    insideScope(parentScope: AbstractScopeNode<AnyRow>): boolean {
        const thisScope = this.findScope();
        return (
            thisScope === parentScope ||
            thisScope.hasClojure(parentScope)
        );
    }
}