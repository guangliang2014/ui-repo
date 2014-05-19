var RoomSlide_Container = Backbone.View.extend({
    initialize: function() {
        this.mark_selected($('#slide_photos'));
        $('#divider1').css("visibility", "hidden");
    },
    el: ".room-slide-container",
    events: {
        "after-slide-change.fndtn.orbit": "checkPointer"
    },
    checkPointer: function(event, orbit) {
        if (orbit.slide_number == 0) {
            this.mark_unselected($('.slide-link'));
            this.mark_selected($('#slide_photos'));
            $('#divider2').css("visibility", "visible");
            $('#divider1').css("visibility", "hidden");
        } else if (orbit.slide_number == 3) {
            this.mark_unselected($('.slide-link'));
            this.mark_selected($('#slide_layouts'));
            $('#divider1').css("visibility", "hidden");
            $('#divider2').css("visibility", "hidden");
        } else if (orbit.slide_number == 4) {
            this.mark_unselected($('.slide-link'));
            this.mark_selected($('#slide_maps'));
            $('#divider1').css("visibility", "visible");
            $('#divider2').css("visibility", "hidden");
        }
    },
    mark_selected: function(elemHandle) {
        elemHandle.css({
            'color': 'rgb(202,202,202)',
            'background-color': 'white'
        });
        elemHandle.children("p").children("i").removeClass("light-icon").addClass("light-dark-color");
    },
    mark_unselected: function(elemHandle) {
        elemHandle.css({
            'color': 'white',
            'background-color': 'rgb(26,154,197)'
        });
        elemHandle.children("p").children("i").removeClass("light-dark-color").addClass("light-icon");
    }
});
var slide = new RoomSlide_Container();