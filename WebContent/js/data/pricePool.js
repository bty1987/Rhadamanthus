jQuery(function($) {

    var pricePool = {

        gpid: params.data.goodsPool.gpid,

        btns: {
            savePricePool: com.focusPage("#savePricePool", "#pricePool").on("click", saveData),
            addPricePool: com.focusPage("#addPricePool")
        },
        modals: {
            pricePoolModal: com.focusPage("#pricePoolModal")
        },
        items: {
            name: com.focusPage("#name", "#pricePoolModal"),
            purchase: com.focusPage("#purchase", "#pricePoolModal"),
            selling: com.focusPage("#selling", "#pricePoolModal"),
            confine: com.focusPage("#confine", "#pricePoolModal"),
            cvalue: com.focusPage("#cvalue", "#pricePoolModal"),
            ctype: com.focusPage("#ctype", "#pricePoolModal"),
            type: com.focusPage("#type", "#pricePoolModal")
        }
    };

    pricePool.items.type.bindData(constant.data().price.type.datas, "key", "value");
    pricePool.items.ctype.bindData(constant.data().price.ctype.datas, "key", "value");

    var searcher = new Searcher();

    searcher.base("pricePoolCondList", "pricePoolPagenation", "pricePoolResultlist", api.communion.queryPricePoolByGpid);
    searcher.result("pricePools").isPage(true);
    searcher.param({
        "pricePool.goodsPool.gpid": pricePool.gpid
    });

    var lineprops = [{
        fieId: "name",
        name: "价格说明",
        prop: "name",
        clazz: "grey"
    }, {
        fieId: "purchase",
        name: "控价",
        prop: "purchase",
        clazz: "blue"
    }, {
        fieId: "selling",
        name: "售价",
        prop: "selling",
        clazz: "grey"
    }, {
        fieId: "confine",
        name: "限价",
        prop: "confine",
        clazz: "grey"
    }, {
        fieId: "ctype",
        name: "结算类型",
        prop: function(v) {

            return v.ctype == "0" ? "底价" : "点位";
        },
        clazz: "red"
    }, {
        fieId: "cvalue",
        name: "结算值",
        prop: "cvalue",
        clazz: "blue"
    }, {
        fieId: "type",
        name: "结算值",
        prop: function(v) {

            return v.type == "0" ? "正价" : "特价";
        },
        clazz: "red"
    }];

    var linebtns = [{
        name: "删除",
        clazz: "btn-warning",
        handle: function(v) {

            com.post(api.communion.deletePricePool, {
                "pricePool.ppid": v.ppid
            }, function(res) {

                com.showAlert(com.info, "操作成功");

                searcher.doSearch();
            });
        }
    }, {
        name: "状态",
        type: "switch",
        clazz: "status-lbl",
        handle: function(v, check) {

            com.post(api.communion.updatePricePoolForStatus, {
                "pricePool.ppid": v.ppid,
                "pricePool.status": v.status == 0 ? 1 : 0
            }, function(res) {

                com.showAlert(com.info, "操作成功");
                searcher.doSearch();
            });

            return false;
        },
        init: function(v) {

            return !v.status;
        }
    }];

    searcher.line("name", lineprops, linebtns).render();

    com.focusPage('#addPricePool').on("click", function() {

        com.cleanItems(pricePool.items);

        pricePool.modals.pricePoolModal.modal("show");
    });

    function saveData() {

        if (com.validate('pricePoolModal'))
            return false;

        var url = api.communion.addPricePool;

        var options = {
            "pricePool.goodsPool.gpid": pricePool.gpid,
            "pricePool.name": pricePool.items.name.val(),
            "pricePool.purchase": pricePool.items.purchase.val(),
            "pricePool.selling": pricePool.items.selling.val(),
            "pricePool.confine": pricePool.items.confine.val(),
            "pricePool.ctype": pricePool.items.ctype.val(),
            "pricePool.cvalue": pricePool.items.cvalue.val(),
            "pricePool.type": pricePool.items.type.val()
        };

        com.post(url, options, function(res) {

            com.showAlert(com.info, "操作成功");

            searcher.doSearch();

            pricePool.modals.pricePoolModal.modal("hide");
        });

    }
});
