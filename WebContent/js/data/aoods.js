$(function() {

    var aoods = {

        aid: null,
        gid: null,

        items: {
            name: com.focusPage("#name", "#addLayer"),
            accessoriesType: com.focusPage("#accessoriesType", "#addLayer"),
            bcompany: com.focusPage("#bcompany", "#addLayer"),
            atttype: com.focusPage("#atttype", "#addLayer"),
            balance: com.focusPage("#balance", "#addLayer"),

            editAccessoriesType: com.focusPage("#editAccessoriesType", "#editLayer"),
            editBcompany: com.focusPage("#editBcompany", "#editLayer"),
            old: com.focusPage("#old", "#editLayer"),
            editAtttype: com.focusPage("#editAtttype", "#editLayer"),
            editBalance: com.focusPage("#editBalance", "#editLayer"),

            ccompany: com.focusPage("#ccompany", "#copyLayer"),
        },

        btns: {
            submitBtn: com.focusPage("#submitBtn", "#addLayer"),
            editBtn: com.focusPage("#editBtn", "#editLayer"),
            copyBtn: com.focusPage("#copyBtn", "#copyLayer"),
        },

        status: ["启用", "禁用"],
        atttype: ["普通", "外辅"],
        pageType: params.urlLoadParams.type,
    };

    com.post(api.data.queryAccessoriesType, {}, function(res) {
        aoods.items.accessoriesType.bindData(res.accessoriesTypes, 'atid', 'name', true);
        com.focusPage('select[name="editAccessoriesType"]').bindData(res.accessoriesTypes, 'atid', 'name', false);
    });

    com.post(api.system.queryCompany, {}, function(res) {
        aoods.items.bcompany.bindData(res.companys, 'cid', 'name', true);
        aoods.items.ccompany.bindData(res.companys, 'cid', 'name', true);
        com.focusPage('select[name="editBcompany"]').bindData(res.companys, 'cid', 'name', false);
    });
    com.post(api.ds.data, {}, function(res) {
        com.focusPage('select[name="editAtttype"]').bindData(res.aoodsAtttype, "key", "value", false);
        com.focusPage('select[name="atttype"]').bindData(res.aoodsAtttype, "key", "value", false);
    }, null, false);

    aoods.btns.submitBtn.click(function() {
        saveData();
    });

    aoods.btns.editBtn.click(function() {
        editAoods();
    });

    aoods.btns.copyBtn.click(function() {
        copyAoods();
    });

    com.initTypeahead("name", api.data.queryGoodsByName, "goods.name", {}, "goodes", "gid", "name", function(list, k, v) {
        $.each(list, function(index, val) {
            if (val.gid == k) {
                aoods.gid = k;
            }
        });
        return v;
    });

    var searcher = new Searcher();

    searcher.base("condList", "pagenation", "resultList", api.data.pageAoods);

    searcher.condition(["data-aoods-name", "data-aoods-type", "data-aoods-status", "data-aoods-bompany", "data-aoods-atttype"]);

    if (aoods.pageType == "bompany") {
        searcher.condition(["data-aoods-name", "data-aoods-type", "data-aoods-status", "data-aoods-atttype"]);
    }

    searcher.param({
        "companyType": aoods.pageType
    });

    searcher.button([{
        id: "add",
        name: "添加",
        clazz: "btn-yellow",
        icon: "icon-plus"
    }, ]);

    if (aoods.pageType == "company") {
        searcher.button([{
            id: "copy",
            name: "复制",
            clazz: "btn-success",
            icon: "icon-download-alt"
        }])
    }

    var lineprops = [{
        field: "goods.brand",
        name: "品牌",
        prop: "goods.brand",
        clazz: "grey"
    }, {
        field: "goods.category",
        name: "品类",
        prop: "goods.category",
        clazz: "grey"
    }, {
        field: "goods.measurementUnit",
        name: "单位",
        prop: "goods.measurementUnit",
        clazz: "grey"
    }, {
        field: "goods.selling",
        name: "售价",
        prop: "goods.selling",
        clazz: "grey"
    }, {
        field: "accessoriesType.name",
        name: "辅类",
        prop: "accessoriesType.name",
        clazz: "grey"
    }, {
        field: "status",
        name: "状态 ",
        prop: "status",
        clazz: "red",
        dataset: aoods.status
    }, {
        field: "bompany",
        name: "归属公司",
        prop: "bompany",
        clazz: "grey"
    }, {
        field: "atttype",
        name: "业务类型 ",
        prop: "atttype",
        clazz: "grey",
        dataset: aoods.atttype
    }, {
        field: "balance",
        name: "结算价",
        prop: "balance",
        clazz: "grey"
    },

    ];

    var linebtns = [{
        name: "编辑",
        clazz: "btn-yellow",
        handle: function(v) {
            com.cleanItems(aoods.items);
            aoods.items.editBalance.val(v.balance);
            aoods.aid = v.aid;
            aoods.items.editAccessoriesType.val(v.accessoriesType.atid);
            aoods.items.old.val(v.bompany);
            aoods.items.editAtttype.val(v.atttype);

            com.popup4model("#editLayer", "编辑")
        }
    }, {
        name: "成本",
        clazz: "btn-pink",
        handle: function(v) {
            params.data.aoods = v;
            com.popup4page("#optPopUp", "views/data/aoodsCost.html", "辅材成本");
        }
    }, {
        name: "状态",
        type: "switch",
        clazz: "status-lbl",
        handle: function(v, check) {
            com.post(api.data.updateAoodsForStatus, {
                "aoods.aid": v.aid,
                "aoods.status": check ? 0 : 1
            });
            return false;
        },
        init: function(v) {
            return !v.status;
        }
    }, ];

    searcher.line("goods.name", lineprops, linebtns);

    searcher.render();

    com.focusPage('#add', '#pagenation').on("click", function() {
        com.cleanItems(aoods.items);
        com.popup4model("#addLayer", "添加");
    });

    com.focusPage('#copy', '#pagenation').on("click", function() {
        com.cleanItems(aoods.items);
        com.popup4model("#copyLayer", "复制");
    });

    function saveData() {

        if (com.validate("formAoods", "right")) { return false; }

        var gid = aoods.gid;
        var atid = aoods.items.accessoriesType.val();
        var bcid = aoods.items.bcompany.val();
        var atttype = aoods.items.atttype.val();
        var balance = aoods.items.balance.val();

        var options = {
            "aoods.goods.gid": gid,
            "aoods.accessoriesType.atid": atid,
            "aoods.bompany": bcid,
            "aoods.atttype": atttype,
            "aoods.balance": balance,
        };

        com.post(api.data.addAoods, options, function(res) {
            com.closePopup();
            searcher.doSearch();
        });
    }

    function editAoods() {

        if (com.validate("editAoods", "right")) { return false; }
        var atid = aoods.items.editAccessoriesType.val();
        var bcid = aoods.items.editBcompany.val();
        var atttype = aoods.items.editAtttype.val();
        var balance = aoods.items.editBalance.val();

        // var checkup = aoods.items.editCheckup.val();

        var options = {
            "aoods.aid": aoods.aid,
            // "aoods.checkup": checkup,
            "aoods.accessoriesType.atid": atid,
            "aoods.bompany": bcid,
            "aoods.atttype": atttype,
            "aoods.balance": balance,

        };

        com.post(api.data.updateAoods, options, function(res) {
            com.closePopup();
            searcher.doSearch();
        });
    }

    function updateStatus(id, status, failcallBack) {

        com.post(api.data.updateAoodsForStatus, {
            "aoods.aid": id,
            "aoods.status": status
        }, function() {
            searcher.doSearch();
        }, function() {
            failcallBack && failcallBack();
        });
    }

    function copyAoods() {

        if (com.validate("copyAoods", "right")) { return false; }

        var bcid = aoods.items.ccompany.val();

        var options = {
            "aoods.bompany": bcid,
        };

        com.post(api.data.copyAoods, options, function(res) {
            com.closePopup();
            searcher.doSearch();
        });
    }
});