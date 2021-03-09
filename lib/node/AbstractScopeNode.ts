import { AbstractNode, AnyRow, NodeConstructorArg } from "./AbstractNode";
import { Scope } from "./Scope";
import { findScope } from "./util";

export abstract class AbstractScopeNode<TRow extends AnyRow>
    extends AbstractNode<TRow> {

    readonly scope: Scope;
    protected abstract createScope(): Scope;

    constructor(arg: NodeConstructorArg<TRow>) {
        super(arg);
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