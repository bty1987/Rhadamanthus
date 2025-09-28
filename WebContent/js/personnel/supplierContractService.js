jQuery(function($) {

    var serviceContract = {

        uid: params.personel.uid,
        btns: {
            createSupplierServiceBtn: com.focusPage("#addBtn"),
        },

        modals: {
            addServicePriceModal: com.focusPage("#addServicePriceModal"),

        },

        items: {
            startDate: com.focusPage("#startDate", "#addServicePriceModal"),
            reportedDate: com.focusPage("#reportedDate", "#addServicePriceModal"),
            maxAmount: com.focusPage("#maxAmount", "#addServicePriceModal"),
            minAmount: com.focusPage("#minAmount", "#addServicePriceModal"),
            serviceCharge: com.focusPage("#serviceCharge", "#addServicePriceModal"),
            name: com.focusPage("#name", "#addServicePriceModal"),
        },
        data: null,
    };

    var searcher = new Searcher();

    searcher.base("serviceCondList", "serviceCondList", "servicePagenation", api.personel.querySupplierContractServiceBySid);

    searcher.param({
        "supplierContractServiceVO.sid": serviceContract.uid
    });

    searcher.result("supplierContractServices").isPage(true);

    com.datetime(serviceContract.items.startDate);
    com.datetime(serviceContract.items.reportedDate);

    var lineprops = [{
        field: "name",
        name: "名称",
        prop: "name",
        clazz: "grey",
    }, {
        field: "servicePrice",
        name: "服务费",
        prop: function(v) {

            var reses = "";
            var services = JSON.parse(v.servicePrice);

            $.each(services, function(index, v) {

                reses += "有效期:&nbsp" + v.TL + "&nbsp;&nbsp;&nbsp;&nbsp;";
                reses += "销售总金额:&nbsp" + v.UV + "-" + v.DV + "(含)" + "&nbsp;&nbsp;&nbsp;&nbsp;";
                reses += "超额服务费:&nbsp" + v.SR + "%";
                reses += "<br />";
            });
            return reses;
        },
        clazz: "grey",
    }, ];

    serviceContract.btns.createSupplierServiceBtn.on("click", function() {

        serviceContract.modals.addServicePriceModal.modal("show");
    });

    com.focusPage('#servicePriceSubmitBtn').on("click", function() {

        if (com.validate('addServicePriceModal')) {
            return false;
        }

        var input_startDate = serviceContract.items.startDate.val();
        var input_reportedDate = serviceContract.items.reportedDate.val();
        var input_maxAmount = serviceContract.items.maxAmount.val() == "" ? 0 : serviceContract.items.maxAmount.val();
        var input_minAmount = serviceContract.items.minAmount.val() == "" ? 0 : serviceContract.items.minAmount.val();
        var input_serviceCharge = serviceContract.items.serviceCharge.val() == "" ? 0 : serviceContract.items.serviceCharge.val();
        var input_name = serviceContract.items.name.val();
        var json = '{"TL": "' + input_startDate + " - " + input_reportedDate + '", "UV": ' + input_maxAmount + ', "DV": ' + input_minAmount + ', "SR": ' + input_serviceCharge + '}';

        var jsonArray = JSON.parse(serviceContract.data);

        if (jsonArray === null) {
            jsonArray = []
        }

        jsonArray.push(JSON.parse(json));

        var updatedServicePrice = JSON.stringify(jsonArray);

        var options = {
            "supplierContractServiceVO.sid": serviceContract.uid,
            "supplierContractServiceVO.name": input_name,
            "supplierContractServiceVO.servicePrice": updatedServicePrice,
        };

        com.post(api.personel.addSupplierContractService, options, function(res) {

            com.cleanItems(serviceContract.items);

            serviceContract.modals.addServicePriceModal.modal("hide");

            searcher.doSearch();
        });
    });

    var linebtns = [{
        name: "删除",
        clazz: "btn-danger",
        handle: function(v) {

            remove(v.scsid);
        },
    }, ];

    searcher.line("name", lineprops, linebtns).render();

    function remove(scsid) {

        var options = {
            "supplierContractServiceVO.scsid": scsid
        };

        com.post(api.personel.deleteSupplierContractService, options, function(res) {

            com.showAlert(com.info, "操作成功");

            searcher.doSearch();
        });
    }
});