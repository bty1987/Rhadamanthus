jQuery(function($) {

    var supervision4detail = {

        constructionSchedules: {},

        status: {},
        onetype: {},
        towtype: {},

        twotypes: [],

        validator: {
            salary: {
                type: "v_salary",
                regex: /^-?(([1-9]\d{0,6})|(([1-9]\d{0,6}\.\d{1,3})|(0\.[1-9]{1,3})))$/,
                errorMsg: "请正确输入工人工费，小数点后最多保留3位"
            }
        }
    };

    com.post(api.ds.salary, {}, function(res) {

        supervision4detail.status = res.status.split("key", "value");
        supervision4detail.onetype = res.SalaryTwoType.split("key", "oneType");
        supervision4detail.towtype = res.SalaryTwoType.split("key", "name");

        supervision4detail.twotypes = res.SalaryTwoType;
    }, null, false);

    $.extend(com.validator, supervision4detail.validator);

    com.post(api.construction.queryConstructionScheduleByOrderId, {
        "constructionSchedule.orderId": params.construction.orderId
    }, function(res) {

        var newSchedules = res.constructionSchedules.sort(function(a, b) {

            return a.schedule - b.schedule;
        });

        var constructionSchedule = newSchedules;

        supervision4detail.constructionSchedules = newSchedules;

        $.each(constructionSchedule, function(i, v) {

            constructionNode("#stepId", v.schedule, v.csid, v.node.name);
            constructionPane("#step-container", v.schedule, v.csid, v.node.name);
            params.construction.cid = v.cid;
        });

        var schedule = constructionSchedule[0].schedule;
        var csid = constructionSchedule[0].csid;

        initWizardSept(schedule, csid);

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
    }, null, false);

    com.focusPage('#modal-wizard .modal-header').ace_wizard();
    com.focusPage('#modal-wizard .wizard-actions .btn[data-dismiss=modal]').removeAttr('disabled');
    com.focusPage('[data-rel=popover]').popover({
        html: true
    });
    var constructionSchedule;
    function initWizardSept(schedule, csid) {

        addActive(schedule);

        var args = {
            "constructionSchedule.orderId": params.construction.orderId,
            "constructionSchedule.csid": csid,
            "constructionSchedule.schedule": schedule,
        };

        var workerInfoCondition = false;

        com.post(api.construction.queryConstructionScheduleByOrderIdASchedule, args, function(res) {

            constructionSchedule = res.constructionSchedule;

            supervision4detail["constructionSchedule.csid"] = constructionSchedule.csid;

            if (schedule == constructionSchedule.schedule) {

                com.focusPage("#" + schedule + "StartTime").val(constructionSchedule.startTime);
                com.focusPage("#" + schedule + "EndTime").val(constructionSchedule.endTime);
                com.focusPage("#" + schedule + "LeaveTime").val(constructionSchedule.leaveTime);
                com.focusPage("#" + schedule + "EnterTime").val(constructionSchedule.enterTime);

                var otherename = schedule;
                var otherStatus = constructionSchedule.status;

                var otherSuccessBtn = com.focusPage("#" + otherename + "Success");
                var leaveSuccessBtn = com.focusPage("#" + otherename + "Leave");

                updataStatus(schedule, csid, constructionSchedule.status);
                updateEnterStatus(constructionSchedule.workStatus, otherename);
                otherSuccessBtn.click(function() {

                    var options = {
                        "constructionSchedule.csid": constructionSchedule.csid
                    };

                    com.post(api.construction.enterConstructionSchedule, options, function(res) {

                        com.showAlert(com.info, "操作成功");
                        updateEnterStatus(1, otherename);
                        com.post(api.construction.queryConstructionScheduleByOrderIdASchedule, args, function(res) {

                            var constructionSchedule = res.constructionSchedule;
                            com.focusPage("#" + schedule + "EnterTime").val(constructionSchedule.enterTime);
                        });
                    });

                    return false;
                });

                leaveSuccessBtn.click(function() {

                    var options = {
                        "constructionSchedule.csid": constructionSchedule.csid
                    };

                    com.post(api.construction.leaveConstructionSchedule, options, function(res) {

                        com.showAlert(com.info, "操作成功");
                        updateEnterStatus(2, otherename);
                        com.post(api.construction.queryConstructionScheduleByOrderIdASchedule, args, function(res) {

                            var constructionSchedule = res.constructionSchedule;
                            com.focusPage("#" + schedule + "LeaveTime").val(constructionSchedule.leaveTime);
                        });
                    });

                    return false;
                });

                var options = {
                    "constructer.orderId": params.construction.orderId,
                    "constructer.csid": constructionSchedule.csid,
                    "constructer.schedule": constructionSchedule.schedule,
                };

                // 查询施工人员
                com.post(api.construction.queryConstructerByOrderId, options, function(res) {

                    workerInfoCondition = queryConstructer(res.constructers, schedule, csid);
                }, null, false);
            }

            var options = {
                "constructionDrawing.cid": params.construction.cid,
                "constructionDrawing.schedule": schedule
            };

            // 获取工程图片信息
            // 可以同过工程ID以及施工进度获取图片信息
            com.post(api.construction.queryConstructionDrawingByCid, options, function(res) {

                var drawings = res.constructionDrawings;

                com.focusPage("#" + schedule + "Gallery").html("");

                for ( var i = 0; i < drawings.length; i++) {
                    var drawing = drawings[i];

                    appendGalleryElement(schedule + "Gallery", drawing.cdId, drawing.drawingUrl, drawing.type, "", api.construction.deleteConstructionDrawing);
                }
                com.popup4photos("#" + schedule + "Gallery");
            });

            initUploadBtn(constructionSchedule.schedule, constructionSchedule.csid);

            com.focusPage('#' + schedule + "Drawing").removeClass("active");

            if (com.focusPage('#' + schedule + "NavTab" + ' li:last-of-type').hasClass("active")) {
                com.focusPage('#' + schedule + "Drawing").addClass("active");
            }
            return false;
        });
    }

    // 上传图片
    function initUploadBtn(schedule, csid) {

        com.uploadify("#" + schedule + "Upload", "上传图片", api.common.uploadImg, 'btn btn-success', '*.jpg;*.jpeg;*.gif;*.png', {
            'uploadType': 0
        }, 1, function(data) {

            var options = {};

            options["constructionDrawing.cdId"] = 0;
            options["constructionDrawing.cid"] = params.construction.cid;
            options["constructionDrawing.drawingName"] = "";
            options["constructionDrawing.drawingUrl"] = data.resUrl;
            options["constructionDrawing.drawingAddUrl"] = "";
            options["constructionDrawing.type"] = 0;
            options["constructionDrawing.filesize"] = data.filesize;

            options["constructionDrawing.csid"] = csid;
            options["constructionDrawing.schedule"] = schedule;

            com.post(api.construction.addConstructionDrawing, options, function(res) {

                var drawing = res.constructionDrawing;

                appendGalleryElement(schedule + "Gallery", drawing.cdId, data.resUrl, 0, "", api.construction.deleteConstructionDrawing);

                com.popup4photos("#" + schedule + "Gallery");
            });
        });
    }

    // 追加图库元素
    function appendGalleryElement(galleryId, imgId, imgUrl, type, editUrl, deleteUrl) {

        var gallery = com.focusPage("#" + galleryId);
        var imgLi = $("<li></li>").attr("id", "gallery_li" + imgId).addClass("col-xs-2 text-center").css("border-color", "#ddd").appendTo(gallery);
        var img = $('<img />');
        var imgA = $("<a></a>").css("height", "150px").append(img).appendTo(imgLi);
        com.showImg(img, imgUrl, 150, 150, '150x150', null, type);
        var toolsDiv = $("<div></div>").addClass("tools tools-bottom").appendTo(imgLi);
        var toolsA = $("<a></a>").attr("href", "#").on("click", function() {

            var options = {};
            options["constructionDrawing.cdId"] = imgId;

            com.post(deleteUrl, options, function(res) {

                com.focusPage("#gallery_li" + imgId).remove();
            });
        }).appendTo(toolsDiv);
        $("<i></i>").addClass("icon-remove red").appendTo(toolsA);
    }

    // 查询施工人员
    function queryConstructer(constructers, schedule, csid) {

        com.focusPage("#" + schedule + "WorkerInfos").html("");

        if (constructers.length == 0) {
            $('<div class="alert alert-info">').text("当前进度没有分配工人!").appendTo(com.focusPage("#" + schedule + "WorkerInfos"));

            return false;
        }

        for ( var i = 0; i < constructers.length; i++) {

            var workerInfo = constructers[i];

            var profileDiv = $('<div class="profile-picture col-sm-2 text-center" style="margin: 4px;"></div>').attr("wd", "worker");
            var imgDiv = $('<div></div>').addClass('workerImg').appendTo(profileDiv);
            var profileImg = $('<img />').attr("alt", workerInfo.user.userId + "'s Photo").appendTo(imgDiv);

            if (workerInfo.user.userPhoto != null && workerInfo.user.userPhoto != "") {
                com.showImg(profileImg, workerInfo.user.userPhoto, 150, 150, '');
            }

            var buttonsDiv = $('<div class="visible-md visible-lg hidden-sm hidden-xs action-buttons" style="padding: 5px;"></div>').appendTo(profileDiv);
            // buttonSpan工人工费按钮
            var buttonSpan = $('<div id="workerNameSpan"></div>').html('<a style="float: left; margin-left: -5px;" class="icon-money icon-2x" href="#"></a>').appendTo(buttonsDiv);
            // 工人编号, 名称, 职务
            var buttonPeople = $('<div id="workerNameSpan" style="float: right"></div>').html(workerInfo.user.userId + "" + workerInfo.user.userName + "<br/>" + workerInfo.user.duty.name).appendTo(buttonsDiv);

            buttonSpan.click(function() {

                var options = {
                    "workerSalary.csid": workerInfo.csid,
                    "workerSalary.user.userId": workerInfo.user.userId
                };

                queryConstructerSalary(options);
            });

            profileDiv.appendTo(com.focusPage("#" + schedule + "WorkerInfos"));
        }

        return true;
    }

    // 查询工人工费
    function queryConstructerSalary(options) {

        if (com.focusPage('#workerSalaryList').children()) {
            com.focusPage('#workerSalaryList').empty();
        }

        com.post(api.salary.queryWorkerSalary, options, function(res) {

            $.each(res.workerSalarys, function(i, v) {

                var workerSalary = $('<div></div>').prop("id", "salary" + i);

                workerSalary.append(addspan('10', '姓名  : ', v.user.userName)).append(addspan('40', '创建时间  : ', v.createTime)).append(addspan('40', '薪资  : ', v.money)).append(addspan('40', '类型  : ', supervision4detail.towtype[v.twotype])).append(addspan('40', '状态  : ', supervision4detail.status[v.status])).append($('<button>删除</button>').addClass("btn btn-xs btn-danger pull-right").css("margin-left", "35px").attr("id", "deleteBtn" + i).click(function() {

                    var data = {
                        "workerSalary.wsId": v.wsId
                    };
                    com.post(api.salary.deleteWorkerSalary, data, function() {

                        com.focusPage("#salary" + i).remove();
                    }, function(res) {

                        com.showAlert(com.error, "工费状态不可操作!");
                    });
                })).append('<hr/>');

                workerSalary.appendTo(com.focusPage("#workerSalaryList"))
            });

            var salaryDiv = $('<div></div>').addClass("form-group").css("height", "50px").css("margin-bottom", "0px");
            var salaryDivT = $('<div></div>').addClass("col-sm-9").appendTo(salaryDiv);
            var salaryLabelT = $('<label><b>添加工费</b></label>').addClass('col-sm-3 control-label no-padding-left').attr("for", "form-field-1").attr("for", "salary").appendTo(salaryDivT);
            var salaryInputT = $('<input type="text" />').addClass("col-xs-10 col-sm-9 v_salary").attr("id", "salary").attr("data-toggle", "popover").attr("data-trigger", "manual").css("width", "320px").css("height", "30px").appendTo(salaryDivT);
            var salaryText = $('<span><b>* 扣款项请输入负数, 如: -123 !!!</b></span>').css("color", "red").css("margin-left", "-50px").appendTo(salaryDiv);

            var salaryDiv3 = $('<div></div>').addClass("form-group").css("height", "50px").css("margin", "0px");
            var salaryDivTh = $('<div></div>').addClass("col-sm-9").appendTo(salaryDiv3);
            var salaryType = $('<label><b>类型</b></label>').addClass('col-sm-3 control-label no-padding-left').attr("for", "form-field-1").attr("for", "salaryType").appendTo(salaryDivTh);
            var $item = $('<span></span>').addClass('inline').appendTo(salaryDivTh);
            var salaryTypeS = $('<select></select>').attr("id", "salaryType").css("width", "320px").css("height", "30px").appendTo($item);

            $.each(supervision4detail.twotypes, function(i, v) {

                if (v.status != 0)
                    return true;

                $('<option></option>').attr("value", v.key).html(v.name).appendTo(salaryTypeS);
            });

            var salaryDiv4 = $('<div></div>').addClass("form-group").css("height", "80px").css("margin", "0px 0px 15px 0px");
            var salaryDivF = $('<div></div>').addClass("col-sm-9").appendTo(salaryDiv4);
            var salaryBz = $('<label><b>备注</b></label>').addClass('col-sm-3 control-label no-padding-left').attr("for", "form-field-1").attr("for", "comment").appendTo(salaryDivF);
            var salaryBzInp = $('<textarea></textarea>').attr("id", "comment").attr("maxlength", "256").css("width", "320px").appendTo(salaryDivF);

            var salaryDivFi = $('<div></div>').addClass("col-sm-9").css("width", "850px").css("padding-top", "20px").css("text-align", "center").css("height", "50px").appendTo(salaryDiv4);
            var salaryBtn = $('<button><b>保存</b></button>').addClass("btn btn-sm  btn-primary").attr("id", "saveBtn").appendTo(salaryDivFi).click(function() {

                saveData(options);
            });

            salaryDiv.appendTo(com.focusPage("#workerSalaryList"));
            salaryDiv3.appendTo(com.focusPage("#workerSalaryList"));
            salaryDiv4.appendTo(com.focusPage("#workerSalaryList"));

            com.focusPage('#guaranteeModal').modal('show');
        }, null, false)
    }

    function addspan(px, name, value) {

        var $10pxdiv = $('<div></div>').css({
            'display': 'inline-block',
            'margin-left': '10px'
        });
        var $40pxdiv = $('<div></div>').css({
            'display': 'inline-block',
            'margin-left': '40px'
        });
        var $nameSpan = $('<b></b>').html(name);
        var $valueSpan = $('<span></span>').text(value);

        if (px == '40') {
            return $40pxdiv.append($nameSpan).append($valueSpan);
        } else if (px == '10') {
            return $10pxdiv.append($nameSpan).append($valueSpan);
        }
    }

    // 添加工人工费
    function saveData(options) {

        var url = api.salary.addWorkerSalary;

        if (com.validate("workerSalaryList")) {
            return false;
        }

        var salary = com.focusPage('#salary').val();

        if (salary >= 0) {
            options["workerSalary.type"] = 0;
        } else {
            options["workerSalary.type"] = 1;
        }

        options["workerSalary.money"] = com.focusPage('#salary').val();
        options["workerSalary.onetype"] = supervision4detail.onetype[com.focusPage("#salaryType").val()];
        options["workerSalary.twotype"] = com.focusPage("#salaryType").val();
        options["workerSalary.comment"] = com.focusPage("#comment").val();

        com.post(url, options);

        com.focusPage('#guaranteeModal').modal('hide');
    }

    // 画节点信息轴
    function constructionNode(stepul, schedule, csid, name) {

        var stepLi = $("<li></li>").attr("data-targe", "#step" + schedule).attr("data-schedule", schedule).attr("data-csid", csid).addClass("complete").appendTo(stepul);
        var stepSpan = $("<span></span>").addClass("step").html(schedule).appendTo(stepLi);
        var stepSpan = $("<span></span>").addClass("title").html(name).appendTo(stepLi);
    }

    // 画节点下面的面板
    function constructionPane(paneId, schedule, csid, name) {

        var paneDiv = $("<div></div>").addClass("step-pane").attr("id", "step" + schedule).attr("flag", "step").attr("data-schedule", schedule).attr("data-csid", csid).appendTo(paneId);

        if (schedule == 3) {
            paneDiv.removeClass("step-pane");
            paneDiv.attr("class", "active");
        }

        var paneDivTwo = $("<div></div>").addClass("row").appendTo(paneDiv);
        var paneDivThree = $("<div></div>").addClass("tabbable").appendTo(paneDivTwo);
        var paneul = $("<ul></ul>").addClass("nav nav-tabs").attr("id", schedule + "NavTab").appendTo(paneDivThree);
        var paneli = $("<li></li>").addClass("active").appendTo(paneul);
        var panelia = $("<a></a>").attr("data-toggle", "tab").attr("href", "#" + schedule + "Info").html("信息").appendTo(paneli);

        var paneliTwo = $("<li></li>").addClass("").appendTo(paneul);
        var paneliTwoa = $("<a></a>").attr("data-toggle", "tab").attr("href", "#" + schedule + "Drawing").html("施工图片").appendTo(paneliTwo);

        var paneTabContent = $("<div></div>").addClass("tab-content").appendTo(paneDivThree);
        var paneTabTwo = $("<div></div>").addClass("tab-pane in active").attr("id", schedule + "Info").appendTo(paneTabContent);
        var paneTabForm = $("<form></form>").addClass("form-horizontal").appendTo(paneTabTwo);

        var paneTabThree = $("<div></div>").addClass("form-group").appendTo(paneTabForm);
        var paneTabH3 = $("<h3></h3>").addClass("header smaller lighter blue").appendTo(paneTabThree);
        var paneTabH3I = $("<i></i>").addClass("icon-edit").appendTo(paneTabH3);
        var paneTabSpan = $("<span></span>").html(name + "信息").appendTo(paneTabH3);

        // 开工时间
        var paneStartTime = $("<div></div>").addClass("form-group").appendTo(paneTabForm);
        var paneStartTimeTwo = $("<div></div>").addClass("col-sm-12").appendTo(paneStartTime);
        var paneSTlable = $("<label></label>").addClass("col-sm-1 control-label no-padding-right").attr("for", schedule + "StartTime").html("开工时间").appendTo(paneStartTimeTwo);
        var paneSTThree = $("<div></div>").addClass("col-sm-2").appendTo(paneStartTimeTwo);
        var paneSTInput = $("<input/>").attr("id", schedule + "StartTime").attr("type", "text").addClass("col-sm-12").attr("readonly", "readonly").attr("data-toggle", "popover").attr("data-trigge", "manual").appendTo(paneSTThree);

        // 完工时间
        var paneETlable = $("<label></label>").addClass("col-sm-1 control-label no-padding-right").attr("for", schedule + "EndTime").html("完工时间").appendTo(paneStartTimeTwo);
        var paneETFour = $("<div></div>").addClass("col-sm-2").appendTo(paneStartTimeTwo);
        var paneETInput = $("<input/>").attr("id", schedule + "EndTime").attr("type", "text").addClass("col-sm-12").attr("readonly", "readonly").attr("data-toggle", "popover").attr("data-trigge", "manual").appendTo(paneETFour);

        // 状态
        var paneSpace = $("<div></div>").addClass("space-4").appendTo(paneTabForm);
        var paneStatus = $("<div></div>").addClass("form-group").appendTo(paneTabForm);
        var paneStatusTwo = $("<div></div>").addClass("col-sm-12").appendTo(paneStatus);
        var paneStatusLable = $("<label></label>").addClass("col-sm-1 control-label no-padding-right").attr("for", schedule + "Status").html(name + "状态").appendTo(paneStatusTwo);
        var paaneStatusTh = $("<div></div>").attr("id", schedule + "Status").addClass("col-sm-6").appendTo(paneStatusTwo);
        var paneSpaceTwo = $("<div></div>").addClass("space-4").appendTo(paneTabForm);

        // 进场时间
        var paneStartTime = $("<div></div>").addClass("form-group").appendTo(paneTabForm);
        var paneStartTimeTwo = $("<div></div>").addClass("col-sm-12").appendTo(paneStartTime);
        var paneSTlable = $("<label></label>").addClass("col-sm-1 control-label no-padding-right").attr("for", schedule + "EnterTime").html("进场时间").appendTo(paneStartTimeTwo);
        var paneSTThree = $("<div></div>").addClass("col-sm-2").appendTo(paneStartTimeTwo);
        var paneSTInput = $("<input/>").attr("id", schedule + "EnterTime").attr("type", "text").addClass("col-sm-12").attr("readonly", "readonly").attr("data-toggle", "popover").attr("data-trigge", "manual").appendTo(paneSTThree);

        // 离场时间
        var paneETlable = $("<label></label>").addClass("col-sm-1 control-label no-padding-right").attr("for", schedule + "LeaveTime").html("离场时间").appendTo(paneStartTimeTwo);
        var paneETFour = $("<div></div>").addClass("col-sm-2").appendTo(paneStartTimeTwo);
        var paneETInput = $("<input/>").attr("id", schedule + "LeaveTime").attr("type", "text").addClass("col-sm-12").attr("readonly", "readonly").attr("data-toggle", "popover").attr("data-trigge", "manual").appendTo(paneETFour);

        // 离场按钮
        var enterBtn = $("<button type='button'></button>").addClass("btn btn-xs btn-info").html("进场").attr("style", "margin-right:5px").attr("id", schedule + "Success").appendTo(paneStartTimeTwo);
        // 进场按钮
        var leaveBtn = $("<button type='button'></button>").addClass("btn btn-xs btn-info").html("离场").attr("style", "margin-right:5px").attr("id", schedule + "Leave").appendTo(paneStartTimeTwo);

        // 状态
        var panewSpace = $("<div></div>").addClass("space-4").appendTo(paneTabForm);
        var panewStatus = $("<div></div>").addClass("form-group").appendTo(paneTabForm);
        var panewStatusTwo = $("<div></div>").addClass("col-sm-12").appendTo(panewStatus);
        var panewStatusLable = $("<label></label>").addClass("col-sm-1 control-label no-padding-right").attr("for", schedule + "enterStatus").html("进厂状态").appendTo(panewStatusTwo);
        var paanewStatusTh = $("<div></div>").attr("id", schedule + "enterStatus").addClass("col-sm-6").appendTo(panewStatusTwo);
        var panewSpaceTwo = $("<div></div>").addClass("space-4").appendTo(paneTabForm);

        // 工人信息
        var paneWorker = $("<div></div>").addClass("form-group").appendTo(paneTabForm);
        var paneWorkerH3 = $("<h3></h3>").addClass("header smaller lighter blue").appendTo(paneWorker);
        var paneWorkerI = $("<i></i>").addClass("icon-edit").appendTo(paneWorkerH3);
        var paneWorkerSpan = $("<span></span>").html("工人信息").appendTo(paneWorkerH3);

        var paneWorkerContent = $("<div></div>").addClass("form-group").appendTo(paneTabForm);
        var paneWorkerInfo = $("<div></div>").addClass("tab-pane in active").attr("id", schedule + "WorkerInfos").appendTo(paneWorkerContent);
        var paneSpaceTh = $("<div></div>").addClass("space-4").appendTo(paneTabForm);

        // 施工图片信息
        var paneDrawing = $("<div></div>").addClass("tab-pane in").attr("id", schedule + "Drawing").appendTo(paneTabContent);
        var paneDrawingRow = $("<div></div>").addClass("row").appendTo(paneDrawing);
        var paneDrawingRowOne = $("<div></div>").addClass("col-xs-12").appendTo(paneDrawingRow);
        var paneDrawingRowTwo = $("<div></div>").addClass("row-fluid").appendTo(paneDrawingRowOne);
        var paneDrawingRowUl = $("<ul></ul>").addClass("ace-thumbnails").attr("id", schedule + "Gallery").appendTo(paneDrawingRowTwo);

        var paneDrawingRowT = $("<div></div>").addClass("row").appendTo(paneDrawing);
        var paneDrawingRowTOne = $("<div></div>").addClass("hr hr32 hr-dotted").appendTo(paneDrawingRowT);
        var paneDrawingRowTTwo = $("<div></div>").addClass("col-xs-12").appendTo(paneDrawingRowT);
        var paneDrawingRowTh = $("<div></div>").addClass("pull-left inline").appendTo(paneDrawingRowTTwo);
        var paneDrawingRowFour = $("<div></div>").attr("id", schedule + "Upload").appendTo(paneDrawingRowTh);
        var paneDrawingRowInp = $("<input />").attr("type", "text").addClass("hidden").attr("id", "picture").appendTo(paneDrawingRowTh);

        // 上传按钮
        var paneDrawingBtn = $("<input />").attr("id", "select_btn_1").addClass("selectbtn").attr("style", "display:none").attr("type", "file").attr("name", "fileselect[]").attr("multiple", "").attr("accept", "image/jpeg,image/gif,image/png").appendTo(paneDrawingRowTTwo);
        var paneDrawingA = $("<a></a>").attr("id", "file_upload_1-button").attr("href", "javascript:void(0)").addClass("uploadify-button btn btn-success").html("上传").appendTo(paneDrawingRowFour);
        var paneDrawingUpDiv = $("<div></div>").attr("id", "file_upload_1-queue").addClass("uploadify-queue").attr("style", "width: 300px;").appendTo(paneDrawingRowFour);

    }

    function addActive(schedule) {

        var con = supervision4detail.constructionSchedules;
        $.each(con, function(i, v) {

            com.focusPage("#step" + v.schedule).removeClass("active");
            com.focusPage("#step" + v.schedule).addClass("step-pane");
        });
        com.focusPage("#step" + schedule).removeClass("step-pane");
        com.focusPage("#step" + schedule).addClass("active");
    }

    function updateEnterStatus(workStatus, statusDiv) {

        var statusDiv = com.focusPage("#" + statusDiv + "enterStatus").html("");

        if (workStatus == 0) {
            $("<span></span>").addClass("label label-grey").text("初始").appendTo(statusDiv);
        } else if (workStatus == 1) {
            $("<span></span>").addClass("label label-info").text("进场").appendTo(statusDiv);
        } else if (workStatus == 2) {
            $("<span></span>").addClass("label label-success").text("离场").appendTo(statusDiv);
        }
    }

    function updataStatus(schedule, csid, status) {

        var statusDiv = com.focusPage("#" + schedule + "Status").html("");

        if (status == 0) {
            $("<span></span>").addClass("label label-grey").text("初始").appendTo(statusDiv);
        } else if (status == 1) {
            $("<span></span>").addClass("label label-info").text("开工").appendTo(statusDiv);
        } else {
            $("<span></span>").addClass("label label-success").text("完工").appendTo(statusDiv);
        }
    }

});