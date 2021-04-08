import { AbstractNode, AnyRow } from "../AbstractNode";
import { split } from "../../util";

export interface Spaces {
    _: string;
    tab: string;
    eol: string;
    keyword: (word: string) => string;
}
const defaultKeyWord: Spaces["keyword"] = (word) => word;

export const PrettySpaces: Spaces = {
    _: " ",
    tab: "    ",
    eol: "\n",
    keyword: defaultKeyWord
};
export const MinifySpaces: Spaces = {
    _: "",
    tab: "",
    eol: "",
    keyword: defaultKeyWord
};

/** end of line, pretty: "\n"  minify: "" */
export const eol = {eol: true};
/** horizontal indent, pretty: "    " minify: "" */
export const tab = {tab: true};
/** not required space, pretty: " "  minify: "" */
export const _ = {_: true};
/**
 * mark the string as a keyword,
 * to change lower/UPPER case
 * and auto-wrap whitespace
*/
export const keyword = (keyword: string): KeywordType => ({keyword});
export interface KeywordType {
    keyword: string;
}

export type TemplateElement = (
    PrimitiveTemplateElement |
    AbstractNode<AnyRow>
);
export type PrimitiveTemplateElement = (
    string |
    typeof eol |
    typeof tab |
    typeof _ |
    KeywordType
);


export function stringifyNode(
    node: AbstractNode<AnyRow>,
    inputSpaces: Partial<Spaces> = PrettySpaces
): string {
    const spaces: Spaces = {...PrettySpaces, ...inputSpaces};
    let output = "";

    const lines = templateLines(node);
    for (let i = 0, n = lines.length; i < n; i++) {
        if ( i > 0 ) {
            output += spaces.eol;
        }

        const line = lines[i];
        const string = line.map((element, j) =>
            stringifyElement(
                spaces,
                lines, i,
                element, j
            )
        ).join("");

        if ( string.trim() !== "" ) {
            output += string;
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

            if ( parentLine.length === 1 ) {
                return subLines;
            }

            if ( subLines.length === 1 ) {
                const subLine = subLines[0];
                lastLine.push( ...subLine );
            }
            else if ( subLines.length > 1 ) {
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

function stringifyElement(
    spaces: Spaces,
    lines: PrimitiveTemplateElement[][],
    lineIndex: number,
    element: PrimitiveTemplateElement,
    elementIndex: number
): string {
    if ( element === tab ) {
        return spaces.tab;
    }
    else if ( element === _ ) {
        return spaces._;
    }
    else if ( isKeyWord(element) ) {
        const keyword = spaces.keyword(element.keyword);

        if ( needSpaceAfterKeyword(spaces, lines, lineIndex, elementIndex) ) {
            return keyword + " ";
        }
        return keyword;
    }
    else {
        return element as string;
    }
}

function needSpaceAfterKeyword(
    spaces: Spaces,
    lines: PrimitiveTemplateElement[][],
    lineIndex: number,
    elementIndex: number
): boolean {
    if ( spaces.eol !== "" ) {
        const nextElement = lines[ lineIndex ][ elementIndex + 1];
        return isDangerForKeyWord(nextElement);
    }

    for (let i = lineIndex, n = lines.length; i < n; i++) {
        const line = lines[i];

        let j = i === lineIndex ? elementIndex + 1 : 0;
        for (let m = line.length; j < m; j++) {
            const nextElement = line[ j ];

            if ( isEmptyString(spaces, nextElement) ) {
                continue;
            }

            if ( isDangerForKeyWord(nextElement) ) {
                return true;
            }

            return false;
        }
    }
    return false;
}

function isEmptyString(
    spaces: Spaces,
    element: PrimitiveTemplateElement
): boolean {
    return (
        element === _ && spaces._ === "" ||
        element === tab && spaces.tab === "" ||
        element === eol && spaces.eol === "" ||
        element === ""
    );
}

function isDangerForKeyWord(
    element: PrimitiveTemplateElement
): boolean {
    return (
        isKeyWord(element) ||

        typeof element === "string" &&
        /\w/.test(element[0])
    );
}

function isKeyWord(
    element: PrimitiveTemplateElement
): element is {keyword: string} {
    return (
        typeof element === "object" &&
        element != undefined &&
        "keyword" in element
    );
}