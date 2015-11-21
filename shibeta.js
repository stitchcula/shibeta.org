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
    ,redis=require('co-redis')(require('redis').createClient(6379,'121.42.51.112'))
    ,db

co(function*(){db=(yield require('robe').connect('121.42.51.112:7878'))})
//var hKill=setInterval(function(){require('nodegrass').get("http://localhost:9615/",function(data){if(JSON.parse(data).processes[1].monit.memory>120*1024*1024) require('child_process').spawn('pm2',['restart','all'])})},600000)

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
app.use(session({store:{host:'121.42.51.112',port:6379,ttl:600}}))
app.use(body())//POST&PUT body
app.use(serve(__dirname))
app.use(function *(next){
    this.render=function(file,opt){return this.body=jade.renderFile(__dirname+'/dynamic/'+file+'.jade',opt,undefined)}
    this.db=db
    this.redis=redis
    if((this.method==='POST'||this.method==='PUT')&&!this.request.body.files) this.request.body=this.request.body.fields
    yield next
})
app.use(routes.routes())
app.use(routes.allowedMethods())

app.listen(8001)
