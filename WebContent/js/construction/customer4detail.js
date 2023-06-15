jQuery(function($) {

    var customer4detail = {

    };

    com.post(api.construction.queryConstructionScheduleByOrderId, {
        "constructionSchedule.orderId": params.construction.orderId
    }, function(res) {

        var constructionSchedules = res.constructionSchedules.sort(function(a, b) {

            return a.schedule - b.schedule;
        });

        $.each(constructionSchedules, function(i, v) {

            drawnode("#stepIds", v.schedule, v.csid, v.node.name);
            drawpane("#step-containers", v.schedule, v.csid, v.node.name);
        });

        initWizardSept(constructionSchedules[0].schedule, constructionSchedules[0].csid);

        com.focusPage('#fuelux-wizard').ace_wizard({
            status: true
        }).on('finished', function(e) {

            com.showAlert(com.info, "工程已经结束,之后可以进行验收工作!");
        }).on('stepclick', function(e, info) {

            var ele = com.focusPage("[flag]").eq(info.step - 1);

            var csid = ele.attr("data-csid");
            var schedule = ele.attr("data-schedule");

            initWizardSept(schedule, csid);
        });

    });

    com.focusPage('#modal-wizard .modal-header').ace_wizard();
    com.focusPage('#modal-wizard .wizard-actions .btn[data-dismiss=modal]').removeAttr('disabled');

    function initWizardSept(schedule, csid) {

        activenode(schedule);

        var args = {
            "constructer.orderId": params.construction.orderId,
            "constructer.schedule": schedule,
            "constructer.csid": csid,
        };

        com.post(api.construction.queryConstructerByOrderId, args, function(res) {

            var constructers = res.constructers;

            com.focusPage("#btnSave").unbind("click");

            com.focusPage("#" + schedule + "WorkerInfos").html("");

            if (constructers.length == 0) {

                $('<div class="alert alert-info">').text("当前进度没有分配工人!").appendTo($("#" + schedule + "WorkerInfos"));

                return false
            }

            $.each(constructers, function(i, v) {

                var profileDiv = $('<div class="profile-picture col-sm-6" style="padding-top: 10px;"></div>');
                
                var btnDiv = $('<div class="col-sm-12"></div>').css("padding", "5px").appendTo(profileDiv);
                var rateBtn = $("<button type='button'></button>").attr("id", "rateBtn" + v.crid).attr("data-crid", v.crid).addClass("btn btn-xs btn-info pull-left").html("评分").appendTo(btnDiv);
                var sendBtn = $("<button type='button'></button>").attr("id", "sendBtn" + v.crid).attr("data-crid", v.crid).addClass("btn btn-xs btn-success pull-left").html("推送").appendTo(btnDiv);

                var imgDiv = $('<div class="col-sm-4 workerImg"></div>').appendTo(profileDiv);
                var img = $('<img />').attr("id", v.user.userId + "WorkerImg").appendTo(imgDiv);
                var url = com.showImg(img, v.user.userPhoto, 150, 150, '', null, 0);

                var horizontalDiv = $('<div class="form-horizontal col-sm-6 constructer">').attr("data-crid", v.crid).appendTo(profileDiv);
                var workerNameGroupDiv = $('<div class="form-group">').appendTo(horizontalDiv);
                var workerNameSpan = $('<span id="workerNameSpan"></span>').text(v.user.userName).appendTo(workerNameGroupDiv);

                var ratyGroupDiv = $('<div class="form-group">').appendTo(horizontalDiv);
                var spanDiv = $('<div></div>').append($("<h6></h6>").css("text-align", "").html("工地卫生")).appendTo(ratyGroupDiv);
                var ratyDiv = $('<div></div>').attr("id", "raty-" + v.crid).appendTo(ratyGroupDiv);
                var span1Div = $('<div></div>').append($("<h6></h6>").html("质量标准")).appendTo(ratyGroupDiv);
                var raty1Div = $('<div></div>').attr("id", "raty1-" + v.crid).appendTo(ratyGroupDiv);
                var span2Div = $('<div></div>').append($("<h6></h6>").html("沟通服务")).appendTo(ratyGroupDiv);
                var raty2Div = $('<div></div>').attr("id", "raty2-" + v.crid).appendTo(ratyGroupDiv);

                var workerDesGroupDiv = $('<div class="form-group">').appendTo(horizontalDiv);
                var workerDesTextarea = $('<textarea rows="3"></textarea>').attr("id", "assessment" + v.crid).css("width", "100%").val(v.assessment).appendTo(horizontalDiv);

                profileDiv.appendTo(com.focusPage("#" + schedule + "WorkerInfos"));

                setWorkerRaty("#raty-" + v.crid, v.rate);
                setWorkerRaty("#raty1-" + v.crid, v.rate1);
                setWorkerRaty("#raty2-" + v.crid, v.rate2);
                setWorkerDes("#assessment" + v.crid, v.assessment);

                rate(v.crid);
                send(v.crid);
            });

            com.focusPage("#btnSave").click(function() {

                var constructers = com.focusPage(".constructer");

                var options = {};

                $.each(constructers, function(i, e) {

                    var csid = $(e).attr("data-crid");

                    options["constructers[" + i + "].crid"] = csid;
                    options["constructers[" + i + "].rate"] = com.focusPage("#raty-" + csid + "-score").val();
                    options["constructers[" + i + "].rate1"] = com.focusPage("#raty1-" + csid + "-score").val();
                    options["constructers[" + i + "].rate2"] = com.focusPage("#raty2-" + csid + "-score").val();
                    options["constructers[" + i + "].assessment"] = com.focusPage("#assessment" + csid).val();

                });

                com.post(api.construction.updateConstructerForRate, options);
            });

            return false;
        });

    }

    function rate(crid) {
        
        com.focusPage("#rateBtn" + crid).click(function() {

            var crid = $(this).attr("data-crid");
            
            var args = {
                "constructer.crid": crid,
                "constructer.rate": com.focusPage("#raty-" + crid + "-score").val(),
                "constructer.rate1": com.focusPage("#raty1-" + crid + "-score").val(),
                "constructer.rate2": com.focusPage("#raty2-" + crid + "-score").val(),
                "constructer.assessment": com.focusPage("#assessment" + crid).val(),
            }
            
            com.post(api.construction.rateConstructer, args);
        });
    }

    function send(crid) {
        
        com.focusPage("#sendBtn" + crid).click(function() {

            com.post(api.construction.sendConstructer, {"constructer.crid": $(this).attr("data-crid")});
        });
    }

    function setWorkerDes(id, des) {

        com.focusPage(id).val(des);
    }

    function setWorkerRaty(id, raty) {

        com.focusPage(id).raty({
            path: './assets/altogether/images/',
            start: raty,
            number: 10,
            name: "工地卫生"
        });
    }

    // 画节点信息轴
    function drawnode(stepul, schedule, csid, name) {

        var stepLi = $("<li></li>").attr("data-targe", "#step" + schedule).attr("data-schedule", schedule).attr("data-csid", csid).addClass("complete").appendTo(stepul);
        var stepSpan = $("<span></span>").addClass("step").html(schedule).appendTo(stepLi);
        var stepSpan = $("<span></span>").addClass("title").html(name).appendTo(stepLi);
    }

    // 画面板
    function drawpane(paneId, schedule, csid, name) {

        var paneCus = $("<div></div>").addClass("step-pane").attr("id", "step" + schedule).attr("data-schedule", schedule).attr("data-csid", csid).attr("flag", "step").appendTo(paneId);
        var paneCusRow = $("<div></div>").addClass("row").appendTo(paneCus);
        var paneCusForm = $("<form></form>").addClass("form-horizontal").appendTo(paneCusRow);
        var paneCusGroup = $("<div></div>").addClass("form-group").appendTo(paneCusForm);
        var paneCusSm = $("<div></div>").addClass("col-sm-12").appendTo(paneCusGroup);
        var paneCusCent = $("<div></div>").addClass("text-center").appendTo(paneCusSm);
        var paneCusH3 = $("<h3></h3>").addClass("header smaller lighter green").appendTo(paneCusCent);
        var paneCusI = $("<i></i>").addClass("icon-group").appendTo(paneCusH3);
        var paneCusSpan = $("<span></span>").html(name + "工人信息").appendTo(paneCusH3);
        var paneCusInfo = $("<div></div>").attr("id", schedule + "WorkerInfos").appendTo(paneCusCent);
        var paneCusSpace = $("<div></div>").addClass("space-4").appendTo(paneCusForm);

    }

    function activenode(schedule) {

        com.focusPage("#step-containers>.active").removeClass("active").addClass("step-pane");

        com.focusPage("#step" + schedule).removeClass("step-pane");
        com.focusPage("#step" + schedule).addClass("active");
    }

});
