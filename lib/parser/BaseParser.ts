import { SourceCode } from "source";
import { AbstractNode, AnyRow, NodeClass } from "../node";
import { defaultTokenFactory, TokenFactory } from "../token";
import { assertNode } from "./assertNode";

export class BaseParser {
    static assertNode = assertNode;

    static parseCode<TNode extends AbstractNode<AnyRow>>(
        text: string,
        Node: NodeClass<TNode>
    ): TNode {
        const code = new SourceCode({
            text
        });
        const node = code.cursor.parse(Node) as unknown;
        return node as TNode;
    }

    // static parseFile<TNode extends AbstractNode<any>>(
    //     filePath: string,
    //     Node: NodeClass<TNode>
    // ): TNode {}

    protected comments: AbstractNode<AnyRow>[] = [];
    protected tokenFactory: TokenFactory = defaultTokenFactory;
}