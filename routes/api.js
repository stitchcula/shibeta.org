"use strict"

var router=require('koa-router')()

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

module.exports=router