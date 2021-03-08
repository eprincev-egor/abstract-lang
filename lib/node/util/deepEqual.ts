/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { AbstractNode } from "../AbstractNode";
import { isPrimitive } from "./isPrimitive";

export function deepEqual(
    a: unknown,
    b: unknown,
    stack: WeakMap<any, any> = new WeakMap()
): boolean {

    if ( Number.isNaN(a) && Number.isNaN(b) ) {
        return true;
    }

    if ( isPrimitive(a) || isPrimitive(b) ) {
        return a === b;
    }

    if ( a instanceof Date && b instanceof Date ) {
        return +a === +b;
    }

    const stackResults = stack.get(a);
    if ( stackResults ) {
        if ( stackResults.get(b) ) {
            return true;
        }
        stackResults.set(b, true);
    }
    else {
        stack.set(a, new WeakMap());
    }


    if ( a instanceof AbstractNode && b instanceof AbstractNode ) {
        return deepEqualObject(a.row, b.row, stack);
    }

    if ( Array.isArray(a) && Array.isArray(b) ) {
        return deepEqualArray(a, b, stack);
    }

    return deepEqualObject(a as any, b as any, stack);
}

function deepEqualArray(a: any[], b: any[], stack: WeakMap<any, any>) {
    if ( a.length !== b.length ) {
        return false;
    }

    for (let i = 0, n = a.length; i < n; i++) {
        const aItem = a[ i ];
        const bItem = b[ i ];

        if ( !deepEqual( aItem, bItem, stack ) ) {
            return false;
        }
    }

    return true;
}

interface anyObject {
    [key: string]: any;
}
function deepEqualObject(a: anyObject, b: anyObject, stack: WeakMap<any, any>) {
    for (const key in a) {
        const myValue = a[ key ];
        const himValue = b[ key ];

        if ( !deepEqual( myValue, himValue, stack ) ) {
            return false;
        }
    }

    // check additional keys from b
    for (const key in b) {
        if ( key in a ) {
            continue;
        }

        // exists unknown property for a
        return false;
    }

    return true;
}