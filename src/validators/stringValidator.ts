export function stringValidator(value: string): boolean {
    if (typeof value !== 'string') {
        return false;
    } else if (value.length === 0) {
        return false;
    }

    return true;
}
