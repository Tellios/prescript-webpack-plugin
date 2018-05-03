import { ShellScript } from '../ShellScript';
import { ConfigError } from '../../errors';

describe('ShellScript', () => {
    describe('constructor', () => {
        test('should be instantiable with minimum config', () => {
            expect(
                () =>
                    new ShellScript({
                        type: 'shell',
                        command: 'command'
                    })
            ).not.toThrow();
        });

        test('should throw ConfigError if scriptFile is missing', () => {
            expect(
                () =>
                    new ShellScript({
                        type: 'shell'
                    } as any)
            ).toThrowError(ConfigError);
        });

        test('should throw ConfigError if workingDirectory is empty or not a string', () => {
            expect(
                () =>
                    new ShellScript({
                        type: 'shell',
                        command: 'command',
                        workingDirectory: 12 as any
                    })
            ).toThrowError(ConfigError);

            expect(
                () =>
                    new ShellScript({
                        type: 'shell',
                        command: 'command',
                        workingDirectory: ''
                    })
            ).toThrowError(ConfigError);
        });

        test('should throw ConfigError if command is empty or not a string', () => {
            expect(
                () =>
                    new ShellScript({
                        type: 'shell',
                        command: ''
                    })
            ).toThrowError(ConfigError);

            expect(
                () =>
                    new ShellScript({
                        type: 'shell',
                        command: 12 as any
                    })
            ).toThrowError(ConfigError);

            expect(
                () =>
                    new ShellScript({
                        type: 'shell',
                        command: (() => {}) as any
                    })
            ).toThrowError(ConfigError);
        });

        it('should throw ConfigError if args is not strings', () => {
            expect(
                () =>
                    new ShellScript({
                        type: 'shell',
                        command: 'command',
                        args: [12] as any
                    })
            ).toThrowError(ConfigError);

            expect(
                () =>
                    new ShellScript({
                        type: 'shell',
                        command: 'command',
                        args: [() => {}] as any
                    })
            ).toThrowError(ConfigError);

            expect(
                () =>
                    new ShellScript({
                        type: 'shell',
                        command: 'command',
                        args: ['']
                    })
            ).toThrowError(ConfigError);

            expect(
                () =>
                    new ShellScript({
                        type: 'shell',
                        command: 'command',
                        args: [null] as any
                    })
            ).toThrowError(ConfigError);
        });
    });
});
