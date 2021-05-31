import { Token } from "../token";
import { SourceCode } from "./SourceCode";

export class SourceFile
    extends SourceCode {
    readonly path: string;

    constructor(path: string, tokens: Token[]) {
        super(tokens);
        this.path = path;
    }
}