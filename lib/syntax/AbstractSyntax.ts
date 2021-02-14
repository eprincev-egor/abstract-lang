import { Cursor } from "../cursor";

type TemplateElement = string;

export type SyntaxClassWithEntry<T extends AbstractSyntax> = SyntaxClass<T> & {
    entry: (cursor: Cursor) => boolean;
}

export interface SyntaxClass<T extends AbstractSyntax> {
    parse(cursor: Cursor): T;
}

export abstract class AbstractSyntax {

    static parse(cursor: Cursor): AbstractSyntax {
        throw new Error("not implemented");
    }

    protected abstract template(): TemplateElement | TemplateElement[];
}