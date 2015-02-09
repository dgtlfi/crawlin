///////////////////////////////////////////////////////////////////////////////
// Create Party dialog

Template.createNewEvent.events({
  'click .save': function (event, template) {
    function prototype( str, repChar ){
        var ret = str.trim();
        ret = ret.replace( /ø/g, 'oe' );
        ret = ret.replace( /Ø/g, 'OE' );
        ret = ret.replace( /å/g, 'aa' );
        ret = ret.replace( /Å/g, 'AA' );
        ret = ret.replace( /æ/g, 'ae' );
        ret = ret.replace( /Æ/g, 'AE' );
        ret = ret.replace( /\_/g, '-' );

        ret = ret.replace(/[^a-zA-Z0-9\/-]/ig, repChar).replace(/_+/ig,repChar).replace(/[-]{2,}/g, repChar).toLowerCase();

        return ret;
    }
    function firstUpper( str ){
      if (typeof str === "string"){
        var lowerString = str.trim().toLowerCase();
        var upperChar = lowerString.charAt(0).toUpperCase();
        var fixedString = upperChar + lowerString.substr(1);
        return fixedString;
      } else{
        return str;
      }
    }
    var timeRegEx = /^\d{2}:\d{2}$/
    var stateRegEx = /^[A-Za-z]{2}$/


    /// Start of variables to go to Method Call
    var titleInput = template.find(".title").value;
    var titleList = [];
    titleInput.split(' ').forEach(function(word){
      titleList.push(firstUpper(word));
    });
    var title = titleList.join(" ");
    var description = template.find(".description").value;
    var tag = prototype(template.find(".tag").value, '_');
    // var public = ! template.find(".private").checked;
    
    var date = moment($('#my-datepicker').datepicker('getDate')).format("MMMM Do, YYYY");
    if (date=='Invalid Date'){
      Session.set('createError', "You must select a date.")
      throw new Meteor.Error(400, "No Date Format");
    }
    var dbDate = moment($('#my-datepicker').datepicker('getDate')).format();
    
    var permalink = prototype(title, '-');
    
    var city = firstUpper(template.find(".city").value);
    var state = (template.find(".state").value).toUpperCase();
    if (!state.match(stateRegEx)){
      Session.set('createError', "The State format you entered is incorrect. Please use it's two letter abbreviation.")
      throw new Meteor.Error(400, "Wrong State Format");
    }
    // Looking up ZIP to see if city and state are correct
    //If no zips come back then the city, state combo are wrong 
    var zips = Meteor.call('lookupZip', city, state, function(error, result){
      
      if (result == ''){
        console.log(result);
        Session.set('createError', "I couldn't verify your City and/or State.")
        throw new Meteor.Error(400, "Wrong City, State Format");
      }
    });
    
    
    var startTime = template.find(".startTime").value;
    var endTime = template.find(".endTime").value;
    if (!startTime.match(timeRegEx) || !endTime.match(timeRegEx)){
      Session.set('createError', "The Time format you entered is incorrect. Please use HH:MM.")
      throw new Meteor.Error(400, "Wrong Time Format");
    }
    var startPM = template.find(".startPM").checked;
    var endPM = template.find(".endPM").checked;

    if (startPM){
      var finalStartTime = (startTime + "pm"); 
    } else{
      var finalStartTime = (startTime + "am");
    }
    if (endPM){
      var finalEndTime = (endTime + "pm"); 
    } else{
      var finalEndTime = (endTime + "am");
    }

    if (title.length && description.length) {
      Meteor.call('createEvent', {
        title: title,
        description: description,
        permalink: permalink,
        date: date,
        dbDate: dbDate,
        // public: public, 
        city: city,
        state: state,
        startTime: startTime,
        startPM: startPM,
        finalStartTime: finalStartTime,
        endTime: endTime,
        endPM: endPM,
        finalEndTime: finalEndTime,
        tag: tag,
      }, function (error, response) {
        if (! error) {
          Session.set('selectedNewPerm', null);
          Router.go('addSpots', {userID: Meteor.user()._id, eventID: response });
        }
        // console.log(this._id);
      });
    } else {
      Session.set("createError",
                  "It needs a Name and a Description");
    }
  },

  // 'click a.createNewSpotDialog': function(event, template){

  //   function prototype( str, repChar ){
  //       var ret = str.trim();
  //       ret = ret.replace( /ø/g, 'oe' );
  //       ret = ret.replace( /Ø/g, 'OE' );
  //       ret = ret.replace( /å/g, 'aa' );
  //       ret = ret.replace( /Å/g, 'AA' );
  //       ret = ret.replace( /æ/g, 'ae' );
  //       ret = ret.replace( /Æ/g, 'AE' );
  //       ret = ret.replace( /\_/g, '-' );

  //       ret = ret.replace(/[^a-zA-Z0-9\/-]/ig, repChar).replace(/_+/ig,repChar).replace(/[-]{2,}/g, repChar).toLowerCase();

  //       return ret;
  //   }
  //   function firstUpper( str ){
  //     var lowerString = str.trim().toLowerCase();
  //     var upperChar = lowerString.charAt(0).toUpperCase();
  //     var fixedString = upperChar + lowerString.substr(1);
  //     return fixedString;
  //   }

  //   var title = firstUpper(template.find(".title").value);
  //   var permalink = prototype(title, '-');
  //   Session.set('selectedNewPerm', permalink);
  //   Session.set('showCreateSpotDialog', true);
  //   Session.set('currentModal', 'createNewSpotDialog');
  //   Modal.show('createNewSpotDialog');
  // },

  'submit form':function(event,template){
    event.preventDefault();
    template.find("form").reset();
    // var routeURL = Router.current().url;
    // var finalURL = routeURL.split('create');
    // window.location = finalURL[0] + "events";
  },

  'click a.deleteSpot': function(event, template){
    var spotID = {spotID: event.currentTarget.id};
    Meteor.call('deleteSpot', spotID);
  },

});

Template.createNewEvent.helpers({
  createError: function(){
    return Session.get("createError");
  },

  showCreateNewSpot: function(){
    
    return Session.get("showCreateSpotDialog");
  },
});

Template.createNewEvent.rendered = function(){
  $('#my-datepicker').datepicker({
    todayBtn: "linked",
    orientation: "auto",
    todayHighlight: true,
    });
}

