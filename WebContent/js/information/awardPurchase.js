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
            warehousing: com.focusPage("#warehousing", "#purchaseModal"),
            baprice: com.focusPage("#baprice", "#bapriceModal"),
            num: com.focusPage("#num", "#awardPurchaseModal"),
            activity: com.focusPage("#activity", "#awardPurchaseModal"),
            dept: com.focusPage("#dept", "#awardPurchaseModal"),
            comment: com.focusPage("#comment", "#awardPurchaseModal"),
        },

        apid: null,
        asid: null,
        surplus: null,

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
    searcher.history("awardPurchasePageData");
    searcher.condition(['information-awardPurchase-no', 'information-awardPurchase-name', 'information-awardPurchase-activity', 'information-awardPurchase-dept', "information-awardPurchase-createTime", "information-awardPurchase-purchaseTime", "information-awardPurchase-instoreTime", 'information-awardPurchase-type', "information-award-status"]);

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
        fieId: "surplus",
        name: "剩余数量",
        prop: "surplus",
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
    }, {
        field: "activity",
        name: "活动名称",
        prop: "activity",
        clazz: "grey"
    }, {
        field: "dept",
        name: "部门",
        prop: "dept",
        clazz: "grey"
    }, {
        field: "comment",
        name: "备注",
        prop: "comment",
        clazz: "grey"
    }];

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
            awardPurchase.surplus = v.surplus;
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

        var options = {
            "awardPurchase.apid": awardPurchase.apid,
            "awardPurchase.inprice": awardPurchase.items.inprice.val(),
            "awardPurchase.num": awardPurchase.items.warehousing.val()
        };

        com.post(api.information.instoreAwardPurchase, options, function(res) {

            searcher.doSearch();
        });

        awardPurchase.modals.purchaseModal.modal("hide");
    }

    function saveB() {

        if (com.validate('bapriceModal'))
            return false;

        var options = {
            "awardPurchase.apid": awardPurchase.apid,
            "awardPurchase.baprice": awardPurchase.items.baprice.val()
        };

        com.post(api.information.balanceAwardPurchase, options, function(res) {

            searcher.doSearch();
        });

        awardPurchase.modals.bapriceModal.modal("hide");
    }

    function saveC(apid) {

        com.post(api.information.cancelAwardPurchase, {
            "awardPurchase.apid": apid,
        }, function(res) {

            searcher.doSearch();
        });
    }

    function saveData() {

        if (com.validate('awardPurchaseModal'))
            return false;

        var options = {
            "awardPurchase.awardStock.asId": com.typeahead("awardStock"),
            "awardPurchase.num": awardPurchase.items.num.val(),
            "awardPurchase.activity": awardPurchase.items.activity.val(),
            "awardPurchase.dept": awardPurchase.items.dept.val(),
            "awardPurchase.comment": awardPurchase.items.comment.val(),
        };

        com.post(api.information.addAwardPurchase, options, function(res) {

            searcher.doSearch();
        });

        awardPurchase.modals.awardPurchaseModal.modal("hide");
    }
});
