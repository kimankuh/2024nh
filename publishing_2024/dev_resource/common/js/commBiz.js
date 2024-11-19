/********************************************************
파일명 	: commBiz.js
설 명  	: 업무 공통 javascript

수정일 		수정자 명 		Version 	Function
-------     -------- 	---------- --------------
2022.03.14  허동규		0.1			휴대폰본인인증완료 콜백함수 추가
2022.03.29  정재운        0.1         스탁론 > 계좌정보 목록
2022.03.29  정재운        0.1         스탁론 > 한도조회
2022.03.29  정재운        0.1         약관호출
2022.04.27  정재운        0.1         스탁론 운영시간 확인
*********************************************************/


var commBiz = {
	initDateObj: function(id, fnValid){
		var $obj = $("#" + id);

		$obj.focusin(function(){
			$(this).val(comm.replaceAll($(this).val(), ".", ""));
		}).keypress(function(){
			if($(this).val().length > 8){
				$(this).val($(this).val().substring(0, 8));
			}
			var thisDt = comm.replaceAll($(this).val(), ".", "");
			$(this).val(thisDt);
		}).keyup(function(){
			if($(this).val().length > 8){
				$(this).val($(this).val().substring(0, 8));
			}
			if(commBiz.chkDatepicker($(this).val())){
				$(this).val(comm.dateFormat($(this).val(), "."));
			}
		}).change(function(){
			var thisDt = comm.replaceAll($(this).val(), ".", "");
			var currDt = comm.getCurTimeStamp();

			if(comm.isEmpty(thisDt)){
				return false;
			}

			if(!commBiz.chkDatepicker(thisDt)){
				fnValid(id);
				return false;
			}

			$(this).val(comm.dateFormat(thisDt, "."));
		}).focusout(function(){
			$(this).trigger("change");
		});
	}
	,initDatepicker: function(){
		$obj = $("div.ty_date").find(".ebinput");

		$obj.focusin(function(){
			$(this).val(comm.replaceAll($(this).val(), ".", ""));
//			$(this).val($(this).val().replaceAll(".", ""));
		}).keypress(function(){
			$(this).val(comm.replaceAll($(this).val(), ".", ""));
//			$(this).val($(this).val().replaceAll(".", ""));
		}).keyup(function(){
			if(commBiz.chkDatepicker($(this).val())){
				$(this).val(comm.dateFormat($(this).val(), "."));
			}
		}).change(function(){
			var thisDt = comm.replaceAll($(this).val(), ".", "");
//			var thisDt = $(this).val().replaceAll(".", "");
			var currDt = comm.getCurTimeStamp();

			if(!commBiz.chkDatepicker(thisDt)){
				$(this).val("");
				return false;
			}

			$(this).val(comm.dateFormat(thisDt, "."));
		}).focusout(function(){
			$(this).trigger("change");
		});
	}
	,chkDatepicker: function(v){
		try {
			v = comm.replaceAll(v, ".", "")
//			v = v.replaceAll(".", "");

			var regExp = /[^0-9]/g;

			if(regExp.test(v)){
				return false;
			}

			if(v.length != 8){
				return false;
			}

			var year = v.substring(0, 4);
			var month = v.substring(4, 6);
			var day = v.substring(6, 8);
			var d = new Date(year, month-1, day);

			if (d.getFullYear() == year && commBiz.lpad((d.getMonth()+1), 2, '0') == month && commBiz.lpad(d.getDate(), 2, '0') == day) {
		        return true;
		    }

		} catch (err) {
			return false;
		}
		return false;
	}
	,lpad: function(data, length, rep){
		data = String(data);
		while(data.length < length) {
			data = rep +""+ data;
		}

		return data;
	}
}

/**
 * 휴대폰본인인증완료 콜백함수
 * 함수명 : 화면ID 4Depth까지사용(다건의 경우 _01, _02로 사용)
 * ex : 단건(PWCDLN010100, 다건(PWCDLN010100_01, PWCDLN010100_02)
 */
var hpAuthCallback = {
	PWCDLN010100 : function(){	/* 대출상품 > 신용대출 */
		
		// 디파이너리(애드브릭스) 이벤트 호출 : 본인인증 완료 시점
		var eventPrefix = (sessionStorage.getItem("inflDvcd") === "B") ? "employee" : "credit"; // 임직원대출 : 신용대출
		if (sessionStorage.getItem("addLoanYn") === "Y") eventPrefix += "_add";
		fn_call_dfinery_event({ eventName: eventPrefix+"_self_auth" });
		
		comm.callAjaxJson("/eloan/credit/selectCreditLoanProgressStatus.nh"
				, {}
				, function(res){
					if(res.resultCode == "S"){
						switch(res.prgsStcd){
							case "000":	//최초진입
								//comm.goPage("/eloan/credit/insertCreditLoanCustInfo.nh");
								//comm.goPage("/comm/auth/scrapingAuthForm.nh");
								comm.showProgress(15);
			                    comm.goPage("/eloan/scraping/firstInquiry.nh");
								break;
							case "100":	//이어하기
								var formData = 'prgsStep=' + res.prgsStep;
								CommPop.layerPopup("selectCreditLoanRelayPop", "/eloan/credit/selectCreditLoanRelayPop.nh", formData);
								break;
							case "998":	//기대출건 존재
								var option = new Object();
								option.icon = "fail";
								option.title = "";
								option.detail = "고객님은 이미 대출신청건이 존재합니다.<br/>해당 상품의 신청건이 마감되면 대출진행을 하실 수 있습니다.";

								CommMsg.alert("대출 대상이 아닙니다.", function(){}, option);
								break;
							case "999":	//추가대출 불가상태 (최대 3건의 신용대출 보유중)
								var option = new Object();
								option.icon = "fail";
								option.title = "";
								option.detail = "이미 3건의 신용대출을<br/>이용하시고 있습니다.<br/>더 이상 대출을 진행하실 수 없습니다.";

								CommMsg.alert("대출 대상이 아닙니다.", function(){}, option);
								break;
							default:
								break;
						}
					}else {
						CommMsg.alert(res.resultMsg, function(){}, option);
					}

				}
		);
	}
	, reportForm : function(){ // 회사소개 > 윤리경영 > 내부제보
		
		// 임직원 여부 확인
		comm.callAjaxJson("/aboutus/ethical/checkEmpAjax.nh"
				, {}
				, function(data){
					var result = data.result;
					var sysData = result.response['SYSTEM']; 	//시스템부 데이터 ("SYSTEM")
					var errData= result.response['MESSAGE'];  	//메세지 데이터 ("MESSAGE")
					var success = sysData['PRCS_RSLT_DVCD']; 	//결과구분코드(헤더값)
					
					if (success === "S") {
						if (result["data"]["XCSM_YN_S1"] === "Y") {
							comm.goPage("/aboutus/ethical/reportForm.nh");
						} else {
							CommMsg.alert("임직원만 내부제보 가능합니다.", function() {
								comm.goPage("/aboutus/ethical/selectEthical.nh");
							});
						}
					} else {
						CommMsg.alert("정보 확인중 오류입니다.");
					}
				}
		);
	}
	, reasonForm : function(){ // 회사소개 > 윤리경영 > 클린신고센터
		comm.goPage("/aboutus/ethical/reasonForm.nh");
	}
	, historyForm : function(){ // 회사소개 > 윤리경영 > 내 신고내역 보기
		comm.goPage("/aboutus/ethical/historyForm.nh?code="+sessionStorage.getItem("mCode"));
	}
	
	, stockFirstInquiry : function(){
		comm.showProgress(15);
		comm.callAjaxJson("/eloan/scraping/stockFirstInquiry.nh", {}, function(data){
			if(data.IQRY_ICNT > 0){
				var url = sessionStorage.getItem("STOCK_RETURNURL");
				if(url != null){
					comm.goPage(url);
				} else {
					CommMsg.alert("서버 통신 오류입니다.", function(){
						comm.goMain();
					});
				}
			} else {
				comm.goPage("/eloan/scraping/firstInquiry.nh");
			}
		});
	}
	
	, debtorLawFirstInquiry : function(){
		comm.callAjaxJson("/debtor/prtctLaw/selectDebtorLawProgressStatus.nh"
			, {}
			, function(res){
				if(res.resultCode == "S"){
					comm.callAjaxJson("/debtor/prtctLaw/debtorLawFirstInquiry.nh", {}, function(data){
						var url = sessionStorage.getItem("DEBTOR_RETURNURL");
						if(url != null){
							comm.goPage(url);
						} else {
							CommMsg.alert("서버 통신 오류입니다.", function(){
								comm.goMain();
							});
						}
					});
				}else {
					CommMsg.alert(res.resultMsg, function(){});
				}

			}
		);
	}
	
	, fctpHpAuthCallback : function(){
		comm.callAjaxJson("/customer/customer/financialNote/ajaxNoticeSendingDetails.nh"
				, {}
				, function(res){
					if(res.resultCode == "S"){
						comm.goPage("/customer/customer/financialNote/selectNoticeSendingList.nh");
						
					}else {
						CommMsg.alert(res.resultMsg, function(){});
					}
					
				}
		);
	}
};

const fn_member_Info_Edit = function(){//회원정보 변경 전문
	const url = "/myaccnt/member/memberInfo/ajaxMemberInfoEdit.nh";
    comm.callAjaxJson(url,{},function(data){
        
        if(data.SUCCESS === "E"){
        	CommMsg.alert(data.resultMsg);
        } else {
        	
            var result = data.result;
    		var resultData = result['data']; 	//결과 데이터("DATA")
    		var errData= result['message'];  	//메세지 데이터 ("MESSAGE")
            var success = resultData['UPDT_YN_S1']; //회원정보 변경 성공 여부
            
            if(success === "Y"){
                //CommMsg.alert("회원정보가 수정되었습니다.",fn_edit_callbackfun);
            	CommMsg.msgPop(
                    	{type:"a",title:"회원정보가 수정되었습니다."},
                        function(){
                            const url = "/home/homemain.nh";
                            comm.goPage(url);
                    });
            } else {
                if(errData != "" || errData != null || errData != 'undefined'){
                  const msgGroup = errData['MSG_GROUP'];
                  const msgInfo = msgGroup.pop(0);
                  const errMsg = msgInfo['RSP_MSG_AD'];
                  CommMsg.alert(errMsg,function(){return false;});
                }
            }
        }
    });
}

/** 2024.09.19 채널계 개선 사업 
 *  내 정보 변경 시 휴대전화번호 변경된 경우 휴대폰 인증
 */
const fn_my_Info_Edit = function(){
	const url = "/myaccnt/member/memberInfo/ajaxMyInfoHpAuthEdit.nh";
	comm.callAjaxJson(url,{},function(data){
    	var success = data.SUCCESS;
    	if(success === "E"){
    		CommMsg.alert(data.resultMsg);
    	} else {
    		// 전자서명 인증
    		fn_certify_electronic_sign_pc();
    	}
    });
}

/** 2024.09.19 채널계 개선 사업 
 *  내 정보 변경 시 휴대폰 인증 후 전자서명 진행
 */
const fn_certify_electronic_sign_pc = function() {
	comm.doCertSign('frm', 'fn_ajax_my_info_pc', 'WAP_M_COR_S_CST95475');
}

/** 2024.09.19 채널계 개선 사업 
 *  내 정보 변경
 */
const fn_ajax_my_info_pc = function(){
    const url = "/myaccnt/member/memberInfo/ajaxMyInfoEdit.nh";
	const sendData = {};
    comm.callAjaxJson(url,sendData,function(data){
    	var result = data.result;
		var resultData = result['data']; 		//결과 데이터("DATA")
		var errData= result['message'];  		//메세지 데이터 ("MESSAGE")
        var success = resultData['SCS_YN_S1']; 	//내 정보 변경 성공 여부
        
        if(success === "Y"){
        	const url = "/myaccnt/member/memberInfo/selectFinishMyInfo.nh";
            comm.goPage(url);
        } else {
            if(errData != "" || errData != null || errData != 'undefined'){
                const msgGroup = errData['MSG_GROUP'];
                const msgInfo = msgGroup.pop(0);
                const errMsg = msgInfo['RSP_MSG_AD'];
                option.type = "a";
                option.icon = "Y";
                option.cont = errMsg;
                CommMsg.msgPop(option,function(){return false;});
            }
        }
    });
}


const fn_edit_callbackfun = function(){//회원정보변경 전문 콜백
    const url = "/myaccnt/member/memberInfo/infoEditForm.nh";
    comm.goPage(url);
}

const fn_call_ajax_edit_password = function(){ //비밀번호변경 전문
    const url = "/myaccnt/member/memberInfo/ajaxMemberInfoPwEdit.nh";
    const sendData = $("#frm").serialize();
    comm.callAjaxSec(url,sendData,function(data){
        const success = data.SUCCESS; //비밀번호 유효성 검사 성공 여부
        const error = data.ERROR;
        if(success === "E"){
            fn_check_input_pw(error);
        }else{
            const result = data['result'];
            const resultData = result['data'];
            const success1 = resultData['CRTF_SCS_YN_S1']; //비밀번호 변경 성공 여부
            if(success1 === "Y"){
                const option = {
                    type : "a",
                    btnText : "확인",
                    title : "비밀번호가 수정되었습니다."
                }
                CommMsg.msgPop(option,fn_success_callbackfunction);
            }else{
                const errMsg = resultData['PW_CHG_FAIL_MSG_S100'];
                CommMsg.alert(errMsg,function(){return false;});
            }
        }
    })
}
const fn_success_callbackfunction = function(){//비밀번호변경 콜백
    const url = "/home/homemain.nh";
    comm.goPage(url);
}

const fn_check_input_pw = function(msg){
	CommMsg.alert(msg,function(){return false;});
    return false;
}
const fn_comm_memberOut = function(){//회원 탈퇴 전문
	const url = "/myaccnt/member/memberInfo/ajaxMemberInfoOut.nh";
    comm.callAjaxJson(url,{},function(data){

		if(data.resultType === "E"){
			CommMsg.alert(data.resultMsg);
		} else {

	        var result = data.result;
			var sysData = result.response['SYSTEM']; 	//시스템부 데이터 ("SYSTEM")
			var errData= result['message'];  	//메세지 데이터 ("MESSAGE")
			var resultData = result['data'];; 	//결과 데이터("DATA")
			var success = sysData['PRCS_RSLT_DVCD']; 	//결과구분코드(헤더값)
			
	        if(success === "S"){
	        	if(resultData.PROC_YN_S1 === "Y"){
	        		const url = "/myaccnt/member/memberInfo/memberInfoOutFinish.nh";
	        		comm.goPage(url);
	        	} else {
		            if(errData != "" || errData != null || errData != 'undefined'){
		              const msgGroup = errData['MSG_GROUP'];
		              const msgInfo = msgGroup.pop(0);
		              const errMsg = msgInfo['RSP_MSG_AD'];
		              CommMsg.alert(errMsg,function(){return false;});
		            }
	        	}
	        }else{
	            if(errData != "" || errData != null || errData != 'undefined'){
	              const msgGroup = errData['MSG_GROUP'];
	              const msgInfo = msgGroup.pop(0);
	              const errMsg = msgInfo['RSP_MSG_AD'];
	              CommMsg.alert(errMsg,function(){return false;});
	            }
	        }
		}
    });
}


const fnComm_cinfo_edit = function(){//법인회원정보 변경 전문
	const url = "/myaccnt/member/memberInfo/ajaxcinfoEdit.nh";
    comm.callAjaxJson(url,{},function(data){
        
        if(data.SUCCESS === "E"){
        	CommMsg.alert(data.resultMsg);
        } else {

            var result = data.result;
    		var resultData = result['data']; 	//결과 데이터("DATA")
    		var errData= result['message'];  	//메세지 데이터 ("MESSAGE")
            var success = resultData['UPDT_YN_S1']; //회원정보 변경 성공 여부
            
            if(success === "Y"){
                CommMsg.alert("회원정보가 수정되었습니다.",cinfo_Edit_callbackfun);
            } else {
                if(errData != "" || errData != null || errData != 'undefined'){
                  const msgGroup = errData['MSG_GROUP'];
                  const msgInfo = msgGroup.pop(0);
                  const errMsg = msgInfo['RSP_MSG_AD'];
                  CommMsg.alert(errMsg,function(){return false;});
                }
            }
        }
    });
}

const cinfo_Edit_callbackfun = function(){//회원정보변경 전문 콜백
    const url = "/home/homemain.nh";
    comm.goPage(url);
}


/**
 * 스탁론 > 계좌정보 조회 목록
 */
const fn_getLoanAccountList = function() {
	var url = "/eloan/stock/selectLoanAccountList.nh";
	var params = {};

	comm.callAjaxJson(url, params, fn_callback);
}

const fn_callback = function(resData) {
	var result = resData.result;
	var resultData = result.data;
	var header     = result.header;

	//"S" : 성공
	if("S" != header.PRCS_RSLT_DVCD) {
	/*
	 * MNMSG_CD : ECTR000213, RSP_MSG_CN : 스탁론 운영시간이 아닙니다.(평일 8:30~16:30)
	 */
	 	var cnt      = resData.response.MESSAGE.MSG_CNT;
	 	var mnmsgCd  = resData.response.MESSAGE.MSG_GROUP[0].MNMSG_CD;
	 	var rspMsgAd = resData.response.MESSAGE.MSG_GROUP[0].RSP_MSG_AD;
	 	var rspMsgCn = resData.response.MESSAGE.MSG_GROUP[0].RSP_MSG_CN;

	 	var msg = mnmsgCd +" <br/> "+ rspMsgAd +" <br/> "+ rspMsgCn;

		if(cnt > 0) {

			mnmsgCd  = resData.result.message.MSG_GROUP[0].MNMSG_CD;
			rspMsgAd = resData.result.message.MSG_GROUP[0].RSP_MSG_AD;
			rspMsgCn = resData.result.message.MSG_GROUP[0].RSP_MSG_CN;

			msg = mnmsgCd +" <br/> "+ rspMsgAd +" <br/> "+ rspMsgCn;
			if(rspMsgAd === undefined || rspMsgAd == '') {
				msg = mnmsgCd +" <br/> "+ rspMsgCn;
			}
		}

	 	CommMsg.alert(msg);
		return;
	}else {

		cnt            = resultData.grid1_cnt;	//목록개수
		var dataset    = resultData.grid1;
		var custArray  = [];

		if(cnt > 0) {
			$("#custNo").val(resultData.CUSTNO); 	// 고객번호

			//수탁사명 조회
			var url = "/eloan/stock/selectStockNameList.nh";
			var params = {};
			comm.callAjaxJson(url, params, function(rtnData) {

				var innerHtml = "";
				var itemHtml = "";
				itemHtml +=	'<div id="loanAcctArea" class="modal_popup ty_popuplayer">';
				itemHtml +=		'<div class="popup_layout">';
				itemHtml +=			'<div class="popup_inner">';
				itemHtml +=				'<div class="popup_header">';
				itemHtml +=					'<button type="button" class="ebbtn btn_modal_close" title="팝업닫기" data-action="remove" onclick="fn_loanAcctClose();"></button>';
				itemHtml +=				'</div>';
				itemHtml +=				'<div class="popup_body">';
				itemHtml +=					'<div class="popup_container">';
				itemHtml +=						'<div class="option_list ty_line">';
				itemHtml +=							'<ul id="itemList">';
				itemHtml +=							'</ul>';
				itemHtml +=						'</div>';
				itemHtml +=					'</div>';
				itemHtml +=				'</div>';
				itemHtml +=			'</div>';
				itemHtml +=		'</div>';
				itemHtml +=	'</div>';
				
				$.each(dataset, function(idx, row){

					var _CNCM_PTNR_NO = dataset[idx].CNCM_PTNR_NO; 	// 전문 수탁사기관코드

					$.each(rtnData, function(idx2, row2){

						var code = rtnData[idx2].code;			// DB 수탁사기관코드
						if(code == _CNCM_PTNR_NO) {

							var _CNCM_NM_S30  = rtnData[idx2].codeName;		// 수탁사기관명
							var _SCCM_NM_S30  = dataset[idx].SCCM_NM_S30; 	// 증권사명
							var _SCRTS_ACNO   = dataset[idx].SCRTS_ACNO; 	// 증권계좌번호
							var _LOAN_NO      = dataset[idx].LOAN_NO; 		// 대출계좌번호
							var _SCCM_PTNR_NO = dataset[idx].SCCM_PTNR_NO; 	// 증권사기관코드
							var _CUSTNO 	  = dataset[idx].CUSTNO; 		// 고객번호
							var _CUSTNM 	  = dataset[idx].CUST_NM; 		// 고객명
							var _BZMNNO 	  = dataset[idx].BZRNO; 		// 사업자번호
							var _INBMYN 	  = dataset[idx].INBM_YN; 		// 개인사업자여부

							var selectValue = _SCCM_PTNR_NO + "," + _CNCM_PTNR_NO + "," + _SCRTS_ACNO + "," + _LOAN_NO + "," + _CUSTNO + "," + _BZMNNO+ "," + _INBMYN;

							innerHtml += '<li>';
							innerHtml += '	<button type="button" class="ebbtn btn_option">';
							innerHtml += '	<span class="product_box" selectVal="'+selectValue+'">';
							innerHtml += '		<span class="title">'+_CNCM_NM_S30+'_'+_SCCM_NM_S30+'</span>';
							innerHtml += '		<span class="conts">';
							innerHtml += '			<span class="data">';
							innerHtml += '				<span class="ttl">증권계좌번호</span>';
							innerHtml += '				<span class="txt">'+_SCRTS_ACNO+'</span>';
							innerHtml += '			</span>';
							innerHtml += '		</span>';
							innerHtml += '	</span>';
							innerHtml += '</li>';
							
							var custData = '';
							if(window.location.href.indexOf("eloan/stock/repayloan/") > -1){
								if(_BZMNNO == ""){
									custData = '<option value="'+_CUSTNO+'">'+_CUSTNM+'</option>';
								}
							} else {
								custData = '<option value="'+_CUSTNO+'">'+_CUSTNM+'</option>';
							}
							custArray.push(custData);
						}
					});
				});

				if(comm.channel != "PW"){
					$(".container").after(itemHtml);
					fn_loanAcctOpen();
				}
				//var innerHtml ='<option value="'+selectValue+'">'+_CNCM_NM_S30+'_'+_SCCM_NM_S30+'</option>';

				$("#itemList").append(innerHtml);
				sessionStorage.setItem("itemList", $("#itemList").html());
				
				var custList = new Set(custArray);
				var custHtml = "";
				custList.forEach(function(val){
					custHtml += val;
				});

				$("#custList").html(custHtml);
				$("#custList option").eq(0).change();
			});
		}else {
			layerId      = "noLoanListPopForm";
			url          = "/eloan/stock/loanRequestEmptyFormPop.nh";
			var formData = {};

			CommPop.layerPopup(layerId,url,formData);
		}

	}
}

const fn_loanAcctOpen = function(){
	document.querySelector('#loanAcct').addEventListener('click', function() {
		$("#loanAcctArea").addClass('show');
		$("#loanAcctArea").before('<div class="select_dim on"></div>');
		$("#loanAcctArea").css({'bottom': -$("#loanAcctArea").outerHeight() });
		$("#loanAcctArea").stop().animate({'bottom': 0}, 350);
		bodyScrCtrl('lock');
	});
}

const fn_loanAcctClose = function(){
	$("#loanAcctArea").stop().animate({'bottom': -$("#loanAcctArea").outerHeight()}, 400);
	setTimeout(function(){
		$("#loanAcctArea").removeClass('show');
		$("#loanAcctArea").siblings('.select_dim').remove();
		bodyScrCtrl('unlock');
	}, 300);
}

/**
 * 대출가능 한도금액 조회(1500)
 * @param pathName
 * @returns
 */
const fn_selectCreditLine = function(args) {

	var params = {
			"pathName"          : args.pathName,
			"CNCM_PTNR_NO"      : args.CNCM_PTNR_NO,
			"SCCM_PTNR_NO"      : args.SCCM_PTNR_NO,
			"GDS_CD"            : args.GDS_CD,
			"STLN_GDS_CHG_SQNO" : args.STLN_GDS_CHG_SQNO,
			"SCRTS_ACNO"        : args.SCRTS_ACNO,
			"rCncmPtnrNo"       : args.CNCM_PTNR_NO,
			"sccmPtnrNo"        : args.SCCM_PTNR_NO,
			"gdsCd"             : args.GDS_CD,
			"stlnGdsChgSqno"    : args.STLN_GDS_CHG_SQNO,
			"scrtsAcno"         : args.SCRTS_ACNO,
			"inbmYn"			: args.inbmYn,
			"rlvrExpcAmt"		: args.rlvrExpcAmt
	};

	var url = "";
	if(args.pathName == "newloan") {
		//신규대출 한도조회
		params.STLN_CTLN_DVCD = args.STLN_CTLN_DVCD;
		params.stlnCtlnDvcd = args.STLN_CTLN_DVCD;
		url = "/eloan/stock/newloan/selectCreditLine.nh";
	}else if(args.pathName == "repayloan") {
		//대환대출 한도조회
		params.STLN_CTLN_DVCD = args.STLN_CTLN_DVCD;
		params.stlnCtlnDvcd = args.STLN_CTLN_DVCD;
		url    = "/eloan/stock/repayloan/selectCreditLine.nh";
	}else if(args.pathName == "addloan") {
		//추가대출 한도조회
		url = "/eloan/stock/addloan/selectCreditLine.nh";
	}else if(args.pathName == "increase") {
		//한도증액 한도조회
		url    = "/eloan/stock/increase/selectCreditLine.nh";
	}

	var option = new Object();
	option = {
		dimType : "stock",
		userName : args.userName
	};

	comm.callAjaxJson(url, params, callbackSlCrdLn, option);
}

const callbackSlCrdLn = function(resData) {

	var result = resData.result;
	var header = result.header;
	
	if (resData.pathName === "newloan") {
		// 디파이너리(애드브릭스) 이벤트 호출 : 스탁론_신규_대출한도조회 (대출한도 조회 완료 시점)
		fn_call_dfinery_event({ eventName: "stock_check_limitloan" });
	}

	//"S" : 성공
	if("S" != header.PRCS_RSLT_DVCD) {
		if (resData.pathName === "newloan") {
			// 디파이너리(애드브릭스) 이벤트 호출 : 스탁론_신규_한도조회실패 (한도조회 실패 시점)
			fn_call_dfinery_event({ eventName: "stock_fail_limitloan" });
		} else if (resData.pathName === "addloan") {
			// 디파이너리(애드브릭스) 이벤트 호출 : 스탁론_추가대출_한도조회실패 (한도조회 실패 시점)
			fn_call_dfinery_event({ eventName: "stock_addloan_fail_limitloan" });
		} else if (resData.pathName === "repayloan") {
			// 디파이너리(애드브릭스) 이벤트 호출 : 스탁론_대환_한도조회실패 (한도조회 실패 시점)
			fn_call_dfinery_event({ eventName: "stock_replace_fail_limitloan" });
		} else if (resData.pathName === "increase") {
			// 디파이너리(애드브릭스) 이벤트 호출 : 스탁론_한도증액_한도조회실패 (한도조회 실패 시점)
			fn_call_dfinery_event({ eventName: "stock_limitinc_fail_limitloan" });
		}
		
		var msgCnt   = resData.response.MESSAGE.MSG_CNT;
	 	var mnmsgCd  = resData.response.MESSAGE.MSG_GROUP[0].MNMSG_CD;
	 	var rspMsgAd = resData.response.MESSAGE.MSG_GROUP[0].RSP_MSG_AD;
	 	var rspMsgCn = resData.response.MESSAGE.MSG_GROUP[0].RSP_MSG_CN;
		/*
		 * ECTR000213 : 스탁론 운영시간이 아닙니다.(평일 8:30~16:30)
		 * ECOM000001 : 고객번호채번중 고객명을 입력하시기 바랍니다. : 입력값이 존재하지 않습니다.
		 * ECOM000001 : 개인고객번호채번시 고객식별번호(13자리)를 입력하시기 바랍니다. : 입력값이 존재하지 않습니다.
		 * ECOM001752 : 개인고객번호채번시 고객식별번호(13자리)를 입력하시기 바랍니다. : 입력항목 오류 입니다.
		 * ECTR000152 : RMS:대출중인 계좌가 아닙니다
		 * ECTR000111 : 당일 한도증액건이 있습니다. 확인요망
		 */
		if("ECTR000213" == mnmsgCd) {
			CommMsg.alert(rspMsgAd+"<br/>"+rspMsgCn);
			return;
		}else {
			var pathName = resData.pathName;
			var errMsg = rspMsgCn+"<br/>"+rspMsgAd;

			if(msgCnt > 0) {
				mnmsgCd  = resData.response.MESSAGE.MSG_GROUP[0].MNMSG_CD;
				rspMsgAd = resData.response.MESSAGE.MSG_GROUP[0].RSP_MSG_AD;
				rspMsgCn = resData.response.MESSAGE.MSG_GROUP[0].RSP_MSG_CN;

				errMsg = rspMsgCn+"<br/>"+rspMsgAd;
				if(errMsg == undefined || errMsg == '') {
					errMsg = rspMsgAd;
				}
			}

			if(pathName == 'increase' && mnmsgCd == 'ECTR000111'){
				var url = '/eloan/stock/increase/selectRequestNoneForm.nh';
				comm.goPage(url);
			}else {
				var msg    = '정상적으로 처리되지 않았습니다.';
				var option = {
					icon   : 'fail',
					detail : errMsg,
					addText: errMsg
				}
				CommMsg.alert(msg, function(data){}, option);
			}
		}

		return;
	}else {
		var pathName = resData.pathName;
		var layerId  = "";
		var url      = "";

		var denlDivS1 = resData.result.response.DATA.DENL_DIV_S1; //거절구분 N : no, Y : yes

		if("Y" == denlDivS1) {
			var formData = {};
			var errMsg  = resData.result.response.DATA.DENL_RSN_TEXT_S40;

			if(pathName == "newloan") {
				// 디파이너리(애드브릭스) 이벤트 호출 : 스탁론_신규_한도조회실패 (한도조회 실패 시점)
				fn_call_dfinery_event({ eventName: "stock_fail_limitloan" });
				
				//신규대출 한도조회
				layerId  = "creditLineImpossiblePop";
				url = "/eloan/stock/newloan/creditLineImpossiblePop.nh";
				formData = {'errMsg' : errMsg};
			}else if(pathName == "repayloan") {
				// 디파이너리(애드브릭스) 이벤트 호출 : 스탁론_대환_한도조회실패 (한도조회 실패 시점)
				fn_call_dfinery_event({ eventName: "stock_replace_fail_limitloan" });
			
				//대환대출 한도조회
				layerId  = "creditLineImpossiblePop";
				url = "/eloan/stock/repayloan/creditLineImpossibleForm.nh";
				errMsg  = resData.result.response.DATA.DENL_RSN_TEXT_S100;
				formData = {'errMsg' : errMsg};
			}else if(pathName == "addloan") {
				// 디파이너리(애드브릭스) 이벤트 호출 : 스탁론_추가대출_한도조회실패 (한도조회 실패 시점)
				fn_call_dfinery_event({ eventName: "stock_addloan_fail_limitloan" });
				
				//추가대출 한도조회
				layerId  = "creditLineImpossiblePop";
				url = "/eloan/stock/addloan/creditLineImpossiblePop.nh";
				formData = {
						'pathName' : pathName,
						'title'    : '추가대출 결과',
						'errMsg'   : errMsg
						};
			}else if(pathName == "increase") {
				// 디파이너리(애드브릭스) 이벤트 호출 : 스탁론_한도증액_한도조회실패 (한도조회 실패 시점)
				fn_call_dfinery_event({ eventName: "stock_limitinc_fail_limitloan" });
				
				//한도증액 한도조회
				layerId  = "creditLineImpossiblePop";
				url = "/eloan/stock/increase/loanRequestFailForm.nh";
				formData = {
						'pathName' : pathName,
						'title'    : '한도조회 결과',
						'errMsg'   : errMsg
						};
			}

			CommPop.layerPopup(layerId,url,formData);
		}else {
			if(pathName == "newloan") {
				// 디파이너리(애드브릭스) 이벤트 호출 : 스탁론_신규_한도조회성공 (한도조회 성공 시점)
				fn_call_dfinery_event({ eventName: "stock_success_limitloan" });
				
				//신규대출 한도조회
				url = "/eloan/stock/newloan/selectCreditLineForm.nh";
				comm.goPage(url);
			}else if(pathName == "repayloan") {
				// 디파이너리(애드브릭스) 이벤트 호출 : 스탁론_대환_한도조회성공 (한도조회 성공 시점)
				fn_call_dfinery_event({ eventName: "stock_replace_success_limitloan" });
				
				//대환대출 한도조회
				url = "/eloan/stock/repayloan/selectCreditLineForm.nh";
				comm.goPage(url);
			}else if(pathName == "addloan") {
				// 디파이너리(애드브릭스) 이벤트 호출 : 스탁론_추가대출_한도조회성공 (한도조회 성공 시점)
				fn_call_dfinery_event({ eventName: "stock_addloan_success_limitloan" });
				
				//추가대출 한도조회
				url = "/eloan/stock/addloan/selectCreditLineForm.nh";
				comm.goPage(url);
			}else if(pathName == "increase") {
				var lmtMaiAplcPsbAmtN18 = resData.result.response.DATA.LMT_MAI_APLC_PSB_AMT_N18; //한도증액신청가능금액_N18
				//한도증액 금액이 1만원 미만일때
				if(lmtMaiAplcPsbAmtN18 < 10000){
					// 디파이너리(애드브릭스) 이벤트 호출 : 스탁론_한도증액_한도조회실패 (한도조회 실패 시점)
					fn_call_dfinery_event({ eventName: "stock_limitinc_fail_limitloan" });
					
					layerId  = "creditLineImpossiblePop";
					url = "/eloan/stock/increase/loanRequestFailForm.nh";
					var errMsg = '한도증액 가능한 금액이 1만원 미만입니다.';
					formData = {
							'pathName' : pathName,
							'title'    : '한도조회 결과',
							'errMsg'   : errMsg
							};
					CommPop.layerPopup(layerId,url,formData);
				}else {
					// 디파이너리(애드브릭스) 이벤트 호출 : 스탁론_한도증액_한도조회성공 (한도조회 성공 시점)
					fn_call_dfinery_event({ eventName: "stock_limitinc_success_limitloan" });
					
					//한도증액 한도조회
					url = "/eloan/stock/increase/selectCreditLineForm.nh";
					comm.goPage(url);
				}
			}
		}

	}
}

/**
 * 약관 호출
 * arguments : gb(업무구분:stln, cdln, atfn, myhpg...)
 *       no(호출할 약관 번호)
 */
const agreeTermsDetail = function(gb, no, callback) {
	var isNew;
	var popTitObj = {
		"04" : "만기일 자동연장 신청 동의서",
		"05" : "신용정보 제공 활용에 대한 고객금리안내문",
		"08" : "자동이체 이용약관",
		"09" : "고객정보 취급방침",
		"12" : "개인정보 수집 이용에 관한 사항",
		"13" : "개인(신용)정보 필수적 수집 이용에 관한 사항",
		"14" : "개인(신용)정보 필수적 제공에 관한 사항",
		"15" : "개인(신용)정보 조회에 관한 사항",
		"30" : "여신거래 기본약관",
		"31" : "전자금융거래기본약관",
		"32" : "근질권 설정 계약서",
		"33" : "근질권 설정 확인 및 승낙(의뢰)서",
		"36" : "개인정보 수집 이용에 관한 사항",
		"37" : "개인정보수집 이용 활용 동의",
		"38" : "고유식별번호처리 동의",
		"39" : "본인확인 이용약관",
		"40" : "(통신사) 본인확인 이용약관",
		"45" : "주식매입자금대출 약관",
		"61" : "공공 마이데이터 개인(신용)정보 필수적 전체 동의서",
		"61_summary" : "공공 마이데이터 개인(신용)정보 필수적 요약 동의서",
		"62" : "개인(신용)정보 필수 요약 동의서",
		"69" : "개인(신용)정보 필수적 동의서",
		"70" : "개인(신용)정보 필수적 요약 동의서",
		"71" : "개인(신용)정보 선택 동의서",
		"72" : "개인(신용)정보 선택 요약 동의서",
		"75" : "개인(신용)정보 필수 동의서",
		"78" : "개인(신용)정보 선택 동의서",
		"79" : "개인(신용)정보 선택 요약 동의서",
	};

	// 자동차
	if(gb == "atfn") {
		popTitObj = {
			"05" : "개인(신용)정보 필수적 요약 동의서",
			"06" : "개인(신용)정보 필수적 동의서",

			"07" : "개인(신용)정보 필수적 동의서",
			"08" : "개인(신용)정보 필수적 요약 동의서",

			"11" : "개인(신용)정보 선택적 요약 동의서1",
			"12" : "개인(신용)정보 선택적 요약 동의서2",

			"13" : "개인(신용)정보 선택적 동의서1",
			"14" : "개인(신용)정보 선택적 동의서2",

			"61" : "공공 마이데이터 개인(신용)정보 필수적 전체 동의서",
			"61_summary" : "공공 마이데이터 개인(신용)정보 필수적 요약 동의서",
		};
		isNew = (no != "61" && no != "61_summary") ? "new_" : "";
	}

	var title = popTitObj[no];
	var url   = "/agree/" + isNew + "comm_pop_agree" + no + ".html";

	setTimeout(function(){
		CommPop.showAgreeTermsDetail(title, url, callback);
	}, 100);
};

/**
 * 약관 PDF 다운로드
 * fname : 파일이름(예: nhloan_0001)
 */
const agreeFileDownLoad = function(fname, callback) {

	var obj = {
		"nhloan_0001" : {
			"directory" : "eloan",
			"orgFileName" : "가계대출(신용,담보,전세자금) 설명서.pdf",
			"downloadFile" : "nhloan_0001.pdf",
		},
	};

	var fileObj = obj[fname];

	comm.fileDownload(fileObj.directory, fileObj.downloadFile, fileObj.orgFileName);
};

// [사업자아파트] 휴대폰인증 callbackFucn
var bizAptCallbackFunc = function(){
	var url = "/eloan/homestead/biz/ajaxBizConfirm.nh";
	var sendParam = JSON.parse(sessionStorage.getItem("bizLoanList"));

	comm.callAjaxJson(url, sendParam, function(resData){

		if(resData.resultType == "E"){
			CommMsg.alert(resData.errorMsg);
		} else {
			if(resData.result.header.PRCS_RSLT_DVCD != "E" && resData.result.data.PROC_RTCD_S1 == "S"){
				// 세션스토리지 저장된 금소법 데이터 삭제
				sessionStorage.removeItem("bizLoanList");
				// 신청완료 페이지 이동
				comm.goPage("/eloan/homestead/biz/selectApplyCompl.nh");
			} else {
				CommMsg.alert("통신중 오류가 발생하였습니다.");
			}
		}
	});
};

//스탁론 운영시간 확인
const stockUseHours = function(nowTime, callback){
	if(83000 >= nowTime || nowTime >= 163000) {
		var args = {
			msg : "스탁론 운영시간이 아닙니다.(평일 8:30~16:30)"
		}

		CommMsg.alert(args.msg, callback);
	}
}