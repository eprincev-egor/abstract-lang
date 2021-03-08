import { AbstractNode, AnyRow } from "./AbstractNode";

export type DeclarationNode = AbstractNode<AnyRow>;
export interface DependencyNode {
    isDependentOn(
        declarationNode: AbstractNode<AnyRow>
    ): boolean;
}
export interface ScopeNode extends AbstractNode<AnyRow> {
    scope: Scope;
}

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
            isDependency(childNode) &&
            childNode.isDependentOn(declarationNode)
        ) as unknown as DependencyNode[];

        return dependencies;
    }
}

function isDependency(node: unknown): node is DependencyNode {
    return (
        typeof node === "object" &&
        node !== null &&
        "isDependentOn" in node &&
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        typeof (node as any).isDependentOn === "function"
    );
}
