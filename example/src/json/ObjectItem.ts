import { AbstractSyntax, Cursor } from "abstract-lang";
import { JsonSyntax } from "./JsonSyntax";
import { StringLiteral } from "./StringLiteral";
import { cycleDeps } from "./cycleDeps";
import { EolToken, SpaceToken } from "../../../lib/token";

export class ObjectItem extends AbstractSyntax {

    static entry(cursor: Cursor): boolean {
        return cursor.before(StringLiteral);
    }

    static parse(cursor: Cursor): ObjectItem {
        const key = cursor.parse(StringLiteral);

        cursor.skipAll(SpaceToken, EolToken);
        cursor.readValue(":");
        cursor.skipAll(SpaceToken, EolToken);

        const value = cursor.parse(cycleDeps.JsonSyntax);

        return new ObjectItem(key, value);
    }

    readonly key: StringLiteral;
    readonly value: JsonSyntax;
    constructor(key: StringLiteral, value: JsonSyntax) {
        super();
        this.key = key;
        this.value = value;
    }

    template(): string {
        return this.key.template() + ": " + this.value.template();
    }
}