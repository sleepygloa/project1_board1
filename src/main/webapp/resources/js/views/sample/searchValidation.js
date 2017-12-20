	//submit 시 유효성 검사 항목을 한번 확인하며, true 시 전송, false 시 그 항목을 나타냄
	function searchCheck(){
		// 공백검색에 대한 스크립트 처리
		var search = $('#list_search').val();
		for( var i=0; i < search.length; i++ ){ // 값이 들어간 길이 만큼 INPUT의 공백을 제거
			search = search.trim().replace(" ","");
		}
		
		var f = document.sForm;
		
		if(search == ""){ // 내용이 공백일 경우 에러를 보낸다.
			alert("검색창에 단어를 입력해주세요. (공백으로는 검색하실수 없습니다.)");
			f.searchText.value = search;
			$('#list_search').focus();
			return false;
		 }
		
		return fiveWorkCheck();
	}

	function fiveWorkCheck(){
		var search = $('#list_search').val().trim();
		search = search.replace('/^\s+/g', ' '); //단어사이의 모든 공백을 1개의 공백으로 치환
		var splitWord = search.split(" "); //공백을 기준으로 단어를 배열로 저장
		
		if( splitWord.length >= 5){
			alert("5개이상의 단어를 조합하여 검색하셨습니다. 첫번째단어부터 네번째단어와 연관된 글만 검색을 지원합니다.");
		}
/* 		for( var i = 0 ; i < splitWord.length; i++){
			alert(splitWord[i]);
		} */
		
		return true;
			
	}