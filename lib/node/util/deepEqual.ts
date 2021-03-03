/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { AbstractNode } from "node/AbstractNode";
import { isPrimitive } from "./isPrimitive";

export function deepEqual(
    a: unknown,
    b: unknown,
    stack: WeakMap<any, any> = new WeakMap()
): boolean {

    if ( a instanceof AbstractNode && b instanceof AbstractNode ) {
        return deepEqual(a.row, b.row);
    }

    if ( Number.isNaN(a) && Number.isNaN(b) ) {
        return true;
    }

    if ( isPrimitive(a) || isPrimitive(b) ) {
        return a === b;
    }

    if ( a instanceof Date && b instanceof Date ) {
        return +a === +b;
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

    const stackValue = stack.get(a);
    if ( stackValue ) {
        return stackValue === b;
    }
    stack.set(a, b);

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
    const stackValue = stack.get(a);
    if ( stackValue ) {
        return stackValue === b;
    }
    stack.set(a, b);

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