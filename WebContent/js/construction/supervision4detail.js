jQuery(function($) {

    var supervision4detail = {

        constructionSchedules: {},

        materialPlanMap: {},

        pageType: params.urlLoadParams.type,
    };

    com.post(api.construction.queryConstructionScheduleByOrderId, {
        "constructionSchedule.orderId": params.construction.orderId
    }, function(res) {

        if (!res.constructionSchedules)
            return false;

        if (res.constructionSchedules.length == 0)
            return false;

        var newSchedules = res.constructionSchedules.sort(function(a, b) {

            return a.schedule - b.schedule;
        });

        var constructionSchedule = newSchedules;

        supervision4detail.constructionSchedules = newSchedules;

        // 主材计划一次性取全按节点分组(读时推算值: 计划时点/系统履约/逾期), 画面板与步骤角标共用
        com.post(api.construction.queryMaterialPlanByOrderId, {
            "materialPlan.orderId": params.construction.orderId
        }, function(mpRes) {

            supervision4detail.materialPlanMap = groupMaterialPlans(mpRes.materialPlans || []);

            $.each(constructionSchedule, function(i, v) {

                var overdueCount = countOverdue(supervision4detail.materialPlanMap[v.cnid]);

                constructionNode("#stepId", v.schedule, v.csid, v.node.name, overdueCount);
                constructionPane("#step-container", v, supervision4detail.materialPlanMap[v.cnid]);
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
    }, null, false);

    com.focusPage('#modal-wizard .modal-header').ace_wizard();
    com.focusPage('#modal-wizard .wizard-actions .btn[data-dismiss=modal]').removeAttr('disabled');
    com.focusPage('[data-rel=popover]').popover({
        html: true
    });

    var constructionSchedule;

    function initWizardSept(schedule, csid) {

        addActive(csid);

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

                com.focusPage("#" + csid + "StartTime").val(constructionSchedule.startTime);
                com.focusPage("#" + csid + "EndTime").val(constructionSchedule.endTime);
                com.focusPage("#" + csid + "EnterTime").val(constructionSchedule.enterTime);
                com.focusPage("#" + csid + "LeaveTime").val(constructionSchedule.leaveTime);

                updateStatus(schedule, csid, constructionSchedule.status);
                updateEnterStatus(constructionSchedule.workStatus, csid);

                // 进场/离场按钮: 先 off 解绑避免重复绑定, 再 click 绑定
                bindEnterLeaveBtn("#" + csid + "Success", api.construction.enterConstructionSchedule, 1, csid, args);
                bindEnterLeaveBtn("#" + csid + "Leave", api.construction.leaveConstructionSchedule, 2, csid, args);

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

                com.focusPage("#" + csid + "Gallery").html("");

                for ( var i = 0; i < drawings.length; i++) {
                    var drawing = drawings[i];
                    appendGalleryElement(csid + "Gallery", drawing.cdId, drawing.drawingUrl, drawing.type, "", api.construction.deleteConstructionDrawing);
                }
                com.popup4photos("#" + csid + "Gallery");
            });

            initUploadBtn(constructionSchedule.schedule, constructionSchedule.csid);

            com.focusPage('#' + csid + "Drawing").removeClass("active");

            if (com.focusPage('#' + csid + "NavTab" + ' li:last-of-type').hasClass("active")) {
                com.focusPage('#' + csid + "Drawing").addClass("active");
            }
            return false;
        });
    }

    // 进场/离场按钮绑定工厂: off 先解绑避免重复绑定, 再 click 绑定
    function bindEnterLeaveBtn(selector, apiName, workStatus, csid, args) {

        com.focusPage(selector).off("click").on("click", function() {

            if (supervision4detail.pageType)
                return false;

            var options = {
                "constructionSchedule.csid": constructionSchedule.csid
            };

            com.post(apiName, options, function(res) {

                com.showAlert(com.info, "操作成功");
                updateEnterStatus(workStatus, csid);
                com.post(api.construction.queryConstructionScheduleByOrderIdASchedule, args, function(res) {

                    var schedule = res.constructionSchedule;
                    // workStatus 1=进场刷新 enterTime, 2=离场刷新 leaveTime
                    var timeField = workStatus == 1 ? "enterTime" : "leaveTime";
                    var domField = workStatus == 1 ? "EnterTime" : "LeaveTime";
                    com.focusPage("#" + csid + domField).val(schedule[timeField]);
                });
            });

            return false;
        });
    }

    // 上传图片
    function initUploadBtn(schedule, csid) {

        if (supervision4detail.pageType)
            return false;

        com.uploadify("#" + csid + "Upload", "上传图片", api.common.uploadImg, 'btn btn-success', '*.jpg;*.jpeg;*.gif;*.png', {
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

            options["constructionSchedule.cid"] = params.construction.cid;
            options["constructionSchedule.csid"] = csid;
            options["constructionSchedule.schedule"] = schedule;

            com.post(api.construction.addConstructionDrawing, options, function(res) {

                var drawing = res.constructionDrawing;

                appendGalleryElement(csid + "Gallery", drawing.cdId, data.resUrl, 0, "", api.construction.deleteConstructionDrawing);

                com.popup4photos("#" + csid + "Gallery");
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

        com.focusPage("#" + csid + "WorkerInfos").html("");

        if (constructers.length == 0) {
            $('<div class="alert alert-info">').text("当前进度没有分配工人!").appendTo(com.focusPage("#" + csid + "WorkerInfos"));

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

                if (supervision4detail.pageType)
                    return false;

                // 传递上下文给工费子页面 (workerSalary4detail.js 读取)
                params.workerSalary = {
                    csid: workerInfo.csid,
                    userId: workerInfo.user.userId,
                    orderId: params.construction.orderId
                };

                // 用 Bootstrap modal 加载工费子页面 (避免 popup4page 双层 iframe 嵌套冲突)
                com.focusPage("#workerSalaryList").load("/views/salary/workerSalary4detail.html", function() {
                    com.focusPage("#guaranteeModal").modal("show");
                });
            });

            profileDiv.appendTo(com.focusPage("#" + csid + "WorkerInfos"));
        }

        return true;
    }

    // 画节点信息轴(节点挂逾期主材时标题带红色角标)
    function constructionNode(stepul, schedule, csid, name, overdueCount) {

        var stepLi = $("<li></li>").attr("data-targe", "#step" + csid).attr("data-schedule", schedule).attr("data-csid", csid).addClass("complete").appendTo(stepul);
        var stepSpan = $("<span></span>").addClass("step").html(schedule).appendTo(stepLi);

        var titleHtml = name;

        if (overdueCount > 0) titleHtml += ' <span class="badge badge-important" title="主材计划逾期">' + overdueCount + '</span>';

        var stepSpan = $("<span></span>").addClass("title").html(titleHtml).appendTo(stepLi);
    }

    // 画节点下面的面板: 信息页签(计划/实际时间对照+计划参数+进离场+工人) / 主材计划页签 / 施工图片页签
    function constructionPane(paneId, v, materialPlans) {

        var csid = v.csid;
        var name = v.node.name;
        var schedule = v.schedule;
        var status = v.status;

        var paneDiv = $("<div></div>").addClass("step-pane").attr("id", "step" + csid).attr("flag", "step").attr("data-schedule", schedule).attr("data-csid", csid).appendTo(paneId);

        // status == 1 (STATUS_BEGIN) 表示进行中的节点, 默认激活显示
        if (status == 1) {
            paneDiv.removeClass("step-pane");
            paneDiv.attr("class", "active");
        }

        var paneDivTwo = $("<div></div>").addClass("row").appendTo(paneDiv);
        var paneDivThree = $("<div></div>").addClass("tabbable").appendTo(paneDivTwo);
        var paneul = $("<ul></ul>").addClass("nav nav-tabs").attr("id", csid + "NavTab").appendTo(paneDivThree);
        var paneli = $("<li></li>").addClass("active").appendTo(paneul);
        var panelia = $("<a></a>").attr("data-toggle", "tab").attr("href", "#" + csid + "Info").html("信息").appendTo(paneli);

        var paneliTwo = $("<li></li>").addClass("").appendTo(paneul);
        var paneliTwoa = $("<a></a>").attr("data-toggle", "tab").attr("href", "#" + csid + "MaterialPlan").html("主材计划").appendTo(paneliTwo);

        var paneliThree = $("<li></li>").addClass("").appendTo(paneul);
        var paneliThreea = $("<a></a>").attr("data-toggle", "tab").attr("href", "#" + csid + "Drawing").html("施工图片").appendTo(paneliThree);

        var paneTabContent = $("<div></div>").addClass("tab-content").appendTo(paneDivThree);
        var paneTabTwo = $("<div></div>").addClass("tab-pane in active").attr("id", csid + "Info").appendTo(paneTabContent);
        var paneTabForm = $("<form></form>").addClass("form-horizontal").appendTo(paneTabTwo);

        var paneTabThree = $("<div></div>").addClass("form-group").appendTo(paneTabForm);
        var paneTabH3 = $("<h3></h3>").addClass("header smaller lighter blue").appendTo(paneTabThree);
        var paneTabH3I = $("<i></i>").addClass("icon-edit").appendTo(paneTabH3);
        var paneTabSpan = $("<span></span>").html(name + "信息").appendTo(paneTabH3);

        // 预计开工/预计完工(计划时间, 放线推算, 静态展示)
        var panePreRow = $("<div></div>").addClass("form-group").appendTo(paneTabForm);
        var panePreRowTwo = $("<div></div>").addClass("col-sm-12").appendTo(panePreRow);
        appendTimeInput(panePreRowTwo, csid + "PreStartTime", "预计开工", v.preStartTime);
        appendTimeInput(panePreRowTwo, csid + "PreEndTime", "预计完工", v.preEndTime);

        // 开工/完工时间(实际时间, 切换步骤时刷新)
        var paneStartTime = $("<div></div>").addClass("form-group").appendTo(paneTabForm);
        var paneStartTimeTwo = $("<div></div>").addClass("col-sm-12").appendTo(paneStartTime);
        appendTimeInput(paneStartTimeTwo, csid + "StartTime", "开工时间", v.startTime);
        appendTimeInput(paneStartTimeTwo, csid + "EndTime", "完工时间", v.endTime);

        // 状态 + 附加项待审/款比例豁免标识
        var paneSpace = $("<div></div>").addClass("space-4").appendTo(paneTabForm);
        var paneStatus = $("<div></div>").addClass("form-group").appendTo(paneTabForm);
        var paneStatusTwo = $("<div></div>").addClass("col-sm-12").appendTo(paneStatus);
        var paneStatusLable = $("<label></label>").addClass("col-sm-1 control-label no-padding-right").attr("for", csid + "Status").html(name + "状态").appendTo(paneStatusTwo);
        var paaneStatusTh = $("<div></div>").attr("id", csid + "Status").addClass("col-sm-6").appendTo(paneStatusTwo);

        if (v.additemStatus != null && v.additemStatus == 1) {
            $("<span></span>").addClass("label label-warning").css("margin-left", "10px").attr("title", "报价附加项待审").html("附加项待审").appendTo(paaneStatusTh);
        }

        if (v.checkout != null && v.checkout == 1) {
            $("<span></span>").addClass("label").css("margin-left", "10px").attr("title", "开工完工款比例校验已豁免").html("款比例豁免").appendTo(paaneStatusTh);
        }

        var paneSpaceTwo = $("<div></div>").addClass("space-4").appendTo(paneTabForm);

        // 进场/离场时间 + 按钮
        var paneEnterRow = $("<div></div>").addClass("form-group").appendTo(paneTabForm);
        var paneEnterRowTwo = $("<div></div>").addClass("col-sm-12").appendTo(paneEnterRow);
        appendTimeInput(paneEnterRowTwo, csid + "EnterTime", "进场时间", v.enterTime);
        appendTimeInput(paneEnterRowTwo, csid + "LeaveTime", "离场时间", v.leaveTime);

        var enterBtn = $("<button type='button'></button>").addClass("btn btn-xs btn-info").html("进场").attr("style", "margin:5px 5px 0 0").attr("id", csid + "Success").appendTo(paneEnterRowTwo);
        var leaveBtn = $("<button type='button'></button>").addClass("btn btn-xs btn-info").html("离场").attr("style", "margin:5px 5px 0 0").attr("id", csid + "Leave").appendTo(paneEnterRowTwo);

        // 进场状态
        var panewSpace = $("<div></div>").addClass("space-4").appendTo(paneTabForm);
        var panewStatus = $("<div></div>").addClass("form-group").appendTo(paneTabForm);
        var panewStatusTwo = $("<div></div>").addClass("col-sm-12").appendTo(panewStatus);
        var panewStatusLable = $("<label></label>").addClass("col-sm-1 control-label no-padding-right").attr("for", csid + "enterStatus").html("进场状态").appendTo(panewStatusTwo);
        var paanewStatusTh = $("<div></div>").attr("id", csid + "enterStatus").addClass("col-sm-6").appendTo(panewStatusTwo);
        var panewSpaceTwo = $("<div></div>").addClass("space-4").appendTo(paneTabForm);

        // 计划参数: 工期/前后置间隔/四项比例/预估工费(比例与金额经 tranargs 已÷1000, 页面值即百分比/元)
        var paneParamsH3 = $("<h3></h3>").addClass("header smaller lighter grey").appendTo(paneTabForm);
        var paneParamsH3I = $("<i></i>").addClass("icon-list").appendTo(paneParamsH3);
        var paneParamsSpan = $("<span></span>").html("计划参数").appendTo(paneParamsH3);

        var paneParams = $("<div></div>").addClass("form-group").appendTo(paneTabForm);
        var paneParamsTwo = $("<div></div>").addClass("col-sm-12").appendTo(paneParams);
        var paramsHtml = buildParamsHtml(v);
        $(paramsHtml).appendTo(paneParamsTwo);

        var paneParamsSpace = $("<div></div>").addClass("space-4").appendTo(paneTabForm);

        // 工人信息
        var paneWorker = $("<div></div>").addClass("form-group").appendTo(paneTabForm);
        var paneWorkerH3 = $("<h3></h3>").addClass("header smaller lighter blue").appendTo(paneWorker);
        var paneWorkerI = $("<i></i>").addClass("icon-edit").appendTo(paneWorkerH3);
        var paneWorkerSpan = $("<span></span>").html("工人信息").appendTo(paneWorkerH3);

        var paneWorkerContent = $("<div></div>").addClass("form-group").appendTo(paneTabForm);
        var paneWorkerInfo = $("<div></div>").addClass("tab-pane in active").attr("id", csid + "WorkerInfos").appendTo(paneWorkerContent);
        var paneSpaceTh = $("<div></div>").addClass("space-4").appendTo(paneTabForm);

        // 主材计划页签(该节点挂的主材动作与履约, 只读)
        var paneMaterialPlan = $("<div></div>").addClass("tab-pane in").attr("id", csid + "MaterialPlan").appendTo(paneTabContent);
        renderMaterialPlanPane(csid, v.cnid, materialPlans, paneMaterialPlan);

        // 施工图片信息
        var paneDrawing = $("<div></div>").addClass("tab-pane in").attr("id", csid + "Drawing").appendTo(paneTabContent);
        var paneDrawingRow = $("<div></div>").addClass("row").appendTo(paneDrawing);
        var paneDrawingRowOne = $("<div></div>").addClass("col-xs-12").appendTo(paneDrawingRow);
        var paneDrawingRowTwo = $("<div></div>").addClass("row-fluid").appendTo(paneDrawingRowOne);
        var paneDrawingRowUl = $("<ul></ul>").addClass("ace-thumbnails").attr("id", csid + "Gallery").appendTo(paneDrawingRowTwo);

        var paneDrawingRowT = $("<div></div>").addClass("row").appendTo(paneDrawing);
        var paneDrawingRowTOne = $("<div></div>").addClass("hr hr32 hr-dotted").appendTo(paneDrawingRowT);
        var paneDrawingRowTTwo = $("<div></div>").addClass("col-xs-12").appendTo(paneDrawingRowT);
        var paneDrawingRowTh = $("<div></div>").addClass("pull-left inline").appendTo(paneDrawingRowTTwo);
        var paneDrawingRowFour = $("<div></div>").attr("id", csid + "Upload").appendTo(paneDrawingRowTh);
        var paneDrawingRowInp = $("<input />").attr("type", "text").addClass("hidden").attr("id", "picture").appendTo(paneDrawingRowTh);

        // 上传按钮
        var paneDrawingBtn = $("<input />").attr("id", "select_btn_1").addClass("selectbtn").attr("style", "display:none").attr("type", "file").attr("name", "fileselect[]").attr("multiple", "").attr("accept", "image/jpeg,image/gif,image/png").appendTo(paneDrawingRowTTwo);
        var paneDrawingA = $("<a></a>").attr("id", "file_upload_1-button").attr("href", "javascript:void(0)").addClass("uploadify-button btn btn-success").html("上传").appendTo(paneDrawingRowFour);
        var paneDrawingUpDiv = $("<div></div>").attr("id", "file_upload_1-queue").addClass("uploadify-queue").attr("style", "width: 300px;").appendTo(paneDrawingRowFour);

    }

    // 只读时间行: label col-sm-2 + input col-sm-3, 一行两组
    function appendTimeInput(row, id, label, value) {

        $("<label></label>").addClass("col-sm-2 control-label no-padding-right").attr("for", id).html(label).appendTo(row);
        var inputDiv = $("<div></div>").addClass("col-sm-3").appendTo(row);
        $("<input/>").attr("id", id).attr("type", "text").addClass("col-sm-12").attr("readonly", "readonly").val(value == null ? "" : value).appendTo(inputDiv);
    }

    // 计划参数内联信息条
    function buildParamsHtml(v) {

        var items = [];

        items.push(kv("工期", v.period == null ? "-" : v.period + "天"));
        items.push(kv("前置间隔", v.prenum == null ? "-" : v.prenum + "天"));
        items.push(kv("后置间隔", v.postnum == null ? "-" : v.postnum + "天"));
        items.push(kv("开工款比", v.precheck == null ? "-" : v.precheck + "%"));
        items.push(kv("完工款比", v.postcheck == null ? "-" : v.postcheck + "%"));
        items.push(kv("开工材比", v.stacheck == null ? "-" : v.stacheck + "%"));
        items.push(kv("完工材比", v.fincheck == null ? "-" : v.fincheck + "%"));
        items.push(kv("预估工费", v.planSalary == null ? "-" : v.planSalary + "元" + (v.planStatus == 1 ? "(已确认)" : "")));

        return '<div class="col-sm-12" style="line-height:30px;">' + items.join("") + '</div>';
    }

    function kv(key, value) {
        return '<span style="margin-right:18px;"><strong class="grey">' + key + ':</strong> <span class="blue">' + value + '</span></span>';
    }

    // 主材计划页签: 该节点挂的主材动作(计划时点=读时推算, 系统履约=销售/配送/选材链回填)
    function renderMaterialPlanPane(csid, cnid, materialPlans, container) {

        // constant 行缺失(SQL未执行)时兜底硬编码枚举
        var materialPlanEnum = (constant.construction() || {}).materialPlan || {
            action: { keys: { 0: "下单", 1: "配送", 2: "到货" } },
            autoStatus: { keys: { 0: "未履约", 1: "已下单", 2: "已配送", 3: "已到货" } },
            status: { keys: { 0: "未完成", 1: "已完成", 2: "已取消" } }
        };

        if (materialPlans == null || materialPlans.length == 0) {
            $('<div class="alert alert-info">').text("本节点暂无主材计划").appendTo(container);
            return;
        }

        var table = $("<table></table>").addClass("table table-striped table-bordered table-hover").appendTo(container);
        var thead = $("<thead></thead>").appendTo(table);
        var tr = $("<tr></tr>").appendTo(thead);
        $.each(["主材", "动作", "计划时点", "系统履约", "履约时间", "状态", "说明"], function(i, title) {
            $("<th></th>").html(title).appendTo(tr);
        });

        var tbody = $("<tbody></tbody>").appendTo(table);

        $.each(materialPlans, function(i, plan) {

            var material = plan.type == 1 ? (plan.brandName || "") + "(" + (plan.categoryName || "") + ")" : (plan.categoryName || "");

            var row = $("<tr></tr>").appendTo(tbody);

            if (plan.overdue == 1) row.addClass("danger");

            $("<td></td>").html(material).appendTo(row);
            $("<td></td>").html(materialPlanEnum.action.keys[plan.action] || plan.action).appendTo(row);
            $("<td></td>").html(plan.planTime || "待定").appendTo(row);
            $("<td></td>").html(materialPlanEnum.autoStatus.keys[plan.autoStatus] || plan.autoStatus).appendTo(row);
            $("<td></td>").html(plan.autoTime || "-").appendTo(row);
            $("<td></td>").html((materialPlanEnum.status.keys[plan.status] || plan.status) + (plan.status == 0 && plan.overdue == 1 ? '<span class="label label-important" style="margin-left:5px">逾期</span>' : "")).appendTo(row);
            $("<td></td>").html(plan.comment || "").appendTo(row);
        });
    }

    // 主材计划按节点分组(后端已按节点排期→动作→偏移排序, 分组保持原序)
    function groupMaterialPlans(materialPlans) {

        var map = {};

        $.each(materialPlans, function(i, plan) {
            if (plan.cnid == null) return;
            if (!map[plan.cnid]) map[plan.cnid] = [];
            map[plan.cnid].push(plan);
        });

        return map;
    }

    function countOverdue(materialPlans) {

        var count = 0;

        $.each(materialPlans || [], function(i, plan) {
            if (plan.overdue == 1) count++;
        });

        return count;
    }

    function addActive(csid) {

        var con = supervision4detail.constructionSchedules;
        $.each(con, function(i, v) {

            com.focusPage("#step" + v.csid).removeClass("active");
            com.focusPage("#step" + v.csid).addClass("step-pane");
        });
        com.focusPage("#step" + csid).removeClass("step-pane");
        com.focusPage("#step" + csid).addClass("active");
    }

    // 状态显示通用函数: status 0/1/2 对应不同 label 文字
    // labels = [label0, label1, label2], styles = [class0, class1, class2]
    function renderStatus(status, container, labels, styles) {

        com.focusPage("#" + container).html("");

        if (status >= 0 && status <= 2) {
            $("<span></span>").addClass("label " + styles[status]).text(labels[status]).appendTo(com.focusPage("#" + container));
        }
    }

    function updateEnterStatus(workStatus, csid) {

        renderStatus(workStatus, csid + "enterStatus",
            ["初始", "进场", "离场"],
            ["label label-grey", "label label-info", "label label-success"]);
    }

    function updateStatus(schedule, csid, status) {

        renderStatus(status, csid + "Status",
            ["初始", "开工", "完工"],
            ["label label-grey", "label label-info", "label label-success"]);
    }

});
