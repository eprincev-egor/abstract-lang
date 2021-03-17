import { AbstractDeclarationNode } from "./AbstractDeclarationNode";
import { AbstractDependencyNode } from "./AbstractDependencyNode";
import { AbstractNode, AnyRow } from "./AbstractNode";

export abstract class AbstractScopeNode<TRow extends AnyRow>
    extends AbstractNode<TRow> {

    protected abstract hasClojure(parentScope: AbstractScopeNode<AnyRow>): boolean;

    findDeclaration(
        dependencyNode: AbstractDependencyNode<AnyRow>
    ): AbstractDeclarationNode<AnyRow> | undefined {
        const declarations = this.filterChildren(declarationNode =>
            declarationNode.is(AbstractDeclarationNode) &&
            dependencyNode.isDependentOn(declarationNode)
        ) as AbstractDeclarationNode<AnyRow>[];

        const thisDeclaration = declarations[0];
        if ( thisDeclaration ) {
            return thisDeclaration;
        }

        const parentScope = this.findParentInstance(AbstractScopeNode);
        if ( parentScope && this.hasClojure(parentScope) ) {
            return parentScope.findDeclaration(dependencyNode);
        }
    }

    findDependencies(
        declarationNode: AbstractDeclarationNode<AnyRow>
    ): AbstractDependencyNode<AnyRow>[] {
        const dependencies = this.filterChildren((dependencyNode) =>
            dependencyNode.is(AbstractDependencyNode) &&
            this.insideScope(dependencyNode) &&
            dependencyNode.isDependentOn(declarationNode)
        ) as AbstractDependencyNode<AnyRow>[];

        return dependencies;
    }

    private insideScope(
        dependencyNode: AbstractDependencyNode<AnyRow>
    ): boolean {
        const childScope = dependencyNode.findScope();
        return childScope === this || childScope.hasClojure(this);
    }
}
