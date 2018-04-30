import { Script } from './Script';
import { Psp } from '../plugin.d';
import { ConfigError } from '../errors';
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

        await spawnProcess(command, throwOnError, args, workingDirectory);
    }

    private validateConfig(config: Psp.IShellScript) {
        if (config.type !== 'shell') {
            throw new ConfigError(
                `type must be 'shell' but was ${config.type}`
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

        if (
            !config.command ||
            typeof config.command !== 'string' ||
            config.command === ''
        ) {
            throw new ConfigError(
                `Shell script command must be a string with a value`
            );
        }

        if (config.args && config.args.length > 0) {
            if (config.args.some(a => typeof a !== 'string')) {
                throw new ConfigError('All shell script args must be strings');
            }
        }
    }
}
