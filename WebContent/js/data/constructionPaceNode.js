$(function() {

    var constructionPaceNode = {

        btns: {
            saveBtn: com.focusPage("#saveBtn").on("click", saveData)
        },

        modals: {
            addConstructionPaceNodeModal: com.focusPage("#addConstructionPaceNodeModal")
        },

        items: {
            name: com.focusPage("#name", "#constructionPaceNode"),
            connum: com.focusPage("#connum", "#constructionPaceNode"),
            comnum: com.focusPage("#comnum", "#constructionPaceNode"),
            content: com.focusPage("#content", "#constructionPaceNode"),
            comment: com.focusPage("#comment", "#constructionPaceNode"),
            phase: com.focusPage("#phase", "#constructionPaceNode"),
            material: com.focusPage("#material", "#constructionPaceNode"),
            period: com.focusPage("#period", "#constructionPaceNode")
        },

        status: constant.data().constructionPaceNode.status.keys,
        currentCpid: null
    };

    constructionPaceNode.modals.addConstructionPaceNodeModal.on("hide.bs.modal", function(a) {

        com.cleanItems(constructionPaceNode.items);
        com.clearValidator();

        constructionPaceNode.currentCpid = null;
    });

    var searcher = new Searcher();

    searcher.base("nodeCondList", "nodePagenation", "nodeResultList", api.data.pageConstructionPaceNode);

    searcher.button([{
        id: "addConstructionPaceNode",
        name: "添加",
        clazz: "btn-success",
        icon: "icon-plus"
    }]);

    searcher.history("constructionPaceNodePostData");

    var lineprops = [{
        fieId: "name",
        name: "名称",
        prop: "name",
        clazz: "grey"
    }, {
        fieId: "connum",
        name: "工程天数",
        prop: "connum",
        clazz: "blue"
    }, {
        fieId: "comnum",
        name: "主材天数",
        prop: "comnum",
        clazz: "blue"
    }, {
        fieId: "status",
        name: "状态",
        prop: "status",
        clazz: "red",
        dataset: constructionPaceNode.status
    }, {
        fieId: "phase",
        name: "施工节点",
        prop: "phase",
        clazz: "blue",
    }, {
        fieId: "material",
        name: "配套主材",
        prop: "material",
        clazz: "blue",
    }, {
        fieId: "period",
        name: "进场周期",
        prop: "period",
        clazz: "blue",
    }, {
        fieId: "content",
        name: "说明",
        prop: "content",
        clazz: "grey"
    }, {
        fieId: "comment",
        name: "注释",
        prop: "comment",
        clazz: "grey"
    }];

    var linebtns = [{
        name: "编辑",
        clazz: "btn-yellow",
        handle: function(v) {

            constructionPaceNode.currentCpid = v.cpid;

            constructionPaceNode.items.name.val(v.name);
            constructionPaceNode.items.connum.val(v.connum);
            constructionPaceNode.items.comnum.val(v.comnum);
            constructionPaceNode.items.content.val(v.content);
            constructionPaceNode.items.comment.val(v.comment);
            constructionPaceNode.items.phase.val(v.phase);
            constructionPaceNode.items.material.val(v.material);
            constructionPaceNode.items.period.val(v.period);

            constructionPaceNode.modals.addConstructionPaceNodeModal.modal("show");
            return false;
        }
    }, {
        name: "状态",
        type: "switch",
        clazz: "status-lbl",
        handle: function(v, check) {

            com.post(api.data.updateConstructionPaceNodeForStatus, {
                "constructionPaceNode.cpid": v.cpid,
                "constructionPaceNode.status": check ? 0 : 1
            }, function(res) {

                searcher.doSearch();
                return false;
            });
        },
        init: function(v) {

            return !v.status;
        }
    }];

    searcher.line("name", lineprops, linebtns).render();

    com.focusPage("#resultList").find("div.action-buttons").find("a.btn-yellow").hide();
    com.focusPage('#addCustype', '#nodePagenation').hide();

    com.focusPage('#addConstructionPaceNode', '#nodePagenation').on("click", function() {

        constructionPaceNode.modals.addConstructionPaceNodeModal.modal("show");
    });

    function saveData() {

        if (com.validate('addConstructionPaceNodeModal'))
            return false;

        var url = api.data.addConstructionPaceNode;
        var options = {
            "constructionPaceNode.name": constructionPaceNode.items.name.val(),
            "constructionPaceNode.connum": constructionPaceNode.items.connum.val(),
            "constructionPaceNode.comnum": constructionPaceNode.items.comnum.val(),
            "constructionPaceNode.content": constructionPaceNode.items.content.val(),
            "constructionPaceNode.comment": constructionPaceNode.items.comment.val(),
            "constructionPaceNode.phase": constructionPaceNode.items.phase.val(),
            "constructionPaceNode.material": constructionPaceNode.items.material.val(),
            "constructionPaceNode.period": constructionPaceNode.items.period.val()
        };

        if (constructionPaceNode.currentCpid != null) {
            url = api.data.updateConstructionPaceNode;
            options["constructionPaceNode.cpid"] = constructionPaceNode.currentCpid;
        }

        com.post(url, options, function() {

            searcher.doSearch();
            constructionPaceNode.modals.addConstructionPaceNodeModal.modal("hide");
        });
    }

});
