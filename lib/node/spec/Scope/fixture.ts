/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable max-classes-per-file */
import { AbstractDeclarationNode } from "node/AbstractDeclarationNode";
import { AbstractDependencyNode } from "node/AbstractDependencyNode";
import { AbstractScopeNode } from "node/AbstractScopeNode";
import { Scope } from "../../Scope";

// istanbul ignore next
const emptyTemplate = () => [];

export class TestScopeNode extends AbstractScopeNode<any> {
    template = emptyTemplate;
    createScope() {
        return new Scope(this);
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