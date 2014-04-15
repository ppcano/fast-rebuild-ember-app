var fs = require('fs');


module.exports = function(input, output) {

  var result = "(function() {\nvar Ember = { assert: function() {}, FEATURES: { isEnabled: function() {} } };\n"

  var content = fs.readFileSync(input, {encoding: 'UTF-8'});
  content = content.replace('import Ember from "ember-metal/core";','');
  content = content.replace('export default EmberHandlebars;','');

  result += content;
  result += "\nexports.precompile = EmberHandlebars.precompile;"
  result += "\nexports.EmberHandlebars = EmberHandlebars;"
  result += "\n})();"

  fs.writeFileSync(output, result);
};

