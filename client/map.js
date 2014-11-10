if (Meteor.isClient) {
  L.Icon.Default.imagePath = 'packages/leaflet/images'
  $(window).resize(function(){
    var h = $(window).height(), offsetTop=90;
    $mc = $('#map_canvas');
    $mc.css('height', (h-offsetTop));
  }).resize();

  var map, markers = [];

  var initialize = function (element, centroid, zoom, features){
    map = L.map(element, {
      scrollWheelZoom: false,
      doubleClickZoom: false,
      boxZoom: false,
      touchZoom: false,
    }).setView(new L.LatLng(centroid[0], centroid[1]), zoom);

    L.tileLayer('http://{s}.tile.stamen.com/toner/{z}/{x}/{y}.png', {
      attribution: 'Map Tiles by <a href="http://stamen.com">Stamen Designm</a>'
    }).addTo(map);

  }

  var addMarker = function(marker) {
    console.log('addMarker');
    map.addLayer(marker);
    markers[marker.options._id] = marker;
  }

  // var removeMarker = function (_id){
  //   var marker = markers[_id];
  //   if (map.hasLayer(marker)) map.removeLayer(marker);
  // }

  var createIcon = function(spot){
    var className = "leaflet-div-icon ";
    className += spot.public ? 'public' : 'private';
    return L.divIcon({
      iconSize:[30,30],
      html: '<b>' + spot.number + '</b>',
      className: className
    });
  }

  var addSpots = function(spot) {
    var marker = new L.Marker(spot.latlng, {
      _id: spot._id,
      icon: createIcon(spot)
    }).on('click', function(e){
      //Add click to show description
      Session.set('showContent', spot);
      Session.set('selectedSpot', e.target.options._id);
    }).on('dblclick', function(e){
      Session.set('showEditContentDialog', true);
      console.log('dblclick');
    });
    addMarker(marker);
    // var circle = L.circle(spot.latlng, 150, {
    //   color: 'blue',
    //   fillColor: '#000',
    //   fillOpacity: 0.5
    // }).addTo(map);
  }

  var popup = L.popup();
  function notLoggedIn(e) {
      popup
        .setLatLng(e.latlng)
        .setContent("Sorry but you must be logged in to add a location.")
        .openOn(map);
      }

  var openCreateDialog = function(latlng){
    console.log(latlng);
    Session.set("createCoords", latlng);
    Session.set("createError", null);
    Session.set("showCreateDialog", true);
  };

  // Template.map.created = function(){
    
  //   Spots.find({}).observe({
  //     added: function(spot){
  //       addSpots(spot);
  //       // var marker = new L.Marker(spot.latlng, {
  //       //   _id: spot._id,
  //       //   icon: createIcon(spot)
  //       // }).on('click', function(e){
  //       //   console.log('createdClick');
  //       //   console.log(e);
  //       //   Session.set('selectedSpot', e.target.options._id)
  //       // });
  //       // console.log('created!!!');
  //       // console.log(Session.get('selectedSpot'));
  //       // addMarker(marker);
  //     },
  //     changed: function(spot){
  //       // var marker = markers[spot._id];
  //       // if (marker) marker.setIcon(createIcon(spot));
  //       addSpots(spot);
  //     },
  //     removed: function(spot){
  //       removeMarker(spot._id);
  //     }
  //   });
  // }

  Template.map.rendered = function(){
    $(window).resize(function(){
      var h = $(window).height(), offsetTop=90;
      $('#map_canvas').css('height', (h-offsetTop));
    }).resize();

    initialize($("#map_canvas")[0], [38.900644, -77.036849], 13 );

    // var circle = L.circle([38.900644, -77.036849], 150, {
    //     color: 'blue',
    //     fillColor: '#000',
    //     fillOpacity: 0.5
    // }).addTo(map);

    // circle.bindPopup("Washington DC");

    // var popup = L.popup();

    // function onMapClick(e) {
    //     popup
    //         .setLatLng(e.latlng)
    //         .setContent("You clicked the map at " + e.latlng.toString())
    //         .openOn(map);
    // }

    // map.on('click', onMapClick);
    

    map.on('dblclick', function(e){
      if (! Meteor.userId()){
        notLoggedIn(e);
        console.log("Not logged in.");
        return;
      }
      openCreateDialog(e.latlng);
    });

    

    if (! Session.get('selectedEvent') ) {
      console.log('hi');
      var currentRoute = Router.current();
      var currentPerm = currentRoute.params.permalink;
      
      var eventObj = Events.findOne({permalink: currentPerm}, {fields: {_id:1}});
      Session.set('selectedEvent', eventObj );
      // console.log(eventObj);
      Session.set('selectedEvent',this._id);
    } else{
      var eventObj = Session.get('selectedEvent');
      var eventID = eventObj._id;
      var eventSpots = Spots.find({eventID: eventID, public: true }).fetch();
      // console.log(eventSpots);
      var count = 0;
      eventSpots.forEach(function(spot){
        // console.log(spot.eventID);
        addSpots(spot);
        count+=1;
      });

      
    }

    Spots.find({eventID: eventID, public: true }).observe({
        added: function(spot){
          addSpots(spot);
        },
        changed: function(spot){
          addSpots(spot);
        },
        removed: function(spot){
          removeMarker(spot._id);
        }
      });


    // var self = this;
    // Meteor.autorun(function() {
    //   var selectedParty = Spots.findOne({eventID: Session.get("selectedEvent")});
    //   if (selectedParty) {
    //     if (!self.animatedMarker) {
    //       var line = L.polyline([[selectedParty.latlng.lat, selectedParty.latlng.lng]]);
    //       self.animatedMarker = L.animatedMarker(line.getLatLngs(), {
    //         autoStart: false,
    //         distance: 3000,  // meters
    //         interval: 200, // milliseconds
    //         icon: L.divIcon({
    //           iconSize: [50, 50],
    //           className: 'leaflet-animated-icon'
    //         })
    //       });
    //       map.addLayer(self.animatedMarker);
    //     } else {
    //       // animate to here
    //       var line = L.polyline([[self.animatedMarker.getLatLng().lat, self.animatedMarker.getLatLng().lng],
    //         [selectedParty.latlng.lat, selectedParty.latlng.lng]]);
    //       self.animatedMarker.setLine(line.getLatLngs());
    //       self.animatedMarker.start();
    //     } 
    //   }
    // })
    
  }
}

