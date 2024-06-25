jQuery(function($) {

    var paymentType = {
        modals: {
            paymentTypeModal: com.focusPage("#paymentTypeModal")
        },
        btns: {
            saveBtn: com.focusPage("#saveBtn").on("click", saveData)
        },
        items: {
            name: com.focusPage("#name"),
            type: com.focusPage("#type"),
            paytype: com.focusPage("#paytype"),
            bustype: com.focusPage("#bustype"),
            atttype: com.focusPage("#atttype"),
            payScale: com.focusPage("#payScale"),
            saleScale: com.focusPage("#saleScale"),
            code: com.focusPage("#code"),
            taxrate: com.focusPage("#taxrate"),
            kino: com.focusPage("#kino"),
            kiname: com.focusPage("#kiname"),
            kibalance: com.focusPage("#kibalance"),
            billType: com.focusPage("#billType"),

            saveInfo: com.focusPage("#saveInfo"),
        },
        taxrate: [3, 6, 9],

        atttype_advance: {},
        atttype_decoration: {},
        atttype_material: {},
        atttype_sales: {},
        atttype_service: {},

        code_material: {},
        code_sales: {},

        ptid: null,

        pageType: params.urlLoadParams.type,
    };

    paymentType.modals.paymentTypeModal.on('hide.bs.modal', function(e) {

        com.closeTip();
        com.clearValidator();
        com.cleanItems(paymentType.items);
    });

    paymentType.items.taxrate.bindData(paymentType.taxrate, "", "", true);

    $.each(constant.data.paymentType.atttype.datas, function(i, v) {

        var type = v.key.split('-')[0];
        var atttype = v.key.split('-')[1];

        if (type == "0")
            paymentType.atttype_advance[atttype] = v.value;
        if (type == "1")
            paymentType.atttype_decoration[atttype] = v.value;
        if (type == "2")
            paymentType.atttype_material[atttype] = v.value;
        if (type == "3")
            paymentType.atttype_sales[atttype] = v.value;
        if (type == "4")
            paymentType.atttype_service[atttype] = v.value;
    });

    $.each(constant.data.paymentType.code.datas, function(i, v) {

        var type = v.key.split('+')[0];
        var code = v.key.split('+')[1];

        if (type == "2")
            paymentType.code_material[code] = v.value;
        if (type == "3")
            paymentType.code_sales[code] = v.value;
    });

    paymentType.items.type.on("change", function() {

        switch (paymentType.items.type.val()) {
            case "0":
                paymentType.items.atttype.bindData(paymentType.atttype_advance, "key", "value");
                paymentType.items.code.bindData({}, "", "");
                break;
            case "1":
                paymentType.items.atttype.bindData(paymentType.atttype_decoration, "key", "value");
                paymentType.items.code.bindData({}, "", "");
                break;
            case "2":
                paymentType.items.atttype.bindData(paymentType.atttype_material, "key", "value");
                paymentType.items.code.bindData(paymentType.code_material, "key", "value");
                break;
            case "3":
                paymentType.items.atttype.bindData(paymentType.atttype_sales, "key", "value");
                paymentType.items.code.bindData(paymentType.code_sales, "key", "value");
                break;
            case "4":
                paymentType.items.atttype.bindData({}, "", "");
                paymentType.items.code.bindData({}, "", "");
                break;
        }

    });

    var searcher = new Searcher();

    searcher.base("condList", "pagenation", "resultList", api.data.pagePaymentType);

    searcher.condition(["data-paymentType-name", "data-paymentType-type", "data-paymentType-paytype", "data-paymentType-status"]);

    searcher.history("paymentTypePostData");

    var lineprops = [{
        fieId: "type",
        name: "类型",
        prop: "type",
        dataset: constant.data.paymentType.type.keys,
        clazz: "red"
    }, {
        fieId: "paytype",
        name: "付款类型",
        prop: "paytype",
        dataset: constant.data.paymentType.paytype.keys,
        clazz: "red"
    }, {
        fieId: "bustype",
        name: "业务类型",
        prop: "bustype",
        dataset: constant.data.paymentType.bustype.keys,
        clazz: "grey"
    }, {
        fieId: "atttype",
        name: "属性类型",
        prop: function(v) {

            return constant.data.paymentType.atttype.keys[v.type + "-" + v.atttype];
        },
        clazz: "red"
    }, {
        fieId: "payScale",
        name: "付款比例",
        prop: "payScale",
        clazz: "blue"
    }, {
        fieId: "saleScale",
        name: "销售比例",
        prop: "saleScale",
        clazz: "blue"
    }, {
        fieId: "code",
        name: "索引",
        prop: function(v) {

            return constant.data.paymentType.code.keys[v.type + "-" + v.code];
        },
        clazz: "blue"
    }, {
        fieId: "taxrate",
        name: "税率",
        prop: "taxrate",
        clazz: "blue"
    }, {
        fieId: "kino",
        name: "金蝶编号",
        prop: "kino",
        clazz: "blue"
    }, {
        fieId: "kiname",
        name: "金蝶名称",
        prop: "kiname",
        clazz: "grey"
    }, {
        fieId: "kibalance",
        name: "费用项目编码",
        prop: "kibalance",
        clazz: "blue"
    }, {
        fieId: "billType",
        name: "单据名称",
        prop: "billType",
        clazz: "grey",
        show: function(v) {

            return v.billType = com.checkNull(v.billType, "无");
        }
    }, {
        fieId: "status",
        name: "状态",
        prop: "status",
        dataset: constant.data.paymentType.status.keys,
        clazz: "red"
    }];
    var linebtns = [{
        name: "更新",
        clazz: "btn-yellow",
        handle: function(v) {

            paymentType.ptid = v.ptid;
            paymentType.items.payScale.val(v.payScale);
            paymentType.items.saleScale.val(v.saleScale);
            paymentType.items.taxrate.val(v.taxrate == 0 ? "" : v.taxrate);
            paymentType.items.kino.val(v.kino);
            paymentType.items.kiname.val(v.kiname);
            paymentType.items.kibalance.val(v.kibalance);
            paymentType.items.billType.val(v.billType == "无" ? "" : v.billType);

            paymentType.items.saveInfo.css("display", "none");

            paymentType.modals.paymentTypeModal.modal("show");

            return false;
        },
        show: function(v) {

            return paymentType.pageType == "common";
        }
    }, {
        name: "状态",
        type: "switch",
        clazz: "status-lbl",
        handle: function(v, check) {

            com.post(api.data.updatePaymentTypeForStatus, {
                "paymentType.ptid": v.ptid,
                "paymentType.status": check ? 0 : 1
            }, function(res) {

                searcher.doSearch();
                return false;
            });
        },
        init: function(v) {

            return !v.status;
        }
    }];

    if (paymentType.pageType == "common") {
        searcher.button([{
            id: "add",
            name: "添加",
            clazz: "btn-success",
            icon: "icon-plus bigger-110"
        }]);
    }

    searcher.line("name", lineprops, linebtns).render();

    com.focusPage("#add").click(function() {

        paymentType.ptid = null;

        paymentType.items.saveInfo.css("display", "block");

        paymentType.modals.paymentTypeModal.modal("show");
    });

    function saveData() {

        if (com.validate('paymentTypeModal'))
            return false;

        var url = api.data.updatePaymentType;
        var options = {
            "paymentType.payScale": paymentType.items.payScale.val(),
            "paymentType.saleScale": paymentType.items.saleScale.val(),
            "paymentType.taxrate": paymentType.items.taxrate.val() == "" ? 0 : paymentType.items.taxrate.val(),
            "paymentType.kino": paymentType.items.kino.val(),
            "paymentType.kiname": paymentType.items.kiname.val(),
            "paymentType.kibalance": paymentType.items.kibalance.val(),
            "paymentType.billType": paymentType.items.billType.val().replace(/\s+/g, "")
        };

        if (paymentType.ptid) {
            url = api.data.updatePaymentType;
            options["paymentType.ptid"] = paymentType.ptid;
        } else {
            url = api.data.addPaymentType;
            options["paymentType.name"] = paymentType.items.name.val();
            options["paymentType.type"] = paymentType.items.type.val();
            options["paymentType.paytype"] = paymentType.items.paytype.val();
            options["paymentType.bustype"] = paymentType.items.bustype.val();
            options["paymentType.atttype"] = paymentType.items.atttype.val();
            options["paymentType.code"] = paymentType.items.code.val();
        }

        com.post(url, options, function(res) {

            searcher.doSearch();

            paymentType.modals.paymentTypeModal.modal("hide");
        });
    }

});
