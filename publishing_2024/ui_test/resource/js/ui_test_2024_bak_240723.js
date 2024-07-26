$(function(){
    /*** 메인 상품 목록 스크롤 ***/
    $(document).on('click', '.prod_nav_link', function(e){
        var $target = $($(this).attr('href'));

        $('html').animate({
            scrollTop: $target.offset().top - ($('#headerLay').height() + $('.prod_nav_list').height() + 20)
        },600);
        e.preventDefault();        
    });

    // var lastScroll = 0;
    $(document).on('scroll', function(){
        var nowScroll = $(window).scrollTop();

        $('.products_unit').each(function(){
            var targetTop = $(this).offset().top;

            if((targetTop - nowScroll) < 100){
                $('.prod_nav_list').find('.prod_nav_link').removeClass('active');
                $('.prod_nav_list').find('[href="#' + $(this).attr('id') + '"').addClass('active');
            }
        });

        // if((nowScroll > lastScroll)){
        //     console.log('아래로')
        //     $('.prod_nav_list').css('display', 'flex');
        // }else{
        //     console.log('위로')
        //     $('.prod_nav_list').css('display', 'none');
        // }
        
        scrollTopCheck();

        // lastScroll = nowScroll;
    });

    // nav 고정
    function scrollTopCheck(){
        var $nav = $('.prod_nav_list');// .prod_nav_list가 존재하는 곳에서만 실행
        if($nav.length > 0){            
            var navTop = $nav.offset().top;
            var scrollTop = $(window).scrollTop();

            if(navTop - scrollTop < 55){
                $nav.addClass('active');            
            }else if(scrollTop < 40){
                $nav.removeClass('active');
            }
        }        
    }
    scrollTopCheck();//init



    /*********************
        글로벌 nav     
    **********************/
    //gnb 세로영역 계산
    var winH = $(window).height();
    $('.gnb_wrap').css('height', winH - $('.top_area').outerHeight());

    // 메뉴 스크롤
    $('.gnb_total').on('scroll', function(){
        $('.gnb_item_title').each(function(){
            var targetTop = $(this).offset().top;

            if(targetTop < 113){
                $('.new_gnb_link').removeClass('active');
                $('.gnb_items').find('[href="#' + $(this).attr('id') + '"]').addClass('active');
                $('.gnb_item_title').removeClass('active');
                $(this).addClass('active');             
            }
        });
    });

    // gnb 대메뉴 클릭시
    $(document).on('click', '.new_gnb_link', function(e){
        var $target = $($(this).attr('href'));
        // var top = $target.parent().offset().top;
        var top2 = $target.parent().position().top;// div 내부 스크롤이라 상대적인 절대값이 필요. offset().top은 헤더영역만틈 계속 바뀜
        
        e.preventDefault();
        $('.gnb_total').scrollTop(top2);

    });



    /*********************
        드래깅 바텀시트     
    **********************/    
        var wH = $(window).height();
        // var hH = $('.header').outerHeight();
        // var upH = $('.desc-area').outerHeight();
        // var bsH = wH - (hH + upH);
    
        // console.log('화면 높이 : ', wH);
        // console.log('헤더 높이 : ', hH);
        // console.log('상단 높이 : ', upH);
        // console.log('바텀 높이 : ', wH - (hH + upH));
    
        // $('.dragging-bs').height(bsH);
    
        var bottomSheet = $('.dragging-bs');
        var bottomSheetH = $('.dragging-bs').outerHeight();
        var bottomSheetH2 = $('.dragging-bs.active').outerHeight();
        var draghandle = $('.drag-handle');
        // var bottomTouchStart = 0;
        // var bottomScrollStart;
        var lastTouch;
        var bsMaxH = wH - ($('#headerLay').outerHeight() + 50);

        console.log('초기 바텀시트 높이 : ', bottomSheetH2)
    
        // 초기 터치
        draghandle.on('touchstart', function(e){
            bottom_touch_start = e.touches[0].pageY;
            // console.log('초기터치 : ', bottom_touch_start)
    
            lastTouch = 0;
        });

        //핸들을 터치한 경우 => 바텀시트 up
        draghandle.on('touchmove', function(e){
            lastTouch = e.touches[0].pageY;
            console.log('마지막터치 : ', lastTouch);

            var gap = lastTouch - bottom_touch_start;
            var bsIngH = bottomSheetH + (-gap);
            

            if(bottomSheet.hasClass('active')) return;
            if(gap < 0 && bsIngH < bottomSheetH2){//gap이 마이너스 값임. 두번째 조건은 active 높이값만큼으로 변경 필요
                bottomSheet.height(bsIngH);
            }
            // 다 올라갔을 땐 몬가 구분자를 추가하여 높이값 변경 막기
            // 뭘로 구분하지..??
            // 지정 높이만큼 올라가면 터치 함수를 off 해주야해. 그럼 닫는 건 어째...?
            // 만약 지정 높이만큼 올라가면 lastTouch 업데이트 막기
            // 또는 바텀시트 높이값 대입 막기
        });
    
        draghandle.on('touchend', function(e){
            if((bottom_touch_start - lastTouch) > 0 && lastTouch != 0){// up
                // console.log('열림 : ', bottom_touch_start - lastTouch);
                // console.log('초기 : ' + bottom_touch_start + ' 마지막 : ' + lastTouch);
    
                bottomSheet.animate({
                    'height' : 500
                }, 200, "swing");

                $('.dragging-bs').addClass('active');

            }else if((bottom_touch_start - lastTouch) < 0 && lastTouch != 0){// down
                // console.log('접힘 : ', bottom_touch_start - lastTouch);
                // console.log('초기 : ' + bottom_touch_start + ' 마지막 : ' + lastTouch);
    
                bottomSheet.animate({
                    'height' : 150
                }, 300, "swing");

                $('.dragging-bs').removeClass('active');
            }   
    
        });

        // 드래그 테스트
        // $('body').on("touchstart", function (e) {
        // 	console.log('touchstart : ',  e.touches[0].pageY)
        // })

        // $('body').on("touchmove", function (e) {
        // 	console.log('touchmove : ',  e.touches[0].pageY)
        // })

        // $('body').on("touchend", function (e) {
        // 	console.log('touchend : ')
        // })



});




var draggableBottom = {
    init : function(){
        var $bs = $('.dragging-bs');
        var $handle = $('.drag-handle');
        var wh = $(window).height();        
        var hh = $('#headerLay').outerHeight();
        var conh = $('.desc-area').outerHeight();
        var bsh = wh - (hh + conh);
        var bsMaxH = wh - hh;
        var touchStart;
        var touchLast;
        
        // init
        $bs.height(bsh);

        draggableBottom.touchstart();
        draggableBottom.touchmove();
        draggableBottom.touchend();

        console.log('나옴?')
    },
    touchstart : function(){
        var _this = this;
        


        // 초기 터치
        $handle.on('touchstart', function(e){
            touchStart = e.touches[0].pageY;
            touchLast = 0;// touchmove시 저장된 값 초기화
        });

        _this.touchmove();

    },
    touchmove : function(){
        var _this = this;

        //핸들을 터치한 경우 => 바텀시트 up
        touchstart.$handle.on('touchmove', function(e){
            touchLast = e.touches[0].pageY;            
            var gap = touchLast - touchStart;
            var bsIngH = bsh + (-gap);

            if($bs.hasClass('active')) return;// 바텀시트 펼침 상태시 패스
            if(gap < 0 && bsIngH < bsMaxH){// gap이 마이너스 값임 && 드래그시 bsMaxH까지 높이 적용
                $bs.height(bsIngH);
            }
            $('body').css('overflow', 'hidden');
        });

        _this.touchend();
    },
    touchend : function(){
        $handle.on('touchend', function(e){
            if((touchStart - touchLast) > 0 && touchLast != 0){// up
                $bs.animate({
                    'height' : bsMaxH
                }, 200, "swing");

                $('.dragging-bs').addClass('active');
            }else if((touchStart - touchLast) < 0 && touchLast != 0){// down
                $bs.animate({
                    'height' : bsh
                }, 300, "swing");

                $('.dragging-bs').removeClass('active');
            }       
        });
    }
}
draggableBottom.init();
// $(function(){
//     draggableBottom.init();
// });
        

        
        

        
        
    
        

        // 드래그 테스트
        // $('body').on("touchstart", function (e) {
        // 	console.log('touchstart : ',  e.touches[0].pageY)
        // })

        // $('body').on("touchmove", function (e) {
        // 	console.log('touchmove : ',  e.touches[0].pageY)
        // })

        // $('body').on("touchend", function (e) {
        // 	console.log('touchend : ')
        // })