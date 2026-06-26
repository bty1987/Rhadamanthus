jQuery(function($) {

    var accessory = {

        cid: params.construction.cid,
        orderId: params.construction.orderId,

        aid: null,
        caid: null,

        btns: {
            addConfirmBtn: com.focusPage("#addConfirmBtn"),
            updateBtn: com.focusPage("#updateBtn")
        },

        modals: {
            addModal: com.focusPage("#addModal"),
            updateModal: com.focusPage("#updateModal")
        },

        items: {
            checkup: com.focusPage("#checkup"),
            numLimit: com.focusPage("#numLimit"),
        },
        addItems: {
            goodsName: com.focusPage("#goodsName"),
            goodsNo: com.focusPage("#goodsNo"),
            category: com.focusPage('#category'),
            brand: com.focusPage('#brand'),
            measurementUnit: com.focusPage('#measurementUnit'),
            addCheckup: com.focusPage("#addCheckup"),
            addNumLimit: com.focusPage("#addNumLimit")
        },

        isCheckup: {},

    };

    accessory.btns.addConfirmBtn.bindClick(addAccessory);
    accessory.btns.updateBtn.bindClick(update);

    accessory.modals.addModal.on("hide.bs.modal", function() {
        com.cleanItems(accessory.addItems);
        com.clearValidator();
        com.closeTip();
    });

    accessory.modals.updateModal.on("hide.bs.modal", function() {
        com.clearValidator();
        com.closeTip();
    });

    accessory.items.checkup.bindData(constant.construction().accessory.isCheckup.datas,"key","value");
    accessory.addItems.addCheckup.bindData(constant.construction().accessory.isCheckup.datas,"key","value");

    com.initTypeahead("goodsName", api.data.queryAoodsByName, "aoods.goods.name", {
        "orderId": accessory.orderId
    }, "aoodes", "gid", "name", function(list, k, v) {

        $.each(list, function(index, val) {

            if (val.goods.gid == k) {

                accessory.aid = val.aid;

                accessory.checkup = val.checkup;

                accessory.addItems.goodsNo.val(val.goods.no);
                accessory.addItems.category.val(val.goods.category);
                accessory.addItems.brand.val(val.goods.brand);
                accessory.addItems.measurementUnit.val(val.goods.measurementUnit);
            }
        });

        return v;
    });

    function buildAccessoryLineprops() {

        return [{
            field: "aoods.goods.no",
            name: "商品编号",
            prop: "aoods.goods.no",
            clazz: "grey"
        }, {
            field: "aoods.goods.category",
            name: "品类",
            prop: "aoods.goods.category",
            clazz: "grey"
        }, {
            field: "aoods.goods.brand",
            name: "品牌",
            prop: "aoods.goods.brand",
            clazz: "grey"
        }, {
            field: "aoods.goods.measurementUnit",
            name: "单位",
            prop: "aoods.goods.measurementUnit",
            clazz: "red"
        }, {
            field: "aoods.accessoriesType.name",
            name: "辅类名称",
            prop: "aoods.accessoriesType.name",
            clazz: "grey"
        }, {
            field: "numLimit",
            name: "数量限制",
            prop: "numLimit",
            clazz: "blue"
        }, {
            field: "num",
            name: "数量",
            prop: "num",
            clazz: "blue"
        }, {
            field: "total",
            name: "总额",
            prop: "total",
            clazz: "blue"
        }, {
            field: "checkup",
            name: "验证标识",
            prop: function(v) { return constant.construction().constructionAccessory.isCheckup.keys[v.checkup]; },
            clazz: "red"
        }];
    }

    function buildAccessoryLinebtns() {

        return {
            update: {
                name: "更新",
                clazz: "btn-yellow",
                handle: function(v) {
                    accessory.caid = v.caid;

                    accessory.items.numLimit.val(v.numLimit);
                    accessory.modals.updateModal.modal("show");
                }
            }
        };
    }

    function buildAccessoryButtons() {

        var $adda = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('id', 'addConstructionAccessory').css("margin", "0px 3px");
        var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
        var $addspan = $('<span></span>').text('添加').appendTo($adda);

        return [$adda];
    }

    var searcher = new Searcher();

    searcher.set("condList", "pagenation", "resultList", api.construction.pageConstructionAccessory, {
        "constructionAccessory.cid": accessory.cid
    }, [], "constructionAccessoryPostDate", null, false, buildAccessoryButtons);
    searcher.line("aoods.goods.name", buildAccessoryLineprops(), buildAccessoryLinebtns()).render();

    com.focusPage("#addConstructionAccessory").click(function() {
        accessory.modals.addModal.modal("show");
    });

    function addAccessory() {
        if (com.validate('addModal')) { return false; };

        var options = {
            "constructionAccessory.cid": accessory.cid,
            "constructionAccessory.aoods.aid": accessory.aid,
            "constructionAccessory.checkup": accessory.addItems.addCheckup.val(),
            "constructionAccessory.numLimit": accessory.addItems.addNumLimit.val(),
        };

        com.post(api.construction.addConstructionAccessory, options, function(res) {
            com.showAlert(com.info, "操作成功");
            searcher.doSearch();
        });
        accessory.modals.addModal.modal("hide");
    };

    function update() {
        if (com.validate('updateModal')) { return false; };

        var options = {
            "constructionAccessory.caid": accessory.caid,
            "constructionAccessory.checkup": accessory.items.checkup.val(),
            "constructionAccessory.numLimit": accessory.items.numLimit.val()
        };

        com.post(api.construction.updateConstructionAccessory, options, function(res) {
            com.showAlert(com.info, "操作成功");
            searcher.doSearch();
        });
        accessory.modals.updateModal.modal("hide");
    };

});