///////////////////////////////////////////////////////////////////////////////
// Create Party dialog

Template.editSpotDialog.events({
  'click .save': function (event, template) {
    
    var eventID = Session.get('selectedEvent');
    var yelpID = Session.get('selectedYelp');
    var description = template.find(".description").value;
    // var public = ! template.find(".private").checked;
    // console.log(spotID);
    // console.log(description);


    if (typeof description === "string" && description.length) {
      Meteor.call('updateSpot', {
        yelpID: yelpID,
        eventID: eventID,
        description: description,
        // public: public,
      }, function (error, response) {
        if (! error) {
          // console.log('createSpot Error')
          // console.log(this._id);
          // console.log(response);
          $('body').removeClass('modal-open');
          Modal.hide(Session.get('currentModal'));
          Session.set("showEditSpotDialog", false);
          
        }else{
          console.log(error);
        }
      });
      
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

Template.editSpotDialog.helpers({
  createError: function(){
    return Session.get("createError");
  },

  selectedSpot: function(){
    // console.log(Session.get('selectedSpot'));
    // console.log(Session.get('selectedPerm'));
    return Spots.findOne({yelpID: Session.get('selectedYelp')});
  }, 
});

