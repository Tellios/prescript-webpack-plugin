import { Compiler } from 'webpack';
import { Psp } from './plugin.d';
import { Script, scriptFactory, scriptExecutor } from './scripting';

const defaultMillisecondsBetweenRuns = 500;

class PrescriptWebpackPlugin {
    private scripts: Script[];
    private lastExecution = 0;
    private millisecondsBetweenRuns: number;

    constructor(config: Psp.IConfig) {
        this.scripts = scriptFactory(config);
        this.millisecondsBetweenRuns =
            config.millisecondsBetweenRuns ?? defaultMillisecondsBetweenRuns;
    }

    public apply(compiler: Compiler) {
        compiler.hooks.beforeCompile.tapAsync(
            'beforeCompile',
            async (_hookCompiler: any, callback: () => void) => {
                try {
                    const compilerContext = compiler.context;

                    const millisecondsSinceLastRun =
                        Date.now() - this.lastExecution;

                    if (
                        millisecondsSinceLastRun > this.millisecondsBetweenRuns
                    ) {
                        await scriptExecutor(this.scripts, compilerContext);
                        this.lastExecution = Date.now();
                    }

                    callback();
                } catch (error) {
                    console.error(error);
                    process.exit(1);
                }
            }
        );
    }
}

export = PrescriptWebpackPlugin;
