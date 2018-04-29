import { spawn } from 'child_process';
import * as process from 'process';

export function runNodeScript(workingDirectory: string, scriptFile: string) {
    return new Promise((resolve, reject) => {
        const child = spawn('node', [scriptFile], {
            cwd: workingDirectory,
            stdio: 'inherit'
        });

        child.on('close', code => {
            if (code !== 0) {
                reject(new Error(`Script failed with exit code: ${code}`));
                return;
            }

            resolve();
        });
    });
}
