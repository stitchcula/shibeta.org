"use strict"
//require('oneapm');//online watch

var koa=require('koa')
    ,routes=require('./routes')
    ,serve=require('koa-static')
    ,body=require('koa-better-body')
    ,co=require('co')
    ,stylus=require('koa-stylus')
    ,jade=require('jade')
    ,session=require('koa-session-redis')
    ,mongo=require('koa-mongo')
    ,redis=require('co-redis')((function(){var _=require('redis').createClient(process.env.REDIS_PORT,process.env.REDIS_HOST);_.auth(process.env.REDIS_AUTH);return _})())
    ,Usr=require('./lib/cUsrG.js')

var app=koa()

app.proxy='nginx'
app.keys=['stcula','toy']
app.use(function*(next){
    //if(this.header.host=='shibeta.com')
    //    return this.body='<p style="font-size:96px">pwp对咱这么好一定素真爱…求q1132463097_(:зゝ∠)_</p><script>setTimeout(function(){window.location="https://shibeta.org'+this.request.url+'"},3000)</script>'
    //if(this.header.host!='shibeta.org') return this.redirect('https://shibeta.org'+this.request.url)
    yield next
    if(this.status==404) this.body={result:404}//this.render('404')
})
app.use(stylus('./dynamic'))
app.use(mongo({host:process.env.MONGO_HOST,port:process.env.MONGO_PORT,db:'shibeta',user:'shibeta',pass:process.env.MONGO_PWD}))
app.use(session({store:{host:process.env.REDIS_HOST,port:process.env.REDIS_PORT,auth:process.env.REDIS_AUTH,ttl:600}}))
app.use(body())//POST&PUT body
app.use(serve(__dirname))
app.use(function *(next){
    this.render=function(file,opt){return this.body=jade.renderFile(__dirname+'/dynamic/'+file+'.jade',opt,undefined)}
    this.db=this.mongo.db('shibeta')
    this.redis=redis
    this.usr=new Usr(this)
    if((this.method==='POST'||this.method==='PUT')&&!this.request.body.files) this.request.body=this.request.body.fields
    yield next
})
app.use(routes.routes())
app.use(routes.allowedMethods())

app.listen(8001)
