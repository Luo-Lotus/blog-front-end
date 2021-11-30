<script setup lang="ts">import { alertProps, ElMessage} from "element-plus";
import { useRouter } from "vue-router";
import { getCurrentInstance, reactive, ref,ComponentInternalInstance } from "vue";
import http from "../../axios/http"

const self:any = getCurrentInstance()

const passwordRule = (rule, value, callback)=>{
    var pwdRegex = new RegExp('(?=.*[0-9])(?=.*[a-zA-Z]).{9,15}');
    if (!pwdRegex.test(value)) {
        callback(new Error('密码应该包含数字和字母'))
    }else{
        callback()
    }
}
const confirmPasswordRule = (rule, value, callback)=>{
    if(value!=form.value.password){
        callback(new Error("两次密码输入不一致"))
    }else{
        callback()
    }
}
const router = useRouter()
const form = ref({
    mail:"",
    username:"",
    password:"",
    confirmPassword:"",
})
const rules = ref({
    username:[
        {
            required:true,
            message: '请输入用户名',
            trigger: 'blur',
        },
        {
            min: 1,
            max: 10,
            message: '用户名长度为1-10',
            trigger: 'blur',
        },
    ],
    mail:[
        {
            required: true,
            message: '请输入邮箱',
            trigger: 'blur',
        },
        {
            type:"email",
            message:"邮箱格式错误",
            trigger: 'blur',
        }
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
        },
        {
            validator:passwordRule,
            trigger:"blur"
        }
    ],
    confirmPassword:[
        {
            required:true,
            message: '请再次输入密码',
            trigger: 'blur',
        },
        {
            validator:confirmPasswordRule,
            message: '两次密码输入不一致',
            trigger: 'blur',
        }
    ]
})
const isSubmit = ref(false)
const onSubmit = ()=>{
    
    isSubmit.value = true
    self.refs.ruleForm.validate((valid:boolean) => {
        if (valid) {
            register()
        } else {
          isSubmit.value = false
        }
      })


    
}
const register = ()=>{
    http.post("/user/register",{
            username:form.value.username,
            email:form.value.mail,
            password:form.value.password,
            createTime:(new Date()).valueOf()
        }
    ).then((res:any)=>{
        if(res.data.code == "-1"){
            ElMessage({
                type:"error",
                message:res.data.msg
            })
        }else{
            router.push("/login")
            ElMessage({
                type:"success",
                message:res.data.msg
            })
        }
    }).finally(()=>{
        isSubmit.value = false
    })
}


</script>
<template>

    <div class="content">
        
        <el-form
            ref="ruleForm"
            class="page"
            label-position="left"
            label-width="100px"
            :model="form"
            style="text-align: center"
            :rules = "rules"
        >
            <h3>注册</h3>
            <el-form-item label="用户名" prop="username">
            <el-input v-model="form.username"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="mail">
            <el-input v-model="form.mail"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
            <el-input v-model="form.password" show-password></el-input>
            </el-form-item>

            <el-form-item label="确认密码" prop="confirmPassword">
            <el-input v-model="form.confirmPassword" show-password></el-input>
            </el-form-item>
            <el-button type="primary" round style="width: 100% !important;" @click="onSubmit" :loading="isSubmit">注册</el-button>
            
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


</style>

