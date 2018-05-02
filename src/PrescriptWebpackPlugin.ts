import * as path from 'path';
import { Compiler } from 'webpack';
import { Psp } from './plugin.d';
import { Script, scriptFactory, scriptExecutor } from './scripting';
import { ConfigError } from './errors';

class PrescriptWebpackPlugin {
    private scripts: Script[];

    constructor(private config: Psp.IConfig) {
        this.scripts = scriptFactory(config);
    }

    public apply(compiler: Compiler) {
        compiler.hooks.beforeCompile.tapAsync(
            'beforeCompile',
            async (_hookCompiler: any, callback: () => void) => {
                try {
                    // Context is missing from the typings which provides the working
                    // directory path fallback
                    const compilerContext = (compiler as any).context;

                    await scriptExecutor(this.scripts, compilerContext);

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
