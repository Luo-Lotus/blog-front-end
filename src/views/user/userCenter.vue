<script setup lang='ts'>
import { onBeforeMount,ref,computed } from 'vue';
import { ElMenu, ElMessage } from 'element-plus';
import { useRoute, useRouter } from 'vue-router';
import http from "../../axios/http"
const route = useRoute()
const router = useRouter()
const userInfo = ref({
    avatar: "",
    createTime: "",
    email: "",
    id: 0,
    signature: "",
    username: "",
})

//头像模块
const getUploadUrl = computed(()=>http.defaults.baseURL+'/image/uploadAvatar')

const changeAvatarVisiable = ref(false)
const handleAvatarSuccess = (res)=>{
      if (res.code=="0") {
        ElMessage({
            type:"success",
            message:"更改成功"
        })
        update()
      }else{
        ElMessage({
            type:"success",
            message:"更改失败"
        })
      }
}
const beforeAvatarUpload = (file)=>{
    const isJPG = file.type === 'image/jpeg'||file.type === 'image/png'
    const isLt2M = file.size / 1024 / 1024 < 2

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
onBeforeMount(()=>{
    update()
})
const update = ()=>{
    const username = route.params.username
    http.get(http.defaults.baseURL+"/user/getUserInfoByToken",
    ).then((res:any)=>{
        if(res.data.code=="0" && res.data.data.username == username){
            userInfo.value = res.data.data 
            form.value.username = userInfo.value.username
            form.value.signature = userInfo.value.signature
        }else{
            router.push("/login")
        }
    })
}
//信息模块
const form = ref({
    username:'',
    signature: '',
})
const rules = ref({
    
})
const onSubmit=()=>{
    http.post("/user/update",{
        username:form.value.username,
        signature:form.value.signature,
        id:userInfo.value.id
    }).then((res:any)=>{
        if(res.data.code=="0"){
            ElMessage({
                type:"success",
                message:"修改成功"
            })
            update()
        }else{
            ElMessage({
                type:"error",
                message:res.data.msg
            })
        }
    })
}
</script>

<template>
    <div class="content">
        <el-upload
            :action="getUploadUrl"
            :data="{username:route.params.username}"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
            <el-tooltip
                class="item"
                effect="light"
                content="点击修改头像"
                placement="top-start">
                <div class="avatar">

                    <el-avatar :src="userInfo.avatar" icon="el-icon-user-solid" :size="100" shape="square"></el-avatar>
                    <div class="outer-line">
                        
                    </div>
                
                </div>

            </el-tooltip>

        </el-upload>
        <el-form class="form" :model="form" ref="Form" :rules="rules" label-width="80px" label  size="mini">
            <el-form-item label="用户名" prop="username">
                <el-input v-model="form.username" size="medium"></el-input>
            </el-form-item>
            <el-form-item label="个性签名" prop="signature">
                <el-input v-model="form.signature" size="medium" type="textarea"></el-input>
            </el-form-item>
                <el-button type="primary" @click="onSubmit">修改</el-button>
        </el-form>
        
    </div>

</template>

<style scoped>
.content{
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    box-sizing: border-box;
    max-width: 1200px;
    width: 100%;
    margin: 0 auto;
    padding: 20px;
    background-color: white;
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04)
}
.avatar{
    cursor: pointer;
    position: relative;
    height: 100px;
}
.avatar .outer-line{
    position: absolute;
    top: 0;
    left: 0;
    width: 100px;
    height: 100px;
    opacity: 0;
    transition: all 0.5s;
}
.avatar .outer-line:hover{
    opacity: 1;
    box-shadow: inset 0px 0px 39px 10px rgba(0, 163, 204,0.5);
    border-radius: 4px;
}
.form{
    margin-top: 30px;
}
</style>