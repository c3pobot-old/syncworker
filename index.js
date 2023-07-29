'use strict'
const fs = require('fs')
require('app-module-path').addPath(__dirname);
global.baseDir = __dirname;
require.extensions['.css'] = function (module, filename) {
    module.exports = fs.readFileSync(filename, 'utf8');
};
require('./src')
