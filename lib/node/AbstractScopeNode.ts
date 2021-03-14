import { AbstractNode, AnyRow } from "./AbstractNode";
import { Scope } from "./Scope";
import { tryFindScope } from "./util";

export abstract class AbstractScopeNode<TRow extends AnyRow>
    extends AbstractNode<TRow> {

    scope!: Scope;
    get parentScope() {
        return tryFindScope(this);
    }
    protected abstract createScope(): Scope;

    protected assignChildrenParent() {
        this.scope = this.createScope();
        super.assignChildrenParent();
    }

    setParent(parent: AbstractNode<AnyRow>) {
        super.setParent(parent);
        this.scope = this.createScope();
    }
}