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
}).post('/login',function*(next){
    this.body=yield this.usr.login()
    yield next
})

router.get('/sign',function*(next){

}).post('/sign',function*(next){
    this.body=yield this.usr.sign()
    yield next
}).get('/sign/sms',function*(next){
    this.body=yield this.usr.sendSms('sign')
    yield next
}).post('/sign/sms',function*(next){
    this.body=yield this.usr.testSms('sign')
    yield next
}).get('/sign/vfc',function*(next){
    this.body=yield this.usr.sendVfc()
    yield next
}).post('/sign/vfc',function*(next){
    this.body=yield this.usr.testVfc()
    yield next
})

router.get('/',function*(next){
    //this.render()
    this.body="ok"
    yield next
})

router.get('/:uin',function*(next){
    this.body=yield this.usr.get(this.param.uin,this.query.s)
    yield next
})

router.get('/dashboard',function*(next){
    //this.render()
    this.body="ok"
    yield next
}).post('/dashboard',function*(next){
    this.body=yield this.usr.set(this.request.body)
    yield next
})

module.exports=router

//fns
class Usr{

}