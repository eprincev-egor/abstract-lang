import { AbstractNode } from "../../../AbstractNode";

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function createClass<T>() {
    return class TestNode extends AbstractNode<T> {
        // istanbul ignore next
        // eslint-disable-next-line class-methods-use-this
        template() {
            return [];
        }
    };
}