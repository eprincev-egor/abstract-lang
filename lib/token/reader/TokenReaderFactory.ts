/* eslint-disable class-methods-use-this */
/* eslint-disable unicorn/consistent-destructuring */
import { TokenClass } from "token/Token";
import { EntryArrayTokenReader } from "./EntryArrayTokenReader";
import { EntryRegExpTokenReader } from "./EntryRegExpTokenReader";
import { TokenReader } from "./interface";
import { MaxLengthEntryArrayTokenReader } from "./MaxLengthEntryArrayTokenReader";
import { MaxLengthEntryRegExpTokenReader } from "./MaxLengthEntryRegExpTokenReader";
import { OneCharTokenReader } from "./OneCharTokenReader";
import { CustomTokenReader, TokenClassWithCustomRead } from "./CustomTokenReader";

export class TokenReaderFactory {

    create(TokenClass: TokenClass): TokenReader {
        const {description} = TokenClass;

        if ( typeof TokenClass.read === "function" ) {
            return new CustomTokenReader(
                TokenClass as TokenClassWithCustomRead
            );
        }

        if ( description.maxLength === 1 ) {
            return new OneCharTokenReader();
        }

        if ( description.entry instanceof RegExp ) {
            const popularChars = (description as {
                popularEntry: string[] | undefined;
            }).popularEntry || [];

            if ( description.maxLength ) {
                return new MaxLengthEntryRegExpTokenReader(
                    description.entry,
                    popularChars,
                    description.maxLength
                );
            }
            else {
                return new EntryRegExpTokenReader(
                    description.entry,
                    popularChars
                );
            }
        }
        else if ( description.maxLength ) {
            return new MaxLengthEntryArrayTokenReader(
                description.entry,
                description.maxLength
            );
        }
        else {
            return new EntryArrayTokenReader(description.entry);
        }
    }
}