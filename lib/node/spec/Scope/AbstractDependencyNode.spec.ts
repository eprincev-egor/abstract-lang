import assert from "assert";
import {
    TestDeclarationNode,
    TestDependencyNode,
    TestScopeNode
} from "./fixture";

describe("AbstractDependencyNode", () => {

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

    describe("findDeclaration()", () => {

        it("required scope for dependency", () => {
            const dependency = new TestDependencyNode({row: {}});

            assert.throws(() => {
                dependency.findDeclaration();
            }, (err: Error) =>
                /required scope for node: TestDependency/.test(err.message)
            );
        });

        it("no declaration", () => {
            const dependency = new TestDependencyNode({row: {}});
            new TestScopeNode({row: {
                dependency
            }});

            assert.strictEqual(
                dependency.findDeclaration(),
                undefined
            );
        });

        it("declaration inside current scope", () => {
            new TestScopeNode({row: {
                dependency1,
                declaration1,
                dependency2,
                declaration2
            }});

            const result1 = dependency1.findDeclaration();
            assert.ok(result1 === declaration1, "declaration1");

            const result2 = dependency2.findDeclaration();
            assert.ok(result2 === declaration2, "declaration2");
        });

        it("declaration inside parent scope", () => {
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

            const result = dependency1.findDeclaration();
            assert.ok(result === declaration1);
        });
    });

});