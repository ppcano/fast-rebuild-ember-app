var ApplicationRoute = Ember.Route.extend({
  
  actions: {
    error: function(error) {
      console.log(error);
    }
  }

});

export default ApplicationRoute;
