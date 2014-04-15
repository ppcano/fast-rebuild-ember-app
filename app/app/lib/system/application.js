
import EmberApp from "ember-application/system/application";
import Resolver from 'app/system/resolver';
import Router from 'app/system/router';

Ember.ENV.LOG_MODULE_RESOLVER = true;

var App = EmberApp.extend({
  LOG_ACTIVE_GENERATION: false,
  // LOG_TRANSITIONS: true,
  // LOG_TRANSITIONS_INTERNAL: true,
  //LOG_VIEW_LOOKUPS: true,
  
  // ember-jj-abrams-resolver
  modulePrefix: 'app',
  Resolver: Resolver,
  Router: Router
});

export default App;
