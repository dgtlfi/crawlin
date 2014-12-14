///////////////////////////////////////////////////////////////////////////////
// Create Party dialog

Template.createRsvpDialog.events({

  'click .cancel': function () {
    $('body').removeClass('modal-open');
    Modal.hide(Session.get('currentModal'));
    Session.set("showRsvpError", false);
  },

  'click .modal-backdrop': function(){
    $('body').removeClass('modal-open');
    Modal.hide(Session.get('currentModal'));
    Session.set("showRsvpError", false);
  },

});



