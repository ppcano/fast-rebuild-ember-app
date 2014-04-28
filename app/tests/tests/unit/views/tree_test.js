
moduleForView('tree', 'view:tree', {
  teardown: function() {
    if ( window.App ) { 
      App.reset();
    }
  }
});

test('can access to component property', function() {
  expect(1);
  var component = this.subject();
  equal(!!component, true);
});
