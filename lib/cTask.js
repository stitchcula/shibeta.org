"use strict"

var co=require('co')

class Task{
    constructor(ip,port,auth) {
        ip = ip || process.env.REDIS_HOST
        port = port || process.env.REDIS_PORT
        auth = auth || process.env.REDIS_AUTH
        this.redis=require('co-redis')((function(){var _=require('redis').createClient(port,ip);_.auth(auth);return _})())
        this.schedule = require('node-schedule')
        this._slow=[]
        this._fast=[]
        this._delay=[]
    }

    initd(){console.log("[Tasks Queue is running at "+new Date()+"]")}
    slowLoop(){}
    fastLoop(){}

    //Registration task
    use(type,flag,callback){
        if(typeof(flag)=="function"){
            callback=flag
            flag="fast"
        }
        if(type=="loop"){
            switch(flag){
                case "slow":
                    this.slowLoop=callback
                    break
                case "fast":
                    this.fastLoop=callback
                    break
                default :
                    callback("can't bind loop this")
            }
        }else{
            switch(flag){
                case "slow":
                    this._slow.push({type:type,callback:callback})
                    break
                case "delay":
                    this._delay.push({type:type,callback:callback})
                    break
                default :
                    this._fast.push({type:type,callback:callback})
            }
        }
    }
    fast(type,callback){
        this.use(type,'fast',callback)
    }
    slow(type,callback){
        this.use(type,'slow',callback)
    }
    delay(type,callback){
        this.use(type,'delay',callback)
    }
    init(callback){
        if(callback) this.initd=callback
    }

    //to do
    loop(flag){
        co(function*(){
            if(!flag) flag="fast"
            do {
                var task = JSON.parse(yield this.redis.rpoplpush(flag+'Task','TaskLog'))
                if (task) {
                    console.log('[running '+flag+'Task at '+new Date()+']')
                    console.log(task)
                    switch(flag){
                        case "slow":
                            for(var i=0;i<this._slow.length;i++){
                                if(this._slow[i].type==task.type) this._slow[i].callback(null,task)
                                else continue
                            }
                            break
                        case "delay":
                            for(var i=0;i<this._delay.length;i++){
                                if(this._delay[i].type==task.type) this._delay[i].callback(null,task)
                                else continue
                            }
                            break
                        case "fast":
                            for(var i=0;i<this._fast.length;i++){
                                if(this._fast[i].type==task.type) this._fast[i].callback(null,task)
                                else continue
                            }
                            break
                    }
                }else break
            }while(flag!='delay')
        }.bind(this))
    }
    //loop
    start(){
        this.initd()
        var fastTimer=this.schedule.scheduleJob('*/30 * * * * *',function(){this.fastLoop();this.loop('fast')}.bind(this))
        var delayTimer=this.schedule.scheduleJob('*/30 * * * * *',function(){this.loop('delay')}.bind(this))
        var slowTimer=this.schedule.scheduleJob('0 0 3 * * *',function(){this.slowLoop();this.loop('slow')}.bind(this))
        return [fastTimer,delayTimer,slowTimer]
    }
}

module.exports=Task