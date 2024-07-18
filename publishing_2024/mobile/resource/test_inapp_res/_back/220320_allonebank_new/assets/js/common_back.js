/* 2020-09-08:17:00 */
function inputDelCtr(){
	var textField1 = $('.form-input');
	var deleteText1 = textField1.siblings('.delete-btn');
	textField1.on('click',function(){
		var inputPosition = $(this).position().top;
		if($(this).val().length >= 1){
			$(this).siblings('.delete-btn').show().css('top',(inputPosition - 4) + "px");
		}
		$(this).on('blur',function(){
			var me = $(this);
			$('.form-group').find('.balance').css('z-index',300);
			setTimeout(function(){
				me.siblings('.delete-btn').hide();
			},100);
			setTimeout(function(){
				$('.form-group').find('.balance').css('z-index',1);
			},300)
		});
		$(this).on('keyup',function(){
			$(this).siblings('.delete-btn').show().css('top',(inputPosition - 4) + "px");
			if($(this).val().length == 0){
				$(this).siblings('.delete-btn').hide();
			}
		});
		// 공통 입력내용 지우기 버튼 시작
		deleteText1.off('click').on('click',function(){
			$(this).siblings(textField1).val("");
			$(this).hide();
		});
		textField1.each(function() {	
			var prependDiv = $(this).parents('.form-group-prepend');
			if(prependDiv.length) {
				$(this).on('focus', function(){
					prependDiv.addClass('on')
				})
				$(this).on('blur', function(){ 
					prependDiv.removeClass('on')
				});
			}
		});
	});
	
	textField1.on('paste',function(){
		var inputPosition1 = $(this).position().top;
		$(this).siblings('.delete-btn').show().css('top',(inputPosition1 - 4) + "px");
		$(this).parents('.pop-content').siblings('.pop-footer').css('pointer-events','static');
	});

	// 공통 검색바 입력내용 지우기 버튼 시작
	var textField = $('.search-input');
	var deleteText = $('.delete-btn');

	textField.click(function(){
		deleteText.hide();
		if($(textField).is(':focus')){
			$(this).siblings(deleteText).show();
		}
		return false;
	});

	// 공통 검색바 입력내용 지우기 버튼 끝

	// 일반 인풋 박스 입력내용 지우기 버튼 시작
	var commonField = $('.textInput');

	commonField.click(function(){
		var commonDel = $(this).find('button');
		if(commonDel.hasClass('delete-btn')) {
			deleteText.hide();
			if($(commonField).find('input').is(':focus')){
				commonDel.show();
			}
			return false;
		};
	});
	// 일반 인풋 박스 입력내용 지우기 버튼 끝

	// 공통 입력내용 지우기 버튼 시작
	deleteText.click(function(){
		$(this).siblings(textField).val("");
		$(this).hide();
		return false;
		});
	// 공통 입력내용 지우기 버튼 끝
}
$(document).ready(function(){
	inputDelCtr();
	$('.allMenuOne .oneDep > a').each(function(){
		var cusTxt = $(this).text()
		$(this).attr('aria-label','머릿말 ' + cusTxt)
	});
	$('.allMenuTop ul li a').attr('role','button')
	$('.headerNav.navBtn').on('click',function(){
		setTimeout(function(){
			$('.searchBtn').get(0).focus();
		},1000)
	})
	$('.header.menu-container nav a, .headerNav.navBtn').attr('role','button');
		
	/* 2020-11-30 구형 안드로이드 대응 수정
	if($('.i-plus').length){
		$('.i-plus').parent('button').addClass('flex-row');
	}
	if($('.order-button-group').length){
		$('.order-button-group .btn-icon').addClass('flex-row');
	}
	*/

	//2020-12-03 접근성 관련
	$('[class^="prd-motion-"]').attr('aria-hidden','true');
	$('.need_focusing').attr('aria-hidden','false');
	$('.btnProdShare').attr('aria-label','SNS 공유하기');
	
});
/**
* Pub 공통 함수
* -----------------------------------------
*/
(function(context) {
	"use strict";
	var Pub = Pub || {}
	Pub.pageLoadCnt = 0; //초기 Loaded 아닌  ajax Loaded 카운트 체크
	Pub.util = {
		isValid : function(variables) {
			if (variables == null || variables == undefined || variables === '' || variables == 'undefine') return false;
			else return true;
		}
		, browserCheck : function(){

		}
	};
	context.Pub = Pub;
})(window);


/**
* Layout Setup
* -----------------------------------------
* @param loginFlag : true (로그인후), false(로그인전)
*/
var Layout = (function(){
	var jMap = {}
	, vMap = {}
	, setMap = function(){
		jMap = {
			html : $('html')
			, body : $('body')
			, wrap : $('#wrap')
			, header : $('#header')
			, gnb : $('#gnb')
			, conainer : $('#container')
			, content : $('.content')
			, tabMenu : $('.tabMenu')
			, footer : $('#footer')
		}
		, vMap = {
			is_firstLoad : true
			, loginFlag : false
			, is_main : false
			, is_pop : false
			, is_gnb : true
		};
	}
	, page= {
		init : function(){
			//onLoad(초기 로드), cpLoad(contentPage 로드)
			if(jMap.html.hasClass('onLoad')) {
				vMap.is_firstLoad = false;
				jMap.html.removeClass('cpLoad'+Pub.pageLoadCnt);
				Pub.pageLoadCnt ++;
				jMap.html.addClass('cpLoad'+Pub.pageLoadCnt);
			} else {
				jMap.html.addClass('onLoad');
				Pub.util.browserCheck();
			}
			//Page TYPE
			if(jMap.wrap.hasClass('main')) vMap.is_main = true;
		}
	}
	, table = {
		addCaption : function(){
			$("table").each(function() {
				//제외 테이블
				// if($(this).hasClass('xxx_table')) return false;

				var ARth = []
					, $summary = $(this).attr('summary')
					, $caption = $(this).find('caption')
					, captionStr = $caption.text()
					, $th = $(this).find('th')
					, joinStr = ''
					, arCnt = 0
				;
				$th.each(function(i) {
					var thTxt = $(this).text()
						.replace(/\s/g, "")
						.replace('필수항목', '')
						.replace($(this).find('a').text(), '') //버튼 텍스트 삭제
						.replace(/^\s/g, "")//첫 공백 삭제, &nbsp;
						.replace(/\s$/g, "")//마지막 공백 삭제, &nbsp;
					;
					if($(this).find('input').length){
						var title = $(this).find('input').attr('title');
						ARth[arCnt] = title;
					}
					else if(Number(thTxt.length) <=0) return true; //공백문자 제거
					else ARth[arCnt] = thTxt;
					arCnt++;
				});

				joinStr = ARth.join(', ');

				$(this).removeAttr('summary');
				if($caption.length > 0) {
					$caption.text('').text(joinStr + ' 항목으로 이루어진 정보테이블입니다.');
				} else{
					$(this).prepend('<caption>'+joinStr+ ' 항목으로 이루어진 정보테이블입니다.</caption>');
				}
			});
		}
	}
	, accessbility = {
		require : function(){
			$('label .required').each(function(){
				$(this).append('<span class="visualHide">필수입력항목</span>')
					.closest('label').attr('aria-required', true)
				;
			});
		}
	}
	, header = {
		init : function(){
			// if(jMap.gnb.length > 0){
			// 	gnbHandler();// header.js 에서 호출(퍼블 확인용 -개발에서 따로 가져감 : 0806)
			// }
		}
	}
	, footer = {
		handler : function(){

		}
	}

	//====================================================
	, init = function(_param){
		setMap();
		if(_param) vMap.loginFlag  = _param.loginFlag;
		page.init();

		//메인
		if(vMap.is_main){
			//
		}
		//서브 & 팝업
		else{
			table.addCaption(); //테이블 Caption
			accessbility.require();//필수 입력항목 대체 텍스트
			// accordionHandler();
		}

		//공통 & 최초 로드시
		//if(vMap.is_firstLoad){}
	};

	return {
		init : init
	}
})();

/**
* Layer Modal Popup
* -----------------------------------------
*/

var popup = function(btnId) {
	var popId = '#' + btnId + '-layer',
		popWrap = $(popId),
		popDim = $(popId + ' .dimmed'),
		popContent = $(popId + ' .pop');
	      		
	$(document).off('click').on('click', '[aria-haspopup="dialog"]', function(e){
		$('body').addClass('modalOn');
		popWrap.addClass('opened'); 
	if(popContent.hasClass('toast-msg')){
		var toastOn = setTimeout(function() {
			popWrap.removeClass('opened');
			$('body').removeClass('modalOn');
		}, 4000);
		$('body.modalOn').on('touchmove',function(){
			popWrap.removeClass('opened');
			$('body').removeClass('modalOn');
			clearTimeout(toastOn);
		});
	} else if(popContent.hasClass('alert')){
		popDim.show();
		popContent.show();
	} else if(popContent.hasClass('full')){
		popContent.show();
	} else {
		popDim.fadeIn();
		popContent.animate({
			bottom:0,
		},550);
	}
		
	/* 연월선택팝업 */
	if(popWrap.hasClass('yearMonthPop')){
		var selld11 = $('.datepicker-widget').find('.year').find('.on').index();
		var selld21 = $('.datepicker-widget').find('.month').find('.on').index();
		setTimeout(function(){
			//2020-08-24
			$('.datepicker-widget').find('.year').animate({scrollTop:(selld11-1)*40},'500');
			$('.datepicker-widget').find('.month').animate({scrollTop:(selld21-1)*40},'500');
		},500);
	}
	
	e.preventDefault();
});
	
	
$(document).on('click', '.opened .dimmed, [role="dialog"] .close', function(e){
		$('body').removeClass('modalOn');
		popDim.fadeOut(100);
		setTimeout(function(){
			popWrap.removeClass('opened');
		},550)
		
		if(popContent.hasClass('alert')){
			popContent.hide();
		} else if(popContent.hasClass('full')){
			popContent.hide();
		} else {
			popContent.animate({
				bottom:'-100vh',
			},550);
		}	
		e.preventDefault();
	});
}

var popclose = function(popId){
	var popWrap = '#' + popId + '-layer',
		popDim = $(popWrap + ' .dimmed'),
		popContent = $(popWrap + ' .pop');
	
$(document).on('click', '[role="dialog"] .pop-footer button, [role="dialog"] .pop-footer a, [role="alertdialog"] .pop-footer button, [role="alertdialog"] .pop-footer a, [role="dialog"] .pop-content a', function(e){
	$('body').removeClass('modalOn');
	popDim.fadeOut(100);
		setTimeout(function(){
			$(popWrap).removeClass('opened');
		},550)
		
		if(popContent.hasClass('alert')){
			popContent.hide();
			setTimeout(function(){
				$(popWrap).removeClass('opened');
			},100)
		} else if(popContent.hasClass('full')){
			popContent.hide();
		} else {
			popContent.animate({
				bottom:'-100vh',
			},550);
		}	
		e.preventDefault();
	})
}

/* 팝업 동적 생성 */
function nodeInsertedEvent(e){
	var thisPop = $(this);
	//$(document).off('DOMNodeInserted','.modalWrap', nodeInsertedEvent);
	//setTimeout(function(){
		var modalHeight = thisPop.height();
		var popInitTimerId = setTimeout(function(){
			var popHeight = thisPop.find('.pop').height();
			thisPop.addClass('modalOn');
			thisPop.find('.popup-wrapper').addClass('modalFull');
			thisPop.find('.popup-wrapper').addClass('modalOn');
			if(thisPop.find('.pop').hasClass('full')){
				thisPop.find('.pop').show();
			}
			else{
				thisPop.find('.pop').slideDown(250);
				thisPop.find('.pop-footer').css('position','static');
				setTimeout(function(){
					if(!(thisPop.find('.pop-footer').hasClass('selfBottom2'))){
						if(thisPop.find('.credentialNumArea').length == 0){
							if(thisPop.find('.pop-footer').attr('style')){
								thisPop.find('.pop-footer').attr('style',thisPop.find('.pop-footer').attr('style') + ";"+'position:sticky !important');
							}else{
								thisPop.find('.pop-footer').attr('style','position:sticky !important');
							}
						}
					}
				},300); 
			}
			thisPop.find('.full').find('.pop-footer').delay(50).slideDown(250)
			if(thisPop.find('.selfBottom, .selfBottom01').find('li').length == 2){
				thisPop.addClass('btnCtaWrap');
			}
			inputDelCtr();
			tooltipCtr();
			function modalFocus(){
				thisPop.find('.pop').attr('aria-modal',true)
				thisPop.find('.pop').attr('tabindex',1)
				thisPop.find('.pop').attr('aria-label','레이어팝업')
				thisPop.find('.pop').attr('role','dialog')
				setTimeout(function(){
					thisPop.find('.pop').focus();
				},500)
				return false;
			}
			if(thisPop.find('.credentialNumArea').length == 0 && thisPop.find("[class^='form-group'] input").length == 0){
				modalFocus()
			}
			if(thisPop.find('.full').find('.pop-footer').length >= 1 || thisPop.find('.full').find('.button-group-reset').length >= 1){
				setTimeout(function(){
					thisPop.find('.full').find('.pop-content').css('padding-bottom','7.1875rem');
				},100)
			}
			setTimeout(function(){
				if(thisPop.find('#bankSelectPop').find('.bank-list, .bank-list-column').length){
					thisPop.find('.pop h3').attr('tabindex',0).focus();
				}
			},1000)
			
			if(thisPop.find('.tutorialPop').length == 1){
				thisPop.find('.tutorialPop').attr('aria-modal',true)
				thisPop.find('.tutoAlly').attr('tabindex',0)
				thisPop.find('.tutoAlly').attr('aria-label','레이어팝업')
				thisPop.find('.tutoAlly').attr('role','dialog')
				setTimeout(function(){
					$(".tutorial-Slider .swiper-slide").removeAttr('aria-hidden');
					$(".tutorial-Slider .swiper-slide").attr('aria-hidden',true);
					$(".tutorial-Slider .swiper-slide.swiper-slide-active").attr('aria-hidden',false);
				},1000)
			}
		},250);
		$(document).on('DOMNodeInserted','.modalFull',function(){
			var thisFull = $(this);
			setTimeout(function(){
				thisFull.addClass('modalOn');
				if(thisFull.find('div').hasClass('checkMsg')){
					thisFull.addClass('modalActive');
					setTimeout(function(){
						thisFull.addClass('authActive');
					},100)
					thisFull.find('.selfBottom button, .selfBottom01 button').delay(150).slideDown(250);
				}
			},250);
		});
		//$(document).on('DOMNodeInserted','.modalWrap', nodeInsertedEvent);
	//},1);
}
$(document).on('DOMNodeInserted','.modalWrap', nodeInsertedEvent);

var selectBtn = $('button.btn-select');
selectBtn.each(function(){
	if($(this).attr('disabled')) {
		
		$(this).closest('.form-group-select').addClass('disabled');
	} else if($(this).attr('readonly'))  {
		$(this).closest('.form-group-select').addClass('disabled');
	}
})

/**
* Tooltip
* -----------------------------------------
*/

function tooltipCtr(){
	 $('[data-rel="tooltip"]').each(function(){
        var tooltip = $(this).next('[data-role="tooltip"]');
        var close = tooltip.children('.close');
        $(this).off().on('click', function(){
            //tooltip.fadeIn();
			$(this).toggleClass('on');
			var curPosition = $(this).offset().top - $(window).scrollTop();
			var winHeight = $(window).height();
			var toolHeight = tooltip.outerHeight();
			if(curPosition + toolHeight >= winHeight - 100){
				tooltip.addClass('layer-up');
			}
			else if(tooltip.parents('.pop').find('div').hasClass('pop-footer') && curPosition + toolHeight >= winHeight - 85){
				tooltip.addClass('layer-up');
			}
			
			else if(tooltip.parents('.form-check').nextAll('.form-check').find('.tooltip-item').length >=1){
				tooltip.addClass('layer-up');
			} 
			
			else {
				tooltip.removeClass('layer-up');
			}

			if($(this).hasClass('on')){
				tooltip.fadeIn();
			}
			else {
				tooltip.fadeOut();
				$(this).removeClass('on')
			}
        });
        close.on('click', function(){
            tooltip.fadeOut();
            $(this).parents().prev().removeClass('on');
        });
    });
}

/**
* Tab
* -----------------------------------------
* @param tabNavs : Object
* - 공통 탭 네비게이션 : tabHandler('.tabs')
* - 컨텐츠 안 탭 네비게이션 : tabHandler('.tabNavSub')
*/
var tabHandler = function(tabNavs){
	// 스크롤 탭 포지셔닝
	if(($(tabNavs)).hasClass('tabOverflow')) scrollTabPosition();

	var tabList = $(tabNavs).find('li');

	//init
	tabList.each(function(){
		var $li =$(this)
			$a = $li.find(' > a')
			activeTabClass = 'on'
			activeConClass = 'dp-block'
		;

		$a.attr('role', 'tab').attr('aria-selected', 'false');
		if($li.hasClass(activeTabClass)) $a.attr('title', '현재 탭').attr('aria-selected', true);

		//event
		$a.click(function(){
			if(!tabList.parents(tabNavs).hasClass('pageTab')){
				var tabId = $(this).parent().attr('data-tab');
				var tabConts = $(this).closest(tabNavs).siblings('.tab-content');

				tabList.removeClass(activeTabClass).find('>a').removeAttr('title').attr('aria-selected', false);
				$(this).parent().addClass(activeTabClass).find('>a').attr('title', '현재 탭').attr('aria-selected', true);

				tabConts.removeClass(activeConClass);
				$("#"+tabId).addClass(activeConClass);
				
				// return false; //2018.0810: 개발 요구로 삭제 
			}
		});
	});
};

// 스크롤 탭 포지셔닝
function scrollTabPosition(){
	var $scrollTab = $('.tabOverflow')
		, $target =$scrollTab.find('ul > li.on') 
		, goLeft = 0
		, intervalID
		, isAnimate = true
		, ifmoveOption = true // true : target이 화면 넘어 갈때만 이동, false : 항상 왼쪽 정렬
	;

	if( $target.index() == 0) return false;

	//로드 시점 차이로 인터벌 사용(팝업 및 컨텐트 로드 페이지 확인 필요)
	intervalID = setInterval(function(){
		goLeft = $target.offset().left;
		if(goLeft >= 0){
			clearInterval(intervalID);
			if(ifmoveOption){
				var docW = $(document).outerWidth();
				var targetW = $target.outerWidth();
				if(docW > (goLeft + targetW)) return false;
			}

			if(isAnimate) $scrollTab.stop().animate({'scrollLeft' : goLeft}, 'easeInOutExp');
			else $scrollTab.scrollLeft(goLeft);

			return false;
		}
	}, 360);

	return false;
}
$(document).ready(function(){
	tabHandler('.tabs');//공통 탭
	tabHandler('.tabNavSub');//컨텐츠 안 탭
	// 토글 툴팁 버튼 시작
	var toolBtn = $('.helpTooltip');
	var bubbleClose = $('.helpBubble > .closeBtn');

	toolBtn.each(function(){
		if($(this).siblings().hasClass('helpBubble')) $(this).attr('title','도움말 보기');
		else $(this).removeAttr('title'); //예외 : 도움말 없이 링크일 경우
	});

	toolBtn.click(function(){
		if(!$(this).siblings().hasClass('helpBubble')) return false;
		$(this).toggleClass('on');
		var tipBoxClass = '.' + $(this).attr('name');
		if($(tipBoxClass).hasClass('dp-block')){
			toolBtn.attr('title','닫혀짐');
		}else{
			toolBtn.attr('title','펼쳐짐');
		}
		$(tipBoxClass).toggleClass('dp-block');
	});

	$('label').each(function(){
		if($(this).find('button.helpTooltip').length > 0) {
			$(this).addClass('tooltipLabel');
		};
	});

	bubbleClose.click(function(){
		$(this).parent().siblings('button.helpTooltip').trigger("click").focus();
	});

	
	//임시 2020-08-25 위치이동
	if($('[data-role="content"]').find('section.fullWidth').length){
		$('[data-role="content"]').addClass('flex-left');
	}

	// 토글 툴팁 버튼 끝
	
	// asis fixed button margin
	var bodyCheck = $('#container > div[data-role="content"].flex-left > section:last');
	var bodyStatus = bodyCheck.css('display');
	if(!bodyCheck.hasClass('no-fixed') && !bodyCheck.hasClass('with-fixedBtn') && $('section ~ ul').hasClass('selfBottom')) {
		bodyCheck.siblings('section').removeClass('with-fixedBtn');
		bodyCheck.addClass('with-fixedBtn');
		// 마지막 section display:none 일 경우 //
		setTimeout(function(){
			if(bodyStatus == 'none'){
				bodyCheck.prev('section').css('margin-bottom','65px');
			}
		},1000)
	}

	// 기간조회 토글 조건박스시작
	var detailSearch = $('.detailSearch input');
	$('.periodBox').prepend('<h3 class="visualHide">상세검색</h3>');//접근성 마크업 삽입
	detailSearch.change(function(){
		$(this).parents('.periodSearch').next().toggleClass('expand');
	});
	// 기간조회 토글 조건박스끝
	
	// 주소록 중복 checked background color 시작
	if($('div').hasClass('addrBook')){
		var adrItem = $('.addrBook .list-item input');
		adrItem.change(function(event) {
			$(this).parents('li').toggleClass('checked');
		});
	}
	// 주소록 중복 checked background color 끝

	//상단스텝 고정
	$('.breadcrumb').css('position','fixed').css('z-index',299);
	var procHeight = $('.breadcrumb').outerHeight();
	
	if($('.breadcrumb').next('section').hasClass('fullWidth')){
		$('.breadcrumb').next('section').css('padding-top',procHeight);
	}
	else if ($('.breadcrumb').next('h3').hasClass('serviceTitle')){
		$('.breadcrumb').next('h3').css('padding-top',procHeight + 20);
	}
	else if ($('.breadcrumb').next('div').hasClass('titleArea')){
		$('.breadcrumb').next('div').css('padding-top',procHeight + 10);
	}
	else if ($('.breadcrumb').siblings('ul').hasClass('registerBox')){
		$('.breadcrumb').next('ul').css('padding-top',procHeight + 70);
	}
	else if ($('.breadcrumb').next('div').hasClass('completeMsg')){
		$('.breadcrumb').next('div').css('padding-top', 84);
	}
	else if ($('.breadcrumb').next('div').hasClass('serviceNote')){
		$('.breadcrumb').next('div').css('padding-top',procHeight + 15);
	}
	else if ($('.breadcrumb').next('dl').hasClass('dataList')){
		$('.breadcrumb').next('dl').css('padding-top',procHeight + 10);
	}
	else if ($('.breadcrumb').next('section').hasClass('breadcrumb')){
		$('.breadcrumb').next('section').css('padding-top',15);
	}
	else if ($('.breadcrumb').next('section').hasClass('visualArea')){
		$('.breadcrumb').next('section').css('padding-top',procHeight + 30);
	}
	else {
		$('.breadcrumb').next('section').css('padding-top',procHeight + 15);
	}
	if ($('.breadcrumb').next('section').hasClass('bottomFixBanner')){
		$('.breadcrumb').next('section').css('height','calc(100% - 66px)');
	}

	$('label > .btn').each(function(){
		if($(this).hasClass('subSmallType')) {
			$(this).parents('label').addClass('btnLabel');
		};
	});
	
	$('label').each(function(){
		if($(this).find('button.helpTooltip').length > 0) {
			$(this).addClass('tooltipLabel');
		};
	});
	
	$('.hashtag-btn').click(function(){
		$(this).toggleClass('on');
	});
})


/**
* Accordion
* -----------------------------------------
*/
var accordionHandler = function(){
	// 공통 아코디언 시작
	// 꼭 알아두세요! 등의 페이지 아래에 붙는 정보성 아코디언 코딩시, dt에 js-active 클래스 추가할 것.
	$('.accordion > .list-item, .accordion-account > .list-item, .accordion > li').each(function(){
		var $accordionTitle = $(this).find('> dl > dt');
		var $aLink = $accordionTitle.find('> a');

		//init
		//$aLink.parent('dt').attr('role', 'button');//2020-12-04 접근성
		$aLink.attr('role', 'button'); 
		if($accordionTitle.hasClass('js-active') ){
			$aLink.attr('title', '접기');
			$('.js-active').siblings('dd').attr('style', 'display:block').removeClass('dp-block');
			$('.js-active').parent().parent().addClass('on');
		}else{
			$aLink.attr('title', '펼치기');
		}
		
		//event
		$aLink.on('click', function(){
			var $dt = $(this).parent();
			var $li = $dt.parent().parent();

			if( $dt.hasClass('js-active') ){
				$(this).attr('title', '펼치기');
				$dt.removeClass("js-active").siblings('dd').slideUp(200, function(){
					$(window).trigger("scroll");
				});
				$li.removeClass('on');
			}else{
				$(this).attr('title', '접기');
				$dt.addClass("js-active").siblings('dd').slideDown(200);
				$li.addClass('on');
				var $accorScrollSet = $aLink.closest('.accorScrollSet');

				if ($accorScrollSet.length > 0) {
					// console.log($accorScrollSet + ' : yes 클래스 있음');
					// 개별 페이지에서 scrollTop 설정

				} 
				else if($("[class^='account']").length >= 2 && $('.big-fontService').length == 1) {
					// console.log($accorScrollSet + ' : no 클래스 없음');
					// 기존 프로세스 유지

					setTimeout(function(){
						var curScr = $(window).scrollTop();
						var popScr = $aLink.parents('.pop').scrollTop();
						var conHeight = $aLink.parents('dt').siblings('dd').outerHeight();
						$('html, body').animate({scrollTop:curScr + conHeight},100);
						$aLink.parents('.pop').animate({scrollTop:popScr + 1},100);
					},300)
				}
				if($dt.addClass("js-active").siblings('dd').find(".iframeSwiper").length > 0){
					var src = $dt.addClass("js-active").siblings('dd').find(".iframeSwiper").attr("src");
					$dt.addClass("js-active").siblings('dd').find(".iframeSwiper").attr("src", src);
				}
			}
			return false;
		});
	});
};
$(document).ready(function() {
	// 확장형 리스트 토글 더보기 버튼 시작
    var expandBtn = $('.btn-expand');
	expandBtn.change(function(){
		$(this).parent().siblings('.fold').toggleClass('expand');
	});
	// 확장형 리스트 토글 더보기 버튼 끝
	if($('.list-agreement .list-item > .form-check + a').length){
		$('.list-agreement .list-item > .form-check > label').attr('role','button');
		$('.list-agreement .list-item > .form-check + a').attr('role','button');
	}
	accordionHandler();
	rangeSlider();
	inputDelCtr();
	tooltipCtr();
	rangeSlide();
});

// 토글스위치 토글 (UI-PD-B13053)
function toggleSwitch() {
	var checkedSet = $('div[class*="form-switch"] input');
	checkedSet.each(function(){
		var toggle = $(this).parents().siblings('.toggle-group');
		if(toggle.length){
			if($(this).is(':checked')){
				toggle.toggleClass('on');
				$(this).on('click', function(){
					$(this).parents().siblings('.toggle-group').toggleClass('on');
				});
			} else {
				$(this).on('click', function(){
					$(this).parents().siblings('.toggle-group').toggleClass('on');
				});
			}
			
		}
	});
}
toggleSwitch();


 /**
 * RangeSlider
 * -----------------------------------------
 * 한도조정 및 금액설정 슬라이더
 */

function rangeSlider() {
 	$('.slider-range').each(function(){
 		var sliderWidget = $(this);
 		var sliderRange = $(this).siblings().children('.form-input');
 		var sliderBalance = $(this).siblings().children('.balance-display');
 		var minVal = $(this).data('min');
 		var stepVal = $(this).data('step');
 		var sliderPin = $(this).hasClass('pinned');
 		var pinData = $(this).data('pin');
 		
 		
 		sliderWidget.slider({
 			range: "min",
 			create: function(event,ui) {
 				$(this).slider('option', 'value', $(this).data('value'));
 				$(this).slider('option', 'step', $(this).data('step'));
 				$(this).slider('option', 'min', $(this).data('min'));
 				$(this).slider('option', 'max', $(this).data('max'));
 			},
 			slide: function(event, ui) { 
 				var balance = ui.value
 				if(minVal == '0' && stepVal == '10000') {
 					if (balance < 10000) {
						var balance = 1000;
					}
 					
	 				if (sliderRange.length) {				
	 					sliderRange.val(balance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
	 				} else if(sliderBalance.length) {
	 					sliderBalance.html(balance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
	 				}
	 			} else {
	 				if (sliderRange.length) {				
	 					sliderRange.val(balance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
	 				} else if(sliderBalance.length) {
	 					sliderBalance.html(balance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
	 				}
	 			}
			},
			start: function(event, ui){
				$(this).on('slidestart', function(){
					$(this).children('.ui-slider-handle').find('.pin-data').fadeOut(300);
				});
			}
 			
 		});
 		
 		if (sliderPin) {
 			$(this).children('.ui-slider-handle').append('<span class="pin-data">'+ pinData + '</span>');
 		}
 		
 		var slideVal = sliderWidget.slider('value');
 		if(minVal == '0' && stepVal == '10000') {
 			if (slideVal < 10000) {
				var slideVal = 1000;
			}
 			
 			if (sliderRange.length) {				
 	 			sliderRange.val(slideVal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
 	 		} else if(sliderBalance.length) {
 	 			sliderBalance.html(slideVal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
 	 		}	
 		} else {
 			if (sliderRange.length) {				
 	 			sliderRange.val(slideVal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
 	 		} else if(sliderBalance.length) {
 	 			sliderBalance.html(slideVal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
 	 		}	
 		}
		$('body').addClass('rangeActive');
		setTimeout(function(){
			$('body').removeClass('rangeActive');
		},1000);
 	});
}

/* 상품 예적금 공통 Range slider */ 
function rangeSlide () {
	$('.balance-range').each(function(){
		var sliderWidget = $(this);
 		var sliderRange = $(this).siblings('.slider-balance').find('.form-input');
		var sliderBalance = $(this).siblings('.slider-balance').find('.balance-display');
 		var minVal = $(this).data('min');
 		var stepVal = $(this).data('step');
 		var sliderPin = $(this).hasClass('pinned');
 		var pinData = $(this).data('pin');

		sliderWidget.slider({
			range: "min",
			create: function(event,ui) {
				$(this).slider('option', 'value', $(this).data('value'));
				$(this).slider('option', 'step', $(this).data('step'));
				$(this).slider('option', 'min', $(this).data('min'));
				$(this).slider('option', 'max', $(this).data('max'));
			},
			slide: function(event, ui) { 
				var balance = ui.value
				if(minVal == '0' && stepVal == '10000') {
					if (balance < 10000) {
					   var balance = 1000;
				   }
					
					if (sliderRange.length) {				
						sliderRange.val(balance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
					} else if(sliderBalance.length) {
						sliderBalance.html(balance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
					}
				} else {
					if (sliderRange.length) {				
						sliderRange.val(balance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
					} else if(sliderBalance.length) {
						sliderBalance.html(balance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
					}
				}
		   },
		   start: function(event, ui){
			   $(this).on('slidestart', function(){
				   $(this).children('.ui-slider-handle').find('.pin-data').fadeOut(300);
			   });
		   }
			
		});
		
		if (sliderPin) {
			$(this).children('.ui-slider-handle').append('<span class="pin-data">'+ pinData + '</span>');
		}
		
		var slideVal = sliderWidget.slider('value');
		if(minVal == '0' && stepVal == '10000') {
			if (slideVal < 10000) {
			   var slideVal = 1000;
		   }
			
			if (sliderRange.length) {				
				 sliderRange.val(slideVal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
			 } else if(sliderBalance.length) {
				 sliderBalance.html(slideVal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
			 }	
		} else {
			if (sliderRange.length) {				
				 sliderRange.val(slideVal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
			 } else if(sliderBalance.length) {
				 sliderBalance.html(slideVal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
			 }	
		}
	   $('body').addClass('rangeActive');
	   setTimeout(function(){
		   $('body').removeClass('rangeActive');
	   },1000);
	});
}

//한도조정 및 금액설정 슬라이더 축소버전
$(window).on('scroll',function(){
	var thisScr = $(this).scrollTop();
	if(thisScr > 160){
		$('.prodDetail').addClass('mini');
		$('.topProdMini').slideDown(300);
	}
	else if(thisScr < 160) {
		$('.prodDetail').removeClass('mini');
		$('.topProdMini').slideUp(300);
	}
});
 
//달력 2020-10-20 수정
function datepickerScroll(){
	$('.datepicker-widget').find('ul').find('li').not(':first-child, :last-child').click(function(){
		$(this).addClass('on');
		$(this).siblings().removeClass('on');
		var selldIdx = $(this).index();
		$(this).parents('.year, .month, .day').animate({scrollTop:(selldIdx-1)*40},'500');
	});
	var selld1 = $('.datepicker-widget').find('.year').find('.on').index();
	var selld2 = $('.datepicker-widget').find('.month').find('.on').index();
	/* 달력 날자 day 추가 2020-10-20 임재흥 */
	var selld3 = $('.datepicker-widget').find('.day').find('.on').index();
	$('.datepicker-widget').find('.year').animate({scrollTop:(selld1-1)*40},'500');
	$('.datepicker-widget').find('.month').animate({scrollTop:(selld2-1)*40},'500');
	$('.datepicker-widget').find('.day').animate({scrollTop:(selld3-1)*40},'500');
	/* //달력 날자 day 추가 2020-10-20 임재흥 */
	var scrollEndEvntTimerId;
	function visibleEvnt(){
		var el = this;
		var items = $(el).find('li').not(':first-child, :last-child');
		var idx = Math.round($(el).scrollTop() / 40);
		items.eq(idx).addClass('on').siblings().removeClass('on');

		//scroll end event capture
		clearTimeout(scrollEndEvntTimerId);
		scrollEndEvntTimerId = setTimeout(function(){
			$('.datepicker-widget > ul').off('scroll',visibleEvnt);
			$(el).stop().animate({scrollTop:idx *40},{
				duration:40,
				step:function(now, fx){
					if(fx.pos == 1){
						$(this).scrollTop((idx *40) - 3);
						setTimeout(function(){
							$('.datepicker-widget > ul').on('scroll',visibleEvnt);
						},100)
					}
				}
			});
		},100);
		
	};

	setTimeout(function(){
		$('.datepicker-widget > ul').on('scroll',visibleEvnt)
	},500);
}


$(document).ready(function () {
	//우대금리조회 progress
	var $barStyle = $('.progressbox').find('.progressBar em');
	var barWidth = $barStyle.attr('data-progtess-value');
	var $bounceStyle = $('.bounceArea').find('div');
	var calcWidth = barWidth * /*0.02222223*/0.2 + '%'
	var calcWidth2 = 20 + ((barWidth - 50) * /*0.06666667*/0.2) + '%'
	var calcWidth3 = 40 + ((barWidth - 150) * /*0.01111111*/0.2) + '%'
	var calcWidth4 = 60 + ((barWidth - 250) * /*0.006666667*/0.2) + '%'
	var calcWidth5 = 80 + ((barWidth - 350) * /*0.002222223*/0.2) + '%'
	var $scoreWidth = $('.bounceArea').find('p');
	var calcScore = ($scoreWidth.width() - 42) / 2 
	// 점수 이동 위치 //
	$scoreWidth.css('margin-left')

	// 등급에 따른 Progress Bar Add Class 위치 //
	// sec1 //
	if (barWidth < 101)
	{
		$('.progressArea').find('li:first-child').addClass('active');
		// ProgressBar 이동 애니메이션 //
		$barStyle.animate({
			width: calcWidth
		}, 1500);

		// Marker 이동 애니메이션 //
		$bounceStyle.animate({
			left: calcWidth
		}, 1500);
	}
	// sec2 //
	else if (100 <= barWidth && barWidth < 200)
	{
		$('.progressbox').addClass('sec2');
		$('.progressArea').find('li:nth-child(2)').addClass('active');
		// ProgressBar 이동 애니메이션 //
		$barStyle.animate({
			width: calcWidth2
		}, 1500);

		// Marker 이동 애니메이션 //
		$bounceStyle.animate({
			left: calcWidth2
		}, 1500);
	}

	// sec3 //
	else if (200 <= barWidth && barWidth < 300)
	{
		$('.progressbox').addClass('sec3');
		$('.progressArea').find('li:nth-child(3)').addClass('active');
		// ProgressBar 이동 애니메이션 //
		$barStyle.animate({
			width: calcWidth3
		}, 1500);

		// Marker 이동 애니메이션 //
		$bounceStyle.animate({
			left: calcWidth3
		}, 1500);
	}

	// sec4 //
	else if (300 <= barWidth && barWidth < 400)
	{
		$('.progressbox').addClass('sec4');
		$('.progressArea').find('li:nth-child(4)').addClass('active');
		// ProgressBar 이동 애니메이션 //
		$barStyle.animate({
			width: calcWidth4
		}, 1500);

		// Marker 이동 애니메이션 //
		$bounceStyle.animate({
			left: calcWidth4
		}, 1500);
	}

	// sec5 //
	else if (400 <= barWidth && barWidth < 500)
	{
		$('.progressbox').addClass('sec5');
		$('.progressArea').find('li:nth-child(5)').addClass('active');
		// ProgressBar 이동 애니메이션 //
		$barStyle.animate({
			width: calcWidth5
		}, 1500);

		// Marker 이동 애니메이션 //
		$bounceStyle.animate({
			left: calcWidth5
		}, 1500);
	}

	// sec6 //
	else if (500 <= barWidth)
	{
		$('.progressbox').addClass('sec6');
		$('.progressArea').find('li:last-child').addClass('active');
		// ProgressBar 이동 애니메이션 //
		$barStyle.animate({
			width: '100%'
		}, 1500);

		// Marker 이동 애니메이션 //
		$bounceStyle.animate({
			left: '100%'
		}, 1500);
	}
});

function scrDetail(){
	$(window).on('scroll',function(){
		var btnProdTop = $('section .button-group').find('.btn-fill').offset().top
		if($(this).scrollTop() >= btnProdTop + 24){
			 $('.productBottom').height(45).addClass('buttonOn');
		}
		else if($(this).scrollTop() < btnProdTop){
			 $('.productBottom').height(0).removeClass('buttonOn');
		}
	});
}
$(document).ready(function () {
	if($('div').hasClass('prodDetailTop') && $('.prodDetailBtn').find('button').hasClass('btn-fill')){
		setTimeout(function(){
			scrDetail();
		},100);
	}
	else if($('div').hasClass('product-mainbox') && $('.button-group').find('button').hasClass('btn-fill')){
		setTimeout(function(){
			scrDetail();
		},100);
	}
	//만기예상액 계산 버튼
	$('.btn-border-fill').click(function(){
		$(this).parent().siblings().addClass('on');
	});

	//체크박스 토글
	var checkedSet2 = $('div[class*="check-toggleBox"]').find('input');
	checkedSet2.change(function() {
		$(this).parents('.check-wrap').find('.checked-view').addClass('dp-none').removeClass('dp-block');
		if($(this).prop('checked')){
			$(this).parents('.check-wrap').find('.checked-view').addClass('dp-block').removeClass('dp-none');
		}
	});

	//체크박스 토글 reverse
	var checkedSet2 = $('div[class*="check-toggleBox-reverse"]').find('input');
	checkedSet2.change(function() {
		$(this).parents('.check-wrap').find('.checked-view').addClass('dp-block').removeClass('dp-none');
		if($(this).prop('checked')){
			$(this).parents('.check-wrap').find('.checked-view').addClass('dp-none').removeClass('dp-block');
		}
	});

	// 자동이체신청/미신청
	var radioSet = $('.toggleRadio input[type="radio"]');
	radioSet.change(function() {
		$('.toggleLayerOff').removeClass('dp-block');
		if($(this).hasClass('toggleLayer') && $(this).prop('checked')){
			$(this).parents('.toggleRadio').next().addClass('dp-none').removeClass('dp-block');
		}else{
			$(this).parents('.toggleRadio').next().addClass('dp-block').removeClass('dp-none');
		}
	});

	//전체메뉴 위치이동
	$('.allMenuOne').find('.oneDep > a').on('click',function(){
		var allScr = $('.allMenuOne').scrollTop();
		var allLocate = $(this).parents('.oneDep').position().top;
		if($('.btnUtilWrap').is(':visible')){
			if($(this).parents('.oneDep').index() == 0){
				$('.allMenuOne').animate({
					scrollTop: allScr + allLocate - 172
				});
			}
			else {
				$('.allMenuOne').animate({
					scrollTop: allScr + allLocate - 157
				});
			}
		}
		else {
			if($(this).parents('.oneDep').index() == 0){
				$('.allMenuOne').animate({
					scrollTop: allScr + allLocate - 80
				});
			}
			else {
				$('.allMenuOne').animate({
					scrollTop: allScr + allLocate - 65
				});
			}
		}
	});
	/* 상품몰 메인 */

	
	if($('.tabContSwiper ').length >= 1 && $('.tabNavSwiper ').length >= 1){
		var prodSwiper01 = new Swiper ('.prodSwiper01', {
			autoplay: {
				delay: 3000,
				disableOnInteraction: false,
			},
			loop: true,
			pagination: {
				el: '.swiper-pagination',
				type: 'bullets',
			}
		});
		$('.content ~ [class^="slideShowArea"], .commonWrap ~ [class^="slideShowArea"]').siblings('.dimmed').on('click',function(){
			$('[class^="slideShowArea"]').find('div').find('a').removeClass('active');
			$('[class^="slideShowArea"]').find('div').find('div').slideUp(300)
			$(this).fadeOut(300);
			$('#wrap').off('scroll touchmove');
			$('body').css('overflow-y','auto');
			$('.slideShowArea1').prevAll().attr('aria-hidden',false);
			$('[class^="slideShowArea"]').attr('aria-hidden',true);
			$('#wrap').attr('aria-hidden',false);
		});
	} 
	else if($('.myassets-account-list').length >= 1){
		$('.content ~ [class^="slideShowArea"]').siblings('.dimmed').on('click',function(){
			$('[class^="slideShowArea"]').find('div').find('a').removeClass('active');
			$('[class^="slideShowArea"]').find('div').find('div').slideUp(300)
			$(this).fadeOut(300);
			$('#wrap').off('scroll touchmove');
			$('body').css('overflow-y','auto');
			$('[class^="slideShowArea"]').attr('aria-hidden',true);
			$('#wrap').attr('aria-hidden',false);
		});
	}
	
	//메인 서브 하단 팝업 ON/OFF
	$('.content ~ [class^="slideShowArea"], .commonWrap ~ [class^="slideShowArea"]').find('a').off('click').on('click',function(){
		$(this).toggleClass('active');
		if($(this).hasClass('active')){
			$(this).siblings('div').slideDown();
			$('.dimmed').fadeIn(300);
			$('.btnFloating').fadeOut();
			$('body').css('overflow-y','hidden');
			$('.mainSwiper, .mainHeader, .header').attr('aria-hidden',true);
			$('#wrap').on('scroll touchmove', function(e){
				e.preventDefault();
				e.stopPropagation();
				return false;
			});
		}
		else{
			$(this).siblings('div').slideUp();
			$('.dimmed').fadeOut(300);
			$('.btnFloating').fadeIn();
			$('body').css('overflow-y','auto');
			$('.mainSwiper, .mainHeader, .header').attr('aria-hidden',false);
			$('#wrap').off('scroll touchmove');
		}
	});
});

function mallmainSwiper(n) {
	var tabNavSwiper = new Swiper ('.tabNavSwiper', {
		watchSlidesVisibility: true,
		watchSlidesProgress: true,
		slidesPerView: 5,
		allowTouchMove: false,
	});
	var tabContSwiper = new Swiper ('.tabContSwiper', {
		loop:true,
		loopedSlides: 5,
		thumbs: {
			swiper: tabNavSwiper,
		},
		on: {
			init :function(){
				this.slideTo(n)
				$('.tabNavSwiper').find('.swiper-slide a').attr('role','button')
				
				$('.tabContSwiper').find('.swiper-slide').attr('aria-hidden',true)
				$('.tabContSwiper').find('.swiper-slide.swiper-slide-active').attr('aria-hidden',false)
				if($('.swiper-container-ios').length){
					$('.tabContSwiper').find('.swiper-slide.swiper-slide-active').find('.iframe-banner iframe').attr('role','link')
					$('.prodSlide1 .iframe-banner iframe').attr('aria-label','카드 신청하기: 올바른 혜택으로 똑똑한 카드생활')
					$('.prodSlide2 .iframe-banner iframe').attr('aria-label','NH투자증권 주식계좌 개설: 쉽고 편리한 주식 계좌 개설')
					$('.prodSlide3 .iframe-banner iframe').attr('aria-label','펀드 알아보기: 판매별 수익별 BEST 펀드 추천!')
				}
			}
		},
		speed: 1,
		autoHeight: true,
		threshold: 20,
	});
	
	tabNavSwiper.on('click, touchStart',function(){
		tabContSwiper.params.speed =1
		$('.tabNavSwiper').css('pointer-events','none');
		setTimeout(function(){
			$('.tabNavSwiper').css('pointer-events','auto');
		},50)
	})
	tabContSwiper.on('touchEnd',function(){
		tabContSwiper.params.speed =300
	})
	tabContSwiper.on('slideChangeTransitionStart',function(){
		$(window).scrollTop(0)
		$('[class^="swiper-slide prodSlide"]').scrollTop(0)
		if($('.swiper-container-ios').length){
			$('.tabContSwiper').find('.swiper-slide.swiper').find('.iframe-banner iframe').removeAttr('role')
		}
	})
	tabContSwiper.on('slideChangeTransitionEnd',function(){
		$('.tabContSwiper').find('.swiper-slide').attr('aria-hidden',true)
		$('.tabContSwiper').find('.swiper-slide.swiper-slide-active').attr('aria-hidden',false)
		if($('.swiper-container-ios').length){
			$('.tabContSwiper').find('.swiper-slide.swiper-slide-active').find('.iframe-banner iframe').attr('role','link')
		}
		var thumbActiveTxt = $('.tabNavSwiper').find('.swiper-slide-thumb-active a').text();
		setTimeout(function(){
			$('.tabNavSwiper').find('.swiper-slide a').removeAttr('aria-label')
			$('.tabNavSwiper').find('.swiper-slide-thumb-active a').attr('aria-label',thumbActiveTxt + '선택됨')
		},100)
	})
	$('.tabNavSwiper').find('.swiper-slide').find('a').on('click',function(){
		$(this).parents('.swiper-slide').addClass('swiper-slide-thumb-active');
		$(this).parents('.swiper-slide').siblings().removeClass('swiper-slide-thumb-active');
		var thumbsId = $(this).parents('.swiper-slide').index();
		var thumbActiveTxt = $('.tabNavSwiper').find('.swiper-slide-thumb-active a').text();
		setTimeout(function(){
			$(this).parents('.swiper-slide').siblings('.swiper-slide').find('a').removeAttr('aria-label')
			$('.tabNavSwiper').find('.swiper-slide-thumb-active a').attr('aria-label',thumbActiveTxt + '선택됨')
		},100)
	});
}

// scroll object event 
function objectScroll() {
	$('.scroll-object').each(function(){
		var $this = $(this);
		$(document).on('scroll', function(){
			var $winH = $(window).height();
			var scrollPos = $(document).scrollTop();
			if(scrollPos > $this.offset().top - ($winH / 2)) {
				$this.addClass('on')
			}
		})
		$(document).on('touchmove', function(){
			var $winH = $(window).height();
			var scrollPos = $(document).scrollTop();
			if(scrollPos > $this.offset().top - ($winH / 2)) {
				$this.addClass('on')
			}
		})
		$(document).on('touchend', function(){
			var $winH = $(window).height();
			var scrollPos = $(document).scrollTop();
			if(scrollPos > $this.offset().top - ($winH / 2)) {
				$this.addClass('on')
			}
		})
	});
}

//2020-10-20 상품상세 모션관련
function objectScroll2() {
	$('html').addClass('iosPrdDetailScroll');

	$.fn.visibleMotion = function(callbackFn){
		var el = $(this);
		el.each(function(){
			var element = $(this);
			if(element.get(0).getBoundingClientRect().top +  element.innerHeight() <= (window.innerHeight || document.documentElement.clientHeight) && !element.is('.on')){
				element.addClass('on');
			}
		})
	}
	if(!$('#footer').length){
		$('<div id="footer"></div>').appendTo('#wrap');
	}
	$('#footer').html($('.content-footer.productBottom').html()).addClass('productBottom');
	$('.content-footer.productBottom').remove();

	$('#container').on('scroll touchmove touchend', function(){
		var scrollPos = $('#container').scrollTop();
		var btnProdTop = $('.prodDetailBtn').position().top;

		$('.scroll-object').each(function(){
			var $this = $(this);
			$this.visibleMotion();
		})
		if(scrollPos >= btnProdTop + 36){
			 $('.productBottom').height(45).addClass('buttonOn');
		}
		else if(scrollPos < btnProdTop){
			 $('.productBottom').height(0).removeClass('buttonOn');
		}
	})
}

//이체주기선택
function datepickerScrollCycleType(){
	$('.datepicker-widget.cycle-type').find('ul').find('li').click(function(){
		$(this).addClass('on');
		$(this).siblings().removeClass('on');
		var selldIdx = $(this).index();
		if($(this).parent().hasClass('cycle')) {
			var onSelecter = $('.cycle-list').find('ul').eq(selldIdx).find('.on').index();
			$('.cycle-list').find('ul').eq(selldIdx).show().siblings().hide();
			$('.cycle-list').find('ul').eq(selldIdx).animate({scrollTop:(onSelecter)*68},'500');
		}
	});
}