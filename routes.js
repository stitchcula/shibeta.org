"use strict"

var router=require('koa-router')()
    ,crypto=require('crypto')
    ,fs = require('co-fs')
    ,co=require('co')
    ,redis=require('co-redis')(require('redis').createClient(6379,'121.42.51.112'))

//global
var _v
co(function*(){
    _v=JSON.parse(yield fs.readFile('package.json', 'utf8')).version
})

//task
router.use(function*(next){
    console.log(this.ip+" in "+new Date().toLocaleString())
    if(0) return this.render("preLoad",{Th:"1",ThLen:3,version:_v})
    yield next
    if(this.task){
        this.task.time=new Date()
        if(yield redis.lpush(this.task.flag+'Task',JSON.stringify(this.task))) console.log(this.task)
        else console.error("TASK push err:"+this.task)
    }
})

//load routes
var routes=require('dir-requirer')(__dirname)('./routes')
for(var r in routes){
    router.use('/'+r,routes[r].routes())
}

// '/' routes
router.get('/',function*(next){
    this.render('preLoad',{Th:"1",ThLen:3,version:_v})
    yield next
})

router.get('/about',function*(next){
    this.render('about')
    yield next
})

router.get('/test',function*(next){
    this.render('index')
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

router.get('/isap',function*(next){
    this.render('isap',{
        title:"ISAP天文社",
        without_footer:1,
        slides:[
            {img:"/static/img/isap/m1.jpg",title:"不知道说啥",html:"prprprprprpr",ext:"center-align"},
            {img:"/static/img/isap/m1.jpg",title:"不知道说啥",html:"prprprprprpr",ext:"left-align"},
            {img:"/static/img/isap/m1.jpg",title:"不知道说啥",html:"prprprprprpr",ext:"right-align"}
        ],
        history:[
            {img:"/static/img/isap/s1.jpg",title:"_(:зゝ∠)_不知道说啥",html:"求文案，在线等。",ext:"2010-2012"},
            {img:"/static/img/isap/s2.jpg",title:"_(:зゝ∠)_不知道说啥",html:"求文案，在线等。",ext:"2013"},
            {img:"/static/img/isap/s3.jpg",title:"_(:зゝ∠)_不知道说啥",html:"求文案，在线等。",ext:"2013"},
            {img:"/static/img/isap/s4.jpg",title:"_(:зゝ∠)_不知道说啥",html:"求文案，在线等。",ext:"2014"},
            {img:"/static/img/isap/s5.jpg",title:"_(:зゝ∠)_不知道说啥",html:"求文案，在线等。",ext:"2015"},
        ]
    })
    yield next
})

module.exports=router

