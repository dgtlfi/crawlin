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
    // console.log('addMarker');
    if(!markers[marker.options._id]){
      console.log('marker not in array, adding')
      map.addLayer(marker);
      markers[marker.options._id] = marker;
    }
    console.log('did not add marker, it was already there');
  }

  var removeMarker = function (_id){
    var marker = markers[_id];
    console.log(marker);
    if (map.hasLayer(marker)){
      map.removeLayer(marker);
    } else{
      console.log('removeMarker failed');
      map.eachLayer(function(layer){
        console.log(layer);
      });
    }
  }

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
      icon: createIcon(spot),
      riseOnHover: true,
      riseOffset: 1500,
    }).on('click', function(e){
      //Add click to show description
      // Session.set('showContent', spot);
      Session.set('selectedSpot', e.target.options._id);
    }).on('dblclick', function(e){
      // Session.set('showContent', spot);
      Session.set('selectedSpot', e.target.options._id);
      Session.set('showEditContentDialog', true);
      Session.set('createCoords', e.latlng);
    });
    addMarker(marker);
    // var circle = L.circle(spot.latlng, 150, {
    //   color: 'blue',
    //   fillColor: '#000',
    //   fillOpacity: 0.5
    // }).addTo(map);
  }

  // var editSpot = function(marker){
  //   marker.on('dblclick', function(e){
  //     // Session.set('showContent', spot);
  //     Session.set('selectedSpot', e.target.options._id);
  //     Session.set('showEditContentDialog', true);
  //     Session.set('createCoords', e.latlng);
  //   });
  // }

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

  Template.map.created = function(){

    markers=[]
    if (! Session.get('selectedEvent') ) {
      console.log("Didn't find selectedEvent - map.js");
      var currentRoute = Router.current();
      var currentPerm = currentRoute.params.permalink;
      // var eventObj = Events.findOne({permalink: currentPerm}, {fields: {_id:1}});
      // console.log(eventObj);
      // var eventID = eventObj._id;
      // Session.set('eventID', eventID );
      // var eventSpots = Spots.find({eventID: eventID, public: true }).fetch();
      
      // var count = 0;
      // eventSpots.forEach(function(spot){
      //   // console.log(spot.eventID);
      //   addSpots(spot);
      //   count+=1;
      // });
      // console.log(eventObj);
      // Session.set('selectedEvent',this._id);
    } else{
      var eventObj = Session.get('selectedEvent');
      var eventID = eventObj._id;
      Session.set('eventID', eventID);
      var eventSpots = Spots.find({eventID: eventID, public: true }).fetch();
      // console.log(eventSpots);
      var count = 0;
      eventSpots.forEach(function(spot){
        // console.log(spot.eventID);
        addSpots(spot);
        count+=1;
      });
    }
  }
  

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

    Spots.find({eventID: Session.get('eventID'), public: true }).observe({
        added: function(spot){
          console.log('added');
          addSpots(spot);
        },
        changed: function(spot){
          console.log('changed');
          var marker = markers[spot._id];
          // if (marker) marker.setIcon(createIcon(spot));
          // editSpot(spot._id);
        },
        removed: function(spot){
          console.log('removed');
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

