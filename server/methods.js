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

    var cityLatLng = Zipcodes.lookupByName(options.city, options.state);
    // console.log(cityLatLng);

    return Events.insert({
      owner: this.userId,
      title: options.title,
      date: options.date,
      permalink: options.permalink,
      description: options.description,
      public: !! options.public,
      city: options.city,
      state: options.state,
      latlng: [cityLatLng[0].latitude, cityLatLng[0].longitude],
      instaObj: '',
      rsvps: 0,
      rsvpd: [],
      tag: options.tag,
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

    // console.log(options.latlng);
    return Spots.insert({
      owner: this.userId,
      latlng: options.latlng,
      name: options.name,
      yelpID: options.yelpID,
      // eventID: options.eventID,
      permalink: options.permalink,
      description: options.description,
      public: !! options.public,
      number: options.number,
      invited: [],
      rsvps: [],
      yelpObj: options.yelpObj,
    });
  },

  updateSpot: function (options) {
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
    // console.log(options.spotID);
    console.log(options.number);
    return Spots.update(options.spotID,{
      $set:{
        name: options.name,
        //yelpID: options.yelpID
        // eventID: options.eventID,
        description: options.description,
        public: !! options.public,
        number: options.number,
      }
      
    });
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
        rsvps: 1,
      },
      $push:{
        rsvpd: options.currentUser,
      }
      
    });
  },

  deleteSpot: function (options) {
    options = options || {};
    return Spots.remove(options.spotID);
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

   getLatLng: function(adr){
      var geo = new GeoCoder();
      var result = geo.geocode(adr);
      return result;
   },

   getProfile: function(str) {
      return Meteor.user({_id:Meteor.userId()});
   },

   updateInsta: function(eventID, instaObj){
      return Events.update(eventID._id,{
            $push:{
              instaObj: instaObj,
            }
      });
   },

   searchInsta: function(permalink){
      var cEvent = Events.findOne({permalink: permalink});
      var tag = cEvent.tag;
      console.log(cEvent);
      console.log(tag);
      ig.tag_media_recent(tag, function(err, medias, pagination, remaining, limit) {
        if(!err){
          // console.log('hiiiiiiii')
          // console.log( medias);
          var instaObj = []
          medias.forEach(function(media){
          // console.log(image.images.standard_resolution);
            instaObj.push({
              imgID: media.id,
              user: media.user.username, 
              profile: media.user.profile_picture,
              location: media.location,
              likes: media.likes.count,
              link: media.link, 
              caption: media.caption, 
              standard: media.images.standard_resolution.url,
            });
          });
        }else{
          console.log(err.message);
        }
      });   

      Meteor.call('updateInsta', cEvent, instaObj);
      return medias;
  },


});
