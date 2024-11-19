/********************************************************
파일명     : commPop.js
설 명     : layer popUp 및 공통 팝업을 생성합니다. 

수정일         수정자 명       Version     Function
-------     --------    ---------- --------------
 
*********************************************************/


var CommPop = {
        
        /************************************************************************
        @함수명        : selectAddressPopForm
        @설 명        : 주소검색 팝업 호출
        @사용법        : CommPop.selectAddressPopForm(callbackFunc) 호출
        @param  callbackFunc (type : function) : 검색 결과를 callback 받을 function

        수정일             수정자         수정내용
        -----------     ------      --------------
        
        ************************************************************************/
        selectAddressPopForm : function(callbackFunc){
            
            var layerHtml ='';
            
            if("PW" == comm.channel){
                 
                layerHtml +='<div id="popSearchAddrForm" class="modal_popup">';
                layerHtml +='   <div class="popup_layout" style="width: 800px; height: 700px;">';
                layerHtml +='       <div class="popup_inner">';
                layerHtml +='           <div class="popup_header">';
                layerHtml +='               <h3 class="ebtitle3">주소 검색</h3>';
                layerHtml +='               <button type="button" class="ebbtn btn_modal_close" title="팝업닫기" data-action="remove"></button>';
                layerHtml +='           </div>';
                layerHtml +='           <div class="popup_body" id="searchAddrForm_popup_header">';
                layerHtml +='           </div>';
                layerHtml +='       </div>';
                layerHtml +='   </div>';
                layerHtml +='</div>'; 
                 
            }else {
                
                layerHtml +='<div id="popSearchAddrForm" class="modal_popup ty_popupfull">';                
                layerHtml +='   <div id="searchAddressPopForm" class="popup_layout">';
                layerHtml +='       <div class="popup_inner"  id="searchAddrForm_popup_header">';
                layerHtml +='           <div class="popup_header" >';
                layerHtml +='               <h3 class="ebtitle3">주소 검색</h3>';
                layerHtml +='               <button type="button" class="ebbtn btn_modal_close" title="팝업닫기" data-action="remove"></button>';
                layerHtml +='           </div>';
                layerHtml +='       </div>';
                layerHtml +='   </div>';
                layerHtml +='</div>';
                
            }//end if           
            
            //callbackFun 저장
            CommPop.saveCallbackFun ("popSearchAddrForm",callbackFunc);
            //layerpop 생성 
            CommPop.layerPopupInit("popSearchAddrForm",layerHtml,CommPop.searchKakaoAddrLayer);
            
        },

        /************************************************************************
        @함수명        : searchKakaoAddrLayer
        @설 명        : 모바일 카카오 주소검색 화면 생성 
        @사용법        : CommPop.searchKakaoAddrLayer(param) 호출
        @작성자        : 강종철

        수정일             수정자         수정내용
        -----------     ------      --------------
        
        ************************************************************************/
        searchKakaoAddrLayer : function(){
            
            var element_layer = document.getElementById('searchAddrForm_popup_header');
            
            var height = $("#popSearchAddrForm").height() ;
            var width = $("#popSearchAddrForm").width();
            
             setTimeout(function(){
                    //모바일로 간주 
                    new daum.Postcode({
                        oncomplete: function(data) { 
                            CommPop.layerPopUpClose("popSearchAddrForm",data);
                        },
                        width : width ,
                        height : height,
                        maxSuggestItems : 5
                    }).embed(element_layer);                 
                 
             }, 500);           
        },
        
        /************************************************************************
        @함수명        : selectOfficePopForm
        @설 명        : 직장 주소 검색
        @사용법        : CommPop.selectOfficePopForm(callbackFunc) 호출
        @param  callbackFunc (type : function) : 검색 결과를 callback 받을 function

        수정일             수정자         수정내용
        -----------     ------      --------------
        
        ************************************************************************/
        selectOfficePopForm : function(callbackFunc){
             
            var url = "/comm/pop/selectOfficePopForm.nh";
            var id = "selectOfficePopForm";
            var formData = "";
            CommPop.layerPopup(id,url,formData,callbackFunc);
            
        },
        
        /************************************************************************
        @함수명        : selectHousePopForm
        @설 명        : 주택 정보 검색 (아파트)
        @사용법        : CommPop.selectHousePopForm(callbackFunc) 호출
        @param  callbackFunc (type : function) : 검색 결과를 callback 받을 function
        salesType : 매매가 구분 코드 : 00:보이게, 01:안보이게 

        수정일             수정자         수정내용
        -----------     ------      --------------
        
        ************************************************************************/
        selectHousePopForm : function(callbackFunc,salesType){          
            var url = "/comm/pop/selectHousePopForm.nh";
            var id = "selectHousePopForm";
            var formData = "salesType="+salesType;          
            CommPop.layerPopup(id,url,formData,callbackFunc);
            
        },
        
        /************************************************************************
        @함수명        : noLoanListPopForm
        @설 명        : 대출내역 불러오기 팝업 
        @사용법        : CommPop.noLoanListPopForm(callbackFunction) 호출
        @param  callbackFunction (type : function) : 검색 결과를 callback 받을 function

        수정일             수정자         수정내용
        -----------     ------      --------------
        
        ************************************************************************/
        noLoanListPopForm : function(callbackFunction){
            
            var url = "/comm/pop/noLoanListPopForm.nh";
            var id = "noLoanListPopForm";
            var formData = "";
            CommPop.layerPopup(id,url,formData,callbackFunction);
            
        },

        /************************************************************************
        @함수명        : goAppInfoForm
        @설 명        : 모바일 APP 안내 팝업 
        @사용법        : CommPop.goAppInfoForm(callback) 호출
        @param  callback (type : function) : 검색 결과를 callback 받을 function

        수정일             수정자         수정내용
        -----------     ------      --------------
        
         ************************************************************************/
        goAppInfoForm : function(callbackFunc){
            
            var url = "/comm/pop/goAppInfoForm.nh";
            var id = "goAppInfoForm";
            var formData = "";
            CommPop.layerPopup(id,url,formData,callbackFunc);
            
        },


        /************************************************************************
        @함수명        : needLoginPopForm
        @설 명        : 로그인 필요 팝업
        @사용법        : CommPop.needLoginPopForm(callbackFunction) 호출
        @param  callbackFunction (type : function) : 검색 결과를 callback 받을 function

        수정일             수정자         수정내용
        -----------     ------      --------------
        
        ************************************************************************/
        needLoginPopForm : function(callbackFunction){
            
            var url = "/comm/popu/loginNeed.nh";
            var id = "loginNeedId";
            var formData = "";
            CommPop.layerPopup(id, url, formData, callbackFunction);
            
        },

        /************************************************************************
        @함수명        : checkOcrInfoPopForm
        @설 명        : OCR 인증 팝업 호출
        @사용법        : CommPop.checkOcrInfoPopForm(callbackFunction) 호출
        @param  callbackFunction (type : function) : 검색 결과를 callback 받을 function

        수정일             수정자         수정내용
        -----------     ------      --------------
        
         ************************************************************************/
        checkOcrInfoPopForm : function(sendData, callbackFunction){
            
            var url = "/comm/idoc/OCRGuide.nh";
            var id = "MOCOMM12000001";
            var formData = sendData;
            CommPop.layerPopup(id, url, formData, callbackFunction);
            
        },

        /**
         * 사이드 메뉴 
         * CommPop.selectHousePopForm(콜백함수);
         */
        showMenuForm : function(){
            
            var url = "/nhcm/main/sideMenu.nh";
            var id = "sideMenuForm";
            var formData = "";
            CommPop.layerPopup(id,url,formData);
            
        },
        
        
        /************************************************************************
        @함수명        : prevUploadForm
        @설 명        : 지점 지도 표시 팝업 
        @사용법        : CommPop.prevUploadForm(callbackFunction) 호출
        @param mapLayerId   : 지도가 보여질 layerID
        @param name         : 지점 이름 
        @param addr1        : 주소 1
        @param addr2        : 주소 2 

        수정일             수정자         수정내용
        -----------     ------      --------------
        
        ************************************************************************/
        showMapBranch : function (mapLayerId,name,addr1,addr2){
            
            
            var showkakaoBranchMap = function (){ 
                 
                // 주소-좌표 변환 객체를 생성합니다
                var geocoder = new kakao.maps.services.Geocoder();
                
                // 주소로 좌표를 검색합니다
                geocoder.addressSearch(addr1, function(status, result) {
                                        
                    var mapContainer = document.getElementById(mapLayerId); // 지도를 표시할 div  
                    

                    mapOption = {
                        //center: new kakao.maps.LatLng(result.addr[0].lat, result.addr[0].lng), // 지도의 중심좌표
                        center: new kakao.maps.LatLng(status[0].address.y, status[0].address.x), // 지도의 중심좌표
                        level: 3 // 지도의 확대 레벨
                    };

                    // 지도를 생성합니다
                    var map = new kakao.maps.Map(mapContainer, mapOption);

                    // 정상적으로 검색이 완료됐으면
                    // if (status === kakao.maps.services.Status.OK) {
                    if (result === kakao.maps.services.Status.OK) {
                        //var coords = new kakao.maps.LatLng(result.addr[0].lat, result.addr[0].lng);
                        var coords = new kakao.maps.LatLng(status[0].address.y, status[0].address.x);

                        // 결과값으로 받은 위치를 마커로 표시합니다
                        var marker = new kakao.maps.Marker({
                            map: map,
                            position: coords
                        });

                        var infowindow = new kakao.maps.InfoWindow({
                            content: '<div style="padding:5px;">'+name+'</div>'
                        });

                        infowindow.open(map, marker);

                    }
                });
            }
            
            showkakaoBranchMap();
             
        },
        
        
        /**
         * 모바일 app 전용메뉴 안내
         * 모바일은 전체 팝업으로 보이고 
         * pc는 페이지 이동으로 보임
         *  goMobileExeclusiveMenu();
         */
         
        goMobileExeclusiveMenu : function(){
             
            var url = "/comm/msg/goMobileExeclusiveMenu.nh";            
            
            if("PW"== comm.channel){
                comm.goPage(url);
            }else{
                //모바일일 경우 
                var id = "goMobileExeclusiveMenu";
                var formData = "";
                
                CommPop.layerPopup(id,url,formData);    
            }
            
            
        },
        
        /**
         *  법인 이용 불가 안내
         * 모바일은 전체 팝업으로 보이고 
         * pc는 페이지 이동으로 보임 
         *  goBizUnavailableMenu(콜백함수);
         */
         
        goBizUnavailableMenu : function(){
             
            var url = "/comm/msg/goBizUnavailableMenu.nh";
            
            if("PW"== comm.channel){
                comm.goPage(url);
            }else{
                //모바일일 경우 
                var id = "MOCOMM25000002";
                var formData = "";
                CommPop.layerPopup(id,url,formData);    
            }
            
            
        },
        
        /*
         * 로그인알림창으로 이동 
         */
        goLoginNotiPage : function (nextUrl){
            // 로그인이 필요한 화면 레이어 팝업 출력
            var url = '/comm/msg/goLoginNotice.nh?nextUrl=' + nextUrl;
            var id = 'goLoginPageDiv';
            CommPop.layerPopup(id, url);
        },
        /**
         * 은행 리스트를 가져옵니다. 
         */
        getBankList : function (callbackFun){

            var url = '/comm/pop/getBankList.nh';           
            var id = 'commbanklist';
            var formData = "";
            
            CommPop.layerPopup(id,url,formData,callbackFun);
        },
        ///////////////////////////////////////////////////////////////////////
        /**
         *  레이어 팝업에서 사용할 callbackFun을 저장 합니다. 
         * layerId : 그려질 화면 영역 아이디 
          * callbackFun : callback 함수 
         */
        
        saveCallbackFun : function(layerId,callbackFun){
            //callback 함수 타입이 function 이 아니면 리턴
            if((callbackFun != "")&&(!comm.isNull(callbackFun))){
            
                if((typeof callbackFun) !="function"){
                    alert("callbackFun type : "+(typeof callbackFun));
                    return ;
                }
            }
            
            //callback 함수 저장  
            window.callbackFun[layerId] = callbackFun;
        },
        
        /** 
         * layerId : 그려질 화면 영역 아이디 
         * url : 호출 url
         * formData : 전송할 데이타 
         * callbackFun : callback 함수
         *ex 
         * var url = "/comm/pop/selectOfficePopForm.nh";
         * var id = "selectOfficePopForm";
         * var formData = "";
         * CommPop.layerPopup(id,url,formData,callbackFun); 
         */
        layerPopup :  function(layerId,url,formData,callbackFun){
        	if(comm.channel == "MW" || comm.channel == "MA"){
				setFocusArea();
			}
			
            //callbackFun 저장 
            CommPop.saveCallbackFun(layerId,callbackFun);
            //화면 내용을 가져옴
            CommPop.callLayerPopFunc(url, formData,function(data){
                //실제 화면 그리기 
                CommPop.layerPopupInit(layerId,data);
                
            }); 
        },  

        /************************************************************************
        @함수명        : layerPopupInit
        @설 명        : 레이어 팝업 생성 
        @사용법        : CommPop.layerPopupInit(layerId,innerHtml,callbackFun) 호출
        @param layerId      : 그려질 화면 영역 아이디 
        @param innerHtml    : html소스
        @param callbackFun  : callback 함수

        수정일             수정자         수정내용
        -----------     ------      --------------
        
        ************************************************************************/
        //popHistory : [],
        layerPopupInit : function (layerId,innerHtml,callbackFun){
            
            var divAddId = "div_"+layerId;
            
            if($("#layoutPopContent").find("#"+divAddId).length > 0){
                popupFunc('#' +layerId).remove();
                $("#"+divAddId).remove();
            }
            
            var divAdd  ="<div id='"+divAddId+"'></div>";
            
            $("#layoutPopContent").append(divAdd);
            $("#"+divAddId).append(innerHtml);
            
            CommPop.layerPopUpOpen(layerId);
            
            if((typeof callbackFun) !="undefined"){
                callbackFun();  
            }
            
            //앱에서 팝업이 열리면 뒤로가기 비활성화
            if(comm.channel == "MA"){
            	comm.callNativeBackButton("N");
            }
            
            /*팝업에서 뒤로가기 실행시 화면이동이 아닌 팝업close
            if(comm.channel != "PW"){
                
                //히스토리 생성
                window.history.pushState({}, "layerPop", layerId);
                popHistory.push(layerId)
                
                //닫기 버튼 클릭시
                $("div.popup_header button.btn_modal_close").off("click").on("click",function(){
                    window.history.back();
                });
                
                //히스토리 백 이밴트 실행
                window.onpopstate = history.onpushstate = function(event) {
                    var hisLayerId = popHistory[popHistory.length-1]; // 배열의 마지막에 열었던 ID 값
                    CommPop.layerPopUpClose(hisLayerId,{"event":"back"}); // 현재의 모달을 닫는다.
                }
            }
             */
        },
 
        /************************************************************************
        @함수명        : callLayerPopFunc
        @설 명        : 레이어 팝업 내용 추가 
        @사용법        : CommPop.callLayerPopFunc(url, sendData,callbackSuccFunc) 호출
        @param url              : 화면 url 
        @param sendData         : 전달 데이터
        @param callbackSuccFunc (type : function): callback 함수

        수정일             수정자         수정내용
        -----------     ------      --------------
        
        ************************************************************************/
        callLayerPopFunc:function(url, sendData,callbackSuccFunc){
            sendData = comm.nvl(sendData);
            
            $.ajax({
                type:'POST',
                //dataType : "json",
                contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
                url:url,
                data:sendData,
                beforeSend:function(xhr){
                	comm.showLoading();
                    xhr.setRequestHeader("PAGE_TYPE","POP");
                },
                success:function(data){
                    //팝업 생성시 오류가 발생하면 아래 오류 메시지를 보여준다 
                    if(data.indexOf('<div class="error_area">') >0){
                        CommMsg.alert("에러:[서버 통신 상태가 원할하지 않습니다.\n잠시 후 다시 접속해주세요]"); 
                    }else{
                        callbackSuccFunc(data); 
                    }
                    
                },
                complete:function(){
                    
                    comm.hideLoading();
                },
                error:function (data, textStatus) {             
                    CommMsg.alert("에러:[서버 통신 상태가 원할하지 않습니다.\n잠시 후 다시 접속해주세요]"); 
                    //callbackFailFunc(data);
                }
            });
        }
        ,
        
        // 2024.10.10 24Hour/365Day 구축 프로젝트. 이상봉. 전자약정 streamDocs 적용 start
        STREAMDOCS_INFO : {
        	"/agree/new_comm_pop_agree05.html"        : "vpSKucb2_BgO89wSDtfRXUqQ8Eg1kVpH3VIekN8Mm4E",       // [필수] 개인(신용)정보 필수적 동의서_리테일 요약
        	"/agree/new_comm_pop_agree05_01.html"     : "B4laIv0peRgK7iNTYDCZ03PdBwyEbLfpHNegru_qYYs",       // 개인(신용)정보의 수집/이용 동의서 요약
        	"/agree/new_comm_pop_agree05_02.html"     : "prHk8x266yRisSL0W78jDJiLHNOe5LTOqc0RiHpSrnY",       // 개인(신용)정보 조회 동의서 요약
        	"/agree/new_comm_pop_agree05_03.html"     : "mum-_a-vzeR0BQcjpM63hdgyNuwVRjJhAUkuvw1_cMw",       // 개인(신용)정보의 제공 동의서 요약
        	"/agree/new_comm_pop_agree06.html"        : "9qyFExjyEy1Y31hy6OAAO6LAcX6Y8rPMcdg4-gQXOAk",       // [필수] 개인(신용)정보 필수적 동의서_리테일 전체
        	"/agree/new_comm_pop_agree06_01.html"     : "nqZ6Uq8JpgzG5xaxJiGXe9hCFWEPYufHZLjmiFHZR3s",       // 개인(신용)정보의 수집/이용 동의서 전체
        	"/agree/new_comm_pop_agree06_02.html"     : "Sq6sOhu4S8mpV3s3ppOxFI6x0XsE_wIw_9sOp1JgDUI",       // 개인(신용)정보 조회 동의서 전체
        	"/agree/new_comm_pop_agree06_03.html"     : "O7e-hoTd5Z8GOwJhflU6Aqu0PD10m7_NkyAEL7IJ8wc",       // 개인(신용)정보의 제공 동의서 전체
        	"/agree/new_comm_pop_agree08.html"        : "QiyDrUDHAHEjm4xG4j89FpldPu91Sb_w0CvK6BUUwMo",       // [필수] 개인(신용)정보 필수적 동의서 요약
        	"/agree/new_comm_pop_agree08_01.html"     : "e0o2YputaTHzSA-ilY34fVtebEBBy1JJyNhDXI72a7o",       // 개인(신용)정보의 수집/이용 동의서 요약
        	"/agree/new_comm_pop_agree08_02.html"     : "Nt9G-DyuZpq8iB22S8wb_3jk_68-0vaPgEEhsFuUvJY",       // 개인(신용)정보 조회 동의서 요약
        	"/agree/new_comm_pop_agree08_03.html"     : "HzY7eA0C8dMSY0FGsaZVS-Vrtia7KJGSKfXGcXWOgQI",       // 개인(신용)정보의 제공 동의서 요약
        	"/agree/new_comm_pop_agree07.html"        : "_sn6t6Io351R5rvIixG7pTnyvUSeImBnLzIVkfRkoxo",       // [필수] 개인(신용)정보 필수적 동의서 전체
        	"/agree/new_comm_pop_agree07_01.html"     : "WcWwnaEd6L4o_1QjFd5S6eT2nLA7xESIYtjGG0rhUQk",       // 개인(신용)정보의 수집/이용 동의서 전체
        	"/agree/new_comm_pop_agree07_02.html"     : "e-nN9G2KSquwR3emYyTtdbEsSQAtcueyxW2wGn9jN_Q",       // 개인(신용)정보 조회 동의서 전체
        	"/agree/new_comm_pop_agree07_03.html"     : "-ZvS9Bic1QoEhvlIVfCbY8C3Qq4mj70orOZJeiOLtgU",       // 개인(신용)정보의 제공 동의서 전체
        	"/agree/comm_pop_agree61_summary.html"    : "FjHolicmhx7hw_SmdJm0bLz7DEfV0dLDOtFggj9oo-0",       // [필수] 공공마이데이터 개인(신용) 정보조회 필수적 동의서 요약
        	"/agree/comm_pop_agree61_summary_01.html" : "_z3OXZV0SMBcNlxaM3f1nI9YBX_UoYW5mmwK-nleATs",       // 개인(신용)정보의 수집/이용 동의서 요약
        	"/agree/comm_pop_agree61_summary_02.html" : "6DuCK5EeIKop7azIhkW1gPploY4J1kQweNjI4vrcSeU",       // 개인(신용)정보 제공 동의서 요약
        	"/agree/comm_pop_agree61_summary_03.html" : "hGS1kzrSUt6Z9k8fHnEe8TDPvKDsnEUVObyCb1Rw_Cc",       // 제 3자 제공 및 행정정보 제3자 제공 여부에 관한 사항 요약
        	"/agree/comm_pop_agree61.html"            : "sNjfG7yCIArijYdsiAGDWK9Bih4RL-_-I-A6nyTTv8M",       // [필수] 공공마이데이터 개인(신용) 정보조회 필수적 동의서 전체
        	"/agree/comm_pop_agree61_01.html"         : "H9J2ZtR_wJpRDNaUMsLCBf8neBQn48Gzbl7sST62jDI",       // 개인(신용)정보의 수집/이용 동의서 전체
        	"/agree/comm_pop_agree61_02.html"         : "VrkB9t-IwBtxa-4hJKoI2rk1ueXjgxYsIWkCfpyrOU4",       // 개인(신용)정보 제공 동의서 전체
        	"/agree/comm_pop_agree61_03.html"         : "FtOGIe7BFBs-6WyCwERol5n2OWjBzFlU6je2V9ACeU0",       // 제 3자 제공 및 행정정보 제3자 제공 여부에 관한 사항 전체
        	"/agree/new_comm_pop_agree11.html"        : "pY1jcRBH0dnoRc249Cduzuul8X1GdrzYF1EXEECmCME",       // 개인(신용)정보의 수집/이용 동의서
        	"/agree/new_comm_pop_agree12.html"        : "1yCe3-R_pkU5VwnD7Ygg0zlU2pWPhfRtVQAbfLrE2_o",       // 개인(신용)정보의 제공 동의서
        	"/agree/new_comm_pop_agree13.html"        : "aXFfG4NGKMIRHkgY8ehbutx87brFOb9GD8HJYRbn8R0",       // 개인(신용)정보의 수집/이용 동의서
        	"/agree/new_comm_pop_agree14.html"        : "mVdM7AL0FtTohglzC9N5-QB0nQ7rEF5pDn-Qt2mi8OY",       // 개인(신용)정보의 제공 동의서
        		
        	// 휴대폰 약관
        	"/agree/comm_pop_agree37.html"            : "yeRMk6mPbxeE_tzETA8WA3KKHHVt_FEdEmwRjEgVY0E", // 개인정보수집·이용활용 동의
        	"/agree/comm_pop_agree39.html"            : "jOb02IxvlU5fZ-YhTvOymLcbuA9Q32xEUhO6_Px3D6g", // 본인확인 이용약관 동의
        	"/agree/comm_pop_agree38.html"            : "oCl07E_bhvsr7oNr2zjQiuu-Xj9rxtYjx8v4B80k9is", // 고유식별번호처리 동의
        	"/agree/comm_pop_agree40.html"            : "m_NLjkSI1DS2NbD5fLeDdaeN3UDj3tfDXGyS_M1WwQA",  // (통신사)본인확인 이용약관 동의
        	
        	// 전화상담
        	"/agree/comm_pop_agree29.html"            : "hR8IY96IDFV4CGWWQD-lItAoFK8uD1zPZ5U11KpsQfE", // (필수) 개인(신용)정보 이용동의
        	
        	// 민원
        	"/agree/cust_pop_agree02.html"            : "orwIKUlugRJsp4GZBuLX_Z9GKIcu6_eq4RtZKrdgWMc", // [필수] 개인정보, 수집, 이용 동의
        	
        	// 개인신용대출
        	"/agree/comm_pop_agree05.html"            : "DoZQz6NAb7bFSV-CE7vhDKZGqK73GNd8nUnyGn2pEVY", // 신용정보 제공 활용에 대한 고객권리 안내문
        	"/agree/comm_pop_agree06.html"            : "KpPt-OF05Lch-8vtY9ibCawkbv7BJuTjM5haXXeV9VM", // 개인신용대출 약관
        	"/agree/comm_pop_agree07.html"            : "SOZMV1OmjV4zWY12xJ2SlepVEthvL9Ic5aGtyHe8sv4", // 여신거래 기본약관
        	"/agree/comm_pop_agree31.html"            : "OKd9ZyFd-H4ZovfBW2FXnAiS6BXnkMWx3Fmpsj-jvZc", // 전자금융거래기본약관
        	"/agree/comm_pop_agree08.html"            : "oGWST-oztkwBbpOKg69uH72hYld7o1t2VKWz40GhrQ0", // 자동이체 이용약관
        	"/agree/comm_pop_agree09.html"            : "qsDjPC1etBtpIzpcdIbT7Wv4U_71DB_wAPRcTmNruBk", // 고객정보 취급방침
        	"/agree/comm_pop_agree53.html"            : "1mURO3dvH85Yv5xqZPHlkFmcQfbYGjZudx3L_j1EKf0", // 금리인하요구권안내
        	"/agree/comm_pop_agree41.html"            : "pXhDKh_dN27Zf3xAJWPj9NE7A_PaIzksSU2mXEfp3sA", // 실제소유자 확인서
        	"/agree/comm_pop_agree57.html"            : "lbaCNhdlxI7DrxEkh7v7bBywfL_JvJA7rKYiylHZsaQ", // 추가약정서
        	"/agree/comm_pop_agree58.html"            : "h9NQmMxb8ZjvuSlt4F13lT2lrx4irPRpQDBkTOEXCI8", // 국토교통부 주택소유확인 시스템 이용 관련 개인신용정보 수집 이용 제공 동의서
        	"/agree/comm_pop_agree59.html"            : "wz64p702XhVmEkkbgbpe_MJpcbii4DL72b5t8L2e3Z8", // 개인(신용)정보 제공에 대한 사항
        	"/agree/comm_pop_agree55.html"            : "dFV5m_ILlkZa_nYe58kaBoySpNnum1wM442JCbhmn90", // 개인정보 수집·이용에 관한 사항
        	"/agree/comm_pop_agree56.html"            : "AiBoB4NYY7rlDMR1w_Yk2ZVz5WUOmdHAqXBlRhMjhwQ",  // 고유식별정보 처리 동의에 관한 사항
        	
        	// 스탁론
    		"/agree/comm_pop_agree30.html"            : "_GN4c9RCUSnQWl59jL_Udh7zqa1ppz-4DlBNGYm7-ko", // [필수] 여신거래기본약관
        	"/agree/comm_pop_agree45.html"            : "3XWZMUviFpL-aJr2zJVQehpTx2tOBKylcWAzEpItbrw", // [필수] 주식매입자금대출약관
        	// "/agree/comm_pop_agree31.html"         : "8Oj6p8bQR06f3pSLgU92lrfMdm4z06bdT-RbYk14kzg", // [필수] 전자금융거래기본약관
        	// "/agree/comm_pop_agree08.html"         : "6s6rR8NwK_2KLVZ9R18iaKvtzucE2Ndv19g3Q6a8wV8", // [필수] 자동이체 이용약관
        	// "/agree/comm_pop_agree09.html"         : "sUXKvVAoJSniGVigLOgSTFSIv7P-zMyi_dboDUp3u3Q", // [필수] 고객정보 취급방침
        	"/agree/comm_pop_agree32.html"            : "NAqbj4Uc05GKw4MFrWBhXdoPkn9Azk8TFnt6-ftBnso", // [필수] 근질권 설정 계약서
        	"/agree/comm_pop_agree33.html"            : "JNcmSbQbBB2sYuYuhgmll5j8UYHd5fiiS5LKkSVRfTI", // [필수] 근질권 확인 및 승락(의뢰)서
        	"/agree/new_comm_pop_agree04.html"        : "3GJXimn4x6qMtWDJU_vDtcKeeQCGtVosOH61BZqtkfc", // [선택] 만기일 자동연장 신청서
        	
        	// 신차
        	"/agree/comm_pop_agree16.html"            : "80aib4OJZlrNno2OflFEXAeJ0QG2aarB46OjuIsHMGo", // [필수] 여신거래기본약관
        	"/agree/comm_pop_agree20.html"            : "LIuBSW9JBkkKhpG--43evbtytnZKdhWsawjRV5Sy9ds", // [필수] 고객정보 취급방침
        	// "/agree/comm_pop_agree31.html"         : "LQUial77ju8l0wWwHnXZcUiCzzmKGPE_bVqP3_haDaY", // [필수] 전자금융거래기본약관
        	"/agree/comm_pop_agree47.html"            : "HEe0Lq794lmBRPERko3oJwcZ1hscqWn2qp6y8s1avdc", // [필수] 오토론 대출약관
        	"/agree/comm_pop_agree19.html"            : "ggKA_ykjbGYuGOH_TIKaTfyaPvXL1Cvnae6dmDFI_qk", // [필수] 근저당 설정 계약서
        	"/agree/comm_pop_agree21.html"            : "2VgjKSgTiKIIy7iPyFmaAFzpcQmAZ4gdujw3kUvomec", // [필수] 대출금 지급 관련 특약사항
        	"/agree/comm_pop_agree25.html"            : "_reDW057s8aTBzqFbcbXxqhb4TUx0ZtrW0MQAf5ZzuY", // [필수] 신용정보 제공 활용에 대한 고객권리 안내문
        	"/agree/comm_pop_agree48.html"            : "0JR8Et3c0bszj_pQg0c2WVLNd5c-z9OFifbs-P2PXyo", // [필수] 신용공여/자금세탁방지
        	"/agree/comm_pop_agree49.html"            : "J5vcWXkYagtatnHCoMxD2f6hM_htENYhg3Wugpc0P6c", // [필수] 금리인하요구권 안내
        	"/agree/comm_pop_agree50.html"            : "0WbTIIZwu43UvdO2a4d2Q1iQQTdi-J8FCxBokIiHgCU", // [필수] 할부거래법상 철회, 항변권 적용여부 설명서
        	"/agree/comm_pop_agree18.html"            : "i7gx15A9A3kcxTr4AT0U3EDBh4m9q6UPdauzAK_qKNY", // [필수] 자동이체 신청ㆍ변경동의서
        	
        	// 자동차금융(리스)
        	// "/agree/comm_pop_agree16.html"         : "2nAxGGCEJkyMQyIZ1NZvv0K0SNzymdWIAOWP4dpLJ4o",  // [필수] 여신거래 기본약관 // 동일한 문서 있음
        	"/agree/comm_pop_agree44.html"            : "i7gx15A9A3kcxTr4AT0U3EDBh4m9q6UPdauzAK_qKNY",  // [필수] 자동차리스 표준약관
        	"/agree/new_comm_pop_agree01.html"        : "H3OeikJO6n9MHnWJdLXEXDCCQ0rKFpSMovH3vQzWxvY",  // [필수] 구속성행위 관련 고객확인서
        	
        	// 자동차금융(장기렌터카)
        	//"/agree/comm_pop_agree07.html"          : "e1kYIE36IXCjgxq4aGHrKbw9qDV46iEYh0B4SdA83-4",  // [필수] 여신거래 기본약관 // 동일한 문서 있음
        	"/agree/comm_pop_agree54.html"            : "ootW7nfH0UIMt44GN_f3o3FuJf8enUFbXK2QEMyxCKU",  // [필수] 장기렌터카 약관
        	"/agree/new_comm_pop_agree02.html"        : "bhzGvuFqn49Jb63lPJW5xrjzQlu7DTdoQGcBRiiOCMc",  // [필수] 세금계산서 발행 개인(신용)정보 필수적 동의서
        	
        	// 자동차금융(장기렌터카) 랜딩페이지 약관
        	"/agree/new_comm_pop_agree21.html"        : "2r_QfYvqqXaj3RwrXTSpNK8zF3wpsMSB04LTY4p2D28", // [필수] 개인(신용)정보 필수적 요약 동의서_렌터카
        	"/agree/new_comm_pop_agree21_01.html"     : "LrCbqmu-zjTjQVWnoMtpQaLk5p_usuMzeOR5MXKv2V0", // [개인(신용)정보 조회 요약동의서
        	"/agree/new_comm_pop_agree21_02.html"     : "06LPLgIqQM_W3eZXdxT-Di86jogPLinr5gafHXEHahw", // 개인(신용)정보의 제공 요약동의서
        	"/agree/new_comm_pop_agree21_03.html"     : "QxnI5vefboP43BkNm9eMEo7ONoaeFzRxaaYqzdou1o0", // [필수] 개인(신용)정보 필수적 요약 동의서_렌터카
        	"/agree/new_comm_pop_agree20.html"        : "TWgPiGQha9ZQ0Uyzk2hk64lNe_TpI8eAwwgIAE1lzww", // 개인(신용)정보 조회 요약동의서
        	"/agree/new_comm_pop_agree20_01.html"     : "0lZQ0BPaKVJZ5X_zC0BkfPZ8TtUZrg9_8a6VH-QWQEc", // 개인(신용)정보 조회 요약동의서
        	"/agree/new_comm_pop_agree20_02.html"     : "_gh_Gun1W-39wRnzfRXBudl5TxR6y43rQdoAdpJSLBI", // 개인(신용)정보 조회 요약동의서
        	"/agree/new_comm_pop_agree20_03.html"     : "8-LJS_OtiAaEnZBZ6sF_wLYEX5lOIsQzc_6lIGF-pes", // 개인(신용)정보 조회 요약동의서
        },
        // 2024.10.10 24Hour/365Day 구축 프로젝트. 이상봉. 전자약정 streamDocs 적용 end
        /************************************************************************
        @함수명        : showAgreeTermsDetail
        @설 명        : 약관 상세화면 표시
        @사용법        : CommPop.showAgreeTermsDetail(title, url, callbackFunc) 호출
        @param  title (type : string) : 약관상세 타이틀
        @param  url (type : string) : 약관 url
        @param  callbackFunc (type : function) : 검색 결과를 callback 받을 function, btnText

        수정일             수정자         수정내용
        -----------     ------      --------------
        
        ************************************************************************/
        showAgreeTermsDetail : function(title, agreeUrl, callbackFunc, btnText) {
        	var url = "/comm/pop/agreeTermsDetailPopForm.nh";
            var id = "agreeTermsLayer";
            var formData = "agreeTermTile=" + encodeURIComponent(title) +"&agreeTermUrl=" + agreeUrl;

            // 2024.10.25 24Hour/365Day 구축 프로젝트. 이상봉. streamDocs에 등록된 약관은 streamDocs로 실행 start
            const streamdocsId = CommPop.STREAMDOCS_INFO[agreeUrl];
            
        	if (streamdocsId != undefined && streamdocsId != null && streamdocsId != "") {
        		url      = "/comm/pop/agreeTermsDetailStreamDoc.nh";
            	id       = "agreeTermsStreamDocsLayer";
            	formData = "agreeTermTile=" + encodeURIComponent(title) +"&agreeTermUrl=" + streamdocsId;
        	}
        	// 2024.10.25 24Hour/365Day 구축 프로젝트. 이상봉. streamDocs에 등록된 약관은 streamDocs로 실행 end
			
            if(!comm.isEmpty(btnText)){
                formData += ("&btnText=" + btnText);
            }
            
        	CommPop.layerPopup(id,url,formData,callbackFunc);
        },
        
        /************************************************************************
        @함수명        : showTermsStreamDosc
        @설 명        : pdf steamDocs View
        @사용법        : CommPop.showAgreeTermsDetail(title, url, callbackFunc) 호출
        @param  title (type : string) : 약관상세 타이틀
        @param  url (type : string) : 약관 url
        @param  callbackFunc (type : function) : 검색 결과를 callback 받을 function, btnText

        수정일             수정자         수정내용
        -----------     ------      --------------
        
        ************************************************************************/
        showTermsStreamDosc : function(title, agreeUrl, callbackFunc, btnText){
        	const url      = "/comm/pop/agreeTermsDetailStreamDoc.nh";
            const id       = "agreeTermsLayer";
            const formData = "agreeTermTile=" + encodeURIComponent(title) +"&agreeTermUrl=" + agreeUrl;
            
            if(!comm.isEmpty(btnText)){
                formData += ("&btnText=" + btnText);
            }
            
            CommPop.layerPopup(id, url, formData, callbackFunc);
        },
        
        /*
         * layerPopUp을 보여줍니다
         */
        layerPopUpOpen : function(layerId){
            
            var chkPopId = layerId.split("_");
            if(chkPopId[0] == "mainMarketingPopForm"){
                marketingPopupShow('#'+layerId);
            } else if(chkPopId[0] == "MANHCM00000000_03" || chkPopId[0] ==  "MANHCM00000000_01"){
                marketingPopupFunc('#'+layerId).show();;
            } else {
                popupFunc('#'+layerId).show(); 
            }
            
            
            
            //닫기 버튼 누를 경우 해당 parents layer 삭제하기 추가 
            $(".btn_modal_close").on("click",function(){
                
                //추가한 레이어를 삭제 합니다 .
                setTimeout(function(){

                    $.each(window.callbackFun,function(layerId,callbackFun){
                        
                        if($("#div_"+layerId).find(".modal_popup").length == 0 ){
//                            popupFunc('#div_'+layerId).remove();
                            delete window.callbackFun[layerId];
                            
				            //앱에서 팝업이 닫히면 뒤로가기 활성화
                            if(comm.channel == "MA"){
                            	comm.callNativeBackButton("Y");
                            }
                        }
                        
                    })  
                    
					if(comm.channel == "MW" || comm.channel == "MA"){
						getFocusArea();
					}
                },500);
                
            });
            
        },
        
        /*
         * layerPopUp을 닫습니다.
         */     
        layerPopUpClose : function(layerId,param){

            if((typeof window.callbackFun[layerId]) == "function"){
                window.callbackFun[layerId](param);
                delete window.callbackFun[layerId];
            }
            
            var divAddId = "div_"+layerId;
            
            if($("#layoutPopContent").find("#"+divAddId).length > 0){
                popupFunc('#' +layerId).remove();
                $("#"+divAddId).remove();
            }
            
            //앱에서 팝업이 닫히면 뒤로가기 활성화
            if(comm.channel == "MA"){
            	comm.callNativeBackButton("Y");
            }
			
            if(comm.channel == "MW" || comm.channel == "MA"){
				getFocusArea();
			}
        } , 
        
        /*
         * 해당 function은 아무작업도 하지 않은 function 입니다 
         */
        layerPopUpEmpty : function (){
            
        },
        
        /**
         * 로그인 유도 popup 함수
         */    
        fn_logn_encr_signup : function(param) {
        	let popId = "encourageSignupPop";
        	
        	if (comm.channel == "PW"){
        		popId = "PWCOMM16000003";
 			}
        	
        	const url = "/login/signup/encourageSignupPop.nh";
    		
        	CommPop.layerPopup(popId, url, param);
        }
}