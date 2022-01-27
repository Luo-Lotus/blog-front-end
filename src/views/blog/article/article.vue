<script setup lang='ts'>

import { onMounted,getCurrentInstance, ref, computed, provide,onBeforeMount,watch } from "vue";
import http from "../../../axios/http"
import Contents from "./contents.vue";
import Fixed from "../../component/fixed.vue";
import comment from "./comment.vue";
import Comment_editor from "./comment_editor.vue";
import { useRoute } from "vue-router";
const isConnect = ref(false)
const route = useRoute()
const article = ref({
    articleContent: "",
    classificationId: 0,
    id: 0,
    releaseTime: "",
    summary: "dd",
    tags: [],
    title: "",
    userId: 0,
    username:""
})
const user =ref({
    avatar: "",
    createTime: "",
    email: "",
    id: 0,
    password: "",
    signature: "",
    username: ""
})
const comments = ref([{
    id:0,
    article_id: 9,
    content: "",
    release_time: "",
    replied_id: 0,
    user_id: 0,
    username:"",
    avatar:""
}])
const self = getCurrentInstance()
self.proxy
const input = ref("")
onBeforeMount(()=>{
    http.get("/article/get",{
        params:{
            articleid:route.params.articleid
        }
    }).then((res:any)=>{
        article.value = res.data.data.article
        user.value = res.data.data.user
        document.title = "文章："+article.value.title
        isConnect.value = true
        
    })

    update()
})
const update = ()=>{
    http.get("/comment/getList",{
        params:{
            article_id:route.params.articleid
        }
    }).then((res:any)=>{
        if(res.data.code=="0"){
            comments.value = res.data.data.reverse()
            
        }
    })
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
const change= ()=>{
    const content:any = self.refs.content
    if(content){
        content.update();
    }
    
}
const h = ref(document.body.clientHeight)
const contents = ref(null)
</script>
<template>
    <div class="main" >
        <div class="left" :span="4" ref="contents" >
            <el-Affix :offset="20" >
                <div style="border-radius: 4px;overflow: hidden;">
                    <el-scrollbar :max-height="h-40+'px'" >
                    <contents :parent="self" ref="content"></contents>
                    </el-scrollbar>                 
                </div>
            </el-Affix>

        </div>
        <div class="right" > 
            <div class="content" v-if="!isConnect">
                <el-skeleton :rows="10" animated />
            </div>
            <div class="content" v-if="isConnect">
                    <div style="font-weight: bold;font-size: 25px;">{{article.title}}</div>
                    <el-divider content-position="left" style="margin: 10px 0px !important;"></el-divider>
                    <div class="top_info">
                        <div class="info">
                            <div class="author">{{user.username}}</div>
                            <el-divider direction="vertical"></el-divider>
                            <div class="date">{{dateFormat("YYYY年mm月dd日 HH:MM:SS",parseInt(article.releaseTime))}}</div>
                        </div>
                        <div>
                            <div class="other">
                                <div class="view i" style="color: rgb(0, 216, 115);">
                                    点击:111
                                </div>
                                <el-divider direction="vertical"></el-divider>
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

                    <div class="tags">

                        <div class="tag" v-for="item in article.tags">{{item}}</div>
                    </div>
                    <el-divider content-position="left" style="margin: 10px 0px !important;"></el-divider>
                    <div class="article">
                        <v-md-preview @change="change" class="markdown" ref="preview" :text="article.articleContent" style="padding: 0px;margin:0px"></v-md-preview>
                    </div>
                    <el-divider content-position="left" style="margin: 10px 0px !important;"></el-divider>
                    <div class="article_bottom">
                        <i class="iconfont icon-dianzan"></i>
                        <i class="iconfont icon-shoucang"></i>
                    </div>
                    <el-divider content-position="left" style="margin: 10px 0px !important;"></el-divider>
                    <div class="conments">
                        <Comment_editor :type="false" :article="article" @update="update"></Comment_editor>
                        <comment :isEditing="false" v-for="item in comments" :data="item" @update="update"></comment>
                    </div>

                </div>
        </div>
    </div>
    

    
</template>

<style>
.markdown div{
    padding: 0 !important;
}
.v-md-pre-wrapper{
     margin: 0px!important;
     border-radius: 4px!important;
}

</style>
<style scoped>
    .left{
        width: 200px;
    }
    .right{
        width: 760px;
        padding:0px 20px;
    }
    .main{
        display: flex;
        flex-wrap:wrap;
    }
    .content{
        background-color: white;
        padding: 20px;
        border-radius: 4px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04)
    }
    
    .all_info{
        display: flex;
        align-items: flex-end;
        justify-content: space-between;
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
    .top_info{
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-wrap: wrap;
    }
    .other{
        display: flex;
        font-size: 12px;
        align-items: flex-end;
    }
    .tags{
        margin: 10px 0px;
        display: flex;
        flex-wrap: wrap;
    }
    .tag{
        padding: 5px 10px;
        margin-right: 5px;
        font-size: 12px;
        border-radius: 4px;
        border: 1px solid #409eff;
        color: #409eff;
        cursor: pointer;
        transition: all 0.3s;
    }
    .tag:hover{
        background-color: #409eff;
        color: white;
    }
    .article_bottom{
        display: flex;
        justify-content: center;
    }
    .article_bottom .iconfont{
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 30px;
        border-radius: 100px;
        border: 1.5px solid;
        cursor: pointer;
        width: 50px;
        height: 50px;
        margin: 10px;
        transition: all 0.3s;
    }
    .article_bottom .iconfont:hover{
        background-color: #409EFF;
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