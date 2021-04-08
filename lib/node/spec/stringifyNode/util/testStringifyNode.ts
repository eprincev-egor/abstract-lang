import {
    AbstractNode,
    stringifyNode,
    PrettySpaces, Spaces
} from "../../../../index";
import assert from "assert";

export interface TestToString {
    template: () =>
        ReturnType<AbstractNode<any>["template"]>;
    expectedString: string;
}

export function testStringifyNode(
    test: TestToString,
    spaces: Spaces = PrettySpaces
): void {
    const node = Object.create(AbstractNode.prototype) as AbstractNode<any>;
    node.template = test.template;

    const actualString = stringifyNode(node, spaces);
    assert.strictEqual(
        actualString,
        test.expectedString
    );
}
