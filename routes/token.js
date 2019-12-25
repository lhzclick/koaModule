//      JSON WEB TOKEN 验证接口  
const router = require('koa-router')()
const userService = require('./mysqlConfig')
// var cors = require('koa2-cors')

// jwt
const jwt = require('jsonwebtoken')
const secret = 'jwt demo'
const sendMail = require('../utils/sendMail')

//  定义验证码 用于接口验证验证码是否匹配
let vCode = ''
let emailCode = ''

// 跨域解决
// router.use(cors())

// 登录
router.post('/login', async (ctx, next) => {
    const r_body = ctx.request.body
    await userService.login(r_body)
        .then((data) => {
            let isLogin = false
            let user_url = ''
            let userName = ''
            data.map((item, i) => {
                if ((item.userName == r_body.userName || item.tel == r_body.userName) && item.password == r_body.password) {
                    isLogin = true
                    user_url = item.url
                    userName = item.userName
                }
            })
            // 用户名，密码验证通过
            if (isLogin) {
                let userToken = {
                    userName: r_body.userName,
                    password: r_body.password
                }
                let payload = { userName: r_body.userName, time: new Date().getTime(), timeout: 1000 * 60 * 60 * 2 }
                const token = jwt.sign(payload, secret)
                ctx.body = {
                    code: 200,
                    msg: 'LOGIN SUCCESS',
                    data: {
                        token: token,
                        user_url: user_url,
                        userName: userName
                    }
                }
            } else {
                ctx.body = {
                    err: -1,
                    msg: '用户名或密码错误',
                }
            }

        }).catch((err) => {
            ctx.body = {
                err: -2,
                msg: err,
            }
        })
})

// 发送短信验证码
router.post('/sendCode', async (ctx, next) => {
    const r_body = ctx.request.body
    var QcloudSms = require("qcloudsms_js");
    // 短信应用 SDK AppID
    var appid = 1400282547;  // SDK AppID 以1400开头
    // 短信应用 SDK AppKey
    var appkey = "dfbbb5b298c0027553e32122c94e6f04";
    // 需要发送短信的手机号码
    var phoneNumbers = [r_body.tel+''];
    // 短信模板 ID，需要在短信控制台中申请
    var templateId = 463239;  // NOTE: 这里的模板ID`7839`只是示例，真实的模板 ID 需要在短信控制台中申请
    // 签名
    var smsSign = "刘胡前端经验";  // NOTE: 签名参数使用的是`签名内容`，而不是`签名ID`。这里的签名"腾讯云"只是示例，真实的签名需要在短信控制台申请
    // 实例化 QcloudSms
    var qcloudsms = QcloudSms(appid, appkey);
    // 设置请求回调处理, 这里只是演示，用户需要自定义相应处理回调
    function callback(err, res, resData) {
        if (err) {
            ctx.body = {
                err: -2,
                msg: err,
            }
        } else {
            vCode = params[0]
            ctx.body = {
                code: 200,
                msg: 'SEND SUCCESS',
                data: {
                    vCode: vCode
                }
            }
            // console.log("request data: ", res.req);
            // console.log("response data: ", resData);
        }
    }


    var ssender = qcloudsms.SmsSingleSender();
    let codeRandom = ''
    for (let i = 0; i < 4; i++) {
        codeRandom += Math.floor(Math.random() * 10)
    }
    var params = [codeRandom];
    if (r_body.tel) {
        ssender.sendWithParam("86", phoneNumbers[0], templateId,
            params, smsSign, "", "", callback);
    } else {
        ctx.body = {
            err: -1,
            msg: '参数错误',
        }
    }

})
// 发送邮件
router.post('/sendMail', async (ctx, next) => {
    const r_body = ctx.request.body
    if (r_body.mail) {
        let codeRandom = ''
        for (let i = 0; i < 4; i++) {
            codeRandom += Math.floor(Math.random() * 10)
        }
        await sendMail(r_body.mail,'草上飞', `草上飞：您的验证码是【${codeRandom}】，如需关闭请联系草上飞CEO：MS.he，联系电话：13129986283`).then((data)=>{
            ctx.body = {
                code: 200,
                msg: 'SEND SUCCESS',
                data: {
                    emailCode: emailCode
                }
            }
        }).catch(err=>{
            ctx.body = {
                err: -1,
                msg: err
            }
        })
    } else {
        ctx.body = {
            err: -1,
            msg: '参数错误',
        }
    }
    
})

// 注册
router.post('/register', async (ctx, next) => {
    const r_body = ctx.request.body
    if(r_body.tel&&r_body.userName&&r_body.password&&r_body.vCode){
        // 验证匹配
        if (vCode == r_body.vCode) {
            await userService.register(r_body)
                .then((data) => {
                    ctx.body = {
                        code: 200,
                        msg: '注册成功',
                        data: {}
                    }

                }).catch((err) => {
                    ctx.body = {
                        err: -3,
                        msg: err,
                    }
                })
        } else {
            ctx.body = {
                err: -2,
                msg: '验证码错误'
            }
        }
    }else{
        ctx.body = {
            err: -1,
            msg: '参数错误'
        }
    }
    

})

// 修改密码
router.post('/modify', async (ctx, next) => {
    const r_body = ctx.request.body
    if(r_body.password&&r_body.vCode){
        // 验证匹配
        if (vCode == r_body.vCode) {
            await userService.register(r_body)
                .then((data) => {
                    ctx.body = {
                        code: 200,
                        msg: '密码修改成功',
                        data: {}
                    }

                }).catch((err) => {
                    ctx.body = {
                        err: -3,
                        msg: err,
                    }
                })
        } else {
            ctx.body = {
                err: -2,
                msg: '验证码错误'
            }
        }
    }else{
        ctx.body = {
            err: -1,
            msg: '参数错误'
        }
    }
    

})



//  jwt测试接口
router.post('/userInfo', async (ctx, next) => {
    ctx.body = {
        message: 'success',
        code: 200
    }
    // const token = ctx.header.token  // 获取jwt
    // if (token) {
    //     try{
    //         let decode = jwt.verify(token, secret)
    //         ctx.body = {
    //             message: 'success',
    //             code: 200
    //         }
    //     }catch(err){
    //         ctx.body = {
    //             message: 'token 错误',
    //             code: -2
    //         }
    //     }

    // } else {
    //     ctx.body = {
    //         message: 'token 错误',
    //         code: -1
    //     }
    // }
})




module.exports = router