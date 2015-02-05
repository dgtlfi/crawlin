Template.about.events({
	'click a': function(event, template){
		var current
		// var routeURL = Router.current().url;
  //   	console.log(routeURL);
		// console.log(routeURL.split('/'));
		var user = Meteor.user()._id;
		Router.go('/');
	},

});