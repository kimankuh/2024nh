/********************************************************
파일명 	: commMo.js
설 명  	: 모바일 업무 공통 javascript
작성자  : 구본영


수정일 		수정자 명 		Version 	Function
-------     -------- 	----------  --------------
2022.03.17  구본영      1.0         최초생성
2022.03.21  양영근      1.0.1       
2022.03.23  옥진경      1.0.2       상품선택 팝업 관련 함수 추가
2022.03.23  양영근      1.0.3       주석 추가
2022.03.31  김예림      1.0.4       문서발송 팝업 함수 추가
2022.03.31  옥진경      1.0.5       ajax 조회 Data list 추가 함수
2022.04.04  김예림      1.0.6       회원정보변경 관련 함수 추가 
2022.04.19  전호근      1.0.7       회사명 입력 유효성체크 추가 
2022.04.22  구본영      1.0.8       약관 관련 함수 추가
2022.05.16	이정운	  1.0.9		  입사일 유효성 검사 추가
2022.05.17	이정운	  1.1.0		  결제일 유효성 검사 추가
2022.05.26	이정운	  1.1.1		  자동차금융 약정서 최초결제일 결정
*********************************************************/


const commMo = {
	/**
     * 해당 element에 number format 추가 및 min-max 범위 지정 
     * @param {DOM} element         : 포맷을 설정하고자 하는 input element
     * @param {string} maxValue    : element 입력 가능한 최대값
     */
    maxLoanAmtCheck(element, maxValue) {
    	element = element.replace(/[^0-9]/g, '');
		
		if (element >maxValue) {
			element = maxValue;
		} else if (element.substr(0,1) === "0"){
			element = 0;
		}
		return element;
    },
	/**
     * 해당 element에 본인지분율 유효성 체크 추가 (0~100 사이 숫자만)
     * @param {DOM} element         : 사용자가 입력한 input value
     */
	ownShareFormat(element) {
		element = element.replace(/[^0-9]/g, '');
		
		if (element >100) {
			element = 100;
		} else if (element.substr(0,1) === "0"){
			element = 0;
		}
		return element;
    },
    /**
     * 해당 element에 YYYYMMDD 포맷 형식 추가 
     * @param {DOM} element         : YYYYMMDD 포맷을 설정하고자 하는 input element
     * @param {string} separator    : YYYYMMDD 의 구분자(기본값 '-') 예) 19000101, - => 1900-01-01
     */
    setFormatYYYYMMDD(element, separator) {
        if (!separator) {
            separator = '-'
        }
        element.addEventListener('input', function(event) {
            event.currentTarget.value =  commMo.addSeparatorToYYYYMMDD(event.currentTarget.value, separator);
        });
    },
    /**
     * YYYYMMDD 문자열에 구분자 동적으로 추가(input 에 적합)
     * @param {*} value         : YYYYMMDD 문자열
     * @param {*} separator     : 구분자(기본값 '-')
     * @returns YYYY{구분자}MM{구분자}DD
     */
    addSeparatorToYYYYMMDD: function(value, separator) {
        if (!separator) {
            separator = '-';
        }

        value = value.replace(/[^0-9]/g, '');

		let result = [];
		let mmdd = "";
		result.push(value.substring(0, 4));
		mmdd = value.substring(4);

		result.push(mmdd.substring(0,2));
		result.push(mmdd.substring(2));

		return result.filter((v) => v).join(separator);
    }, 
    /**
     * 전화번호 포맷 XXX-XXXX-XXXX
     * @param {string} value    : 전화번호 포맷으로 바꿀 숫자형 문자열 ex) 01012341234
     * @returns XXX-XXXX-XXXX
     */
    convertTelFormat: function(value) {
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

        return result.filter((v) => v).join(' ');
    },
    /**
     * 사업자등록번호 포맷 XXX-XX-XXXXXX
     * @param {string} value    : 숫자형문자열 10자리 ex) 1234567890
     * @returns XXX-XX-XXXXXX
     */
    convertBusinessLicenseNumberFormat: function(value) {
        value = value.replace(/[^0-9]/g, '');

        let result = "";
        const SEPARATOR = '-';

        if (value.length < 4) {
            return value;
        } else if (value.length < 6) {
            result += value.substr(0, 3);
            result += SEPARATOR;
            result += value.substr(3, 2);
            return result;
        } else if (value.length < 11) {
            result += value.substr(0, 3);
            result += SEPARATOR;
            result += value.substr(3, 2);
            result += SEPARATOR;
            result += value.substr(5);
            return result;
        } else {
            result += value.substr(0, 3);
            result += SEPARATOR;
            result += value.substr(3, 2);
            result += SEPARATOR;
            result += value.substr(5);
            return result;
        }

    },
    /**
     * 아이디 유효성 검사
     * @param {DOM} element : 아이디 값을 입력하는 input element 
     * @returns {
     *  isValid: 유효성 통과 여부
     *  message: 유효성 통과 실패했을 때 메시지
     * }
     */
    isValidMemberId: function(element) {
        const result = {
            isValid: true,
            message: ''
        }
        const value = element.value;
        if (!value) {
            result.isValid = false;
            result.message = "아이디를 입력해주세요.";
        }
        return result;
    },
    /**
     * 이름 유효성 검사
     * @param {DOM} element : 이름을 입력하는 input element 
     * @returns {
     *  isValid: 유효성 통과 여부
     *  message: 유효성 통과 실패했을 때 메시지
     * }
     */
    isValidName: function(element) {
        const result = {
            isValid: true,
            message: ''
        }
        const value = element.value;
        if (!value) {
            result.isValid = false;
            result.message = "이름을 입력해주세요.";
        }
        return result;
    },
    /**
     * YYMMDD (주민등록번호 앞자리)유효성 검사
     * @param {DOM} element : YYMMDD을 입력하는 input element 
     * @returns {
     *  isValid: 유효성 통과 여부
     *  message: 유효성 통과 실패했을 때 메시지
     * }
     */
    isValidYYMMDD: function(element) {
        const result = {
            isValid: true,
            message: ''
        }
        const value = element.value;
        const regex = /([0-9]{2}(0[1-9]|1[0-2])(0[1-9]|[1,2][0-9]|3[0,1]))/g;
        if (!value) {
            result.isValid = false;
            result.message = "주민등록번호 앞자리를 입력해주세요.";
        } else if (!regex.test(value)) {
            result.isValid = false;
            result.message = "주민등록번호 앞자리를 정확히 입력해주세요.";
        }

        return result;
    },
    /**
     * 성별 인식 번호(주민등록번호 뒷자리 첫번째) 유효성 검사
     * @param {DOM} element : 성별 인식 번호를 입력하는 input element 
     * @returns {
     *  isValid: 유효성 통과 여부
     *  message: 유효성 통과 실패했을 때 메시지
     * }
     */
    isValidSexIdentificationNumberResult: function(element) {
        const result = {
            isValid: true,
            message: ''
        }
        const value = element.value;

        if (!value) {
            result.isValid = false;
            result.message = "성별을 입력해주세요.";
        } 

        return result;
    },
    /**
     * 통신사 유효성 검사
     * @param {DOM} element : 통신사를 입력하는 select element 
     * @returns {
     *  isValid: 유효성 통과 여부
     *  message: 유효성 통과 실패했을 때 메시지
     * }
     */
    isValidTelecom: function(element) {
        const result = {
            isValid: true,
            message: ''
        }

        const value = element.value;
        if (!value) {
            result.isValid = false;
            result.message = "통신사를 선택해주세요.";
        }

        return result;
    },
    /**
     * 휴대폰 인증 번호 유효성 검사
     * @param {DOM} element : 휴대폰 인증 번호를 입력하는 input element 
     * @returns {
     *  isValid: 유효성 통과 여부
     *  message: 유효성 통과 실패했을 때 메시지
     * }
     */
    isValidPhoneAuthCode: function(element) {
        const result = {
            isValid: true,
            message: ''
        }

        const value = element.value;
        if (!value) {
            result.isValid = false;
            result.message = "인증번호를 입력해주세요.";
        }

        return result;
    },
    /**
     * 생년월일 YYYYMMDD 유효성 검사
     * @param {DOM} element : YYYYMMDD 번호를 입력하는 input element 
     * @returns {
     *  isValid: 유효성 통과 여부
     *  message: 유효성 통과 실패했을 때 메시지
     * }
     */
    isValidYYYYMMDD: function(element) {
        const result = {
            isValid: true,
            message: ''
        }
        const value = element.value.replace(/[^0-9]/g, '');
        if (!value) {
            result.isValid = false;
            result.message = "생년월일을 입력해주세요.";
        } else if (!commMo.isBirthDay(value)) {
            result.isValid = false;
            result.message = "생년월일을 정확히 입력해주세요.";
        }
        return result;
    },
    /**
     * 생년월일인지 체크
     * @param {String} dateString   : YYYYMMDD 형 문자열
     * @returns 생년월일 ? true : false
     */
    isBirthDay: function(dateString) {
        const year = Number(dateString.substr(0, 4));
        const month = Number(dateString.substr(4,2));
        const day = Number(dateString.substr(6,2));

        const today = new Date();
        const thisYear = today.getFullYear();
        if (dateString.length > 8) {
            return false;
        }
        if (year > thisYear) {
            return false;
        }
        if (month < 1 || month > 12) {
            return false;
        }
        if (day < 1 || day > 31) {
            return false;
        }

        const MONTHS_30_DAYS = [4, 6, 9, 11]
        if (MONTHS_30_DAYS.includes(month) && day > 30) {
            return false;
        }

        if (month === 2) {
            if (day > 29) {
                return false;
            }
            
            if (day === 29) {
                const isLeap = (year % 4 === 0 && !(year % 100 == 0 && year % 400 !== 0));
                if (isLeap) {
                    return true;
                }
                return false;
            }
        }
        return true;
    },
    /**
     * 휴대폰번호 유효성 검사
     * @param {DOM} element : 휴대폰번호를 입력하는 input element 
     * @returns {
     *  isValid: 유효성 통과 여부
     *  message: 유효성 통과 실패했을 때 메시지
     * }
     */
    isValidPhone: function(element) {
        const result = {
            isValid: true,
            message: ''
        }
        const value = element.value.replace(/\s/g, '');
        const regexPhone = /^01([0\1\6\7\8\9])([0-9]{3,4})([0-9]{4})$/;
        if (!regexPhone.test(value)) {
            result.isValid = false;
            result.message = '연락처를 정확히 입력해주세요.';
        }

        return result;
    },
    /**
     * 전화번호 유효성 검사
     * @param {DOM} element : 전화번호를 입력하는 input element 
     * @returns {
     *  isValid: 유효성 통과 여부
     *  message: 유효성 통과 실패했을 때 메시지
     * }
     */
    isValidTel: function(element) {
        const result = {
            isValid: true,
            message: ''
        }
        const value = element.value.replace(/-/g, '');

        if (!value) {
            result.isValid = false;
            result.message = "휴대전화번호를 정확히 입력해주세요.";
        } else if (value.length < 10) {
            result.isValid = false;
            result.message = "휴대전화번호를 정확히 입력해주세요.";
        }

        return result;
    },
    /**
     * 회사명 유효성 검사
     * @param {DOM} element : 회사명을 입력하는 input element 
     * @returns {
     *  isValid: 유효성 통과 여부
     *  message: 유효성 통과 실패했을 때 메시지
     * }
     */
    isValidCompanyName: function(element) {
        const result = {
            isValid: true,
            message: ''
        }
        const value = element.value;

        if (!value) {
            result.isValid = false;
            result.message = "회사명을 입력해주세요.";
        }
        return result;
    },
    /**
     * 사업자등록번호 유효성 검사
     * @param {DOM} element : 사업자등록번호를 입력하는 input element 
     * @returns {
     *  isValid: 유효성 통과 여부
     *  message: 유효성 통과 실패했을 때 메시지
     * }
     */
    isValidBusinessLicenseNumber: function(element) {
        const result = {
            isValid: true,
            message: ''
        }
        const value = element.value.replace(/-/g, '');

        if (!value) {
            result.isValid = false;
            result.message = "사업자등록번호를 입력해주세요.";
        } else if (value.length < 10) {
            result.isValid = false;
            result.message = "사업자번호를 정확히 입력해주세요.";
        } 
        // TODO 실제는 주석 제거해야 함. 
        // else if (value.length === 10) {
        //     const numbers = value.split("").map(function(d) {
        //         return parseInt(d, 10);
        //     });

        //     const validateKeys = [1, 3, 7, 1, 3, 7, 1, 3, 5];
        //     let checkedResult = 0;
        //     validateKeys.forEach(function(d, i) {
        //         checkedResult += d * numbers[i];
        //     });

        //     checkedResult += parseInt((validateKeys[8] * numbers[8])/10, 10);
        //     if (Math.floor(numbers[9]) !== ((10 - (checkedResult % 10)) % 10)) {
        //         result.isValid = false;
        //         result.message = "사업자번호를 정확히 입력해주세요.";
        //     }

        // }
        return result;
    },
    /**
     * 이메일 유효성 검사
     * @param {DOM} element : 이메일을 입력하는 input element 
     * @returns {
     *  isValid: 유효성 통과 여부
     *  message: 유효성 통과 실패했을 때 메시지
     * }
     */
    isValidEmail: function(element) {
        const result = {
            isValid: true,
            message: ''
        }
        const value = element.value;
        const regex = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/g
        if (!value) {
            result.isValid = false;
            result.message = "이메일을 입력해주세요.";
        } else if(!regex.test(value)) {
            result.isValid = false;
            result.message = "이메일을 정확히 입력해주세요.";
        }
        return result;
    },
    /**
     * 이메일 유효성 검사(선택)
     * 값이 있을 때만 유효성 검사
     * @param {DOM} element : 이메일을 입력하는 input element 
     * @returns {
     *  isValid: 유효성 통과 여부
     *  message: 유효성 통과 실패했을 때 메시지
     * }
     */
    isValidEmailOptional: function(element) {
        const result = {
            isValid: true,
            message: ''
        }
        const value = element.value;
        const regex = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/g
        if(value && !regex.test(value)) {
            result.isValid = false;
            result.message = "이메일을 정확히 입력해주세요.";
        }

        return result;
    },
    
    /**
     * 입사일 유효성 검사
     * 입사일(스트링YYYY-MM-DD) 입력 받고 오늘 이전인지 확인
     * @param {DOM} element : 일사일 입력하는 input element 
     * @returns {
     *  isValid: 유효성 통과 여부 (오늘 포함 이전: true / if not: false)
     *  message: 유효성 통과 실패했을 때 메시지
     * }
     */
    isValidJoinDate: function(element) {
        const result = {
            isValid: true,
            message: ''
        }
        
        const joinDate = element.value.replace(/[^0-9]/g, '');		// 숫자가 아닌 문자 치환
        
        var now = new Date(); 
        var year = String(now.getFullYear()); 
		var month = now.getMonth() + 1;
		var day = now.getDate();
		
		if (Number(month)<10) month = '0'+month;
		if (Number(day)<10) day = '0'+day;
        
        var today = year+""+month+""+day;
        
        if(joinDate > today){
        	result.isValid = false;
        	result.message = "입사일은 오늘 이전이어야 합니다.";
        }
        return result;
    },
    
    /**
     * 현거주일 유효성 검사
     * 거주일(스트링YYYY-MM-DD) 입력 받고 오늘 이전인지 확인
     * @param {DOM} element : 일사일 입력하는 input element 
     * @returns {
     *  isValid: 유효성 통과 여부 (오늘 포함 이전: true / if not: false)
     *  message: 유효성 통과 실패했을 때 메시지
     * }
     */
    isValidCursDate: function(element) {
        const result = {
            isValid: true,
            message: ''
        }
        
        const joinDate = element.value.replace(/[^0-9]/g, '');		// 숫자가 아닌 문자 치환
        
        var now = new Date(); 
        var year = String(now.getFullYear()); 
        var month = String("0"+(now.getMonth()+1)); 
        var day = String(("0"+now.getDate()).slice(-2));
        var today = year+month+day;
        
        if(joinDate > today){
        	result.isValid = false;
        	result.message = "현거주 시작일은 오늘 이전이어야 합니다.";
        }
        return result;
    },
    
    /**
     * 결제일 유효성 검사
     * 결제일(DD)은 오늘 다음날은 불가; 15일 내만 가능
     * @param 결제일(DD) : 입력받은 결제일 value 
     * @returns {
     *  isValid: 유효성 통과 여부 (오늘 포함 이전: true / if not: false)
     *  message: 유효성 통과 실패했을 때 메시지
     * }
     */
    isValidPayDate: function(inputDay) {
        const result = {
            isValid: true,
            message: ''
        }
        
        const payDay = inputDay.replace(/[^0-9]/g, '');		// 숫자가 아닌 문자 치환
        
        var now = new Date(); 
        // var year = String(now.getFullYear()); 
        // var month = String("0"+(now.getMonth()+1));
        var today = now.getDate();
              
        if(payDay >= today ){
        	if(payDay == today || payDay == today+1){
            	result.isValid = false;
            	result.message = "결제일은 오늘 +2일부터 가능합니다.";
            }
        }else if(payDay > today+15){
        	result.isValid = false;
        	result.message = "결제일은 15일 이내로만 가능합니다.";
        }else if(payDay < today){
        	if(payDay > (today+15)%30){
        		result.isValid = false;
            	result.message = "결제일은 15일 이내로만 가능합니다.";
        	}
        }
        return result;
    },
    
    /**
     * 자동차금융 약정서 최초결제일 결정
     * 결제일(DD) 입력하면, 최초결제일 반환
     * @param 결제일(DD) : 입력받은 결제일 String value 
     * @returns 결제일(YYYYMMDD) 스트링
     *  
     */
    setFirstPayDate: function(inputDay) {        
        const payDay = inputDay.replace(/[^0-9]/g, '');		// 숫자가 아닌 문자 치환
        
        var now = new Date(); 
        var year = String(now.getFullYear()); 
        var month = String("0"+(now.getMonth()+1));
        var today = now.getDate();
        var firstPayDate = "";
        
        if(today+15 < payDay){
        	firstPayDate = year+month+payDay.padStart(2, '0');
        	return firstPayDate;
        	
        }else{
        	var month31 = ['01', '03', '05', '07', '08', '10', '12'];
            var month30 = ['04', '06', '08', '09', '11'];
            var month28 = ['02'];
            var nextPayDay;
             
            if(month31.includes(month)){ nextPayDay = Number(payDay) + 31; 
            }else if(month30.includes(month)){ nextPayDay = Number(payDay) + 30;
            }else if(month28.includes(month)){ nextPayDay = Number(payDay) + 28; }

            
            if(today+15 < nextPayDay){
            	var nextMonth = String("0"+(Number(month)+1));
            	firstPayDate = year+nextMonth+payDay.padStart(2, '0');

            	return firstPayDate;
            	
            }else{
            	var nextMonth = String("0"+(Number(month)+2));
            	firstPayDate = year+nextMonth+payDay.padStart(2, '0');
      
            	return firstPayDate;
            }
        }
    },
    
    /**
     * custNo(고객번호) 체크
     * 입력 받은 고객번호가 빈 스트링이면, 팝업메시지 출력 
     * @param 결제일(DD) : 입력받은 결제일 String value 
     * @returns true / 
     *  
     */
    isValidCustNo: function(custNo) {    	
    	if(custNo == "" || custNo == undefined || custNo == null){
    		CommMsg.msgPop(
				{type:"a", title:"고객번호가 존재하지 않습니다. 다시 로그인해주시기 바랍니다."},
	            function(){
	                const url = "/login/appInit.nh";
	                comm.goPage(url);
            });
    	}else{
    		return true;
    	}
    },
    
    /**
     * 원 포맷(세자리 콤마)
     * @param {DOM} element   : 원 포맷을 적용하고 싶은 input element 
     */
    addWonFormat: function(element) {
        element.addEventListener('input', function(event) {
            const tempValue = event.currentTarget.value;
            const tempOnlyNumberString = tempValue.replace(/[^0-9]/g, '');
            event.currentTarget.value = commMo.convertNumberStringToWon(tempOnlyNumberString);
        });
    },
    /**
     * 숫자형 문자열에 세자리마다 , 넣기.
     * @param {string} numberString  : 숫자형 문자열 xxxxxxxxx
     * @returns xxx,xxx,xxx
     */
    convertNumberStringToWon: function(numberString) {
        if (!commMo.isNumber(numberString)) return '';
        return Number(numberString).toLocaleString('ko-KR');     
    },
    /**
     * 원 포맷 문자열을 숫자로 변경
     * @param {string} won  : 원 포맷 문자열 xxx,xxx,xxx
     * @returns (number) xxxxxxxxx
     */
    convertWonToNumber: function(won) {
        return won ? Number(won.replace(/,/g, '')) : 0;
    },
    /**
     * value 가 숫자인지 확인
     * @param {*} value     : 모르는 값
     * @returns 숫자 ? true : false
     */
    isNumber: function(value) {
        if (value === undefined || value === null || value === '') {
        	return false;
        }
        if (typeof value === 'string') {
        	return !Number.isNaN(+value);
        }
        if (typeof value === 'number') {
        	return !Number.isNaN(value);
        }
        
        return false;
    },
    /**
     * 소수점 2자리까지 제한
     * @param {DOM} element     : 소수점 자리를 제한하고 싶은 input element
     */
    limitDecimalPlaces: function(element) {
        element.addEventListener('input', function(event) {
            event.currentTarget.value = event.currentTarget.value.replace(/(\.\d{2})\d+/g, '$1');
        });
    },
    /**
     * YYMMDD와 성별 인식 번호(주민등록번호 뒷자리 첫번째)로 YYYYMMDD 조회
     * @param {string} YYMMDD        : YYMMDD
     * @param {string} genderNumber  : 성별 인식 번호(주민등록번호 뒷자리 첫번째)
     * @returns 
     */
    getYYYYMMDDByYYMMDDAndGenderNumber: function(YYMMDD, genderNumber) {
        let result = "";

        const EIGHTEEN = ["9", "0"];
        const NINETEEN = ["1", "2", "5", "6"];
        const TWENTY = ["3", "4", "7", "8"];

        if (EIGHTEEN.includes(genderNumber)) {
            result += "18";
        } else if (NINETEEN.includes(genderNumber)) {
            result += "19";
        } else if (TWENTY.includes(genderNumber)) {
            result += "20";
        }

        result += YYMMDD;

        return result;
    },
    
    /**
     * 대출 상품 선택 popup 함수
     * @param {*} custSelect 개인/사업자 selectBox 선택자
     * @param {*} custNo form input custNo(고객번호) 선택자
     * @param {*} callback 대출 상품 선택 후 callback함수
     */
    
    fn_popup_loanList: function (custSelect, custNo, callback) {
        
        $(custSelect).change(function () {
            const select = document.querySelector(custSelect);
            const selecOptVal = select.options[select.selectedIndex].dataset.custno;
            $(custNo).val(selecOptVal);
        });

        $(".btn_select").on("click", function () {
			// A11Y
			termClickObj = $(this);
			
            const custNo = $("#custNo").val();
            CommPop.layerPopup("MAMYPG00000000_02", "/myaccnt/inquiry/loanDetails/selectMyLoanAccountPop.nh", { custNo: custNo }, callback);
        });

        /**
         * 다른 상품 선택시 sesstion에 저장된 loanDetail 삭제
         */
        const loanDetailInfo = sessionStorage.getItem("loanDetailInfo");
        if (loanDetailInfo) {
            //session 스토리지 삭제
            sessionStorage.removeItem("loanDetailInfo");
        }
    },

    /**
     * 상품 상세보기 팝업 함수호출
     * @param {*} frm  from 선택자(loannumber 넘겨줘야 함)
     * @param {*} loannumber 대출 번호 담긴 from input 선택자
     */
    
    fn_popup_goodsDetail: function (frm,loannumber) {

      $(".btn_details").click(function () {
        const param = $(frm).serialize();

        if ($(loannumber).val()) {
			// A11Y
			termClickObj = $(this);
          CommPop.layerPopup(
            "MAMYPG01010001_1",
            "/myaccnt/inquiry/loanDetails/selectMyLoanAccountDetail.nh",
            param,
            function (data) {
            }
          );
        } else {
          CommMsg.alert("대출 상품을 선택해주세요.")
          return false;
        }
      });
    },

    /**
     * 청구금액 결제 페이지 이동
     * @param {*} btn_reqtopay 청구금액 결제하기 버튼 선택자
    */
    fn_goPage_reqtopay: function (btn_reqtopay) {
        $(btn_reqtopay).on("click", function () {
        const loanDetailInfo = {
            loanNum: $("#loannumber").val(),
            custNo: $("#custNo").val(),
            selectgoods: $("#selectgoods").val(),
            loanDetail: $("#loanDetail").val()
        }
        sessionStorage.setItem("loanDetailInfo", JSON.stringify(loanDetailInfo));
        comm.goPage("/myaccnt/payment/reqtopay/selectReqtopayForm.nh");
        });  
    },
    
    /**
     *  중도상환 페이지로 이동
     * @param {*} btn_prepay 중도 상환,해지하기 버튼 선택자
    */
    fn_goPage_prepay: function (btn_prepay) {
        $(btn_prepay).on("click", function () {
        const loanDetailInfo = {
            loanNum: $("#loannumber").val(),
            custNo: $("#custNo").val(),
            selectgoods: $("#selectgoods").val(),
            loanDetail: $("#loanDetail").val()
        }
        sessionStorage.setItem("loanDetailInfo", JSON.stringify(loanDetailInfo));
        comm.goPage("/myaccnt/payment/prepayment/selectPrepaymentForm.nh");
        });  
    },

    /**
     * ajax 조회 Data list 추가 함수
     * @param {*} Tit List의 title Arr이름
     * @param {*} Info List의 conts Arr이름
     * @param {*} selector List가 들어갈 ul 선택자
     */

    fn_add_InfoList: function (Tit, Info, selector) {
        $(selector).html('');
    
        for (j = 0; j < Tit.length; j++) {
        var listHTML =
            `
        <li>
        <div class="title">${Tit[j]}</div>
        <div class="conts">${Info[j]}</div>
        </li>
    `

        $(selector).append(listHTML);
        }
    },

     /**
     * 문서발송 팝업 함수호출
     * 전자서명 추후에 추가예정 
     * @param {*} sendButton  문서발송 button 선택자
     * @param {*} frm  from 선택자(인쇄관련 정보 넘겨줘야 함)
     * @param {*} url 인쇄 전문 요청 url 
     */

     fn_popup_sendDocument : function(sendButton,frm,url){
        
        $(sendButton).on("click", function(){
            const param = $(frm).serializeObject();
            comm.callAjaxJson(url, param, fun_callback_print);
        });
        const fun_callback_print = function (data) {
         
            var result = data.result.response;
            var sysData = result["SYSTEM"]; 	//시스템부 데이터 ("SYSTEM")
            var success = sysData["PRCS_RSLT_DVCD"]; 	//결과구분코드(헤더값)
            var resultData = "";
            var gdsCd = result.DATA.header.data["GDS_MCL_CD"]; //중분류코드
            if(success == "S") {
                if(gdsCd == "21"){ //렌터카
                    $("#prtTmplId").val("/PYM/PYM020225R01");
                }else if(gdsCd == "11" || gdsCd == "12" ){  //오토리스
                    $("#prtTmplId").val("/PYM/PYM030118R01");
                }else if(gdsCd == "13"){  //일반리스
                    $("#prtTmplId").val("/PYM/PYM030123R01");
                }else{  //그외
                    $("#prtTmplId").val("/PYM/PYM030121R01");
                }
                resultData = JSON.stringify(result.DATA);
                //resultData = result.DATA;
                $("#dataValS4000").val(resultData);
    
                const layerId = "MAMYPG00000000_01";
                const url = "/myaccnt/selectDocSendFormPop.nh";
                const formData = $("#frm").serializeObject();
    
                
                CommPop.layerPopup(layerId,url,formData,fn_callback_docSend);
                //var url = "/myaccnt/ajaxDocSend.nh";
                // comm.callAjaxJson(url, $("#frm").serializeObject(), fun_callback_doc);
            }
        }
        const fn_callback_docSend = function(rtnData){
            
        }
     },

     /**
     *  모바일 OCR 공통 함수
     * @param {*} custNo 고객번호
     * @param {*} contNo 계약번호
     * @param {*} callBackID 콜백함수 명 (전역함수)
     * @param {*} returnUrl OCR 진행 후 돌아갈 페이지 
     */
    fn_call_ocr : (custNo,contNo,callBackID,returnUrl) =>{
        const param = {
            "CUSTNO" : custNo,
            "CONT_NO" : contNo,
            "callbackID" : callBackID,
            "returnUrl" : returnUrl
        }

        comm.goPage("/comm/idoc/OCRGuide.nh", param);

        comm.callNativeOCR
    },

    /**
     * 앱 설정 화면 호출 인터페이스(웹뷰 히스토리 삭제)
     */
    fn_callNativeIfc_clearHistory : function() {

        const service = "CLEAR_WEBVIEW_HISTORY";
        const param = {}
        
        //웹뷰 히스토리 삭제
        comm.callNativeIfc(service, param, callbackFunc);
        function callbackFunc(code) {
        }
    },

    /**
     * 앱 설정 화면 호출 인터페이스(앱 종료)
     */
    fn_callNativeFunc_setBack : function() {

        const service = "SET_BACK_BUTTON";
        const param = {
            "possible_yn": "Y",
            "action": "finish"
        }
        
        //웹뷰 히스토리 삭제
        comm.callNativeFunc(service, param,"");
    },

    /**
     *  모바일 전자서명 공통 함수
     * 
     *  객체 타입 파라미터로 호출해야 함
     *  @param {JsonObject} json
     *  @param {Enum} type (required) 호출 타입 - 1 : 모든 타입, 2 : 직접 서명 미포함, 3 : 직접 서명만
     *  @param {String} callbackFunctionName (required) 전역 단계에 선언한 콜백함수 명
     *  @param {String} interfaceId (required) 인터페이스 아이디
     *  @param {Object} jsonData (required) 넘겨야할 객체 데이터 (없으면 빈 객체 전달)
     *  @param {Object} returnData (required) 콜백 함수에서 필요한 데이터 (json)
     *  @param {String} certFormId (optional) 직접 서명 시 필요한 약정서 아이디
     *  @param {String} custNumber (optional) 직접 서명 시 필요한 고객 번호
     *  @param {String} contNumber (optional) 직접 서명 시 필요한 계약 번호
     *  @param {Object} formHeader (optional) 직접 서명 시 필요한 약정서 기입 내용(별도 폼 참고)
     *  @param {Object} reportData (optional) 직접 서명 시 필요한 문서 정보(별도 폼 참고)
     *  
     */

     fn_call_cert_sign : ({type,callbackFunctionName,interfaceId,jsonData,returnData,certFormId,custNumber,contNumber,formHeader,reportData, signData}) =>{

        const formData = {};

        switch(type){
            case 1 :	// 1~5 사설인증서(공동인증서, 카카오, 네이버...) 6번: 직접서명
                formData.signType = "123456";
                formData.crfName = certFormId;
                formData.CUSTNO = custNumber;
                formData.CONT_NO = contNumber;
                formData.header1 = JSON.stringify(formHeader);
                formData.regFileData = JSON.stringify(reportData);
                formData.returnData = JSON.stringify(returnData);
                break;
            case 2 :	// 사설인증서만 가능 
                formData.signType = "12345";
                break;
            case 3 :	// 0: 직접서명으로 바로 이동 
                formData.signType = "0";
                formData.crfName = certFormId;
                formData.CUSTNO = custNumber;
                formData.CONT_NO = contNumber;
                formData.header1 = JSON.stringify(formHeader);
                formData.regFileData = JSON.stringify(reportData);
                formData.returnData = JSON.stringify(returnData);
                break;
        }

        const layoutContent = document.querySelector("#layoutContent");
        
        const formTag = document.createElement("form");
        const formName = "mobileCertform";
        formTag.id = formName;
        formTag.name = formName;

        const interfaceInput = document.createElement("input");
        interfaceInput.type = "hidden";
        interfaceInput.name = "interfaceId";
        interfaceInput.value = interfaceId; 

        formTag.appendChild(interfaceInput);

    	if(signData != undefined){
    		signData.forEach(function(data){
    	        const signDataInput = document.createElement("input");
    	        signDataInput.type = "hidden";
    	        signDataInput.name = data.name;
    	        signDataInput.value = data.value; 

    	        formTag.appendChild(signDataInput);
    		})
    	}
    	
        if(jsonData){
            for(const [key, value] of Object.entries(jsonData)){
                const inputTag = document.createElement("input");
                inputTag.type = "hidden";
                inputTag.name = key;
                inputTag.value = value;

                formTag.appendChild(inputTag);
            }
        }

        layoutContent.appendChild(formTag);

        comm.doCertSign(formName,callbackFunctionName,interfaceId,formData);
        
    },

    /**
     * 모바일 백버튼 공통 얼럿
     * @param {function} successCallbackFunction (required) 확인 버튼 클릭 시 실행 함수
     * @param {function} failCallbackFunction (required) 취소 버튼 클릭 시 실행 함수
     */
    fn_call_android_back_button_alert:(type,successCallbackFunction,failCallbackFunction)=>{
        const service = "SET_BACK_BUTTON";
        const param = {
            "possible_yn": "Y",
            "action": "custom"
        }
        
        //브릿지 함수 호출
        comm.callNativeIfc(service, param, ()=>{
            const option = {
                type:"c",
                btnLeft:"아니오",
                btnRight:"네",
                icon:"Y",
                title:"정말 뒤로 가시겠어요?",
                cont:"지금 페이지를 이탈하면 처음부터 다시 진행해야합니다."
            }
            CommMsg.msgPop(option,successCallbackFunction,failCallbackFunction);
        });
    },

    /**
     * 약관 공통
     * 
     * 사용방법 (MASTLN01020001.jsp 참고)
     * 1. 약관 전체동의 체크박스 input에 'chk_all' 클래스 추가
     * 2. 필수 약관 체크박스 input에 'chk_required' 클래스 추가
     * 3. 약관 체크박스 input의 data-file-name에 해당하는 약관 파일명 추가 (아래 TERMS_INFO_LIST 참고)
     * 4. 다음 button에 'btn_next' 아이디 추가
     * 5. 파일에 commMo.terms.init() 함수 실행
     * 
     * TERMS_INFO_LIST에 해당하는 약관 파일명이 없거나, 약관명이 다를 경우 약관 문서 참고하여 아래 TERMS_INFO_LIST에 추가 및 수정 요망
     * 
     * 추가사항
     * 1. 약관상세가 없는 약관일 경우(약관전체동의 클릭 시 약관상세 팝업 없이 체크되어야할 경우) - 해당 약관 체크박스 input에 'chk_passed' 클래스 추가
     * 2. 요약/전체 선택이 가능한 약관일 경우 - 약관 체크박스 input의 data-file-toggle에 약관 요약/전체 파일명 추가
     * 3. 하위약관이 있을 경우(약관 상세 클릭 시 약관상세 팝업이 2개 이상 노출되어야 할 경우) - data-file-name에 해당하는 약관 파일명들을 추가
     */
    terms: {
        // 약관 파일명(추가가 안된 파일이 있을 경우, TERMS_INFO_LIST 리스트에 추가)
        TERMS_INFO_LIST: [
            { FILE_NAME: 'myac_pop_agree01', TITLE: '약관 동의' },
            { FILE_NAME: 'aboutus_pop_agree01', TITLE: '개인정보 수집/이용 동의' },
            { FILE_NAME: 'cust_pop_agree01', TITLE: '개인정보 수집/이용 동의' },
            { FILE_NAME: 'cust_pop_agree02', TITLE: '필수적 개인정보 수집/이용 동의' },
            { FILE_NAME: 'comm_pop_agree05', TITLE: '신용정보 제공 활용에 대한 고객권리안내문'},
            { FILE_NAME: 'comm_pop_agree06', TITLE: '개인신용대출 약관'},
            { FILE_NAME: 'comm_pop_agree07', TITLE: '여신거래 기본약관' },
            { FILE_NAME: 'cust_pop_agree07', TITLE: '온라인 서비스 이용약관' },
            { FILE_NAME: 'comm_pop_agree08', TITLE: '자동이체 이용약관' },
            { FILE_NAME: 'cust_pop_agree08', TITLE: '필수적 개인정보 수집/이용 동의' },
            { FILE_NAME: 'comm_pop_agree09', TITLE: '고객정보 취급방침' },
            { FILE_NAME: 'cust_pop_agree09', TITLE: '선택적 개인정보 수집/이용 동의' },
            { FILE_NAME: 'comm_pop_agree09_1', TITLE: '고객정보 취급방침' },
            { FILE_NAME: 'cust_pop_agree10', TITLE: '고유식별정보의 처리에 대한 동의' },
            { FILE_NAME: 'comm_pop_agree12', TITLE: '필수적 개인정보 수집/이용 동의' },
            { FILE_NAME: 'cust_pop_agree12', TITLE: '필수적 개인정보 수집/이용 동의' },
            { FILE_NAME: 'comm_pop_agree13', TITLE: '선택적 개인정보 수집/이용 동의' },
            { FILE_NAME: 'cust_pop_agree13', TITLE: '선택적 개인정보 수집/이용 동의' },
            { FILE_NAME: 'comm_pop_agree16', TITLE: '여신거래 기본약관' },
            { FILE_NAME: 'cust_pop_agree17', TITLE: '개인(신용)정보 필수적동의서' },
            { FILE_NAME: 'comm_pop_agree17', TITLE: '중고 자동차 대출 표준약관' },
            { FILE_NAME: 'comm_pop_agree18', TITLE: '자동이체 신청/변경 동의서' },
            { FILE_NAME: 'comm_pop_agree19', TITLE: '근저당 설정 계약서' },
            { FILE_NAME: 'comm_pop_agree20', TITLE: '고객정보 취급방침' },
            { FILE_NAME: 'comm_pop_agree21', TITLE: '대출금 지급 관련 특약사항' },
            { FILE_NAME: 'comm_pop_agree25', TITLE: '신용정보 제공, 활용에 대한 고객권리 안내문' },
            { FILE_NAME: 'comm_pop_agree29', TITLE: '개인(신용)정보 이용 동의' },
            { FILE_NAME: 'comm_pop_agree30', TITLE: '여신거래 기본약관' },
            { FILE_NAME: 'comm_pop_agree31', TITLE: '전자금융거래기본약관' },
            { FILE_NAME: 'comm_pop_agree32', TITLE: '근질권 설정 계약서' },
            { FILE_NAME: 'comm_pop_agree33', TITLE: '근질권 설정 확인 및 승낙(의뢰)서' },
            { FILE_NAME: 'comm_pop_agree37', TITLE: '개인정보수집/이용 활용 동의' },
            { FILE_NAME: 'comm_pop_agree38', TITLE: '고유식별번호처리 동의' },
            { FILE_NAME: 'comm_pop_agree39', TITLE: '(KCB)_본인확인 이용약관' },
            { FILE_NAME: 'comm_pop_agree40', TITLE: '(통신사) 본인확인 이용약관' },
            { FILE_NAME: 'comm_pop_agree41', TITLE: '실제소유자 확인서' },
            { FILE_NAME: 'comm_pop_agree44', TITLE: '자동차리스 표준약관' },
            { FILE_NAME: 'comm_pop_agree45', TITLE: '주식매입자금대출(스탁론) 약관' },
            { FILE_NAME: 'comm_pop_agree46', TITLE: '할부금융 대출약관' },
            { FILE_NAME: 'comm_pop_agree47', TITLE: '오토론 대출약관' },
            { FILE_NAME: 'comm_pop_agree48', TITLE: '신용공여/자금세탁방지' },
            { FILE_NAME: 'comm_pop_agree49', TITLE: '금리인하요구권안내' },
            { FILE_NAME: 'comm_pop_agree50', TITLE: '할부거래법상 철회, 항변권 적용여부 설명서' },
            { FILE_NAME: 'comm_pop_agree53', TITLE: '금리인하요구권안내' },
            { FILE_NAME: 'comm_pop_agree54', TITLE: '장기렌터카 약관' },
            { FILE_NAME: 'comm_pop_agree55', TITLE: '개인정보 수집·이용에 관한 사항' },
            { FILE_NAME: 'comm_pop_agree56', TITLE: '고유식별정보 처리 동의에 관한 사항' },
            { FILE_NAME: 'comm_pop_agree57', TITLE: '추가약정서' },
            { FILE_NAME: 'comm_pop_agree58', TITLE: '국토교통부 주택소유확인 시스템 이용 관련 개인신용정보 수집 이용 제공 동의서' },
            { FILE_NAME: 'comm_pop_agree59', TITLE: '개인(신용)정보 제공에 대한 사항' },
            { FILE_NAME: 'comm_pop_agree61_summary', TITLE: '공공 마이데이터 개인(신용)정보 필수적 요약 동의서' },
            { FILE_NAME: 'comm_pop_agree61', TITLE: '공공 마이데이터 개인(신용)정보 필수적 전체 동의서' },
            { FILE_NAME: 'comm_pop_agree62', TITLE: '개인(신용)정보 필수 요약동의서' },
            { FILE_NAME: 'comm_pop_agree63', TITLE: '개인(신용)정보 필수 동의서' },
            { FILE_NAME: 'comm_pop_agree65', TITLE: '개인(신용)정보 필수 요약동의서' },
            { FILE_NAME: 'comm_pop_agree67', TITLE: '자회사 수집 이용 전체 동의서' },
            { FILE_NAME: 'comm_pop_agree69', TITLE: '개인(신용)정보 필수 동의서' },
            { FILE_NAME: 'comm_pop_agree70', TITLE: '개인(신용)정보 필수 요약동의서' },
            { FILE_NAME: 'comm_pop_agree71', TITLE: '개인(신용)정보 선택 동의' },
            { FILE_NAME: 'comm_pop_agree72', TITLE: '개인(신용)정보 선택 요약동의서' },
            { FILE_NAME: 'comm_pop_agree75', TITLE: '개인(신용)정보 필수 동의서' },
            { FILE_NAME: 'comm_pop_agree76', TITLE: '대리중개업자 고지사항' },
            { FILE_NAME: 'comm_pop_agree77', TITLE: '대출사기 방지를 위한 서면 안내문' },
            { FILE_NAME: 'comm_pop_agree78', TITLE: '개인(신용)정보 선택적 동의서' },
            { FILE_NAME: 'comm_pop_agree79', TITLE: '개인(신용)정보 선택적 요약동의서' },
            { FILE_NAME: 'comm_pop_agree81', TITLE: '자회사 수집 이용 요약동의서' },
            { FILE_NAME: 'comm_pop_agree83', TITLE: '운용리스상품 설명서' },
            { FILE_NAME: 'comm_pop_agree83_lease', TITLE: '금융리스상품 설명서' },
            { FILE_NAME: 'comm_pop_agree99', TITLE: '만기일 자동연장 신청 동의' },
            { FILE_NAME: 'new_comm_pop_agree01', TITLE: '구속성행위 관련 고객 확인서' },
            { FILE_NAME: 'new_comm_pop_agree02', TITLE: '세금계산서 발급 신청서 (세금계산서 발행 개인(신용)정보 필수적 동의서)' },
            { FILE_NAME: 'new_comm_pop_agree03', TITLE: '양도담보계약서' },
            { FILE_NAME: 'new_comm_pop_agree04', TITLE: '스탁론 자동만기연장 동의서' },
            { FILE_NAME: 'new_comm_pop_agree06', TITLE: '개인(신용)정보 필수 동의' },
            { FILE_NAME: 'new_comm_pop_agree05', TITLE: '개인(신용)정보 필수 요약동의서' },
            { FILE_NAME: 'new_comm_pop_agree07', TITLE: '개인(신용)정보 필수 동의서' },
            { FILE_NAME: 'new_comm_pop_agree08', TITLE: '개인(신용)정보 필수 요약동의서' },
            { FILE_NAME: 'new_comm_pop_agree11', TITLE: '개인(신용)정보 선택 요약동의서 1' },
            { FILE_NAME: 'new_comm_pop_agree12', TITLE: '개인(신용)정보 선택 요약동의서 2' },
            { FILE_NAME: 'new_comm_pop_agree13', TITLE: '개인(신용)정보 선택 동의 1' },
            { FILE_NAME: 'new_comm_pop_agree14', TITLE: '개인(신용)정보 선택 동의 2' },
            { FILE_NAME: 'snsPrivacyPolicy',     TITLE: '개인정보 이용 동의' },
            { FILE_NAME: 'privacyPolicy',        TITLE: '개인정보 이용 동의' },
            { FILE_NAME: 'provideInfoAgreement', TITLE: '제3자 정보제공 동의' },
            { FILE_NAME: 'serviceAgreement',     TITLE: '서비스 이용약관 동의' },
            { FILE_NAME: 'new_comm_pop_agree20', TITLE: '개인(신용)정보 필수 동의서' },
            { FILE_NAME: 'new_comm_pop_agree21', TITLE: '개인(신용)정보 필수 요약동의서' }
        ],
        fileNameList: [],

        init: (callback) => {
            commMo.terms.fn_checkRequiredAll();
            commMo.terms.fn_checkCheckboxTitle(callback);
            commMo.terms.fn_checkCheckboxAll(callback);
            commMo.terms.fn_checkCheckboxAllCredit(callback); // 신용대출 전용
            commMo.terms.fn_clickButtonTermsDetail(callback);
            commMo.terms.fn_handleTermsAdvertisement();
            commMo.terms.fn_checkTermsAdvertisement();
            commMo.terms.fn_checkCheckboxAdvertisementChannel();
            commMo.terms.fn_handleTermsType();
            commMo.terms.fn_handleTermsCredit();
        },
        /**
         * 동의서 타입(전체/요약) 핸들링
         */
        fn_handleTermsType: () => {
            const buttonTermsType = Array.from(document.querySelectorAll('.detail_agree .toggle_pack .btn_toggle'));
            if (!buttonTermsType.length) {
                return;
            }
            buttonTermsType.forEach(button => {
                button.addEventListener('click', () => {
                    const checkboxTitle = button.parentNode.parentNode.parentNode.parentNode.querySelector('.detail_title .ebcheckbox');
                    const buttonTitleAgreeDetail = button.parentNode.parentNode.parentNode.parentNode.querySelector('.detail_title .btn_agree_detail');
                    if (!checkboxTitle.dataset.fileNameToggle) {
                        return;
                    }
                    if (button.innerText === '요약') {
                        if (checkboxTitle.dataset.fileNameToggle.split(' ').length > 2) { // 하위 약관이 2개 이상 있을 경우
                            const fileNameToggle = checkboxTitle.dataset.fileNameToggle;
                            checkboxTitle.dataset.fileName = fileNameToggle.split(', ')[0];
                            buttonTitleAgreeDetail.dataset.fileName = fileNameToggle.split(', ')[0];
                            
                            const checkboxList = Array.from(document.querySelectorAll('.ebcheckbox'))
                                .filter((checkbox) => fileNameToggle.split(', ')[1].split(' ').includes(checkbox.dataset.fileName));
                            const buttonDetailList = Array.from(document.querySelectorAll('.btn_agree_detail'))
                                .filter((button) => fileNameToggle.split(', ')[1].split(' ').includes(button.dataset.fileName));
                            checkboxList.map((checkbox, index) => checkbox.dataset.fileName = fileNameToggle.split(', ')[0].split(' ')[index]);
                            buttonDetailList.map((button, index) => button.dataset.fileName = fileNameToggle.split(', ')[0].split(' ')[index]);
                            // 개인(신용)정보 선택적 동의서의 경우 - 추후 수정 필요
                            // Array.from(document.querySelectorAll(`[data-file-name='new_comm_pop_agree13']`)).forEach(element => element.dataset.fileName = 'new_comm_pop_agree11');
                            // Array.from(document.querySelectorAll(`[data-file-name='new_comm_pop_agree14']`)).forEach(element => element.dataset.fileName = 'new_comm_pop_agree12');
                        } else {
                            checkboxTitle.dataset.fileName = checkboxTitle.dataset.fileNameToggle.split(' ')[0];
                            buttonTitleAgreeDetail.dataset.fileName = checkboxTitle.dataset.fileNameToggle.split(' ')[0];
                        }
                    } else {
                        if (checkboxTitle.dataset.fileNameToggle.split(' ').length > 2) { // 하위 약관이 2개 이상 있을 경우
                            const fileNameToggle = checkboxTitle.dataset.fileNameToggle;
                            checkboxTitle.dataset.fileName = fileNameToggle.split(', ')[1];
                            buttonTitleAgreeDetail.dataset.fileName = fileNameToggle.split(', ')[1];

                            const checkboxList = Array.from(document.querySelectorAll('.ebcheckbox'))
                                .filter((checkbox) => fileNameToggle.split(', ')[0].split(' ').includes(checkbox.dataset.fileName));
                            const buttonDetailList = Array.from(document.querySelectorAll('.btn_agree_detail'))
                                .filter((button) => fileNameToggle.split(', ')[0].split(' ').includes(button.dataset.fileName));
                            checkboxList.map((checkbox, index) => checkbox.dataset.fileName = fileNameToggle.split(', ')[1].split(' ')[index]);
                            buttonDetailList.map((button, index) => button.dataset.fileName = fileNameToggle.split(', ')[1].split(' ')[index]);
                            // 개인(신용)정보 선택적 동의서의 경우 - 추후 수정 필요
                            // Array.from(document.querySelectorAll(`[data-file-name='new_comm_pop_agree11']`)).forEach(element => element.dataset.fileName = 'new_comm_pop_agree13');
                            // Array.from(document.querySelectorAll(`[data-file-name='new_comm_pop_agree12']`)).forEach(element => element.dataset.fileName = 'new_comm_pop_agree14');
                        } else {
                            checkboxTitle.dataset.fileName = checkboxTitle.dataset.fileNameToggle.split(' ')[1];
                            buttonTitleAgreeDetail.dataset.fileName = checkboxTitle.dataset.fileNameToggle.split(' ')[1];
                        }
                    }
                });
            });
        },
        /**
         * 약관 전체동의 체크박스 존재 여부 확인
         */
        fn_isExistingCheckboxAll: () => {
            return document.querySelector('.chk_all') || document.querySelector('.chk_all_credit') ? true : false;
        },
        /**
         * 약관제목 체크박스 클릭 이벤트
         */
        fn_checkCheckboxTitle: (callback) => {
            const checkboxTitleList = commMo.terms.fn_checkIsTitleCheckAll() ? 
                Array.from(document.querySelectorAll('.detail_conts .ebcheckbox')) :
                Array.from(document.querySelectorAll('.detail_title .ebcheckbox'));
            checkboxTitleList.forEach(checkboxTitle => {
                checkboxTitle.addEventListener('click', (e) => {
                	// A11Y
                	termClickObj = checkboxTitle;
                	
                    let fileName = '';
                    if (checkboxTitle.dataset.fileName && checkboxTitle.dataset.fileName.split(' ').length > 1) {
                        fileName = checkboxTitle.dataset.fileName.split(' ');
                    } else {
                        fileName = [checkboxTitle.dataset.fileName];
                    }
                    // const fileName = checkboxTitle.dataset.fileName?.split(' ').length > 1 ?
                    //     checkboxTitle.dataset.fileName.split(' ') :
                    //     [checkboxTitle.dataset.fileName];
                    if (e.target.checked) {
                        // if (checkboxTitle.dataset?.fileName) {
                        if (checkboxTitle.dataset && checkboxTitle.dataset.fileName) {
                            e.target.checked = false;
                            if (!commMo.terms.fn_getTermsInfo(fileName).length) {
                                CommMsg.alert('입력한 파일명과 일치하는 약관이 없습니다.<br>약관 파일명을 확인해 주세요.');
                                return;
                            }
                            commMo.terms.fileNameList = commMo.terms.fn_getTermsInfo(fileName);
                            commMo.terms.fn_openPopupTermsDetail(callback);
                        } else {
                            // commMo.terms.fn_checkCheckboxCheckedAll();
                            callback({isCheckedRequired: commMo.terms.fn_checkRequiredAll()});
                        }
                    } else {
                        callback({isCheckedRequired: commMo.terms.fn_checkRequiredAll()});
                        commMo.terms.fn_inactivateTermsAdvertisement();
                        const TERMS_CREDIT = ['new_comm_pop_agree11', 'new_comm_pop_agree12', 'new_comm_pop_agree13', 'new_comm_pop_agree14']
                        if (TERMS_CREDIT.includes(fileName[0])) {
                            checkboxTitle.parentNode.parentNode.parentNode.querySelectorAll('.ebcheckbox').forEach(checkbox => checkbox.checked = false);
                        }
                    }
                });
                checkboxTitle.addEventListener('change', () => {
                    // commMo.terms.fn_checkRequiredAll();
                    if (commMo.terms.fn_isExistingCheckboxAll()) {
                        if (document.querySelector('.chk_all_credit')) {
                            commMo.terms.fn_checkCheckboxCheckedAllCredit();
                        } else {
                            commMo.terms.fn_checkCheckboxCheckedAll();
                        }
                    } 
                });
            });
        },
        /**
         * 약관 전체동의 체크박스 클릭 이벤트
         */
        fn_checkCheckboxAll: (callback) => {
            const checkboxAll = document.querySelector('.chk_all');
            if (checkboxAll) {
                checkboxAll.addEventListener('click', (e) => {
                    const checkboxList = document.querySelector('.terms_basic') ? 
                        // Array.from(document.querySelectorAll('.terms_basic .detail_title .ebcheckbox')).filter(checkbox => checkbox.dataset?.fileName && !checkbox.checked) :
                        // Array.from(document.querySelectorAll('.detail_title .ebcheckbox')).filter(checkbox => checkbox.dataset?.fileName && !checkbox.checked);
                        Array.from(document.querySelectorAll('.terms_basic .detail_title .ebcheckbox')).filter(checkbox => checkbox.dataset && checkbox.dataset.fileName && !checkbox.checked) :
                        commMo.terms.fn_checkIsTitleCheckAll() ? 
                        Array.from(document.querySelectorAll('.detail_conts .ebcheckbox')).filter(checkbox => checkbox.dataset && checkbox.dataset.fileName && !checkbox.checked) :
                        Array.from(document.querySelectorAll('.detail_title .ebcheckbox')).filter(checkbox => checkbox.dataset && checkbox.dataset.fileName && !checkbox.checked);
                    const fileName = checkboxList.map(checkbox => checkbox.dataset.fileName); 
                    if (e.target.checked) {
                        e.target.checked = false;
                        commMo.terms.fn_checkCheckboxPassed();
                        commMo.terms.fileNameList = commMo.terms.fn_getTermsInfo(fileName);
                        commMo.terms.fn_openPopupTermsDetail(callback);
                    } else {
                        callback({isCheckedRequired: commMo.terms.fn_checkboxCheckedFalseAll()});
                        commMo.terms.fn_inactivateTermsAdvertisement();
                    }
                });
            }
        },
        /**
         * 약관 전체동의(신용대출 전용) 체크박스 클릭 이벤트
         */
        fn_checkCheckboxAllCredit: (callback) => {
            const checkboxAll = document.querySelector('.chk_all_credit');
            if (checkboxAll) {
                checkboxAll.addEventListener('click', (e) => {
                    const checkboxList = Array.from(document.querySelectorAll('.ebcheckbox'))
                        .filter(checkbox => checkbox.dataset && checkbox.dataset.fileName && checkbox.dataset.fileName.split(' ').length === 1 && !checkbox.checked);
                    const fileName = checkboxList.map(checkbox => checkbox.dataset.fileName); 
                 
                    if (e.target.checked) {
                        e.target.checked = false;
                        commMo.terms.fn_checkCheckboxPassed();
                        commMo.terms.fileNameList = commMo.terms.fn_getTermsInfo(fileName);
                        commMo.terms.fn_openPopupTermsDetail(callback);
                    } else {
                        callback({isCheckedRequired: commMo.terms.fn_checkboxCheckedFalseAllCredit()});
                    }
                });
            }
        },
        /**
         * 약관 전체 선택해제
         */
        fn_checkboxCheckedFalseAll: () => {
            const checkboxList = document.querySelector('.terms_basic') ? 
                Array.from(document.querySelectorAll('.terms_basic .detail_title .ebcheckbox')) :
                commMo.terms.fn_checkIsTitleCheckAll() ?
                Array.from(document.querySelectorAll('.detail_conts .ebcheckbox')) :
                Array.from(document.querySelectorAll('.detail_title .ebcheckbox'));
            checkboxList.forEach(checkbox => checkbox.checked = false);
            return false;
        },
        /**
         * 약관 전체 선택해제(신용대출 전용)
         */
        fn_checkboxCheckedFalseAllCredit: () => {
            const checkboxList = Array.from(document.querySelectorAll('.ebcheckbox'));
            checkboxList.forEach(checkbox => checkbox.checked = false);
            return false;
        },
        /**
         * 팝업 없이 체크되는 약관 체크
         */
        fn_checkCheckboxPassed: () => {
            const checkboxPassed = Array.from(document.querySelectorAll('.chk_passed'));
            if (!checkboxPassed.length) {
                return;
            }
            checkboxPassed.forEach(checkbox => checkbox.checked = true);
        },
        /**
         * 약관상세 팝업 이벤트
         */
        fn_clickButtonTermsDetail: (callback) => {
            const btnAgreeDetail = document.querySelectorAll('.btn_agree_detail');
            btnAgreeDetail.forEach(element => {
                element.addEventListener('click', (e) => {
                	// A11Y
                	termClickObj = element;
                	
                    const fileName = element.dataset.fileName.split(' ').length > 1 ?
                    element.dataset.fileName.split(' ') :
                        [element.dataset.fileName];
                    commMo.terms.fileNameList = commMo.terms.fn_getTermsInfo(fileName);
                    commMo.terms.fn_openPopupTermsDetail(callback);
                });
            });
        },
        /**
         * 전체선택 버튼이 detail_title 인지 여부 체크
         */
        fn_checkIsTitleCheckAll: () => {
            const isTitleCheckboxAll = document.querySelector('.detail_title .chk_all');
            return isTitleCheckboxAll ? true : false;
        },
        /**
         * 필수 체크박스 체크여부 확인
         */
        fn_checkRequiredAll: () => {
            const checkRequiredList = document.querySelectorAll('.chk_required');
            const checkRequiredCheckedList = document.querySelectorAll('.chk_required:checked');
            if (checkRequiredList.length === checkRequiredCheckedList.length) {
                return true;
            } else {
                return false;
            }
        },
        /**
         * 전체 체크박스 체크여부 확인
         */
        fn_checkCheckboxCheckedAll: () => {
            const checkboxList = document.querySelector('.terms_basic') ? document.querySelectorAll('.terms_basic .detail_title .ebcheckbox') : document.querySelectorAll('.detail_title .ebcheckbox');
            const checkboxCheckedAll = document.querySelector('.terms_basic') ? document.querySelectorAll('.terms_basic .detail_title .ebcheckbox:checked') : document.querySelectorAll('.detail_title .ebcheckbox:checked')
            const checkboxAll = document.querySelector('.chk_all');
            if (checkboxList.length === checkboxCheckedAll.length) {
                checkboxAll.checked = true;
            } else {
                checkboxAll.checked = false;
            }
        },
        /**
         * 전체 체크박스 체크여부 확인(신용대출 전용)
         */
        fn_checkCheckboxCheckedAllCredit: () => {
            const checkboxList = document.querySelectorAll('.detail_agree .ebcheckbox');
            const checkboxCheckedAll = document.querySelectorAll('.detail_agree .ebcheckbox:checked')
            const checkboxAll = document.querySelector('.chk_all_credit');
            if (checkboxList.length === checkboxCheckedAll.length) {
                checkboxAll.checked = true;
            } else {
                checkboxAll.checked = false;
            }
        },
        /**
         * 약관 상세 팝업 열기
         */ 
        fn_openPopupTermsDetail: (callback) => {
            if (!commMo.terms.fileNameList[0]) {
                if (document.querySelector('.chk_all_credit')) {
                    commMo.terms.fn_checkCheckboxCheckedAllCredit();
                } else {
                    commMo.terms.fn_checkCheckboxCheckedAll();
                }
                return;
            }
            const { TITLE, FILE_NAME } = commMo.terms.fileNameList[0];
            CommPop.showAgreeTermsDetail(TITLE, `/agree/${FILE_NAME}.html`, function(response) {
                if (response.agreeTerms === 'Y') {
                    const termsCheckedTrue = commMo.terms.fn_checkIsTitleCheckAll() ? 
                        Array.from(document.querySelectorAll('.detail_conts .ebcheckbox')).filter(element => element.dataset && element.dataset.fileName === FILE_NAME)[0] :
                        Array.from(document.querySelectorAll('.detail_title .ebcheckbox')).filter(element => element.dataset && element.dataset.fileName === FILE_NAME)[0];
                    if (termsCheckedTrue) {
                        termsCheckedTrue.checked = true;
                    }
                    const TERMS_CREDIT = ['new_comm_pop_agree11', 'new_comm_pop_agree12', 'new_comm_pop_agree13', 'new_comm_pop_agree14'] // 개인(신용)정보 선택적 동의서 약관 목록
                    if (TERMS_CREDIT.includes(FILE_NAME)) {
                        // const termsCreditCollection = Array.from(document.querySelectorAll('.ebcheckbox')).filter(checkbox => checkbox.dataset?.fileName === FILE_NAME)[0];
                        const termsCreditCollection = Array.from(document.querySelectorAll('.ebcheckbox')).filter(checkbox => checkbox.dataset && checkbox.dataset.fileName === FILE_NAME)[0];
                        Array.from(termsCreditCollection.parentNode.parentNode.querySelectorAll('.ebcheckbox')).forEach(checkbox => checkbox.checked = true);
                        // Array.from(document.querySelectorAll('.ebcheckbox')).filter(checkbox => checkbox.dataset?.fileName?.split(' ').length > 1)[0].checked = true;
                        Array.from(document.querySelectorAll('.ebcheckbox')).filter(checkbox => checkbox.dataset && checkbox.dataset.fileName && checkbox.dataset.fileName.split(' ').length > 1)[0].checked = true;
                    }
                }
                commMo.terms.fileNameList.splice(0, 1);
                if (commMo.terms.fileNameList.length) {
                    // commPop 콜백에 setTimeout이 걸려있어 부득이하게 추가함
                    setTimeout(() => {
                        commMo.terms.fn_openPopupTermsDetail(callback);
                    }, 100)
                } else {
                    commMo.terms.fn_handleTermsAdvertisement();
                    
                    if (callback) {
                        callback({isCheckedRequired: commMo.terms.fn_checkRequiredAll()});
                    }
                }
                // commMo.terms.fn_checkRequiredAll();
                if (commMo.terms.fn_isExistingCheckboxAll()) {
                    if (document.querySelector('.chk_all_credit')) {
                        commMo.terms.fn_checkCheckboxCheckedAllCredit();
                    } else {
                        commMo.terms.fn_checkCheckboxCheckedAll();
                    }
                }
                return;
            });
        },
        /**
         * 개인(신용)정보 선택적 동의서 약관 핸들링
         */
        fn_handleTermsCredit: () => {
            const checkboxTitleCredit = document.querySelector('.chk_credit');
            if (!checkboxTitleCredit) {
                return;
            }
            const checkboxCredit = Array.from(checkboxTitleCredit.parentNode.parentNode.parentNode.querySelectorAll('.detail_conts .checkbox_pack > .ebcheckbox'));
            checkboxCredit.forEach(element => {
                element.addEventListener('click', () => {
                	// A11Y
                	termClickObj = element;
                	
                    const TERMS_CREDIT = ['new_comm_pop_agree11', 'new_comm_pop_agree13'];
                    const TERMS_PROVIDE = ['new_comm_pop_agree12', 'new_comm_pop_agree14'];
                    if (element.parentNode.parentNode.classList.contains('chkbox_list')) {
                        commMo.terms.fn_handleTermsCreditIndividual(element);
                    } else if (TERMS_CREDIT.includes(element.dataset.fileName)) {
                        commMo.terms.fn_checkTermsCreditCollection(element, [element.dataset.fileName]);
                    } else if (TERMS_PROVIDE.includes(element.dataset.fileName)) {
                        commMo.terms.fn_checkTermsCreditProvide(element, [element.dataset.fileName]);
                    }
                });
            });
        },
        /**
         * 개인(신용)정보 선택적 동의서 수집/이용 제목 체크
         */
        fn_checkTermsCreditCollection: (element, fileName) => {
            if (element.checked) {
                element.checked = false;
                commMo.terms.fileNameList = commMo.terms.fn_getTermsInfo(fileName);
                const { TITLE, FILE_NAME } = commMo.terms.fileNameList[0];
                CommPop.showAgreeTermsDetail(TITLE, `/agree/${FILE_NAME}.html`, function(response) {
                    if (response.agreeTerms === 'Y') {
                        element.checked = true;
                        Array.from(element.parentNode.parentNode.querySelectorAll('.ebcheckbox')).forEach(checkbox => checkbox.checked = true);
                        commMo.terms.fn_handleTermsTitleCredit();
                    }
                });
            } else {
                Array.from(element.parentNode.parentNode.querySelectorAll('.ebcheckbox')).forEach(checkbox => checkbox.checked = false);
                commMo.terms.fn_handleTermsTitleCredit();
            }
        },
        /**
         * 개인(신용)정보 선택적 동의서 제공에 관한 사항 제목 체크
         */
         fn_checkTermsCreditProvide: (element, fileName) => {
            if (element.checked) {
                element.checked = false;
                commMo.terms.fileNameList = commMo.terms.fn_getTermsInfo(fileName);
                const { TITLE, FILE_NAME } = commMo.terms.fileNameList[0];
                CommPop.showAgreeTermsDetail(TITLE, `/agree/${FILE_NAME}.html`, function(response) {
                    if (response.agreeTerms === 'Y') {
                        element.checked = true;
                        commMo.terms.fn_handleTermsTitleCredit();
                    }
                });
            } else {
                commMo.terms.fn_handleTermsTitleCredit();
            }
        },
        /**
         * 개인(신용)정보 선택적 동의서 수집/이용 매체 개별 약관 핸들링
         */
        fn_handleTermsCreditIndividual: (element) => {
            if (element.checked) {
                element.checked = false;
                if ( !Array.from(element.parentNode.parentNode.querySelectorAll('.ebcheckbox')).filter(checkbox => checkbox.checked).length ) {
                    const fileName = [Array.from(element.parentNode.parentNode.parentNode.querySelectorAll('.checkbox_pack'))[0].querySelector('.ebcheckbox').dataset.fileName];
                    commMo.terms.fileNameList = commMo.terms.fn_getTermsInfo(fileName);
                    const { TITLE, FILE_NAME } = commMo.terms.fileNameList[0];
                    CommPop.showAgreeTermsDetail(TITLE, `/agree/${FILE_NAME}.html`, function(response) {
                        if (response.agreeTerms === 'Y') {
                            element.checked = true;
                            if (element.classList.contains('chk_all_collection')) {
                                commMo.terms.fn_checkTermsCreditAll(true);
                                commMo.terms.fn_handleTermsTitleCollection(element);
                            } else {
                                commMo.terms.fn_handleTermsTitleCollection(element);
                                commMo.terms.fn_handleTermsCheckAllCollection(element);
                            }
                        }
                    });
                } else {
                    element.checked = true;
                    if (element.classList.contains('chk_all_collection')) {
                        commMo.terms.fn_checkTermsCreditAll(true);
                        commMo.terms.fn_handleTermsTitleCollection(element);
                    } else {
                        commMo.terms.fn_handleTermsTitleCollection(element);
                        commMo.terms.fn_handleTermsCheckAllCollection(element);
                    }
                }
            } else {
                if (element.classList.contains('chk_all_collection')) {
                    commMo.terms.fn_checkTermsCreditAll(false);
                    commMo.terms.fn_handleTermsTitleCollection(element);
                } else {
                    commMo.terms.fn_handleTermsTitleCollection(element);
                    commMo.terms.fn_handleTermsCheckAllCollection(element);
                }
            }
        },
        /**
         * 개인(신용)정보 선택적 동의서 수집/이용 약관 전체 체크
         */
        fn_checkTermsCreditAll: (isChecked) => {
            const checkboxTitleCredit = document.querySelector('.chk_credit');
            const checkboxCredit = Array.from(checkboxTitleCredit.parentNode.parentNode.parentNode.querySelectorAll('.detail_conts .chkbox_list .ebcheckbox'));
            checkboxCredit.forEach(checkbox => checkbox.checked = isChecked);
            checkboxTitleCredit.checked = isChecked;
            if (document.querySelector('.chk_all_credit')) {
                commMo.terms.fn_checkCheckboxCheckedAllCredit();
            }
        },
        /**
         * 개인(신용)정보 선택적 동의서 약관 제목 핸들링
         */
        fn_handleTermsTitleCredit: () => {
            const checkboxTitleCredit = document.querySelector('.chk_credit');
            const checkboxCredit = Array.from(checkboxTitleCredit.parentNode.parentNode.parentNode.querySelectorAll('.detail_conts .checkbox_pack .ebcheckbox:checked'));
            if (checkboxCredit.length) {
                checkboxTitleCredit.checked = true;
            } else {
                checkboxTitleCredit.checked = false;
            }
            if (document.querySelector('.chk_all_credit')) {
                commMo.terms.fn_checkCheckboxCheckedAllCredit();
            }
        },
        /**
         * 개인(신용)정보 선택적 동의서 수집/이용 약관 제목 핸들링
         */
        fn_handleTermsTitleCollection: (element) => {
            const checkboxTitleCredit = Array.from(element.parentNode.parentNode.parentNode.querySelectorAll('.checkbox_pack'))[0].querySelector('.ebcheckbox');
            const checkboxCreditChecked = Array.from(element.parentNode.parentNode.parentNode.querySelectorAll('.chkbox_list .ebcheckbox:checked'));
            if (checkboxCreditChecked.length) {
                checkboxTitleCredit.checked = true;
            } else {
                checkboxTitleCredit.checked = false;
            }
            if (document.querySelector('.chk_all_credit')) {
                commMo.terms.fn_checkCheckboxCheckedAllCredit();
            }
        },
        /**
         * 개인(신용)정보 선택적 동의서 수집/이용 전체 약관 핸들링
         */
        fn_handleTermsCheckAllCollection: (element) => {
            const checkboxTitleCredit = element.parentNode.parentNode.parentNode.querySelector('.chkbox_list .chk_all_collection');
            const checkboxCreditList = Array.from(element.parentNode.parentNode.parentNode.querySelectorAll('.chkbox_list .chk_collection'));
            const checkboxCreditChecked = Array.from(element.parentNode.parentNode.parentNode.querySelectorAll('.chkbox_list .chk_collection:checked'));
            if (checkboxCreditList.length === checkboxCreditChecked.length) {
                checkboxTitleCredit.checked = true;
            } else {
                checkboxTitleCredit.checked = false;
            }
            commMo.terms.fn_handleTermsTitleCredit();
            if (document.querySelector('.chk_all_credit')) {
                commMo.terms.fn_checkCheckboxCheckedAllCredit();
            }
        },
        /**
         * 광고성 정보 수신 동의 약관 존재 여부 확인
         */
        fn_isExistingTermsAdvertisement: () => {
            const isExistingTermsAdvertisement = document.querySelector('.chk_advertisement');
            return isExistingTermsAdvertisement ? true : false;
        },
        /**
         * 광고성 정보 수신 동의 약관 핸들링
         */
        fn_handleTermsAdvertisement() {
            if (!commMo.terms.fn_isExistingTermsAdvertisement()) {
                return;
            }
            const termsStatusList = commMo.terms.fn_getTermsStautusIsChecked();

            // 광고성 정보 수신동의 약관 파일명 목록
            const FILE_NAME_ADVERTISEMENT = ['comm_pop_agree78', 'comm_pop_agree79', 'comm_pop_agree71', 'comm_pop_agree72'];
            if (termsStatusList.filter(terms => FILE_NAME_ADVERTISEMENT.includes(terms.fileName)).filter(terms => terms.isChecked === true).length) {
                commMo.terms.fn_activateTermsAdvertisement();
                commMo.terms.fn_checkTrueAllCheckboxAdvertisement();
            } else {
                commMo.terms.fn_inactivateTermsAdvertisement();
                commMo.terms.fn_checkFalseAllCheckboxAdvertisement();
            }
        },
        /**
         * 광고성 정보 수신 동의 약관 활성화
         */
        fn_activateTermsAdvertisement: () => {
            if (!commMo.terms.fn_isExistingTermsAdvertisement() ) {
                return;
            }
            const checkboxAdvertisement = Array.from(document.querySelectorAll('.recommend_part .ebcheckbox'));
            checkboxAdvertisement.map(checkbox => checkbox.disabled = false);
        },
        /**
         * 광고성 정보 수신 동의 약관 비활성화
         */
        fn_inactivateTermsAdvertisement: () => {
            if (!commMo.terms.fn_isExistingTermsAdvertisement() ) {
                return;
            }
            const checkboxAdvertisement = Array.from(document.querySelectorAll('.recommend_part .ebcheckbox'));
            checkboxAdvertisement.map(checkbox => checkbox.disabled = true);
        },
        /**
         * 광고성 정보 수신 동의 약관 전체 체크
         */
        fn_checkTrueAllCheckboxAdvertisement: () => {
            if (!commMo.terms.fn_isExistingTermsAdvertisement() ) {
                return;
            }
            const checkboxAdvertisement = Array.from(document.querySelectorAll('.recommend_part .ebcheckbox'));
            checkboxAdvertisement.map(checkbox => checkbox.checked = true);
        },
        /**
         * 광고성 정보 수신 동의 약관 전체 체크 해제
         */
        fn_checkFalseAllCheckboxAdvertisement: () => {
            if (!commMo.terms.fn_isExistingTermsAdvertisement() ) {
                return;
            }
            const checkboxAdvertisement = Array.from(document.querySelectorAll('.recommend_part .ebcheckbox'));
            checkboxAdvertisement.map(checkbox => checkbox.checked = false);
        },
        /**
         * 광고성 정보 수신 동의 약관 선택
         */
        fn_checkTermsAdvertisement: () => {
            if (!commMo.terms.fn_isExistingTermsAdvertisement() ) {
                return;
            }
            const checkboxAdvertisement = document.querySelector('.recommend_part > .checkbox_pack > .ebcheckbox');
            if (checkboxAdvertisement) {
                checkboxAdvertisement.addEventListener('click', (e) => {
                    if (e.target.checked) {
                        commMo.terms.fn_checkTrueAllCheckboxAdvertisement();
                    } else {
                        commMo.terms.fn_checkFalseAllCheckboxAdvertisement();
                    }
                });
            }
        },
        /**
         * 광고성 정보 수신 동의 채널 체크 전체 해제
         */
        fn_checkboxAdvertisementChannelCheckedFalseAll: () => {
            if (!commMo.terms.fn_isExistingTermsAdvertisement() ) {
                return;
            }
            const checkboxAdvertisementChannel = Array.from(document.querySelectorAll('.recommend_part > .chkbox_list .ebcheckbox'));
            checkboxAdvertisementChannel.map(checkbox => checkbox.checked = false);
        },
        /**
         * 광고성 정보 수신 동의 채널 선택
         */
        fn_checkCheckboxAdvertisementChannel: () => {
            if (!commMo.terms.fn_isExistingTermsAdvertisement() ) {
                return;
            }

            const checkboxAllAdvertisementChannel = document.querySelector('.chk_all_advertisement');
            const checkboxAdvertisementChannel = Array.from(document.querySelectorAll('.chk_advertisement'));
            const checkboxAdvertisement = document.querySelector('.recommend_part > .checkbox_pack > .ebcheckbox');

            checkboxAllAdvertisementChannel.addEventListener('click', (e) => {
                if (e.target.checked) {
                    checkboxAdvertisementChannel.map(checkbox => checkbox.checked = true);
                    checkboxAdvertisement.checked = true;
                } else {
                    checkboxAdvertisementChannel.map(checkbox => checkbox.checked = false);
                    checkboxAdvertisement.checked = false;
                }
            });

            checkboxAdvertisementChannel.forEach((checkbox) => {
                checkbox.addEventListener('click', (e) => {
                    
                    const checkboxAdvertisementChannelChecked = Array.from(document.querySelectorAll('.chk_advertisement:checked'));
                    if (checkboxAdvertisementChannelChecked.length) {
                        checkboxAdvertisement.checked = true;
                    } else {
                        checkboxAdvertisement.checked = false;
                    }
                    if (checkboxAdvertisementChannelChecked.length === checkboxAdvertisementChannel.length) {
                        checkboxAllAdvertisementChannel.checked = true;
                    } else {
                        checkboxAllAdvertisementChannel.checked = false;
                    }
                });
            });
        },
        /**
         * 전체 약관 체크 상태값 가져오기
         */
        fn_getTermsStautusIsChecked: () => {
            return Array.from(document.querySelectorAll('.detail_title .ebcheckbox')).map(checkbox => {
                return {
                    fileName: checkbox.dataset.fileName,
                    isChecked: checkbox.checked
                }
            });
        },
        /**
         * 약관파일 정보 가져오기
         */
        fn_getTermsInfo: (fileNameList) => {
            return fileNameList.map(fileName => {
                const termsInfo = commMo.terms.TERMS_INFO_LIST.filter(terms => terms.FILE_NAME === fileName);
                if (termsInfo.length) {
                    return {
                        FILE_NAME: termsInfo[0].FILE_NAME,
                        TITLE: termsInfo[0].TITLE
                    }
                } 
            }).filter(element => element);
            // return commMo.terms.TERMS_INFO_LIST.filter(terms => fileNameList.includes(terms.FILE_NAME));
        }
    },
    /**
     * 현재날짜 가져오기
     * @param {String} seperator
     */
    fn_getCurrentTime: (seperator = '') => {
        const now = new Date();
        const year = now.getFullYear();
        const month = (now.getMonth() + 1).toString().padStart(2, '0');
        const day = now.getDate().toString().padStart(2, '0');
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const seconds = now.getSeconds().toString().padStart(2, '0');
        return `${year}${seperator}${month}${seperator}${day}`;
        // return `${year}${month}${day}${hours}${minutes}${seconds}`;
    },
    /**
     * 계좌번호 포맷팅 (4자리 - 4자리 - 나머지)
     * @param {String} accountNumber
     * @param {String} seperator
     */
    fn_convertFormatAccountNumber: (accountNumber, seperator = '-') => {
        accountNumber = accountNumber.replace(/[^0-9]/g, '');
        const accountNumberFirst = accountNumber.substring(0, 4);
        const accountNumberSecond = accountNumber.substring(4, 8);
        const accountNumberThird = accountNumber.substring(8);
        return [accountNumberFirst, accountNumberSecond, accountNumberThird].filter(number => number).join(seperator);
    },
    fn_goAlloneHome : ()=>{
    	// 올원 홈 버튼 제어
    	$("#btnAllOneHome").click(function() {
    		fn_getAllOneEncSendData("main");
    	});
    }
    
}

/**
 * 올원뱅크 encSendData 생성
 */
const fn_getAllOneEncSendData = function(type){
	let encSendData = "";
    const url = "/allone/loanDetails/ajaxGetEncSendData.nh";
    const sendData = {
            backType: type
        }
    
    comm.callAjaxJson(url,sendData,function(data){
    	encSendData = data.result;
    	location.href = "Financetoapp://navigate?data=" + encSendData;
    });
}

/**
 * 회원정보 변경 전문
 */
const fn_edit_member_information_mo = function(){
   
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
                    option.type = "a";
                    option.icon = "Y";
                    option.cont = errMsg;
                    CommMsg.msgPop(option,function(){return false;});
                }
            }
        }
        
    });
}

/**
 * 회원탈퇴 전문 
 */
const fn_out_member_information_mo = function(){
    const url = "/myaccnt/member/memberInfo/ajaxMemberInfoOut.nh";
    const sendData = {};
    comm.callAjaxJson(
        url,
        sendData,
        function(resData){

    		if(resData.resultType === "E"){
    			CommMsg.alert(resData.resultMsg);
    		} else {

    	        var result = resData.result;
    			var sysData = result.response['SYSTEM']; 	//시스템부 데이터 ("SYSTEM")
    			var errData= result['message'];  	//메세지 데이터 ("MESSAGE")
    			var resultData = result['data'];; 	//결과 데이터("DATA")
    			var success = sysData['PRCS_RSLT_DVCD']; 	//결과구분코드(헤더값)
    			
    	        if(success === "S"){
                    const procyon = resultData.PROC_YN_S1;
                    if(procyon === "Y"){
                        /* 회원탈퇴 완료 */
                        // comm.reqPinSign("del","PIN", function(){
                        	
                        // });
                        const option = {
                            type : "a",
                            btnText : "확인",
                            title : "회원 탈퇴를 완료했습니다.",
                            cont:"재가입은 앱 재설치 후 이용이 가능합니다."
                        }
                        CommMsg.msgPop(option,function(){
                            const url = "/myaccnt/member/memberInfo/memberInfoOutFinish.nh";
                            comm.goPage(url); 
                        });
                                            
                    }else{
                        /* 회원탈퇴 불가 */
                        const option = {};
                        option.type = "a";
                        option.icon = "Y";
                        option.btnText = "확인";
                        option.title = "죄송합니다.<br>오류가 발생해 탈퇴를 진행하지 못했습니다. 처음부터 다시 진행해주세요.";
                        CommMsg.msgPop(option,function(){
                                const url = "/myaccnt/member/memberInfo/selectMemberInfoOutForm.nh"; //회원탈퇴_개인 페이지로 이동 
                                comm.goPage(url);
                            });
                    }
    	        }else{
                    if(errData != "" || errData != null || errData != 'undefined'){
                        const msgGroup = errData['MSG_GROUP'];
                        const msgInfo = msgGroup.pop(0);
                        const errMsg = msgInfo['RSP_MSG_AD'];
                        const option = {};
                        option.type = "a";
                        option.icon = "Y";
                        option.cont = errMsg;
                        CommMsg.msgPop(option,function(){return false;});
                    }
    	        }
    		}
        });
}

/** 2024.08.23 채널계 개선 사업 
 *  내 정보 변경 시 휴대전화번호 변경된 경우 휴대폰 인증
 */
const fn_edit_my_information_mo = function(){
   
    const url = "/myaccnt/member/memberInfo/ajaxMyInfoHpAuthEdit.nh";
    comm.callAjaxJson(url,{},function(data){
    	var success = data.SUCCESS;
    	if(success === "E"){
    		CommMsg.alert(data.resultMsg);
    	} else {
    		// 전자서명 인증
//    		fn_certify_electronic_sign_mo();
    		fn_ajax_my_info_mo();
    	}
    });
}

/** 2024.08.23 채널계 개선 사업 
 *  내 정보 변경 시 휴대폰 인증 후 전자서명 진행 (일단 막아둠)
 */
//const fn_certify_electronic_sign_mo = function() {
//    const param = {
//        type:1,
//        callbackFunctionName : 'fn_ajax_my_info_mo',
//        interfaceId : 'INT_M_COR_S_CST95475',
//        jsonData: {}
//    };
//    commMo.fn_call_cert_sign(param);
//}

/** 2024.08.23 채널계 개선 사업 
 *  내 정보 변경
 */
const fn_ajax_my_info_mo = function(){
    const url = "/myaccnt/member/memberInfo/ajaxMyInfoEdit.nh";
	const sendData = {};
    comm.callAjaxJson(url,sendData,function(data){
    	console.log(data)
    	var result = data.result;
		var resultData = result['data']; 		//결과 데이터("DATA")
		var errData= result['message'];  		//메세지 데이터 ("MESSAGE")
        var success = resultData['SCS_YN_S1']; 	//내 정보 변경 성공 여부
        
        if(success === "Y"){
            CommMsg.msgPop(
            	{type:"a",title:"내 정보가 수정되었습니다."},
                function(){
                    const url = "/home/homemain.nh";
                    comm.goPage(url);
            });
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



const callbackOcrFunc = (resData) =>{
  const sessionInfo = JSON.parse(sessionStorage.getItem("applyInfo"));
    sessionInfo.ocrInfo = resData;
    /**
     * {
        "action_type": "submit",
        "id_type": "1",
        "id_image": "base64 enconding image",
        "id_name": "홍길동",
        "id_str": "주민등록번호",
        "id_license": "운전면허증번호",
        "id_date": "2021.12.15",
        "id_chkstr": "7SEE8D"
        }
     */
    //ocr 값 세션스토리지에 저장
    sessionStorage.setItem("applyInfo",sessionInfo);
    //직접 서명을 제외한 나머지 호출
    
    //직접 서명 호출
    const formData = {};
    const mid = sessionInfo.mid;
    if(mid=="ltrc"){
        formData.signType = "0"                                     //서명타입
        formData.crfName = "nh_01"                                  //약정서 파일이름
        formData.CONT_NO = sessionInfo.applyUserInfo.contNo;        // 계약번호
        formData.CUSTNO = sessionInfo.applyUserInfo.custNo;         // 사용자 번호
        formData.nhId = sessionInfo.applyUserInfo.contNo;           // 품의 번호
        formData.header1 = {};
        comm.doCertSign("frm","fn_callback_do_cert_sign","",formData);
    }else{
        formData.signType = "12345" //서명타입
        comm.doCertSign("frm","fn_callback_do_cert_sign","",formData);
    }
    
};

/**
 * 사업자 아파트 대출 신청 접수 ajax
 * 
 */
const fn_bizAptCallbackFun_mo = function () {
    const url = "/eloan/homestead/biz/ajaxBizConfirm.nh";
    const sendParam = JSON.parse(sessionStorage.getItem("bizLoanList"));

    comm.callAjaxJson(url, sendParam, function (data) {
    	
    	if(data.resultType === "E"){
			CommMsg.alert(data.resultMsg);
		} else {
	        var result = data.result;
	        var sysData = result.response['SYSTEM']; 	//시스템부 데이터 ("SYSTEM")
	        var errData = result['message'];  	//메세지 데이터 ("MESSAGE")
	        var resultData = result['data'];; 	//결과 데이터("DATA")
	        var success = sysData['PRCS_RSLT_DVCD']; 	//결과구분코드(헤더값)

	        if (success === "S") {
	            sessionStorage.removeItem("bizLoanList");
	            comm.goPage("/eloan/homestead/biz/selectApplyCompl.nh");
	        } else {
	            CommMsg.alert("통신중 오류가 발생하였습니다.");
	            comm.goPage("/eloan/homestead/biz/selectApplyCompl.nh");
	        }
		}
    });
}
/**
 * 비밀번호변경 전문
 * 
 */
 const fn_call_ajax_edit_password_mo = function(){ 
    const url = "/myaccnt/member/memberInfo/ajaxMemberInfoPwEdit.nh";
    const sendData = $("#frm").serializeObject();
    comm.callAjaxSec(url,sendData,function(data){
        const success = data.SUCCESS;

        if(success === "S"){
            const result = data['result'];
            const resultData = result['data'];
            const editpwyon = resultData['CRTF_SCS_YN_S1']; //비밀번호 변경 성공 여부
            if(editpwyon === "Y"){
                const option = {
                    type : "a",
                    btnText : "확인",
                    title : "비밀번호가 수정되었습니다."
                }
                CommMsg.msgPop(option,fn_callback_edit_password_mo);
            }else{
                const errMsg = resultData['PW_CHG_FAIL_MSG_S100'];
                CommMsg.msgPop({type:"a",icon:"Y",cont:errMsg},function(){
                    const url = "/myaccnt/member/memberInfo/selectMemberInfoNewPwForm.nh";
                    comm.goPage(url);
                });
            }
        }else{
            CommMsg.msgPop({type:"a",icon:"Y",cont:"정보 확인중 오류입니다."});
            return false;
        }
        
    })
}
/**
 * 비밀번호변경 성공 callback
 * 
 */
const fn_callback_edit_password_mo = function(){//비밀번호변경 콜백
	const nextUrl = sessionStorage.getItem("nextUrl");
	if(nextUrl){
		sessionStorage.removeItem("nextUrl");
		comm.goPage(nextUrl);
	}else{
		const url = "/home/homemain.nh";
		comm.goPage(url);
	}
}
/**
 * 신차 본인인증 성공 callback
 * 
 */
const fn_callback_loan_info_mo = function(){
	const mid = sessionStorage.getItem('mid');
    const custkind = sessionStorage.getItem('custkind');
	const url = "/eloan/carfinance/car/selectLoanInfo.nh?mid="+mid+"&custkind="+custkind;
	
	// 디파이너리(애드브릭스) 이벤트 호출 : 신차_대출신청 본인인증 완료 시점
    fn_call_dfinery_car_event(mid, "self_auth");
    
	comm.goPage(url);
}
/**
 * 신용대출 진행상태 조회 ajax
 * 
 */
 const fn_call_ajax_creditLoan_progressStatus_mo = function(){
    const url = "/eloan/credit/selectCreditLoanProgressStatus.nh";
    const sendData = {};
    
    // 디파이너리(애드브릭스) 이벤트 호출 : 본인인증 완료 시점
	var eventPrefix = (sessionStorage.getItem("inflDvcd") === "B") ? "employee" : "credit"; // 임직원대출 : 신용대출
	if (sessionStorage.getItem("addLoanYn") === "Y") eventPrefix += "_add";
	fn_call_dfinery_event({ eventName: `${eventPrefix}_self_auth` });
	
    comm.callAjaxJson(url,sendData,function(rtnData){

        const resultCd = rtnData.resultCode;
        if(resultCd === "S"){
            const prgsStcd = rtnData.prgsStcd;
            let option = {}; 
            switch(prgsStcd){
                case "000" :
                    /* 최초진입 */
                    //comm.goPage("/eloan/credit/insertCreditLoanCustInfo.nh");
                    //comm.goPage("/comm/auth/scrapingAuthForm.nh");
                    comm.goPage("/eloan/scraping/firstInquiry.nh");
                    break;
                case "100" :
                    /* 이어하기 */
                	comm.hideProgress();
                    const prgsStep = rtnData.prgsStep;                
                    let stepNm = "";
                    let stepUrl = "";
                    if(prgsStep === "01"){
                        stepNm = "한도결과 안내";
                        stepUrl = "/eloan/credit/selectCreditLoanLimitResult.nh";
                    }else if(prgsStep === "02"){
                        stepNm = "적합성·적정성 진단";
                        stepUrl = "/eloan/credit/insertCreditLoanPFCInfo.nh";
                    }else if(prgsStep === "03"){
                        stepNm = "대출신청완료";
                        if(rtnData.chkChannel === "MA") {
            				stepUrl = "/eloan/credit/selectCreditLoanContractDetail.nh";
            			}else {
            				stepUrl = "/eloan/credit/selectCreditLoanApplyFinish.nh";
            			}
                    }
                    option = {
                        type:"c",
                        btnLeft : "신규로 진행하기",
                        btnRight : "이어하기 진행",
                        title : "신용대출 이어하기",
                        cont : "신용대출 상품의 ["+ stepNm + "]단계에 이어하기가 있습니다.<br/>이어서 진행하시겠습니까?"
                    };
                    CommMsg.msgPop(option,
                        function(){comm.goPage(stepUrl)},
                        function(){ comm.goPage("/eloan/credit/insertCreditLoanCustInfo.nh");
                    });
                    break;
                case "998" :
                    /* 타상품의 신청건이 있는 경우 - 998 */
                	comm.hideProgress();
                    option = {
                        type :"a",
                        icon:"Y",
                        btnTxt : "메인 페이지로 이동",
                        title : "대출 대상이 아닙니다.",
                        cont :"고객님은 이미 대출신청건이 존재합니다.<br/>해당 상품의 신청건이 마감되면 대출진행을 하실 수 있습니다.",
                    };
                    CommMsg.msgPop(option,
                        function(){
                            comm.goMain();
                        });
                    break;
                case "999" :
                    /* 대출 불가상태(기존3건 존재하는 경우) - 999 */
                	comm.hideProgress();
                    option = {
                        type :"a",
                        icon:"Y",
                        btnTxt : "메인 페이지로 이동",
                        title : "대출 대상이 아닙니다.",
                        cont :"이미 3건의 신용대출을 이용하시고 있습니다.<br/> 더 이상 대출을 진행하실 수 없습니다.", 
                    };
                    CommMsg.msgPop(option,
                        function(){
                            comm.goMain();
                        });
                    break;    
                default : 
                    break ;
            }
        }else{
        	comm.hideProgress();
            const resultMsg = rtnData.resultMsg;
            CommMsg.msgPop({type:"a",icon:"Y",cont:resultMsg});
            return false;
        }
    });
};

const fn_call_ajax_creditLoan_progressStatus_mo2 = function(){
    const url = "/allone/credit/selectCreditLoanProgressStatus.nh";
    const sendData = {};
    
    comm.callAjaxJson(url,sendData,function(rtnData){

        const resultCd = rtnData.resultCode;
        if(resultCd === "S"){
            const prgsStcd = rtnData.prgsStcd;
            let option = {}; 
            switch(prgsStcd){
                case "000" :
                    /* 최초진입 */
                    //comm.goPage("/allone/credit/insertCreditLoanCustInfo.nh");
                    //comm.goPage("/comm/auth/scrapingAuthForm.nh");
                    comm.goPage("/eloan/scraping/firstInquiry.nh");
                    break;
                /*올원뱅크에서 이어하기 미제공*/
                case "998" :
                    /* 타상품의 신청건이 있는 경우 - 998 */
                	comm.hideProgress();
                    option = {
                        type :"a",
                        icon:"Y",
                        btnTxt : "메인 페이지로 이동",
                        title : "대출 대상이 아닙니다.",
                        cont :"고객님은 이미 대출신청건이 존재합니다.<br/>해당 상품의 신청건이 마감되면 대출진행을 하실 수 있습니다.",
                    };
                    CommMsg.msgPop(option,
                        function(){
                            comm.goPage('/allone/loanDetails/selectMyLoanList.nh');
                        });
                    break;
                case "999" :
                    /* 대출 불가상태(기존3건 존재하는 경우) - 999 */
                	comm.hideProgress();
                    option = {
                        type :"a",
                        icon:"Y",
                        btnTxt : "메인 페이지로 이동",
                        title : "대출 대상이 아닙니다.",
                        cont :"이미 3건의 신용대출을 이용하시고 있습니다.<br/> 더 이상 대출을 진행하실 수 없습니다.", 
                    };
                    CommMsg.msgPop(option,
                        function(){
                            comm.goPage('/allone/loanDetails/selectMyLoanList.nh');
                        });
                    break;    
                default : 
                    break ;
            }
        }else{
        	comm.hideProgress();
            const resultMsg = rtnData.resultMsg;
            CommMsg.msgPop({type:"a",icon:"Y",cont:resultMsg});
            return false;
        }
    });
};

/**
 * 대출이동 진행상태 조회 ajax
 */
 const fn_call_ajax_loanTransfer_progressStatus_mo = function(){
    const url = "/eloan/credit/selectLoanTransferProgressStatus.nh";
    const sendData = {};
    
    comm.callAjaxJson(url,sendData,function(rtnData){

        const resultCd = rtnData.resultCode;
        if(resultCd === "S"){
            //comm.goPage("/eloan/credit/insertLoanTransferCustInfo.nh");
        	comm.goPage("/eloan/scraping/firstInquiry.nh");
        }else{
        	comm.hideProgress();
            const resultMsg = rtnData.resultMsg;
            CommMsg.msgPop({type:"a",icon:"Y",cont:resultMsg});
            return false;
        }
    });
};

/**
 *  직접 서명 전역 콜백 함수 객체
 */
const certificationSignature = {
    //장기 렌트카 직접 서명 콜백
    fn_ltrc_callback:(response) =>{

        let sessionInfo = JSON.parse(sessionStorage.getItem("applyInfo"));

        const custNo = sessionInfo.payInfo.custNo;
        const contNo = sessionInfo.payInfo.contNo;
        const hmpgOnlnAgreGdsDvcd = sessionInfo.payInfo.hmpgOnlnAgreGdsDvcd;
        
        const jsonParam = {
			IMG_PATH: response.resultPDF,
			BIZ_CD: "IM007",		// IM001 : 신산업재 / IM002 : 중고산업재 / IM007: 장기렌트카
			DOC_CD: 'D0023',			// D0023 : PDF / D0024 : TSA
			DOC_CNT: '1',
			REG_DATE: commMo.fn_getCurrentTime(),
			INSERT_ID: 'System',
			CUSTMRCDE: custNo,
			CONFLDNBR: contNo,
			DOC_DATE: '',
			ESMFLDNBR: '',
			EXCFLDNBR: '',
			ETCFLDTXT: '',
			IMGRSTCDE: '',
			MEMO: ''
		}
        
        let urlPath = document.location.protocol + "//" + document.location.host;
        if (document.location.host != "m.nhcapital.co.kr"){
        	urlPath = "https://tm.nhcapital.co.kr";
        }
        const ociUrl = urlPath + "/3rd/clipsoft/ClipReport4/ClipToGetKey.jsp?jspName=ociBypass.jsp";
        
        
        $.ajax({
            type : "post",
            url : ociUrl,
            data : jsonParam,
            dataType : "json",
            contentType:"application/x-www-form-urlencoded;charset=utf-8",
            async: false,
            beforeSend:function(xhr){
                comm.showLoading();
            },
            success : function(data) {
            	// 전자약정서 등록 완료 후 TSA 약정서 파일 등록 처리 
            	 if (data.result === 'Y') {
                    certificationSignature.fn_registerContractRentcarTSA(response);
                } else {
                    CommMsg.alert(data.resultMSG);
                }
            	
            },
            complete:function(){
                comm.hideLoading();
            },
            error:function(data, status, error){
                CommMsg.alert("일시적오류 입니다. 다시 시도해주시기 바랍니다.");
            }
        });
    },

    /**
     * 
     * 승계 약정(렌터카)용 - 직접 서명 콜백함수
     * by 김예림 2022-05-25
     */

    fn_sucs_ltrc_callback:(response) =>{

        let sessionInfo = JSON.parse(sessionStorage.getItem("successionAgrInfo"));
        const mid = sessionInfo.sucsListData.mid;
		const contNo = sessionInfo.sucsListData.contNo;
        const custNo = sessionInfo.sucsListData.custNo;
        const hmpgOnlnAgreGdsDvcd = sessionInfo.hmpgOnlnAgreGdsDvcd;
        
        const jsonParam = {
			IMG_PATH: response.resultPDF,
			BIZ_CD: "IM007",		// IM001 : 신산업재 / IM002 : 중고산업재 / IM007: 장기렌트카
			DOC_CD: 'D0023',			// D0023 : PDF / D0024 : TSA
			DOC_CNT: '1',
			REG_DATE: commMo.fn_getCurrentTime(),
			INSERT_ID: 'System',
			CUSTMRCDE: custNo,
			CONFLDNBR: contNo,
			DOC_DATE: '',
			ESMFLDNBR: '',
			EXCFLDNBR: '',
			ETCFLDTXT: '',
			IMGRSTCDE: '',
			MEMO: ''
		}
        
        let urlPath = document.location.protocol + "//" + document.location.host;
        if (document.location.host != "m.nhcapital.co.kr"){
        	urlPath = "https://tm.nhcapital.co.kr";
        }
        const ociUrl = urlPath + "/3rd/clipsoft/ClipReport4/ClipToGetKey.jsp?jspName=ociBypass.jsp";
        
        
        $.ajax({
            type : "post",
            url : ociUrl,
            data : jsonParam,
            dataType : "json",
            contentType:"application/x-www-form-urlencoded;charset=utf-8",
            async: false,
            beforeSend:function(xhr){
                comm.showLoading();
            },
            success : function(data) {
            	// 전자약정서 등록 완료 후 TSA 약정서 파일 등록 처리 
            	 if (data.result === 'Y') {
                    certificationSignature.fn_registerContractReRentcarTSA(response);
                } else {
                    CommMsg.alert(data.resultMSG);
                }
            },
            complete:function(){
                comm.hideLoading();
            },
            error:function(data, status, error){
                CommMsg.alert("일시적오류 입니다 다시 시도해주시기 바랍니다.");
            }
        });
    },



    /*********************************************/
    // 신산업재 직접 서명 자동이체 전자서명 시작 //
    /*********************************************/
    /**
     * 전자서명 콜백(자동이체)
     */
    fn_responseCertificationSignatureFirst: (result) => {
        const returnData = JSON.parse(result.returnData);
        const imagePath = result.resultPDF;
        // certificationSignature.fn_setPaymentInformation(returnData);
        certificationSignature.fn_registerContractAutomaticTransferPDF(returnData, imagePath);
    },
    /**
     * 자동이체 약정서 등록(PDF)
     */
    fn_registerContractAutomaticTransferPDF: (returnData, imagePath) => {

        const productCode = returnData.product_code;
        const bizCode = productCode === '09' ? 'IM002' : 'IM001';
        const customerNumber = returnData.customer_number;
        const contractNumber = returnData.contract_number;

        const parameter = {
            IMG_PATH: imagePath,
            BIZ_CD: bizCode,		// IM001 : 신산업재 / IM002 : 중고산업재
            DOC_CD: 'D0001',			// D0023 : PDF / D0024 : TSA
            DOC_CNT: '1',
            REG_DATE: certificationSignature.getCurrentTime(),
            INSERT_ID: 'System',
            CUSTMRCDE: customerNumber,
            CONFLDNBR: contractNumber,
            DOC_DATE: '',
            ESMFLDNBR: '',
            EXCFLDNBR: '',
            ETCFLDTXT: '',
            IMGRSTCDE: '',
            MEMO: ''
        }
       
        let urlPath = document.location.protocol + "//" + document.location.host;
        if (document.location.host != "m.nhcapital.co.kr"){
            urlPath = "https://tm.nhcapital.co.kr";
        }
        const ociUrl = urlPath + "/3rd/clipsoft/ClipReport4/ClipToGetKey.jsp?jspName=ociBypass.jsp";

        $.ajax({
            type: "post",
            url: ociUrl,
            data: parameter,
            dataType: "json",
            contentType: "application/x-www-form-urlencoded;charset=utf-8",
            async: true,
            beforeSend: function(xhr) {
                comm.showLoading();
            },
            success: function(data) {
                if (data.result === 'Y') {
                    certificationSignature.fn_setClaimInformation(returnData);
                } else {
                    CommMsg.alert(data.resultMSG);
                }
            },
            complete: function() {
                comm.hideLoading();
            },
            error: function(data, status, error) {
                CommMsg.alert("일시적오류 입니다. 다시 시도해주시기 바랍니다.");
            }
        });
    },
    /**
     * 현재시각
     */
    getCurrentTime: () => {
        const now = new Date();
        const year = now.getFullYear();
        const month = (now.getMonth() + 1).toString().padStart(2, '0');
        const day = now.getDate().toString().padStart(2, '0');
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const seconds = now.getSeconds().toString().padStart(2, '0');
        return `${year}${month}${day}`;
        // return `${year}${month}${day}${hours}${minutes}${seconds}`;
    },
    /**
     * 청구정보 저장(00037)
     */
    fn_setClaimInformation: (returnData) => {
        const URL = '/eloan/carfinance/construct/industryapplication.nh';
        comm.callAjaxJson(URL, returnData, function (response) {
            const header = response.result.header;
            const message = response.result.message;
            if (header.PRCS_RSLT_DVCD === 'S') {
                certificationSignature.fn_goToInputInformation();
            } else {
                CommMsg.alert(`${message.MSG_GROUP[0].RSP_MSG_CN}<br>${message.MSG_GROUP[0].RSP_MSG_AD}`);
            }
        });
    },
    /**
     * 주소 및 연락처 정보 페이지로 이동
     */
    fn_goToInputInformation: () => {
        const URL = '/eloan/carfinance/construct/constructOnlineAgreeInsertForm.nh';
        location.href = URL;
    },


    /****************************************************/
    // 신산업재 직접 서명 약정서작성 신청 전자서명 시작 //
    /****************************************************/
    /**
     * 전자서명 콜백(약정서작성 신청)
     */
    fn_responseCertificationSignatureSecond(result) {
        const returnData = JSON.parse(result.returnData);
        certificationSignature.fn_registerContractIndustrialPDF(result, returnData);
    },
    /**
     * 산업재금융 약정서 등록(PDF)
     */
    fn_registerContractIndustrialPDF: (result, returnData) => {

        const productCode = returnData.product_code;
        const bizCode = productCode === '09' ? 'IM002' : 'IM001';
        const customerNumber = returnData.customer_number;
        const contractNumber = returnData.contract_number;
        const imagePath = result.resultPDF;

        const parameter = {
            IMG_PATH: imagePath,
            BIZ_CD: bizCode,		// IM001 : 신산업재 / IM002 : 중고산업재
            DOC_CD: 'D0023',			// D0023 : PDF / D0024 : TSA
            DOC_CNT: '1',
            REG_DATE: certificationSignature.getCurrentTime(),
            INSERT_ID: 'System',
            CUSTMRCDE: customerNumber,
            CONFLDNBR: contractNumber,
            DOC_DATE: '',
            ESMFLDNBR: '',
            EXCFLDNBR: '',
            ETCFLDTXT: '',
            IMGRSTCDE: '',
            MEMO: ''
        }

        let urlPath = document.location.protocol + "//" + document.location.host;
        if (document.location.host != "m.nhcapital.co.kr"){
            urlPath = "https://tm.nhcapital.co.kr";
        }
        const ociUrl = urlPath + "/3rd/clipsoft/ClipReport4/ClipToGetKey.jsp?jspName=ociBypass.jsp";

        $.ajax({
            type: "post",
            url: ociUrl,
            data: parameter,
            dataType: "json",
            contentType: "application/x-www-form-urlencoded;charset=utf-8",
            async: true,
            beforeSend: function(xhr) {
                comm.showLoading();
            },
            success: function(data) {
                if (data.result === 'Y') {
                    certificationSignature.fn_registerContractIndustrialTSA(result, returnData);
                } else {
                    CommMsg.alert(data.resultMSG);
                }
            },
            complete: function() {
                comm.hideLoading();
            },
            error: function(data, status, error) {
                CommMsg.alert("일시적오류 입니다. 다시 시도해주시기 바랍니다.");
            }
        });
    },
    
    /**
     * 산업재금융 약정서 등록(TSA)
     */
    fn_registerContractIndustrialTSA: (result, returnData) => {

        const productCode = returnData.product_code;
        const bizCode = productCode === '09' ? 'IM002' : 'IM001';
        const customerNumber = returnData.customer_number;
        const contractNumber = returnData.contract_number;
        const imagePath = result.resultTSA;

        const parameter = {
            IMG_PATH: imagePath,
            BIZ_CD: bizCode,		// IM001 : 신산업재 / IM002 : 중고산업재
            DOC_CD: 'D0024',			// D0023 : PDF / D0024 : TSA
            DOC_CNT: '1',
            REG_DATE: certificationSignature.getCurrentTime(),
            INSERT_ID: 'System',
            CUSTMRCDE: customerNumber,
            CONFLDNBR: contractNumber,
            DOC_DATE: '',
            ESMFLDNBR: '',
            EXCFLDNBR: '',
            ETCFLDTXT: '',
            IMGRSTCDE: '',
            MEMO: ''
        }
      
        let urlPath = document.location.protocol + "//" + document.location.host;
        if (document.location.host != "m.nhcapital.co.kr"){
            urlPath = "https://tm.nhcapital.co.kr";
        }
        const ociUrl = urlPath + "/3rd/clipsoft/ClipReport4/ClipToGetKey.jsp?jspName=ociBypass.jsp";

        $.ajax({
            type: "post",
            url: ociUrl,
            data: parameter,
            dataType: "json",
            contentType: "application/x-www-form-urlencoded;charset=utf-8",
            async: true,
            beforeSend: function(xhr) {
                comm.showLoading();
            },
            success: function(data) {
                if (data.result === 'Y') {
                    certificationSignature.fn_applyContract(result);
                } else {
                    CommMsg.alert(data.resultMSG);
                }
            },
            complete: function() {
                comm.hideLoading();
            },
            error: function(data, status, error) {
                CommMsg.alert("일시적오류 입니다. 다시 시도해주시기 바랍니다.");
            }
        });
    },
    /**
     * 온라인약정 처리
     */
    fn_applyContract: (result) => {
        const parameter = {
            decnFilnmS200: result.resultPDF.split('/')[2]
        }
        const URL = '/eloan/carfinance/construct/industrycontractsuccess.nh';
        comm.callAjaxJson(URL, parameter, function (response) {
            const header = response.result.header;
            const message = response.result.message;
            if (header.PRCS_RSLT_DVCD === 'S') {
                certificationSignature.fn_goToComplete();
            } else {
                CommMsg.alert(`${message.MSG_GROUP[0].RSP_MSG_CN}<br>${message.MSG_GROUP[0].RSP_MSG_AD}`);
            }
        });
    },
    /**
     * 대출약정완료 페이지로 이동
     */
    fn_goToComplete: () => {
        const URL = '/eloan/carfinance/construct/constructOnlineAgreeFinish.nh';
        location.href = URL;
    }, 
    
    /**
     * 자동차금융(장기렌터카) 약정서 등록(TSA)
     * added by 이정운 2022-05-25
     */
    fn_registerContractRentcarTSA: (result) => {
    	let sessionInfo = JSON.parse(sessionStorage.getItem("applyInfo"));
        const custNo = sessionInfo.payInfo.custNo;
        const contNo = sessionInfo.payInfo.contNo;
        const hmpgOnlnAgreGdsDvcd = sessionInfo.payInfo.hmpgOnlnAgreGdsDvcd;

        const imagePath = result.resultTSA;

        const parameter = {
            IMG_PATH: imagePath,
            BIZ_CD: "IM007",		// IM001 : 신산업재 / IM002 : 중고산업재 / IM007: 장기렌트카
            DOC_CD: 'D0024',			// D0023 : PDF / D0024 : TSA
            DOC_CNT: '1',
            REG_DATE: certificationSignature.getCurrentTime(),
            INSERT_ID: 'System',
            CUSTMRCDE: custNo,
            CONFLDNBR: contNo,
            DOC_DATE: '',
            ESMFLDNBR: '',
            EXCFLDNBR: '',
            ETCFLDTXT: '',
            IMGRSTCDE: '',
            MEMO: ''
        }
        
        let urlPath = document.location.protocol + "//" + document.location.host;
        if (document.location.host != "m.nhcapital.co.kr"){
            urlPath = "https://tm.nhcapital.co.kr";
        }
        const ociUrl = urlPath + "/3rd/clipsoft/ClipReport4/ClipToGetKey.jsp?jspName=ociBypass.jsp";

        $.ajax({
            type: "post",
            url: ociUrl,
            data: parameter,
            dataType: "json",
            contentType: "application/x-www-form-urlencoded;charset=utf-8",
            async: true,
            beforeSend: function(xhr) {
                comm.showLoading();
            },
            success: function(data) {
                
                if (data.result === 'Y') {
                	const sessionInfo = JSON.parse(sessionStorage.getItem("applyInfo"));
                    // sessionInfo.certInfo = data;
                    // sessionStorage.setItem("applyInfo",sessionInfo);


                    const mid = sessionInfo.mid;
                    const listName = mid+"ApplyList";
                    const sendData = {mid:mid};

                    const refData = {}
                    for (const [key, value] of Object.entries({...sessionInfo.addressInfo,...sessionInfo.applyInfoDetail,...sessionInfo.payInfo,...sessionInfo.taxInfo})) {
                        refData[key.replace(/-([a-z])/g, function (g) { return g[1].toUpperCase(); })] = value
                    }
                    //refData.decnFilnmS200 = result.resultPDF;
                    //20221005 렌터카 약정 파일명 수정
                    refData.decnFilnmS200 = result.resultPDF.split('/')[2];

                    sendData[listName] = JSON.stringify([refData])
                    const url = "/eloan/carfinance/car/ajaxMergeApplyInfo.nh";


                    comm.callAjaxJson(url,sendData,(res)=>{
                    	if(res.PRCS_RSLT_DVCD=="S"){
                            if(mid=="ncar" || mid=="ucar"){				// 일반 신차, 중고차 약정
                            	// 디파이너리(애드브릭스) 이벤트 호출 : 신차_대출완료 시점
                			    fn_call_dfinery_car_event(mid, "complete_loan");
                			    
                                comm.goPage("/eloan/carfinance/car/selectCarComplete.nh?complete=loanExctn");
                            }else{
                            	// 디파이너리(애드브릭스) 이벤트 호출 : 약정완료 시점 (리스,렌탈)
                			    fn_call_dfinery_car_event(mid, "complete_agreement");
                			    
                            	if(hmpgOnlnAgreGdsDvcd == "03"){		// 재리스 약정
                            		comm.goPage("/eloan/carfinance/car/selectCarComplete.nh?complete=recals");
                            	}else if(hmpgOnlnAgreGdsDvcd == "11"){	// 재렌탈 약정
                            		comm.goPage("/eloan/carfinance/car/selectCarComplete.nh?complete=reltrc");
                            	}else{									// 일반 리스, 렌탈 약정
                            		comm.goPage("/eloan/carfinance/car/selectCarComplete.nh?complete=loanAgree");
                            	}
                            }
                        }else{
                            CommMsg.alert("일시적오류 입니다. 다시 시도해주시기 바랍니다.");
                        }
                    	
                    })
                } else {
                    CommMsg.alert(data.resultMSG);
                }
                
            },
            complete: function() {
                comm.hideLoading();
            },
            error: function(data, status, error) {
                CommMsg.alert("일시적오류 입니다. 다시 시도해주시기 바랍니다.");
            }
        });
    },

    fn_registerContractReRentcarTSA: (result) => {
    	let sessionInfo = JSON.parse(sessionStorage.getItem("successionAgrInfo"));
        const mid = sessionInfo.sucsListData.mid;
        const custNo = sessionInfo.payInfo.custNo;
        const contNo = sessionInfo.payInfo.contNo;
        const hmpgOnlnAgreGdsDvcd = sessionInfo.payInfo.hmpgOnlnAgreGdsDvcd;

        const imagePath = result.resultTSA;

        const parameter = {
            IMG_PATH: imagePath,
            BIZ_CD: "IM007",		// IM001 : 신산업재 / IM002 : 중고산업재 / IM007: 장기렌트카
            DOC_CD: 'D0024',			// D0023 : PDF / D0024 : TSA
            DOC_CNT: '1',
            REG_DATE: certificationSignature.getCurrentTime(),
            INSERT_ID: 'System',
            CUSTMRCDE: custNo,
            CONFLDNBR: contNo,
            DOC_DATE: '',
            ESMFLDNBR: '',
            EXCFLDNBR: '',
            ETCFLDTXT: '',
            IMGRSTCDE: '',
            MEMO: ''
        }
        
        let urlPath = document.location.protocol + "//" + document.location.host;
        if (document.location.host != "m.nhcapital.co.kr"){
            urlPath = "https://tm.nhcapital.co.kr";
        }
        const ociUrl = urlPath + "/3rd/clipsoft/ClipReport4/ClipToGetKey.jsp?jspName=ociBypass.jsp";

        $.ajax({
            type: "post",
            url: ociUrl,
            data: parameter,
            dataType: "json",
            contentType: "application/x-www-form-urlencoded;charset=utf-8",
            async: true,
            beforeSend: function(xhr) {
                comm.showLoading();
            },
            success: function(data) {
                
                if (data.result === 'Y') {
                    const listName = mid+"ApplyList";
                    const sendData = {mid:mid};

                    const refData = {}
                    for (const [key, value] of Object.entries({...sessionInfo.addressInfo,...sessionInfo.applyInfoDetail,...sessionInfo.payInfo,...sessionInfo.taxInfo})) {
                        refData[key.replace(/-([a-z])/g, function (g) { return g[1].toUpperCase(); })] = value
                    }
                    //refData.decnFilnmS200 = result.resultPDF;
                    //20221005 렌터카 약정 파일명 수정
                    refData.decnFilnmS200 = result.resultPDF.split('/')[2];

                    sendData[listName] = JSON.stringify([refData])
                    sendData['hmpgOnlnAgreGdsDvcd'] = hmpgOnlnAgreGdsDvcd;
                    const url = "/eloan/carfinance/car/ajaxMergeApplyInfo.nh";
                    


                    comm.callAjaxJson(url,sendData,(res)=>{
                    	if(res.PRCS_RSLT_DVCD=="S"){
                            sessionStorage.removeItem("successionAgrInfo");
                            comm.goPage("/eloan/carfinance/car/selectCarComplete.nh?complete=sucsApply");
                        }else{
                            CommMsg.alert("일시적오류 입니다. 다시 시도해주시기 바랍니다.");
                        }
                    	
                    })
                } else {
                    CommMsg.alert(data.resultMSG);
                }
                
            },
            complete: function() {
                comm.hideLoading();
            },
            error: function(data, status, error) {
                CommMsg.alert("일시적오류 입니다. 다시 시도해주시기 바랍니다.");
            }
        });
    },
    
    /**
     * 자동차금융(장기렌터카) 자동이체 (직접)서명 및 자동이체 약정서 PDF 등록
     * 자동이체 (직접)서명 콜백 (Caller function is in MAATFN05030004.js)
     * added by 이정운 2022-05-28
     */
    fn_responseCertificationSignatureRent: (result) => {
        const returnData = JSON.parse(result.returnData);
        const imagePath = result.resultPDF;
        const customerNumber = returnData.custNo;
        const contractNumber = returnData.contNo;

        const parameter = {
            IMG_PATH: imagePath,
            BIZ_CD: 'IM007',		
            DOC_CD: 'D0001',			// D0023 : PDF / D0024 : TSA
            DOC_CNT: '1',
            REG_DATE: certificationSignature.getCurrentTime(),
            INSERT_ID: 'System',
            CUSTMRCDE: customerNumber,
            CONFLDNBR: contractNumber,
            DOC_DATE: '',
            ESMFLDNBR: '',
            EXCFLDNBR: '',
            ETCFLDTXT: '',
            IMGRSTCDE: '',
            MEMO: ''
        }
       
        let urlPath = document.location.protocol + "//" + document.location.host;
        if (document.location.host != "m.nhcapital.co.kr"){
            urlPath = "https://tm.nhcapital.co.kr";
        }
        const ociUrl = urlPath + "/3rd/clipsoft/ClipReport4/ClipToGetKey.jsp?jspName=ociBypass.jsp";

        $.ajax({
            type: "post",
            url: ociUrl,
            data: parameter,
            dataType: "json",
            contentType: "application/x-www-form-urlencoded;charset=utf-8",
            async: true,
            beforeSend: function(xhr) {
                comm.showLoading();
            },
            success: function(data) {
                if (data.result === 'Y') {
                    // PDF 저장까지 성공하면, 다음 화면 주소 입력으로 이동
                	const sendData = {
                		"desn" : returnData.desn,
        				"hmpgOnlnAgreGdsDvcd" : returnData.hmpgOnlnAgreGdsDvcd,
        				"mid" : returnData.mid
        			}
                	comm.goPage(returnData.nextUrl, sendData);
                } else {
                    CommMsg.alert(data.resultMSG);
                }
            },
            complete: function() {
                comm.hideLoading();
            },
            error: function(data, status, error) {
                CommMsg.alert("일시적오류 입니다. 다시 시도해주시기 바랍니다.");
            }
        });
    },

    /**
     * 리스, 승용 자동이체 신청서 PDF 등록
     */
    fn_responseCertificationSignatureAuto: (result) => {

		var urlPath = document.location.protocol + "//" + document.location.host;
		if (document.location.host != "m.nhcapital.co.kr"){
			urlPath = "https://tm.nhcapital.co.kr";
		}
		var param = {};
		
		var reportKeyUrl = urlPath + "/3rd/clipsoft/ClipReport4/ClipToGetKey.jsp?jspName=getReportKey.jsp";
		
	    const sessionInfo = JSON.parse(sessionStorage.getItem("applyInfo"));
	    const mid = sessionInfo.mid;
	    var bizCd = "";
	    
		param.crfName = "nh_05";
		param.nameImg = "";
		param.signImg  = "";
		param.jsonData = JSON.stringify(result);
		console.log(JSON.stringify(result));
		
		sendPdfAjax(reportKeyUrl, param, "text", function(){

			param.fileName = sessionInfo.payInfo.contNo + "_" + getTimeStamp();
			param.nhID = sessionInfo.payInfo.contNo;
			
			var exportUrl = urlPath + "/3rd/clipsoft/ClipReport4/ClipToGetKey.jsp?jspName=pdf_export_nh.jsp";

			sendPdfAjax(exportUrl, param, "json", function(data){

				if (data.resultCD == 'S'){

				    switch(mid){
				    	case "ncar" : bizCd = "IM004"; break;
				    	case "cals" : bizCd = "IM005"; break;
				    }
				    
			        const parameter = {
			            IMG_PATH: data.resultPDF,
			            BIZ_CD: bizCd,				// IM0004 : 신차승용, IM0005 : 오토리스		
			            DOC_CD: 'D0001',			// D0023 : PDF / D0024 : TSA
			            DOC_CNT: '1',
			            REG_DATE: certificationSignature.getCurrentTime(),
			            INSERT_ID: 'System',
			            CUSTMRCDE: sessionInfo.payInfo.custNo,
			            CONFLDNBR: sessionInfo.payInfo.contNo,
			            DOC_DATE: '',
			            ESMFLDNBR: '',
			            EXCFLDNBR: '',
			            ETCFLDTXT: '',
			            IMGRSTCDE: '',
			            MEMO: ''
			        }
			       
			        let urlPath = document.location.protocol + "//" + document.location.host;
			        if (document.location.host != "m.nhcapital.co.kr"){
			            urlPath = "https://tm.nhcapital.co.kr";
			        }
			        const ociUrl = urlPath + "/3rd/clipsoft/ClipReport4/ClipToGetKey.jsp?jspName=ociBypass.jsp";

			        $.ajax({
			            type: "post",
			            url: ociUrl,
			            data: parameter,
			            dataType: "json",
			            contentType: "application/x-www-form-urlencoded;charset=utf-8",
			            async: true,
			            beforeSend: function(xhr) {
			                comm.showLoading();
			            },
			            success: function(data) {
			                if (data.result === 'Y') {
			                    // PDF 저장까지 성공하면, 다음 화면 주소 입력으로 이동
			                    comm.goPage("/eloan/carfinance/car/selectCarComplete.nh?complete=loanAgree");
			                } else {
			                    CommMsg.alert(data.resultMSG);
			                }
			            },
			            complete: function() {
			                comm.hideLoading();
			            },
			            error: function(data, status, error) {
			                CommMsg.alert("일시적오류 입니다. 다시 시도해주시기 바랍니다.");
			            }
			        });
				} else {
					CommMsg.alert("전자약정서 생성에 실패하였습니다.");
				}
			});
		});
    }
    
}
// 직접서명 콜백 끝

let fn_callback_do_cert_sign = ()=>{

    const sessionInfo = JSON.parse(sessionStorage.getItem("applyInfo"));
    
    // sessionInfo.certInfo = data;
    // sessionStorage.setItem("applyInfo",sessionInfo);

	// 디파이너리(애드브릭스) 이벤트 호출 : 자동차금융_공통_전자서명 완료 시점
    fn_call_dfinery_event({ eventName: "car_signature" });

    const mid = sessionInfo.mid;
	const listName = mid+"ApplyList";
    const sendData = {mid:mid};
    const hmpgOnlnAgreGdsDvcd = sessionInfo.payInfo.hmpgOnlnAgreGdsDvcd;
    
	const refData = {}
	for (const [key, value] of Object.entries({...sessionInfo.addressInfo,...sessionInfo.applyInfoDetail,...sessionInfo.payInfo})) {
		refData[key.replace(/-([a-z])/g, function (g) { return g[1].toUpperCase(); })] = value
	}

    refData["rownrDvcd"] = "1" ;//실소유자구분코드 [1 : 본인, 2 : 타인]
    refData["rownrNmS50"] = sessionInfo.payInfo.username;
    refData["rownrBrdyS8"] = sessionInfo.payInfo.userbirth;

	sendData[listName] = JSON.stringify([refData]);
	
	const midmenu = sessionStorage.getItem("midmenu");
	
	if(midmenu == "mypg"){
		const sltifInfo = JSON.parse(sessionStorage.getItem("sltifInfo"));
		sendData['idifgtUnqIdntSltifYn'] = sltifInfo.idifgtUnqIdntSltifYn;	//수집·이용에 관한 사항
	    sendData['telMktAgrYn'] = sltifInfo.telMktAgrYn; 					//전화동의여부
	    sendData['txtMktAgrYn'] = sltifInfo.txtMktAgrYn;					//문자메세지동의여부
	    sendData['dcmtMktAgrYn'] = sltifInfo.dcmtMktAgrYn;					//서면동의여부
	    sendData['emailMktAgrYn'] = sltifInfo.emailMktAgrYn; 				//이메일동의여부
		sendData['idifofUnqIdntSltifYn'] = sltifInfo.idifofUnqIdntSltifYn;	//제공에 관한 사항
	} else {
		sendData['idifgtUnqIdntSltifYn'] = document.querySelector("#chk18_1").checked?"Y":"N";			//수집·이용에 관한 사항
	    //sendData['prpthMktAgrYn'] = document.querySelector("#chk18_2")."Y","N";				//전체
	    if(mid=="ncar" || mid=="ucar"){	
		    sendData['telMktAgrYn'] = document.querySelector("#agrPathTmkYn").checked?"Y":"N"; 				//전화동의여부
		    sendData['txtMktAgrYn'] = document.querySelector("#agrPathSmsYn").checked?"Y":"N";				//문자메세지동의여부
		    sendData['dcmtMktAgrYn'] = document.querySelector("#agrPathDmYn").checked?"Y":"N";				//서면동의여부
		    sendData['emailMktAgrYn'] = document.querySelector("#agrPathEmailYn").checked?"Y":"N"; 			//이메일동의여부
	    } else {
		    sendData['telMktAgrYn'] = document.querySelector("#telMktAgrYnS1").checked?"Y":"N"; 				//전화동의여부
		    sendData['txtMktAgrYn'] = document.querySelector("#txtMktAgrYnS1").checked?"Y":"N";				//문자메세지동의여부
		    sendData['dcmtMktAgrYn'] = document.querySelector("#dcmtMktAgrYnS1").checked?"Y":"N";				//서면동의여부
		    sendData['emailMktAgrYn'] = document.querySelector("#emailMktAgrYnS1").checked?"Y":"N"; 			//이메일동의여부
	    }
		sendData['idifofUnqIdntSltifYn'] = document.querySelector("#chk19_1").checked?"Y":"N";	//제공에 관한 사항
	}
	
	
    const url = "/eloan/carfinance/car/ajaxMergeApplyInfo.nh";


    comm.callAjaxJson(url,sendData,(res)=>{
        if(res.PRCS_RSLT_DVCD=="S"){
            if(mid=="ncar" || mid=="ucar"){				// 일반 신차, 중고차 약정
            	
            	if(mid == "ncar"){
            		const url = "/eloan/carfinance/car/ajaxAutoTransferPrintInfo.nh";
            		const sendData = {
            			contNo : sessionInfo.payInfo.contNo,
            			type : mid
            		}
            		
            		comm.callAjaxJson(url, sendData, function(response){
            			const header = response.result.header;
            			const message = response.result.message;
            			if (header.PRCS_RSLT_DVCD === 'S') {
            				certificationSignature.fn_responseCertificationSignatureAuto(response.result.data);
            			} else {
            				CommMsg.alert(message.MSG_GROUP[0].RSP_MSG_CN + "<br>" +message.MSG_GROUP[0].RSP_MSG_AD);
            			}
            		});
            	} else {
            		comm.goPage("/eloan/carfinance/car/selectCarComplete.nh?complete=loanAgree");
            	}
            }else{
            	// 디파이너리(애드브릭스) 이벤트 호출 : 약정완료 시점 (리스,렌탈)
			    fn_call_dfinery_car_event(mid, "complete_agreement");
			    
            	if(hmpgOnlnAgreGdsDvcd == "03"){		// 재리스 약정
            		comm.goPage("/eloan/carfinance/car/selectCarComplete.nh?complete=recals");
            	}else if(hmpgOnlnAgreGdsDvcd == "11"){	// 재렌탈 약정
            		comm.goPage("/eloan/carfinance/car/selectCarComplete.nh?complete=reltrc");
            	}else{									// 일반 리스, 렌탈 약정
            		if(mid == "cals"){
                		const url = "/eloan/carfinance/car/ajaxAutoTransferPrintInfo.nh";
                		const sendData = {
                			contNo : sessionInfo.payInfo.contNo,
                			type : mid
                		}
                		
                		comm.callAjaxJson(url, sendData, function(response){
                			const header = response.result.header;
                			const message = response.result.message;
                			if (header.PRCS_RSLT_DVCD === 'S') {
                				certificationSignature.fn_responseCertificationSignatureAuto(response.result.data);
                			} else {
                				CommMsg.alert(message.MSG_GROUP[0].RSP_MSG_CN + "<br>" +message.MSG_GROUP[0].RSP_MSG_AD);
                			}
                		});
            		} else {
            			comm.goPage("/eloan/carfinance/car/selectCarComplete.nh?complete=loanAgree");
            		}
            	}
            }
        }else{
            CommMsg.alert("일시적오류 입니다. 다시 시도해주시기 바랍니다.");
        }
    })
    
    
}

function sendPdfAjax(url, sendData, datatype, callbackFunc){
	
	$.ajax({
		url : url,
		data : sendData,
		contentType : "application/x-www-form-urlencoded;charset=utf-8",
		type : "post",
		dataType : datatype,    //"json",
		beforeSend:function(xhr){
			comm.showLoading();
		},
		success:function(data){			
			callbackFunc(data);
		},
		complete:function(){
			comm.hideLoading();
		},
		error:function(data, status, error){
			CommMsg.alert("일시적오류 입니다. 다시 시도해주시기 바랍니다.");
		}
	});  
}

function getTimeStamp() {
	var d = new Date();
	var s = 
		leadingZeros(d.getFullYear(), 4)
		+ leadingZeros(d.getMonth() + 1, 2)
		+ leadingZeros(d.getDate(), 2)
		+ leadingZeros(d.getHours(), 2)
		+ leadingZeros(d.getMinutes(), 2)
		+ leadingZeros(d.getSeconds(), 2)
		;
	return s;
}

function leadingZeros(n, digits) {
	var zero = '';
	n = n.toString();

	if (n.length < digits) {
		for (i = 0; i < digits - n.length; i++)
			zero += '0';
	}
	return zero + n;
}