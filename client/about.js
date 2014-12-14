Template.about.events({
	'click a': function(event, template){
		tag ="dc"
		var results = Meteor.call('searchInsta', tag);
		console.log(results)
	// 	results.forEach(function(result){
	// 		console.log(result);
	// 	});
    

		
		
		// Meteor.call('searchInsta', tag, function(error, result) {
		// 	console.log(error);
  //       	console.log(result);
  //         	var theResult = JSON.parse(result).id;
  //         	// Session.set('yelpResult', theResult);
  //         	console.log(theResult);
	 // 	});
        	
		// )
	},

});