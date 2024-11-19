const mobRouter = {
    //모바일 라우터 이니셜라이즈 
    initialize:()=>{
        const service = "SET_BACK_BUTTON";
        const param = {
            "possible_yn": "Y",
            "action": "custom"
        }
        const callbackFunctionName = ""

        comm.callNativeFunc(service, param, callbackFunctionName);
    },

    // 백버튼 누를 시 메인 페이지로 이동하는 리스트
    introPageUrlList:[
        ""
    ],

    previousPageUrlList:[

    ],

    // 백버튼 누를 시 다른 페이지로 이동하는 리스트
    // form - 현재 url : 이동할 url
    pageUrlList:{
        "":"",
        
    }
    
}

mobRouter.init();

const runCustomAction = ()=>{
    const url = window.location.href.replaceAll("http://", "").replaceAll("https://").replace(window.location.host, "");
    
    mobRouter.introPageUrlList.includes(url);
    
}



