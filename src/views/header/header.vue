<script setup lang="ts">
import http from "../../axios/http";
import { useRouter,useRoute } from "vue-router";
import { computed, onBeforeMount, ref } from "vue";
import { useStore } from "_vuex@4.0.2@vuex";
const store = useStore()
const activeIndex = ref("1")
const meun = ref([{
        name:"博客",
        url:"/blog"
    },{
        name:"工具",
        url:"/util"
    },{
        name:"游戏",
        url:"/game"
    }])
const currentMeun =ref("博客")
const router = useRouter()
const isLogin = ref(false)
const userInfo = ref({
    username:"",
    password:"",
    email:"",
    avatar:"",
    createTime:"",
})


onBeforeMount(()=>{
    http.get("/user/getUserInfoByToken",
    ).then((res:any)=>{
        if(res.data.code=="0"){
            isLogin.value = true
            userInfo.value = res.data.data
            
            store.commit("setUserInfo",userInfo.value)
            localStorage.setItem("user",JSON.stringify(userInfo.value)) 
            meun.value[0].url+= "/"+userInfo.value.username
        }else{
            meun.value[0].url+= "/"+"Lotus"
        }
    })
})

const meunClick=(item:{name:string,url:string})=>{
    if(currentMeun.value!=item.name){
        currentMeun.value = item.name
        router.push(item.url)
    }  
}
const quit = ()=>{
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    router.go(0)
}
</script>
<template>

    <div class="header">
        <div class="content">
            <div class="meun"
                    :default-active="'/blog'"
                    mode="horizontal"
                    :router="true"  
                    >
                    <div class="meun-item" :class="currentMeun==item.name?'meun_active':''" v-for="item of meun" :id="item.name" @click="meunClick(item)">{{item.name}}</div>
                
            </div>
            <div class="user">
                <div class="unlogin" v-if="!isLogin">
                    <el-button type="primary" size="small" @click="router.push('/login')" round>　登陆　</el-button>
                    <el-button type="info" size="small" @click="router.push('/register')" round>　注册　</el-button>
                    
                </div>
                <div class="logined" v-if="isLogin">
                    <div class="username">{{userInfo.username}}</div>
                    <el-popover
                        placement="bottom"
                        trigger="click"
                        transition = "el-zoom-in-top"
                        >
                        <template #reference>
                            <el-avatar class="avatar" icon="el-icon-user-solid" :size="50" shape="circle" :src="userInfo.avatar"></el-avatar>         
                        </template>
                        <div class="userMeun">
                            <div @click="router.push('/edit')">
                                写文章
                            </div>
                            <div @click="router.push('/blog/'+userInfo.username)">
                                个人主页
                            </div>
                            <div @click="router.push('/center/'+userInfo.username)">
                                个人中心
                            </div>
                            <div @click="quit">
                                退出登录
                            </div>
                        </div>
                         <!-- <el-button slot="reference">content</el-button> -->
                    </el-popover>
                    
                    
                </div>
            </div>
        </div>

        
    </div>

</template>

<style scoped>
    .meun{
        display: flex;
    }
    .meun_active{
        border-bottom: 2px solid #409eff;
    }
    .meun-item{
        padding:0px 20px;

        cursor: pointer;
    }
    .meun-item:hover{
        background-color:#ecf5ff;
    }
    .content{
        width: 78%;
        display: flex;
        flex-wrap:wrap-reverse;;
        line-height: 60px;
        justify-content: space-between;
    }
    .logined{
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .logined div{
        margin: 0px 20px;
    }
    .username{
        color:#409eff;
        font-weight: bold;
        font-size: 20px;
    }
    .avatar{
        cursor: pointer;
    }

    .header{
        display: flex;
        justify-content: center;

        background-color: white;
        box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04)
    }
    .userMeun{
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    .userMeun div{
        margin: 5px 0px;
        cursor: pointer;
        transition: all 0.3s;
    }
    .userMeun div:hover{
        color:#409eff
    }
    @media screen and (max-width: 1280px){
        .header{
            justify-content: start;
            padding-left: 20px;
        }
    }
    
    .user{
        display: flex;
        justify-content: flex-end;
    }


</style>