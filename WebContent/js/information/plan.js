$(function () {
// 定义全局变量 json
    var plan = {
        status: [],
        saveBtn: $("#addplanBtn").on("click", saveData),// 绑定事件
        cancelBtn: $("#cancelplanBtn"),//取消
        modal: $("#addplanModal"),//添加
        planItems: {},
        editFlg: false,
        currentTime: getNowFormatDate().substr(2, 10),
        taskContent: {},
    };

    var flag = "";

    $(".date-picker").datepicker({autoclose: !0}).on("show", function () {
        setTimeout(function () {
            $(".dropdown-menu").css("z-index", 1060)
        }, 0)
    }).next().on(ace.click_event, function () {
        a(this).prev().focus()
    });

    $("input[name='date-range-picker']").on("focus", function (e) {
        $(".dropdown-menu").css("z-index", 1060)
    }).daterangepicker(com.dateramgepickerdefault).prev().on(ace.click_event, function () {
        $(this).next().focus();
    });

    plan.planItems.executeDate = $("#executeDate");
    plan.planItems.executeTime = $("#executeTime");
    plan.planItems.task = $("#task");

    plan.planItems.args = $("#args");
    plan.planItems.argsRange = $("#argsRange");//时间区间
    plan.planItems.exportSelect = $("#exportSelect");//导出标识
    plan.planItems.importSelect = $("#importSelect");//导入标识
    plan.planItems.filePath = $("#filePath");
    taskArgs();


    com.post(api.ds.information, {}, function (res) {

        $.each(res.planStatus, function (i, v) {
            plan.status[v.key] = v.value
        });

        plan.planItems.exportSelect.bindData(res.planExportArgs, "key", "value", false);
        plan.planItems.importSelect.bindData(res.planImportArgs, "key", "value", false);

    }, null, false);

    com.post(api.information.queryTask, {}, function (res) {
        plan.planItems.task.bindData(res.tasks, "tid", "name", false);
        $.each(res.tasks, function (i, val) {
            plan.taskContent[val.tid] = val.content; // 控件类型
        });
    }, null, false);

    $('#executeTime').timepicker({
        minuteStep: 1,
        showSeconds: false,
        showMeridian: false
    });

    $("#attachment").Huploadify({
        auto: !0,
        successTimeout: 99999,
        formData: {
            username: "用户名",
            rnd: "加密密文",
            uploadType: 3
        },
        buttonText: "上传附件",
        buttonClass: "btn btn-sm btn-primary lineheight0",
        overrideEvents: ["onDialogClose"],
        fileObjName: "strutsUploads",
        uploader: config.media + api.common.uploadOther.url,
        width: "78",
        onSelectError: function (a, b, c) {
            switch (b) {
                case -100:
                    alert("上传的文件数量已经超出系统限制的" + $("#file_upload").uploadify("settings", "queueSizeLimit") + "个文件!");
                    break;
                case -110:
                    alert("文件 [" + a.name + "] 大小超出系统限制的" + $("#file_upload").uploadify("settings", "fileSizeLimit") + "大小!");
                    break;
                case -120:
                    alert("文件 [" + a.name + "] 大小异常！");
                    break;
                case -130:
                    alert("文件 [" + a.name + "] 类型不正确！")
            }
        },
        onUploadSuccess: function (a, b, c) {
            a = eval("(" + b + ")");
            0 == a.errorCode ? $("#filePath").val(a.resUrl) : alert(b)
        },
        itemTemplate: '<div id="${fileID}" class="uploadify-queue-item" style="position:absolute;top:-30px;width:200px;left:-200px;">\r\n\t\t\t<div class="cancel">\r\n\t\t\t\t<a href="javascript:$(\'#${instanceID}\').uploadify(\'cancel\', \'${fileID}\')">X</a>\r\n\t\t\t</div>\r\n\t\t\t<span class="fileName">${fileName} (${fileSize})</span><span class="data"></span>\r\n\t\t\t<div class="uploadify-progress">\r\n\t\t\t\t<div class="uploadify-progress-bar"><!--Progress Bar--></div>\r\n\t\t\t</div>\r\n\t\t</div>'
    });

    //画列表
    var displayFunc = (function () {

        var renderList = function (tableId, listData) {
            var $tableWrap = $('#' + tableId);
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
            var $btnEdit = $('<a></a>').addClass('btn btn-minier btn-success').html('编辑');
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
                ["结果信息:", (v.info == "" || v.info == null) ? "---" : v.info, "grey"],
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
                $divBtnWrap.append($btnEdit).append($btncancel).appendTo($h3);
            }

            $liLine.append($h3).append($ulProperty);

            $btnEdit.click(function () {
                edit(v);
            });

            $btncancel.click(function () {
                cancel(v);
            });

            $btnDown.click(function () {
                window.open(config.media + v.resultFilepath);
                if (v.infofilepath != null) {
                    window.open(config.media + v.infofilepath);
                }
                return false;
            });

            return $liLine;
        };

        return {
            init: function (tableId, listData) {
                $('#' + tableId).html(null);
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
    $('[name="addplan"]', '#pagenation').on("click", function () {  // 选择器 [属性名="属性值"] 匿名函数

        com.cleanItems(plan.planItems);//清空输入

        $("#timediv").addClass("hide");

        taskArgs();
        plan.modal.modal("show");
        plan.editFlg = false;
    });

    //编辑
    function edit(v) {
        plan.modal.modal("show"); // 弹出弹层
        plan.editFlg = true;
        plan.planItems.pid = v.pid;
        plan.planItems.task.val(v.task.tid);
        var taskContent = plan.taskContent[v.task.tid];

        if (taskContent == "import_quotation_item") {       //导入报价项

            plan.planItems.filePath.val(v.args);
        } else if (taskContent == "export_inventory_goods") {//导出商品

            $("#commont").removeClass("hide");
            plan.planItems.args.val(v.args);
        } else if (taskContent == "export_merge_attendance") {//合并脚本

            $("#dateRange").removeClass("hide");
            times = v.args.substring(7, v.args.length);
            plan.planItems.argsRange.val(times);
        } else {    //统计3个
            $("#dateRange").removeClass("hide");

            plan.planItems.argsRange.val(v.args);
        }

        if (v.executeTime != null) {
            $("#timing").val(1)
            $("#timediv").removeClass("hide");
            plan.planItems.executeDate.val("20" + v.executeTime.substr(0, 2) + "-" + v.executeTime.substr(2, 2) + "-" + v.executeTime.substr(4, 2));
            plan.planItems.executeTime.val(v.executeTime.substr(6, 2) + ":" + v.executeTime.substr(8, 2));
        } else {
            $("#timing").val(0)
        }
    }

    // 撤销计划
    function cancel(v) {
        var btn = $(this);
        var span = btn.find('span');
        btn.find('i').remove();
        var loading = $('<i></i>').addClass('icon-spinner icon-spin white bigger-125');
        span.prepend(loading);
        var message = "<p>确定要撤销该计划吗?</p>";
        bootbox.confirm(message, function (result) {
            if (result) {
                com.post(api.information.cancelPlan, {"plan.pid": v.pid}, function (res) {
                    planSeacher.doSearch();
                })
            }
            else {
                btn.find('i').remove();
                var prepared = $('<i></i>').addClass('icon-ok bigger-110');
                span.prepend(prepared);
            }
        })
    }

    // 保存
    function saveData() {

        if (com.validate())
            return;

        var url;
        var options = {
            "plan.task.tid": plan.planItems.task.val(),
        };

        if (!$('#dateRange').hasClass('hide')) {

            if (flag == "export_merge_attendance") {

                options["plan.args"] = "noauto," + plan.planItems.argsRange.val();
            } else if (flag == "export_sales" || flag == "export_decoration" || flag == "export_material") {

                options["plan.args"] = plan.planItems.argsRange.val();
            }

        } else if (!$('#hupload').hasClass('hide')) {

            if (plan.planItems.filePath.val() == null || plan.planItems.filePath.val() == "") {
                bootbox.confirm("导入时附件不能为空?", function (result) {
                    if (result) {
                        return
                    }
                });
                return
            }

            var filePath = plan.planItems.filePath.val();
            var fileArgs = plan.planItems.importSelect.val();
            var params = plan.planItems.args.val();

            str = "";
            if (params != "") {
                str = filePath + " " + params;
            } else {
                str = filePath
            }
            options["plan.args"] = str;

        } else if (!$('#export').hasClass('hide')) {
            var params = plan.planItems.args.val();
            options["plan.args"] = params

        } else if (!$('#commont').hasClass('hide')) {
            options["plan.args"] = plan.planItems.args.val()
        }

        if ($("#timing").val() != 0) {
            var times = plan.planItems.executeDate.val() + ' ' + plan.planItems.executeTime.val();

            var executeTime = new Date(times);

            var curTime = new Date();
            curTime.setTime(curTime.setMinutes(curTime.getMinutes() + 15));

            if (executeTime > curTime) {
                options["plan.executeTime"] = times;
            } else {
                com.showAlert(com.warning, "执行时间请大于当前时间15分钟!");
                return
            }

        }

        if (plan.editFlg) {
            url = api.information.updatePlan;
            options["plan.pid"] = plan.planItems.pid;
        } else {
            url = api.information.createPlan;
        }

        com.post(url, options, function (res) {
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
        var currentdate = date.getFullYear() + month + strDate + date.getHours() + date.getMinutes();

        return currentdate;
    }

    //焦点事件,删除hide
    function taskArgs() {
        plan.planItems.task.on("change", function (e) {
            $this = $(this);

            $("#timediv").removeClass("hide");
            $("#dateRange").addClass("hide");
            $("#commont").addClass("hide");
            $("#hupload").addClass("hide");
            $("#export").addClass("hide");
            $("#import").addClass("hide");

            if (plan.taskContent[$this.val()] == "export_merge_attendance") {
                $("#dateRange").removeClass("hide");
                flag = "export_merge_attendance"

            } else if (plan.taskContent[$this.val()] == "args") {

                $("#commont").removeClass("hide");

            } else if (plan.taskContent[$this.val()] == "import_quotation_item") {

                $("#hupload").removeClass("hide");

            } else if (plan.taskContent[$this.val()] == "export_inventory_goods") {

                $("#commont").removeClass("hide");
            } else if (plan.taskContent[$this.val()] == "export_decoration") {

                $("#dateRange").removeClass("hide");
                flag = "export_decoration"
            } else if (plan.taskContent[$this.val()] == "export_material") {

                $("#dateRange").removeClass("hide");
                flag = "export_material"
            } else if (plan.taskContent[$this.val()] == "export_sales") {

                $("#dateRange").removeClass("hide");
                flag = "export_sales"
            }

        }).trigger("change");
    }

});
