export namespace Psp {
  interface IConfig {
    scripts: Readonly<Script>[];
  }

  type Script = IShellScript | INodeScript | ITypeScriptNodeScript;

  interface IScript {
    type: string;
    continueOnError?: boolean;
  }

  /**
   * Command executed in a shell.
   */
  interface IShellScript extends IScript {
    type: "shell";
    command: string;
    workingDirectory?: string;
  }

  /**
   * Node script either executed by being automatically
   * loaded or as a function. The function can also return
   * a promise if it is asynchronous.
   */
  interface INodeScript extends IScript {
    type: "node";
    scriptFile?: string;
    script?(): any;
  }

  /**
   * Typescript node script executed using ts-node.
   */
  interface ITypeScriptNodeScript extends IScript {
    type: "ts-node";
    scriptFile: string;
  }
}
