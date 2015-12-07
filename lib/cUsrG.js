"use strict"

var co=require('co')

class Usr {
    constructor(handle){//session缓存10天，usrMsg缓存1天，mongo永久
        this.baseUsrMsg={
            uin:"999999",
            account:"visitor",
            password:"",
            sex:"",
            tel:"",
            tag:"",
            sexualOrientation:"",//性取向
            bornDate:"151204",
            email:"",
            name:"",
            idf:"",
            face:"",//
            local:"000000",
            pms:{},//?{"/admin",1}
            gpms:[0],//组权限，0为游客，-1为禁止登陆
            concern:[],
            fans:[],
            custom:{},//for big data
            count:{
                loginLog:{
                    times:0,
                    local:["000000",0,[
                        {ip:"0.0.0.0"}
                    ]
                    ]
                }
            },
            secrecy:{
                uin:1,
                password:1,
                tel:1,
                ol:1,
                email:1,
                name:1,
                idf:1,
                custom:1,
                count:1,
                bornDate:1,
                sexualOrientation:1
            }
        }
        this.crypto = require('crypto')
        this.handle=handle
        this.usrDb=handle.db.collection('usr')
    }
    initUsr(){
        var ctx=this
        return function(callback){
            co(function*() {
                if(ctx.handle.session.uin){
                    ctx.status=(ctx.handle.session.ol>new Date().getTime())?2:1//2为已登录、1为需要验证密码
                    var _=(yield ctx.handle.redis.hgetall(ctx.handle.session.uin))
                    if(!_){
                        this.usrMsg=yield ctx.usrDb.findOne({uin:ctx.handle.session.uin})
                        yield ctx.handle.redis.hmset(ctx.handle.session.uin,ctx.usrMsg)
                    }else ctx.usrMsg=_
                }else{//未登陆游客
                    ctx.usrMsg=ctx.baseUsrMsg
                    ctx.status=0
                }
                callback(null,ctx.usrMsg)
            })
        }
    }
    enBase64(str){
        return new Buffer(str).toString('base64')
    }
    deBase64(str){
        return new Buffer(str, 'base64').toString()
    }
    sha1(str){
        return this.crypto.createHmac('sha1',str).digest('hex')
    }
    randomUin(n){
        var ctx=this
        n=n||6
        return function(callback){
            co(function*() {
                var res = ""
                while (1) {
                    var x = Math.floor(Math.random() * 10)
                    if (!res.length && (x==0 || x == 9)) continue
                    res += x
                    if (res.length == n) {
                        if(yield ctx.usrDb.findOne({uin:res},{account:1})){//TODO: -> ifSign()
                            res=""
                            continue
                        }else{
                            callback(null,res)
                            break
                        }
                    }
                }
            })
        }
    }
    encode(usrMsg){

    }
    decode(usrMsg){

    }

    //public
    auth(){//登陆但需要密码
        var ctx=this
        return function(callback){
            co(function*(){
                if(ctx.handle.request.body.pwd && ctx.handle.request.body.pwd != "da39a3ee5e6b4b0d3255bfef95601890afd80709")//->testUsrMsg()
                    if(ctx.status)
                        if(ctx.status==1)
                            if(ctx.usrMsg.password==ctx.handle.request.body.pwd) {
                                ctx.handle.session.ol=new Date().getTime()+14400000//刷新在线时间
                                callback(null, {code: 200, result: "last"})
                            }else{
                                ctx.handle.session=null//清除session、未登陆状态
                                callback(null,{code:403,result:"/usr/login"})
                            }
                        else callback(null,{code:200,result:"last"})
                    else callback(null,{code:401,result:"/usr/login"})
                else return callback(null, {code: 400, result: "信息填写不完整_(:зゝ∠)_"})
            })
        }
    }
    login(msg){//登陆->login(usrLoginMsg) login(ol) login()
        var ctx=this
        return function(callback){
            co(function*(){
                if(!msg||typeof(msg)!="object") {//->login()&login(ol),login self.
                    if (ctx.handle.request.body.usr && ctx.handle.request.body.pwd && ctx.handle.request.body.pwd != "da39a3ee5e6b4b0d3255bfef95601890afd80709")//->testUsrMsg()
                        msg = {usr: ctx.handle.request.body.usr, pwd: ctx.handle.request.body.pwd}
                    else
                        return callback(null, {code: 400, result: "信息填写不完整_(:зゝ∠)_"})

                    var res
                    if(/[@]/.test(msg.usr)){
                        res=yield ctx.usrDb.findOne({email:msg.usr})
                    }else if(/^[0-9]{11}$/.test(msg.usr)){
                        res=yield ctx.usrDb.findOne({tel:msg.usr})
                    }else if(/^(\w){6,12}$/.test(msg.usr)){
                        res=yield ctx.usrDb.findOne({account:ctx.enBase64(msg.usr)})
                    }

                    if(!res||res.password!=msg.pwd)//chk handle.usr.status in GET /usr/login
                        return callback(null,{code:403,result:"用户名或密码错误-o-"})
                    //TODO:是否异地登录
                    //callback(null,yield ctx.sendSms('login')})
                    if(!ctx.testUsrPms())//鉴权-1
                        return callback(null,{code:403,result:"用户已被封禁_(:зゝ∠)_"})
                    msg=res
                }
                if (ctx.status < 2) msg.count.loginLog.times += 1//登陆次数+1
                if (!ctx.status) ctx.handle.redis.hmset(msg.uin, msg)//将用户存入缓存层
                //TODO:统计ip和登录地点
                ctx.handle.session.uin = msg.uin
                //ctx.handle.session.ol=new Date().getTime()+((ol)?864000000:14400000)//->login(ol)
                ctx.handle.session.ol = new Date().getTime() + 14400000//不需要密码
                //ctx.status=2
                callback(null, {code: 200, result: msg.uin})
            })
        }
    }
    ifSign(obj){
        var ctx=this
        return function(callback){
            co(function*(){
                var res
                if(typeof(obj)=="string")
                    if(/[@]/.test(obj)){
                        res=yield ctx.usrDb.findOne({email:obj},{uin:1,account:1})
                    }else if(/^[0-9]{6}$/.test(obj)){
                        res=yield ctx.usrDb.findOne({uin:obj},{uin:1,account:1})
                    }else if(/^[0-9]{11}$/.test(obj)){
                        res=yield ctx.usrDb.findOne({tel:obj},{uin:1,account:1})
                    }else if(/^[0-9xX]{18}$/.test(obj)){
                        res=yield ctx.usrDb.findOne({idf:obj},{uin:1,account:1})
                    }else{
                        res=yield ctx.usrDb.findOne({account:ctx.enBase64(obj)},{uin:1,account:1})
                    }
                else;
                    //TODO:查询多条时为数组
                if(res) callback(null,{uin:res.uin,account:ctx.deBase64(res.account)})
                else callback(null,0)
            })
        }
    }
    sign(msg){//msg.account=1&&msg.password=1->sign,msg.account=1&&msg.password=0->chk
        var ctx=this
        return function(callback){
            co(function*(){
                if(!msg) msg=ctx.handle.request.body
                if(msg.account&&(yield ctx.usrDb.findOne({account:ctx.enBase64(msg.account)},{uin:1}))) return callback(null,{code:595,result:"account"})
                if(msg.email&&(yield ctx.usrDb.findOne({email:msg.email},{uin:1}))) return callback(null,{code:595,result:"email"})
                if(msg.tel&&(yield ctx.usrDb.findOne({tel:msg.tel},{uin:1}))) return callback(null,{code:595,result:"tel"})
                msg=yield ctx.testUsrMsg(msg)//检查并编码,生成uin
                if(msg){
                    if(1) {
                        yield ctx.usrDb.insert(msg)//TODO:->ctx.usrMsg=msg
                        callback(null,yield ctx.login(msg))
                    }//TODO:sendSms & sendVfc
                }else callback(null,{code:400,result:"信息填写有误_(:зゝ∠)_"})
            })
        }
    }
    logout(){//注销
        var ctx=this
        return function(callback) {
            co(function*() {
                ctx.handle.session = null
                callback({code:200,result:null})
            })
        }
    }
    filterUsrMsg(msg,obj){
        if(obj)
            for(var pub in obj){
                obj[pub]=msg[pub]
            }
        else obj=msg
        return obj
    }
    getUsrMsg(obj){//({}) ()
        var ctx=this
        return function(callback){
            co(function*(){
                if(obj||(!obj&&ctx.status==1))// !obj&&ctx.status==1 obj
                    callback(null,{code:200,result:ctx.filterUsrMsg(ctx.usrMsg,ctx.usrMsg.secrecy)})
                else// !obj&&ctx.status!=1
                    callback(null,{code:200,result:ctx.usrMsg})
            })
        }
    }
    getOtherUsrMsg(uins,obj){//([],{}) ([])
        var ctx=this
        return function(callback){
            co(function*(){
                var res=yield ctx.usrDb.findOne({uin: uin})
                if(ctx.testUsrPms())//->testUsrPms("/admin/usrs")
                    callback(null,{code:200,result:ctx.filterUsrMsg(res,obj)})
                else {
                    callback(null, {code: 200, result:ctx.filterUsrMsg(ctx.filterUsrMsg(res,res.secrecy),obj)})
                }
            })
        }
    }
    setUsrMsg(){

    }
    create(){//新增用户
        var ctx=this
        return function(callback){
            co(function*(){
                if(ctx.status)
                    if(ctx.status>1)
                        if(ctx.testPms()) {
                            var msg = ctx.testUsrMsg(ctx.handle.request.body)
                            if(msg) {
                                yield ctx.usrDb.insert(msg)
                                callback(null,{code:200,result:msg.uin})
                            }else callback(null,{code:400,result:"信息不完整||不符合要求"})
                        }else callback(null,{code:403,result:"权限不足_(:зゝ∠)_"})
                    else  callback(null,{code:401,result:"/usr/auth"})
                else callback(null,{code:401,result:"/usr/login"})
            })
        }
    }
}

module.exports=Usr