jQuery(function($) {

    var constructionPlan = {

        construction: params.construction,

        modals: {
            constructionPlanModal: com.focusPage("#constructionPlanModal"),
            editConstructionPlanModal: com.focusPage("#editConstructionPlanModal")
        },

        btns: {
            createConstructionPlanBtn: com.focusPage("#constructionPlanBtn"),
            saveBtn: com.focusPage("#saveBtn").on("click", saveData),
            editBtn: com.focusPage("#editBtn"),
            printBtn: com.focusPage("#printBtn")
        },

        items: {
            name: com.focusPage("#name", "#constructionPlanModal"),
            comment: com.focusPage("#comment", "#constructionPlanModal"),
            connum: com.focusPage("#connum", "#editConstructionPlanModal"),
            comnum: com.focusPage("#comnum", "#editConstructionPlanModal"),
            prenum: com.focusPage("#prenum", "#editConstructionPlanModal"),
            postnum: com.focusPage("#postnum", "#editConstructionPlanModal"),
            content: com.focusPage("#content", "#editConstructionPlanModal"),
            editcomment: com.focusPage("#editcomment", "#editConstructionPlanModal")
        },

        startTime: new Date(params.construction.drawlineTime),
        endTime: new Date(params.construction.drawlineTime),

        comStartTime: new Date(params.construction.drawlineTime),

        timenum: 0,
        prenum: 0,
        postnum: 0,

        pace: {
            "cpid": 0
        },
    };

    com.post(api.data.queryConstructionPace, {
        "constructionPace.lowerArea": constructionPlan.construction.decoration.house.innerArea
    }, function(res) {

        if (res.constructionPace.cpid)
            constructionPlan.pace = res.constructionPace;

        constructionPlan.items.name.bindData(res.constructionPace, "cpnid", "name");
    }, null, false);

    com.post(api.data.queryConstructionPaceNode, {
        "constructionPaceNode.cpid": constructionPlan.pace.cpid
    }, function(res) {

        constructionPlan.items.name.bindData(res.constructionPaceNodes, "cpnid", "name");
    });

    // 获取页面控制参数(按公司差异化配置)
    var pageConfig = constructionPage.getConfig("constructionPlan");

    // pageBtn 配置为空时, 所有按钮按原逻辑显示; 否则需在 pageBtn 中存在
    function btnVisible(key) {

        return pageConfig.pageBtn.length == 0 || pageConfig.pageBtn.contains(key);
    }

    var searcher = new Searcher();

    searcher.set("pageltList", "pageltList", "constructionPlans", pageConfig.apiPage || api.construction.queryConstructionPlanByOrderId, {
        "constructionPlan.orderId": constructionPlan.construction.decoration.orderId
    }, pageConfig.condArr, null, "constructionPlans", true);

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
        "pacenodeName": {
            field: "pacenode.node.name",
            name: "工程节点",
            prop: "pacenode.node.name",
            clazz: "grey"
        },
        "nodeName": {
            field: "node.name",
            name: "工程节点",
            prop: "node.name",
            clazz: "blue"
        },
        "connum": {
            field: "connum",
            name: "工程天数",
            prop: "connum",
            clazz: "blue"
        },
        "prenum": {
            field: "prenum",
            name: "前置间隔天数",
            prop: "prenum",
            clazz: "blue"
        },
        "postnum": {
            field: "postnum",
            name: "后置间隔天数",
            prop: "postnum",
            clazz: "blue"
        },
        "createTime": {
            field: "createTime",
            name: "创建时间",
            prop: "createTime",
            clazz: "green"
        },
        "conStartTime": {
            field: "conStartTime",
            name: "工程开始时间",
            prop: function(v) {

                var conStartTime = constructionPlan.startTime;

                conStartTime.setDate(constructionPlan.startTime.getDate() + v.prenum + constructionPlan.postnum);

                constructionPlan.prenum = v.prenum;
                constructionPlan.startTime = conStartTime;

                return com.dateFormat(conStartTime, "yyyy-MM-dd");
            },
            clazz: "green"
        },
        "conEndTime": {
            field: "conEndTime",
            name: "工程结束时间",
            prop: function(v) {

                var conStartTime = constructionPlan.startTime;

                conStartTime.setDate(constructionPlan.startTime.getDate() + v.connum);

                constructionPlan.postnum = v.postnum;
                constructionPlan.endTime = conStartTime;

                return com.dateFormat(conStartTime, "yyyy-MM-dd");
            },
            clazz: "green"
        },
        "comnum": {
            field: "comnum",
            name: "主材天数",
            prop: "comnum",
            clazz: "blue"
        },
        "comStartTime": {
            field: "comStartTime",
            name: "主材开始时间",
            prop: function(v) {

                var conStartTime = constructionPlan.comStartTime;

                conStartTime.setDate(constructionPlan.startTime.getDate());

                return com.dateFormat(conStartTime, "yyyy-MM-dd");
            },
            clazz: "green"
        },
        "comEndTime": {
            field: "comEndTime",
            name: "主材结束时间",
            prop: function(v) {

                var conStartTime = constructionPlan.comStartTime;

                conStartTime.setDate(constructionPlan.startTime.getDate() + v.comnum);

                return com.dateFormat(conStartTime, "yyyy-MM-dd");
            },
            clazz: "green"
        },
        "phase": {
            field: "phase",
            name: "施工节点",
            prop: "phase",
            clazz: "blue"
        },
        "material": {
            field: "material",
            name: "配套主材",
            prop: "material",
            clazz: "blue"
        },
        "period": {
            field: "period",
            name: "进场周期",
            prop: "period",
            clazz: "blue"
        },
        "comment": {
            field: "comment",
            name: "说明",
            prop: "comment",
            clazz: "grey"
        },
        "content": {
            field: "content",
            name: "注释",
            prop: "content",
            clazz: "grey"
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

    var linebtus = [{
        name: "编辑",
        clazz: "btn-purple",
        handle: function(v) {

            com.cleanItems(constructionPlan.items);
            constructionPlan.cpid = v.cpid;
            constructionPlan.items.comnum.val(v.comnum), constructionPlan.items.connum.val(v.connum), constructionPlan.items.prenum.val(v.prenum), constructionPlan.items.postnum.val(v.postnum), constructionPlan.items.content.val(v.content), constructionPlan.items.editcomment.val(v.comment), constructionPlan.modals.editConstructionPlanModal.modal("show");

            return false;
        },
        show: function() {
            return btnVisible("edit");
        }
    }, {
        name: "上移",
        clazz: "btn-success",
        handle: function(v) {

            com.post(api.construction.moveConstructionPlan, {
                "constructionPlan.cpid": v.cpid,
                "constructionPlan.sort": v.sort - 1,
            }, function() {

                constructionPlan.startTime = new Date(params.construction.drawlineTime);
                constructionPlan.endTime = new Date(params.construction.drawlineTime);

                constructionPlan.prenum = 0;
                constructionPlan.postnum = 0;

                searcher.doSearch();
            });

            return false;
        },
        show: function() {
            return btnVisible("up");
        }
    }, {
        name: "下移",
        clazz: "btn-warning",
        handle: function(v) {

            com.post(api.construction.moveConstructionPlan, {
                "constructionPlan.cpid": v.cpid,
                "constructionPlan.sort": v.sort + 1,
            }, function() {

                constructionPlan.startTime = new Date(params.construction.drawlineTime);
                constructionPlan.endTime = new Date(params.construction.drawlineTime);

                constructionPlan.prenum = 0;
                constructionPlan.postnum = 0;

                searcher.doSearch();
            });

            return false;
        },
        show: function() {
            return btnVisible("down");
        }
    }, {
        name: "删除",
        clazz: "btn-danger",
        handle: function(v) {

            com.post(api.construction.deleteConstructionPlan, {
                "constructionPlan.cpid": v.cpid
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

    searcher.line("name", lineprops, linebtus).render();

    com.focusPage('#makeBtn').on("click", function() {

        com.post(api.construction.makeConstructionPlan, {
            "constructionPlan.orderId": constructionPlan.construction.decoration.orderId
        }, function() {

            com.showAlert(com.info, "操作成功");
            searcher.doSearch();
        });
    });

    constructionPlan.btns.createConstructionPlanBtn.on("click", function() {

        constructionPlan.modals.constructionPlanModal.modal("show");
    });

    com.focusPage('#printBtn').on("click", function() {

        params.construction = constructionPlan.construction;

        com.popup("工程施工进度计划表", api.index.constructionPlan2print.url, null, null, true);
    });

    constructionPlan.btns.editBtn.on("click", function() {

        if (com.validate('editConstructionPlanModal'))
            return false;

        var options = {
            "constructionPlan.cpid": constructionPlan.cpid,
            "constructionPlan.comnum": constructionPlan.items.comnum.val(),
            "constructionPlan.connum": constructionPlan.items.connum.val(),
            "constructionPlan.prenum": constructionPlan.items.prenum.val(),
            "constructionPlan.postnum": constructionPlan.items.postnum.val(),
            "constructionPlan.content": constructionPlan.items.content.val(),
            "constructionPlan.comment": constructionPlan.items.editcomment.val(),
        };

        com.post(api.construction.updateConstructionPlan, options, function() {

            com.showAlert(com.info, "操作成功");

            constructionPlan.startTime = new Date(params.construction.drawlineTime);
            constructionPlan.endTime = new Date(params.construction.drawlineTime);

            constructionPlan.prenum = 0;
            constructionPlan.postnum = 0;

            searcher.doSearch();

            constructionPlan.modals.editConstructionPlanModal.modal("hide");
        });

    });

    function saveData() {

        if (com.validate('constructionPlanModal'))
            return false;

        var options = {
            "constructionPlan.cpid": constructionPlan.items.name.val(),
            "constructionPlan.orderId": constructionPlan.construction.decoration.orderId,
            "constructionPlan.connumStartTime": constructionPlan.construction.drawlineTime,
            "constructionPlan.comment": constructionPlan.items.comment.val(),
        };

        com.post(api.construction.addConstructionPlan, options, function() {

            com.showAlert(com.info, "操作成功");

            constructionPlan.startTime = new Date(params.construction.drawlineTime);
            constructionPlan.endTime = new Date(params.construction.drawlineTime);

            constructionPlan.prenum = 0;
            constructionPlan.postnum = 0;

            searcher.doSearch();
        });

        constructionPlan.modals.constructionPlanModal.modal("hide");
    }

});