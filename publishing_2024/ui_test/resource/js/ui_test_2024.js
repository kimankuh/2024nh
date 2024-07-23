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
        var draghandle = $('.drag-handle');
        // var bottomTouchStart = 0;
        // var bottomScrollStart;
        var lastTouch;
    
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
            var bsMaxH = wH - ($('#headerLay').outerHeight() + 50);

            if(bottomSheet.hasClass('active')) return;
            if(gap < 0 && bsIngH < bsMaxH){// 갭이 0보다 작고 active가 있으면?
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