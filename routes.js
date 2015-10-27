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
    this.render('login',{off_footer:1})
    yield next
})

module.exports=router

