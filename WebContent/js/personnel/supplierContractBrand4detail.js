jQuery(function($) {

    var productBrand = {

        btns: {

        },

        modals: {
            addBrandProductModal: com.focusPage("#addBrandProductModal"),
        },

        items: {
            warranty: com.focusPage("#warranty", "#addBrandProductModal"),
        },
        data: null,
        type: null,
        scid: params.scid,
    };

    productBrand.modals.addBrandProductModal.on('hide.bs.modal', function(e) {

        com.clearValidator();
        com.closeTip();
        com.cleanItems(productBrand.items);
    });

    var searcher = new Searcher();

    searcher.base("productCondList", "productCondList", "productPagenation", api.personel.querySupplierContractProduct);

    searcher.param({
        "supplierContractProduct.scid": productBrand.scid
    });

    searcher.result("supplierContractProducts").isPage(true);

    var lineprops = [{
        field: "category",
        name: "品类",
        prop: "category",
        clazz: "grey",
    }, {
        field: "brand",
        name: "品牌",
        prop: "brand",
        clazz: "grey",
    }, {
        field: "name",
        name: "名称",
        prop: "name",
        clazz: "grey",
    }, {
        field: "warranTime",
        name: "质保期",
        prop: "warranTime",
        clazz: "grey",
    }];

    var linebtns = [{
        name: "删除",
        clazz: "btn-danger",
        handle: function(v) {

            delBrandProduct(v.scpid);

        },
    }];

    searcher.line("name", lineprops, linebtns).render();

    com.focusPage('#addBrandProduct').on("click", function() {

        productBrand.modals.addBrandProductModal.modal("show");
    });

    com.focusPage('#submitBtn', "#addBrandProductModal").on("click", function() {

        if (com.validate('addBrandProductModal')) {
            return false;
        }

        var products = productBrand.items.warranty.val();
        var lines = products.split(/\r?\n/);

        var supplierContractProduct = {};
        var validData = true;

        $.each(lines, function(index, item) {

            var item = item.trim();

            var parts = item.split(/[，,\t '']+/);

            if (parts.length != 4) {
                com.showAlert(com.warning, "第" + (index + 1) + "行数据格式错误");
                validData = false;
                return false;
            }

            var category = parts[0].trim();
            var brand = parts[1].trim();
            var name = parts[2].trim();
            var warranTime = parts[3].trim();

            if (!category || !brand || !name || !warranTime) {
                com.showAlert(com.warning, "第" + (index + 1) + "行必填字段为空");
                validData = false;
                return false;
            }

            supplierContractProduct["supplierContractProducts[" + index + "].scid"] = productBrand.scid;
            supplierContractProduct["supplierContractProducts[" + index + "].category"] = category;
            supplierContractProduct["supplierContractProducts[" + index + "].name"] = name;
            supplierContractProduct["supplierContractProducts[" + index + "].warranTime"] = warranTime;
            supplierContractProduct["supplierContractProducts[" + index + "].brand"] = brand;
        });

        if (!validData)
            return false;
        
        com.post(api.personel.addSupplierContractProduct, supplierContractProduct, function(res) {

            com.showAlert(com.info, "操作成功");
            searcher.doSearch();
            productBrand.modals.addBrandProductModal.modal("hide");
        });
    });

    function delBrandProduct(scpid) {

        var options = {
            "supplierContractProduct.scpid": scpid
        };
        com.post(api.personel.deleteSupplierContractProduct, options, function(res) {

            com.showAlert(com.info, "操作成功");

            searcher.doSearch();
        });

    }

});