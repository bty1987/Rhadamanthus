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
            dgrade: com.focusPage("#dgrade", "#custype"),
            sgrade: com.focusPage("#sgrade", "#custype")
        },

        currentCtid: null,
        status: {},
        atttype: {},
        dgrade: {},
        sgrade: {}

    };

    com.post(api.ds.data, {}, function (res) {
        $.each(res.custypeStatus, function(i, v){
            custype.status[v.key] = v.value;
        });
        $.each(res.custypeAtttype, function(i, v){
            custype.atttype[v.key] = v.value;
        });
        $.each(res.custypeDgrade, function(i, v){
            custype.dgrade[v.key] = v.value;
        });
        $.each(res.custypeSgrade, function(i, v){
            custype.sgrade[v.key] = v.value;
        });

        custype.items.atttype.bindData(res.custypeAtttype, "key", "value");
        custype.items.dgrade.bindData(res.custypeDgrade, "key", "value");
        custype.items.sgrade.bindData(res.custypeSgrade, "key", "value");
    }, null, false);

    custype.modals.addCustypeModal.on("hide.bs.modal", function(a) {
        com.cleanItems(custype.items);
        com.clearValidator();
        custype.currentCtid = null;
    });

    var searcher = new Searcher();

    searcher.base("condList", "pagenation", "resultList", api.data.pageCustype);

    searcher.condition(["data-custype-name", "data-custype-status"]);

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
        show: function(v){
            return v.dgrade = com.checkNull(v.dgrade, "无");
        }
    }, {
        fieId: "sgrade",
        name: "销售等级",
        prop: "sgrade",
        clazz: "green",
        show: function(v){
            return v.sgrade = com.checkNull(v.sgrade, "无");
        }
    }, {
        fieId: "receiptTypeName",
        name: "收据类型名称",
        prop: "receiptType.name",
        clazz: "blue",
        show: function(v){
            return v.receiptType.name = com.checkNull(v.receiptType.name, "无");
        }
    }, {
        fieId: "receiptTypeNo",
        name: "收据类型键值",
        prop: "receiptType.no",
        clazz: "blue",
        show: function(v){
            return v.receiptType.no = com.checkNull(v.receiptType.no, "无");
        }
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
            custype.items.dgrade.val(v.dgrade);
            custype.items.sgrade.val(v.sgrade);

            custype.modals.addCustypeModal.modal("show");
            return false;
        }},{
        name: "状态",
        type: "switch",
        clazz: "status-lbl",
        handle: function(v, check){
            com.post(api.data.updateCustype, {"custype.ctid": v.ctid, "custype.status": check ? 0 : 1}, function(res){
                searcher.doSearch();
                return false;
            });
        }, init: function(v){
            return !v.status;
        }}
    ];

    searcher.line("name", lineprops, linebtns).render();

    com.focusPage("#resultList").find("div.action-buttons").find("a.btn-yellow").hide();
    com.focusPage('#addCustype', '#pagenation').hide();

    com.focusPage('#addCustype', '#pagenation').on("click", function() {
        custype.modals.addCustypeModal.modal("show");
    });

    function saveData() {

        if (com.validate('addCustypeModal')) return false;

        var url = api.data.addCustype;
        var options = {
            "custype.name": custype.items.name.val(),
            "custype.no": custype.items.no.val(),
            "custype.agent": custype.items.agent.val(),
            "custype.phone": custype.items.phone.val(),
            "custype.wxapp": custype.items.wxapp.val(),
            "custype.atttype": custype.items.atttype.val()
        };

        if (["0", "1", "4"].indexOf(custype.items.atttype.val()) == -1) {
            options["custype.sgrade"] = custype.items.sgrade.val();
        } else {
            options["custype.dgrade"] = custype.items.dgrade.val();
        }

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
