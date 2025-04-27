jQuery(function($) {

    var brandProduct = {

        btns: {
            saveItemBtn: com.focusPage("#saveItemBtn"),
        },

        modals: {
            addBrandProductModal: com.focusPage("#addBrandProductModal")
        },
        items: {
            bid: com.focusPage('#bid', "#addBrandProductModal"),
            constructionNode: com.focusPage("#constructionNode", "#addBrandProductModal"),
            name: com.focusPage("#name", "#addBrandProductModal"),
            workNum: com.focusPage("#workNum", "#addBrandProductModal"),
            comment: com.focusPage("#comment", "#addBrandProductModal")
        },

        editFlag: false,
        bpid: null,
        bid: params.data.brand.bid,
        status: ["启用", "禁用"],
    };

    com.post(api.data.queryConstructionNode, {}, function(res) {

        brandProduct.items.constructionNode.bindData(res.constructionNodes, "cnid", "name", true);
    });

    var searcher = new Searcher();

    var linebtns = [{
        name: "编辑",
        clazz: "btn-yellow",
        handle: function(v) {

            brandProduct.editFlag = true;

            brandProduct.bpid = v.bpid;
            brandProduct.items.name.val(v.name);
            brandProduct.items.workNum.val(v.workNum);
            brandProduct.items.comment.val(v.comment);
            brandProduct.items.constructionNode.val(v.constructionNode);

            brandProduct.modals.addBrandProductModal.modal("show");
            return false;
        }
    }, {
        name: "删除",
        clazz: "btn-danger",
        handle: function(v) {

            com.post(api.data.deleteBrandProduct, {
                "brandProduct.bpid": v.bpid
            }, function(res) {

                com.showAlert(com.info, "操作成功");
                searcher.doSearch();
            });
        }
    }];

    searcher.base("condList", "pagenationBrandProduct", "resultLists", api.data.queryBrandProduct);
    searcher.param({
        "brandProduct.brand.bid": brandProduct.bid
    });
    searcher.isPage(true);
    searcher.result("brandProducts");
    searcher.history("brandProductPostData");

    searcher.button([{
        id: "addBrandProduct",
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
        dataset: brandProduct.status
    }];

    searcher.line("name", lineprops, linebtns).render();

    com.focusPage('#addBrandProduct', '#pagenationBrandProduct').on("click", function() {

        brandProduct.editFlag = false;

        brandProduct.modals.addBrandProductModal.modal("show");

    });

    brandProduct.btns.saveItemBtn.click(function() {

        if (com.validate('addBrandProductModal')) {
            return false;
        }

        var url = api.data.addBrandProduct;

        var option = {

            "brandProduct.brand.bid": brandProduct.bid,
            "brandProduct.constructionNode.cnid": brandProduct.items.constructionNode.val(),
            "brandProduct.name": brandProduct.items.name.val(),
            "brandProduct.workNum": brandProduct.items.workNum.val(),
            "brandProduct.comment": brandProduct.items.comment.val(),
            "brandProduct.status": 0
        };

        if (brandProduct.editFlag) {
            option["brandProduct.bpid"] = brandProduct.bpid;
            url = api.data.updateBrandProduct;
        }

        com.post(url, option, function(e) {

            com.showAlert(com.info, "操作成功");
            searcher.doSearch();

            brandProduct.modals.addBrandProductModal.modal("hide");
        });
    });
});