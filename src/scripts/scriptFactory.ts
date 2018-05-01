import { ConfigError } from '../errors';
import { Psp } from '../plugin';
import { NodeScript } from './NodeScript';
import { TypeScriptNodeScript } from './TypeScriptNodeScript';
import { ShellScript } from './ShellScript';
import { Script } from './Script';

export function scriptFactory(config: Psp.IConfig): Script[] {
    if (!config) {
        throw new ConfigError('No config has been provided');
    }

    if (!Array.isArray(config.scripts)) {
        throw new ConfigError('scripts config is missing or is not an array');
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
