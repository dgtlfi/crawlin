Meteor.startup(function () {
  if (! Articles.findOne()){
    var articles = [
      {title: 'Article 1', body: 'This is article 1'},
      {title: 'Article 2', body: 'This is article 2'},
      {title: 'Article 3', body: 'This is article 3'}
    ];
    articles.forEach(function (article) {
      Articles.insert(article);
      })
  }
  if (! Events.findOne()){
    var events = [
      {owner: Meteor.userID, title: 'DC Eating', date: moment().format('MMMM Do, YYYY'), public: 'true', permalink: 'dc-eating', description: "We will be going to all of our favorite places from 2015 to try the best dishes and drinks that we have had. Remember the burger at Busters or the Pizza from Justins? If you don't, don't worry because we'll be stopping by to make sure you never forget! Let's meet up at the Navy Yard Metro and we'll get off at U St. Metro then walk to our first location, Barcelona! We're meeting at 6pm. Please RSVP, if you're bringing a +1 please RSVP for them also! Thanks, see you soon!", tag:'dc_eats', instaObj:'', rsvps: 0, city: 'Washington', state: 'DC', rsvps: 0, rsvpd: [], startTime:'05:00pm', endTime: '02:00am' },
      // {title: 'Bmore Eating', date: Date(), public: 'true', permalink: 'bmore-eating', description details: "Barssss"},
    ];
    events.forEach(function(eventItem){
      Events.insert(eventItem);
      })
  }


  // By default, the email is sent from no-reply@meteor.com. If you wish to receive email from users asking for help with their account, be sure to set this to an email address that you can receive email at.
  //Accounts.emailTemplates.from = 'Gentlenode <no-reply@gentlenode.com>';

  // The public name of your application. Defaults to the DNS name of the application (eg: awesome.meteor.com).
  Accounts.emailTemplates.siteName = "Crawlin'";

  // A Function that takes a user object and returns a String for the subject line of the email.
  Accounts.emailTemplates.verifyEmail.subject = function(user) {
    return 'Confirm Your Email Address for Crawlin.com';
  };

  // A Function that takes a user object and a url, and returns the body text for the email.
  // Note: if you need to return HTML instead, use Accounts.emailTemplates.verifyEmail.html
  Accounts.emailTemplates.verifyEmail.text = function(user, url) {
    return "Hi! /r/nLet's host some crawls! /r/nJust click on the following link to verify your email address: " + url;
  };

  // ig.tag_media_recent('snow', [max_tag_id=5], function(err, medias, pagination, remaining, limit) {
  // if(!err){
  //   Meteor.publish('igMedia', function(){
  //     console.log(medias);
  //     return medias;
  //   });
  //   }else{
  //     console.log(err.message);
  //   }
  // });

  // instagram.tags.media('snow', {max_id: 5, count: 5}, function (tag, error) { 
  //   if (! error){
  //     Meteor.publish('igTags', function(){
  //       return photos;
  //     });
  //   }
  // });
});