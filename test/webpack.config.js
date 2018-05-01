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
        ignored: [/generatedCode$/]
    },
    plugins: [
        new PrescriptWebpackPlugin({
            scripts: [
                {
                    type: 'node',
                    scriptFile: path.join(__dirname, 'test-prescript.js')
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
