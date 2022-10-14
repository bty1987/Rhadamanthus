jQuery(function($) {

    var awardPurchase = {

        btns: {
            saveBtn: com.focusPage("#saveBtn").on("click", saveData),
            saveInw: com.focusPage("#saveInw").on("click", saveW),
            saveBap: com.focusPage("#saveBap").on("click", saveB),
        },

        modals: {
            awardPurchaseModal: com.focusPage("#awardPurchaseModal"),
            purchaseModal: com.focusPage("#purchaseModal"),
            bapriceModal: com.focusPage("#bapriceModal"),
        },

        items: {
            inprice: com.focusPage("#inprice", "#purchaseModal"),
            baprice: com.focusPage("#baprice", "#bapriceModal"),
            num: com.focusPage("#num", "#awardPurchaseModal"),
        },
        apid: null,
        asid: null,
        status: {},
        storeroom: {},
    };

    awardPurchase.modals.awardPurchaseModal.on('hide.bs.modal', function(e) {

        com.cleanTypeahead("awardStock");
        com.cleanItems(awardPurchase.items);
        com.closeTip();
    });

    com.initTypeahead('awardStock', api.information.queryAwardStockByName, "awardStock.name", {}, "awardStocks", "asId", function(v) {

        return v.name + "-" + constant.information().activityItem.storeroom.keys[v.storeroom];
    }, null);

    awardPurchase.modals.awardPurchaseModal.on('hide.bs.modal', function() {

        com.clearValidator();
        com.cleanItems(awardPurchase.items);
    });
    var searcher = new Searcher();

    searcher.base("condList", "pagenation", "resultList", api.information.pageAwardPurchase);

    searcher.condition(['information-awardPurchase-no', 'information-awardPurchase-name', "information-awardPurchase-createTime", "information-awardPurchase-purchaseTime", "information-awardPurchase-instoreTime", 'information-awardPurchase-type', "information-award-status"]);

    searcher.button([{
        id: "addAwardPurchase",
        name: "创建",
        clazz: "btn-yellow",
        icon: "icon-plus"
    }]);

    var lineprops = [{
        fieId: "awardStock",
        name: "库存",
        prop: "awardStock.name",
        clazz: "blue"
    }, {
        fieId: "inprice",
        name: "入库价",
        prop: "inprice",
        clazz: "blue"
    }, {
        fieId: "baprice",
        name: "结算价",
        prop: "baprice",
        clazz: "blue"
    }, {
        fieId: "num",
        name: "数量",
        prop: "num",
        clazz: "blue"
    }, {
        fieId: "status",
        name: "状态",
        prop: "status",
        clazz: "red",
        dataset: constant.information().awardPurchase.status.keys
    }, {
        field: "creater",
        name: "创建人",
        prop: "creater.userName",
        clazz: "grey"
    }, {
        field: "createTime",
        name: "创建时间",
        prop: "createTime",
        clazz: "green"
    }, {
        field: "purchaser",
        name: "采购员",
        prop: "purchaser.userName",
        clazz: "grey"
    }, {
        field: "purchaseTime",
        name: "采购时间",
        prop: "purchaseTime",
        clazz: "green"
    }, {
        field: "instorer",
        name: "入库员",
        prop: "instorer.userName",
        clazz: "grey"
    }, {
        field: "instoreTime",
        name: "入库时间",
        prop: "instoreTime",
        clazz: "green"
    }, {
        field: "balanceTime",
        name: "仓储时间",
        prop: "balanceTime",
        clazz: "green"
    }, ];

    var linebtns = [{
        name: "采购",
        clazz: "btn-yellow",
        handle: function(v) {

            com.post(api.information.purchaseAwardPurchase, {
                "awardPurchase.apid": v.apid
            }, function(res) {

                searcher.doSearch();
                com.showAlert(com.info, "操作成功");
            });
            return false;
        },
        show: function(v) {

            return (v.status == constant.information().awardPurchase.STATUS_INIT_INT);
        }
    }, {
        name: "入库",
        clazz: "btn-green",
        handle: function(v) {

            awardPurchase.apid = v.apid;
            warehouse(v);
            return false;
        },
        show: function(v) {

            return (v.status == constant.information().awardPurchase.STATUS_PROC_INT);
        }
    }, {
        name: "结算",
        clazz: "btn-success",
        handle: function(v) {

            awardPurchase.apid = v.apid;
            account(v);
            return false;
        },
        show: function(v) {

            return (v.status == constant.information().awardPurchase.STATUS_WARE_INT);
        }
    }, {
        name: "撤销",
        clazz: "btn-danger",
        handle: function(v) {

            saveC(v.apid);
            return false;
        },
        show: function(v) {

            return (v.status == constant.information().awardPurchase.STATUS_INIT_INT);
        }
    }, ];

    searcher.line("awardStock.name", lineprops, linebtns).render();

    com.focusPage('#addAwardPurchase', '#pagenation').on("click", function() {

        awardPurchase.modals.awardPurchaseModal.modal("show");
    });

    function warehouse(v) {

        awardPurchase.modals.purchaseModal.modal("show");
    }

    function account(v) {

        awardPurchase.modals.bapriceModal.modal("show");
    }

    function saveW() {

        if (com.validate('purchaseModal'))
            return false;

        var url = api.information.instoreAwardPurchase;
        var options = {
            "awardPurchase.apid": awardPurchase.apid,
            "awardPurchase.inprice": awardPurchase.items.inprice.val()
        };

        com.post(url, options, function(res) {

            searcher.doSearch();
        });

        awardPurchase.modals.purchaseModal.modal("hide");
    }

    function saveB() {

        if (com.validate('bapriceModal'))
            return false;

        var url = api.information.balanceAwardPurchase;
        var options = {
            "awardPurchase.apid": awardPurchase.apid,
            "awardPurchase.baprice": awardPurchase.items.baprice.val()
        };

        com.post(url, options, function(res) {

            searcher.doSearch();
        });

        awardPurchase.modals.bapriceModal.modal("hide");
    }

    function saveC(apid) {

        var options = {
            "awardPurchase.apid": apid,
        }

        com.post(api.information.cancelAwardPurchase, options, function(res) {

            searcher.doSearch();
        });
    }

    function saveData() {

        if (com.validate('awardPurchaseModal'))
            return false;

        var asid = com.typeahead("awardStock");

        if (!asid) {
            com.showAlert(com.error, "库存名称不匹配");
            awardPurchase.modals.awardPurchaseModal.modal("hide");
            return false;
        }

        var url = api.information.addAwardPurchase;
        var options = {
            "awardPurchase.awardStock.asId": asid,
            "awardPurchase.num": awardPurchase.items.num.val(),
        };

        com.post(url, options, function(res) {

            searcher.doSearch();
        });

        awardPurchase.modals.awardPurchaseModal.modal("hide");
    }
});
