import { Source, SourceCode, SourceFile } from "../source";
import { AbstractNode, AnyRow, NodeClass } from "../node";
import { defaultTokenFactory, TokenFactory, Tokenizer } from "../token";
import { assertNode } from "./assertNode";
import { Cursor } from "../cursor";
import fs from "fs";

export type ConcreteLang<TLang extends AbstractLang = AbstractLang> = (
    (new(source: Source, Comments: NodeClass<any>[]) => TLang) &
    Pick<typeof AbstractLang, keyof typeof AbstractLang>
);

export abstract class AbstractLang {
    static Comments: NodeClass<any>[] = [];
    static tokenFactory: TokenFactory = defaultTokenFactory;

    static assertNode = assertNode;

    /** create parser */
    static code<TLang extends AbstractLang>(
        this: ConcreteLang<TLang>,
        text: string
    ): TLang {
        const tokens = Tokenizer.tokenize(this.tokenFactory, text);
        const code = new SourceCode(tokens);
        const parser = new this(code, this.Comments);
        return parser;
    }

    /** read file and create parser */
    static file<TLang extends AbstractLang>(
        this: ConcreteLang<TLang>,
        file: string | {path: string; content: string}
    ): TLang {
        let filePath!: string;
        let fileContent!: string;
        if ( typeof file === "string" ) {
            filePath = file;
            fileContent = fs.readFileSync(filePath).toString();
        }
        else {
            fileContent = file.content;
            filePath = file.path;
        }

        const tokens = Tokenizer.tokenize(this.tokenFactory, fileContent);
        const sourceFile = new SourceFile(filePath, tokens);
        const parser = new this(sourceFile, this.Comments);
        return parser;
    }

    readonly source: Source;
    readonly cursor: Cursor;
    constructor(source: Source, Comments: NodeClass<any>[]) {
        this.source = source;
        this.cursor = new Cursor(source, Comments);
    }

    parse<TNode extends AbstractNode<AnyRow>>(
        Node: NodeClass<TNode>
    ): TNode {
        const node = this.cursor.parse(Node);
        return node;
    }
}