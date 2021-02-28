import { AbstractNode, NodeClass } from "node";

export interface SuccessTest<TNode extends AbstractNode<any>> {
    input: string;
    json: ReturnType< TNode["toJSON"] >;
    pretty: string;
    minify: string;
}

export interface ErrorTest {
    input: string;
    error: RegExp;
}

export function assertNode<TNode extends AbstractNode<any>>(
    Node: NodeClass<TNode>,
    test: SuccessTest<TNode> | ErrorTest
): void {
    return;
}