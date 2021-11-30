<script setup lang='ts'>
import { computed, onMounted, ref, watch } from "vue";
import { useStore } from "_vuex@4.0.2@vuex";
const store = useStore()
const fixed = ref(false)
const windowHeight = ref(window.innerHeight)
const props = defineProps({ 
    top:{
        type:Number,
        required: true,
        default:60
    }
})

const getHight = computed(()=>windowHeight.value-40+'px')
watch(()=>store.state.scrollTop,(val,old)=>{
    windowHeight.value = window.innerHeight
    if(val>props.top){ 
        fixed.value = true
        
    }else{
        fixed.value = false
    }
    
    
},{deep:true})

onMounted(()=>{
    
})






</script>

<template>
    <div :class="fixed?'box_fix':''">
        <el-scrollbar id="fixed" :max-height="getHight">
            <slot></slot>
        </el-scrollbar>
    </div>



</template>

<style scoped>
    #fixed{
        border-radius: 4px !important;
        box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04)
    }

    @media screen and (min-width:1280px) {
        .box_fix{
            width: 200px;
            position: fixed;
            top: 20px;
        }
    }


</style>