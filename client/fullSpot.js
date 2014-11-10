Template.schedule.events({
  'click .createEvent': function (event, template) {
    Session.set("showCreateEventDialog", true);
  },
});

Template.fullSpot.helpers({
  showCreateDialog: function () {
    Session.set('currentModal', 'createModal');
    Modal.show('createModal')
    return Session.get("showCreateDialog");
  },
});

Template.crawls.helpers({

  showContent: function(){
    var data = Session.get("showContent")
    // console.log(data);
    return data;
  },
});
