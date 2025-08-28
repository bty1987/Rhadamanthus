jQuery(function($) {

    var brandContract = {

        uid: params.personel.uid,

        btns: {

        },

        modals: {
            addSupplierAddBrandModal: com.focusPage("#addSupplierAddBrandModal"),
            servicePriceModal: com.focusPage("#servicePriceModal"),
            addServicePriceModal: com.focusPage("#addServicePriceModal"),
        },

        items: {

            brandName: com.focusPage("#brandName", "#addSupplierAddBrandModal"),
            startDate: com.focusPage("#startDate"),
            reportedDate: com.focusPage("#reportedDate"),
            maxAmount: com.focusPage("#maxAmount"),
            minAmount: com.focusPage("#minAmount"),
            serviceCharge: com.focusPage("#serviceCharge"),

        },
        bid: null,
        ucid: params.ucid,
        scid: params.scid,
        scsid: params.scsid,
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
    }, {
        id: "backBtn",
        name: "返回",
        clazz: "btn btn-minier btn-primary pull-left",
        icon: "icon-mail-forward bigger-110"
    }])

    var lineprops = [];

    var linebtns = [{
        name: "产品",
        clazz: "btn-success",
        handle: function(v) {

            params.personel.scbid = v.scbid;
            com.popup4page('#layerPopUp', "/views/personnel/supplierContractBrand4detail.html", "产品");

        },
    }, {
        name: "服务费",
        clazz: "btn-success",
        handle: function(v) {

            com.focusPage('#chooseHistory').empty();
            servicePrice(v, 0);

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

    com.focusPage('#submitBtn').on("click", function() {

        if (com.validate('addSupplierAddBrandModal')) {
            return false;
        }

        var options = {
            "supplierContractBrand.scid": brandContract.scid,
            "supplierContractBrand.brand.bid": brandContract.bid,
            "supplierContractBrand.sid": brandContract.uid,
        };

        com.post(api.personel.addSupplierContractBrand, options, function(res) {

            com.showAlert(com.info, "操作成功");
            searcher.doSearch();
            brandContract.modals.addSupplierAddBrandModal.modal("hide");
        });
    });

    com.focusPage('#servicePriceSubmitBtn').on("click", function() {

        if (com.validate('addServicePriceModal')) {
            return false;
        }

        var input_startDate = brandContract.items.startDate.val();
        var input_reportedDate = brandContract.items.reportedDate.val();
        var input_maxAmount = brandContract.items.maxAmount.val() == "" ? 0 : brandContract.items.maxAmount.val();
        var input_minAmount = brandContract.items.minAmount.val() == "" ? 0 : brandContract.items.minAmount.val();
        var input_serviceCharge = brandContract.items.serviceCharge.val() == "" ? 0 : brandContract.items.serviceCharge.val();

        var json = '{"TL": "' + input_startDate + " - " + input_reportedDate + '", "UV": ' + input_maxAmount + ', "DV": ' + input_minAmount + ', "SR": ' + input_serviceCharge + '}';

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

            servicePrice(res.supplierContractBrand, 1);

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

    com.focusPage('#backBtn', '#pagenation').on("click", function() {

        params.historyPage = "/views/personnel/supplierContract.html";
        com.switchPage(params.historyPage);
    });

    function servicePrice(v, value) {

        com.focusPage('#servicePriceList').empty();
        com.cleanItems(brandContract.items);
        brandContract.scbid = v.scbid;

        brandContract.data = null;// 初始化其他调用残留数据

        var options = {
            "supplierContractServiceVO.sid": v.sid,
        };

        com.post(api.personel.querySupplierContractServiceBySid, options, function(res) {

            var jsonArray = new Array();

            $.each(res.supplierContractServices, function(index, item) {

                if (item.servicePrice && item.servicePrice.length > 0 && item.servicePrice != '[]') {

                    jsonArray = jsonArray.concat(JSON.parse(item.servicePrice));

                }
            });

            var select = com.focusPage('#chooseHistory');

            if (value == 0) {
                select.prepend($('<option></option>').val('').text('-- 请选择 --'));
            }

            $.each(jsonArray, function(index, item) {

                var svalue = "";
                if (item.UV == 0 && item.DV > 0) {
                    svalue = "销售总金额" + item.DV + "万元（含）以下";
                }

                if (item.UV > 0 && item.DV > 0) {
                    svalue = "销售总金额" + item.DV + " 万元-  " + item.UV + "万元（含）";
                }

                if (item.UV > 0 && item.DV == 0) {
                    svalue = "销售总金额  " + item.UV + "万元以上";
                }

                select.append($('<option></option>').val(JSON.stringify(item)).text(svalue));

            });
            searcher.doSearch();
        });

        com.focusPage('#chooseHistory').on("change", function() {

            com.cleanItems(brandContract.items);

            if ($(this).val()) {

                var selectedData = JSON.parse($(this).val());
                var dates = $.map(selectedData.TL.split(" - "), $.trim);

                brandContract.items.startDate.val(dates[0]);

                if (dates[1] != null) {
                    brandContract.items.reportedDate.val(dates[1]);
                }

                brandContract.items.maxAmount.val(selectedData.DV);
                brandContract.items.minAmount.val(selectedData.UV);
                brandContract.items.serviceCharge.val(selectedData.SR);
            }
        });

        if (!v.servicePrice || v.servicePrice.trim().length === 0 || v.servicePrice === "[]") {

            return false;

        }

        brandContract.data = v.servicePrice;

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

});