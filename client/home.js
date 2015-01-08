
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
  
  function search (user_id) {
    var url = "https://api.instagram.com/v1/users/" + user_id + "/media/recent?callback=?&amp;client_id=5d38e4277bc0461f8fa6283e68f85258&count=4"
    $.getJSON (url, toScreen);
    console.log(user_id);
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

Instagram.search ('573548614');








