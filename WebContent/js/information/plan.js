$(function () {
// 定义全局变量 json
    var plan = {
        status: [],
        saveBtn: com.focusPage("#addplanBtn").on("click", saveData),// 绑定事件
        cancelBtn: com.focusPage("#cancelplanBtn"),//取消
        modal: com.focusPage("#addplanModal"),//添加
        planItems: {},
        editFlg: false,
        currentTime: getNowFormatDate().substr(2, 10),
        taskContent: {}
    };
    var plugins = {};

    planUtils.bindDatePicker(".date-picker", 1070);
    planUtils.bindDateRangePicker("input[name='date-range-picker']", 1070);
    planUtils.bindExecuteTimeBtn("#executeTime");
    var lists = {};
    plan.planItems.executeDate = com.focusPage("#executeDate");
    plan.planItems.executeTime = com.focusPage("#executeTime");
    plan.planItems.task = com.focusPage("#task");
    var idValue;
    var letter;
    var keywordName;
    taskArgs();

    com.post(api.information.queryTask, {}, function (res) {
        $.each(res.tasks, function (i, v) {
            plugins[v.keyWord] = v.plugins
        });
        plan.planItems.task.bindData(res.tasks, "keyWord", "name", false);
    }, null, false);

    planUtils.bindUploadBtn("#attachment", 1070);

    //画列表
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

            var status = {
                "0": "初始",
                "1": "取消",
                "2": "成功",
                "3": "失败",
                "4": "执行"
            };
            
            var propertyArr = [
                ["创建人:", v.creater.userName, "grey"],
                ["创建时间:", v.createTime, "green"],
                ["参数:", (v.args == "" || v.args == null) ? "---" : v.args, "grey"],
                ["执行时间:", v.executeTime != null ? v.executeTime : "---", "green"],
                ["结果文件路径:", v.resultFilepath != null ? v.resultFilepath : "---", "grey"],
                ["信息文件路径:", v.infoFilepath != null ? v.infoFilepath : "---", "grey"],
                ["进度:", v.schedule, "grey"],
                ["状态:", status[v.status], "red"],
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

    planSeacher.init(["taskselect"], "condList", api.information.pagePlan, function (data) {
        displayFunc.init('resultList', data);
    }, "pagenation", "planPostData", null, false, null, function () {

        var $adda = $('<a></a>').addClass('btn btn-minier btn-yellow pull-left').attr('name', 'addplan').css("margin", "0px 3px");
        var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
        var $addspan = $('<span ></span>').text('添加').appendTo($adda);

        return [$adda];
    });

    // 添加
    com.focusPage('[name="addplan"]', '#pagenation').on("click", function () {  // 选择器 [属性名="属性值"] 匿名函数

        com.cleanItems(plan.planItems);//清空输入

        com.focusPage("#timediv").addClass("hide");

        taskArgs();
        plan.modal.modal("show");
        plan.editFlg = false;
    });

    // 撤销计划
    function cancel(v) {
        com.showConfirm('是否确认撤销计划', function () {
            com.post(api.information.cancelPlan, {"plan.pid": v.pid}, function (res) {
                planSeacher.doSearch();
            });
        });
    }

    // 保存
    function saveData() {

        if (com.validate())
            return false;

        var keyWord = com.focusPage("#task").val();
        var url;

        var options = {
            "plan.task.keyWord": keyWord
        };

        var cuts = plugins[keywordName];
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
        var currentdate = "" + date.getFullYear() + month + strDate + date.getHours() + date.getMinutes();

        return currentdate;
    }

    //焦点事件,删除hide
    function taskArgs() {
        plan.planItems.task.on("change", function (e) {
            $this = $(this);

            com.focusPage("#timediv").removeClass("hide");

            var asd = com.focusPage("#pluginss");
            asd.empty();

            var keyworld = $this.val();
            keywordName = keyworld;
            var cut = plugins[keyworld];
            letter = cut;
            if (cut != null) {
                var result = cut.split(",");
                $.each(result, function (i, v) {
                    var divId = lists[v];
                    if (v !== null && v != "") {
                        var idName = "id" + i;
                        eval("planUtils.Plugins" + v + "(" + i + ")");
                        lists[v] = idName;
                    }
                });
            }
        }).trigger("change");
    }

});