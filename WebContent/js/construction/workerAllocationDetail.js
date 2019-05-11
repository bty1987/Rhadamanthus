$(function () {
    var constructionNode = {};

    var workerAllocationDetail = {

        constructionSchedules: {},

        wizardSept: {
            "1": false,
            "2": false,
            "3": false,
            "4": false,
            "5": false,
            "6": false,
            "7": false,
            "8": false,
            "9": false
        }
    };

    var orderId = params.orderId;

    //获取所有节点
    com.post(api.data.queryConstructionNode, {}, function (res) {
        $.each(res.constructionNodes, function (i, v) {
            constructionNode[v.sort] = v.name;
        });
    }, null, false);

    //动态获取节点轴
    com.post(api.construction.queryConstructionScheduleByOrderId, {"constructionSchedule.orderId": params.orderId}, function (res) {

        var newSchedules = res.constructionSchedules.sort(function(a, b){
            return a.schedule - b.schedule;
        });
        var constructionSchedule = newSchedules;
        workerAllocationDetail.constructionSchedules = newSchedules;
            $.each(constructionSchedule, function (i, v) {
                constructerNode("#stepId1", v.schedule);
            constructerPane("#step-container1", v.schedule, v.schedule);
        });

        var stepnum = constructionSchedule[0].schedule;
        initWizardSept(stepnum, stepnum);

        com.focusPage('#fuelux-wizard').ace_wizard({status: true}).on('finished', function (e) {
            com.showAlert(com.info, "工程已经结束,之后可以进行验收工作");
        }).on('stepclick', function (e, info) {
            var stepId = com.focusPage("[flag]").eq(info.step - 1).attr("id");
            var sd = stepId.substring(4);
            if (!workerAllocationDetail.wizardSept[sd]) {
                initWizardSept(sd, sd);
            }
        });

    }, null, false);

    com.focusPage('#modal-wizard .modal-header').ace_wizard();
    com.focusPage('#modal-wizard .wizard-actions .btn[data-dismiss=modal]').removeAttr('disabled');

    com.focusPage('[data-rel=popover]').popover({html: true});

    com.focusPage('#btnBack').on(ace.click_event, function () {
        com.switchPage(api.index.workerAllocationIndex.url);
    });

    function initWizardSept(operate, schedule) {
        
        addActive(schedule);

        var elementPostData = {
            "constructionSchedule.orderId": params.orderId,
            "constructionSchedule.schedule": schedule
        };

        com.post(api.construction.queryConstructionScheduleByOrderIdASchedule, elementPostData, function (res) {

            var constructionSchedule = res.constructionSchedule;

            com.initChosen(operate + "WorkerName", api.personel.queryUserByPinyin, "pinyinName", {
                "departmentType.name": "工程部",
                "user.status": 0
            }, "autoFillKeyValue", "key", "value");

            com.focusPage("#" + operate + "StartTime").val(constructionSchedule.startTime);
            com.focusPage("#" + operate + "EndTime").val(constructionSchedule.endTime);

            var otherename = schedule;
            var otherStatus = constructionSchedule.status;

            var otherSuccessBtn = com.focusPage("#" + otherename + "Success");
            var othereFailBtn = com.focusPage("#" + otherename + "Fail");
            
            updatastatusDiv(otherStatus, otherename);

            otherSuccessBtn.click(function () {
                
                var options = {
                    "constructionSchedule.csid": constructionSchedule.csid
                };
                
                com.post(api.construction.beginConstructionSchedule, options, function (res) {
                    com.showAlert(com.info, "操作成功");
                    updatastatusDiv(1, otherename);
                });
                
                return false;
            });

            othereFailBtn.click(function () {
                
                var options = {
                    "constructionSchedule.csid": constructionSchedule.csid
                };

                com.post(api.construction.finishConstructionSchedule, options, function (res) {
                    com.showAlert(com.info, "操作成功");
                    updatastatusDiv(2, otherename);
                });
                
                return false;
            });

            var options = {};
            options["constructer.orderId"] = params.orderId;
            options["constructer.schedule"] = schedule;

            com.post(api.construction.queryConstructerByOrderId, options, function (res) {
                queryWorkerUrl(operate, res);
            }, null, false);

            com.focusPage("#" + operate + "WorkerSubmit").unbind("click");

            com.focusPage("#" + operate + "WorkerSubmit").on("click", function () {

                if (com.focusPage("#" + operate + "WorkerName_chosen span")[0].textContent.replace(/\s+/g, "") == "") {
                    com.showAlert(com.error, "工人名称不能为空");
                    return false;
                }

                var args = {};
                args["constructer.cid"] = constructionSchedule.cid;
                args["constructer.schedule"] = schedule;
                args["constructer.user.userId"] = com.focusPage('#' + operate + "WorkerName").val();

                com.post(api.construction.addConstructer, args, function (res) {
                    setWorkerUrl(operate, res);
                });

                return false;
            });

            com.focusPage('#' + operate + "Drawing").removeClass("active");

            return false;
        });
    }

    //添加初始完结按钮
    function updatastatusDiv(status, statusDiv) {

        var statusDiv = com.focusPage("#" + statusDiv + "Status").html("");
        
        if (status == 0) {
            $("<span></span>").addClass("label label-grey").text("初始").appendTo(statusDiv);
        }else if (status == 1) {
            $("<span></span>").addClass("label label-info").text("开工").appendTo(statusDiv);
        } else {
            $("<span></span>").addClass("label label-success").text("完工").appendTo(statusDiv);
        }
    }

    //查询
    function queryWorkerUrl(operate, res) {

        constructers = res.constructers;
        com.focusPage("#" + operate + "WorkerInfos").html("");

        if (constructers.length != 0) {
            for (var i = 0; i < constructers.length; i++) {
                var workerIf = constructers[i];

                var profileDiv = $('<div></div>').addClass("profile-picture col-sm-2 text-center").css("margin", "4px").attr("id", workerIf.crid);
                var imgDiv = $('<div></div>').addClass('workerImg').appendTo(profileDiv);
                var profileImg = $('<img />').attr("alt", workerIf.user.userId + "'s Photo").appendTo(imgDiv);

                if (workerIf.user.userPhoto != null && workerIf.user.userPhoto != "") {
                    com.showImg(profileImg, workerIf.user.userPhoto, 150, 150, '');
                }

                var buttonsDiv = $('<div></div>').addClass("visible-md visible-lg hidden-sm hidden-xs action-buttons").css("padding", "5px").appendTo(profileDiv);
                var buttonSpan = $('<span id="workerNameSpan" class="pull-right"></span>').html(workerIf.user.userId + "" + workerIf.user.userName + "<br/>" + workerIf.user.duty.name).appendTo(buttonsDiv);
                var removeBtn = $('<a></a>').addClass('red pull-left').attr('href', '#').attr("cId", workerIf.crid).click(function () {

                    var id = $(this).attr('cId');

                    var args = {};
                    args["constructer.crid"] = id;

                    com.post(api.construction.deleteConstructer, args, function () {
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

    //添加
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
        var removeBtn = $('<a></a>').addClass('red pull-left').attr('href', '#').attr("cId", workerInfo.userId).click(
            function () {

                var args = {};
                args["constructer.crid"] = worker.crid;

                com.post(api.construction.deleteConstructer, args, function () {
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

    //画节点信息轴
    function constructerNode(stepul, schedule) {
        var stepLi = $("<li></li>").attr("data-targe", "#step" + schedule).addClass("complete").appendTo(stepul);
        var stepSpan = $("<span></span>").addClass("step").html(schedule).appendTo(stepLi);
        var stepSpan = $("<span></span>").addClass("title").html(constructionNode[schedule]).appendTo(stepLi);
    }

    //画施工人员面板
    function constructerPane(paneId, schedule, name) {

        var paneWorker = $("<div></div>").addClass("step-pane").attr("id", "step" + schedule).attr("flag", "step").appendTo(paneId);
        var paneWorkerRow = $("<div></div>").addClass("row").appendTo(paneWorker);
        var paneWorkerForm = $("<form></form>").addClass("form-horizontal").appendTo(paneWorkerRow);
        var paneWorkerGroup = $("<div></div>").addClass("form-group").appendTo(paneWorkerForm);

        var paneWorkerSm = $("<div></div>").addClass("col-sm-12").appendTo(paneWorkerGroup);
        var paneWorkerH3 = $("<h3></h3>").addClass("header smaller lighter blue").appendTo(paneWorkerSm);
        var paneWorkerI = $("<i></i>").addClass("icon-edit").appendTo(paneWorkerH3);
        var paneWorkerSpan = $("<span></span>").html(constructionNode[schedule] + "信息").appendTo(paneWorkerH3);

        //开工时间
        var paneWorkerGroupTwo = $("<div></div>").addClass("form-group").appendTo(paneWorkerGroup);
        var paneWorkerStart = $("<label></label>").addClass("col-sm-2 control-label no-padding-right").attr("for", name + "StartTime").html("开工时间").appendTo(paneWorkerGroupTwo);
        var paneWorkerSmTwo = $("<div></div>").addClass("col-sm-4").appendTo(paneWorkerGroupTwo);
        var paneWorkerInput = $("<input/>").attr("id", name + "StartTime").attr("type", "text").addClass("col-sm-12").attr("readonly", "readonly").attr("data-toggle", "popover").attr("data-trigger", "manual").appendTo(paneWorkerSmTwo);
        var paneWorkerSpace = $("<div></div>").addClass("space-4").appendTo(paneWorkerGroupTwo);

        //完工时间
        var paneWorkerGroupTh = $("<div></div>").addClass("form-group").appendTo(paneWorkerGroup);
        var paneWorkerEnd = $("<label></label>").addClass("col-sm-2 control-label no-padding-right").attr("for", name + "EndTime").html("完工时间").appendTo(paneWorkerGroupTh);
        var paneWorkerSmTh = $("<div></div>").addClass("col-sm-4").appendTo(paneWorkerGroupTh);
        var paneWorkerInputTwo = $("<input/>").attr("id", name + "EndTime").attr("type", "text").addClass("col-sm-12").attr("readonly", "readonly").attr("data-toggle", "popover").attr("data-trigger", "manual").appendTo(paneWorkerSmTh);
        var paneWorkerSpaceTwo = $("<div></div>").addClass("space-4").appendTo(paneWorkerGroupTwo);

        var paneWorkerGroupF = $("<div></div>").addClass("form-group").appendTo(paneWorkerGroup);
        var paneWorkerLab = $("<label></label>").addClass("col-sm-2 control-label no-padding-right").attr("for", name + "Status").html(constructionNode[schedule] + "状态").appendTo(paneWorkerGroupF);
        var paneWorkerLabDiv = $("<div></div>").attr("id", name + "Status").addClass("col-sm-2").appendTo(paneWorkerGroupF);
        var paneWorkerSpaceTh = $("<div></div>").addClass("space-4").appendTo(paneWorkerGroupF);

        var paneWorkerGroupFive = $("<div></div>").addClass("form-group").attr("id", name + "Operate").appendTo(paneWorkerGroup);
        var paneWorkerSmFive = $("<div></div>").addClass("col-sm-offset-2").appendTo(paneWorkerGroupFive);

        var paneWorkerBtnS = $("<button></button>").attr("id", name + "Success").addClass("btn btn-xs btn-info").html("开工").attr("style", "margin-right:5px").appendTo(paneWorkerSmFive);
        var paneWorkerBtnS = $("<button></button>").attr("id", name + "Fail").addClass("btn btn-xs btn-success").html("完工").attr("style", "margin-right:5px").appendTo(paneWorkerSmFive);
        var paneWorkerGroupS = $("<div></div>").addClass("form-group").appendTo(paneWorkerForm);
        var paneWorkerSmS = $("<div></div>").addClass("col-sm-12").appendTo(paneWorkerGroupS);
        var paneWorkerHTh = $("<h3></h3>").addClass("header smaller lighter blue").appendTo(paneWorkerSmS);
        var paneWorkerHThi = $("<i></i>").addClass("icon-edit").appendTo(paneWorkerHTh);
        var paneWorkerHThSpan = $("<span></span>").html("工人信息").appendTo(paneWorkerHTh);

        var paneWorkerGroupSe = $("<div></div>").addClass("form-group").appendTo(paneWorkerForm);
        var paneWorkerEnter = $("<div></div>").attr("id", name + "WorkerEnter").appendTo(paneWorkerGroupSe);
        var paneWorkerEnlab = $("<lable></lable>").addClass("col-sm-1 control-label").attr("for", name + "WorkerName").html("工人姓名").appendTo(paneWorkerEnter);
        var paneWorkerSelDiv = $("<div></div>").addClass("col-sm-4").appendTo(paneWorkerEnter);
        var paneWorkerSel = $("<select></select>").attr("id", name + "WorkerName").addClass("chosen-select col-sm-2 v_required").attr("data-placeholder", "请输入工人名称").attr("data-toggle", "popover").attr("data-trigger", "manual").appendTo(paneWorkerSelDiv);
        var paneWorkerOp = $("<option></option>").attr("value", "").html("&nbsp;").appendTo(paneWorkerSel);

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
        var con = workerAllocationDetail.constructionSchedules;
        $.each(con, function (i, v) {
            com.focusPage("#step" + v.schedule).removeClass("active");
            com.focusPage("#step" + v.schedule).addClass("step-pane");
        });
        com.focusPage("#step" + schedule).removeClass("step-pane");
        com.focusPage("#step" + schedule).addClass("active");
    }

});
