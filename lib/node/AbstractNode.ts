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