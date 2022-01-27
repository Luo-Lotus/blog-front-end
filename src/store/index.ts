import Vuex from 'vuex'
let webSocket:WebSocket
const store = new Vuex.Store({
    state:{
        //存放的键值对就是所要管理的状态
        scrollTop:0,
        webSocket,
        gameId:"",
        currentUserInfo:{}
    },
    mutations:{
        setScrollTop(state,num){
            state.scrollTop = num
        },
        setWebSocket(state,webSocket){
            state.webSocket =  new WebSocket("ws://nanotus.cn/lotusapi/game")
            
        },
        setGameId(state,gameId){
            state.gameId = gameId
        },
        setUserInfo(state,userInfo){
            state.currentUserInfo = userInfo
        }
    }
})

export default store