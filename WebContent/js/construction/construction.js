jQuery(function($) {

    var construction = {

        constructionSchedule: {},

        modals: {
            constructionInfoModal: com.focusPage("#constructionInfoModal"),
            updateConstructionModal: com.focusPage("#updateConstructionModal")
        },

        btns: {
            saveBtn: com.focusPage("#saveBtn"),
            updateConstructionBtn: com.focusPage("#updateConstructionBtn")
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
            comment: com.focusPage("#comment")
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
    construction.modals.constructionInfoModal.on("hide.bs.modal", function() {

        com.cleanItems(construction.items);
        com.closeTip();
    });

    construction.modals.updateConstructionModal.on("hide.bs.modal", function() {

        com.cleanItems(construction.updateItems);
        com.closeTip();
    });

    com.datetime(construction.items.finishTime);
    com.datetime(construction.items.keyTime);
    com.datetime(construction.items.drawlineTime);
    com.datetime(construction.items.designTime);

    construction.items.ishovel.bindData(constant.construction().constructionInfo.isHovel.datas, "key", "value");
    construction.items.iskey.bindData(constant.construction().constructionInfo.isKey.datas, "key", "value");
    construction.items.isCeremony.bindData(constant.construction().constructionInfo.isCeremony.datas, "key", "value");

    var searcher = new Searcher();

    searcher.base("constructionCondList", "constructionPagenation", "constructionResultList", api.construction.pageConstructionForBase);

    searcher.condition(["decoration-orderId", "decoration-village", "decoration-houseNumber", "decoration-designer", "decoration-projectStatus"]);

    var lineprops = [{
        field: "decoration",
        name: "装修单",
        prop: "decoration.orderId",
        clazz: "blue",
        click: function(btn, v) {

            tools.decoration.info(btn, v.decoration.orderId);
        }
    }, {
        field: "village",
        name: "楼盘",
        prop: "decoration.house.village.name",
        clazz: "grey",
        click: function(btn, v) {

            tools.house.info(btn, v.decoration.house.hid);
        }
    }, {
        field: "houseNumber",
        name: "楼号",
        prop: "decoration.house.houseNumber",
        clazz: "grey"
    }, {
        field: "customer",
        name: "客户",
        prop: "decoration.customer.name",
        clazz: "grey",
        click: function(btn, v) {

            tools.customer.info(btn, v.decoration.customer.cid);
        }
    }, {
        field: "designer",
        name: "设计师",
        prop: "decoration.designer.userName",
        clazz: "grey",
        click: function(btn, v) {

            tools.personel.info(btn, v.decoration.designer.userId);
        }
    }, {
        field: "supervisor",
        name: "监理",
        prop: "supervisor.userName",
        clazz: "grey",
        click: function(btn, v) {

            tools.personel.info(btn, v.supervisor.userId);
        }
    }, {
        field: "orderTotalPrice",
        name: "总价",
        prop: "decoration.orderTotalPrice",
        clazz: "blue"
    }, {
        field: "orderTotalPrice",
        name: "合同额",
        prop: "decoration.orderTotalPrice",
        clazz: "blue"
    }, {
        field: "version",
        name: "报价版本",
        prop: "decoration.version.name",
        clazz: "grey"
    }, {
        field: "buildArea",
        name: "面积",
        prop: "decoration.house.buildArea",
        clazz: "blue"
    }, {
        field: "projectStatus",
        name: "进度",
        prop: "decoration.projectStatus",
        dataset: constant.decoration().decoration.projectStatus.keys,
        clazz: "red"
    }, {
        field: "accessoryLimit",
        name: "辅料额上限",
        prop: "accessoryLimit",
        clazz: "blue"
    }, {
        field: "salaryLimit",
        name: "工费额上限",
        prop: "salaryLimit",
        clazz: "blue"
    }, {
        field: "accessoryTotal",
        name: "辅料总额",
        prop: "accessoryTotal",
        clazz: "blue",
        show: function(v){
            return false;
        }
    }, {
        field: "salaryTotal",
        name: "工费总额",
        prop: "salaryTotal",
        clazz: "blue",
        show: function(v){
            return false;
        }
    }, {
        field: "currentName",
        name: "锁定人",
        prop: "locker.currentName",
        clazz: "grey",
        click: function(btn, v) {

            tools.personel.info(btn, v.locker.userId);
        }
    }, {
        field: "lockTime",
        name: "锁定时间",
        prop: "lockTime",
        clazz: "green"
    }, {
        field: "accessory",
        name: "辅料控制",
        prop: "accessory",
        dataset: constant.construction().construction.isAccessory.keys,
        clazz: "red"
    }];

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
        }
    }, {
        name: "查看",
        clazz: "btn-success",
        handle: function(v) {

            params.construction.orderId = v.decoration.orderId;

            com.popup4page("#stockRecordPopUp", "/views/construction/supervision4detail.html", "查看");

            return false;
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
        }
    }, {
        name: "返工",
        clazz: "btn-inverse",
        handle: function(v) {

            params.construction.orderId = v.decoration.orderId;

            com.popup4page("#stockRecordPopUp", "/views/construction/supervision4rework.html", "返工");

            return false;
        }
    }, {
        name: "工程辅料",
        clazz: "btn-purple",
        handle: function(v) {

            params.construction.orderId = v.decoration.orderId;
            params.construction.cid = v.cid;

            com.popup4page("#stockRecordPopUp", "/views/construction/accessory.html", "工程辅料");

            return false;
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
        }
    }, {
        name: "辅料开启",
        clazz: "btn-danger",
        handle: function(v) {

            com.post(api.construction.openAccessory, {
                "construction.cid": v.cid
            }, function(res) {

                com.showAlert(com.info, "创建辅料单状态开启");
                searcher.doSearch();
            });

            return false;
        },
        show: function(v) {

            return (v.accessory == constant.construction().construction.ISACCESSORY_DISABLE_INT);
        }
    }, {
        name: "辅料锁定",
        clazz: "btn-pink",
        handle: function(v) {

            com.post(api.construction.lockAccessory, {
                "construction.cid": v.cid
            }, function(res) {

                com.showAlert(com.info, "创建辅料单状态锁定");
                searcher.doSearch();
            });

            return false;
        },
        show: function(v) {

            return (v.accessory == constant.construction().construction.ISACCESSORY_ENABLE_INT);
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

});
