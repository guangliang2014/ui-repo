/*
 * Search Widget with date picker
 */

define(["jquery", "backbone" , "handlebars","underscore", "moment", "calendar"], function($, Backbone, hbs, _, moment) {

    var calendarOptionsModel = Backbone.Model.extend({
       initialize : function () {

       },
       defaults : {
          min : moment(), // today
          max : moment().add('years',3), // today + 3 years 
          min_day : 1, max_day : 1024,
          day_offset : 2,
       }
    });

    
    var CalendarRangeWidgetView = Backbone.View.extend ({
       initialize : function (param) {
          /* Setting options values */
          /********************************************/
          var initArrive = param.options.get('min');
          var day_offset = param.options.get('day_offset');
          /********************************************/

          var checkInModel =  new dateModel({ 
               type : "Arrive", 
               date : initArrive, 
               options : param.options
          });
          var checkOutModel =  new dateModel({ 
               type : "Depart", 
               date : moment(initArrive).add('days', day_offset),
               options : param.options
          });
          
          
          this.checkInView = new DayView( { el : '[data-hotel-search-date="check-in"]', model : checkInModel });
          this.checkOutView = new DayView( { el : '[data-hotel-search-date="check-out"]', model : checkOutModel });

          this.CalendarArrive = new CalendarView({ el : '[data-hotel-search-calendar="Arrive"]', model : checkInModel });
          this.CalendarDepart = new CalendarView({ el : '[data-hotel-search-calendar="Depart"]', model : checkOutModel});
          

          $('html').bind('click',this,function (e) {
             if (!($(e.target).parents('.clndr').length || $(e.target).parents('.module-search-bar').length || $(e.target).parents('.clndr-controls').length)) {
               if (e.data.CalendarDepart.isVisible()) { e.data.CalendarDepart.hide(); e.data.checkOutView.$el.toggleClass('selected');}
               if (e.data.CalendarArrive.isVisible()) { e.data.CalendarArrive.hide(); e.data.checkInView.$el.toggleClass('selected');}
             }       
          });

          
          this.checkInView.bind('click',function() {
             this.checkInView.$el.toggleClass('selected');
             if (this.CalendarArrive.$el.css('display') != 'none') {
                  this.CalendarArrive.hide();
             } else {
                  if (this.CalendarDepart.isVisible()) { this.CalendarDepart.hide(); this.checkOutView.$el.toggleClass('selected');} 
                  this.CalendarArrive.show();
             }
          },this);

          this.checkOutView.bind('click',function() {
             this.checkOutView.$el.toggleClass('selected');
             if (this.CalendarDepart.$el.css('display') != 'none') {
                  this.CalendarDepart.hide();
             } else {
                  if (this.CalendarArrive.isVisible()) { this.CalendarArrive.hide(); this.checkInView.$el.toggleClass('selected');} 
                  this.CalendarDepart.show();
             }
          },this);
          

       }
    });

    var DayView = Backbone.View.extend({
        initialize : function () {
           this.template = $('[data-day-template]'); 
           this.model.bind('change',function() { this.render();},this);
           this.render();
        },
        render : function () {
            var html =  hbs.compile(this.template.html());
            this.$el.html(html({ 
                type : this.model.get('type'),
                day : this.model.get('date').format('dddd'),
                month : this.model.get('date').format('MMM'),
                monthNumber :  this.model.get('date').format('MM'),
                dayofmonth : this.model.get('date').format('DD'),
                year       : this.model.get('date').format('YYYY')
            }));
            return this;
        },
        events : {
            "click" : "onclick"

        },
        onclick : function (e) {
          if (this.$(e.target).hasClass('click-target')) {  
            this.trigger('click'); 
          }  
        }

    });

    var CalendarView = Backbone.View.extend({
        initialize : function () {
           this.$el.css('display','none');
           if (this.model.get('type') == 'Arrive') {
              var startDate = moment(this.model.get('date')).subtract('days',1);
              var endDate = this.model.get('options').get('max');
           } else {
              var startDate = moment().add('days',this.model.get('options').get('min_day'));
              var endDate = moment().add('days',this.model.get('options').get('max_day'));
           }
           var that = this; 
           this.calendar = this.$el.clndr({
                        clickEvents: {
                            click: function(target) {
                                if (!$(target.element).hasClass('adjacent-month') && !$(target.element).hasClass('past') && !$(target.element).hasClass('inactive')) {
                                  if ($(this.element).attr('data-hotel-search-calendar') == "Arrive") {
                                        that.model.clone(target.date);
                                        that.hide();
                                        that.$el.toggleClass('selected');
                                        Clndr_range.CalendarDepart.calendar.options.constraints.startDate = moment(target.date).add('days',that.model.get('options').get('min_day') + 1);
                                        Clndr_range.CalendarDepart.calendar.options.constraints.endDate = moment(that.model.get('date')).add('days',that.model.get('options').get('max_day'));  
                                        if (target.date.isAfter(moment(Clndr_range.checkOutView.model.get('date')).subtract('days',1))) {
                                           Clndr_range.checkOutView.model.clone(moment(target.date).add('days',that.model.get('options').get('day_offset')));
                                        }
                                  } else {
                                      that.model.clone(target.date);
                                      that.hide();
                                      that.$el.toggleClass('selected');
                                  }
                                } else {
                                    if ($(target.element).hasClass('past')) {
                                       $(target.element).removeClass('Selected-date'); 
                                    }
                                } 
                            },
                            nextMonth: function(month,e){ 
                                  if ($(this.element).attr('data-hotel-search-calendar') == "Arrive") {
                                      Clndr_range.CalendarArrive.setStyle();
                                  } else {
                                      Clndr_range.CalendarDepart.setStyle();
                                  }

                            },
                            previousMonth: function(month,e){ 
                                  if ($(this.element).attr('data-hotel-search-calendar') == "Arrive") {
                                      Clndr_range.CalendarArrive.setStyle();
                                  } else {
                                      Clndr_range.CalendarDepart.setStyle();
                                  }
                            }
                        },
                        constraints: {
                            startDate: startDate, 
                            endDate:   endDate                        }  
           });
           
           
        },
        show : function () {
            this.calendar.month = moment(this.model.get('date'));
            this.calendar.render();
            this.setStyle(this.calendar.month);
            this.$el.css('display','block');
        },
        hide : function () {
            this.$el.css('display','none')
        },
        isVisible : function () {
            if (this.$el.css('display') == 'none') { return false; } else { return true; }
        },
        markInactiveDay : function (momentObj) {
            $(".calendar-day-" + momentObj.format('YYYY-MM-DD')).addClass('past').addClass('inactive'); 
        },
        markAllInactiveBefore : function (momentObj) {
             var day = '';
             for (var i = 1; i < Number(momentObj.format('DD')); i++ ) {
               if (i < 10) { day = "0" + i;} else { day = i; } 
               this.markInactiveDay(moment(momentObj.format('YYYY-MM-') + day));
             }
        },
        markSelected : function (momentObj) {
            $(".calendar-day-" + momentObj.format('YYYY-MM-DD')).addClass('selected-date');
        },
        markAllBeforeDefault : function () {
           var day = ''; 
           for (var i = 1; i <= 31; i++) {
              if (i < 10) { day = '0' + i;} else { day = i;}
              if (moment(this.calendar.month.format('YYYY-MM-' + day)).isValid() && moment(this.calendar.month.format('YYYY-MM-' + day)).isBefore(moment(Clndr_range.defaultArrive)) && moment(this.calendar.month.format('YYYY-MM-' + day)).isAfter(moment()) ) {
                $(".calendar-day-" + this.calendar.month.format('YYYY-MM-' + day)).addClass('beforeDefault'); 
              }
           }
        },
        HighlightRange : function () {
            var start = moment(Clndr_range.checkInView.model.get('date'));
            var end = moment(Clndr_range.checkOutView.model.get('date')).add('days',1);
            for (var i = start; i.isBefore(end) ; i.add('days',1)) {
               this.markSelected(moment(i));
            }
        },
        setStyle : function () {
            this.markSelected(this.model.get('date'));
            this.markAllInactiveBefore(this.calendar.options.constraints.startDate);
            this.markAllBeforeDefault();
            this.HighlightRange();
        }


    });

    dateModel = Backbone.Model.extend({
        initialize: function(){
           
        },
        defaults : {
            "date" : new moment()
        },
        add : function (type,value) {
            this.attributes.date.add(type,value);
            this.trigger('change');
        },
        clone : function (momentObj) {
            this.attributes.date = moment(momentObj);  
            this.trigger('change');
        }
    });

    return {
        getOptions: function() {
            return calendarOptions;
        },
        init: function(el) {
          Clndr_range = new CalendarRangeWidgetView({ 
              el : el,
              options : new calendarOptionsModel ({
                  min_day : 2,
                  max_day : 10,
                  day_offset : 5
              })
          });

        }
    }

});

