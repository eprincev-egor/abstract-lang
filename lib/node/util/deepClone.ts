/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { AbstractNode, AnyRow } from "node/AbstractNode";
import { isPrimitive } from "./isPrimitive";

type Replacer = <T extends AbstractNode<AnyRow>>(node: T) => T | void;

export function deepClone<T>(
    value: T,
    stack: WeakMap<any, any>,
    replace?: Replacer
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

    if ( value instanceof AbstractNode ) {
        return deepCloneNode(value, stack, replace);
    }

    if ( Array.isArray(value) ) {
        return deepCloneArray(
            value, stack,
            replace
        ) as unknown as T;
    }

    return deepClonePojo(
        value as unknown as {[key: string]: unknown},
        stack,
        replace
    ) as unknown as T;
}

function deepCloneNode<T extends AbstractNode<any>>(
    originalNode: T,
    stack: WeakMap<any, any>,
    replace?: Replacer
): T {
    if ( replace ) {
        const replaced = replace(originalNode);

        if ( replaced === originalNode ) {
            return originalNode.clone({}, stack);
        }

        if ( replaced ) {
            return replaced;
        }

        return originalNode.replace(replace, stack);
    }

    return originalNode.clone(stack) as unknown as T;
}

function deepCloneArray<T>(
    originalArray: T[],
    stack: WeakMap<any, any>,
    replace?: Replacer
) {
    const arrayClone: T[] = [];
    stack.set(originalArray, arrayClone);

    for (const item of originalArray) {
        const itemClone = deepClone(
            item,
            stack,
            replace
        );
        arrayClone.push(itemClone);
    }

    return arrayClone;
}

function deepClonePojo<T extends {[key: string]: unknown}>(
    originalObject: T,
    stack: WeakMap<any, any>,
    replace?: Replacer
) {
    const objectClone: {[key: string]: any} = {};
    stack.set(originalObject, objectClone);

    for (const key in originalObject) {
        objectClone[ key ] = deepClone(
            originalObject[ key ],
            stack,
            replace
        );
    }

    return objectClone as unknown as T;
}