import { Script } from './Script';
import { Psp } from '../plugin.d';
import { ConfigError, ScriptError, ProcessError } from '../errors';
import { stringValidator } from '../validators';
import { spawnProcess } from '../spawnProcess';

export class ShellScript extends Script {
    constructor(private config: Psp.IShellScript) {
        super();
        this.validateConfig(config);
    }

    public async run(compilerContext: string): Promise<void> {
        const {
            command,
            args,
            throwOnError = true,
            workingDirectory = compilerContext
        } = this.config;

        try {
            await spawnProcess(command, args, workingDirectory);
        } catch (error) {
            if (throwOnError) {
                if (error instanceof ProcessError) {
                    throw new ScriptError(
                        `Command '${command}' failed with exit code: ${
                            error.exitCode
                        }`
                    );
                } else {
                    throw error;
                }
            }
        }
    }

    private validateConfig(config: Psp.IShellScript) {
        if (config.type !== 'shell') {
            throw new ConfigError(
                `type must be 'shell' but was ${config.type}`
            );
        }

        if (
            config.workingDirectory != null &&
            !stringValidator(config.workingDirectory)
        ) {
            throw new ConfigError(
                'workingDirectory must be a non-empty string'
            );
        }

        if (
            config.command == null ||
            !stringValidator(config.command)
        ) {
            throw new ConfigError(
                `Shell script command must be a string with a value`
            );
        }

        if (config.args && config.args.some(a => !stringValidator(a))) {
            throw new ConfigError('All shell script args must be strings');
        }
    }
}
