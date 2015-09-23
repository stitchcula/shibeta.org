"use strict"

var router=require('koa-router')()
    ,fs = require('co-fs')

//ui api
router.get('/',function*(next){
    this.render('apiList',{title:"API List"})
    yield next
})

router.get('/upload',function*(next){
    this.render('musicUpload',{title:"上传音乐"})
})

router.get('/music',function*(next){
    this.redirect('//shibeta.oss-cn-qingdao.aliyuncs.com/music/quick_'+Math.floor(Math.random()*10)+'.mp3')
    yield next
})

//task api
router.post('/mailer',function*(next){
    this.task= {
        type: "mailer",
        flag: "delay",
        content: {
            to: this.request.body.to,
            subject: this.request.body.subject,
            html: this.request.body.html,
            hook: this.request.body.hook
        }
    }
    this.body={result:200}
    yield next
})

router.get('/sync',function*(next){
    this.body={result:200}
    yield next
}).post('/sync',function*(next){
    if(this.request.body.commits[0].committer.username=="stitchcula") {
        this.task = {type: "sync",flag:"fast", content: this.request.body.after}
        this.body={result:200}
    }else this.body={result:304}
    yield next
})

module.exports=router