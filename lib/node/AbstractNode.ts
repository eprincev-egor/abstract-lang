import { Cursor } from "../cursor";


export interface NodeClass<TNode extends AbstractNode<AnyRow>> {
    entry(cursor: Cursor): boolean;
    parse(cursor: Cursor): TNode["row"];
    new(params: NodeParams<TNode["row"]>): TNode;
}

export interface AnyRow {
    [key: string]: any;
}


export interface Spaces {
    _: string;
    tab: string;
    eol: string;
}
const DefaultTemplateOptions: Spaces = {
    _: " ",
    tab: "    ",
    eol: "\n"
};
/** end of line, default "\n" */
export const eol = {eol: true};
/** horizontal indent, default "    " */
export const tab = {tab: true};
/** not required space, default " " */
export const _ = {_: true};

export type PrimitiveTemplateElement = (
    string |
    typeof eol |
    typeof tab |
    typeof _
);
export type TemplateElement = (
    PrimitiveTemplateElement |
    AbstractNode<AnyRow>
);

export interface NodeParams<TRow extends AnyRow> {
    row: TRow;
    position: {
        start: number;
        end: number;
    };
}

export abstract class AbstractNode<TRow extends AnyRow> {

    readonly row: Readonly<TRow>;
    readonly start: number;
    readonly end: number;
    constructor(params: NodeParams<TRow>) {
        this.row = params.row;
        this.start = params.position.start;
        this.end = params.position.end;
    }

    abstract template(): TemplateElement | TemplateElement[];

    toString(spaces: Spaces = DefaultTemplateOptions): string {
        let output = "";

        const lines = this.templateLines();
        for (let i = 0, n = lines.length; i < n; i++) {
            if ( i > 0 ) {
                output += spaces.eol;
            }

            const line = stringify(spaces, lines[i]);
            if ( line.trim() !== "" ) {
                output += line;
            }
        }

        return output;
    }

    private templateLines() {
        const elements = this.templateAsArr();
        const lines: PrimitiveTemplateElement[][] = [];

        for (const line of split(elements, eol)) {
            const subLines = this.extrudeSubLines(line);
            lines.push(...subLines);
        }

        return lines;
    }

    // node.templateLines() is private method
    // eslint-disable-next-line class-methods-use-this
    private extrudeSubLines(parentLine: TemplateElement[]) {
        const outputLines: PrimitiveTemplateElement[][] = [];
        let lastLine: PrimitiveTemplateElement[] = [];

        for (const element of parentLine) {
            if ( element instanceof AbstractNode ) {
                const node = element;
                const subLines = node.templateLines();

                if ( subLines.length === 1 ) {
                    const subLine = subLines[0];
                    lastLine.push( ...subLine );
                }
                else if ( subLines.length > 2 ) {
                    const upIndentLines = subLines.map((subLine) =>
                        [tab, ...subLine]
                    );

                    outputLines.push(
                        ...upIndentLines.slice(0, -1)
                    );
                    lastLine = upIndentLines.slice(-1)[0];
                }
            }
            else {
                lastLine.push(element);
            }
        }

        outputLines.push(lastLine);
        return outputLines;
    }

    private templateAsArr() {
        const template = this.template();
        if ( Array.isArray(template) ) {
            return template;
        }
        return [template];
    }
}

function stringify(
    spaces: Spaces,
    line: PrimitiveTemplateElement[]
) {
    const output = line.map((element) =>
        stringifyElement(spaces, element)
    );
    return output.join("");
}

function stringifyElement(
    spaces: Spaces,
    element: PrimitiveTemplateElement
): string {
    if ( element === eol ) {
        return spaces.eol;
    }
    else if ( element === tab ) {
        return spaces.tab;
    }
    else if ( element === _ ) {
        return spaces._;
    }
    else {
        return element as string;
    }
}

function split<T>(array: readonly T[], delimiter: T): T[][] {
    const matrix: T[][] = [];

    let line: T[] = [];
    for (const item of array) {
        if ( item === delimiter ) {
            matrix.push(line);
            line = [];
        }
        else {
            line.push(item);
        }
    }

    if ( array.length > 0 ) {
        matrix.push(line);
    }

    return matrix;
}
