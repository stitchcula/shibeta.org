"use strict"

var router=require('koa-router')()
    ,crypto=require('crypto')
    ,fs = require('co-fs')
    ,co=require('co')

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
    if(this.task) console.log(1)
    else console.log("NO TASKS")
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

router.get('/test',function*(next){
    this.render('index')
    yield next
})

module.exports=router

