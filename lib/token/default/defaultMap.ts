import { TokenMap } from "../TokenMap";
import { SpaceToken } from "./SpaceToken";
import { EolToken } from "./EolToken";
import { WordToken } from "./WordToken";
import { BracketsToken } from "./BracketsToken";
import { OperatorsToken } from "./OperatorsToken";
import { DigitsToken } from "./DigitsToken";
import { QuotesToken } from "./QuotesToken";

export const defaultMap = new TokenMap([
    SpaceToken,
    EolToken,
    WordToken,
    BracketsToken,
    OperatorsToken,
    DigitsToken,
    QuotesToken
]);