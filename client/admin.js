// Template.allSpots.events({
  // 'click a.createNewSpotDialog': function(event, template){
  //   Session.set('showCreateSpotDialog', true);
  //   Session.set('currentModal', 'createNewSpotDialog');
  //   Modal.show('createNewSpotDialog');
  // },

  // 'click .doneAdding': function (event, template) {
  //   Router.go('myEvents', {userID: Meteor.user()._id});
  // },

  // 'click a.deleteSpot': function(event, template){
  //   var spotID = event.currentTarget.id;
  //   console.log(spotID);
  //   Meteor.call('deleteSpot', spotID);
  // },

  // 'click a.editSpot': function(event, template){
  //   console.log('hi');
  //   var eventID = event.currentTarget.id;
  //   Session.set('selectedEvent', eventID);
  //   Session.set('showEditSpotDialog', true);
  //   Session.set('currentModal', 'editSpotDialog');
  //   Modal.show('editSpotDialog');
  // },
// });

Template.allSpots.rendered = function(){
  // var el = document.getElementById('items');
  // var sortable = new Sortable(el, {
  //   onStart: function (evt) {
  //       evt.oldIndex;  // element index within parent
  //       // console.log(evt.oldIndex+1);
  //   },
  //   onEnd: function (evt) {
  //       evt.oldIndex;  // element's old index within parent
  //       // console.log(evt.oldIndex);
  //       evt.newIndex;  // element's new index within parent
  //       // console.log(evt.newIndex+1);
  //       Session.set('newRowNumber', evt.newIndex + 1)
  //   },
  //   onUpdate: function (evt) {
  //       var itemEl = evt.item;  // dragged HTMLElement
  //       console.log(itemEl.id);
  //       // Meteor.call('updateSpotNumber', itemEl.id, Session.get('newRowNumber'), function (error, template){
  //       //   if(!error){
  //       //     console.log('successful update of row number');
  //       //   }else{
  //       //     console.log(error);
  //       //   }

  //       // }); 
  //       // + indexes from onEnd
  //   },
  //   onSort: function(evt){
  //     var itemEl = evt.item;
  //     console.log(itemEl);
  //   }

  // });
  // function colData(){
  //    return [{
  //       values: [{x:'1',y:'2'},{x:'2',y:'5'},{x:'3',y:'-1'}],
  //       key: "Sine Wave",
  //       color: "#ff7f0e"
  //       },
  //       {
  //       values: [{x:'1',y:'4'},{x:'2',y:'8'},{x:'3',y:'24'}],
  //       key: "Ck Wave",
  //       color: "#ff7dcff"
  //       }
  //     ];
  // }

  //  function sinData() {
  //   var sin = [];
  //   for (var i = 0; i < 100; i++) {
  //   sin.push({x: i, y: Math.sin(i/10) * Math.random() * 100});
  //   }
  //   return [{
  //   values: sin,
  //   key: "Sine Wave",
  //   color: "#ff7f0e"
  //   }];
  //   }


  // this.autorun(function() {
  //   var dataTemplate = Template.currentData();
  //   var chart;
  //   nv.addGraph(function() {
  //     chart = nv.models.historicalBarChart();
  //     chart
  //       // .margin({left: 100, bottom: 100})
  //       .useInteractiveGuideline(true)
  //       .duration(250)
  //       ;
  //     // chart sub-models (ie. xAxis, yAxis, etc) when accessed directly, return themselves, not the parent chart, so need to chain separately
  //     chart.xAxis
  //       .axisLabel("Time (s)")
  //       .tickFormat(d3.format(',.1f'));
  //     chart.yAxis
  //       .axisLabel('Voltage (v)')
  //       .tickFormat(d3.format(',.2f'));
  //     chart.showXAxis(true);
      
  //     d3.select('#barGraph')
  //       .datum(colData())
  //       .transition()
  //       .call(chart);
      
  //     nv.utils.windowResize(chart.update);
  //     chart.dispatch.on('stateChange', function(e) { nv.log('New State:', JSON.stringify(e)); });
  //     return chart;
  //   });
  // });
}

