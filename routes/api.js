"use strict"

var router=require('koa-router')()
    ,fs = require('co-fs')
    ,body=require('koa-better-body')
    ,co=require('co')

//ui api
router.get('/',function*(next){
    this.render('apiList',{title:"API List"})
    yield next
})

router.get('/upload',function*(next){
    //TODO:sha1 test
    this.render('uploadTest',{title:"上传测试"})
    yield next
}).post('/upload',function*(next){
    //TODO:pms test
    console.log("1")
    yield next
},body({
    multipart:true,
    formidable:{uploadDir:__dirname+'/../../static/upload'}
}),function*(next){
    //TODO:
    console.log("2")
    this.body={
        sid:this.request.body,
    }
    yield next
})

var Sms=require('../lib/cSms.js')
router.get('/sms',function*(next){
    this.body=this.request.body
    yield next
}).post('/sms',function*(next){
    var sms = new Sms()
    if((this.ip=="121.40.249.9"||this.ip=="175.8.23.155")&&sms){
        var res=yield sms.send(this.request.body.to, this.request.body.type,this.request.body.param)
        this.body={result:res.body}
    }else this.body={result:403}
    yield next
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
            from:this.request.body.from,
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
    }else this.body={result:403}
    yield next
})

var Local=require('../lib/cLocal.js')
router.get('/local',function*(next){
    var res=yield new Local(this.query.s,this)
    console.log(res)
    this.body=res
    yield next
})

router.get('/test',function*(next){
    this.body="gfsd"
    yield next
})

module.exports=router
