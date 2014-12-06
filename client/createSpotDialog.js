///////////////////////////////////////////////////////////////////////////////
// Create Party dialog

Template.createSpotDialog.events({
  'click .save': function (event, template) {
    result = Session.get('selectedYelpResult');

    var name = result.name;
    var yelpID = result.id;
    var description = template.find(".description").value;
    var public = ! template.find(".private").checked;
    var lat = result.location.coordinate.latitude;
    var lng = result.location.coordinate.longitude;
    var latlng = {lat:lat, lng:lng};
    // var eventID = Session.get('selectedEvent')._id;
    var permalink = Session.get('selectedPerm');
    var number = template.find(".number").value;
    // console.log('permalink');
    // console.log(permalink);
    // console.log(latlng);

    if (name.length && description.length) {
      Meteor.call('createSpot', {
        name: name,
        yelpID: yelpID,
        description: description,
        latlng: latlng,
        public: public,
        // eventID: eventID,
        permalink: permalink,
        number: number,
        yelpObj: result,
      }, function (error, template) {
        if (! error) {
          $('body').removeClass('modal-open');
          Modal.hide(Session.get('currentModal'));
          // Session.set("selectedEvent", this._id);
        }
        // console.log(this._id);
      });
      Session.set("showCreateEventDialog", false);
    } else {
      Session.set("createError",
                  "It needs a Name and a Description");
    }
  },

  'click .cancel': function () {
    $('body').removeClass('modal-open');
    Modal.hide(Session.get('currentModal'));
    Session.set("showCreateSpotDialog", false);
  },

  'click .modal-backdrop': function(){
    $('body').removeClass('modal-open');
    Modal.hide(Session.get('currentModal'));
    Session.set("showCreateSpotDialog", false);
  },

  'keypress .searchTerm': function (evt, template) {
    if (evt.which === 13) {
      var term = template.find(".searchTerm").value;
      
      Meteor.call("searchYelp", term, false, function(error, results) {
        if(results){
          
          var theResult = JSON.parse(results.content).businesses;
          Session.set('yelpResult', theResult);
          // console.log(theResult);
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
    // console.log('click');
    Session.set("restItemClicked", true)
    // console.log(evt.target.id);
    // var restName = template.find("a").firstChild.nextSibling.data;
    var restID = evt.target.id;
    // console.log(restID);
    Session.set('selectedYelpID', restID);
    theResult = Session.get('yelpResult');
    console.log(theResult);
    theResult.forEach(function(result){
      if (result.id == restID){
        Session.set('selectedYelpResult', result);
      }
    });

  },

});

Template.createSpotDialog.helpers({
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
      return 'selected' 
    }
  },

  // selectedYelpResult: function(){
  //   theResult = Session.get('yelpResult');
  // }

});



