
function registerViews(container, prefix) {

  var initializersRegExp = new RegExp(prefix + '/views');
  Ember.keys(requirejs._eak_seen).filter(function(key) {
    return initializersRegExp.test(key);
  }).forEach(function(moduleName) {
    //console.log('view: '+moduleName);
    var module = require(moduleName, null, null, true);
    if (!module) { throw new Error(moduleName + ' missing.'); }

    var viewName = moduleName.replace('/'+prefix + '/views/', '');
    container.register('view:'+viewName, module);
  });

};

export default registerViews;
