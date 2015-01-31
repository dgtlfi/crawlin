
Meteor.publish('Events', function () {
  // user = Meteor.users.findOne({_id:this.userId})
  // if(user) {
  //     if(user.emails[0].verified) {
  //         //You can put some extra logic in here to check which product the user has, if you're selling or something like that
  //         return Events.find({});
  //     }
  //  }
  return Events.find({});
});

Meteor.publish('Spots', function () {
  // user = Meteor.users.findOne({_id:this.userId})
  // if(user) {
  //     if(user.emails[0].verified) {
  //         //You can put some extra logic in here to check which product the user has, if you're selling or something like that
  //         return Spots.find({});
  //     }
  //  }
   return Spots.find({});
});
