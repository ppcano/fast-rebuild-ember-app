module("Integration Index", {
  teardown: function() {

    console.log('integration.setup:');
    if ( App ) { 
      console.log('running Integration tests');
      App.reset();
    }
  }
});

test('clicking on the account button transition to account route', function() {
  expect(1);

  visit('/');
  click('#account-link');

  andThen(function() {
    equal(currentRouteName(), 'account');
  });
  

});


test('clicking on the account button transition to account route 2', function() {
  expect(1);

  visit('/');
  click('#account-link');

  andThen(function() {
    equal(currentRouteName(), 'account');
  });
  

});

test('clicking on the account button transition to account route 3', function() {
  expect(1);

  visit('/');
  click('#account-link');

  andThen(function() {
    equal(currentRouteName(), 'account');
  });
  

});
