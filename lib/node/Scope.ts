import { AnyRow } from "./AbstractNode";
import { AbstractScopeNode } from "./AbstractScopeNode";
import { AbstractDeclarationNode } from "./AbstractDeclarationNode";
import { AbstractDependencyNode } from "./AbstractDependencyNode";

export type ScopeNode = AbstractScopeNode<AnyRow>;
export type DeclarationNode = AbstractDeclarationNode<AnyRow>;
export type DependencyNode = AbstractDependencyNode<AnyRow>;
export class Scope {

    readonly node: ScopeNode;
    readonly parent?: Scope;

    constructor(node: ScopeNode, parent?: Scope) {
        this.node = node;
        this.parent = parent;
    }

    findDeclaration(dependencyNode: DependencyNode): DeclarationNode | undefined {
        const declarations = this.node.filterChildren(childNode =>
            childNode instanceof AbstractDeclarationNode &&
            dependencyNode.isDependentOn(childNode)
        ) as DeclarationNode[];

        const thisDeclaration = declarations[0];
        if ( thisDeclaration ) {
            return thisDeclaration;
        }

        if ( this.parent ) {
            return this.parent.findDeclaration(dependencyNode);
        }
    }

    findDependencies(declarationNode: DeclarationNode): DependencyNode[] {
        const dependencies = this.node.filterChildren((childNode) =>
            childNode instanceof AbstractDependencyNode &&
            (
                childNode.scope === this ||
                !!childNode.scope &&
                childNode.scope.hasParent(this)
            ) &&
            childNode.isDependentOn(declarationNode)
        ) as DependencyNode[];

        return dependencies;
    }

    hasParent(parentScope: Scope): boolean {
        let parent = this.parent;
        while ( parent ) {
            if ( parent === parentScope ) {
                return true;
            }
            parent = parent.parent;
        }

        return false;
    }
}
