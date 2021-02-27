import { Cursor } from "../cursor";

type TemplateElement = string;

export interface NodeClass<TNode extends AbstractNode<AnyRow>> {
    entry(cursor: Cursor): boolean;
    parse(cursor: Cursor): TNode["row"];
    new(params: NodeParams<TNode["row"]>): TNode;
}

export interface AnyRow {
    [key: string]: any;
}

export interface NodeParams<TRow extends AnyRow> {
    row: TRow;
    position: {
        start: number;
        end: number;
    };
}

export abstract class AbstractNode<TRow extends AnyRow> {

    readonly row: Readonly<TRow>;
    readonly start: number;
    readonly end: number;
    constructor(params: NodeParams<TRow>) {
        this.row = params.row;
        this.start = params.position.start;
        this.end = params.position.end;
    }

    abstract template(): TemplateElement | TemplateElement[];
}