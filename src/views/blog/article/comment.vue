<script setup lang='ts'>
import { computed, getCurrentInstance, onMounted, ref } from "vue";
import commentEditor from "./comment_editor.vue";
import http from "../../../axios/http"
import { routeLocationKey, useRoute } from "vue-router";
import { ElMessageBox } from "element-plus";
const self = getCurrentInstance();
const route = useRoute()
const props = defineProps<{
    isEditing:boolean,
    data:{
        id:number,
        article_id: number,
        content: string,
        release_time: string,
        replied_id: number,
        user_id: number,
        username:string,
        avatar:string
    }
}>()
const emit = defineEmits(["update"])
const isEditing = ref(false)
const openReply = ()=>{
    isEditing.value = !isEditing.value
}
const isCurrentUser = computed(()=>{
    const ss = localStorage.getItem("user")
    if(!ss){
        return false
    }
    const user = JSON.parse(ss)  
    
    return route.params.userid == user.username || props.data.user_id == user.id
})
const _delete = ()=>{
    const comment = props.data
    

    ElMessageBox.confirm(
        '确认删除？',
        'Warning',
        {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).then(()=>{
    http.post("/comment/delete",{
            id : comment.id,
            articleId : comment.article_id,
            userId :comment.user_id,
            repliedId:comment.replied_id,
            content : comment.content,
            releaseTime : comment.release_time,
        }).then((res:any)=>{
            emit("update")
        })
      })

}
onMounted(()=>{
    
})
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
</script>

<template>
    <div id="content">
        <div class="top">
            <div class="top_left">
            <el-avatar icon="el-icon-user-solid"  :src="data.avatar"></el-avatar>
            
            <div class="info">
                    <router-link :to="'/blog/'+data.username" class="author">
                        {{data.username}}
                    </router-link>
                    <div class="date">
                        <div>{{dateFormat("YYYY年mm月dd日 HH:MM:SS",parseInt(data.release_time))}}</div>
                    </div>
            </div>
            </div>
            <div style="display: flex;">
                <div class="delete" @click="_delete" v-if="isCurrentUser">删除</div>
                <div class="reply author" @click="openReply">回复</div>
            </div>

            
        </div>
        <div class="bottom">
            <div class="conment">
                {{data.content}}
            </div>
            <div class="operation">

            </div>
        </div>
 <!--    <transition name="el-zoom-in-top">
            <comment-editor :type="true" v-if="isEditing" :reply-id="1"></comment-editor>
        </transition>
-->   
        
    </div>
</template>

<style scoped>

.top{
    display: flex;
    margin-bottom: 10px;
    justify-content: space-between;
    align-items: flex-end;
}
.top_left{
    display: flex;
    justify-content: center;
    align-items: flex-end;
}
.info{
    display: flex;
    justify-content: center;
    flex-direction: column;
    margin-left: 10px;
}
.reply{
    font-size: 15px !important;
    cursor: pointer;
}
.delete{
    margin-right: 10px;
    font-size: 15px !important;
    cursor: pointer;
    color: red;
    font-weight: bold;
    text-decoration: none;
}

.delete:hover{
    text-decoration: underline;
}
.author{
    color: #409EFF;
    font-weight: bold;
    text-decoration: none;
}
.date{
    font-size: 12px;
    color: gray;

}
.author:hover{
    text-decoration: underline;
}
.date{
    display: flex;
    justify-content: space-between;
}
#content{
    border: 1px solid rgb(219, 219, 219);
    border-radius: 4px;
    border-style: dashed;
    margin: 5px 0px;
    padding: 10px 10px;
}
.conment{
    margin: 5px 0px;
}
.conment{
    padding: 10px;
    border-radius: 4px;
    background-color: #ecf5ff;
    color: rgb(0, 71, 202)
    }

</style>