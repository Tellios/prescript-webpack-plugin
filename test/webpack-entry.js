// This is the entry file for the webpack config

const scriptGeneratedCode = require('./generatedCode/code.generated');
require('./some-dependency');
require('./some-other-dependency');

module.exports = () => {
    console.log('some dummy code pew pew');
    scriptGeneratedCode();
};
