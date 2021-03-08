/* eslint-disable class-methods-use-this */
import assert from "assert";
import { Scope } from "../Scope";
import { AbstractNode } from "../AbstractNode";

describe("Scope", () => {

    class TestDeclaration extends AbstractNode<{
        declare: string;
    }> {
        // istanbul ignore next
        template() {
            return [];
        }
    }
    class TestDependency extends AbstractNode<{
        use: string;
    }> {
        isDependentOn(declarationNode: TestDeclaration) {
            return declarationNode.row.declare === this.row.use;
        }

        // istanbul ignore next
        template() {
            return [];
        }
    }


    it("new scope", () => {
        const scope = new Scope();
        assert.deepStrictEqual(
            scope.declarations,
            []
        );
    });

    it("scope.parent", () => {
        const scopeParent = new Scope();
        const scopeChild = new Scope(scopeParent);
        assert.strictEqual(scopeChild.parent, scopeParent);
    });

    describe("findDeclaration(dependencyNode)", () => {

        it("declaration not found", () => {
            const scope = new Scope();
            const dependency = new TestDependency({row: {
                use: "unknown"
            }});

            assert.strictEqual(
                scope.findDeclaration(dependency),
                undefined
            );
        });

        it("inside current scope with two declarations", () => {
            const declaration1 = new TestDeclaration({row: {
                declare: "1"
            }});
            const declaration2 = new TestDeclaration({row: {
                declare: "2"
            }});

            const dependency1 = new TestDependency({row: {
                use: "1"
            }});
            const dependency2 = new TestDependency({row: {
                use: "2"
            }});

            const scope = new Scope();
            scope.declare(declaration1);
            scope.declare(declaration2);

            assert.strictEqual(
                scope.findDeclaration(dependency1),
                declaration1,
                "dependency1"
            );
            assert.strictEqual(
                scope.findDeclaration(dependency2),
                declaration2,
                "dependency2"
            );
        });

        it("inside parent scope", () => {
            const scopeParent = new Scope();
            const scopeChild = new Scope(scopeParent);

            const declaration = new TestDeclaration({row: {
                declare: "1"
            }});
            scopeParent.declare(declaration);

            const dependency = new TestDependency({row: {
                use: "1"
            }});

            assert.strictEqual(
                scopeChild.findDeclaration(dependency),
                declaration
            );
        });

    });

});