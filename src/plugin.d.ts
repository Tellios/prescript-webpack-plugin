export namespace Psp {
    interface IConfig {
        scripts: Readonly<Script>[];

        /**
         * The minimum amount of time between script runs. By default this is 500 ms.
         * The setting enables you to tweak the amount of time that must pass before
         * allowing the scripts to be executed again. This is required when scripts
         * are used to generate code that is watched by webpack. If the time is too
         * short it can lead to unnecessary compilations or even endlessly restarting
         * compilations
         */
        millisecondsBetweenRuns?: number;
    }

    type Script = IShellScript | INodeScript | ITypeScriptNodeScript;

    interface IScript {
        type: string;
        throwOnError?: boolean;
        workingDirectory?: string;
    }

    /**
     * Command executed in a shell.
     */
    interface IShellScript extends IScript {
        type: 'shell';
        command: string;
        args?: string[];
    }

    /**
     * Node script either executed by being automatically
     * loaded or as a function. The function can also return
     * a promise if it is asynchronous.
     */
    interface INodeScript extends IScript {
        type: 'node';
        interpreter?: string;
        scriptFile?: string;
        script?: any;
        args?: any[];
    }

    /**
     * Typescript node script executed using ts-node.
     */
    interface ITypeScriptNodeScript extends IScript {
        type: 'ts-node';
        interpreter?: string;
        scriptFile: string;
        args?: string[];
    }
}
