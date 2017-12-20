   jQuery(function() {

   jQuery('#remaining').each(function() {

      var count = jQuery("#count", this);
      var max = jQuery("#max", this);

      var maximumCount = count.text() * 1;
      var maximumNumber = max.text() * 1;

      var input = jQuery(this).prev();

      var update = function() {

         var before = count.text() * 1;
         var now = maximumCount + input.val().length;

         if (now > maximumNumber) {

            var str = input.val();
            alert('글자 입력수가 초과하였습니다.');
            input.val(str.substring(maximumNumber, 0));
            now = 2000;
            
         }

         if (before != now) {

            count.text(now);
         }
      };

      input.bind('input keyup paste', function() {

         setTimeout(update, 0)
      });

      update();
      });
   });






 function len_chk(){  
     var frm = document.frm.bowname; 
     if(frm.value.length > 5){ 
        alert("글자수는 5자로 제한됩니다.!"); 
        frm.value = frm.value.substring(0,5);
        frm.focus(); 
        }
     
  } 





  function len_chk2(){  
    var frm = document.frm.bowtitle; 
    if(frm.value.length > 35){  
       
       alert("글자수는 35자로 제한됩니다.!");  
       
       frm.value = frm.value.substring(0,35);  
       frm.focus();
       }
    }




function passcheck2()
   {
     var UserPassword = document.frm.bowpass;
     var UserPass = document.frm.bowpass.value;
     //
     var UserName = document.frm.bowname.value;
     var UserTitle = document.frm.bowtitle.value;
     var UserContent = document.frm.bowcontent.value;

     var pattern1 = /[0-9]/;
     var pattern2 = /[a-zA-Z]/;
     var pattern3 = /[~!@\#$%<>^&*]/;
     
     if(!pattern1.test(UserPass)||!pattern2.test(UserPass)||!pattern3.test(UserPass)||UserPassword.length<8||UserPassword.length>15){
        alert("영문,숫자,특수문자를 혼용하여 8~16자를 입력해주세요");
        UserPassword.value = UserPassword.value.substring(0,15);
        frm.focus();
        return false;
     }
     for(var i=0; i<100; i++){ // 값이 들어간 길이 만큼 제목과 본문의 공백을 제거
         UserName = UserName.replace(" ","");
         UserTitle = UserTitle.replace(" ","");
         UserContent = UserContent.replace(" ","");

      }if(UserName != "" && UserTitle != "" && UserContent !=""){ // 내용이 작성되어 있는 경우 submit() 한다. 

      }else{ // 작성 된 내용이 하나도 없을 경우 안내 메세지 창 출력
        alert("제목,작성자,내용을 모두 입력해주셔야 합니다.");
        UserName.focus();
        return false;
      }

      var f = document.frm;
      f.method = "POST";
      f.bowname.value = f.bowname.value;
      f.bowpass.value = f.bowpass.value;
      f.bowcontent.value = f.bowcontent.value;

      f.action = "/bow/techinsert.do";
      f.submit();
      
   } 