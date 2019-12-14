const Router = require("koa-router")
const router = new Router()
const callCloudDB =require("../utils/callCloudDB.js")

router.get("/list",async (ctx,next)=>{
    let parmas = ctx.request.query
    // console.log(parmas)
    let query = `db.collection("blog").skip(${parmas.start}).limit(${parmas.count}).orderBy("createTime",'desc').get()`
    let data = await callCloudDB(ctx,'databasequery',query)
    ctx.body = {
        code:20000,
        data
    }
})
module.exports = router