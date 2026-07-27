jQuery(function($) {

    var task = {
        currentTaskId: null,
        modal: com.focusPage("#taskModal"),
        traceModal: com.focusPage("#traceModal")
    };

    var statusMap = {
        0: "<span class='label label-warning'>待办</span>",
        1: "<span class='label label-success'>通过</span>",
        2: "<span class='label label-important'>拒绝</span>",
        3: "<span class='label label-info'>转交</span>",
        4: "<span class='label label-default'>已失效</span>",
        5: "<span class='label label-default'>超时</span>"
    };

    var nodeTypeMap = { 1: "串行", 2: "并签", 3: "或签", 4: "会签" };

    // ===== 加载待办列表(表格) =====
    function loadTodoList() {

        com.post(api.approval.queryApprovalTodoTask, {}, function(res) {

            var $body = com.focusPage("#taskBody").empty();
            var tasks = res.tasks || [];

            com.focusPage("#taskTable").toggle(tasks.length > 0);
            com.focusPage("#notTask").toggle(tasks.length === 0);

            $.each(tasks, function(i, t) {

                var $tr = $('<tr></tr>');

                $('<td></td>').html("<strong>#" + t.taskId + "</strong>").appendTo($tr);
                $('<td></td>').text(t.aid).appendTo($tr);
                $('<td></td>').text(t.nodeSeq).appendTo($tr);
                $('<td></td>').html("<span class='label label-primary'>" + (nodeTypeMap[t.nodeType] || t.nodeType) + "</span>").appendTo($tr);
                $('<td></td>').addClass("small muted").text(t.assignTime || "-").appendTo($tr);

                var $btnTd = $('<td></td>');
                $('<button></button>').addClass("btn btn-minier btn-success").html('<i class="icon-check"></i> 审批').on("click", function() { openTaskModal(t); }).appendTo($btnTd);
                $('<button></button>').addClass("btn btn-minier btn-info").html('<i class="icon-reorder"></i> 轨迹').css("margin-left", "5px").on("click", function() { openTraceModal(t.aid); }).appendTo($btnTd);
                $btnTd.appendTo($tr);

                $body.append($tr);
            });
        });
    }

    loadTodoList();

    // ===== 打开审批弹窗 =====
    function openTaskModal(t) {
        task.currentTaskId = t.taskId;
        com.focusPage("#taskComment").val("");
        com.focusPage("#transferTo").val("");
        com.focusPage("#transferGroup").hide();
        com.focusPage("#taskModalTitle").text("审批 任务#" + t.taskId);
        task.modal.modal("show");
    }

    // ===== 打开轨迹弹窗(表格) =====
    function openTraceModal(aid) {

        com.post(api.approval.queryApprovalTaskTrace, { "task.aid": aid }, function(res) {

            var $body = com.focusPage("#traceBody").empty();
            var tasks = res.tasks || [];

            if (tasks.length === 0) {
                $('<tr></tr>').html('<td colspan="6" class="alert alert-info center">暂无轨迹</td>').appendTo($body);
                task.traceModal.modal("show");
                return;
            }

            $.each(tasks, function(i, t) {

                var $tr = $('<tr></tr>');

                $('<td></td>').text(t.nodeSeq).appendTo($tr);
                $('<td></td>').html(statusMap[t.status] || t.status).appendTo($tr);
                $('<td></td>').text(t.assigneeId || "-").appendTo($tr);
                $('<td></td>').text(t.transferTo || "-").appendTo($tr);
                $('<td></td>').addClass("small").text(t.comment || "-").appendTo($tr);
                $('<td></td>').addClass("small muted").text(t.actionTime || "-").appendTo($tr);

                $body.append($tr);
            });

            task.traceModal.modal("show");
        });
    }

    // ===== 审批操作 =====
    com.focusPage("#agreeBtn").click(function() {
        doAction("agree");
    });

    com.focusPage("#refuseBtn").click(function() {
        doAction("refuse");
    });

    com.focusPage("#transferBtn").click(function() {
        var $group = com.focusPage("#transferGroup");
        var visible = $group.is(":visible");
        $group.show();
        if (visible) {
            // 第二次点击执行转交
            doAction("transfer");
        }
    });

    function doAction(action) {

        if (!task.currentTaskId) return;

        var comment = com.focusPage("#taskComment").val();
        var options = { "taskId": task.currentTaskId, "comment": comment };

        if (action == "agree") {
            com.post(api.approval.agreeApprovalTask, options, function(res) {
                com.showAlert(com.info, "审批通过");
                task.modal.modal("hide");
                loadTodoList();
            });
        } else if (action == "refuse") {
            com.post(api.approval.refuseApprovalTask, options, function(res) {
                com.showAlert(com.info, "已拒绝");
                task.modal.modal("hide");
                loadTodoList();
            });
        } else if (action == "transfer") {
            var transferTo = com.focusPage("#transferTo").val();
            if (!transferTo) {
                com.showAlert(com.warning, "请填写转交目标");
                return;
            }
            options["transferTo"] = transferTo;
            com.post(api.approval.transferApprovalTask, options, function(res) {
                com.showAlert(com.info, "已转交");
                task.modal.modal("hide");
                loadTodoList();
            });
        }
    }

    // ===== 通用审批发起 =====
    task.startModal = com.focusPage("#startModal");
    var generalFields = []; // 当前流程的表单字段定义

    // 发起按钮 → 加载通用流程下拉
    com.focusPage("#startApprovalBtn").click(function() {

        var $sel = com.focusPage("#generalFlowSelect").empty();
        $('<option></option>').val("").text("请选择").appendTo($sel);
        com.focusPage("#generalFormArea").empty();

        com.post(api.approval.pageApprovalFlow, { "paging.page": 1, "paging.rows": 999 }, function(res) {
            var flows = res.paging.data || [];
            $.each(flows, function(i, f) {
                if (f.status == constant.data().common.STATUS_ENABLE_INT && f.businessType == 100) {
                    $('<option></option>').val(f.code).text(f.name).attr("data-flowId", f.flowId).appendTo($sel);
                }
            });
        });

        task.startModal.modal("show");
    });

    // 选择流程 → 加载表单字段
    com.focusPage("#generalFlowSelect").on("change", function() {

        var flowId = com.focusPage("#generalFlowSelect option:selected").attr("data-flowId");
        var $area = com.focusPage("#generalFormArea").empty();
        generalFields = [];

        if (!flowId) return;

        // 查该流程关联的表单
        com.post(api.approval.queryApprovalFormByFlowId, { "flowId": flowId }, function(res) {

            if (!res.form || !res.form.formId) {
                $('<div></div>').addClass("alert alert-warning center").text("该流程未配置表单,可直接提交").appendTo($area);
                return;
            }

            // 查表单字段
            com.post(api.approval.queryApprovalFormField, { "form.formId": res.form.formId }, function(fieldRes) {
                generalFields = fieldRes.formFields || [];
                renderGeneralForm(generalFields, $area);
            });
        });
    });

    function renderGeneralForm(fields, $area) {

        var $form = $('<form></form>').addClass("form-horizontal");

        $.each(fields, function(i, f) {
            var $group = $('<div></div>').addClass("form-group");
            var $label = $('<label></label>').addClass("col-sm-3 control-label no-padding-right")
                .css("font-weight", "normal");

            var labelText = f.fieldLabel || f.fieldKey;
            if (f.required == 1) labelText = '<span class="red">*</span>' + labelText;
            $label.html(labelText);
            $label.appendTo($group);

            var $ctrl = $('<div></div>').addClass("col-sm-9");

            var fieldName = "gf_" + f.fieldKey;
            var placeholder = f.defaultValue || "";

            switch (f.controlType) {
                case 2:
                    $('<textarea></textarea>').addClass("col-xs-12").attr("name", fieldName).attr("data-key", f.fieldKey).appendTo($ctrl);
                    break;
                case 3:
                    $('<input type="number">').addClass("col-xs-12").attr("name", fieldName).attr("data-key", f.fieldKey).attr("placeholder", placeholder).appendTo($ctrl);
                    break;
                case 4:
                    var $sel = $('<select></select>').addClass("col-xs-12").attr("name", fieldName).attr("data-key", f.fieldKey);
                    $('<option></option>').val("").text("请选择").appendTo($sel);
                    if (f.dataSource) {
                        $.each(f.dataSource.split(","), function(j, opt) {
                            $('<option></option>').val(opt.trim()).text(opt.trim()).appendTo($sel);
                        });
                    }
                    $sel.appendTo($ctrl);
                    break;
                case 5:
                    $('<input type="text">').addClass("col-xs-12").attr("name", fieldName).attr("data-key", f.fieldKey).attr("placeholder", "YYYY-MM-DD").appendTo($ctrl);
                    break;
                case 8:
                    $('<input type="text">').addClass("col-xs-12").attr("name", fieldName).attr("data-key", f.fieldKey).attr("placeholder", "附件链接").appendTo($ctrl);
                    break;
                default:
                    $('<input type="text">').addClass("col-xs-12").attr("name", fieldName).attr("data-key", f.fieldKey).attr("placeholder", placeholder).appendTo($ctrl);
            }

            $ctrl.appendTo($group);
            $form.append($group);
        });

        $area.append($form);
    }

    // 提交通用审批
    com.focusPage("#submitGeneralBtn").click(function() {

        var code = com.focusPage("#generalFlowSelect").val();
        if (!code) {
            com.showAlert(com.warning, "请选择审批流程");
            return;
        }

        // 收集表单数据
        var formData = {};
        var hasEmpty = false;

        com.focusPage("#generalFormArea [data-key]").each(function() {
            var key = com.focusPage(this).attr("data-key");
            var val = com.focusPage(this).val();

            // 必填校验
            $.each(generalFields, function(i, f) {
                if (f.fieldKey == key && f.required == 1 && !val) {
                    hasEmpty = true;
                }
            });

            formData[key] = val;
        });

        if (hasEmpty) {
            com.showAlert(com.warning, "请填写所有必填字段");
            return;
        }

        com.post(api.approval.startGeneralApproval, {
            "code": code,
            "forms": JSON.stringify(formData)
        }, function(res) {
            com.showAlert(com.info, "审批已提交(aid=" + res.aid + ")");
            task.startModal.modal("hide");
        });
    });

});
