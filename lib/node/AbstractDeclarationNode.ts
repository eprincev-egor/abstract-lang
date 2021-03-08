import { AbstractNode, AnyRow } from "./AbstractNode";
import { DependencyNode, Scope } from "./Scope";
import { findScope } from "./util";

export abstract class AbstractDeclarationNode<TRow extends AnyRow>
    extends AbstractNode<TRow> {

    findDependencies(): DependencyNode[] {
        return this.scope.findDependencies(this);
    }

    get scope(): Scope {
        return findScope(this);
    }
}