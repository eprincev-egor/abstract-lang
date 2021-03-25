import { CodeParams, SourceCode } from "./SourceCode";

export interface FileParams extends CodeParams {
    path: string;
}

export class SourceFile
    extends SourceCode {
    readonly path: string;

    constructor(params: FileParams) {
        super(params);
        this.path = params.path;
    }
}