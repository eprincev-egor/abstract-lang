export const codeExample = `
readWord(): string {
    let word = "";

    const startIndex = this.i;
    if ( startIndex === this.lastWordStartIndex ) {
        this.i = this.lastWordEndIndex!;
        return this.lastWord!;
    }

    this.skipSpace();

    for (; this.i < this.n; this.i++) {
        const symbol = this.str[ this.i ];

        if ( /[^\\w]/.test(symbol) ) {
            break;
        }

        word += symbol;
    }

    this.skipSpace();

    const endIndex = this.i;
    const lowerWord = word.toLowerCase();
    
    this.lastWordStartIndex = startIndex;
    this.lastWordEndIndex = endIndex;
    this.lastWord = lowerWord;

    return lowerWord;
}`.trim();