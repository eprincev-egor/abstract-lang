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

    static code<TLang extends AbstractLang>(
        this: ConcreteLang<TLang>,
        text: string
    ): TLang {
        const tokens = Tokenizer.tokenize(this.tokenFactory, text);
        const code = new SourceCode(tokens);
        const parser = new this(code, this.Comments);
        return parser;
    }

    static file<TLang extends AbstractLang>(
        this: ConcreteLang<TLang>,
        filePath: string
    ): TLang {
        const fileContent = fs.readFileSync(filePath).toString();
        const tokens = Tokenizer.tokenize(this.tokenFactory, fileContent);
        const file = new SourceFile(filePath, tokens);
        const parser = new this(file, this.Comments);
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