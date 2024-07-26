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
        draggable 바텀시트     
    **********************/    
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
            // console.log('마지막터치 : ', touchLast);            

            if($bs.hasClass('active')) return;// 바텀시트 펼침 상태시 패스
            if(gap < 0 && bsIngH < bsMaxH){// gap이 마이너스 값임 && 드래그시 bsMaxH까지 높이 적용
                $bs.height(bsIngH);
            }
            $('body').css('overflow', 'hidden');
        });
    
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