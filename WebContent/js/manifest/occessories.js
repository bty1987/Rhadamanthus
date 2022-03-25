$(function() {

    var occessories = {
        oid: null,
        number: null,

        btns: {
            saveBtn: com.focusPage("#saveBtn").on("click", saveData),
            cancelBtn: com.focusPage("#cancelBtn"),
        },

        items: {
            supplier: com.focusPage("#supplier", "#bindOccessoriesModal"),
        },

        modals: {
            bindOccessoriesModal: com.focusPage("#bindOccessoriesModal"),
        },

        status: {},
        isEnter: {},
        isLift: {},

        pageType: params['urlLoadParams'].type,
    };

    var url = api.inventory.pageOccessories;
    var conditions = ['inventory-accessories-orderId', 'inventory-occessories-no', 'inventory-accessories-createrName', 'inventory-accessories-createTime', 'inventory-occessories-status', 'inventory-occessories-isEnter', 'inventory-occessories-isLift'];
    var options = {};

    if (occessories.pageType == "supplier") {
        url = api.inventory.pageOccessoriesForSupplier;
        options = $.extend({}, options, {
            "occessories.status": 1
        });
    } else if (occessories.pageType == "delive") {
        options = $.extend({}, options, {
            "occessories.status": 2
        });
    } else if (occessories.pageType == "receive") {
        options = $.extend({}, options, {
            "occessories.status": 3
        });
    } else if (occessories.pageType == "balance") {
        options = $.extend({}, options, {
            "occessories.status": 4
        });
    } else if (occessories.pageType == "bind") {
        options = $.extend({}, options, {
            "occessories.status": 1
        });
    } else {
        options = $.extend({}, options, {
            "occessories.status": 0
        });
    }

    com.post(api.ds.manifest, {}, function(res) {

        occessories.status = res.occessoriesStatus.split("key", "value");
        occessories.isEnter = res.occessoriesisEnter.split("key", "value");
        occessories.isLift = res.occessoriesisLift.split("key", "value");
    }, null, false);

    occessories.modals.bindOccessoriesModal.on("hide.bs.modal", function(e) {

        com.cleanItems(occessories.items);
    });

    com.initTypeahead('supplier', api.personel.querySupplierByPinyin, "supplier.pinYin", {
        "user.status": 0
    }, "suppliers", "uid", "userName", null);

    var searcher = new Searcher();

    searcher.base("condList", "pagenation", "resultList", url);

    searcher.condition(conditions);
    searcher.history("accessoriesPostData");
    searcher.param(options);

    var lineprops = [{
        fieId: "no",
        name: "外辅单号",
        prop: "no",
        clazz: "blue"
    }, {
        fieId: "orderId",
        name: "装修单号",
        prop: "decoration.orderId",
        clazz: "blue"
    }, {
        field: "village",
        name: "楼盘",
        prop: "decoration.house.village.name",
        clazz: "grey"
    }, {
        field: "houseNumber",
        name: "楼号",
        prop: "decoration.house.houseNumber",
        clazz: "grey"
    }, {
        field: "creater",
        name: "创建人",
        prop: "creater.currentName",
        clazz: "grey"
    }, {
        field: "supervisor",
        name: "监理",
        prop: "supervisor.currentName",
        clazz: "grey"
    }, {
        field: "createTime",
        name: "创建时间",
        prop: "createTime",
        clazz: "green"
    }, {
        field: "status",
        name: "状态",
        prop: "status",
        clazz: "red",
        dataset: occessories.status
    }, {
        field: "isEnter",
        name: "可进园区",
        prop: "isEnter",
        clazz: "red",
        dataset: occessories.isEnter
    }, {
        field: "isLift",
        name: "有无电梯",
        prop: "isLift",
        clazz: "red",
        dataset: occessories.isEnter
    }, {
        field: "isExceed",
        name: "有无超阶",
        prop: "isExceed",
        clazz: "red",
        dataset: occessories.isEnter
    }, {
        field: "isAttic",
        name: "有无超阶",
        prop: "isAttic",
        clazz: "red",
        dataset: occessories.isEnter
    }, ];

    var linebtns = [{
        name: "到货",
        clazz: "btn-info",
        handle: function(v) {

            if (v.status != 2) {
                com.showAlert(com.warning, "外辅单状态不可操作");
                return false;
            }

            var options = {
                "occessories.oid": v.oid,
                "occessoriesItems[0].oiid": 1,
                "occessoriesItems[0].recnum": 0
            };

            com.post(api.inventory.receiveOccessories, options, function(data) {

                com.showAlert(com.info, "操作成功");
                searcher.doSearch();
            });

            return false;
        },
        show: function(v) {
            return occessories.pageType == "delive" && v.status == 2;
        }
    }, {
        name: "送货",
        clazz: "btn-info",
        handle: function(v) {

            params["occessories.status"] = v.status;
            params["occessoriesItem.oid"] = v.oid;

            com.popup4page('#layerPopUp', "views/manifest/occessories4view.html", "外辅单 : " + v.no, null, function() {

                searcher.doSearch();
            });
            return false;
        },
        show: function(v) {
            return v.status == 1;
        }
    }, {
        name: "编辑",
        clazz: "btn-yellow",
        handle: function(v) {

            if (v.status != 0) {
                com.showAlert(com.warning, "外辅单状态不可操作");
                return false;
            }

            params["occessoriesItem.oid"] = v.oid;
            params["occessories.orderId"] = v.orderId;

            com.popup4page('#layerPopUp', "views/manifest/occessories2edit.html", "外辅单 : " + v.no);
            return false;
        },
        show: function(v) {
            return v.status == 0;
        }
    }, {
        name: "结算",
        clazz: "btn-danger",
        handle: function(v) {

            if (v.status != 3) {
                com.showAlert(com.warning, "外辅单状态不可操作");
                return false;
            }

            params["occessoriesItem.oid"] = v.oid;

            com.popup4page('#layerPopUp', "views/manifest/occessories4view.html", "外辅单 : " + v.no, null, function() {

                searcher.doSearch();
            });
            return false;
        },
        show: function(v) {
            return occessories.pageType == "receive" && v.status == 3;
        }
    }, {
        name: "分配",
        clazz: "btn-success",
        handle: function(v) {

            occessories.oid = v.oid;
            occessories.modals.bindOccessoriesModal.modal("show");

            return false;
        },
        show: function(v) {
            return v.status == 0;
        }
    }, {
        name: "查看",
        clazz: "btn-info",
        handle: function(v) {

            params["occessoriesItem.oid"] = v.oid;
            com.popup4page('#layerPopUp', "views/manifest/occessories4view.html", "外辅单 : " + v.no);

            return false;
        },
        show: function(v) {
            return true;
        }
    }, {
        name: "费用",
        clazz: "btn-primary",
        handle: function(v) {

            params["occessoriesItem.oid"] = v.oid;

            com.popup4page('#layerPopUp', "views/manifest/occessoriesCost.html", "费用 : " + v.no);

            return false;
        },
        show: function(v) {
            return true;
        }
    }, {
        name: "删除",
        clazz: "btn-danger",
        handle: function(v) {

            var options = {
                "occessories.oid": v.oid,
            };

            com.post(api.inventory.deleteOccessories, options, function(data) {
                com.showAlert(com.info, "操作成功");
                searcher.doSearch();
            });

            return false;
        },
        show: function(v) {
            return v.status == 0;
        }
    }, ];

    searcher.toble(lineprops, linebtns).render();

    function saveData() {

        if (com.validate('bindOccessoriesModal'))
            return false;

        var options = {
            'occessories.oid': occessories.oid,
            'occessories.supplier.uid': com.typeahead(occessories.items.supplier),
        };

        com.post(api.inventory.bindOccessories, options, function(res) {

            com.showAlert(com.info, "操作成功");
            occessories.modals.bindOccessoriesModal.modal("hide");
            searcher.doSearch();
        });
    }
});