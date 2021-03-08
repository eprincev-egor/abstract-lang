import { AbstractNode, AnyRow } from "./AbstractNode";

export type DeclarationNode = AbstractNode<AnyRow>;
export interface DependencyNode {
    isDependentOn(
        declarationNode: AbstractNode<AnyRow>
    ): boolean;
}

export class Scope {

    readonly parent?: Scope;
    readonly declarations: DeclarationNode[];

    constructor(parent?: Scope) {
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
}