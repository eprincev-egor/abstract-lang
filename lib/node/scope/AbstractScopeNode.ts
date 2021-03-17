import { AbstractNode, AnyRow } from "../AbstractNode";

export abstract class AbstractScopeNode<TRow extends AnyRow>
    extends AbstractNode<TRow> {

    abstract hasClojure(
        parentScope: AbstractScopeNode<AnyRow>
    ): boolean;
}
