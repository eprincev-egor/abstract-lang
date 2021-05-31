import { AbstractNode, AnyRow, MinifySpaces, NodeClass, PrettySpaces } from "../node";
import { SyntaxError } from "../source";
import { AbstractLang, ConcreteLang } from "./AbstractLang";
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
    /** expected error.target, token.value or node.toString() */
    target?: string | RegExp;
}

/** parse input and strict deep equal output json */
export function assertNode<TNode extends AbstractNode<any>, TLang extends AbstractLang>(
    this: ConcreteLang<TLang>,
    Node: NodeClass<TNode>,
    test: SuccessTest<TNode> | ErrorTest
): void {
    if ( "throws" in test ) {
        testError.call(this, Node, test);
    }
    else {
        testParsing.call(this, Node as NodeClass<any>, test);
        testEntry.call(this, Node, test);
    }
}

function testError(
    this: ConcreteLang,
    Node: NodeClass<any>,
    test: ErrorTest
): void {
    let actualError: Error = new Error("Missing expected exception");
    try {
        this.code(test.input).parse(Node);
    }
    catch (error) {
        actualError = error as Error;
    }

    assert.ok(
        test.throws.test(actualError.message),
        "invalid error message on input:\n" +
        test.input + "\n\n" +
        "expected error: " + test.throws.toString() + "\n" +
        "actual error:\n" +
        actualError.message
    );

    assert.ok(
        actualError instanceof SyntaxError,
        "invalid error instance on input:\n" +
        test.input + "\n\n" +
        "error should be SyntaxError instance"
    );

    if ( typeof test.target === "string" ) {
        assert.strictEqual(
            actualError.target.toString(),
            test.target,
            "invalid error target on input:\n" +
            test.input + "\n\n" +
            actualError.message
        );
    }
    if ( test.target instanceof RegExp ) {
        assert.ok(
            test.target.test(
                actualError.target.toString()
            ) ,
            "invalid error target on input:\n" +
            test.input + "\n\n" +
            actualError.message
        );
    }
}

function testParsing(
    this: ConcreteLang,
    Node: NodeClass<AbstractNode<any>>,
    test: SuccessTest<any>
): void {
    const pretty = test.shouldBe.pretty || test.input;
    const minify = test.shouldBe.minify || test.input;

    const node = this.code(test.input).parse(Node);
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
        this.code(pretty).parse(Node).toJSON(),
        test.shouldBe.json,
        "invalid json on pretty:\n" + pretty + "\n\n"
    );

    assert.deepStrictEqual(
        this.code(minify).parse(Node).toJSON(),
        test.shouldBe.json,
        "invalid json on minify:\n" + minify + "\n\n"
    );

    if ( test.shouldBe.parsed ) {
        test.shouldBe.parsed(node);
    }

    testEveryNodeHavePosition(test.input, node);
}

function testEveryNodeHavePosition(input: string, node: AbstractNode<AnyRow>) {
    assert.ok(
        !!node.position,
        "required node position for every child\n" +
        "on input:\n" + input + "\n\n" +
        "invalid node: " + JSON.stringify(node, undefined, 4)
    );

    for (const child of node.children) {
        testEveryNodeHavePosition(input, child);
    }
}

function testEntry(
    this: ConcreteLang,
    Node: NodeClass<any>,
    test: SuccessTest<any>
): void {
    const pretty = test.shouldBe.pretty || test.input;
    const minify = test.shouldBe.minify || test.input;

    assert.ok(
        this.code(test.input).cursor.before(Node),
        "invalid entry on input:\n" + test.input + "\n\n"
    );
    assert.ok(
        this.code(pretty).cursor.before(Node),
        "invalid entry on pretty:\n" + pretty + "\n\n"
    );
    assert.ok(
        this.code(minify).cursor.before(Node),
        "invalid entry on minify:\n" + minify + "\n\n"
    );
}
