/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable max-classes-per-file */
import { AbstractNode } from "../../AbstractNode";
import { Scope } from "../../Scope";

// istanbul ignore next
const emptyTemplate = () => [];

export class TestScopeNode extends AbstractNode<any> {
        scope!: Scope;
        template = emptyTemplate;
}

export class TestDeclarationNode extends AbstractNode<{
    declare: string;
}> {
    template = emptyTemplate;
}

export class TestDependencyNode extends AbstractNode<{
    use: string;
}> {
    isDependentOn(declarationNode: TestDeclarationNode) {
        return declarationNode.row.declare === this.row.use;
    }

    template = emptyTemplate;
}