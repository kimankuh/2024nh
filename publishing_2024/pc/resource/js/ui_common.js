/* v1.0 | 2022-06-02 */


/*
	대분류
*/
/* 소분류 */

/*
	Constructor 생성
*/
function XscrStatus(x, beforex, dir) { // x축
	this.xScr = x;
	this.xPrev = beforex;
	this.direct = dir;
}

function yscrStatus(y, beforey, dir) { //y축
	this.yScr = y;
	this.yPrev = beforey;
	this.direct = dir;
}

var xSCR = new XscrStatus(0, 0, ''); // x 상태값 생성
var ySCR = new yscrStatus(0, 0, ''); // y 상태값 생성



/*
	ready, load
*/
$(document).ready(function(){
	//라디오 버튼 클릭시 하위 라디오버튼
	$("input:radio[name=radioLoanType]").click(function(){
		if($("#radioLoanMortgageLoan").prop("checked")){
			$(".radio_pack_two_depth_hidden").show()
		}else{
			$(".radio_pack_two_depth_hidden").hide()
		}
	})
});


$(window).on('load', function() {
	containerSetting();//컨테이너 초기세팅
	formSetting();//폼 초기세팅
	customSelectSetting();//커스텀 셀렉트 초기세팅
	accordionSetting('.accordion_pack');//아코디언 초기세팅
	if ( $('[data-datepicker="el"]').length > 0 ) $('[data-datepicker="el"]').fnDatePicker();//데이트피커
	headerH();//서브헤더 높이 구하기
	xScrollintroFixed();//상품소개 x축 스크롤
	xScrollFloatFixed();//스탭영역 X축 스크롤
	xScrollestimateFixed();//견적레이어 x축 스크롤
	xScrollbannerlayer()//메인배너 x축 스크롤
	scrollFloating()//견적레이어 노출
	accordion02Setting()////아코디언02 초기세팅
});


$(window).on('resize', function() {
	popupSize('.modal_popup');//팝업 사이즈 계산
})


$(window).on('scroll', function() {
	var xScroll = $(window).scrollLeft();
	var yScroll = $(window).scrollTop();
	var scrPoint = scrollPoint();//스탭영역 fix 시점

	xSCR.xPrev = xSCR.xScr;
	xSCR.xScr = xScroll;

	ySCR.yPrev = ySCR.yScr;
	ySCR.yScr = yScroll;

	// 스크롤 상태 값 조건(x축 움직일 때)
	if ( xSCR.xPrev > xSCR.xScr ) {
		xSCR.direct = 'left';

		xScrollHeader();//헤더 x축 스크롤
		xScrollFloatFixed();//스탭영역 X축 스크롤
		xScrollestimateFixed();//견적레이어 x축 스크롤
		xScrollintroFixed();//상품소개 x축 스크롤
		xScrollbannerlayer();//메인배너 x축 스크롤

	}else if ( xSCR.xPrev < xSCR.xScr ) {
		xSCR.direct = 'right';

		xScrollHeader();//헤더 x축 스크롤
		xScrollFloatFixed();//스탭영역 X축 스크롤
		xScrollestimateFixed();//견적레이어 x축 스크롤
		xScrollintroFixed();//상품소개 x축 스크롤
		xScrollbannerlayer();//메인배너 x축 스크롤
	}

	// 스크롤 상태 값 조건(y축 움직일 때)
	if ( ySCR.yPrev > ySCR.yScr ) {
		ySCR.direct = 'up';

		//스탭영역 스크롤
		if ( ySCR.yPrev < scrPoint ) {
			isFixOff();
		}

	}else if (  ySCR.yPrev < ySCR.yScr ) {
		ySCR.direct = 'down';

		//스탭영역 스크롤
		if( ySCR.yScr > scrPoint ) {
			isFixOn();
		}
	}
})



/*
	비동기실행함수(함수 내부에 length 조건절 달기)
*/
function pageloadFunc() {
	containerSetting();//컨테이너 초기세팅
	formSetting();//폼 초기세팅
	customSelectSetting();//커스텀 셀렉트 초기세팅
	accordionSetting('.accordion_pack');//아코디언 초기세팅
	if ( $('[data-datepicker="el"]').length > 0 ) $('[data-datepicker="el"]').fnDatePicker(); // 데이트피커
}



/*
	컨테이너 초기세팅
*/
function containerSetting(){
	if (!$('.footer').length > 0) return;

	var $footer = $('.footer'),
		$container = $('.container'),
		_footerH = $footer.outerHeight();

	$footer.css('margin-top',-_footerH)
	$container.css('padding-bottom',_footerH);
}



/*
	폼 초기세팅
*/
function formSetting() {
	var selectorObj = {
		target : $('.ebinput, .ebselect, .btn_select'),
		status: ['has_readonly', 'has_disabled'],
		targetParent : ['input_pack', 'select_pack']
	};

	for(var i = 0 ; i < selectorObj.target.length; i++) {

		var $el = $(selectorObj.target[i]);
		var $parentEl = $el.parent();

		if($el.attr('readonly')) {
			if ( $el.attr('type') != 'password' ){
				if($parentEl.hasClass(selectorObj.targetParent[0])) {
					$parentEl.addClass(selectorObj.status[0]);
				}
			}
		} else {
			$parentEl.removeClass(selectorObj.status[0]);
		}

		if($el.attr('disabled')) {
			$parentEl.addClass(selectorObj.status[1]);
		} else {
			$parentEl.removeClass(selectorObj.status[1]);
		}

	}
}



/*
	x축 스크롤
*/
/* 헤더 x축 스크롤 */
function xScrollHeader(){
	$('.layout .header').css({ 'margin-left': -$(this).scrollLeft() });
}

/* 스탭영역 X축 스크롤 */
function xScrollFloatFixed() {
	$('.layout .subheader.is_fixed .subheader_area').css({ 'margin-left': -$(this).scrollLeft() });
}

/* 견적레이어 x축 스크롤 */
function xScrollestimateFixed() {
	if ( $('.layout .estimate_result_layer').hasClass('sticky') ) return;
	$('.layout .estimate_result_layer').css({ 'margin-left': -$(this).scrollLeft() });
}

/* 상품소개 x축 스크롤 */
function xScrollintroFixed() {
	$('.layout .intro_fixed_part.show .intro_btn_box').css({ 'margin-left': -$(this).scrollLeft() });
}

/* 메인배너 x축 스크롤 */
function xScrollbannerlayer(){
	$('.layout .banner_layer').css({ 'margin-left': -$(this).scrollLeft() });
}



/*
	스탭영역 스크롤
*/
var scrStartP = 0; // 스크롤 기점

//스탭영역 fix 시점
function scrollPoint() {
	var $header = $('.header');
	var $subHeader =  $('.subheader');
	var headerH = $header.outerHeight(true);
	var subheaderH = $subHeader.outerHeight(true);

	scrStartP = headerH + subheaderH;

	return scrStartP;
}

//스탭영역 fix
function isFixOn() {
	var $subHeader = $('.subheader');
	var $step = $subHeader.find('.step_part');

	if( !$step.length > 0 ) return;

	$subHeader.addClass('is_fixed');
	contentsPosOn(); // fixed 걸릴 떄 컨텐츠 영역 위치 조정
	if( $(this).scrollLeft() !== 0 && $subHeader.hasClass('is_fixed') ) {
		$subHeader.children('.subheader_area').css({'margin-left' : -$(this).scrollLeft() });
	} else {
		return;
	}
}

//스탭영역 fix 해제
function isFixOff() {
	var $subHeader = $('.subheader');
	var $step = $subHeader.find('.step_part');

	if( !$step.length > 0 ) return;

	$subHeader.removeClass('is_fixed');
	contentsPosOff(); // fixed 걸릴 떄 컨텐츠 영역 위치 조정
	$subHeader.children('.subheader_area').css({'margin-left': ""});
}

// 서브헤더 높이 구하기
var subHarr = [];
function headerH() {
	var $contentsZ = $('.contents_zone');
	var subheaderHval = 0;

	if( !$contentsZ.hasClass('has_step') ) return;

	subheaderHval = $('.subheader').outerHeight(true);

	// 페이지가 로드 될때마다 높이값 쌓이는거 방지
	if( subHarr.length == 0 ) {
		subHarr.push(subheaderHval)
	}else if ( subHarr.length > 1 ) {
		subHarr.pop();
		subHarr.push(subheaderHval);
	}
}

// fixed 걸릴 떄 컨텐츠 영역 위치 조정
var scrStatus = false;
function contentsPosOn() {
	var $header = $('.subheader');

	$header.css('padding-bottom', subHarr[0]);
}
function contentsPosOff() {
	var $header = $('.subheader');

	$header.attr('style',"");
}



/*
	인풋
*/
var inputhasfocus = false;//인풋포커스상태
var inputhasclear = false;//인풋삭제버튼상태

function inputFunc(element){
	var $this = $(element),
		$inputpack = $this.closest('.input_pack'),
		$inputclearbtn = $inputpack.find('.btn_input_clear');

	//인풋포커스 제어
	if ( inputhasfocus == true ){

		$('.input_pack').removeClass('has_focus');//포커스한 인풋 제외한 인풋 포커스아웃
		$('.input_pack').removeClass('has_clear');//활성화된 인풋삭제버튼 제외한 인풋삭제버튼 비활성화

		if ($this.prop('readonly')) return;

		$inputpack.addClass('has_focus');

		// 20220117 주민번호유형에서 히든없애기
		if ($this.val().length > 0) {
			$this.closest('.input_pack').addClass('has_value');
		}

	} else {
		$inputpack.removeClass('has_focus');
	}

	//인풋삭제버튼 제어
	if ( inputhasclear == true ){
		if ($this.prop('readonly') || $this.prop('disabled')) return;

		if ( $this.val().length > 0 && $inputclearbtn.length > 0 ){
			$inputpack.addClass('has_clear');
		} else {
			$inputpack.removeClass('has_clear');
			if ($inputpack.find('input').val().length === 0 ) {
				$this.closest('.input_pack').removeClass('has_value');
			}
		}
	} else {
		$inputpack.removeClass('has_clear');
		if ($inputpack.find('input').val().length === 0) {
			$this.closest('.input_pack').removeClass('has_value');
		}
	}
}

// 인풋 포커스
$(document).on('focusin keyup keypress','.input_pack input', function(){
	inputhasfocus = true;
	inputhasclear = true;
	inputFunc($(this));
	packFocus($(this));
});

// 인풋 포커스아웃
$(document).on('focusout','.input_pack input',function(){
	inputhasfocus = false;
	inputFunc($(this));
	packFocusOut($(this));
});

// 인풋삭제버튼 클릭
$(document).on('click','.input_pack .btn_input_clear', function(){
	$(this).closest('.input_pack').find('input').val('');

	inputhasfocus = false;
	inputhasclear = false;
	inputFunc($(this));
	packFocusOut($(this));
});

// 인풋삭제버튼 포커스아웃
$(document).on('focusout','.input_pack .btn_input_clear', function(){
	inputhasfocus = false;
	inputhasclear = false;
	inputFunc($(this));
	packFocusOut($(this));
});

// 인풋이외 영역 클릭시 삭제버튼 숨김
$(document).on('click', function(e){
	if(e.target.nodeName.toLowerCase() != 'input' && !$(e.target).hasClass('btn_input_clear') && !$(e.target).hasClass('input_pack') ) {
		$('.input_pack').removeClass('has_clear');
		$('.input_pack').removeClass('has_focus');
	}
});



/*
	텍스트에어리어
*/
$(document).on('focusin','.ebtextarea',function(){
	packFocus($(this));
});

$(document).on('focusout','.ebtextarea',function(){
	packFocusOut($(this));
});



/*
	셀렉트
*/
$(document).on('focusin','.ebselect, .btn_select',function(){
	$(this).parent('.select_pack').addClass('has_focus');
	packFocus($(this));
});

$(document).on('focusout','.ebselect, .btn_select',function(){
	$(this).parent('.select_pack').removeClass('has_focus');
	packFocusOut($(this));
});

$(document).on('focusin','.btn_slct_trigr',function(){
	if ($(this).siblings('select').prop('disabled')) return;

	$(this).parent('.select_pack').addClass('has_focus');
	packFocus($(this));
});

$(document).on('focusout','.btn_slct_trigr',function(){
	if ($(this).siblings('select').prop('disabled')) return;

	$(this).parent('.select_pack').removeClass('has_focus');
	packFocusOut($(this));
});



/*
	라벨 포커스처리
*/
//포커스인
function packFocus(element){
	var $this = $(element);

	if (!$('.form_set').length > 0 || $this.prop('readonly')) return;

	var $thisform = $this.closest('.form_set');

	$thisform.addClass('has_focus');
	$('.form_set').not($thisform).removeClass('has_focus');
}

//포커스아웃
function packFocusOut(element){
	var $this = $(element);

	if (!$('.form_set').length > 0) return;

	$this.closest('.form_set').removeClass('has_focus');
}



/*
	DatePicker (데이트피커)
*/
$.datepicker._updateDatepicker_original = $.datepicker._updateDatepicker;
$.datepicker._updateDatepicker = function(inst) {
	$.datepicker._updateDatepicker_original(inst);
	var afterShow = this._get(inst, 'afterShow');
	if (afterShow) {
		afterShow.apply((inst.input ? inst.input[0] : null));
	}
}

var changeYearButtons = function(target){
	var inputDate = target;
	setTimeout(function(){
		var widgetHeader = inputDate.datepicker("widget").find(".ui-datepicker-header");
		var prevYrBtn = $('<a class="prevYear" title="Prev"></a>');
		prevYrBtn.on("click", function(){
			$.datepicker._adjustDate(inputDate, -1, 'Y');
		});
		var nextYrBtn = $('<a class="nextYear" title="Next"></a>');
		nextYrBtn.on("click", function(){
			$.datepicker._adjustDate(inputDate, +1, 'Y');
		});
		prevYrBtn.appendTo(widgetHeader);
		nextYrBtn.appendTo(widgetHeader);
	}, 1);
};

var changeMonthButtons = function(target) {
	var inputDate = target;
	setTimeout(function(){
		var widgetHeader = inputDate.datepicker("widget").find(".ui-datepicker-header");
		var prevMoBtn = $('<a class="ui-datepicker-prev" title="Prev"></a>');
		prevMoBtn.on("click", function(){
			$.datepicker._adjustDate(inputDate, -1, 'M');
		});
		var nextMoBtn = $('<a class="ui-datepicker-next" title="Next"></a>');
		nextMoBtn.on("click", function(){
			$.datepicker._adjustDate(inputDate, +1, 'M');
		});
		prevMoBtn.appendTo(widgetHeader);
		nextMoBtn.appendTo(widgetHeader);
	}, 1);

}

$.fn.fnDatePicker = function() {
	var inputDate = $(this);

	inputDate.each(function() {
		var inputDate = $(this);
		// inputDate.datepicker("destroy");
		var minDateVal = inputDate.attr('data-mindate');
		var maxDateVal = inputDate.attr('data-maxdate');

		if( inputDate.hasClass('hasDatepicker') === false ) {
			inputDate.datepicker({
				dateFormat: "yy.mm.dd",
				showMonthAfterYear: true,
				showOtherMonths: true,
				minDate: minDateVal,
				maxDate: maxDateVal,
				dayNamesMin: ['일', '월', '화', '수', '목', '금', '토'],
				monthNames:  [ "1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월" ],
				changeMonth: false,
				changeYear: false,
				showAnim: false,
				yearSuffix: '년',
				monthNamesShort:  [ "1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월" ],
				beforeShow: function(input){
					changeYearButtons(inputDate);
					changeMonthButtons(inputDate);

					var i_offset = $(input).offset();
					setTimeout(function() {
						$('#ui-datepicker-div').css({
							'top': i_offset.top + 66,
						})
					},0)
				},
				afterShow: function() {
					$('select.ui-datepicker-year option').each(function() {
						var $option = $(this);
						var beforeText = $option.text();
						var nextText = beforeText + '년';
						$option.text(nextText);
					})

				},
				onClose: function(){
				},
				onChangeMonthYear:function(){
					changeYearButtons(inputDate);
					changeMonthButtons(inputDate);
				},
			});

		}

	})
}

$(document).on('change keydown keyup', '[data-datepicker="el"]', function() {
	if( $('#ui-datepicker').find('.nextYear').length == 0 ){
	setTimeout(changeYearButtons($(this)), 0)
	};
})



/*
	커스텀 셀렉트 초기세팅
*/
function customSelectSetting(){
	if (!$('.select_pack').length > 0) return;

	if ($('select option[selected]').length > 0){
		$('select option[selected]').closest('.select_pack').addClass('has_selected')
	}

	$('.select_pack').each(function(){/* 2022-04-08 수정 */
		var $this = $(this),
			$select = $this.find('select');

		if( $this.find('.btn_slct_trigr').length == 0 ){
			$select.attr('tabindex','-1');
			$select.before('<button type="button" class="ebbtn btn_slct_trigr" title="'+$select.attr('title')+' 선택"></button>');
		};
	});
};



/*
	커스텀 셀렉트
*/
var customSelect = function(element) {

	/* Funtion Define */
	var fnName = '[data-ui="customSelect"]',
		$this = $(element).closest(fnName),
		$select = $this.find('select'),
		$stage = $('body');

	/* Class Define */
	var	onClass = 'on',
		dimClass = 'select_dim',
		optionLayerClass = 'select_layer',
		optionLayerScrollClass = 'option_scroll',
		// optionLayerCloseClass = 'ebbtn btn_layer_close',
		// optionTitleClass = 'options_title',
		optionListClass= 'option_list',
		optionClass = 'ebbtn option';

	/* Extend Define */
	var	nowStatus = $this.attr('data-status'),
		statusDisabled = $select.attr('disabled'),
		statusReadonly = $select.attr('readonly'),
		optionLength = $select.children('option').length;


	/* Reset */
	if ( statusDisabled == 'disabled' ||  statusReadonly == 'readonly' ) return;
	$(fnName).find('.'+dimClass+', .'+optionLayerClass+'').remove();

	/* Option Init */
	$select.before('<div class="'+dimClass+'"></div>');
	$select.after('<div class="'+optionLayerClass+'" role="dialog"></div>');

	var $dim = $this.find('.'+dimClass),
		$optionLayer = $this.find('.'+optionLayerClass);
	var $optionScroll = $('<div>', {
			class: optionLayerScrollClass
		}).appendTo($optionLayer);
	var $optionList = $('<div>', {
			class: optionListClass
		}).appendTo($optionScroll);


	// var $closeBtn = $('<button>', {
	// 	class: optionLayerCloseClass,
	// 	title: '닫기'
	// }).appendTo($optionLayer);

	for ( var i = 0; i < optionLength; i++ ) {
		var option = $select.children('option').eq(i);
		if ( option.attr('hidden') ) {

		} else if ( option.attr('disabled') ) {
			$('<button>', {
				type: 'button',
				class: optionClass,
				text: option.text(),
				rel: option.val(),
				disabled: 'disabled'
			}).appendTo($optionList);
		} else {
			$('<button>', {
				type: 'button',
				class: optionClass,
				text: option.text(),
				rel: option.val()
			}).appendTo($optionList);
		}
	}

	var $optionBtn = $optionList.find('button');
	setTimeout(function(){
		$optionBtn.each(function(){
			var thisRel = $(this).attr('rel'),
				thisValue = $select.val();
			if ( thisRel == thisValue ) {
				$(this).addClass(onClass);
			}
		})
	}, 0);


	/* Common Function */
	function open(){
		if( $('.select_option_layer').length > 0 )  $('.select_option_layer').removeClass('active');
		$optionLayer.attr('tabindex', 0).focus();
		$this.addClass('has_focus');
		packFocus($this);
		$stage.on({
			click: function(e) {
				if(!$(e.target).hasClass($this)) {
					$this.removeClass('has_focus');
					packFocusOut($this);
					close();
				};
			}, keydown: function(e) {
				if ( e.keyCode==27 ) {
					e.stopPropagation();
					close();
				};
			}
		});
		$this.attr('data-status','open');
	};

	function close(){
		$stage.off('click keydown');
		setTimeout(function(){
			$optionLayer.remove();
		}, 0);
		setTimeout(function(){
			$this.removeAttr('data-status');
		}, 1);
		return;
	};

	/* Event Binding */
	$select.on({
		keydown: function(e) {
			if ( e.keyCode==27 ) {
				e.stopPropagation();
				close();
			};
		}
	});

	$optionLayer.on({
		click: function(e) {
			e.stopPropagation();
		}, keydown: function(e) {
			if ( e.keyCode==27 ) {
				e.stopPropagation();
				close();
			};
		}
	});

	// $closeBtn.on({
	// 	click: function(e) {
	// 		e.stopPropagation();
	// 		close();
	// 	}, blur: function(e) {
	// 		$optionLayer.addClass(onClass).attr('tabindex', 0).focus();
	// 	}
	// });

	$optionBtn.on({
		click: function(e) {
			e.stopPropagation();
			$this.addClass('has_selected');
			$select.val($(this).attr('rel'));
			close();
			$select.focus();
			// $select.trigger('change');//체인지 이벤트 발생
			// document.querySelector('#'+$select.attr('id')).dispatchEvent(new Event("change"));
			// $this[0].querySelector('select').dispatchEvent(new Event("change"));/* 2022-04-08 수정 */

			/* 2022-05-14 수정(ie에서 위 소스 오류 및 미작동) */
			var event;
			if(typeof(Event) === 'function') {
				event = new Event('change');
			}else{
				event = document.createEvent('Event');
				event.initEvent('change', true, true);
			}
			$this[0].querySelector('select').dispatchEvent(event);
		}
	});

	/* Init */
	if ( nowStatus == 'open' ) {
		close();
	} else {
		open();
	}

}

$(document).on('keydown','.select_pack .btn_slct_trigr',function(e){/* 2022-04-08 수정 */
	if ( $(this).siblings('select').prop('disabled') ) return;
	if ( e.keyCode==13 || e.keyCode==32 ) {
		// e.preventDefault();
		customSelect($(this));
	}
});

$(document).on('click','.select_pack .btn_slct_trigr',function(e){/* 2022-04-08 수정 */
	if ( $(this).siblings('select').prop('disabled') ) return;
	// e.preventDefault();
	customSelect($(this));
});

// 버튼셀렉트 클릭
$(document).on('click','.select_pack .btn_select',function(){
	optionSelectShow($(this));
});



/*
	레이어 옵션 선택
*/
// 옵션레이어 열기
function optionSelectShow(element){
	var $this = $(element);
	$this.siblings('.select_option_layer').addClass('active');
}

// 옵션레이어 닫기
function optionSelectHide(element){
	var $this = $(element);
	$this.closest('.select_option_layer').removeClass('active');
}

// 옵션선택 활성화
function optionSelectFunc(element){
	var $this = $(element),
		$thisli = $this.parent('li');

	//옵션 선택 버튼 활성화
	$this.closest('.select_pack').addClass('has_selected');

	//옵션활성화
	$thisli.addClass('active').siblings('li').removeClass('active');

	if ( $this.closest('.option_list').hasClass('ty_line') ){
		var _thisoption = $this.find('.title').html();
		$this.closest('.select_pack').find('.btn_select').html(_thisoption)
	} else {
		var _thisoption = $this.html();
		$this.closest('.select_pack').find('.btn_select').html(_thisoption)
	}

	optionSelectHide($this)
}

// 옵션 클릭
$(document).on('click','.select_option_layer .option_list .btn_option',function(){
	optionSelectFunc($(this));

});

// 옵션이외 영역 클릭시 옵션레이어 닫기
$(document).on('click', function(e){
	if(!$(e.target).hasClass('select_option_layer') && !$(e.target).hasClass('btn_select') ) {
		$('.select_option_layer').removeClass('active');
	}
});



/*
	토글버튼
*/
function togglebtnFunc(element){
	var $this = $(element),
		$thisli = $this.parent('li');

	//클릭시 on/off(차종선택)
	if ( $this.closest('.toggle_pack').length > 0 ){
		$thisli.addClass('active').siblings('li').removeClass('active');

	} else {
		//토글버튼활성화
		if($thisli.hasClass('active')){
			$thisli.removeClass('active');
			$thisli.siblings('li').removeClass('active');
		} else {
			$thisli.addClass('active');
			$thisli.siblings('li').removeClass('active');
		}
	}
}

// 토글버튼 클릭
$(document).on('click','.btn_toggle',function(){
	togglebtnFunc($(this));
});

// 토글버튼 엔터
$(document).on('keyup','.btn_toggle[tabindex="0"]', function(e){
	var key = e.keyCode;
	if(key==13){
		togglebtnFunc($(this));
	}
});

// 토글버튼 안에 인풋 클릭
$(document).on('click','.btn_toggle .ebinput',function(e){
	e.stopPropagation();
});

// 토글버튼 안에 버튼 클릭
$(document).on('click','.btn_toggle .ebbtn',function(e){
	e.stopPropagation();
});

// 차량선택 클릭
$(document).on('click','.calc_data_box.ty_border',function(){
	if($(this).hasClass('active')){
		$(this).removeClass('active');
		$(this).siblings().removeClass('active');
	} else {
		$(this).addClass('active');
		$(this).siblings().removeClass('active');
	}
});



/*
	탭
*/
function tabFunc(element){
	var $this = $(element),
		$tab = $this.parent(),
		$tabpack = $this.closest('.tab_pack');

	//data-attribute가 있을때 주는 탭기능
	if ( !$this.closest('.tab_pack').data('module-id') == (null || '') ){
		var _tabid = $tabpack.data('module-id'); //탭아이디
		var _tabindex = $tab.index(); //활성화된 탭인덱스

		//탭활성화
		$tab.addClass('active').siblings().removeClass('active');

		//탭컨텐츠활성화
		$('.tabcontent_pack[data-module-for="'+_tabid+'"]').children().children().eq(_tabindex).addClass('active').siblings().removeClass('active');

		//탭클릭시 스크롤 탑으로 보내기
		if ( $this.closest('.modal_popup').length > 0 ){
			if ( $this.closest('.fixed_tab_part').length > 0 ){
				$this.closest('.modal_popup').find('.tabcontent_pack').scrollTop(0);
			}
		}
	}
}

// 탭 클릭
$(document).on('click','.tab_pack .btn_tab',function(){
	tabFunc($(this));
});



/*
	아코디언
*/
//아코디언 초기세팅
function accordionSetting(element){
	if (!$('.accordion_pack').length > 0) return;
    var $accordion = $(element);
    for(var i=0; i < $accordion.length; i++){
		//아코디언 초기에 열려있는 경우
        if( $accordion.eq(i).hasClass('active') ){
            $accordion.eq(i).find('.accordion_content').slideDown(0);
        }
    }
};

function accordionFunc(element){
	var $this = $(element),
    	$thispack = $this.closest('.accordion_pack'),
    	$thiscontent = $thispack.children('.accordion_content');
    var _time = 300;

	if( !$thispack.hasClass('active') ){
		$thiscontent.stop().slideDown(_time);
		$thispack.addClass('active');
	}else{
		$thiscontent.stop().slideUp(_time);
		$thispack.removeClass('active');
	}
}

// 아코디언 클릭
$(document).on('click','[data-function="accordion"]',function(e){
	e.stopPropagation();
	accordionFunc($(this));
});

/*
	대화창팝업 - 2022-10-28 추가
*/
function accordion02Setting(){
	$(".accordion_absolute_pack_wrap .accordion_absolute_title").click(function(e){
		var dropDown = $(this).closest(".accordion_absolute_pack")
		$('.accordion_absolute_pack_wrap').find(".accordion_absolute_pack").not(dropDown).removeClass("active")

		dropDown.stop(false, true).toggleClass("active")
        e.preventDefault();
	})
	$(".accordion_absolute_pack .close").click(function(){
		$(this).closest(".accordion_absolute_pack").removeClass("active");
	})
}


/*
	툴팁 tooltip
*/
function tooltipFnOn() {

	var _this = $(this);

	_this.each(function() {

		var _this = $(this);
		var positionT = _this.position().top;
		var positionL = _this.position().left;
		var _tooltip = $('.tooltip_msg_part');

		_tooltip.css({
			top : positionT + 20,
			left: positionL - 12,
		})
		_tooltip.addClass('active');

	})

}

function tooltipFnOff() {
	$('.tooltip_msg_part').removeClass('active');
	$('.tooltip_msg_part').attr('style', "");
}

$(document).on('focus mouseenter', '.icon_tooltip', tooltipFnOn);
$(document).on('click', '.btn_tooltip_close', tooltipFnOff);

// 툴팁이외 영역 클릭시 삭제버튼 숨김
$(document).on('click', function(e){
	if(!$(e.target).hasClass('tooltip_msg_pack') && !$(e.target).hasClass('icon_tooltip') ) {
		tooltipFnOff()
	}
});



/*
	요소 클릭기능 제어
*/
function clickStatus() {
	var $this = $(this);
	var $dataFn = $this.closest('[data-check="itembox"]');

	if (!$dataFn.length || $dataFn.hasClass('active') ) return;

	$dataFn.addClass('active')
	$dataFn.siblings().removeClass('active');
}

$(document).on('click', "[data-check='item']", clickStatus);



/*
	draggable
*/
function draggableUi(){
	$('[data-draggable="el"]').draggable({
		stack:'[data-draggable="el"]',
		handle: '[data-draggableEl="handle"]',
		// cancel: '.ebtitle3',
		containment : '.modal_popup',
		scroll: true,
		scrollSensitivity: 100,
		scrollSpeed: 15,
	});
}

function marketingdraggableUi(){
	$('[data-draggable="el"]').draggable({
		stack:'[data-draggable="el"]',
		containment : '.layout .container',
		scroll: false,
		scrollSensitivity: 100,
		scrollSpeed: 15,
	});
}

$(document).on('mousedown', '[data-draggable="el"]', function(){
	var clicked_zIdx = 0;
	$('[data-draggable="el"]').each(function() {
		var myZidx = Number($(this).css('z-index'));
		clicked_zIdx = myZidx > clicked_zIdx ? myZidx : clicked_zIdx;
	});
	$(this).css({'z-index': clicked_zIdx + 10 });
});



/*
	바디스크롤 제어
*/
function bodyScrCtrl(mode) {
	var $body = $('body');

	if( mode === 'lock' ) {
		$body.css({"overflow" : "hidden"});
	}
	if( mode === 'unlock') {
		$body.css({"overflow" : "visible"});
	}
}



/*
	팝업(z-index 작업필요할수있음)
*/
function popupFunc(id, options){
	var defaults = {
		type: 'popup',
	};

	var $this = $(id),
		_activelayout = 'active_layout'; //활성화된 모달창에 붙는 클래스

	var popup = {
		layout: 'popup_layout',
		layoutinner: 'popup_inner',
        header: 'popup_header',
        body: 'popup_body',
        container: 'popup_container',
        footer: 'popup_footer',
	};

	//팝업 타입 설정, 타입별 오브젝트 업데이트
	var type = function(){
		if ( $this.hasClass('modal_popup') ){
			o.type = 'popup';
			o = $.extend(o, popup, options);
		}
	}

	//오브젝트 합치기
	var o = $.extend(defaults, options);
	if( o.type == 'popup' ) var o = $.extend(defaults, popup, options);

	var methods = {
		show: function(){
			type(); // 팝업 타입 설정

			//팝업 딤처리
			if( $this.find('.popup_dim').length == 0 ) $this.append('<div class="popup_dim"></div>');
			setTimeout(function(){
				$this.find('.popup_dim').addClass('show');
				$this.find('.' + o.layout).addClass(_activelayout);
			},100)

			$this.addClass('show');
			popupSize($this);
			bodyScrCtrl('lock');
			$this.find('.' + o.body).scrollTop(0);
			if ( $this.find('.' + o.layout).attr('data-draggable') ) draggableUi();//draggable
		},
		close: function(){
			//팝업 딤처리
			$this.find('.popup_dim').removeClass('show');
			setTimeout(function(){
				$this.find('.popup_dim').remove();
			},100)

			setTimeout(function(){
				$this.removeClass('show');
			},300)

			$this.find('.' + o.layout).removeClass(_activelayout);

			if( $('.' + _activelayout).length === 0 ) { // 열린팝업이 없으면 바디스크롤 해제
				bodyScrCtrl('unlock');
			}
		},
		closeAll: function(){
			//팝업 딤처리
			$('.popup_dim').removeClass('show');
			setTimeout(function(){
				$('.popup_dim').remove();
			},100)

			$('.'+_activelayout).parent().removeClass('show');
			$('.'+_activelayout).removeClass(_activelayout);
			bodyScrCtrl('unlock');
		},
		remove: function(){
			//팝업 딤처리
			$this.find('.popup_dim').removeClass('show');
			setTimeout(function(){
				$this.find('.popup_dim').remove();
			},100)
			setTimeout(function(){
				$this.remove();
			},300)

			$this.find('.' + o.layout).removeClass(_activelayout);
			if( $('.' + _activelayout).length === 0 ) { // 열린팝업이 없으면 바디스크롤 해제
				bodyScrCtrl('unlock');
			}
		},
		removeAll: function(){
			//팝업 딤처리
			$('.popup_dim').removeClass('show');
			setTimeout(function(){
				$('.popup_dim').remove();
			},100)

			$('.'+_activelayout).parent().remove();
			bodyScrCtrl('unlock');
		}
	}

	return methods;
}

//팝업 닫기버튼
$(document).on('click','[data-action]',function(){
	var $modal = $(this).closest('.active_layout').parent();
	var _thisid = $(this).closest('.active_layout').parent().attr('id');
	var _action = $(this).attr('data-action');

	if ( _action == 'close' ) popupFunc('#' +_thisid).close();
	if ( _action == 'close_all' ) popupFunc('#' +_thisid).closeAll();
	if ( _action == 'remove' ) popupFunc('#' +_thisid).remove();
	if ( _action == 'remove_all' ) popupFunc('#' +_thisid).removeAll();
});

//팝업 사이즈 계산(팝업호출시 실행해야함)
var popupSize = function(element){
    var $this = $(element);

	$this.each(function(){
		var $this = $(this);
		var $dim = $this.find('.popup_dim');
        var $layout = $this.find('.popup_layout');
		var $layoutinner = $this.find('.popup_inner');
        var $header = $this.find('.popup_header');
        var $body = $this.find('.popup_body');
        var $container = $this.find('.popup_container');
        var $footer = $this.find('.popup_footer');

		//높이
        var _headerH = $header.outerHeight();
        var _footerH = $footer.outerHeight();

		if ($layout.prop("style")["height"] == ''){ // 팝업 높이값을 설정하지 않은 경우
			$body.css('max-height', $this.height() - (_headerH + _footerH));
		}

		$dim.css('min-width',$layout.width()+40);//220510 추가

	})
}



/*
	마케팅 팝업
*/
function marketingPopupShow (id){
	var $popup = $(id);
	$popup.addClass('show');
	if ( typeof $popup.attr('data-draggable') != undefined ) marketingdraggableUi();//draggable
}

function marketingPopupHide (id){
	var $popup = $(id);
	$popup.removeClass('show');
}

$(document).on('click', '[data-marketingClose]', function(){
	var popupId = $(this).closest('.marketing_popup').attr('id');

	marketingPopupHide('#'+popupId);
});



/*
	레이어팝업
*/
function ui_layerpopupShow(id){
	var $popup = $(id);
	if( $popup.find('.popup_dim').length == 0 ) $popup.append('<div class="popup_dim"></div>');
	setTimeout(function(){
		$popup.find('.popup_dim').addClass('show');
		$popup.find('.popup_layout').addClass('active_layout');
	},100)

	$popup.addClass('show');
	bodyScrCtrl('lock');
}

function ui_layerpopupHide(id){
	var $popup = $(id);
	$popup.find('.popup_dim').removeClass('show');
	setTimeout(function(){
		$popup.find('.popup_dim').remove();
	},100)
	setTimeout(function(){
		$popup.removeClass('show');
	},300)

	$popup.find('.popup_layout').removeClass('active_layout');
	bodyScrCtrl('unlock');
}



/*
	레이어팝업 옵션 선택
*/
function layerOptionSelectFunc(element){
	var $this = $(element),
		$thisli = $this.parent('li');

	//옵션활성화
	$thisli.addClass('active').siblings('li').removeClass('active');
}

// 옵션 클릭
$(document).on('click','.modal_popup .option_list .btn_option',function(){
	layerOptionSelectFunc($(this));
});



/*
	헤더 지앤비
*/
$(document).on('focus mouseover','.header .header_area .gnb .depth1 > li > .menuname', function(){
	$('.header .header_area .gnb .depth1 > li > .menuname').removeClass('active');
	$(this).addClass('active');
	if ( $(this).siblings('.depth2').length > 0 ){
		$('.header .header_area .gnb .depth2').removeClass('active')
		$(this).siblings('.depth2').addClass('active');
	} else {
		$('.header .header_area .gnb .depth2').removeClass('active')
	}
});
$(document).on('focus','.header .btn_login', function(){
	$('.header .header_area .gnb .depth1 > li > .menuname').removeClass('active');
	$('.header .header_area .gnb .depth2').removeClass('active');
});
$(document).on('mouseleave','.header .header_area .gnb .depth2', function(){
	$('.header .header_area .gnb .depth1 > li > .menuname').removeClass('active');
	$(this).removeClass('active');
});
$(document).on('mouseleave','.header', function(){
	$('.header .header_area .gnb .depth1 > li > .menuname').removeClass('active');
	$('.header .header_area .gnb .depth2').removeClass('active');
});



/*
	패밀리사이트
*/
function familyShow() {
	var $target = $('.family_site');

	$target.addClass('active');

	// 접근성
	var $hiddentxt = $('.btn_select_family .hidden_txt');
	$hiddentxt.text('목록창닫기');
}

function familyHide() {
	var $target = $('.family_site');

	$target.removeClass('active');

	// 접근성
	var $hiddentxt = $('.btn_select_family .hidden_txt');
	$hiddentxt.text('목록창열기');
}

$(document).on('click','.family_site .btn_select_family', function(){
	familyShow()
});
$(document).on('click', function(e){
	if (!$('.family_site').has(e.target).length) {
		familyHide();
	}
});
$(document).on('click', '.family_site .btn_select_family_close', function (e) {
	familyHide();
	$('.btn_select_family').focus();
})



/*
	전체메뉴
*/
// 전체메뉴 열기
$(document).on('click','.btn_all_menu', function(){
	if ( !$('.totalmenu_layer').length > 0 ) return;

	bodyScrCtrl('lock');
	$('.totalmenu_layer').addClass('show');
	$('.totalmenu_area').scrollTop(0);

	//전체메뉴 스크롤x 설정
	var _headerscr = $('.header').css('margin-left').replace(/[^0-9]/g, "");
	$('.totalmenu_layer').scrollLeft(_headerscr)

});

// 전체메뉴 닫기
$(document).on('click','.btn_totalmenu_close', function(){
	bodyScrCtrl('unlock');
	$('.totalmenu_layer').removeClass('show');
});



/*
	브래드크럼
*/
// 브래드크럼 목록열기
$(document).on('click','.breadcrumbs_pack .btn_linklist', function(){
	$('.breadcrumbs_pack > ul > li .btn_box').removeClass('active');
	$(this).parent('.btn_box').addClass('active');
});

// 브래드크럼 목록닫기
$(document).on('click','.breadcrumbs_pack .btn_linklist_close', function(){
	$(this).parent('.btn_box').removeClass('active');
});



/*
	상품소개 버튼영역
*/
function introPageFn(){
	var $fixedpart = $('.intro_fixed_part');
	var $btnbox = $('.intro_btn_box, .intro_tel_box')

	if($btnbox.length > 0 ) {

		$(window).on('scroll', function() {
			var nowScroll = $(window).scrollTop();
			var scrollPoint = $btnbox.offset().top + $btnbox.height();

			if( nowScroll > scrollPoint ) {
				$fixedpart.addClass('show')
			}else {
				$fixedpart.removeClass('show')
			}

		})

	}

}



/*
	상품소개 애니메이션
*/
function productAni() {

	var $inquiryPart = $('.inquiry_part');
	var $imgBox = $inquiryPart.find('.imgani_box');

	// 예외케이스 - 신용대출
	var $loanCase = $('.loan_part ~ .intro_part .intro_main > .cont_box');

	if($imgBox.hasClass('active') || $loanCase.hasClass('active')) return;

	$(window).on('scroll', function() {

		var nowScroll = $(this).scrollTop();
		if(nowScroll > 0) {
			$imgBox.addClass('active')
			$loanCase.addClass('active')
		}
	})

}



/*
	견적레이어 노출
*/
function scrollFloating() {
	var $parentEl = $('.estimate_result_part');
	var $target = $parentEl.children('.estimate_result_layer');
	var $el = $target.children('.estimate_result_box');
	var standard = $('.subheader').length ? $('.subheader').outerHeight() : null; // 견적레이어show 기준점
	var eventName = "scroll";

	if(!$parentEl.length && !$('.subheader').length) return

	var case1 = $parentEl.closest('.estimate_detail_part').length > 0 ;
	var case2 = $parentEl.closest('.car_part').length > 0;

	var val = case1 || case2;

	$parentEl.css({
		"margin-top": 40+"px",
		"height": $target.outerHeight()
	})

	document.addEventListener(eventName, function(e) {
		var scrVal = this.documentElement.scrollTop || window.scrollY;
		var windowSize = window.innerHeight;
		var footerPos = $('.footer').offset().top;

		if(scrVal > standard) {
			$target.css({
				display: "block",
				position : "fixed",
				bottom: "30px"
			})
			$el.css({
				margin: "0 auto"
			})
		}

		switch(val) {

			case case1 :

				if( scrVal == 0 || footerPos - 17 < (windowSize + scrVal)) {
					$target.addClass('sticky');
					$target.attr('style', '');
					$el.attr('style', '');
				} else {
					$target.removeClass('sticky');
					xScrollestimateFixed();
				}

			break;

			case case2 :

				if( scrVal == 0 || footerPos - 57 < (windowSize + scrVal) ) {
					$target.addClass('sticky');
					$target.attr('style', '')
					$el.attr('style', '')
				} else {
					$target.removeClass('sticky');
					xScrollestimateFixed();
				}

			break;

		}
	})
}



/*
	메인화면 접근성
*/
$(document).on('keyup','.main_visual_part .main_visual .norm_item',function(){
	$(this).addClass('active').siblings().removeClass('active');
});
$(document).on('keyup','.main_visual_part .main_visual .visual_items .main_item .ebbtn.btn_item_golink', function(e){
	var key = e.keyCode;
	if(key==9){
		if(e.shiftKey == true){
			$('.main_visual_part .main_visual .norm_item').removeClass('active');

		}
	}
});
$(document).on('keyup','.main_service_part .main_service .service_items .item_box .ebbtn.btn_main_service', function(e){
	var key = e.keyCode;
	if(key==9){
		$('.main_visual_part .main_visual .norm_item').removeClass('active');
	}
});



/*
	메인 이벤트 스와이퍼
*/
var maineventSlider = [];
var maineventswiper;

function maineventSwiper() {

    for (var i=0; i<maineventSlider.length; i++) {
        maineventSlider[i].destroy();
    }

    maineventSlider = [];

    var $maineventContainers = $('.main_event_slider .swiper-container');

    $maineventContainers.each(function () {

		var $container = $(this);

		maineventswiper = new Swiper($container, {
			speed: 400,
			slidesPerView: 1,
			pagination: {
				el: ".swiper-pagination",
			},
			navigation: {
				nextEl: ".swiper-button-next",
				prevEl: ".swiper-button-prev",
			},
		});

		maineventSlider.push(maineventswiper);
    });
}



/*
	lp 메인 스와이퍼
*/
var lpmainSlider = [];
var lpmainswiper;

function lpmainSwiper() {

    for (var i=0; i<lpmainSlider.length; i++) {
        lpmainSlider[i].destroy();
    }

    lpmainSlider = [];

    var $lpmainContainers = $('.lp_main_slider .swiper-container');
    var $lpmainstopbtn = $('.lp_main_slider .slide_btn .ebbtn.btn_slide_stop');
    var $lpmainstartbtn = $('.lp_main_slider .slide_btn .ebbtn.btn_slide_start');

    $lpmainContainers.each(function () {

		var $container = $(this);

		lpmainswiper = new Swiper($container, {
			autoplay: {
				delay: 3000,
				disableOnInteraction: false,
			},
			speed: 400,
			slidesPerView: 1,
			pagination: {
				el: ".swiper-pagination",
				type: "fraction",
			},
			navigation: {
				nextEl: ".swiper-button-next",
				prevEl: ".swiper-button-prev",
			},
		});
		$lpmainstartbtn.on('click',function(){
			lpmainswiper.autoplay.start();
			$(this).css('display','none');
			$lpmainstopbtn.css('display','block');
		})
		$lpmainstopbtn.on('click',function(){
			lpmainswiper.autoplay.stop();
			$(this).css('display','none');
			$lpmainstartbtn.css('display','block');
		});

		lpmainSlider.push(lpmainswiper);
    });
}

