///////////////////////////////////////////////////////////////////////////////
// Create Party dialog

Template.createDialog.events({
  'click .save': function (event, template) {
    
    var name = template.find(".name").value;
    var description = template.find(".description").value;
    var public = ! template.find(".private").checked;
    var latlng = Session.get("createCoords");
    var eventID = Session.get('selectedEvent')._id;
    var number = template.find(".number").value;
    // console.log('number');
    // console.log(number);

    if (name.length && description.length) {
      Meteor.call('createSpot', {
        name: name,
        description: description,
        latlng: latlng,
        public: public,
        eventID: eventID,
        number: number,
      });
      // function (error, template) {
      //   if (! error) {
      //     // console.log('createSpot Error')
      //     // console.log(this._id);
          
      //   }
      // )};
      $('body').removeClass('modal-open');
      Session.set("showCreateDialog", false);
    } else {
      Session.set("createError",
                  "It needs a Name and a Description");
    }
  },

  'click .cancel': function () {
    $('body').removeClass('modal-open');
    Modal.hide(Session.get('currentModal'));
    Session.set("showCreateDialog", false);
  },

  'click .modal-backdrop': function(){
    $('body').removeClass('modal-open');
    Modal.hide(Session.get('currentModal'));
    Session.set("showCreateDialog", false);
  }
});

Template.createDialog.helpers({
  createError: function(){
    return Session.get("createError");
  }
});

