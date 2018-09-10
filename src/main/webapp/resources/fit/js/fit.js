/*
	Full Motion by TEMPLATED
	templated.co @templatedco
	Released for free under the Creative Commons Attribution 3.0 license (templated.co/license)
*/

(function($) {

	skel.breakpoints({
		xlarge:	'(max-width: 1680px)',
		large:	'(max-width: 1280px)',
		medium:	'(max-width: 980px)',
		small:	'(max-width: 736px)',
		xsmall:	'(max-width: 480px)'
	});

	$(function() {

		var $window = $(window),
			$body = $('body');

		// Disable animations/transitions until the page has loaded.
			$body.addClass('is-loading');

			$window.on('load', function() {
				window.setTimeout(function() {
					$body.removeClass('is-loading');
				}, 100);
			});

		// Fix: Placeholder polyfill.
			$('form').placeholder();

		// Banner.
			var $banner = $('#banner');

			if ($banner.length > 0) {

				// IE fix.
					if (skel.vars.IEVersion < 12) {

						$window.on('resize', function() {

							var wh = $window.height() * 0.60,
								bh = $banner.height();

							$banner.css('height', 'auto');

							window.setTimeout(function() {

								if (bh < wh)
									$banner.css('height', wh + 'px');

							}, 0);

						});

						$window.on('load', function() {
							$window.triggerHandler('resize');
						});

					}

				// Video check.
					var video = $banner.data('video');

					if (video)
						$window.on('load.banner', function() {

							// Disable banner load event (so it doesn't fire again).
								$window.off('load.banner');

							// Append video if supported.
								if (!skel.vars.mobile
								&&	!skel.breakpoint('large').active
								&&	skel.vars.IEVersion > 9)
									$banner.append('<video autoplay loop><source src="' + video + '.mp4" type="video/mp4" /><source src="' + video + '.webm" type="video/webm" /></video>');

						});

				// More button.
					$banner.find('.more')
						.addClass('scrolly');

			}

		// Scrolly.
			$('.scrolly').scrolly();

		// Poptrox.
			$window.on('load', function() {

				var $thumbs = $('.thumbnails');

				if ($thumbs.length > 0)
					$thumbs.poptrox({
						onPopupClose	: function() { $body.removeClass('is-covered'); },
						onPopupOpen		: function() { $body.addClass('is-covered'); },
						baseZIndex		: 10001,
						useBodyOverflow	: false,
						overlayColor	: '#222226',
						overlayOpacity	: 0.75,
						popupLoaderText	: '',
						fadeSpeed		: 500,
						usePopupDefaultStyling: false,
						windowMargin	: (skel.breakpoint('small').active ? 5 : 50)
					});

			});

		// Initial scroll.
			$window.on('load', function() {
				$window.trigger('scroll');
			});

	});

})(jQuery);

var fit = function(){
	"use strict"
	
	return {
		init : function(){
			
			getEvents();
			
			getSetting();
			
		}
	}
	
	function getEvents(){
		
	}
	
	function getSetting(){
		
		$.ajax({
			url		: '/manage/fit/getFit',
			async	: false,
			success	: function(data){
				var content = data.content[0];
				var list = data.list;
				
				$('#fitHeaderTitle').text(content.HEADER_TITLE);
				$('#fitHeaderTitleD').text(content.HEADER_TITLE_D);
				$('#fitHeaderTitleD2').text(content.HEADER_TITLE_D2);
				$('#fitFooterTitle').text(content.FOOTER_TITLE);
				$('#fitFooterTitleD').text(content.FOOTER_TITLE_D);
				
				
				//thumbnail = t;
//				var tCount = getData[0].TCOUNT;
				var tStr = '';
					
				for(var t = 0; t < list.length; t++){
					var r = (t+1) % 3;
					var s = '';
					if(r == 1){
						s = '';
					}else if(r == 2){
						s = 'style2';
					}else{
						s = 'style3';
					}
					
					var l = list[t];
					tStr	+= '<div class="box">'
						+ '<a href="https://youtu.be/s6zR2T9vn2c" class="image fit"><img src="'+l.URL+'" alt="" /></a>'
						+ '<div class="inner">'
						+ '<h3>'+l.CONTENT+'</h3>'
						+ '<p>'+l.CONTENT_D+'</p>'
						+ '<a href="#" class="button '+s+' fit" data-poptrox="youtube,800x400">Watch</a>'
						+ '</div>'
						+ '</div>';
				}
					
				$('#fitContent').append(tStr);
				
			}
		});
	}
	
	
}();

$(document).ready(function(){
	fit.init();
});