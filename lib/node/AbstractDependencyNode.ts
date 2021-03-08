import { AbstractNode, AnyRow } from "./AbstractNode";
import { Scope } from "./Scope";
import { findScope } from "./util";

export abstract class AbstractDependencyNode<TRow extends AnyRow>
    extends AbstractNode<TRow> {

    abstract isDependentOn(
        declarationNode: AbstractNode<AnyRow>
    ): boolean;

    findDeclaration(): AbstractNode<AnyRow> | undefined {
        return this.scope.findDeclaration(this);
    }

    get scope(): Scope {
        return findScope(this);
    }
}