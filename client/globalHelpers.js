UI.registerHelper("countUsers", function() {
    return Meteor.users.find({}).count();
});

UI.registerHelper("countEvents", function() {
    return Events.find({}).count();
});

UI.registerHelper("countSpots", function() {
    return Spots.find({}).count();
});

