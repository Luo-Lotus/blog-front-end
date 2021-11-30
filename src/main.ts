import{createApp} from 'vue'
import Vue from 'vue'
import App from './App.vue'
import router from './router/index'
import ElementPlus from 'element-plus'
import 'element-plus/theme-chalk/index.css';
import './assets/font/font_f4yhwojjm8/iconfont.css'
import markdwon from './plugs/editor'
import Vuex from './store/index'


createApp(App).use(router).use(ElementPlus).use(markdwon.VMdPreview).use(Vuex).use(markdwon.VueMarkdownEditor).mount('#app')