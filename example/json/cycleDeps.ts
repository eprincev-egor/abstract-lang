import { ArrayLiteral } from "./ArrayLiteral";
import { ObjectLiteral } from "./ObjectLiteral";
import { JsonNode } from "./JsonNode";

interface CycleDeps {
    JsonNode: typeof JsonNode;
    ArrayLiteral: typeof ArrayLiteral;
    ObjectLiteral: typeof ObjectLiteral;
}
export const cycleDeps = {} as CycleDeps;