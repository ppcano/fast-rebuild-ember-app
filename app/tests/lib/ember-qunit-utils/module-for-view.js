
import moduleFor from 'ember-qunit/module-for';
import registerViews from 'app/initializers/register_views';

var moduleForView = function(name, description, callbacks) {

  moduleFor('view:' + name, description, callbacks, function(container, context, defaultSubject) {

    registerViews(container, 'app');

  });

};


export default moduleForView;
