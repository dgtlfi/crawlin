///////////////////////////////////////////////////////////////////////////////
// Create Party dialog

Template.editEvent.events({
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
      var lowerString = str.trim().toLowerCase();
      var upperChar = lowerString.charAt(0).toUpperCase();
      var fixedString = upperChar + lowerString.substr(1);
      return fixedString;
    }
    var timeRegEx = /^\d{2}:\d{2}$/
    var stateRegEx = /^[A-Za-z]{2}$/

    var spotss = template.findAll(".spotNumber");
    var newSpotArray = []
    spotss.forEach(function(spot){
      console.log(spot);
      newSpotArray.push({number: spot.id});
    });
    console.log(newSpotArray);
    /// Start of variables to go to Method Call
    var title = firstUpper(template.find(".title").value);
    var description = template.find(".description").value;
    var tag = prototype(template.find(".tag").value, '_');
    // var public = ! template.find(".private").checked;
    
    var date = moment($('#my-datepicker').datepicker('getDate')).format("MMMM Do, YYYY");
    console.log(date);
    if (date==='Invalid date'){
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

    var evt = Spots.findOne({eventID: Session.get('selectedEvent')});
    var currentPerm = evt.permalink;
    var eventID = Session.get('selectedEvent');

    if (title.length && description.length) {
      Meteor.call('updateEvent', {
        title: title,
        description: description,
        permalink: permalink,
        date: date,
        dbDate: dbDate,
        eventID: eventID,
        owner: Meteor.user()._id,
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
      }, function (error, template) {
        if (! error) {
          Session.set('selectedNewPerm', null);
          Session.set("createError", null);
          if (! (typeof owner === "string" && typeof oldPermalink === "string" && typeof newPermalink === "string")){
            Meteor.call('updateSpotPermalink', Meteor.user()._id, currentPerm, permalink, function(error, template){
              if(!error){
                console.log('Moved Spots to new Event.');
                Router.go('myEvents', {userID: Meteor.user()._id});
              }else{
                console.log(error);
              }
            });
          }
        }
        // console.log(this._id);
      });
    } else {
      Session.set("createError",
                  "It needs a Name and a Description");
    }
  },

  'click a.createNewSpotDialog': function(event, template){

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
      var lowerString = str.trim().toLowerCase();
      var upperChar = lowerString.charAt(0).toUpperCase();
      var fixedString = upperChar + lowerString.substr(1);
      return fixedString;
    }

    var title = firstUpper(template.find(".title").value);
    var permalink = prototype(title, '-');
    Session.set('selectedNewPerm', permalink);
    Session.set('showCreateSpotDialog', true);
    Session.set('currentModal', 'createNewSpotDialog');
    Modal.show('createNewSpotDialog');
  },

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

  'click a.editSpot': function(event, template){
    var yelpID = event.currentTarget.id;
    Session.set('selectedYelp', yelpID);
    Session.set('showEditSpotDialog', true);
    Session.set('currentModal', 'editSpotDialog');
    Modal.show('editSpotDialog');
  },

});

Template.editEvent.helpers({
  createError: function(){
    return Session.get("createError");
  },

  showCreateNewSpot: function(){
    
    return Session.get("showCreateSpotDialog");
  },
});

Template.editEvent.rendered = function(){
  //datepicker
  $('#my-datepicker').datepicker({
    todayBtn: "linked",
    orientation: "auto",
    todayHighlight: true,
    });


  //checkboxes
  var evt = Events.findOne({_id: Session.get('selectedEvent')});
  var startPM = evt.startPM;
  var endPM = evt.startPM;
  var dbDate = evt.dbDate;
  $('#my-datepicker').datepicker('setDate', dbDate);
  if (startPM == true){
    $('#startPMBox').prop('checked', true);
  }
  if (endPM ==true){
    $('#endPMBox').prop('checked', true);
  }


  //sortable
  var el = document.getElementById('items');
  var sortable = new Sortable(el, {
    onStart: function (evt) {
        evt.oldIndex;  // element index within parent
        // console.log(evt.oldIndex+1);
    },
    onEnd: function (evt) {
        evt.oldIndex;  // element's old index within parent
        // console.log(evt.oldIndex);
        evt.newIndex;  // element's new index within parent
        // console.log(evt.newIndex+1);
        Session.set('newRowNumber', evt.newIndex + 1)
    },
    onUpdate: function (evt) {
        var itemEl = evt.item;  // dragged HTMLElement
        console.log(itemEl.id);
        // Meteor.call('updateSpotNumber', itemEl.id, Session.get('newRowNumber'), function (error, template){
        //   if(!error){
        //     console.log('successful update of row number');
        //   }else{
        //     console.log(error);
        //   }

        // }); 
        // + indexes from onEnd
    },
    onSort: function(evt){
      var itemEl = evt.item;
      console.log(itemEl);
    }

  });
  
}


