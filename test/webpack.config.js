const path = require('path');
const PrescriptWebpackPlugin = require('../dist/PrescriptWebpackPlugin');

module.exports = {
    mode: 'development',
    entry: path.resolve(__dirname, 'webpack-entry.js'),
    output: {
        path: path.resolve(__dirname, 'test-dist'),
        filename: 'bundle.js'
    },
    plugins: [
        new PrescriptWebpackPlugin({
            millisecondsBetweenRuns: 3000,
            scripts: [
                {
                    type: 'node',
                    args: ['arg1'],
                    scriptFile: path.join(__dirname, 'test-node-prescript.js')
                },
                {
                    type: 'node',
                    args: [1, 'param2'],
                    script: (param1, param2) => {
                        console.log('Hello from script!', param1, param2);
                    }
                },
                {
                    type: 'ts-node',
                    args: ['arg1', '--arg2'],
                    interpreter: path.resolve(
                        __dirname,
                        '../node_modules/.bin/ts-node'
                    ),
                    scriptFile: path.join(
                        __dirname,
                        'test-ts-node-prescript.ts'
                    )
                },
                {
                    type: 'shell',
                    command: 'echo',
                    args: ['Hello', 'from', 'shell', 'script'],
                    workingDirectory: '/home/sonny'
                }
            ]
        })
    ]
};
