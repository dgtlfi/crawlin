

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

    return Events.insert({
      owner: this.userId,
      title: options.title,
      date: options.date,
      permalink: options.permalink,
      description: options.description,
      public: !! options.public,
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

    // console.log(option.number);
    return Spots.insert({
      owner: this.userId,
      latlng: options.latlng,
      name: options.name,
      // eventID: options.eventID,
      permalink: options.permalink,
      description: options.description,
      public: !! options.public,
      number: options.number,
      invited: [],
      rsvps: []
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
    // console.log(option.number);
    return Spots.update(options.spotID,{
      owner: this.userId,
      latlng: options.latlng,
      name: options.name,
      // eventID: options.eventID,
      permalink: options.permalink,
      description: options.description,
      public: !! options.public,
      number: options.number,
      invited: [],
      rsvps: []
    });
  },

  deleteSpot: function (options) {
    options = options || {};
    return Spots.remove(options.spotID);
  },

  yelpQuery: function(search, isCategory, longitude, latitude) {
    console.log('Yelp search for userId: ' + this.userId + '(search, isCategory, lng, lat) with vals (', search, isCategory, longitude, latitude, ')');

    // Query OAUTH credentials (these are set manually)
    var auth = ServiceConfiguration.configurations.findOne({service: 'yelp'});
    // console.log(auth);
    // Add auth signature manually
    console.log(auth);
    auth['serviceProvider'] = { signatureMethod: "HMAC-SHA1" };

    var accessor = {
      consumerSecret: auth.consumerSecret,
      tokenSecret: auth.accessTokenSecret
    },
    parameters = {};

    // console.log(auth);

    // Search term or categories query
    if(isCategory)
      parameters.category_filter = search;
    else
      parameters.term = search;

    // Set lat, lon location, if available (SF is default location)
    if(longitude && latitude)
      parameters.ll = latitude + ',' + longitude;
    else
      parameters.location = 'DC';

    // Results limited to 5
    parameters.limit = 5;

    // Configure OAUTH parameters for REST call
    parameters.oauth_consumer_key = auth.consumerKey;
    parameters.oauth_consumer_secret = auth.consumerSecret;
    parameters.oauth_token = auth.accessToken;
    parameters.oauth_signature_method = auth.serviceProvider.signatureMethod;

    // Create OAUTH1 headers to make request to Yelp API
    var oauthBinding = new OAuth1Binding(accessor, 'http://api.yelp.com/v2/search');
    // console.log(oauthBinding);
    // console.log('daadfasdf');
    oauthBinding.accessToken = auth.accessToken;
    oauthBinding.accessTokenSecret = auth.accessTokenSecret;
    // console.log(oauthBinding);
    var headers = oauthBinding._buildHeader();
    oSignature = oauthBinding._getSignature('GET', 'http://api.yelp.com/v2/search', headers, auth.accessTokenSecret, parameters)
    console.log(oSignature);
    // Return data results only
    return oauthBinding._call('GET', 'http://api.yelp.com/v2/search', headers, parameters).data;
  },
});
