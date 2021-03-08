import { AbstractNode, AnyRow } from "../AbstractNode";
import { findChildren } from "./findChildren";

export function setParent(node: AbstractNode<AnyRow>): void {
    const values = Object.values(node);

    for (const child of findChildren(values)) {
        child.parent = node;
    }
}