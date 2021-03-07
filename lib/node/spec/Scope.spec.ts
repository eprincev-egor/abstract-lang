/* eslint-disable class-methods-use-this */
import assert from "assert";
import { TestNode } from "./AbstractNode/fixture";
import { Scope } from "../Scope";
import { AbstractNode } from "../AbstractNode";

describe("Scope", () => {

    it("new scope", () => {
        const scope = new Scope();
        assert.deepStrictEqual(
            scope.declarations,
            []
        );
    });

    it("declare(declarationNode) one node", () => {
        const node = new TestNode({row: {}});
        const scope = new Scope();

        scope.declare(node);
        assert.strictEqual(scope.declarations.length, 1);
        assert.strictEqual(scope.declarations[0], node);
    });

    it("scope.parent", () => {
        const scopeParent = new Scope();
        const scopeChild = new Scope(scopeParent);
        assert.strictEqual(scopeChild.parent, scopeParent);
    });

    describe("findDeclaration(dependencyNode)", () => {

        class DependencyNode extends AbstractNode<any> {
            isDependentOn(
                declarationNode: AbstractNode<any>
            ) {
                return declarationNode.row.declare === this.row.use;
            }

            // istanbul ignore next
            template() {
                return [];
            }
        }

        it("inside current scope with only one declaration", () => {
            const declarationNode = new TestNode({row: {declare: "1"}});
            const dependencyNode = new DependencyNode({row: {use: "1"}});

            const scope = new Scope();
            scope.declare(declarationNode);

            const result = scope.findDeclaration(dependencyNode);
            assert.strictEqual(result, declarationNode);
        });

        it("inside current scope with two declarations", () => {
            const declaration1 = new TestNode({row: {
                declare: "1"
            }});
            const declaration2 = new TestNode({row: {
                declare: "2"
            }});

            const dependency1 = new DependencyNode({row: {
                use: "1"
            }});
            const dependency2 = new DependencyNode({row: {
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
    });

});