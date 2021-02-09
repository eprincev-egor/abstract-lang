import { TokenMap } from "../TokenMap";
import { SpaceToken } from "./SpaceToken";
import { WordToken } from "./WordToken";
import { BracketsToken } from "./BracketsToken";
import { OperatorsToken } from "./OperatorsToken";
import { DigitsToken } from "./DigitsToken";
import { QuotesToken } from "./QuotesToken";

export const defaultMap = new TokenMap([
    SpaceToken.description,
    WordToken.description,
    BracketsToken.description,
    OperatorsToken.description,
    DigitsToken.description,
    QuotesToken.description
]);