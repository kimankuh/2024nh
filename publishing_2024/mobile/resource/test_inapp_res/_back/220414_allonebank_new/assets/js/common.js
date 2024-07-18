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
}
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
		e.preventDefault();
	});
	
	$(document).on('click', '.opened .dimmed, [role="dialog"] .close', function(e){
		popDim.fadeOut(100);
		setTimeout(function(){
			popWrap.removeClass('opened');
		},550);
		if(popContent.hasClass('alert')){
			popContent.hide();
		} else if(popContent.hasClass('full')){
			popContent.hide();
		} else {
			popContent.animate({
				bottom:'-100vh',
			},550);
		}
		if( $('.popup-wrapper.opened').length <= 2 ){
			$('body').addClass('modalOn');
		} else {
			$('body').removeClass('modalOn');
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
            $(this).parents().prev().removeClass('on').attr('title');
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
		$aLink.attr('role', 'button'); 
		if($accordionTitle.hasClass('js-active') ){
			$aLink.attr('title', '접기');
			$('.js-active').siblings('dd').attr('style', 'display:block').removeClass('dp-block');
			$('.js-active').closest('.list-item').addClass('on');
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
			}else if ($dt.hasClass('none-action')){
				return false;
			}else{
				$(this).attr('title', '접기');
				$dt.addClass("js-active").siblings('dd').slideDown(200);
				$li.addClass('on');
			}
			return false;
		});
	});
};

// 토글 리스트 토글
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

// scroll object event 
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

function swiperObjectPub(bannerName) {
	/* 베너 스와이프 */
	var eventListSwiper = new Swiper('.'+bannerName, {
		slidesPerView: 'auto',
		pagination: {
			el: '.swiper-pagination',
			type: 'bullets',
			clickable: true,
			bulletElement : 'a'
		},
		loop: false,
		spaceBetween: 25,
		observer:true,
		observeParents:true,
		autoplay:true,
		paginationClickable:true
	});
	/* 스와이프 접근성 옵션 */
	eventListSwiper.on("slideChangeTransitionEnd", function(){
		$('.'+bannerName+' .swiper-slide').attr('aria-hidden', true);
		$('.'+bannerName+' .swiper-slide.swiper-slide-active').attr('aria-hidden', false);
	});
	eventListSwiper.on('touchEnd', function (transitionEnd) {
		var autoPlay = eventListSwiper.autoplay.running
		if(autoPlay == false){
			$('.'+bannerName+' .btn-stop').addClass('active');
			$('.'+bannerName+' .btn-stop').attr('title','시작');
		}
		$('.'+bannerName+' .swiper-slide.swiper-slide-active').attr('aria-hidden', false).find('a').blur().focus();
	});

	//배너 시작/멈춤
	$('.'+bannerName+' .btn-stop').click(function(){
		$(this).toggleClass('active');
		if($(this).hasClass('active')){
			$(this).attr('title','시작').addClass('active');
			eventListSwiper.autoplay.stop();
		}
		else {
			$(this).attr('title','정지').removeClass('active');
			eventListSwiper.autoplay.start();
		}
	});
	if( $('.'+bannerName+' .swiper-slide').length <= 1 ){
		$('.'+bannerName+' .swiper-wrapper').addClass('disabled')
		$('.'+bannerName+' .pagination-wrap').addClass('disabled')
	}
}

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

	tabHandler('.tabs');//공통 탭
	tabHandler('.tabNavSub');//컨텐츠 안 탭
	// 토글 툴팁 버튼 시작
	var toolBtn = $('.helpTooltip');

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

	// 기간조회 토글 조건박스끝
	$('label').each(function(){
		if($(this).find('button.helpTooltip').length > 0) {
			$(this).addClass('tooltipLabel');
		};
	});
	
	$('.hashtag-btn').click(function(){
		$(this).toggleClass('on');
	});


	/* 종금 홈으로 이동하는 버튼 [수정] 0318 서브타이틀 관련 포지션 값 변경 */
	if( $('[class^="home-link-move"]').length ) {
		$(window).scroll(function(){
			if ( $(document).scrollTop() >= 50 ){
				$('[class^="home-link-move"]').css({'visibility':'hidden','opacity':'0'});
			} else {
				$('[class^="home-link-move"]').css({'visibility':'visible','opacity':'1'});
			}
		})
		if( $('.sub-title-box').length ) {
			$('[class^="home-link-move"]').css('top','10.5rem');
		}
		if( $('.tabs:not(.static-type)').length ) {
			$('[class^="home-link-move"]').css('top','12.1rem');
		}
		if( $('.sub-title-box').length && $('.tabs:not(.static-type)').length ) {
			$('[class^="home-link-move"]').css('top','16.3rem');
		}
	}
	/* 종금 서브타이틀 관련 컨텐츠 위치값 0318 */
	if( $('.sub-title-box').length ) {
		$('.content[data-role="content"]').css('padding-top','5rem')
	} 
	if( $('.sub-title-box').length && $('.tabs').length ){
		$('.content[data-role="content"]').css('padding-top','5rem')
		$('.tabs').css('top','9rem')
	}

	accordionHandler();
	inputDelCtr();
	tooltipCtr();
	toggleSwitch(); // 토글리스트
});