import { ArrayLiteral } from "./ArrayLiteral";
import { ObjectLiteral } from "./ObjectLiteral";
import { JsonSyntax } from "./JsonSyntax";

interface CycleDeps {
    JsonSyntax: typeof JsonSyntax;
    ArrayLiteral: typeof ArrayLiteral;
    ObjectLiteral: typeof ObjectLiteral;
}
export const cycleDeps = {} as CycleDeps;