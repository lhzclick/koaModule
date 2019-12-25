//      分数录入请求接口  
const router = require('koa-router')()
const userService = require('./mysqlConfig')
var cors = require('koa2-cors')
// jwt
const jwt = require('jsonwebtoken')
const secret = 'jwt demo'

//  图片上传
const multer=require('koa-multer') 

// 跨域解决
router.use(cors())

// 分数增加
router.post('/addScore', async (ctx, next) => {
    const r_body = ctx.request.body
    await userService.addScore(r_body)
        .then((data) => {
            if (r_body.name && r_body.age && r_body.sex && r_body.type) {
                ctx.body = {
                    code: 200,
                    msg: 'SUCCESS',
                    data: data
                }
            } else {
                ctx.body = {
                    err: -1,
                    msg: '请录入完整信息'
                }
            }
        }).catch((err) => {
            ctx.body = {
                err: -2,
                msg: err,
            }
        })
})
// 分数获取
router.post('/getScore', async (ctx, next) => {
    const r_body = ctx.request.body
    let _data = {}
    await userService.getScore(r_body)
        .then((data) => {
            if (r_body.pageNo && r_body.pageSize) {

                _data.list = data
            } else {
                ctx.body = {
                    err: -1,
                    msg: '请传入pageNo和pageSize',
                }
            }

        }).catch((err) => {
            ctx.body = {
                err: -2,
                msg: err,
            }
        })
    await userService.getTotal(r_body)
        .then((data) => {
            if (r_body.pageNo && r_body.pageSize) {

                _data.total = data[0]['COUNT(*)']
            } else {
                ctx.body = {
                    err: -1,
                    msg: '请传入pageNo和pageSize',
                }
            }

        }).catch((err) => {
            ctx.body = {
                err: -2,
                msg: err,
            }
        })
    ctx.body = {
        code: 200,
        msg: 'SUCCESS',
        data: _data
    }
})
// 分数删除
router.post('/deleteScore', async (ctx, next) => {
    const r_body = ctx.request.body
    await userService.deleteScore(r_body)
        .then((data) => {
            if (r_body.jobId) {
                ctx.body = {
                    code: 200,
                    msg: 'SUCCESS',
                    data: data
                }
            } else {
                ctx.body = {
                    err: -3,
                    msg: '请传入jobId',
                }
            }

        }).catch((err) => {
            ctx.body = {
                err: -2,
                msg: err,
            }
        })

})
// 分数编辑
router.post('/editScore', async (ctx, next) => {
    const r_body = ctx.request.body
    const len = Object.keys(r_body).length
    if (len > 1) {
        await userService.editScore(r_body)
            .then((data) => {
                if (r_body.jobId) {
                    ctx.body = {
                        code: 200,
                        msg: 'SUCCESS',
                        data: data
                    }
                } else {
                    ctx.body = {
                        err: -3,
                        msg: '请传入jobId',
                    }
                }

            }).catch((err) => {
                ctx.body = {
                    err: -2,
                    msg: err,
                }
            })
    } else {
        ctx.body = {
            err: -4,
            msg: '未传入修改参数',
        }
    }
})
// 测试类型查询
router.get('/subjectType', async (ctx, next) => {
    try{
        ctx.body = {
            code: 200,
            msg: 'SUCCESS',
            data: ['一单元测试','二单元测试','三单元测试','四单元测试','期中测试','五单元测试','六单元测试','七单元测试','八单元测试','期末测试']
        }
    }catch(err){
        ctx.body = {
            err: -1,
            msg: '网络错误',
        }
    }
})

// 用户头像上传
var storage = multer.diskStorage({
    //文件保存路径
    destination: function (req, file, cb) {
        cb(null, '../public/img/')              //  线上
        // cb(null, 'public/img/')                 //  本地
    },
    //修改文件名称
    filename: function (req, file, cb) {
        var fileFormat = (file.originalname).split(".");  //以点分割成数组，数组的最后一项就是后缀名
        cb(null,Date.now() + "." + fileFormat[fileFormat.length - 1]);
    }
})
//加载配置
var upload = multer({ storage: storage })
router.post('/uploadUser', upload.single('file'),async(ctx,next)=>{
    const r_body = ctx.req.body
    const filename = 'http://study_api.liuhu66.cn/img/'+ctx.req.file.filename   //  线上
    // const filename = 'http://localhost:6060/img/'+ctx.req.file.filename   //  本地

    const params = {
        url:filename,
        userName:r_body.userName
    }
    await userService.editUserImg(params)
        .then((data) => {
            if (r_body.userName) {
                ctx.body = {
                    code: 200,
                    msg: 'SUCCESS',
                    data: {
                        filename: filename
                    }
                } 
            } else {
                ctx.body = {
                    err: -2,
                    msg: '请传入userName',
                }
            }

        }).catch((err) => {
            ctx.body = {
                err: -1,
                msg: err,
            }
        })
})
module.exports = router