jQuery(function($) {

    var price = {

        gid: params.data.goods.gid,

        btns: {
            savePrice: com.focusPage("#savePrice").on("click", saveData),
            addPrice: com.focusPage("#addPrice"),
        },
        modals: {
            priceModal: com.focusPage("#priceModal")
        },
        items: {
            name: com.focusPage("#name", "#priceModal"),
            purchase: com.focusPage("#purchase", "#priceModal"),
            selling: com.focusPage("#selling", "#priceModal"),
            confine: com.focusPage("#confine", "#priceModal"),
            cvalue: com.focusPage("#cvalue", "#priceModal"),
            ctype: com.focusPage("#ctype", "#priceModal"),
            type: com.focusPage("#type", "#priceModal"),
        },

        pageType: params['urlLoadParams'].type,
    };

    if (price.pageType != "senior") {
        price.btns.addPrice.addClass("hide");
    }

    price.items.type.bindData(constant.data().price.type.datas, "key", "value");
    price.items.ctype.bindData(constant.data().price.ctype.datas, "key", "value");

    var searcher = new Searcher();

    searcher.base("pcondlist", "ppagenation", "presultlist", api.data.queryPriceByGid);
    searcher.result("prices").isPage(true);
    searcher.param({
        "price.gid": price.gid
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

            com.post(api.data.deletePrice, {
                "price.pid": v.pid
            }, function(res) {

                com.showAlert(com.info, "操作成功");

                searcher.doSearch();
            });
        },
        show: function(v) {

            return price.pageType == "senior"
        }
    }, {
        name: "状态",
        type: "switch",
        clazz: "status-lbl",
        handle: function(v, check) {

            var status = null;

            if (v.status == constant.data().price.status.STATUS_ENABLE_INT) {
                status = constant.data().price.status.STATUS_DISABLE_INT;
            } else {
                status = constant.data().price.status.STATUS_ENABLE_INT;
            }

            com.post(api.data.updatePriceForStatus, {
                "price.pid": v.pid,
                "price.status": status
            }, function(res) {

                com.showAlert(com.info, "操作成功");
                searcher.doSearch();
            });

            return false;
        },
        init: function(v) {

            return !v.status;
        },
        show: function(v) {

            return price.pageType == "senior"
        }
    }];

    searcher.line("name", lineprops, linebtns).render();

    com.focusPage('#addPrice').on("click", function() {

        com.cleanItems(price.items);

        price.modals.priceModal.modal("show");
    });

    function saveData() {

        if (com.validate('priceModal'))
            return false;

        var url = api.data.addPrice;

        var options = {
            "price.gid": price.gid,
            "price.name": price.items.name.val(),
            "price.purchase": price.items.purchase.val(),
            "price.selling": price.items.selling.val(),
            "price.confine": price.items.confine.val(),
            "price.ctype": price.items.ctype.val(),
            "price.cvalue": price.items.cvalue.val(),
            "price.type": price.items.type.val(),
        };

        com.post(url, options, function(res) {

            com.showAlert(com.info, "操作成功");

            searcher.doSearch();

            price.modals.priceModal.modal("hide");
        });

    }
});
