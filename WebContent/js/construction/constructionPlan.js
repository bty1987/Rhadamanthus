jQuery(function($) {

    var constructionPlan = {

        construction: params.construction,

        modals: {
            constructionPlanModal: com.focusPage("#constructionPlanModal"),
            editconstructionPlanModal: com.focusPage("#editConstructionPlanModal")
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
        timenum: 0,

        pace: {
            "cpid": 0
        },
    };

    com.post(api.data.queryConstructionPace, {
        "constructionPace.lowerArea": constructionPlan.construction.decoration.house.innerArea
    }, function(res) {

        if(res.constructionPace.cpid) constructionPlan.pace = res.constructionPace;

        constructionPlan.items.name.bindData(res.constructionPace, "cpnid", "name");
    }, null, false);

    com.post(api.data.queryConstructionPaceNode, {
        "constructionPaceNode.cpid": constructionPlan.pace.cpid
    }, function(res) {

        constructionPlan.items.name.bindData(res.constructionPaceNodes, "cpnid", "name");
    });

    var searcher = new Searcher();

    searcher.set("pageltList", "pageltList", "constructionPlans", api.construction.queryConstructionPlanByOrderId, {
        "constructionPlan.orderId": constructionPlan.construction.decoration.orderId
    }, null, null, "constructionPlans", true);

    var lineprops = [{
        field: "orderId",
        name: "装修单",
        prop: "orderId",
        clazz: "blue",
        click: function(btn, v) {

            tools.decoration.info(btn, v.orderId);
        }
    }, {
        field: "connum",
        name: "工程天数",
        prop: "connum",
        clazz: "blue"
    }, {
        field: "prenum",
        name: "前置间隔天数",
        prop: "prenum",
        clazz: "blue"
    }, {
        field: "postnum",
        name: "后置间隔天数",
        prop: "postnum",
        clazz: "blue"
    }, {
        field: "createTime",
        name: "创建时间",
        prop: "createTime",
        clazz: "green"
    }, {
        field: "conStartTime",
        name: "工程开始时间",
        prop: function(v) {

            var conStartTime = constructionPlan.startTime;

            conStartTime.setDate(constructionPlan.startTime.getDate() + v.prenum);

            return com.dateFormat(conStartTime, "yyyy-MM-dd");
        },
        clazz: "green"
    }, {
        field: "conEndTime",
        name: "工程结束时间",
        prop: function(v) {

            var conStartTime = constructionPlan.startTime;

            conStartTime.setDate(constructionPlan.startTime.getDate() + v.connum + v.postnum);

            return com.dateFormat(conStartTime, "yyyy-MM-dd");
        },
        clazz: "green"
    }, {
        field: "comnum",
        name: "主材天数",
        prop: "comnum",
        clazz: "blue"
    }, {
        field: "comStartTime",
        name: "主材开始时间",
        prop: function(v) {

            var conStartTime = constructionPlan.startTime;

            conStartTime.setDate(constructionPlan.startTime.getDate());

            return com.dateFormat(conStartTime, "yyyy-MM-dd");
        },
        clazz: "green"
    }, {
        field: "comEndTime",
        name: "主材结束时间",
        prop: function(v) {

            var conStartTime = constructionPlan.startTime;

            conStartTime.setDate(constructionPlan.startTime.getDate() + v.comnum);

            return com.dateFormat(conStartTime, "yyyy-MM-dd");
        },
        clazz: "green"
    }, {
        field: "phase",
        name: "施工节点",
        prop: "phase",
        clazz: "blue"
    }, {
        field: "material",
        name: "配套主材",
        prop: "material",
        clazz: "blue"
    }, {
        field: "period",
        name: "进场周期",
        prop: "period",
        clazz: "blue"
    }, {
        field: "comment",
        name: "说明",
        prop: "comment",
        clazz: "grey"
    }, {
        field: "content",
        name: "注释",
        prop: "content",
        clazz: "grey"
    }];

    var linebtus = [{
        name: "编辑",
        clazz: "btn-purple",
        handle: function(v) {

            com.cleanItems(constructionPlan.items);
            constructionPlan.cpid = v.cpid;
            constructionPlan.items.comnum.val(v.comnum), constructionPlan.items.connum.val(v.connum), constructionPlan.items.prenum.val(v.prenum), constructionPlan.items.postnum.val(v.postnum), constructionPlan.items.content.val(v.content), constructionPlan.items.editcomment.val(v.comment), constructionPlan.modals.editconstructionPlanModal.modal("show");

            return false;
        }
    }, {
        name: "上移",
        clazz: "btn-success",
        handle: function(v) {

            com.post(api.construction.moveConstructionPlan, {
                "constructionPlan.cpid": v.cpid,
                "constructionPlan.sort": v.sort - 1,
            }, function() {

                searcher.doSearch();
            });
            return false;
        }
    }, {
        name: "下移",
        clazz: "btn-warning",
        handle: function(v) {

            com.post(api.construction.moveConstructionPlan, {
                "constructionPlan.cpid": v.cpid,
                "constructionPlan.sort": v.sort + 1,
            }, function() {

                searcher.doSearch();
            });

            return false;
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
        }
    }, ];

    searcher.line("node.name", lineprops, linebtus).render();

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
            constructionPlan.modals.editconstructionPlanModal.modal("hide");
            searcher.doSearch();
        });

    });

    function saveData() {

        if (com.validate('constructionPlanModal'))
            return false;

        var options = {
            "constructionPlan.node.cpnid": constructionPlan.items.name.val(),
            "constructionPlan.orderId": constructionPlan.construction.decoration.orderId,
            "constructionPlan.connumStartTime": constructionPlan.construction.drawlineTime,
            "constructionPlan.comment": constructionPlan.items.comment.val(),
        };

        com.post(api.construction.addConstructionPlan, options, function() {

            com.showAlert(com.info, "操作成功");
            searcher.doSearch();
        });

        constructionPlan.modals.constructionPlanModal.modal("hide");
    }

});