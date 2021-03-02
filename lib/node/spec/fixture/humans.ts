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

export const humans = {
    root: oliver,
    leaf: bob,

    bob,
    jack,
    jane,
    oliver
};