"use strict"

var co=require('co')
    ,crypto = require('crypto')
    ,request = require("co-request")

class Sms{
    timestamp(){
        var date=this.date
        var yyyy=date.getFullYear()+""
            ,mm=(date.getMonth()>8)?(date.getMonth()+1):("0"+(date.getMonth()+1))+""
            ,dd=(date.getDate()>9)?date.getDate():("0"+date.getDate())+""
            ,hh=(date.getHours()>9)?date.getHours():("0"+date.getHours())+""
            ,mi=(date.getMinutes()>9)?date.getMinutes():("0"+date.getMinutes())+""
            ,ss=(date.getSeconds()>9)?date.getSeconds():("0"+date.getSeconds())+""
        return yyyy+mm+dd+hh+mi+ss
    }
    sig(){
        var s=crypto.createHash('md5').update(this.accountSid+this.token+this.timestamp())
        return s.digest('hex')
    }
    getVfc(length){
        var res=""
        for(var i=0;i<length;i++) res+=Math.floor(Math.random()*10)
        return res
    }
    //public
    constructor(type,to,ids){
        if(!/^[0-9]{11}$/.test(to)) return 0
        to=to+""
        ids=ids||{}
        this.accountSid=ids.accountSid||"d9bdb04cf6cd437bac8e8b08aed65898"
        this.appId=ids.appId||"dad06f9b47f440a1be57d3a2b1ec0723"
        this.token=ids.token||"747a2a848b5048188536f543835ce3ed"
        this.version=ids.version||"20141029"
        this.date=new Date()
        if(this.date.getHours()>6&&this.date.getHours()<12) this.hello="哦嗨哟"
        else if(this.date.getHours()<18) this.hello="空你急哇"
        else this.hello="空吧哇"
        this.name=" 西伯太.org "
        this.vfc=this.getVfc(6)
        switch(type){
            case "login":
                this.templateId="7390521"
        }
        this.url=`https://api.qingmayun.com/${this.version}/accounts/${this.accountSid}/SMS/templateSMS?sig=${this.sig()}&timestamp=${this.timestamp()}`
        this.body={
            templateSMS: {
                appId: this.appId,
                templateId: this.templateId,
                to: to,
                param:`${this.hello},${this.name},${this.vfc}`
            }
        }
    }
    send(){
        var body=this.body
            ,url=this.url
        return function(callback) {
            co(function*() {
                var result = yield request({
                    uri: url,
                    method: "POST",
                    json:true,
                    body: body,
                })
                callback(null,result)
            })
        }
    }
}

module.exports=Sms