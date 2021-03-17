import { AbstractScopeElement, AnyRow } from "./AbstractScopeElement";

export abstract class AbstractScopeNode<TRow extends AnyRow>
    extends AbstractScopeElement<TRow> {

    /** returns true, if parent scope node has clojure with this node */
    abstract hasClojure(
        parentScope: AbstractScopeNode<AnyRow>
    ): boolean;

    /** find parent scope node with clojure */
    findParentScope(): AbstractScopeNode<AnyRow> | undefined {
        const parentScope = this.findScope();
        if ( parentScope && this.hasClojure(parentScope) ) {
            return parentScope;
        }
    }
}
