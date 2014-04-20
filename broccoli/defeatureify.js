var BroccoliFilter = require('broccoli-filter');
var defeatureify = require('defeatureify');


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


  var settings = this.options.options;

  if (!settings.enabled) {
    // format used at defeatureify/bin/cli
    settings.enabled = settings.features;
    delete settings.features;
  }
	this.options.defeatureifyOptions = settings;

}

Filter.prototype.extensions = ['js']

Filter.prototype.processString = function (fileContents, filePath) {

  return defeatureify(fileContents, this.options.defeatureifyOptions);

};
