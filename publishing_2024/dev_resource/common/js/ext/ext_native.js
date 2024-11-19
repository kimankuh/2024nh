/**
 * @설 명 : 스마트뱅킹 APP 연동 스크립트.
 * @dependency : jQuery-1.8 이상 버전.
 * @===========================================================================
 * @ 명세
 * @ ---신 규 연 동은 "NHCNative.sample1", "NHCNative.sample2" 참조해서 만드세요---
 * @===========================================================================
 * @변경이력:
 * 2018.07.18	Sungjun Park	신분증촬영 추가
 * 2024.03.13	접근성 관련 키패드 글자수 입력 추가
 * @DATE AUTHOR DESCRIPTION
 * @---------------------------------------------------------------------------
 */
var CON_NATIVE = {
	 IOS_RUN_TIMER : 250//IOS 타이머
};

 (/**
 * @param window
 * @param undefined
 */
function (window, undefined) {
	var NHCNative = {};
	window['NHCNative'] = window['NHCNative'] || NHCNative;

	/**
	 * 보안키패드(WEB->APP)
	 * @filedId : inputid
	 * @fieldLen : input의 maxlength
	 * @fieldLenMin : input의 minLength
	 * @title : input의 title
	 * @keypadType : number, alpha
	 * @viewType : full, ctrl
	 * @inputType : text, pass2
	 */
	NHCNative.callbackKeypad = null , 
	NHCNative.showkeypad = function(filedId, fieldLen, fieldLenMin, title, keypadType, viewType, inputType){

		try{
			if(typeof(fieldLenMin) == "undefined"){fieldLenMin = "0";}
			if($("[id="+filedId+"]").length > 1){
				return;
			}
			if(typeof(fieldLen) == "undefined"){
				return;
			}

			// 안드로이드
			if(comm.isAos) {
				var inputParam = "{'service':'SECURE_KEYPAD','params':{'keyboard_type': '" + viewType + "', 'keypad_type': '" + keypadType + "', 'label': '주민번호 뒷자리 입력', 'hint': '주민번호 뒤 7자리를 입력하세요', 'min_length': '" + fieldLenMin + "', 'max_length': '" + fieldLen + "', 'field_id': '" + filedId + "'}}";
				window.NativeBridge.callNativeFunc(inputParam, "NHCNative.callback_showkeypad");			

			// IOS
			} else {
				var inputParam = {"input": {
											"service": "SECURE_KEYPAD",
											"params": {
														"keyboard_type"	: viewType,
														"keypad_type"	: keypadType,
														"label"			: "주민번호 뒷자리 입력",
														"hint"			: "주민번호 뒤 7자리를 입력하세요",
														"min_length"	: fieldLenMin,
														"max_length"	: fieldLen,
														"field_id"		: filedId
													}
											},
											"callbackFunc": "NHCNative.callback_showkeypad"
								};

				webkit.messageHandlers.callbackHandler.postMessage(inputParam);
			}
		}catch(e){
		}
	};
	
	/**
	 * 보안키패드 callback
	 */
	NHCNative.callback_showkeypad = function(encData){
		 try{
			if(encData.params.input_state != "none"){
					var length = encData.params.input_length;
					var fieldId = encData.params.field_id
					var dummyData = "";
					for(i=0; i<length; i++) {
						dummyData = dummyData + "*";
					}

					$(":input#"+fieldId).val(dummyData);
					$(":input#_RAE2E_"+fieldId).val(encData.params.enc_data);
					// 접근성 입력된 글자수 적용
					if( length > 0 ) {
						$(":input#"+fieldId).parent().attr("title", length+"자 입력됨");
					}
			 }
			 if((typeof NHCNative.callbackKeypad == "function")){
				 NHCNative.callbackKeypad(encData);
			 }

		 }catch(e){
		}
	};

	// 본인인증 (WEB -> APP)_
	NHCNative.auth = function(signData, requestType, provider, name, birth, phone) {
		if(!comm.channel == 'PW') return;
		try {
			// 안드로이드
			if(comm.isAos) {
				var inputParam = {
									"service": "DELFINO_AUTH",
									"params": {
												"sign_data"		: signData,
												"request_type"	: requestType,
												"provider"		: provider,
												"name"			: name,
												"birth"			: birth,
												"phone"			: phone
											}
								};
				window.NativeBridge.callNativeFunc(JSON.stringify(inputParam), "NHCNative.callback_auth");

			// IOS
			} else {
				var inputParam = {"input": {
											"service": "DELFINO_AUTH",
											"params": {
														"sign_data"		: signData,
														"request_type"	: requestType,
														"provider"		: provider,
														"name"			: name,
														"birth"			: birth,
														"phone"			: phone
													}
											},
											"callbackFunc": "NHCNative.callback_auth"
								};

				webkit.messageHandlers.callbackHandler.postMessage(inputParam);
			}
		} catch(e) {
		}
	};

	NHCNative.callback_auth = function(output) {
		if(!comm.channel == 'PW') return;
		try {
			if(output.result.code == "0000") {
				JUtilForm.appendHidden($("#delfinoCertForm"), "PKCS7", output.params.signed_data);
				JUtilForm.appendHidden($("#delfinoCertForm"), "VID_RANDOM", output.params.vid_random);
				
				goCertConfirm();
			} else {
				CommMsg.alert('오류가 발생하였습니다. ' + output.result.message);
			}

		} catch(e) {
		}
	};

}(window));