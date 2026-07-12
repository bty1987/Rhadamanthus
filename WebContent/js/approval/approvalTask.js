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

    // ===== 加载待办列表 =====
    function loadTodoList() {

        com.post(api.approval.queryApprovalTodoTask, {}, function(res) {

            var $list = com.focusPage("#taskList").empty();
            var tasks = res.tasks || [];

            if (tasks.length === 0) {
                $('<div></div>').addClass("alert alert-info center").text("暂无待办任务").appendTo($list);
                return;
            }

            $.each(tasks, function(i, t) {
                var $item = $('<div></div>').css({ "padding": "12px", "margin": "8px 0", "border": "1px solid #ddd", "border-radius": "4px", "background": "#fafafa" });

                $('<h5></h5>').html(
                    "<strong>任务 #" + t.taskId + "</strong>" +
                    " <span class='label label-primary'>" + (nodeTypeMap[t.nodeType] || t.nodeType) + "</span>" +
                    " 节点" + t.nodeSeq +
                    " 审批单:" + t.aid
                ).appendTo($item);

                $('<p></p>').addClass("muted small").text("分配时间:" + (t.assignTime || "")).appendTo($item);

                var $btnGroup = $('<div></div>').css("margin-top", "8px");
                $('<button></button>').addClass("btn btn-minier btn-success").html('<i class="icon-check"></i> 审批').on("click", function() { openTaskModal(t); }).appendTo($btnGroup);
                $('<button></button>').addClass("btn btn-minier btn-info").html('<i class="icon-reorder"></i> 轨迹').css("margin-left", "5px").on("click", function() { openTraceModal(t.aid); }).appendTo($btnGroup);

                $btnGroup.appendTo($item);
                $list.append($item);
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

    // ===== 打开轨迹弹窗 =====
    function openTraceModal(aid) {

        com.post(api.approval.queryApprovalTaskTrace, { "task.aid": aid }, function(res) {

            var $list = com.focusPage("#traceList").empty();
            var tasks = res.tasks || [];

            if (tasks.length === 0) {
                $('<li></li>').addClass("alert alert-info").text("暂无轨迹").appendTo($list);
                return;
            }

            $.each(tasks, function(i, t) {
                var $li = $('<li></li>').css({ "padding": "8px", "margin": "4px 0", "border-left": "3px solid #428bca", "list-style": "none" });

                $('<div></div>').html(
                    "节点" + t.nodeSeq + " " + statusMap[t.status] +
                    " 审批人:" + (t.assigneeId || "-") +
                    (t.transferTo ? " → 转交 " + t.transferTo : "")
                ).appendTo($li);

                if (t.comment) {
                    $('<div></div>').addClass("muted small").text("批注:" + t.comment).appendTo($li);
                }
                if (t.actionTime) {
                    $('<div></div>').addClass("muted small").text("时间:" + t.actionTime).appendTo($li);
                }

                $list.append($li);
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
