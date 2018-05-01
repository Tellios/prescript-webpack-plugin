export function stringValidator(value: string | String): boolean {
    if (typeof value !== 'string' && !(value instanceof String)) {
        return false;
    } else if (value.length === 0) {
        return false;
    }

    return true;
}
