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
            mostRate: com.focusPage("#mostRate", "#createPresignProduceModal")
        },

        status: {},
    };
    com.post(api.ds.quotation, {}, function(res) {
        presignProduce.status = res.presignProduceStatus.split("key", "value");
    }, null, false);

    presignProduce.modals.createPresignProduceModal.on('hide.bs.modal', function() {
        com.clearValidator();
        com.cleanItems(presignProduce.items);
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
            "presignProduce.mostRate": presignProduce.items.mostRate.val()
        };

        if (presignProduce.ppid) {
            url = api.quotation.updatePresignProduce;
            options['presignProduce.ppid'] = presignProduce.ppid;
        }

        com.post(url, options, function(res) {
            seacher.doSearch();
        });

        presignProduce.modals.createPresignProduceModal.modal("hide");
    }
});
