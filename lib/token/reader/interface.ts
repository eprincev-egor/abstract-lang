export interface TokenReader {
    read(text: string, position: number): string;
}