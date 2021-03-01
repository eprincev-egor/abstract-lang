import { Cursor } from "../cursor";
import { AbstractNode, NodeClass } from "../node";
import { defaultMap, Tokenizer } from "../token";
import assert from "assert";

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
    if ( !("json" in test) ) return;

    const tokens = Tokenizer.tokenize(defaultMap, test.input);
    const cursor = new Cursor(tokens);
    const node = cursor.parse(Node);

    assert.deepStrictEqual(
        node.toJSON(),
        test.json,
        "invalid json on input:\n" + test.input + "\n\n"
    );

    assert.strictEqual(
        node.toString(),
        test.pretty,
        "invalid pretty on input:\n" + test.input + "\n\n"
    );
}