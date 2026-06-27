jQuery(function($) {

    var flowpath = {

        items: {
            name: com.focusPage("#name"),
            no: com.focusPage("#no"),
            keyword: com.focusPage("#keyword"),
            type: com.focusPage("#type")
        },
        fitems: {
            fpid: com.focusPage("#fpid"),
            fname: com.focusPage("#fname"),
            fno: com.focusPage("#fno"),
            fkeyword: com.focusPage("#fkeyword"),
            ftype: com.focusPage("#ftype")
        },

        btns: {
            withdrawBtn: com.focusPage("#withdrawBtn"),
            addCancelBtn: com.focusPage("#addCancelBtn"),
            updateBtn: com.focusPage("#updateBtn"),
            updateCancelBtn: com.focusPage("#updateCancelBtn")
        },

        addFlowpath: com.focusPage("#addFlowpath"),
        updateFlowpath: com.focusPage("#updateFlowpath"),
    };
    flowpath.btns.withdrawBtn.bindClick(saveData);
    flowpath.btns.updateBtn.bindClick(updateData);

    var statusMap = {
        "0": "启用",
        "1": "禁用"
    };

    var lineprops = (function() {

        return [{
            field: "no",
            name: "编号",
            prop: "no",
            clazz: "grey"
        }, {
            field: "keyword",
            name: "关键字",
            prop: "keyword",
            clazz: "grey"
        }, {
            field: "type",
            name: "类型",
            prop: "type",
            clazz: "grey"
        }, {
            field: "status",
            name: "状态",
            prop: function(v) { return statusMap[v.status]; },
            clazz: "red"
        }];
    })();

    var linebtns = (function() {

        return {
            update: {name: "修改", clazz: "btn-danger", handle: function(v) { flowpath.updateFlowpath.modal("show"); }},
            node: {name: "节点", clazz: "btn-success", handle: function(v) { node(v); }},
            delete: {name: "删除", clazz: "btn-warning", handle: function(v) { deleteFlowpath(v); }}
        };
    })();

    var buttons = (function() {

        var $adda = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('name', 'addSoodsModal').css({
            'margin-left': '4px'
        });
        $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
        $('<span></span>').text('添加').appendTo($adda);
        $adda.click(function() {

            flowpath.addFlowpath.modal("show");
        });
        return [$adda];
    })();

    var searcher = new Searcher();
    searcher.set("condList", "pagenation", "resultList", api.data.pageFlowpath, null, null, "flowpathPostData", null, false, buildFlowpathButtons);
    searcher.line("name", lineprops, linebtns).render();

    function saveData() {

        var options = {
            "flowpath.name": flowpath.items.name.val(),
            "flowpath.no": flowpath.items.no.val(),
            "flowpath.keyword": flowpath.items.keyword.val(),
            "flowpath.type": flowpath.items.type.val()
        };

        com.post(api.data.addFlowpath, options, function(res) {

            com.showAlert(com.info, "创建成功!");
            flowpath.addFlowpath.modal("hide");
            searcher.doSearch();
        });
    }

    function updateData(v) {

        if (com.validate('updateFlowpath')) {
            return false;
        }

        var option = {
            "flowpath.fpid": flowpath.fitems.fpid.val(),
            "flowpath.name": flowpath.fitems.fname.val(),
            "flowpath.no": flowpath.fitems.fno.val(),
            "flowpath.keyword": flowpath.fitems.fkeyword.val(),
            "flowpath.type": flowpath.fitems.ftype.val()
        };

        com.post(api.data.updateFlowpath, option, function(e) {

            com.showAlert(com.info, "操作成功");
            flowpath.updateFlowpath.modal("hide");
            searcher.doSearch();
        });
    }
    function deleteFlowpath(v) {

        com.showConfirm("是否确认删除", function() {

            var options = {
                "flowpath.fpid": v.fpid
            };
            com.post(api.data.deleteFlowpath, options, function(res) {

                com.showAlert(com.info, "操作成功");
                searcher.doSearch();
            }, null, false);
        });
    }
    function node(v) {

        params.data.fpid = v.fpid;
        com.popup4frame(v.name, "/views/data/flowitem.html");
    }
});
