import { scriptExecutor } from '../scriptExecutor';
import { Script } from '../Script';

describe('scriptExecutor', () => {
    test('should trigger all scripts with context as parameter', async () => {
        const scripts: Script[] = [
            {
                run: jest.fn(() => Promise.resolve())
            },
            {
                run: jest.fn(() => Promise.resolve())
            }
        ];

        await scriptExecutor(scripts, 'context');

        for (const script of scripts) {
            expect(script.run).toHaveBeenCalledWith('context');
        }
    });

    test('should bubble any errors up the call chain', async () => {
        const scripts: Script[] = [
            { run: jest.fn(() => Promise.reject('error')) }
        ];

        try {
            await scriptExecutor(scripts, 'context');
            fail('Error was expected');
        } catch (error) {
            expect(error).toBe('error');
        }
    });
});
