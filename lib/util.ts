export function last<T>(array: readonly T[]): T {
    return array.slice(-1)[0];
}

export function split<T>(array: readonly T[], delimiter: T): T[][] {
    const matrix: T[][] = [];

    let line: T[] = [];
    for (const item of array) {
        if ( item === delimiter ) {
            matrix.push(line);
            line = [];
        }
        else {
            line.push(item);
        }
    }

    if ( array.length > 0 ) {
        matrix.push(line);
    }

    return matrix;
}
