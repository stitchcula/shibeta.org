"use strict"

var router=require('koa-router')()

router.get('/test',function*(next){
    this.body="hello shibeta"
    yield next
})

router.get('/login',function*(next){
    this.render('login',{
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
})

module.exports=router