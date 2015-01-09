

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
  },

});

Template.rsvp.helpers({
  showRsvpDialog: function(){
    Session.set('currentModal', 'rsvpModal');
    Modal.show('rsvpModal')
    return Session.get("showRsvpDialog");
  },

  showRsvpError: function(){
    Session.set('currentModal', 'rsvpErrorModal');
    Modal.show('rsvpErrorModal')
    return Session.get("showRsvpError");
  },

  show_LoginDialog: function(){
    Session.set('currentModal', 'loginModal');
    Modal.show('loginModal')
    return Session.get("show_LoginDialog");
  },

  disabled: function(){
    if (Session.get('disableRsvp')){
      return 'disabled';
    }
  }


});


Template.rsvp.rendered = function(){
  var currentUser = Meteor.user();
  var permalink = Session.get('selectedPerm');
  var alreadyRsvpd = Events.findOne({permalink:permalink, rsvpd: currentUser})
  if (alreadyRsvpd){
    Session.set('disableRsvp', true);
  }
}

Template.rsvp.events({
  'click .RSVP': function(event, template){
    var currentUser = Meteor.user();
    var permalink = Session.get('selectedPerm');
    if (! currentUser){
      Session.set('show_LoginDialog', true);
    }else{
      var alreadyRsvpd = Events.findOne({permalink:permalink, rsvpd: currentUser})
      if (alreadyRsvpd){
        Session.set('disableRsvp', true);
        Session.set('showRsvpError', true);
      } else{ 
        Meteor.call('updateRsvp', {
          currentUser: currentUser,
          permalink: permalink,
          }, function(error, result){
            if(!error){
              Session.set('showRsvpDialog', true);
              Session.set('disableRsvp', true);
            }
          }
          
        );
      }
      
    }
    
  },

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

Template.spotYelpInfo.helpers({

  yes: function(){
      spotYelpObj = Session.get('spotYelpObj');
      return spotYelpObj;
    
    },
});



// Template.feed.helpers({

// });

// Template.feed.rendered =  function(){

//   var selectedPerm = Session.get('selectedPerm');
//   console.log('hiInsta');
//   // var result = Meteor.call('searchInsta', selectedPerm);
//   Meteor.call('searchInsta', selectedPerm, function(error, result) {
//     console.log(error);
//     console.log(result);
           
//   });
// }
