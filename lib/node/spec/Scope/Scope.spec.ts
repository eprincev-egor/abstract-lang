import assert from "assert";
import {
    TestScopeNode,
    TestDeclarationNode,
    TestDependencyNode
} from "./fixture";
import { Scope } from "../../Scope";

describe("Scope", () => {

    let scopeNode!: TestScopeNode;
    let scope!: Scope;
    let scopeParentNode!: TestScopeNode;
    let scopeParent!: Scope;
    let scopeChildNode!: TestScopeNode;
    let scopeChild!: Scope;
    beforeEach(() => {
        scopeNode = new TestScopeNode(() => ({
            row: {}
        }));
        scope = new Scope(scopeNode);

        scopeParentNode = new TestScopeNode(() => ({
            row: {}
        }));
        scopeParent = new Scope(scopeParentNode);

        scopeChildNode = new TestScopeNode(() => ({
            row: {},
            parent: scopeParentNode
        }));
        scopeChild = new Scope(scopeChildNode, scopeParent);
    });


    it("new scope", () => {
        assert.deepStrictEqual(
            scope.declarations,
            []
        );
    });

    it("scope.parent", () => {
        assert.strictEqual(scopeChild.parent, scopeParent);
    });

    describe("findDeclaration(dependencyNode)", () => {

        it("declaration not found", () => {
            const dependency = new TestDependencyNode(() => ({row: {
                use: "unknown"
            }}));

            assert.strictEqual(
                scope.findDeclaration(dependency),
                undefined
            );
        });

        it("inside current scope with two declarations", () => {
            const declaration1 = new TestDeclarationNode(() => ({row: {
                declare: "1"
            }}));
            const declaration2 = new TestDeclarationNode(() => ({row: {
                declare: "2"
            }}));

            const dependency1 = new TestDependencyNode(() => ({row: {
                use: "1"
            }}));
            const dependency2 = new TestDependencyNode(() => ({row: {
                use: "2"
            }}));

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
            const declaration = new TestDeclarationNode(() => ({row: {
                declare: "1"
            }}));
            scopeParent.declare(declaration);

            const dependency = new TestDependencyNode(() => ({row: {
                use: "1"
            }}));

            assert.strictEqual(
                scopeChild.findDeclaration(dependency),
                declaration
            );
        });

    });

    describe("findDependencies(declarationNode)", () => {

        it("no dependencies", () => {
            const declaration = new TestDeclarationNode(() => ({row: {
                declare: "1"
            }}));
            scope.declare(declaration);

            const result = scope.findDependencies(declaration);
            assert.deepStrictEqual(result, []);
        });

        it("dependencies inside current scope", () => {
            const declaration1 = new TestDeclarationNode(() => ({row: {
                declare: "1"
            }}));
            const declaration2 = new TestDeclarationNode(() => ({row: {
                declare: "2"
            }}));
            const dependency1 = new TestDependencyNode(() => ({row: {
                use: "1"
            }}));
            const dependency2 = new TestDependencyNode(() => ({row: {
                use: "2"
            }}));

            scopeNode = new TestScopeNode(() => ({
                row: {
                    declaration1,
                    declaration2,
                    dependency1,
                    dependency2
                }
            }));
            scope = new Scope(scopeNode);
            scope.declare(declaration1);
            scope.declare(declaration2);

            const result1 = scope.findDependencies(declaration1);
            assert.strictEqual(result1.length, 1);
            assert.strictEqual(result1[0], dependency1);

            const result2 = scope.findDependencies(declaration2);
            assert.strictEqual(result2.length, 1);
            assert.strictEqual(result2[0], dependency2);
        });

        it("dependencies inside child scope", () => {
            const declaration = new TestDeclarationNode(() => ({row: {
                declare: "1"
            }}));
            const dependency = new TestDependencyNode(() => ({row: {
                use: "1"
            }}));

            scopeChildNode = new TestScopeNode(() => ({
                row: {dependency}
            }));
            scopeParentNode = new TestScopeNode(() => ({
                row: {declaration, child: scopeChildNode}
            }));
            scopeParent = new Scope(scopeParentNode);

            scopeChild = new Scope(scopeChildNode, scopeParent);


            scopeParent.declare(declaration);
            const result = scopeParent.findDependencies(declaration);
            assert.strictEqual(result.length, 1);
            assert.strictEqual(result[0], dependency);
        });

    });

});