"use strict"

var router=require('koa-router')()

router.get('/wk',function*(next){
    this.render('ext.wk',{title:'混凝土板缝的温度分布',off_footer:1})
    yield next
})

module.exports=router