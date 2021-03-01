/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable unicorn/filename-case */
import { isPrimitive } from "./isPrimitive";

export function toJSON(value: any, stack: any[] = []): any {
    if ( isPrimitive(value) ) {
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

    const jsonObject: any = {};
    for (const key in value) {
        const jsonValue = toJSON( value[ key ], stack );
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