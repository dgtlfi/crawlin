///////////////////////////////////////////////////////////////////////////////
// Create Party dialog

Template.newRsvp.events({
  'click .save': function (event, template) {
    var currentUser = Meteor.user()._id;
    var selectedPerm = Session.get('selectedPerm');
    var description = template.find(".description").value;
    try{
      var guestsNumber = parseInt(template.find("#guestsNumber").value);
    } catch(e){}
    var rsvpID = Session.get('rsvpID');
    if (rsvpID === 'yes'){
      Meteor.call('updateRsvpYes', {
        currentUser: currentUser,
        selectedPerm: selectedPerm,
        description: description,
        guestsNumber: guestsNumber,
        status: rsvpID,
        }, function(error, result){
          if(!error){
            $('body').removeClass('modal-open');
            Modal.hide(Session.get('currentModal'));
            // Session.set('showRsvpDialog', true);
            Session.set('disableRsvp', true);
            Session.set('currentModal', 'createRsvpDialog');
            Modal.show('createRsvpDialog');
          }
        }
      );
    } else if (rsvpID === 'maybe'){
      Meteor.call('updateRsvpMaybe', {
        currentUser: currentUser,
        selectedPerm: selectedPerm,
        description: description,
        status: rsvpID,
        }, function(error, result){
          if(!error){
            $('body').removeClass('modal-open');
            Modal.hide(Session.get('currentModal'));
            // Session.set('showRsvpDialog', true);
            Session.set('disableRsvp', true);
            Session.set('currentModal', 'createRsvpDialog');
            Modal.show('createRsvpDialog');
          }
        }
      );
    } else if (rsvpID === 'no'){
      Meteor.call('updateRsvpNo', {
        currentUser: currentUser,
        selectedPerm: selectedPerm,
        description: description,
        status: rsvpID,
        }, function(error, result){
          if(!error){
            $('body').removeClass('modal-open');
            Modal.hide(Session.get('currentModal'));
            // Session.set('showRsvpDialog', true);
            Session.set('disableRsvp', true);
            Session.set('currentModal', 'createRsvpDialog');
            Modal.show('createRsvpDialog');
          }
        }
      );
    }      
  },

  'click .delete': function () {
    var spotID = Session.get('selectedSpot');
    Meteor.call('deleteSpot', {
        spotID: spotID,
      });
    $('body').removeClass('modal-open');
    Modal.hide(Session.get('currentModal'));
    Session.set("showEditContentDialog", false);
  },

  'click .cancel': function () {
    $('body').removeClass('modal-open');
    Modal.hide(Session.get('currentModal'));
    Session.set("showEditContentDialog", false);
  },

  'click .modal-backdrop': function(){
    $('body').removeClass('modal-open');
    Modal.hide(Session.get('currentModal'));
    Session.set("showEditContentDialog", false);
  }
});

Template.newRsvp.helpers({
  createError: function(){
    return Session.get("createError");
  },

  rsvpTitle: function(){
    // console.log(Session.get('selectedSpot'));
    // console.log(Session.get('selectedPerm'));
    return Session.get('rsvpTitle');
  },

  rsvpComment: function(){
    // console.log(Session.get('selectedSpot'));
    // console.log(Session.get('selectedPerm'));
    return Session.get('rsvpComment');
  },

  rsvpPositive: function(){
    // This is to make sure we only show the total guests div if it's a yes or maybe but not no.
    return Session.get('rsvpPositive');
  },

});

Template.newRsvpDialog.helpers({
  showRsvpDialog: function(){
      return Session.get("showRsvpDialog");
  },
});
