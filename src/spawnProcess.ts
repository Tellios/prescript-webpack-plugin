import { spawn } from 'child_process';
import * as process from 'process';

export function spawnProcess(
    command: string,
    throwOnError: boolean,
    args?: string[],
    workingDirectory?: string
) {
    return new Promise((resolve, reject) => {
        const child = spawn(command, args, {
            cwd: workingDirectory,
            stdio: 'inherit'
        });

        child.on('close', code => {
            if (code !== 0 && throwOnError) {
                reject(new Error(`Script failed with exit code: ${code}`));
                return;
            }

            resolve();
        });
    });
}
