/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Cursor } from "../cursor";
import {
    stringifyNode, Spaces, TemplateElement,
    toJSON,
    deepClone,
    forEachChildNode,
    deepEqual,
    findChildren
} from "./util";


export interface NodeClass<TNode extends AbstractNode<AnyRow>> {
    entry(cursor: Cursor): boolean;
    parse(cursor: Cursor): TNode["row"];
    new(params: NodeParams<TNode["row"]>): TNode;
}

export type NodeAbstractConstructor = typeof AbstractNode;
export type NodeConcreteConstructor<T> = (new(...args: any[]) => T);
export type NodeConstructor<T> = (
    NodeAbstractConstructor |
    NodeConcreteConstructor<T>
);

export interface AnyRow {
    [key: string]: any;
}

export interface NodePosition {
    start: number;
    end: number;
}

export interface NodeParams<TRow extends AnyRow> {
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
        this.assignChildrenParent();
    }

    /** returns true if this is instance of Node */
    is<T extends AbstractNode<AnyRow>>(
        Node: NodeConstructor<T>
    ): this is T {
        return this instanceof Node;
    }

    get children(): AbstractNode<AnyRow>[] {
        const values = Object.values(this.row);
        return findChildren(values);
    }

    /** assign parent node */
    setParent(parent: AbstractNode<AnyRow>): void {
        this.parent = parent;
    }

    /** deep equal this.row and node.row */
    equal(node: this): boolean {
        return deepEqual(this.row, node.row);
    }

    // eslint-disable-next-line no-trailing-spaces
    /** returns a new node with applied changes:  
     * clone.row = {...node.row, ...changes} */
    clone(
        changes: Partial<TRow> = {},
        stack: WeakMap<any, any> = new WeakMap()
    ): this {
        const Node = this.constructor;
        const clone = Object.create(Node.prototype) as this;
        stack.set(this, clone);

        (clone as any).row = deepClone({
            ...this.row,
            ...changes
        }, stack);
        clone.assignChildrenParent();

        const position = this.position;
        if ( position && Object.values(changes).length === 0 ) {
            (clone as any).position = {
                start: position.start,
                end: position.end
            };
        }

        return clone;
    }

    /** returns a clone of this node with deeply replaced nodes */
    replace(
        replace: <T extends AbstractNode<AnyRow>>(node: T) => T | void,
        stack: WeakMap<any, any> = new WeakMap()
    ): this {
        const Node = this.constructor;
        const clone = Object.create(Node.prototype) as this;
        stack.set(this, clone);

        (clone as any).row = deepClone(this.row, stack, replace);
        clone.assignChildrenParent();

        return clone;
    }

    findParentInstance<T extends AbstractNode<AnyRow>>(
        Node: NodeConstructor<T>
    ): T | undefined {
        let parent = this.parent;
        while ( parent ) {
            if ( parent instanceof Node ) {
                return parent as T;
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
        Node: NodeConstructor<T>
    ): T[] {
        return this.filterChildren((node) =>
            node instanceof Node
        ) as T[];
    }

    filterChildren(
        iteration: (node: AbstractNode<AnyRow>) => boolean
    ): Array<AbstractNode<AnyRow>> {

        const children: Array<AbstractNode<AnyRow>> = [];

        forEachChildNode(this.row, (node) => {
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

    /** convert node to plain json structure */
    toJSON(): NodeJson<TRow> {
        return toJSON(this.row) as unknown as NodeJson<TRow>;
    }

    private assignChildrenParent() {
        for (const childNode of this.children) {
            childNode.setParent(this);
        }
    }
}
