jQuery(function($) {

    var allocation = {

        goodsPool: params.data.goodsPool,

        btns: {
            submitAllocationBtn: com.focusPage("#submitAllocationBtn", "#allocationGoodsPool").on("click", allocationGoods)
        },
        modals: {
            allocationGoodsPoolModal: com.focusPage("#allocationGoodsPoolModal", "#allocationGoodsPool")
        },
        items: {
            company: com.focusPage("#company", "#allocationGoodsPoolModal"),
            createSoods: com.focusPage("#createSoods", "#allocationGoodsPoolModal"),
            createAoods: com.focusPage("#createAoods", "#allocationGoodsPoolModal")
        }
    };

    com.post(api.system.queryCompany, {}, function (res) {
        allocation.items.company.bindData(res.companys, 'cid', 'name');
    }, null, false);

    allocation.modals.allocationGoodsPoolModal.on('hide.bs.modal', function(e) {

        com.cleanItems(allocation.items);
        com.closeTip();
    });

    var searcher = new Searcher();

    searcher.base("goodsListCondList", "goodsListPagenation", "goodsListResultlist", api.data.queryGoodsByGpid);
    searcher.result("goodes").isPage(true);
    searcher.param({"goods.gpid": allocation.goodsPool.gpid});

    var lineprops = [{
        field: "name",
        name: "名称",
        prop: "name",
        clazz: "grey"
    },{
        field: "no",
        name: "编号",
        prop: "no",
        clazz: "blue"
    }, {
        field: "alias",
        name: "别名",
        prop: "alias",
        clazz: "grey"
    }, {
        field: "barcode",
        name: "条形码",
        prop: "barcode",
        clazz: "blue"
    }, {
        field: "category",
        name: "品类",
        prop: "category",
        clazz: "grey"
    }, {
        field: "brand",
        name: "品牌",
        prop: "brand",
        clazz: "grey"
    }, {
        field: "measurementUnit",
        name: "单位",
        prop: "measurementUnit",
        clazz: "grey"
    }, {
        field: "purchase",
        name: "控价",
        prop: "purchase",
        clazz: "blue"
    }, {
        field: "selling",
        name: "售价",
        prop: "selling",
        clazz: "blue"
    }, {
        field: "confine",
        name: "限价",
        prop: "confine",
        clazz: "blue"
    }, {
        field: "pieceNum",
        name: "件数 ",
        prop: "pieceNum",
        clazz: "blue"
    }, {
        field: "accessoriesType.name",
        name: "辅类",
        prop: "accessoriesType.name",
        clazz: "grey"
    }, {
        field: "type",
        name: "类型 ",
        prop: function(v) {

            return v.type == "0" ? "商品" : "套餐";
        },
        clazz: "red"
    }, {
        field: "onekind.name",
        name: "一类",
        prop: "onekind.name",
        clazz: "grey"
    }, {
        field: "twokind.name",
        name: "二类",
        prop: "twokind.name",
        clazz: "grey"
    }, {
        field: "thrkind.name",
        name: "三类",
        prop: "thrkind.name",
        clazz: "grey"
    }, {
        field: "status",
        name: "状态 ",
        prop: function(v) {

            return v.status == "0" ? "启用" : "禁用";
        },
        clazz: "red"
    }];

    var linebtns = [{
        name: "状态",
        type: "switch",
        clazz: "status-lbl",
        handle: function(v, check) {

            com.post(api.data.updateGoodsForStatus, {"goods.gid": v.gid, "goods.status": v.status == 0 ? 1 : 0}, function(res) {

                com.showAlert(com.info, "操作成功");
                searcher.doSearch();
            });

            return false;
        },
        init: function(v) {

            return !v.status;
        }
    }];

    searcher.line("company", lineprops, linebtns).render();

    com.focusPage("#allocationGoodsPoolBtn", "#allocationGoodsPool").click(function () {

        allocation.modals.allocationGoodsPoolModal.modal("show");
    });

    function allocationGoods () {

        if (com.validate("allocationGoodsPoolModal")) {
            return false;
        }

        var options = {
            "goods.no" : allocation.goodsPool.no,
            "goods.name" : allocation.goodsPool.name,
            "goods.alias" : allocation.goodsPool.alias,
            "goods.barcode" : allocation.goodsPool.barcode,
            "goods.bid" : allocation.goodsPool.bid,
            "goods.category" : allocation.goodsPool.category,
            "goods.measurementUnit" : allocation.goodsPool.measurementUnit,
            "goods.pieceNum": allocation.goodsPool.pieceNum,
            "goods.type": allocation.goodsPool.type,
            "goods.purchase": allocation.goodsPool.purchase,
            "goods.selling": allocation.goodsPool.selling,
            "goods.confine": allocation.goodsPool.confine,
            "goods.gpid": allocation.goodsPool.gpid,
            "goods.path": allocation.goodsPool.path,
            "goods.company": allocation.items.company.val()
        };
        
        var accessoriesType = allocation.goodsPool.accessoriesType;
        var onekind = allocation.goodsPool.onekind;
        var twokind = allocation.goodsPool.twokind;
        var thrkind = allocation.goodsPool.thrkind;
        
        if (accessoriesType != null && accessoriesType.atid != null) options["goods.accessoriesType.atid"] = accessoriesType.atid;
        if (onekind != null && onekind.gkid != null) options["goods.onekind.gkid"] = onekind.gkid;
        if (twokind != null && twokind.gkid != null) options["goods.twokind.gkid"] = twokind.gkid;
        if (thrkind != null && thrkind.gkid != null) options["goods.thrkind.gkid"] = thrkind.gkid;
        
        com.post(api.data.addGoods, options, function (res) {

            var gid = res.goods.gid;

            if (allocation.items.createSoods.prop("checked")) createSoods(gid);

            if (allocation.items.createAoods.prop("checked")) createAoods(gid);

            com.showAlert(com.info, "添加成功.");
            allocation.modals.allocationGoodsPoolModal.modal("hide");
            searcher.doSearch();
        });
    }

    //创建选材
    function createSoods (gid) {
        var options = {
            "soods.name": allocation.goodsPool.name,
            "soods.goods.gid": gid,
            "soods.num": allocation.goodsPool.pieceNum,
            "soods.selling": allocation.goodsPool.selling,
            "soods.cost": 0,
            "soods.balance": 0
        };

        com.post(api.data.addSoods, options, function(res) {
            com.showAlert(com.info, "选材创建成功.");
        });
    }

    //创建辅材
    function createAoods (gid) {
        var options = {
            "aoods.name": allocation.goodsPool.name,
            "aoods.goods.gid": gid,
            "aoods.bompany": allocation.items.company.val(),
            "aoods.atttype": 0,
            "aoods.balance": 0,
            "aoods.selling": allocation.goodsPool.selling
        };

        var accessoriesType = allocation.goodsPool.accessoriesType;

        if (accessoriesType != null && accessoriesType.atid != null) options["aoods.accessoriesType.atid"] = accessoriesType.atid;

        com.post(api.data.addAoods, options, function(res) {
            com.showAlert(com.info, "辅材创建成功.");
        });
    }

});
