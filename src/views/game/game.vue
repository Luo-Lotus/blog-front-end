<script setup lang='ts'>import { onMounted,ref,computed } from 'vue';
import { ElMessage } from 'element-plus';
import { useStore } from 'vuex';
const store = useStore()
const text = ref("hello")

let websocket:WebSocket = store.state.webSocket
const id = computed(()=>store.state.gameId)
const btn = ()=>{

    if(websocket.readyState == websocket.OPEN){
        const data = {
            type:"message",
            message:text.value
        }
        websocket.send(JSON.stringify(data))
        text.value = ""
    }else{
        console.log("连接失败");
        
        ElMessage({
            
            message:"连接失败 请尝试重新连接",
            type:"error"
        })
    }

}
const clickLisenter = (event:MouseEvent)=>{
    const x = event.offsetX-25
    const y = event.offsetY-25
    const data = {
        type:"player",
        message:{
            id:id.value,
            x,
            y
        }
    }
    
    if(websocket.readyState == websocket.OPEN){
        websocket.send(JSON.stringify(data))
    }else{
        console.log("连接失败");
        
        ElMessage({
            message:"连接失败 请尝试重新连接",
            type:"error"
        })
    }

}
const playerList = ref([{
    id:"",
    x:0,
    y:0,
}])

onMounted(()=>{
    if(websocket==undefined){
        store.commit("setWebSocket")
        websocket = store.state.webSocket
    }
    //连接发生错误的回调方法
    websocket.onerror = function() {
        setMessageInnerHTML("error");
    };

    //连接成功建立的回调方法
    websocket.onopen = function(event) {
        setMessageInnerHTML("连接成功")
    }

    //接收到消息的回调方法
    websocket.onmessage = function(event) {
        const data:any = JSON.parse(event.data)
        if(data.type=="message"){
            setMessageInnerHTML(data.message);
        }else if(data.type=="players"){
            playerList.value = data.message
        }else if(data.type =="player"){
            store.commit("setGameId",data.message.id)
        }
        

    }

    //连接关闭的回调方法
    websocket.onclose = function() {
        setMessageInnerHTML("close");
    }
    //监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常。
    window.onbeforeunload = function() {
        websocket.close();
    }
    //将消息显示在网页上
    function setMessageInnerHTML(innerHTML) {
        document.getElementById('message').innerHTML += innerHTML + '<br/>';
    }
})
</script>

<template>
    <input type="text" v-model="text" @keyup.enter="btn">
    <button @click="btn">发送</button>我的id:{{id}}
    <div class="content">
        <div id="canvas" @click="clickLisenter">
            <div class="player" v-for="item of playerList"  :style="{top:item.y+'px',left:item.x+'px'}">{{item.id}}</div>
        </div>
        <div id="message"></div>
    </div>

</template>

<style scoped>
#message{
    width: 400px;
}
#canvas{
    width: 400px;
    height: 400px;
    position: relative;
    background-color: white;
    box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04)
}
.player{
    text-align: center;
    line-height: 50px;
    color: white;
    font-weight: bold;
    font-size: 50px;
    position: absolute;
    width: 50px;
    height: 50px;
    background-color: rgb(0, 195, 255);
    transition: all 0.5s ease-in-out;
}
.content{
    display: flex;
    flex-wrap: wrap;
}
</style>