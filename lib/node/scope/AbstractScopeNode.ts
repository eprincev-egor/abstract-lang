import { AbstractScopeElement, AnyRow } from "./AbstractScopeElement";
import { AbstractDeclarationNode } from "./AbstractDeclarationNode";
import { AbstractDependencyNode } from "./AbstractDependencyNode";

export abstract class AbstractScopeNode<TRow extends AnyRow>
    extends AbstractScopeElement<TRow> {

    /** returns true, if parent scope node has clojure with this node */
    abstract hasClojure(
        parentScope: AbstractScopeNode<AnyRow>
    ): boolean;

    /** find parent scope node with clojure */
    findParentScope(): AbstractScopeNode<AnyRow> | undefined {
        const parentScope = this.findScope();
        if ( parentScope && this.hasClojure(parentScope) ) {
            return parentScope;
        }
    }

    /** find declaration node for dependency */
    findDeclaration(
        dependency: AbstractDependencyNode<AnyRow>,
        scope: AbstractScopeNode<AnyRow> = this
    ): AbstractDeclarationNode<AnyRow> | undefined {
        const thisDeclaration = scope.getDeclarations().find((declarationNode) =>
            dependency.isDependentOn(declarationNode)
        );

        if ( thisDeclaration ) {
            return thisDeclaration;
        }

        const parentScope = scope.findParentScope();
        if ( parentScope ) {
            return this.findDeclaration(dependency, parentScope);
        }
    }

    /** returns declarations from current scope, can be redefined for optimize */
    getDeclarations(): AbstractDeclarationNode<AnyRow>[] {
        const declarations = this.filterChildren((declarationNode) =>
            declarationNode.is(AbstractDeclarationNode)
        ) as AbstractDeclarationNode<AnyRow>[];

        return declarations;
    }
}
