import { scriptFactory } from '../scriptFactory';
import { ConfigError } from '../../errors';
import { Psp } from '../../plugin';
import { NodeScript } from '../NodeScript';
import { TypeScriptNodeScript } from '../TypeScriptNodeScript';
import { ShellScript } from '../ShellScript';

describe('scriptFactory', () => {
    test('should throw ConfigError if config is null or undefined', () => {
        expect(() => scriptFactory(null)).toThrowError(ConfigError);
        expect(() => scriptFactory(undefined)).toThrowError(ConfigError);
    });

    test('should throw ConfigError if scripts is null or undefined', () => {
        expect(() => scriptFactory({} as Psp.IConfig)).toThrowError(
            ConfigError
        );

        expect(() =>
            scriptFactory({ scripts: undefined } as Psp.IConfig)
        ).toThrowError(ConfigError);

        expect(() =>
            scriptFactory({ scripts: null } as Psp.IConfig)
        ).toThrowError(ConfigError);
    });

    test('should throw ConfigError if scripts is not an array', () => {
        expect(() => scriptFactory({ scripts: {} as any })).toThrowError(
            ConfigError
        );
    });

    test('should return an empty array if no scripts have been defined', () => {
        expect(scriptFactory({ scripts: [] })).toEqual([]);
    });

    test('should return NodeScript when script.type is node', () => {
        const scripts = scriptFactory({
            scripts: [
                {
                    type: 'node',
                    script: () => {}
                }
            ]
        });

        expect(scripts[0]).toBeInstanceOf(NodeScript);
    });

    test('should return TypeScriptNodeScript when script.type is ts-node', () => {
        const scripts = scriptFactory({
            scripts: [
                {
                    type: 'ts-node',
                    scriptFile: 'script.ts'
                }
            ]
        });

        expect(scripts[0]).toBeInstanceOf(TypeScriptNodeScript);
    });

    test('should return ShellScript when script.type is shell', () => {
        const scripts = scriptFactory({
            scripts: [
                {
                    type: 'shell',
                    command: 'ls'
                }
            ]
        });

        expect(scripts[0]).toBeInstanceOf(ShellScript);
    });

    test('should throw ConfigError if script.type is unknown', () => {
        expect(() =>
            scriptFactory({
                scripts: [{ type: '' as any }]
            })
        ).toThrowError(ConfigError);
    });

    test('should create all scripts configured in same order as in config', () => {
        const scripts = scriptFactory({
            scripts: [
                { type: 'shell', command: 'echo' },
                { type: 'node', scriptFile: 'script.js' },
                { type: 'ts-node', scriptFile: 'script.ts' },
                { type: 'shell', command: 'ls' },
            ]
        });

        expect(scripts[0]).toBeInstanceOf(ShellScript);
        expect(scripts[1]).toBeInstanceOf(NodeScript);
        expect(scripts[2]).toBeInstanceOf(TypeScriptNodeScript);
        expect(scripts[3]).toBeInstanceOf(ShellScript);
    });
});
