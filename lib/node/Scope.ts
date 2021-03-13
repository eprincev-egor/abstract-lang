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
    readonly declarations: DeclarationNode[];

    constructor(node: ScopeNode, parent?: Scope) {
        this.node = node;
        this.parent = parent;
        this.declarations = [];
    }

    declare(declarationNode: DeclarationNode): void {
        this.declarations.push(declarationNode);
    }

    findDeclaration(dependencyNode: DependencyNode): DeclarationNode | undefined {
        const thisDeclaration = this.declarations.find((declaration) =>
            dependencyNode.isDependentOn(declaration)
        );

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
        ) as unknown as DependencyNode[];

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
