<script setup lang='ts'>import { useRoute, useRouter } from "vue-router";
import { reactive, ref,onMounted,getCurrentInstance, onBeforeMount } from "vue";
import http from "../../axios/http"
const self = getCurrentInstance()
const route = useRoute()
const router = useRouter()
const user = ref({
    avatar: null,
    createTime: "",
    email: "",
    id:0,
    password: "",
    signature: "",
    username: "",
})
onBeforeMount(()=>{
    console.log(route.params.userid);
    
    http.get("/user/getUserInfoByUsername",{
        params:{
            username:route.params.userid
        }
    }).then((res:any)=>{
        if(res.data.code == "0"){
            user.value = res.data.data
        }else{
            
        }
    })
})

</script>

<template>
<div class="info">
    <el-avatar  :size="120" :src="user.avatar"></el-avatar>
    <div class="author">{{user.username}}</div>
    <div>{{user.signature}}</div>
</div>
    
</template>

<style scoped>
    .info{
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 20px 20px;
        width: 100%;
        background-color: white;
        border-radius: 4px;
        
    }
    .author{
        color: #409EFF;
        font-weight: bold;
        margin: 10px 0px;
    }
    
</style>