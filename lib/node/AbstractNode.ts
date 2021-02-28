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
    row: TRow;
    position?: {
        start: number;
        end: number;
    };
}

export abstract class AbstractNode<TRow extends AnyRow> {

    /** object with node attributes */
    readonly row: Readonly<TRow>;
    /** if node has been parsed, then we a have position within source code */
    readonly position?: NodePosition;

    constructor(params: NodeParams<TRow>) {
        this.row = params.row;
        this.position = params.position;
    }

    abstract template(): TemplateElement | TemplateElement[];

    toString(spaces?: Spaces): string {
        return stringifyNode(this, spaces);
    }
}
