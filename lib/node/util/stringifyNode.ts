import { AbstractNode, AnyRow } from "../AbstractNode";
import { split } from "../../util";

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
/** end of line, pretty: "\n"  minify: "" */
export const eol = {eol: true};
/** horizontal indent, pretty: "    " minify: "" */
export const tab = {tab: true};
/** not required space, pretty: " "  minify: "" */
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
    if ( element === tab ) {
        return spaces.tab;
    }
    else if ( element === _ ) {
        return spaces._;
    }
    else {
        return element as string;
    }
}
