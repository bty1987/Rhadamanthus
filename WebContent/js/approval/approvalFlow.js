jQuery(function($) {

    // 业务审批类型映射(对应 ApprovalPO.APPROVAL_TYPE_*)
    var businessTypeMap = {
        1: "客户信息", 2: "小区", 3: "装修归属", 4: "报价折扣", 5: "装修退款",
        6: "主材退款", 7: "主材外部退款", 8: "装修活动", 9: "主材全款",
        10: "销售退款", 11: "清单DB", 12: "销售折扣", 13: "人事",
        14: "客户来源-装修", 16: "装修整装", 17: "客户来源", 18: "销售收款",
        19: "装修终审", 20: "客户来源变更", 21: "客户机会", 22: "报价优惠",
        23: "优惠", 24: "装饰合同", 25: "客户机会停用", 26: "预付款提现"
    };

    // ===== 加载流程列表(不分页) =====
    function loadFlowList() {

        com.post(api.approval.queryApprovalFlow, {}, function(res) {

            var $body = com.focusPage("#flowBody").empty();
            var flows = res.flows || [];

            com.focusPage("#notFlow").toggle(flows.length === 0);

            $.each(flows, function(i, v) {

                var $tr = $('<tr></tr>');

                $('<td></td>').text(v.name).appendTo($tr);
                $('<td></td>').addClass("blue").text(v.code).appendTo($tr);
                $('<td></td>').text(businessTypeMap[v.businessType] || v.businessType).appendTo($tr);
                $('<td></td>').text(v.version).appendTo($tr);
                $('<td></td>').html(v.status == 0
                    ? "<span class='label label-success'>启用</span>"
                    : "<span class='label label-default'>禁用</span>").appendTo($tr);

                var $btnTd = $('<td></td>');

                $('<button></button>').addClass("btn btn-minier btn-yellow")
                    .html('<i class="icon-edit"></i> 编辑')
                    .on("click", function() {
                        params.approval.flow = v;
                        com.popup4page("#layerPopUp", api.index.createApprovalFlowIndex.url, "编辑流程", null, function() {
                            loadFlowList();
                        });
                    }).appendTo($btnTd);

                $('<button></button>').addClass("btn btn-minier " + (v.status == 0 ? "btn-warning" : "btn-success"))
                    .css("margin-left", "3px")
                    .text(v.status == 0 ? "禁用" : "启用")
                    .on("click", function() {
                        com.post(api.approval.updateApprovalFlowForStatus, {
                            "flow.flowId": v.flowId,
                            "flow.status": v.status == 0 ? 1 : 0
                        }, function() {
                            loadFlowList();
                        });
                    }).appendTo($btnTd);

                $('<button></button>').addClass("btn btn-minier btn-danger")
                    .css("margin-left", "3px")
                    .html('<i class="icon-trash"></i> 删除')
                    .on("click", function() {
                        com.showConfirm("确认删除该流程定义?关联的节点将一并删除。", function() {
                            com.post(api.approval.deleteApprovalFlow, {
                                "flow.flowId": v.flowId
                            }, function() {
                                com.showAlert(com.info, "删除成功");
                                loadFlowList();
                            });
                        });
                    }).appendTo($btnTd);

                $btnTd.appendTo($tr);
                $body.append($tr);
            });
        });
    }

    loadFlowList();

    com.focusPage("#addApprovalFlow").click(function() {
        params.approval.flow = null;
        com.popup4page("#layerPopUp", api.index.createApprovalFlowIndex.url, "添加流程", null, function() {
            loadFlowList();
        });
    });

});
