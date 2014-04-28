
var Tree = Ember.ContainerView.extend({

  currentView: Em.View.extend({

    didInsertElement: function() {
      this.$().text('tree view');
    }

  })

});

export default Tree;
