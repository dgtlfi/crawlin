Meteor.startup(function () {
  // if (! Articles.findOne()){
  //   var articles = [
  //     {title: 'Article 1', body: 'This is article 1'},
  //     {title: 'Article 2', body: 'This is article 2'},
  //     {title: 'Article 3', body: 'This is article 3'}
  //   ];
  //   articles.forEach(function (article) {
  //     Articles.insert(article);
  //     })
  // }
  // if (! Events.findOne()){
  //   var events = [{
  //     owner: 'admin', 
  //     title: 'DC Eating', 
  //     date: moment().format('MMMM Do, YYYY'), 
  //     dbDate: moment().format(),
  //     // public: true, 
  //     permalink: 'dc-eating', 
  //     description: "We will be going to all of our favorite places from 2015 to try the best dishes and drinks that we have had. Remember the burger at Busters or the Pizza from Justins? If you don't, don't worry because we'll be stopping by to make sure you never forget! Let's meet up at the Navy Yard Metro and we'll get off at U St. Metro then walk to our first location, Barcelona! We're meeting at 6pm. Please RSVP, if you're bringing a +1 please RSVP for them also! Thanks, see you soon!", 
  //     tag:'dc_eats', 
  //     rsvpCount: 0, 
  //     city: 'Washington', 
  //     state: 'DC', 
  //     // longState: 'District of Columbia', 
  //     rsvpd: [],
  //     startTime: '05:00',
  //     startPM: true, 
  //     finalStartTime:'05:00pm', 
  //     endTime: '02:00',
  //     endPM: true,
  //     finalEndTime: '02:00am' 
  //   },
  //     // {title: 'Bmore Eating', date: Date(), public: 'true', permalink: 'bmore-eating', description details: "Barssss"},
  //   ];
  //   events.forEach(function(eventItem){
  //     Events.insert(eventItem);
  //     });
  // }
  // if (! Spots.findOne()){
  //   var spots = [{
  //     owner: 'admin', 
  //     name: 'La Plaza Restaurant', 
  //     permalink: 'dc-eating', 
  //     description: "La Plaza is one of my favorite Mexican Salvadorean places in DC! It's so good I'm here twice every week! We have to try the pupusas and their platanos fritos. We can't forget about their amazing margaritas either! Let's start this crawl off right!", 
  //     yelpID: 'la-plaza-restaurant-washington',
  //     yelpObj:
  //       {
  //         display_phone: "+1-202-546-9512",
  //         image_url: "http://s3-media2.fl.yelpcdn.com/bphoto/MLrj-oWV5js3Yamx0UBFog/ms.jpg",
  //         location:
  //           {
  //             coordinate:
  //               {
  //                 latitude: 38.884792,
  //                 longitude:-76.997482,
  //               },
  //             display_address:
  //               {
  //                 0:"629 Pennsylvania Ave SE",
  //                 1:"Capitol Hill/Southeast",
  //                 2:"Washington, DC 20003",
  //               },
  //           },
  //         rating: 3.5,
  //         rating_img_url_small: "http://s3-media1.fl.yelpcdn.com/assets/2/www/img/2e909d5d3536/ico/stars/v1/stars_small_3_half.png",
  //         url: "http://www.yelp.com/biz/la-plaza-restaurant-washington"
  //       }, 
      
  //   },
  //     // {title: 'Bmore Eating', date: Date(), public: 'true', permalink: 'bmore-eating', description details: "Barssss"},
  //   ];
  //   spots.forEach(function(spot){
  //     Spots.insert(spot);
  //     });
  // }
  // if (! Locations.findOne()){
  //   var locations = [
  //     {longState: 'Alabama', stateAbr: 'AL', citiesList: {0: {name: 'Auburn', zipcode: '36830', latlng: [32.609432, -85.482396] }, 1: {name: 'Birmingham', zipcode: '35201', latlng: [33.519074, -86.802243] }, 2: {name: 'Dothan', zipcode: '36301', latlng: [31.223978, -85.390793] }, 3: {name: "Florence / muscle shoals", zipcode: '35630', latlng: [34.800404, -87.676046] }, 4: {name:"Gadsden-anniston", zipcode: '35901', latlng: [34.013462, -86.004873]}, 5: { name: "Huntsville / decatur", zipcode: '35801', latlng: [34.731378, -86.586619] }, 6: {name: 'Mobile', zipcode: '36602', latlng: [30.695998, -88.040306]}, 7: {name: 'Montgomery', zipcode: '36104', latlng:[32.365768, -86.291428] }, 8: {name: 'Tuscaloosa', zipcode:'35410', latlng: [33.206701, -87.564633]} } },
  //     //[city: 'florence / muscle shoals', zipcode: '35630', latlng: [34.800404, -87.676046]], [city: 'gadsden-anniston', zipcode: '35901', latlng: [34.013462, -86.004873]], [city: 'huntsville / decatur', zipcode: '35801', latlng: [34.731378, -86.586619]], [city: 'mobile', zipcode: '36602', latlng: [30.695998, -88.040306]], [city: 'montgomery', zipcode: '36104', latlng:[32.365768, -86.291428]], [city:'tuscaloosa', zipcode:'35410', latlng: [33.206701, -87.564633]]} },


  //   ];
  //   locations.forEach(function(location){
  //     Locations.insert(location);
  //   });
  // }


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
    email = "Hi!" + "\n"
    + "Welcome to Crawlin'! We're excited that you found us and hope we can become an invaluable service for you.\n" 
    + "\n"
    + "Please check back in with us regularly since we anticipate a growth of features and development in the near future! \n"
    + "\n"
    + "If you have any feedback we'd love to hear it, please feel free to email us at philoticconnection@gmail.com or find us on twitter <a href=\"https://www.twitter.com/ThePhilotic\" >@thephilotic</a>. \n"  
    + "\n"
    + "All you need to do now is click on the following link to verify your email address and we'll redirect you back to the site! \n"
    + url + "\n"
    + "\n"
    + "Thanks! \n"
    + "-Larry \n";
    return email;
  };


});