<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
		<div id="main" class="page-body">
			<section class="page-index">
				<div class="introBox" style="opacity: 1;">
					<h1>Become a Full-Stack Web Developer</h1>
					<div class="type-wrap">
					  Learn to code
					  <span id="typed" style="white-space:pre;">Express.</span><span class="typed-cursor">|</span>
					</div>
				</div>
			</section>

			<div class="page-content-title">Learning Paths</div>
			
			
			<section class="cont-head">
				<div class="container">
					<p id="menu_count" class="cont-head-menu">
						<strong id="blogContents_totalSectionCounts"></strong> sections
					</p>
					<p id="content_count" class="cont-head-title">
						<strong id="blogContents_totalCounts"></strong> lessons
					</p>
					<div  class="pull-right m-t-10" data-toggle="modal" data-target="#blogAddModal"><i class="fa fa-lg fa-plus"></i></div>
				</div>
			</section>
	    </div>
	    
	    <div class="modal modal-center fade" id="blogAddModal" tabindex="-1" role="dialog" aria-labelledby="myCenterModalLabel">
			<div class="modal-dialog modal-center" role="document">
				<div class="modal-content">
				
					<!-- Modal content-->
					<div class="modal-content">
						<div class="modal-header">
							<button type="button" class="close" data-dismiss="modal">×</button>
							<h4 class="modal-title">제목등록</h4>
						</div>
						<div class="modal-body">
							<div class="col-xs-12 row m-b-10">
					  			<div class="col-xs-6">
						  			<button id="blogAddMenuSelect" type="button" class="btn btn-default input-lg dropdown-toggl col-xs-12" data-toggle="dropdown" aria-expanded="false">
						  				메뉴선택 <span class="caret"></span>
					  				</button>
					  				<ul class="dropdown-menu col-xs-12" role="menu" id="blogAddDropdown"></ul>
			  					</div>
				  				<div class="col-xs-6">
				  					<input type="text" class="input-lg col-xs-12" id="blogAddSetTitle" />
			  					</div>
							</div>
			  				<div class="col-xs-12 m-b-10">
			  					<label>SUBJECT</label>
			  					<input type="text" class="input-lg col-xs-12" id="blogAddSetSubject" />
			  				</div>
						</div>
						<div class="modal-footer">
							<button type="button" class="btn btn-default btn-success" id="blogAddSubmit">SAVE</button>
							<button type="button" class="btn btn-default" data-dismiss="modal">CLOSE</button>
						</div>
					</div>
				</div>
			</div>
		</div> 
	    
		<footer>
		  <div class="container">
		    <p class="social-icons">
		      <a href="https://github.com/sleepygloa" target="_blank">
		        <i class="fa fa-github"></i>
		      </a>
		 	</p>
		
		    <p class="copyright">© 2018&nbsp;&nbsp;KIM SEONHO</p>
			  <p class="theme-by">Hosted on
			    <a href="https://github.com/sleepygloa">GitHub Pages&nbsp;
		        	<i class="fa fa-github"></i>
		      	</a>
			  </p>
		  </div>
		</footer>

		<script src="/resources/js/main_content.js"></script>