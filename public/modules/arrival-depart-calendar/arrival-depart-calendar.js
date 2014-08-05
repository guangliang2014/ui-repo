/*
 * Search Widget with date picker
 */

define(["jquery", "backbone" , "handlebars","underscore", "moment", "calendar"], function($, Backbone, hbs, _, moment) {

    var calendarOptions = {};

    
    var CalendarRangeWidgetView = Backbone.View.extend ({
       initialize : function () {
          var initArrive = moment();
          this.defaultArrive ='2015-02-01';
          if (initArrive.isBefore(this.defaultArrive)) { initArrive = moment(this.defaultArrive); }
          var checkInModel =  new dateModel({ type : "Arrive", date : initArrive});
          var checkOutModel =  new dateModel({ type : "Depart", date : moment(initArrive).add('days',2)});
          
          var options = {
                            checkInDate:  checkInModel.get('date'),
                            checkOutDate: checkOutModel.get('date')
                        }

          this.checkInView = new DayView( { el : '[data-hotel-search-date="check-in"]', model : checkInModel });
          this.checkOutView = new DayView( { el : '[data-hotel-search-date="check-out"]', model : checkOutModel });

          this.CalendarArrive = new CalendarView({ el : '[data-hotel-search-calendar="Arrive"]', model : checkInModel });
          this.CalendarDepart = new CalendarView({ el : '[data-hotel-search-calendar="Depart"]', model : checkOutModel});
          this.CalendarDepart.calendar.options.constraints.startDate = moment(checkOutModel.get('date')).subtract('days',1);
          
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
          calendarOptions = options;

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
            this.$el.html(html({ type : this.model.get('type') ,day : this.model.get('date').format('ddd'), month : this.model.get('date').format('MMM'), dayofmonth : this.model.get('date').format('D')}));
            return this;
        },
        events : {
            "click" : "onclick"

        },
        onclick : function (e) {
           this.trigger('click'); 
        }

    });

    var CalendarView = Backbone.View.extend({
        initialize : function () {
           this.$el.css('display','none'); 
           this.calendar = this.$el.clndr({
                        clickEvents: {
                            click: function(target) {
                                if (!$(target.element).hasClass('adjacent-month') && !$(target.element).hasClass('past') && !$(target.element).hasClass('inactive')) {
                                  if ($(this.element).attr('data-hotel-search-calendar') == "Arrive") {
                                    if (!$(target.element).hasClass('beforeDefault')) {
                                        Clndr_range.checkInView.model.clone(target.date);
                                        Clndr_range.CalendarArrive.hide();
                                        Clndr_range.checkInView.$el.toggleClass('selected');
                                        Clndr_range.CalendarDepart.calendar.options.constraints.startDate = moment(target.date).add('days',1);  
                                        if (target.date.isAfter(moment(Clndr_range.checkOutView.model.get('date')).subtract('days',1))) {
                                           Clndr_range.checkOutView.model.clone(moment(target.date).add('days',2));
                                        }
                                    } else {
                                        $('#calendarMsg').foundation('reveal', 'open');
                                    }    

                                  } else {
                                      Clndr_range.checkOutView.model.clone(target.date);
                                      Clndr_range.CalendarDepart.hide();
                                      Clndr_range.checkOutView.$el.toggleClass('selected');
                                  }
                                } else {
                                    if ($(target.element).hasClass('past')) {
                                       $(target.element).removeClass('Selected-date'); 
                                    }
                                } 
                                var options = {
                                    checkInDate: Clndr_range.checkInView.model.get('date'),
                                    checkOutDate: Clndr_range.checkOutView.model.get('date')
                                }

                                $.publish(REVELEX.pubsub.calendar.date.select, [options]);
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
                            startDate: moment(), 
                            endDate:   moment(this.model.get('date')).add('years', 3)
                        }  
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
          Clndr_range = new CalendarRangeWidgetView({ el : el });
          $('.module-search-bar').fadeIn();
        }
    }

});

