const path = require('path');
const PrescriptWebpackPlugin = require('../dist/plugin');

module.exports = {
    mode: 'development',
    entry: path.resolve(__dirname, 'webpack-entry.js'),
    output: {
        path: path.resolve(__dirname, 'test-dist'),
        filename: 'bundle.js'
    },
    watchOptions: {
        aggregateTimeout: 300,
        poll: 1000,
        ignored: [/\.generated\.js$/]
    },
    plugins: [
        new PrescriptWebpackPlugin({
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
                    scriptFile: path.join(
                        __dirname,
                        'test-ts-node-prescript.ts'
                    )
                }
                // {
                //     type: 'shell',
                //     command: 'ls',
                //     args: ['-la'],
                //     workingDirectory: '/home/sonny'
                // }
            ]
        })
    ]
};
