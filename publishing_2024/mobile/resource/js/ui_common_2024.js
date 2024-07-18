/* v1.0 | 2022-05-31 */


/*
	대분류
*/
/* 소분류 */

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


$(window).on('load',function(){
	containerSettting();//컨테이너 초기세팅
	topfixedSetting();//상단고정영역 초기세팅
	estimateSettting();//견적상세 초기세팅
	formSetting();//폼 초기세팅
	customSelectSetting();//커스텀셀렉트 초기세팅
	accordionSetting('.accordion_pack');//아코디언 초기세팅
	tabScrSetting();//탭 스크롤 초기세팅
	popupScr()//팝업스크롤
	if ( $('[data-date="trigger"]').length > 0 ) $('[data-date="trigger"]').fnDatePicker();//데이트피커
	semiDonut('#temp-semidoughnut01');//도넛차트
});


$(window).on('resize',function(){
	totalmenuSize();//전체메뉴 사이즈 계산
})


$(window).on('scroll',function(){
	headerScr();//헤더 스크롤
	pageTitleScr();//페이지타이틀 스크롤
	stepScr();//스탭 스크롤
	floatingBtnFadeAni();//플루팅버튼 스크롤
})



/*
	비동기실행함수(함수 내부에 length 조건절 달기)
*/
function pageloadFunc() {
	containerSettting();//컨테이너 초기세팅
	topfixedSetting();//상단고정영역 초기세팅
	estimateSettting();//견적상세 초기세팅
	formSetting();//폼 초기세팅
	customSelectSetting();//커스텀셀렉트 초기세팅
	accordionSetting('.accordion_pack');//아코디언 초기세팅
	tabScrSetting();//탭 스크롤 초기세팅
	popupScr()//팝업스크롤
	if ( $('[data-date="trigger"]').length > 0 ) $('[data-date="trigger"]').fnDatePicker();//데이트피커
}



/*
	헤더 스크롤
*/
function headerScr(){
	var $header = $('.header');

	if ($header.length == 0) return;

	var _windowT = $(window).scrollTop();

	if ( _windowT > 0 && $('.top_fixed_part').length == 0 ){
		$header.addClass('is_scroll');
	} else {
		$header.removeClass('is_scroll');
	}
}



/*
	페이지타이틀 스크롤
*/
function pageTitleScr(){
	var $titlepart = $('.page_title_part .ebtitle2');

	if ($titlepart.length == 0) return;

	var $headertitle = $('.header_title h2');
	var $contentstitle = $('.page_title_part .ebtitle2');

	var _windowT = $(window).scrollTop();
	var _showpoint = $contentstitle.offset().top + $contentstitle.height() - $('.header').outerHeight();

	if ( _windowT > _showpoint ){
		$headertitle.addClass('show');
	} else {
		$headertitle.removeClass('show');
	}
}



/*
	스탭 스크롤
*/
function stepScr(){
	var $steppart = $('.step_part');

	if ($steppart.length == 0) return;

	var _windowT = $(window).scrollTop();
	var _showpoint = $steppart.offset().top + $steppart.height() - $('.header').outerHeight();

	if ( _windowT > _showpoint ){
		$steppart.addClass('is_scroll');
	} else {
		$steppart.removeClass('is_scroll');
	}
}



/*
	플루팅버튼 스크롤
*/
function floatingBtnFadeAni(){
	var $floatingBtn = $('.main_floating_part');

	if($floatingBtn.length === 0) return;

	var winH = $(window).height(),
		footerT = $('.footer').offset().top;

	if($(window).scrollTop() > footerT - winH){
		$floatingBtn.fadeOut(200);
	} else {
		$floatingBtn.fadeIn(200);
	}
}



/*
	팝업 스크롤
*/
function popupScr(){
	var $popupbody = $('.popup_body');

	if ($popupbody.length == 0 && !$popupbody.closest('.modal_popup').hasClass('.ty_popupfull')) return;

	$popupbody.scroll(function() {
		if($(this).scrollTop() > 0) {
			$(this).closest('.modal_popup.ty_popupfull').addClass('is_scroll');
		} else {
			$(this).closest('.modal_popup.ty_popupfull').removeClass('is_scroll');
		}

		//팝업 타이틀 스크롤
		if ($('.popup_body .ebtitle2').length > 0){
			var $headertitle = $('.popup_header .ebtitle2');
			var $contentstitle = $('.popup_body .ebtitle2');
			if($(this).scrollTop() > $contentstitle.offset().top + $contentstitle.height()) {
				$headertitle.addClass('show');
			} else {
				$headertitle.removeClass('show');
			}
		}
		if ($('.popup_body h2').length > 0){
			var $headertitle = $('.popup_header .ebtitle2');
			var $contentstitle = $('.popup_body h2');
			if($(this).scrollTop() > $contentstitle.offset().top + $contentstitle.height()) {
				$headertitle.addClass('show');
			} else {
				$headertitle.removeClass('show');
			}
		}
	});
}



/*
	컨테이너 초기세팅
*/
function containerSettting(){
	var $contentsbottom = $('.contents_bottom_area');

	if ( !$contentsbottom.length > 0 ) return;

	var $container = $contentsbottom.closest('.container');
	var _contentbottomH = $contentsbottom.outerHeight();
	var _padding = 15;

	//하단고정버튼 있는 경우 컨테이너에 패딩추가
	$('.contents_area').css('padding-bottom',_contentbottomH + _padding);
}



/*
	상단 고정영역 초기세팅
*/
function topfixedSetting(){
	var $topfixedpart = $('.top_fixed_part');

	if ( !$topfixedpart.length > 0 ) return;

	var _topfixedpartH = $topfixedpart.outerHeight();

	//하단고정버튼 있는 경우 컨테이너에 패딩추가
	$('.contents_area').css('padding-top',_topfixedpartH);
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
		}

		if($el.attr('disabled')) {
			$parentEl.addClass(selectorObj.status[1]);
		}
	}
}



/*
	견적상세 초기세팅
*/
function estimateSettting(){
	var $layer = $('.estimate_result_layer');

	if ( !$layer.length > 0 ) return;

	var $part = $layer.parent('.estimate_result_part');
	var _layerH = $layer.outerHeight();

	//하단고정버튼 있는 경우 컨테이너에 패딩추가
	$part.css('height',_layerH);
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

$.fn.fnDatePicker = function(callbackFn) {
	var inputDate = $(this);

	inputDate.each(function() {
		var inputDate = $(this);
		var minDateVal = inputDate.attr('data-mindate');
		var maxDateVal = inputDate.attr('data-maxdate');

		if( inputDate.hasClass('hasDatepicker') === true ) inputDate.datepicker('destroy');

		setTimeout(function(){
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
				// ignoreReadonly: true,
				showButtonPanel: true,
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
						$('#ui-datepicker-div').before('<div class="ui-datepicker-dim"></div>');
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
				onSelect :function(date){
					if( typeof callbackFn == 'function' ) callbackFn(date);
				},
				onClose: function(){
					$('.ui-datepicker-dim').remove();
					bodyScrCtrl('unlock');
				},
				onChangeMonthYear:function(){
					changeYearButtons(inputDate);
					changeMonthButtons(inputDate);
				},
			});

			inputDate.datepicker('refresh');

		},100)
	})
}

$(document).on('focus', '[data-date="trigger"]', function(e) {
	e.preventDefault();
	$(this).blur();
	bodyScrCtrl('lock');
})

$(document).on('change keydown keyup', '[data-date="trigger"]', function() {
	if( $('#ui-datepicker').find('.nextYear').length == 0 ){
		setTimeout(changeYearButtons($(this)), 0)
	};
})



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
	커스텀셀렉트 초기세팅
*/
function customSelectSetting(){
	if (!$('.select_pack').length > 0) return;

	if ($('select option[selected]').length > 0){
		$('select option[selected]').closest('.select_pack').addClass('has_selected')
	}

	$('.select_pack').each(function(){/* 2022-05-06 수정 */
		var $this = $(this),
			$select = $this.find('select');

		if( $this.find('.btn_slct_trigr').length == 0 ){
			$select.attr('tabindex','-1');
			$select.before('<button type="button" class="ebbtn btn_slct_trigr" title="'+$select.attr('title')+' 선택"></button>');
		};
	});
}



/*
	커스텀셀렉트
*/
var customSelect = function(element) {

	/* Funtion Define */
	var fnName = '[data-ui="customSelect"]'
		$this = $(element).closest(fnName),
		$select = $this.find('select'),
		$trigger = $this.find('.btn_slct_trigr'),
		$stage = $('body');

	/* Class Define */
	var	onClass = 'on',
		dimClass = 'select_dim',
		optionLayerClass = 'select_layer',
		optionLayerScrollClass = 'option_scroll',
		optionLayerCloseClass = 'ebbtn btn_layer_close',
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

	// $('<div>', {
	// 	class: optionTitleClass,
	// 	text: $select.attr('title')
	// }).appendTo($optionLayer);

	var $closeBtn = $('<button>', {
		type: 'button',
		class: optionLayerCloseClass,
		title: '닫기'
	}).appendTo($optionLayer);

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
		setTimeout(function(){
			$dim.addClass(onClass);
			$optionLayer.addClass(onClass)
			$stage.css({'overflow':'hidden'})
		}, 0);
		// setTimeout(function(){
		// 	$optionLayer.attr('tabindex', 0);
		// }, 0);
		$dim.click(function(e) {
			e.stopPropagation();
			close();
		});
		$this.attr('data-status','open');
	};

	function close(){
		$optionLayer.removeClass(onClass);
		setTimeout(function(){
			$dim.removeClass(onClass);
		},200)
		setTimeout(function(){
			$dim.remove();
			$optionLayer.remove();
			$stage.css({'overflow':'auto'})
		}, 300);
		setTimeout(function(){
			$trigger.focus();
			$this.removeAttr('data-status');
		}, 350);
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

	$closeBtn.on({
		click: function(e) {
			e.stopPropagation();
			close();
		}, blur: function(e) {
			$optionLayer.addClass(onClass).attr('tabindex', 0).focus();
		}
	});

	$optionBtn.on({
		click: function(e) {
			e.stopPropagation();
			$this.addClass('has_selected');
			$select.val($(this).attr('rel'));
			close();
			// $select.trigger('change');//체인지 이벤트 발생
			// document.querySelector('#'+$select.attr('id')).dispatchEvent(new Event("change"));
			$this[0].querySelector('select').dispatchEvent(new Event("change"));
		}
	});

	/* Init */
	if ( nowStatus == 'open' ) {
		close();
	} else {
		open();
	}

}

$(document).on('keydown','.select_pack .btn_slct_trigr',function(e){/* 2022-05-06 수정 */
	if ( $(this).siblings('select').prop('disabled') ) return;
	if ( e.keyCode==13 || e.keyCode==32 ) {
		e.preventDefault();
		customSelect($(this));
	}
});

$(document).on('click','.select_pack .btn_slct_trigr',function(e){/* 2022-05-06 수정 */
	if ( $(this).siblings('select').prop('disabled') ) return;
	customSelect($(this));
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

// 토글버튼 안에 인풋 클릭
$(document).on('click','.btn_toggle .ebinput',function(e){
	e.stopPropagation();
});

// 토글버튼 안에 버튼 클릭
$(document).on('click','.btn_toggle .ebbtn',function(e){
	e.stopPropagation();
});

// 차량선택 클릭
$(document).on('click','.accordion_pack.ty_boxing .calc_data_box.ty_border',function(){
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
			$this.closest('.modal_popup').find('.popup_body').scrollTop(0);
		}
	}
}

//탭 스크롤
function tabScrPoint(element){
	if($(element).closest('.tab_scroll').length === 0) return;

	var $this = $(element),
		$scrolltab = $this.closest('.tab_scroll'),
		$nowtab = $scrolltab.children().children('.active'),
		$prevtab = $nowtab.prev();

	var _positionL = $nowtab.position().left;
	var _scrL = $scrolltab.scrollLeft();

	if ( $nowtab.index() == 0 ){
		$scrolltab.animate({scrollLeft : 0 - $prevtab.width()}, 100);
	} else {
		$scrolltab.animate({scrollLeft : _positionL + _scrL }, 100);
	}
}

//탭 스크롤 초기세팅
function tabScrSetting(){
	if($('.tab_scroll').length === 0) return;

	var $scrolltab = $('.tab_scroll');
	var $nowtab =  $scrolltab.children().children('.active');

	var _positionL = $nowtab.position().left;
	var _padding = 30;

	$scrolltab.scrollLeft(_positionL - _padding );
}

// 탭 클릭
$(document).on('click','.tab_pack .btn_tab',function(){
	tabFunc($(this));
	tabScrPoint($(this));

	if ( $(this).closest('.totalmenu_layer').length > 0 ){ //전체메뉴인 경우
		$(this).closest('.tab_pack').siblings('.tabcontent_pack').scrollTop(0);
	}
});



/*
	아코디언
*/
//아코디언 초기세팅
function accordionSetting(element){
	if (!$('.accordion_pack').length > 0) return;
	var $accordion = $(element);

	$accordion.find('[data-function="accordion"]').attr('tabindex','0'); //접근성

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
		$thistitle = $thispack.children('.accordion_title');
		$thiscontent = $thispack.children('.accordion_content');
	var _time = 300;
	var _thistitleH =  $thistitle.outerHeight();
	var _thiscontentH =  $thiscontent.outerHeight();

	if( !$thispack.hasClass('active') ){
		$thiscontent.stop().slideDown(_time);
		$thispack.addClass('active');
		if( $thispack.hasClass('ty_search')) $('.contents_area').animate({'padding-top': _thistitleH + _thiscontentH}, 300);//검색결과 아코디언인 경우
	}else{
		$thiscontent.stop().slideUp(_time);
		$thispack.removeClass('active');

		if( $thispack.hasClass('ty_search')) $('.contents_area').animate({'padding-top': _thistitleH}, 300);//검색결과 아코디언인 경우
	}
}

// 아코디언 클릭
$(document).on('click','[data-function="accordion"]',function(){
	accordionFunc($(this));
});



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
		})
		_tooltip.addClass('active');
	})
}

function tooltipFnOff() {
	$('.tooltip_msg_part').removeClass('active');
	$('.tooltip_msg_part').attr('style', "");
}

$(document).on('click', '.icon_tooltip', tooltipFnOn);
$(document).on('click', '.btn_tooltip_close', tooltipFnOff);

// 툴팁이외 영역 클릭시 삭제버튼 숨김
$(document).on('click', function(e){
	if(!$(e.target).hasClass('tooltip_msg_pack') && !$(e.target).hasClass('icon_tooltip') ) {
		tooltipFnOff()
	}
});



/*
	도넛차트
*/
var semiDonut = function(element) {
	/* 변수정의 */
	var $this = $(''+element+''),
		$value = $this.find('.chart_value .num'),
		$chart = $this.find('.chart_dount.chart circle'),
		$dot = $this.find('.chart_dount.dot');

	var original = parseInt($value.text()),
		maxValue = parseInt($this.attr('data-maxValue')),
		maxDashoffset = parseInt($this.attr('data-maxDasharray')),
		maxRotate = parseInt($this.attr('data-maxRotate')),
		percent = Math.floor((original/maxValue*100)),
		duration = percent * 10;

	/* 초기화 */
	$chart.removeAttr('style');
	$dot.removeAttr('style');

	/* 최대값넘어갈때 차트 처리 */
	if ( original > maxValue ) var percent = 100;

	/* 차트 */
	$({rate:0}).animate(
		{
			rate: percent
		},{
			duration: duration,
			progress:function(){
				var now = this.rate,
					amount = Math.floor(maxDashoffset-(maxDashoffset*now/100)),
					angle = Math.floor(maxRotate * now / 100);
				$chart.css({'stroke-dashoffset':''+amount+''});
				$dot.css({'transform':'rotate('+angle+'deg)'});
			}
		}
	);

	/* 숫자 */
	$({rate:0}).animate(
		{
			rate: original
		},{
			duration: duration,
			progress:function(){
				var now = this.rate;
				$value.text(Math.floor(now));
			}
		}
	);
}



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
	팝업 초기세팅
*/
function popupSetting(element){
	$(element).find('.popup_layout').each(function(){
		var $this = $(this),
			$title = $this.find('.popup_body .ebtitle2').text(),
			$titleh2 = $this.find('.popup_body h2').text();

		if ( $this.find('.popup_body .ebtitle2').length == 0) return;

		if ($this.find('.popup_header .ebtitle2').length == 0 && $this.find('.popup_body .icon_box').length == 0 && $this.find('.popup_header .ebtitle3').length == 0){
			if ( $this.find('.popup_body h2').length == 0 ){
				$this.find('.popup_header').prepend('<h2 class="ebtitle2">'+$title+'</h2>');
			} else {
				$this.find('.popup_header').prepend('<h2 class="ebtitle2">'+$titleh2+'</h2>');
			}
		}
	})

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

			if ( !$this.hasClass('ty_popupfull')){ //풀팝업이 아닌 경우
				//팝업 딤처리
				if( $this.find('.popup_dim').length == 0 ) $this.append('<div class="popup_dim"></div>');
				setTimeout(function(){
					$this.find('.popup_dim').addClass('show');
					$this.find('.' + o.layout).addClass(_activelayout);
				},100)
			} else { //풀팝업인 경우
				popupSetting($this);//팝업 타이틀 스크롤
				$this.find('.' + o.layout).addClass(_activelayout);
			}

			$this.addClass('show');
			bodyScrCtrl('lock');

			// 슬라이드팝업인 경우
			if ( !$this.hasClass('ty_popupfull') && !$this.hasClass('ty_alert') ){
				$this.find('.' + o.layout).css({'bottom': -$this.find('.' + o.layout).outerHeight() });
				$this.find('.' + o.layout).stop().animate({'bottom': 0}, 300);
			}
		},
		close: function(){
			// 슬라이드팝업인 경우
			if ( !$this.hasClass('ty_popupfull') && !$this.hasClass('ty_alert') ){
				$this.find('.' + o.layout).stop().animate({'bottom': -$this.find('.' + o.layout).outerHeight()}, 300, function(){
					$this.removeClass('show');
					$this.find('.' + o.layout).removeClass(_activelayout);

					if( $('.' + _activelayout).length === 0 ) { // 열린팝업이 없으면 바디스크롤 해제
						bodyScrCtrl('unlock');
					}
				});

				//팝업 딤처리
				setTimeout(function(){
					$this.find('.popup_dim').removeClass('show');
				},200)
				setTimeout(function(){
					$this.find('.popup_dim').remove();
				},300)
			} else { // 슬라이드팝업이 아닌 경우
				if ( $this.hasClass('ty_alert') ){
					//팝업 딤처리
					$this.find('.popup_dim').removeClass('show');
					setTimeout(function(){
						$this.find('.popup_dim').remove();
					},100)

					setTimeout(function(){
						$this.removeClass('show');
					},300)
				} else {
					$this.removeClass('show');
				}

				$this.find('.' + o.layout).removeClass(_activelayout);

				if( $('.' + _activelayout).length === 0 ) { // 열린팝업이 없으면 바디스크롤 해제
					bodyScrCtrl('unlock');
				}
			}
		},
		closeAll: function(){
			if ( !$this.hasClass('ty_popupfull') ){
				//팝업 딤처리
				$('.popup_dim').removeClass('show');
				setTimeout(function(){
					$('.popup_dim').remove();
				},100)
			}

			$('.'+_activelayout).parent().removeClass('show');
			$('.'+_activelayout).removeClass(_activelayout);
			bodyScrCtrl('unlock');
		},
		remove: function(){
			// 슬라이드팝업인 경우
			if ( !$this.hasClass('ty_popupfull') && !$this.hasClass('ty_alert') ){
				$this.find('.' + o.layout).stop().animate({'bottom': -$this.find('.' + o.layout).outerHeight()}, 300, function(){
					$this.removeClass('show');
					$this.find('.' + o.layout).removeClass(_activelayout);
					if( $('.' + _activelayout).length === 0 ) { // 열린팝업이 없으면 바디스크롤 해제
						bodyScrCtrl('unlock');
					}

				});
				//팝업 딤처리
				setTimeout(function(){
					$this.find('.popup_dim').removeClass('show');
				},200)
				setTimeout(function(){
					$this.find('.popup_dim').remove();
				},300)
				setTimeout(function(){
					$this.remove();
				},600)
			} else { // 슬라이드팝업이 아닌 경우
				if ( !$this.hasClass('ty_popupfull') ){
					//팝업 딤처리
					$this.find('.popup_dim').removeClass('show');
					setTimeout(function(){
						$this.find('.popup_dim').remove();
					},100)
					setTimeout(function(){
						$this.remove();
					},300)
				} else {
					$this.remove();
				}

				$this.find('.' + o.layout).removeClass(_activelayout);
				if( $('.' + _activelayout).length === 0 ) { // 열린팝업이 없으면 바디스크롤 해제
					bodyScrCtrl('unlock');
				}
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
$(document).on('click','.modal_popup [data-action]',function(){
	var $modal = $(this).closest('.active_layout').parent();
	var _thisid = $(this).closest('.active_layout').parent().attr('id');
	var _action = $(this).attr('data-action');

	if ( _action == 'close' ) popupFunc('#' +_thisid).close();
	if ( _action == 'close_all' ) popupFunc('#' +_thisid).closeAll();
	if ( _action == 'remove' )  popupFunc('#' +_thisid).remove();
	if ( _action == 'remove_all' ) popupFunc('#' +_thisid).removeAll();
});



/*
	마케팅팝업(z-index 작업필요할수있음)
*/
function marketingPopupFunc(id, options){
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
		if ( $this.hasClass('marketing_popup') ){
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
			$this.append('<div class="popup_dim"></div>');
			setTimeout(function(){
				$this.find('.popup_dim').addClass('show');
				$this.find('.' + o.layout).addClass(_activelayout);
			},100)

			$this.addClass('show');
			bodyScrCtrl('lock');

			// 슬라이드팝업인 경우
			if ( !$this.hasClass('ty_alert') ){
				$this.find('.' + o.layout).css({'bottom': -$this.find('.' + o.layout).outerHeight() });
				$this.find('.' + o.layout).stop().animate({'bottom': 0}, 300);
			}
		},
		close: function(){
			// 슬라이드팝업인 경우
			if ( !$this.hasClass('ty_alert') ){
				$this.find('.' + o.layout).stop().animate({'bottom': -$this.find('.' + o.layout).outerHeight()}, 300, function(){
					$this.removeClass('show');
					$this.find('.' + o.layout).removeClass(_activelayout);

					if( $('.' + _activelayout).length === 0 ) { // 열린팝업이 없으면 바디스크롤 해제
						bodyScrCtrl('unlock');
					}
				});

				//팝업 딤처리
				setTimeout(function(){
					$this.find('.popup_dim').removeClass('show');
				},200)
				setTimeout(function(){
					$this.find('.popup_dim').remove();
				},300)
			} else { // 슬라이드팝업이 아닌 경우
				//팝업 딤처리
				$this.find('.popup_dim').removeClass('show');
				setTimeout(function(){
					$this.find('.popup_dim').remove();
				},100)

				$this.find('.' + o.layout).removeClass(_activelayout);
				setTimeout(function(){
					$this.removeClass('show');
				},300)

				if( $('.' + _activelayout).length === 0 ) { // 열린팝업이 없으면 바디스크롤 해제
					bodyScrCtrl('unlock');
				}
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
			// 슬라이드팝업인 경우
			if ( !$this.hasClass('ty_alert') ){
				$this.find('.' + o.layout).stop().animate({'bottom': -$this.find('.' + o.layout).outerHeight()}, 300, function(){
					$this.removeClass('show');
					$this.find('.' + o.layout).removeClass(_activelayout);
					if( $('.' + _activelayout).length === 0 ) { // 열린팝업이 없으면 바디스크롤 해제
						bodyScrCtrl('unlock');
					}
				});

				//팝업 딤처리
				setTimeout(function(){
					$this.find('.popup_dim').removeClass('show');
				},200)
				setTimeout(function(){
					$this.find('.popup_dim').remove();
				},300)

				setTimeout(function(){
					$this.remove();
				},600)
			} else { // 슬라이드팝업이 아닌 경우
				//팝업 딤처리
				$this.find('.popup_dim').removeClass('show');
				setTimeout(function(){
					$this.find('.popup_dim').remove();
				},100)

				$this.find('.' + o.layout).removeClass(_activelayout);
				setTimeout(function(){
					$this.remove();
				},300)
				if( $('.' + _activelayout).length === 0 ) { // 열린팝업이 없으면 바디스크롤 해제
					bodyScrCtrl('unlock');
				}
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

//마케팅팝업 닫기버튼
$(document).on('click','.marketing_popup [data-action]',function(){
	var $modal = $(this).closest('.active_layout').parent();
	var _thisid = $(this).closest('.active_layout').parent().attr('id');
	var _action = $(this).attr('data-action');

	if ( _action == 'close' ) marketingPopupFunc('#' +_thisid).close();
	if ( _action == 'close_all' ) marketingPopupFunc('#' +_thisid).closeAll();
	if ( _action == 'remove' )  marketingPopupFunc('#' +_thisid).remove();
	if ( _action == 'remove_all' ) marketingPopupFunc('#' +_thisid).removeAll();
});



/*
	레이어팝업
*/
function ui_layerpopupShow(id){
	var $popup = $(id);
	$popup.addClass('show');
	bodyScrCtrl('lock');
}

function ui_layerpopupHide(id){
	var $popup = $(id);
	$popup.removeClass('show');
	bodyScrCtrl('unlock');
}



/*
	레이어팝업 옵션 선택
*/
function optionSelectFunc(element){
	var $this = $(element),
		$thisli = $this.parent('li');

	//옵션활성화
	$thisli.addClass('active').siblings('li').removeClass('active');
}

// 옵션 클릭
$(document).on('click','.modal_popup.ty_popuplayer .option_list .btn_option',function(){
	optionSelectFunc($(this));
});



/*
	전체메뉴
*/
function totalmenuSize(){
	var $this = $('.totalmenu_layer');

	if (!$('.totalmenu_layer').length > 0) return;

	var _topH = $this.find('.top_area').outerHeight();

	$this.find('.totalmenu_area').css('max-height', $this.outerHeight() - _topH);
}

// 전체메뉴 열기
function totalmenuOpen(){
	if ( !$('.totalmenu_layer').length > 0 ) return;

	bodyScrCtrl('lock');
	$('.totalmenu_layer').addClass('show');
	$('.totalmenu_layer').find('.tab_pack').scrollTop(0);
	$('.totalmenu_layer').find('.tabcontent_pack').scrollTop(0);
	totalmenuSize();
}
$(document).on('click','.btn_header_menu', totalmenuOpen);

// 전체메뉴 닫기
function totalmenuClose(){
	bodyScrCtrl('unlock');
	$('.totalmenu_layer').removeClass('show');

	$('.totalmenu_area .tab_pack li').removeClass('active');
	$('.totalmenu_area .tab_pack li').first().addClass('active');
	$('.totalmenu_area .tabcontent_pack li').removeClass('active');
	$('.totalmenu_area .tabcontent_pack li').first().addClass('active');
}
$(document).on('click','.btn_totalmenu_close', totalmenuClose);



/*
	상품소개 버튼영역
*/
function introPageFn(){
	var $fixedpart = $('.intro_fixed_part');
	var $btnbox = $('.intro_btn_box');

	if($btnbox.length > 0) {
		$(window).on('scroll',function(){
			var _windowT = $(window).scrollTop();
			var _showpoint = $btnbox.offset().top + $btnbox.height();
			var _btnboxH = $btnbox.outerHeight();

			if ( _windowT > _showpoint ){
				$fixedpart.addClass('show');
				$fixedpart.height(_btnboxH);
			} else {
				$fixedpart.removeClass('show');
				$fixedpart.height('');
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
	var $loanCase = $('.loan_part ~ .tabcontent_pack .intro_part .intro_main > .cont_box');

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
	서류미리보기 스와이퍼
*/
var documentSlider = [];
var documentswiper;

function documentSwiper(index) {

	for (var i=0; i<documentSlider.length; i++) {
		documentSlider[i].destroy();
	}

	documentSlider = [];

	var $documentContainers = $('.docu_detail_slider .swiper-container');
	var _documentSlides = $documentContainers.find('.swiper-slide').length;
	var _initialindex = index;

	$documentContainers.each(function () {

		var $container = $(this);

		documentswiper = new Swiper($container, {
			speed: 400,
			slidesPerView: "auto",
			spaceBetween: 10,
			initialSlide: _initialindex,
			centeredSlides: true,
			navigation: {
				nextEl: ".swiper-button-next",
				prevEl: ".swiper-button-prev",
			  },
			pagination: {
				el: ".swiper-pagination",
				type: 'fraction',
			},
			on: {
				init: function () {
					if ( this.activeIndex == 0 ) {
						$('.swiper_button_first').attr('disabled', true);
					}
				},
			},
		});

		documentSlider.push(documentswiper);

		documentswiper.on('slideChange', function () {
			if ( this.activeIndex == 0 ) {
				$('.swiper_button_first').attr('disabled', true);
			} else {
				$('.swiper_button_first').attr('disabled', false);
			}

			if ( this.activeIndex == _documentSlides-1 ) {
				$('.swiper_button_last').attr('disabled', true);
			} else {
				$('.swiper_button_last').attr('disabled', false);
			}
		});

		$(document).on('click', '.swiper_button_first', function(){
			documentswiper.slideTo(0);
		});
		$(document).on('click', '.swiper_button_last', function(){
			documentswiper.slideTo(_documentSlides);
		});
	});
}

// 서류미리보기 슬라이드이동 외부제어펑션
function documentSlideChange(index){
	documentswiper.slideTo(index);
}



/*
	온보딩 스와이퍼
*/
var onboardingSlider = [];
var onboardingswiper;

function onboardingSwiper() {

	for (var i=0; i<onboardingSlider.length; i++) {
		onboardingSlider[i].destroy();
	}

	onboardingSlider = [];

	var $onboardingContainers = $('.onboarding_slider .swiper-container');

	$onboardingContainers.each(function () {

		var $container = $(this);

		onboardingswiper = new Swiper($container, {
			speed: 400,
			slidesPerView: 1,
			scrollbar: {
				el: ".swiper-scrollbar",
			},
			pagination: {
				el: ".swiper-pagination",
				type: "fraction",
			},
			on:{
				slideChange: function(){
					$('.onboarding_slider .swiper-slide').eq(this.activeIndex).addClass('ani');

					if ( this.activeIndex ==  this.slides.length-1 ){
						$('.onboarding_start').addClass('show');
						$('.onboarding_skip').fadeOut(200);
					} else {
						$('.onboarding_start').removeClass('show');
						$('.onboarding_skip').fadeIn(200);
					}

				},
			},
		});

		onboardingSlider.push(onboardingswiper);
	});
}



/*
	메인 미가입 스와이퍼
*/
var mainprdnosignSlider = [];
var mainprdnosignswiper;

function mainprdnosignSwiper() {

	for (var i=0; i<mainprdnosignSlider.length; i++) {
		mainprdnosignSlider[i].destroy();
	}

	mainprdnosignSlider = [];

	var $mainprdnosignContainers = $('.main_nosignprd_slider .swiper-container');

	$mainprdnosignContainers.each(function () {

		var $container = $(this);

		mainprdnosignswiper = new Swiper($container, {
			speed: 400,
			slidesPerView: "auto",
			spaceBetween: 25,
			scrollbar: {
				el: ".swiper-scrollbar",
			},
			pagination: {
				el: ".swiper-pagination",
				type: "fraction",
			},
			on:{
				slideChangeTransitionStart:function(){
					if( mainprdnosignswiper.activeIndex > 0 ) $('.main_product_part .product_box').addClass('push');
				},
				reachBeginning:function(){
					$('.main_product_part .product_box').removeClass('push');
				},
				reachEnd:function(){
					$('.main_product_part .product_box').removeClass('push');
				}
			}
		});

		mainprdnosignSlider.push(mainprdnosignswiper);
	});
}



/*
	메인 가입 스와이퍼
*/
var mainprdsignSlider = [];
var mainprdsignswiper;

function mainprdsignSwiper() {

	for (var i=0; i<mainprdsignSlider.length; i++) {
		mainprdsignSlider[i].destroy();
	}

	mainprdsignSlider = [];

	var $mainprdsignContainers = $('.main_signprd_slider .swiper-container');

	$mainprdsignContainers.each(function () {

		var $container = $(this);

		mainprdsignswiper = new Swiper($container, {
			speed: 400,
			slidesPerView: 1,
			scrollbar: {
				el: ".swiper-scrollbar",
			},
			pagination: {
				el: ".swiper-pagination",
				type: "fraction",
			}
		});

		mainprdsignSlider.push(mainprdsignswiper);
	});
}



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
			}
		});

		maineventSlider.push(maineventswiper);
	});
}



/*
	메인 공지사항 스와이퍼
*/
var mainboardSlider = [];
var mainboardswiper;

function mainboardSwiper() {

	for (var i=0; i<mainboardSlider.length; i++) {
		mainboardSlider[i].destroy();
	}

	mainboardSlider = [];

	var $mainboardContainers = $('.main_board_slider .swiper-container');

	$mainboardContainers.each(function () {

		var $container = $(this);

		mainboardswiper = new Swiper($container, {
			speed: 400,
			slidesPerView: "auto",
			spaceBetween: 15,
		});

		mainboardSlider.push(mainboardswiper);
	});
}



/*
	메인 서비스 스와이퍼
*/
var mainserviceSlider = [];
var mainserviceswiper;

function mainserviceSwiper() {

	for (var i=0; i<mainserviceSlider.length; i++) {
		mainserviceSlider[i].destroy();
	}

	mainserviceSlider = [];

	var $mainserviceContainers = $('.main_service_slider .swiper-container');

	$mainserviceContainers.each(function () {

		var $container = $(this);

		mainserviceswiper = new Swiper($container, {
			speed: 400,
			slidesPerView: "auto",
			spaceBetween: 20,
		});

		mainserviceSlider.push(mainserviceswiper);
	});
}



/*
	마케팅팝업 스와이퍼
*/
var marketingSlider = [];
var marketingswiper;

function marketingSwiper() {

	for (var i=0; i<marketingSlider.length; i++) {
		marketingSlider[i].destroy();
	}

	marketingSlider = [];

	var $marketingContainers = $('.marketing_slider .swiper-container');

	$marketingContainers.each(function () {

		var $container = $(this);

		marketingswiper = new Swiper($container, {
			speed: 400,
			slidesPerView: 1,
			autoHeight: true,
			pagination: {
				el: ".swiper-pagination",
			}
		});

		marketingSlider.push(marketingswiper);
	});
}



/*
	올원뱅크 배너 스와이퍼
*/
var alloneBankSlider = [];
var alloneBankswiper;

function alloneSwiper() {

	for (var i=0; i<alloneBankSlider.length; i++) {
		alloneBankSlider[i].destroy();
	}

	alloneBankSlider = [];

	var $allonebankContainers = $('.allonebk_slider .swiper-container');

	$allonebankContainers.each(function () {

		var $container = $(this);

		alloneBankswiper = new Swiper($container, {
			speed: 400,
			pagination: {
				el: ".swiper-pagination",
				type: "bullets"
			},
			slidesPerView: "auto",
			spaceBetween: 30,
		});

		alloneBankSlider.push(alloneBankswiper);
	});
}

/*
	메인 배너 스와이퍼 슬라이드 2022-11-23 추가
*/
var mainbannerSlider = [];
var mainbannerswiper;

function mainbannerSwiper() {

	for (var i=0; i<mainbannerSlider.length; i++) {
		mainbannerSlider[i].destroy();
	}

	mainbannerSlider = [];

	var $mainbannerContainers = $('.main_event_part.banner .main_event_slider .swiper-container');

	$mainbannerContainers.each(function () {

		var $container = $(this);

		mainbannerswiper = new Swiper($container, {
			speed: 400,
			slidesPerView: 1,
			pagination: {
				el: ".swiper-pagination",
			},
			autoplay: {     //자동슬라이드 (false-비활성화)
			  delay: 3000, // 시간 설정
			  disableOnInteraction: false, // false-스와이프 후 자동 재생
			}
		});

		mainbannerSlider.push(mainbannerswiper);
	});
}




















































