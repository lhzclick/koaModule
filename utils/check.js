//  拦截器-- token

// const Promise = require("bluebird");
// const jwt = require("jsonwebtoken");
// const verify = Promise.promisify(jwt.verify);
// let secret = 'jwt demo'


// jwt
const jwt = require('jsonwebtoken')
const secret = 'jwt demo'

async function check(ctx, next) {
    let url = ctx.request.url;
    if(url == "/login"||url == "/sendCode"||url == "/register"||url == "/modify"||url.indexOf("/sendMail")!=-1 ) {
        await next();
    }else {
        // let token = ctx.header.token;
        // if(token){
        //     let payload = await verify(token,secret);
        //     let {time, timeout} = payload;
        //     let dataTime = new Date().getTime();
        //     if(dataTime - time <= timeout) {
        //         //存在且未过期
        //         await next()
        //     }else{
        //         //过期
        //         ctx.body = {
        //             err: -1,
        //             msg:'token 已过期'
        //         };
        //     }
        // }else{
        //     ctx.body = {
        //         err: -1,
        //         msg:'token不存在，请重新登录'
        //     };
        // }        


        const token = ctx.header.token
        if (token) {
            // token校验通过
            try {
                let decode = jwt.verify(token, secret)
                await next()
            } catch (err) {
                // token校验未通过
                ctx.body = {
                    msg: 'token 错误',
                    err: -101
                }
            }
        } else {
            // token 不存在
            ctx.body = {
                msg: 'token不存在',
                err: -101
            }
        }
    }
}

module.exports = check