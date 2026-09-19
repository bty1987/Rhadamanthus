jQuery(function($) {

    var materialPlanNode = {

        mpnid: null,

        btns: {
            saveBtn: com.focusPage("#saveBtn").on("click", save)
        },

        modals: {
            updateModal: com.focusPage("#updateModal")
        },

        items: {
            type: com.focusPage("#type", "#updateModal"),
            cid: com.focusPage("#cid", "#updateModal"),
            bid: com.focusPage("#bid", "#updateModal"),
            cnid: com.focusPage("#cnid", "#updateModal"),
            action: com.focusPage("#action", "#updateModal"),
            anchor: com.focusPage("#anchor", "#updateModal"),
            offsetDay: com.focusPage("#offsetDay", "#updateModal"),
            comment: com.focusPage("#comment", "#updateModal")
        },

        status: {
            0: "启用",
            1: "停用"
        }
    };

    var TYPE_BRAND = 1;

    // 下拉数据: 维度/动作/锚点走 constant, 品类/品牌/节点走各自字典接口(bindData 第4参传占位串, 否则无空选项自动选中首项)
    materialPlanNode.items.type.bindData(constant.construction().materialPlan.type.datas, "key", "value", "请选择");
    materialPlanNode.items.action.bindData(constant.construction().materialPlan.action.datas, "key", "value", "请选择");
    materialPlanNode.items.anchor.bindData(constant.construction().materialPlan.anchor.datas, "key", "value", "请选择");

    com.post(api.data.queryConstructionNode, {}, function(res) {
        materialPlanNode.items.cnid.bindData(res.constructionNodes, "cnid", "name", "请选择");
    }, null, false);

    com.post(api.data.queryCategory, {}, function(res) {
        materialPlanNode.items.cid.bindData(res.categorys, "cid", "name", "请选择");
    }, null, false);

    // 品牌模式下品类作为品牌筛选第一步, 切换品类时联动刷新品牌
    materialPlanNode.items.type.on("change", function() {
        toggleBrand();
    }).trigger("change");

    materialPlanNode.items.cid.on("change", function() {

        var cid = materialPlanNode.items.cid.val();

        if (materialPlanNode.items.type.val() == TYPE_BRAND && cid) {
            com.post(api.data.queryBrandByCid, {
                "brand.cid": cid
            }, function(res) {
                materialPlanNode.items.bid.bindData(res.brands, "bid", "name", "请选择");
            }, null, false);
        } else {
            materialPlanNode.items.bid.empty().append($('<option></option>').val("").text("请选择"));
        }
    });

    function toggleBrand() {

        var isBrand = materialPlanNode.items.type.val() == TYPE_BRAND;

        com.focusPage("#brandGroup", "#updateModal").toggle(isBrand);

        if (!isBrand) materialPlanNode.items.bid.val("");
    }

    var searcher = new Searcher();

    searcher.base("condList", "pagenation", "resultList", api.data.pageMaterialPlanNode);

    searcher.condition(["materialplannode-type", "materialplannode-action", "materialplannode-anchor", "materialplannode-status", "materialplannode-nodename"]);

    searcher.history("materialPlanNodePostData");

    searcher.button([{
        id: "add",
        name: "创建",
        clazz: "btn-success",
        icon: "icon-plus"
    }]);

    var propertyArr = [{
        field: "type",
        name: "维度",
        prop: "type",
        clazz: "red",
        dataset: constant.construction().materialPlan.type.keys
    }, {
        field: "categoryName",
        name: "品类",
        prop: "categoryName",
        clazz: "blue"
    }, {
        field: "brandName",
        name: "品牌",
        prop: "brandName",
        clazz: "blue"
    }, {
        field: "nodeName",
        name: "施工节点",
        prop: "nodeName",
        clazz: "grey"
    }, {
        field: "action",
        name: "动作",
        prop: "action",
        clazz: "red",
        dataset: constant.construction().materialPlan.action.keys
    }, {
        field: "anchor",
        name: "时间锚点",
        prop: "anchor",
        clazz: "red",
        dataset: constant.construction().materialPlan.anchor.keys
    }, {
        field: "offsetDay",
        name: "偏移天数",
        prop: function(v) {
            return v.offsetDay > 0 ? "+" + v.offsetDay + "天" : v.offsetDay < 0 ? v.offsetDay + "天" : "当日";
        },
        clazz: "blue"
    }, {
        field: "status",
        name: "状态",
        prop: "status",
        clazz: "red",
        dataset: materialPlanNode.status
    }, {
        field: "comment",
        name: "说明",
        prop: "comment",
        clazz: "grey"
    }, {
        field: "createTime",
        name: "创建时间",
        prop: "createTime",
        clazz: "green"
    }, ];

    var linebtns = [{
        name: "编辑",
        clazz: "btn-yellow",
        handle: function(v) {

            materialPlanNode.mpnid = v.mpnid;

            materialPlanNode.items.type.val(v.type).trigger("change");

            if (v.type == TYPE_BRAND) {

                com.post(api.data.queryBrandByCid, {
                    "brand.cid": v.cid
                }, function(res) {

                    materialPlanNode.items.cid.val(v.cid);
                    materialPlanNode.items.bid.bindData(res.brands, "bid", "name", "请选择");
                    materialPlanNode.items.bid.val(v.bid);
                }, null, false);
            } else {
                materialPlanNode.items.cid.val(v.cid);
            }

            materialPlanNode.items.cnid.val(v.cnid);
            materialPlanNode.items.action.val(v.action);
            materialPlanNode.items.anchor.val(v.anchor);
            materialPlanNode.items.offsetDay.val(v.offsetDay);
            materialPlanNode.items.comment.val(v.comment);

            materialPlanNode.modals.updateModal.modal("show");

            return false;
        }
    }, {
        name: "停用",
        clazz: "btn-inverse",
        handle: function(v) {

            com.post(api.data.updateMaterialPlanNodeForStatus, {
                "materialPlanNode.mpnid": v.mpnid,
                "materialPlanNode.status": 1
            }, function() {
                searcher.doSearch();
            });

            return false;
        },
        show: function(v) {
            return v.status == 0;
        }
    }, {
        name: "启用",
        clazz: "btn-success",
        handle: function(v) {

            com.post(api.data.updateMaterialPlanNodeForStatus, {
                "materialPlanNode.mpnid": v.mpnid,
                "materialPlanNode.status": 0
            }, function() {
                searcher.doSearch();
            });

            return false;
        },
        show: function(v) {
            return v.status == 1;
        }
    }, ];

    searcher.line("categoryName", propertyArr, linebtns).render();

    com.focusPage('a[name="add"]', '#pagenation').on("click", function() {

        com.cleanItems(materialPlanNode.items);

        materialPlanNode.mpnid = null;

        materialPlanNode.items.type.val(0).trigger("change");

        materialPlanNode.modals.updateModal.modal("show");
    });

    function save() {

        if (com.validate("updateModal"))
            return false;

        var type = materialPlanNode.items.type.val();

        if (type == TYPE_BRAND) {
            if (!materialPlanNode.items.bid.val()) {
                com.showAlert(com.warning, "请选择品牌");
                return false;
            }
        } else {
            if (!materialPlanNode.items.cid.val()) {
                com.showAlert(com.warning, "请选择品类");
                return false;
            }
        }

        if (!materialPlanNode.items.cnid.val()) {
            com.showAlert(com.warning, "请选择施工节点");
            return false;
        }

        var options = {
            "materialPlanNode.type": type,
            "materialPlanNode.cnid": materialPlanNode.items.cnid.val(),
            "materialPlanNode.action": materialPlanNode.items.action.val(),
            "materialPlanNode.anchor": materialPlanNode.items.anchor.val(),
            "materialPlanNode.offsetDay": materialPlanNode.items.offsetDay.val() == "" ? 0 : materialPlanNode.items.offsetDay.val(),
            "materialPlanNode.comment": materialPlanNode.items.comment.val()
        };

        if (type == TYPE_BRAND) {
            options["materialPlanNode.bid"] = materialPlanNode.items.bid.val();
        } else {
            options["materialPlanNode.cid"] = materialPlanNode.items.cid.val();
        }

        var url = api.data.addMaterialPlanNode;

        if (materialPlanNode.mpnid) {
            options["materialPlanNode.mpnid"] = materialPlanNode.mpnid;
            url = api.data.updateMaterialPlanNode;
        }

        com.post(url, options, function() {

            searcher.doSearch();
            materialPlanNode.modals.updateModal.modal("hide");
        });
    }

});
