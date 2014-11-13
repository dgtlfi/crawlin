if (Meteor.isClient) {
  Template.yelp.events({
    'click .yelpInput': function(event, template){
      var term = template.find(".yelpInput").value;
      console.log('hi');
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
