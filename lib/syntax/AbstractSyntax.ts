import { Cursor } from "../cursor";

type TemplateElement = string;

export abstract class AbstractSyntax {

    static parse(cursor: Cursor): AbstractSyntax {
        throw new Error("not implemented");
    }

    protected abstract template(): TemplateElement | TemplateElement[];
}