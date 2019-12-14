const getAccessToken = require("../utils/getAccessToken.js")
const rp = require("request-promise")
const fs = require("fs")

/**
 * 
 * @param {*} ctx 上下文
 * @param {*} fnName 是要操作上传还是下载
 * @param {*} fileList 提交数据
 */
const callCloudStorage = {
    async download(ctx,fnName,fileList){
        const ACCESS_TOKEN = await getAccessToken()
        
        const options = {
            method: 'POST',
            uri: `https://api.weixin.qq.com/tcb/${fnName}?access_token=${ACCESS_TOKEN}`,
            body: {
                file_list:fileList,
                env: ctx.state.ENV,
            },
            json: true // Automatically stringifies the body to JSON
        }

        return await rp(options)
            .then((res) => {
                return res
            })
            .catch(function (err) {
                console.log(err);
            })
    },

    async uploading(ctx){
        const ACCESS_TOKEN = await getAccessToken()
        //取到文件名
        let file = ctx.request.files.file
        //拼接文件名存进云存储
        let path = `swiperImg/${Date.now()}-${Math.random()}.${file.name}`
        
        const options = {
            method: 'POST',
            uri: `https://api.weixin.qq.com/tcb/uploadfile?access_token=${ACCESS_TOKEN}`,
            body: {
                path,
                env: ctx.state.ENV,
            },
            json: true // Automatically stringifies the body to JSON
        }
        //返回的参数
        let res = await rp(options)
            .then((res) => {
                return res
            })
            .catch(function (err) {
                console.log(err);
            })
        //定义参数，存到云存储
        let parmrs = {
            method:'POST',
            headers:{
                'content-type': 'multipart/form-data'
            },
            uri:res.url,
            formData:{
                key:path,
                Signature:res.authorization,
                'x-cos-security-token':res.token,
                'x-cos-meta-fileid':res.cos_file_id,
                file:fs.createReadStream(file.path) //解析成二进制（规定要二进制）
            },
            json:true
        }
        await rp(parmrs)
        return res.file_id
    },

    async del(ctx,fileid){
        const ACCESS_TOKEN = await getAccessToken()
        const options = {
            method: 'POST',
            uri: `https://api.weixin.qq.com/tcb/batchdeletefile?access_token=${ACCESS_TOKEN}`,
            body: {
                fileid_list:[fileid],
                env: ctx.state.ENV,
            },
            json: true // Automatically stringifies the body to JSON
        }
        //返回的参数
        let res = await rp(options)
            .then((res) => {
                return res
            })
            .catch(function (err) {
                console.log(err);
            })

        return res
    }
}
module.exports = callCloudStorage