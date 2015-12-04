"use strict"

var router=require('koa-router')()

router.get('/login',function*(next){
    this.render('login',{
        title:"登陆",
        default_face:"/static/img/default_face.jpg",
        title_img:"/static/img/login_title_img.jpg",
        off_footer:1,
        slides:[
            {img:"/static/img/bg1.jpg"},
            {img:"/static/img/bg2.jpg"},
            {img:"/static/img/bg3.jpg"}
        ]
    })
    yield next
}).post('/login',function*(next){//登陆自己
    this.body=yield this.usr.login()
    yield next
})

router.get('/sign',function*(next){//获取注册页面
    //TODO:注册页面
    //this.render()
    this.redirect('/login')
    yield next
}).post('/sign',function*(next){//注册
    this.body=yield this.usr.sign()
    yield next
}).get('/sign/sms',function*(next){//获取短信验证码
    this.body=yield this.usr.sendSms('sign')
    yield next
}).post('/sign/sms',function*(next){//校验短信验证码
    this.body=yield this.usr.testSms('sign')
    yield next
}).get('/sign/vfc',function*(next){//获取验证码
    this.body=yield this.usr.sendVfc()
    yield next
}).post('/sign/vfc',function*(next){//校验验证码
    this.body=yield this.usr.testVfc()
    yield next
})

router.get('/',function*(next){//获取个人主页
    //this.render()
    this.body="ok"
    yield next
}).get('/dashboard',function*(next){//个人管理界面
    //this.render()
    this.body="ok"
    yield next
}).post('/',function*(next){//修改个人信息
    this.body=yield this.usr.set(this.request.body)
    yield next
}).post('/dashboard',function*(next){//新建作品
    this.body=yield this.usr.set(this.request.body)
    yield next
}).put('/dashboard',function*(next){//修改作品
    this.body="ok"
    yield next
}).del('/dashboard',function*(next){//删除作品等
    this.body="ok"
    yield next
}).del('/',function*(next){//注销
    //this.render()
    this.body="ok"
    yield next
})

router.get('/test',function*(next){
    this.body=yield this.usr.randomUin()
    yield next
})

router.get('/:uin',function*(next){//用户公共主页

    yield next
}).post('/:uin',function*(next){//关注对方、等。

    yield next
})

var ifSign=function*(next){}
var testUsrMsg=function*(next){}
var setUsrMsg=function*(next){}
var setSession=function*(next){}
var code2msg=function*(next){}
var getUin=function*(next){}

router.get('/test'
    ,code2msg(next)
    ,ifSign(next)
    ,getUin(next)
    ,testUsrMsg(next)
    ,setUsrMsg(next)
    ,setSession(next)
)

module.exports=router
