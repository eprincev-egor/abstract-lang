export class Position {
    readonly start: number;
    readonly end: number;

    constructor(start: number, end: number) {
        this.start = start;
        this.end = end;
    }

    toJSON(): {start: number; end: number} {
        return {
            start: this.start,
            end: this.end
        };
    }
}