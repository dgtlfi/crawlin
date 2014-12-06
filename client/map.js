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
    // console.log(markers);
    // console.log(marker.options._id);
    var markerID = marker.options._id;
    if (markers.length == 0){
      markers[markerID] = marker;
      map.addLayer(marker);
    }else if(! markers[marker]){
      // console.log("in");
      // console.log('marker not in array, adding')
      markers[markerID] = marker;
      map.addLayer(marker);
      // console.log(markers);
    }
    // console.log('did not add marker, it was already there');
  }

  var removeMarker = function (spot){
    // console.log(markers[spot._id]);
    var marker = markers[spot._id];
    if (map.hasLayer(marker)){
      map.removeLayer(marker);
      markers[spot._id] = null;
    } else{
      console.log('removeMarker failed');
      map.eachLayer(function(layer){
        console.log(layer);
      });
    }
  }

  var updateMarker = function (spot){
    removeMarker(spot);
    addSpots(spot);
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
    // console.log(spot._id);
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

  var popup = L.popup();
  function notLoggedIn(e) {
      popup
        .setLatLng(e.latlng)
        .setContent("Sorry but you must be logged in to add a location.")
        .openOn(map);
      }

  var openCreateDialog = function(latlng){
    // console.log(latlng);
    Session.set("createCoords", latlng);
    Session.set("createError", null);
    Session.set("showCreateDialog", true);
  };

  Template.map.created = function(){

    markers=[];

  }
  

  Template.map.rendered = function(){
    $(window).resize(function(){
      var h = $(window).height(), offsetTop=90;
      $('#map_canvas').css('height', (h-offsetTop));
    }).resize();

    initialize($("#map_canvas")[0], [38.900644, -77.036849], 13 );
    // var selectedPerm = Session.get('selectedPerm');
    // Events.findOne({permalink: selectedPerm}, {fields: {latlng:1} });
    // console.log(Events.findOne({permalink: selectedPerm}, {fields: {latlng:1} }));
    // initialize($("#map_canvas")[0], selectedPerm, 10 );

    map.on('dblclick', function(e){
      if (! Meteor.userId()){
        notLoggedIn(e);
        console.log("Not logged in.");
        return;
      }
      openCreateDialog(e.latlng);
    });

    // console.log(Session.get('selectedPerm'));
    // var eventID = Events.findOne({permalink: Session.get('selectedPerm')}, {fields: {_id:1}}); 


    Spots.find({permalink: Session.get('selectedPerm'), public: true }).observe({
        added: function(spot){
          // console.log('added');
          addSpots(spot);
        },
        changed: function(spot){
          // var marker = markers[spot._id];
          updateMarker(spot);
        },
        removed: function(spot){
          // console.log('removed');
          removeMarker(spot);
        }
      });
  }
}

