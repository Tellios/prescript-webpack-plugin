import * as path from 'path';
import { Compiler } from 'webpack';
import { Psp } from './plugin.d';
import {
    Script,
    ShellScript,
    NodeScript,
    TypeScriptNodeScript
} from './scripts';
import { ConfigError } from './errors';

class PrescriptWebpackPlugin {
    private scripts: Script[];

    constructor(private config: Psp.IConfig) {
        if (!config) {
            throw new ConfigError('No config has been provided');
        }

        this.scripts = this.getScriptsToRun(config);
    }

    public apply(compiler: Compiler) {
        compiler.hooks.beforeCompile.tapAsync(
            'beforeCompile',
            async (_hookCompiler: any, callback: () => void) => {
                console.log('beforeCompile');
                try {
                    await this.executeScripts(compiler, callback);
                } catch (error) {
                    console.error(error);
                    process.exit(1);
                }
            }
        );
    }

    private async executeScripts(compiler: Compiler, callback: () => void) {
        // Context is missing from the typings which provides the working
        // directory path fallback
        const compilerContext = (compiler as any).context;

        for (const script of this.scripts) {
            await script.run(compilerContext);
        }

        callback();
    }

    private getScriptsToRun(config: Psp.IConfig) {
        if (!Array.isArray(config.scripts)) {
            throw new ConfigError(
                'scripts config is missing or is not an array'
            );
        }

        return config.scripts.map(scriptConfig => {
            if (scriptConfig.type === 'node') {
                return new NodeScript(scriptConfig);
            } else if (scriptConfig.type === 'ts-node') {
                return new TypeScriptNodeScript(scriptConfig);
            } else if (scriptConfig.type === 'shell') {
                return new ShellScript(scriptConfig);
            }

            const type = (scriptConfig as any).type;
            throw new ConfigError(`Unknown script type: '${type}'`);
        });
    }
}

export = PrescriptWebpackPlugin;
