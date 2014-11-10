
Meteor.publish('Events', function(){
  var currentUserId = this.userId;
  return Events.find();
});

Meteor.publish('Spots', function(){
  var currentUserId = this.userId;
  return Spots.find();
});

Meteor.publish('Articles', function(){
  return Articles.find();
})