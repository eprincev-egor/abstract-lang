import { Source, SourceCode } from "../source";
import { AbstractNode, AnyRow, NodeClass } from "../node";
import { defaultTokenFactory, TokenFactory, Tokenizer } from "../token";
import { assertNode } from "./assertNode";
import { Cursor } from "../cursor";

export type ConcreteLang<TLang extends AbstractLang = AbstractLang> = (
    (new(source: Source) => TLang) &
    Pick<typeof AbstractLang, keyof typeof AbstractLang>
);

export abstract class AbstractLang {
    static assertNode = assertNode;

    static code<TLang extends AbstractLang>(
        this: ConcreteLang<TLang>,
        text: string
    ): TLang {
        const tokens = Tokenizer.tokenize(this.tokenFactory, text);
        const code = new SourceCode(tokens);
        const parser = new this(code);
        return parser;
    }

    static comments: AbstractNode<AnyRow>[] = [];
    static tokenFactory: TokenFactory = defaultTokenFactory;

    readonly source: Source;
    readonly cursor: Cursor;
    constructor(source: Source) {
        this.source = source;
        this.cursor = new Cursor(source);
    }

    parse<TNode extends AbstractNode<AnyRow>>(
        Node: NodeClass<TNode>
    ): TNode {
        const node = this.cursor.parse(Node);
        return node;
    }
}