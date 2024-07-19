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
        var $nav = $('.prod_nav_list');
        var navTop = $nav.offset().top;
        var scrollTop = $(window).scrollTop();

        if(navTop - scrollTop < 55){
            $nav.addClass('active');            
        }else if(scrollTop < 40){
            $nav.removeClass('active');
        }
    }
    scrollTopCheck();//init용



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

});