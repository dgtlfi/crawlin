UI.registerHelper("countUsers", function() {
    return Meteor.users.find({}).count();
});

UI.registerHelper("countEvents", function() {
    return Events.find({}).count();
});

UI.registerHelper("countSpots", function() {
    return Spots.find({}).count();
});

UI.registerHelper("randomNumber", function() {
	var randomNumber = Math.floor(Math.random()*1001);
    return randomNumber;
});

UI.registerHelper("fullName", function() {
    var user = Meteor.users.findOne({_id: Meteor.user()._id});
    if (user){
    	var firstName = user.profile.firstName;
    	var lastName = user.profile.lastName;
    	var userName = user.profile.userName;
    	if (firstName && lastName && userName){
    		return firstName + " " + lastName;
    	} else if (!firstName || !lastName && userName){
    		return userName;
    	} else {
    		return user.emails[0].address
    	}
    }
});

UI.registerHelper("checkedIf",function(value){
  if (value === Session.get('selectedProvider')){
  	return true;
  }
  if (value === Session.get('selectedColor')){
    return true;
  }
});

