///////////////////////////////////////////////////////////////////////////////
// Create Party dialog

Template.showLoginDialog.events({

  'click .cancel': function () {
    $('body').removeClass('modal-open');
    Session.set("show_LoginDialog", false);
    Modal.hide(Session.get('currentModal'));
    
  },

  'click .modal-backdrop': function(){
    $('body').removeClass('modal-open');
    Session.set("show_LoginDialog", false);
    Modal.hide(Session.get('currentModal'));
    
  },

});



