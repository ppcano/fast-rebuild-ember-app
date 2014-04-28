
import registerViews from 'app/initializers/register_views';


export default {
  name: 'register-views',

  initialize: function(container, application) {
    registerViews(container, 'app');
  }
};
