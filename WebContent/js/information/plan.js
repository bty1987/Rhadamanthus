$(function(){
//定义全局变量  json
    var  plan= {
        status : [],
        saveBtn: $("#addplanBtn").on("click", saveData),//绑定事件
        cancelBtn: $("#cancelplanBtn"),
        modal: $("#addplanModal"),
        planItems: {},
        editFlg: false,
        currentTime:getNowFormatDate().substr(2,10),
    };

    $('#executeTime').timepicker({
        minuteStep: 1,
        showSeconds: false,
        showMeridian: false
    });
    $(".date-picker").datepicker({autoclose: !0}).on("show",function() {
        setTimeout(function() {
            $(".dropdown-menu").css("z-index", 1060)
        },0)
    }).next().on(ace.click_event,function() {
        a(this).prev().focus()
    });

    plan.planItems.timing = $("#timing").on("change",function(e){
       if($("#timing").val() == 0){
           $("#timediv").addClass("hide")
       }else{
           $("#timediv").removeClass("hide")
       }
    });

    plan.planItems.task = $("#task");
    plan.planItems.executeDate = $("#executeDate");
    plan.planItems.executeTime = $("#executeTime");
    plan.planItems.args =$("#args");
    com.post(api.ds.information,{},function(res){
        $.each(res.planStatus,function(i,v){
            plan.status[v.key] = v.value
        })
    },null,false)
    com.post(api.information.queryTask,{},function(res){
        plan.planItems.task.bindData(res.tasks ,"tid","name", false);
    },null,false)

    var displayFunc  = (function(){

        var renderList = function(tableId,listData){
            var $tableWrap = $('#' + tableId);
            var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');
            if(listData && listData.length){
                $.each(listData,function(i, v){
                    var $liLine = creatLine(v);

                    $liLine.appendTo($ul);
                });
                $ul.appendTo($tableWrap);
            }
        };

        var creatLine = function(v){   //页面中的一条数据

            var $liLine = $('<li></li>').addClass('item-orange clearfix');
            var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html( v.task.name));
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

            var $btnDown = $('<a></a>').addClass('btn btn-minier btn-yellow').html('下载');
            var $btnEdit = $('<a></a>').addClass('btn btn-minier btn-success').html('编辑');
            var $btncancel = $('<a></a>').addClass('btn btn-minier btn-warning').html('取消计划');

            var propertyArr = [
                ["创建人:", v.createrName, "grey"],
                ["创建时间:", v.createTime, "green"],
                ["参数:",(v.args == "" || v.args == null) ?  "---" : v.args, "grey"],
                ["执行时间:", v.executeTime != null ? v.executeTime : "---", "green"],
                ["结果文件路径:",v.resultFilepath != null ? v.resultFilepath : "---" , "grey"],
                ["信息文件路径:", v.infoFilepath != null ? v.infoFilepath : "---" , "grey"],
                ["进度:", v.schedule , "grey"],
                ["状态:", plan.status[v.status] , "red"],
                ["结果信息:" ,v.info != null ? v.info : "---" , "grey"],
            ];

            $.each(propertyArr, function(index,value) {
                var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                $liProperty.appendTo($ulProperty);
            });

            if((v.resultFilepath != null && v.resultFilepath.length != 0) && (v.status == 2)){
                $divBtnWrap.append($btnDown).appendTo($h3);
            }else if((v.status == 0) && (v.executeTime != null && v.executeTime.length != 0) &&(Number(v.executeTime )> Number(plan.currentTime)) ){
                $divBtnWrap.append($btnEdit).append($btncancel).appendTo($h3);
            }

            $liLine.append($h3).append($ulProperty);

            $btnEdit.click(function(){
                edit(v);
            });

            $btncancel.click(function(){
                cancel(v);
            });

            $btnDown.click(function(){
                window.open(config.server + v.resultFilepath);
                if(v.infofilepath != null){
                    window.open(config.server + v.infofilepath);
                }
                return false;
            });

            return $liLine;
        };

        return {
            init : function(tableId,listData){
                $('#' + tableId).html(null);
                renderList(tableId,listData);
            },
            drawLine : function(v){
                return creatLine(v);
            }
        };
    })();


    var planSeacher = new Searcher();

    planSeacher.init( ["taskselect"], "condList", api.information.pagePlan, function(data){
        displayFunc.init('resultList', data);
    }, "pagenation", "planPostData", null, false, null, function(){

        var $adda = $('<a></a>').addClass('btn btn-minier btn-yellow pull-left').attr('name', 'addplan').css("margin", "0px 3px");
        var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
        var $addspan = $('<span ></span>').text('添加').appendTo($adda);

        return [$adda];
    });

    //添加
    $('[name="addplan"]' , '#pagenation').on("click",function(){  //选择器 [属性名="属性值"]  匿名函数
        com.cleanItems(plan.planItems);
        $("#timediv").addClass("hide")
        plan.modal.modal("show");
        plan.editFlg = false;

    });

    function edit(v){
        plan.modal.modal("show"); //弹出弹层
        plan.editFlg=true;
        plan.planItems.pid = v.pid;
        plan.planItems.task.val(v.task.tid);
        plan.planItems.args.val(v.args);
        if(v.executeTime != null){
            $("#timing").val(1)
            $("#timediv").removeClass("hide")
            plan.planItems.executeDate.val("20"+v.executeTime.substr(0,2)+"-"+v.executeTime.substr(2,2)+"-"+v.executeTime.substr(4,2) );
            plan.planItems.executeTime.val(v.executeTime.substr(6,2)+":"+v.executeTime.substr(8,2));
        }else{
            $("#timing").val(0)
        }
    }
    //撤销计划
    function cancel(v){
        var btn = $(this);
        var span = btn.find('span');
        btn.find('i').remove();
        var loading = $('<i></i>').addClass('icon-spinner icon-spin white bigger-125');
        span.prepend(loading);
        var message = "<p>确定要撤销该计划吗?</p>";
        bootbox.confirm(message, function(result) {
            if(result){
                com.post(api.information.cancelPlan,{"plan.pid" :v.pid},function(res){
                    planSeacher.doSearch();
                })
            }
            else{
                btn.find('i').remove();
                var prepared = $('<i></i>').addClass('icon-ok bigger-110');
                span.prepend(prepared);
            }
        })
    }
    //保存
    function saveData(){
        if(com.validate())
            return;

        var url ;
        var options = {
            "plan.task.tid" :plan.planItems.task.val(),
            "plan.args" : plan.planItems.args.val(),
        };
        if ($("#timing").val() != 0){
            options["plan.executeTime"]=plan.planItems.executeDate.val() + ' '+ plan.planItems.executeTime.val()
        }
        if(plan.editFlg) {
            url = api.information.updatePlan;
            options["plan.pid"] = plan.planItems.pid;
        }else{
            url = api.information.createPlan;
        }
        com.post(url, options, function(res){
            plan.modal.modal("hide");
            planSeacher.doSearch();
        });

    }

    function getNowFormatDate() {
        var date = new Date();
        var month = date.getMonth() + 1;
        var strDate = date.getDate();
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
        }
        var currentdate = date.getFullYear() + month + strDate+ date.getHours() + date.getMinutes();

        return currentdate;
    }

});
