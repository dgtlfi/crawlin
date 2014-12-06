

Template.crawls.helpers({
  showCreateDialog: function () {
    Session.set('currentModal', 'createModal');
    Modal.show('createModal')
    return Session.get("showCreateDialog");
  },
  showEditContentDialog: function () {
    Session.set('currentModal', 'createModal');
    Modal.show('createModal')
    return Session.get("showEditContentDialog");
  },

  

});

Template.createNew.helpers({
  showSpotDialog: function(){
    Session.set('currentModal', 'createModal');
    Modal.show('createModal')
    return Session.get("showCreateSpotDialog");
  },

});

Template.createNew.events({
  'click a.createNewSpot': function(event, template){
    Session.set('showCreateSpotDialog', true);
    Session.set('yelpResult', null);
  }
});


Template.spotDetails.helpers({

  showContent: function(){
    if (Session.get("selectedSpot")){
      // console.log(Session.get('selectedSpot'));
      // console.log(Spots.findOne(Session.get('selectedSpot')));
      return Spots.findOne(Session.get('selectedSpot'));
    }

  },
});
