var BroccoliFilter = require('broccoli-filter');
var fs = require('fs');


module.exports = Filter;
Filter.prototype = Object.create(BroccoliFilter.prototype);
Filter.prototype.constructor = Filter;

function Filter (inputTree, options) {
  if (!(this instanceof Filter)) {
    return new Filter(inputTree, options);
  }
  this.inputTree = inputTree;
  this.options = options || {};

  if (this.options.extensions != null) this.extensions = this.options.extensions
  if (this.options.targetExtension != null) this.targetExtension = this.options.targetExtension

  this.before = options.before;
  
  var content;
  if ( options.path ) {
    content = fs.readFileSync(options.path);
  } else {
    content = options.content;
  }
  this.content = content;

}

Filter.prototype.extensions = ['js']


Filter.prototype.processString = function (fileContents, filePath) {
  return this.before ? this.content+fileContents : fileContents+this.content;
};
