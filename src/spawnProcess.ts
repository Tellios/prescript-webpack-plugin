import { spawn } from 'child_process';
import * as process from 'process';
import { ProcessError } from './errors';

export function spawnProcess(
    command: string,
    args?: string[],
    workingDirectory?: string
) {
    return new Promise((resolve, reject) => {
        const child = spawn(command, args, {
            cwd: workingDirectory,
            stdio: 'inherit'
        });

        child.on('close', code => {
            if (code !== 0) {
                reject(new ProcessError(code));
                return;
            }

            resolve();
        });
    });
}
