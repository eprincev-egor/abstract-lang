import assert from "assert";
import {
    TestDeclarationNode,
    TestDependencyNode,
    TestScopeNode
} from "./fixture";

describe("AbstractDeclarationNode", () => {

    let declaration1!: TestDeclarationNode;
    let declaration2!: TestDeclarationNode;
    let dependency1!: TestDependencyNode;
    let dependency2!: TestDependencyNode;
    beforeEach(() => {
        declaration1 = new TestDeclarationNode({row: {
            declare: "1"
        }});
        declaration2 = new TestDeclarationNode({row: {
            declare: "2"
        }});
        dependency1 = new TestDependencyNode({row: {
            use: "1"
        }});
        dependency2 = new TestDependencyNode({row: {
            use: "2"
        }});
    });

    describe("findDependencies()", () => {

        it("required scope for declaration", () => {
            assert.throws(() => {
                declaration1.findDependencies();
            }, (err: Error) =>
                /required scope for node: TestDeclarationNode/.test(err.message)
            );
        });

        it("no dependencies", () => {
            new TestScopeNode({row: {
                declaration1
            }});

            assert.deepStrictEqual(
                declaration1.findDependencies(),
                []
            );
        });

        it("find dependencies inside current scope", () => {
            new TestScopeNode({
                row: {
                    declaration1,
                    dependency1,
                    declaration2,
                    dependency2
                }
            });

            const result1 = declaration1.findDependencies();
            assert.ok(
                result1.length === 1 &&
                result1[0] === dependency1,
                "dependency1"
            );

            const result2 = declaration2.findDependencies();
            assert.ok(
                result2.length === 1 &&
                result2[0] === dependency2,
                "dependency1"
            );
        });

        it("dependency inside child scope", () => {
            new TestScopeNode({
                row: {
                    declaration1,
                    child: new TestScopeNode({
                        row: {
                            dependency1
                        }
                    })
                }
            });

            const result = declaration1.findDependencies();
            assert.strictEqual(result.length, 1);
            assert.strictEqual(result[0], dependency1);
        });

        it("no dependencies if childNode scope has no reference to parentNode scope", () => {
            class SomeScopeNode extends TestScopeNode {
                hasClojure() {
                    return false;
                }
            }

            new SomeScopeNode({
                row: {
                    declaration1,
                    child: new SomeScopeNode({
                        row: {
                            dependency1
                        }
                    })
                }
            });

            const result = declaration1.findDependencies();
            assert.strictEqual(result.length, 0);
        });

    });

});