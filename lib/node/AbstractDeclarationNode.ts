import { AbstractNode, AnyRow } from "./AbstractNode";
import { DependencyNode } from "./Scope";
import { shouldHaveScope } from "./util";

export abstract class AbstractDeclarationNode<TRow extends AnyRow>
    extends AbstractNode<TRow> {

    findDependencies(): DependencyNode[] {
        shouldHaveScope(this);
        return this.scope.findDependencies(this);
    }

    protected initScope() {
        super.initScope();
        if ( this.scope ) {
            this.scope.declare(this);
        }
    }
}