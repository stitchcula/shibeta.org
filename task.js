
var TASK=require('fns.js')
    ,fs=require('co-fs')
    ,co=require('co')

var task=new TASK()

task.fast('sync',function(err,task){
    exec('/ext/shibeta/sync.sh',{cwd:'/ext/shibeta/'},function(err,stdout,stderr){
        console.log(task.content)
    })
})

var transporter=require('nodemailer').createTransport()
    ,request=require('request')
task.delay('mailer',function(err,task){
    transporter.sendMail({
        from: "Shibeta <noreply@shibeta.org>",
        to: task.content.to,
        subject: task.content.subject,
        html: task.content.html
    },function(err,rep){
        if(task.content.hook) {
            if (err) request.post(task.content.hook,{form:{result:502,msg:err}})
            else request.post(task.content.hook,{form:{result:200,msg:rep}})
        }
    })
})

task.slow('loop',function(){
    co(function*(){
        while(1){
            var log=yield redis.rpop('TaskLog')
            if(log) yield fs.writeFile("../../log/task.log",log+"\r\n",{flag:"a"})
            else break
        }
    })
})

task.start()
