

Template.createNew.events({
  'click a.createNewSpot': function(event, template){
    Session.set('showCreateSpotDialog', true);
    Session.set('yelpResult', null);
  },

});

Template.rsvp.helpers({
  showRsvpDialog: function(){
    return Session.get("showRsvpDialog");
  },

  showRsvpError: function(){
    return Session.get("showRsvpError");
  },

  show_LoginDialog: function(){
    return Session.get("show_LoginDialog");
  },

  disabled: function(){
    if (Session.get('disableRsvp')){
      return 'disabled';
    }
  }


});

Template.feed.rendered = function () {
  var permalink = Session.get('selectedPerm');
  var hashtag = Events.findOne({permalink:permalink}, {tag:1});
  if (hashtag) {
    // ------ Ajax Social feeds ---------------

      var Instagram = {};

      Instagram.Template = {};

      Instagram.Template.Views = {

        "photo": "<div class= 'photo'>" +
            "<a href= '{url}' target='_blank'>"+ 
            "<img class='main' src='{photo_url}' width='250' height='250' /></a>" +
            "<p>{text}</p>" + "<span class='heart'><strong>{like_count}</strong></span>" +
            "</div>"
      };
      (function() {

        function toScreen(photos) {
          $.each(photos.data, function (index, photo) {
            // console.log(photo);
            photo = toTemplate(photo);
            $('div.social').append(photo);
          });
        }

          function search (hashtag) {
          var url = "https://api.instagram.com/v1/tags/" + hashtag + "/media/recent?callback=?&amp;client_id=5d38e4277bc0461f8fa6283e68f85258"
          $.getJSON (url, toScreen);
        }

        function toTemplate(photo) {
          photo = {
            like_count: photo.likes.count,
            text: photo.caption.text,
            photo_url: photo.images.standard_resolution.url,
            url:photo.link
          };

          return Instagram.Template.generate(photo, Instagram.Template.Views['photo']);
        }

        Instagram.Template.generate = function (photo, template) {
        var re;
        
        for (var attribute in photo) {
          // console.log(attribute);
          // console.log(photo);
          re = new RegExp('{' + attribute + '}', 'g');
          template = template.replace(re, photo[attribute]);
        }

        return template;
       };

        Instagram.search = search;
      })();

      Instagram.search(hashtag.tag);
  }
}


Template.rsvp.rendered = function(){
  var currentUser = Meteor.user();
  var permalink = Session.get('selectedPerm');
  var alreadyRsvpd = Events.findOne({permalink:permalink, rsvpd: currentUser})
  if (alreadyRsvpd){
    Session.set('disableRsvp', true);
  }
}

Template.rsvp.events({
  'click .RSVP': function(event, template){
    var currentUser = Meteor.user();
    var permalink = Session.get('selectedPerm');
    

    if (! currentUser){
      
      Session.set('currentModal', 'showLoginDialog');
      Session.set('show_LoginDialog', true);
      Modal.show('showLoginDialog');
      
    }else{
      var alreadyRsvpd = Events.findOne({permalink:permalink, rsvpd: currentUser})
      if (alreadyRsvpd){
        Session.set('disableRsvp', true);
        Session.set('showRsvpError', true);
        Session.set('currentModal', 'createRsvpError');
        Modal.show('createRsvpError');
      } else{ 
        Meteor.call('updateRsvp', {
          currentUser: currentUser,
          permalink: permalink,
          }, function(error, result){
            if(!error){
              Session.set('showRsvpDialog', true);
              Session.set('disableRsvp', true);
              Session.set('currentModal', 'createRsvpDialog');
              Modal.show('createRsvpDialog');
            }
          }
          
        );
      }
      
    }
    
  },

});


Template.spotDetails.helpers({

  showContent: function(){
    if (Session.get("selectedSpot")){
      // console.log(Session.get('selectedSpot'));
      // console.log(Spots.findOne(Session.get('selectedSpot')));
      return Spots.findOne(Session.get('selectedSpot'));
    }

  },

});


Template.spotYelpInfo.helpers({

  yes: function(){

      spotYelpObj = Session.get('spotYelpObj');
      return spotYelpObj;
    
    },
});

