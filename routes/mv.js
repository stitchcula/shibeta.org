"use strict"

var router=require('koa-router')()

router.get('/',function*(next){
    this.redirect("/tri?p=3")
    yield next
})

router.get('/:code',function*(next){
    if(this.params.code=="tri")
        console.log(this.query.p)
        switch(this.query.p.toString()) {
            case "2":
                this.render("video", {
                    title:"数码宝贝Tri Part 2",
                    without_footer: 1,
                    src:"https://shibeta-f.oss-cn-shenzhen.aliyuncs.com/tri/DaTri0102.mp4",
                    part:["1","3","4"],
                    next:"3"
                })
                break
            case "3":
                this.render("video", {
                    title:"数码宝贝Tri Part 3",
                    without_footer: 1,
                    src:"https://shibeta-f.oss-cn-shenzhen.aliyuncs.com/tri/DaTri0103.mp4",
                    part:["1","2","4"],
                    next:"4"
                })
                break
            case "4":
                this.render("video", {
                    title:"数码宝贝Tri Part 4",
                    without_footer: 1,
                    src:"https://shibeta-f.oss-cn-shenzhen.aliyuncs.com/tri/DaTri0104.mp4",
                    part:["1","2","3"],
                    next:"1"
                })
                break
            default :
                this.render("video", {
                    title:"数码宝贝Tri Part 1",
                    without_footer: 1,
                    src:"https://shibeta-f.oss-cn-shenzhen.aliyuncs.com/tri/DaTri0101.mp4",
                    part:["2","3","4"],
                    next:"2"
                })
        }
    yield next
})


module.exports=router