
Meteor.subscribe('Spots');
Meteor.subscribe('igTags');
Meteor.subscribe('Articles');
Meteor.subscribe('Events');

Template.navItems.helpers({
  activeIfTemplateIs: function (template) {
    var currentRoute = Router.current();
    return currentRoute &&
      template === currentRoute.lookupTemplate() ? 'active' : '';
  }
});


//kh js-------------
$(document).ready(function(){

	$(".leaflet-marker-icon").on("click", function() {
		alert( $(this).text() );
	});
	
});







