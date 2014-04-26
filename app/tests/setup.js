require('ember');
require('ember-qunit/main').globalize();

require('app/templates');

var AppResolver = require('app/system/resolver')['default'];


/* unit test does not really need the application when https://github.com/stefanpenner/ember-jj-abrams-resolver/issues/41
 
  Ember.setupForTesting();
  var resolver = AppResolver.create({
    modulePrefix: 'app'
  });

 TODO:
   make test unit
   make test integration
*/


require('app');
Ember.ENV.LOG_MODULE_RESOLVER = false;
App.rootElement = '#ember-testing';
App.setupForTesting();
App.injectTestHelpers();
var namespace = App;
var resolver = AppResolver.create({
  namespace: namespace
});

setResolver(resolver);
