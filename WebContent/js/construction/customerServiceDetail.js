jQuery(function ($) {
    
    var customerServiceDetail = {
        constructionNode : {},
        constructionSchedules: {},
        commitFlag : false,
        workerIdsData : [],
        wizardSept: {
            "1": false,
            "2": false,
            "3": false,
            "4": false,
            "5": false,
            "6": false,
            "7": false
        }

    };

    com.post(api.construction.queryConstructionScheduleByOrderId, {"constructionSchedule.orderId": params.construction.orderId}, function (res) {

        var newSchedules = res.constructionSchedules.sort(function(a, b){
            return a.schedule - b.schedule;
        });

        var constructionSchedule = newSchedules;

        customerServiceDetail.constructionSchedules = newSchedules;

        $.each(constructionSchedule, function (i, v) {
            customerServiceDetail.constructionNode[v.node.sort] = v.node.name;
            customerServiceNode("#stepIds", v.schedule);
            customerServicePane("#step-containers", v.schedule, v.schedule);
        });

        var stepnum = constructionSchedule[0].schedule;
        initWizardSept(stepnum);

        com.focusPage('#fuelux-wizard').ace_wizard({status: true}).on('finished', function (e) {
            com.showAlert(com.info, "工程已经结束,之后可以进行验收工作!");
        }).on('stepclick', function (e, info) {
            var stepId = com.focusPage("[flag]").eq(info.step - 1).attr("id");
            var sd = stepId.substring(4);
            if (!customerServiceDetail.wizardSept[sd]) {
                initWizardSept(sd);
            }
        });

    }, null, false);

    com.focusPage('#modal-wizard .modal-header').ace_wizard();
    com.focusPage('#modal-wizard .wizard-actions .btn[data-dismiss=modal]').removeAttr('disabled');

    function initWizardSept(schedule) {
        addActive(schedule);

        var elementPostData = {};
        elementPostData["constructer.orderId"] = params.construction.orderId;
        elementPostData["constructer.schedule"] = schedule;

    
        com.post(api.construction.queryConstructerByOrderId, elementPostData, function (res) {
            constructers = res.constructers;
            com.focusPage("#btnSave").unbind("click");
            if (schedule) {
                customerServiceDetail.workerIdsData = [];
                customerServiceDetail.commitFlag = false;
                com.focusPage("#" + schedule + "WorkerInfos").html("");

                if (constructers.length != 0) {

                    $.each(constructers, function (i, val) {
                        var workerInfo = val;

                        var profileDiv = $('<div class="profile-picture col-sm-4" style="padding-top: 10px;"></div>');
                        var imgDiv = $('<div class="col-sm-6 workerImg"></div>').css("width", "49%").appendTo(profileDiv);

                        var img = $('<img />').attr("id", workerInfo.user.userId + "WorkerImg").appendTo(imgDiv);
                        var url = com.showImg(img, workerInfo.user.userPhoto, 150, 150, '', null, 0);

                        var horizontalDiv = $('<div class="form-horizontal col-sm-6">').appendTo(profileDiv);
                        var workerNameGroupDiv = $('<div class="form-group">').appendTo(horizontalDiv);
                        var workerNameSpan = $('<span id="workerNameSpan"></span>').text(workerInfo.user.userName).appendTo(workerNameGroupDiv);

                        var workerRatyGroupDiv = $('<div class="form-group">').appendTo(horizontalDiv);
                        var workerRatyDiv = $('<div></div>').attr("id", workerInfo.crid + "workerRaty").appendTo(workerRatyGroupDiv);

                        var workerDesGroupDiv = $('<div class="form-group">').appendTo(horizontalDiv);
                        var workerDesTextarea = $('<textarea rows="3"></textarea>').attr("id", workerInfo.crid + "workerRatyDes").val(workerInfo.assessment).appendTo(workerDesGroupDiv);

                        profileDiv.appendTo(com.focusPage("#" + schedule + "WorkerInfos"));

                        setWorkerRaty('#' + workerInfo.crid + "workerRaty", workerInfo.rate);
                        setWorkerDes("#" + workerInfo.crid + "workerRatyDes", workerInfo.assessment);

                        customerServiceDetail.workerIdsData.push(constructers[i].crid);
                    });

                    customerServiceDetail.commitFlag = true;
                } else {
                    $('<div class="alert alert-info">').text("当前进度没有分配工人!").appendTo($("#" + schedule + "WorkerInfos"));
                }

                com.focusPage("#btnSave").click(function () {
                    var successFlag = false;

                    var options = {};
                    for (var i = 0; i < customerServiceDetail.workerIdsData.length; i++) {
                        options["constructers["+i+"].crid"] = customerServiceDetail.workerIdsData[i];
                        options["constructers["+i+"].rate"] = com.focusPage("#" + customerServiceDetail.workerIdsData[i] + "workerRaty-score").val();
                        options["constructers["+i+"].assessment"] = com.focusPage("#" + customerServiceDetail.workerIdsData[i] + "workerRatyDes").val();
                    }

                    if (customerServiceDetail.commitFlag) {
                        com.post(api.construction.updateConstructerForRate, options, function (res) {
                            successFlag = true;
                        },null,false);
                    }

                    if (successFlag) {
                        com.showAlert(com.info, "保存成功!");
                    }

                });
            }

            return false;

            for (var i = 0; i < constructers.length; i++) {
                var workerInfo = constructers[i];
                if (workerInfo.cid == 0) {
                    customerServiceDetail["constructer.crid"] = 0;
                }
            }
        });
    }

    function setWorkerDes(id, des) {
        com.focusPage(id).val(des);
    }

    function setWorkerRaty(id, raty) {
        com.focusPage(id).raty({
            path: './assets/altogether/images/',
            start: raty
        });
    }

    //画节点信息轴
    function customerServiceNode(stepul, schedule) {
        var stepLi = $("<li></li>").attr("data-targe", "#step" + schedule).addClass("complete").appendTo(stepul);
        var stepSpan = $("<span></span>").addClass("step").html(schedule).appendTo(stepLi);
        var stepSpan = $("<span></span>").addClass("title").html(customerServiceDetail.constructionNode[schedule]).appendTo(stepLi);
    }

    //画面板
    function customerServicePane(paneId, schedule, scheduleNodeNamePinyin) {
        var paneCus = $("<div></div>").addClass("step-pane").attr("id", "step" + schedule).attr("flag", "step").appendTo(paneId);
        var paneCusRow = $("<div></div>").addClass("row").appendTo(paneCus);
        var paneCusForm = $("<form></form>").addClass("form-horizontal").appendTo(paneCusRow);
        var paneCusGroup = $("<div></div>").addClass("form-group").appendTo(paneCusForm);
        var paneCusSm = $("<div></div>").addClass("col-sm-12").appendTo(paneCusGroup);
        var paneCusCent = $("<div></div>").addClass("text-center").appendTo(paneCusSm);
        var paneCusH3 = $("<h3></h3>").addClass("header smaller lighter green").appendTo(paneCusCent);
        var paneCusI = $("<i></i>").addClass("icon-group").appendTo(paneCusH3);
        var paneCusSpan = $("<span></span>").html(customerServiceDetail.constructionNode[schedule] + "工人信息").appendTo(paneCusH3);
        var paneCusInfo = $("<div></div>").attr("id", scheduleNodeNamePinyin + "WorkerInfos").appendTo(paneCusCent);
        var paneCusSpace = $("<div></div>").addClass("space-4").appendTo(paneCusForm);
    }

    function addActive(schedule) {
        var con = customerServiceDetail.constructionSchedules;
        $.each(con, function (i, v) {
            com.focusPage("#step" + v.schedule).removeClass("active");
            com.focusPage("#step" + v.schedule).addClass("step-pane");
        });
        com.focusPage("#step" + schedule).removeClass("step-pane");
        com.focusPage("#step" + schedule).addClass("active");
    }

});
