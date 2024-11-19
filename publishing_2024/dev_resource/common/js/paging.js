// 공통 Util
var paging = {
	
	mobPageList : {},
		
	pcListSize : 10,
	
	moListSize : 15,

	pageSubmit : function(url,frm,off,size){
		frm.offset.value = off;
		frm.pageSize.value = size; 
		url = url;
		paging.fnSubmit(frm, url ,"_self","post"); 
	},
	fnSubmit : function(frm,actionName,targetLayer,methode){
		//CommMsg.alert(frm.name + " , " + actionName + " , " + targetLayer + " , " + methode );
		frm.method = methode;
		frm.target = targetLayer;
		frm.action = actionName;
		frm.submit();
	},
	
	//
	addMoreBtn: function(contentArea, addResultList, pageParam){
		if(pageParam.addMore){
			var moreArea = contentArea.find("div.list_more");
			var moreNum = comm.isNull(moreArea.data("more-num")) ? 0 : parseInt(moreArea.data("more-num"));
			var pgNum = moreNum + 1;

			var addBtn = '<div class="list_more widediv" data-more-num='+ pgNum +'><button type="button" class="ebbtn btn_list_more"><span>더보기</span></button></div>';
			
			//이전 더보기 버튼 제거
			moreArea.remove();
			
			//더보기 추가버튼 추가
			if(pageParam.cnt > (moreNum+1) * pageParam.row){
				contentArea.append(addBtn);
				contentArea.find("div.list_more").off("click").on("click",function(){
					addResultList(pgNum);
				});
			}
		} else{
			if(contentArea.find("div.list_more").length > 0){
				contentArea.find("div.list_more").remove();
			}
		}
	}
}
