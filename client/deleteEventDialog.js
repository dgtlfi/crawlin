///////////////////////////////////////////////////////////////////////////////
// Create Party dialog

Template.deleteEventDialog.events({

  'click .submitDelete': function () {
    var eventID = {eventID: Session.get('selectedEvent')};
    Meteor.call('deleteEvent', eventID);
  },

  'click .cancel': function () {
    $('body').removeClass('modal-open');
    Modal.hide(Session.get('currentModal'));
    Session.set("showDeleteEventDialog", false);
  },

  'click .modal-backdrop': function(){
    $('body').removeClass('modal-open');
    Modal.hide(Session.get('currentModal'));
    Session.set("showDeleteEventDialog", false);
  },

});



