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
      // selectedArticle: {}
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
    path: '/events/:state/:permalink',
    waitOn: function(){
      return [
        Meteor.subscribe('Spots'),
        Meteor.subscribe('Events'),
        ]

    },
    data: function () {
      return {
        selectedEvent: Events.findOne({permalink: this.params.permalink}),
      }
    },
    action: function(){
      this.render('crawls');
    },
    onAfterAction: function(){
      Session.set('selectedPerm', this.params.permalink);
      Session.set('selectedState', this.params.state);
    }
  });

  this.route('dashboard', {
    path: '/dashboard/:userID',
    template: 'dashboard',
    waitOn: function(){
      return [
        Meteor.subscribe('Spots'),
        Meteor.subscribe('Events'),
        ]
    },
    data: function () {
      return {
        // userInfo: Users.find(),
        selectedEvents: Events.find({owner: this.params.userID}),
      }
    },
  });

  this.route('metrics', {
    path: '/dashboard/:userID/metrics',
    template: 'dashboard',
    waitOn: function(){
      return [
        Meteor.subscribe('Spots'),
        Meteor.subscribe('Events'),
        ]
    },
    data: function () {
      return {
        // userInfo: Users.find(),
        selectedEvents: Events.find({owner: this.params.userID}),
      }
    },
    action: function(){
      this.layout('dash_layout');
      this.render('metrics', {to: 'content'});
    },
  });

  this.route('profile', {
    path: '/dashboard/:userID/profile',
    template: 'dashboard',
    action: function(){
      this.layout('dash_layout');
      this.render('profile', {to: 'content'});
    },
  });

  this.route('myEvents', {
    name: 'myEvents',
    template: 'dashboard',
    path: '/dashboard/:userID/events',
    waitOn: function(){
      return [
        Meteor.subscribe('Spots'),
        Meteor.subscribe('Events'),
        ]
    },
    data: function () {
      return {
        // userInfo: Users.find(),
        selectedEvents: Events.find({owner: this.params.userID}),
      }
    },
    action: function(){
      this.layout('dash_layout');
      this.render('myEvents', {to: 'content'});
    },
  });

  this.route('addSpots', {
    name: 'addSpots',
    template: 'dashboard',
    path: '/dashboard/:userID/events/:eventID/addSpots',
    waitOn: function(){
      return [
        Meteor.subscribe('Spots'),
        Meteor.subscribe('Events'),
        ]
    },
    data: function () {
      return {
        // userInfo: Users.find(),
        selectedEvent: Events.findOne({_id: this.params.eventID}),
        selectedSpots: Spots.find({owner: this.params.userID, eventID: Session.get('selectedEvent')}),
      }
    },
    action: function(){
      this.layout('dash_layout');
      this.render('addSpots', {to: 'content'});
    },
    onAfterAction: function(){
      Session.set('selectedEvent', this.params.eventID);
      Session.set('selectedOwner', this.params.userID);
    }
  });

  this.route('editEvent', {
    name: 'editEvent',
    template: 'dashboard',
    path: '/dashboard/:userID/edit/:eventID',
    waitOn: function(){
      return [
        Meteor.subscribe('Spots'),
        Meteor.subscribe('Events'),
        ]
    },
    data: function () {
      return {
        // userInfo: Users.find(),
        selectedEvent: Events.findOne({_id: this.params.eventID}),
        eventSpots: Spots.find({eventID: this.params.eventID})
      }
    },
    action: function(){
      this.layout('dash_layout');
      this.render('editEvent', {to: 'content'});
    },
    onAfterAction: function(){
      Session.set('selectedEvent', this.params.eventID);
      Session.set('selectedOwner', this.params.userID);
    }
  });

  this.route('create', {
    template: 'dashboard',
    path: '/dashboard/:userID/create',
    waitOn: function(){
      return [
        Meteor.subscribe('Spots'),
        Meteor.subscribe('Events'),
        ]
    },
    action: function(){
      this.layout('dash_layout');
      this.render('createNewEvent', {to: 'content'});
    },
  });

  this.route('events',{
    path: '/events',
    waitOn: function(){
      return Meteor.subscribe('Events');
    },
    data: {
      //TODO: make crawlList filter only by public events
      crawlList: function () {
        // will return only the upcoming events
        return Events.find({ dbDate : { "$gte" : moment().format() } }, {sort: {dbDate:-1, title:1}});
      },
      fullList: function(){
        // all events 
        // Need to add public:true in the future
        return Events.find({},{sort:{dbDate:-1, title:1}});
      },
      recentList: function(){
        return Events.find({dbDate : {"$gte" : moment().subtract(7, 'days').format(), "$lt": moment().format() } },{sort:{dbDate:-1, title:1}});
      }
    },
    action: function(){
      this.render('schedule');
    },
    template: 'schedule'
  });
});
