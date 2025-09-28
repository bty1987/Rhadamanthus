jQuery(function($) {

    var constructionSchedule = {

        modals: {
            updateNormModal: com.focusPage("#updateNormModal"),
            updateCaleModal: com.focusPage("#updateCaleModal"),
            updatePeriodModal: com.focusPage("#updatePeriodModal"),
        },

        btns: {
            updateCaleBtn: com.focusPage("#updateCaleBtn"),
            updateNormBtn: com.focusPage("#updateNormBtn"),
            updatePeriodBtn: com.focusPage("#updatePeriodBtn"),
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

            period: com.focusPage("#period", "#updatePeriodModal")
        },

        decorationStatus: {},
        scheduleStatus: {},

        schedule: null,
    };

    constructionSchedule.btns.updateCaleBtn.bindClick(updateCaleBtn);
    constructionSchedule.btns.updateNormBtn.bindClick(updateNormBtn);
    constructionSchedule.btns.updatePeriodBtn.bindClick(updatePeriodBtn);

    constructionSchedule.modals.updateNormModal.on("hide.bs.modal", function() {

        com.cleanItems(constructionSchedule.items);
        com.closeTip();
    });

    constructionSchedule.modals.updateCaleModal.on("hide.bs.modal", function() {

        com.cleanItems(constructionSchedule.items);
        com.closeTip();
    });

    constructionSchedule.modals.updatePeriodModal.on("hide.bs.modal", function() {

        com.cleanItems(constructionSchedule.items);
        com.closeTip();
    });

    var searcher = new Searcher();

    searcher.base("condList", "pagenation", "resultList", api.construction.pageConstructionSchedule);
    searcher.condition(["decoration-orderId", "decoration-village", "decoration-houseNumber", "decoration-designer", "decoration-projectStatus", "construction-schedule-createTime", "construction-schedule-startTime", "construction-schedule-endTime", "construction-schedule-enterTime", "construction-schedule-leaveTime"]);

    var lineprops = [{
        field: "decoration.orderId",
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
        name: "工程状态",
        prop: "decoration.projectStatus",
        dataset: constant.decoration().decoration.projectStatus.keys,
        clazz: "red"
    }, {
        field: "contractTime",
        name: "签约时间",
        prop: "decoration.contractTime",
        clazz: "green"
    }, {
        type: "newline",
    }, {
        field: "proStartTime",
        name: "预计开工时间",
        prop: "proStartTime",
        clazz: "green"
    }, {
        field: "proEndTime",
        name: "预计完工时间",
        prop: "proEndTime",
        clazz: "green"
    }, {
        field: "prenum",
        name: "前置间隔天数",
        prop: "prenum",
        clazz: "green"
    }, {
        field: "postnum",
        name: "后置间隔天数",
        prop: "postnum",
        clazz: "green"
    }, {
        field: "startTime",
        name: "开工时间",
        prop: "startTime",
        clazz: "green"
    }, {
        field: "endTime",
        name: "完工时间",
        prop: "endTime",
        clazz: "green"
    }, {
        field: "period",
        name: "工期",
        prop: "period",
        clazz: "blue"
    }, {
        type: "newline",
    }, {
        field: "accessoryLimit",
        name: "材料浮动限额",
        prop: "accessoryLimit",
        clazz: "blue"
    }, {
        field: "salaryLimit",
        name: "工费浮动限额",
        prop: "salaryLimit",
        clazz: "blue"
    }, {
        field: "accessoryTotal",
        name: "材料总额限额",
        prop: "accessoryTotal",
        clazz: "blue"
    }, {
        field: "salaryTotal",
        name: "工费总额限额",
        prop: "salaryTotal",
        clazz: "blue"
    }, {
        field: "precheck",
        name: "开工装修比例",
        prop: "precheck",
        clazz: "blue"
    }, {
        field: "postcheck",
        name: "完工装修比例",
        prop: "postcheck",
        clazz: "blue"
    }, {
        field: "stacheck",
        name: "开工主材比例",
        prop: "stacheck",
        clazz: "blue"
    }, {
        field: "fincheck",
        name: "完工主材比例",
        prop: "fincheck",
        clazz: "blue"
    }, ];

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
        }
    }, {
        name: "更新工期",
        clazz: "btn-yellow",
        handle: function(v) {

            constructionSchedule.schedule = v;

            constructionSchedule.items.period.val(v.period);

            constructionSchedule.modals.updatePeriodModal.modal("show");

            return false;
        }
    }];

    searcher.line("node.name", lineprops, linebtns).render();

    function updateCaleBtn() {

        var options = {
            "constructionSchedule.csid": constructionSchedule.schedule.csid,
            "constructionSchedule.precheck": constructionSchedule.items.precheck.val(),
            "constructionSchedule.postcheck": constructionSchedule.items.postcheck.val(),
            "constructionSchedule.stacheck": constructionSchedule.items.stacheck.val(),
            "constructionSchedule.fincheck": constructionSchedule.items.fincheck.val(),
        };

        com.post(api.construction.updateConstructionScheduleForScal, options, function(res) {

            com.showAlert(com.info, "操作成功");

            constructionSchedule.modals.updateCaleModal.modal("hide");

            searcher.doSearch();
        });
    }

    function updateNormBtn() {

        var options = {
            "constructionSchedule.csid": constructionSchedule.schedule.csid,
            "constructionSchedule.accessoryLimit": constructionSchedule.items.accessoryLimit.val(),
            "constructionSchedule.salaryLimit": constructionSchedule.items.salaryLimit.val(),
            "constructionSchedule.accessoryTotal": constructionSchedule.items.accessoryTotal.val(),
            "constructionSchedule.salaryTotal": constructionSchedule.items.salaryTotal.val(),
        };

        com.post(api.construction.updateConstructionScheduleForNorm, options, function(res) {

            com.showAlert(com.info, "操作成功");

            constructionSchedule.modals.updateNormModal.modal("hide");

            searcher.doSearch();
        });
    }

    function updatePeriodBtn() {

        var options = {
            "constructionSchedule.csid": constructionSchedule.schedule.csid,
            "constructionSchedule.period": constructionSchedule.items.period.val(),
        };

        com.post(api.construction.updateConstructionScheduleForPeriod, options, function(res) {

            com.showAlert(com.info, "操作成功");

            constructionSchedule.modals.updatePeriodModal.modal("hide");

            searcher.doSearch();
        });
    }

});
