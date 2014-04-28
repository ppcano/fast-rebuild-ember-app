moduleFor('controller:account', 'controller: account XXX', {

  teardown: function() {

    if ( window.App ) { 
      console.log('controller:account.reset ....');
      App.reset();
    }
  }
         
});
test('can access to controller property', function() {
  expect(1);
  var ctrl = this.subject();
  equal(ctrl.get('testValue'), 'ppcano');
});
