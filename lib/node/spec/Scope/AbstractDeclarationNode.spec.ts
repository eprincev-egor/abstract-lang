import assert from "assert";
import {
    TestDeclarationNode,
    TestScopeNode
} from "./fixture";

describe("AbstractDeclarationNode", () => {

    describe("findDependencies()", () => {

        it("required scope for declaration", () => {
            const declaration = new TestDeclarationNode({row: {}});

            assert.throws(() => {
                declaration.findDependencies();
            }, (err: Error) =>
                /required scope for node: TestDeclarationNode/.test(err.message)
            );
        });

        it("no dependencies", () => {
            const declaration = new TestDeclarationNode({row: {}});
            new TestScopeNode({row: {
                declaration
            }});

            assert.deepStrictEqual(
                declaration.findDependencies(),
                []
            );
        });

    });

});