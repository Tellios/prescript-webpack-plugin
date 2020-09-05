jest.mock('../../spawnProcess', () => {
    return { spawnProcess: jest.fn(() => Promise.resolve()) };
});

import { NodeScript } from '../NodeScript';
import { ConfigError, ProcessError, ScriptError } from '../../errors';

describe('NodeScript', () => {
    describe('constructor', () => {
        test('should be instantiable with minimum config', () => {
            expect(
                () =>
                    new NodeScript({
                        type: 'node',
                        script: () => {}
                    })
            ).not.toThrow();

            expect(
                () =>
                    new NodeScript({
                        type: 'node',
                        scriptFile: 'file path'
                    })
            ).not.toThrow();
        });

        test('should throw ConfigError if script or scriptFile is missing', () => {
            expect(
                () =>
                    new NodeScript({
                        type: 'node'
                    })
            ).toThrowError(ConfigError);
        });

        test('should throw ConfigError if script is not a function', () => {
            expect(
                () =>
                    new NodeScript({
                        type: 'node',
                        script: 'file path'
                    })
            ).toThrowError(ConfigError);

            expect(
                () =>
                    new NodeScript({
                        type: 'node',
                        script: 1
                    })
            ).toThrowError(ConfigError);
        });

        test('should throw ConfigError if workingDirectory is combined with script', () => {
            expect(
                () =>
                    new NodeScript({
                        type: 'node',
                        script: () => {},
                        workingDirectory: 'path'
                    })
            ).toThrowError(ConfigError);
        });

        test('should throw ConfigError if workingDirectory is empty or not a string', () => {
            expect(
                () =>
                    new NodeScript({
                        type: 'node',
                        scriptFile: 'file path',
                        workingDirectory: 12 as any
                    })
            ).toThrowError(ConfigError);

            expect(
                () =>
                    new NodeScript({
                        type: 'node',
                        scriptFile: 'file path',
                        workingDirectory: ''
                    })
            ).toThrowError(ConfigError);
        });

        test('should throw ConfigError if workingDirectory is combined with script', () => {
            expect(
                () =>
                    new NodeScript({
                        type: 'node',
                        script: () => {},
                        workingDirectory: 'path'
                    })
            ).toThrowError(ConfigError);
        });

        test('should throw ConfigError if scriptFile is combined with script', () => {
            expect(
                () =>
                    new NodeScript({
                        type: 'node',
                        script: () => {},
                        scriptFile: 'file path'
                    })
            ).toThrowError(ConfigError);
        });

        test('should throw ConfigError if scriptFile is empty or not a string', () => {
            expect(
                () =>
                    new NodeScript({
                        type: 'node',
                        scriptFile: ''
                    })
            ).toThrowError(ConfigError);

            expect(
                () =>
                    new NodeScript({
                        type: 'node',
                        scriptFile: 12 as any
                    })
            ).toThrowError(ConfigError);

            expect(
                () =>
                    new NodeScript({
                        type: 'node',
                        scriptFile: (() => {}) as any
                    })
            ).toThrowError(ConfigError);
        });

        it('should throw ConfigError if args is not strings or empty when using scriptFile', () => {
            expect(
                () =>
                    new NodeScript({
                        type: 'node',
                        scriptFile: 'file path',
                        args: [12]
                    })
            ).toThrowError(ConfigError);

            expect(
                () =>
                    new NodeScript({
                        type: 'node',
                        scriptFile: 'file path',
                        args: [() => {}]
                    })
            ).toThrowError(ConfigError);

            expect(
                () =>
                    new NodeScript({
                        type: 'node',
                        scriptFile: 'file path',
                        args: ['']
                    })
            ).toThrowError(ConfigError);

            expect(
                () =>
                    new NodeScript({
                        type: 'node',
                        scriptFile: 'file path',
                        args: [null]
                    })
            ).toThrowError(ConfigError);
        });

        test('should throw ConfigError if interpreter is empty or not a string', () => {
            expect(
                () =>
                    new NodeScript({
                        type: 'node',
                        scriptFile: 'file path',
                        interpreter: ''
                    })
            ).toThrowError(ConfigError);

            expect(
                () =>
                    new NodeScript({
                        type: 'node',
                        scriptFile: 'file path',
                        interpreter: 12 as any
                    })
            ).toThrowError(ConfigError);

            expect(
                () =>
                    new NodeScript({
                        type: 'node',
                        scriptFile: 'file path',
                        interpreter: new Date() as any
                    })
            ).toThrowError(ConfigError);
        });
    });

    describe('run', () => {
        test('should wrap a script in a promise', () => {
            const script = jest.fn();
            const nodeScript = new NodeScript({
                type: 'node',
                script
            });

            const result = nodeScript.run('');

            expect(result).toBeInstanceOf(Promise);
            expect(script).toHaveBeenCalledTimes(1);
        });

        test('should pass arguments to a script', () => {
            const script = jest.fn();
            const nodeScript = new NodeScript({
                type: 'node',
                script,
                args: [1, 2, '3']
            });

            nodeScript.run('');

            expect(script).toHaveBeenCalledWith(1, 2, '3');
        });

        test('should spawn a process for a scriptFile', () => {
            const nodeScript = new NodeScript({
                type: 'node',
                scriptFile: 'file path'
            });

            nodeScript.run('context');

            const { spawnProcess } = require('../../spawnProcess');
            expect(spawnProcess).toHaveBeenCalledWith(
                'node',
                ['file path'],
                'context'
            );
        });

        test('should pass arguments when spawning a process for a scriptFile', () => {
            const nodeScript = new NodeScript({
                type: 'node',
                scriptFile: 'file path',
                args: ['1', '2']
            });

            nodeScript.run('context');

            const { spawnProcess } = require('../../spawnProcess');
            expect(spawnProcess).toHaveBeenCalledWith(
                'node',
                ['file path', '1', '2'],
                'context'
            );
        });

        test('should ignore ProcessError when throwOnError is false', async () => {
            const nodeScript = new NodeScript({
                type: 'node',
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
            const nodeScript = new NodeScript({
                type: 'node',
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
