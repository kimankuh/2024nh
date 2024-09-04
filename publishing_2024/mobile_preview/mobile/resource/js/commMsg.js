/********************************************************
파일명 	: messageAlert.js
설 명  	: layer alert,confirm 등을 보여줍니다.

수정일 		수정자 명 		Version 	Function
-------	 -------- 	---------- --------------
2024-03-14	송재연	A11Y 모바일 시간연장 id 및 role='text' 추가
*********************************************************/
var CommMsg = {

		/**
		 * Basic confirm Message Box를 화면에 출력합니다.
		 *
		 * @param {String} messag ,  callbackFun, option
		 * option.nextUrl : 이동 페이지
		 * callbackFun를 우선순위로 실행을 하고 callbackFun이 없을 경우
		 * option.nextUrl로 이동을 합니다.
		 *
		 */

		confirm : function (message, callbackFun, option) {

			if(comm.isNull(option)){
				option = new Object();
			}

			//pc confirm
			if(comm.channel == "PW"){

				CommMsg.pConfirm(message,callbackFun,option);

			/* mobile confirm 메세지 표시
			 * msg : 화면에 표시할 메세지
			 * callbackFnc : callback function
			 * option : icon    : 아이콘 추가
			 *          addText : 추가문구
			 *          btnLTxt : 왼쪽 버튼 문구
			 *          btnRTxt : 오른쪽 버튼 문구
			 */
			} else{
				CommMsg.mConfirm(message,callbackFun, option);
			}
		},

		/**
		 * Basic Alert Message Box를 화면에 출력합니다.
		 *
		 * @param {String} messag ,  callbackFun, option
		 * option.nextUrl :이동 페이지
		 * option.okBtnNm :확인버튼 이름 기본이 '확인'
		 * option.canBtnNm :취소버튼 이름 기본이 '취소'
		 */

		alert : function (message, callbackFun, option) {

			if(comm.isNull(option)){
				option = new Object();
			}

			//pc confirm
			if(comm.channel == "PW"){
				CommMsg.pAlert(message,callbackFun,option);
			//mobile confirm
			} else{
				CommMsg.mAlert(message,callbackFun, option);
			}
		},

		showModalPopUp : function (option,innerHtml){

			//alert,config 창 중복 제거
			if($(".comm_msg_layer_class").length>0){
				$(".comm_msg_layer_class").remove();
			}

			$("#layoutBody").append(innerHtml);

			//취소 이벤트
			$("#btn_cancle").on("click",function(){


				popupFunc('#alertDialogHtml').remove();

				if( (!comm.isNull(option.callback)) && (option.callback !="")){

					if(typeof option.callback == "function"){
						option.callback(false);
					}else{
						if((typeof option.callback) != "undefined"){
							alert("callbackfun type["+(typeof option.callback)+"]");
						}

					}
				}


			})

			//확인 이벤트
			$("#btn_ok").on("click",function(){

				popupFunc('#alertDialogHtml').remove();

				if( (!comm.isNull(option.callback)) && (option.callback !="")){

					if(typeof option.callback == "function"){
						option.callback(true);

					}else{
						if((typeof option.callback) != "undefined"){
							alert("callbackfun type["+(typeof option.callback)+"]");
						}
					}
				}else{
					if( !comm.isNull(option.nextUrl)){
						comm.goPage(option.nextUrl);
					}
				}





			})


			CommPop.layerPopUpOpen("alertDialogHtml");

		},

		getNonTitleDialogHTML : function (options) {
			var strHTML = '';

			//아이콘 클래스 정의
			var iconClass = ""
			if(options.icon == "complete"){
				iconClass = "icon_complete";
			} else if(options.icon == "fail"){
				iconClass = "icon_fail";
			}

			strHTML += '<div id="alertDialogHtml"  class="modal_popup ty_alert comm_msg_layer_class"><!-- 노출 className = show -->							 ';
			strHTML += '	<div class="popup_layout"><!-- 크기지정 : style=" width: **px; height: **px" -->					  ';
			strHTML += '																										';
			strHTML += '		<div class="popup_inner">																		';
			strHTML += '			<div class="popup_body">																		';
			strHTML += '				<div class="popup_container">															   ';
			strHTML += '																										  ';
			strHTML += '					<div class="alert_title_part">														  ';

			if("" !=iconClass){
				///아이콘 관련
				strHTML += '						<div class="icon_box">														  ';
				strHTML += '							<span class="ebicon '+iconClass+'"></span>								  ';
				strHTML += '						</div">														  ';
				///아이콘 관련
			}

			strHTML += '						<p class="title">'+options.message+'</p>												   ';
			strHTML += '					</div>																				  ';
			strHTML += '																										  ';
			strHTML += '					<div class="alert_text_part">														 ';
			strHTML += '						<p>'+options.detail+'</p>										  ';
			strHTML += '					</div>																				  ';
			strHTML += '																										  ';
			strHTML += '				</div>																					  ';
			strHTML += '			</div>																						  ';
			strHTML += '																										  ';

			if(options.showBtn == true){
				strHTML += '			<div class="popup_footer">																	  ';
				strHTML += '				<div class="popup_footer_area">															 ';

				if("ok"==options.secondBtn){
					strHTML += '					<button type="button" class="ebbtn btn_cancel" id="btn_cancle">'+options.canBtnNm+'</button>		  ';
				}
				if("ok"==options.firstBtn){
					strHTML += '					<button type="button" class="ebbtn btn_confirm" id="btn_ok">'+options.okBtnNm+'</button>		 ';
				}

				strHTML += '				</div>																					  ';
				strHTML += '			</div>																						  ';
			}

			strHTML += '		</div>																							  ';
			strHTML += '																										  ';
			strHTML += '	</div>																								  ';
			strHTML += '</div>																									';


			return strHTML;
		},

		getTitleDialogHTML : function (options) {
			var strHTML = '';


			//아이콘 클래스 정의
			var iconClass = ""
			if(options.icon == "complete"){
				iconClass = "icon_complete_light";
			} else if(options.icon == "fail"){
				iconClass = "icon_fail";
			}


			strHTML += '<div id="alertDialogHtml" class="modal_popup"><!-- 노출 className = show -->';
			strHTML += '					<div class="popup_layout" style="width: 500px;"><!-- 크기지정 : style=" width: **px; height: **px" -->';
			strHTML += '						<div class="popup_inner">';
			strHTML += '				';
			strHTML += '				            <div class="popup_header ty_border">';
			strHTML += '				                <h3 class="ebtitle3">'+options.title+'</h3>';
			if(options.showModalClose !== "N") {
				
			strHTML += '				                <button type="button" class="ebbtn btn_modal_close" title="팝업닫기" data-action="remove"></button>';
			
			}
			strHTML += '				            </div>';
			strHTML += '				';
			strHTML += '							<div class="popup_body">';
			strHTML += '								<div class="popup_container">';
			strHTML += '				';
			strHTML += '				                    <div class="process_end_part">';

			if("" !=iconClass){
				strHTML += '				                        <div class="icon_box">';
				strHTML += '				                            <span class="ebicon '+iconClass+'"></span>';
				strHTML += '				                        </div>';
			}

			strHTML += '				                        <div class="title_box">';
			strHTML += '				                            <div class="title">'+options.message+'</div>';
			strHTML += '				                        </div>';

			strHTML += '										<div class="conts_box">';
			strHTML += '											<div class="desc_box">';
			strHTML += '												<p>'+options.detail+'</p>';
			strHTML += '											</div>';

			if("" !=options.detail2){

				strHTML += '											<div class="item_box">';
				strHTML += '												<div class="bullet_pack">';
				strHTML += '													<ul class="ebullet_circle">';
				strHTML += '														<li>'+options.detail2+'</li>';
				strHTML += '													</ul>';
				strHTML += '												</div>';
				strHTML += '											</div>';
			}


			strHTML += '										</div>';
			strHTML += '				                    </div>';
			strHTML += '				';
			strHTML += '								</div>';
			strHTML += '							</div>';
			strHTML += '				';
			if(options.showBtn == true){

				strHTML += '							<div class="popup_footer">';
				strHTML += '								<div class="popup_footer_area">';

				strHTML += '				';
				strHTML += '									<div class="btn_box">';
				if("ok"==options.secondBtn){
					strHTML += '				                        <div class="box_l">';
					strHTML += '											<button type="button" class="ebbtn btn_main ty_light" id="btn_cancle" >'+options.canBtnNm+'</button>';
					strHTML += '				                        </div>';
				}

				if("ok"==options.firstBtn){

					strHTML += '				                        <div class="box_r">';
					strHTML += '											<button type="button" class="ebbtn btn_main ty_bg"  id="btn_ok">'+options.okBtnNm+'</button>';
					strHTML += '				                        </div>';
				}

				strHTML += '				                    </div>';
				strHTML += '				';
				strHTML += '								</div>';
				strHTML += '							</div>';

			}

			strHTML += '						</div>';
			strHTML += '					</div>';
			strHTML += '				</div>';


			return strHTML;
		}

		,pAlert : function(msg, callbackFnc, option) {
			var title = option.title == undefined ? "" : option.title;
			var _options = {
					title : title,
					message : msg,
					callback : callbackFnc,
					firstBtn : 'ok',
					showBtn : true,
					extContainerCss : "",
					detail : option.detail == undefined ? "" : option.detail,
					detail2 : option.detail2 == undefined ? "" : option.detail2,
					icon : option.icon == undefined ? "" : option.icon,
					okBtnNm : option.okBtnNm == undefined ? "확인" : option.okBtnNm==""?"확인":option.okBtnNm,
					canBtnNm : option.canBtnNm == undefined ? "취소" : option.canBtnNm==""?"취소":option.canBtnNm,
					nextUrl  :  option.nextUrl,
					showModalClose : option.showModalClose == undefined ? "Y" : option.showModalClose
				};

			var innerHtml  = title==""?CommMsg.getNonTitleDialogHTML(_options):CommMsg.getTitleDialogHTML(_options);
			CommMsg.showModalPopUp(_options,innerHtml);
		}

		,pConfirm : function(msg, callbackFnc, option) {

			var title = option.title == undefined ? "" : option.title;
			var _options = {
					title : title,
					message : msg,
					callback : callbackFnc,
					firstBtn : 'ok',
					secondBtn : 'ok',
					showBtn : true,
					detail : option.detail == undefined ? "" : option.detail,
					detail2 : option.detail2 == undefined ? "" : option.detail2,
					icon : option.icon == undefined ? "" : option.icon,
					okBtnNm : option.okBtnNm == undefined ? "확인" : option.okBtnNm==""?"확인":option.okBtnNm,
					canBtnNm : option.canBtnNm == undefined ? "취소" : option.canBtnNm==""?"취소":option.canBtnNm,
					nextUrl  :  option.nextUrl
			};

			var innerHtml  = title==""?CommMsg.getNonTitleDialogHTML(_options):CommMsg.getTitleDialogHTML(_options);
			CommMsg.showModalPopUp(_options,innerHtml);
		}

		/* alert 메세지 표시
		 * msg : 화면에 표시할 메세지
		 * callbackFnc : callback function
		 * option :
		 */
		,mAlert : function(msg, callbackFnc, option) {
			var popIdx = $(".modal_popup.ty_alert").length;

			var msglayer = '';
			var iconClass = ""
			if(option.icon == "complete"){
				iconClass = "icon_complete_light";
			} else if(option.icon == "fail"){
				iconClass = "icon_fail";
			}
			
			var okBtnNm = "확인";
			if(!comm.isNull(option.okBtnNm)) {
				okBtnNm = option.okBtnNm;
			}

			msglayer += "<div id='modal_popup_info_alert_"+popIdx+"' class='modal_popup ty_alert show comm_msg_layer_class'><!-- 노출 className = show -->";
			msglayer += "	<div class='popup_layout active_layout'>";
			msglayer += "		<div class='popup_inner'>";
			msglayer += "			<div class='popup_body'>";
			msglayer += "				<div class='popup_container'>";
			msglayer += "					<div class='alert_title_part'>";
			if(iconClass != ""){
				msglayer += "						<div class='icon_box'>";
				msglayer += "							<span class='ebicon "+iconClass+"'></span>";
				msglayer += "						</div>";
			}
			msglayer += "						<p class='title'>" + msg + "</p>";
			msglayer += "					</div>";
			if(!comm.isNull(option.addText)){
				msglayer += "					<div class='alert_text_part'>";
				msglayer += "						<p>" + option.addText + "</p>";
				msglayer += "					</div>";
			}
			msglayer += "				</div>";
			msglayer += "			</div>";
			msglayer += "			<div class='popup_footer'>";
			msglayer += "				<div class='popup_footer_area'>";
			msglayer += "					<button type='button' id='modal_popup_info_alert_close_"+popIdx+"' class='ebbtn btn_confirm' data-action='close'>" + okBtnNm + "</button>";
			msglayer += "				</div>";
			msglayer += "			</div>";
			msglayer += "		</div>";
			msglayer += "	</div>";
			msglayer += "</div>";

			//화면에 레이어 추가
			$("#layoutPopContent").append(msglayer);

			//확인버튼 (닫기)
			$("#modal_popup_info_alert_close_"+popIdx).on("click",function(){
				/*
				$("#layoutPopContent #modal_popup_info_alert").removeClass("show");
				$("#layoutPopContent #modal_popup_info_alert").remove();
				*/
				popupFunc("#layoutPopContent #modal_popup_info_alert_"+popIdx).remove();

				if( (!comm.isNull(callbackFnc)) && (callbackFnc !="")){

					if(typeof callbackFnc == "function"){
						callbackFnc(true);

					}else{
						if((typeof callbackFnc) != "undefined"){
							alert("callbackfun type["+(typeof callbackFnc)+"]");
						}
					}
				}else{
					if( !comm.isNull(option) &&  !comm.isNull(option.nextUrl)){
						comm.goPage(option.nextUrl);
					}
				}
			});
			
			popupFunc("#modal_popup_info_alert_"+popIdx).show();
		}

		/* confirm 메세지 표시
		 * msg : 화면에 표시할 메세지
		 * callbackFnc : callback function
		 * option : icon    : 아이콘 추가
		 *          addText : 추가문구
		 *          btnLTxt : 왼쪽 버튼 문구
		 *          btnRTxt : 오른쪽 버튼 문구
		 */
		, mConfirm : function(msg, callbackFnc, option) {

			var popIdx = $(".modal_popup.ty_alert").length;

			var iconClass = ""
			if(option.icon == "complete"){
				iconClass = "icon_complete_light";
			} else if(option.icon == "fail"){
				iconClass = "icon_fail";
			}
			
			var btnLTxt = comm.isNull(option.btnLTxt) ? "취소" : option.btnLTxt;
			var btnRTxt = comm.isNull(option.btnRTxt) ? "확인" : option.btnRTxt;

			var msglayer = "";
			msglayer += "<div id='modal_popup_info_confirm_"+popIdx+"' class='modal_popup ty_alert show comm_msg_layer_class'><!-- 노출 className = show -->";
			msglayer += "	<div class='popup_layout active_layout'>";
			msglayer += "		<div class='popup_inner'>";
			msglayer += "			<div class='popup_body'>";
			msglayer += "				<div class='popup_container'>";
			msglayer += "					<div class='alert_title_part'>";
			if(iconClass != ""){
				msglayer += "						<div class='icon_box'>";
				msglayer += "							<span class='ebicon "+iconClass+"'></span>";
				msglayer += "						</div>";
			}

			msglayer += "						<p class='title'>" + msg + "</p>";
			msglayer += "					</div>";

			if(!comm.isNull(option.addText)){
				msglayer += "					<div class='alert_text_part'>";
				msglayer += "						<p>" + option.addText + "</p>";
				msglayer += "					</div>";
			}
			msglayer += "				</div>";
			msglayer += "			</div>";
			msglayer += "			<div class='popup_footer'>";
			msglayer += "				<div class='popup_footer_area'>";
			msglayer += "					<button type='button' id='modal_popup_info_confirm_cancle_"+popIdx+"' class='ebbtn btn_cancel' data-action='close'>"+btnLTxt+"</button>";
			msglayer += "					<button type='button' id='modal_popup_info_confirm_ok_"+popIdx+"' class='ebbtn btn_confirm' data-action='close'>"+btnRTxt+"</button>";
			msglayer += "				</div>";
			msglayer += "			</div>";
			msglayer += "		</div>";
			msglayer += "	</div>";
			msglayer += "</div>";
			
			if(comm.channel == "MW" || comm.channel == "MA"){
				setFocusArea();
			}
			//화면에 레이어 추가
			$("#layoutPopContent").append(msglayer);

			//취소버튼 (닫기)
			$("#modal_popup_info_confirm_cancle_"+popIdx).on("click",function(){
				/*
				var popContent = $("#layoutPopContent #modal_popup_info_confirm");
				popContent.removeClass("show");
				popContent.remove();
				*/
				popupFunc("#layoutPopContent #modal_popup_info_confirm_"+popIdx).remove();

				if( (!comm.isNull(callbackFnc)) && (callbackFnc !="")){

					if(typeof callbackFnc == "function"){
						callbackFnc(false);

					}else{
						if((typeof callbackFnc) != "undefined"){
							alert("callbackfun type["+(typeof callbackFnc)+"]");
						}
					}
				}else{
					if( !comm.isNull(option) &&  !comm.isNull(option.nextUrl)){
						comm.goPage(option.nextUrl,'N');
					}
				}
				if(comm.channel == "MW" || comm.channel == "MA"){
					setTimeout(function(){
						getFocusArea();
					}, 600);
				}
			});

			//확인버튼 (닫기, callback)
			$("#modal_popup_info_confirm_ok_"+popIdx).on("click",function(){
				
				popupFunc("#layoutPopContent #modal_popup_info_confirm_"+popIdx).remove();
				//popupFunc("#layoutPopContent #modal_popup_info_alert").remove();

				if( (!comm.isNull(callbackFnc)) && (callbackFnc !="")){

					if(typeof callbackFnc == "function"){
						callbackFnc(true);

					}else{
						if((typeof callbackFnc) != "undefined"){
							alert("callbackfun type["+(typeof callbackFnc)+"]");
						}
					}
				}else{
					if( !comm.isNull(option) &&  !comm.isNull(option.nextUrl)){
						comm.goPage(option.nextUrl,'Y');
					}
				}
			});
			popupFunc("#modal_popup_info_confirm_"+popIdx).show();
		}

		/************************************************************************
		@함수명		: msgPop
		@설 명		: 모달 메세지 팝업 표시
		@사용법		: CommMsg.msgPop(option, succCallbackFnc, failCallbackFnc) 호출
		@param option			: 커스텀이 필요할 경우사용하는 파라미터
		@param option.type		: a(확인버튼), c(취소버튼, 확인버튼)
		@param option.btnTxt	: "변경"	   //alert 사용시 버튼 텍스트 변경이 필요한 경우
		@param option.btnLeft	: "왼쪽"	   //confirm 사용시 왼쪽 버튼 텍스트 변경이 필요한 경우
		@param option.btnRight	: "오른쪽"  //confirm 사용시 오른쪽 버튼 텍스트 변경이 필요한 경우
		@param option.icon		: "Y"		  //아이콘
		@param option.tilte		: "타이틀"	  //제목
		@param option.point		: "html"	  //강조
		@param option.cont		: "html"	  //본문
		@param option.etc		: "추가 html"  //기타
		@param option.url		: "이동할 페이지 URL 표기"
		@param option.nClose	: "Y : 버튼 클릭 후에도 팝업이 닫히지 않게 처리"
		@param succCallbackFnc : 오른쪽 버튼 클릭시 callback 함수 
		@param failCallbackFnc : 왼쪽 버튼 클릭시 callback 함수 
		
		@작성자 		: 권희준

		수정일 			수정자 		수정내용
		-----------		------		--------------
		
		************************************************************************/
		, msgPop : function(option, succCallbackFnc, failCallbackFnc) {

			var msglayer = "";
			var popTitile = "";
			var popMsg = "";
			var btnLeft = comm.nvl(option.btnLeft).length < 1 ? "닫기" : option.btnLeft;
			var btnRight = comm.nvl(option.btnRight).length < 1 ? "확인" : option.btnRight;
			var btnTxt = comm.nvl(option.btnTxt).length < 1 ? "확인" : option.btnTxt;
			var addOption = CommMsg.addMsgOption(option);
			var nClose = comm.nvl(option.nClose).length < 1 ? "N" : option.nClose;

			var leftBox = "box_l"
			var rightBox = "box_r"


			if(btnLeft.length > 3){
				leftBox  = "box_t";
				rightBox = "box_b";
			}

			msglayer += "<div id='modalMsgPop' class='modal_popup ty_popup comm_msg_layer_class'><!-- 노출 className = show -->";
			msglayer += "	<div class='popup_layout'>";
			msglayer += "		<div class='popup_inner'>";
			msglayer += "			<div class='popup_body'>";
			msglayer += "				<div class='popup_container'>";
			msglayer += "					<div class='process_end_part' id='modalMsgPopCont'>";
			//옵션에 따른 내용 추가
			msglayer +=					  	addOption;
			msglayer += "					</div>";
			msglayer += "				</div>";
			msglayer += "			</div>";
			msglayer += "			<div class='popup_footer'>";
			msglayer += "				<div class='popup_footer_area'>";
			msglayer += "					<div class='btn_box'>";

			//확인버튼
			if(option.type == "a"){
				msglayer += "					<button type='button' class='ebbtn btn_main ty_bg' id='modalMsgPopOk'>" + btnTxt + "</button>";

			//확인버튼, 취소버튼
			} else if(option.type == "c"){
				msglayer += "					<div class='"+leftBox+"'>";
				msglayer += "						<button type='button' class='ebbtn btn_main ty_light' id='modalMsgPopCancel'>" + btnLeft + "</button>";
				msglayer += "					</div>";
				msglayer += "					<div class='"+rightBox+"'>";
				msglayer += "						<button type='button' class='ebbtn btn_main ty_bg' id='modalMsgPopOk'>" + btnRight + "</button>";
				msglayer += "					</div>";
			}

			msglayer += "					</div>";
			msglayer += "				</div>";
			msglayer += "			</div>";
			msglayer += "		</div>";
			msglayer += "	</div>";
			msglayer += "</div>";

			//화면에 레이어 추가
			$("#layoutPopContent #modalMsgPop").remove();
			$("#layoutPopContent").append(msglayer);

			if(option.type == "c"){
				$("#modalMsgPopCancel").on("click",function(){
					popupFunc("#layoutPopContent #modalMsgPop").remove();

					if(option.url){
						//url 이동 기능 추가 예정
					} else{
						if(failCallbackFnc){
							//callback function 호출
							failCallbackFnc();
						}
					}
					if(comm.channel == "MW" || comm.channel == "MA"){
						getFocusArea();
					}
				});
			}

			//확인버튼 (닫기, callback)
			$("#modalMsgPopOk").on("click",function(){
				if(nClose != "Y"){
					popupFunc("#layoutPopContent #modalMsgPop").remove();
				}

				if(option.url){
					//url 이동 기능 추가 예정
				} else{
					if(succCallbackFnc){
						//callback function 호출
						succCallbackFnc();
						if(comm.channel == "MW" || comm.channel == "MA"){
							setTimeout(function(){
								getFocusArea();
							}, 600);
						}
					} else {
						if(comm.channel == "MW" || comm.channel == "MA"){
							getFocusArea();
						}
					}
				}

				//CommMsg.checkLayer();
			});

            if(comm.channel == "MW" || comm.channel == "MA"){
            	setFocusArea();
            }
			popupFunc('#modalMsgPop').show();
		}

		/************************************************************************
		@함수명		: addMsgOption
		@설 명		: 기본 메세지 팝업 표시팝업의 추가사항 html 생성
		@사용법		: CommMsg.addMsgOption(option) 호출
		@param option			: 커스텀이 필요할 경우사용하는 파라미터
		@param option.icon		: "Y"		  //아이콘
		@param option.tilte		: "타이틀"	  //제목
		@param option.point		: "html"	  //강조
		@param option.cont		: "html"	  //본문
		@param option.etc		: "추가 html"  //기타
		
		@작성자 		: 권희준

		수정일 			수정자 		수정내용
		-----------		------		--------------
		
		************************************************************************/
		, addMsgOption : function(option){
			var addOption = "";
			//아이콘
			if(comm.nvl(option.icon) == "Y"){
				addOption += "<div class='icon_box'>";
				addOption += "  <span class='ebicon icon_fail'></span>";
				addOption += "</div>";
			}

			//타이틀
			if (option.title) {
				addOption += "<div class='title_box'>";
				addOption += "  <div class='title'>" + option.title + "</div>";
				addOption += "</div>";
			}

			//본문영역 Start
			addOption += "<div class='conts_box'>";

			//강조
			if (option.point) {
				addOption += option.point;
			}

			//일반 문구
			if (option.cont) {
				addOption += "<div class='desc_box'>" + option.cont + "</div'>";
			}

			//기타 추가 내용
			if (option.etc) {
				addOption += "<div class='desc_box'>";
				addOption += "<div class='item_box'>";
				addOption += "  <div class='bullet_pack'>" + option.etc + "</div>";
				addOption += "</div>";
			}
			//본문영역 End
			addOption += "</div>";

			return addOption;
		},

		pAutoLogoutInfo : function() {
			var msglayer = "";

			msglayer += "<div id='modalLogoutInfoPop' class='modal_popup ty_alert'>";
			msglayer += "	<div class='popup_layout' style='width: 380px;'>";
			msglayer += "		<div class='popup_inner'>";
			msglayer += "			<div class='popup_body'>";
			msglayer += "				<div class='popup_container'>";
			msglayer += "					<div class='alert_title_part'>";
			msglayer += "						<p class='title'>자동 로그아웃 안내</p>";
			msglayer += "					</div>";
			msglayer += "					<div class='alert_text_part'>";
			msglayer += "						<p>장시간 이용하지 않아 곧 접속이 종료됩니다. <br>시간을 연장해주세요.</p>";
			msglayer += "					</div>";
			msglayer += "					<div class='time_info_part'>";
			msglayer += "						<div class='time_info_box'>";
			msglayer += "							<span>남은시간 <b class='color02'><span id='leftTimeView'/></b></span>";
			msglayer += "						</div>";
			msglayer += "					</div>";
			msglayer += "				</div>";
			msglayer += "			</div>";
			msglayer += "			<div class='popup_footer'>";
			msglayer += "				<div class='popup_footer_area'>";
			msglayer += "					<button type='button' class='ebbtn btn_confirm' id='btnRenewTime'>시간연장</button>";
			msglayer += "				</div>";
			msglayer += "			</div>";
			msglayer += "		</div>";
			msglayer += "	</div>";
			msglayer += "</div>";

			//화면에 레이어 추가
			$("#layoutPopContent #modalLogoutInfoPop").remove();
			$("#layoutPopContent").append(msglayer);

			popupFunc('#layoutPopContent #modalLogoutInfoPop').show();

			//확인버튼 (닫기, callback)
			$("#btnRenewTime").on("click",function() {
				counter_reset();
				popupFunc("#layoutPopContent #modalLogoutInfoPop").remove();
				
				CommMsg.checkLayer();
			});
		},

		pAutoLogout : function() {
			var msglayer = "";

			msglayer += "<div id='modalLogoutPop' class='modal_popup ty_alert'>";
			msglayer += "	<div class='popup_layout' style='width: 380px;'>";
			msglayer += "		<div class='popup_inner'>";
			msglayer += "			<div class='popup_body'>";
			msglayer += "				<div class='popup_container'>";
			msglayer += "					<div class='alert_title_part'>";
			msglayer += "						<p class='title'>자동 로그아웃</p>";
			msglayer += "					</div>";
			msglayer += "					<div class='alert_text_part'>";
			msglayer += "						<p>장시간 이용하지 않아 접속이 종료되었습니다. <br>다시 로그인해 주세요.</p>";
			msglayer += "					</div>";
			msglayer += "				</div>";
			msglayer += "			</div>";
			msglayer += "			<div class='popup_footer'>";
			msglayer += "				<div class='popup_footer_area'>";
			msglayer += "					<button type='button' class='ebbtn btn_confirm' id='btnConfirm'>확인</button>";
			msglayer += "				</div>";
			msglayer += "			</div>";
			msglayer += "		</div>";
			msglayer += "	</div>";
			msglayer += "</div>";

			//화면에 레이어 추가
			$("#layoutPopContent #modalLogoutPop").remove();
			$("#layoutPopContent").append(msglayer);

			popupFunc('#layoutPopContent #modalLogoutPop').show();

			//확인버튼 (닫기, callback)
			$("#btnConfirm").on("click",function() {
				comm.goMain();
			});
		},

		mAutoLogoutInfo : function() {
			var msglayer = "";

			msglayer += "<div id='modalLogoutInfoPop' class='modal_popup ty_popup'>";
			msglayer += "	<div class='popup_layout'>";
			msglayer += "		<div class='popup_inner'>";
			msglayer += "			<div class='popup_header'></div>";
			msglayer += "			<div class='popup_body'>";
			msglayer += "				<div class='popup_container'>";
			msglayer += "					<div class='logout_part'>";
			msglayer += "						<div class='title'>자동 로그아웃 안내</div>";
			msglayer += "						<p class='desc'>장시간 이용하지 않아 접속이 종료됩니다. <br/>시간을 연장해주세요.</p>";
			msglayer += "						<div class='timeleft'>";
			msglayer += "							<span class='txt' id='leftTimeView_label'>남은시간</span>";
			msglayer += "							<span class='time' id='leftTimeView' role='text' aria-describedby='leftTimeView_label'></span>";
			msglayer += "						</div>";
			msglayer += "					</div>";
			msglayer += "				</div>";
			msglayer += "			</div>";
			msglayer += "			<div class='popup_footer'>";
			msglayer += "				<div class='popup_footer_area'>";
			msglayer += "					<button type='button' class='ebbtn btn_main ty_bg' id='btnRenewTime'>시간연장</button>";
			msglayer += "				</div>";
			msglayer += "			</div>";
			msglayer += "		</div>";
			msglayer += "	</div>";
			msglayer += "</div>";

			//화면에 레이어 추가
			$("#layoutPopContent #modalLogoutInfoPop").remove();
			$("#layoutPopContent").append(msglayer);

			popupFunc('#layoutPopContent #modalLogoutInfoPop').show();

			//확인버튼 (닫기, callback)
			$("#btnRenewTime").on("click",function() {
				counter_reset();
				popupFunc("#layoutPopContent #modalLogoutInfoPop").remove();

				CommMsg.checkLayer();
			});
		},

		mAutoLogout : function() {
			var msglayer = "";

			msglayer += "<div id='modalLogoutPop' class='modal_popup ty_popup'>";
			msglayer += "	<div class='popup_layout'>";
			msglayer += "		<div class='popup_inner'>";
			msglayer += "			<div class='popup_header'></div>";
			msglayer += "			<div class='popup_body'>";
			msglayer += "				<div class='popup_container'>";
			msglayer += "					<div class='logout_part'>";
			msglayer += "						<div class='title'>자동 로그아웃</div>";
			msglayer += "						<p class='desc'>장시간 이용하지 않아 접속이 종료되었습니다. <br/>다시 로그인해주세요.</p>";
			msglayer += "					</div>";
			msglayer += "				</div>";
			msglayer += "			</div>";
			msglayer += "			<div class='popup_footer'>";
			msglayer += "				<div class='popup_footer_area'>";
			msglayer += "					<button type='button' class='ebbtn btn_main ty_bg' id='btnConfirm'>확인</button>";
			msglayer += "				</div>";
			msglayer += "			</div>";
			msglayer += "		</div>";
			msglayer += "	</div>";
			msglayer += "</div>";

			//화면에 레이어 추가
			$("#layoutPopContent #modalLogoutPop").remove();
			$("#layoutPopContent").append(msglayer);

			popupFunc('#layoutPopContent #modalLogoutPop').show();

			//확인버튼 (닫기, callback)
			$("#btnConfirm").on("click",function() {
				popupFunc("#layoutPopContent #modalLogoutPop").remove();
				// 메인 페이지 이동
				if(comm.channel == "MW") {
					comm.goMain();
				} else if(comm.channel == "MA") {
					comm.goPage('/login/appInit.nh');
				} else if(comm.channel == "MP") {
					comm.goPage('/partner/logn/loginForm.nh');
				}
			});
		},

		// layoutPopContent 내에 div 갯수 체크 후 aria-hidden 처리
		checkLayer : function(option) {
			setTimeout(function(){
				var popLen = $('#layoutPopContent').children().length;
	            if( popLen > 0 ) {
	    			$('#layoutContent').attr('aria-hidden', 'true');
	    			$('#layoutPopContent').attr('aria-hidden','false');
    			
                	$("#layoutPopContent").children().each(function(idx) {
                		if( popLen > 1 ) {
                			if( idx == (popLen - 1) ) $(this).attr('aria-hidden', 'false');
                			else $(this).attr('aria-hidden', 'true');
                		} else {
                			$(this).attr('aria-hidden', 'false');
                		}
						if(option != "remove"){
							$('.active_layout').attr('tabindex', idx).focus();	
							//$('.active_layout').find('.popup_header h3').attr('tabindex', -1).focus();// A11Y 240408
						}
                	});
	            } else { 
	            	$('#layoutContent').removeAttr('aria-hidden');
	    			$('#layoutPopContent').attr('aria-hidden','true');
	            }
			},1000)
		}
}
