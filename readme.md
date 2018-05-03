# prescript-webpack-plugin

Prescript is intended for those rare cases where you want to run scripts before transpiling/bundling your code with webpack.

A typical example usage is to auto-generate e.g typescript typings based on often changing json files like language files. On every run of webpack the scripts will be run before any transpiling or bundling takes place.

# Installing

```shell
npm install prescript-webpack-plugin
```

# Usage

```js
const PrescriptWebpackPlugin = require('prescript-webpack-plugin');
```

Add the plugin to your webpack `plugins` section:

```js
plugins: [
    new PrescriptWebpackPlugin({
        // Scripts are executed in the order they are added
        // The different types of scripts are listed further down in the documentation
        scripts: [
            {
                type: 'node',
                args: ['arg1'],
                scriptFile: path.join(__dirname, 'prescript.js')
            },
            {
                type: 'node',
                args: [1, 'param2'],
                script: (param1, param2) => {
                    console.log(param1, param2);
                }
            }
        ]
    })
];
```

# Prescript types

## node

Node scripts are plain javascript that can be executed either as an inline script or as a separate process using a .js file as input.

| Property         | Description                                                                          |
| ---------------- | ------------------------------------------------------------------------------------ |
| type             | Must be set to 'node'                                                                |
| interpreter      | Optional. Specify an alternative node executable if required when using `scriptFile` |
| scriptFile       | Absolute path to script file that should be run, can't be combined with `script`     |
| script           | A function that should be run, can't be combined with scriptFile                     |
| args             | Optional. Must be strings when using `scriptFile`                                    |
| throwOnError     | If a build should fail on an error or continue silently                              |
| workingDirectory | The working directory used when executing `scriptFile`, defaults to webpack's        |

### Examples

Using `scriptFile`:

```js
{
    type: 'node',
    args: ['arg1'],
    scriptFile: path.join(__dirname, 'prescript.js'),
    interpreter: '/some/path/to/node',
    workingDirectory: '/work/dir/for/node',
    throwOnError: true
}
```

Using `script`:

```js
{
    type: 'node',
    args: [1, 'param2'],
    script: (param1, param2) => {
        console.log(param1, param2);
    }
}
```

## ts-node

Similar to `type: 'node'` but executes a script file using [ts-node](https://www.npmjs.com/package/ts-node) instead which allows you to use TypeScript.

| Property         | Description                                                                   |
| ---------------- | ----------------------------------------------------------------------------- |
| type             | Must be set to 'ts-node'                                                      |
| interpreter      | Optional. Specify an alternative ts-node executable if required               |
| args             | Optional. Must be strings                                                     |
| throwOnError     | If a build should fail on an error or continue silently                       |
| workingDirectory | The working directory used when executing `scriptFile`, defaults to webpack's |

### Examples

Using `scriptFile`:

```js
{
    type: 'ts-node',
    args: ['arg1'],
    scriptFile: path.join(__dirname, 'prescript.ts'),
    interpreter: '/some/path/to/ts-node',
    workingDirectory: '/work/dir/for/ts-node',
    throwOnError: true
},
```

## shell

Run any shell command, this could for example enable you to run python scripts or anything else that could be needed.

| Property         | Description                                                                |
| ---------------- | -------------------------------------------------------------------------- |
| type             | Must be set to 'shell'                                                     |
| command          | The shell command you want to execute                                      |
| args             | Optional. Must be strings                                                  |
| throwOnError     | If a build should fail on an error or continue silently                    |
| workingDirectory | The working directory used when executing `command`, defaults to webpack's |

### Examples

```js
{
    type: 'shell',
    command: 'echo',
    args: ['hello', 'world'],
    workingDirectory: '/work/dir/for/command',
    throwOnError: true
},
```

# Common issues

Since prescripts are executed just before webpack's build triggers it can cause issues when modifying files that webpack works with during building in combination with webpack's watchers. To accomodate this, files being modified have to be added to `watchOptions.ignored` in `webpack.config` like this:

```js
watchOptions: {
    aggregateTimeout: 300,
    poll: 1000,
    // Ignored here makes sure that watchers won't trigger on the generated files.
    ignored: [
        /\.generated\.js$/
    ]
},
```

In addition to this, generated files require a bit of a hack which is that writes to the file need to modify the `utimes` of the file like this:

```js
fs.writeFile(filePath, fileContents, err => {
    if (err) {
        process.exit(1);
    }

    // Makes the file 20 seconds younger
    const fileTime = Date.now() / 1000 - 20;

    // This makes sure that webpack won't trigger unnecessary builds in
    // watch mode
    fs.utimes(filePath, fileTime, fileTime, err => {
        if (err) {
            process.exit(1);
        }
    });
});
```
