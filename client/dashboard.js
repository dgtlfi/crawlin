

Template.dashboard.helpers({
  activeIfTemplateIs: function (template) {
    var currentRoute = Router.current();
    return currentRoute &&
      template === currentRoute.lookupTemplate() ? 'active' : '';
  },

  currentUserID: function(){
    if (Meteor.user()){
      return Meteor.user()._id;
    }
  },

  showDeleteEventDialog: function(){
    return Session.get("showCreateSpotDialog");
  },

});

Template.dashboard.events({
  'click .createNewEvent': function (event, template) {
    Session.set('selectedNewPerm', null);
  },

  'click a.deleteEvent': function(event, template){
      Session.set('selectedEvent', event.currentTarget.id);
      Session.set('currentModal', 'deleteEventDialog');
      Session.set("showDeleteEventDialog", true);
      Modal.show('deleteEventDialog');
      
    },

  'click a.editEvent': function(event, template){
      Session.set('selectedEvent', event.currentTarget.id);
    },
  
});

Template.dashboard.rendered = function(){
  /* swap open/close side menu icons */
  $('[data-toggle=collapse]').click(function(){
      // toggle icon
      $(this).find("i#chevron").toggleClass("glyphicon-chevron-right glyphicon-chevron-down");
  });
}










