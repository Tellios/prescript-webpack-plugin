export class ProcessError extends Error {
    constructor(public exitCode: number) {
        super(`Process failed with exit code: ${exitCode}`);
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
