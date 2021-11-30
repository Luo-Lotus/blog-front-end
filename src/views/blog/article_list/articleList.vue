<script setup lang="ts">import { useRouter, useRoute } from "vue-router";
import {onMounted,ref,onBeforeMount,watch,computed} from 'vue'
import http from "../../../axios/http"
import Left from "./Left.vue";
import Fixed from '../../component/fixed.vue'
import { useStore } from "vuex";

const router = useRouter();
const route = useRoute()
const store = useStore()
let username = route.params.userid;
const isCurrentUser = computed(()=>route.params.userid == store.state.currentUserInfo.username)
const classification = ref([])
const isConnect = ref(false)
const articleList =ref([{
    summary:"",
    user_id:0,
    classification_id:0,
    id:0,
    title:"",
    release_time:"",
    username:""
}])
const listView = ref([{
    summary:"",
    user_id:0,
    classification_id:0,
    id:0,
    title:"",
    release_time:"",
    username:""
}])
const change = (item)=>{
    updateList(item)
    
}

onMounted(()=>{
    update()
})
const update = ()=>{
        http.get("/article/getList",{
            params:{
                username:username
            }
            }).then((res:any)=>{
                    if(res.data.code=="0"){
                        articleList.value = res.data.data
                        listView.value = articleList.value.reverse()
                    }
                    isConnect.value = true
                })
            document.title = username+"的主页"
            }
const updateList = (item:any)=>{
    if(item.id == -1){
        listView.value = articleList.value
    }else{
        listView.value  = articleList.value.filter(x=>x.classification_id==item.id)
    }
}
const cardClick = ()=>{

    router.push(`/blog/${route.params.userid}/11`)
}
const dateFormat = (fmt:string, timestap:number) =>{
    const date = new Date(timestap)
    
    let ret;
    const opt = {
        "Y+": date.getFullYear().toString(),        // 年
        "m+": (date.getMonth() + 1).toString(),     // 月
        "d+": date.getDate().toString(),            // 日
        "H+": date.getHours().toString(),           // 时
        "M+": date.getMinutes().toString(),         // 分
        "S+": date.getSeconds().toString()          // 秒
        // 有其他格式化字符需求可以继续添加，必须转化成字符串
    };
    for (let k in opt) {
        ret = new RegExp("(" + k + ")").exec(fmt);
        if (ret) {
            fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
        };
    };
    return fmt;
}
const h = ref(document.body.clientHeight)
</script>

<template>
    <div class="main">
        <div class="left">
        <el-Affix :offset="20">
            <div style="border-radius: 4px;overflow: hidden;">
                <el-scrollbar :max-height="h+'px'" >
                    <Left @change="change"></Left>
                </el-scrollbar>
            </div>
        </el-Affix>
        </div>
        <div class="right">
            <div class="content" v-if="!isConnect">
                <div class="card" v-for="i in 5">
                    <el-skeleton :rows="3" animated />
                </div>
            </div>
            <div class="content" v-if="isConnect">
                
                <div class="card" @click="router.push(`/blog/${route.params.userid}/${item.id}`)" v-for="item,index in listView">
                    <div class="title" style="font-weight: bold;font-size: 20px;">{{item.title}}</div>
                    
                    <el-divider content-position="left" style="margin: 10px 0px !important;"></el-divider>
                    <div class="description">{{item.summary}}</div>
                    <el-divider content-position="left" style="margin: 10px 0px !important;"></el-divider>
                    <div class="bottom">
                        <div class="info">
                            <div class="author">{{item.username}}</div>
                            <el-divider direction="vertical"></el-divider>
                            <div class="date">{{dateFormat("YYYY年mm月dd日HH时",parseInt(item.release_time))}}</div>
                        </div>
                        <div class="other">
                            <div class="like i" style="color: rgb(230, 65, 0);">
                                点赞:111
                            </div>
                            <el-divider direction="vertical"></el-divider>
                            <div class="comment i" style="color: rgb(0, 225, 255);">
                                评论:111
                            </div>
                            <el-divider direction="vertical"></el-divider>
                            <div class="favor i" style="color: rgb(255, 153, 0);">
                                收藏:111
                            </div>
                        </div>
                    </div>
                </div>
                <el-empty description="文章好像失踪了" v-if="listView.length==0" class="card"></el-empty>
            </div>
        </div>
    </div>
    
</template>

<style scoped>
    .left{
        width: 200px;
    }
    .right{
        width: 760px;
        padding: 0px 20px;
    }
    .main{
        display: flex;
        flex-wrap: wrap;
    }
    .content{
        border-radius: 4px;
    }
    .card{
        background-color: white;
        padding: 20px;
        border-radius: 4px;
        margin-bottom: 10px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
        cursor: pointer;
        transition: all 0.3s;
    }
    .card:hover{
        background-color: #ecf5ff;
    }
    .description{
        color: gray;
        max-height: 45px;
        overflow: hidden;
    }
    .bottom{
        display: flex;
        align-items: flex-end;
        justify-content: space-between;
                flex-wrap: wrap;
    }
    .info{
        display: flex;
        align-items: flex-end;
    }
    .author{
        color: #409EFF;
        font-weight: bold;
    }
    .date{
        font-size: 12px;
        color: gray;

    }
    .other{
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 13px;

    }


    @media screen and (max-width: 1280px){
        .right{
            width: 100%;
            padding: 0px;
            margin-top: 20px;
        }
        .left{
            width: 100%;
        }
    }

</style>