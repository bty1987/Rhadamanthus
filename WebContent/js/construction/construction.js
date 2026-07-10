jQuery(function($) {

    var construction = {

        constructionSchedule: {},

        modals: {
            constructionInfoModal: com.focusPage("#constructionInfoModal"),
            updateConstructionModal: com.focusPage("#updateConstructionModal"),
            updateTerminalStatusModal: com.focusPage("#updateTerminalStatusModal")
        },

        btns: {
            saveBtn: com.focusPage("#saveBtn"),
            updateConstructionBtn: com.focusPage("#updateConstructionBtn"),
            updateTerminalStatusBtn: com.focusPage("#updateTerminalStatusBtn")
        },

        items: {
            ishovel: com.focusPage("#ishovel"),
            iskey: com.focusPage("#iskey"),
            timeLimit: com.focusPage("#timeLimit"),
            finishTime: com.focusPage("#finishTime"),
            keyTime: com.focusPage("#keyTime"),
            drawlineTime: com.focusPage("#drawlineTime"),
            designTime: com.focusPage("#designTime"),
            isCeremony: com.focusPage("#isCeremony"),
            comment: com.focusPage("#comment"),
            terminalStatus: com.focusPage("#terminalStatus","#updateTerminalStatusModal")
        },
        updateItems: {
            accessoryLimit: com.focusPage("#accessoryLimit"),
            salaryLimit: com.focusPage("#salaryLimit"),
        },
        cid: null,
        isAccessory: {},
        constructionNodes: {},
        quotationDetail: {},
    };

    construction.btns.saveBtn.bindClick(saveData);
    construction.btns.updateConstructionBtn.bindClick(update);
    construction.btns.updateTerminalStatusBtn.bindClick(updateTerminalStatus);

    construction.modals.constructionInfoModal.on("hide.bs.modal", function() {

        com.cleanItems(construction.items);
        com.closeTip();
    });

    construction.modals.updateConstructionModal.on("hide.bs.modal", function() {

        com.cleanItems(construction.updateItems);
        com.closeTip();
    });

    construction.modals.updateTerminalStatusModal.on("hide.bs.modal", function() {

        com.cleanItems(construction.items);
        com.closeTip();
    });

    com.datetime(construction.items.finishTime);
    com.datetime(construction.items.keyTime);
    com.datetime(construction.items.drawlineTime);
    com.datetime(construction.items.designTime);

    construction.items.terminalStatus.bindData(constant.construction().construction.terminalStatus.datas, "key", "value");
    construction.items.ishovel.bindData(constant.construction().constructionInfo.isHovel.datas, "key", "value");
    construction.items.iskey.bindData(constant.construction().constructionInfo.isKey.datas, "key", "value");
    construction.items.isCeremony.bindData(constant.construction().constructionInfo.isCeremony.datas, "key", "value");

    // 获取页面控制参数(按公司差异化配置)
    var pageConfig = constructionPage.getConfig("construction");

    var searcher = new Searcher();

    searcher.base("constructionCondList", "constructionPagenation", "constructionResultList", pageConfig.apiPage || api.construction.pageConstructionForBase);

    // 条件: 优先取配置, 配置为空则回退到默认条件
    searcher.condition(pageConfig.condArr.length > 0 ? pageConfig.condArr : ["decoration-orderId", "decoration-village", "decoration-houseNumber", "decoration-designer", "decoration-projectStatus", "construction-process", "construction-startTime", "construction-endTime"]);

    // 字段定义映射: key 对应配置 propertyArr 中的 value
    var propertyMap = {
        "decoration": {
            field: "decoration",
            name: "装修单",
            prop: "decoration.orderId",
            clazz: "blue",
            click: function(btn, v) {

                tools.decoration.info(btn, v.decoration.orderId);
            }
        },
        "village": {
            field: "village",
            name: "楼盘",
            prop: "decoration.house.village.name",
            clazz: "grey",
            click: function(btn, v) {

                tools.house.info(btn, v.decoration.house.hid);
            }
        },
        "houseNumber": {
            field: "houseNumber",
            name: "楼号",
            prop: "decoration.house.houseNumber",
            clazz: "grey"
        },
        "customer": {
            field: "customer",
            name: "客户",
            prop: "decoration.customer.name",
            clazz: "grey",
            click: function(btn, v) {

                tools.customer.info(btn, v.decoration.customer.cid);
            }
        },
        "designer": {
            field: "designer",
            name: "设计师",
            prop: "decoration.designer.userName",
            clazz: "grey",
            click: function(btn, v) {

                tools.personel.info(btn, v.decoration.designer.userId);
            }
        },
        "supervisor": {
            field: "supervisor",
            name: "监理",
            prop: "supervisor.userName",
            clazz: "grey",
            click: function(btn, v) {

                tools.personel.info(btn, v.supervisor.userId);
            }
        },
        "orderTotalPrice": {
            field: "orderTotalPrice",
            name: "总价",
            prop: "decoration.orderTotalPrice",
            clazz: "blue"
        },
        "version": {
            field: "version",
            name: "报价版本",
            prop: "decoration.version.name",
            clazz: "grey"
        },
        "buildArea": {
            field: "buildArea",
            name: "面积",
            prop: "decoration.house.buildArea",
            clazz: "blue"
        },
        "projectStatus": {
            field: "projectStatus",
            name: "工程状态",
            prop: "decoration.projectStatus",
            dataset: constant.decoration().decoration.projectStatus.keys,
            clazz: "red"
        },
        "process": {
            field: "process",
            name: "施工状态",
            prop: "process",
            dataset: constant.construction().construction.process.keys,
            clazz: "red"
        },
        "createTime": {
            field: "createTime",
            name: "创建时间",
            prop: "createTime",
            clazz: "green"
        },
        "preStartTime": {
            field: "preStartTime",
            name: "预计开工时间",
            prop: "preStartTime",
            clazz: "green"
        },
        "preEndTime": {
            field: "preEndTime",
            name: "预计完工时间",
            prop: "preEndTime",
            clazz: "green"
        },
        "startTime": {
            field: "startTime",
            name: "开工时间",
            prop: "startTime",
            clazz: "green"
        },
        "endTime": {
            field: "endTime",
            name: "完工时间",
            prop: "endTime",
            clazz: "green"
        },
        "finishTime": {
            field: "finishTime",
            name: "验收时间",
            prop: "finishTime",
            clazz: "green"
        },
        "period": {
            field: "period",
            name: "预计工期",
            prop: "period",
            clazz: "blue"
        },
        "processTime": {
            field: "processTime",
            name: "竣工交付时间",
            prop: "processTime",
            clazz: "green"
        },
        "accessoryLimit": {
            field: "accessoryLimit",
            name: "辅料额上限",
            prop: "accessoryLimit",
            clazz: "blue"
        },
        "salaryLimit": {
            field: "salaryLimit",
            name: "工费上限",
            prop: "salaryLimit",
            clazz: "blue"
        },
        "accessory": {
            field: "accessory",
            name: "辅料控制",
            prop: "accessory",
            dataset: constant.construction().construction.isAccessory.keys,
            clazz: "red"
        },
        "balanceStatus": {
            field: "balanceStatus",
            name: "结算状态",
            prop: "balanceStatus",
            dataset: constant.construction().construction.balance.keys,
            clazz: "red"
        },
        "terminalStatus": {
            field: "terminalStatus",
            name: "终止状态",
            prop: "terminalStatus",
            dataset: constant.construction().construction.terminalStatus.keys,
            clazz: "red"
        }
    };

    // 根据配置 propertyArr 组装列定义, 配置为空则使用全部默认列
    var lineprops = (function () {

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

    // pageBtn 配置为空时, 所有按钮按原逻辑显示; 否则需在 pageBtn 中存在
    function btnVisible(key) {

        return pageConfig.pageBtn.length == 0 || pageConfig.pageBtn.contains(key);
    }

    var linebtns = [{
        name: "信息",
        clazz: "btn-yellow",
        handle: function(v) {

            com.post(api.construction.queryConstructionInfoByOrderId, {
                "constructionInfo.orderId": v.decoration.orderId
            }, function(res) {

                data = res.constructionInfo;

                construction.items.orderId = v.decoration.orderId;
                construction.items.ishovel.val(data.ishovel);
                construction.items.iskey.val(data.iskey);
                construction.items.isCeremony.val(data.isCeremony);
                construction.items.timeLimit.val(data.timeLimit);

                if (data.finishTime != null) {
                    construction.items.finishTime.val(data.finishTime.substr(0, 10));
                }
                if (data.keyTime != null) {
                    construction.items.keyTime.val(data.keyTime.substr(0, 10));
                }
                if (data.drawlineTime != null) {
                    construction.items.drawlineTime.val(data.drawlineTime.substr(0, 10));
                }
                if (data.designTime != null) {
                    construction.items.designTime.val(data.designTime.substr(0, 10));
                }

                construction.items.comment.val(data.comment);
            });

            construction.modals.constructionInfoModal.modal("show");

            return false;
        },
        show: function(v) {

            return btnVisible("info");
        }
    }, {
        name: "查看",
        clazz: "btn-success",
        handle: function(v) {

            params.construction.orderId = v.decoration.orderId;

            com.popup4page("#stockRecordPopUp", "/views/construction/supervision4detail.html", "查看");

            return false;
        },
        show: function(v) {

            return btnVisible("view");
        }
    }, {
        name: "记录",
        clazz: "btn-yellow",
        handle: function(v) {

            params.orderId = v.decoration.orderId;

            com.popup4page("#stockRecordPopUp", api.index.constructionRecordIndex.url, "记录");

            return false;
        },
        show: function(v) {

            return btnVisible("record");
        }
    }, {
        name: "增减项",
        clazz: "btn-warning",
        handle: function(v) {

            params.quotation.orderId = v.decoration.orderId;
            params.quotation.type = v.decoration.type;

            params.historyPage = api.index.supervisionIndex.url;

            com.switchPage(api.index.addReduceIndex.url);

            return false;
        },
        show: function(v) {

            return btnVisible("addReduce");
        }
    }, {
        name: "返工",
        clazz: "btn-inverse",
        handle: function(v) {

            params.construction.orderId = v.decoration.orderId;

            com.popup4page("#stockRecordPopUp", "/views/construction/supervision4rework.html", "返工");

            return false;
        },
        show: function(v) {

            return btnVisible("rework");
        }
    }, {
        name: "工程节点",
        clazz: "btn-yellow",
        handle: function(v) {

            params.construction = v;

            com.popup("工程节点", api.index.constructionNode2printIndex.url, null, null, true);

            return false;
        },
        show: function(v) {

            return btnVisible("constructionNode");
        }
    }, {
        name: "工人工费",
        clazz: "btn-warning",
        handle: function(v) {

            params.construction = v;

            com.popup("工人工费", api.index.workerSalary2printIndex.url, null, null, true);

            return false;
        },
        show: function(v) {

            return btnVisible("workerSalary");
        }
    }, {
        name: "工程辅料",
        clazz: "btn-purple",
        handle: function(v) {

            params.construction.orderId = v.decoration.orderId;
            params.construction.cid = v.cid;

            com.popup4page("#stockRecordPopUp", "/views/construction/accessory.html", "工程辅料");

            return false;
        },
        show: function(v) {

            return btnVisible("accessory");
        }
    }, {
        name: "更新",
        clazz: "btn-yellow",
        handle: function(v) {

            construction.cid = v.cid;
            construction.updateItems.accessoryLimit.val(v.accessoryLimit);
            construction.updateItems.salaryLimit.val(v.salaryLimit);

            construction.modals.updateConstructionModal.modal("show");

            return false;
        },
        show: function(v) {

            return btnVisible("update");
        }
    }, {
        name: "辅料开启",
        clazz: "btn-danger",
        handle: function(v) {

            com.post(api.construction.openConstruction, {
                "construction.cid": v.cid
            }, function(res) {

                com.showAlert(com.info, "创建辅料单状态开启");
                searcher.doSearch();
            });

            return false;
        },
        show: function(v) {

            return btnVisible("accessoryOpen") && (v.accessory == constant.construction().construction.ISACCESSORY_DISABLE_INT);
        }
    }, {
        name: "辅料锁定",
        clazz: "btn-pink",
        handle: function(v) {

            com.post(api.construction.lockConstruction, {
                "construction.cid": v.cid
            }, function(res) {

                com.showAlert(com.info, "创建辅料单状态锁定");
                searcher.doSearch();
            });

            return false;
        },
        show: function(v) {

            return btnVisible("accessoryLock") && (v.accessory == constant.construction().construction.ISACCESSORY_ENABLE_INT);
        }
    }, {
        name: "结算",
        clazz: "btn-success",
        handle: function(v) {

            com.post(api.construction.balanceConstruction, {
                "construction.cid": v.cid
            }, function(res) {

                searcher.doSearch();
            });

            return false;
        },
        show: function(v) {

            return btnVisible("balance") && (v.accessory == constant.construction().construction.ISACCESSORY_ENABLE_INT);
        }
    }, {
        name: "终止",
        clazz: "btn-yellow",
        handle: function(v) {

            construction.cid = v.cid;
            construction.modals.updateTerminalStatusModal.modal("show");

            return false;
        },
        show: function(v) {

            return btnVisible("terminal");
        }
    }];

    searcher.line("decoration.orderId", lineprops, linebtns).render();

    function saveData() {

        var options = {
            "constructionInfo.orderId": construction.items.orderId,
            "constructionInfo.decoration.orderId": construction.items.orderId,
            "constructionInfo.timeLimit": construction.items.timeLimit.val(),
            "constructionInfo.ishovel": construction.items.ishovel.val(),
            "constructionInfo.iskey": construction.items.iskey.val(),
            "constructionInfo.isCeremony": construction.items.isCeremony.val(),
            "constructionInfo.finishTime": construction.items.finishTime.val() + " 00:00:00",
            "constructionInfo.keyTime": construction.items.keyTime.val() + " 00:00:00",
            "constructionInfo.drawlineTime": construction.items.drawlineTime.val() + " 00:00:00",
            "constructionInfo.designTime": construction.items.designTime.val() + " 00:00:00",
            "constructionInfo.comment": construction.items.comment.val()
        };

        com.post(api.construction.updateConstructionInfoByOrderId, options, function(res) {

            com.showAlert(com.info, "操作成功");

            construction.modals.constructionInfoModal.modal("hide");
        });
    }

    function update() {

        if (com.validate("updateConstructionModal")) {
            return false;
        }

        var options = {
            "construction.cid": construction.cid,
            "construction.accessoryLimit": construction.updateItems.accessoryLimit.val(),
            "construction.salaryLimit": construction.updateItems.salaryLimit.val(),
        };

        com.post(api.construction.updateConstructionForAdvance, options, function(res) {

            searcher.doSearch();
            com.showAlert(com.info, "操作成功");

            construction.modals.updateConstructionModal.modal("hide");
        });
    }

    function updateTerminalStatus() {

        var options = {
            "construction.cid": construction.cid,
            "construction.terminalStatus": construction.items.terminalStatus.val(),
        };

        com.post(api.construction.updateConstructionByCid, options, function(res) {

            searcher.doSearch();
            com.showAlert(com.info, "操作成功");

            construction.modals.updateTerminalStatusModal.modal("hide");
        });
    }

});
