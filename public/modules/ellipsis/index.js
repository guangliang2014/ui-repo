define(['backbone','foundation','highligth','../ellipsis/ellipsis'],function(Backbone,foundation,highligth,ellipsis) {
  
   var ellipsisDemoView = Backbone.View.extend({
      initialize : function () {
        this.$('.ellipsis').ellipsis({
           showChar : 250
        });
        $('pre code').each(function (i,block) { 
            hljs.highlightBlock(block)
        });  
      }
   });    
    
   return {
   	  init : function (el) {
         var ellipsisView = new ellipsisDemoView({
           el : el
         });
   	  }
   }

});