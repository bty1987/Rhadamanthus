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

    var lineprops = (function() {
        return [{
            field: "name",
            name: "流程名称",
            prop: "name",
            clazz: "grey"
        }, {
            field: "code",
            name: "编码",
            prop: "code",
            clazz: "blue"
        }, {
            field: "businessType",
            name: "业务类型",
            prop: function(v) { return businessTypeMap[v.businessType] || v.businessType; },
            clazz: "grey"
        }, {
            field: "version",
            name: "版本",
            prop: "version",
            clazz: "grey"
        }, {
            field: "status",
            name: "状态",
            prop: function(v) { return v.status == 0 ? "启用" : "禁用"; },
            clazz: "red"
        }];
    })();

    var linebtns = (function() {
        return {
            edit: {
                name: "编辑",
                clazz: "btn-yellow",
                handle: function(v) {
                    params.approval.flow = v;
                    com.popup4page("#layerPopUp", api.index.createApprovalFlowIndex.url, "编辑流程", null, function() {
                        searcher.doSearch();
                    });
                }
            },
            status: {
                type: "switch",
                init: function(v) { return v.status == 0; },
                handle: function(v, checked) {
                    com.post(api.approval.updateApprovalFlowForStatus, {
                        "flow.flowId": v.flowId,
                        "flow.status": v.status == 0 ? 1 : 0
                    }, function(res) {
                        searcher.doSearch();
                    });
                }
            },
            del: {
                name: "删除",
                clazz: "btn-danger",
                handle: function(v) {
                    com.showConfirm("确认删除该流程定义?关联的节点将一并删除。", function(res) {
                        com.post(api.approval.deleteApprovalFlow, {
                            "flow.flowId": v.flowId
                        }, function(res) {
                            com.showAlert(com.info, "删除成功");
                            searcher.doSearch();
                        });
                    });
                }
            }
        };
    })();

    var buttons = (function() {
        var $add = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('id', 'addApprovalFlow').css("margin", "0px 3px");
        $('<i></i>').addClass('icon-plus bigger-110').appendTo($add);
        $('<span></span>').text('添加流程').appendTo($add);
        return [$add];
    })();

    var searcher = new Searcher();

    searcher.set("condList", "pagenation", "resultList", api.approval.pageApprovalFlow, null, ["approval-flow-code", "approval-flow-name", "approval-flow-status"], "approvalFlowPostData", null, false, buttons);

    searcher.line("name", lineprops, linebtns).render();

    com.focusPage("#addApprovalFlow").click(function() {
        params.approval.flow = null;
        com.popup4page("#layerPopUp", api.index.createApprovalFlowIndex.url, "添加流程", null, function() {
            searcher.doSearch();
        });
    });

});
