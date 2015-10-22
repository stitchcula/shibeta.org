"use strict"

var router=require('koa-router')()

var menu=require('directory-tree').directoryTree(__dirname+'/../dynamic/admin/menu',['.jade']).children
for(var r of menu){
    r=r.name.substring(0,r.name.lastIndexOf("."))
    router.get('/'+r,function*(next){
        this.render('admin/menu/'+r)
        yield next
    })
}

router.get('/',function*(next){
    this.render('admin/framework',{
        menu:[
            {
                inner:"测试1",
                icon:"arrow_back",
                href:"#1"
            },
            {
                inner:"测试5",
                icon:"arrow_back",
                href:"#1"
            },
            {
                inner:"测试2",
                icon:"arrow_back",
                href:[
                    {
                        inner:"测试3",
                        href:"#3",
                        icon:"arrow_back"
                    },
                    {
                        inner:"测试4",
                        href:"#4",
                        icon:"arrow_back"
                    }
                ]
            },
            {
                inner:"控制面板",
                icon:"settings",
                href:[
                    {
                        inner:"用户群组",
                        href:"#usrs",
                        icon:"supervisor_account"
                    },
                    {
                        inner:"xxx",
                        href:"#4",
                        icon:"arrow_back"
                    }
                ]
            },
            {
                inner:"注销",
                icon:"arrow_back",
                href:"#1"
            },
        ]
    })
    yield next
})

module.exports=router