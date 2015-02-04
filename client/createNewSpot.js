///////////////////////////////////////////////////////////////////////////////
// Create Party dialog

Template.createNewSpotDialog.events({
  

  'submit form':function(event,template){
    event.preventDefault();
    template.find("form").reset();
  },

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

  'click #yelpSearch': function(event, template){
    event.preventDefault();
    Session.set("showSearchContent", false);
  },

  'click #addrSearch': function(event, template){
    event.preventDefault();
    Session.set("showSearchContent", true);
  },

  

  

});

Template.createNewSpotDialog.helpers({
  createError: function(){
    return Session.get("createError");
  },
  showSearchContent: function(){
    return Session.get('showSearchContent');
  },

});

Template.yelpContent.helpers({
  showSpotSave: function(){
    return Session.get('showSpotSave');
  },
  createError: function(){
    return Session.get("createError");
  },

  yelpResults: function () {
    theResult = Session.get('yelpResult');
    // console.log(theResult);
    return theResult;
  },

  maybeSelected: function () {
    if (Session.get('restItemClicked')){
      return 'selected'; 
    }
  },

});

Template.yelpContent.events({
  'click .save': function (event, template) {
    result = Session.get('selectedYelpResult');
    eventID = Session.get('selectedEvent');
    // console.log(eventID);
    count = Spots.find({eventID: eventID}, {fields: {id:1}}).count();

    var name = result.name;
    var yelpID = result.id;
    var description = template.find(".description").value;
    // var public = ! template.find(".private").checked;
    var lat = result.location.coordinate.latitude;
    var lng = result.location.coordinate.longitude;
    var latlng = {lat:lat, lng:lng};
    var evt = Events.findOne({_id: eventID});
    Session.set('selectedPerm', evt.permalink);
    var number = (parseInt(count)+1).toString();

    if (name.length && description.length) {
      Meteor.call('createSpot', {
        name: name,
        yelpID: yelpID,
        description: description,
        latlng: latlng,
        permalink: evt.permalink,
        number: number,
        yelpObj: result,
        eventID: eventID,
      }, function (error, template) {
        if (! error) {
          $('body').removeClass('modal-open');
          Session.set("showCreateSpotDialog", false);
          Modal.hide(Session.get('currentModal'));
        }else{
          console.log('error');
        }
        $('body').removeClass('modal-open');
        Session.set("showCreateSpotDialog", false);
        Modal.hide(Session.get('currentModal'));
      });
    } else {
      Session.set("createError",
                  "It needs a Name and a Description");
    }
  },

  

  'keypress .searchTerm': function (evt, template) {
    if (evt.which === 13) {
      var term = template.find(".searchTerm").value;
      console.log(term);
      Meteor.call("searchYelp", term, false, function(error, results) {
        if(results){
          
          var theResult = JSON.parse(results.content).businesses;
          Session.set('yelpResult', theResult);
          // console.log(theResult);
        }
      });      
    }
  },

  'click .searchButton': function (evt, template) {
    function yelpFix( str ){
      // console.log(str);
      var ret = str;
      ret = ret.replace( /ø/g, 'oe' );
      ret = ret.replace( /Ø/g, 'OE' );
      ret = ret.replace( /å/g, 'aa' );
      ret = ret.replace( /Å/g, 'AA' );
      ret = ret.replace( /æ/g, 'ae' );
      ret = ret.replace( /Æ/g, 'AE' );
      ret = ret.replace( /\_/g, '-' );

      ret = ret.replace(/[^a-zA-Z0-9\/-]/ig,'+').replace(/_+/ig,'+').replace(/[-]{2,}/g, '+').toLowerCase();

      return ret;
    }
    evt.preventDefault();
    var term = template.find(".searchTerm").value;
    var city = template.find(".searchCity").value;
    if (city){
      fixedCity = yelpFix(city);
      Meteor.call("searchYelp", term, false, city=fixedCity, function(error, results) {
        if(results){
          // console.log("results");
          var theResult = JSON.parse(results.content).businesses;
          Session.set('yelpResult', theResult);
        }
      });

    } else{ 
      console.log(term);
      Meteor.call("searchYelp", term, false, function(error, results) {
        if(results){
          
          var theResult = JSON.parse(results.content).businesses;
          Session.set('yelpResult', theResult);
          console.log(theResult);
        }
      });
    }
  },

  'keypress .searchCity': function (evt, template) {
    function yelpFix( str ){
      // console.log(str);
      var ret = str;
      ret = ret.replace( /ø/g, 'oe' );
      ret = ret.replace( /Ø/g, 'OE' );
      ret = ret.replace( /å/g, 'aa' );
      ret = ret.replace( /Å/g, 'AA' );
      ret = ret.replace( /æ/g, 'ae' );
      ret = ret.replace( /Æ/g, 'AE' );
      ret = ret.replace( /\_/g, '-' );

      ret = ret.replace(/[^a-zA-Z0-9\/-]/ig,'+').replace(/_+/ig,'+').replace(/[-]{2,}/g, '+').toLowerCase();

      return ret;
    }

    if (evt.which === 13) {
      var term = template.find(".searchTerm").value;
      var city = template.find(".searchCity").value;
      // console.log(city);
      // yelpFix(city)
      // console.log(yelpFix(city));
      fixedCity = yelpFix(city);
      Meteor.call("searchYelp", term, false, city=fixedCity, function(error, results) {
        if(results){
          // console.log("results");
          var theResult = JSON.parse(results.content).businesses;
          Session.set('yelpResult', theResult);
        }
      });
    }
  },

  'click a': function (evt, template) {
    Session.set('showSpotSave', true);
    Session.set("restItemClicked", true);
    //Yelp Restaurant ID
    var restID = evt.target.id;
    Session.set('selectedYelpID', restID);
    //This is the Yelp Obj
    theResult = Session.get('yelpResult');
    theResult.forEach(function(result){
      if (result.id == restID){
        Session.set('selectedYelpResult', result);
      }
    });

  },

  'submit form':function(event,template){
    event.preventDefault();
    template.find("form").reset();
  },

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

});

Template.searchContent.events({
  'click .saveAddrSearch': function(event, template){
      var addr = template.find(".searchAddress").value;
      console.log(addr);
    },

  'keypress .searchAddress': function (evt, template) {
    if (evt.which === 13) {
      var term = template.find(".searchAddress").value;
      console.log(term);
      
    }
  },

  'submit form':function(event,template){
    event.preventDefault();
    template.find("form").reset();
  },

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
});




