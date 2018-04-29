import { runNodeScript } from './runNodeScript';
import * as path from 'path';
import { Compiler } from 'webpack';
import { Psp } from './plugin.d';

class PrescriptWebpackPlugin {
    constructor(private config: Psp.IConfig) {}

    public apply(compiler: Compiler) {
        compiler.hooks.beforeCompile.tapAsync(
            'beforeCompile',
            async (_hookCompiler: any, callback: () => void) => {
                await this.executeScripts(compiler, callback);
            }
        );
    }

    private async executeScripts(compiler: Compiler, callback: () => void) {
        // Context is missing from the types
        const compilerContext = (compiler as any).context;

        await runNodeScript(
            compilerContext,
            path.resolve(compilerContext, 'test', 'test-prescript.js')
        );

        callback();
    }
}

module.exports = PrescriptWebpackPlugin;
