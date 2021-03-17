import { AbstractScopeElement, AnyRow } from "./AbstractScopeElement";
import { AbstractDependencyNode } from "./AbstractDependencyNode";

export abstract class AbstractDeclarationNode<TRow extends AnyRow>
    extends AbstractScopeElement<TRow> {

    findDependencies(): AbstractDependencyNode<any>[] {
        const scope = this.findScope();

        const dependencies = scope.filterChildren((dependencyNode) =>
            dependencyNode.is(AbstractDependencyNode) &&
            dependencyNode.insideScope(scope) &&
            dependencyNode.isDependentOn(this)
        ) as AbstractDependencyNode<AnyRow>[];

        return dependencies;
    }
}