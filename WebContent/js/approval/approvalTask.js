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

});
