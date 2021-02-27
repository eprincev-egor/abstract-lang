import { Cursor } from "../cursor";

type TemplateElement = string;

export interface NodeClass<TNode extends AbstractNode<AnyRow>> {
    entry(cursor: Cursor): boolean;
    parse(cursor: Cursor): TNode["row"];
    new(row: TNode["row"]): TNode;
}

export interface AnyRow {
    [key: string]: any;
}

export abstract class AbstractNode<Row extends AnyRow> {

    readonly row: Readonly<Row>;
    constructor(row: Row) {
        this.row = row;
    }

    abstract template(): TemplateElement | TemplateElement[];
}