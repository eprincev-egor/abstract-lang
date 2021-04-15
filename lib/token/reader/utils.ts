export interface BoolMap {
    [char: string]: boolean;
}

export function buildBoolMap(chars: string[]): BoolMap {
    const map: BoolMap = {};

    for (const char of chars) {
        map[ char ] = true;
    }

    return map;
}