import { Cursor } from "../token";

type TemplateElement = string;

export abstract class AbstractSyntax {

    static parse(cursor: Cursor): AbstractSyntax {
        throw new Error("not implemented");
    }

    protected constructor() {}

    protected abstract template(): TemplateElement | TemplateElement[];
}