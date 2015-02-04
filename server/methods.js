var getYelpOauthBinding = function(url) {
    console.log("ouath")
    var config = ServiceConfiguration.configurations.findOne({service: "yelp"});
    if (config) {
        config.secret = config.consumerSecret;
        var oauthBinding = new OAuth1Binding(config, url);
        oauthBinding.accessToken = config.accessToken;
        oauthBinding.accessTokenSecret = config.accessTokenSecret;
        return oauthBinding;
    } else {
        throw new Meteor.Error(500, "Yelp Not Configured");
    }
}

var findStates = function(abr){
  states = {
    AK: 'Alabama',
    AL: 'Alaska',
    AR: 'Arizona',
    AZ: 'Arkansas',
    CA: 'California',
    CO: 'Colorado',
    CT: 'Connecticut',
    DC: 'District of Columbia',
    DE: 'Delaware',
    FL: 'Florida',
    GA: 'Georgia',
    HI: 'Hawaii',
    IA: 'Idaho',
    ID: 'Illinois',
    IL: 'Indiana',
    IN: 'Iowa',
    KS: 'Kansas',
    KY: 'Kentucky',
    LA: 'Louisiana',
    MA: 'Maine',
    MD: 'Maryland',
    ME: 'Massachusetts',
    MI: 'Michigan',
    MN: 'Minnesota',
    MO: 'Mississippi',
    MS: 'Missouri',
    MT: 'Montana',
    NC: 'Nebraska',
    ND: 'Nevada',
    NE: 'New Hampshire',
    NH: 'New Jersey',
    NJ: 'New Mexico',
    NM: 'New York',
    NV: 'North Carolina',
    NY: 'North Dakota',
    OH: 'Ohio',
    OK: 'Oklahoma',
    OR: 'Oregon',
    PA: 'Pennsylvania',
    RI: 'Rhode Island',
    SC: 'South Carolina',
    SD: 'South Dakota',
    TN: 'Tennessee',
    TX: 'Texas',
    UT: 'Utah',
    VA: 'Vermont',
    VT: 'Virginia',
    WA: 'Washington',
    WI: 'West Virginia',
    WV: 'Wisconsin',
    WY: 'Wyoming',
  }
  console.log(states.abr);
  return states.abr;
}



ServiceConfiguration.configurations.remove({service: "yelp"});
ServiceConfiguration.configurations.insert({
  service: "yelp",
  consumerKey: "jfHL-rIeE2biaczIOdxgwQ",
  consumerSecret: "ra7JBRLYCF1ZO27TP9XmIlK0Fx8",
  accessToken: "3xSYQcl0O7dfRXcWwzTFlM9beH-RFvwu",
  accessTokenSecret: "qbAfnxCrFWaJaIl5A1oobG0L9tc"
});

  // createClient('5d38e4277bc0461f8fa6283e68f85258', '6caefe9e0df64e668de79b9269b87214');
  /* OPTIONS: { [min_tag_id], [max_tag_id] }; */

// ServiceConfiguration.configurations.remove({service: "InstagramAPI"});
// ServiceConfiguration.configurations.insert({
//   service: "InstagramAPI",
//   CLIENT_ID: "5d38e4277bc0461f8fa6283e68f85258",
//   CLIENT_SECRET: "6caefe9e0df64e668de79b9269b87214",
// });

// var ig = Meteor.require('instagram-node').instagram();

// var Fiber = Npm.require('fibers');

Accounts.onCreateUser(function(options, user) {
  user.profile = {};

  // we wait for Meteor to create the user before sending an email
  Meteor.setTimeout(function() {
    Accounts.sendVerificationEmail(user._id);
  }, 2 * 1000);

  return user;
});


// dgtlfi = bCYDY4D9333Xdz7yX
// Roles.addUsersToRoles('kxw34paKGWLfRGsek', 'admin');


// var loginAttemptVerifier = function(parameters) {
//   if (parameters.user && parameters.user.emails && (parameters.user.emails.length > 0)) {
//     // return true if verified email, false otherwise.
//     var found = _.find(
//                        parameters.user.emails, 
//                        function(thisEmail) { return thisEmail.verified }
//                       );

//     if (!found) {
//       throw new Meteor.Error(500, 'We sent you an email.');
//     }
//     return found && parameters.allowed;
//   } else {
//     console.log("user has no registered emails.");
//     return false;
//   }
// }
// Accounts.validateLoginAttempt(loginAttemptVerifier);
  

Meteor.methods({

  createEvent: function(options){
    options = options || {};
    if (! (typeof options.title === "string" && options.title.length &&
           typeof options.description === "string" &&
           options.description.length))
      throw new Meteor.Error(400, "Required parameter missing");
    if (options.title.length > 100)
      throw new Meteor.Error(413, "Title too long");
    if (options.description.length > 1000)
      throw new Meteor.Error(413, "Description too long");
    if (! this.userId)
      throw new Meteor.Error(403, "You must be logged in");
    // console.log(options.city);
    console.log(options.city);
    console.log(options.state);
    var cityLatLng = Zipcodes.lookupByName(options.city, options.state);
    // var longState = findStates(options.state);

    return Events.insert({
      owner: this.userId,
      title: options.title,
      date: options.date,
      dbDate: options.dbDate,
      permalink: options.permalink,
      description: options.description,
      publicEvt: !! options.public,
      city: options.city,
      state: options.state,
      // longState: longState,
      latlng: [cityLatLng[0].latitude, cityLatLng[0].longitude],
      spotCount: 0,
      spots: [],
      rsvpCount: 0,
      rsvpd: [],
      tag: options.tag,
      startTime: options.startTime,
      startPM: options.startPM,
      finalStartTime: options.finalStartTime,
      endTime: options.endTime,
      endPM: options.endPM,
      finalEndTime: options.finalEndTime,
    });
  },

  lookupZip: function(city, state){
    
    try{
      var zips = Zipcodes.lookupByName(city, state);
    } 
    catch (error){
      console.log('lookupZip Error');
      return false;
    }
    finally{
      return zips;
    }
  },

  // options should include: name, description, x, y, public
  createSpot: function (options) {
    options = options || {};
    if (! (typeof options.name === "string" && options.name.length &&
           typeof options.description === "string" &&
           options.description.length))
      throw new Meteor.Error(400, "Required parameter missing");
    if (options.name.length > 100)
      throw new Meteor.Error(413, "Title too long");
    if (options.description.length > 1000)
      throw new Meteor.Error(413, "Description too long");
    if (! this.userId)
      throw new Meteor.Error(403, "You must be logged in");

    console.log(options.latlng);
    return Spots.insert({
      owner: this.userId,
      latlng: options.latlng,
      name: options.name,
      yelpID: options.yelpID,
      eventID: options.eventID,
      permalink: options.permalink,
      description: options.description,
      // public: !! options.public,
      number: options.number,
      yelpObj: options.yelpObj,
    });
    // var oldCount = Events.findOne({_id:options.eventID}, {fields: {spotCount:1}});
    // var newCount = oldCount.spotCount + 1;

    // return Events.update({_id:options.eventID},{
    //   $inc:{
    //     spotCount: 1,
    //   },
    //   $push:{
    //     spots: {
    //       owner: this.userId,
    //       name: options.name,
    //       description: options.description,
    //       latlng: options.latlng,
    //       number: newCount,
    //       yelpID: options.yelpID,
    //       yelpObj: options.yelpObj,
    //     }
    //   }
    // })
  },

  updateEvent: function (options) {
    options = options || {};
    if (! (typeof options.title === "string" && options.title.length &&
           typeof options.description === "string" &&
           options.description.length))
      throw new Meteor.Error(400, "Required parameter missing");
    if (options.title.length > 100)
      throw new Meteor.Error(413, "Title too long");
    if (options.description.length > 1000)
      throw new Meteor.Error(413, "Description too long");
    if (! this.userId)
      throw new Meteor.Error(403, "You must be logged in");
    // console.log(options.spotID);
    // console.log(options.number);
    return Events.update(options.eventID, { 
      $set: {
        title: options.title,
        description: options.description,
        permalink: options.permalink,
        date: options.date,
        dbDate: options.dbDate,
        publicEvt: options.public, 
        city: options.city,
        state: options.state,
        startTime: options.startTime,
        startPM: options.startPM,
        finalStartTime: options.finalStartTime,
        endTime: options.endTime,
        endPM: options.endPM,
        finalEndTime: options.finalEndTime,
        tag: options.tag,
      }
    });
  },

  updateSpot: function (options) {
    options = options || {};
    if (! ( typeof options.description === "string"))
      throw new Meteor.Error(400, "Required parameter missing");
    if (options.description.length > 1000)
      throw new Meteor.Error(413, "Description too long");
    if (! this.userId)
      throw new Meteor.Error(403, "You must be logged in");
    console.log(options.eventID);
    console.log(options.yelpID);
    return Spots.update({eventID: options.eventID, yelpID: options.yelpID},{
      $set:{
        description: options.description,
        // number: options.number,
      }
      
    });
  },

  updateSpotNumber: function (_id, newNumber) {
    // permalink = permalink || {};
    if (! (typeof _id === "string" && typeof newNumber === "string" ))
      throw new Meteor.Error(400, "Required parameter missing");
    if (! this.userId)
      throw new Meteor.Error(403, "You must be logged in");
    // console.log(_id);
    // console.log(newNumber);
    // console.log(newPermalink);
    return Spots.update({_id: _id},
      { $set: { number: newNumber } }
      // { multi: true }
    );
  },
  updateSpotPermalink: function (owner, oldPermalink, newPermalink) {
    // permalink = permalink || {};
    if (! (typeof owner === "string" && typeof oldPermalink === "string" && typeof newPermalink === "string"))
      throw new Meteor.Error(400, "Required parameter missing");
    if (! this.userId)
      throw new Meteor.Error(403, "You must be logged in");
    console.log(owner);
    console.log(oldPermalink);
    console.log(newPermalink);
    return Spots.update({owner: owner, permalink: oldPermalink},
      { $set: { permalink: newPermalink } }, 
      { multi: true }
    );
  },

  updateRsvp: function (options) {
    options = options || {};
    if (! options.currentUser )
      throw new Meteor.Error(400, "Required parameter missing");
    if (! this.userId)
      throw new Meteor.Error(403, "You must be logged in");
    // console.log(options.spotID);
    return Events.update({permalink: options.permalink},{
      $inc:{
        rsvpCount: 1,
      },
      $push:{
        rsvpd: options.currentUser,
      }
      
    });
  },

  deleteEvent: function (options) {
    options = options || {};
    console.log('Deleting: ');
    console.log(options);
    return Events.remove(options.eventID);
  },

  deleteSpot: function (spot) {
    spot = spot || {};
    console.log('Deleting: ');
    console.log(spot);
    return Spots.remove({_id: spot});
  },

  searchYelp: function(search, isCategory, city, latitude, longitude) {
     //this.unblock();
     
     // Add REST resource to base URL
     var url = "http://api.yelp.com/v2/search";
     
     var oauthBinding = getYelpOauthBinding(url);
     
     // Build up query
     var parameters = {};

     // Search term or categories query
     if(isCategory) {
          parameters.category_filter = search;
     } else {
          parameters.term = search;
     }

     // Set lat, lon location, if available or default location
     if(longitude && latitude){
          parameters.ll = latitude + "," + longitude;
     }
     
     if (city){
      // console.log(city);
      parameters.location = city;
     } else {
          parameters.location = "DC";
     }

      //Search Radius
     parameters.radius_filter = "40000";

     // Results limited to 5
     parameters.limit = 5;

     // Only return .data because that is how yelp formats its responses
     return oauthBinding.get(url, parameters);
   },


   getProfile: function(str) {
      return Meteor.user({_id:Meteor.userId()});
   },

   // updateInsta: function(eventID, instaObj){
   //    return Events.update(eventID._id,{
   //          $push:{
   //            instaObj: instaObj,
   //          }
   //    });
   // },

   getState: function(abr){
      console.log(findStates[abr]);
      return findStates[abr];
   }

});
