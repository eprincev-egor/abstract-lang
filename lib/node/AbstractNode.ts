import { Cursor } from "../cursor";

type TemplateElement = string;

export interface NodeClass<T extends AbstractNode> {
    entry(cursor: Cursor): boolean;
    parse(cursor: Cursor): T;
}

export abstract class AbstractNode {
    protected abstract template(): TemplateElement | TemplateElement[];
}