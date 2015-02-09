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
      Session.set('selectedProvider', null);
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
    onBeforeAction: function () {
      if(!Meteor.user() && !Meteor.loggingIn()){
        this.render('home');
      } else if (Roles.userIsInRole(Meteor.user()._id, 'admin')){
        this.next();
      } else if (Meteor.user()._id != this.params.userID){
        this.render('home');
      } else {
       this.next();
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
    onBeforeAction: function () {
      if(!Meteor.user() && !Meteor.loggingIn()){
        this.render('home');
      } else if (Roles.userIsInRole(Meteor.user()._id, 'admin')){
        this.next();
      } else if (Meteor.user()._id != this.params.userID){
        this.render('home');
      } else {
       this.next();
      }
    },
    action: function(){
      this.layout('dash_layout');
      this.render('metrics', {to: 'content'});
    },
  });

  this.route('adminMetrics', {
    path: '/dashboard/:userID/admin/allMetrics',
    template: 'dashboard',
    waitOn: function(){
      return [
        Meteor.subscribe('Spots'),
        Meteor.subscribe('Events'),
        Meteor.subscribe('Users'),
        ]
    },
    data: function () {
      return {
        allUsers: Meteor.users.find(),
        allEvents: Events.find(),
        allSpots: Spots.find(),
      }
    },
    onBeforeAction: function () {
      if(!Meteor.user() && !Meteor.loggingIn()){
        this.render('home');
      } else if (Roles.userIsInRole(Meteor.user()._id, 'admin')){
        this.next();
      } else if (Meteor.user()._id != this.params.userID){
        this.render('home');
      } else {
       this.next();
      }
    },
    action: function(){
      this.layout('dash_layout');
      this.render('allMetrics', {to: 'content'});
    },
  });

  this.route('adminUsers', {
    path: '/dashboard/:userID/admin/allUsers',
    template: 'dashboard',
    waitOn: function(){
      return [
        Meteor.subscribe('Spots'),
        Meteor.subscribe('Events'),
        Meteor.subscribe('Users'),
        ]
    },
    data: function () {
      return {
        allUsers: Meteor.users.find(),
        allEvents: Events.find(),
        allSpots: Spots.find(),
      }
    },
    onBeforeAction: function () {
      if(!Meteor.user() && !Meteor.loggingIn()){
        this.render('home');
      } else if (Roles.userIsInRole(Meteor.user()._id, 'admin')){
        this.next();
      } else if (Meteor.user()._id != this.params.userID){
        this.render('home');
      } else {
       this.next();
      }
    },
    action: function(){
      this.layout('dash_layout');
      this.render('allUsers', {to: 'content'});
    },
  });

  this.route('adminEvents', {
    path: '/dashboard/:userID/admin/allEvents',
    template: 'dashboard',
    waitOn: function(){
      return [
        Meteor.subscribe('Spots'),
        Meteor.subscribe('Events'),
        Meteor.subscribe('Users'),
        ]
    },
    data: function () {
      return {
        allUsers: Meteor.users.find(),
        allEvents: Events.find(),
        allSpots: Spots.find(),
      }
    },
    onBeforeAction: function () {
      if(!Meteor.user() && !Meteor.loggingIn()){
        this.render('home');
      } else if (Roles.userIsInRole(Meteor.user()._id, 'admin')){
        this.next();
      } else if (Meteor.user()._id != this.params.userID){
        this.render('home');
      } else {
       this.next();
      }
    },
    action: function(){
      this.layout('dash_layout');
      this.render('allEvents', {to: 'content'});
    },
  });

  this.route('adminSpots', {
    path: '/dashboard/:userID/admin/allSpots',
    template: 'dashboard',
    waitOn: function(){
      return [
        Meteor.subscribe('Spots'),
        Meteor.subscribe('Events'),
        Meteor.subscribe('Users'),
        ]
    },
    data: function () {
      return {
        allUsers: Meteor.users.find(),
        allEvents: Events.find(),
        allSpots: Spots.find(),
      }
    },
    onBeforeAction: function () {
      if(!Meteor.user() && !Meteor.loggingIn()){
        this.render('home');
      } else if (Roles.userIsInRole(Meteor.user()._id, 'admin')){
        this.next();
      } else if (Meteor.user()._id != this.params.userID){
        this.render('home');
      } else {
       this.next();
      }
    },
    action: function(){
      this.layout('dash_layout');
      this.render('allSpots', {to: 'content'});
    },
  });

  this.route('profile', {
    path: '/dashboard/:userID/profile',
    template: 'dashboard',
    // waitOn: function(){
    //   return [
    //     Meteor.subscribe('Users'),
    //     ]
    // },
    data: function () {
      return {
        userInfo: Meteor.user(),
      }
    },
    onBeforeAction: function () {
      if(!Meteor.user() && !Meteor.loggingIn()){
        this.render('home');
      } else if (Roles.userIsInRole(Meteor.user()._id, 'admin')){
        this.next();
      } else if (Meteor.user()._id != this.params.userID){
        this.render('home');
      } else {
       this.next();
      }
    },
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
    onBeforeAction: function () {
      if(!Meteor.user() && !Meteor.loggingIn()){
        this.render('home');
      } else if (Roles.userIsInRole(Meteor.user()._id, 'admin')){
        this.next();
      } else if (Meteor.user()._id != this.params.userID){
        this.render('home');
      } else {
       this.next();
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
        selectedSpots: Spots.find({owner: this.params.userID, eventID: this.params.eventID}),
      }
    },
    action: function(){
      this.layout('dash_layout');
      this.render('addSpots', {to: 'content'});
    },
    onBeforeAction: function () {
      var evt = Events.findOne({_id: this.params.eventID});
      Session.set('selectedPerm', evt.permalink);
      if(!Meteor.user() && !Meteor.loggingIn()){
        this.render('home');
      } else if (Roles.userIsInRole(Meteor.user()._id, 'admin')){
        this.next();
      } else if (Meteor.user()._id != evt.owner){
        this.render('home');
      } else {
       this.next();
      }
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
        // eventSpots: Spots.find({eventID: this.params.eventID})
        selectedSpots: Spots.find({owner: this.params.userID, eventID: this.params.eventID}),
      }
    },
    action: function(){
      this.layout('dash_layout');
      this.render('editEvent', {to: 'content'});
    },
    onBeforeAction: function () {
      var evt = Events.findOne({_id: this.params.eventID});
      Session.set('selectedPerm', evt.permalink);
      if(!Meteor.user() && !Meteor.loggingIn()){
        this.render('home');
      } else if (Roles.userIsInRole(Meteor.user()._id, 'admin')){
        this.next();
      } else if (Meteor.user()._id != evt.owner){
        this.render('home');
      } else {
       this.next();
      }
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
    onBeforeAction: function () {
      if(!Meteor.user() && !Meteor.loggingIn()){
        this.render('home');
      } else if (Roles.userIsInRole(Meteor.user()._id, 'admin')){
        this.next();
      } else if (Meteor.user()._id != this.params.userID){
        this.render('home');
      } else {
       this.next();
      }
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
        return Events.find({ dbDate : { "$gte" : moment().format() } }, {sort: {dbDate:1, title:1}});
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
