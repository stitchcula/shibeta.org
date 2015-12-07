"use strict"

var co=require('co')

class Usr {
    constructor(handle){
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
        if(!handle.session) handle.session=this.baseUsrMsg
    }
    //tool
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
    create(){//新增用户
        var ctx=this
        return function(callback){
            co(function*(){
                if(!ctx.handle.session.uin=="999999")
                    if(ctx.testPms()) {
                        var msg = ctx.testUsrMsg(ctx.handle.request.body)
                        if(msg) {
                            yield ctx.usrDb.insert(msg)
                            callback(null,{code:200,result:msg.uin})
                        }else callback(null,{code:400,result:null})
                    }else callback(null,{code:403,result:"权限不足_(:зゝ∠)_"})
                else callback(null,{code:401,result:null})
            })
        }
    }
    set(uin,obj){//修改用户信息
        var ctx=this
        return function(callback){
            co(function*(){

            })
        }
    }
    get(uin,obj){
        var ctx=this
        return function(callback){
            co(function*(){

            })
        }
    }
    exit(){//注销
        var ctx=this
        return function(callback) {
            co(function*() {
                ctx.handle.session = null
                callback({code:200,result:null})
            })
        }
    }
    ifLogin(session){//未登陆、登陆但需要密码、登陆
        var ctx=this
        return function(callback) {
            co(function*() {
                session = session || ctx.handle.session
                if (session.uin != "999999"&&session.ol) {
                    if(session.ol<new Date().getTime()) callback(null,{code:401,result:"/usr/auth"})//登陆但需要密码
                    else callback()//登陆
                } else callback(null,{code:401,result:"/usr/login"})//未登陆
            })
        }
    }
    auth(){//登陆但需要密码

    }
    login(msg,ol){//登陆
        var ctx=this
        return function(callback){
            co(function*(){
                if(!msg||typeof(msg)!="object")
                    if(ctx.handle.request.body.usr&&ctx.handle.request.body.pwd&&ctx.handle.request.body.pwd!="da39a3ee5e6b4b0d3255bfef95601890afd80709")
                        msg={usr:ctx.handle.request.body.usr,pwd:ctx.handle.request.body.pwd}
                    else return callback(null, {code: 400, result: "信息填写不完整_(:зゝ∠)_"})
                if(/[@]/.test(msg.usr)){
                    res=yield this.db.findOne({email:msg.usr},{uin:1,pwd:1})
                }else if(/^[0-9]{11}$/.test(msg.usr)){
                    res=yield this.db.findOne({tel:msg.usr},{uin:1,pwd:1})
                }else if(/^(\w){6,12}$/.test(msg.usr)){
                    res=yield this.db.findOne({account:ctx.enBase64(msg.usr)},{uin:1,pwd:1})
                }
                if(res&&res.password==msg.pwd){
                    //TODO:是否异地登录
                    //callback(null,yield ctx.sendSms('login')})
                    msg.count.loginLog.times+=1
                    //TODO:统计ip和登录地点
                    ctx.handle.session=msg
                    ctx.handle.session.ol=new Date().getTime()+((msg)?14400000:864000000)
                    callback(null,{code:200,result:msg.uin})
                }else callback(null,{code:403,result:"用户名或密码错误-o-"})
            })
        }
    }
    ifSign(obj){
        var ctx=this
        return function(callback){
            co(function*(){
                var res
                if(typeof(obj)=="string")
                    if(/^[0-9]{6}$/.test(obj))
                        res=yield ctx.usrDb.findOne({uin:obj},{account:1,uin:1})
                    else
                        res=yield ctx.usrDb.findOne({account:ctx.enBase64(obj)},{uin:1,account:1})
                else;//TODO:查询多条时为数组
                if(res) callback(null,{uin:res.uin,account:ctx.deBase64(res.account)})
                else callback(null,0)
            })
        }
    }
    sign(){
        var ctx=this
        return function(callback){
            co(function*(){
                if(yield ifSign(ctx.handle.request.body.account)) {
                    var msg=yield ctx.testUsrMsg(ctx.handle.request.body)//检查并编码
                    if(msg){
                        if(1) {
                            yield ctx.usrDb.insert(msg)
                            callback(null, yield ctx.login(msg))//统计和注入session
                        }//TODO:sendSms & sendVfc
                    }else callback(null,{code:400,result:"信息填写有误_(:зゝ∠)_"})
                }else callback(null,{code:595,result:"该账户已存在-o-"})
            })
        }
    }
    del(){//删除用户

    }
    testUsrMsg(body){//body信息校验
        var ctx=this
        return function(callback){
            co(function*(){
                //
            })
        }
    }
    sendSms(){//验证短信验证码

    }
    testUsrPms(){//pms&gpms

    }
}

module.exports=Usr