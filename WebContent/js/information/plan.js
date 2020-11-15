$(function () {

    var plan = {

        modals: {
            planModal: com.focusPage("#addplanModal")
        },
        items: {
            current: com.focusPage("#current"),
            executeDate: com.focusPage("#executeDate"),
            executeTime: com.focusPage("#executeTime"),
            task : com.focusPage("#task")
        },
        
        btns: {
           saveBtn: com.focusPage("#addplanBtn"),
        },
        
        plugins: {},
        lists: {},
        status: {},

        keyword: null,

        current: "",
        currentTime: getNowFormatDate().substr(2, 10),
    };

    plan.btns.saveBtn.bindClick(saveData);

    plan.modals.planModal.on("hide.bs.modal", function () {
        com.clearValidator();
        com.cleanItems(plan.items);
    });

    com.datetime(plan.items.executeDate);
    com.datetime(plan.items.executeTime, "time");

    com.post(api.ds.information, {}, function(res) {
        plan.status = res.planStatus.split("key", "value");
    });

    com.post(api.data.queryTask, {"task.level": 0}, function (res) {
        plan.plugins = res.tasks.split("keyWord", "plugins");
    }, null, false);

    com.post(api.data.queryTaskRoleRightByUserId, {"taskRoleRight.rid": params.userInfo.user.role.rid}, function (res) {
        var task = [];

        $.each(res.taskRoleRights, function(i, v){

            task.push(v.task);
        });

        plan.items.task.bindData(task, "keyWord", "name", false);
    }, null, false);

    planUtils.bindUploadBtn("#attachment", 1070);

    var displayFunc = (function () {

        var renderList = function (tableId, listData) {
            
            var $tableWrap = com.focusPage('#' + tableId);
            var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');
            
            if (listData && listData.length) {
                $.each(listData, function (i, v) {
                    creatLine(v).appendTo($ul);
                });
                $ul.appendTo($tableWrap);
            }
        };

        var creatLine = function (v) {   // 页面中的一条数据
            var $liLine = $('<li></li>').addClass('item-orange clearfix');
            var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(v.task.name));
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

            var $btnDown = $('<a></a>').addClass('btn btn-minier btn-yellow').html('下载');
            var errlog = $('<a></a>').addClass('btn btn-minier btn-danger').html('执行日志');
            var $btncancel = $('<a></a>').addClass('btn btn-minier btn-warning').html('取消计划');
            
            var propertyArr = [
                ["创建人:", v.creater.userName, "grey"],
                ["创建时间:", v.createTime, "green"],
                ["参数:", (v.args == "" || v.args == null) ? "---" : v.args, "grey"],
                ["执行时间:", v.executeTime != null ? v.executeTime : "---", "green"],
                ["结果文件路径:", v.resultFilepath != null ? v.resultFilepath : "---", "grey"],
                ["信息文件路径:", v.infoFilepath != null ? v.infoFilepath : "---", "grey"],
                ["进度:", v.schedule, "grey"],
                ["状态:", plan.status[v.status], "red"],
                ["结果信息:", (v.info == "" || v.info == null) ? "---" : v.info, "grey"]
            ];

            $.each(propertyArr, function (index, value) {
                var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                $liProperty.appendTo($ulProperty);
            });

            if ((v.resultFilepath != null && v.resultFilepath.length != 0) && (v.status == 2)) {
                $divBtnWrap.append($btnDown).appendTo($h3);
            } else if ((v.status == 0) && (v.executeTime != null && v.executeTime.length != 0) && (Number(v.executeTime) > Number(plan.currentTime))) {
                $divBtnWrap.append($btncancel).appendTo($h3);
            }

            if (v.infoFilepath != null && v.infoFilepath != "") {
                $divBtnWrap.append(errlog).appendTo($h3);
            }

            $liLine.append($h3).append($ulProperty);

            $btncancel.click(function () {
                cancel(v);
            });

            $btnDown.click(function () {
                window.open(config.media + v.resultFilepath);
                return false;
            });

            errlog.click(function () {
                window.open(config.media + v.infoFilepath);
                return false;
            });
            return $liLine;
        };

        return {
            init: function (tableId, listData) {
                com.focusPage('#' + tableId).html(null);
                renderList(tableId, listData);
            },
            drawLine: function (v) {
                return creatLine(v);
            }
        };
    })();

    var searcher = new Searcher();

    searcher.init(["information-plan-task", "information-plan-createTime", "information-plan-status"], "condList", api.information.pagePlan, function (data) {
        displayFunc.init('resultList', data);
    }, "pagenation", "planPostData", null, false, null, function () {

        var $adda = $('<a></a>').addClass('btn btn-minier btn-yellow pull-left').attr('id', 'addPlan').css("margin", "0px 3px");
        var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
        var $addspan = $('<span ></span>').text('添加').appendTo($adda);

        var $exporta = $('<a></a>').addClass('btn btn-minier btn-inverse').attr('id', 'createPlan').css("margin", "0px 3px");
        var $exporti = $('<i></i>').addClass('icon-plus bigger-110').appendTo($exporta);
        var $exportspan = $('<span></span>').text('创建').appendTo($exporta);

        return [$adda, $exporta];
    });

    com.focusPage('#addPlan', '#pagenation').on("click", function () {

        com.focusPage("#timediv").addClass("hide");

        taskArgs();
        
        current();
        
        com.focusPage(".planitem").click(current);
        
        plan.modals.planModal.modal("show");
    });

    com.focusPage('#createPlan', '#pagenation').on("click", function () {
        params["searcher"] = searcher;
        com.popup4page("#stockRecordPopUp", "/views/information/plan2create.html", "计划创建")
    });

    function saveData() {

        if (com.validate('addplanModal'))
            return false;

        var options = {
            "plan.task.keyWord": plan.items.task.val()
        };

        var cuts = plan.plugins[plan.keyword];
        var results = cuts.split(",");
        var args = "";
        var flag = false;
        
        $.each(results, function (i, v) {
            if (v == "C") {
                var filePaths = com.focusPage("#filePath");
                if (filePaths.val() == null || filePaths.val() == "") {
                    flag = true;
                    return
                }
                args = args + filePaths.val() + ",";
            }else{
                args = args +  com.focusPage("#id" + i).val()+ ",";
            }
        });
        
        if(flag){
            com.showAlert(com.warning, "上传文件不能为空!");
            return false;
        }
        
        args = args.substring(0, args.length - 1);
        
        var date = plan.items.executeDate.val();
        var time = plan.items.executeTime.val();
        
        var executeTime = date.replace(/-/g, '').substr(2) + time.replace(/:/g, '').substr(0, 4);
        
        options["plan.args"] = args;
        options["plan.executeTime"] = executeTime;
        
        if(executeTime < plan.current){
            com.showAlert(com.warning, "执行时间已超时");
            return false;
        }
        
        com.post(api.information.createPlan, options, function (res) {
            com.showAlert(com.info, "计划创建成功!");
            plan.modals.planModal.modal("hide");
            searcher.doSearch();
        });

    }

    function cancel(v) {
        com.showConfirm('是否确认撤销计划', function () {
            com.post(api.information.cancelPlan, {"plan.pid": v.pid}, function (res) {
                searcher.doSearch();
            });
        });
    }
    
    function current(){
        com.post(api.common.current, {"current": "yyyy-MM-dd hh:mm:ss"}, function(res){
            plan.current = res.current.replace(/[-:\s]/g, '').substr(2, 10);
            plan.items.current.val(res.current);
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
        var currentdate = "" + date.getFullYear() + month + strDate + date.getHours() + date.getMinutes();

        return currentdate;
    }

    taskArgs();

    function taskArgs() {
        plan.items.task.on("change", function (e) {
            $this = $(this);

            com.focusPage("#timediv").removeClass("hide");

            var asd = com.focusPage("#pluginss");
            
            asd.empty();

            var keyworld = $this.val();
            plan.keyword = keyworld;
            var cut = plan.plugins[keyworld];
            if (cut != null) {
                var result = cut.split(",");
                $.each(result, function (i, v) {
                    var divId = plan.lists[v];
                    if (v !== null && v != "") {
                        var idName = "id" + i;
                        eval("planUtils.Plugins" + v + "(" + i + ")");
                        plan.lists[v] = idName;
                    }
                });
            }
        }).trigger("change");
    }

});