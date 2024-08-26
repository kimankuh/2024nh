/* 2024고도화 전용 js */
$(window).on('load',function(){
    accoNewInit();//아코디언 뉴타입
    toogleBtnIput(); //이메일 input show/hide(발급방법선택)
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