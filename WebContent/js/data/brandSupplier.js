jQuery(function ($) {

    var brandSupplier = {

        bid: params.data.brand.bid,

        btns: {
            saveBrandSupplier: com.focusPage("#saveBrandSupplier").on("click", saveData),
            addBrandSupplier: com.focusPage("#addBrandSupplier"),
        },
        modals: {
            brandSupplierModal: com.focusPage("#brandSupplierModal")
        },
        items: {
            supplier: com.focusPage('#supplier', "#brandSupplierModal"),
        },

    };
    brandSupplier.modals.brandSupplierModal.on("hide.bs.modal", function () {

        com.cleanItems(brandSupplier.items);
        com.cleanTypeahead('supplier');
        com.clearValidator();
        com.closeTip();
    });

    // com.initTypeahead('supplier', api.personel.queryUserByPinyin, "pinyinName", {
    //     "user.status": 0,
    //     "departmentType.name": ""
    // }, 'autoFillKeyValue', 'key', 'value', null);

    com.initTypeahead(brandSupplier.items.supplier, api.personel.querySupplierByPinyin, "supplier.pinYin", {
        "user.status": 0
    }, "suppliers", "userId", "userName", null);

    var searcher = new Searcher();

    searcher.base("bCondlist", "bPagenation", "list", api.communion.queryBrandSupplier);
    searcher.result("brandSuppliers").isPage(true);
    searcher.param({
        "brandSupplier.brand.bid": brandSupplier.bid
    });

    var lineprops = [{
        fieId: "currentName",
        name: "厂商名称",
        prop: "supplier.currentName",
        clazz: "grey"
    }, {
        fieId: "supplier.loginId",
        name: "登录名",
        prop: "supplier.loginId",
        clazz: "grey"
    }, {
        fieId: "supplier.isLogin",
        name: "登陆状态",
        prop: function (v) {
            return v.supplier.isLogin == "0" ? "禁用" : "启用";
        },
        clazz: "red"
    }];

    var linebtns = [{
        name: "删除",
        clazz: "btn-warning",
        handle: function (v) {

            com.post(api.communion.deleteBrandSupplier, {
                "brandSupplier.buid": v.buid
            }, function (res) {

                com.showAlert(com.info, "操作成功");

                searcher.doSearch();
            });
        }
    }];
    searcher.line("supplier.currentName", lineprops, linebtns).render();

    com.focusPage('#addBrandSupplier').on("click", function () {
        brandSupplier.modals.brandSupplierModal.modal("show");

    });

    function saveData() {

        if (com.validate('brandSupplierModal'))
            return false;

        var url = api.communion.addBrandSupplier;
        var options = {
            "brandSupplier.brand.bid": brandSupplier.bid,
            "brandSupplier.supplier.userId": com.typeahead(brandSupplier.items.supplier)
        };

        com.post(url, options, function (res) {

            com.showAlert(com.info, "操作成功");

            searcher.doSearch();

            brandSupplier.modals.brandSupplierModal.modal("hide");
        });

    }
});
