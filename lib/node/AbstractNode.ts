/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Cursor } from "../cursor";
import { stringifyNode, Spaces, TemplateElement } from "./stringifyNode";


export interface NodeClass<TNode extends AbstractNode<AnyRow>> {
    entry(cursor: Cursor): boolean;
    parse(cursor: Cursor): TNode["row"];
    new(params: NodeParams<TNode["row"]>): TNode;
}

export interface AnyRow {
    [key: string]: any;
}

export interface NodePosition {
    start: number;
    end: number;
}

export interface NodeParams<TRow extends AnyRow> {
    parent?: AbstractNode<AnyRow>;
    row: TRow;
    position?: {
        start: number;
        end: number;
    };
}

export type JsonRow<TRow extends AnyRow> = {
    [key in keyof TRow]: JsonValue< TRow[key] >;
};
export type JsonValue<T extends any> = (
    T extends AbstractNode<any> ?
        ReturnType<T["toJSON"]> :
        T
);

export abstract class AbstractNode<TRow extends AnyRow> {

    /** reference to parent node */
    parent?: AbstractNode<AnyRow>;
    /** object with node attributes */
    readonly row: Readonly<TRow>;
    /** if node has been parsed, then we a have position within source code */
    readonly position?: NodePosition;

    constructor(params: NodeParams<TRow>) {
        this.row = params.row;
        this.position = params.position;
        setParent(this, Object.values(this.row));
    }

    clone(changes: Partial<TRow> = {}): this {
        const Node = this.constructor;
        const clone = Object.create(Node.prototype) as this;

        (clone as any).row = deepClone({
            ...this.row,
            ...changes
        });

        setParent(clone, Object.values(clone.row));

        const position = this.position;
        if ( position ) {
            (clone as any).position = {
                start: position.start,
                end: position.end
            };
        }

        return clone;
    }

    findParentInstance<T extends AbstractNode<AnyRow>>(
        Node: (new(... args: any[]) => T)
    ): T | undefined {
        let parent = this.parent;
        while ( parent ) {
            if ( parent instanceof Node ) {
                return parent;
            }

            parent = parent.parent;
        }
    }

    filterChildrenByInstance<T extends AbstractNode<AnyRow>>(
        Node: (new(... args: any[]) => T)
    ): T[] {
        const children: T[] = [];
        for (const value of Object.values(this.row)) {
            if ( value instanceof Node ) {
                const child = value;
                children.push(child);
            }

            if ( value instanceof AbstractNode ) {
                const node = value;
                const subChildren = node.filterChildrenByInstance(Node);
                children.push(...subChildren);
            }
        }

        return children;
    }


    abstract template(): TemplateElement | TemplateElement[];

    toString(spaces?: Spaces): string {
        return stringifyNode(this, spaces);
    }

    toJSON(): JsonRow<TRow> {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return toJSON(this.row);
    }
}

function setParent(
    parent: AbstractNode<AnyRow>,
    children: any[],
    stack: any[] = []
) {
    for (const child of children) {
        if ( stack.includes(child) ) {
            continue;
        }
        stack.push(child);

        if ( child instanceof AbstractNode ) {
            child.parent = parent;
        }
        else if ( Array.isArray(child) ) {
            const unknownArray = child;
            setParent(parent, unknownArray, stack);
        }
        else if ( child && typeof child === "object" ) {
            setParent(parent, Object.values(child), stack);
        }
    }
}

function deepClone<T>(
    value: T,
    stack: WeakMap<any, any> = new WeakMap()
): T {
    if ( isPrimitive(value) ) {
        return value;
    }

    if ( value instanceof Date ) {
        return new Date( +value ) as unknown as T;
    }

    const existentClone = stack.get(value);
    if ( existentClone ) {
        return existentClone as unknown as T;
    }

    if ( value instanceof AbstractNode ) {
        return value.clone();
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

function toJSON(value: any, stack: any[] = []): any {
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

    if ( value instanceof AbstractNode ) {
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

function isPrimitive(value: any): boolean {
    return (
        typeof value === "number" ||
        typeof value === "string" ||
        typeof value === "function" ||
        value == undefined
    );
}
