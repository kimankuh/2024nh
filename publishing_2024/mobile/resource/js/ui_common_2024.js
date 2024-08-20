/* 2024고도화 전용 js */
$(window).on('load',function(){
    accoNewInit();//아코디언 뉴타입
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