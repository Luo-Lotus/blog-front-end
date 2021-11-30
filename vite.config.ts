import { build, defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import prismjs from 'vite-plugin-prismjs'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(),
    prismjs({
      languages: 'all'
    })],
  server:{
    host:'0.0.0.0',
    proxy:{
      '/api': {
        target: 'http://222.209.223.235:20814',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      },
    }
  },
  base:"/lotus/",
})
