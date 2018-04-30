import { Script } from './Script';
import { Psp } from '../plugin.d';
import { ConfigError } from '../errors';
import { stringValidator } from '../validators';
import { spawnProcess } from '../spawnProcess';
import { spawn } from 'child_process';

export class TypeScriptNodeScript extends Script {
    constructor(private config: Psp.ITypeScriptNodeScript) {
        super();
        this.validateConfig(config);
    }

    public async run(compilerContext: string): Promise<void> {
        const {
            scriptFile,
            throwOnError = true,
            interpreter = 'ts-node',
            workingDirectory = compilerContext,
            args = []
        } = this.config;

        await spawnProcess(
            interpreter,
            throwOnError,
            [scriptFile, ...args],
            workingDirectory
        );
    }

    private validateConfig(config: Psp.ITypeScriptNodeScript) {
        if (config.type !== 'ts-node') {
            throw new ConfigError(
                `type must be 'ts-node' but was ${config.type}`
            );
        }

        if (
            config.workingDirectory &&
            !stringValidator(config.workingDirectory)
        ) {
            throw new ConfigError(
                'workingDirectory must be a non-empty string'
            );
        }

        if (config.scriptFile && !stringValidator(config.scriptFile)) {
            throw new ConfigError('scriptFile must be a non-empty string');
        }

        if (config.args && config.args.some(a => !stringValidator(a))) {
            throw new ConfigError('All args must be non-empty strings');
        }

        if (config.interpreter && !stringValidator(config.interpreter)) {
            throw new ConfigError('interpreter must be a non-empty string');
        }
    }
}
