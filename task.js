var schedule = require('node-schedule')
    ,co=require('co')
    ,redis=require('co-redis')(require('redis').createClient(6379,'121.42.51.112'))
    ,fs=require('co-fs')

var fast=schedule.scheduleJob('*/30 * * * * *',function(){
    co(function*(){
        while(1){
            var task=JSON.parse(yield redis.rpoplpush('fastTask','fastTaskLog'))
            if(task)
                switch(task.type){
                    case 'sync':
                        fns.selfSync(task.content)
                        break
                    default:
                        eval(task.content)
                }
            else break
        }
    })
})

var slow=schedule.scheduleJob('* * */23 * * *',function(){
    co(function*(){
        while(1){
            var log=yield redis.rpop('fastTaskLog')
            if(log) yield fs.writeFile("../log/task.log",log+"\r\n",{flag:"a"})
            else break
        }
    })
})