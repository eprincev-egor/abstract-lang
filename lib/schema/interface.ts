import { AnyRow, TemplateElement } from "../node";
import { Cursor } from "../cursor";

export interface Schema<TRow extends AnyRow> {
    entry: (cursor: Cursor) => boolean;
    parse: (cursor: Cursor) => TRow;
    template: (row: TRow) => TemplateElement[];
}

export type SchemaDescription<TRow extends AnyRow> = {
    [key in keyof TRow]: TRow[key] extends number ?
        typeof Number :
        TRow[key];
}
