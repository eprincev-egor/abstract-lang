import { AbstractNode, AnyRow } from "./AbstractNode";

export class Scope {

    readonly parent?: Scope;
    readonly declarations: AbstractNode<AnyRow>[];

    constructor(parent?: Scope) {
        this.parent = parent;
        this.declarations = [];
    }

    declare(declarationNode: AbstractNode<AnyRow>): void {
        this.declarations.push(declarationNode);
    }

    findDeclaration(
        dependencyNode: AbstractNode<AnyRow> & {
            isDependentOn(
                declarationNode: AbstractNode<AnyRow>
            ): boolean;
        }
    ): AbstractNode<AnyRow> {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return this.declarations.find((declaration) =>
            dependencyNode.isDependentOn(declaration)
        )!;
    }
}