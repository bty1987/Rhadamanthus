$(function () {

    var plan = {

        saveBtn: com.focusPage("#addplanBtn"),
        cancelBtn: com.focusPage("#cancelplanBtn"),
        modals: {
            planModal: com.focusPage("#addplanModal")
        },
        planItems: {
                executeDate : com.focusPage("#executeDate"),
                executeTime : com.focusPage("#executeTime"),
                task : com.focusPage("#task")
        },
        plugins: {},
        lists: {},
        status: {},

        letter: null,
        keywordName: null,

        editFlg: false,
        currentTime: getNowFormatDate().substr(2, 10),
        taskContent: {}
    };

    plan.saveBtn.bindClick(saveData);

    plan.modals.planModal.on("hide.bs.modal", function () {
        com.clearValidator();
        com.cleanItems(plan.planItems);
    });

    com.datetime(plan.planItems.executeDate);
    com.datetime(plan.planItems.executeTime, "time");

    com.post(api.ds.information, {}, function(res) {
        plan.status = res.planStatus.split("key", "value");
    });

    com.post(api.information.queryTask, {}, function (res) {
        plan.plugins = res.tasks.split("keyWord", "plugins");
    }, null, false);

    com.post(api.personel.queryUserForSelfByUserId, {}, function(data){
        console.log(data);
        com.post(api.right.queryTaskUserRightByUserId, {"user.userId": data.userInfo.user.userId}, function (res) {

            console.log(res);

            plan.planItems.task.bindData(res.tasks, "keyWord", "name", false);

        }, null, false);
    });



    planUtils.bindUploadBtn("#attachment", 1070);

    var displayFunc = (function () {

        var renderList = function (tableId, listData) {
            var $tableWrap = com.focusPage('#' + tableId);
            var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');
            if (listData && listData.length) {
                $.each(listData, function (i, v) {
                    var $liLine = creatLine(v);

                    $liLine.appendTo($ul);
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

    var planSeacher = new Searcher();

    planSeacher.init(["taskselect", "planCreateDate", "planStatus"], "condList", api.information.pagePlan, function (data) {
        displayFunc.init('resultList', data);
    }, "pagenation", "planPostData", null, false, null, function () {

        var $adda = $('<a></a>').addClass('btn btn-minier btn-yellow pull-left').attr('id', 'addPlan').css("margin", "0px 3px");
        var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
        var $addspan = $('<span ></span>').text('添加').appendTo($adda);

        return [$adda];
    });

    com.focusPage('#addPlan', '#pagenation').on("click", function () {

        com.focusPage("#timediv").addClass("hide");

        taskArgs();
        plan.modals.planModal.modal("show");
        plan.editFlg = false;
    });

    function saveData() {

        if (com.validate('addplanModal'))
            return false;

        var options = {
            "plan.task.keyWord": plan.planItems.task.val()
        };

        var cuts = plan.plugins[plan.keywordName];
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
            return
        }
        args = args.substring(0, args.length - 1);
        options["plan.args"] = args;

        var times = plan.planItems.executeDate.val() + ' ' + plan.planItems.executeTime.val();
        var executeTime = new Date(times);

        if (planUtils.TimeComparison(executeTime, 5)) {
            options["plan.executeTime"] = times;
        } else {
            com.showAlert(com.warning, "执行时间请大于当前时间5分钟!");
            return
        }
        com.post(api.information.createPlan, options, function (res) {
            com.showAlert(com.info, "计划创建成功!");
            plan.modals.planModal.modal("hide");
            planSeacher.doSearch();
        });

    }

    function cancel(v) {
        com.showConfirm('是否确认撤销计划', function () {
            com.post(api.information.cancelPlan, {"plan.pid": v.pid}, function (res) {
                planSeacher.doSearch();
            });
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
        plan.planItems.task.on("change", function (e) {
            $this = $(this);

            com.focusPage("#timediv").removeClass("hide");

            var asd = com.focusPage("#pluginss");
            asd.empty();

            var keyworld = $this.val();
            plan.keywordName = keyworld;
            var cut = plan.plugins[keyworld];
            plan.letter = cut;
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