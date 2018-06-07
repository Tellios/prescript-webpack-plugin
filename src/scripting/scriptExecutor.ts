import { Script } from './Script';

export async function scriptExecutor(
    scripts: Script[],
    compilerContext: string
): Promise<void> {
    for (const script of scripts) {
        await script.run(compilerContext);
    }
}
