"use strict"

var co=require('co')
    ,crypto = require('crypto')
    ,request = require("co-request")

class Sms{
    constructor(ids){
        ids=ids||{}
        this.accountSid=ids.accountSid||"d9bdb04cf6cd437bac8e8b08aed65898"
        this.appId=ids.appId||"dad06f9b47f440a1be57d3a2b1ec0723"
        this.token=ids.token||"747a2a848b5048188536f543835ce3ed"
        this.version=ids.version||"20141029"
    }
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
    getParam(arr){
        if(typeof(arr)=="string") return arr
        var str=""
        for(var i=0;i<arr.length;i++)
            str = (i != arr.length - 1) ? (str+arr[i] + ",") :(str+arr[i])
        return str
    }
    //public

    send(to,type,arr){
        var ctx=this
        return function(callback) {
            co(function*() {
                if(!type||!/^[0-9]{11}$/.test(to)) callback(null,null)
                to=to+""
                ctx.date=new Date()
                ctx.param=arr||[]
                switch(type){
                    case "sign":
                        ctx.templateId="7390521"
                        if(ctx.date.getHours()>6&&ctx.date.getHours()<12) ctx.param[0]="哦嗨哟"
                        else if(ctx.date.getHours()<18) ctx.param[0]="空你急哇"
                        else ctx.param[0]="空吧哇"
                        ctx.param[1]=" 西伯太.org "
                        ctx.param[2]=ctx.getVfc(6)
                        break
                    case "hs_login":
                        break
                    case "hs_submit_cts"://有人提交
                        ctx.templateId="15510682"
                        ctx.param=arr
                        break
                    case "hs_reply_cts"://回执
                        ctx.templateId="15510696"
                        ctx.param=arr
                        break
                }
                ctx.url=`https://api.qingmayun.com/${ctx.version}/accounts/${ctx.accountSid}/SMS/templateSMS?sig=${ctx.sig()}&timestamp=${ctx.timestamp()}`
                ctx.body={
                    templateSMS: {
                        appId: ctx.appId,
                        templateId: ctx.templateId,
                        to: to,
                        param:ctx.getParam(ctx.param)
                    }
                }

                var result = yield request({
                    uri: ctx.url,
                    method: "POST",
                    json:true,
                    body: ctx.body,
                })
                callback(null,result)
            })
        }
    }
}

module.exports=Sms