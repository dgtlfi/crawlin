///////////////////////////////////////////////////////////////////////////////
// Create Party dialog

Template.createSpotDialog.events({
  'click .save': function (event, template) {
    result = Session.get('selectedYelpResult');
    count = Spots.find({permalink: Session.get('selectedPerm')}, {fields: {id:1}}).count();

    var name = result.name;
    var yelpID = result.id;
    var description = template.find(".description").value;
    var public = ! template.find(".private").checked;
    var lat = result.location.coordinate.latitude;
    var lng = result.location.coordinate.longitude;
    var latlng = {lat:lat, lng:lng};
    var permalink = Session.get('selectedPerm');
    var number = (parseInt(count)+1).toString();

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
          Session.set("showCreateSpotDialog", false)
          Modal.hide(Session.get('currentModal'));
          // Session.set("selectedEvent", this._id);

          var spot = Spots.findOne({permalink: permalink, number:number});
          if (spot) {
            Session.set("selectedSpot", spot._id);
            Session.set('activeSpot', spot.number);
            Session.set('spotYelpObj', spot.yelpObj);
          }
          
        }
        
      });
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

  showSpotSave: function(){
    return Session.get('showSpotSave');
  },

  // selectedYelpResult: function(){
  //   theResult = Session.get('yelpResult');
  // }

});



