const rq = require("request-promise")
const appID = 'wx4462e7ddde728e06'
const APPSECRET = '501d0a83f359a5a89b41d84cac3c2a63'
const url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appID}&secret=${APPSECRET}`
//获取相对地址
const path = require('path')
const fileName = path.resolve(__dirname,'./access_token.json')

const fs = require("fs")

/*
    resStr:请求拿到access_token
    res：解析成JSON
    
*/
const updateAccessToken = async () =>{
    const resStr = await rq(url)
    const res = JSON.parse(resStr)
    //有值就创建一个文件夹并且把值存进去，否则就重复运行方法
    if(res.access_token){
        fs.writeFileSync(fileName,JSON.stringify({
            access_token:res.access_token,
            createTime:new Date()
        }))
    }else{
        await updateAccessToken()
    }
}
/*
    readFile:获取文件 uft-8 返回格式能看懂
    readObj：解析成JSON
    createTime:获取JSON文件里存储的时间
    newTime：当前时间

*/
const getAccessToken = async () =>{
    //try 里面代码报错 就是获取不到文件，我们就直接再次重新更新token并获取
    try {
        const readFile = fs.readFileSync(fileName,'utf-8')
        const readObj = JSON.parse(readFile)
        const createTime = new Date(readObj.createTime).getTime()
        const newTime = new Date().getTime()
        //当前时间 - JSON文件时间来判断是否相差2小时
        if((newTime - createTime) / 1000 / 60 / 60 >= 2){
            await updateAccessToken()
            await getAccessToken()
        }
        return readObj.access_token
    }catch(e){
        await updateAccessToken()
        await getAccessToken()
    }
    
}
//每（2小时 - 5分钟）更新一次（有效期2小时提前5分钟更新）
setInterval(()=>{
    getAccessToken()
},(7200 - 300) * 1000)
//导出方法
module.exports = getAccessToken

