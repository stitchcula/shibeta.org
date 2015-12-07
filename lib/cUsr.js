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
            bornDate:"20151204",
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
                    local:[/*"000000",0,[
                            {ip:"0.0.0.0"}
                        ]*/
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
                callback(null,ctx.usrMsg.uin)
            })
        }
    }
    saveUsr(){
        var ctx=this
        return function(callback) {
            co(function*() {
                if(ctx.status){
                    yield ctx.handle.redis.hmset(ctx.usrMsg.uin, ctx.usrMsg)
                    yield ctx.usrDb.update({uin:ctx.usrMsg.uin},ctx.usrMsg)
                    callback(null,ctx.usrMsg.uin)
                }
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
    auth(password){//登陆但需要密码
        var ctx=this
        return function(callback){
            co(function*(){
                password=password||ctx.handle.request.body.pwd
                if(password && password != "da39a3ee5e6b4b0d3255bfef95601890afd80709")//->testUsrMsg()
                    if(ctx.status)
                        if(ctx.status==1)
                            if(ctx.usrMsg.password==password) {
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
    login(msg){//登陆->login(usrLoginMsg)force login(ol) login()
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
                    if(!yield ctx.testUsrPms())//鉴权-1
                        return callback(null,{code:403,result:"用户已被封禁_(:зゝ∠)_"})
                    msg=res
                }
                if (ctx.status < 2) msg.count.loginLog.times += 1//登陆次数+1
                ctx.usrMsg=msg
                //TODO:统计ip和登录地点
                ctx.handle.session.uin = msg.uin
                //ctx.handle.session.ol=new Date().getTime()+((ol)?864000000:14400000)//->login(ol)
                ctx.handle.session.ol = new Date().getTime() + 14400000//不需要密码
                ctx.status=2
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
                if((!msg.tel&&!msg.email)||!msg.password||!msg.account) return callback(null,{code:404,result:""})
                msg=yield ctx.formatUserCommonMessage(msg,ctx.baseUsrMsg)//检查并编码
                msg.uin=yield ctx.randomUin()
                if(msg){
                    if(1) {
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
            for(var pub in obj)
                if(msg[pub]!=undefined)
                    obj[pub]=msg[pub]
                else
                    delete obj[pub]
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
                if(typeof(uins)!="object") uins=[uins]
                if(yield ctx.testUsrPms()&&ctx.status==2)//->testUsrPms("/admin/usrs")
                    for(var i=0;i<uins.length;i++) {
                        uins[i] = yield ctx.usrDb.findOne({uin: uins[i]})
                        uins[i] = ctx.filterUsrMsg(uins[i], obj)
                    }
                else
                    for(var j=0;j<uins.length;j++){
                        uins[j]=yield ctx.usrDb.findOne({uin: uins[j]})
                        uins[j]=ctx.filterUsrMsg(ctx.filterUsrMsg(uins[j],uins[j].secrecy),obj)
                    }
                callback(null,uins)
            })
        }
    }
    setUsrMsg(obj){
        var ctx=this
        return function(callback){
            co(function*(){
                if(ctx.status)
                    if(ctx.status>1)
                        if(yield ctx.formatUserCommonMessage(obj)){//作为指针传入,过滤只读变量、非法变量
                            for(var reset in obj)
                                ctx.usrMsg[reset]=obj[reset]//formatUserCommonMessage(obj,usrMsg)
                            callback(null,{code:200,result:ctx.usrMsg.uin})
                        }else callback(null,{code:403,result:obj})
                    else  callback(null,{code:401,result:"/usr/auth"})
                else callback(null,{code:401,result:"/usr/login"})
            })
        }
    }
    setOtherUsrMsg(uin,obj,force){//(uin,{},ifForce) 不提供批量修改
        var ctx=this
        return function(callback){
            co(function*(){
                if(!uin.length)
                    if(ctx.status)
                        if(ctx.status>1)
                            if(force||yield ctx.testUsrPms())//->testUsrPms("/admin/usrs")
                                if(yield ctx.formatUserCommonMessage(obj)){//作为指针传入,过滤只读变量、非法变量
                                    yield ctx.usrDb.upsert({uin:uin},obj)
                                    callback(null,{code:200,result:ctx.usrMsg.uin})
                                }else callback(null,{code:403,result:obj})
                            else callback(null,{code:403,result:""})
                        else  callback(null,{code:401,result:"/usr/auth"})
                    else callback(null,{code:401,result:"/usr/login"})
                else callback(null,{code:403,result:"禁止批量修改"})
            })
        }
    }
    create(obj){//新增用户
        var ctx=this
        return function(callback){
            co(function*(){
                if(ctx.status)
                    if(ctx.status>1)
                        if(yield ctx.testUsrPms()) {
                            var msg = yield ctx.formatUserCommonMessage(obj||ctx.handle.request.body,ctx.baseUsrMsg)
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
    del(uin,force){//删除用户
        var ctx=this
        return function(callback){
            co(function*(){
                if(ctx.status)
                    if(ctx.status>1)
                        if(yield ctx.testUsrPms())
                            if(uin||ctx.handle.query.uin) {
                                ctx.usrDb.remove({uin: uin || ctx.handle.query.uin})
                                callback(null, {code: 200, result: msg.uin})
                            }else  callback(null,{code:400,result:"信息不完整"})
                        else callback(null,{code:403,result:"权限不足_(:зゝ∠)_"})
                    else  callback(null,{code:401,result:"/usr/auth"})
                else callback(null,{code:401,result:"/usr/login"})
            })
        }
    }
    //
    formatUserCommonMessage(obj,source) {//过滤只读变量、非法变量、编码,格式错误返回0，成功返回有用的obj，并修改obj ->formatUserCommonMessage()
        var ctx = this
        return function (callback) {
            co(function*() {
                for (var key in obj) {
                    switch (key) {
                        case "uin"://过滤只读变量
                        case "custom":
                        case "count":
                        case "pms":
                        case "gpms":
                        case "concern":
                        case "fans":
                            delete obj[key]
                            break
                        case "account":
                            if (!/^(\w){6,12}$/.test(obj[key])) return 0
                            obj[key] = ctx.enBase64(obj[key])
                            break
                        case "password":
                            if (obj[key] == "da39a3ee5e6b4b0d3255bfef95601890afd80709") return 0
                            break
                        case "sex":
                            if (obj[key] != 0 || obj[key] != 1) return 0
                            break
                        case "tel":
                            if (!/^[0-9]{11}$/.test(obj[key])) return 0
                            break
                        case "sexualOrientation":
                            if (!/^[0-3]{1}$/.test(obj[key])) return 0
                            break
                        case"bornDate":
                            if (!/^[0-9]{8}$/.test(obj[key])) return 0
                            break
                        case "email":
                            if (!/[@.]/.test(obj[key])) return 0
                            break
                        case "name":
                            if (!/^[a-zA-z]{4,20}$/.test(obj[key]) || !/^(\w){2,5}$/.test(obj[key])) return 0
                            break
                        case "idf":
                            if (!/^[0-9xX]{18}$/.test(obj[key])) return 0
                            break
                        case "local":
                            if (!/^[0-9]{6}$/.test(obj[key])) return 0
                            break
                        default :
                            if (ctx.usrMsg[key] == undefined) delete obj[key]// if(!key in ctx.usrMsg)
                    }
                }
                if(source) obj=Object.assign({},source,obj)
                callback(null, obj)
            })
        }
    }
    testUsrPms(){

    }
    sendSms(){

    }
    testSms(){

    }
    sendVfc(){

    }
    testVfc(){

    }
    sendMail(){

    }
    testMail(){

    }
}

module.exports=Usr