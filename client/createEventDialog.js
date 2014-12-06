///////////////////////////////////////////////////////////////////////////////
// Create Party dialog

Template.createEventDialog.events({
  'click .save': function (event, template) {
    function prototype( str ){
        var ret = str;
        ret = ret.replace( /ø/g, 'oe' );
        ret = ret.replace( /Ø/g, 'OE' );
        ret = ret.replace( /å/g, 'aa' );
        ret = ret.replace( /Å/g, 'AA' );
        ret = ret.replace( /æ/g, 'ae' );
        ret = ret.replace( /Æ/g, 'AE' );
        ret = ret.replace( /\_/g, '-' );

        ret = ret.replace(/[^a-zA-Z0-9\/-]/ig,'-').replace(/_+/ig,'-').replace(/[-]{2,}/g, '-').toLowerCase();

        return ret;
    }

    var title = template.find(".title").value;
    var description = template.find(".description").value;
    var public = ! template.find(".private").checked;
    var date = $('#my-datepicker').datepicker('getUTCDate');
    var permalink = prototype(title);
    var city = template.find(".city").value;
    var state = template.find(".state").value;

    if (title.length && description.length) {
      Meteor.call('createEvent', {
        title: title,
        description: description,
        permalink: permalink,
        date: date,
        public: public,
        city: city,
        state: state,
      }, function (error, template) {
        if (! error) {
          $('body').removeClass('modal-open');
          // Session.set("selectedEvent", this._id);
        }
        // console.log(this._id);
      });
      Session.set("showCreateEventDialog", false);
    } else {
      Session.set("createError",
                  "It needs a Name and a Description");
    }
  },

  'click .cancel': function () {
    $('body').removeClass('modal-open');
    Modal.hide(Session.get('currentModal'));
    Session.set("showCreateEventDialog", false);
  },

  'click .modal-backdrop': function(){
    $('body').removeClass('modal-open');
    Modal.hide(Session.get('currentModal'));
    Session.set("showCreateEventDialog", false);
  }
});

Template.createEventDialog.helpers({
  createError: function(){
    return Session.get("createError");
  }
});

Template.createEventDialog.rendered = function(){
  $('#my-datepicker').datepicker({
    todayBtn: "linked",
    orientation: "auto",
    todayHighlight: true
    });
}

