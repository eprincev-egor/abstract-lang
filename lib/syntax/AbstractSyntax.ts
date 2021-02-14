import { Cursor } from "../cursor";

type TemplateElement = string;

export type SyntaxClassWithEntry<T extends AbstractSyntax> = SyntaxClass<T> & {
    entry: (cursor: Cursor) => boolean;
}

export interface SyntaxClass<T extends AbstractSyntax> {
    entry: (cursor: Cursor) => boolean;
    parse(cursor: Cursor): T;
}

export abstract class AbstractSyntax {
    protected abstract template(): TemplateElement | TemplateElement[];
}