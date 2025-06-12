jQuery(function($) {

    var brandContract = {

        btns: {

        },

        modals: {
            addSupplierAddBrandModal: com.focusPage("#addSupplierAddBrandModal"),
            servicePriceModal: com.focusPage("#servicePriceModal"),
            addServicePriceModal: com.focusPage("#addServicePriceModal"),
        },

        items: {
            ctype: com.focusPage("#ctype", "#addSupplierAddBrandModal"),
            cvalue: com.focusPage("#cvalue", "#addSupplierAddBrandModal"),
            breakpay: com.focusPage("#breakpay", "#addSupplierAddBrandModal"),
            brandName: com.focusPage("#brandName", "#addSupplierAddBrandModal"),
            reportedDate: com.focusPage("#reportedDate"),
            maxAmount: com.focusPage("#maxAmount"),
            minAmount: com.focusPage("#minAmount"),
            serviceCharge: com.focusPage("#serviceCharge"),

        },
        bid: null,
        ucid: params.ucid,
        scid: params.scid,
        scbid: null,
        data: null,
    };

    var searcher = new Searcher();

    searcher.base("condList", "pagenation", "resultList", api.personel.pageSupplierContractBrand);
    searcher.history("supplierContractBrandPostData");
    searcher.param({
        "supplierContractBrand.scid": brandContract.scid
    });

    searcher.button([{
        id: "addBrandInfo",
        name: "添加",
        clazz: "btn btn-minier btn-primary pull-left",
        icon: "icon-plus bigger-110"
    }])

    var lineprops = [{
        field: "ctype",
        name: "结算类型",
        prop: "ctype",
        clazz: "grey",
        dataset: constant.sales().refunds.type.keys,
    }, {
        field: "cvalue",
        name: "结算值ֵ",
        prop: "cvalue",
        clazz: "red",
    }, {
        field: "breakpay",
        name: "违约金",
        prop: "breakpay",
        clazz: "red",
    }];

    var linebtns = [{
        name: "服务费",
        clazz: "btn-success",
        handle: function(v) {

            servicePrice(v);

            brandContract.modals.addServicePriceModal.modal("show");
        },
    }, {
        name: "删除",
        clazz: "btn-danger",
        handle: function(v) {

            remove(v.scbid);
        },
    }, ];

    searcher.line("brand.name", lineprops, linebtns).render();

    com.datetime(brandContract.items.reportedDate);

    brandContract.modals.addSupplierAddBrandModal.on('hide.bs.modal', function(e) {

        com.clearValidator();
        com.cleanTypeahead('brandName');
        com.closeTip();
        com.cleanItems(brandContract.items);
    });

    com.focusPage('#addBrandInfo', '#pagenation').on("click", function() {

        brandContract.modals.addSupplierAddBrandModal.modal("show");
    });

    com.initTypeahead('brandName', api.data.queryBrandByPinyin, "brand.pinyin", {
        "brand.atttype": 0
    }, 'brands', 'bid', 'name', function(list, k, v) {

        $.each(list, function(index, val) {

            if (val.bid == k) {
                brandContract.bid = val.bid;
                brandContract.items.brandName.val(val.name);
            }
        });

        return v;
    });

    com.focusPage("#ctype").bindData(constant.personel().supplierContractBrand.ctype.datas, "key", "value");

    com.focusPage('#submitBtn').on("click", function() {

        var options = {
            "supplierContractBrand.scid": brandContract.scid,
            "supplierContractBrand.ctype": brandContract.items.ctype.val(),
            "supplierContractBrand.cvalue": brandContract.items.cvalue.val(),
            "supplierContractBrand.breakpay": brandContract.items.breakpay.val(),
            "supplierContractBrand.brand.bid": brandContract.bid,
        };

        com.post(api.personel.addSupplierContractBrand, options, function(res) {

            brandContract.modals.addSupplierAddBrandModal.modal("hide");
            com.closePopup();
        });
    });

    com.focusPage('#servicePriceSubmitBtn').on("click", function() {

        if (com.validate('addServicePriceModal')) {
            return false;
        }

        var input_reportedDate = brandContract.items.reportedDate.val();
        var input_maxAmount = brandContract.items.maxAmount.val() == "" ? 0 : brandContract.items.maxAmount.val();
        var input_minAmount = brandContract.items.minAmount.val() == "" ? 0 : brandContract.items.minAmount.val();
        var input_serviceCharge = brandContract.items.serviceCharge.val() == "" ? 0 : brandContract.items.serviceCharge.val();

        var json = '{"TL": "' + input_reportedDate + '", "UV": ' + input_maxAmount + ', "DV": ' + input_minAmount + ', "SR": ' + input_serviceCharge + '}';

        var jsonArray = JSON.parse(brandContract.data);

        if (jsonArray === null) {
            jsonArray = []
        }

        jsonArray.push(JSON.parse(json));

        var updatedServicePrice = JSON.stringify(jsonArray);

        var options = {
            "supplierContractBrand.scbid": brandContract.scbid,
            "supplierContractBrand.servicePrice": updatedServicePrice,
        };

        com.post(api.personel.updateSupplierContractBrand, options, function(res) {

            servicePrice(res.supplierContractBrand);

            com.cleanItems(brandContract.items);

            searcher.doSearch();
        });
    });

    function remove(scbid) {

        var options = {
            "supplierContractBrand.scbid": scbid
        };

        com.post(api.personel.deleteSupplierContractBrand, options, function(res) {

            com.showAlert(com.info, "操作成功");

            searcher.doSearch();
        });
    }

    function servicePrice(v) {

        com.focusPage('#servicePriceList').empty();

        brandContract.scbid = v.scbid;

        if (!v.servicePrice || v.servicePrice.trim().length === 0) {

            com.focusPage('#servicePriceList').append('<div style="text-align: center;"><h2>没有服务费数据</h2></div>');
        } else {

            if (!brandContract.data || brandContract.data.trim().length === 0) {
                brandContract.data = v.servicePrice;
            }

            var data = JSON.parse(v.servicePrice);

            $.each(data, function(index, item) {

                var $div = $('<div class="form-group"></div>').attr("data-rate", JSON.stringify(item));
                var label1 = $('<label style="margin-right: 20px;">时间期限: ' + item.TL + '</label>').appendTo($div);

                if (item.UV == 0 && item.DV > 0) {
                    var label2 = $('<label style="margin-right: 20px;">销售总金额' + item.DV + '万元（含）以下 </label>').appendTo($div);
                }

                if (item.UV > 0 && item.DV > 0) {
                    var label3 = $('<label style="margin-right: 20px;">销售总金额' + item.DV + ' 万元-  ' + item.UV + '万元（含）</label>').appendTo($div);
                }

                if (item.UV > 0 && item.DV == 0) {
                    var label4 = $('<label style="margin-right: 20px;">销售总金额  ' + item.UV + '万元以上</label>').appendTo($div);
                }

                var label5 = $('<label style="margin-right: 20px;">超额服务费  ' + item.SR + '%</label>').appendTo($div);
                var delbtn = $('<a class="btn btn-minier btn-danger">删除</a>').appendTo($div);

                com.focusPage('#servicePriceList').append($div);

                delbtn.click(function() {

                    $div.remove(); // 从DOM中移除该行

                    data.splice(index, 1); // 从数据数组中删除对应项

                    var options = {
                        "supplierContractBrand.scbid": v.scbid,
                        "supplierContractBrand.servicePrice": JSON.stringify(data),
                    };

                    com.post(api.personel.updateSupplierContractBrand, options, function(res) {

                        brandContract.data = JSON.stringify(data);

                        searcher.doSearch();
                    });
                });
            });
        }
    }

});