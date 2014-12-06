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


/* OPTIONS: { [count], [min_id], [max_id] }; */
ig.user_self_feed([count=5], function(err, medias, pagination, remaining, limit) {
  if(!err){
    console.log('hiiiiiiii')
    console.log(medias);
    }else{
      console.log(err.message);
    }
});


Spots.allow({
  insert: function (userId, party) {
    return false; // no cowboy inserts -- use createParty method
  },
  update: function (userId, spot, fields, modifier) {
    if (userId !== spot.owner)
      return false; // not the owner

    var allowed = ["title", "description", "latlng", 'owner', 'eventID', 'public', 'invited', 'rsvps'];
    if (_.difference(fields, allowed).length)
      return false; // tried to write to forbidden field

    // A good improvement would be to validate the type of the new
    // value of the field (and if a string, the length.) In the
    // future Meteor will have a schema system to makes that easier.
    return true;
  },
  remove: function (userId, spot) {
    // You can only remove parties that you created and nobody is going to.
    return spot.owner === userId;
  }
});


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
    });
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

});
