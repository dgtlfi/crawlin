Template.schedule.events({
  'click .createEvent': function (event, template) {
    Session.set("showCreateEventDialog", true);
  },
});

Template.schedule.helpers({
  maybeSelected: function () {
    var currentRoute = Router.current();
    return currentRoute &&
      this._id === currentRoute.params._id ? 'selected' : '';
  },
  showCreateEventDialog: function () {
    Modal.show('createEventModal')
    Session.set('currentModal', 'createEventModal');
    return Session.get("showCreateEventDialog");
  },

});