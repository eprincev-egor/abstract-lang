import { Cursor } from "../cursor";
import { AbstractNode, MinifySpaces, NodeClass, PrettySpaces } from "../node";
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
    if ( "error" in test ) {
        testError(test);
    }
    else {
        testParsing(test);
    }

    function testError(test: ErrorTest): void {
        assert.throws(() => {
            parse(test.input);
        }, (err: Error) =>
            test.error.test(err.message)
        );
    }

    function testParsing(test: SuccessTest<TNode>): void {

        const node = parse(test.input);
        assert.deepStrictEqual(
            node.toJSON(),
            test.json,
            "invalid json on input:\n" + test.input + "\n\n"
        );
        assert.strictEqual(
            node.toString(PrettySpaces),
            test.pretty,
            "invalid pretty on input:\n" + test.input + "\n\n"
        );
        assert.strictEqual(
            node.toString(MinifySpaces),
            test.minify,
            "invalid minify on input:\n" + test.input + "\n\n"
        );


        assert.deepStrictEqual(
            parse(test.pretty).toJSON(),
            test.json,
            "invalid json on pretty:\n" + test.pretty + "\n\n"
        );

        assert.deepStrictEqual(
            parse(test.minify).toJSON(),
            test.json,
            "invalid json on minify:\n" + test.minify + "\n\n"
        );

    }

    function parse(code: string) {
        const tokens = Tokenizer.tokenize(defaultMap, code);
        const cursor = new Cursor(tokens);
        const node = cursor.parse(Node);
        return node;
    }
}
