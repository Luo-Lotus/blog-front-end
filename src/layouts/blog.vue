<script setup lang="ts">
import ArticleList from "../views/blog/article_list/articleList.vue";
import { computed, onMounted,getCurrentInstance,ComponentInternalInstance } from "vue";
import { useRoute,RouteLocationNormalized } from "vue-router";
import Right from "../views/blog/right.vue";
import Fixed from "../views/component/fixed.vue";

const isCheckin = computed(()=>$route.params.articleid==null)
const $route:RouteLocationNormalized = useRoute()
const self = getCurrentInstance();


</script>

<template>
<div class="content">
    <div class="left" style="margin-bottom:20px;">

        <router-view v-if="!isCheckin"></router-view>
        <ArticleList v-else></ArticleList>
    </div>

    <div class="right">
    <el-Affix :offset="20">
        <Right></Right>
    </el-Affix>

</div>
</div>


</template>

<style scoped>
    .content{
        display: flex;
        justify-content: center;
        flex-wrap:wrap-reverse;
    }
    .left{
        width: 1000px;
    }
    .right{
        width: 200px;
    }
    .box{
        height: 100px;
        background-color: aqua;
    }
    @media screen and (max-width: 1280px){
        .left{
            width: 100%;
        }
        .right{
            width: 100%;
            margin-bottom: 20px;
        }
    }
</style>