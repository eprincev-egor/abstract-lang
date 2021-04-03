import { AbstractNode, MinifySpaces, NodeClass, PrettySpaces } from "../node";
import { SourceCode } from "../source";
import assert from "assert";

export interface SuccessTest<TNode extends AbstractNode<any>> {
    /** input string for parsing */
    input: string;
    /** expected parsing result */
    shouldBe: {
        /** expected of node.toJSON() result */
        json: ReturnType< TNode["toJSON"] >;
        /** expected result of node.toString(PrettySpaces), by default is input */
        pretty?: string;
        /** expected result of node.toString(MinifySpaces), by default is input */
        minify?: string;
        /** callback for additional tests of the parsed node */
        parsed?: (node: TNode) => void;
    };
}

export interface ErrorTest {
    /** input string for parsing */
    input: string;
    /** expected error message on parsing */
    throws: RegExp;
}

/** parse input and strict deep equal output json */
export function assertNode<TNode extends AbstractNode<any>>(
    Node: NodeClass<TNode>,
    test: SuccessTest<TNode> | ErrorTest
): void {
    if ( "throws" in test ) {
        testError(test);
    }
    else {
        testParsing(test);
        testEntry(test);
    }

    function testError(test: ErrorTest): void {
        assert.throws(() => {
            parse(test.input);
        }, (err: Error) =>
            test.throws.test(err.message)
        );
    }

    function testParsing(test: SuccessTest<TNode>): void {
        const pretty = test.shouldBe.pretty || test.input;
        const minify = test.shouldBe.minify || test.input;

        const node = parse(test.input);
        assert.deepStrictEqual(
            node.toJSON(),
            test.shouldBe.json,
            "invalid json on input:\n" + test.input + "\n\n"
        );
        assert.strictEqual(
            node.toString(PrettySpaces),
            pretty,
            "invalid pretty on input:\n" + test.input + "\n\n"
        );
        assert.strictEqual(
            node.toString(MinifySpaces),
            minify,
            "invalid minify on input:\n" + test.input + "\n\n"
        );


        assert.deepStrictEqual(
            parse(pretty).toJSON(),
            test.shouldBe.json,
            "invalid json on pretty:\n" + pretty + "\n\n"
        );

        assert.deepStrictEqual(
            parse(minify).toJSON(),
            test.shouldBe.json,
            "invalid json on minify:\n" + minify + "\n\n"
        );

        if ( test.shouldBe.parsed ) {
            test.shouldBe.parsed(node);
        }
    }

    function testEntry(test: SuccessTest<TNode>): void {
        const pretty = test.shouldBe.pretty || test.input;
        const minify = test.shouldBe.minify || test.input;

        assert.ok(
            entry(test.input),
            "invalid entry on input:\n" + test.input + "\n\n"
        );
        assert.ok(
            entry(pretty),
            "invalid entry on pretty:\n" + pretty + "\n\n"
        );
        assert.ok(
            entry(minify),
            "invalid entry on minify:\n" + minify + "\n\n"
        );
    }

    function parse(text: string) {
        const code = new SourceCode({
            text
        });
        const node = code.cursor.parse(Node);
        return node;
    }

    function entry(text: string) {
        const code = new SourceCode({
            text
        });
        const entry = code.cursor.before(Node);
        return entry;
    }
}
