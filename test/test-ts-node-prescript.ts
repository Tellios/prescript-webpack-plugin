import * as process from 'process';

function test(str: string, ...args: string[]) {
    console.log('Hello from ts-node script!', str, ...args);
}

test('Arguments right after:', ...process.argv.slice(2));
