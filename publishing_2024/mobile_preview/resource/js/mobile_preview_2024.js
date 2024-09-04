$(function(){
    // 좌측 메뉴
    $('.nav-menu-link').on('click', function(){
        $('.nav-menu-link').removeClass('active');
        $(this).addClass('active');
    });
    
});