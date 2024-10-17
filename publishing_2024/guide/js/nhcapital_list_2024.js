$(function(){
    setFrameHeight();
});

$(window).on('resize', function(){
    setFrameHeight();
});

function setFrameHeight(){
    var docH = $(window).height();
    var headerH = $('.guide-header').outerHeight();
    var $iframe = $('.frame-pageview');
    
    if($('.guide-sections').length == false){        
        $iframe.height(docH - headerH - 50);
    }
}