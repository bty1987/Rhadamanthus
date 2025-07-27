jQuery(function($) {

    var periodNode = {

        btns: {
            saveBtn: com.focusPage("#saveBtn", "#addPeriodNodeModal")
        },

        modals: {
            addPeriodNodeModal: com.focusPage("#addPeriodNodeModal"),
        },

        items: {

            name: com.focusPage("#dname", "#addPeriodNodeModal"),
            nodes: com.focusPage("#nodes", "#addPeriodNodeModal"),
            period: com.focusPage("#period", "#addPeriodNodeModal"),
        }
    };

    var searcher = new Searcher();

    searcher.base("periodnodeCondLists", "periodnodePagenations", "periodnodeResultLists", api.data.queryConstructionPeriodNodeByCpid);
    searcher.isPage(true).result("constructionPeriodNodes");
    searcher.param({
        "constructionPeriodNode.cpid": params.data.constructionPeriod.cpid
    });

    searcher.button([{
        id: "createPeriodNode",
        name: "创建",
        clazz: "btn-yellow",
        icon: "icon-plus"
    }]);

    var lineprops = [{
        field: "name",
        name: "名称",
        prop: "name",
        clazz: "grey"
    }, {
        field: "constructionNode",
        name: "节点",
        prop: "constructionNode.name",
        clazz: "grey"
    }, {
        field: "period",
        name: "工期",
        prop: "period",
        clazz: "blue",
    }];

    var linebtns = [{
        name: "删除",
        clazz: "btn-yellow",
        handle: function(v) {

            com.post(api.data.deleteConstructionPeriodNodeByCpnid, {
                "constructionPeriodNode.cpnid": v.cpnid
            }, function() {

                com.showAlert(com.info, "删除成功");
                searcher.doSearch();
            });

            return false;
        }
    }];

    searcher.line("constructionNode.name", lineprops, linebtns).render();

    com.focusPage('#createPeriodNode').click(function() {

        periodNode.modals.addPeriodNodeModal.modal("show");
    });

    com.post(api.data.queryConstructionNode, {}, function(res) {

        periodNode.items.nodes.bindData(res.constructionNodes, "cnid", "name");
    });

    periodNode.btns.saveBtn.bindClick(saveData);
    periodNode.modals.addPeriodNodeModal.on("hide.bs.modal", function() {

        com.cleanItems(periodNode.items);
        com.clearValidator();
        com.closeTip();
    });

    function saveData() {

        if (com.validate('addPeriodNodeModal')) {
            return false;
        }

        var options = {
            'constructionPeriodNode.name': periodNode.items.name.val(),
            "constructionPeriodNode.cpid": params.data.constructionPeriod.cpid,
            "constructionPeriodNode.constructionNode.cnid": periodNode.items.nodes.val(),
            "constructionPeriodNode.period": periodNode.items.period.val()
        };
        com.post(api.data.addConstructionPeriodNode, options, function(res) {

            com.showAlert(com.info, "操作成功");
            searcher.doSearch();
            
            periodNode.modals.addPeriodNodeModal.modal("hide");
        });
        
    }
});
