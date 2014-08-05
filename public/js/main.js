require.config({
    waitSeconds: 120,
    shim: {
        "jquery.ui.core": {
            deps: ["jquery"]
        },
        "jquery.ui.widget": {
            deps: ["jquery"]
        },
        "jquery.ui.mouse": {
            deps: ["jquery.ui.widget"]
        },
        "jquery.ui.sortable": {
            deps: [
                "jquery.ui.core",
                "jquery.ui.mouse",
                "jquery.ui.widget"
            ]
        },
        calendar: {
            deps: ["jquery", "moment"]
        },
        moment: {
            deps: []
        },
        "moment-range": {
            deps: ["moment"]
        },
        underscore: {
            exports: '_'
        },
        backbone: {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        },
        handlebars: {
            exports: 'Handlebars'
        },
        foundation: {
            deps: [
                'jquery',
                'modernizr'
            ],
            exports: 'Foundation'
        },
        "foundation.abide": {
            deps: ["foundation"]
        },
        "foundation.accordion": {
            deps: ["foundation"]
        },
        "foundation.alert": {
            deps: ["foundation"]
        },
        "foundation.clearing": {
            deps: ["foundation"]
        },
        "foundation.dropdown": {
            deps: ["foundation"]
        },
        "foundation.equalizer": {
            deps: ["foundation"]
        },
        "foundation.interchange": {
            deps: ["foundation"]
        },
        "foundation.joyride": {
            deps: ["foundation"]
        },
        "foundation.magellan": {
            deps: ["foundation"]
        },
        "foundation.offcanvas": {
            deps: ["foundation"]
        },
        "foundation.orbit": {
            deps: ["foundation"]
        },
        "foundation.reveal": {
            deps: ["foundation"]
        },
        "foundation.slider": {
            deps: ["foundation"]
        },
        "foundation.tab": {
            deps: ["foundation"]
        },
        "foundation.tooltip": {
            deps: ["foundation"]
        },
        "foundation.topbar": {
            deps: ["foundation"]
        }
    },
    paths: {
        modernizr: 'vendor/modernizr',
        jquery: [
            '../vendor/js/jquery-2.1.1.min'
        ],
        underscore: "../vendor/js/underscore-min",
        backbone: "../vendor/js/backbone-min",
        angular : "../vendor/js/angular.min",
        handlebars: "vendor/handlebars",
        foundation: "foundation/foundation",
        "foundation.abide": "foundation/foundation.abide",
        "foundation.accordion": "foundation/foundation.accordion",
        "foundation.alert": "foundation/foundation.alert",
        "foundation.clearing": "foundation/foundation.clearing",
        "foundation.dropdown": "foundation/foundation.dropdown",
        "foundation.equalizer": "foundation/foundation.equalizer",
        "foundation.interchange": "foundation/foundation.interchange",
        "foundation.joyride": "foundation/foundation.joyride",
        "foundation.magellan": "foundation/foundation.magellan",
        "foundation.offcanvas": "foundation/foundation.offcanvas",
        "foundation.orbit": "foundation/foundation.orbit",
        "foundation.reveal": "foundation/foundation.reveal",
        "foundation.slider": "foundation/foundation.slider",
        "foundation.tab": "foundation/foundation.tab",
        "foundation.tooltip": "foundation/foundation.tooltip",
        "foundation.topbar": "foundation/foundation.topbar",
        "calendar": "vendor/calendar",
        "moment": "vendor/moment"
    }
});

require(['jquery','underscore','backbone'],function($, _, Backbone){
  
    var contentView = Backbone.View.extend({
    	el : "[role='content']",
    	initialize : function () {
    		
    	},
    	render : function (param) {
           this.$el.html(param.name);
    	}
    });

    var router = Backbone.Router.extend({
    	routes : {
    		'arrivaldepartcalendar' : 'calendarController'
    	},
    	calendarController  : function () {
    		content.render({ name : 'calendar'});
    	}
    });
    

    var content = new contentView(); 
    var appRouter = new router();
    Backbone.history.start();

});