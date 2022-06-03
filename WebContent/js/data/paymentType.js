jQuery(function ($) {

    var paymentType = {
        modals: {
            paymentTypeModal: com.focusPage("#paymentTypeModal")
        },
        btns: {
            saveBtn: com.focusPage("#saveBtn").on("click", saveData)
        },
        items:{
            name: com.focusPage("#name"),
            type: com.focusPage("#type"),
            paytype: com.focusPage("#paytype"),
            bustype: com.focusPage("#bustype"),
            atttype: com.focusPage("#atttype"),
            code: com.focusPage("#code"),
            taxrate: com.focusPage("#taxrate"),
            kino: com.focusPage("#kino"),
            kiname: com.focusPage("#kiname"),
            kibalance: com.focusPage("#kibalance"),
            billType: com.focusPage("#billType")
        },
        taxrate: [3, 6, 9],
        atttype_advance: {},
        atttype_decoration: {},
        atttype_material: {},
        atttype_sales: {},
        code_material: {},
        code_sales: {},
        types: {},
        paytypes: {},
        bustypes: {},
        atttypes_advance: {},
        atttypes_decoration: {},
        atttypes_material: {},
        atttypes_sales: {},
        codes_material: {},
        codes_sales: {},
        status: {},
        ptid: null,
        editFlg: true
    };

    paymentType.modals.paymentTypeModal.on('hide.bs.modal', function (e) {
        com.closeTip();
        com.clearValidator();
        com.cleanItems(paymentType.items);
    });

    paymentType.items.taxrate.bindData(paymentType.taxrate, "", "", true);

    com.post(api.ds.data, {}, function (res) {
        paymentType.atttype_advance = res.atttype_advance;
        paymentType.atttype_decoration = res.atttype_decoration;
        paymentType.atttype_material = res.atttype_material;
        paymentType.atttype_sales = res.atttype_sales;
        paymentType.code_material = res.code_material;
        paymentType.code_sales = res.code_sales;

        $.each(res.paymentType, function(i, v){
            paymentType.types[v.key] = v.value;
        });
        $.each(res.paytype, function(i, v){
            paymentType.paytypes[v.key] = v.value;
        });
        $.each(res.bustype, function(i, v){
            paymentType.bustypes[v.key] = v.value;
        });
        $.each(res.atttype_advance, function(i, v){
            paymentType.atttypes_advance[v.key] = v.value;
        });
        $.each(res.atttype_decoration, function(i, v){
            paymentType.atttypes_decoration[v.key] = v.value;
        });
        $.each(res.atttype_material, function(i, v){
            paymentType.atttypes_material[v.key] = v.value;
        });
        $.each(res.atttype_sales, function(i, v){
            paymentType.atttypes_sales[v.key] = v.value;
        });
        $.each(res.paymentTypeStatus, function(i, v){
            paymentType.status[v.key] = v.value;
        });
        $.each(res.code_material, function(i, v){
            paymentType.codes_material[v.key] = v.value;
        });
        $.each(res.code_sales, function(i, v){
            paymentType.codes_sales[v.key] = v.value;
        });

        paymentType.items.type.bindData(res.paymentType, "key", "value");
        paymentType.items.paytype.bindData(res.paytype, "key", "value");
        paymentType.items.bustype.bindData(res.bustype, "key", "value");
        paymentType.items.atttype.bindData(res.atttype_advance, "key", "value");
    });

    paymentType.items.type.on("change", function(){
        var typeVal =  paymentType.items.type.val();

        switch(typeVal) {
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

    var lineprops = [
        {fieId:"type",name: "类型", prop: "type", dataset: paymentType.types, clazz:"red"},
        {fieId:"paytype",name: "付款类型", prop: "paytype", dataset: paymentType.paytypes,clazz:"red"},
        {fieId:"bustype",name: "业务类型", prop: "bustype", dataset: paymentType.bustypes,clazz:"grey"},
        {fieId:"atttype", name: "属性类型", prop: function(v){

            switch(v.type) {
                case 0:
                    return paymentType.atttypes_advance[v.atttype];
                    break;
                case 1:
                    return paymentType.atttypes_decoration[v.atttype];
                    break;
                case 2:
                    return paymentType.atttypes_material[v.atttype];
                    break;
                case 3:
                    return paymentType.atttypes_sales[v.atttype];
                    break;
                case 4:
                    return "";
                    break;
            }
        }, clazz: "red"},
        {fieId:"code", name: "索引", prop: function(v){

            switch(v.type) {
                case 2:
                    return paymentType.codes_material[v.code];
                    break;
                case 3:
                    return paymentType.codes_sales[v.code];
                    break;
                default:
                    return "";
                    break;
            }
        }, clazz: "blue"},
        {fieId:"taxrate", name: "税率", prop: "taxrate", clazz: "blue"},
        {fieId:"kino", name: "金蝶编号", prop: "kino", clazz: "blue"},
        {fieId:"kiname", name: "金蝶名称", prop: "kiname", clazz: "grey"},
        {fieId:"kibalance", name: "费用项目编码", prop: "kibalance", clazz: "blue"},
        {fieId:"billType", name: "单据名称", prop: "billType", clazz: "grey", show: function(v){
            return v.billType = com.checkNull(v.billType, "无");
        }},
        {fieId:"status", name: "状态", prop: "status", dataset: paymentType.status, clazz: "red"}
    ];
    var linebtns = [
        {name: "更新", clazz: "btn-yellow", handle: function(v){
            paymentType.ptid = v.ptid;
            paymentType.items.taxrate.val(v.taxrate == 0 ? "" : v.taxrate);
            paymentType.items.kino.val(v.kino);
            paymentType.items.kiname.val(v.kiname);
            paymentType.items.kibalance.val(v.kibalance);
            paymentType.items.billType.val(v.billType == "无" ? "" : v.billType);
            com.focusPage("#saveInfo").css("display", "none");
            paymentType.editFlg = false;
            paymentType.modals.paymentTypeModal.modal("show");

            return false;
        }},{name: "状态", type: "switch", clazz: "status-lbl", handle: function(v, check){
            com.post(api.data.updatePaymentTypeForStatus, {"paymentType.ptid": v.ptid, "paymentType.status": check ? 0 : 1}, function(res){
                searcher.doSearch();
                return false;
            });
        }, init: function(v){
            return !v.status;
        }}

    ];

    searcher.button([{id: "add", name: "添加", clazz: "btn-success", icon: "icon-plus bigger-110"}]);

    searcher.line("name", lineprops, linebtns).render();

    com.focusPage("#add").click(function(){
        paymentType.editFlg = true;
        com.focusPage("#saveInfo").css("display", "block");
        paymentType.modals.paymentTypeModal.modal("show");
    });

    function saveData() {
        if (com.validate('paymentTypeModal')) return false;

        var url;
        var options = {
            "paymentType.taxrate": paymentType.items.taxrate.val() == "" ? 0 : paymentType.items.taxrate.val(),
            "paymentType.kino": paymentType.items.kino.val(),
            "paymentType.kiname": paymentType.items.kiname.val(),
            "paymentType.kibalance": paymentType.items.kibalance.val(),
            "paymentType.billType": paymentType.items.billType.val().replace(/\s+/g, "")
        };

        if (paymentType.editFlg) {
            url = api.data.addPaymentType;
            options["paymentType.name"] = paymentType.items.name.val();
            options["paymentType.type"] = paymentType.items.type.val();
            options["paymentType.paytype"] = paymentType.items.paytype.val();
            options["paymentType.bustype"] = paymentType.items.bustype.val();
            options["paymentType.atttype"] = paymentType.items.atttype.val();
            options["paymentType.code"] = paymentType.items.code.val();
        } else {
            url = api.data.updatePaymentType;
            options["paymentType.ptid"] = paymentType.ptid;
        }

        com.post(url, options, function (res) {
            searcher.doSearch();
        });

        paymentType.modals.paymentTypeModal.modal("hide");
    }

});
