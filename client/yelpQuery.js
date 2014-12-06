if (Meteor.isClient) {
  Template.createNew.events({
    'click .yelpSubmit': function(event, template){
      var term = template.find(".yelpInput").value;
      // console.log('in click');
      
      Meteor.call("searchYelp", term, false,function(error, results) {
        if(results){
          // console.log("results");
          var theResult = JSON.parse(results.content).businesses;
          Session.set('yelpResult', theResult);
          console.log(theResult);
        }
     });
    }
  });

  Template.createNew.helpers({
    yelpResults: function () {
      theResult = Session.get('yelpResult');
      // console.log(theResult);
      return theResult;
      // theResult.forEach(function(result){
      //   name = result.name;
      //   rating = result.rating;
      //   rating_url = result.rating_img_url_small;
      //   res_url = result.url;       
      //   currentAddress = result.location.address;
      //   currentAddress += result.location.city;
      //   lat = result.location.coordinate.latitude;
      //   lng = result.location.coordinate.longitude;
      //   // console.log("hi, under currentAddress");
      //   console.log(name);
    }
  });
}