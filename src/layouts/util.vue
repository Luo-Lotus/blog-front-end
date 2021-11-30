<script setup lang='ts'>
import {ref} from 'vue'
import axios from "axios"
const data= ref({})
const onclick = ()=>{
    axios.get("/api/execute/public/index.php/exhibit/post/lst?row=50000&pr_id=a6d5e9f8-556d-11ea-a6f1-54ab3a1bebd3",
    ).then((res:any)=>{
        console.log(res);
        
    })
}
</script>

<template>
    <button @click="onclick">请求</button>
    {{data}}
</template>

<style>
 
</style>