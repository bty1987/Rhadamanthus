jQuery(function($) {

    var presignProduce = {

        bsid: null,

        btns: {
            savePresignProduceBtn: com.focusPage("#savePresignProduceBtn").on("click", saveData),
        },

        modals: {
            createPresignProduceModal: com.focusPage("#createPresignProduceModal"),
        },

        items: {
            version: com.focusPage("#version", "#createPresignProduceModal"),
            name: com.focusPage("#name", "#createPresignProduceModal"),
            quotePrice: com.focusPage("#quotePrice", "#createPresignProduceModal"),
            discount: com.focusPage("#discount", "#createPresignProduceModal"),
            manageRate: com.focusPage("#manageRate", "#createPresignProduceModal"),
            costPrice: com.focusPage("#costPrice", "#createPresignProduceModal"),
            profitRate: com.focusPage("#profitRate", "#createPresignProduceModal"),
            offset: com.focusPage("#offset", "#createPresignProduceModal"),
            statues: com.focusPage("#status", "#createPresignProduceModal"),
            mostPrice: com.focusPage("#mostPrice", "#createPresignProduceModal"),
            costRate: com.focusPage("#costRate", "#createPresignProduceModal"),
            mostRate: com.focusPage("#mostRate", "#createPresignProduceModal"),
            manageFormula: com.focusPage("#manageFormula", "#createPresignProduceModal"),
            manageDiscount: com.focusPage("#manageDiscount", "#createPresignProduceModal"),
            taxRate: com.focusPage("#taxRate", "#createPresignProduceModal"),
            taxFormula: com.focusPage("#taxFormula", "#createPresignProduceModal"),
        },

        status: {},
    };

    presignProduce.status = constant.data().presignProduce.status.keys;

    presignProduce.modals.createPresignProduceModal.on('hide.bs.modal', function() {

        com.clearValidator();
        com.cleanItems(presignProduce.items);
    });

    com.post(api.quotation.queryQuotationVersion, {}, function(res) {

        presignProduce.items.version.bindData(res.quotationVersions, "qvId", "name", "无");
    });

    var seacher = new Searcher();

    seacher.base("condList", "pagenation", "resultList", api.quotation.pagePresignProduce);

    seacher.condition(["quotation-presignProduce-name", "quotation-presignProduce-status"]);

    seacher.button([{
        id: "addPresignProduce",
        name: "创建",
        clazz: "btn-yellow",
        icon: "icon-plus"
    }]);

    seacher.history("presignProducePostData");

    var lineprops = [{
        fieId: "name",
        name: "名称",
        prop: "name",
        clazz: "grey"
    }, {
        fieId: "version.name",
        name: "版本",
        prop: "version.name",
        clazz: "grey",
        show: function(v) {

            return !!(v.version.qvId);
        }
    }, {
        fieId: "quotePrice",
        name: "起报价",
        prop: "quotePrice",
        clazz: "blue"
    }, {
        fieId: "discount",
        name: "折扣",
        prop: "discount",
        clazz: "blue"
    }, {
        fieId: "manageRate",
        name: "管理费比例",
        prop: "manageRate",
        clazz: "blue"
    }, {
        fieId: "manageFormula",
        name: "管理费公式",
        prop: function(v) {

            var manageFormula = v.manageFormula != null ? paramToFormula(v.manageFormula) : "";

            return manageFormula;
        },
        clazz: "grey"
    }, {
        fieId: "manageDiscount",
        name: "管理费折扣",
        prop: "manageDiscount",
        clazz: "blue"
    }, {
        fieId: "taxRate",
        name: "税金比例",
        prop: "taxRate",
        clazz: "blue"
    }, {
        fieId: "taxFormula",
        name: "税金公式",
        prop: function(v) {

            var taxFormula = v.taxFormula != null ? paramToFormula(v.taxFormula) : "";

            return taxFormula;
        },
        clazz: "grey"
    }, {
        fieId: "costPrice",
        name: "成本单价",
        prop: "costPrice",
        clazz: "blue"
    }, {
        fieId: "mostPrice",
        name: "主材成本",
        prop: "mostPrice",
        clazz: "blue"
    }, {
        fieId: "profitRate",
        name: "利润率",
        prop: "profitRate",
        clazz: "blue"
    }, {
        fieId: "costRate",
        name: "工程增项成本比例",
        prop: "costRate",
        clazz: "blue"
    }, {
        fieId: "mostRate",
        name: "主材增项成本比例",
        prop: "mostRate",
        clazz: "blue"
    }, {
        fieId: "status",
        name: "状态",
        prop: "status",
        clazz: "red",
        dataset: presignProduce.status
    }, ];
    var linebtns = [{
        name: "编辑",
        clazz: "btn-yellow",
        handle: function(v) {

            presignProduce.ppid = v.ppid;

            presignProduce.items.name.val(v.name);
            presignProduce.items.quotePrice.val(v.quotePrice);
            presignProduce.items.costPrice.val(v.costPrice);
            presignProduce.items.discount.val(v.discount);
            presignProduce.items.manageRate.val(v.manageRate);
            presignProduce.items.profitRate.val(v.profitRate);
            presignProduce.items.offset.val(v.offset);
            presignProduce.items.mostPrice.val(v.mostPrice);
            presignProduce.items.costRate.val(v.costRate);
            presignProduce.items.mostRate.val(v.mostRate);
            presignProduce.items.manageFormula.val(v.manageFormula ? paramToFormula(v.manageFormula) : "");
            presignProduce.items.manageDiscount.val(v.manageDiscount);
            presignProduce.items.taxRate.val(v.taxRate);
            presignProduce.items.taxFormula.val(v.taxFormula ? paramToFormula(v.taxFormula) : "");

            if (v.version && v.version.qvId) {
                presignProduce.items.version.val(v.version.qvId);
            }

            presignProduce.modals.createPresignProduceModal.modal("show");

            return false;
        }
    }, {
        name: "项目",
        clazz: "btn-info",
        handle: function(v) {

            params.data.presignProduce = v;

            com.popup4page("#presignItemPopUp", "/views/quotation/presignItem.html", "预签项");

            return false;
        }
    }, {
        name: "价格",
        clazz: "btn-pink",
        handle: function(v) {

            params.data.presignProduce = v;

            com.popup4page("#presignItemPopUp", "/views/quotation/presignPrice.html", "预签价格");

            return false;
        }
    }, {
        name: "成本",
        clazz: "btn-success",
        handle: function(v) {

            params.data.presignProduce = v;

            com.popup4page("#presignItemPopUp", "/views/quotation/presignCost.html", "预签成本");

            return false;
        }
    }, {
        name: "状态",
        type: "switch",
        clazz: "status-lbl",
        handle: function(v, check) {

            com.post(api.quotation.updatePresignProduceForStatus, {
                "presignProduce.ppid": v.ppid,
                "presignProduce.status": check ? 0 : 1
            });

            return false;
        },
        init: function(v) {

            return !v.status;
        }
    }, ];

    seacher.line("name", lineprops, linebtns).render();

    com.focusPage('#addPresignProduce', '#pagenation').on("click", function() {

        presignProduce.ppid = null;

        presignProduce.modals.createPresignProduceModal.modal("show");
    });

    function saveData() {

        if (com.validate('createPresignProduceModal'))
            return false;

        var url = api.quotation.addPresignProduce;

        var manageFormula = presignProduce.items.manageFormula.val();

        var taxFormula = presignProduce.items.taxFormula.val();

        if (manageFormula.replace(/(\u8d77\u62a5\u4ef7|\u4f18\u60e0\u989d|\u529f\u80fd\u533a|\u4e2a\u6027|\u51cf\u9879|\u8d4b\u80fd|\u7279\u6b8a\u4f18\u60e0)/g, "").replace(/[\+\-\*\/\(\)]/g, "").replace(/[0-9]/g, "") != "") {

            com.showAlert(com.warning, "管理费公式存在无效参数");

            return false;
        }

        if (evals(formulaToParam(manageFormula))) {

            com.showAlert(com.warning, "管理费公式运算结果失败");

            return false;
        }

        if (taxFormula.replace(/(\u8d77\u62a5\u4ef7|\u4f18\u60e0\u989d|\u529f\u80fd\u533a|\u4e2a\u6027|\u51cf\u9879|\u8d4b\u80fd|\u7ba1\u7406\u8d39|\u7279\u6b8a\u4f18\u60e0|\u7ba1\u7406\u4f18\u60e0)/g, "").replace(/[\+\-\*\/\(\)]/g, "").replace(/[0-9]/g, "") != "") {

            com.showAlert(com.warning, "税金公式存在无效参数");

            return false;
        }

        if (evals(formulaToParam(taxFormula))) {

            com.showAlert(com.warning, "税金公式运算结果失败");

            return false;
        }

        var options = {
            "presignProduce.name": presignProduce.items.name.val(),
            "presignProduce.quotePrice": presignProduce.items.quotePrice.val(),
            "presignProduce.discount": presignProduce.items.discount.val(),
            "presignProduce.manageRate": presignProduce.items.manageRate.val(),
            "presignProduce.costPrice": presignProduce.items.costPrice.val(),
            "presignProduce.profitRate": presignProduce.items.profitRate.val(),
            "presignProduce.offset": presignProduce.items.offset.val(),
            "presignProduce.mostPrice": presignProduce.items.mostPrice.val(),
            "presignProduce.costRate": presignProduce.items.costRate.val(),
            "presignProduce.mostRate": presignProduce.items.mostRate.val(),
            "presignProduce.manageFormula": formulaToParam(manageFormula),
            "presignProduce.manageDiscount": presignProduce.items.manageDiscount.val(),
            "presignProduce.taxRate": presignProduce.items.taxRate.val(),
            "presignProduce.taxFormula": formulaToParam(taxFormula),
        };

        if (presignProduce.items.version.val()) {
            options["presignProduce.version.qvId"] = presignProduce.items.version.val();
        }

        if (presignProduce.ppid) {
            url = api.quotation.updatePresignProduce;
            options['presignProduce.ppid'] = presignProduce.ppid;
        }

        com.post(url, options, function(res) {

            seacher.doSearch();
        });

        presignProduce.modals.createPresignProduceModal.modal("hide");
    }

    function formulaToParam(formula) {

        return formula.replace(/\u8d77\u62a5\u4ef7/g, "{a}").replace(/\u4f18\u60e0\u989d/g, "{b}").replace(/\u529f\u80fd\u533a/g, "{c}").replace(/\u4e2a\u6027/g, "{d}").replace(/\u51cf\u9879/g, "{e}").replace(/\u8d4b\u80fd/g, "{f}").replace(/\u7ba1\u7406\u8d39/g, "{g}").replace(/\u7279\u6b8a\u4f18\u60e0/g, "{h}").replace(/\u7ba1\u7406\u4f18\u60e0/g, "{i}");
    }

    function paramToFormula(param) {

        return param.replace(/\{a\}/g, "\u8d77\u62a5\u4ef7").replace(/\{b\}/g, "\u4f18\u60e0\u989d").replace(/\{c\}/g, "\u529f\u80fd\u533a").replace(/\{d\}/g, "\u4e2a\u6027").replace(/\{e\}/g, "\u51cf\u9879").replace(/\{f\}/g, "\u8d4b\u80fd").replace(/\{g\}/g, "\u7ba1\u7406\u8d39").replace(/\{h\}/g, "\u7279\u6b8a\u4f18\u60e0").replace(/\{i\}/g, "\u7ba1\u7406\u4f18\u60e0");
    }

    function evals(formula) {

        formula = com.format(formula, {
            "a": 1,
            "b": 1,
            "c": 1,
            "d": 1,
            "e": 1,
            "f": 1,
            "g": 1,
            "h": 1,
            "i": 1,
        });

        var res = new Function("return function(){return " + formula + "}")()();

        return isNaN(res) || !Number.isFinite(res);
    }
});
