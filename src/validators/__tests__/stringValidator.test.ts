import { stringValidator } from "../stringValidator";

describe('stringValidator', () => {
    test('should return true for a non-empty string', () => {
        expect(stringValidator(' ')).toBeTruthy();
        expect(stringValidator('123')).toBeTruthy();
        expect(stringValidator('abc')).toBeTruthy();
        expect(stringValidator(new String('abc'))).toBeTruthy();
    });

    test('should return false for an empty string', () => {
        expect(stringValidator('')).toBeFalsy();
        expect(stringValidator(new String())).toBeFalsy();
        expect(stringValidator(new String(''))).toBeFalsy();
    });

    test('should return false for undefined or null', () => {
        expect(stringValidator(null)).toBeFalsy();
        expect(stringValidator(undefined)).toBeFalsy();
    });

    test('should return false for something that is not a string', () => {
        expect(stringValidator(1 as any)).toBeFalsy();
        expect(stringValidator(new Date() as any)).toBeFalsy();
        expect(stringValidator([] as any)).toBeFalsy();
        expect(stringValidator(true as any)).toBeFalsy();
    });
});
