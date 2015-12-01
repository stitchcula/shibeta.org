"use strict"

class Usr {
    //tools
    crypto = require('crypto')
    base64(str){
        return new Buffer(str).toString('base64')
    }
    sha1(str){
        return this.crypto.createHmac('sha1',str).digest('hex')
    }
    //private
    baseUsrMsg={
        uin:"999999",
        account:"visitor",
        password:"",
        name:"",
        idf:"",
        face:"",//
        local:"000000",
        pms:{},
        gpms:[0],
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
        }
    }
    encode(usrMsg){

    }
    decode(usrMsg){

    }
    constructor(ctx){
        this.ctx=ctx
        this.usr=ctx.db.collection('usr')
    }
    create(){//新增用户
        class usrMsg extends baseUsrMsg{

        }

    }
    set(){//修改用户信息

    }
    get(uin,key){
        var ctx=this
        return function(callback){
            co(function*(){
                if(!key){
                    key=uin
                    uin=ctx.ctx.session.uin
                }
                if(key=="face"){
                    //TODO:pms test
                    var res=yield ctx.usr.findOne({uin:uin})
                    callback(null,res.face)
                }else{

                }
            })
        }
    }
    exit(){//注销

    }
    login(){//登陆

    }
    sign(){
        var ctx=this
        return function(callback){
            co(function*(){
                if(usrMsgTest(ctx.body)){

                }else{
                    callback(null,{code:400})
                }
            })
        }
    }
    del(){
        
    }
    usrMsgTest(){//body信息校验

    }
    verify(){//验证短信验证码

    }
    pmsTest(){//pms&gpms

    }
}

module.exports=Usr