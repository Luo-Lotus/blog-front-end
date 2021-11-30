<script setup lang='ts'>
import { ElMessage, ElMessageBox } from "element-plus";
import { useRoute, useRouter } from "vue-router";
import { computed, getCurrentInstance, inject, onMounted, ref,reactive,ComponentInternalInstance,onBeforeMount } from "vue";   
import { useStore } from "_vuex@4.0.2@vuex";
import http from "../../../axios/http"
const route = useRoute()
const router =useRouter()
const store =useStore()
const self = getCurrentInstance()
const titles = ref([])
const isCurrentUser = computed(()=>route.params.userid == store.state.currentUserInfo.username)
const props = defineProps<{
       parent:any
}>()

onMounted(()=>{
})
const update = ()=>{
  setTimeout(()=>{
  titles.value = getTitleList();
  },200)
}
const edit = ()=>{
  router.push("/edit/"+route.params.articleid)
}
const _delete = ()=>{
  
    ElMessageBox.confirm(
        '确认删除?',
        'Warning',
        {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).then(()=>{
            http.get("/article/delete",{
                params:{articleid:route.params.articleid},
            }).then((res:any)=>{
                    if(res.data.code == "0"){
                        ElMessage({
                        type:"success",
                        message:res.data.msg
                        
                    })
                    router.go(-1)
                    }else{
                        ElMessage({
                        type:"error",
                        message:res.data.msg})
                    }
                
            })
      })

}

const getTitleList = ():{title: string;lineIndex: string | null;indent: number;}[]=>{
  
    const anchor:HTMLHeadingElement[] = props.parent.refs.preview.$el.querySelectorAll('h1,h2,h3,h4,h5,h6');

    const titles = Array.from(anchor).filter((title:HTMLHeadingElement) => !!title.innerText.trim());
    
    if (!titles.length) {
      return [];
    }
    const hTags = Array.from(new Set(titles.map((title) => title.tagName))).sort();
    

    const value = titles.map((el) => ({
      title: el.innerText,
      lineIndex: el.getAttribute('data-v-md-line'),
      indent: hTags.indexOf(el.tagName),
    }));
    return value;
}
const handleAnchorClick = (anchor:any)=>{
      const preview = props.parent.refs.preview;
      
      const { lineIndex } = anchor;
      const heading = preview.$el.querySelector(`[data-v-md-line="${lineIndex}"]`);

      if (heading) {
        preview.scrollToTarget({
          target: heading,
          scrollContainer: window,
          top: 60,
        });
      }
    }
defineExpose({
  update,
  titles
})
</script>


<template>
    <div id="contents" ref="contents" >
        <div class="manage" v-if="isCurrentUser">
          <el-button type="success" plain size="mini" @click="edit" style="width:100% !important">修改</el-button>
          <div style="height: 10px;"></div>
          <el-button type="danger" plain size="mini" @click="_delete" style="width:100% !important">删除</el-button>
          <el-divider direction="horizontal" content-position="left"></el-divider>
        </div>
      
       <div
        class="a"
        v-for="anchor in titles"
        :style="{ padding: `5px 0 5px ${anchor.indent * 15}px` }"
        @click="handleAnchorClick(anchor)"
        >
        <a style="cursor: pointer">{{ anchor.title }}</a>
        </div>


    </div>
  
</template>

<style scoped>
    .a{
        color: #409eff;

    }
    .a:hover{
        text-decoration: underline;
    }
    #contents{
        width: 100%-20px;
        background-color: white;
        box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
        border-radius: 4px;
        padding: 20px;
    }
    .content_fix{
        position:fixed;
        top: 20px;
    }
</style>