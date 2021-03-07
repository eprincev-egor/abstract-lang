import { AbstractNode } from "node/AbstractNode";

export interface HumanRow {
    name: string;
    child?: HumanNode;
}
export class HumanNode extends AbstractNode<HumanRow> {
    // istanbul ignore next
    template(): string {
        return this.row.name;
    }
}

const bob = new HumanNode({row: {
    name: "bob"
}});
const jack = new HumanNode({row: {
    name: "jack",
    child: bob
}});
const jane = new HumanNode({row: {
    name: "jane",
    child: jack
}});
const oliver = new HumanNode({row: {
    name: "oliver",
    child: jane
}});

Object.freeze(bob);
Object.freeze(jack);
Object.freeze(jane);
Object.freeze(oliver);

export const humans = Object.freeze({
    root: oliver,
    leaf: bob,

    bob,
    jack,
    jane,
    oliver
});