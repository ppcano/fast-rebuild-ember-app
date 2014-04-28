
var run = Ember.run;
moduleForComponent('app-person', 'app-person', {
  teardown: function() {

    console.log('app-person.setup:');
    if ( App ) { 
      console.log('app-person.reset ....');
      App.reset();
    }
  }
});
/*
test('can access to component property', function() {
  expect(1);
  var component = this.subject();
  equal(component.get('name'), 'ppcano');
});
*/
test('component is inserted in the DOM', function() {
  expect(4);
  
  var component = this.subject();

  equal(component.get('name'), 'ppcano');
  equal($.trim(this.$().text()), 'Name: ppcano');


  run(function(){
    component.set('name','red');
  });
  equal(component.get('name'), 'red');


  equal($.trim(this.$().text()), 'Name: red');

});


test('component is inserted in the DOM 2', function() {
  expect(4);
  
  var component = this.subject();

  equal(component.get('name'), 'ppcano');
  equal($.trim(this.$().text()), 'Name: ppcano');


  run(function(){
    component.set('name','white');
  });
  equal(component.get('name'), 'white');


  equal($.trim(this.$().text()), 'Name: white');

});
