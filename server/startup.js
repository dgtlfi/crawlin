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
      {owner: Meteor.userID, title: 'DC Eating', date: moment().format('MMMM Do, YYYY'), public: 'true', permalink: 'dc-eating', description: "Barcelona, KBC, Fados, Rosas, Sonoma, La Plaza", tag:'dc_eats', instaObj:'', rsvps: 0, city: 'Washington', state: 'DC', rsvps: 0, rsvpd: [], startTime:'05:00', startPM: 'checked', endTime: '02:00', endPM: '' },
      // {title: 'Bmore Eating', date: Date(), public: 'true', permalink: 'bmore-eating', description details: "Barssss"},
    ];
    events.forEach(function(eventItem){
      Events.insert(eventItem);
      })
  }

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