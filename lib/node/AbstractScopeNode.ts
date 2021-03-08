import { AbstractNode, AnyRow, NodeParams } from "./AbstractNode";
import { Scope } from "./Scope";
import { findScope } from "./util";

export abstract class AbstractScopeNode<TRow extends AnyRow>
    extends AbstractNode<TRow> {

    readonly scope: Scope;
    protected abstract createScope(): Scope;

    constructor(params: NodeParams<TRow>) {
        super(params);
        this.scope = this.createScope();
    }

    get parentScope(): Scope | undefined {
        try {
            return findScope(this);
        }
        catch {
            return;
        }
    }
}