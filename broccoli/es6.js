var BroccoliFilter = require('broccoli-filter')
var Compiler = require('es6-module-transpiler').Compiler;
var extend = require('extend');

module.exports = Filter;
Filter.prototype = Object.create(BroccoliFilter.prototype);
Filter.prototype.constructor = Filter;

function Filter(inputTree, options) {
  if (!(this instanceof Filter)) {
    return new Filter(inputTree, options);
  }
  this.inputTree = inputTree;


  this.moduleGenerator = options.moduleGenerator || options;
  this.moduleType = options.moduleType || 'amd';

  this.compilerOptions = {};

  if (options.compatFix) this.compilerOptions.compatFix = options.compatFix;
  if (options.extensions) this.extensions = options.extensions
  if (options.targetExtension) this.targetExtension = options.targetExtension

}

Filter.prototype.extensions = ['js']

var methods = {
  'cjs': 'toCJS',
  'amd': 'toAMD'
};

Filter.prototype.getName = function (filePath) {

  var generator = this.moduleGenerator; 
  if ( generator ) { 
    if (typeof generator === 'string' ) {
      return generator;
    } else {
      return generator(filePath);
    }
  }
};

Filter.prototype.processString = function (fileContents, filePath) {
  var name = this.getName(filePath);
  var compiler = new Compiler(fileContents, name, this.compilerOptions);
  return compiler[methods[this.moduleType]]();
};
