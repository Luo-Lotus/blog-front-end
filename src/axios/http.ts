import axios_ from "axios";

const axios = axios_.create(
{   headers: {
    'Content-Type': "application/json;charset=utf-8"
  }}
)
//https://nanotus.cn/lotusapi
//http://lllotus.tpddns.cn:8888
//http://localhost:8081
axios.defaults.baseURL = "https://nanotus.cn/lotusapi"; // 配置axios请求的地址

axios.interceptors.request.use(config=>{
    const token = localStorage.getItem("token")
    if(token){
        config.headers.authorization = token;
    }
    return config
})
axios.interceptors.response.use(response=>{
    const data:any = response.data
    const token = response.headers.authorization
    if(token){
        localStorage.setItem("token",token)
    }
    if(data.code == "-2"){
        localStorage.removeItem("token")
        localStorage.removeItem("user")
    }
    return Promise.resolve(response)
})

export default axios