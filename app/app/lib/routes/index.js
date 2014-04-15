var IndexRoute = Ember.Route.extend({
  model: function(){
      //return Ember.RSVP.reject('index error');
  },

  actions: {
    error: function(error) {
      console.log('ERROR INDEX HANDLING-------------------------');
      console.log(error);
      console.log('--------------------------------------');
    }

  }
});

export default IndexRoute;
