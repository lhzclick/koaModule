const email = {
    service: 'QQ',
    // user: '392539910@qq.com',       //  你的邮箱
    // pass: 'gykfrumavkyabijh',       // 你的密码
    user: '569227299@qq.com',       //  你的邮箱
    pass: 'sbzctjmzggaybbaa',       // 你的密码
}
var nodemailer = require('nodemailer')
var smtpTransport = require('nodemailer-smtp-transport');
 
smtpTransport = nodemailer.createTransport(smtpTransport({
    service: email.service,
    auth: {
        user: email.user,
        pass: email.pass
    }
}));
 
/**
 * @param {String} recipient 收件人
 * @param {String} subject 发送的主题
 * @param {String} html 发送的html内容
 */
const sendMail = (recipient, subject, html)=>{
    return new Promise((resolve,reject)=>{
        smtpTransport.sendMail({
            from: email.user,
            to: recipient,
            subject: subject,
            html: html
     
        }, function (error, response) {
            if (error) {
                reject(error);
            }else{
                resolve('发送成功')
            }
        });
    })
}
 
module.exports = sendMail