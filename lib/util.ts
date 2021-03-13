
export function last<T>(array: readonly T[]): T {
    return array.slice(-1)[0];
}