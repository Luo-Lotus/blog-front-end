import * as vueRouter from "vue-router";
const gameVue = ()=>import("../views/game/game1.vue");
const utilVue = ()=>import("../layouts/util.vue");
const addArticleVue =  ()=>import("../views/blog/editArticle/addArticle.vue");
const edit = ()=>import("../views/blog/editArticle/editArticle.vue")
const loginVue = ()=>import("../views/login/login.vue")
const blog = ()=>import("../layouts/blog.vue")
const article = ()=>import("../views/blog/article/article.vue")
const registerVue = ()=>import("../views/register/register.vue")
const blogHome = ()=>import("../layouts/blogHome.vue")
const center= ()=>import("../views/user/userCenter.vue")


const routes=[
    {
        path:"/login",
        component:loginVue,
        meta:{
            title:"登陆"
        }
    },
    {
        path:"/register",
        component:registerVue,
        meta:{
            title:"注册"
        }
    },
    {
        path:"/blog",
        component: blogHome,

    },
    {
        path:"/util",
        component:utilVue 
    },
    {
        path:"/game",
        component: gameVue
    },
    {
        path:"/center/:username",
        component:center
    },
    {
        path:"/blog/:userid",
        component:blog,
            children:[

                {
                    path: ':articleid',
                    component: article,
                },
        ]
    },
    {
        path:"/edit/:articleid",
        component:edit
    },
    {   path:"/edit",
    component:addArticleVue}
]

const router =  vueRouter.createRouter({
    history: vueRouter.createWebHistory("/lotus"),
    routes,
});

router.beforeEach((to, from) => {
    if(typeof to.meta.title == "string"){
        const title:string = to.meta.title;
        document.title = title
    }else{
        document.title = "博客"
    }
  })

export default router;