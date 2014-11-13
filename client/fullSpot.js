

Template.crawls.helpers({
  showCreateDialog: function () {
    Session.set('currentModal', 'createModal');
    Modal.show('createModal')
    return Session.get("showCreateDialog");
  },
  showEditContentDialog: function () {
    Session.set('currentModal', 'createModal');
    Modal.show('createModal')
    return Session.get("showEditContentDialog");
  },
});



Template.spotDetails.helpers({

  showContent: function(){
    if (Session.get("selectedSpot")){
      // console.log(Session.get('selectedSpot'));
      // console.log(Spots.findOne(Session.get('selectedSpot')));
      return Spots.findOne(Session.get('selectedSpot'));
    }

  },
});

//kh js-------------
$(document).ready(function(){

  $(".leaflet-marker-icon .public").click(function() {
    console.log("it clicked once!");
  });
  
});
