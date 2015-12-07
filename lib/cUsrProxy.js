"use strict"

var Local=require("./cLocal.js")
    ,Mailer=require("./cMailer.js")
    ,Sms=require("./cSms.js")
    ,Usr=require("./cUsr.js")

var UsrProxy=new Proxy({},{
    get:function(target,name){
        return target[name]||Usr[name]||Mailer[name]||Sms[name]||Local[name]
    }
})

module.exports=UsrProxy