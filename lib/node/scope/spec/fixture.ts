import { AbstractDeclarationNode } from "../AbstractDeclarationNode";
import { AbstractDependencyNode } from "../AbstractDependencyNode";
import { AbstractScopeNode } from "../AbstractScopeNode";

// istanbul ignore next
const emptyTemplate = (): string[] => [];

export class TestScopeNode extends AbstractScopeNode<any> {
    template = emptyTemplate;

    hasClojure(): boolean {
        return true;
    }
}

export class TestDeclarationNode extends AbstractDeclarationNode<{
    declare?: string;
}> {
    template = emptyTemplate;
}

export class TestDependencyNode extends AbstractDependencyNode<{
    use?: string;
}> {
    isDependentOn(declarationNode: TestDeclarationNode): boolean {
        return declarationNode.row.declare === this.row.use;
    }

    template = emptyTemplate;
}