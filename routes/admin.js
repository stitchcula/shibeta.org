"use strict"

var router=require('koa-router')()

var menu=require('directory-tree').directoryTree(__dirname+'/../dynamic/admin/tree').children
for(var r of menu){
    r=r.path//.substring(0,r.name.lastIndexOf("."))
    router.get('/'+r,function*(next){
        this.render(this.path)
        yield next
    })
}

router.get('/',function*(next){
    this.render('admin/framework',{
        menu:[
            {
                inner:"通知",
                icon:"question_answer",
                href:"#notice"
            },
            {
                inner:"性能监控",
                icon:"cloud_queue",
                href:[
                    {
                        inner:"总览",
                        icon:"equalizer",
                        href:"#3"
                    },
                    {
                        inner:"储存",
                        icon:"dns",
                        href:"#4"
                    },
                    {
                        inner:"交互",
                        icon:"swap_horiz",
                        href:"#4"
                    }
                ]
            },
            {
                inner:"控制面板",
                icon:"tune",
                href:[
                    {
                        inner:"用户群组",
                        href:"#usrs",
                        icon:"supervisor_account"
                    },
                    {
                        inner:"UI控制",
                        href:"#ui",
                        icon:"view_compact"
                    }
                ]
            },
            {
                inner:"注销",
                icon:"arrow_back",
                href:"#1"
            },
        ],
        off_footer:1,
        title:"控制台"
    })
    yield next
})

router.post('/ui/page',function*(next){
    var config=require("../src/shibeta.json")
    console.log(config)
    var fs=require("fs")
    if(config[this.request.body.url]) return this.body={result:595}
    var filename=require('crypto').createHmac('sha1',this.request.body.url).digest('hex').substr(0,6)+"_"+new Date().getTime()
    console.log(filename)
    fs.writeFile("./src/js/"+filename+".js",
        "require('../stylus/"+filename+".styl')\n" +
        "var js=require('jquery')\n" +
        "require('angular')\n",
        function(err){
            console.log(err)
        }
    )
    fs.writeFile("./src/stylus/"+filename+".styl",
        "."+filename+"\n",
        function(err){
            console.log(err)
        }
    )
    fs.writeFile("./src/jade/"+filename+".jade",
        "extends frag/framework\n"+
        "block style\n"+
        "\tstyle\n"+
        "\t\t:stylus\n"+
        "\t\t\t.test\n"+
        "\t\t\t\tmargin 0\n"+
        "block content\n"+
        "\tmain\n",
        function(err){
            console.log(err)
        }
    )
    config[this.request.body.url]={entry:filename+".js",jade:this.request.body.jade}
    fs.writeFile("./src/shibeta.json",JSON.stringify(config),function(err){if(err)console.log(err)})
    yield next
})

module.exports=router