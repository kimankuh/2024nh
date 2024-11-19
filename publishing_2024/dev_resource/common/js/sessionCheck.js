//Timer 설정 시작
var sessTid;	// 세션 타임 setInterval() 

var infoFlag = false;

var initSessCnt
var initInfoCnt

var sessCnt	// 세션시간 설정(단위:초)
var infoCnt	// 알림시간 설정(단위:초)
var timeTxt	// 알림 시작 시간

var endDate;
var currDate;

// 세션 카운트 실행
function counter_init(sessCnt, infoCnt) {
	this.sessCnt = parseInt(sessCnt);	// 세션시간 설정(단위:초)
	this.infoCnt = parseInt(infoCnt);	// 알림시간 설정(단위:초)

	this.initSessCnt = sessCnt;
	this.initInfoCnt = infoCnt;

	this.currDate = new Date();
	this.endDate = new Date();
	endDate.setSeconds(this.endDate.getSeconds() + parseInt(sessCnt) + 2);

	// 로그인 카운트 시작
	sessTid = setInterval(function() {
		this.nCounter_run();
	}, 1000);
}

// 팝업화면 추가 세션 카운트 함수
function nCounter_run() {
	this.currDate = new Date();

	var sec = (this.endDate - this.currDate) / 1000;

	this.currSec = parseInt(sec, 10);

	if(infoFlag == false) {
		if(currSec > 0) {
			if(currSec < infoCnt + 1) {
				infoFlag = true;
				// 세션연장 여부를 질의하는 팝업 호출
				open_window();
			}
		} else {
			// 추가 세션 카운트가 0이면 로그아웃 후 자동로그아웃 안내화면으로 이동
			logoutInfo();
		}
	} else {
		if(currSec > 0) {
			document.all.leftTimeView.innerText = time_format(this.currSec);
		} else {
			// 추가 세션 카운트가 0이면 로그아웃 후 자동로그아웃 안내화면으로 이동
			logoutInfo();
		}
	}
}

// 자동 로그아웃 알림 Layer Popup 오픈
function open_window() {
	if(comm.channel == "PW") {
		CommMsg.pAutoLogoutInfo();
	} else {
		CommMsg.mAutoLogoutInfo();
	}
	document.all.leftTimeView.innerText = time_format(this.currSec);
}

//메인화면 카운트 재시작 및 서버 세션 연장
function counter_reset() {
	// WAS session 연장
	loadSessResetAjax();

	clearInterval(sessTid);

	infoFlag = false;

	counter_init(this.initSessCnt, this.initInfoCnt);

	this.endDate = new Date();
	endDate.setSeconds(this.endDate.getSeconds() + parseInt(sessCnt) + 2);
}

// 로그아웃 후 자동로그아웃 안내화면으로 이동
function logoutInfo() {
	// 로그아웃 처리
	comm.autoLogout();
	clearInterval(sessTid);

	infoFlag = false;

	if(comm.channel == "PW") {
		popupFunc("#layoutPopContent #modalLogoutInfoPop").remove();
		CommMsg.pAutoLogout();
	} else {
		popupFunc("#layoutPopContent #modalLogoutInfoPop").remove();
		CommMsg.mAutoLogout();
	}
}

// 시간 포멧 설정 함수
function time_format(s) {
	var nMin = 0;
	var nSec = 0;
	if(s > 0) {
		nMin = parseInt(s/60);
		nSec = s%60;

		if(nMin > 60) {
			nMin = nMin%60;
		}
	} 

	if(nSec < 10) nSec = "0" + nSec;
	if(nMin < 10) nMin = "0" + nMin;
		return "" + nMin + ":" + nSec;
	}

// WAS session 연장
function loadSessResetAjax() {
	var xhttp = new XMLHttpRequest();
	xhttp.open("POST", "/login/sessReset.nh", true);
	xhttp.send();
}