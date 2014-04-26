// copy from ember-cli
(function() {
/* global define, Ember */
define('ember', [], function() {
  "use strict";

  require('ember-metal');
  require('ember-runtime');
  require('ember-handlebars-compiler');
  require('ember-handlebars');
  require('ember-views');
  require('ember-routing');
  require('ember-application');
  require('ember-extension-support');


  // ensure that the global exports have occurred for above
  // required packages
  requireModule('ember-metal');
  requireModule('ember-runtime');
  requireModule('ember-handlebars');
  requireModule('ember-views');
  requireModule('ember-routing');
  requireModule('ember-application');
  requireModule('ember-extension-support');

  // do this to ensure that Ember.Test is defined properly on the global
  // if it is present.
  if (Ember.__loader.registry['ember-testing']) {
    requireModule('ember-testing');
  }

  return {
    'default': Ember
  };
});
})();
