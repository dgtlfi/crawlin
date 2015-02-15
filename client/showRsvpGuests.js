///////////////////////////////////////////////////////////////////////////////
// Create Party dialog

Template.showRsvpGuests.events({

  'click .cancel': function (event, template) {
    event.preventDefault();
    // $(".modalClass").remove();
    $('body').removeClass('modal-open');
    Modal.hide(Session.get('currentModal'));
    Session.set("showCreateSpotDialog", false);
  },

  'click .modal-backdrop': function(event, template){
    event.preventDefault();
    // $(".modalClass").remove();
    $('body').removeClass('modal-open');
    Modal.hide(Session.get('currentModal'));
    Session.set("showCreateSpotDialog", false);
  },

  'click #rsvpYes': function(event, template){
    event.preventDefault();
    Session.set("guestID", 'yes');
  },

  'click #rsvpMaybe': function(event, template){
    event.preventDefault();
    Session.set("guestID", 'maybe');
    // Session.set('rsvpYes', 'inactive');
    // Session.set('rsvpMaybe', 'active');
    // Session.set('rsvpNo', 'inactive');
  },

  'click #rsvpNo': function(event, template){
    event.preventDefault();
    Session.set("guestID", 'no');
    // Session.set('Yes', 'inactive');
    // Session.set('Maybe', 'inactive');
    // Session.set('No', 'active');
  },

  

});

Template.showRsvpGuests.helpers({
  yesStatus: function(template){
    console.log(Session.get('Yes'));
    return Session.get('Yes');
  },
  maybeStatus: function(template){
    console.log(Session.get('Maybe'));
    return Session.get('Maybe');
  },
  noStatus: function(template){
    console.log(Session.get('No'));
    return Session.get('No');
  },

});



Template.guestList.helpers({
  yesList: function(){
    var guestID = Session.get("guestID");
    if (guestID){
      if (guestID === 'yes'){
        var selectedPerm = Session.get('selectedPerm');
        // console.log(guestID);
        evt = Events.findOne({permalink: selectedPerm});
        // console.log(evt);
        if (evt){
          // console.log(evt.rsvpdYes);
          return evt.rsvpdYes;
        }
        
      }
    }
    
  },
  maybeList: function(){
    var guestID = Session.get("guestID");
    if (guestID){
      if (guestID === 'maybe'){
        var selectedPerm = Session.get('selectedPerm');
        // console.log(guestID);
        evt = Events.findOne({permalink: selectedPerm});
        // console.log(evt);
        if (evt){
          // console.log(evt.rsvpdMaybe);
          return evt.rsvpdMaybe;
        }
        
      }
    }
  },
  noList: function(){
    var guestID = Session.get("guestID");
    if (guestID){
      if (guestID === 'no'){
        var selectedPerm = Session.get('selectedPerm');
        // console.log(guestID);
        evt = Events.findOne({permalink: selectedPerm});
        // console.log(evt);
        if (evt){
          // console.log(evt.rsvpdNo);
          return evt.rsvpdNo;
        }
        
      }
    }
  }

});