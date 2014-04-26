var BroccoliFilter = require('broccoli-filter');


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


  this.match = this.options.match;
  this.replacement = this.options.replacement;

}

Filter.prototype.extensions = ['js']

Filter.prototype.processString = function (fileContents, filePath) {
  return fileContents.replace(this.match, this.replacement);
};
