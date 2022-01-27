<script setup lang="ts">import { getCurrentInstance, onMounted, reactive, ref,ComponentInternalInstance } from "vue";
import http from "../../axios/http"
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";

const self:any = getCurrentInstance()
const router = useRouter()
const isSubmit = ref(false)
const form = ref({
    email:"",
    password:""
})

const rule = ref({
    email:[
        {
            required:true,
            message: '请输入邮箱',
            trigger: 'blur',
        },
        {
            required:"email",
            message: '邮箱格式错误',
            trigger: 'blur',
        },
    ],
    password:[
        {
            required:true,
            message: '请输入密码',
            trigger: 'blur',
        },
        {
            min: 9,
            max: 15,
            message: '密码长度为9-15',
            trigger: 'blur',
        }
    ]
})

const onSubmit = ()=>{
    isSubmit.value = true
    self.refs.Form.validate((valid) => {
        if (valid) {
            http.post("/user/login",form.value)
            .then(res=>{
                let data:any = res.data
                if(data.code == "0"){
                    ElMessage({
                        message:data.msg,
                        type:"success"
                    })
                    router.push("/blog/"+data.data.username).then(()=>{router.go(0)})
                }else{
                    ElMessage({
                        message:data.msg,
                        type:"error"
                    })
                }
                }).finally(()=>{
                isSubmit.value = false
            })
        } else {
            isSubmit.value = false
          return false
        }
      })


    
}
const QQLogin = ()=>{
    //@ts-ignore
    QC.Login.showPopup({
    appId:"101994216",
    redirectURI:"https://www.nanotus.cn/zhaomu/QQlogin"
    });
}

</script>
<template>

    <div class="content">
        
        <el-form
            ref="Form"
            class="page"
            label-position="left"
            label-width="100px"
            :model="form"

            :rules="rule"
            size="small"
        >
            <h3>登陆</h3>
            <el-form-item label="邮箱" prop="email">
            <el-input v-model="form.email"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
            <el-input v-model="form.password" show-password></el-input>
            </el-form-item>
            <el-form-item label="其他登陆">
                <el-button type="primary" size="mini" icon="../../assets/QQ.svg"  @click.prevent="QQLogin" :loading="isSubmit">
                    <div class="qqlogin"><img style="width:15px;height:15px;margin-right: 5px;" src="../../assets/QQ.svg">使用QQ登陆</div>
                </el-button>
                
            </el-form-item>
            <el-button type="primary" icon="../../assets/QQ.svg"  @click="onSubmit" :loading="isSubmit">登陆</el-button>
        </el-form>
            
    </div>

</template>
<style scoped>
.content{
    display: flex;
    justify-content: center;
}
.page{
    text-align: center;
    padding: 20px;
    background-color: white;
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04)

}
.qqlogin{
    display: flex;
    justify-content: space-evenly;
    align-items: center;

}

</style>

