<script setup lang='ts'>
import {ref,onBeforeMount,computed} from "vue"
import { ElMessage } from "element-plus"
import { useRoute, useRouter } from "vue-router"
import { useStore } from "_vuex@4.0.2@vuex"
import http from "../../../axios/http"
const router = useRouter()
const route = useRoute()
const store = useStore()
let user:any = localStorage.getItem("user")
const articleId = route.params.articleid
const currentSelect = ref("");
const classifications= ref([{
    classificationName:"",
    id:0,
    userId:0,
}])
const data = ref({
    articleContent: "",
    classificationId: 0,
    id: 0,
    releaseTime: "",
    summary: "dd",
    tags: [],
    title: "",
    userId: 0,
    tagString:""
})

onBeforeMount(()=>{
    if(!user){
        router.push("/login")
        ElMessage({
            type:"warning",
            message:"请先登录"
        })
    }else{
        user = JSON.parse(user)
        http.get("/classification/get?username="+user.username).then((res:any)=>{
            classifications.value = res.data.data
            get()
        })
const get = () => {
        http.get("/article/get",{
        params:{
            articleid:route.params.articleid
        }
        }).then((res:any)=>{
            data.value = res.data.data.article
            data.value.tagString = data.value.tags.join(" ")
            const classification_id = data.value.classificationId
            currentSelect.value = classifications.value.find(x=>x.id == classification_id).classificationName
        })
}
        }
    if(!articleId){
        
    }
})
const onSubmit = ()=>{
    save().then(x=>router.push("/blog/"+user.username+"/"+articleId))
}
const saveBtn = ()=>{
    save().then(x=>{})
}
const save = ()=>{
    return new Promise((resolve,reject)=>{
    if(currentSelect.value==""||data.value.articleContent==""||data.value.summary==""||data.value.title==""){
        ElMessage({
            type:"error",
            message:"内容不完整"
        })
    }else{
        const classification = classifications.value.filter(x=>x.classificationName==currentSelect.value)
        data.value.classificationId = classification[0].id
        data.value.tags = data.value.tagString.split(" ")
        http.post("/article/update",data.value).then((res:any)=>{
            if(res.data.code=="0"){
                ElMessage({
                    type:"success",
                    message:"保存成功"
                })
                resolve(res)
            }else{
                ElMessage({
                    type:"error",
                    message:"提交失败"
                })
            }
        
        }).catch(res=>reject(res))
    }
})}
const change = (data)=>{
    console.log(currentSelect.value);
}

//图片上传部分
const handleUploadImage= (event:Event, insertImage, files:File)=>{
    if(checkImage(files[0])){
        let param = new FormData()
        param.append('file', files[0])
        http.post('/image/upload', param,{
        headers: {'Content-Type': 'multipart/form-data'}
    })
        .then((res:any) => {
          if (res.data.code === "0") {
            insertImage({
                url: res.data.data,
                desc: 'img',
                width: '100%',
                height: 'auto',
            });
          }else{
            ElMessage({
                type:"error",
                message:"上传失败"
            })
          }
        })
    }
}
const checkImage = (files:File)=>{
    
    const isJPG = files.type === 'image/jpeg'||files.type === 'image/png'
    const isLt2M = files.size / 1024 / 1024 < 2
      if (!isJPG) {
        ElMessage({
            type:"warning",
            message:"请上传图片"
        })
      }
      if (!isLt2M) {
        ElMessage({
            type:"warning",
            message:"图片大小应小于2M"
        })
      }
      return isJPG && isLt2M
}
</script>

<template>
<div class="content">
    <div class="input"><div class="left">标题：</div><el-input v-model="data.title" placeholder=""  clearable @change=""></el-input>
    </div>
    <div class="input"><div class="left">摘要：</div><el-input v-model="data.summary" autosize type="textarea"  clearable @change=""></el-input>
    </div>
    <div class="input"><div class="left">标签：</div><el-input placeholder="每个标签请用空格隔开" v-model="data.tagString" autosize type="textarea" clearable @change=""></el-input>
    </div>
    <div class="input"><div class="left">分类：</div>
        <el-select v-model="currentSelect" @change="change">
            <el-option
            v-for="item in classifications"
            :key="item.id"
            :label="item.classificationName"
            :value="item.classificationName"
            >
            </el-option>
        </el-select>
    </div>
    <div class="left">正文：</div>
    <v-md-editor 
    :disabled-menus="[]"
    @upload-image="handleUploadImage"
    @save="saveBtn"
    v-model="data.articleContent" ></v-md-editor>
    <div style="padding: 10px 0;display: flex;justify-content: flex-end;">
    <el-button type="primary" @click="onSubmit">提交</el-button>
    
    </div>
    
</div>

</template>

<style scoped>
.input{
    display: flex;
    margin: 10px 0px;
}
.left{
    width: 50px;
    font-weight: bold;
    margin-bottom: 10px;
    color:#409EFF ;
}
.content{
    padding: 20px;
    background-color: white;
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04)
}
</style>