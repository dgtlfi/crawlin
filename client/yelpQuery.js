if (Meteor.isClient) {
  Template.yelp.events({
    'click .yelpInput': function(event, template){
      var term = template.find(".yelpInput").value;
      Meteor.call('yelpQuery', {
        search: term,
      }, function(error, template){
        if(error){
          console.log(error);
        }
      }
      );
    }
  });
}

if (Meteor.isServer){

  Meteor.methods({
    yelpQuery: function(search, isCategory, longitude, latitude) {
      console.log('Yelp search for userId: ' + this.userId + '(search, isCategory, lng, lat) with vals (', search, isCategory, longitude, latitude, ')');

      // Query OAUTH credentials (these are set manually)
      var auth = ServiceConfiguration.configurations.findOne({service: 'yelp'});
      // console.log(auth);
      // Add auth signature manually
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
    }


  });
}
