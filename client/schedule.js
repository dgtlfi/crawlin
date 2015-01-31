Template.schedule.events({

  'click a': function(){
    Session.set('selectedSpot', null);
    Session.set('activeSpot', null);
    Session.set('spotYelpObj', null);
  }
});

Template.schedule.helpers({
  maybeSelected: function () {
    var currentRoute = Router.current();
    return currentRoute &&
      this._id === currentRoute.params._id ? 'selected' : '';
  },
  
  // showStates: function(){
  //   var state = Meteor.call('getState', 'DC', function(error, result){
  //     console.log(result);
  //     return result;
  //   });
  // }

});