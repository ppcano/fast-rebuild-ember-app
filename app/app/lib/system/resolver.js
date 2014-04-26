
//import {DefaultResolver} from "ember-application/system/resolver";
// ember-jj-abrams-resolver
import DefaultResolver from "ember/resolver";

var AppResolver = DefaultResolver.extend({
  modulePrefix: 'app'
});

export default AppResolver;
