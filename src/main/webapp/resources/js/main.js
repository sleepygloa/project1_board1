var mainJs = function(){
	"use strict";
	
	var $toggle = $('#toggle');
	var $down = $('#down');
	var $overlay = $('#overlay');
	var $top = $('#top');
	var $banner = $('#banner');
	var $newsletter = $('#newsletter');
	
  $toggle.click( function() {
	    $('html').addClass('open-menu');
	  });

	  $down.click( function() {
	    $('html').addClass('open-navigation');
	  });

	  $top.click( function() {
	    $('html, body').animate({
	      scrollTop: 0
	    }, 500);
	  });

	  $banner.click( function(e) {
	    e.preventDefault();
	    $('html, body').animate({
	      scrollTop: $newsletter.offset().top
	    }, 500);
	  });

	  $overlay.click( function() {
	    $('html').removeClass('open-menu').removeClass('open-navigation');
	  });

	  // TYPED.JS
	  $("#typed").typed({
	    strings: [
	      "HTML5.", "CSS3.", "Sass.", "Bootstrap.", "JavaScript.", "ES6.", "jQuery.", "Node.js.", "Express.", "Socket.io.", "MongoDB.", "TypeScript.", "Angular."
	    ],
	    typeSpeed: 120,
	    startDelay: 0,
	    backSpeed: 80,
	    backDelay: 800,
	    loop: true
	  });

	  // Scroll to next section
	  $('#scroll-icon').click( function() {
	    $('html, body').animate({
	      scrollTop: ($('.index-title').offset().top)
	    }, 1000);
	  });

	  //////////////////////////////////////////////////////////////////////
	  // <p class="result"></p> 대응
	  // 해당 요소 이전에 기술된 가장 인접한 형제 요소 중 highlighter에서 html을 취득하여 iframe에 삽입
	  //////////////////////////////////////////////////////////////////////

	  $('.result').each(function() {

	    var $this = $(this);

	    // 이미 result 내부에 내용이 있으면 skip
	    if($this.html()){
	      return true;
	    }

	    $this.append('<iframe></iframe>');

	    // var html = $this.prevAll('.highlighter-rouge:first').find('code').text();
	    // var iframe = $this.children(':first')[0];

	    // Codemirror 대응
	    var html = $this.prev('pre').find('code').text();
	    var iframe = $this.children(':first')[0];

	    iframe.contentWindow.document.open();
	    iframe.contentWindow.document.write(html);
	    iframe.contentWindow.document.close();

	    // container height = iframe height + 30
	    $this.height(iframe.contentWindow.document.body.scrollHeight + 30);
	  });


	  var createCookie = function(name, value, days) {
	    var expires = "";
	    if (days) {
	      var date = new Date();
	      date.setTime(date.getTime() + (days*24*60*60*1000));
	      expires = "; expires=" + date.toUTCString();
	    }
	    document.cookie = name + "=" + value + expires + "; path=/";
	  };

	  var readCookie = function(name) {
	    var nameEQ = name + "=";
	    var ca = document.cookie.split(';');
	    for(var i=0; i < ca.length; i++) {
	      var c = ca[i];
	      while (c.charAt(0)==' ') c = c.substring(1,c.length);
	      if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
	    }
	    return null;
	  };

	  // Div opacity based on scrollbar position
	  var fadeStart = 100;
	  var fadeUntil = 350;
	  var $fadingTarget = $('.hello');

	  $(window).on('scroll', function(){
	    var offset = $(document).scrollTop(),
	        opacity = 0;

	    if( offset <= fadeStart ){
	      opacity = 1;
	    }else if( offset <= fadeUntil ){
	      opacity = 1 - offset/fadeUntil;
	    }

	    $fadingTarget.css('opacity', opacity);

	    // Facebook like box
	    var $content = $('.content');
	    var $fbLikeBox = $('.fb-like-box');
	    var slideStart = $content.innerHeight() - 400;

	    if(offset > slideStart) {
	      // $fbLikeBox.fadeIn('slow');
	      if(!$fbLikeBox.hasClass('active')) {
	        var cancel = readCookie('c');
	        if(!cancel) {
	          $fbLikeBox.addClass('active');
	        }
	      }
	    } else {
	      // $fbLikeBox.fadeOut('slow');
	      $fbLikeBox.removeClass('active');
	    }
	  });

	  // Facebook like plugin 닫기 버튼
	  $('.close').on('click touch', function(event) {
	    event.preventDefault();
	    // Get Cookie
	    var cancel = readCookie('c');
	    console.log(cancel);

	    if(!cancel) {
	      // Set Cookie
	      createCookie('c', '1');
	    }
	    $('.fb-like-box').removeClass('active');
	  });

	  // detect mobile : stackblits 버그 대응
	  var filter = "win16|win32|win64|mac|macintel";
	  if ( navigator.platform ) {
	    // mobile로 접속한 경우, stackblits iframe 요소를 제거
	    if ( filter.indexOf( navigator.platform.toLowerCase() ) < 0 ) {
	      $('iframe[src^="https://stackblitz.com"]').remove();
	    }
	  }
	
	return {
		init : function(){
			
			loadingMainContent();
			
			loadingSession();
			
			mainEvents();
			
		}
	}
	
	  function loadingMainContent(){
		  var id = null;
		  $.ajax({
			  url		: "/login/loadingMainContent",
			  success	: function(result){
				  $('#body').html(result);
			  }
		  })
	  }
	  
	  function loadingSession(){
		  $.ajax({
			  url		:	"/main/loadingSession",
			  success	:	function(result){
				  var s_userId =  result.s_userId;
				  
				  //VIEW SETTING
				  if(s_userId != null){
					  $('#login').remove();
					  $('#logo').parent('.container').append('<a id="logout" class="login" href="#">logout</a>');
				  }
			  }
		  })
	  }
	
	  //CUSTOM
	  function mainEvents(){
		  $('#login').click(function(){
			  $.ajax({
				  url		: "/login/loadingLoginPg",
				  success	: function(result){
					  $('#body').html(result);
				  }
			  })
		  });
		  
		  $(document).on("click" , "#logout", function(){
			  $.ajax({
				  url		: "/login/logout",
				  success	: function(result){
					  alert(result.MSG);
					  window.location.href="/";
				  }
			  })
		  })
		  
		  $(document).on('click', '#blogAddBtn', function(){
			  $('#body').empty();
			  
			  var blogAddTitle = '';
			  
			  blogAddTitle += '<div class="container" style="background:gray; margin-top:100px;">'
				  			+'<div class="btn-group col-xs-1">'
					  			+'<button id="blogAddMenuSelect" type="button" class="btn btn-default input-lg dropdown-toggl col-xs-12" data-toggle="dropdown" aria-expanded="false">'
					  				+'메뉴선택 <span class="caret"></span>'
				  				+'</button>'
					  				+'<ul class="dropdown-menu" role="menu" id="blogAddDropdown"></ul>'
					  			+'</div>'
					  			+'<input type="text" class="input-lg col-xs-2" id="blogAddSetTitle" />'
					  			+'<input type="text" class="input-lg col-xs-4" id="blogAddSetSubject" />'
					  			+'<span class="col-xs-1"><i class="fa fa-sm fa-plus" id="blogAddSubmit" ></i></span>'
					  			+'<span class="col-xs-1"><i class="fa fa-sm fa-undo" id="blogAddCancel" ></i></span>'
			  				+'</div>';
			  
			  $('#body').append(blogAddTitle);
			  
			  blogAddDropdown();
			  
			  var blogAddContent = '';
			  
			  blogAddContent = '<div class="container"><textarea id="blogAddSetContent" class="col-xs-12 p-0" placeholder="내용을 입력해주세요"></textarea></div>';
			  
			  $('#body').append(blogAddContent);
			  
		  })
		  
		  function blogAddDropdown(){
			  $.ajax({
				  url : "/main/getBlogAddDropdownList",
				  success : function(result){
					  var options = '';
					  if(result.list){
						  var list = result.list;
						  for(var i in list){
							  options += '<li class="blogAddDropdownLi">'+list[i].TITLE+'</li>';
						  }  
					  }
					  options += '<li class="divider"></li>'
						  +'<li class="blogAddDropdownLi">새 컨텐츠</a></li>';
					  $('#blogAddDropdown').append(options);
				  }
			  })
		  }
		  
		  $(document).on('click', '.blogAddDropdownLi', function(){
			  var text = $(this).text();
			  $('#blogAddSetTitle').val(text);
		  })
		  
		  $(document).on('click', '#blogAddSubmit', function(){
			  var menu = $('#blogAddSetTitle').val();
			  var subject = $('#blogAddSetSubject').val();
			  var content = $('#blogAddSetContent').val();
			  
			  console.log(menu);
			  console.log(menu.length);
			  console.log(subject.length);
			  console.log(content);
			  if(menu.length < 1){
				  alert('메뉴를 선택해주세요');
				  return false;
			  }else if(subject.length < 1){
				  alert('제목을 입력해주세요');
				  return false;
			  }else if(content.length < 1){
				  alert('내용을 입력해주세요');
				  return false;
			  }
			  
			  var sendData = {
					  title		: menu,
					  subject	: subject,
					  content	: content
			  }
			  
		      var jsonStr = JSON.stringify(sendData);
			  
			  $.ajax({
				  url		: "/main/insertBlogAddContent",
				  data  	: jsonStr,
				  type		: "POST",
				  contentType: 'application/json; charset=utf-8',
				  success	: function(result){
					  alert('글이 게시되었습니다.');
					  window.location.href='/';
				  },
				  error : function(result){
					  alert('에러');
				  }
			  })
			  
		  })
		  
		  $(document).on('click', '#blogAddCancel', function(){
			  window.location.href='/';
		  })
		  
		  
	  }
	
}();

$(document).ready(function(){
	mainJs.init();
})