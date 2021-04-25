import { AbstractNode, AnyRow } from "../../AbstractNode";
import { SchemaDescription } from "../NodeBuilder";

export interface SchemaElement extends AbstractNode<AnyRow> {
    validate(
        schema: string,
        description: SchemaDescription<AnyRow>
    ): void;
    toEntry(description: SchemaDescription<AnyRow>): string;
    toParse(description: SchemaDescription<AnyRow>): string;
    toTemplate(description: SchemaDescription<AnyRow>): string;
}