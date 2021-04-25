import { AbstractNode, AnyRow } from "../AbstractNode";
import { split, last } from "../../util";

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
    const elements = nodeToElements(node);
    return stringify(elements, inputSpaces);
}

export function stringify(
    elements: TemplateElement[],
    inputSpaces: Partial<Spaces> = PrettySpaces
): string {
    const spaces: Spaces = {...PrettySpaces, ...inputSpaces};
    let output = "";

    const lines = elementsToLines(elements);
    const plainElements = linesToPlainElements(lines);

    for (let i = 0, n = plainElements.length; i < n; i++) {
        const element = plainElements[i];
        output += stringifyPlainElement(spaces, plainElements, element, i);
    }

    return output;
}

function linesToPlainElements(lines: PrimitiveTemplateElement[][]) {
    const plainElements: PrimitiveTemplateElement[] = [];

    for (const line of lines) {
        if ( plainElements.length > 0 ) {
            plainElements.push(eol);
        }

        if ( isEmptyLine(line) ) {
            plainElements.push("");
        }
        else {
            plainElements.push(...line);
        }
    }

    return plainElements;
}

function isEmptyLine(line: PrimitiveTemplateElement[]): boolean {
    return line.every((element) =>
        element === _ ||
        element === tab
    );
}

function nodeToLines(node: AbstractNode<AnyRow>) {
    const elements = nodeToElements(node);
    const lines = elementsToLines(elements);
    return lines;
}

function elementsToLines(elements: TemplateElement[]) {
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
            const subLines = nodeToLines(node);

            if ( subLines.length === 1 ) {
                const subLine = subLines[0];
                lastLine.push( ...subLine );
            }
            else if ( subLines.length > 1 ) {
                const prefix = lastLine.filter((item) =>
                    item === tab
                );
                outputLines.push([...lastLine, ...subLines[0]]);

                for (let i = 1, n = subLines.length; i < n - 1; i++) {
                    const subLine = subLines[i];
                    outputLines.push([...prefix, ...subLine]);
                }

                lastLine = [...prefix, ...last(subLines)];
            }
        }
        else {
            lastLine.push(element);
        }
    }

    outputLines.push(lastLine);
    return outputLines;
}

function nodeToElements(node: AbstractNode<AnyRow>) {
    const template = node.template();
    if ( Array.isArray(template) ) {
        return template;
    }
    return [template];
}

function stringifyPlainElement(
    spaces: Spaces,
    elements: PrimitiveTemplateElement[],
    element: PrimitiveTemplateElement,
    elementIndex: number
): string {
    if ( element === tab ) {
        return spaces.tab;
    }
    else if ( element === _ ) {
        return spaces._;
    }
    else if ( element === eol ) {
        return spaces.eol;
    }
    else if ( isKeyWord(element) ) {
        let output = spaces.keyword(element.keyword);

        if ( needSpaceBeforeKeyword(spaces, elements, elementIndex) ) {
            output = " " + output;
        }
        if ( needSpaceAfterKeyword(spaces, elements, elementIndex) ) {
            output += " ";
        }

        return output;
    }
    else {
        return element as string;
    }
}

function needSpaceAfterKeyword(
    spaces: Spaces,
    elements: PrimitiveTemplateElement[],
    elementIndex: number
): boolean {
    for (let i = elementIndex + 1, n = elements.length; i < n; i++) {
        const nextElement = elements[ i ];

        if ( isEmptyString(spaces, nextElement) ) {
            continue;
        }

        if ( isDangerAfterKeyWord(nextElement) ) {
            return true;
        }

        break;
    }

    return false;
}

function needSpaceBeforeKeyword(
    spaces: Spaces,
    elements: PrimitiveTemplateElement[],
    elementIndex: number
): boolean {
    for (let i = elementIndex - 1; i >= 0; i--) {
        const nextElement = elements[ i ];

        if ( isEmptyString(spaces, nextElement) ) {
            continue;
        }

        if ( isDangerBeforeKeyWord(nextElement) ) {
            return true;
        }

        break;
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

function isDangerAfterKeyWord(
    element: PrimitiveTemplateElement
): boolean {
    return (
        isKeyWord(element) ||
        isDangerBeforeKeyWord(element)
    );
}

function isDangerBeforeKeyWord(
    element: PrimitiveTemplateElement
): boolean {
    return (
        typeof element === "string" &&
        /[\w"$'`]/.test(element[0])
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