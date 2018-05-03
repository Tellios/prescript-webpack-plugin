jest.mock('../../spawnProcess', () => {
    return { spawnProcess: jest.fn(() => Promise.resolve()) };
});

import { TypeScriptNodeScript } from '../TypeScriptNodeScript';
import { ConfigError, ProcessError, ScriptError } from '../../errors';

describe('TypeScriptNodeScript', () => {
    describe('constructor', () => {
        test('should be instantiable with minimum config', () => {
            expect(
                () =>
                    new TypeScriptNodeScript({
                        type: 'ts-node',
                        scriptFile: 'file path'
                    })
            ).not.toThrow();
        });

        test('should throw ConfigError if scriptFile is missing', () => {
            expect(
                () =>
                    new TypeScriptNodeScript({
                        type: 'ts-node'
                    } as any)
            ).toThrowError(ConfigError);
        });

        test('should throw ConfigError if workingDirectory is empty or not a string', () => {
            expect(
                () =>
                    new TypeScriptNodeScript({
                        type: 'ts-node',
                        scriptFile: 'file path',
                        workingDirectory: 12 as any
                    })
            ).toThrowError(ConfigError);

            expect(
                () =>
                    new TypeScriptNodeScript({
                        type: 'ts-node',
                        scriptFile: 'file path',
                        workingDirectory: ''
                    })
            ).toThrowError(ConfigError);
        });

        test('should throw ConfigError if scriptFile is empty or not a string', () => {
            expect(
                () =>
                    new TypeScriptNodeScript({
                        type: 'ts-node',
                        scriptFile: ''
                    })
            ).toThrowError(ConfigError);

            expect(
                () =>
                    new TypeScriptNodeScript({
                        type: 'ts-node',
                        scriptFile: 12 as any
                    })
            ).toThrowError(ConfigError);

            expect(
                () =>
                    new TypeScriptNodeScript({
                        type: 'ts-node',
                        scriptFile: (() => {}) as any
                    })
            ).toThrowError(ConfigError);
        });

        it('should throw ConfigError if args is not strings or empty when using scriptFile', () => {
            expect(
                () =>
                    new TypeScriptNodeScript({
                        type: 'ts-node',
                        scriptFile: 'file path',
                        args: [12] as any
                    })
            ).toThrowError(ConfigError);

            expect(
                () =>
                    new TypeScriptNodeScript({
                        type: 'ts-node',
                        scriptFile: 'file path',
                        args: [() => {}] as any
                    })
            ).toThrowError(ConfigError);

            expect(
                () =>
                    new TypeScriptNodeScript({
                        type: 'ts-node',
                        scriptFile: 'file path',
                        args: ['']
                    })
            ).toThrowError(ConfigError);

            expect(
                () =>
                    new TypeScriptNodeScript({
                        type: 'ts-node',
                        scriptFile: 'file path',
                        args: [null] as any
                    })
            ).toThrowError(ConfigError);
        });

        test('should throw ConfigError if interpreter is empty or not a string', () => {
            expect(
                () =>
                    new TypeScriptNodeScript({
                        type: 'ts-node',
                        scriptFile: 'file path',
                        interpreter: ''
                    })
            ).toThrowError(ConfigError);

            expect(
                () =>
                    new TypeScriptNodeScript({
                        type: 'ts-node',
                        scriptFile: 'file path',
                        interpreter: 12 as any
                    })
            ).toThrowError(ConfigError);

            expect(
                () =>
                    new TypeScriptNodeScript({
                        type: 'ts-node',
                        scriptFile: 'file path',
                        interpreter: new Date() as any
                    })
            ).toThrowError(ConfigError);
        });
    });

    describe('run', () => {
        test('should spawn a process for a scriptFile', () => {
            const nodeScript = new TypeScriptNodeScript({
                type: 'ts-node',
                scriptFile: 'file path'
            });

            nodeScript.run('context');

            const { spawnProcess } = require('../../spawnProcess');
            expect(spawnProcess).toHaveBeenCalledWith(
                'ts-node',
                ['file path'],
                'context'
            );
        });

        test('should pass arguments when spawning a process for a scriptFile', () => {
            const nodeScript = new TypeScriptNodeScript({
                type: 'ts-node',
                scriptFile: 'file path',
                args: ['1', '2']
            });

            nodeScript.run('context');

            const { spawnProcess } = require('../../spawnProcess');
            expect(spawnProcess).toHaveBeenCalledWith(
                'ts-node',
                ['file path', '1', '2'],
                'context'
            );
        });

        test('should ignore ProcessError when throwOnError is false', async () => {
            const nodeScript = new TypeScriptNodeScript({
                type: 'ts-node',
                scriptFile: 'file path',
                throwOnError: false
            });
            const spawnProcess = require('../../spawnProcess');
            spawnProcess.spawnProcess = jest.fn(() =>
                Promise.reject(new ProcessError(1))
            );

            await nodeScript.run('context');
        });

        test('should throw on ProcessError when throwOnError is true', async () => {
            const nodeScript = new TypeScriptNodeScript({
                type: 'ts-node',
                scriptFile: 'file path',
                throwOnError: true
            });
            const spawnProcess = require('../../spawnProcess');
            spawnProcess.spawnProcess = jest.fn(() =>
                Promise.reject(new ProcessError(1))
            );

            try {
                await nodeScript.run('context');
                fail('Should throw');
            } catch (error) {
                expect(error).toBeInstanceOf(ScriptError);
            }
        });
    });
});
