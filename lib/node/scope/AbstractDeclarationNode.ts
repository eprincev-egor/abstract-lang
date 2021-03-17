import { AbstractScopeElement, AnyRow } from "./AbstractScopeElement";
import { AbstractDependencyNode } from "./AbstractDependencyNode";

export abstract class AbstractDeclarationNode<TRow extends AnyRow>
    extends AbstractScopeElement<TRow> {

    findDependencies(): AbstractDependencyNode<any>[] {
        return this.findScope().findDependencies(this);
    }
}