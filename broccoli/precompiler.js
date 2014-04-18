
var BroccoliFilter = require('broccoli-filter'),
    fs = require('fs');
//var jsStringEscape = require('js-string-escape');


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

  if ( !this.module ) {
    throw new Error('set prototype.module with CreatePrecompilerModule');
  }
}

Filter.prototype.extensions = ['handlebars', 'hbs', 'js']


Filter.prototype._precompileInlineTemplate = function (data) {

  var pattern = /(defaultTemplate(?:\s*=|:)\s*)precompileTemplate\(['"](.*)['"]\)/;
  var self = this;
  return data.replace(pattern, function(match, p1, p2) {
    var precompiledData = self.module.precompileEmberHandlebars(p2);
    return [p1, 'Ember.Handlebars.template(', precompiledData, ')'].join('');
  });

}

Filter.prototype._precompileTemplate = function (templateName, data) {
  var precompiledData = this.module.precompileEmberHandlebars(data);
  return "\nEmber.TEMPLATES['"+templateName+"'] = Ember.Handlebars.template("+precompiledData+");\n"
}

Filter.prototype.processString = function (fileContents, filePath) {

  var gen = this.options.templateNameGenerator;
  if (gen) {
    return this._precompileTemplate(gen(filePath), fileContents);  
  } else {
    return this._precompileInlineTemplate(fileContents);
  }

};

var CreatePrecompilerModule = function(compilerPath, handlebarsPath) {

  var result = "function require() {\n";
  result += fs.readFileSync(handlebarsPath)+';\n';
  result += "return Handlebars;\n";
  result += "}\n";
  result += fs.readFileSync(compilerPath)+'\n';
  result += "function precompileEmberHandlebars(string) {\n";
  result += "return exports.precompile(string).toString();\n";
  result += "}\n";
  result += "exports.precompileEmberHandlebars = precompileEmberHandlebars;\n";


  var m = new module.constructor();
  m._compile(result);
  return m.exports;
};


module.exports = {
  Filter: Filter,
  CreatePrecompilerModule: CreatePrecompilerModule
};
