/* 2024고도화 전용 js */
$(window).on('load',function(){
    accoNewInit();//아코디언 뉴타입
    toogleBtnIput(); //이메일 input show/hide(발급방법선택)
});

$(function(){
    // 2024-08-09 2024고도화 : 메인 배경색 설정
    if($('.main_section').length > 0){
        $('.container').css('background-color', '#F4F5F9');
    }

    // 2024-08-28 2024고도화 : 전체 메뉴 depth4
    $('.totalmenu_layer .menuname.has_menu').each(function(){
        var $this = $(this);
        var $depth4 = $(this).siblings('.depth4');

        $this.attr('aria-expanded', false);        
        $this.on('click', function(){
            $this.toggleClass('on');
            if($this.hasClass('on')){
                $this.attr('aria-expanded', true);
                $depth4.slideDown(300);
            }else{
                $this.attr('aria-expanded', false);
                $depth4.slideUp(300);
            }
        });
    });    

});

function accoNewInit(){
    if (!$('.acco_box').length > 0) return;
    
    $('.acco_box').find('.acco_cont').hide();
    $('.acco_box.active').find('.acco_cont').show();

    $('.btn_acco').on('click',function(){
        if($(this).closest('.acco_box').hasClass('active')){
            $(this).attr('aria-expanded', false);	
            $(this).closest('.acco_box').removeClass('active');
            $(this).closest('.acco_box').find('.acco_cont').slideUp(300);
            $(this).find('.txt').text('더보기');
        }else{
            $(this).attr('aria-expanded', true);
            $(this).closest('.acco_box').addClass('active');
            $(this).closest('.acco_box').find('.acco_cont').slideDown(300);
            $(this).find('.txt').text('닫기');
        }
    });

}

//email input show/hide
function toogleBtnIput(){
	$('.btn_toggle').each(function(){
		$(this).on('click',function(){
			var txt = $(this).text();
			if(txt == '이메일'){
				$(this).closest('.toggle_pack').next('.email_input').show();
			}else{
				$(this).closest('.toggle_pack').next('.email_input').hide();
			}
			
		})
	})
}

// 메인 swiper - 보유 상품
function myProductsSwiper(){
    var slideLength = $('.section_content.my_product .swiper-slide').length;
    var myProductSwiperNew = new Swiper('.section_content.my_product .swiper-container', {
        speed: 400,
        slidesPerView: 1,
        pagination: {
            clickable: true,
            el: ".swiper-pagination",
        },
        autoplay: false,
        loop: slideLength > 1,// watchOverflow와 동시 사용X
        watchOverflow: true,// 슬라이드가 1개 일 때 pager, button 숨김
        on:{
            init: function(){
                var elParent = $(this.el).parent();
                setSwiperPropA11y(elParent, slideLength);
            },
            slideChange: function(){
                var elParent = $(this.el).parent();
                setSwiperPropA11y(elParent, slideLength);
                $(elParent).find('.swiper-slide').eq(this.activeIndex).attr({'tabindex' : 0, 'aria-hidden' : false});
            }
        } 
    });   
}

// 메인 swiper - 이벤트 배너
function mainEventerBannersSwiper(){
    var slideLength = $('.main_event_banners .swiper-slide').length;
    var maineventSwiperNew = new Swiper('.main_event_banners .swiper-container', {
        speed: 400,
        slidesPerView: 1,
        pagination: {
            clickable: true,
            el: ".swiper-pagination",
        },
        autoplay: {
            delay: 3000,
        },
        watchOverflow: true, //A11Y 2024 슬라이드가 1개 일 때 pager, button 숨김 여부 설정
        on:{
            init: function(){
                var elParent = $(this.el).parent();
                setSwiperPropA11y(elParent, slideLength);
            },
            slideChange: function(){
                var elParent = $(this.el).parent();
                setSwiperPropA11y(elParent, slideLength);
                $(elParent).find('.swiper-slide').eq(this.activeIndex).attr({'tabindex' : 0, 'aria-hidden' : false});
            },
        }        
    });

    $('.swiper-toggle-button').on('click', function(){
        $(this).toggleClass('on');
        if($(this).hasClass('on')){
            maineventSwiperNew.autoplay.stop();
            $(this).attr('aria-label', '재생');
        }else{
            maineventSwiperNew.autoplay.start();
            $(this).attr('aria-label', '정지');
        }
    });
}

// swiper 접근성 속성 설정
function setSwiperPropA11y(target, num){
    $(target).find('.swiper-pagination').attr('role', 'tablist');

    setTimeout(function(){
        $(target).find('.swiper-slide').attr({'tabindex' : -1, 'aria-hidden' : true});
        $(target).find('.swiper-slide-active').attr({'tabindex' : 0, 'aria-hidden' : false});
        // var slidesLength = $(target).find('.swiper-slide').length;					
        $(target).find('.swiper-pagination-bullet').each(function(index){
            slideIdx = index + 1;
            $(this).attr({'aria-label' : '총 ' +  num + '장의 슬라이드 중 ' + slideIdx + '번 째 슬라이드'});
        });
        $(target).find('.swiper-pagination-bullet').attr({'role' : 'tab', 'aria-selected' : false});
        $(target).find('.swiper-pagination-bullet-active').attr('aria-selected', 'true');	
    }, 300);
}

// 상품소개 - 키패드 체크
function keypadChk(){
	var originalSize = $(window).outerWidth() + $(window).outerHeight();
	var wh = $(window).outerHeight();
	var bsh = $('.dragging_bs').outerHeight();
	var hh = $('.header').outerHeight();
	var bsMaxH = wh - hh;

	$(window).resize(function() {
		if($(window).outerWidth() + $(window).outerHeight() != originalSize) {
			// 키보드가 올라온 경우
			var re_bsh = $('.dragging_bs').height();
			var re_wh = $(window).outerHeight();
			var re_bsMaxH = re_wh - hh;

			if(re_bsh > re_wh){
				$('.dragging_bs').height(re_bsh - (wh - re_wh));
			}
		}else {
			// 키보드가 다시 내려간 경우
			$('.dragging_bs').height(bsMaxH);
		}
	
	});
}
// 상품소개 -  draggable 바텀시트
function dargBottomSheet(){
	var $bs = $('.dragging_bs');
	var $handle = $('.drag_handle');
	var wh = $(window).height();        
	var hh = $('.header').outerHeight();
	var conh = $('.desc_area').outerHeight() - 48;
	var bsh = wh - (hh + conh) + 48;
	var bsMaxH = wh - hh;
	var touchStart;
	var touchLast;

	// init
	$bs.height(bsh);
	$('.container.renewal_2024').css('height','100%')

	// 초기 터치
	$handle.on('touchstart', function(e){
		touchStart = e.touches[0].pageY;
		touchLast = 0;// touchmove시 저장된 값 초기화
	});

	//핸들을 터치한 경우 => 바텀시트 up
	$handle.on('touchmove', function(e){
		touchLast = e.touches[0].pageY;            
		var gap = touchLast - touchStart;
		var bsIngH = bsh + (-gap);          

		if($bs.hasClass('active')) return;// 바텀시트 펼침 상태시 패스
		if(gap < 0 && bsIngH < bsMaxH){// gap이 마이너스 값임 && 드래그시 bsMaxH까지 높이 적용
			$bs.height(bsIngH);
		}
		$('body').css('overflow', 'hidden');
		$('body').addClass('bg_blue');
	});

	$handle.on('touchend', function(e){
		if((touchStart - touchLast) > 0 && touchLast != 0){// up
			$bs.animate({
				'height' : bsMaxH
			}, 200, "swing");

			$('.dragging_bs').addClass('active');
			$('.intro_fixed_part').addClass('show');
		}else if((touchStart - touchLast) < 0 && touchLast != 0){// down
			$bs.animate({
				'height' : bsh
			}, 300, "swing");

			$('.dragging_bs').removeClass('active');
			$('.intro_fixed_part').removeClass('show');
		}       
	});

	$bs.find('.accordion_title').on('click', function(){
		var $this = $(this);
		var $thisWrap = $this.closest('.accordion_pack');
		
		if($thisWrap.hasClass('active') == false){
			$bs.animate({
			'height' : bsMaxH
			}, 200, "swing");

			$('.dragging_bs').addClass('active');
			$('.intro_fixed_part').addClass('show');

			$('body').css('overflow', 'hidden');
			$('body').addClass('bg_blue');
		}
	})
}








/////////////////// [임시]중간보고용 스크립트 => PC용 ///////////////////
// 상품소개 -  draggable 바텀시트
function dargBottomSheetPC(){
	var $bs = $('.dragging_bs');
	var $handle = $('.drag_handle');
	var wh = $(window).height();        
	var hh = $('.header').outerHeight();
	var conh = $('.desc_area').outerHeight() - 48;
	var bsh = wh - (hh + conh) + 48;
	var bsMaxH = wh - hh;

	// init
	$bs.height(bsh);
	$('.container.renewal_2024').css('height','100%')

	$handle.on('click', function(e){
		var bsIngH = bsh;          

        $bs.height(bsIngH);// 바텀시트 초기 높이 설정

        if($('.dragging_bs').hasClass('active')){
            //펼침 상태
            console.log('bsh??', bsh)
            $bs.animate({
				'height' : bsh
			}, 300, "swing");

			$('.dragging_bs').removeClass('active');
			$('.intro_fixed_part').removeClass('show');
        }else{
            // 닫힘 상태
            console.log('bsMaxH??', bsMaxH)
            $bs.animate({
				'height' : bsMaxH
			}, 200, "swing");

			$('.dragging_bs').addClass('active');
			$('.intro_fixed_part').addClass('show');
        }

		$('body').css('overflow', 'hidden');
		$('body').addClass('bg_blue');
	});

	$bs.find('.accordion_title').on('click', function(){
		var $this = $(this);
		var $thisWrap = $this.closest('.accordion_pack');
		
		if($thisWrap.hasClass('active') == false){
			$bs.animate({
			'height' : bsMaxH
			}, 200, "swing");

			$('.dragging_bs').addClass('active');
			$('.intro_fixed_part').addClass('show');

			$('body').css('overflow', 'hidden');
			$('body').addClass('bg_blue');
		}
	})
}


$(function(){
    // 메인 > 토스트 닫기
    $('.btn_banner_close').on('click', function(){
        $(this).closest('.banner_layer').remove();
    });

    // 메인 > 진행상태 닫기
    $('.btn_status_close').on('click', function(){
        $(this).closest('.status_toast').remove();
    });

    // 간편홈
    var simpleToggle = $('.header_area').find('.switch_pack input[type="checkbox"]');
    
    simpleToggle.on('change', function(){
        if(simpleToggle.is(':checked')){
            console.log('1')
            location.href="../../../html/page/NHCM/MANHCM00000000_간편홈.html"
        }else{
            console.log('2') 
            location.href="../../../html/page/NHCM/MANHCM00000000_원장보유.html"
        }
    });    

    // console.log('simpleToggle : ', simpleToggle.is(':checked'))
});