jQuery(function($) {

    var productBrand = {

    	scbid: params.personel.scbid,
        btns: {

        },

        modals: {
        	addBrandProductModal: com.focusPage("#addBrandProductModal"),
        },

        items: {
        	ctype: com.focusPage("#ctype", "#addBrandProductModal"),
            cvalue: com.focusPage("#cvalue", "#addBrandProductModal"),
            breakpay: com.focusPage("#breakpay", "#addBrandProductModal"),
            scname: com.focusPage("#scname", "#addBrandProductModal"),
            warranTime: com.focusPage("#warranTime", "#addBrandProductModal"),
        },
        data: null,
    };

    productBrand.modals.addBrandProductModal.on('hide.bs.modal', function(e) {

        com.clearValidator();
        com.closeTip();
        com.cleanItems(productBrand.items);
    });

    var searcher = new Searcher();

    searcher.base("productCondList", "productCondList", "productPagenation", api.personel.querySupplierBrandProduct);

    searcher.param({
        "supplierBrandProduct.scbid": productBrand.scbid
    });

    searcher.result("supplierBrandProducts").isPage(true);

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
        dataset: constant.personel().supplierContractService.type.keys,
    }, {
        field: "cvalue",
        name: "结算值",
        prop: "cvalue",
        clazz: "grey",
    }, {
        field: "breakpay",
        name: "违约金",
        prop: "breakpay",
        clazz: "grey",
    }, {
        field: "warranTime",
        name: "质保期",
        prop: "warranTime",
        clazz: "grey",
    }];

    var linebtns = [ {
        name: "删除",
        clazz: "btn-danger",
        handle: function(v) {

            delBrandProduct(v.sbpid);

        },
    }];

    searcher.line("name", lineprops, linebtns).render();

    com.focusPage('#addBrandProduct').on("click", function() {

    	productBrand.modals.addBrandProductModal.modal("show");
    });

    productBrand.items.ctype.bindData(constant.personel().supplierContractBrand.ctype.datas, "key", "value");

    com.focusPage('#submitBtn', "#addBrandProductModal").on("click", function() {

        if (com.validate('addBrandProductModal')) {
            return false;
        }

        var options = {
            "supplierBrandProduct.scbid": productBrand.scbid,
            "supplierBrandProduct.ctype": productBrand.items.ctype.val(),
            "supplierBrandProduct.cvalue": productBrand.items.cvalue.val(),
            "supplierBrandProduct.breakpay": productBrand.items.breakpay.val(),
            "supplierBrandProduct.name": productBrand.items.scname.val(),
            "supplierBrandProduct.warranTime": productBrand.items.warranTime.val(),
        };

        com.post(api.personel.addSupplierBrandProduct, options, function(res) {

            com.showAlert(com.info, "操作成功");
            searcher.doSearch();
            productBrand.modals.addBrandProductModal.modal("hide");
        });
    });
    
    function delBrandProduct(sbpid) {

        var options = {
            "supplierBrandProduct.sbpid": sbpid
        };
        com.post(api.personel.deleteSupplierBrandProduct, options, function(res) {

            com.showAlert(com.info, "操作成功");

            searcher.doSearch();
        });

    }
});