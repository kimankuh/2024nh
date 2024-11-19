/*
 * @설 명 : 가상 키패드 설정 스크립트.
 * @dependency : jQuery-1.8 이상 버전.
 * @2단계까지의 name space 는 package.js 에 정의 되어 있다.
 * @===========================================================================
 * @변경이력:
 * @DATE AUTHOR DESCRIPTION
 * @---------------------------------------------------------------------------
 * @변경 이력은 이곳에 추가 합니다.
 */
(function ($) {
    /**
     * ECMAScript 5 Strict Mode.
     */
    "use strict";
    /**
     * 가상 키패드(nFilter) 설치 클래스.
     *
     * @class
     * @param device
     */
    ext.keyPad = function (device) {
        /** 가상키패드 디바이스 종류. */
        this.device = device;        
    };

    /**
     * 가상 키패드 메서드.
     */
    ext.keyPad.prototype = {
        /**
         * 가상 키패드 초기화.
         *
         * @param form
         */
        init : function (form, cbFunc) {
        	// 필드 설정.
			this.setField(form, cbFunc);
        },
        /**
         * 가상 키패드 field setting.
         *
         * @param form
         */
        setField : function (form, cbFunc) {
//			return;//E2E 적용 테스트
			
        	var $this = this;
			var inputs = $(form || document.body).find(':input').filter('[data-tk-kbdType]');
			NHCNative.callbackKeypad = cbFunc;

			$(inputs).each(function (inx) {
				var keySecStr = getAttrDataValue(this, 'tk-kbdtype');
				if(keySecStr == ""){
					return;
				}
				// id 속성 없으면 생성해준다.
				if (!this.id)
					$(this).attr('id', this.name);
				//if(IS_SMART)
					$(this).attr('readonly', true);
				//else
					//$(this).removeAttr('readonly');
				
				$(this).css("-webkit-touch-callout","none");
				$(this).css("-webkit-user-select","none");
				
				var maxlen = $(this).attr('maxlength');
				var minLen = $(this).attr('minlength');
				var inputId = $(this).attr("id");
				var keypadTitle = $(this).attr('title');
				var viewType = "";//fullview,ctrlview
				var keypadType = "";//alpha,number
				var inputType = "";//text,pass2
				var keytag = '<input type="hidden" name="_RAE2E_'+this.name+'" id="_RAE2E_'+inputId+'" />';
				
				//documentReady를 2번씩 호출하는 개발자가 있다. 히든input을 기준으로 한번만 Event 설정하도록 한다.
				if($("#_RAE2E_"+this.id).length <= 0){
					if (keySecStr.indexOf('number') > -1 || keySecStr.indexOf('numberF') > -1){//Full + 숫자
						viewType = "ctrlview";
						keypadType = "number";
					}else if(keySecStr.indexOf('qwerty') > -1 || keySecStr.indexOf('qwertyF') > -1){//Full + 쿼티
						viewType = "ctrlview";
						keypadType = "alpha";
					}
					if($(this).attr("type") == "password"){
						inputType = "pass2";	
					}else{
						inputType = "text";
					}
                	$(this).after(keytag);
                	
            		if($(this).attr('disabled') == 'disabled')
            			return;
            		JUtilForm.clearE2EInput(form,$(this).attr("id"));
            		//실제 전문길이 말고 앱한테 최대길이 주는값 ex)otppwd는 전문이 8인데 실제 최대입력은 6인경우, filter는[6,8]설정, e2e-maxlength=6설정
            		var e2eMaxLen = $(this).data("e2e-maxlength");
            		if(!e2eMaxLen){e2eMaxLen = maxlen;};
    				//$(":input#"+inputId).val('');
    				//$(":input#_RAE2E_"+inputId).val('');	
    				NHCNative.showkeypad(inputId, e2eMaxLen, minLen, keypadTitle, keypadType, viewType, inputType);

    				$(form).find("#"+this.id).parent().bind('click focus', function(){
                		if($(this).attr('disabled') == 'disabled')
                			return;
                		JUtilForm.clearE2EInput(form,$(this).attr("id"));
                		//실제 전문길이 말고 앱한테 최대길이 주는값 ex)otppwd는 전문이 8인데 실제 최대입력은 6인경우, filter는[6,8]설정, e2e-maxlength=6설정
                		var e2eMaxLen = $(this).data("e2e-maxlength");
                		if(!e2eMaxLen){e2eMaxLen = maxlen;};
        				//$(":input#"+inputId).val('');
        				//$(":input#_RAE2E_"+inputId).val('');	
        				NHCNative.showkeypad(inputId, e2eMaxLen, minLen, keypadTitle, keypadType, viewType, inputType);
                	});
                }
			});
        },
        /**
         *  계정계 전문에 맞게 파싱
         */
        encDataConvert : function (encData, inputMaxLen) {
        	if(typeof(encData) == "undefined" || encData == "" || typeof(inputMaxLen) == "undefined" || inputMaxLen == ""){
        		if(RUNNING_MODE == "L" || RUNNING_MODE == "D"){
        			alert("[E2E001]암호화값이 잘못 되었습니다.");
        		}
        		return;
        	}
        	var encDataParse = "_RA_E2E_SEED_" + encData +  "_/RA_E2E_SEED_";
    		encDataParse += "_E2E123_PAD: ;ALIGN:L;ORI_DT:;FIELD_LEN:" + inputMaxLen + "_/E2E123_";
//    		encDataParse += "_E2E123_PAD: ;ALIGN:R;ORI_DT:;FIELD_LEN:" + inputMaxLen + "_/E2E123_";//TEST
    		return encDataParse;
        },
        /**
         * 가상키패드 시작
         *
         */
        start : function () {
        }
    };
})(jQuery);

