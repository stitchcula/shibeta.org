var schedule = require('node-schedule')
    ,co=require('co')
    ,redis=require('co-redis')(require('redis').createClient(6379,'121.42.51.112'))
    ,fs=require('co-fs')
    //,thunk=require('thunkify')
    ,exec=require('child_process').exec
    //,fns=require('fns.js')

var fast=schedule.scheduleJob('*/30 * * * * *',function(){
    co(function*(){
        while(1) {
            var task = JSON.parse(yield redis.rpoplpush('fastTask', 'fastTaskLog'))
            if (task){
                console.log('[fastTask in '+new Date()+']')
                console.log(task)
                switch (task.type) {
                    case 'sync':
                        exec('/ext/shibeta/sync.sh',{cwd:'/ext/shibeta/'},function(err,stdout,stderr){
                            console.log(stdout)
                        })
                        break
                    default:
                        eval(task.content)
                }
            }else{
                //console.log('[fastTask in '+new Date()+']\n\rNO\n\r')
                break
            }
        }
    })
})

var slow=schedule.scheduleJob('0 0 3 * * *',function(){
    co(function*(){
        console.log('[slowTask in '+new Date()+']\n\r')
        while(1){
            var log=yield redis.rpop('fastTaskLog')
            if(log) yield fs.writeFile("../../log/task.log",log+"\r\n",{flag:"a"})
            else break
        }
    })
})