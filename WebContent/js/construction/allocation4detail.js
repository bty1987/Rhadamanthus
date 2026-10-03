$(function() {

    var constructionNode = {};
    var allocation4detail = {

        constructionSchedules: {}
    };

    com.post(api.construction.queryConstructionScheduleByOrderId, {
        "constructionSchedule.orderId": params.construction.orderId
    }, function(res) {

        var newSchedules = res.constructionSchedules.sort(function(a, b) {

            return a.node.sort - b.node.sort;
        });
        var constructionSchedule = newSchedules;
        allocation4detail.constructionSchedules = newSchedules;
        $.each(constructionSchedule, function(i, v) {

            constructionNode[v.node.sort] = v.node.name;
            constructerNode("#stepId1", v.node.sort);
            constructerPane("#step-container1", v.node.sort, v.node.sort);
        });

        var stepnum = constructionSchedule[0].node.sort;
        initWizardSept(stepnum);

        com.focusPage('#fuelux-wizard').ace_wizard({
            status: true
        }).on('finished', function(e) {

            com.showAlert(com.info, "工程已经结束,之后可以进行验收工作");
        }).on('stepclick', function(e, info) {

            var stepId = com.focusPage("[flag]").eq(info.step - 1).attr("id");
            var sd = stepId.substring(4);
            // 每次进入面板都重新拉取环节状态与工人列表(绑定用unbind防叠加)
            initWizardSept(sd);
        });

    }, null, false);

    com.focusPage('#modal-wizard .modal-header').ace_wizard();
    com.focusPage('#modal-wizard .wizard-actions .btn[data-dismiss=modal]').removeAttr('disabled');

    com.focusPage('[data-rel=popover]').popover({
        html: true
    });

    function initWizardSept(schedule) {

        addActive(schedule);

        var elementPostData = {
            "constructionSchedule.orderId": params.construction.orderId,
            "constructionSchedule.schedule": schedule
        };

        // 操作成功后回查环节, 回填实际时间字段
        function refreshTimeField(field) {

            com.post(api.construction.queryConstructionScheduleByOrderIdASchedule, elementPostData, function(res) {

                com.focusPage("#" + schedule + field).val(res.constructionSchedule[field] || "");
            });
        }

        com.post(api.construction.queryConstructionScheduleByOrderIdASchedule, elementPostData, function(res) {

            var constructionSchedule = res.constructionSchedule;

            // 节点操作统一提交: unbind防面板反复进入叠加绑定, extra为checkout等附加参数
            function bindScheduleAction(btn, apiName, extra, done) {

                btn.unbind("click").on("click", function() {

                    var options = $.extend({ "constructionSchedule.csid": constructionSchedule.csid }, extra || {});

                    com.post(apiName, options, function() {

                        com.showAlert(com.info, "操作成功");
                        done();
                    });

                    return false;
                });
            }

            com.initTypeahead(schedule + "WorkerName", api.personel.queryUserByPinyin, "pinyinName", {
                "departmentType.name": "工程部",
                "user.status": 0
            }, "autoFillKeyValue", "key", "value");

            com.focusPage("#" + schedule + "StartTime").val(constructionSchedule.startTime);
            com.focusPage("#" + schedule + "EndTime").val(constructionSchedule.endTime);
            com.focusPage("#" + schedule + "EnterTime").val(constructionSchedule.enterTime);
            com.focusPage("#" + schedule + "LeaveTime").val(constructionSchedule.leaveTime);

            updatastatusDiv(constructionSchedule.status, schedule);
            updatePaymentStatus(constructionSchedule.checkout, schedule);
            updateEnterStatus(constructionSchedule.workStatus, schedule);

            bindScheduleAction(com.focusPage("#" + schedule + "Success"), api.construction.beginConstructionSchedule, null, function() {
                updatastatusDiv(1, schedule);
            });

            // 开放工费: 开工后、完工前允许创建工费单(状态置3工费)
            bindScheduleAction(com.focusPage("#" + schedule + "Salary"), api.construction.updateConstructionScheduleForSalary, null, function() {
                updatastatusDiv(3, schedule);
            });

            bindScheduleAction(com.focusPage("#" + schedule + "Fail"), api.construction.finishConstructionSchedule, null, function() {
                updatastatusDiv(2, schedule);
            });

            bindScheduleAction(com.focusPage("#" + schedule + "Valid"), api.construction.checkoutConstructionSchedule, { "constructionSchedule.checkout": 0 }, function() {
                updatePaymentStatus(0, schedule);
            });

            bindScheduleAction(com.focusPage("#" + schedule + "Pass"), api.construction.checkoutConstructionSchedule, { "constructionSchedule.checkout": 1 }, function() {
                updatePaymentStatus(1, schedule);
            });

            bindScheduleAction(com.focusPage("#" + schedule + "Enter"), api.construction.enterConstructionSchedule, null, function() {
                updateEnterStatus(1, schedule);
                refreshTimeField("EnterTime");
            });

            // 离场后仅回查回填离场时间(勿再触发进场)
            bindScheduleAction(com.focusPage("#" + schedule + "Leave"), api.construction.leaveConstructionSchedule, null, function() {
                updateEnterStatus(2, schedule);
                refreshTimeField("LeaveTime");
            });

            com.post(api.construction.queryConstructerByOrderId, {
                "constructer.orderId": params.construction.orderId,
                "constructer.csid": constructionSchedule.csid,
                "constructer.cnid": constructionSchedule.cnid
            }, function(res) {

                queryWorkerUrl(schedule, res);
            }, null, false);

            com.focusPage("#" + schedule + "WorkerSubmit").unbind("click").on("click", function() {

                if (com.focusPage("#" + schedule + "WorkerName").val().replace(/\s+/g, "") == "") {
                    com.showAlert(com.error, "工人名称不能为空");
                    return false;
                }

                com.post(api.construction.addConstructer, {
                    "constructer.cid": constructionSchedule.cid,
                    "constructer.csid": constructionSchedule.csid,
                    "constructer.cnid": constructionSchedule.cnid,
                    "constructer.user.userId": com.focusPage('#' + schedule + "WorkerName").attr("data-typeahead-key")
                }, function(res) {

                    setWorkerUrl(schedule, res);
                });

                return false;
            });

            com.focusPage('#' + schedule + "Drawing").removeClass("active");
        });
    }
    // 添加初始完结按钮
    // status: 0=初始, 1=开工, 2=完工, 3=工费(未完工已开放工费)
    function updatastatusDiv(status, statusDiv) {

        var statusDiv = com.focusPage("#" + statusDiv + "Status").html("");

        if (status == 0) {
            $("<span></span>").addClass("label label-grey").text("初始").appendTo(statusDiv);
        } else if (status == 1) {
            $("<span></span>").addClass("label label-info").text("开工").appendTo(statusDiv);
        } else if (status == 3) {
            $("<span></span>").addClass("label label-warning").text("工费").appendTo(statusDiv);
        } else {
            $("<span></span>").addClass("label label-success").text("完工").appendTo(statusDiv);
        }
    }

    // checkout: 0=验证, 1=通过
    function updatePaymentStatus(checkout, statusDiv) {

        var statusDiv = com.focusPage("#" + statusDiv + "paymentStatus").html("");

        if (checkout == 0) {
            $("<span></span>").addClass("label label-grey").text("验证").appendTo(statusDiv);
        } else {
            $("<span></span>").addClass("label label-danger").text("通过").appendTo(statusDiv);
        }
    }

    // workStatus: 0=初始, 1=进场, 2=离场
    function updateEnterStatus(workStatus, statusDiv) {

        var statusDiv = com.focusPage("#" + statusDiv + "enterStatus").html("");

        if (workStatus == 0) {
            $("<span></span>").addClass("label label-grey").text("初始").appendTo(statusDiv);
        } else if(workStatus == 1) {
            $("<span></span>").addClass("label label-info").text("进场").appendTo(statusDiv);
        } else if(workStatus  == 2) {
            $("<span></span>").addClass("label label-success").text("离场").appendTo(statusDiv);
        }
    }

    // 查询
    function queryWorkerUrl(operate, res) {

        var constructers = res.constructers;
        com.focusPage("#" + operate + "WorkerInfos").html("");

        if (constructers.length != 0) {
            for ( var i = 0; i < constructers.length; i++) {
                var workerIf = constructers[i];

                var profileDiv = $('<div></div>').addClass("profile-picture col-sm-2 text-center").css("margin", "4px").attr("id", workerIf.crid);
                var imgDiv = $('<div></div>').addClass('workerImg').appendTo(profileDiv);
                var profileImg = $('<img />').attr("alt", workerIf.user.userId + "'s Photo").appendTo(imgDiv);

                if (workerIf.user.userPhoto != null && workerIf.user.userPhoto != "") {
                    com.showImg(profileImg, workerIf.user.userPhoto, 150, 150, '');
                }

                var buttonsDiv = $('<div></div>').addClass("visible-md visible-lg hidden-sm hidden-xs action-buttons").css("padding", "5px").appendTo(profileDiv);
                var buttonSpan = $('<span id="workerNameSpan" class="pull-right"></span>').html(workerIf.user.userId + "" + workerIf.user.userName + "<br/>" + workerIf.user.duty.name).appendTo(buttonsDiv);
                var removeBtn = $('<a></a>').addClass('red pull-left').attr('href', '#').attr("cId", workerIf.crid).click(function() {

                    var id = $(this).attr('cId');

                    var args = {};
                    args["constructer.crid"] = id;

                    com.post(api.construction.deleteConstructer, args, function() {

                        com.focusPage("#" + id).remove();
                    });

                }).appendTo(buttonsDiv);
                var removeI = $('<i></i>').addClass("icon-remove bigger-130").appendTo(removeBtn);

                profileDiv.appendTo(com.focusPage("#" + operate + "WorkerInfos"));
            }

        } else {
            $('<div class="alert alert-info">').text("当前进度没有分配工人!").appendTo(com.focusPage("#" + operate + "WorkerInfos"));
        }
    }

    function setWorkerUrl(operate, res) {

        var worker = res.constructer;
        var workerInfo = res.constructer.user;

        var profileDiv = $('<div></div>').addClass("profile-picture col-sm-2 text-center").css("margin", "4px").attr("id", worker.crid);
        var imgDiv = $('<div></div>').addClass('workerImg').appendTo(profileDiv);
        var profileImg = $('<img />').attr("alt", workerInfo.userId + "'s Photo").appendTo(imgDiv);

        if (workerInfo.userPhoto != "" && workerInfo.userPhoto != null && workerInfo.userPhoto != undefined) {
            com.showImg(profileImg, workerInfo.userPhoto, 150, 150, '');
        }

        var buttonsDiv = $('<div></div>').addClass("visible-md visible-lg hidden-sm hidden-xs action-buttons").css("padding", "5px").appendTo(profileDiv);
        var buttonSpan = $('<span id="workerNameSpan" class="pull-right"></span>').html(workerInfo.userId + "" + workerInfo.userName + "<br/>" + workerInfo.dutyName).appendTo(buttonsDiv);
        var removeBtn = $('<a></a>').addClass('red pull-left').attr('href', '#').attr("cId", workerInfo.userId).click(function() {

            var args = {};
            args["constructer.crid"] = worker.crid;

            com.post(api.construction.deleteConstructer, args, function() {

                com.focusPage("#" + worker.crid).remove();
            });

        }).appendTo(buttonsDiv);

        var removeI = $('<i></i>').addClass("icon-remove bigger-130").appendTo(removeBtn);

        var workerInfos = com.focusPage("#" + operate + "WorkerInfos");

        if (workerInfos.children(".profile-picture").length == 0) {
            workerInfos.html("");
        }
        profileDiv.appendTo(workerInfos);
        com.showAlert(com.info, "工人信息提交成功!");
    }

    // 画节点信息轴
    function constructerNode(stepul, schedule) {

        var stepLi = $("<li></li>").attr("data-targe", "#step" + schedule).addClass("complete").appendTo(stepul);
        var stepSpan = $("<span></span>").addClass("step").html(schedule).appendTo(stepLi);
        var stepTitle = $("<span></span>").addClass("title").html(constructionNode[schedule]).appendTo(stepLi);
    }

    // 画施工人员面板
    function constructerPane(paneId, schedule, name) {

        var paneWorker = $("<div></div>").addClass("step-pane").attr("id", "step" + schedule).attr("flag", "step").appendTo(paneId);
        var paneWorkerRow = $("<div></div>").addClass("row").appendTo(paneWorker);
        var paneWorkerForm = $("<form></form>").addClass("form-horizontal").appendTo(paneWorkerRow);
        var paneWorkerGroup = $("<div></div>").addClass("form-group").appendTo(paneWorkerForm);

        var paneWorkerSm = $("<div></div>").addClass("col-sm-12").appendTo(paneWorkerGroup);
        var paneWorkerH3 = $("<h3></h3>").addClass("header smaller lighter blue").appendTo(paneWorkerSm);
        var paneWorkerI = $("<i></i>").addClass("icon-edit").appendTo(paneWorkerH3);
        var paneWorkerSpan = $("<span></span>").html(constructionNode[schedule] + "信息").appendTo(paneWorkerH3);

        // 开工时间
        var paneWorkerGroupTwo = $("<div></div>").addClass("form-group").appendTo(paneWorkerGroup);
        var paneWorkerStart = $("<label></label>").addClass("col-sm-2 control-label no-padding-right").attr("for", name + "StartTime").html("开工时间").appendTo(paneWorkerGroupTwo);
        var paneWorkerSmTwo = $("<div></div>").addClass("col-sm-4").appendTo(paneWorkerGroupTwo);
        var paneWorkerInput = $("<input/>").attr("id", name + "StartTime").attr("type", "text").addClass("col-sm-12").attr("readonly", "readonly").attr("data-toggle", "popover").attr("data-trigger", "manual").appendTo(paneWorkerSmTwo);
        var paneWorkerSpace = $("<div></div>").addClass("space-4").appendTo(paneWorkerGroupTwo);

        // 完工时间
        var paneWorkerGroupTh = $("<div></div>").addClass("form-group").appendTo(paneWorkerGroup);
        var paneWorkerEnd = $("<label></label>").addClass("col-sm-2 control-label no-padding-right").attr("for", name + "EndTime").html("完工时间").appendTo(paneWorkerGroupTh);
        var paneWorkerSmTh = $("<div></div>").addClass("col-sm-4").appendTo(paneWorkerGroupTh);
        var paneWorkerInputTwo = $("<input/>").attr("id", name + "EndTime").attr("type", "text").addClass("col-sm-12").attr("readonly", "readonly").attr("data-toggle", "popover").attr("data-trigger", "manual").appendTo(paneWorkerSmTh);
        var paneWorkerSpaceTwo = $("<div></div>").addClass("space-4").appendTo(paneWorkerGroupTwo);
        
        // 进场时间
        var paneWorkerGroupTwo = $("<div></div>").addClass("form-group").appendTo(paneWorkerGroup);
        var paneWorkerStart = $("<label></label>").addClass("col-sm-2 control-label no-padding-right").attr("for", name + "EnterTime").html("进场时间").appendTo(paneWorkerGroupTwo);
        var paneWorkerSmTwo = $("<div></div>").addClass("col-sm-4").appendTo(paneWorkerGroupTwo);
        var paneWorkerInput = $("<input/>").attr("id", name + "EnterTime").attr("type", "text").addClass("col-sm-12").attr("readonly", "readonly").attr("data-toggle", "popover").attr("data-trigger", "manual").appendTo(paneWorkerSmTwo);
        var paneWorkerSpace = $("<div></div>").addClass("space-4").appendTo(paneWorkerGroupTwo);
        
        // 出场时间
        var paneWorkerGroupTh = $("<div></div>").addClass("form-group").appendTo(paneWorkerGroup);
        var paneWorkerEnd = $("<label></label>").addClass("col-sm-2 control-label no-padding-right").attr("for", name + "LeaveTime").html("出场时间").appendTo(paneWorkerGroupTh);
        var paneWorkerSmTh = $("<div></div>").addClass("col-sm-4").appendTo(paneWorkerGroupTh);
        var paneWorkerInputTwo = $("<input/>").attr("id", name + "LeaveTime").attr("type", "text").addClass("col-sm-12").attr("readonly", "readonly").attr("data-toggle", "popover").attr("data-trigger", "manual").appendTo(paneWorkerSmTh);
        var paneWorkerSpaceTwo = $("<div></div>").addClass("space-4").appendTo(paneWorkerGroupTwo);

        var paneWorkerGroupF = $("<div></div>").addClass("form-group").appendTo(paneWorkerGroup);
        var paneWorkerLab = $("<label></label>").addClass("col-sm-2 control-label no-padding-right").attr("for", name + "Status").html(constructionNode[schedule] + "状态").appendTo(paneWorkerGroupF);
        var paneWorkerLabDiv = $("<div></div>").attr("id", name + "Status").addClass("col-sm-2").appendTo(paneWorkerGroupF);
        var paneWorkerSpaceTh = $("<div></div>").addClass("space-4").appendTo(paneWorkerGroupF);

        // 款项状态
        var paneWorkerGroupF = $("<div></div>").addClass("form-group").appendTo(paneWorkerGroup);
        var paneWorkerLab = $("<label></label>").addClass("col-sm-2 control-label no-padding-right").attr("for", name + "paymentStatus").html("款项验证").appendTo(paneWorkerGroupF);
        var paneWorkerLabDiv = $("<div></div>").attr("id", name + "paymentStatus").addClass("col-sm-2").appendTo(paneWorkerGroupF);
        var paneWorkerSpaceTh = $("<div></div>").addClass("space-4").appendTo(paneWorkerGroupF);
        
        // 进场状态
        var paneWorkerGroupF = $("<div></div>").addClass("form-group").appendTo(paneWorkerGroup);
        var paneWorkerLab = $("<label></label>").addClass("col-sm-2 control-label no-padding-right").attr("for", name + "enterStatus").html("进场状态").appendTo(paneWorkerGroupF);
        var paneWorkerLabDiv = $("<div></div>").attr("id", name + "enterStatus").addClass("col-sm-2").appendTo(paneWorkerGroupF);
        var paneWorkerSpaceTh = $("<div></div>").addClass("space-4").appendTo(paneWorkerGroupF);

        var paneWorkerGroupFive = $("<div></div>").addClass("form-group").attr("id", name + "Operate").appendTo(paneWorkerGroup);
        var paneWorkerSmFive = $("<div></div>").addClass("col-sm-offset-2").appendTo(paneWorkerGroupFive);

        // 操作按钮: 开工/开放工费/完工/验证/通过
        $("<button></button>").attr("id", name + "Success").addClass("btn btn-xs btn-info").html("开工").attr("style", "margin-right:5px").appendTo(paneWorkerSmFive);
        $("<button></button>").attr("id", name + "Salary").addClass("btn btn-xs btn-warning").html("开放工费").attr("style", "margin-right:5px").appendTo(paneWorkerSmFive);
        $("<button></button>").attr("id", name + "Fail").addClass("btn btn-xs btn-success").html("完工").attr("style", "margin-right:5px").appendTo(paneWorkerSmFive);
        $("<button></button>").attr("id", name + "Valid").addClass("btn btn-xs btn-yellow ").html("验证").attr("style", "margin-right:5px").appendTo(paneWorkerSmFive);
        $("<button></button>").attr("id", name + "Pass").addClass("btn btn-xs btn-danger ").html("通过").attr("style", "margin-right:5px").appendTo(paneWorkerSmFive);
        var paneWorkerGroupS = $("<div></div>").addClass("form-group").appendTo(paneWorkerForm);
        var paneWorkerSmS = $("<div></div>").addClass("col-sm-12").appendTo(paneWorkerGroupS);
        var paneWorkerHTh = $("<h3></h3>").addClass("header smaller lighter blue").appendTo(paneWorkerSmS);
        var paneWorkerHThi = $("<i></i>").addClass("icon-edit").appendTo(paneWorkerHTh);
        var paneWorkerHThSpan = $("<span></span>").html("工人信息").appendTo(paneWorkerHTh);

        // 进场按钮
        var enterBtn = $("<button type='button'></button>").addClass("btn btn-xs btn-info").html("进场").attr("style", "margin-right:5px").attr("id", name + "Enter").appendTo(paneWorkerSmFive);
        // 离场按钮
        var leaveBtn = $("<button type='button'></button>").addClass("btn btn-xs btn-success").html("离场").attr("style", "margin-right:5px").attr("id", name + "Leave").appendTo(paneWorkerSmFive);
        var paneWorkerGroupSe = $("<div></div>").addClass("form-group").appendTo(paneWorkerForm);
        var paneWorkerEnter = $("<div></div>").attr("id", name + "WorkerEnter").appendTo(paneWorkerGroupSe);
        var paneWorkerEnlab = $("<label></label>").addClass("col-sm-1 control-label").attr("for", name + "WorkerName").html("工人姓名").appendTo(paneWorkerEnter);
        var paneWorkerSelDiv = $("<div></div>").addClass("col-sm-4").appendTo(paneWorkerEnter);
        var paneWorkerSel = $("<input></input>").attr("id", name + "WorkerName").addClass("col-xs-10 col-sm-6 v_required").attr("data-placeholder", "请输入工人名称").attr("data-placement", "bottom").attr("data-toggle", "popover").attr("data-trigger", "manual").attr("type", "text").appendTo(paneWorkerSelDiv);

        var paneWorkerGroupEi = $("<div></div>").addClass("form-group").appendTo(paneWorkerForm);
        var paneWorkerSmEi = $("<div></div>").addClass("col-sm-offset-1").appendTo(paneWorkerGroupEi);
        var paneWorkerbtnEi = $("<button></button>").attr("id", name + "WorkerSubmit").addClass("btn btn-xs col-sm-2 workerSubmit").html("确认").appendTo(paneWorkerSmEi);
        var paneWorkerSpaceEi = $("<div></div>").addClass("space-4").appendTo(paneWorkerForm);

        var paneWorkerGroupNi = $("<div></div>").addClass("form-group").appendTo(paneWorkerForm);
        var paneWorkerSmNi = $("<div></div>").addClass("col-sm-12").appendTo(paneWorkerGroupNi);
        var paneWorkerInfoNi = $("<div></div>").attr("id", name + "WorkerInfos").appendTo(paneWorkerSmNi);
        var paneWorkerSpaceNi = $("<div></div>").addClass("space-4").appendTo(paneWorkerForm);

    }

    function addActive(schedule) {

        var con = allocation4detail.constructionSchedules;
        $.each(con, function(i, v) {

            com.focusPage("#step" + v.schedule).removeClass("active");
            com.focusPage("#step" + v.schedule).addClass("step-pane");
        });
        com.focusPage("#step" + schedule).removeClass("step-pane");
        com.focusPage("#step" + schedule).addClass("active");
    }

});
