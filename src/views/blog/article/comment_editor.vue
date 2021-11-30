<script setup lang='ts'>
import { ElMessage } from "element-plus";
import { useRoute } from "vue-router";
import { computed, getCurrentInstance, onMounted, ref, watch } from "vue";
import http from "../../../axios/http"
const self = getCurrentInstance();
const route = useRoute()
const text =ref("")
const props = defineProps<{
    type:boolean,
    article:{
        id: number,
        userId: number,
    }
}>()
const emit = defineEmits(["update"])

onMounted(()=>{
    
    
})

const onSubmit = ()=>{
    if(text.value.length<10){
        ElMessage({
            type:"warning",
            message:"必须大于10个字"
        })
    }else{
        http.post("/comment/add",{
            content:text.value,
            articleId:props.article.id,
            userId:JSON.parse(localStorage.getItem("user")).id,
        }).then((res:any)=>{
            if(res.data.code=="0"){
                ElMessage({
                    type:"success",
                    message:"发布成功"
                })
            }else{
                ElMessage({
                    type:"error",
                    message:"发布失败"
                })
            }
            text.value = ""
            emit("update")
        })
    }
    
}
</script>

<template>
<div class="content1">
    <div class="info">
        <div class="left">{{props.type?"回复":"评论"}}</div>
        <div class="btn">
            <el-button type="primary" @click="onSubmit" size="mini" round>提交</el-button>
        </div>
        
        
    </div>
    <el-input v-model="text" :rows="3" type="textarea"></el-input>
</div>


</template>

<style scoped>
.info{
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 5px;
}
.content1{
    padding: 5px 0px;
}
</style>