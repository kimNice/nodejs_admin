const Koa = require("koa")
const app = new Koa()
const Router = require("koa-router")
const router = new Router()
const cors = require("koa2-cors")
const koa_body = require("koa-body")

let ENV = "kimtest-12138-mf5ou"
/*
    route 是一条路由
    routes 是一组路由
    router 是路由管理
*/
app.use(cors({
    origin:['http://localhost:9528'],
    credentials:true
}))
//接收post请求
app.use(koa_body({
    multipart:true
}))
app.use( async (ctx,next)=>{
    ctx.state.ENV = ENV 
    await next()
})
//将controller接口声明入口文件，方便请求得到
const playlist = require("./controller/playlist.js")
router.use("/playlist", playlist.routes())
const swiper = require("./controller/swiper.js")
router.use("/swiper", swiper.routes())
const blog = require("./controller/blog.js")
router.use("/blog", blog.routes())
//将routes 进行声明
app.use(router.routes())
//允许所有请求方法
app.use(router.allowedMethods())




app.listen(3000,()=>{
    console.log("服务器启动3000")
})