<script setup lang="ts">
import http from "../../../axios/http"
import { ElMessage,ElMessageBox } from "element-plus";
import { useRoute, useRouter } from "vue-router";
import { computed, getCurrentInstance, onMounted, ref } from "vue";
import { useStore } from "_vuex@4.0.2@vuex";
const emit = defineEmits(["change"])
const list = ref([{
    classificationName: "",
    id: 0,
    userId: 0,
}])
const {proxy} = getCurrentInstance()
const router = useRouter()
const store = useStore()
const route = useRoute()
const username =route.params.userid
const currentClassification = ref(0)
const addClassificationText = ref("")
const isCurrentUser = computed(()=>route.params.userid == store.state.currentUserInfo.username)
const isManage = ref(false)
const change= (item,index)=>{
    currentClassification.value = index
    emit("change",item)
}
const add = ()=>{
    const text = addClassificationText.value
    if(text == "" || text.length >10){
        ElMessage({
            type:"error",
            message:"非法输入"
        })
    }else{
        http.post("/classification/add",{
            classificationName:text,
            userId : store.state.currentUserInfo.id
        }).then((res:any)=>{
            if(res.data.code == "0"){
                ElMessage({
                type:"success",
                message:res.data.msg
            })
            update()
            }else{
                ElMessage({
                type:"error",
                message:res.data.msg})
            }
        })
    }

    addClassificationText.value = ""
}
const manageClick=()=>{
    isManage.value? list.value.unshift({
                id:-1,
                classificationName:"全部",
                userId:0
            }):list.value.shift()
    isManage.value = !isManage.value
}
const edit=(item)=>{
    ElMessageBox.prompt('请输出修改后的内容', '修改', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
      })
        .then(({ value }) => {
            if(value == "" || value.length >10){
                    ElMessage({
                        type:"error",
                        message:"非法输入"
                    })
                }else{
                    http.post("/classification/update",{
                        classificationName:value,
                        userId : item.userId,
                        id : item.id
                    }).then((res:any)=>{
                        if(res.data.code == "0"){
                            ElMessage({
                            type:"success",
                            message:res.data.msg
                        })
                        console.log(route.path);
                        update()
                        
                        }else{
                            ElMessage({
                            type:"error",
                            message:res.data.msg})
                        }
                    })
                }

        })
        .catch(() => {

        })
}
const _delete=(item)=>{
    ElMessageBox.confirm(
        '确认删除？删除后该分类下所有文章都将删除',
        'Warning',
        {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).then(()=>{
            http.post("/classification/delete",{
                id:item.id,
                classificationName:item.classificationName,
                userId:item.userId
            }).then((res:any)=>{
                    if(res.data.code == "0"){
                        ElMessage({
                        type:"success",
                        message:res.data.msg
                        
                    })
                    update()
                    }else{
                        ElMessage({
                        type:"error",
                        message:res.data.msg})
                    }
                
            })
      })
    
    
}
onMounted(()=>{
    update()
})
const update = ()=>{
        http.get("/classification/get?username="+username).then((res:any)=>{
            list.value = res.data.data
            if(list.value.length!=0 && !isManage.value){
                list.value.unshift({
                    id:-1,
                    classificationName:"全部",
                    userId:0
                })
            }
        })
}
</script>
<template>
    <div class="Classification">
        <div class="manage" v-if="isCurrentUser">
            <el-button type="primary" size="mini" @click="manageClick" style="width:100% !important">管理</el-button>
        </div>
        <div class="add-classification" v-if="isManage">
            <el-input id="input" v-model="addClassificationText" size="mini" label="" @keyup.enter="add" max="10" min="3"></el-input>
            <div style="width: 10px;"></div>
            <el-button type="primary"  plain size="mini" @click="add" >添加</el-button>
        </div>
        <div
         class="option"
          :class="index==currentClassification?'option-active':''"
           v-for="(item:any,index) in list"
            @click="change(item,index)">
            <div>{{item.classificationName}}</div>
            <div v-if="isManage">
                <el-button type="success" size="mini" @click="edit(item)" icon="el-icon-edit" circle></el-button>
                <el-button type="danger" size="mini" @click="_delete(item)" icon="el-icon-delete" circle></el-button>
            </div>

            
        </div>
        <el-empty description="该用户未设置分类" v-if="list.length==0"></el-empty>
        <div class="add">
            
        </div>
    </div>
</template>

<style scoped>
    .Classification{
        background-color: white;
        border-radius: 4px;
    }
    .option{
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px 20px;
        border-radius: 4px;
        transition: all 0.3s;
        cursor: pointer;

    }
    .option:hover{
        background-color: #ecf5ff;
    }
    .option-active{
        background-color: #ecf5ff;
    }
    .add-classification{
        display: flex;
        padding: 10px;
    }
    .manage{
        display: flex;
        padding: 10px;
    }
</style>