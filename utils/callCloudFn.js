
const getAccessToken = require("../utils/getAccessToken.js")
const rp = require("request-promise")
/*
    请求云函数的封装方法

*/
const callCloudFn =async (ctx,fnName,params) =>{
    //拿到access_token
    const access_token =await getAccessToken()
    
    var options = {
        method: 'POST',
        uri: `https://api.weixin.qq.com/tcb/invokecloudfunction?access_token=${access_token}&env=${ctx.state.ENV}&name=${fnName}`,
        body: {
            ...params
        },
        json: true 
    };
    
    return await rp(options)
        .then((res) =>{
            // console.log(res)
            return res
        })
        .catch(function (err) {
            // POST failed...
    });
    
}
module.exports = callCloudFn