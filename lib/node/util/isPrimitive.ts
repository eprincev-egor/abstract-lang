export function isPrimitive(value: unknown): boolean {
    return (
        typeof value === "boolean" ||
        typeof value === "number" ||
        typeof value === "string" ||
        typeof value === "function" ||
        value == undefined
    );
}
