jQuery(function($) {

    var productBrand = {

        scbid: params.personel.scbid,
        btns: {

        },

        modals: {
            addSupplierContractCategoryModal: com.focusPage("#addSupplierContractCategoryModal"),
        },

        items: {
            ctype: com.focusPage("#ctype", "#addSupplierContractCategoryModal"),
            type: com.focusPage("#type", "#addSupplierContractCategoryModal"),
            cvalue: com.focusPage("#cvalue", "#addSupplierContractCategoryModal"),
            scname: com.focusPage("#scname", "#addSupplierContractCategoryModal"),
        },
        data: null,
        type: null,
    };

    productBrand.modals.addSupplierContractCategoryModal.on('hide.bs.modal', function(e) {

        com.clearValidator();
        com.closeTip();
        com.cleanItems(productBrand.items);
    });

    var searcher = new Searcher();

    searcher.base("productCondList", "productCondList", "productPagenation", api.personel.querySupplierContractCategory);

    searcher.param({
        "supplierContractCategory.scbid": productBrand.scbid
    });

    searcher.result("supplierContractCategorys").isPage(true);

    var lineprops = [{
        field: "name",
        name: "名称",
        prop: "name",
        clazz: "grey",
    }, {
        field: "ctype",
        name: "结算类型",
        prop: "ctype",
        clazz: "grey",
        dataset: constant.personel().supplierContractBrandProduct.type.keys,
    }, {
        field: "cvalue",
        name: "结算值",
        prop: "cvalue",
        clazz: "grey",
    }];

    var linebtns = [{
        name: "删除",
        clazz: "btn-danger",
        handle: function(v) {

            delBrandProduct(v.sccid);
        },
    }];

    searcher.line("name", lineprops, linebtns).render();

    com.focusPage('#addBrandProduct').on("click", function() {

        com.focusPage('#fType').hide();
        productBrand.modals.addSupplierContractCategoryModal.modal("show");
    });

    productBrand.items.ctype.bindData(constant.personel().supplierContractBrand.ctype.datas, "key", "value");

    com.focusPage('#submitBtn', "#addSupplierContractCategoryModal").on("click", function() {

        if (com.validate('addSupplierContractCategoryModal')) {
            return false;
        }

        if (productBrand.items.ctype.val() === '1') {
            productBrand.type = productBrand.items.type.val();
        } else {
            productBrand.type = productBrand.items.ctype.val();
        }

        var options = {
            "supplierContractCategory.scbid": productBrand.scbid,
            "supplierContractCategory.ctype": productBrand.type,
            "supplierContractCategory.cvalue": productBrand.items.cvalue.val(),
            "supplierContractCategory.name": productBrand.items.scname.val(),
        };

        com.post(api.personel.addSupplierContractCategory, options, function(res) {

            com.showAlert(com.info, "操作成功");
            searcher.doSearch();
            productBrand.modals.addSupplierContractCategoryModal.modal("hide");
        });
    });

    function delBrandProduct(sccid) {

        var options = {
            "supplierContractCategory.sccid": sccid
        };

        com.post(api.personel.deleteSupplierContractCategory, options, function(res) {

            com.showAlert(com.info, "操作成功");

            searcher.doSearch();
        });
    }

    productBrand.items.ctype.on('change', function() {

        if (productBrand.items.ctype.val() === '1') {
            com.focusPage('#fType').show();
            productBrand.items.type.bindData(constant.personel().supplierContractService.type.datas, "key", "value");
        } else {
            com.focusPage('#fType').hide();
        }
        searcher.doSearch();
    });

});