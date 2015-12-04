                ///////////////////////c13
                function stopBubleUp(e){
                    e = e || window.event;
                    if (!+"\v1") {
                        e.cancelBubble = true;
                    } else {
                        e.stopPropagation();
                    }
                }
                
                function resTabButtonsBind(selector){
                    if(!selector) selector="#ctbox .resTab:not(:first)"
                    $(selector).find(".resDel").unbind('click').click(function(e){
                        stopBubleUp(e)
                        var it=$(this)
                        if(this.ifConfirm){//for enter
                            if(1){
                                if($(this).closest(".resTab.ctCreateFlag").length) {
                                    $(this).closest(".resTab").remove()
                                    $("#ctheader i:eq(0)").fadeIn(500)
                                }else{
                                    var id=$(this).closest(".resTab").find("p:first")[0].innerHTML
                                    $.ajax({url:'/ct?safe=0&id='+id+'&rd='+Math.random().toString(36).substr(2),type:'DELETE',success:function(data,status){
                                        if(data.result==200) it.closest(".resTab").remove()
                                        if(data.result==403) console.log(data)//服务器错误
                                    }})
                                }
                            }else{
                                $(this).closest(".resTab").remove()
                            }
                        }else{
                            $(this).find("p").html("确定删除？")
                            $(this).toggleClass("onWarnConfirm",true)
                            this.ifConfirm=1
                            var it=$(this)
                            setTimeout(function(){
                                it.each(function(){
                                    this.ifConfirm=0
                                    $(this).find("p").html("删除合同")
                                    $(this).removeClass("onWarnConfirm")
                                })
                            },2000)
                        }
                    })

                    $(selector).find(".resReset").click(function(e){
                        stopBubleUp(e)
                        var p=$(this).closest(".resTab").find("input")

                        if($(this).closest(".resTab.ctCreateFlag").length) {
                            for(var i=0;i<p.length;i++) p[i].value=null
                        }else{
                            var id=$(this).closest(".resTab").find("p:first")[0].innerHTML
                            $.getJSON('/ct?pg=1&kw='+id+'&rd='+Math.random().toString(36).substr(2),function(data,status){
                                if (status == "success") {
                                    var arr=[data[0].name,data[0].id,
                                        data[0].ext.partys[0],data[0].ext.partys[1],
                                        data[0].ext.exp,data[0].ext.money,
                                        data[0].ext.time,data[0].ext.location,
                                        data[0].ext.rprs[0],data[0].ext.rprs[1],
                                        data[0].status]
                                    p[0].value=arr[0]
                                    p[1].value=arr[2]
                                    p[2].value=arr[3]
                                    p[3].value=arr[4][0]
                                    p[4].value=arr[4][1]
                                    for(var i=5;i<p.length;i++) p[i].value=arr[i]
                                }else{
                                    //$("#res11").html("服务器繁忙，请稍后再试。").fadeIn(500)
                                }
                            })
                        }
                    })

                    $(selector).find(".resPut").unbind('click').click(function(e){
                        stopBubleUp(e)
                        var p=$(this).closest(".resTab").find("input")
                        var it=$(this)

                        if($(this).closest(".resTab.ctCreateFlag").length) {
                            $.post("/ct?rd="+Math.random().toString(36).substr(2), {name:p[0].value,
                                    a:p[1].value,b:p[2].value,money:p[5].value,begin:p[3].value,
                                    end:p[4].value,location:p[7].value,aa:p[8].value,bb:p[9].value,time:p[6].value
                                },function (data, status) {
                                    if (status == "success") {
                                        $.getJSON('/ct?pg=1&kw='+data.id+'&rd='+Math.random().toString(36).substr(2),function(data,status){//get new id
                                            if (status == "success") {
                                                resTabAdd(1,[data[0].name,data[0].id,
                                                    data[0].ext.partys[0],data[0].ext.partys[1],
                                                    data[0].ext.exp,data[0].ext.money,
                                                    data[0].ext.time,data[0].ext.location,
                                                    data[0].ext.rprs[0],data[0].ext.rprs[1],
                                                    data[0].status,data[0].key])
                                                it.closest(".resTab").remove()
                                            }else{
                                                //$("#res11").html("服务器繁忙，请稍后再试。").fadeIn(500)
                                            }
                                        })
                                    }else{
                                        //$("#res11").html("服务器繁忙，请稍后再试。").fadeIn(500)
                                    }
                                })
                        }else{
                            var id=$(this).closest(".resTab").find("p:first")[0].innerHTML
                            $.ajax({url:'/ct?rd='+Math.random().toString(36).substr(2),type:'PUT',data:{id:id,name:p[0].value,
                                    a:p[1].value,b:p[2].value,money:p[5].value,begin:p[3].value,
                                    end:p[4].value,location:p[7].value,aa:p[8].value,bb:p[9].value,time:p[6].value},
                                success:function(data,status){
                                    if (status == "success") {
                                        $.getJSON('/ct?pg=1&kw='+id+'&rd='+Math.random().toString(36).substr(2),function(data,status){
                                            if (status == "success") {
                                                resTabAdd(1,[data[0].name,data[0].id,
                                                    data[0].ext.partys[0],data[0].ext.partys[1],
                                                    data[0].ext.exp,data[0].ext.money,
                                                    data[0].ext.time,data[0].ext.location,
                                                    data[0].ext.rprs[0],data[0].ext.rprs[1],
                                                    data[0].status,data[0].key])
                                                it.closest(".resTab").remove()
                                            }else{
                                                //$("#res11").html("服务器繁忙，请稍后再试。").fadeIn(500)
                                            }
                                        })
                                    }else{
                                        //$("#res11").html("服务器繁忙，请稍后再试。").fadeIn(500)
                                    }
                                }
                            })
                        }
                    })

                    $(selector).find(".resGive").unbind('click').click(function(e){
                        stopBubleUp(e)
                        var p=$(this).closest(".resTab").find("input")
                        var it=$(this)

                        if($(this).closest(".resTab.ctCreateFlag").length) {
                            $.post("/ct?rd="+Math.random().toString(36).substr(2), {name:p[0].value,
                                    a:p[1].value,b:p[2].value,money:p[5].value,begin:p[3].value,
                                    end:p[4].value,location:p[7].value,aa:p[8].value,bb:p[9].value,time:p[6].value,ifGive:1},
                                function (data, status) {//id??????
                                    if (status == "success") {
                                        $.getJSON('/ct?pg=1&kw='+data.id+'&rd='+Math.random().toString(36).substr(2),function(data,status){
                                            if (status == "success") {
                                                resTabAdd(1,[data[0].name,data[0].id,
                                                    data[0].ext.partys[0],data[0].ext.partys[1],
                                                    data[0].ext.exp,data[0].ext.money,
                                                    data[0].ext.time,data[0].ext.location,
                                                    data[0].ext.rprs[0],data[0].ext.rprs[1],
                                                    data[0].status,data[0].key])
                                                it.closest(".resTab").remove()
                                                $("#ctheader i:eq(0)").fadeIn(500)
                                            }else{
                                                //$("#res11").html("服务器繁忙，请稍后再试。").fadeIn(500)
                                            }
                                        })
                                    }else{
                                        //$("#res11").html("服务器繁忙，请稍后再试。").fadeIn(500)
                                    }
                                })
                        }else{
                            
                            /*
                            var id=$(this).closest(".resTab").find("p:first")[0].innerHTML
                            $.ajax({url:'/ct',type:'PUT',data:{id:id,name:p[0],
                                    a:p[1],b:p[2],money:p[9],begin:p[5],
                                    end:p[6],location:p[4],aa:p[7],bb:p[8]},
                                success:function(data,status){
                                    if (status == "success") {
                                        $.getJSON('/ct?pg=1&kw='+id,function(data,status){
                                            if (status == "success") {
                                                resTabAdd(1,[data[0].name,data[0].id,
                                                    data[0].ext.partys[0],data[0].ext.partys[1],
                                                    data[0].ext.exp,data[0].ext.money,
                                                    data[0].ext.time,data[0].ext.location,
                                                    data[0].ext.rprs[0],data[0].ext.rprs[1],
                                                    data[0].status])
                                                $(this).closest(".resTab").remove()
                                            }else{
                                                //$("#res11").html("服务器繁忙，请稍后再试。").fadeIn(500)
                                            }
                                        })
                                    }else{
                                        //$("#res11").html("服务器繁忙，请稍后再试。").fadeIn(500)
                                    }
                            }})
                            */
                        }
                    })

                    $(selector).find("p:eq(4)").unbind('click').click(function(){
                        //copy
                    })

                }

                function resTabBind(selector) {
                    if(!selector) selector="#ctbox .resTab:not(:first)"
                    $(selector).unbind('click').click(function () {
                        console.log(this.ifmark)
                        if (this.ifmark) {
                            $(this).addClass("resTab_").removeClass("resTab__")
                            this.ifmark = 0
                        } else {
                            $(this).removeClass("resTab_").addClass("resTab__")
                            this.ifmark = 1
                        }
                    })
                    $(selector).find(".resi").unbind('click').click(function(e){
                        stopBubleUp(e)
                        if(this.ifSelect){

                            $(this).addClass("fa-circle-o").removeClass("fa-check-circle-o")
                            this.ifSelect=0
                        }else{
                            $(this).addClass("fa-check-circle-o").removeClass("fa-circle-o")
                            this.ifSelect=1
                        }
                    })
                    $("#ctbox .resTab .input").unbind('click').click(function(e){stopBubleUp(e)})
                    resTabButtonsBind(selector)
                }

                function resTabCreate(selector,arr){//name,id,a,b,exp,money,time,location,aa,bb,status
                    var newDate=new Date(arr[10][1])
                    var ifGive=(arr[10][0])?(newDate.getFullYear()+"年"+(newDate.getMonth()+1)+"月"+newDate.getDate()+"日"):"未授权"
                    $(selector).append('<table class="resTab resTab_"><tr class="resTr"><td width="32" class="resTd"><i align="center" class="resi fa fa-circle-o"></i></td>' +
                            '<td width="130" class="resTd"><p align="center" class="resp">'+arr[1]+'</p></td>' +
                            '<td width="300" class="resTd"><p align="center" class="resp">'+arr[0]+'</p></td>' +
                            '<td width="100" class="resTd"><p align="center" class="resp">'+arr[2]+'</p></td>' +
                            '<td width="120" class="resTd"><p align="center" class="resp">'+ifGive+'</p></td>' +
                            '<td class="resTd"><table border="1" cellspacing="0" cellpadding="0" class="resTab1"><tr>' +
                            '<td width="555" colspan="4" class="resTd1"><div class="ctInputDiv"><input value="'+arr[0]+'" class="input"></div></td></tr><tr class="resTr2">' +
                            '<td width="555" colspan="4"><p align="right">合同编号:'+arr[1]+'</p></td></tr><tr>' +
                            '<td width="91" class="resTd3"><p align="center">甲&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;方</p></td>' +
                            '<td width="200" class="resTd4"><input value="'+arr[2]+'" class="input"></td>' +
                            '<td width="91" class="resTd3"><p align="center">乙&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;方</p></td>' +
                            '<td width="200" class="resTd4"><input value="'+arr[3]+ '" class="input"></td></tr><tr>' +
                            '<td width="91" class="resTd3"><p align="center">有效期限</p></td><td width="300" class="resTd4 resTd7">' +
                            '<div><div class="pure-u-11-24"><input type="date" class="input" value="'+arr[4][0]+'"></div><div class="pure-u-1-12"><p>到</p></div><div class="pure-u-11-24"><input type="date" class="input" value="'+arr[4][1]+'"></div></div></td>' +
                            '<td width="91" class="resTd3"><p align="center">合同金额</p></td><td width="100" class="resTd4 resTd6"><input value="'+arr[5]+'" type="number" class="input"></td></tr><tr>' +
                            '<td width="91" class="resTd3"><p align="center">签订时间</p></td><td width="200" class="resTd4"><input type="date" class="input" value="'+arr[6]+'"></td>' +
                            '<td width="91" class="resTd3"><p align="center">签订地点</p></td><td width="200" class="resTd4"><input value="'+arr[7]+'" class="input"></td></tr><tr>' +
                            '<td width="91" class="resTd3"><p align="center">甲方代表</p></td><td width="200" class="resTd4"><input value="'+arr[8]+'" class="input"></td>' +
                            '<td width="91" class="resTd3"><p align="center">乙方代表</p></td><td width="200" class="resTd4"><input value="'+arr[9]+'" class="input"></td></tr><tr class="resTr5">' +
                            '<td width="555" colspan="4"><p align="right">授权时间:'+ifGive+'</p></td></tr></table>' +
                            '<div class="onbuttons"><div value="'+((arr[10][0])?'':arr[11])+'"  class="resGive onbutton '+((arr[10][0])?'onRefuse ':'onGo ')+'"><p class="onbuttoni">'+((arr[10][0])?'已授权 ':'确定授权 ')+'</p></div><div class="resPut onbutton onGo"><p class="onbuttoni">保存修改</p></div><div class="resReset onbutton onWarn"><p class="onbuttoni">重置修改</p></div><div class="resDel onbutton onWarn"><p class="onbuttoni">删除合同</p></div></div></td></tr></table>')
                    return 1
                }

                function resTabClear(){
                    $("#ctbox .resTab:not(:first)").remove()
                }

                function resTabFlash(isClear,page){
                    var kw=encodeURI($("#ctheader input").val())
                    $.getJSON('/ct?pg='+page+'&kw='+kw+'&rd='+Math.random().toString(36).substr(2),function(data,status){
                        if (status == "success") {
                            if(isClear) resTabClear()
                            var long=data.length,
                                i_=(long<11)?long:10
                            for (var i = 0; i < i_ ; i++) {
                                resTabCreate("#ctbox",
                                    [data[i].name,data[i].id,
                                    data[i].ext.partys[0],data[i].ext.partys[1],
                                    data[i].ext.exp,data[i].ext.money,
                                    data[i].ext.time,data[i].ext.location,
                                    data[i].ext.rprs[0],data[i].ext.rprs[1],
                                    data[i].status,data[i].key])
                                if(i==i_-1) resTabBind()
                                if(long>10) $("#ctNext").fadeIn(500)
                                else $("#ctNext").fadeOut(500)
                            }
                        } else {
                            //$("#res11").html("服务器繁忙，请稍后再试。").fadeIn(500)
                        }
                    })
                }

                function resTabAdd(flag,arr){
                    if(flag){
                        var ifGive
                        if(!arr){
                            var newDate=new Date(),
                                dateText=newDate.getFullYear()+"-"+((newDate.getMonth()<9)?("0"+(newDate.getMonth()+1)):(newDate.getMonth()+1))+"-"+newDate.getDate()
                            arr=["","未生成","","湖南浩盛消防科技有限公司",[dateText,dateText],"",dateText,"","","",["",""],""]
                            ifGive="未授权"
                            $("#ctbox .resTab:first").after('<table class="resTab ctCreateFlag resTab__"><tr class="resTr"><td width="32" class="resTd"><i align="center" class="resi fa fa-circle-o"></i></td>' +
                                '<td width="130" class="resTd"><p align="center" class="resp">'+arr[1]+'</p></td>' +
                                '<td width="300" class="resTd"><p align="center" class="resp">'+arr[0]+'</p></td>' +
                                '<td width="100" class="resTd"><p align="center" class="resp">'+arr[2]+'</p></td>' +
                                '<td width="120" class="resTd"><p align="center" class="resp">'+ifGive+'</p></td>' +
                                '<td class="resTd"><table border="1" cellspacing="0" cellpadding="0" class="resTab1"><tr>' +
                                '<td width="555" colspan="4" class="resTd1"><div class="ctInputDiv"><input placeholder="点击填写合同名称" value="'+arr[0]+'" class="input"></div></td></tr><tr class="resTr2">' +
                                '<td width="555" colspan="4"><p align="right">合同编号:'+arr[1]+'</p></td></tr><tr>' +
                                '<td width="91" class="resTd3"><p align="center">甲&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;方</p></td>' +
                                '<td width="200" class="resTd4"><input value="'+arr[2]+'" class="input"></td>' +
                                '<td width="91" class="resTd3"><p align="center">乙&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;方</p></td>' +
                                '<td width="200" class="resTd4"><input value="'+arr[3]+ '" class="input"></td></tr><tr>' +
                                '<td width="91" class="resTd3"><p align="center">有效期限</p></td><td width="300" class="resTd4 resTd7">' +
                                '<div><div class="pure-u-11-24"><input type="date" class="input" value="'+arr[4][0]+'"></div><div class="pure-u-1-12"><p>到</p></div><div class="pure-u-11-24"><input type="date" class="input" value="'+arr[4][1]+'"></div></div></td>' +
                                '<td width="91" class="resTd3"><p align="center">合同金额</p></td><td width="100" class="resTd4 resTd6"><input value="'+arr[5]+'" type="number" class="input"></td></tr><tr>' +
                                '<td width="91" class="resTd3"><p align="center">签订时间</p></td><td width="200" class="resTd4"><input type="date" class="input" value="'+arr[6]+'"></td>' +
                                '<td width="91" class="resTd3"><p align="center">签订地点</p></td><td width="200" class="resTd4"><input value="'+arr[7]+'" class="input"></td></tr><tr>' +
                                '<td width="91" class="resTd3"><p align="center">甲方代表</p></td><td width="200" class="resTd4"><input value="'+arr[8]+'" class="input"></td>' +
                                '<td width="91" class="resTd3"><p align="center">乙方代表</p></td><td width="200" class="resTd4"><input value="'+arr[9]+'" class="input"></td></tr><tr class="resTr5">' +
                                '<td width="555" colspan="4"><p align="right">授权时间:'+ifGive+'</p></td></tr></table>' +
                                '<div class="onbuttons"><div class="resGive onbutton onGo"><p class="onbuttoni">确定授权</p></div><div class="resPut onbutton onGo"><p class="onbuttoni">保存修改</p></div><div class="resReset onbutton onWarn"><p class="onbuttoni">重置修改</p></div><div class="resDel onbutton onWarn"><p class="onbuttoni">删除合同</p></div></div></td></tr></table>')
                            resTabButtonsBind("#ctbox .resTab:eq(1)")
                        }else{
                            var newDate=new Date(arr[10][1])
                            ifGive=(arr[10][0])?(newDate.getFullYear()+"年"+(newDate.getMonth()+1)+"月"+newDate.getDate()+"日"):"未授权"
                            $("#ctbox .resTab:first").after('<table class="resTab resTab_"><tr class="resTr"><td width="32" class="resTd"><i align="center" class="resi fa fa-circle-o"></i></td>' +
                                '<td width="130" class="resTd"><p align="center" class="resp">'+arr[1]+'</p></td>' +
                                '<td width="300" class="resTd"><p align="center" class="resp">'+arr[0]+'</p></td>' +
                                '<td width="100" class="resTd"><p align="center" class="resp">'+arr[2]+'</p></td>' +
                                '<td width="120" class="resTd"><p align="center" class="resp">'+ifGive+'</p></td>' +
                                '<td class="resTd"><table border="1" cellspacing="0" cellpadding="0" class="resTab1"><tr>' +
                                '<td width="555" colspan="4" class="resTd1"><div class="ctInputDiv"><input value="'+arr[0]+'" class="input"></div></td></tr><tr class="resTr2">' +
                                '<td width="555" colspan="4"><p align="right">合同编号:'+arr[1]+'</p></td></tr><tr>' +
                                '<td width="91" class="resTd3"><p align="center">甲&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;方</p></td>' +
                                '<td width="200" class="resTd4"><input value="'+arr[2]+'" class="input"></td>' +
                                '<td width="91" class="resTd3"><p align="center">乙&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;方</p></td>' +
                                '<td width="200" class="resTd4"><input value="'+arr[3]+ '" class="input"></td></tr><tr>' +
                                '<td width="91" class="resTd3"><p align="center">有效期限</p></td><td width="300" class="resTd4 resTd7">' +
                                '<div><div class="pure-u-11-24"><input type="date" class="input" value="'+arr[4][0]+'"></div><div class="pure-u-1-12"><p>到</p></div><div class="pure-u-11-24"><input type="date" class="input" value="'+arr[4][1]+'"></div></div></td>' +
                                '<td width="91" class="resTd3"><p align="center">合同金额</p></td><td width="100" class="resTd4 resTd6"><input value="'+arr[5]+'" type="number" class="input"></td></tr><tr>' +
                                '<td width="91" class="resTd3"><p align="center">签订时间</p></td><td width="200" class="resTd4"><input type="date" class="input" value="'+arr[6]+'"></td>' +
                                '<td width="91" class="resTd3"><p align="center">签订地点</p></td><td width="200" class="resTd4"><input value="'+arr[7]+'" class="input"></td></tr><tr>' +
                                '<td width="91" class="resTd3"><p align="center">甲方代表</p></td><td width="200" class="resTd4"><input value="'+arr[8]+'" class="input"></td>' +
                                '<td width="91" class="resTd3"><p align="center">乙方代表</p></td><td width="200" class="resTd4"><input value="'+arr[9]+'" class="input"></td></tr><tr class="resTr5">' +
                                '<td width="555" colspan="4"><p align="right">授权时间:'+ifGive+'</p></td></tr></table>' +
                                '<div class="onbuttons"><div value="'+((arr[10][0])?'':arr[11])+'" class="resGive onbutton '+((arr[10][0])?'onRefuse ':'onGo ')+'"><p class="onbuttoni">'+((arr[10][0])?'已授权 ':'确定授权 ')+'</p></div><div class="resPut onbutton onGo"><p class="onbuttoni">保存修改</p></div><div class="resReset onbutton onWarn"><p class="onbuttoni">重置修改</p></div><div class="resDel onbutton onWarn"><p class="onbuttoni">删除合同</p></div></div></td></tr></table>')
                            resTabBind("#ctbox .resTab:eq(1)")
                        }
                    }
                }

                function resTabDel(flag,selector){
                    if(flag){
                        if($(selector).closest(".resTab.ctCreateFlag").length) {
                            $(selector).closest(".resTab").remove()
                            $("#ctheader i:eq(0)").fadeIn(500)
                        }else{
                            var id=$(selector).closest(".resTab").find("p:first")[0].innerHTML
                            $.ajax({url:'/ct?safe=0&id='+id+'&rd='+Math.random().toString(36).substr(2),type:'DELETE',success:function(data,status){
                                if(data.result==200) $(selector).closest(".resTab").remove()
                                if(data.result==403) console.log(data)//服务器错误
                            }})
                        } 
                    }else{
                        $(selector).closest(".resTab").remove()
                    }
                }

                //////////////////////////////////////////////
                //                                          //
                //////////////////////////////////////////////

                function usrTabButtonsBind(selector){
                    if(!selector) selector="#usrbox .resTab:not(:first)"

                    $(selector).find(".resDel").unbind('click').click(function(e){
                        stopBubleUp(e)
                        usrTabDel(1,this)
                    })
                    
                    $(selector).find(".resReset").unbind('click').click(function(e){
                        stopBubleUp(e)
                        var p=$(this).closest(".resTab").find("input")
                        p[7]=$(this).closest(".resTab").find("select")[0]
                        if($(this).closest(".resTab.usrCreateFlag").length) {
                            for(var i=0;i<p.length;i++) p[i].value=null
                        }else{
                            var uin=$(this).closest(".resTab").find("p")[4].innerHTML.substr(4,6)
                            $.getJSON('/usrs?pg=1&kw='+uin+'&rd='+Math.random().toString(36).substr(2),function(data,status){
                                if (status == "success") {
                                    var arr=[data[0].name,data[0].usr,
                                        data[0].idf,"",
                                        data[0].tel,data[0].em,
                                        data[0].job,data[0].pm]
                                    for(var i=0;i<p.length;i++) p[i].value=arr[i]
                                }else{
                                    //$("#res11").html("服务器繁忙，请稍后再试。").fadeIn(500)
                                }
                            })
                        }
                    })

                    $(selector).find(".resPut").unbind('click').click(function(e){
                        stopBubleUp(e)
                        var p=$(this).closest(".resTab").find("input")
                        p[7]=$(this).closest(".resTab").find("select")[0]
                        var it=$(this)

                        if($(this).closest(".resTab.usrCreateFlag").length) {
                            var pwd=(p[3].value)?p[3].value:p[2].value.substr(p[2].value.length-6,6)
                            $.post("/usrs?rd="+Math.random().toString(36).substr(2), {name:p[0].value,usr:p[1].value,
                                idf:p[2].value,pwd:hex_sha1(pwd),
                                tel:p[4].value,em:p[5].value,
                                job:p[6].value,pm:p[7].value},function (data, status) {
                                    if (status == "success") {
                                        $.getJSON('/usrs?pg=1&kw='+data.uin+'&rd='+Math.random().toString(36).substr(2),function(data,status){//get new uin
                                            if (status == "success") {
                                                usrTabAdd(1,[data[0].uin,data[0].name,data[0].usr,
                                                    data[0].idf,"",
                                                    data[0].tel,data[0].em,
                                                    data[0].job,data[0].pm,data[0].time])
                                                it.closest(".resTab").remove()
                                                $("#usrheader i:eq(0)").fadeIn(500)
                                            }else{
                                                //$("#res11").html("服务器繁忙，请稍后再试。").fadeIn(500)
                                            }
                                        })
                                    }else{
                                        //$("#res11").html("服务器繁忙，请稍后再试。").fadeIn(500)
                                    }
                                })
                        }else{
                            var uin=$(this).closest(".resTab").find("p")[4].innerHTML.substr(4,6)
                            $.ajax({url:'/usrs?rd='+Math.random().toString(36).substr(2),type:'PUT',data:{uin:uin,
                                name:p[0].value,usr:p[1].value,
                                idf:p[2].value,pwd:hex_sha1(p[3].value),
                                tel:p[4].value,em:p[5].value,
                                job:p[6].value,pm:p[7].value},
                                success:function(data,status){
                                    if (status == "success") {
                                        $.getJSON('/usrs?pg=1&kw='+uin+'&rd='+Math.random().toString(36).substr(2),function(data,status){
                                            if (status == "success") {
                                                usrTabAdd(1,[data[0].uin,data[0].name,data[0].usr,
                                                    data[0].idf,"",
                                                    data[0].tel,data[0].em,
                                                    data[0].job,data[0].pm,data[0].time])
                                                it.closest(".resTab").remove()
                                            }else{
                                                //$("#res11").html("服务器繁忙，请稍后再试。").fadeIn(500)
                                            }
                                        })
                                    }else{
                                        //$("#res11").html("服务器繁忙，请稍后再试。").fadeIn(500)
                                    }
                                }
                            })
                        }
                    })

                    $(selector).find(".resGive").unbind('click').click(function(e){
                        stopBubleUp(e)
                        var p=$(this).closest(".resTab").find("input")

                        if($(this).closest(".resTab.usrCreateFlag").length) {
                            //give
                        }else{
                            //get key
                        }
                    })
                }

                function usrTabBind(selector) {
                    if(!selector) selector="#usrbox .resTab:not(:first)"
                    $(selector).unbind('click').click(function () {
                        console.log(this.ifmark)
                        if (this.ifmark) {
                            $(this).removeClass("resTab__")
                            this.ifmark = 0
                        } else {
                            $(this).addClass("resTab__")
                            this.ifmark = 1
                        }
                    })
                    $(selector).find(".resi").unbind('click').click(function(e){
                        stopBubleUp(e)
                        if(this.ifSelect){
                            $(this).addClass("fa-circle-o").removeClass("fa-check-circle-o")
                            this.ifSelect=0
                        }else{
                            $(this).addClass("fa-check-circle-o").removeClass("fa-circle-o")
                            this.ifSelect=1
                        }
                    })
                    $("#usrbox .resTab .input").unbind('click').click(function(e){stopBubleUp(e)})//repeat bind bug
                    $("#usrbox .resTab .select").unbind('click').click(function(e){stopBubleUp(e)})//repeat bind bug
                    usrTabButtonsBind(selector)
                }

                function usrTabCreate(selector,arr){//name,usr,idf,pwd,tel,em,pms[4],job,time
                    var newDate=new Date(arr[9])
                    var SignTime=newDate.getFullYear()+"年"+(newDate.getMonth()+1)+"月"+newDate.getDate()+"日"
                    $(selector).append('<table class="resTab"><tr class="resTr"><td width="32" class="resTd"><i align="center" class="resi fa fa-circle-o"></i></td>' +
                            '<td width="100" class="resTd"><p align="center" class="resp">'+arr[1]+'</p></td>' +
                            '<td width="240" class="resTd"><p align="center" class="resp">'+arr[3]+'</p></td>' +
                            '<td width="160" class="resTd"><p align="center" class="resp">'+arr[2]+'</p></td>' +
                            '<td width="120" class="resTd"><p align="center" class="resp">'+(arr[8]?"管理员":"委托代理人")+'</p></td>' +
                            '<td class="resTd"><table border="0" cellspacing="0" cellpadding="0" class="resTab1"><tr class="resTr2">' +
                            '<td width="555" colspan="4"><p align="right">UIN:'+arr[0]+'</p></td></tr><tr>' +
                            '<td width="91" class="resTd3"><p align="center">真实姓名</p></td>' +
                            '<td width="200" class="resTd4"><input value="'+arr[1]+'" class="input"></td>' +
                            '<td width="91" class="resTd3"><p align="center">用户名</p></td>' +
                            '<td width="200" class="resTd4"><input placeholder="默认为UIN" value="'+arr[2]+'" max="16" class="input"></td></tr><tr>' +
                            '<td width="91" class="resTd3"><p align="center">证件号码*</p></td>' +
                            '<td width="200" class="resTd4"><input value="'+arr[3]+'" max="18" class="input"></td>' +
                            '<td width="91" class="resTd3"><p align="center">密&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;码*</p></td>' +
                            '<td width="200" class="resTd4"><input placeholder="默认为身份证后六位" value="'+arr[4]+'" class="input"></td></tr><tr>' +
                            '<td width="91" class="resTd3"><p align="center">Tel</p></td>' +
                            '<td width="200" class="resTd4"><input value="'+arr[5]+'" max="11" class="input"></td>' +
                            '<td width="91" class="resTd3"><p align="center">Email</p></td>' +
                            '<td width="200" class="resTd4"><input value="'+arr[6]+'" class="input"></td></tr><tr>' +
                            '<td width="91" class="resTd3"><p align="center">职&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;务</p></td>' +
                            '<td width="200" class="resTd4"><input value="'+arr[7]+'" class="input"></td>' +
                            '<td width="91" class="resTd3"><p align="center">角&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;色</p></td>' +
                            '<td width="200" class="resTd4"><select class="select"><option value="0" '+(arr[8]?'':'selected="selected"')+'>委托代理人</option><option value="1" '+(arr[8]?'selected="selected"':'')+'>管理员</option></select></td></tr><tr class="resTr5">' +
                            '<td width="555" colspan="4"><p align="right">注册日期:'+SignTime+'</p></td></tr></table>' +
                            '<div class="onbuttons"><div class="resGive onbutton onRefuse"><p class="onbuttoni">通知</p></div>' +
                            '<div class="resPut onbutton onGo"><p class="onbuttoni">保存</p></div>' +
                            '<div class="resReset onbutton onWarn"><p class="onbuttoni">重置</p></div>' +
                            '<div class="resDel onbutton onWarn"><p class="onbuttoni">删除</p></div></div></td></tr></table>')
                    return 1
                }

                function usrTabClear(){
                    $("#usrbox .resTab:not(:first)").remove()
                }

                function usrTabFlash(isClear,page){
                    var kw=encodeURI($("#usrheader input").val())
                    $.getJSON('/usrs?pg='+page+'&kw='+kw+'&rd='+Math.random().toString(36).substr(2),function(data,status){
                        if (status == "success") {
                            if(isClear) usrTabClear()
                            var long=data.length,
                                i_=(long<11)?long:10
                            for (var i = 0; i < i_ ; i++) {
                                usrTabCreate("#usrbox",
                                    [data[i].uin,data[i].name,data[i].usr,
                                    data[i].idf,"",
                                    data[i].tel,data[i].em,
                                    data[i].job,data[i].pm,data[i].time])
                                if(i==i_-1) usrTabBind()
                                if(long>10) $("#usrNext").fadeIn(500)
                                else $("#usrNext").fadeOut(500)
                            }
                        } else {
                            //$("#res11").html("服务器繁忙，请稍后再试。").fadeIn(500)
                        }
                    })
                }

                function usrTabAdd(flag,arr){
                    if(flag){
                        if(!arr){
                            var newDate=new Date(),
                                SignTime=newDate.getFullYear()+"年"+((newDate.getMonth()<9)?("0"+(newDate.getMonth()+1)):(newDate.getMonth()+1))+"月"+newDate.getDate()+"日"
                            arr=["未生成","","","","","","","",0]
                            $("#usrbox .resTab:first").after('<table class="resTab usrCreateFlag resTab__"><tr class="resTr"><td width="32" class="resTd"><i align="center" class="resi fa fa-circle-o"></i></td>' +
                            '<td width="100" class="resTd"><p align="center" class="resp">'+arr[1]+'</p></td>' +
                            '<td width="240" class="resTd"><p align="center" class="resp">'+arr[3]+'</p></td>' +
                            '<td width="160" class="resTd"><p align="center" class="resp">'+arr[2]+'</p></td>' +
                            '<td width="120" class="resTd"><p align="center" class="resp">'+(arr[8]?"管理员":"委托代理人")+'</p></td>' +
                            '<td class="resTd"><table border="0" cellspacing="0" cellpadding="0" class="resTab1"><tr class="resTr2">' +
                            '<td width="555" colspan="4"><p align="right">UIN:'+arr[0]+'</p></td></tr><tr>' +
                            '<td width="91" class="resTd3"><p align="center">真实姓名</p></td>' +
                            '<td width="200" class="resTd4"><input value="'+arr[1]+'" class="input"></td>' +
                            '<td width="91" class="resTd3"><p align="center">用户名</p></td>' +
                            '<td width="200" class="resTd4"><input placeholder="默认为UIN" value="'+arr[2]+'" max="16" class="input"></td></tr><tr>' +
                            '<td width="91" class="resTd3"><p align="center">证件号码*</p></td>' +
                            '<td width="200" class="resTd4"><input value="'+arr[3]+'" max="18" class="input"></td>' +
                            '<td width="91" class="resTd3"><p align="center">密&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;码*</p></td>' +
                            '<td width="200" class="resTd4"><input placeholder="默认为身份证后六位" value="'+arr[4]+'" class="input"></td></tr><tr>' +
                            '<td width="91" class="resTd3"><p align="center">Tel</p></td>' +
                            '<td width="200" class="resTd4"><input value="'+arr[5]+'" max="11" class="input"></td>' +
                            '<td width="91" class="resTd3"><p align="center">Email</p></td>' +
                            '<td width="200" class="resTd4"><input value="'+arr[6]+'" class="input"></td></tr><tr>' +
                            '<td width="91" class="resTd3"><p align="center">职&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;务</p></td>' +
                            '<td width="200" class="resTd4"><input value="'+arr[7]+'" class="input"></td>' +
                            '<td width="91" class="resTd3"><p align="center">角&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;色</p></td>' +
                            '<td width="200" class="resTd4"><select class="select"><option value="0" '+(arr[8]?'':'selected="selected"')+'>委托代理人</option><option value="1" '+(arr[8]?'selected="selected"':'')+'>管理员</option></select></td></tr><tr class="resTr5">' +
                            '<td width="555" colspan="4"><p align="right">注册日期:'+SignTime+'</p></td></tr></table>' +
                            '<div class="onbuttons"><div class="resGive onbutton onRefuse"><p class="onbuttoni">通知</p></div>' +
                            '<div class="resPut onbutton onGo"><p class="onbuttoni">保存</p></div>' +
                            '<div class="resReset onbutton onWarn"><p class="onbuttoni">重置</p></div>' +
                            '<div class="resDel onbutton onWarn"><p class="onbuttoni">删除</p></div></div></td></tr></table>')
                            usrTabButtonsBind("#usrbox .resTab:eq(1)")
                        }else{
                            var newDate=new Date(arr[9])
                            var SignTime=newDate.getFullYear()+"年"+(newDate.getMonth()+1)+"月"+newDate.getDate()+"日"
                            $("#usrbox .resTab:first").after('<table class="resTab"><tr class="resTr"><td width="32" class="resTd"><i align="center" class="resi fa fa-circle-o"></i></td>' +
                            '<td width="100" class="resTd"><p align="center" class="resp">'+arr[1]+'</p></td>' +
                            '<td width="240" class="resTd"><p align="center" class="resp">'+arr[3]+'</p></td>' +
                            '<td width="160" class="resTd"><p align="center" class="resp">'+arr[2]+'</p></td>' +
                            '<td width="120" class="resTd"><p align="center" class="resp">'+(arr[8]?"管理员":"委托代理人")+'</p></td>' +
                            '<td class="resTd"><table border="0" cellspacing="0" cellpadding="0" class="resTab1"><tr class="resTr2">' +
                            '<td width="555" colspan="4"><p align="right">UIN:'+arr[0]+'</p></td></tr><tr>' +
                            '<td width="91" class="resTd3"><p align="center">真实姓名</p></td>' +
                            '<td width="200" class="resTd4"><input value="'+arr[1]+'" class="input"></td>' +
                            '<td width="91" class="resTd3"><p align="center">用户名</p></td>' +
                            '<td width="200" class="resTd4"><input placeholder="默认为UIN" value="'+arr[2]+'" max="16" class="input"></td></tr><tr>' +
                            '<td width="91" class="resTd3"><p align="center">证件号码*</p></td>' +
                            '<td width="200" class="resTd4"><input value="'+arr[3]+'" max="18" class="input"></td>' +
                            '<td width="91" class="resTd3"><p align="center">密&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;码*</p></td>' +
                            '<td width="200" class="resTd4"><input placeholder="默认为身份证后六位" value="'+arr[4]+'" class="input"></td></tr><tr>' +
                            '<td width="91" class="resTd3"><p align="center">Tel</p></td>' +
                            '<td width="200" class="resTd4"><input value="'+arr[5]+'" max="11" class="input"></td>' +
                            '<td width="91" class="resTd3"><p align="center">Email</p></td>' +
                            '<td width="200" class="resTd4"><input value="'+arr[6]+'" class="input"></td></tr><tr>' +
                            '<td width="91" class="resTd3"><p align="center">职&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;务</p></td>' +
                            '<td width="200" class="resTd4"><input value="'+arr[7]+'" class="input"></td>' +
                            '<td width="91" class="resTd3"><p align="center">角&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;色</p></td>' +
                            '<td width="200" class="resTd4"><select class="select"><option value="0" '+(arr[8]?'':'selected="selected"')+'>委托代理人</option><option value="1" '+(arr[8]?'selected="selected"':'')+'>管理员</option></select></td></tr><tr class="resTr5">' +
                            '<td width="555" colspan="4"><p align="right">注册日期:'+SignTime+'</p></td></tr></table>' +
                            '<div class="onbuttons"><div class="resGive onbutton onRefuse"><p class="onbuttoni">通知</p></div>' +
                            '<div class="resPut onbutton onGo"><p class="onbuttoni">保存</p></div>' +
                            '<div class="resReset onbutton onWarn"><p class="onbuttoni">重置</p></div>' +
                            '<div class="resDel onbutton onWarn"><p class="onbuttoni">删除</p></div></div></td></tr></table>')
                            usrTabBind("#usrbox .resTab:eq(1)")
                        }
                    }
                }

                function usrTabDel(flag,selector){
                    if(flag){
                        if($(selector).closest(".resTab.usrCreateFlag").length) {
                            $(selector).closest(".resTab").remove()
                            $("#usrheader i:eq(0)").fadeIn(500)
                        }else{
                            var uin=$(selector).closest(".resTab").find("p")[4].innerHTML.substr(4,6)
                            $.ajax({url:'/usrs?safe=0&uin='+uin+'&rd='+Math.random().toString(36).substr(2),type:'DELETE',success:function(data,status){
                                if(data.result==200) $(selector).closest(".resTab").remove()
                                if(data.result==403) console.log(data)//服务器错误
                            }})
                        }
                    }else{
                        $(selector).closest(".resTab").remove()
                    }
                }