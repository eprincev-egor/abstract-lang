import assert from "assert";
import {
    TestDependencyNode,
    TestScopeNode
} from "./fixture";

describe("AbstractDependencyNode", () => {

    describe("findDeclaration()", () => {

        it("required scope for dependency", () => {
            const dependency = new TestDependencyNode(() => ({row: {}}));

            assert.throws(() => {
                dependency.findDeclaration();
            }, (err: Error) =>
                /required scope for node: TestDependency/.test(err.message)
            );
        });

        it("no declaration", () => {
            const dependency = new TestDependencyNode(() => ({row: {}}));
            new TestScopeNode(() => ({row: {
                dependency
            }}));

            assert.strictEqual(
                dependency.findDeclaration(),
                undefined
            );
        });

    });

});