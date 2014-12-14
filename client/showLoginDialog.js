///////////////////////////////////////////////////////////////////////////////
// Create Party dialog

Template.showLoginDialog.events({

  'click .cancel': function () {
    $('body').removeClass('modal-open');
    Modal.hide(Session.get('currentModal'));
    Session.set("show_LoginDialog", false);
  },

  'click .modal-backdrop': function(){
    $('body').removeClass('modal-open');
    Modal.hide(Session.get('currentModal'));
    Session.set("show_LoginDialog", false);
  },

});



