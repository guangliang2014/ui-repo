(function ($) {
    

	$.fn.ellipsis = function (config) {

        var config       = config || {};
        var showChar     = config.showChar || 100;
        var ellipsisText = config.ellipsisText || '...';
        var moreText     = config.moreText || 'more';
        var lessText     = config.lessText || 'less';
        
              this.each(function() {
                  var content = $(this).html();
                  if(content.length > showChar) {
                      var c = content.substr(0, showChar);
                      var h = content.substr(showChar-1, content.length - showChar);
                      var html = c + '<span class="moreellipsis">' + ellipsisText+ '&nbsp;</span><span class="morecontent"><span style="display:none;">' + h + '</span>&nbsp;&nbsp;<a href="" class="morelink">'                                  + moreText + '</a></span>';
                      $(this).html(html);
		                      $(this).find(".morelink").click(function(){
				                  if($(this).hasClass("less")) {
				                      $(this).removeClass("less");
				                      $(this).html(moreText);
				                  } else {
				                      $(this).addClass("less");
				                      $(this).html(lessText);
				                  }
				                  $(this).parent().prev().toggle();
				                  $(this).prev().toggle();
				                  return false;
			                  });
                  } 
           
              });
	}

})( jQuery );