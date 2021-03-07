import {
    SelectNode, ExpressionNode
} from "./fixture";
import assert from "assert";

describe("AbstractNode.is.spec.ts", () => {

    describe("node.is()", () => {

        it("check instance", () => {
            const select = new SelectNode({row: {}});
            const expression = new ExpressionNode({row: {}});

            assert.ok( select.is(SelectNode), "select is Select" );
            assert.ok( !select.is(ExpressionNode), "select is not Expression" );

            assert.ok( expression.is(ExpressionNode), "expression is Expression" );
            assert.ok( !expression.is(SelectNode), "expression is not Select" );
        });

    });

});
