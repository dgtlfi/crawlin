Router.configure({
   layoutTemplate: 'layout'  //can be any template name
 });


Router.map(function () {
  this.route('home', {
    path: '/',
  });

  this.route('about', {
    path:'/about',
    data: function(){
      return{
        spotsList: Events.find()
      }
    },
    template: 'about'
  });

  this.route('articles', {
    path: '/articles',
    // articles now under `articleList` instead of `this`
    data: {
      articleList: function () {return Articles.find()},
      selectedArticle: {}
    }
  });
  
  this.route('article', {
    path: '/article/:_id',
    // provide data for both `articleList` and `selectedArticle`
    data: function () {
      return {
        articleList: Articles.find(),
        selectedArticle: Articles.findOne({_id: this.params._id})
      }
    },
    template: 'articles'  //change template target
  });

  this.route('crawls', {
    path: '/schedule/:permalink',
    data: function () {
      Session.set('selectedEvent', Events.findOne({permalink: this.params.permalink}, {fields: {_id:1}}));
      if(!Session.get('selectedSpot')){
          Session.set('selectedSpot',Spots.findOne({number: '1'}));
        }
      // console.log('Crawls');
      // console.log(Session.get('selectedEvent'));
      return {
        //selectedEvent = Event Name, Details
        //allSpots should be all of the spots for that Event
        selectedEvent: Events.findOne({permalink: this.params.permalink}),
        selectedSpot: Spots.findOne({_id: Session.get('selectedSpot')}),
        // allSpots: Spots.find({eventID: eventID._id})
      }
    },
    template: 'crawls'
  });

  this.route('schedule',{
    path: '/schedule',
    data: {
      //TODO: make crawlList filter only by public events
      crawlList: function () {return Events.find()},
      selectedEvent: {}
    },
    template: 'schedule'
  });
});
