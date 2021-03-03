/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable unicorn/filename-case */
import { isPrimitive } from "./isPrimitive";

export function toJSON(value: any, stack: any[] = []): any {
    if ( isPrimitive(value) ) {
        if ( Number.isNaN(value) ) {
            // eslint-disable-next-line unicorn/no-null
            return null;
        }
        return value;
    }

    if ( value instanceof Date ) {
        return value.toISOString();
    }

    if ( stack.includes(value) ) {
        throw new Error("Cannot converting circular structure to JSON");
    }
    stack.push(value);

    if ( hasMethodToJson(value) ) {
        return value.toJSON();
    }

    if ( Array.isArray(value) ) {
        return value.map((item) =>
            toJSON(item, stack)
        );
    }

    const originalObject = value;
    const jsonObject: any = {};
    for (const key in originalObject) {
        const originalValue = originalObject[ key ];
        if ( typeof originalValue === "function" ) {
            continue;
        }
        if ( originalValue === undefined ) {
            continue;
        }
        if ( originalValue instanceof RegExp ) {
            continue;
        }

        const jsonValue = toJSON( originalValue, stack );
        jsonObject[ key ] = jsonValue;
    }

    return jsonObject;
}

function hasMethodToJson(value: any): value is {toJSON(): any} {
    return (
        value != undefined &&
        typeof value === "object" &&
        "toJSON" in value &&
        typeof value.toJSON === "function"
    );
}