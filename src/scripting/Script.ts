export abstract class Script {
    public abstract run(compilerContext: string): Promise<void>;
}
