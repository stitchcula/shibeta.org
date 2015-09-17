"use strict"

var router=require('koa-router')()
    ,crypto=require('crypto')

//task
router.use(function*(next){
    console.log(this.ip+" in "+new Date().toLocaleString())
    if(1) return this.render("preLoad",{Th:"2",ThLen:3})
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
    this.render('index')
    yield next
})

router.get('/test',function*(next){
    this.render('preLoad',{theme:1})
    yield next
})

module.exports=router

