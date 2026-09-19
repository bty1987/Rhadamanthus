jQuery(function($) {

    var constructionSchedule = {

        modals: {
            updateNormModal: com.focusPage("#updateNormModal"),
            updateCaleModal: com.focusPage("#updateCaleModal"),
            updatePeriodModal: com.focusPage("#updatePeriodModal"),
            planSalaryModal: com.focusPage("#planSalaryModal"),
        },

        btns: {
            updateCaleBtn: com.focusPage("#updateCaleBtn"),
            updateNormBtn: com.focusPage("#updateNormBtn"),
            updatePeriodBtn: com.focusPage("#updatePeriodBtn"),
            planSalaryBtn: com.focusPage("#planSalaryBtn"),
        },

        items: {

            accessoryLimit: com.focusPage("#accessoryLimit", "#updateNormModal"),
            salaryLimit: com.focusPage("#salaryLimit", "#updateNormModal"),
            accessoryTotal: com.focusPage("#accessoryTotal", "#updateNormModal"),
            salaryTotal: com.focusPage("#salaryTotal", "#updateNormModal"),

            precheck: com.focusPage("#precheck", "#updateCaleModal"),
            postcheck: com.focusPage("#postcheck", "#updateCaleModal"),
            stacheck: com.focusPage("#stacheck", "#updateCaleModal"),
            fincheck: com.focusPage("#fincheck", "#updateCaleModal"),

            period: com.focusPage("#period", "#updatePeriodModal"),

            planSalary: com.focusPage("#planSalary", "#planSalaryModal"),
        },

        decorationStatus: {},
        scheduleStatus: {},

        schedule: null,
    };

    constructionSchedule.btns.updateCaleBtn.bindClick(updateCaleBtn);
    constructionSchedule.btns.updateNormBtn.bindClick(updateNormBtn);
    constructionSchedule.btns.updatePeriodBtn.bindClick(updatePeriodBtn);
    constructionSchedule.btns.planSalaryBtn.bindClick(planSalaryBtn);

    // 所有 modal 关闭时统一清空输入与提示
    $.each(constructionSchedule.modals, function(key, $modal) {
        $modal.on("hide.bs.modal", function() {
            com.cleanItems(constructionSchedule.items);
            com.closeTip();
        });
    });

    // 获取页面控制参数(按公司差异化配置)
    var pageConfig = constructionPage.getConfig("constructionSchedule");

    // pageBtn 配置为空时, 所有按钮按原逻辑显示; 否则需在 pageBtn 中存在
    function btnVisible(key) {

        return pageConfig.pageBtn.length == 0 || pageConfig.pageBtn.contains(key);
    }

    var searcher = new Searcher();

    searcher.base("condList", "pagenation", "resultList", pageConfig.apiPage || api.construction.pageConstructionSchedule);
    searcher.condition(pageConfig.condArr.length > 0 ? pageConfig.condArr : ["decoration-orderId", "decoration-village", "decoration-houseNumber", "decoration-designer", "construction-supervisor", "decoration-projectStatus", "construction-schedule-createTime", "construction-schedule-startTime", "construction-schedule-endTime", "construction-schedule-enterTime", "construction-schedule-leaveTime", "construction-schedule-cid", "construction-schedule-status", "construction-schedule-planStatus", "construction-schedule-additemStatus", "construction-schedule-node-cnid"]);
    searcher.history("constructionSchedulePostData");

    // 字段定义映射: key 对应配置 propertyArr 中的 value
    var propertyMap = {
        "orderId": {
            field: "decoration.orderId",
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
            field: "construction.supervisor",
            name: "监理",
            prop: "construction.supervisor.userName",
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
        "contractPrice": {
            field: "contractPrice",
            name: "合同额",
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
        "isUpload": {
            field: "isUpload",
            name: "是否上传图片",
            prop: "isUpload",
            dataset: constant.construction().constructionDiary.isUpload.keys,
            clazz: "red"
        },
        "contractTime": {
            field: "contractTime",
            name: "签约时间",
            prop: "decoration.contractTime",
            clazz: "green"
        },
        "proStartTime": {
            field: "proStartTime",
            name: "预计开工时间",
            prop: "proStartTime",
            clazz: "green"
        },
        "proEndTime": {
            field: "proEndTime",
            name: "预计完工时间",
            prop: "proEndTime",
            clazz: "green"
        },
        "prenum": {
            field: "prenum",
            name: "前置间隔天数",
            prop: "prenum",
            clazz: "green"
        },
        "postnum": {
            field: "postnum",
            name: "后置间隔天数",
            prop: "postnum",
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
        "period": {
            field: "period",
            name: "工期",
            prop: "period",
            clazz: "blue"
        },
        "accessoryLimit": {
            field: "accessoryLimit",
            name: "材料浮动限额",
            prop: "accessoryLimit",
            clazz: "blue"
        },
        "salaryLimit": {
            field: "salaryLimit",
            name: "工费浮动限额",
            prop: "salaryLimit",
            clazz: "blue"
        },
        "accessoryTotal": {
            field: "accessoryTotal",
            name: "材料总额限额",
            prop: "accessoryTotal",
            clazz: "blue"
        },
        "salaryTotal": {
            field: "salaryTotal",
            name: "工费总额限额",
            prop: "salaryTotal",
            clazz: "blue"
        },
        "precheck": {
            field: "precheck",
            name: "开工装修比例",
            prop: "precheck",
            clazz: "blue"
        },
        "postcheck": {
            field: "postcheck",
            name: "完工装修比例",
            prop: "postcheck",
            clazz: "blue"
        },
        "stacheck": {
            field: "stacheck",
            name: "开工主材比例",
            prop: "stacheck",
            clazz: "blue"
        },
        "fincheck": {
            field: "fincheck",
            name: "完工主材比例",
            prop: "fincheck",
            clazz: "blue"
        },
        "planSalary": {
            field: "planSalary",
            name: "预估工费",
            prop: "planSalary",
            clazz: "blue"
        },
        "planStatus": {
            field: "planStatus",
            name: "预估工费状态",
            prop: "planStatus",
            dataset: constant.construction().constructionSchedule.planStatus.keys,
            clazz: "red"
        },
        "additemStatus": {
            field: "additemStatus",
            name: "附加项状态",
            prop: "additemStatus",
            dataset: constant.construction().constructionSchedule.additemStatus.keys,
            clazz: "red"
        },
        "planTime": {
            field: "planTime",
            name: "预估时间",
            prop: "planTime",
            clazz: "green"
        },
        "materialPlanSchedule": {
            field: "materialPlanSchedule",
            name: "主材计划(完/总)",
            prop: function(v) {

                return v.materialPlanTotal ? v.materialPlanConfirm + "/" + v.materialPlanTotal : "-";
            },
            clazz: "blue"
        },
        "materialPlanOverdue": {
            field: "materialPlanOverdue",
            name: "主材逾期",
            prop: function(v) {

                return v.materialPlanOverdue ? v.materialPlanOverdue : 0;
            },
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

    var linebtns = [{
        name: "更新定额",
        clazz: "btn-yellow",
        handle: function(v) {

            constructionSchedule.schedule = v;

            constructionSchedule.items.salaryLimit.val(v.salaryLimit);
            constructionSchedule.items.accessoryLimit.val(v.accessoryLimit);
            constructionSchedule.items.accessoryTotal.val(v.accessoryTotal);
            constructionSchedule.items.salaryTotal.val(v.salaryTotal);

            constructionSchedule.modals.updateNormModal.modal("show");

            return false;
        },
        show: function() {
            return btnVisible("updateNorm");
        }
    }, {
        name: "更新比例",
        clazz: "btn-warning",
        handle: function(v) {

            constructionSchedule.schedule = v;

            constructionSchedule.items.precheck.val(v.precheck);
            constructionSchedule.items.postcheck.val(v.postcheck);
            constructionSchedule.items.stacheck.val(v.stacheck);
            constructionSchedule.items.fincheck.val(v.fincheck);

            constructionSchedule.modals.updateCaleModal.modal("show");

            return false;
        },
        show: function() {
            return btnVisible("updateCale");
        }
    }, {
        name: "更新工期",
        clazz: "btn-yellow",
        handle: function(v) {

            constructionSchedule.schedule = v;

            constructionSchedule.items.period.val(v.period);

            constructionSchedule.modals.updatePeriodModal.modal("show");

            return false;
        },
        show: function() {
            return btnVisible("updatePeriod");
        }
    }, {
        name: "确认预估",
        clazz: "btn-danger",
        handle: function(v) {

            if (v.planStatus != 0) { // 0 = 未确认（planStatus 枚举值）
                com.showAlert(com.warning, "预估工费已确认,不可重复操作");
                return false;
            }

            constructionSchedule.schedule = v;

            constructionSchedule.items.planSalary.val(v.planSalary);

            constructionSchedule.modals.planSalaryModal.modal("show");

            return false;
        },
        show: function() {
            return btnVisible("planSalary");
        }
    }, {
        name: "附加项",
        clazz: "btn-info",
        handle: function(v) {

            params.quotation.orderId = v.decoration.orderId;
            params.construction.constructionSchedule = v;

            com.popup4page("#normriceItemPopUp", api.index.normriceItemIndex.url, "附加项");

            return false;
        },
        show: function() {
            return btnVisible("additem");
        }
    }, {
        name: "主材计划",
        clazz: "btn-pink",
        handle: function(v) {

            params.construction = {
                decoration: {
                    orderId: v.decoration.orderId
                }
            };

            com.popup4page("#materialPlanPopUp", "/views/construction/materialPlan.html", "主材计划");

            return false;
        },
        show: function() {
            return btnVisible("matplan");
        }
    }];

    searcher.line("node.name", lineprops, linebtns).render();

    // 更新比例：开工/完工 装修比例、主材比例
    function updateCaleBtn() {

        var options = {
            "constructionSchedule.csid": constructionSchedule.schedule.csid,
            "constructionSchedule.precheck": constructionSchedule.items.precheck.val(),
            "constructionSchedule.postcheck": constructionSchedule.items.postcheck.val(),
            "constructionSchedule.stacheck": constructionSchedule.items.stacheck.val(),
            "constructionSchedule.fincheck": constructionSchedule.items.fincheck.val()
        };

        com.post(api.construction.updateConstructionScheduleForScal, options, function(res) {

            com.showAlert(com.info, "操作成功");

            constructionSchedule.modals.updateCaleModal.modal("hide");

            searcher.doSearch();
        });
    }

    // 更新定额：材料/工费 浮动限额、总额限额
    function updateNormBtn() {

        var options = {
            "constructionSchedule.csid": constructionSchedule.schedule.csid,
            "constructionSchedule.accessoryLimit": constructionSchedule.items.accessoryLimit.val(),
            "constructionSchedule.salaryLimit": constructionSchedule.items.salaryLimit.val(),
            "constructionSchedule.accessoryTotal": constructionSchedule.items.accessoryTotal.val(),
            "constructionSchedule.salaryTotal": constructionSchedule.items.salaryTotal.val()
        };

        com.post(api.construction.updateConstructionScheduleForNorm, options, function(res) {

            com.showAlert(com.info, "操作成功");

            constructionSchedule.modals.updateNormModal.modal("hide");

            searcher.doSearch();
        });
    }

    // 更新工期
    function updatePeriodBtn() {

        var options = {
            "constructionSchedule.csid": constructionSchedule.schedule.csid,
            "constructionSchedule.period": constructionSchedule.items.period.val()
        };

        com.post(api.construction.updateConstructionScheduleForPeriod, options, function(res) {

            com.showAlert(com.info, "操作成功");

            constructionSchedule.modals.updatePeriodModal.modal("hide");

            searcher.doSearch();
        });
    }

    // 确认预估工费
    function planSalaryBtn() {

        var options = {
            "constructionSchedule.csid": constructionSchedule.schedule.csid,
            "constructionSchedule.planSalary": constructionSchedule.items.planSalary.val()
        };

        com.post(api.construction.planConstructionSchedule, options, function(res) {

            com.showAlert(com.info, "预估工费确认成功");

            constructionSchedule.modals.planSalaryModal.modal("hide");

            searcher.doSearch();
        });
    }

});
