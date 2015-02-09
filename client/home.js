
// Meteor.subscribe('Spots');
// Meteor.subscribe('igTags');
// Meteor.subscribe('Articles');
// Meteor.subscribe('Events');
// Meteor.subscribe('Locations');

Template.navItems.helpers({
  activeIfTemplateIs: function (template) {
    var currentRoute = Router.current();
    return currentRoute &&
      template === currentRoute.lookupTemplate() ? 'active' : '';
  },
  currentUserID: function(){
    if (Meteor.user){
      return Meteor.user()._id;
    }
  },
});

Template.navItems.created = function() {
  if (Accounts._verifyEmailToken) {
    Accounts.verifyEmail(Accounts._verifyEmailToken, function(err) {
      if (err != null) {
        if (err.message = 'Verify email link expired [403]') {
          console.log('Sorry this verification link has expired.')
        }
      } else {
        console.log('Thank you! Your email address has been confirmed.')
      }
    });
  }
};

Template._loginButtonsLoggedInDropdown.events({
    'click #login-buttons-edit-profile': function(event) {
        if (Meteor.user()){
          var userID = Meteor.user()._id;
          Router.go('/dashboard/'+userID+'/profile');
        }
        
    }
});










