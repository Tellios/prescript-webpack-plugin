import { Script } from './Script';
import { Psp } from '../plugin.d';
import { ConfigError, ProcessError, ScriptError } from '../errors';
import { stringValidator } from '../validators';
import { spawnProcess } from '../spawnProcess';

export class NodeScript extends Script {
    constructor(private config: Psp.INodeScript) {
        super();
        this.validateConfig(config);
    }

    public async run(compilerContext: string): Promise<void> {
        const { script, scriptFile, args = [] } = this.config;

        if (script) {
            await Promise.resolve(script(...args));
        } else if (scriptFile) {
            await this.runScriptFile(compilerContext);
        }
    }

    private async runScriptFile(compilerContext: string) {
        const {
            scriptFile,
            throwOnError = true,
            interpreter = 'node',
            workingDirectory = compilerContext,
            args = []
        } = this.config;

        try {
            await spawnProcess(
                interpreter,
                [scriptFile, ...args],
                workingDirectory
            );
        } catch (error) {
            if (throwOnError) {
                if (error instanceof ProcessError) {
                    throw new ScriptError(
                        `Script '${scriptFile}' failed with exit code: ${
                            error.exitCode
                        }`
                    );
                } else {
                    throw error;
                }
            }
        }
    }

    private validateConfig(config: Psp.INodeScript) {
        if (config.type !== 'node') {
            throw new ConfigError(`type must be 'node' but was ${config.type}`);
        }

        if (
            config.workingDirectory &&
            !stringValidator(config.workingDirectory)
        ) {
            throw new ConfigError(
                'workingDirectory must be a non-empty string'
            );
        }

        if (config.workingDirectory && config.script) {
            throw new ConfigError(
                'workingDirectory cannot be combined with script'
            );
        }

        if (!config.script && !config.scriptFile) {
            throw new ConfigError('Neither script or scriptFile has been set');
        }

        if (config.script && config.scriptFile) {
            throw new ConfigError(
                'script and scriptFile cannot be used in the same prescript'
            );
        }

        if (config.script && typeof config.script !== 'function') {
            throw new ConfigError(`script must be a function`);
        }

        if (config.scriptFile && !stringValidator(config.scriptFile)) {
            throw new ConfigError('scriptFile must be a non-empty string');
        }

        if (
            config.scriptFile &&
            config.args &&
            config.args.some(a => !stringValidator(a))
        ) {
            throw new ConfigError(
                'When using scriptFile, all args must be non-empty strings'
            );
        }

        if (config.interpreter && stringValidator(config.interpreter)) {
            throw new ConfigError('interpreter must be a non-empty string');
        }
    }
}
