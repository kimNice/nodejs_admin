const Router = require("koa-router")
const router = new Router()
const callCloudFn = require("../utils/callCloudFn.js")
const callCloudDB =require("../utils/callCloudDB.js")

router.get("/list",async (ctx,next) =>{
    //拿到前台传来的值
    const query = ctx.request.query
    var options = {
        $url:"playlist",
        start:parseInt(query.start),
        count:parseInt(query.count)
    };
    //调用方法
    let adata=await callCloudFn(ctx,'music',options)
    //进行JSON解析
    // adata = JSON.parse(adata.resp_data).data
    //返回要加 code:20000 不然报错
    ctx.body = {
        data:JSON.parse(adata.resp_data).data,
        code:20000
    }
})
router.get("/edit",async (ctx,next) =>{
    //拿到前台传来的值
    const query = `db.collection("playlist").doc('${ctx.request.query.id}').get()`
    const res = await callCloudDB(ctx, 'databasequery', query)
    //返回要加 code:20000 不然报错
    ctx.body = {
        data:JSON.parse(res.data),
        code:20000
    }
})

router.post("/setEdit",async (ctx,next) =>{
    //拿到前台传来的值
    console.log(ctx.request.query)
    const query = `db.collection("playlist").doc('${ctx.request.query._id}').update({data:{
        name:'${ctx.request.query.name}',
        copywriter:'${ctx.request.query.copywriter}'
    }})`
    const res = await callCloudDB(ctx, 'databaseupdate', query)
    //返回要加 code:20000 不然报错
    ctx.body = {
        data:res,
        code:20000
    }
})

router.post("/deleteId",async (ctx,next) =>{
    //拿到前台传来的值
    console.log(ctx.request.query.id)
    const query = `db.collection("playlist").doc('${ctx.request.query.id}').remove()`
    const res = await callCloudDB(ctx, 'databasedelete', query)
    //返回要加 code:20000 不然报错
    ctx.body = {
        data:res,
        code:20000
    }
})

module.exports = router