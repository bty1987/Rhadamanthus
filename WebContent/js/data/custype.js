$(function() {

    var custype = {

        btns: {
            saveBtn: com.focusPage("#saveBtn").on("click", saveData)
        },

        modals: {
            addCustypeModal: com.focusPage("#addCustypeModal")
        },

        items: {
            name: com.focusPage("#name", "#custype"),
            no: com.focusPage("#no", "#custype"),
            agent: com.focusPage("#agent", "#custype"),
            phone: com.focusPage("#phone", "#custype"),
            wxapp: com.focusPage("#wxapp", "#custype"),
            atttype: com.focusPage("#atttype", "#custype"),
            platform: com.focusPage("#platform", "#custype"),
            receiptType: com.focusPage("#receiptType", "#custype"),
            dgrade: com.focusPage("#dgrade", "#custype"),
            sgrade: com.focusPage("#sgrade", "#custype")
        },

        currentCtid: null,
        status: constant.data().custype.status.keys,
        atttype: constant.payment().receipt.paymentType.keys,
        dgrade: constant.data().custype.dgrade.keys,
        sgrade: constant.data().custype.sgrade.keys,
        platforms: constant.data().custype.platform.keys
    };

    custype.items.atttype.bindData(constant.payment().receipt.paymentType.datas, "key", "value");
    custype.items.platform.bindData(constant.data().custype.platform.datas, "key", "value");
    custype.items.dgrade.bindData(constant.data().custype.dgrade.datas, "key", "value", true);
    custype.items.sgrade.bindData(constant.data().custype.sgrade.datas, "key", "value", true);

    com.post(api.data.queryReceiptType, {}, function(res) {

        custype.items.receiptType.bindData(res.receiptTypes, "rtId", "name", "无");
    }, null, false);

    custype.modals.addCustypeModal.on("hide.bs.modal", function(a) {

        com.cleanItems(custype.items);
        com.clearValidator();
        custype.currentCtid = null;
    });

    var searcher = new Searcher();

    searcher.base("condList", "pagenation", "resultList", api.data.pageCustype);

    searcher.condition(["data-custype-name", "data-custype-status", "data-custype-no", "data-custype-agent", "data-custype-phone", "data-custype-wxapp", "data-custype-atttype", "data-custype-dgrade", "data-custype-sgrade", "data-custype-platform"]);

    searcher.button([{
        id: "addCustype",
        name: "添加",
        clazz: "btn-success",
        icon: "icon-plus"
    }]);

    searcher.history("custypePostData");

    var lineprops = [{
        fieId: "no",
        name: "商户号",
        prop: "no",
        clazz: "blue"
    }, {
        fieId: "agent",
        name: "机构号",
        prop: "agent",
        clazz: "blue"
    }, {
        fieId: "phone",
        name: "手机号",
        prop: "phone",
        clazz: "blue"
    }, {
        fieId: "wxapp",
        name: "微信小程序appid",
        prop: "wxapp",
        clazz: "grey"
    }, {
        fieId: "status",
        name: "状态",
        prop: "status",
        clazz: "red",
        dataset: custype.status
    }, {
        fieId: "atttype",
        name: "业务类型",
        prop: "atttype",
        clazz: "red",
        dataset: custype.atttype
    }, {
        fieId: "dgrade",
        name: "装修等级",
        prop: "dgrade",
        clazz: "green",
        show: function(v) {

            return v.dgrade = com.checkNull(v.dgrade, "无");
        }
    }, {
        fieId: "sgrade",
        name: "销售等级",
        prop: "sgrade",
        clazz: "green",
        show: function(v) {

            return v.sgrade = com.checkNull(v.sgrade, "无");
        }
    }, {
        fieId: "receiptTypeName",
        name: "收据类型名称",
        prop: function(v) {

            return com.checkNull(v.receiptType == null ? null : v.receiptType.name, "无");
        },
        clazz: "blue"
    }, {
        fieId: "receiptTypeNo",
        name: "收据类型键值",
        prop: function(v) {

            return com.checkNull(v.receiptType == null ? null : v.receiptType.no, "无");
        },
        clazz: "blue"
    }, {
        fieId: "platform",
        name: "支付平台",
        prop: "platform",
        clazz: "grey",
        dataset: custype.platforms
    }];

    var linebtns = [{
        name: "编辑",
        clazz: "btn-yellow",
        handle: function(v) {

            custype.currentCtid = v.ctid;

            custype.items.name.val(v.name);
            custype.items.no.val(v.no);
            custype.items.agent.val(v.agent);
            custype.items.phone.val(v.phone);
            custype.items.wxapp.val(v.wxapp);
            custype.items.atttype.val(v.atttype);
            custype.items.platform.val(v.platform);
            custype.items.receiptType.val(v.receiptType == null ? "" : v.receiptType.rtId);
            custype.items.dgrade.val(v.dgrade);
            custype.items.sgrade.val(v.sgrade);

            custype.modals.addCustypeModal.modal("show");
            return false;
        }
    }, {
        name: "状态",
        type: "switch",
        clazz: "status-lbl",
        handle: function(v, check) {

            com.post(api.data.updateCustype, {
                "custype.ctid": v.ctid,
                "custype.status": check ? 0 : 1
            }, function(res) {

                searcher.doSearch();
                return false;
            });
        },
        init: function(v) {

            return !v.status;
        }
    }];

    searcher.line("name", lineprops, linebtns).render();

    com.focusPage('#addCustype', '#pagenation').on("click", function() {

        custype.modals.addCustypeModal.modal("show");
    });

    function saveData() {

        if (com.validate('addCustypeModal'))
            return false;

        var url = api.data.addCustype;
        var options = {
            "custype.name": custype.items.name.val(),
            "custype.no": custype.items.no.val(),
            "custype.agent": custype.items.agent.val(),
            "custype.phone": custype.items.phone.val(),
            "custype.wxapp": custype.items.wxapp.val(),
            "custype.atttype": custype.items.atttype.val(),
            "custype.platform": custype.items.platform.val()
        };

        if (custype.items.dgrade.val() != "" && custype.items.dgrade.val() != null && custype.items.dgrade.val() != undefined) options["custype.dgrade"] = custype.items.dgrade.val();
        if (custype.items.sgrade.val() != "" && custype.items.sgrade.val() != null && custype.items.sgrade.val() != undefined) options["custype.sgrade"] = custype.items.sgrade.val();
        if (custype.items.receiptType.val() != "" && custype.items.receiptType.val() != null && custype.items.receiptType.val() != undefined) options["custype.receiptType.rtId"] = custype.items.receiptType.val();

        if (custype.currentCtid != null) {
            url = api.data.updateCustype;
            options["custype.ctid"] = custype.currentCtid;
        }

        com.post(url, options, function() {

            searcher.doSearch();
            custype.modals.addCustypeModal.modal("hide");
        });
    }

});
