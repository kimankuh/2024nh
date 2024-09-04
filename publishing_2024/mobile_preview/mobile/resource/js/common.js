// 공통 Util
String.prototype.startsWith = function(search, pos) {
    return this.substr(!pos || pos < 0 ? 0 : +pos, search.length) === search;
};

var comm = {

    //채널구분 (PW:PC, MW:모바일웹, MA:앱)
    channel : "PW",
    //안드로이드 여부
    isAos : false,
    //시스템별 홈페이지 주소
    homePageUrl : "\\",
    info : {},
    licenseNo : [11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,28],
    licenseNoOld :  { 서울 : "11", 부산 : "12", 경기 : "13", 강원 : "14", 충북 : "15", 충남 : "16"
                    , 전북 : "17", 전남 : "18", 경북 : "19", 경남 : "20", 제주 : "21", 대구 : "22"
                    , 인천 : "23", 광주 : "24", 대전 : "25", 울산 : "26"},
    /* titile : "aaaa"
    */
    //화면 공통 사항 적용
    initLayout:function(option){
        //

        //모바일웹 초기설정
        if(comm.channel == "MW"){
            //$("#headerAreaTitle").text($("div.page_title_part h2.ebtitle2").text());
        //모바일 앱 초기설정
        } else if(comm.channel =="MA"){
            //$("#headerAreaTitle").text($("div.page_title_part h2.ebtitle2").text());
        }
    },



    //JSON형태의 Data전송 url. data(Json), 성공시 콜백, 실패시 콜백
    //option.dimType=
    //stock :스탁론 한도조회
    //none: 딤처리 하지 않음
    /************************************************************************
    @함수명        : callAjaxJson
    @설 명        : JSON형태의 Data전송
    @사용법        : comm.callAjaxJson(url, sendData, callbackSuccFunc,option) 호출, option 미사용시 제외가능
    @param  url          (type : String)    : url
    @param  sendData     (type : object)    : 전달 파라미터
    @param  callbackFunc (type : function)  : 콜백받을 함수
    @param  option       (type : String)    : 추가 옵션 (stock :스탁론 한도조회, none: 딤처리 하지 않음)
    @returns    : 콜백 함수로 전달
    @작성일        : 2022-02-16
    @작성자        : 권희준

    수정일             수정자         수정내용
    -----------     ------      --------------

    ************************************************************************/
    callAjaxJson:function(url, sendData, callbackFunc,option){

        //JSON.stringify($("#testForm").serializeObject())
        var param = comm.nvl(sendData) ==""? "" : sendData ;
        param = ((typeof param ) =="object")?JSON.stringify(param):param;

        $.ajax({
            type:'POST',
            contentType: 'application/json',
            url:url,
            data : param,
            dataType : "json",
            beforeSend:function(xhr){
                comm.ajaxBeforeSend(xhr,option);

            },
            success:function(data){

                var responseJSON = data.responseJSON;

                if(comm.isNull(responseJSON) != true){
                    var errorCode = responseJSON.errorCode;
                    CommMsg.alert("에러:["+data.responseJSON.errorCode+"]");

                }else{
                    callbackFunc(data);
                }

            },
            complete:function(){
                //comm.hideLoading();
                comm.ajaxcomplete(option);
            },
            error:function (data, textStatus) {
                
                comm.ajaxcomplete(option);
                comm.hideLoading();
                
                var errMsg = "서버 통신 상태가 원할하지 않습니다.\n잠시 후 다시 접속해주세요";
                if(!comm.isNull(data.responseJSON)){
                    if(comm.isEmptyObject(comm.info)){
                        
                        if("P" == comm.info.gubun){
                            CommMsg.alert(errMsg);
                        }else{
                            CommMsg.alert(errMsg + ":["+data.responseJSON.exceptionMsg+"]"); 
                        }
                        
                    }else{
                    	if (data.status === 500) {
                    		CommMsg.alert(errMsg + (!comm.isEmpty(data.responseJSON.exceptionMsg) ? " :[" + data.responseJSON.exceptionMsg + "]" : ""));
                    	} else {
                    		CommMsg.alert(errMsg + "("+data.status+":"+data.statusText+")");
                    	}
                    }
                    
                }else{
                	if (data.status === 500) {
                		CommMsg.alert(errMsg);
                	} else {
                		CommMsg.alert(errMsg + "("+data.status+":"+data.statusText+")");
                	}
                }


            }
        });
    },
    /************************************************************************
    @함수명        : callAjaxSec
    @설 명        : 키보드 보안용으로 사용합니다.
    @사용법        : callAjaxSec(url, sendData, callbackSuccFunc,option) 호출, option 미사용시 제외가능
    @param  url          (type : String)    : url
    @param  sendData     (type : object)    : 전달 파라미터
    @param  callbackFunc (type : function)  : 콜백받을 함수
    @param  option       (type : String)    : 추가 옵션 (stock :스탁론 한도조회, none: 딤처리 하지 않음)
    @returns    : 콜백 함수로 전달
    @작성일        : 2022-02-16
    @작성자        : 권희준

    수정일             수정자         수정내용
    -----------     ------      --------------

    ************************************************************************/
    callAjaxSec:function(url, sendData,callbackFunc,option){

        sendData = comm.nvl(sendData);


        $.ajax({
            type:'POST',
            //dataType : "json",
            contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
            url:url,
            data:sendData,
            beforeSend:function(xhr){
                comm.ajaxBeforeSend(xhr,option);
            },
            success:function(data){

                var responseJSON = data.responseJSON;

                if(comm.isNull(responseJSON) != true){
                    var errorCode = responseJSON.errorCode;
                    CommMsg.alert("에러:["+data.responseJSON.errorCode+"]");

                }else{
                    callbackFunc(data);
                }

            },
            complete:function(){
                //comm.hideLoading();
                comm.ajaxcomplete(option);
            },
            error:function (data, textStatus) {
                
                if(!comm.isNull(data.getResponseHeader("ERROR"))){                  
                    var errMsg = comm.replaceAll(decodeURIComponent(data.getResponseHeader("ERROR")),"+"," ");                  
                    CommMsg.alert(errMsg+"</br>관리자에게 문의 하세요 ");
                }else{
                    if(!comm.isNull(data.responseJSON)){
                        CommMsg.alert("서버 통신 상태가 원할하지 않습니다.\n잠시 후 다시 접속해주세요:["+data.responseJSON.errorCode+"]");
                    }else{
                        CommMsg.alert("서버 통신 상태가 원할하지 않습니다.\n잠시 후 다시 접속해주세요.("+data.status+":"+data.statusText+")");
                    }   
                }
                
                
            }
        });
    },

    callAjax:function(url, sendData,callbackFunc,option){
        //CommMsg.alert("해당 function은 삭제 예정입니다. comm.callAjaxJson을 사용하시기 바랍니다. ");
        sendData = comm.nvl(sendData);

        $.ajax({
            type:'POST',
            //dataType : "json",
            contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
            url:url,
            data:sendData,
            beforeSend:function(xhr){
                comm.ajaxBeforeSend(xhr,option);
            },
            success:function(data){

                var responseJSON = data.responseJSON;

                if(comm.isNull(responseJSON) != true){
                    var errorCode = responseJSON.errorCode;
                    CommMsg.alert("에러:["+data.responseJSON.errorCode+"]");

                }else{
                    callbackFunc(data);
                }

            },
            complete:function(){
                //comm.hideLoading();
                comm.ajaxcomplete(option);
            },
            error:function (data, textStatus) {
                if(!comm.isNull(data.responseJSON)){
                    CommMsg.alert("서버 통신 상태가 원할하지 않습니다.\n잠시 후 다시 접속해주세요:["+data.responseJSON.errorCode+"]");
                }else{
                    CommMsg.alert("서버 통신 상태가 원할하지 않습니다.\n잠시 후 다시 접속해주세요.("+data.status+":"+data.statusText+")");
                }
            }
        });
    },

    /*
     * 화면을 dim 처리 합니다.
     */
    ajaxBeforeSend : function (xhr,option){
        if(!comm.isNull(option)){

            if(option.dimType=="stock"){
                if(comm.channel == "PW"){
                    comm.stockShowLoadingPw(option.userName);
                }else{
                    comm.stockShowLoadingMW(option.userName);
                }
            }else if (option.dimType=="none"){

            }else{
                //기본
                comm.showLoading();
            }

        }else{
            //기본
            comm.showLoading();
        }

        xhr.setRequestHeader("TRANS_TYPE","AJAX");
    },
    /*
     *dim 처리 화면을 삭제 합니다
     */
    ajaxcomplete : function (option){
        if(!comm.isNull(option)){

            if(option.dimType=="stock"){
                //ui_layerpopupHide('#stockSearchDimLayer');
                comm.stockHideLoading();
            }else if (option.dimType=="none"){
                
            }else{
                //기본
                comm.hideLoading();
            }

        }else{
            //기본
            comm.hideLoading();
        }


    },

    /************************************************************************
    @함수명        : headerControll
    @설 명        : 메뉴 호출
    @사용법        : comm.headerControll() 호출
    @작성일        : 2022-02-16
    @작성자        : 권희준

    수정일             수정자         수정내용
    -----------     ------      --------------

     ************************************************************************/
    headerControll:function(type){
        //헤더 제거
    	
        if(type == "R"){
            $("#headerLay").remove();
        //헤더 숨김
        } else if(type == "H"){
            $("#headerLay").empty();
        //뒤로가기만 노출
        } else if(type == "L"){
            $("div.header_area div.header_menu").hide();
            $("#headerLay").show();

        //뒤로가기 숨김
        } else if(type == "B"){
            $("#btnHeaderBack").hide();
            $("#headerLay").show();

        // 메인 페이지
        } else if(type == "M"){
            $("div.header_area div.headerPage").hide();
            $("div.header_area div.headerMain").show();
            $("#headerLay").show();
            
        //올원뱅크
        } else if(type == "O") {
        	$("div.header_area div.header_menu").hide();
        	$("div.header_area div.header_home").show();
            $("#headerLay").show();
        } else {
            $("div.header_area div.header_menu").show();
            $("#headerLay").show();
        }
    },

    /************************************************************************
    @함수명        : callMenu
    @설 명        : 메뉴 호출
    @사용법        : comm.callMenu() 호출
    @작성일        : 2022-02-16
    @작성자        : 권희준

    수정일             수정자         수정내용
    -----------     ------      --------------

    ************************************************************************/
    callMenu:function(){
        CommPop.showMenuForm();
    },

    /************************************************************************
    @함수명        : showLoading
    @설 명        : 로딩화면 호출
    @사용법        : comm.showLoading() 호출
    @작성일        : 2022-02-16
    @작성자        : 권희준

    수정일             수정자         수정내용
    -----------     ------      --------------

    ************************************************************************/
    showLoading: function() {
    	
    	var loadingType = $("#loadingType").val();

    	if(loadingType == "allone"){
    		var msglayer = '<div class="loading_layer allonebank show"><div class="loading"><img src="../../../resource/mobile/image/layout/character_person001.gif" alt="로딩중"></div></div>';
    	}else{
			//기존
		    var msglayer = '<div class="loading_layer show"><div class="loading"><img src="../../../resource/pc/image/layout/loading.gif" alt="로딩중"></div></div>';
		
		    if(comm.channel != "PW"){
		        msglayer = '<div class="loading_layer show"><div class="loading"><img src="../../../resource/mobile/image/layout/loading.gif" alt="로딩중"></div></div>';
		    }
    	}
        
        //화면에 레이어 추가
        $("#layoutBody").append(msglayer);
    },

    /************************************************************************
    @함수명        : stockShowLoading
    @설 명        : 스탁론 한도조회 로딩화면 호출
    @사용법        : comm.stockShowLoadingPw() 호출
    @작성일        : 2022-02-16
    @작성자        : 강종철

    수정일             수정자         수정내용
    -----------     ------      --------------

    ************************************************************************/
    /*
     * 스탁론 한도조회 dim pc 용
     */
    stockShowLoadingPw: function(userName) {

        if(comm.nvl(userName)==""){
            userName = "";
        }
        var msglayer ='';

        ////////////////////////////
        msglayer +='<div id="stockSearchDimLayer" class="layer_popup"><!-- 노출 className = show -->';
        msglayer +='    <div class="popup_layout">';
        msglayer +='';
        msglayer +='        <div class="result_loading_part">';
        msglayer +='            <div class="title_box">';
        msglayer +='                <h2 class="subtitle">한도조회</h2>';
        msglayer +='            </div>';
        msglayer +='            <div class="desc_box">';
        msglayer +='                <p><span class="name">'+userName+'</span>님 입력한 정보로 고객님의 한도를 조회중입니다.</p>';
        msglayer +='                <p>잠시만 기다려주세요.</p>';
        msglayer +='            </div>';

        msglayer +='            <div class="loading_img_box">';
        msglayer +='                <div class="imgani_box">';
        msglayer +='                    <div class="ani ani_1">';
        msglayer +='                        <span class="img_box">';
        msglayer +='                            <img src="/resource/pc/image/contents/common/img_ani1.png" alt="">';
        msglayer +='                        </span>';
        msglayer +='                    </div>';
        msglayer +='                    <div class="ani ani_2">';
        msglayer +='                        <span class="img_box">';
        msglayer +='                            <img src="/resource/pc/image/contents/common/img_ani2.png" alt="내 예상한도 ???? 만원">';
        msglayer +='                        </span>';
        msglayer +='                    </div>';
        msglayer +='                    <div class="ani ani_3">';
        msglayer +='                        <span class="img_box">';
        msglayer +='                            <img src="/resource/pc/image/contents/common/img_ani3.png" alt="">';
        msglayer +='                        </span>';
        msglayer +='                    </div>';
        msglayer +='                </div>';
        msglayer +='            </div>';
        msglayer +='        </div>';
        msglayer +='';
        msglayer +='    </div>';
        msglayer +='</div>';

        ///////////////////////

        //화면에 레이어 추가
        $("#layoutBody").append(msglayer);
        ui_layerpopupShow('#stockSearchDimLayer');

    },

    /************************************************************************
    @함수명        : stockShowLoading
    @설 명        : 스탁론 한도조회 모바일용 호출
    @사용법        : comm.stockShowLoadingMW() 호출
    @작성일        : 2022-02-16
    @작성자        : 강종철

    수정일             수정자         수정내용
    -----------     ------      --------------

    ************************************************************************/

    /*
     * 스탁론 한도조회 dim 모바일용
     */
    stockShowLoadingMW: function(userName) {
        if(comm.nvl(userName)==""){
            userName = "";
        }

        var msglayer="";
        //해당 페이지 내용
        msglayer +='<div id="stockSearchDimLayer" class="layer_popup"><!-- 노출 className = show -->';
        msglayer +='    <div class="popup_layout">';
        msglayer +='';
        msglayer +='        <div class="result_loading_part">';
        msglayer +='            <div class="process_end_part">';
        msglayer +='                <div class="title_box">';
        // 2024.11.10 24Hour/365Day 구축 프로젝트. 이상봉. 문구 변경 start
        // msglayer +='                    <h2 class="ebtitle2">한도조회</h2>';
        msglayer +='                    <h2 class="ebtitle2">한도조회 진행 중이에요.</h2>';
        // 2024.11.10 24Hour/365Day 구축 프로젝트. 이상봉. 문구 변경 end
        msglayer +='                </div>';
        msglayer +='                <div class="desc_box">';
        // 2024.11.10 24Hour/365Day 구축 프로젝트. 이상봉. 문구 변경 start
        // msglayer +='                    <p><span class="name">'+userName+'</span>님 입력한 정보로<br>고객님의 한도를 조회중입니다.</p>';
        msglayer +='                    <p><span class="name">'+userName+'</span>님<br>고객님의 한도를 조회하고 있어요.</p>';
        // 2024.11.10 24Hour/365Day 구축 프로젝트. 이상봉. 문구 변경 end
        msglayer +='                    <p>잠시만 기다려주세요.</p>';
        msglayer +='                </div>';
        
        msglayer +='                <div class="loading_img_box">';
        msglayer +='                <!-- 로딩 이미지 영역 -->';
        msglayer +='                    <div class="imgani_box active">';
        msglayer +='                        <div class="ani ani_1">';
        msglayer +='                            <span class="img_box">';
        msglayer +='                                <img src="/resource/mobile/image/contents/common/img_ani1.png" alt="내 예상한도 ???? 만원">';
        msglayer +='                            </span>';
        msglayer +='                        </div>';
        msglayer +='                        <div class="ani ani_2">';
        msglayer +='                            <span class="img_box">';
        msglayer +='                                <img src="/resource/mobile/image/contents/common/img_ani2.png" alt="">';
        msglayer +='                            </span>';
        msglayer +='                        </div>';
        msglayer +='                        <div class="ani ani_3">';
        msglayer +='                            <span class="img_box">';
        msglayer +='                                <img src="/resource/mobile/image/contents/common/img_ani3.png" alt="">';
        msglayer +='                            </span>';
        msglayer +='                        </div>';
        msglayer +='                    </div>';
        msglayer +='                <!-- //로딩 이미지 영역 -->';
        msglayer +='                </div>';        
        
        msglayer +='            </div>';
        msglayer +='        </div>';
        msglayer +='';
        msglayer +='    </div>';
        msglayer +='</div>';
        //해당 페이지 내용

        //화면에 레이어 추가
        $("#layoutBody").append(msglayer);
        ui_layerpopupShow('#stockSearchDimLayer');
    },

    /************************************************************************
    @함수명        : hideLoading
    @설 명        : 로딩화면 제거
    @사용법        : comm.hideLoading() 호출
    @작성일        : 2022-02-16
    @작성자        : 권희준

    수정일             수정자         수정내용
    -----------     ------      --------------

    ************************************************************************/
    hideLoading : function() {
        //퍼블 로딩 HIDE 함수
        $($('.loading_layer')[0]).remove();
    },
    
    stockHideLoading : function() {
        //퍼블 로딩 HIDE 함수
        ui_layerpopupHide('#stockSearchDimLayer');
    },
    
    

    /************************************************************************
    @함수명        : emailSetting
    @설 명        : 이메일 입력 폼 적용 (모바일)
    @사용법        : comm.emailSetting() 호출
    @작성일        : 2022-02-16
    @작성자        : 권희준

    수정일             수정자         수정내용
    -----------     ------      --------------
	2024-03-20		오은진		email li 요소 role 추가
     ************************************************************************/
    emailSetting : function(emailId) {

        var domList = [ "@naver.com"
                      , "@hanmail.net"
                      , "@gmail.com"
                      , "@nate.com"
                      , "@kakao.com"
                      , "@outlook.com"
                      , "@hotmail.com"
                      , "@yahoo.com"
                      , "@empas.com"
                      , "@korea.com"
                      , "@paran.com"];

        var emailArea = $("#"+emailId);
        var layerCnt = emailArea.find("div.email_layer").length;
        //email_layer 없을 경우 처리
        if(layerCnt == 0){
            var addDiv = '<div class="email_layer"><ul></ul></div>'
            emailArea.append(addDiv);
        }

        //키입력시 이벤트 처리
        $("#"+emailId +" input").off("keyup").on("keyup",function(){

            var showEmail = $("#"+emailId +" div.email_layer ul");
            showEmail.empty();

            var inpTag = $(this);
            var inpTxt = $(this).val().split("@");
            var emailLayer = $(this).closest("div").find("div.email_layer");

            if(inpTxt.length > 1){
                emailLayer.addClass("show");

                var emailList = "";
                domList.forEach(function(val){
                    if(inpTxt[1] == ""){
                        emailList += "<li data-email-list='" + inpTxt[0] + val + "' role='button'>" + inpTxt[0] + val + "</li>";
                    } else{

                        var valTxt = val.substr(1,inpTxt[1].length);

                        if(valTxt == inpTxt[1]){
                            emailList += "<li data-email-list='" + inpTxt[0] + val + "' role='button'>" + inpTxt[0] + val + "</li>";
                        }
                    }
                });

                showEmail.append(emailList);

                //포커스 아웃 처리
                $("#"+emailId +" input").off("blur").on("blur",function(event){
                    emailLayer.removeClass("show");
                    event.preventDefault();
                });

                $("#"+emailId +" div.email_layer ul li").off("mousedown").on("mousedown", function(){
                    inpTag.val($(this).data("email-list"));
                    emailLayer.removeClass("show");
                });

            } else {
                emailLayer.removeClass("show");
            }
        });
    },

    /************************************************************************
    @함수명        : chkEmailFormat
    @설 명        : 이메일 포멧 체크
    @사용법        : comm.chkEmailFormat(val) 호출
    @작성일        : 2022-02-16
    @작성자        : 권희준

    수정일             수정자         수정내용
    -----------     ------      --------------

     ************************************************************************/
    chkEmailFormat : function(val){
        var chkVal = false;
        var regExp = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;
        if (regExp.test(val)){
            chkVal = true;
        } else {
            chkVal = false;
        }

        return chkVal;
    },

    //금액에 콤마단위표시
    moneyFormat:function(num){

        if( comm.isNull(num) ) return 0;

        var strNum = String(num) ;
        if(strNum == "NaN") return 0;

        strNum = strNum.replace(/,/g,"");

        const parts = strNum.toString().split('.');

        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        return parts.join('.');

    },

    /************************************************************************
    @함수명        : dateFormat
    @설 명        : 날짜 형식 설정
    @사용법        : comm.dateFormat(str,addTxt) 호출
    @param str    : 날짜
    @param addTxt : 추가 text

    수정일             수정자         수정내용
    -----------     ------      --------------

    ************************************************************************/
    dateFormat:function(str,addTxt){
        var length = str.length;
        var date = "";
        if(addTxt){
            if(length == 8){
                date += str.substring(0,4);
                date += addTxt;
                date += str.substring(4,6);
                date += addTxt;
                date += str.substring(6,8);
            }else if (length == 6){
                date += str.substring(0,2);
                date += addTxt;
                date += str.substring(2,4);
                date += addTxt;
                date += str.substring(4,6);
            }
        }
        return date;
    },

    /************************************************************************
    @함수명        : isNull
    @설 명        : null & undefined 체크
    @사용법        : comm.isNull(param) 호출
    @param      : val
    @returns    : true,false
    @작성일        : 2022-02-16
    @작성자        : 권희준

    수정일             수정자         수정내용
    -----------     ------      --------------

    ************************************************************************/
    isNull : function(val){
        var chkNull = ((typeof(val) == "undefined") || ( val == null )) ? true : false;
        return chkNull;
    },

    /************************************************************************
    @함수명        : isEmpty
    @설 명        : null & undefined & 공백 체크
    @사용법        : comm.isEmpty(param) 호출
    @param      : val
    @returns    : true, false
    @작성일        : 2022-02-16
    @작성자        : 권희준

    수정일             수정자         수정내용
    -----------     ------      --------------

     ************************************************************************/
    isEmpty : function(val){
        var chkNull = ((typeof(val) == "undefined") || ( val == null )) || comm.nvl(String(val)).trim() == "" ? true : false;
        return chkNull;
    },

    /************************************************************************
    @함수명        : nvl
    @설 명        : null & undefined 이면 공백 리턴
    @사용법        : comm.nvl(param) 호출
    @param      : val
    @returns    : null : "", notNull : val
    @작성일        : 2022-02-16
    @작성자        : 권희준

    수정일             수정자         수정내용
    -----------     ------      --------------

     ************************************************************************/
    nvl : function(val){
        var chkNull = ((typeof(val) == "undefined") || ( val == null )) ? "" : val;
        return chkNull;
    },

    /************************************************************************
    @함수명        : nvlRep
    @설 명        : null & undefined 이면 repVal 리턴
    @사용법        : comm.nvl(val, repVal) 호출
    @param      : val, repVal
    @returns    : null : repVal, notNull : val
    @작성일        : 2022-02-16
    @작성자        : 권희준

    수정일             수정자         수정내용
    -----------     ------      --------------

     ************************************************************************/
    nvlRep : function(val, repVal){
        var rtnVal = comm.isNull(repVal) ? "" : repVal;
        var chkNull = ((typeof(val) == "undefined") || ( val == null ) || val.length < 1) ? rtnVal : val;

        return chkNull;
    },

    /************************************************************************
    @함수명        : goPage
    @설 명        : 페이지 이동
    @사용법        : comm.goPage(url,param) 호출
    @param  url   : 이동할 url
    @param  param : 전달 파라미터
    @returns    : true,false
    @작성일        : 2022-02-16
    @작성자        : 강종철

    수정일             수정자         수정내용
    -----------     ------      --------------

    ************************************************************************/
    goPage : function(url,param){
        if (url == "/partner/logn/loginForm.nh"){
        	if (document.location.host == "m.nhcapital.co.kr"){
        		url = "https://mp.nhcapital.co.kr/partner/logn/loginForm.nh";
        	} else if (document.location.host == "tm.nhcapital.co.kr"){
        		url = "https://tmp.nhcapital.co.kr/partner/logn/loginForm.nh";
        	} 
        } else if (url == "/login/appInit.nh"){
        	if (document.location.host == "mp.nhcapital.co.kr"){
        		url = "https://m.nhcapital.co.kr/login/appInit.nh";
        	} else if (document.location.host == "tmp.nhcapital.co.kr"){
        		url = "https://tm.nhcapital.co.kr/login/appInit.nh";
        	}        	
        }
        $("#goPageFrom").remove();

        var $form="<form id='goPageFrom' name='goPageFrom'   >   </form>";
        $("#layoutContent").append($form);

        if(comm.nvl(param)!=""){
            if((typeof param)== "object"){
                $.each(param,function(key,value){
                    $("#goPageFrom").append("<input type='hidden' name='"+key+"' id='"+key+"' value='"+value+"'/>");
                });
            }else{
                CommMsg.alert("param type["+(typeof param)+"]");
            }

        }

        /**
         * 모바일웹 && 안드로이드 && (로그인url || 휴대폰인증[주민번호13자리 전체 입력화면] || 휴대폰인증[주민번호13자리 전체 입력화면])을 호출하는 sendRedirect url을 포함한 경우 droidX 호출을 위해 
         * document.location.replace로 페이지 이동을 수행한다.
         */
        if (comm.channel == "MW" && comm.isAos && (url == '/login/pLoginForm.nh' || url == '/comm/auth/authForm.nh' || url.indexOf('sendRedirect.nh') > -1) ){
        	
        	var paramStr = "";
        	//get방식으로 페이지 전환시 기존 파라미터 사라지지 않도록 폼데이터가 아닌 url query문자열 조립
            if(comm.nvl(param)!=""){
                if((typeof param)== "object"){
                	paramStr = "?";
                    $.each(param,function(key,value){
                    	paramStr = paramStr + key + "=" + value + "&";
                    });
                    if (paramStr.length > 0) paramStr = paramStr.substring(0, paramStr.length -1);
                }
            }
        	document.location.replace(url + paramStr);
        } else {
        	$("#goPageFrom").attr("method", "post");
        	$("#goPageFrom").attr("action", url);
        	$("#goPageFrom").submit();        	
        }
        	
    },

    /************************************************************************
    @함수명        : backbuttonProc
    @설 명        : 모바일 뒤로가기 버틀 클릭시 화면 이동 처리
    @사용법        : comm.backFuncCall(actionUrl, param)
                  function 미추가  : location.go(-1) 뒤로가기 실행
                  function 추가   : 추가한 function 실행
    @param  comm.backbuttonProc (type : function) : 클릭시 실행해야할 함수
    @returns    : true,false
    @작성일        : 2022-02-16
    @작성자        : 권희준

    수정일             수정자         수정내용
    -----------     ------      --------------

     ************************************************************************/
    backbuttonProc : function(actionUrl, param){
        //comm.backbuttonProc("/comm/sduc/documentSubmitForm.nh");
        history.replaceState(param, null, location.origin + actionUrl);
    },

    /************************************************************************
    @함수명        : backFuncCall
    @설 명        : 모바일 뒤로가기 버틀 클릭시 화면 이동 처리
    @사용법        : comm.backFuncCall에 function을 추가하여 사용
                  function 미추가  : location.go(-1) 뒤로가기 실행
                  function 추가   : 추가한 function 실행
    @param  comm.setBackFunc (type : function) : 클릭시 실행해야할 함수
    @returns    : true,false
    @작성일        : 2022-02-16
    @작성자        : 권희준

    수정일             수정자         수정내용
    -----------     ------      --------------
	2024-01-18		김정수		history.go(-1) 실행 불가 이슈로 수정됨
     ************************************************************************/
    setBackFunc : null,
    backFuncCall : function(){
        if((typeof comm.setBackFunc) =="String"){

        } else if((typeof comm.setBackFunc) !="function"){
        	if( history.length == 1 ) {
        		location.href = document.referrer;
        	} else {
                history.go(-1);	
        	}
        } else {
            comm.setBackFunc();
        }
    },

    /************************************************************************
    @함수명        : reqPinSign
    @설 명        : 핀사인 요청 처리
    @사용법        : comm.changePin("callback") 호출
    @param  gubun     (type : String) : 구분 (reg : 등록, chg : 변경, del : 삭제, login : 로그인 , init : 회원가입, reset : 재등록)
    @param  type      (type : String) : 인증 타입 (PIN : 핀 번호, BIO : 생체인증, PATTERN : 패턴)
    @param  callback  (type : String) : callback 받을 함수명
    @작성일        : 2022-02-23
    @작성자        : 권희준

    수정일             수정자         수정내용
    -----------     ------      --------------

     ************************************************************************/
    reqPinSignCallback : {},
    reqPinSignService : "",
    reqPinSign : function (gubun, type, callback) {
        var pinAction = "";
        var pinService = "";
        //등록 및 재등록(인증센터)
        if(gubun == "reg"){
            pinAction = "REGISTER";
            pinService = "SIMPLE_" + pinAction + "_" + type + "_WITH_PIN";

        //변경
        } else if(gubun == "chg"){
            pinAction = "CHANGE";
            pinService = "SIMPLE_" + pinAction + "_" + type;

        //재등록
        } else if(gubun == "reset"){
            pinAction = "RESET";
            pinService = "SIMPLE_" + pinAction + "_" + type;
        //제거
        } else if(gubun == "del"){
            pinAction = "UNREGISTER";
            pinService = "SIMPLE_" + pinAction + "_" + type;

        //인증
        } else if(gubun == "login"){
            pinAction = "LOGIN";
            pinService = "SIMPLE_" + pinAction + "_" + type;

        //최초 회원가입 후 추가 인증 수단 등록
        } else if (gubun == "addReg"){
            pinAction = "REGISTER";
            pinService = "SIMPLE_" + pinAction + "_" + type;
        } else if (gubun == "sign"){
            pinAction = "LOGIN";
            pinService = "SIMPLE_" + pinAction + "_" + type;
        }

        //핀번호 등록
        if(pinService == "SIMPLE_REGISTER_PIN_WITH_PIN" || pinService == "SIMPLE_UNREGISTER_PIN"){

            comm.callNativeDeviceId(function(result1){

                if(result1.result.code == "0000"){

                    var sendUrl = "";
                    var sendData={};
                    sendData.uid = result1.params.device_id;

                    //핀삭제
                    if(pinService == "SIMPLE_UNREGISTER_PIN"){

                        comm.callAjaxJson("/comm/ctrf/delPinsign.nh", sendData, function(result2){
                            if(result2.delCheck){
                                comm.callNativeIfc("SIMPLE_REMOVE_ALL", sendData, function(result3){
                                    callback(result3);
                                });
                            }
                        });

                    //핀등록
                    } else {

                        comm.callAjaxJson("/comm/ctrf/requestBerry.nh", sendData, function(result2){

                            if(result2.resultCode == "0000"){
                                var returnParam = Object();
                                returnParam.ref_value     = result2.refValue;
                                returnParam.auth_code     = result2.authCode;

                                comm.callNativeIfc("SIMPLE_ISSUE_WITH_PIN", returnParam, function(result3){

                                    var resultCode = result3.result.code;
                                    if( resultCode == "0000"){

                                        callback(result3);

                                    } else if( resultCode == "4008" || resultCode == "4004" ) {

                                        comm.reRegPinNumber();

                                    } else {
                                        CommMsg.alert(result3.result.message);
                                    }
                                });
                            } else{
                                CommMsg.alert(result2.resultMsg);
                            }
                        });
                    }


                } else {
                    CommMsg.alert(result.result.message)
                }
            });

        //패턴, 생체 인증 등록(핀 인증 후 등록)
        } else if(pinService == "SIMPLE_REGISTER_PATTERN_WITH_PIN" || pinService == "SIMPLE_REGISTER_BIO_WITH_PIN") {
            comm.callNativeIfc(pinService, {}, function(result1){

                var resultCode = result1.result.code;

                if( resultCode == "0000" || resultCode == "4010" || resultCode == "4016" || resultCode == "4017" || resultCode == "9999"){

                    callback(result1);

                } else if(result1.result.code == "4004") {
                    
                    comm.reRegPinNumber();
                    
                } else {
                    CommMsg.alert(result1.result.message,function(){
                        history.go(-1);
                    });
                }
            });

        } else if(pinAction == "LOGIN") {

            comm.callNativeDeviceInfo(function(result1){

                //핀사인 등록 여부 체크
                var chkPinVal = comm.chkPinValidation(type, result1)

                if(chkPinVal.loginPinPass == "Y"){
                    var sendData={};
                    comm.callAjaxJson("/comm/ctrf/createNonce.nh", sendData, function(result2){

                        var returnParam = Object();
                        returnParam.sign_data = type + "_LOGIN";
                        returnParam.nonce = result2.nonce;
                        if(gubun == "login"){
                        	returnParam.type = "login";
                        } else {
                        	returnParam.type = "sign";
                        }

                        comm.callNativeIfc(pinService, returnParam, function(result3){
                            var resultCode = result3.result.code;

                            //핀 재설정
                            if( resultCode == "4004") {

                                comm.reRegPinNumber();

                            // pattern 재설정
                            } else if( resultCode == "4012") {

                                comm.reRegPinPattern();

                            // bio 재설정
/*                          } else if( resultCode == "4019") {

                                comm.reqPinSign("reg", "BIO", function(result4){
                                    callback(result4);
                                });
*/
                            } else {

                                callback(result3);

                            }
                        });
                    });

                } else {
                    CommMsg.alert(chkPinVal.loginPinMsg);
                }

            });

        } else {
            
            comm.callNativeIfc(pinService, {}, function(result4){
                
                if(result4.result.code == "4016"){
                    comm.hideLoading();
                    
                    CommMsg.alert("등록된 생체인증 정보가 없습니다.",function(result){
                    },{addText :"디바이스에서 등록 후 다시 시도해주세요"});
                    
                } else if(result4.result.code == "4004") {
                    comm.reRegPinNumber();
                } else {
                    callback(result4);
                }
                
            });

        }
    },

    /************************************************************************
    @함수명        : chkPinValidation
    @설 명        : 핀 인증 Validation
    @사용법        : comm.chkPinValidation(type, result) 호출
    @param  type   (type : String) : 인증 타입 (PIN : 핀 번호, BIO : 생체인증, PATTERN : 패턴)
    @param  result (type : JSON) : 앱 인터페이스로 받아온 디바이스 정보
    @작성일        : 2022-02-28
    @작성자        : 권희준

    수정일             수정자         수정내용
    -----------     ------      --------------

    ************************************************************************/
    chkPinValidation :  function(type, result){

        var pinValidation = {};
        var certRegType = result.params;
        pinValidation.loginPinPass = "Y";

        //핀사인 등록 여부
        if(certRegType.exist_yn != "Y"){

            pinValidation.loginPinPass = "E"
            pinValidation.loginPinMsg = "등록된 핀사인 정보가 없습니다.";

        //생체 인증 등록 여부 (NA: 미지원, FP: 지문, FI: FACE ID)
        } else if(type == "BIO"){

            if(certRegType.bio_yn != "Y"){

                var pinBioType = "지문";

                if(certRegType.bio_type == "FI"){
                    pinBioType = "FACE ID";
                }

                pinValidation.loginPinPass = "B"
                pinValidation.loginPinMsg = "등록된 "+pinBioType+" 정보가 없습니다.";
            }
        //패턴 설정 여부
        } else if(type == "PATTERN"){

            if(certRegType.pattern_yn != "Y"){
                pinValidation.loginPinPass = "P"
                pinValidation.loginPinMsg = "등록된 패턴 정보가 없습니다.";
            }
        }

        return pinValidation;
    },

    /************************************************************************
    @함수명        : reqScInit
    @설 명        : OCR 초기화
    @사용법        : comm.reqScInit() 호출
    @작성일        : 2022-02-28
    @작성자        : 권희준

    수정일             수정자         수정내용
    -----------     ------      --------------

     ************************************************************************/
    reqScInit : function(url, param){

        var sendData = comm.isNull(param) ? null : param;
        comm.callAjaxJson(url, sendData, function (result1){
            
            if(comm.isAos){
                window.SCCipherObj.complete(200, JSON.stringify(result1));
            } else {
                var sendParams = {"statusCode": 200, "data": result1};
                window.webkit.messageHandlers.SCCipherObj.postMessage(sendParams);
            }
        });
    },


    /************************************************************************
    @함수명        : reRegPinNumber
    @설 명        : 핀 번호 등록/재등록 화면 이동
    @사용법        : comm.reRegPinNumber() 호출
    @작성일        : 2022-02-28
    @작성자        : 권희준

    수정일             수정자         수정내용
    -----------     ------      --------------

    ************************************************************************/
    reRegPinNumber : function(){
        comm.showLoading();

        sessionStorage.setItem("completePinUrl", location.pathname);

        comm.goPage("/comm/ctrf/reRegPinNumForm.nh");
        //comm.goPage("/comm/ctrf/completeReRegPinNumForm.nh");
    },

    /************************************************************************
    @함수명        : regPinPattern
    @설 명        : 핀 패턴 등록/재등록 화면 이동
    @사용법        : comm.regPinPattern() 호출
    @작성일        : 2022-02-28
    @작성자        : 권희준

    수정일             수정자         수정내용
    -----------     ------      --------------

    ************************************************************************/
    reRegPinPattern : function(){
        comm.showLoading();

        sessionStorage.setItem("completePinUrl", location.pathname);

        comm.goPage("/comm/ctrf/reRegPatternForm.nh");
    },

    /************************************************************************
    @함수명        : callNativeBackButton
    @설 명        : 뒤로가기 버튼 사용 제어
    @사용법        : comm.callNativeBackButton(param) 호출
                   뒤로가기 버튼 동작 가능 유무(Y: 가능, N: 불가능) > 페이지 이동시 기본상태로 변경 (기본값:Y)
    @작성일        : 2022-02-16
    @작성자        : 권희준

    수정일             수정자         수정내용
    -----------     ------      --------------

     ************************************************************************/
    callNativeBackButton : function (param) {
        var possibleYn = "N"
        if(param != "N"){
            possibleYn = "Y"
        }

        comm.callNativeFunc("SET_BACK_BUTTON", {"possible_yn" : possibleYn}, "");
    },

    /************************************************************************
    @함수명        : callNativeAppSetting
    @설 명        : 앱 설정 인터페이스 호출
    @사용법        : comm.callNativeAppSetting() 호출
    @작성일        : 2022-02-16
    @작성자        : 권희준

    수정일             수정자         수정내용
    -----------     ------      --------------

    ************************************************************************/
    callNativeAppSetting : function () {
        comm.callNativeFunc("APP_SETTINGS", {}, null);
    },

    /************************************************************************
    @함수명        : callNativeAppClose
    @설 명        : 앱 종료 인터페이스 호출
    @사용법        : comm.callNativeAppClose() 호출
    @작성일        : 2022-02-16
    @작성자        : 권희준

    수정일             수정자         수정내용
    -----------     ------      --------------

    ************************************************************************/
    callNativeAppClose : function () {
        if((typeof callback) !="function"){
            comm.callNativeFunc("APP_CLOSE", {}, null);
        } else{
            comm.callNativeIfc("APP_CLOSE", {}, null);
        }
    },

    /************************************************************************
    @함수명        : callNativeCamera
    @설 명        : 카메라 인터페이스 호출
    @사용법        : comm.callNativeCamera() 호출
    @작성일        : 2022-02-21
    @작성자        : 권희준

    수정일             수정자         수정내용
    -----------     ------      --------------

     ************************************************************************/
    callNativeCamera : function (callback) {

        if((typeof callback) !="function"){
            comm.callNativeFunc("OPEN_CAMERA", {}, callback);
        } else{
            comm.callNativeIfc("OPEN_CAMERA", {}, callback);
        }
    },

    /************************************************************************
    @함수명        : callNativeOcr
    @설 명        : OCR 인터페이스 호출
    @사용법        : comm.callNativeOCR() 호출
    @작성일        : 2022-02-21
    @작성자        : 권희준

    수정일             수정자         수정내용
    -----------     ------      --------------

     ************************************************************************/
    callNativeOCR : function (callback) {

        if((typeof callback) !="function"){
            comm.callNativeFunc("OCR", {}, callback);
        } else{
            comm.callNativeIfc("OCR", {}, callback);
        }
    },

    /************************************************************************
    @함수명        : callNativeDeviceId
    @설 명        : 단말 고유값 조회
    @사용법        : comm.callNativeDeviceId() 호출
    @작성일        : 2022-02-22
    @작성자        : 권희준

    수정일             수정자         수정내용
    -----------     ------      --------------

     ************************************************************************/
    callNativeDeviceId : function (callback) {
        if((typeof callback) !="function"){
            comm.callNativeFunc("GET_DEVICE_ID", {}, callback);
        } else{
            comm.callNativeIfc("GET_DEVICE_ID", {}, callback);
        }
    },

    /************************************************************************
    @함수명        : callNativeDeviceInfo
    @설 명        : 간편로그인 인증 및 단말정보
    @사용법        : comm.callNativeDeviceInfo() 호출
    @작성일        : 2022-02-21
    @작성자        : 권희준

    수정일             수정자         수정내용
    -----------     ------      --------------

     ************************************************************************/
    callNativeDeviceInfo : function (callback) {
        if((typeof callback) !="function"){
            comm.callNativeFunc("GET_SIMPLE_INFO", {}, callback);
        } else{
            comm.callNativeIfc("GET_SIMPLE_INFO", {}, callback);
        }
    },

    /************************************************************************
    @함수명        : callNativePushInfo
    @설 명        : 푸시 알림 설정 정보 조회 및 변경
    @사용법        : comm.callNativePushInfo() 호출
    @param  request_type    (type : String) : 푸시 알림 요청 타입 (get:조회, set:변경)
    @param  notification_yn (type : String) : 푸시 알림 설정 변경 요청, 변경시에만 필요 (Y : 푸시 알림 수신 동의, N : 푸시 알림 수신 거절)
    @작성일        : 2022-02-16
    @작성자        : 권희준

    수정일             수정자         수정내용
    -----------     ------      --------------

     ************************************************************************/
    callNativePushInfo : function (sendData, callback) {
        if((typeof callback) !="function"){
            comm.callNativeFunc("PUSH_NOTIFICATION_INFO", sendData, callback);
        } else{
            comm.callNativeIfc("PUSH_NOTIFICATION_INFO", sendData, callback);
        }
    },

    /************************************************************************
    @함수명        : callNativeFunc
    @설 명        : 앱 인터페이스 호출
    @사용법        : comm.callNativeFunc() 호출
    @param  serviceId   (type : String) : 앱 인터페이스 서비스 명
    @param  param       (type : object) : 전달 파라미터
    @param  callbackFunc(type : String) : 콜백받을 함수명
    @returns    : 전달해준 콜백 함수로 전달
    @작성일        : 2022-02-16
    @작성자        : 권희준

    수정일             수정자         수정내용
    -----------     ------      --------------

    ************************************************************************/
    callNativeFunc : function (serviceId, param, callbackFunc) {

        var service = {"service" : serviceId, "params" : param};
        callbackFunc = comm.isNull(callbackFunc) ? "" : callbackFunc;



        if(comm.channel == "MA" || comm.channel == "MP"){
            if(comm.isAos){
                window.NativeBridge.callNativeFunc(JSON.stringify(service), callbackFunc);
            } else {
                var sendParams = {"input" : service, "callbackFunc" : callbackFunc};
                webkit.messageHandlers.callbackHandler.postMessage(sendParams);
            }
        }

    },

    /************************************************************************
    @함수명        : callNativeIfc
    @설 명        : 앱 인터페이스 호출
    @사용법        : comm.callNativeFunc() 호출
    @param  serviceId   (type : String) : 앱 인터페이스 서비스 명
    @param  param       (type : object) : 전달 파라미터
    @param  callbackFunc(type : function) : 콜백받을 함수
    @returns    : 전달한 함수에 전달
    @작성일        : 2022-02-25
    @작성자        : 권희준

    수정일             수정자         수정내용
    -----------     ------      --------------

    ************************************************************************/
    callNativeIfc : function (serviceId, param, callbackFunc) {
        comm.callNativeResFunc = callbackFunc;
        comm.callNativeFunc(serviceId, param, "comm.callNativeIfcFunc")
    },
    callNativeResFunc : {},
    callNativeIfcFunc : function (callback) {
        comm.callNativeResFunc(callback);
    },


    /*
     * 숫자만 입력
     */
    onlyNum : function (obj){
        if((event.keyCode>47)&&(event.keyCode<58)){
        }else{
            event.returnValue = false;
        }
    },
    onlyNumKeyUp : function (event){
        const regExp = /[^0-9]/g;
        const ele = event.target;
        if (regExp.test(ele.value)) {
            ele.value = ele.value.replace(regExp, '');
        }
    },
    changeOnlyNumFormat : function (iptObj,noComma){
        var iptVal = $(iptObj).val();
        var numType = $(iptObj).data("num-type");
        var formatNum = "";

        if(numType == "f"){
            var iptNum = iptVal.replace(/[^0-9.]/g, "");
            var splitNum = iptNum.split(".");
            var secNum = comm.isNull(splitNum[1]) ? "" : "."+splitNum[1];

            if(noComma){
                formatNum = iptNum;
            } else {
                formatNum = splitNum[0].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")+secNum;
            }
        } else {
            var iptNum = iptVal.replace(/[^0-9]/g, "");

            if(noComma){
                formatNum = iptNum;
            } else {
                formatNum = iptNum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            }
        }

        $(iptObj).val(formatNum);
    },
    /*
     * param :트림  대상 (object or value)
     * 트림
     */
    trim : function(param){

        if((typeof param ) == "object"){
            return comm.trimObj(param);
        }else{
            return comm.trimValue(param);
        }
    },

    /*
     * addNumFormatEvent : input type이 tel인 element에 숫자 입력 이벤트 적용
     */
    addNumFormatEvent : function(param){

        $("input[type='tel']").off("focusin").on("focusin", function() {

            $(this).val($(this).val().replaceAll(",",""));

            //포커스 아웃시 콤마 추가
            $("input[type='tel']").off("focusout").on("focusout", function() {
                comm.changeOnlyNumFormat(this);
            });

            //숫자만 입력 가능
            $("input[type='tel']").on("keyup", function(event) {
                comm.changeOnlyNumFormat(this, true);
            });
        });
    },

    /*
     * comm.trim($("#objid"))
     * 앞뒤 트림
     */
    trimObj : function(obj){
        return $.trim(obj.val());
    },
    /*
     * comm.trim(value)
     * 앞뒤 트림
     */
    trimValue : function(value){
        return $.trim(value);
    },
    /*
     * 포커스 이동 inputFailCheck 를 사용해 주세요
     */
    setFocus : function (focusInObjId,focusOutObjId){

        comm.inputSuccessCheck(focusInObjId);
    },


    /************************************************************************
    @함수명        : goMain
    @설 명        : 매인 페이지로 이동
    @사용법        : comm.goMain() 호출
    @작성일        : 2022-01-24
    @작성자        : 강종철

    수정일             수정자         수정내용
    -----------     ------      --------------

    ************************************************************************/
    goMain : function(){
        document.location.href =comm.homePageUrl;
    },

    /************************************************************************
    @함수명        : checkValidation
    @설 명        : validation 체크
    @사용법        : comm.checkValidation(layerId,msgObj) 호출
    @param  layerId (type : String) : validation 항목을 포함하는 영역의 ID
    @param  msgObj  (type : Object) : validation 정보(key : validation대상 엘리먼트의 ID, value : 표시메세지)
    @returns
    @작성일        : 2022-01-24
    @작성자        : 강종철

    수정일             수정자         수정내용
    -----------     ------      --------------
	2024-01-17		오은진		errorMsg div 제거
	2024-01-18		김도연		inputSuccessCheck, inputFailCheck 함수 aria-describedby 속성 remove처리 및 aria-hidden 속성 추가
    2024-02-27		김도연		inputSuccessCheck, inputFailCheck 함수 포커스 추가
    2024-02-28		김정수		errorMsg div 위치 수정
    2024-03-19		오은진		errorMsg div 조건 추가
    ************************************************************************/
    checkValidation : function (layerId,msgObj ){
        /*
         *
         layerId는 모든 체크input를 포함하고 있는 곳..
         msgObj는 objId에 보여줘야할 메시지
         msgObj[objId] = 보여줘야할 메시지
         */

        //모든 오류 메시지는 숨긴다
//        $("#"+layerId).find("div.ty_error").hide();
        $("#"+layerId).find("div.ty_error").remove();
        //class 제거
        $("#"+layerId).find("div.has_error").removeClass("has_error");


        var errFristObjId;
        $.each(msgObj,function(objId,errTxt){

            if(comm.nvl(errFristObjId) == ""){
                errFristObjId = objId;
            }

            var tagName = $("#"+objId).prop('tagName').toLowerCase();
            var parentClass = "";

            var errLayerId = objId+"_chk";

            if($("#"+errLayerId).length>0){

                $("#"+errLayerId).text(errTxt);
                if($("#"+objId).closest('.input_pack').length > 0) {
                	$("#"+objId).closest('.input_pack').addClass("has_error");
                } else {
                	$("#"+objId).parent().addClass("has_error");
                }
                
                if(!$('#'+errLayerId).is(':visible'))$('#'+errLayerId).show();

            }else{

                var errmsgTag = '<div id="'+errLayerId+'" class="ebform_msg ty_error">'+comm.nvl(errTxt)+'</div>';
                if($("#"+objId).closest('.input_pack').length > 0) {
	                $("#"+objId).closest('.input_pack').after(errmsgTag);
	                $("#"+objId).closest('.input_pack').addClass("has_error");
                } else {
                	$("#"+objId).parent().after(errmsgTag);
                	$("#"+objId).parent().addClass("has_error");
                }

            }

        })//end each

        if(comm.nvl(errFristObjId) != ""){

            var tagName = $("#"+errFristObjId).prop('tagName').toLowerCase();

            //$("#"+errFristObjId).parent().removeClass("has_error");
            setTimeout(function(){
                if("input" == tagName ){
                    $("#"+errFristObjId).parent().addClass("has_focus");
                }
                $("#"+errFristObjId).focus();

            },10);
        }

    },


    inputSuccessCheck : function(id) {
        if(!comm.isAos) {
            //$("body,html").stop().animate({scrollTop : scrollTopFunc($("#"+id).offset().top)},500);
        }
        $("#"+id).focus();
        $("#"+id).parent().addClass('has_error');
        $("#"+id+"_chk").show();
        $("#"+id+"_chk").attr('aria-hidden', 'false');

        $("#"+id).on("focusout",function() {
	        //값어 있을 경우 체크를 해지함
	        if(comm.trim($(this)) !=""){
	        	$("#"+id).off('focusout');
	        	comm.inputFailCheck(id);
	        }
        });
        
    },

    inputFailCheck : function(id) {
        if(!comm.isAos ){
            //$("body,html").stop().animate({scrollTop : scrollTopFunc($("#"+id).offset().top)},500);
        }
       
        $("#"+id).parent().removeClass('has_error');
        $("#"+id+"_chk").hide();
        $("#"+id+"_chk").attr('aria-hidden', 'true');
        $("#"+id).removeAttr('aria-describedby');  
        
        setTimeout(function() {
        	$("#"+id).focus();
        }, 10);
    },

    // 보안키패드
    fnOnKeyboard : function(div) {
    	comm.onKeyboard(div.querySelector('.keyboardInput'));
    },
    onKeyboard : function(val,callbackFunc) {
    	$(val).closest("div").removeAttr("title");
    	
        if((comm.channel == "MA")||(comm.channel == "MP")) {
            var form = $(val).parents("form");
            var curForm = getFormObject(form);

            ext.keyPad.prototype.init(curForm, callbackFunc);
        }

        if((comm.channel == "MW")) {
        	if(mtk == null){
        		initmTranskey();
        	}
        	setTimeout(function(){
        		mtk.onKeyboard(val);
        	}, 100);
        }
    },

    // App 공동인증서 호출
    //doCertAuth : function(signData) {
    //  NHCNative.auth(signData, 'sign', 'pubcert', '', '', '');
    //},

    // App 공동인증서 호출
    doCertAuth : function(delfinoNonce, callback) {
        var param = {};
        param.request_type = "login";
        param.sign_data = delfinoNonce;

        if((typeof callback) != "function"){
            comm.callNativeFunc("PUBCERT_SIGN", param, callback);
        } else{
            comm.callNativeIfc("PUBCERT_SIGN", param, callback);
        }
    },

    // App 사설인증서 본인확인
    doSnsAuth : function(provider, name, birth, phone, callback) {
        var param = {};
        param.sign_data     = 'login=vpcgAuth';
        param.request_type  = 'auth';
        param.provider      = provider;
        param.name          = name;
        param.birth         = birth;
        param.phone         = phone;

        if((typeof callback) != "function"){
            comm.callNativeFunc("DELG10_AUTH", param, callback);
        } else{
            comm.callNativeIfc("DELG10_AUTH", param, callback);
        }
    },

    // App 사설인증서 로그인
    doSnsLogin : function(provider, sign_data, name, birth, phone, callback) {
        var param = {};
        param.sign_data       = sign_data;
        //param.sign_data     = '';
        param.request_type  = 'login';
        param.provider      = provider;
        param.name          = name;
        param.birth         = birth;
        param.phone         = phone;

        if((typeof callback) != "function"){
            comm.callNativeFunc("DELG10_AUTH", param, callback);
        } else{
            comm.callNativeIfc("DELG10_AUTH", param, callback);
        }
    },

    // App 전자서명
    doAppSign : function(provider, sign_data, name, birth, phone, callback) {
        if(provider == 'pubcert') {
            var param = {};
            param.request_type = "sign";
            param.sign_data = sign_data;

            if((typeof callback) != "function"){
                comm.callNativeFunc("PUBCERT_SIGN", param, callback);
            } else{
                comm.callNativeIfc("PUBCERT_SIGN", param, callback);
            }
        } else {
            var param = {};
            param.sign_data     = sign_data;
            param.request_type  = 'sign';
            param.provider      = provider;
            param.name          = name;
            param.birth         = birth;
            param.phone         = phone;

            if((typeof callback) != "function"){
                comm.callNativeFunc("DELG10_AUTH", param, callback);
            } else{
                comm.callNativeIfc("DELG10_AUTH", param, callback);
            }
        }
    },

    /*
     * objId : select box Id
     * option
     * option.dataList  : dataList
     * option.valueId : dataList에 option value에 값을 넣을 ID
     * option.textId : dataList에 option text에 값을 넣을 ID
     *
     */
    addSelectBoxOption: function (objId,option){

        $("#"+objId).empty();
        var placeholder = $("#"+objId).attr("data-placeholder");

        $("#"+objId).append("<option value=\"\" >"+placeholder+"</option");

        $.each(option.dataList,function(idx,row){

            $("#"+objId).append("<option value=\""+row[option.valueId]+"\" >"+row[option.textId]+"</option");
        });

    },

    /************************************************************************
    @함수명        : getCommonCode
    @설 명        : 공통 코드 조회
    @사용법        : comm.getCommonCode({"COMM_CODE_LIST":["공통코드1","공통코드2"]}, callbackFun) 호출
    @param param        : 조회할 공통코드( {COMM_CODE_LIST:[]} 의 구조 전달해줘야함 )
    @param callbackFun  : 콜백 받을 함수

    수정일             수정자         수정내용
    -----------     ------      --------------

    ************************************************************************/
    getCommonCode : function(param,callbackFun){
        comm.callAjaxJson("/common/getCommonCode.nh", param,callbackFun);
    },
    /* 주민번호 뒷자리 6자리 마스킹 처리 합니다.
     * maskingSerialNumberDash('1234567894561','') ->1234567******
     * maskingSerialNumberDash('1234567894561','-') ->123456-7******     *
     */
    maskingSerialNumberDash: function (sn,dash){

        var result = "";
        dash = comm.nvl(dash);
        var partten = /(\d{6})(\d{1})(\d{6})/;
        result = sn.replace(partten,"$1"+dash+"$2"+"******");

        return result;
    },
    /*
     * 휴대폰 전화번호 체크
     * 01로 시작하며 01[0,1,6,7,8,9]가 올수 있으며
     * 가운대 4자리
     * 마지막 4자리
     * 가 맞아야 true
     * 아니면 false
     */
    phoneNumberCheck : function(pn){
        var result = true;

         var regPhone = /^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$/;


         if (regPhone.test(pn) === false) {
             result = false;
          }

        return result;
    },

    /*
     * 전화번호를 포멧팅 합니다.
     * 앞자리 3자리 뒷자리 4자리 나머지 중간 형태로 나뉩니다.
     * ex: 01012345678 -> 010-1234-5678
     *     021234567 ->02-123-4567
     */
     telFormat : function(tel){
        return tel.replace(/(^02.{0}|^01.{1}|[0-9]{3})([0-9]+)([0-9]{4})/,"$1-$2-$3");
    }

    , telFormat2 : function(value, format) {
        value = value.replace(/[^0-9]/g, '');

        let result = [];
        let restNumber = "";

        if (value.startsWith("02")) {   // 서울 지역번호
            result.push(value.substring(0, 2));
            restNumber = value.substring(2);
        } else if (value.startsWith('1')) { // 지역번호 없음(15xx)
            restNumber = value;
        } else {    // 나머지 0x0
            result.push(value.substring(0, 3));
            restNumber = value.substring(3);
        }

        if (restNumber.length === 7) {
            result.push(restNumber.substring(0, 3));
            result.push(restNumber.substring(3));
        } else {
            result.push(restNumber.substring(0, 4));
            result.push(restNumber.substring(4));
        }

        //return result.filter((v) => v).join(format);
        var temp =  result.filter(function(v) {
            return v
        });
        return temp.join(format);
        //return result.join(format);
    }

    /*
     * selectbox EMail domain 세팅 합니다.
     *
     */
    ,addEmailDomain : function (selectObjId){
        var dataList = new Array();

        var domainList = ["naver.com"
                        ,"hanmail.net"
                        ,"gmail.com"
                        ,"nate.com"
                        ,"kakao.com"
                        ,"outlook.com"
                        ,"hotmail.com"
                        ,"yahoo.com"
                        ,"empas.com"
                        ,"korea.com"
                        ,"paran.com"
                        ];

        $.each(domainList,function(idx,value){
            var domainListObj = new Object();
            domainListObj.domain = value;
            dataList[idx] = domainListObj;
        });


        var option = new Object();
        option.dataList = dataList;
        option.valueId = "domain";
        option.textId = "domain";

        comm.addSelectBoxOption(selectObjId,option);

    },
    /**
     * 보안 프로그램 설치 페이지로 이동
     * var param = new Object();
     * param.returnURL=returnUrl : 설치후 이동 페이지
     */
    goSecInstallPage : function (param){
        comm.goPage("/common/securityProgramInstallForm.nh",param);
    },

    /************************************************************************
    @함수명        : callAppStart
    @설 명        : 모바일웹에서 앱 호출
    @사용법        : comm.callAppStart() 호출

    수정일             수정자         수정내용
    -----------     ------      --------------

    ************************************************************************/
    callAppStart : function(){
        var visitTime = (new Date()).getTime();

        if(comm.channel == "MW"){

            //안드로이드일 때
            if (comm.isAos) {
                location.href = "Intent://#Intent;scheme=nhcapitalapp;package=kr.co.nhcapital;end";

            //아이폰일 때
            } else {

                setTimeout(function() {
                    if ((new Date()).getTime() - visitTime < 5000) {
                        location.href = comm.info.storeUrl;
                    }
                } ,2500);

                setTimeout(function() {
                    if ((new Date()).getTime() - visitTime < 5000) {
                        location.href = "nhcapitalapp://";
                    }
                } ,0);

            }
        } else if(comm.channel == "MA"){
            location.href = comm.info.storeUrl;
        }
    },
    /*
     *파일 다운로드를 합니다.
     *param.callbackFun =
     */
    fileDownload: function (directory, downloadFile, orgFileName,param){

        var url = "";
        
        var chkParam = new Object();
        chkParam["directory"] = directory;
        chkParam["serverFileName"] = downloadFile;
        

        var downLoadUrl = "";
        if (orgFileName) {
            downLoadUrl = url+"?directory="+directory+"&serverFileName="+encodeURIComponent(downloadFile)+"&orgFileName="+encodeURIComponent(orgFileName);
        } else {
            downLoadUrl = url+"?directory="+directory+"&serverFileName="+encodeURIComponent(downloadFile)+"&orgFileName="+encodeURIComponent(downloadFile);
        }

        if(comm.isNull(param)||comm.isEmptyObject(param)){

        }else{
            $.each(param,function(key,value){
                downLoadUrl +=key+"="+encodeURIComponent(value);
                
                chkParam[key]=value;
                
            })
        }

        var chkUrl = '/common/getCheckDownLoadFileExist.nh?';
        $.each(chkParam,function(key,value){
            chkUrl +=key+"="+encodeURIComponent(value)+"&"; 
        })
        
        if(("MA" == comm.channel)){
            
            downLoadUrl ="/common/filedownloadApp.nh"+downLoadUrl;
            
            comm.callAjaxJson(chkUrl,{},function(data){
                
                if(data.ERROR_CODE=="0000"){
                    comm.goPage(downLoadUrl);
                }else{
                    CommMsg.alert(data.ERROR_MSG);
                }
            })
            
             
        } else if (("AD" == comm.channel)){
             
            $.ajax({
                type:'POST',
                contentType: 'application/json',
                url:chkUrl,
                data : {},
                dataType : "json",
                beforeSend:function(xhr){
                    
                    xhr.setRequestHeader("TRANS_TYPE","AJAX");                  
                    $("#loading").show();
                    $("#btnbox").hide();
                    
                },
                success:function(data){
                    if(data.ERROR_CODE=="0000"){
                        //관리자 다운로드 
                        downLoadUrl ="/common/filedownloadApp.nh"+downLoadUrl;
                        
                        var link = document.createElement("a");
                        link.setAttribute('download', "filedownLink");
                        link.href = downLoadUrl;
                        document.body.appendChild(link);
                        link.click();
                        link.remove();
                    }else{
                        CommMsg.alert(data.ERROR_MSG);
                    }

                },
                complete:function(){
                    $("#loading").hide();
                    $("#btnbox").show();
                },
                error:function (data, textStatus) {
                    $("#loading").hide();
                    $("#btnbox").show();
                    CommMsg.alert("서버 통신 상태가 원할하지 않습니다.\n잠시 후 다시 접속해주세요.");
                }
            });
            
        }
        else{

            downLoadUrl ="/common/filedownload.nh"+downLoadUrl;

            $.ajax({
                url: downLoadUrl,
                cache: false,

                xhr: function () {
                    var xhr = new XMLHttpRequest();
                    xhr.onreadystatechange = function () {
                        if (xhr.readyState == 2) {
                            if (xhr.status == 200) {
                                xhr.responseType = "blob";
                            } else {
                                xhr.responseType = "text";
                            }
                        }
                    };

                    return xhr;
                },

                beforeSend:function(xhr){
                     xhr.setRequestHeader("TRANS_TYPE","AJAX");
                },
                success: function (data) {
                    
                    //Convert the Byte Data to BLOB object.
                    var blob = new Blob([data], { type: "application/octetstream" });
                    //Check the Browser type and download the File.
                    var isIE = false || !!document.documentMode;

                    if (isIE) {
                        window.navigator.msSaveBlob(blob, orgFileName);
                    } else {
                        var url = window.URL || window.webkitURL;
                        link = url.createObjectURL(blob);
                        var a = $("<a />");
                        a.attr("id", "download_a");
                        a.attr("download", orgFileName);
                        a.attr("href", link);
                        $("body").append(a);
                        a[0].click();
                        $("#download_a").remove();
                    }

                    if(comm.isNull(param)||comm.isEmptyObject(param)){

                    }else{
                        if(!comm.isNull(param.callbackFun)){
                            var returnData = new Object();
                            returnData.resultCode="00";
                            param.callbackFun(returnData);
                        }
                    }

                },
                complete:function(){
                },
                error:function (data, textStatus) {


                     if(comm.isNull(param)||comm.isEmptyObject(param)){


                     }else{
                         if(!comm.isNull(param.callbackFun)){
                             var returnData = new Object();
                             returnData.resultCode="99";
                            param.callbackFun(returnData);
                        }
                     }



                    CommMsg.alert("서버 통신 상태가 원할하지 않습니다.\n잠시 후 다시 접속해주세요.");
                }

            });
        }


    },

    /*
     * 파일 업로드
     * elementName : input teg name;
     * directory : 업로드 폴더
     * callbackFun : 콜백 함수
     * result.uploadResult = 업로드 정보 ;
     *
     * orgFileName  : 업로드 파일 이름
       newFileName : 업로드된 파일 이름
       filePath    : 파일 저장 위치
       fileSize    : 파일 크기

       option.type="img/doc/all" //optinon => object()//기봇값은 filefh
     *
     */
    fileUpload: function (elementName,directory,callbackFun,option){

        var formData = new FormData();
        var count = 0;

        $.each($("input[name='"+elementName+"']"),function(idx,obj){

            if($(obj)[0].files["length"] > 0){
                formData.append('uploadFile', $(obj)[0].files[0]);
                count++;
            }
        })

        if(count > 0){

            formData.append("directory",directory);

            if(comm.isNull(option)||comm.isEmptyObject(option)){
                formData.append("uploadType","all");
            }else{
                formData.append("uploadType",option.uploadType);
                
                // 상담사 사진 파일 업로드일 경우 파일명을 상담사 번호로 지정하기 위해 CSLR_NO 추가
                if (!comm.isEmpty(option['CSLR_NO'])) {
                	formData.append("CSLR_NO", option['CSLR_NO']);
                }
            }

            $.ajax({
                type: "POST",
                enctype: 'multipart/form-data',
                url: "/common/multiFormSubmit.nh",
                data: formData,
                processData: false,
                contentType: false,
                cache: false,
                beforeSend:function(xhr){
                    xhr.setRequestHeader("TRANS_TYPE","AJAX");
                },
                success: function (data) {
                    callbackFun(data.uploadResult);
                },
                error:function (data, textStatus) {
                    if(!comm.isNull(data.responseJSON)){
                        CommMsg.alert("에러:["+data.responseJSON.errorCode+"]");
                    }else{
                        CommMsg.alert("서버 통신 상태가 원할하지 않습니다.\n잠시 후 다시 접속해주세요.("+data.status+":"+data.statusText+")");
                    }

                }
            });

        }else{
            var result = new Object();
            result.uploadResult = {};
            callbackFun(result);
        }


    },


    // 전자서명
    doCertSign : function(formname, callbackfunc, ifId, formData) {
        var url = "/comm/dsgn/certSignSelect.nh?formname=" + formname + "&callbackfunc=" + callbackfunc + "&ifId=" + ifId;
        var id = "certSignDiv";
        CommPop.layerPopup(id, url, formData);
    },

    // 휴대폰 본인인증
    // 휴대폰 본인인증
    doHpAuth : function(type, returnUrl, menuType) {
        // 메뉴 네이게이션 스토리지 저장
        var step = $('.step_part').html();
        if(step != undefined) {
            sessionStorage.setItem('step', step);
        } else {
            sessionStorage.removeItem('step');
        }

        var menu = $('.breadcrumbs_pack').html();
        if(menu != undefined) {
            sessionStorage.setItem('menu', menu);
        } else {
            sessionStorage.removeItem('menu');
        }

        var url = '';
        // 주민등록번호
        if(type == 'serial') {
            url = '/comm/auth/authForm.nh';
        // 생년월일 + 성별
        } else if(type == 'birth') {
            url = '/comm/auth/hpAuthForm.nh';
        // 생년월일 + 성별 (회원가입)
        } else if(type == 'join') {
            url = '/comm/auth/hpAuthForm.nh';
        // 생년월일 + 성별 (PIN, 패턴 재등록)
        } else if(type == 'rePin') {
            url = '/comm/auth/hpAuthForm.nh';
        // 회사(법인)인증
        } else if(type == 'company') {
            url = '/comm/auth/authCertForm.nh';
        }

        var param = {};
        param.returnUrl = returnUrl;
        if(type == 'join') {
            param.signUpCheck = 'Y';
        } else {
            param.signUpCheck = 'N';
        }

        if(type == 'rePin') {
            param.rePinCheck = 'Y';
        } else {
            param.rePinCheck = 'N';
        }

        if(menuType != undefined && menuType == 'L') {
            param.headerType = 'L';
        } else if(menuType != undefined && menuType == 'R') {
            param.headerType = 'R';
        } else if(type == 'join') {
            param.headerType = 'L';
        } else {
            param.headerType = '';
        }

        // 세션 스토리지에 본인인증 호출 정보 등록
        sessionStorage.setItem('authUrl',       url);
        sessionStorage.setItem('authReturnUrl', returnUrl);
        sessionStorage.setItem('authParam',     JSON.stringify(param));

        comm.goPage(url, param);
    },

    /*
     * 브라우저에서 지원하는 기본  프린트 기능
     * innserHtml : 프린트 하고자 하는 html
     */
    doPrint : function (innerHtml){

        var win = window.open();
        self.focus();
        win.document.open();
        win.document.write("<html><head>");
        win.document.write('<link rel="stylesheet" href="/resource/pc/css/ui_plugin.css">');
        win.document.write('<link rel="stylesheet" href="/resource/pc/css/ui_style.css">');
        win.document.write("</head>");
        win.document.write("<body>");
        win.document.write("    <div class='layout temp'>");
        win.document.write("            <div class='container'>");
        win.document.write(                 innerHtml);
        win.document.write("            </div>");
        win.document.write("    </div>");
        win.document.write("</body></html>");
        win.document.close();
        win.print();
        win.close();
    },
    /*
     * orgSTr :원본 문자열
     * targetSTr : 찾을 문자열
     * replaceStr : 변경 문자열
     */
    replaceAll : function(orgStr,targetStr,replaceStr){

        return orgStr.split(targetStr).join(replaceStr);
    },
    getCurTimeStamp : function (url,param){
        var d = new Date();
        var s = comm.leadingZeros(d.getFullYear(), 4) + comm.leadingZeros(d.getMonth() + 1, 2) + comm.leadingZeros(d.getDate(), 2);
        return s;
    },
    leadingZeros : function (n, digits) {
        var zero = '';
        n = n.toString();

        if (n.length < digits) {
            for (i = 0; i < digits - n.length; i++)
                zero += '0';
        }
        return zero + n;
    },
    /*
     * url 주소를 새창으로 생성 합니다.
     */
    openWinPop : function (url,param){
        window.open(url);

    },

    autoLogout : function() {
        var xhttp = new XMLHttpRequest();
        xhttp.open("POST", "/login/logout.nh", true);
        xhttp.send();
    },

    logout : function() {
        if(comm.channel == "PW") {
            var option = {};
            //option.title = '로그아웃 하시겠어요 ?';
            option.nextUrl = '/login/logout.nh';
            CommMsg.confirm('로그아웃 하시겠어요 ?', callbackLogout, option);
        } else {
            var option = {};
            option.title = '로그아웃 하시겠어요 ?';
            option.type = 'c';
            option.btnLeft = '취소';
            option.btnRight = '확인';
            CommMsg.msgPop(option, callbackLogout);
        }
    },

    callLogout : function() {
        comm.callAjaxJson('/login/logout.nh', {}, function() {});
    },

    /**
     * 메뉴를 리로드 합니다.
     */
    callMenuReLoad : function(callbackFun){
        comm.callAjaxJson("/common/getSearchMenuListAjax.nh",{"menuLoadYn":"Y"},callbackFun)
    },

    /**
    * object empty 체크
    */
    isEmptyObject : function(param){
        return Object.keys(param).length === 0 && param.constructor === Object;
    },
    /**
     * 역치환
     */
    reverseReplace : function (target){
        var result = "";
        var parser = new DOMParser;
        var dom = parser.parseFromString(target,'text/html');
        result = dom.body.textContent;
        return result;
    },
    goMyinfo : function(){
        //마이페이지로 이동
        var url = "/myaccnt/member/memberInfo/checkPwForm.nh";
        
        comm.goPage(url);
    },
    /*
     * 사업자 번호 포켓팅
     */
    bizNoFormat : function(value, format) {

        value = value.replace(/[^0-9]/g, '');


        var result = [];
        var restNumber = "";
        if(value.length>=3){
            result.push(value.substring(0,3));
            restNumber =value.substring(3);
        }else{
            result.push(value);
        }


        if(restNumber.length>=2){
            result.push(restNumber.substring(0,2));
            restNumber = restNumber.substring(2);
        }

        if(restNumber.length>0){
            result.push(restNumber);
        }


        var temp =  result.filter(function(v) {
            return v
        });
        var resultStr =temp.join(format);
        return resultStr;
    },
    
    //운전 면허증 포멧
    licenseNoFormat : function (iptEle, format){
        var value = $(iptEle).val();
        value = value.replace(/[^0-9]/g, '').substring(0, 10);
        
        var result = [];
        var midNum = "";
        var lastNum = "";
        
        if(value.length > 2){
            
            result.push(value.substring(0, 2));
            midNum = value.substring(2);
            
            if(midNum.length > 6){
                
                result.push(midNum.substring(0, 6));
                result.push(midNum.substring(6));
                
            } else {
                result.push(midNum);
            }
            
        }else{
            result.push(value);
        }
        
        var resultStr =result.join(format);
        $(iptEle).val(resultStr);
    },

    // 공동인증서 가져오기 (APP 호출)
    doCertMove : function() {
        var url = "/comm/crtf/pubcertMove.nh";
        var id = "certMovepopupId";
        var formData = "";

        CommPop.layerPopup(id, url, formData);
    },

    // 공동인증서 등록 (APP 호출)
    doCertRegister : function() {
        var url = "/comm/crtf/pubcertRegister.nh";
        var id = "certRegisterpopupId";
        var formData = "";

        CommPop.layerPopup(id, url, formData);
    },
    /**
     * IE버젼 11이하일경우를 체크 합니다. 
     */
    doCheckIeVersion : function(){
        
        if((navigator.userAgent.indexOf("Trident")>-1) ||(navigator.userAgent.indexOf("MSIE") > -1)){
            CommMsg.alert("IE Version 11 und");
        }
    },
    
    showProgress : function(time){
    	var html = "";
    	html += '<div id="progressLayer" class="modal_popup ty_alert">'
    	html +=		'<div class="popup_layout">'
    	html +=			'<div class="popup_inner">'
    	html +=				'<div class="popup_body">'
    	html +=					'<div class="popup_container">'
    	html +=						'<div class="alert_title_part">'
   		html +=							'<p class="title">잠시만 기다려주세요</p>'
   		html +=						'</div>'
   		html +=						'<div class="circle_loading_layer">'
  		html +=							'<div class="loading_area">'
  		html +=								'<div class="loading">'
  		html +=									'<img src="/resource/mobile/image/layout/loading_bar.png" alt="로딩중">'
  		html +=								'</div>'
  		html +=								'<p class="num"><span id="progressStatus">0</span>%</p>'
  		html +=							'</div>'
  		html +=						'</div>'
  		html +=						'<div class="alert_text_part">'
  		// 2024.11.10 24Hour/365Day 구축 프로젝트. 이상봉. 중입니다 => 중이에요 문구 수정
  		html +=							'<p class="color05">외부기관으로부터<br>고객님의 정보를 확인 중이에요.</p>'
  		html +=						'</div>'
  		html +=						'<div class="alert_text_part">'
  		// 2024.11.10 24Hour/365Day 구축 프로젝트. 이상봉. 있습니다 => 있어요 문구 수정
  		html +=							'<p class="color02">최대 <span id="waitTime">'+ time +'</span>초가 소요될 수 있어요.</p>'
  		html +=						'</div>'
  		html +=					'</div>'
  		html +=				'</div>'
  		html +=			'</div>'
  		html +=		'</div>'
  		html +=	'</div>'
  			
		$("#layoutBody").append(html);
    	popupFunc('#progressLayer').show();
    	change_time = setInterval("timebar_s()", 1000);
    }, 
    
    hideProgress : function(){
    	$("#progressLayer").remove();
    },
    kakaoCloseBrower : function(){
    	var _ua = window.navigator.userAgent || window.navigator.vgjendor || window.opera;
    	
    	window.location.href = (/iPad|iPhone|iPod/.test(_ua)) ? "kakaoweb://closeBrowser" : "kakaotalk://inappbrowser/close";
    	
/*    	if (_ua.toLocaleLowerCase().indexOf("kakaotalk") > -1) {
    		window.location.href = (/iPad|iPhone|iPod/.test(_ua)) ? "kakaoweb://closeBrowser" : "kakaotalk://inappbrowser/close";
    	}else if(_ua.toLocaleLowerCase().indexOf("android") > -1){
    		window.open('about:blank','_self').self.close();
    	}else if(_ua.toLocaleLowerCase().indexOf("iphone") > -1 || _ua.toLocaleLowerCase().indexOf("ipad") > -1 || _ua.toLocaleLowerCase().indexOf("ipod") > -1){
    		window.open('','_self','');
    		window.close();
    	}else{
    		window.close();
    	}*/
    },
    kakaoBrowserCheck : function (){
    	var os = '';
    	var _ua = window.navigator.userAgent || window.navigator.vgjendor || window.opera;
    	if(_ua.toLocaleLowerCase().indexOf("android") > -1){
    		os = 'AOS'
    	}else if(_ua.toLocaleLowerCase().indexOf("iphone") > -1 || _ua.toLocaleLowerCase().indexOf("ipad") > -1 || _ua.toLocaleLowerCase().indexOf("ipod") > -1){
    		os = 'IOS'
    	}
    	return os;
    },
    
    // datepicker 호출 - 접근성
    fnDatePicker: function(id) {
    	$("#" + id).datepicker().datepicker("show");
    }
}//end comm



jQuery.fn.serializeObject = function() {
    var obj = null;
    try {
        if (this[0].tagName && this[0].tagName.toUpperCase() == "FORM") {
            var arr = this.serializeArray();
            if (arr) {
                obj = {};
                jQuery.each(arr, function() {
                    obj[this.name] = this.value;
                });
            }//if ( arr ) {
        }
    } catch (e) {
        CommMsg.alert(e.message);
    } finally {
    }

    return obj;
};

/**
 * Form Object 를 가져온다.
 *
 * @param form
 *            id or object
 * @returns
 */
function getFormObject(form) {
    if (typeof form == 'object')
        return form;

    var rtForm = document.getElementById(form); // id 로 검색.
    if (!rtForm)
        rtForm = window.top.document.getElementById(form); // 최상위 document 검색.
    if (!rtForm)
        rtForm = getIFrameDocument().getElementById(form); // iframe document
    // 검색.

    if (!rtForm || typeof rtForm != 'object') {
        return null;
    }
    return rtForm;
}

/**
 * Element data의 값을 가져온다.
 *
 * @param element
 *            object
 * @param dataName
 *            name
 * @returns
 */
function getAttrDataValue(obj, dataName) {
    var valObj = $(obj).data(dataName);
    return valObj;
}

// 로그아웃 확인 Callback
function callbackLogout(data) {
    setTimeout(function() {
        if(comm.channel == "PW") {
            if(data) {
                comm.callAjaxJson('/login/logout.nh', {}, callbackMain);
            }
        } else {
            comm.callAjaxJson('/login/logout.nh', {}, callbackMain);
        }
    }, 500);
}

//로그아웃 처리 후 메인 페이지 이동
function callbackMain(data) {
    if(data.resultType == 'S') {
        if(comm.channel == "PW") {
            comm.goMain();
        } else if(comm.channel == "MP"){
        	comm.goPage('/partner/logn/loginForm.nh');
        } else {
            comm.goPage('/login/logoutForm.nh');
        }
    } else {
        CommMsg.alert(data.errorMsg);
    }
}

/**
 * 디파이너리(애드브릭스) 이벤트 호출
 * @param 이벤트명
 */ 
function fn_call_dfinery_event(param) {
	if (comm.channel === "MA") {
		// attrModel 이 있어야 브릿지함수 호출 됨.
		var params = { "attrModel": {} };
		$.extend(params, param);

		// [로그인] param = { "eventName": "login", "user_id": user_id };
		// [회원가입] param = { "eventName": "sign_up", "attrModel": {} };
		// [커스텀] param = { "eventName": eventName, "attrModel": {} };
		comm.callNativeFunc("CUSTOM_EVENT", params);
	} else {
		var eventName = param["eventName"];
		
		if (eventName === "login") { // 로그인
			adbrix.login(param["user_id"]);
		} else if (eventName === "sign_up") { // 회원가입
			adbrix.common.signUp("UserId");
		} else { // 커스텀
			adbrix.event.send(eventName);
		}
	}
}

function timebar_s() {
	var status = $("#progressStatus").text();
	var waitTime = $("#waitTime").text();
	var percent = 100 / waitTime;
	var timeStatus = Math.round(Number(status) + percent);
	if(timeStatus < 100){
		$("#progressStatus").text(timeStatus);
	} else {
		$("#progressStatus").text('99');
		clearInterval(change_time);
	}
	
}

/**
 * 디파이너리(애드브릭스) 이벤트 호출 - 자동차금융 공통
 * @param 이벤트명
 */ 
function fn_call_dfinery_car_event(mid, eventSuffix) {
	var type = "";
	var eventName = "";
	
	// 신차,리스,렌터카 구분
	if (mid === "ncar") { // 신차
		type = "new";
	} else if (mid === "cals") { // 리스
		type = "lease";
	} else if (mid === "ltrc") { // 렌터카
		type = "rent";
	}
	
	if (type !== "") {
		fn_call_dfinery_event({ eventName: "car_"+type+"_"+eventSuffix });
	}
}

ext = {};
