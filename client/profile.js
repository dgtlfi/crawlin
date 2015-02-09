

Template.profile.helpers({
  createError: function(){
    return Session.get("createError");
  },

  showCreateNewSpot: function(){
    return Session.get("showCreateSpotDialog");
  },

});

Template.profile.events({
  'click .save': function (evt, template){
    evt.preventDefault();
    
    if (! template.find("#inputFirstName").value && ! template.find("#inputLastName").value && ! template.find("#inputUserName").value){
      error = "In order to update your profile please fill in the form.";
      Session.set('createError', error);
      throw new Meteor.Error(406, error);
    } 
    if (! template.find("#inputUserName").textContent){
      var userName = template.find("#inputUserName").value;
    } else {
      var userName = template.find("#inputUserName").textContent;
    }
    var firstName = template.find("#inputFirstName").value;
    var lastName = template.find("#inputLastName").value;
    
    check(firstName, String);
    check(lastName, String);
    check(userName, String);
    var lowerUser = userName.trim().toLowerCase();
    if (! lowerUser > 3 ){
      throw new Meteor.Error(407, "Username is too short, must be greater than 3 characters");
    }

    Meteor.call('updateProfile', {
      firstName: firstName,
      lastName: lastName,
      userName: lowerUser,
    }, function(error, result){
      if (! error){
        console.log(result);
        Session.set('createError', null);
      }else{
        console.log(error);
        Session.set('createError', error.reason);
      }
    });
      
    
  },

});


