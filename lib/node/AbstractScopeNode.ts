import { AbstractNode, AnyRow } from "./AbstractNode";
import { Scope } from "./Scope";

export abstract class AbstractScopeNode<TRow extends AnyRow>
    extends AbstractNode<TRow> {

    scope!: Scope;
    protected abstract createScope(): Scope;

    protected initScope() {
        this.scope = this.createScope();
    }
}