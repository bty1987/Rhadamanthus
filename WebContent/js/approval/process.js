jQuery(function($) {

    // 隐藏触发
    com.focusPage("#processInfo").on('hide.bs.modal', function() {

        com.focusPage("#processfield").empty();
        com.focusPage("#processitem").empty();
        com.focusPage("#processcomment").empty();
    });

    var lineprops = (function() {

        return [{
            field: "name",
            name: "名称",
            prop: "name",
            clazz: "grey"
        }, {
            field: "no",
            name: "编号",
            prop: "no",
            clazz: "blue"
        }, {
            field: "code",
            name: "code",
            prop: "code",
            clazz: "grey"
        }, {
            field: "status",
            name: "状态",
            prop: function(v) { return constant.approval().process.status.keys[v.status]; },
            clazz: "red"
        }];
    })();

    var linebtns = (function() {

        return {
            edit: {
                name: "编辑",
                clazz: "btn-yellow",
                handle: function(v) {

                    params.approval.process = v;
                    com.popup4page("#layerPopUp", api.index.createProcessIndex.url, "审批");
                }
            },
            status: {
                type: "switch",
                clazz: "status-lbl",
                init: function(v) { return v.status == constant.approval().process.STATUS_ENABLE_INT; },
                handle: function(v, checked) {

                    com.post(api.approval.updateProcessForStatus, {
                        "process.pid": v.pid,
                        "process.status": v.status == constant.approval().process.STATUS_ENABLE_INT ? constant.approval().process.STATUS_DISABLE_INT : constant.approval().process.STATUS_ENABLE_INT
                    }, function(res) {

                        searcher.doSearch();
                    });
                }
            },
            del: {
                name: "删除",
                clazz: "btn-danger",
                handle: function(v) {

                    com.showConfirm("确认要删除当前表单吗?", function(res) {

                        com.post(api.approval.deleteProcess, {
                            "process.pid": v.pid
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

        var $adda = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('id', 'addProcess').css("margin", "0px 3px");
        $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
        $('<span></span>').text('添加').appendTo($adda);

        return [$adda];
    })();

    var searcher = new Searcher();

    searcher.set("condList", "pagenation", "resultList", api.approval.pageProcess, null, ["approval-process-no", "approval-process-name", "approval-process-status"], "processPostData", null, false, buttons);
    searcher.line("name", lineprops, linebtns).render();

    com.focusPage("#addProcess").click(function() {

        params.approval.process = null;

        com.popup4page("#layerPopUp", api.index.createProcessIndex.url, "审批", null, function() {

            searcher.doSearch();
        });
    });

});
