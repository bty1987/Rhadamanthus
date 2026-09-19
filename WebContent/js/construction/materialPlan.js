jQuery(function($) {

    var materialPlan = {

        construction: params.construction,

        mpid: null,

        modals: {
            materialPlanModal: com.focusPage("#materialPlanModal"),
            editMaterialPlanModal: com.focusPage("#editMaterialPlanModal")
        },

        btns: {
            addBtn: com.focusPage("#addBtn").on("click", function() {
                materialPlan.modals.materialPlanModal.modal("show");
            }),
            saveBtn: com.focusPage("#saveBtn").on("click", saveData),
            editBtn: com.focusPage("#editBtn").on("click", editData)
        },

        items: {
            type: com.focusPage("#type", "#materialPlanModal"),
            cid: com.focusPage("#cid", "#materialPlanModal"),
            bid: com.focusPage("#bid", "#materialPlanModal"),
            cnid: com.focusPage("#cnid", "#materialPlanModal"),
            action: com.focusPage("#action", "#materialPlanModal"),
            anchor: com.focusPage("#anchor", "#materialPlanModal"),
            offsetDay: com.focusPage("#offsetDay", "#materialPlanModal"),
            manualTime: com.focusPage("#manualTime", "#materialPlanModal"),
            comment: com.focusPage("#comment", "#materialPlanModal"),
            editAnchor: com.focusPage("#editAnchor", "#editMaterialPlanModal"),
            editOffsetDay: com.focusPage("#editOffsetDay", "#editMaterialPlanModal"),
            editManualTime: com.focusPage("#editManualTime", "#editMaterialPlanModal"),
            editComment: com.focusPage("#editComment", "#editMaterialPlanModal")
        }
    };

    var TYPE_BRAND = 1;

    // 获取页面控制参数(按公司差异化配置)
    var pageConfig = constructionPage.getConfig("materialPlan");

    function btnVisible(key) {

        return pageConfig.pageBtn.length == 0 || pageConfig.pageBtn.contains(key);
    }

    // 添加弹窗下拉: 维度/动作/锚点走 constant, 品类/品牌走字典, 节点取自本单工程进度(保证节点在排期内)
    materialPlan.items.type.bindData(constant.construction().materialPlan.type.datas, "key", "value", "请选择");
    materialPlan.items.action.bindData(constant.construction().materialPlan.action.datas, "key", "value", "请选择");
    materialPlan.items.anchor.bindData(constant.construction().materialPlan.anchor.datas, "key", "value", "请选择");
    materialPlan.items.editAnchor.bindData(constant.construction().materialPlan.anchor.datas, "key", "value", "请选择");

    com.post(api.data.queryCategory, {}, function(res) {
        materialPlan.items.cid.bindData(res.categorys, "cid", "name", "请选择");
    }, null, false);

    com.post(api.construction.queryConstructionScheduleByOrderId, {
        "constructionSchedule.orderId": materialPlan.construction.decoration.orderId
    }, function(res) {

        var nodes = [];

        $.each(res.constructionSchedules, function(i, v) {
            if (v.node && v.node.cnid) nodes.push({
                "key": v.node.cnid,
                "value": v.name
            });
        });

        materialPlan.items.cnid.bindData(nodes, "key", "value", "请选择");
    }, null, false);

    materialPlan.items.type.on("change", function() {
        com.focusPage("#brandGroup", "#materialPlanModal").toggle(materialPlan.items.type.val() == TYPE_BRAND);
    }).trigger("change");

    materialPlan.items.cid.on("change", function() {

        var cid = materialPlan.items.cid.val();

        if (materialPlan.items.type.val() == TYPE_BRAND && cid) {
            com.post(api.data.queryBrandByCid, {
                "brand.cid": cid
            }, function(res) {
                materialPlan.items.bid.bindData(res.brands, "bid", "name", "请选择");
            }, null, false);
        } else {
            materialPlan.items.bid.empty().append($('<option></option>').val("").text("请选择"));
        }
    });

    var searcher = new Searcher();

    searcher.set("pageltList", "pageltList", "materialPlans", pageConfig.apiPage || api.construction.queryMaterialPlanByOrderId, {
        "materialPlan.orderId": materialPlan.construction.decoration.orderId
    }, pageConfig.condArr, null, "materialPlans", true);

    var propertyMap = {
        "nodeName": {
            field: "nodeName",
            name: "施工节点",
            prop: "nodeName",
            clazz: "grey"
        },
        "type": {
            field: "type",
            name: "维度",
            prop: "type",
            clazz: "red",
            dataset: constant.construction().materialPlan.type.keys
        },
        "categoryName": {
            field: "categoryName",
            name: "品类",
            prop: "categoryName",
            clazz: "blue"
        },
        "brandName": {
            field: "brandName",
            name: "品牌",
            prop: "brandName",
            clazz: "blue"
        },
        "action": {
            field: "action",
            name: "动作",
            prop: "action",
            clazz: "red",
            dataset: constant.construction().materialPlan.action.keys
        },
        "anchor": {
            field: "anchor",
            name: "锚点",
            prop: "anchor",
            clazz: "grey",
            dataset: constant.construction().materialPlan.anchor.keys
        },
        "offsetDay": {
            field: "offsetDay",
            name: "偏移天数",
            prop: function(v) {
                return v.offsetDay > 0 ? "+" + v.offsetDay + "天" : v.offsetDay < 0 ? v.offsetDay + "天" : "当日";
            },
            clazz: "blue"
        },
        "planTime": {
            field: "planTime",
            name: "计划时点",
            prop: function(v) {
                return v.planTime ? v.planTime : "待定";
            },
            clazz: "green"
        },
        "manualTime": {
            field: "manualTime",
            name: "指定时点",
            prop: "manualTime",
            clazz: "green"
        },
        "autoStatus": {
            field: "autoStatus",
            name: "系统履约",
            prop: "autoStatus",
            clazz: "red",
            dataset: constant.construction().materialPlan.autoStatus.keys
        },
        "autoTime": {
            field: "autoTime",
            name: "履约时间",
            prop: "autoTime",
            clazz: "green"
        },
        "salesCount": {
            field: "salesCount",
            name: "销售单数",
            prop: function(v) {
                return v.salesCount ? v.salesCount + "张" : "-";
            },
            clazz: "blue"
        },
        "status": {
            field: "status",
            name: "状态",
            prop: function(v) {

                var status = constant.construction().materialPlan.status.keys[v.status];

                if (v.status == 0 && v.overdue == 1) status += "(已逾期)";

                return status;
            },
            clazz: "red"
        },
        "actualTime": {
            field: "actualTime",
            name: "完成时间",
            prop: "actualTime",
            clazz: "green"
        },
        "comment": {
            field: "comment",
            name: "说明",
            prop: "comment",
            clazz: "grey"
        }
    };

    var lineprops = (function() {

        if (pageConfig.propertyArr.length == 0) {

            var all = [];
            $.each(propertyMap, function(key, prop) {
                all.push(prop);
            });
            return all;
        }

        var props = [];
        $.each(pageConfig.propertyArr, function(i, key) {

            if (propertyMap[key]) props.push(propertyMap[key]);
        });
        return props;
    })();

    var linebtus = [{
        name: "编辑",
        clazz: "btn-purple",
        handle: function(v) {

            com.cleanItems(materialPlan.items);
            materialPlan.mpid = v.mpid;

            materialPlan.items.editAnchor.val(v.anchor);
            materialPlan.items.editOffsetDay.val(v.offsetDay);
            materialPlan.items.editManualTime.val(v.manualTime);
            materialPlan.items.editComment.val(v.comment);

            materialPlan.modals.editMaterialPlanModal.modal("show");

            return false;
        },
        show: function() {
            return btnVisible("edit");
        }
    }, {
        name: "完成",
        clazz: "btn-success",
        handle: function(v) {

            com.post(api.construction.confirmMaterialPlan, {
                "materialPlan.mpid": v.mpid
            }, function() {
                com.showAlert(com.info, "操作成功");
                searcher.doSearch();
            });

            return false;
        },
        show: function(v) {
            return btnVisible("confirm") && v.status == 0;
        }
    }, {
        name: "取消",
        clazz: "btn-warning",
        handle: function(v) {

            com.post(api.construction.cancelMaterialPlan, {
                "materialPlan.mpid": v.mpid
            }, function() {
                com.showAlert(com.info, "操作成功");
                searcher.doSearch();
            });

            return false;
        },
        show: function(v) {
            return btnVisible("cancel") && (v.status == 0 || v.status == 1);
        }
    }, {
        name: "恢复",
        clazz: "btn-info",
        handle: function(v) {

            com.post(api.construction.cancelMaterialPlan, {
                "materialPlan.mpid": v.mpid
            }, function() {
                com.showAlert(com.info, "操作成功");
                searcher.doSearch();
            });

            return false;
        },
        show: function(v) {
            return btnVisible("cancel") && v.status == 2;
        }
    }, {
        name: "删除",
        clazz: "btn-danger",
        handle: function(v) {

            com.post(api.construction.deleteMaterialPlan, {
                "materialPlan.mpid": v.mpid
            }, function() {
                com.showAlert(com.info, "删除成功");
                searcher.doSearch();
            });

            return false;
        },
        show: function() {
            return btnVisible("del");
        }
    }, ];

    searcher.line("nodeName", lineprops, linebtus).render();

    com.focusPage('#makeBtn').on("click", function() {

        com.post(api.construction.makeMaterialPlan, {
            "materialPlan.orderId": materialPlan.construction.decoration.orderId
        }, function() {
            com.showAlert(com.info, "操作成功");
            searcher.doSearch();
        });
    });

    function saveData() {

        if (com.validate('materialPlanModal'))
            return false;

        var type = materialPlan.items.type.val();

        if (type == TYPE_BRAND) {
            if (!materialPlan.items.bid.val()) {
                com.showAlert(com.warning, "请选择品牌");
                return false;
            }
        } else {
            if (!materialPlan.items.cid.val()) {
                com.showAlert(com.warning, "请选择品类");
                return false;
            }
        }

        if (!materialPlan.items.cnid.val()) {
            com.showAlert(com.warning, "请选择施工节点");
            return false;
        }

        var options = {
            "materialPlan.orderId": materialPlan.construction.decoration.orderId,
            "materialPlan.type": type,
            "materialPlan.cnid": materialPlan.items.cnid.val(),
            "materialPlan.action": materialPlan.items.action.val(),
            "materialPlan.anchor": materialPlan.items.anchor.val(),
            "materialPlan.offsetDay": materialPlan.items.offsetDay.val() == "" ? 0 : materialPlan.items.offsetDay.val(),
            "materialPlan.manualTime": materialPlan.items.manualTime.val(),
            "materialPlan.comment": materialPlan.items.comment.val()
        };

        if (type == TYPE_BRAND) {
            options["materialPlan.brandId"] = materialPlan.items.bid.val();
        } else {
            options["materialPlan.categoryId"] = materialPlan.items.cid.val();
        }

        com.post(api.construction.addMaterialPlan, options, function() {

            com.showAlert(com.info, "操作成功");

            searcher.doSearch();

            materialPlan.modals.materialPlanModal.modal("hide");
        });
    }

    function editData() {

        if (com.validate('editMaterialPlanModal'))
            return false;

        var options = {
            "materialPlan.mpid": materialPlan.mpid,
            "materialPlan.anchor": materialPlan.items.editAnchor.val(),
            "materialPlan.offsetDay": materialPlan.items.editOffsetDay.val() == "" ? 0 : materialPlan.items.editOffsetDay.val(),
            "materialPlan.manualTime": materialPlan.items.editManualTime.val(),
            "materialPlan.comment": materialPlan.items.editComment.val()
        };

        com.post(api.construction.updateMaterialPlan, options, function() {

            com.showAlert(com.info, "操作成功");

            searcher.doSearch();

            materialPlan.modals.editMaterialPlanModal.modal("hide");
        });
    }

});
