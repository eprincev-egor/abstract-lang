import {
    AbstractNode,
    TemplateElement,
    stringifyNode,
    PrettySpaces,
    MinifySpaces
} from "../../../../index";
import assert from "assert";

export interface TestToStringKeyword {
    template: TemplateElement[];
    expectedPretty: string;
    expectedMinify: string;
}

export function testStringifyKeywordNode(
    test: TestToStringKeyword
): void {
    const node = Object.create(AbstractNode.prototype) as AbstractNode<any>;
    node.template = () => test.template;

    const actualPretty = stringifyNode(node, PrettySpaces);
    assert.strictEqual(
        actualPretty,
        test.expectedPretty,
        "pretty"
    );

    const actualMinify = stringifyNode(node, MinifySpaces);
    assert.strictEqual(
        actualMinify,
        test.expectedMinify,
        "minify"
    );
}
