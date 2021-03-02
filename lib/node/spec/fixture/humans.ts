import { TestNode } from "./Nodes";

const bob = new TestNode({row: {
    name: "bob"
}});
const jack = new TestNode({row: {
    name: "jack",
    child: bob
}});
const jane = new TestNode({row: {
    name: "jane",
    child: jack
}});
const oliver = new TestNode({row: {
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