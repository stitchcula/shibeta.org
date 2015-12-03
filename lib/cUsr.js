"use strict"

class Usr {
    constructor(handle){
        this.baseUsrMsg={
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
        this.crypto = require('crypto')
        this.handle=handle
        this.usrDb=handle.db.collection('usr')
        if(!handle.session) handle.session=this.baseUsrMsg
    }
    //tool
    base64(str){
        return new Buffer(str).toString('base64')
    }
    sha1(str){
        return this.crypto.createHmac('sha1',str).digest('hex')
    }
    encode(usrMsg){

    }
    decode(usrMsg){

    }

    //public
    create(){//�����û�
        var ctx=this
        return function(callback){
            co(function*(){
                 ctx.testPms()
            })
        }
    }
    set(){//�޸��û���Ϣ

    }
    get(uin,key){
        var ctx=this
        return function(callback){
            co(function*(){
                if(!key){
                    key=uin
                    uin=ctx.handle.session.uin
                }
                if(key=="face"){
                    //TODO:pms test
                    var res=yield ctx.usrDb.findOne({uin:uin})
                    callback(null,res.face)
                }else{

                }
            })
        }
    }
    exit(){//ע��

    }
    login(){//��½

    }
    sign(){
        var ctx=this
        return function(callback){
            co(function*(){
                var msg=yield ctx.testUsrMsg(ctx.handle.request.body)//��鲢����
                if(msg){
                    if(!(yield ctx.usrDb.findOne({account:msg.account},{uin:1}))) {
                        ctx.handle.session = msg
                        yield ctx.usrDb.insert(msg)
                        callback(null,yield ctx.login(msg))//ͳ�ƺ�ע��session
                    }else callback(null,{code:595,result:"���˻��Ѵ���-o-"})
                }else callback(null,{code:400,result:"��Ϣ��д������_(:�٩f��)_"})
            })
        }
    }
    del(){
        
    }
    testUsrMsg(){//body��ϢУ��

    }
    sendSms(){//��֤������֤��

    }
    testPms(){//pms&gpms

    }
}

module.exports=Usr