/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Cursor } from "../cursor";
import {
    stringifyNode, Spaces, TemplateElement,
    setParent,
    toJSON,
    deepClone,
    forEachChildNode
} from "./util";


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

export type NodeJson<TRow extends AnyRow> = {
    [key in keyof TRow]: NodeJsonValue< TRow[key] >;
};
export type NodeJsonValue<T extends any> = (
    T extends AbstractNode<any> ?
        NodeJson<T["row"]> :
    T extends Array<any> ?
        Array< NodeJsonValue< T[0] > > :
    T extends ReadonlyArray<any> ?
        ReadonlyArray< NodeJsonValue< T[0] > > :
    T extends string ?
        string :
    T extends number ?
        string :
    T extends boolean ?
        boolean :
    T extends undefined ?
        undefined :
    T extends null ?
        null :
    T extends Date ?
        string :
    T extends AnyRow ?
        NodeJson<T> :
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

    filterParents(
        iteration: (node: AbstractNode<AnyRow>) => boolean
    ): AbstractNode<AnyRow>[] {
        const parents: Array<AbstractNode<AnyRow>> = [];
        let parent = this.parent;

        while ( parent ) {
            const result = iteration( parent );

            if ( result ) {
                parents.push( parent );
            }

            parent = parent.parent;
        }

        return parents;
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

    filterChildren(
        iteration: (node: AbstractNode<AnyRow>) => boolean
    ): Array<AbstractNode<AnyRow>> {

        const children: Array<AbstractNode<AnyRow>> = [];

        forEachChildNode(this, (node) => {
            const result = iteration( node );

            if ( result ) {
                children.push( node );
            }
        });

        return children;
    }

    abstract template(): TemplateElement | TemplateElement[];

    toString(spaces?: Spaces): string {
        return stringifyNode(this, spaces);
    }

    toJSON(): NodeJson<TRow> {
        return toJSON(this.row) as unknown as NodeJson<TRow>;
    }
}
