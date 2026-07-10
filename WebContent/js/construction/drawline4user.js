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

        // 质检阶段对应的节点 sort 值, 从后端动态获取(按节点名匹配), 替代硬编码 7/8/9/11/12
        qualiterSchedules: {
            qualiter1: 0, // 水暖质检
            qualiter2: 0, // 电工质检
            qualiter3: 0, // 瓦工质检
            qualiter4: 0, // 木工质检
            qualiter5: 0  // 油工质检
        },
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

    // 质检阶段与节点名称的对应关系
    var qualiterNodeNames = {
        qualiter1: "水暖",
        qualiter2: "电工",
        qualiter3: "瓦工",
        qualiter4: "木工",
        qualiter5: "油工"
    };

    // 加载当前公司施工节点, 按名称匹配出各质检阶段的 sort 值
    com.post(api.data.queryConstructionNode, {}, function(res) {

        var nodeMap = {};

        $.each(res.constructionNodes, function(i, node) {
            nodeMap[node.name] = node.sort;
        });

        $.each(qualiterNodeNames, function(key, name) {
            if (nodeMap[name] !== undefined) {
                drawline.qualiterSchedules[key] = nodeMap[name];
            }
        });
    }, null, false);

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

    // 获取页面控制参数(按公司差异化配置)
    var pageConfig = constructionPage.getConfig("drawline4user");

    // pageBtn 配置为空时, 所有按钮按原逻辑显示; 否则需在 pageBtn 中存在
    function btnVisible(key) {

        return pageConfig.pageBtn.length == 0 || pageConfig.pageBtn.contains(key);
    }

    // 字段定义映射: key 对应配置 propertyArr 中的 value
    var propertyMap = {
        "orderId": {
            field: "orderId",
            name: "装修单",
            prop: "orderId",
            clazz: "blue",
            click: function(btn, v) {
                tools.decoration.info(btn, v.orderId);
            }
        },
        "village": {
            field: "house.village.name",
            name: "楼盘",
            prop: "house.village.name",
            clazz: "grey",
            click: function(btn, v) {
                tools.house.info(btn, v.house.hid);
            }
        },
        "houseNumber": {
            field: "house.houseNumber",
            name: "楼号",
            prop: "house.houseNumber",
            clazz: "grey"
        },
        "customer": {
            field: "customer.name",
            name: "客户",
            prop: "customer.name",
            clazz: "grey",
            click: function(btn, v) {
                tools.customer.info(btn, v.customer.cid);
            }
        },
        "designer": {
            field: "designer.currentName",
            name: "设计师",
            prop: "designer.currentName",
            clazz: "grey",
            click: function(btn, v) {
                tools.personel.info(btn, v.designer.userId);
            }
        },
        "supervisor": {
            field: "supervisor.currentName",
            name: "监理",
            prop: function(v) { return v.supervisor == null ? "" : v.supervisor.currentName; },
            clazz: "grey",
            click: function(btn, v) {
                tools.personel.info(btn, v.supervisor.userId);
            }
        },
        "buildArea": {
            field: "house.buildArea",
            name: "面积",
            prop: "house.buildArea",
            clazz: "blue"
        },
        "orderTotalPrice": {
            field: "orderTotalPrice",
            name: "合同额",
            prop: "orderTotalPrice",
            clazz: "blue"
        },
        "version": {
            field: "version.name",
            name: "报价版本",
            prop: "version.name",
            clazz: "grey"
        },
        "createTime": {
            field: "createTime",
            name: "创建时间",
            prop: "createTime",
            clazz: "green"
        },
        "projectStatus": {
            field: "projectStatus",
            name: "进度",
            prop: function(v) { return constant.decoration().decoration.projectStatus.keys[v.projectStatus]; },
            clazz: "red"
        },
        "status": {
            field: "status",
            name: "状态",
            prop: function(v) { return constant.decoration().decoration.status.keys[v.status]; },
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
            deploy: {
                name: "人员部署",
                clazz: "btn-yellow",
                handle: function(v) {
                    showSetup(v);
                },
                show: function() {
                    return btnVisible("deploy");
                }
            }
        };
    })();

    var searcher = new Searcher();

    searcher.set("condList", "pagenation", "resultList", pageConfig.apiPage || api.construction.pageConstruction, null, pageConfig.condArr.length > 0 ? pageConfig.condArr : ['decoration-orderId', 'decoration-village', 'decoration-houseNumber', 'decoration-designer'], "drawLinePersonPostData", null, false, null);
    searcher.line("orderId", lineprops, linebtns).render();

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

                        // 按 schedule(node.sort) 反查对应哪个质检阶段, 动态匹配替代硬编码 7/8/9/11/12
                        $.each(drawline.qualiterSchedules, function(key, schedule) {
                            if (v.schedule == schedule && schedule != 0) {
                                com.updateTypeahead(key, v.user.userId, v.user.userName);
                            }
                        });
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
            "qualiters[0].schedule": drawline.qualiterSchedules.qualiter1,

            "qualiters[1].user.userId": com.typeahead("qualiter2"),
            "qualiters[1].schedule": drawline.qualiterSchedules.qualiter2,

            "qualiters[2].user.userId": com.typeahead("qualiter3"),
            "qualiters[2].schedule": drawline.qualiterSchedules.qualiter3,

            "qualiters[3].user.userId": com.typeahead("qualiter4"),
            "qualiters[3].schedule": drawline.qualiterSchedules.qualiter4,

            "qualiters[4].user.userId": com.typeahead("qualiter5"),
            "qualiters[4].schedule": drawline.qualiterSchedules.qualiter5
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
