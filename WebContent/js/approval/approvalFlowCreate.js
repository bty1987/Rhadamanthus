jQuery(function($) {

    var flow = {
        data: params.approval.flow,
        nodes: [],
        editIndex: null,

        modal: com.focusPage("#nodeModal").on('hide.bs.modal', function() {
            com.cleanItems(flow.items);
            flow.editIndex = null;
        }),

        items: {
            nodeSeq: com.focusPage("#nodeSeq"),
            nodeName: com.focusPage("#nodeName"),
            nodeType: com.focusPage("#nodeType"),
            passRatio: com.focusPage("#passRatio"),
            approverRule: com.focusPage("#approverRule"),
            timeoutHours: com.focusPage("#timeoutHours"),
            approverData: com.focusPage("#approverData"),
            postHandler: com.focusPage("#postHandler"),
            rejectStrategy: com.focusPage("#rejectStrategy")
        }
    };

    var nodeTypeMap = { 1: "串行", 2: "并签", 3: "或签", 4: "会签" };
    var ruleMap = { 0: "指定人", 1: "直属上级", 2: "部门负责人", 3: "角色", 4: "自选", 5: "表达式" };

    // 会签时显示比例输入
    flow.items.nodeType.on("change", function() {
        var isRatio = $(this).val() == 4;
        com.focusPage("#ratioWrap").toggle(isRatio);
        com.focusPage("#ratioLabel").toggle(isRatio);
    });

    // ===== 编辑模式:加载已有流程 + 节点 =====
    if (flow.data && flow.data.flowId) {

        com.focusPage("#code").val(flow.data.code);
        com.focusPage("#name").val(flow.data.name);
        com.focusPage("#businessType").val(flow.data.businessType);
        com.focusPage("#version").val(flow.data.version);
        com.focusPage("#comment").val(flow.data.comment);
        // 编码编辑模式下不允许改(唯一键)
        com.focusPage("#code").prop("disabled", true);

        com.post(api.approval.queryApprovalFlowNode, { "flow.flowId": flow.data.flowId }, function(res) {

            flow.nodes = res.flowNodes || [];
            renderNodes();
        });
    }

    // ===== 节点列表渲染(纵向流程图卡片) =====
    function renderNodes() {

        var $canvas = com.focusPage("#flowCanvas").empty();

        com.focusPage("#flowCanvas").toggle(flow.nodes.length > 0);
        com.focusPage("#notnode").toggle(flow.nodes.length === 0);

        $.each(flow.nodes, function(i, node) {

            var $node = $('<div></div>').addClass("flow-node");

            // 卡片头部:序号圆圈 + 节点名 + 标签
            var $header = $('<div></div>').addClass("flow-node-header");
            $('<span></span>').addClass("flow-node-seq").text(node.nodeSeq).appendTo($header);
            $('<span></span>').addClass("flow-node-name").text(node.nodeName).appendTo($header);
            $('<span></span>').addClass("label label-warning")
                .css("margin-left", "4px")
                .text(nodeTypeMap[node.nodeType] || node.nodeType)
                .appendTo($header);
            if (node.passRatio) {
                $('<span></span>').addClass("label label-success")
                    .css("margin-left", "2px").text("比例" + node.passRatio).appendTo($header);
            }
            $header.appendTo($node);

            // 卡片内容:审批人规则/审批人/后置处理器
            var bodyHtml = "<div class='flow-node-body'>";
            bodyHtml += "<span class='muted'>规则:</span> " + (ruleMap[node.approverRule] || node.approverRule);
            if (node.approverData) {
                bodyHtml += "<br/><span class='muted'>审批人:</span> " + node.approverData;
            }
            if (node.timeoutHours) {
                bodyHtml += "<br/><span class='muted'>超时:</span> " + node.timeoutHours + "小时";
            }
            if (node.postHandler) {
                bodyHtml += "<br/><span class='muted'>后置:</span> " + node.postHandler;
            }
            bodyHtml += "</div>";
            $node.append(bodyHtml);

            // 操作按钮(绝对定位右上角)
            var $actions = $('<div></div>').addClass("flow-node-actions");
            $('<button></button>').addClass("btn btn-minier btn-yellow")
                .html('<i class="icon-edit"></i>').attr("title", "编辑")
                .on("click", function() { editNode(i); }).appendTo($actions);
            $('<button></button>').addClass("btn btn-minier btn-danger")
                .html('<i class="icon-trash"></i>').css("margin-left", "2px").attr("title", "删除")
                .on("click", function() { deleteNode(i); }).appendTo($actions);
            $actions.appendTo($node);

            $canvas.append($node);
        });
    }

    // ===== 添加 / 编辑节点 =====
    com.focusPage("#addNodeBtn").click(function() {
        flow.editIndex = null;
        com.cleanItems(flow.items);
        flow.items.nodeSeq.val(flow.nodes.length + 1);
        flow.modal.modal("show");
    });

    function editNode(index) {
        flow.editIndex = index;
        var node = flow.nodes[index];
        flow.items.nodeSeq.val(node.nodeSeq);
        flow.items.nodeName.val(node.nodeName);
        flow.items.nodeType.val(node.nodeType).trigger("change");
        flow.items.passRatio.val(node.passRatio);
        flow.items.approverRule.val(node.approverRule);
        flow.items.timeoutHours.val(node.timeoutHours);
        flow.items.approverData.val(node.approverData);
        flow.items.postHandler.val(node.postHandler);
        flow.items.rejectStrategy.val(node.rejectStrategy);
        flow.modal.modal("show");
    }

    function deleteNode(index) {
        com.showConfirm("确认删除该节点?", function() {
            flow.nodes.splice(index, 1);
            renderNodes();
        });
    }

    com.focusPage("#saveNodeBtn").click(function() {

        if (com.validate("#nodeFormField")) return false;

        var node = {
            nodeSeq: parseInt(flow.items.nodeSeq.val()),
            nodeName: flow.items.nodeName.val(),
            nodeType: parseInt(flow.items.nodeType.val()),
            passRatio: flow.items.passRatio.val() || "",
            approverRule: parseInt(flow.items.approverRule.val()),
            timeoutHours: flow.items.timeoutHours.val() || "",
            approverData: flow.items.approverData.val(),
            postHandler: flow.items.postHandler.val() || "",
            rejectStrategy: parseInt(flow.items.rejectStrategy.val()),
            status: 0
        };

        if (flow.editIndex !== null) {
            flow.nodes[flow.editIndex] = node;
        } else {
            flow.nodes.push(node);
        }

        renderNodes();
        flow.modal.modal("hide");
    });

    // ===== 提交流程 =====
    com.focusPage("#submitBtn").click(function() {

        if (com.validate("#flowForm")) return false;

        if (flow.nodes.length === 0) {
            com.showAlert(com.warning, "请至少添加一个节点");
            return false;
        }

        var options = {
            "flow.code": com.focusPage("#code").val(),
            "flow.name": com.focusPage("#name").val(),
            "flow.businessType": parseInt(com.focusPage("#businessType").val()),
            "flow.version": parseInt(com.focusPage("#version").val() || 1),
            "flow.comment": com.focusPage("#comment").val()
        };

        // 嵌套 List 参数:展开成 flowNodes[0].nodeName=xxx 形式(与 process2create.js 一致),
        // 不能用 JSON.stringify(会变成字符串,Struts2 无法转换成 List)
        $.each(flow.nodes, function(i, node) {
            options["flowNodes[" + i + "].nodeSeq"] = node.nodeSeq;
            options["flowNodes[" + i + "].nodeName"] = node.nodeName;
            options["flowNodes[" + i + "].nodeType"] = node.nodeType;
            options["flowNodes[" + i + "].approverRule"] = node.approverRule;
            options["flowNodes[" + i + "].approverData"] = node.approverData;
            options["flowNodes[" + i + "].rejectStrategy"] = node.rejectStrategy;
            options["flowNodes[" + i + "].status"] = node.status;
            // 选填字段:有值才传,避免 "null" 字符串污染
            if (node.passRatio) options["flowNodes[" + i + "].passRatio"] = node.passRatio;
            if (node.timeoutHours) options["flowNodes[" + i + "].timeoutHours"] = node.timeoutHours;
            if (node.postHandler) options["flowNodes[" + i + "].postHandler"] = node.postHandler;
        });

        var apiUrl = api.approval.addApprovalFlow;

        if (flow.data && flow.data.flowId) {
            options["flow.flowId"] = flow.data.flowId;
            apiUrl = api.approval.updateApprovalFlow;
        }

        com.post(apiUrl, options, function(res) {
            com.showAlert(com.info, "保存成功");
            com.closePopup();
        });
    });

});
