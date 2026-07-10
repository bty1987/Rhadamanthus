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

    // 获取页面控制参数(按公司差异化配置)
    var pageConfig = constructionPage.getConfig("accessory");

    // pageBtn 配置为空时, 所有按钮按原逻辑显示; 否则需在 pageBtn 中存在
    function btnVisible(key) {

        return pageConfig.pageBtn.length == 0 || pageConfig.pageBtn.contains(key);
    }

    // 字段定义映射: key 对应配置 propertyArr 中的 value
    var propertyMap = {
        "goodsNo": {
            field: "aoods.goods.no",
            name: "商品编号",
            prop: "aoods.goods.no",
            clazz: "grey"
        },
        "category": {
            field: "aoods.goods.category",
            name: "品类",
            prop: "aoods.goods.category",
            clazz: "grey"
        },
        "brand": {
            field: "aoods.goods.brand",
            name: "品牌",
            prop: "aoods.goods.brand",
            clazz: "grey"
        },
        "measurementUnit": {
            field: "aoods.goods.measurementUnit",
            name: "单位",
            prop: "aoods.goods.measurementUnit",
            clazz: "red"
        },
        "accessoriesType": {
            field: "aoods.accessoriesType.name",
            name: "辅类名称",
            prop: "aoods.accessoriesType.name",
            clazz: "grey"
        },
        "numLimit": {
            field: "numLimit",
            name: "数量限制",
            prop: "numLimit",
            clazz: "blue"
        },
        "num": {
            field: "num",
            name: "数量",
            prop: "num",
            clazz: "blue"
        },
        "total": {
            field: "total",
            name: "总额",
            prop: "total",
            clazz: "blue"
        },
        "checkup": {
            field: "checkup",
            name: "验证标识",
            prop: function(v) { return constant.construction().constructionAccessory.isCheckup.keys[v.checkup]; },
            clazz: "red"
        }
    };

    // 根据配置 propertyArr 组装列定义, 配置为空则使用全部默认列
    var lineprops = (function() {

        if (pageConfig.propertyArr.length == 0) {

            var all = [];
            $.each(propertyMap, function (key, prop) { all.push(prop); });
            return all;
        }

        var props = [];
        $.each(pageConfig.propertyArr, function (i, key) {

            if (propertyMap[key]) props.push(propertyMap[key]);
        });
        return props;
    })();

    var linebtns = (function() {

        return {
            update: {
                name: "更新",
                clazz: "btn-yellow",
                handle: function(v) {
                    accessory.caid = v.caid;

                    accessory.items.numLimit.val(v.numLimit);
                    accessory.modals.updateModal.modal("show");
                },
                show: function() {
                    return btnVisible("update");
                }
            }
        };
    })();

    var buttons = (function() {

        var $adda = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('id', 'addConstructionAccessory').css("margin", "0px 3px");
        var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
        var $addspan = $('<span></span>').text('添加').appendTo($adda);

        return [$adda];
    })();

    var searcher = new Searcher();

    searcher.set("condList", "pagenation", "resultList", pageConfig.apiPage || api.construction.pageConstructionAccessory, {
        "constructionAccessory.cid": accessory.cid
    }, pageConfig.condArr, "constructionAccessoryPostDate", null, false, buttons);
    searcher.line("aoods.goods.name", lineprops, linebtns).render();

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