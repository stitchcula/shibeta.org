"use strict"

var router=require('koa-router')()

router.get('/test',function*(next){
    this.body="hello shibeta"
    yield next
})

module.exports=router