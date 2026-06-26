jQuery(function($) {

    var drawline = {

        btns: {
            cancelBtn: com.focusPage("#cancelBtn"),
            deployedBtn: com.focusPage("#deployedBtn")
        },

        modals: {
            setupModal: com.focusPage("#setupModal")
        },

        items: {
            orderId: com.focusPage("#orderId"),
            conpanyName: com.focusPage("#conpanyName"),
            conpany: com.focusPage("#conpany"),
        },

        decorationStatus: {},
        constructionNodes: {},
    };

    drawline.btns.deployedBtn.bindClick(deployed);

    drawline.modals.setupModal.on("hide.bs.modal", function() {

        com.cleanItems(drawline.items);
        com.cleanTypeahead("supervisor");
        com.cleanTypeahead("qualiter1");
        com.cleanTypeahead("qualiter2");
        com.cleanTypeahead("qualiter3");
        com.cleanTypeahead("qualiter4");
        com.cleanTypeahead("qualiter5");
        com.closeTip();
    });

    com.initTypeahead('supervisor', api.personel.queryUserByPinyin, "pinyinName", {
        "departmentType.name": "工程部",
        "user.status": 0
    }, "autoFillKeyValue", "key", "value", null);

    com.initTypeahead('qualiter1', api.personel.queryUserByPinyin, "pinyinName", {"departmentType.name" : "", "user.status" : 0}, "autoFillKeyValue", "key", "value", null);
    com.initTypeahead('qualiter2', api.personel.queryUserByPinyin, "pinyinName", {"departmentType.name" : "", "user.status" : 0}, "autoFillKeyValue", "key", "value", null);
    com.initTypeahead('qualiter3', api.personel.queryUserByPinyin, "pinyinName", {"departmentType.name" : "", "user.status" : 0}, "autoFillKeyValue", "key", "value", null);
    com.initTypeahead('qualiter4', api.personel.queryUserByPinyin, "pinyinName", {"departmentType.name" : "", "user.status" : 0}, "autoFillKeyValue", "key", "value", null);
    com.initTypeahead('qualiter5', api.personel.queryUserByPinyin, "pinyinName", {"departmentType.name" : "", "user.status" : 0}, "autoFillKeyValue", "key", "value", null);

    com.post(api.system.queryCompany, {
        "company.atttype": "3"
    }, function(res) {

        res.companys.unshift("");
        drawline.items.conpany.bindData(res.companys, "cid", "name", false);
    });

    function buildDrawline4userLineprops() {

        return [{
            field: "orderId",
            name: "装修单",
            prop: "orderId",
            clazz: "blue",
            click: function(btn, v) {
                tools.decoration.info(btn, v.orderId);
            }
        }, {
            field: "house.village.name",
            name: "楼盘",
            prop: "house.village.name",
            clazz: "grey",
            click: function(btn, v) {
                tools.house.info(btn, v.house.hid);
            }
        }, {
            field: "house.houseNumber",
            name: "楼号",
            prop: "house.houseNumber",
            clazz: "grey"
        }, {
            field: "customer.name",
            name: "客户",
            prop: "customer.name",
            clazz: "grey",
            click: function(btn, v) {
                tools.customer.info(btn, v.customer.cid);
            }
        }, {
            field: "designer.currentName",
            name: "设计师",
            prop: "designer.currentName",
            clazz: "grey",
            click: function(btn, v) {
                tools.personel.info(btn, v.designer.userId);
            }
        }, {
            field: "supervisor.currentName",
            name: "监理",
            prop: function(v) { return v.supervisor == null ? "" : v.supervisor.currentName; },
            clazz: "grey",
            click: function(btn, v) {
                tools.personel.info(btn, v.supervisor.userId);
            }
        }, {
            field: "house.buildArea",
            name: "面积",
            prop: "house.buildArea",
            clazz: "blue"
        }, {
            field: "orderTotalPrice",
            name: "合同额",
            prop: "orderTotalPrice",
            clazz: "blue"
        }, {
            field: "version.name",
            name: "报价版本",
            prop: "version.name",
            clazz: "grey"
        }, {
            field: "createTime",
            name: "创建时间",
            prop: "createTime",
            clazz: "green"
        }, {
            field: "projectStatus",
            name: "进度",
            prop: function(v) { return constant.decoration().decoration.projectStatus.keys[v.projectStatus]; },
            clazz: "red"
        }, {
            field: "status",
            name: "状态",
            prop: function(v) { return constant.decoration().decoration.status.keys[v.status]; },
            clazz: "red"
        }];
    }

    function buildDrawline4userLinebtns() {

        return {
            deploy: {
                name: "人员部署",
                clazz: "btn-yellow",
                handle: function(v) {
                    showSetup(v);
                }
            }
        };
    }

    var searcher = new Searcher();

    searcher.set("condList", "pagenation", "resultList", api.construction.pageConstruction, null, ['decoration-orderId', 'decoration-village', 'decoration-houseNumber', 'decoration-designer'], "drawLinePersonPostData", null, true, null);
    searcher.line("orderId", buildDrawline4userLineprops(), buildDrawline4userLinebtns()).render();

    function showSetup(v) {

        var options = {
            "construction.orderId": v.orderId
        };

        var decoration = null;

        com.post(api.decoration.queryDecorationForCommonByOrderId, {
            "decoration.orderId": v.orderId
        }, function(res) {

            decoration = res.decoration;
        }, null, false);

        com.post(api.system.queryCompanyByCid, {
            "company.cid": decoration.conpany
        }, function(res) {

            drawline.items.conpanyName.html(res.company.name);
        });

        com.post(api.construction.queryConstructionByOrderId, options, function(res) {

            if (res.construction.supervisor) {
                com.updateTypeahead("supervisor", res.construction.supervisor.userId, res.construction.supervisor.userName);
            } else {
                com.cleanTypeahead("supervisor");
            }

            com.post(api.construction.queryQualiter, {
                "qualiter.decoration.orderId": res.construction.orderId
            }, function(e) {

                $.each(e.qualiters, function(i, v) {

                    if (v.user) {

                        if (v.schedule == 7) {
                            com.updateTypeahead("qualiter1", v.user.userId, v.user.userName);
                        }
                        if (v.schedule == 8) {
                            com.updateTypeahead("qualiter2", v.user.userId, v.user.userName);
                        }
                        if (v.schedule == 9) {
                            com.updateTypeahead("qualiter3", v.user.userId, v.user.userName);
                        }
                        if (v.schedule == 11) {
                            com.updateTypeahead("qualiter4", v.user.userId, v.user.userName);
                        }
                        if (v.schedule == 12) {
                            com.updateTypeahead("qualiter5", v.user.userId, v.user.userName);
                        }
                    } else {
                        com.cleanTypeahead("qualiter1");
                        com.cleanTypeahead("qualiter2");
                        com.cleanTypeahead("qualiter3");
                        com.cleanTypeahead("qualiter4");
                        com.cleanTypeahead("qualiter5");
                    }
                });

            });

            drawline.modals.setupModal.modal("show");
        });

        drawline.items.orderId = v.orderId;
    }

    function deployed() {

        if (com.validate("setupModal")) {
            return false;
        }

        var options = {
            "construction.orderId": drawline.items.orderId,
            "construction.supervisor.userId": com.typeahead("supervisor"),

            "qualiters[0].user.userId": com.typeahead("qualiter1"),
            "qualiters[0].schedule": 7,

            "qualiters[1].user.userId": com.typeahead("qualiter2"),
            "qualiters[1].schedule": 8,

            "qualiters[2].user.userId": com.typeahead("qualiter3"),
            "qualiters[2].schedule": 9,

            "qualiters[3].user.userId": com.typeahead("qualiter4"),
            "qualiters[3].schedule": 11,

            "qualiters[4].user.userId": com.typeahead("qualiter5"),
            "qualiters[4].schedule": 12
        };

        if (drawline.items.conpany.val()) {
            options["construction.decoration.conpany"] = drawline.items.conpany.val();
        }

        com.post(api.construction.updateConstructionByOrderId, options, function(res) {

            com.showAlert(com.info, "操作成功");
            searcher.doSearch();

            drawline.modals.setupModal.modal("hide");
        });
    }
});
