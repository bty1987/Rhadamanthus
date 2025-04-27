jQuery(function($) {

    var brandServer = {

        btns: {
            saveItemBtn: com.focusPage("#saveItemBtn"),
        },

        modals: {
            addBrandServerModal: com.focusPage("#addBrandServerModal")
        },
        items: {
            bid: com.focusPage('#bid', "#addBrandServerModal"),
            constructionNode: com.focusPage("#constructionNode", "#addBrandServerModal"),
            name: com.focusPage("#name", "#addBrandServerModal"),
            workNum: com.focusPage("#workNum", "#addBrandServerModal"),
            comment: com.focusPage("#comment", "#addBrandServerModal")
        },

        editFlag: false,
        bsid: null,
        bid: params.data.brand.bid,
        status: ["启用", "禁用"],
    };

    com.post(api.data.queryConstructionNode, {}, function(res) {

        brandServer.items.constructionNode.bindData(res.constructionNodes, "cnid", "name", true);
    });

    var searcher = new Searcher();

    var linebtns = [{
        name: "编辑",
        clazz: "btn-yellow",
        handle: function(v) {

            brandServer.editFlag = true;

            brandServer.bsid = v.bsid;
            brandServer.items.name.val(v.name);
            brandServer.items.workNum.val(v.workNum);
            brandServer.items.comment.val(v.comment);
            brandServer.items.constructionNode.val(v.constructionNode);

            brandServer.modals.addBrandServerModal.modal("show");
            return false;
        }
    }, {
        name: "删除",
        clazz: "btn-danger",
        handle: function(v) {

            com.post(api.data.deleteBrandServer, {
                "brandServer.bsid": v.bsid
            }, function(res) {

                com.showAlert(com.info, "操作成功");
                searcher.doSearch();
            });
        }
    }];

    searcher.base("condList", "pagenationBrandServer", "resultLists", api.data.queryBrandServer);
    searcher.param({
        "brandServer.brand.bid": brandServer.bid
    });
    searcher.isPage(true);
    searcher.result("brandServers");
    searcher.history("brandServerPostData");

    searcher.button([{
        id: "addBrandServer",
        name: "添加",
        clazz: "btn-yellow",
        icon: "icon-plus"
    }]);

    var lineprops = [{
        fieId: "name",
        name: "名称",
        prop: "name",
        clazz: "blue"
    }, {
        fieId: "constructionNode",
        name: "施工节点",
        prop: "constructionNode.name",
        clazz: "grey"
    }, {
        fieId: "workNum",
        name: "工期",
        prop: "workNum",
        clazz: "red"
    }, {
        fieId: "comment",
        name: "说明",
        prop: "comment",
        clazz: "green"
    }, {
        fieId: "status",
        name: "状态",
        prop: "status",
        clazz: "green",
        dataset: brandServer.status
    }];

    searcher.line("name", lineprops, linebtns).render();

    com.focusPage('#addBrandServer', '#pagenationBrandServer').on("click", function() {

        brandServer.editFlag = false;

        brandServer.modals.addBrandServerModal.modal("show");
    });

    brandServer.btns.saveItemBtn.click(function() {

        if (com.validate('addBrandServerModal')) {
            return false;
        }

        var url = api.data.addBrandServer;

        var option = {

            "brandServer.brand.bid": brandServer.bid,
            "brandServer.constructionNode.cnid": brandServer.items.constructionNode.val(),
            "brandServer.name": brandServer.items.name.val(),
            "brandServer.workNum": brandServer.items.workNum.val(),
            "brandServer.comment": brandServer.items.comment.val(),
            "brandServer.status": 0
        };

        if (brandServer.editFlag) {
            option["brandServer.bsid"] = brandServer.bsid;
            url = api.data.updateBrandServer;
        }

        com.post(url, option, function(e) {

            com.showAlert(com.info, "操作成功");
            searcher.doSearch();

            brandServer.modals.addBrandServerModal.modal("hide");
        });
    });
});