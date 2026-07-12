jQuery(function($) {

    var lineprops = (function() {
        return [{
            field: "name",
            name: "表单名称",
            prop: "name",
            clazz: "grey"
        }, {
            field: "code",
            name: "编码",
            prop: "code",
            clazz: "blue"
        }, {
            field: "flowId",
            name: "关联流程ID",
            prop: "flowId",
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
                    params.approval.form = v;
                    com.popup4page("#layerPopUp", api.index.createApprovalFormIndex.url, "编辑表单", null, function() {
                        searcher.doSearch();
                    });
                }
            },
            status: {
                type: "switch",
                init: function(v) { return v.status == 0; },
                handle: function(v, checked) {
                    com.post(api.approval.updateApprovalFormForStatus, {
                        "form.formId": v.formId,
                        "form.status": v.status == 0 ? 1 : 0
                    }, function(res) {
                        searcher.doSearch();
                    });
                }
            },
            del: {
                name: "删除",
                clazz: "btn-danger",
                handle: function(v) {
                    com.showConfirm("确认删除该表单?关联的字段将一并删除。", function() {
                        com.post(api.approval.deleteApprovalForm, {
                            "form.formId": v.formId
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
        var $add = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('id', 'addApprovalForm').css("margin", "0px 3px");
        $('<i></i>').addClass('icon-plus bigger-110').appendTo($add);
        $('<span></span>').text('添加表单').appendTo($add);
        return [$add];
    })();

    var searcher = new Searcher();

    searcher.set("condList", "pagenation", "resultList", api.approval.pageApprovalForm, null, ["approval-form-code", "approval-form-name", "approval-form-status"], "approvalFormPostData", null, false, buttons);

    searcher.line("name", lineprops, linebtns).render();

    com.focusPage("#addApprovalForm").click(function() {
        params.approval.form = null;
        com.popup4page("#layerPopUp", api.index.createApprovalFormIndex.url, "添加表单", null, function() {
            searcher.doSearch();
        });
    });

});
