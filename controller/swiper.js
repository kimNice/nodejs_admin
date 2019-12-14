const Router = require("koa-router")
const router = new Router()
const callCloudDB =require("../utils/callCloudDB.js")
const callCloudStorage = require("../utils/callCloudStorage.js")
/**
 * 得到数据库轮播数据 一次默认只能获取10条
 * 
 */
router.get("/getSwiper",async (ctx,next) =>{
    //获取轮播fileid
    const query = `db.collection("swiper").get()`
    const res = await callCloudDB(ctx,'databasequery',query)
    //将获取的数据重新规定数据格式
    let fileList = []
    for(let i = 0,len = res.data.length; i < len; i++){
        fileList.push({
            fileid:JSON.parse(res.data[i]).fileId,
            max_age:7200
        })
    }
    //将规定好的去下载文件，返回的格式https格式的图片,方便前端访问
    const jsonFileId = await callCloudStorage.download(ctx,'batchdownloadfile',fileList)
    //重新规定格式返回到前端
    let data = []
    for(let i = 0,len = jsonFileId.file_list.length;i < len; i++){
        data.push({
            _id:JSON.parse(res.data[i])._id,
            fileid:jsonFileId.file_list[i].fileid,
            url:jsonFileId.file_list[i].download_url
        })
    }
    ctx.body = {
        data,
        code:20000
    }
})

router.post("/upload",async (ctx,next) =>{
    //拿到fileid 存进数据库
    let fileId = await callCloudStorage.uploading(ctx)
    let query = `db.collection('swiper').add({
        data:{
           fileId:'${fileId}'
        }
    })`
    const res =await callCloudDB(ctx,'databaseadd',query)
    //返回id
    ctx.body = {
        code:20000,
        data:res
    }
})

router.post("/del",async (ctx,next) =>{
    // console.log()
    let id = ctx.request.query.id
    let bkdel = await callCloudStorage.del(ctx,id);
    let query = `db.collection('swiper').where({fileId:"${id}"}).remove()`;
    let msg = {
        code:0
    }
    let res = await callCloudDB(ctx,'databasedelete',query)
    if(bkdel.errcode == 0 && res.deleted>0){
        msg.code = 0
        msg.storeStatus = '删除成功'
    }else{
        msg.code = 200
        msg.storeStatus = bkdel.errcode == 0 ? '云存储删除失败':'数据库删除失败';
    }

    ctx.body = {
        code:20000,
        data:msg
    }
})

module.exports = router