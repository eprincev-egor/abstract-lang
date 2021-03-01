import { AbstractNode, AnyRow } from "../AbstractNode";

export interface Spaces {
    _: string;
    tab: string;
    eol: string;
}
export const PrettySpaces: Spaces = {
    _: " ",
    tab: "    ",
    eol: "\n"
};
export const MinifySpaces: Spaces = {
    _: "",
    tab: "",
    eol: ""
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


export function stringifyNode(
    node: AbstractNode<AnyRow>,
    spaces: Spaces = PrettySpaces
): string {
    let output = "";

    const lines = templateLines(node);
    for (let i = 0, n = lines.length; i < n; i++) {
        if ( i > 0 ) {
            output += spaces.eol;
        }

        const line = stringifyLine(spaces, lines[i]);
        if ( line.trim() !== "" ) {
            output += line;
        }
    }

    return output;
}

function templateLines(node: AbstractNode<AnyRow>) {
    const elements = templateAsArray(node);
    const lines: PrimitiveTemplateElement[][] = [];

    for (const line of split(elements, eol)) {
        const subLines = extrudeSubLines(line);
        lines.push(...subLines);
    }

    return lines;
}

// node.templateLines() is private method
// eslint-disable-next-line class-methods-use-this
function extrudeSubLines(parentLine: TemplateElement[]) {
    const outputLines: PrimitiveTemplateElement[][] = [];
    let lastLine: PrimitiveTemplateElement[] = [];

    for (const element of parentLine) {
        if ( element instanceof AbstractNode ) {
            const node = element;
            const subLines = templateLines(node);

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

function templateAsArray(node: AbstractNode<AnyRow>) {
    const template = node.template();
    if ( Array.isArray(template) ) {
        return template;
    }
    return [template];
}

function stringifyLine(
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
