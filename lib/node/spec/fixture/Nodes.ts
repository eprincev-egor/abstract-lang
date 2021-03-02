/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { createClass } from "./createClass";

export const TestNode = createClass<any>();
export const SelectNode = createClass<any>();
export const ExpressionNode = createClass<any>();

/** node with empty row */
export const empty = new TestNode({row: {}});
Object.freeze(empty);

export const child = new TestNode({row: {}});
export const parent = new TestNode({row: {child}});
Object.freeze(child);
Object.freeze(empty);
/** parent with one child */
export const oneChild = {parent, child};

export const testDate = new Date();
/** node containing primitive values inside node.row */
export const primitive = new TestNode({row: {
    boolTrue: true,
    boolFalse: false,
    numb: 1,
    str: "hello",
    date: testDate,
    arr: [{hello: "world"}],
    obj: {hello: [{str: "world"}]}
}});
Object.freeze(primitive);


const array1: any[] = [];
const array2: any[] = [array1];
array1[0] = array2;
const a: any = {array2};
const b: any = {a, arr: [a]};
const c: any = {a, b, arr: [a, b]};
a.c = c;
a.b = b;
b.c = c;
/** node containing an object with infinite references inside node.row */
export const infinityRecursion = new TestNode({row: {
    c
}});
Object.freeze(infinityRecursion);