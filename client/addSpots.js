Template.addSpots.events({
  'click a.createNewSpotDialog': function(event, template){
    Session.set('showCreateSpotDialog', true);
    Session.set("showSearchContent", false);
    Session.set('currentModal', 'createNewSpotDialog');
    Modal.show('createNewSpotDialog');
  },

  'click .doneAdding': function (event, template) {
    Router.go('myEvents', {userID: Meteor.user()._id});
  },

  'click a.deleteSpot': function(event, template){
    var spotID = event.currentTarget.id;
    console.log(spotID);
    Meteor.call('deleteSpot', spotID);
  },

  'click a.editSpot': function(event, template){
    console.log('hi');
    var eventID = event.currentTarget.id;
    Session.set('selectedEvent', eventID);
    Session.set('showEditSpotDialog', true);
    Session.set('currentModal', 'editSpotDialog');
    Modal.show('editSpotDialog');
  },
});

Template.addSpots.rendered = function(){
  var el = document.getElementById('items');
  var sortable = new Sortable(el, {
    onStart: function (evt) {
        evt.oldIndex;  // element index within parent
        // console.log(evt.oldIndex+1);
    },
    onEnd: function (evt) {
        evt.oldIndex;  // element's old index within parent
        // console.log(evt.oldIndex);
        evt.newIndex;  // element's new index within parent
        // console.log(evt.newIndex+1);
        Session.set('newRowNumber', evt.newIndex + 1)
    },
    onUpdate: function (evt) {
        var itemEl = evt.item;  // dragged HTMLElement
        console.log(itemEl.id);
        // Meteor.call('updateSpotNumber', itemEl.id, Session.get('newRowNumber'), function (error, template){
        //   if(!error){
        //     console.log('successful update of row number');
        //   }else{
        //     console.log(error);
        //   }

        // }); 
        // + indexes from onEnd
    },
    onSort: function(evt){
      var itemEl = evt.item;
      console.log(itemEl);
    }

  });
  // var sortable = Sortable.create(el);
}