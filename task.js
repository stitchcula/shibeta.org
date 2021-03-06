
var Task=require('./lib/cTask.js')
    ,Gulp=require('./lib/cGulp.js')
    ,fs=require('co-fs')
    ,co=require('co')
    ,exec=require('child_process').exec

var task=new Task()

task.init(function(){
    var gulp=new Gulp()
    gulp.start()
})

task.fast('sync',function(err,task){
    exec('/ext/shibeta/sync.sh',{cwd:'/ext/shibeta/'},function(err,stdout,stderr){
        console.log(stdout)
    })
})

var transporter=require('nodemailer').createTransport({
        host:"smtp.mxhichina.com",
        port:25,
        auth:{
            user:process.env.MAILER_USER,
            pass:process.env.MAILER_PASS
        }
    })
    ,request=require('request')
task.delay('mailer',function(err,task){
    transporter.sendMail({
        from:(task.content.from||"shibeta")+"<"+process.env.MAILER_USER+">",
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

//task.fast('loop',function(){
//    console.log('fastloop at '+new Date())
//})

task.slow('loop',function(){
    co(function*(){
        while(1){
            var log=yield redis.rpop('TaskLog')
            if(log) yield fs.writeFile("../static/task.log",log+"\r\n",{flag:"a"})
            else break
        }
    })
})

task.start()
