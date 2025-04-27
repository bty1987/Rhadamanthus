jQuery(function($) {

    var brandInstall = {

        btns: {
            saveItemBtn: com.focusPage("#saveItemBtn"),
        },

        modals: {
            addBrandInstallModal: com.focusPage("#addBrandInstallModal")
        },
        items: {
            bid: com.focusPage('#bid', "#addBrandInstallModal"),
            constructionNode: com.focusPage("#constructionNode", "#addBrandInstallModal"),
            name: com.focusPage("#name", "#addBrandInstallModal"),
            workNum: com.focusPage("#workNum", "#addBrandInstallModal"),
            comment: com.focusPage("#comment", "#addBrandInstallModal")
        },

        editFlag: false,
        biid: null,
        bid: params.data.brand.bid,
        status: ["启用", "禁用"],
    };

    var searcher = new Searcher();

    var linebtns = [{
        name: "编辑",
        clazz: "btn-yellow",
        handle: function(v) {

            brandInstall.editFlag = true;

            brandInstall.biid = v.biid;
            brandInstall.items.name.val(v.name);
            brandInstall.items.workNum.val(v.workNum);
            brandInstall.items.comment.val(v.comment);
            brandInstall.items.constructionNode.val(v.constructionNode);

            brandInstall.modals.addBrandInstallModal.modal("show");
            return false;
        }
    }, {
        name: "删除",
        clazz: "btn-danger",
        handle: function(v) {

            com.post(api.data.deleteBrandInstall, {
                "brandInstall.biid": v.biid
            }, function(res) {

                com.showAlert(com.info, "操作成功");
                searcher.doSearch();
            });
        }
    }];

    searcher.set("condList", "pagenationBrandInstall", "resultLists", api.data.queryBrandInstall, {
        "brandInstall.brand.bid": brandInstall.bid
    }, null, null, "brandInstalls", true);

    searcher.button([{
        id: "addBrandInstall",
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
        fieId: "constructionNode.name",
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
        dataset: brandInstall.status
    }];

    com.post(api.data.queryConstructionNode, {}, function(res) {

        brandInstall.items.constructionNode.bindData(res.constructionNodes, "cnid", "name");
    });

    searcher.line("name", lineprops, linebtns).render();

    com.focusPage('#addBrandInstall', '#pagenationBrandInstall').on("click", function() {

        brandInstall.editFlag = false;

        brandInstall.modals.addBrandInstallModal.modal("show");

    });

    brandInstall.btns.saveItemBtn.click(function() {

        if (com.validate('addBrandInstallModal')) {
            return false;
        }

        var url = api.data.addBrandInstall;

        var options = {

            "brandInstall.brand.bid": brandInstall.bid,
            "brandInstall.constructionNode.cnid": brandInstall.items.constructionNode.val(),
            "brandInstall.name": brandInstall.items.name.val(),
            "brandInstall.workNum": brandInstall.items.workNum.val(),
            "brandInstall.comment": brandInstall.items.comment.val(),

        };

        if (brandInstall.editFlag) {
            options["brandInstall.biid"] = brandInstall.biid;
            url = api.data.updateBrandInstall;
        }

        com.post(url, options, function(e) {

            com.showAlert(com.info, "操作成功");
            searcher.doSearch();

            brandInstall.modals.addBrandInstallModal.modal("hide");
        });
    });
});