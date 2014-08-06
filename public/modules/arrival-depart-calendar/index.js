define(['../arrival-depart-calendar/arrival-depart-calendar'],function(calendar) {
  
   return {
   	  init : function () {
         calendar.init({ 
         	   el : '[arrival-depart-calendar-container]'
         	});
   	  }
   }

});