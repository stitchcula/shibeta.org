"use strict"

var router=require('koa-router')()
    ,fs = require('co-fs')

var transporter=require('nodemailer').createTransport()
router.post('/mailer',function*(next){
    transporter.sendMail({
        from: "HSXF <noreply@shibeta.org>",
        to: this.request.body.to,
        subject: this.request.body.subject,
        html: this.request.body.html
    },function(err,rep){
        console.log(err)
        console.log(rep)
    })
    console.log(this.request.body)
    this.body={result:200}
    yield next
})

router.get('/music',function*(next){
    this.redirect('//shibeta.oss-cn-qingdao.aliyuncs.com/music/quick_'+Math.floor(Math.random()*10)+'.mp3')
    yield next
})
module.exports=router