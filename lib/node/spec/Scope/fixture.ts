/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable max-classes-per-file */
import { AbstractDeclarationNode } from "../../AbstractDeclarationNode";
import { AbstractDependencyNode } from "../../AbstractDependencyNode";
import { AbstractScopeNode } from "../../AbstractScopeNode";

// istanbul ignore next
const emptyTemplate = () => [];

export class TestScopeNode extends AbstractScopeNode<any> {
    template = emptyTemplate;
    hasClojure() {
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
    isDependentOn(declarationNode: TestDeclarationNode) {
        return declarationNode.row.declare === this.row.use;
    }

    template = emptyTemplate;
}