/*
 * @설 명 : 공통 Utility 스크립트 함수 정의.
 * @dependency : jQuery-1.8 이상 버전.
 * @===========================================================================
 * @변경이력:
 * @DATE AUTHOR DESCRIPTION
 * @---------------------------------------------------------------------------
 * @변경 이력은 이곳에 추가 합니다.
 */

/** 페이지 로딩시 서버 시간. */
var SYSTEM_TIME;
/** 서버와 로컬 시간 차(ms) */
var SYSTEM_TO_LOCAL_TIME = 0;
/** 공통코드 obj */
var COMMON_CODE_LIST;

/**
 * 공통 유틸 클래스.
 *
 * @class
 */
Utils = function($) {
    return {
        /** 윈도우 오픈 객체 */
        winObj : null,
        /**
         * window 대한 function 모음
         *
         * @class
         */
        window : {
            /**
             * 팝업창
             *
             * @param {form}
             *            폼
             * @param {url}
             *            주소
             * @param {winname}
             *            팝업창 이름
             * @param {w}
             *            팝업창 넓이
             * @param {h}
             *            팝업창 높이
             * @param {x}
             *            팝업창 X 위치
             * @param {y}
             *            팝업창 Y 위치
             * @param {scroll}
             *            표시 여부
             * @param {isModal}
             *            모달 여부
             */
            windowOpen : function(form, url, winname, w, h, x, y, scroll, isModal) {
                var view = JUtilWindow.getViewport();

                //2016.06.15  jhwon x,y 정상작동하지 않음.
                /*
                 * 일괄적으로 팝업의 위치를 브라우져의 가운데에 위치하도록 수정한것으로 판단됨.
                 *
                 * 그리하여, 0,0 기본으로 입력한경우는 창을 가운데 위치하고, 아닌경우 브라우져기준으로 위치 조정함.
                 * */

                if(x == 0 && y == 0){
                	x = parseInt(view.width / 2) - parseInt(w / 2) ;
                	y = parseInt(view.height / 2) - parseInt(h / 2) ;

                } else {
                	x =  (x || 0);
                	y =  (y || 0);
                }

                x = parseInt(x, 10) + window.screenLeft;
                y = parseInt(y, 10) + window.screenTop;

                var features = "width=" + w + ",height=" + h + ",left=" + x + ",top=" + y + ",scrollbars=" + "yes"
                //        + ",menubar=no,toolbar=no,location=no,directories=no,status=no,resizable=no";
                		  + ",menubar=no,toolbar=no,location=no,directories=no,status=no,resizable=yes";	//2016-08-08 송병상추가 - resizable 기능이 firefox 3.0 이후 나 chrome 최신 버젼에선 지원하지 않기에 전 브라우져 공통으로 풀어놓는다.

                Utils.winObj = window.open("", winname, features);
                var _targetUrl= url;
                if(_targetUrl.indexOf("/ib20") > -1){
                	_targetUrl = url.substring(url.indexOf("/ib20"));
                }
                
                form.action = _targetUrl;
                form.target = winname;
                form.method = "post";
                form.submit();
                form.target = "_self";
                form.action = "";

                return Utils.winObj;
            },
            /**
             * 현재 스크롤 위치를 반환 한다.
             *
             * @returns
             */
            getNowScroll : function() {
                var de = document.documentElement;
                var b = document.body;
                var now = {};

                now.X = document.all ? (!de.scrollLeft ? b.scrollLeft : de.scrollLeft)
                        : (window.pageXOffset ? window.pageXOffset : window.scrollX);
                now.Y = document.all ? (!de.scrollTop ? b.scrollTop : de.scrollTop)
                        : (window.pageYOffset ? window.pageYOffset : window.scrollY);

                return now;
            },
            /**
             * ViewPort를 가져온다.
             */
            getViewport : function() {
                return {
                    width : $(window.top).outerWidth(),
                    height : $(window.top).outerHeight()
                };
            },
            /**
             * 쿠키에 저장된 값을 반환한다.
             *
             * @param name
             *            쿠키 이름
             * @return 쿠키 이름에 대한 값을 반환. 없는 경우에는 ""를 반환.
             */
            getCookie : function(name) {
                var arg = name + "=";
                var alen = arg.length;
                var clen = document.cookie.length;
                var i = 0;
                while (i < clen) {
                    var j = i + alen;
                    if (document.cookie.substring(i, j) == arg) {
                        return JUtilWindow.getCookieVal(j);
                    }
                    i = document.cookie.indexOf(" ", i) + 1;
                    if (i == 0)
                        break;
                }
                return "";
            },
            /**
             * 쿠키를 저장한다.
             *
             * @param name
             *            쿠키 이름
             * @param value
             *            쿠키 값
             * @param expires
             *            쿠키의 유효 일 EX) JUtilWindow.getExpDate(7,0,0)
             * @param path
             * @param domain
             * @param secure
             */
            setCookie : function(name, value, expires, path, domain, secure) {
                if (!path)
                    path = "/";

                document.cookie = name + "=" + escape(value) + ((expires) ? "; expires=" + expires : "")
                        + ((path) ? "; path=" + path : "") + ((domain) ? "; domain=" + domain : "")
                        + ((!secure) ? "" : "; secure");
            },
            /**
             * 쿠키를 삭제한다.
             *
             * @param name
             *            삭제할 쿠키 이름
             * @param path
             * @param domain
             */
            deleteCookie : function(name, path, domain) {
                if (!path)
                    path = "/";

                if (JUtilWindow.getCookie(name))
                    document.cookie = name + "=" + ((path) ? "; path=" + path : "")
                            + ((domain) ? "; domain=" + domain : "") + "; expires=Thu, 01-Jan-70 00:00:01 GMT";
            },
            /**
             * 쿠키를 저장할 때 필요한 적합한 형식의 유효기간을 반환한다.
             *
             * @param days
             *            쿠키가 유효할 일 (예를 들어 3 일 동안 유효해야 하면 3을 입력)
             * @param hours
             *            쿠키가 유효할 시간 (예를 들어 2 시간 동안 유효해야 하면 2를 입력)
             * @param minutes
             *            쿠키가 유효할 분 (예를 들어 30 분 동안 유효해야 하면 30을 입력)
             */
            getExpDate : function(days, hours, minutes) {
                var expDate = new Date();
                if (typeof days == "number" && typeof hours == "number" && typeof hours == "number") {
                    expDate.setDate(expDate.getDate() + parseInt(days, 10));
                    expDate.setHours(expDate.getHours() + parseInt(hours, 10));
                    expDate.setMinutes(expDate.getMinutes() + parseInt(minutes, 10));
                    return expDate.toGMTString();
                }
            },
            /**
             * 쿠키 값을 읽을 때 사용하는 함수
             *
             * @param {Object}
             *            offset
             */
            getCookieVal : function(offset) {
                var endstr = document.cookie.indexOf(";", offset);
                if (endstr == -1) {
                    endstr = document.cookie.length;
                }
                return unescape(document.cookie.substring(offset, endstr));
            },
            /**
             * event stop
             *
             * @param event
             * @return
             */
            eventStop : function(e) {
                if (e.stopPropagation) {
                    e.preventDefault();
                    e.stopPropagation();
                } else {
                    e.cancelBubble = true;
                }
                e.returnValue = false;
            },
            /**
             * window 스크롤바 가로 사이즈 반환.
             *
             * @returns
             */
            getScrollBarWidth : function() {
                var inner = document.createElement('p');
                inner.style.width = "100%";
                inner.style.height = "200px";

                var outer = document.createElement('div');
                outer.style.position = "absolute";
                outer.style.top = "0px";
                outer.style.left = "0px";
                outer.style.visibility = "hidden";
                outer.style.width = "200px";
                outer.style.height = "150px";
                outer.style.overflow = "hidden";
                outer.appendChild(inner);

                document.body.appendChild(outer);
                var w1 = inner.offsetWidth;
                outer.style.overflow = 'scroll';
                var w2 = inner.offsetWidth;
                if (w1 == w2)
                    w2 = outer.clientWidth;

                document.body.removeChild(outer);

                return (w1 - w2);
            },

            /**
             *  팝업 탭 로딩시 화면 리사이즈
             * @param popLayer
             * @returns
             */
            resizeTab : function(popLayer) {
            	if(popLayer) {
            		popLayer.extBlock.setLayerPosition();
            	}
            },

            /**
             * 문자열로 된 함수명를 호출한다.
             * @param funcName
             * @param arguments
             * @returns
             */
            callFunction : function(funcName, args) {
            	var fn = window[funcName];
            	args = (args) ? args : null;
            	if(typeof fn === 'function') {
            		fn(args);
            	}
            }
        },
        /**
         * form 에 대한 function 모음
         *
         * @class
         */
        form : {
            /**
             * Form 을 생성하여 리턴합니다.
             */
            createForm : function(id, dest) {
                if (!id){
                	// id 를 넣지 않을경우 form 이 계속 생성되는것 주의!
                	id = '_newForm' + JUtilDate.getSystemTime();
                }
                $('#' + id).remove(); // 이미 존재하면 삭제.
                $(document.body).append("<form method='post' id='" + id + "' name='" + id + "'></form>");

                if ( dest ){
                	var form = $('#' + id);
            		$.each($("#"+dest).find(":input"), function(idx){
                		var name = $(this).attr("name");
                		var type = $(this).attr('type');
            			var value = $(this).val();
            			if ( type != 'radio' && type != 'checkbox'){
            				appendHidden(form, name, value, true);
            			} else {
            				if ( $(this).attr('type') == 'radio' ){
            					$(this).is(":checked") == true ? appendHidden(form, name, value) : "";
            				} else if ( $(this).attr('type') == 'checkbox' ){
            					if ( $(this).is(":checked") == true){
            						appendHidden(form, name, value);
            					}
            				} else {
            					appendHidden(form, name, value, true);
            				}
            			}
                	});
                }

                return document.getElementById(id);
            },

            /**
             * 히든폼을 생성하여 지정한 Form 에 추가합니다.
             *
             * @param {Object}
             *            form 폼 object Or id
             * @param {Object}
             *            name 필드 name
             * @param {Object}
             *            value 값
             * @param {boolean}
             *            isArray 배열 허용여부
             * @param {String}
             *            type input type (text, hidden) default : hidden
             */
            appendHidden : function(form, name, value, isArray, type) {
                if (typeof form != 'object' && form.indexOf('#') == -1)
                    form = '#' + form;

                if (isArray == undefined || isArray == false) {
                    if ($(form).find('[name=' + name + ']').val()) {
                        $(form).find('[name=' + name + ']').val(value);
                        return $(form).find('[name=' + name + ']');
                    }
                    $(form).find('[name=' + name + ']').remove();
                }
                if (type == undefined)
                    type = 'hidden';

                var input = '<input type="' + type +'" name="' + name + '" value="' + value + '"/>';

                $(form).append(input);

                return $(input);
            },
            /**
             * Form 의 input 값을 초기화 한다.
             *
             * @param form
             */
            clearFormInput : function(form) {
                $(form).find(':input').each(function() {
                    if (this.type == 'select-one')
                        this.options[0].selected = true;
                    else if (this.type == 'checkbox' || this.type == 'radio')
                        $(this).attr('checked', false);
                    else
                        $(this).val('');
                });
            },
            /**
             * ie8 에서 보안문제로 파일 선택시 실제 경로가 fakepath 로 바뀌었는지 확인.
             */
            isFakepath : function() {
                var ua = window.navigator.userAgent;
                if (ua.indexOf("MSIE") > -1) {
                    var inputs = document.getElementsByTagName("input");
                    for ( var i = 0; i < inputs.length; i++) {
                        if (inputs[i].type == 'file') {
                            if (inputs[i].value.indexOf("\\fakepath\\") > -1)
                                return true;
                        }
                    }
                }
                return false;
            },
            /**
             * ie8 에서 보안문제로 파일 선택시 실제 경로를 fakepath 로 바뀐 파일 경로를 실제 경로로 대체.
             */
            reFakepath : function(obj) {
                var ua = window.navigator.userAgent;
                if (ua.indexOf("MSIE") > -1) {
                    if (obj.value.indexOf("\\fakepath\\") > -1) {
                        obj.select();
                        var selectionRange = document.selection.createRange();
                        document.getElementById('filetext').value = selectionRange.text.toString();
                        obj.blur();
                    }
                }
            },

            /**
             * sourceForm에 있는 e2e데이터를 tragerForm으로 복사한다.(input 1개씩) 
             * @param targetForm
             * @param sourceform
             * @param inputId
             * @returns
             */
            copyE2EInput : function(targetForm, sourceform, inputId) {
            	targetForm = getFormObject(targetForm);
            	sourceform = getFormObject(sourceform);
            	var inputValue = $(sourceform).find("#"+inputId).val();
            	var inputE2EValue = $(sourceform).find("#_RAE2E_"+inputId).val();
            	if(inputValue != ""){
            		appendHidden(targetForm, inputId, inputValue);
            		appendHidden(targetForm, "_RAE2E_"+inputId, inputE2EValue);
            	}
            },
            /**
             * sourceForm에 있는 e2e데이터를 tragerForm으로 복사한다.(Form 전체 password만) 
             * @param targetForm
             * @param sourceform
             * @returns
             */
            copyE2EForm : function(targetForm, sourceform) {
            	targetForm = getFormObject(targetForm);
            	sourceform = getFormObject(sourceform);
            	$.each($(sourceform).find(':input').filter('[data-key-sec]').filter("[type=password]"), function(idx, object) {
            		JUtilForm.copyE2EInput(targetForm, sourceform, $(this).attr("id"));
            	});
            },
            /**
             * E2E 필드 초기화
             * @param form
             * @param inputId
             * @returns
             */
            clearE2EInput : function(form, inputId) {
//            	if ( $(form).find("#"+inputId).length > 0 && $(form).find("#_RAE2E_"+inputId).length > 0){
            	if ( $(form).find("#"+inputId).length > 0){
            		//스뱅 id가 기준
            		if($(form).find("#_RAE2E_"+inputId).length > 0){
            			$(form).find("#_RAE2E_"+inputId).val("");
            		}
            		$(form).find("#"+inputId).val("");
            	}
            },
            /**
             * E2E 필드 초기화 Form기준(password만)
             * @param form
             * @returns
             */
            clearE2EForm : function(form) {
            	form = getFormObject(form);
            	$.each($(form).find(':input').filter('[data-key-sec]').filter("[type=password]"), function(idx, object) {
            		JUtilForm.clearE2EInput(form, $(this).attr("id"));
            	});
            }
        },
        /**
         * input 에 대한 function 모음
         *
         * @class
         */
        input : {
            /**
             * 입력값의 bite 길이를 검사한다.
             *
             * @param {String}
             *            str
             */
            chkInputBite : function(str) {
                str = str.toString();
                var byteSize = 0;
                for ( var i = 0; i < str.length; i++)
                    byteSize += JUtilInput.strCharByte(escape(str.charAt(i)));
                return byteSize;
            },
            /**
             * 입력값의 bite 길이를 검사한다.
             *
             * @param {String}
             *            str
             * @param {Integer}
             *            maxbyte
             */
            getInputBite : function(str, maxbyte) {
                str = str.toString();
                var byteSize = 0;
                for ( var i = 0; i < str.length; i++) {
                    byteSize += JUtilInput.strCharByte(escape(str.charAt(i)));

                    if (maxbyte && byteSize > maxbyte)
                        return str.substring(0, i);
                }
                return str;
            },
            /**
             * 한글/영문 바이트 체크.
             */
            strCharByte : function(char) {
                if (char.substring(0, 2) == '%u')
                    return char.substring(2, 4) == '00' ? 1 : 2;
                else if (char.substring(0, 1) == '%')
                    return parseInt(char.substring(1, 3), 16) > 127 ? 2 : 1;
                else
                    return 1;
            },
            /**
             * 한글이 폼함되어 있는지 여부를 리턴한다.
             *
             * @param pValue :
             *            확인 값 리턴 : true, false
             */
            isHangul : function(str) {
                if ($.trim(str).length == 0)
                    return false;

                var rtnData = false;
                for ( var idx = 0; idx < str.length; idx++) {
                    var c = escape(str.charAt(idx));
                    if (c.indexOf("%u") > -1) {
                        rtnData = true;
                        break;
                    }
                }
                return rtnData;
            },
            /**
             * 문자열에서 시작문자이후 ~ 마지막문자이전 까지 잘라온다.
             *
             * @param org
             * @param start
             * @param end
             * @param endoffset
             * @return
             */
            subStartToEnd : function(org, start, end, endoffset) {
                if (org.indexOf(start) == -1)
                    return '';

                if (endoffset == undefined)
                    endoffset = 0;

                var rt = org.substring(org.indexOf(start));
                if (rt.indexOf(end) > -1)
                    return rt.substring(start.length, rt.indexOf(end, endoffset));
                else
                    return rt.substring(start.length);
            },
            /**
             * 문자열에서 시작문자이후 ~ 마지막문자이전 까지 다른문자로 대치한다.
             *
             * @param org
             * @param str
             * @param end
             * @param newStr
             * @returns
             */
            replaceStartToEnd : function(org, str, end, newStr) {
                if (org.indexOf(str) == -1 || org.indexOf(end) == -1)
                    return org;
                var rt = org.substring(0, org.indexOf(str) + 1);
                rt += newStr;
                rt += org.substring(org.indexOf(end));
                return rt;
            },
            /**
             * 금액필드에 금액을 자동 추가한다.
             *
             * @param form  입력필드가 속한 폼
             * @param moInput   입력필드
             * @param moArray   2차원 배열로 버튼, 금액. 단, 0일 경우 리셋버튼이 됨. [['mo5','50000'],['mo10','100000'],[버튼,숫자스트링],...]
             * @param moHangul  옵션. 한글금액 출력 영역
             */
            setMoney : function(form, moInput, moArray, moHangul) {
                var $form = $(form);
                var moInputNum;
                var moInputString;
                for(var i=0; i<moArray.length; i++){
                    $form.find(moArray[i][0]).bind("click", {mount:moArray[i][1]}, function(event) {
                        if($(moInput+'_userkeypad').is(":checked")){
                        	Message.alert('마우스로입력시에는 사용할 수 없습니다.');
                            return false;
                        }
                        if(event.data.mount=='0'){
                            moInputNum = 0;
                            moInputString = '0';
                        }else{
                            moInputNum = JUtilFormat.stripCommas($(moInput).val()) - 0;
                            mount = event.data.mount - 0;
                            moInputNum = moInputNum + mount;
                            moInputString = JUtilFormat.formatCommas(moInputNum);
                        }
                        var mountId = $(moInput).attr("id");
                        JUtilForm.clearE2EInput($form, mountId);

                        $(moInput).val(moInputString);
//                        JUtilFormat.toKoreanFromMoney(moTotal, moHangul, 10, "");
                        JUtilFormat.toKoreanFromMoney(moInputString, moHangul, 10, "");
                    });
                }
            },
            /**
             * 금액필드에 금액을 validation 체크 후 자동 추가
             *
             * @param form  입력필드가 속한 폼
             * @param moInput   입력필드
             * @param moArray   2차원 배열로 버튼, 금액. 단, 0일 경우 리셋버튼이 됨. [['mo5','50000'],['mo10','100000'],[버튼,숫자스트링],...]
             * @param moHangul  validation 체크 할 함수
             */
            setMoneyCheck : function(form, moInput, moArray, func) {
                var $form = $(form);
                var moInputNum;
                for(var i=0; i<moArray.length; i++){
                    $form.find(moArray[i][0]).bind("click", {mount:moArray[i][1]}, function(event) {
                        if($(moInput+'_userkeypad').is(":checked")){
                        	Message.alert('마우스로입력시에는 사용할 수 없습니다.');
                            return false;
                        }
                        if(event.data.mount=='0'){
                            moInputNum = 0;
                        }else{
                            moInputNum = JUtilFormat.stripCommas($(moInput).val()) - 0;
                            mount = event.data.mount - 0;
                            moInputNum = moInputNum + mount;
                        }
                        var mountId = $(moInput).attr("id");
                        JUtilForm.clearE2EInput($form, mountId);
                        var runFunc = func(moInputNum);
                    });
                }
            }
        },
        /**
         * selectbox 에 대한 function 모음
         *
         * @class
         */
        selectbox : {
            /**
             * 년도 selectBox를 생성한다. <br>
             * 조회시 년도가 필요할 경우 이 함수를 사용한다.
             *
             * @param {String}
             *            selectBoxY 타겟 selectBox
             * @param {String}
             *            selected check 될 option value.
             * @param {int}
             *            years 옵션에 나타낼 횟수.
             */
            setYearSelect : function(selectBoxY, selected, years) {
                if (years == undefined)
                    years = 5;

                if (selected == undefined)
                    selected = JUtilDate.getYear();

                var len = years < 0 ? years * -1 : years;
                var startY = years < 0 ? JUtilDate.getYear() : JUtilDate.getYear() + len;
                var endY = years < 0 ? JUtilDate.getYear() - len : JUtilDate.getYear();

                for ( var i = startY; i >= endY; i--) {
                    var inx = $(selectBoxY).get(0).length;
                    $(selectBoxY).get(0).options[inx] = new Option(i, i);
                    if ($(selectBoxY).get(0).options[inx].value == selected)
                        $(selectBoxY).get(0).options[inx].selected = true;
                }
            },

            /**
             * 년도 selectBox를 생성한다. <br>
             * 조회시 년도가 필요할 경우 이 함수를 사용한다.
             *
             * @param {String}
             *            selectBoxY 타겟 selectBox
             * @param {int}
             *            selected check 될 option value.
             * @param {int}
             *            selected value 기준 상위 년도 갯수.
             * @param {int}
             *            selected value 기준 하위 년도 갯수.
             */
            setYearSelectCenter : function(selectBoxY, selected, upyears, downyears) {
                if (upyears == undefined)
                    upyears = 4;

                if (downyears == undefined)
                    downyears = 4;

                if (selected == undefined)
                    selected = JUtilDate.getYear();   //서버기준 년도

                upyears = upyears < 0 ? upyears * -1 : upyears;
                downyears = downyears < 0 ? downyears * -1 : downyears;

                var startY = selected + upyears;
                var endY = selected - downyears;

                for ( var i = startY; i >= endY; i--) {
                    var inx = $(selectBoxY).get(0).length;
                    $(selectBoxY).get(0).options[inx] = new Option(i, i);
                    if ($(selectBoxY).get(0).options[inx].value == selected)
                        $(selectBoxY).get(0).options[inx].selected = true;
                }
            },
            /**
             * 월 selectBox를 생성한다. <br>
             * 조회시 월이 필요할 경우 이 함수를 사용한다.
             *
             * @param {String}
             *            selectBoxM 타겟 selectBox
             * @param {String}
             *            selected check 될 option value.
             */
            setMonSelect : function(selectBoxM, selected) {
                if (selected == undefined)
                    selected = new Date().getMonth() + 1;

                for ( var i = 0; i < 12; i++) {
                    var inx = $(selectBoxM).get(0).length;
                    var mon = (i + 1) + '';
                    mon = mon.length < 2 ? '0' + mon : mon;
                    $(selectBoxM).get(0).options[inx] = new Option(mon, mon);
                    if ($(selectBoxM).get(0).options[inx].value == selected)
                        $(selectBoxM).get(0).options[inx].selected = true;
                }
            },
            /**
             * 일 selectBox를 생성한다. <br>
             * 조회시 일이 필요할 경우 이 함수를 사용한다.
             *
             * @param {Object}
             *            selectBoxY 년
             * @param {Object}
             *            selectBoxM 월
             * @param {Object}
             *            selectBoxD 일
             * @param {String}
             *            selected check 될 option value.
             */
            setDaySelect : function(selectBoxY, selectBoxM, selectBoxD, selected) {
                var year = selectBoxY.value;
                var month = selectBoxM.value;

                if (year == '' || month == '')
                    return false;

                if (selected == undefined)
                    selected = new Date().getDate();

                days = JUtilDate.getLastDay(year, month);

                for (i = 0, j = 0; i < days; i++) {
                    j = (i < 9) ? '0' + (i + 1) : i + 1;
                    var inx = $(selectBoxD).get(0).length;
                    $(selectBoxD).get(0).options[inx] = new Option(j, j);
                    if ($(selectBoxD).get(0).options[inx].value == selected)
                        $(selectBoxD).get(0).options[inx].selected = true;
                }
            },
            /**
             * 시간 selectBox를 생성한다. <br>
             * 조회시 시간이 필요할 경우 이 함수를 사용한다.
             *
             * @param {Object}
             *            selectBoxT 시간
             * @param {String}
             *            selected check 될 option value.
             */
            setHourSelect : function(selectBoxT, selected) {
                if (selected == undefined)
                    selected = new Date().getHours();

                for ( var i = 0; i < 24; i++) {
                    j = (i < 9) ? '0' + (i + 1) : i + 1;
                    var inx = $(selectBoxT).get(0).length;
                    $(selectBoxT).get(0).options[inx] = new Option(j, j);
                    if ($(selectBoxT).get(0).options[inx].value == selected)
                        $(selectBoxT).get(0).options[inx].selected = true;
                }
            },
            /**
             * 분 selectBox를 생성한다. <br>
             * 조회시 분이 필요할 경우 이 함수를 사용한다.
             *
             * @param {Object}
             *            selectBoxMin 분
             * @param {String}
             *            selected check 될 option value.
             */
            setMinSelect : function(selectBoxMin, selected) {
                if (selected == undefined)
                    selected = new Date().getMinutes();

                for ( var i = -1; i < 59; i++) {
                    j = (i < 9) ? '0' + (i + 1) : i + 1;
                    var inx = $(selectBoxMin).get(0).length;
                    $(selectBoxMin).get(0).options[inx] = new Option(j, j);
                    if ($(selectBoxMin).get(0).options[inx].value == selected)
                        $(selectBoxMin).get(0).options[inx].selected = true;
                }
            },
            /**
             * 콤보박스에 option을 자동 추가한다
             *
             * @param codeList   코드리스트
             * @param optParam  {
             *                      codeSelect   콤보박스,
             *                      codeDefault   디폴트,
             *                      bottomOpt:{name:name,value:value} (최하단 요소 추가가 필요할 때),
             *                  }
             */
            setCombo : function(codeList, optParam) {
                var lst = codeList.CMN12INQ00000002V00_REC2;
                var name;
                var value;
                for( var i = 0; i < lst.length; i++){
                    name = lst[i].IBNK_CD_VLD_VAL_NM;
                    value = lst[i].CD_VLD_VAL;
                    var inx = $(optParam.codeSelect).get(0).length;
                    $(optParam.codeSelect).get(0).options[inx] = new Option(name, value);
                    if ($(optParam.codeSelect).get(0).options[inx].value == optParam.codeDefault)
                        $(optParam.codeSelect).get(0).options[inx].selected = true;
                }
                if( optParam.bottomOpt != null ){
                    var inx = $(optParam.codeSelect).get(0).length;
                    $(optParam.codeSelect).get(0).options[inx] = new Option(optParam.bottomOpt.name, optParam.bottomOpt.value);
                    if ($(optParam.codeSelect).get(0).options[inx].value == optParam.codeDefault)
                        $(optParam.codeSelect).get(0).options[inx].selected = true;
                }
            },
            /**
             * 코드로 값 세팅
             *
             * @param data   데이타
             * @param optParam  {
             *                      code   코드,
             *                      innerDiv  코드가 들어 갈 div
             *                  }
             */
            setCdNm : function(data, optParam) {
                var lst = data.CMN12INQ00000002V00_REC2;
                for( var i = 0; i < lst.length; i++){
                    if( optParam.code == lst[i].CD_VLD_VAL ){
                        $(optParam.innerDiv).html(lst[i].IBNK_CD_VLD_VAL_NM);
                        break;
                    }
                }
            },
            /**
             * 공통 코드 리스트 로딩
             * 해당 페이지에서 필요한 코드를 배열로 지정해 주면
             * 각 코드가 저장됨
             * 저장 후 콜백함수에 콤보 생성 메소드를 호출한다
             *
             * @param codeListName   코드리스트이름
             * @param callbackFunc   콜백함수
             * @param block 비동기 여부
             */
            getCommCdAll : function(codeListName, callbackFunc, block) {
                var paramForm = JUtilForm.createForm("formForCommonCodeAjaxCall");
                for( var i = 0; i < codeListName.length; i++){
                    appendHidden(paramForm, 'CD_KEY_ID', codeListName[i], true);
                }
                if ( block ){
                	callBlockAjax(paramForm, "CMNCMN030INQA00M", function(data){
                		COMMON_CODE_LIST = data;
                        callbackFunc();
                     }, block);
                } else {
                	 callAjax(paramForm, "CMNCMN030INQA00M", function(data){
                		 COMMON_CODE_LIST = data;
                         callbackFunc();
                     });
                }
            },
            /**
             * 공통 콤보박스
             *
             * @param codeSelect   콤보박스
             * @param codeListName[]   코드리스트이름
             * @param codeDefault   디폴트
             * @param bottomOpt {name:name,value:value} 최하단 요소 추가가 필요할 때
             */
            setCommCdCbo : function(codeSelect, codeListName, codeDefault, bottomOpt) {
                var lst = COMMON_CODE_LIST.CMN12INQ00000002V00_REC2;
                var name;
                var value;
                for( var i = 0; i < lst.length; i++){
                    if(lst[i].CD_TERMS_ENM == codeListName){
                        name = lst[i].IBNK_CD_VLD_VAL_NM;
                        value = lst[i].CD_VLD_VAL;
                        var inx = $(codeSelect).get(0).length;
                        $(codeSelect).get(0).options[inx] = new Option(name, value);
                        if ($(codeSelect).get(0).options[inx].value == codeDefault)
                            $(codeSelect).get(0).options[inx].selected = true;
                    }
                }
                if( bottomOpt != null ){
                    var inx = $(codeSelect).get(0).length;
                    $(codeSelect).get(0).options[inx] = new Option(bottomOpt.name, bottomOpt.value);
                    if ($(codeSelect).get(0).options[inx].value == codeDefault)
                        $(codeSelect).get(0).options[inx].selected = true;
                }
            },
            /**
             * 공통 코드로 값 세팅
             *
             * @param codeListName   코드리스트이름
             * @param code   코드
             */
            setCommCdNm : function(codeListName, code, innerDiv) {
                var lst = COMMON_CODE_LIST.CMN12INQ00000002V00_REC2;
                for( var i = 0; i < lst.length; i++){
                    if( lst[i].CD_TERMS_ENM == codeListName && code == lst[i].CD_VLD_VAL ){
                        $(innerDiv).html(lst[i].IBNK_CD_VLD_VAL_NM);
                        break;
                    }
                }
            },
            /**
             * 테이블 데이타 리턴
             *
             * @param codeListName   코드리스트이름
             * @param callbackFunc   콜백함수
             * @param optParam  {
             *                      code_param1:value,
             *                      code_param2:value,
             *                      code_param3:value,
             *                      code_param4:value,
             *                      code_param5:value,
             *                      block:true // 페이지 블럭 여부
             *                  }
             */
            getTblCdAll : function(codeListName, callbackFunc, optParam) {
                var paramForm = JUtilForm.createForm("formForTblCodeAjaxCall");
                appendHidden(paramForm, 'CODE_LIST_NAME', codeListName);
                appendHidden(paramForm, 'CODE_PARAM_1', optParam.code_param1);
                appendHidden(paramForm, 'CODE_PARAM_2', optParam.code_param2);
                appendHidden(paramForm, 'CODE_PARAM_3', optParam.code_param3);
                appendHidden(paramForm, 'CODE_PARAM_4', optParam.code_param4);
                appendHidden(paramForm, 'CODE_PARAM_5', optParam.code_param5);
                if ( optParam.block ){
                	callBlockAjax(paramForm, "CMNCMN031INQA00M", function(data){
                         callbackFunc(data);
                     }, optParam.block);
                } else {
                	 callAjax(paramForm, "CMNCMN031INQA00M", function(data){
                         callbackFunc(data);
                     });
                }
            },
            /**
             * 테이블 콤보박스
             *
             * @param codeSelect   콤보박스
             * @param codeListName   코드리스트이름
             * @param optParam  {
             *                      codeDefault:디폴트,
             *                      bottomOpt:{name:name,value:value} (최하단 요소 추가가 필요할 때),
             *                      code_param1:value,
             *                      code_param2:value,
             *                      code_param3:value,
             *                      code_param4:value,
             *                      code_param5:value
             *                  }
             */
            setTblCdCbo : function(codeSelect, codeListName, optParam) {//code_param1, code_param2, code_param3, codeDefault, bottomOpt
                JUtilSelect.getTblCdAll(codeListName, function(data){
                    JUtilSelect.setCombo(data, {codeSelect:codeSelect, codeDefault:optParam.codeDefault, bottomOpt:optParam.bottomOpt});
                }, optParam);
            },
            /**
             * 테이블 코드로 값 세팅
             *
             * @param codeListName   코드리스트이름
             * @param code   코드
             * @param innerDiv  코드가 들어 갈 div
             * @param optParam  {
             *                      code_param1:value,
             *                      code_param2:value,
             *                      code_param3:value,
             *                      code_param4:value,
             *                      code_param5:value
             *                  }
             */
            setTblCdNm : function(codeListName, code, innerDiv, optParam) {
                JUtilSelect.getTblCdAll(codeListName, function(data){
                    JUtilSelect.setCdNm(data, {code:code, innerDiv:innerDiv});
                }, optParam);
            }
        },
        /**
         * DATE 에 대한 function 모음
         *
         * @class
         */
        date : {
            /**
             * 로컬과 서버사이의 시간을 계산한다.
             *
             * @param systemTime
             * @returns
             */
            initSystemTime : function(systemTime) {
                SYSTEM_TIME = systemTime;
                if (SYSTEM_TIME && SYSTEM_TIME != '') {
                    var sysDt = new Date(parseInt(SYSTEM_TIME, 10));
                    var localdt = new Date();
                    SYSTEM_TO_LOCAL_TIME = sysDt.valueOf() - localdt.valueOf();
                }
            },

            /**
             * 현재 서버 날자 형식 반환.<br>
             * 서버와의 시간차를 계산해서 내려준다.
             *
             * @returns
             */
            getSystemDate : function() {
                var localDt = new Date();
                return new Date(localDt.valueOf() + SYSTEM_TO_LOCAL_TIME);
            },
            /**
             * 시스템 시각을 time 형식으로 반환<br>
             *
             * @returns
             */
            getSystemTime : function() {
                return this.toTimeString(this.getSystemDate());
            },
            /**
             * 현재 年을 YYYY형식으로 리턴
             *
             * @returns
             */
            getYear : function() {
                return this.getSystemDate().getFullYear();
            },
            /**
             * 현재 月을 MM형식으로 리턴
             *
             * @returns
             */
            getMonth : function() {
                var month = this.getSystemDate().getMonth() + 1;
                return month < 10 ? '0' + month : '' + month;
            },
            /**
             * 현재 日을 DD형식으로 반환
             *
             * @returns
             */
            getDay : function() {
                var day = this.getSystemDate().getDate();
                return day < 10 ? '0' + day : '' + day;
            },
            /**
             * 현재 Hour 을 HH형식으로 반환
             *
             * @returns
             */
            getHour : function() {
                var hour = this.getSystemDate().getHours();
                return hour < 10 ? '0' + hour : '' + hour;
            },
            /**
             * 현재 Minute 을 MM형식으로 반환
             */
            getMin : function() {
                var min = this.getSystemDate().getMinutes();
                return min < 10 ? '0' + min : '' + min;
            },
            /**
             * 현재 Second 을 SS형식으로 반환
             */
            getSec : function() {
                var sec = this.getSystemDate().getSeconds();
                return sec < 10 ? '0' + sec : '' + sec;
            },
            /**
             * YYYYMMDD 로 오늘 날짜 반환
             *
             * @return
             */
            getToday : function() {
                return this.getYear().toString() + this.getMonth().toString() + this.getDay().toString();
            },
            /**
             * YYYY-MM-DD HH:MM:SS 로 오늘 날짜 시간 반환
             *
             * @return today(2009-02-12 22:01:02)
             */
            getTodayTimeFormat : function() {
                return this.getYear() + '-' + this.getMonth() + '-' + this.getDay() + ' ' + this.getHour() + ':'
                        + this.getMin() + ':' + this.getSec();
            },
            /**
             * 두 날짜 사이의 일수를 계산하여 반환한다.
             *
             * @param date1
             *            문자열 데이터로 '20041012' 형식
             * @param date2
             *            문자열 데이터로 '20041103' 형식
             */
            getDaysBetween : function(date1, date2) {
                date1 = new Date(date1.substring(0, 4), date1.substring(4, 6) - 1, date1.substring(6, 8));
                date2 = new Date(date2.substring(0, 4), date2.substring(4, 6) - 1, date2.substring(6, 8));
                var DSTAdjust = 0;
                var oneMinute = 1000 * 60;
                var oneDay = oneMinute * 60 * 24;
                date1.setHours(0);
                date1.setMinutes(0);
                date1.setSeconds(0);
                date2.setHours(0);
                date2.setMinutes(0);
                date2.setSeconds(0);
                DSTAdjust = (date2.getTimezoneOffset() - date1.getTimezoneOffset()) * oneMinute;
                var diff = date2.getTime() - date1.getTime() - DSTAdjust;
                return Math.ceil(diff / oneDay);
            },
            /**
             * 자바스크립트 Date 객체를 Time 스트링으로 변환
             *
             * @param date:
             *            JavaScript Date Object return yyyyMMddHHmmSS
             */
            toTimeString : function(date) {
                var year = date.getFullYear();
                var month = date.getMonth() + 1;
                var day = date.getDate();
                var hour = date.getHours();
                var min = date.getMinutes();
                var sec = date.getSeconds();

                if (("" + month).length == 1)
                    month = "0" + month;
                if (("" + day).length == 1)
                    day = "0" + day;
                if (("" + hour).length == 1)
                    hour = "0" + hour;
                if (("" + min).length == 1)
                    min = "0" + min;
                if (("" + sec).length == 1)
                    sec = "0" + sec;

                return ("" + year + month + day + hour + min + sec);
            },
            /**
             * 자바스크립트 Date 객체를 Time 스트링으로 변환
             *
             * @param date:
             *            JavaScript Date Object return yyyyMMddHHmmSSsss
             */
            toTimeString2 : function(date) {
                var year = date.getFullYear();
                var month = date.getMonth() + 1;
                var day = date.getDate();
                var hour = date.getHours();
                var min = date.getMinutes();
                var sec = date.getSeconds();
                var millisec = date.getMilliseconds();

                if (("" + month).length == 1)
                    month = "0" + month;
                if (("" + day).length == 1)
                    day = "0" + day;
                if (("" + hour).length == 1)
                    hour = "0" + hour;
                if (("" + min).length == 1)
                    min = "0" + min;
                if (("" + sec).length == 1)
                    sec = "0" + sec;
                if (("" + millisec).length == 1)
                	millisec = "00" + millisec;
                if (("" + millisec).length == 2)
                	millisec = "0" + millisec;

                return ("" + year + month + day + hour + min + sec + millisec);
            },
            /**
             * YYYY + char + MM + char + DD 로 오늘 날짜 반환
             *
             * @param String
             *            char EX)"."
             * @return today EX) 2009.02.12
             */
            getFormatToday : function(char1) {
                return this.getYear() + char1 + this.getMonth() + char1 + this.getDay();
            },
            /**
             * YYYY년 MM월 DD일 로 오늘 날짜 반환
             *
             * @return today EX) 2009년 02월 12일
             */
            getFixFormatToday : function() {
                return this.getYear() + "년 " + this.getMonth() + "월 " + this.getDay() + "일";
            },
            /**
             * 특정일자에 년을 더한 날짜를 구한다.
             *
             * @param (String)
             *            years
             * @return (String) yyyyMMdd
             */
            getAddYears : function(years, date) {
                return this.getAddMonths(parseInt(years) * 12, date);
            },
            /**
             * 특정일자에 월를 더한 날짜를 구한다.(한편 넣기)<br>
             * EX) getAddMonths("2") 현재일 20090212 이면 return 값은 20090411
             *
             * @param (String)
             *            addMonth
             * @return (String) yyyyMMdd
             */
            getAddMonths : function(addMonth, date) {
                var before = date ? date : this.getToday();

                var year = Number(before.substring(0, 4));
                var mon = Number(before.substring(4, 6));
                var date = Number(before.substring(6, 8));

                // 이전/다음 월을 구함.
                var result = new Date(year, Number(mon) + Number(addMonth), 0);
                year = result.getFullYear();
                mon = result.getMonth() + 1;

                // 해당월의 마지막 일자.
                var lastDay = JUtilDate.getLastDay(year, mon);

                // 만으로 월을 계산하기 위하여 이전이면 +1 일 이후이면 -1 을 해준다.
                if (addMonth < 0 && lastDay < date) {
                    result = new Date(year, mon, 1);
                } else if (addMonth > 0 && lastDay < date) {
                    result = new Date(year, mon - 1, lastDay);
                } else {
                    result = new Date(year, mon - 1, date);
                }

                year = result.getFullYear();
                mon = result.getMonth() + 1;
                date = result.getDate();

                return year + '' + (mon < 10 ? '0' + mon : mon) + '' + (date < 10 ? '0' + date : date);
            },
            /**
             * 특정일자에 일자를 더한 날짜를 구한다. <br>
             * EX) getAddDays("2") 현재일 20090212 이면 return 값은 20090214
             *
             * @param (String)
             *            days
             * @param (String)
             *            date
             * @return (String) yyyyMMdd
             */
            getAddDays : function(days, date) {
                var before = date ? date : this.getToday();
                var date = new Date(before.substring(0, 4), Number(before.substring(4, 6)) - 1, Number(before
                        .substring(6, 8))
                        + Number(days));
                var year = String(date.getFullYear());
                var month = String(date.getMonth() + 1);
                var day = String(date.getDate());

                if (month.length == 1)
                    month = "0" + month;
                if (day.length == 1)
                    day = "0" + day;

                return '' + year + '' + month + '' + day;
            },
            /**
             * 해당 월의 마지막일자를 구한다.
             *
             * @param year
             *            조회년, month 조회월
             * @return 해당월의 마지막 일자
             */
            getLastDay : function(year, mon) {
                var month = mon - 1;
                var d = new Array(31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31);
                if (((0 == (year % 4)) && ((0 != (year % 100)) || (0 == (year % 400)))) && month == 1) {
                    return 29;
                } else {
                    return d[month];
                }
            },
            /**
             * 현재달의 첫 일자를 구한다.
             *
             * @param String
             *            년월일 구분자 EX) "."
             * @return 현재달의 첫 일자 EX) 2009.04.01
             */
            getMonthFirstDay : function(gbn) {
                var d, d2 = "";
                d = this.getSystemDate();
                d2 = new Date(d.getYear(), d.getMonth());
                var year = d2.getYear();
                var month = d2.getMonth() + 1;
                if (("" + month).length == 1) {
                    month = "0" + month;
                }
                var date = d2.getDate();
                if (("" + date).length == 1) {
                    date = "0" + date;
                }
                var firstDay = year + gbn + month + gbn + date;
                return firstDay;
            },
            /**
             * 현재달의 마지막 일자를 구한다.
             *
             * @param String
             *            년월일 구분자 EX) "."
             * @return 현재달의 마지막 일자 EX) 2009.04.01
             */
            getMonthLastDay : function(gbn) {
                var d, d2;
                d = this.getSystemDate();
                d2 = new Date(d.getYear(), d.getMonth() + 1, "");
                var year = d2.getYear();
                var month = d2.getMonth() + 1;
                if (("" + month).length == 1) {
                    month = "0" + month;
                }
                var date = d2.getDate();
                if (("" + date).length == 1) {
                    date = "0" + date;
                }
                var lastDay = year + gbn + month + gbn + date;
                return lastDay;
            },
            /**
             * 날자 설정.<br>
             * 더하거나 뺄 년/월/일의 포멧을 입력하면 계산값 반환. <br>
             * EX) setDate('addY-3); 3년전 날자 반환.
             *
             * @param df
             *            날자 포멧.
             * @return
             */
            setDate : function(df) {
                var isMiners = df.indexOf('-') > -1 ? -1 : 1;
                var addVal = JUtilFormat.toNumber(df) * isMiners;
                var date = df;
                if (df == 'today') {
                    date = JUtilDate.getToday();
                } else if (df.indexOf('addY') > -1) {
                    date = JUtilDate.getAddYears(addVal);
                } else if (df.indexOf('addM') > -1) {
                    date = JUtilDate.getAddMonths(addVal);
                } else if (df.indexOf('addW') > -1) {
                    date = JUtilDate.getAddDays(addVal * 7);
                } else if (df.indexOf('addD') > -1) {
                    date = JUtilDate.getAddDays(addVal);
                }
                return date;
            }
        },
        /**
         * validate 에 대한 function 모음
         *
         * @class
         */
        validate : {
            /**
             * 주민번호 유효성 검사
             *
             * @param {String}
             *            jumin
             */
            checkSSN : function(jumin) {
                var sum = 0;
                var key = "234567892345";

                if (jumin.length <= 12)
                    return true;

                for ( var i = 0; i < 12; i++)
                    sum += jumin.charAt(i) * key.charAt(i);

                sum = 11 - (sum % 11);
                endNo = sum % 10;

                if (jumin.charAt(12) != endNo)
                    return false;

                return true;
            },
            /**
             * 만 나이제한 체크
             *
             * @param {String}
             *            limitAge
             * @param {String}
             *            jumin
             */
            checkRealAge : function(limitAge, jumin) {
                var year = JUtilDate.getYear();
                var birth = 0;

                if (jumin.length < 13)
                    return true;

                if ("3478".indexOf(jumin.substring(6, 7)) > -1)
                    birth = '20' + jumin.substring(0, 6);
                else
                    birth = '19' + jumin.substring(0, 6);

                var limitDate = eval(year - limitAge) + "" + JUtilDate.getMonth() + "" + JUtilDate.getDay();

                if (eval(birth - limitDate) > 0)
                    return false;

                return true;
            },
            /**
             * 이메일 형식 체크
             */
            validEmail : function(obj, isAlert) {
                if ($(obj).val() == '')
                    return true;

                var check_email = $(obj).val().search(/^\s*[\w\~\-\.]+\@[\w\~\-]+(\.[\w\~\-]+)+\s*$/g);
                if (check_email != 0) {
                    if (isAlert != undefined && isAlert == true) {
                        Message.valid("이메일이 올바르지 않습니다.", '', function() {
                            $(obj).select();
                        });
                    }
                    return false;
                }

                return true;
            },
            /**
             * 전화번호 형식 체크
             */
            validPhone : function(rootId, phone1, phone2, phone3, isAlert) {
                var phone = $(rootId).find('#' + phone1).val() + '' + $(rootId).find('#' + phone2).val() + ''
                        + $(rootId).find('#' + phone3).val();

                if (phone.length < 1)
                    return true;

                check_phone = phone
                        .search(/^(0[2-8][0-5]?|01[01346-9])-?([1-9]{1}[0-9]{2,3})-?([0-9]{4})|((080-?[0-9]{3,4}|15(44|66|77|88))-?[0-9]{4})$/);
                if (check_phone != 0) {
                    if (isAlert != undefined && isAlert == true) {
                        Message.valid("전화번호 형식이 맞지 않습니다.", '',
                                function() {
                                    $(rootId).find('#' + phone2).select();
                                });
                    }
                    return false;
                }
                return true;
            },
            /**
             * 날자 형식 체크
             *
             * @param {String}
             *            date 체크할 날자
             */
            validDate : function(date) {
                var val = JUtilFormat.toNumber(date).toString();
                if (val.length < 4)
                    return true;

                var re = '';
                if (val.length == 4)
                    re = /^([0-9]{4})$/g;
                else if (val.length == 5)
                    re = /^([0-9]{4}[01])$/g;
                else if (val.length == 6)
                    re = /^(([0-9]{4})(0[1-9]|1[0-2]))$/g;
                else if (val.length == 7)
                    re = /^(([0-9]{4})(0[1-9]|1[0-2])([0123]))$/g;
                else if (val.length == 8)
                    re = /^(([0-9]{4})(0[1-9]|1[0-2])(0[1-9]|[12][0-9]|3[01]))$/g;
                else
                    return true;
//                if (val.length == 4)
//                	re = /^([12][0-9]{3})$/g;
//                else if (val.length == 5)
//                	re = /^([12][0-9]{3}[01])$/g;
//                else if (val.length == 6)
//                	re = /^(([12][0-9]{3})(0[1-9]|1[0-2]))$/g;
//                else if (val.length == 7)
//                	re = /^(([12][0-9]{3})(0[1-9]|1[0-2])([0123]))$/g;
//                else if (val.length == 8)
//                	re = /^(([12][0-9]{3})(0[1-9]|1[0-2])(0[1-9]|[12][0-9]|3[01]))$/g;
//                else
//                	return true;

                if (val.search(re) != 0)
                    return false;

                return true;
            },

            /**
             * 시작 <-> 종료 일자 유효성 검사
             *
             * @param obj
             * @param minDate
             * @param maxDate
             * @return
             */
            fromToDate : function(obj, minDate, maxDate) {
                var date = new Array();
                date[0] = '';
                date[1] = '';
                var val = JUtilFormat.toNumber($(obj).val());

                if (val.toString().length < 8)
                    return date;

                if (minDate) {
                    var minDt = JUtilDate.setDate(minDate); // 날자형 검증
                    if ( typeof(minDt) == 'string') {
                    	if ( $('#' + minDate).size() > 0 )
                    		minDt = '';
                    }
                    var sdt = $('#' + minDate); // 비교 필드 검증.
                    if (minDt == '' && $(sdt).size() > 0) {
                        if (JUtilValid.validDate($(sdt).val()))
                            if (JUtilFormat.toNumber($(sdt).val()).toString().length >= 8)
                                minDt = JUtilFormat.toNumber($(sdt).val());
                    }

                    if (minDt != '' && val < parseInt(minDt, 10)) {
                        date[0] = JUtilFormat.toDate(minDt, '-');
                        if ($(sdt).size() > 0)
                            date[0] = $(sdt).attr('title') + '[' + date[0] + ']';
                    }
                }

                if (maxDate) {
                    var maxDt = JUtilDate.setDate(maxDate);
                    if ( typeof(maxDt) == 'string') {
                    	if ( $('#' + maxDate).size() > 0 )
                    		maxDt = '';
                    }
                    var edt = $('#'+maxDate);
                    if (maxDt == '' && $(edt).size() > 0) {
                        if (JUtilFormat.toNumber($(edt).val()).toString().length >= 8)
                            if (JUtilValid.validDate($(edt).val()))
                                maxDt = JUtilFormat.toNumber($(edt).val());

                    }
                    if (maxDt != '' && val > parseInt(maxDt, 10)) {
                        date[1] = JUtilFormat.toDate(maxDt, '-');
                        if ($(edt).size() > 0)
                            date[1] = $(edt).attr('title') + '[' + date[1] + ']';
                    }
                }
                return date;
            }
        },
        /**
         * format 에 대한 function 모음
         *
         * @class
         */
        format : {
            /**
             * replace all. 대소문자 구분.
             *
             * @param source
             *            변경대상 문자열
             * @param oldStr
             *            변경전문자
             * @param replace
             *            변경후문자
             * @return
             */
            replaceAll : function(source, oldStr, newStr) {
                var re = new RegExp(oldStr, "g");
                source = source.replace(re, newStr);
                return source;
            },
            /**
             * json object -> array
             *
             * @param object
             * @return
             */
            JSONtoArray : function(object) {
                var results = new Array();
                for ( var property in object) {
                    var value = object[property];
                    if (value)
                        results.push(property.toString() + ':' + value);
                }
                return results;
            },
            /**
             * array 에서 name 에 해당하는값을 가져온다.
             *
             * @param array
             *            ({name=value,name=value...} 형식의 1차원 배열.)
             * @param dilimiter
             *            구분자
             * @return
             */
            ArrayToJSON : function(array, dilimiter) {
                if (dilimiter == undefined)
                    dilimiter = '=';
                var sub = new Object(); // 객체 값 입력.
                for ( var inx in array) {
                	if(typeof(array[inx]) != "string") continue;
                    var data = array[inx].split(dilimiter);
                    if (data.length > 1) {
                        sub[$.trim(data[0])] = $.trim(data[1]);
                    }
                }
                return sub;
            },

            StringToJSON : function(data, dilimiter, fieldDelimeter) {
                if (dilimiter == undefined)
                    dilimiter = '=';
                var sub = new Object(); // 객체 값 입력.
                var array = data.split(fieldDelimeter);
                for ( var inx in array ){
                	if(typeof(array[inx]) != "string") continue;
                	var data = array[inx].split(dilimiter);
                	 if (data.length > 1) {
                		 sub[$.trim(data[0])] = $.trim(data[1]);
                	 }
                }
                return sub;
            },
            /**
             * 문자열에서 html 태그 제거하기
             *
             * @param str
             *            문자열
             */
            stripTags : function(str) {
                var RegExpTag = /[<][^>]*[>]/gi; // 태그제거
                str = str.replace(RegExpTag, "");

                var RegExpJS = "<script[^>]*>(.*?)</script>"; // 스크립트 제거
                str = str.replace(RegExpJS, "");

                var RegExpCSS = "<style[^>]*>(.*?)"; // 스타일 제거
                str = str.replace(RegExpCSS, "");

                var RegExpDS = /<!--[^>](.*?)-->/gi; // 주석 제거
                str = str.replace(RegExpDS, "");

                //cookie8809 ID 고객 타기관 인증서 등록 불가로
                //기존문장 주석처리 2019.02.22 kwanghyun
                //var RegExpPh = /document.|object|cookie|&/gi; // 특정 문장 제거.
                var RegExpPh = /document.|object|&/gi; // 특정 문장 제거. 
                str = str.replace(RegExpPh, "");

                return str;
            },
            /**
             * 문자열에서 입력값 체크
             *
             * @param str
             *            문자열
             */
            //ext_validation에서 "문구"의 값은 입력 하실수 없습니다.", 로 문구조합하여 알림.
            stripTagsCheck : function(str) {
            	var returnStr = "";
                var RegExpTag = /[<][^>]*[>]/gi; // 태그제거
                if(str.search(RegExpTag) > -1){
                	returnStr += "< >";
                }
                var RegExpJS = "<script[^>]*>(.*?)</script>"; // 스크립트 제거
                if(str.search(RegExpJS) > -1){
                	returnStr += "<script>";
                }
                var RegExpCSS = "<style[^>]*>(.*?)"; // 스타일 제거
                if(str.search(RegExpCSS) > -1){
                	returnStr += "<style>";
                }
                var RegExpDS = /<!--[^>](.*?)-->/gi; // 주석 제거
                if(str.search(RegExpDS) > -1){
                	returnStr += "<!--";
                }


                var RegExpPh = /document\./gi; // 특정 문장 제거.
                if(str.search(RegExpPh) > -1){
                	returnStr += "document.";
                }

                RegExpPh = /&(.*?)=/gi; // 특정 문장 제거.
                if(str.search(RegExpPh) > -1){
                	returnStr += "& =";
                }

                return returnStr;
            },
            /**
             * 입력 변수에 3 자리마다 콤마(,)를 붙여 반환한다.
             *
             * @param numString
             *            콤마를 붙일 값
             */
            formatCommas : function(numString) {
                if (!numString)
                    return '';

                numString = numString + '';

                var re = /,|\s+/g;
                var retNumString = numString.replace(re, '');

                re = /(-?\d+)(\d{3})/;
                while (re.test(retNumString))
                    retNumString = retNumString.replace(re, "$1,$2");

                return retNumString;
            },
            /**
             * 콤마(,)를 제거하여 반환한다.
             *
             * @param {String}
             *            numString 콤마를 제거할 값
             */
            stripCommas : function(numString) {
                return this.replaceAll(numString, ',', '');
            },
            /**
             * 공백을 제거 한다.<br>
             * 데이터의 앞자리에 들어간 공백만 제거
             *
             * @param {String}
             *            stringToTrim
             */
            trim : function(stringToTrim) {
                if (typeof stringToTrim == 'object' || stringToTrim == null || stringToTrim == undefined
                        || stringToTrim == '')
                    return stringToTrim;
                else {
                    var re = /(^\s*)|(\s*$)|($\s*)/g;
                    return stringToTrim.replace(re, "");
                }
            },
            /**
             * 숫자 이외의 문자를 제거하여 반환.
             *
             * @param {String}
             *            numStr
             */
            toNumber : function(numStr) {
                if (!numStr)
                    return '';

                numStr = numStr + '';

                var m = numStr.substring(0, 1) == '-';
                var ret = numStr.replace(/[^\d]/g, '');

                return m ? ('-' + ret) : ret;
            },
            /**
             * 실수 형식으로 반환.
             *
             * @param {String}
             *            numStr
             * @param {int}
             *            point 소수점 자리수.
             */
            toFloat : function(numStr, point) {
                if (numStr == undefined)
                    numStr = "";

                var m = numStr.substring(0, 1) == '-';

                numStr = numStr + "";
                if (numStr == '')
                    return 0;
                if (point == undefined || point == '')
                    point = 2;

                var data = numStr.split('.');
                if( data.length == 1 )
                    return numStr;
                data[0] = parseInt(this.stripCommas(data[0]), 10);
                data[1] = this.stripCommas(data[1]) + '000000000000';
                data[1] = data[1].substring(0, point);
                return parseFloat( (m ? '-' : '' ) + data[0] + '.' + data[1]);
            },
            /**
             * 입력값 날자 시간 형식으로 반환.
             *
             * @param dateStr
             * @param se
             * @returns
             */
            toDateTime : function(dateStr, se) {
                var dateStrNoDash = this.toNumber(dateStr);
                var date = JUtilFormat.toDate(dateStrNoDash.substring(0, 8), se);
                var time = JUtilFormat.toTime(dateStrNoDash.substring(8), ':');
                return date + ' ' + time;
            },
            /**
             * 입력값 전화번호 형식으로 반환.
             *
             * @param num
             * @param se
             * @param isMask
             * @returns String
             */
            toPhone : function(num, se, isMask) {
                if (num) {
                    if(isMask) {
                        return num.replace(/(^02.{0}|^01.{1}|[0-9]{3})([0-9]+)([0-9]{4})/, '$1' + se + '****' + se + '$3');
                    }
                    return num.replace(/(^02.{0}|^01.{1}|[0-9]{3})([0-9]+)([0-9]{4})/, '$1' + se + '$2' + se + '$3');
                }
                else {
                    return '';
                }
            },
            /**
             * 입력값 날자형식으로 반환.
             *
             * @param dateStr
             * @param se
             * @returns
             */
            toDate : function(dateStr, se) {
                var re = '';
                var replace = '';

                var dateStrNoDash = this.toNumber(dateStr);

                if (dateStrNoDash.length == 4) {
                    re = /(\d{4})/;
                    replace = "$1";
                } else if (dateStrNoDash.length == 5) {
                    re = /(\d{4})/;
                    replace = "$1" + se;
                } else if (dateStrNoDash.length == 6) {
                    re = /(\d{4})(\d{2})/;
                    replace = "$1" + se + "$2";
                } else if (dateStrNoDash.length == 7) {
                    re = /(\d{4})(\d{2})/;
                    replace = "$1" + se + "$2" + se;
                } else {
                    re = /(\d{4})(\d{2})(\d{2})/;
                    replace = "$1" + se + "$2" + se + "$3";
                }

                return dateStrNoDash.replace(re, replace);
            },
            /**
             * 입력값 시.분.초 형식으로 반환.
             *
             * @param time
             * @param se
             * @returns
             */
            toTime : function(time, se) {
                if (time)
                    return this.toNumber(time).replace(/(\d{2})(\d{2})(\d{2})/, "$1" + se + "$2" + se + "$3");
                else
                    return '';
            },
            /**
             * 입력 변수에 3 자리마다 콤마(,)를 붙여 반환한다.
             *
             * @param numStr
             */
            toMoney : function(numStr) {
                if (!numStr)
                    return '';
                numStr = numStr.toString();
                //--------------------------------------
                // 맨처음 '0' 을 입력했을때 문제가 발생함 처음 '0' 을 입력했을때 삭제한다.
                //--------------------------------------
            	var zeroIndex = numStr.indexOf("0");
            	if(zeroIndex == 0) {
            		numStr = numStr.substring(zeroIndex + 1, numStr.length);
            	}//end if

                var m = numStr.substring(0, 1) == '-';
                numStr = numStr.replace(/[^\d]/g, '');
                numStr = JUtilFormat.formatCommas(numStr);

                if(numStr == "")
                	numStr = "0";
                if(numStr == "0")
                	m = false;

                return m ? ('-' + numStr) : numStr;
            },
            /**
             * 한글 종성체크
             *
             * @param {String}
             *            wd
             */
            isJongsong : function(wd) {
                var INDETERMINATE = 0;
                var NOJONGSONG = 1;
                var JONGSONG = 2;

                var word = new String(wd); /* 숫자가 들어오는 등에 대비해 무조건 문자열로 바꿈 */
                var numStr1 = "013678lmnLMN"; /* '조' 전까지는 0이 받침이 있는걸로 나옴 --; */
                var numStr2 = "2459aefhijkoqrsuvwxyzAEFHIJKOQRSUVWXYZ";
                /* bdgpt들은 읽기에 따라 받침이 있기도 하고 없기도 한다고 판단. */
                /* 대문자는 단독으로 읽을 때를 감안하면 받침 있다고 확정되는 것이 더 적음. */

                if (word == null || word.length < 1)
                    return INDETERMINATE;

                var lastChar = word.charAt(word.length - 1);
                var lastCharCode = word.charCodeAt(word.length - 1);

                if (numStr1.indexOf(lastChar) > -1)
                    return JONGSONG;
                else if (numStr2.indexOf(lastChar) > -1)
                    return NOJONGSONG;

                if (lastCharCode < 0xac00 || lastCharCode > 0xda0c) {
                    return INDETERMINATE;
                } else {
                    var lastjongseong = (lastCharCode - 0xAC00) % (21 * 28) % 28;
                    if (lastjongseong == 0)
                        return NOJONGSONG;
                    else
                        return JONGSONG;
                }
            },
            /* 내부함수 (을/를) */
            ul : function(s) {
                if (!JUtilInput.isHangul(s))
                    return s;
                var ul0 = new Array("(을)를", "를", "을");
                return s + ul0[JUtilFormat.isJongsong(s)];
            },
            /* 내부함수 (이/가) */
            ka : function(s) {
                if (!JUtilInput.isHangul(s))
                    return s;
                var ka0 = new Array("(이)가", "가", "이");
                return s + ka0[JUtilFormat.isJongsong(s)];
            },
            /* 내부함수 (은/는) */
            un : function(s) {
                if (!JUtilInput.isHangul(s))
                    return s;
                var un0 = new Array("(은)는", "는", "은");
                return s + un0[JUtilFormat.isJongsong(s)];
            },
            /* 내부함수 (와/과) */
            wa : function(s) {
                if (!JUtilInput.isHangul(s))
                    return s;
                var arr = new Array("(와)과", "와", "과");
                return s + arr[JUtilFormat.isJongsong(s)];
            },
            /**
             * 숫자타입의 문자를 한글로 표현한다.
             *
             * @param {String}
             *            numStr Number type의 String
             * @param {String}
             *            targetDivId 한글로 표현될 DivId
             * @param {int}
             *            rangeLength 제한자릿수
             * @param {HTMLElemtnt}
             *            targetEl 에러시 초기화할 Element (optional)
             * @return {boolean} 제한자리를 통과했는지 여부
             */
            toKoreanFromMoney : function(numStr, targetDivId, rangeLength, targetEl) {
                var arrayNum = new Array("", "일", "이", "삼", "사", "오", "육", "칠", "팔", "구");
                var arrayUnit = new Array("", "십", "백", "천", "만 ", "십만 ", "백만 ", "천만 ", "억 ", "십억 ", "백억 ", "천억 ",
                        "조 ", "십조 ", "백조");
                var arrayStr = new Array();

                numStr = JUtilFormat.toNumber(numStr);
                numStr = JUtilFormat.stripCommas(numStr);
                var len = numStr.length;

                var isValid = true;
                if (len > rangeLength) {
                	Message.alert('범위를 초과하였습니다.');
                    if (targetEl) {
                        targetEl.value = "0";
                    }
                    isValid = false;
                }
                var hanStr = "";
                if (isValid) {
                    for ( var i = 0; i < len; i++) {
                        arrayStr[i] = numStr.substr(i, 1);
                    }
                    code = len;
                    for ( var i = 0; i < len; i++) {
                        code--;
                        tmpUnit = "";
                        if (arrayNum[arrayStr[i]] != "") {
                            tmpUnit = arrayUnit[code];
                            if (code > 4) {
                                if ((Math.floor(code / 4) == Math.floor((code - 1) / 4) && arrayNum[arrayStr[i + 1]] != "")
                                        || (Math.floor(code / 4) == Math.floor((code - 2) / 4) && arrayNum[arrayStr[i + 2]] != "")) {
                                    tmpUnit = arrayUnit[code].substr(0, 1);
                                }
                            }
                        }
                        hanStr += arrayNum[arrayStr[i]] + tmpUnit;
                    }
                }

                if(numStr == "0"){
                	hanStr = "영";
                }
                if (targetDivId && targetDivId != "") {

                    //------------------------------------------------------------------------------------------
                    // XXX [2014.02.27] 퍼블 확인 결과, 한글금액이 input element 에 설정된다고 함. div ID 가 아닌 input ID 를 받게 수정
                    //------------------------------------------------------------------------------------------
                    var tagName = $((targetDivId.indexOf("#") == 0) ? targetDivId : "#" + targetDivId).prop("tagName");
                    if(hanStr!=""){
                        if (tagName == "SPAN") $((targetDivId.indexOf("#") == 0) ? targetDivId : "#" + targetDivId).text(hanStr + " 원");
                        else if (tagName == "INPUT") $((targetDivId.indexOf("#") == 0) ? targetDivId : "#" + targetDivId).val(hanStr + " 원");
                        else $((targetDivId.indexOf("#") == 0) ? targetDivId : "#" + targetDivId).html(hanStr + '원');
                    }else{
                        if (tagName == "SPAN") $((targetDivId.indexOf("#") == 0) ? targetDivId : "#" + targetDivId).text("");
                        else if (tagName == "INPUT") $((targetDivId.indexOf("#") == 0) ? targetDivId : "#" + targetDivId).val("");
                        else $((targetDivId.indexOf("#") == 0) ? targetDivId : "#" + targetDivId).html('');
                    }
//                    var oTargetDiv = $(targetDivId);
//                    if (oTargetDiv) {
//                        var oTextNode = new Object();
//                        var oChildNode = new Object();
//                        if (hanStr != "") {
//                            oTextNode = document.createTextNode('(' + hanStr + ' 원)');
//                            oChildNode = oTargetDiv.childNodes[0];
//                        } else {
//                            oTextNode = document.createTextNode(' ');
//                            oChildNode = oTargetDiv.childNodes[0];
//                        }
//                        if (oTargetDiv.childNodes.length != 0) {
//                            oTargetDiv.removeChild(oChildNode);
//                        }
//                        oTargetDiv.appendChild(oTextNode);
//                    }
                }
                return isValid;
            },
            /**
             * 문자열을 전각문자열로 변환 (문자열의 반각문자를 전각문자로 변환함)
             *
             * <pre>
             * 	문자의 폭이 일반적인 영문자의 고정 폭의 두 배 정도의 폭을 가지는 문자를 전각 문자라고 하고 이에 대응하여 전각 문자 폭의 절반을 폭으로 하는 문자를 반각 문자라고 한다.
             * 	전통적으로 구현상의 편리를 위해 반각 문자를 1바이트로 전각 문자를 2바이트로 인코딩하는 경우가 많았으나
             * 	전각·반각의 기준이 문자를 표현하는 바이트의 길이는 아니다.
             * 	유니코드를 비롯한 다양한 환경에서는 반각 문자와 전각 문자 모두 가변 바이트나 다중 바이트 인코딩을 사용하기도 한다
             * </pre>
             *
             * @param :
             *            is 변환할 문자열
             * @param :
             *            isAllNum 모든문자가 숫자인지 여부.
             * @return : 변환된 전각문자열
             * @see
             */
            convert2ByteCharToString : function(is, isAllNum) {
                // 만약 필드에 숫자만 들어가있다면 전각문자로 변환하지 않는다.
                if (isAllNum) {
                    if (!JUtilInput.isHangul(is))
                        return is;
                }

                var os = ""; // 컨버트된 문자
                var isBeforeSpace = false;
                for ( var i = 0; i < is.length; i++) {
                    var c = is.charCodeAt(i);
                    if (32 <= c && c <= 126) { // 전각으로 변환될수 있는 문자의 범위
                        if (c == 32) { // 스페이스인경우 ascii 코드 32
                            if (isBeforeSpace) { // 스페이스가 연속으로 2개 들어왔을경우 스페이스
                                                    // 하나로 처리하기 위함..
                                os = os + "";
                                isBeforeSpace = false;
                            } else {
                                os = os + unescape("%u" + (12288).toString(16));
                                isBeforeSpace = true;
                            }
                        } else {
                            os = os + unescape("%u" + (c + 65248).toString(16));
                            isBeforeSpace = false;
                        }
                    } else {
                        os = os + is.charAt(i);
                        isBeforeSpace = false;
                    }
                }
                return os;
            },

            /**
             * 문자열치환.
             *
             * @param {String}
             *            numString 치환할 값
             */
            coReplaceText : function(numString) {
            	numString = this.replaceAll(numString, ';', '&#59;');
            	numString = this.replaceAll(numString, '<', '&lt;');
            	numString = this.replaceAll(numString, '>', '&gt;');
            	numString = this.replaceAll(numString, '\"', '&qout;');
            	numString = this.replaceAll(numString, '\'', '&#039;');

            	return numString;
            },
            /**
             * 문자열 역치환.
             *
             * @param {String}
             *            numString 치환할 값
             */
            replaceXSSValue : function(str) {
            	if($.trim(str) == ""){
            		return;
            	}
            	str = this.replaceAll(str, '&gt;', '>' );//XSS5
            	str = this.replaceAll(str, '&lt;', '<' );//XSS4
            	str = this.replaceAll(str, '&#039;', '\'' );//XSS3
            	str = this.replaceAll(str, '&quot;', '"' );//XSS2
            	str = this.replaceAll(str, '&amp;', '&');//XSS1
            	
            	return str;
            }
        },
        /**
         * SNS 공유하기 관련
         *
         * @class
         */
        sns : {
            /**
             * SNS 공유하기 팝업 띄우기
             * @snsType FACEBOOK, TWITTER, KAKAOSTOARY
             * @openType WEB, APP
             */
        	snsShare : function(snsType, openType, url, txt, width, height) {
        		var o = {};
        		url = url.replace("#none","").replace("#wrap","");
//        		var today = JUtilDate.getToday();
//        		if(url.indexOf("?") > -1){
//        			url += "&today=" + today;
//        		}else{
//        			url += "?today=" + today;
//        		}
        		var eUrl = encodeURIComponent(url);
        		var eTxt = encodeURIComponent(txt);
        		var eBr = encodeURIComponent("\r\n");
//        		var protocol = location.protocol.replace(/:/g,"");// http, https
        		
        		var webUrlCheck 	=	"https://m.banking.nfcf.or.kr";
        		//운영이 아닐 경우
        		if(RUNNING_MODE!="P"){
        			webUrlCheck = "https://m.banking3.nfcf.or.kr";
        		}
        		
        		if(typeof(width) == "undefined"){
        			width = 500;
        		}
        		if(typeof(height) == "undefined"){
        			height = 500;
        		}

        		if(snsType == "FACEBOOK"){
        			o = {
        				url : 'http://www.facebook.com/sharer/sharer.php?u='+eUrl
        			};
        		}else if(snsType == "TWITTER"){
        			o = {
        				url : 'http://www.twitter.com/intent/tweet?text='+eTxt+'&url='+eUrl
        			};
        		}else if(snsType == "KAKAOSTOARY"){
        			if(openType == "WEB"){
        				o = {
        					url : 'http://story.kakao.com/share?url='+eUrl
        				};
        			}else if(openType == "APP"){
        				o = {
        				};
        			}
        		}else if(snsType == "KAKAOTALK"){
        			o = {};
        		}

        		if(typeof(o) != "undefined"){
        			if(openType == "WEB"){
        				var snsShareForm = JUtilForm.createForm("snsShareForm");
        				//form, url, name, w,h,x위치,y위치
        				if(snsType == "KAKAOTALK"){
    						if(typeof(Kakao) != "undefined"){
    							setTimeout(function(){
									/* 카카오톡링크 V1 
	    							Kakao.Link.sendTalkLink({
	    								label : txt +" " +url
	    							});*/

									// 카카오톡링크 V2 적용 (2018.06.08)
    								Kakao.Link.sendDefault({  
										objectType : 'text',
										text : txt,
										link : {
											webUrl 			: webUrlCheck,
											mobileWebUrl 	: webUrlCheck
										}
	    							});

    							},300);
    						}
    					}else{
    						JUtilWindow.windowOpen(snsShareForm, o.url, "snsShare", width, height, 10, 10);
    					}
        			}else if(openType == "APP"){
    					if(snsType == "FACEBOOK" || snsType == "TWITTER" ){
    						if(typeof(KNBNative) != "undefined"){
//         						KNBNative.openPopup(o.url);
    						}
    					}else if(snsType == "KAKAOSTOARY"){
    						if(typeof(Kakao) != "undefined"){
    							Kakao.Story.open({
    								url : url,
    								text : txt//이거는 인코딩 하면안됨
    							});
    						}
    					}else if(snsType == "KAKAOTALK"){
    						if(typeof(Kakao) != "undefined"){
    							setTimeout(function(){ 
    								try{Kakao.cleanup();Kakao.init("bb11a3c4c8b58dbd3a95d806c8cf7a09");}catch(e){} 
/*	카카오톡링크 V1 
//    								Kakao.Link.sendTalkLink({
//    									image:{//이미지 설정값 label보다 아래로 하면 이미지가 아래에서 나오니 무조껀 위에다가 설정
//    											src:"http://m.banking2.nfcf.or.kr/resource/images/common/bg_guide_tit.png"
//	    										,width:"81",height:"81"
//    										},
        								label : txt +" " +url
//        								,appButton: {text:"산림조합앱으로 열기"} //앱버튼 이미지는 카카오개발자ID에서 설정하고, 패키지명도 거기서 하면됨
        							});
*/
									// 카카오톡링크 V2 적용 (2018.06.08)
    								Kakao.Link.sendDefault({  
										objectType : 'text',
										text : txt,
										link : {
											webUrl 			: webUrlCheck,
											mobileWebUrl 	: webUrlCheck
										}
	    							});
    							},300);
    							
    						}
    					}
        			}
        		}
            }
        }
    };
}(jQuery);

/** JUtilWindow */
var JUtilWindow = Utils.window;
/** JUtilForm */
var JUtilForm = Utils.form;
/** JUtilInput */
var JUtilInput = Utils.input;
/** JUtilSelect */
var JUtilSelect = Utils.selectbox;
/** JUtilCheck */
var JUtilCheck = Utils.checkbox;
/** JUtilRadio */
var JUtilRadio = Utils.radio;
/** JUtilDate */
var JUtilDate = Utils.date;
/** JUtilValid */
var JUtilValid = Utils.validate;
/** JUtilFormat */
var JUtilFormat = Utils.format;
var JUtilSns = Utils.sns;
