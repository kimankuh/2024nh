 /* Creator OJH */
 
// 작업 표시 요약바
function gaugeSeting(obj){
	let total = $('.unit'+ obj).not('.del').length;
	let cls = ['check','working','inspe','comf','hold'];
	for (let i = 0; i < cls.length; i++) {
		$('.state-num-' + cls[i]).width(
			// 퍼센트 계산
			( $('.state.' + cls[i]).closest('.unit' + obj).not('.del').length / total ) * 100 + '%' 
		).html(
			// 숫자 뱃지
			'<span>' + Math.round( $('.state-num-' + cls[i]).attr('style').slice(7).replace(/%;/gi, '') ) + '%</span>'
		);
	};
	$('[class^="state-num-"]').each(function(){
		if( $(this).width() == 0 ){
			$(this).find('span').hide();
		}
	});
};
// 메뉴 활성화
function menuActive(){
	$('.content [id^=menu]:visible').each(function(){
		let idVal = $(this).attr('id');
		$('.menu[href="#'+idVal+'"]').addClass('on');
	});
}
// 소팅 팝업 함수
function sortingPopup(){
	let sortPop = ['planner', 'publs', 'identity'];
	for(let n = 0; n < sortPop.length; n++ ){
		$('.'+sortPop[n]+'_sort').on('click',function(){
			$('[class$="_sort"]').removeAttr('style');
			$(this).css('color','#ff0000');
			$('.'+sortPop[n]+'_sort_sel').show();
		});
		$('.'+sortPop[n]+'_sort_sel a').on('click',function(){
			let name = $(this).text();
			$('.unit .'+sortPop[n]).each(function(){
				if( $(this).text() === name ){
					$(this).closest('.unit').css('display','table');
					$('.'+sortPop[n]+'_sort').css('color','#ff0000');
				} else if( name === '전체' ) {
					$('[class$="_sort"]').removeAttr('style');
					$('.unit').css('display','table');
				} else {
					$(this).closest('.unit').hide()
					$('[class$="_sort"]').removeAttr('style');
				}
			});
		});
		$('.'+sortPop[n]+'_sort_sel').on('click',function(){
			$(this).hide()
		})
	}
}
// 검색결과 없을때 이모티콘 랜덤~게임!
function randomEmo(){
	$('.none-data-text').removeAttr('class').addClass('none-data-text');
	$('.none-data-text').addClass(`emoticon${Math.floor(Math.random() * 10) + 1}`);
}
function timeCheck(){
	let timeNow = new Date();
	let timeHr = timeNow.getHours()
	console.log(timeHr)
	if ( timeHr >= 16) {
		$('body').addClass('dark-mode');
	}
}

$(function(){
	// 메뉴 기능
	$('.nav-list .menu').on('click',function(){
		let sortMenu = $(this).attr('href').replace('#','');
		let hrefVal = $(this).attr('href').slice(1,5);
		let menuClass = 'menu1 menu2 menu3 menu4 menu5 menu6 menu7 menu8 menu9 menu10 menu12 menu13 menu14 menu15'
		$('.nav-list .menu').removeClass('active');
		$(this).addClass('active');
		if( hrefVal == 'menu' ){
			$('main').removeClass(menuClass).addClass(sortMenu);
		} else if (hrefVal == 'all') {
			$('main').removeClass(menuClass)
		} else {
			alert('메뉴의 href는 #menu + Number 로 통일 시켜주세요');
		}
		gaugeSeting('')
		$('html,body').scrollTop(0)
		return false;
	});
	// 닫기 버튼 활성화
	$('.close-menu').on('click',function(){
		$('main').toggleClass('menu-off');
	});
	// press (단축키)
	$(document).keypress(function(event){
		/* if( event.keyCode === 66 ){ // Shift + B
			$('main').toggleClass('menu-off');
		} */
		if( event.keyCode === 77 ){ // Shift + M
			$('body').toggleClass('dark-mode');
		}
		if( event.keyCode === 83 ){ // Shift + S
			$('.search-list-area').toggleClass('call');
			$('.close-menu').toggleClass('fixed')
			return false;
		}
		if( event.keyCode === 74 ){ // Shift + J
			$('main').toggleClass('jihwan-frame');
		}
		if( event.keyCode === 80 ){ // Shift + P
			$('header .bar').toggleClass('off');
			// 초기 상단 게이지
			if( $('main').hasClass('first-view') ){
				gaugeSeting('.first');
			} else if ( $('main').hasClass('secondary-view') ){
				gaugeSeting('.secondary');
			} else {
				gaugeSeting('');
			}
		}
		// console.log(event.keyCode);
	});
	$(document).keyup(function(event){
		if( event.keyCode === 27 ){ // ESC
			$('.util-list, .planner_sort_sel, .publs_sort_sel, .identity_sort_sel').hide()
		}
	});
	// 포커스 시 스타일 변경
	$('.page a').focus(function(){
		$('.page a').closest('.unit').removeClass('on');
		$(this).closest('.unit').addClass('on');
	});
	// 아이프레임 식 미리보기 뷰
	$('.unit .page').off().on('mouseenter', function(){
		let linkHref = $(this).find('a').attr('href');
		if( $(this).closest('.unit').hasClass('del') ){
			return false;
		} else {
			$(this).append('<iframe class="iframe-view" src="'+linkHref+'"></iframe>')
		}
	}).on('mouseleave', function(){
		$('.iframe-view').remove();
	});
	// 스크롤 탑 이벤트
	$(window).scroll(function(){
		if( $(this).scrollTop() > 500 ){
			$('.scroll_top').fadeIn()
		} else {
			$('.scroll_top').fadeOut()
		}
	})
	$('.scroll_top').on('click', function(){
		$('html,body').animate({
			scrollTop:0
		},300)
	})
	$('.unit').each(function(e){
		// 넘버링
		e += 1;
		$(this).find('.num').text(e)
		// 유형 파악
		let iden = $(this).find('.identity').text();
		$(this).find('.identity').html(`<span>${iden}</span>`);
		$(this).find('.page a').attr('href', $(this).find('.page a').attr('href') + $(this).find('.page a').text() + '.html')
		$(this).find('.state').append('<div class="state-gauge"><i></i><i></i><i></i></div>');
		/* 페이지 상태 설정 분기 시작 */
		// 삭제 분기
		if ( $(this).hasClass('del') ){
			$(this).find('.state').text('삭제');
			$('.unit.del').find('.state-gauge').remove()
		}
		// 유효된 상태 분기 | 삭제 제외
		switch( $(this).find('.state').text() ){
			case '작업전' :
				$(this).find('.state').addClass('check');
			break
			case '작업중' :
				$(this).find('.state').addClass('working');
			break
			case '검수중' :
				$(this).find('.state').addClass('inspe');
			break
			case '완료' :
				$(this).find('.state').addClass('comf');
			break
			case '보류' :
				$(this).find('.state').addClass('hold');
			break
		}
		// HTML 형태 구분 분기
		switch( $(this).find('.identity span').text() ){
			case 'page':
				$(this).find('.identity').addClass('iden_page');
			break
			case 'popup':
				$(this).find('.identity').addClass('iden_popup');
			break
			case 'layer':
				$(this).find('.identity').addClass('iden_layer');
			break
			case 'alert':
				$(this).find('.identity').addClass('iden_alert');
			break
		}
		// Level2 라인 체킹 - 차세대 적용 필요
		/* if( $(this).find('.level2').text() != $(this).next('.unit').find('.level2').text() ){
			$(this).addClass('line-check');
		} */
		/* 페이지 상태 설정 분기 끝 */
	});

	// 유틸 클래스 리모콘
	$('[data-copy]').on('click', function(){
		$('.copy-val').val( $(this).data('copy') ).select()
		document.execCommand('copy');
		$('.util-list').append('<div class="copy-comf"><span>.' + $(this).data('copy') + '</span></div>')
		$('.copy-val').find('span').text( $(this).data('copy') );
		setTimeout(function(){
			$('.copy-comf').remove();
		},450);
	});
	$('.group h6 a').on('click',function(){
		$(this).toggleClass('active')
		if( $(this).hasClass('active') ){
			$(this).closest('h6').siblings('.cases').slideDown(250);
		} else {
			$(this).closest('h6').siblings('.cases').slideUp(100);
		}
	});
	$('.util-list-button').on('click',function(){
		$(this).toggleClass('clo');
		if( $(this).hasClass('clo') ){
			$('.util-list').show();
		} else {
			$('.util-list').hide();
		}
	});

	// 1차 2차 구분
	/* $('.view-check-sortation').on('change', function(){
		let val = $(this).val();
		if( 'case1' === val ){
			$('main').removeClass('color-sortation first-view secondary-view not-view');
			gaugeSeting('');
			menuActive();
		} else if( 'case2' === val ){
			$('main').removeClass('color-sortation secondary-view not-view').addClass('first-view');
			gaugeSeting('.first');
			menuActive();
		} else if( 'case3' === val ){
			$('main').removeClass('color-sortation first-view not-view').addClass('secondary-view');
			gaugeSeting('.secondary');
			menuActive();
		} else if( 'case4' === val ){
			$('main').removeClass('first-view secondary-view not-view').addClass('color-sortation');
			gaugeSeting('');
			menuActive();
		} else if( 'case5' === val ){
			$('main').removeClass('color-sortation first-view secondary-view').addClass('not-view');
			menuActive();
		}
	}); */


	if( $(window).width() <= 780 ){
		$('main').addClass('menu-off');
		$('.search-list-area').addClass('call');
	} else {
		$('main').removeClass('menu-off');
		$('.search-list-area').removeClass('call');
	}
	$(window).resize(function(){
		let windowSize = $(this).width();
		/* console.log (windowSize) */
		if( windowSize <= 780 ){
			$('main').addClass('menu-off');
			$('.close-menu').addClass('fixed');
			$('.search-list-area').addClass('call');
		} else {
			$('main').removeClass('menu-off');
			$('.close-menu').removeClass('fixed');
			$('.search-list-area').removeClass('call');
		}
	});

	/* 검색 기능 */
	$('.search-input').on('focus', function(){
		$(this).off().on('keydown', function(event){
			if( event.keyCode == 13 ){
				let searchVal = $(this).val();
				$('.unit').removeClass('search-comf');
				$('.none-data-text').hide()
				if ( searchVal != '' ) {
					$('.btn-reset').show();
					$('.unit div').not('.date, .state').each(function(){
						if( $(this).text().indexOf(searchVal) !== -1 && searchVal != '' ){
							$(this).closest('.unit').addClass('search-comf');
						} else if ( searchVal == '!!' + $(this).text() ) {
							$(this).closest('.unit').addClass('search-comf');
							$('.info-text').text( $('.search-comf').length );
						}
					});
					if( $('.search-comf').length == 0 ) {
						$('.none-data-text').show()
						randomEmo()
					}
					$('main').addClass('search-result');
					$('.info-text').html( `검색된 총 <span>${$('.search-comf').length}</span>건` );
				} else {
					$('main').removeClass('search-result');
					$('.unit').removeClass('search-comf');
					$('.btn-reset').hide();
					$('.info-text').html( `'<span>!!</span>' 느낌표 두개를 추가시 정확검색 || 없으면 포함검색` );
				}
			};
		});
	})
	// 검색 기능 - reset
	$('.btn-reset').on('click', function(){
		$('main').removeClass('search-result');
		$('.unit').removeClass('search-comf');
		$('.info-text').html( `'<span>!!</span>' 느낌표 두개를 추가시 정확검색 || 없으면 포함검색` );
		$('.search-input').val('');
		$('.none-data-text').hide()
		$(this).hide();
	})

	$('header .bar').on('click',function(){
		$('.total-count').toggleClass('on');
		let cls = ['check','working','inspe','comf','hold','del'];
		for (let i = 0; i < cls.length; i++) {
			$('.total-count-unit-'+cls[i]).find('.val').text( $('.'+cls[i]).length )
		};
	})

	
	
	// 검색결과 없음
	randomEmo();
	// 페이지 소팅
	sortingPopup();
	// 초기 상단 게이지
	// gaugeSeting('')
	// 메뉴 활성화
	menuActive();
	timeCheck();
});