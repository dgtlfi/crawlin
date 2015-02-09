if (Meteor.isClient) {
  L.Icon.Default.imagePath = 'packages/leaflet/images';

  var map, markers = [];

  var providers = {
      Stamen_Toner : {
        url: "http://{s}.tile.stamen.com/toner/{z}/{x}/{y}.png",
        attribution: "Map Tiles by <a href='http://stamen.com'>Stamen Design</a>"
      },
      OSM_BlackAndWhite : {
        url: "http://{s}.tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png",
        attribution: "&copy; <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a>"
      },
      OSM_Mapnik : {
        url: "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        attribution: "&copy; <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a>"
      },
      OSM_HOT : {
        url: "http://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png",
        attribution: "&copy; <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a>"
      },
      TF_OpenCycleMap : {
        url: "http://{s}.tile.thunderforest.com/cycle/{z}/{x}/{y}.png",
        attribution: "&copy; <a href='http://www.opencyclemap.org'>OpenCycleMap</a>, &copy; <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a>"
      },
      TF_Landscape : {
        url: "http://{s}.tile.thunderforest.com/landscape/{z}/{x}/{y}.png",
        attribution: "&copy; <a href='http://www.opencyclemap.org'>OpenCycleMap</a>, &copy; <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a>"
      },
      TF_Outdoors : {
        url: "http://{s}.tile.thunderforest.com/outdoors/{z}/{x}/{y}.png",
        attribution: "&copy; <a href='http://www.opencyclemap.org'>OpenCycleMap</a>, &copy; <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a>"
      },
      OM_Surfer_Roads : {
        url: "http://openmapsurfer.uni-hd.de/tiles/roads/x={x}&y={y}&z={z}",
        attribution: 'Imagery from <a href="http://giscience.uni-hd.de/">GIScience Research Group @ University of Heidelberg</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        minZoom: 0,
        maxZoom: 20,
      },
      Hydda_Full : {
        url: "http://{s}.tile.openstreetmap.se/hydda/full/{z}/{x}/{y}.png",
        attribution: 'Tiles courtesy of <a href="http://openstreetmap.se/" target="_blank">OpenStreetMap Sweden</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      },
      Stamen_Terrain : {
        url: "http://{s}.tile.stamen.com/terrain/{z}/{x}/{y}.png",
        attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      },
      Esri_WorldStreetMap : {
        url: "http://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}",
        attribution: "Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012"
      },
      Esri_WorldTopoMap : {
        url: "http://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}",
        attribution: "Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012"
      },
      Esri_NatGeoWorldMap : {
        url: "http://server.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}",
        attribution: "Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012"
      },

    }

  var initialize = function (element, centroid, zoom, provider){
    map = L.map(element, {
      scrollWheelZoom: false,
      doubleClickZoom: false,
      boxZoom: false,
      touchZoom: false,
    }).setView(new L.LatLng(centroid[0], centroid[1]), zoom);
    console.log(provider);
    L.tileLayer(providers[provider].url, {
      attribution: providers[provider].attribution,
      unloadInvisibleTiles: 'true',
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
    } 
    // else{
    //   console.log('removeMarker failed');
    //   map.eachLayer(function(layer){
    //     console.log(layer);
    //   });
    // }
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
    map.setView(spot.latlng);
    var marker = new L.Marker(spot.latlng, {
      _id: spot._id,
      icon: createIcon(spot),
      riseOnHover: true,
      riseOffset: 1500,
    }).on('click', function(e){
      Session.set('selectedSpot', e.target.options._id);
      Session.set('activeSpot', spot.number);
      Session.set('spotYelpObj', spot.yelpObj);
    }).on('dblclick', function(e){
      // Session.set('showContent', spot);
      Session.set('selectedSpot', e.target.options._id);
      // Session.set('showEditContentDialog', true);
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
    if (! Session.get("selectedSpot")) {
      var spot = Spots.findOne({permalink:Session.get('selectedPerm'), number:'1'});
      if (spot) {
        Session.set("selectedSpot", spot._id);
        Session.set('activeSpot', spot.number);
        Session.set('spotYelpObj', spot.yelpObj);
        
      }
    }
    
  }
  

  Template.map.rendered = function(){
    $(window).resize(function(){
      var h = $(window).height(), offsetTop=360;
      $('#map_canvas').css('height', (h-offsetTop));
    }).resize();

    // initialize($("#map_canvas")[0], [Session.get('eLatLng').latitude, Session.get('eLatLng').longitude], 13 );
    
    
    var evt = Events.findOne({permalink: Session.get('selectedPerm')});
    if (evt) {
      if (evt.mapProvider){
        Session.set('selectedProvider', evt.mapProvider);
        initialize($("#map_canvas")[0], [38.907711,-77.017322], 13, Session.get('selectedProvider') );
      } else {
        initialize($("#map_canvas")[0], [38.907711,-77.017322], 13, 'Stamen_Toner' );
      }
      if (evt.spotColor){
        Session.set('selectedColor', evt.spotColor);
        
      }
    } else{
      initialize($("#map_canvas")[0], [38.907711,-77.017322], 13, 'Stamen_Toner' );
    }

    // map.on('dblclick', function(e){
    //   if (! Meteor.userId()){
    //     notLoggedIn(e);
    //     console.log("Not logged in.");
    //     return;
    //   }
    //   openCreateDialog(e.latlng);
    // });

    // console.log(Session.get('selectedPerm'));
    // var eventID = Events.findOne({permalink: Session.get('selectedPerm')}, {fields: {_id:1}}); 

    Spots.find({permalink: Session.get('selectedPerm')}).observe({
        added: function(spot){
          addSpots(spot);
        },
        changed: function(spot){
          updateMarker(spot);
        },
        removed: function(spot){
          // console.log('removed');
          removeMarker(spot);
        }
      });

    var spot2 = Spots.findOne({permalink: Session.get('selectedPerm'), number:'1'});
    try{
      map.setView(spot2.latlng);
    } catch (e){
      console.log(e);
    } 
  }

  Template.map.helpers({ 
    selectedColor: function(){
      var color = Session.get('selectedColor');
      if (color){
        return color;
      }
    }
  });


  Template.pagination.helpers({    
    spot: function(){
      var spot = Spots.find({permalink: Session.get('selectedPerm')}, {fields: {number:1}}).fetch(); 
      // console.log(spot);
      var newArray = []
      spot.forEach(function(x){
        if (x.number == Session.get('activeSpot')){
          // console.log('active');
          newArray.push({number: x.number, status: 'active'});

        }else {
          // console.log('inactive');
          newArray.push({number: x.number, status: 'inactive'});
        }
        
      });
      return newArray;
    },

  });

  
  Template.pagination.events({
    'click .pagination li': function(event, template){
      // console.log(event.target.text);
      number = event.target.text;
      number2 = number.replace(/[^0-9]/ig,'');
      text = number.replace(/[^a-zA-Z]/ig,'');
      
      // console.log(spot._id);
      if (text === 'Previous'){
        active = Session.get('activeSpot');
        prevNumber = (parseInt(active)-1).toString();
        if (prevNumber != 0){
          spot = Spots.findOne({permalink: Session.get('selectedPerm'), number: prevNumber});
          Session.set('selectedSpot', spot._id);
          Session.set('activeSpot', prevNumber);
          Session.set('spotYelpObj', spot.yelpObj);
          // var map = Session.get('mapContext');
          map.setView(spot.latlng);
        }    
      } else if (text === 'Next'){
        active = Session.get('activeSpot');
        nextNumber = (parseInt(active)+1).toString();
        count = Spots.find({permalink: Session.get('selectedPerm')}, {fields: {id:1}}).count();
        if (nextNumber <= count){
          spot = Spots.findOne({permalink: Session.get('selectedPerm'), number: nextNumber});
          Session.set('selectedSpot', spot._id);
          Session.set('activeSpot', nextNumber);
          Session.set('spotYelpObj', spot.yelpObj);
          map.setView(spot.latlng);
        }else {
          nextNumber = Session.get('activeSpot');
        }
        
      } else {
        active = Session.get('activeSpot');
        spot = Spots.findOne({permalink: Session.get('selectedPerm'), number: number2});
        Session.set('selectedSpot', spot._id);
        Session.set('activeSpot', number2);
        Session.set('spotYelpObj', spot.yelpObj);
        map.setView(spot.latlng);
      }
      
    },

  });

  Template.map_edit.created = function(){
    Session.set('selectedProvider', 'Stamen_Toner');
  }

  Template.map_edit.rendered = function(){
    var evt = Events.findOne({_id: Session.get('selectedEvent')});
    if (evt.mapProvider){
      Session.set('selectedProvider', evt.mapProvider);
    }
    if (evt.spotColor){
      Session.set('selectedColor', evt.spotColor);
    }
  }
  

  Template.map_edit.events({
    'click input.provider': function(event, template){
      providerID = event.currentTarget.id;
      Session.set('selectedProvider', providerID);
      L.tileLayer(providers[providerID].url, {
        attribution: providers[providerID].attribution,
        unloadInvisibleTiles: 'true',
      }).addTo(map);
    },

    'click input.color': function(event, template){
      color = event.currentTarget.id;
      $('.leaflet-div-icon').css({"background":color});
      Session.set('selectedColor', color);
    },

  });

  Template.map_edit.helpers({

  });

}



