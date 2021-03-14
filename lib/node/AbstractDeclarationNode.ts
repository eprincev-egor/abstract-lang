import { AbstractNode, AnyRow } from "./AbstractNode";
import { AbstractDependencyNode } from "./AbstractDependencyNode";
import { requiredFindScope } from "./util";

export abstract class AbstractDeclarationNode<TRow extends AnyRow>
    extends AbstractNode<TRow> {

    get scope() {
        return requiredFindScope(this);
    }
    
    findDependencies(): AbstractDependencyNode<any>[] {
        return this.scope.findDependencies(this);
    }
}