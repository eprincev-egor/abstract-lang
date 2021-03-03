/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { isPrimitive } from "./isPrimitive";

export function deepClone<T>(
    value: T,
    stack: WeakMap<any, any> = new WeakMap()
): T {
    if ( isPrimitive(value) ) {
        return value;
    }

    if ( value instanceof Date ) {
        return new Date( +value ) as unknown as T;
    }

    if ( value instanceof RegExp ) {
        return new RegExp(value.source, value.flags) as unknown as T;
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const existentClone = stack.get(value);
    if ( existentClone ) {
        return existentClone as unknown as T;
    }

    if ( hasMethodClone(value) ) {
        return value.clone() as unknown as T;
    }

    if ( Array.isArray(value) ) {
        const originalArray = value;
        const arrayClone: any[] = [];
        stack.set(originalArray, arrayClone);

        for (const item of originalArray) {
            const itemClone = deepClone(item, stack) as unknown;
            arrayClone.push(itemClone);
        }

        return arrayClone as unknown as T;
    }

    const originalObject = value;
    const objectClone: {[key: string]: any} = {};
    stack.set(originalObject, objectClone);

    for (const key in originalObject) {
        objectClone[ key ] = deepClone( originalObject[ key ], stack );
    }

    return objectClone as unknown as T;
}

function hasMethodClone(value: any): value is {clone(): any} {
    return (
        !!value &&
        "clone" in value &&
        typeof value.clone === "function"
    );
}