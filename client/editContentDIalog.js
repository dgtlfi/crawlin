///////////////////////////////////////////////////////////////////////////////
// Create Party dialog

Template.editContentDialog.events({
  'click .save': function (event, template) {
    
    var name = template.find(".name").value;
    var description = template.find(".description").value;
    var public = ! template.find(".private").checked;
    var latlng = Session.get("createCoords");
    var eventID = Session.get('selectedEvent')._id;
    var number = template.find(".number").value;
    var spotID = Session.get('selectedSpot');
    // console.log(spotID);
    // console.log(number);

    if (name.length && description.length) {
      Meteor.call('updateSpot', {
        spotID: spotID,
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
      Session.set("showEditContentDialog", false);
    } else {
      Session.set("createError",
                  "It needs a Name and a Description");
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

Template.editContentDialog.helpers({
  createError: function(){
    return Session.get("createError");
  },
});

