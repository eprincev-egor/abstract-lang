import { Token } from "../token";
import { Cursor } from "../cursor";
import { Fragment } from "./Fragment";

export interface Source {
    path?: string;
    readonly tokens: Token[];
    readonly cursor: Cursor;
    getCoords(charPosition: number): Coords;
    getFragment(fromLine: number, toLine: number): Fragment;
}

export interface Coords {
    line: number;
    column: number;
}