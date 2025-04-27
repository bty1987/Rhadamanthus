jQuery(function($) {

    var brandDeliver = {

        btns: {
            saveItemBtn: com.focusPage("#saveItemBtn"),
        },

        modals: {
            addBrandDeliverModal: com.focusPage("#addBrandDeliverModal")
        },
        items: {
            bid: com.focusPage('#bid', "#addBrandDeliverModal"),
            constructionNode: com.focusPage("#constructionNode", "#addBrandDeliverModal"),
            name: com.focusPage("#name", "#addBrandDeliverModal"),
            workNum: com.focusPage("#workNum", "#addBrandDeliverModal"),
            comment: com.focusPage("#comment", "#addBrandDeliverModal")
        },

        editFlag: false,
        bdid: null,
        bid: params.data.brand.bid,
        status: ["启用", "禁用"],
    };

    var searcher = new Searcher();

    com.post(api.data.queryConstructionNode, {}, function(res) {

        brandDeliver.items.constructionNode.bindData(res.constructionNodes, "cnid", "name");
    });

    var linebtns = [{
        name: "编辑",
        clazz: "btn-yellow",
        handle: function(v) {

            brandDeliver.editFlag = true;

            brandDeliver.bdid = v.bdid;
            brandDeliver.items.name.val(v.name);
            brandDeliver.items.workNum.val(v.workNum);
            brandDeliver.items.comment.val(v.comment);
            brandDeliver.items.constructionNode.val(v.constructionNode);

            brandDeliver.modals.addBrandDeliverModal.modal("show");
            return false;
        }
    }, {
        name: "删除",
        clazz: "btn-danger",
        handle: function(v) {

            com.post(api.data.deleteBrandDeliver, {
                "brandDeliver.bdid": v.bdid
            }, function(res) {

                com.showAlert(com.info, "操作成功");
                searcher.doSearch();
            });
        }
    }];

    searcher.set("condList", "pagenationBrandDeliver", "resultLists", api.data.queryBrandDeliver, {
        "brandDeliver.brand.bid": brandDeliver.bid
    }, null, null, "brandDelivers", true);

    searcher.button([{
        id: "addBrandDeliver",
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
        dataset: brandDeliver.status
    }];

    searcher.line("name", lineprops, linebtns).render();

    com.focusPage('#addBrandDeliver', '#pagenationBrandDeliver').on("click", function() {

        brandDeliver.editFlag = false;

        brandDeliver.modals.addBrandDeliverModal.modal("show");

    });

    brandDeliver.btns.saveItemBtn.click(function() {

        if (com.validate('addBrandDeliverModal')) {
            return false;
        }

        var url = api.data.addBrandDeliver;

        var options = {

            "brandDeliver.brand.bid": brandDeliver.bid,
            "brandDeliver.constructionNode.cnid": brandDeliver.items.constructionNode.val(),
            "brandDeliver.name": brandDeliver.items.name.val(),
            "brandDeliver.workNum": brandDeliver.items.workNum.val(),
            "brandDeliver.comment": brandDeliver.items.comment.val(),

        };

        if (brandDeliver.editFlag) {
            options["brandDeliver.bdid"] = brandDeliver.bdid;
            url = api.data.updateBrandDeliver;
        }

        com.post(url, options, function(e) {

            com.showAlert(com.info, "操作成功");
            searcher.doSearch();

            brandDeliver.modals.addBrandDeliverModal.modal("hide");
        });
    });
});