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
        showAgreeTermsDetail : function(title, agreeUrl, callbackFunc, btnText){
            var url = "/comm/pop/agreeTermsDetailPopForm.nh";
            var id = "agreeTermsLayer";
            var formData = "agreeTermTile=" + encodeURIComponent(title) +"&agreeTermUrl=" + agreeUrl;
            if(!comm.isEmpty(btnText)){
                formData += ("&btnText=" + btnText);
            }
            CommPop.layerPopup(id,url,formData,callbackFunc);
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
            
        } 
        
}