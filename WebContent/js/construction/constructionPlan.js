jQuery(function($) {

    var constructionPlan = {

        construction: params.construction,

        modals: {
            constructionPlanModal: com.focusPage("#constructionPlanModal")
        },

        btns: {
            createConstructionPlanBtn: com.focusPage("#constructionPlanBtn"),
            saveBtn: com.focusPage("#saveBtn").on("click", saveData),
            printBtn: com.focusPage("#printBtn")
        },

        items: {
            name: com.focusPage("#name"),
            startTime: com.focusPage("#startTime"),
            endTime: com.focusPage("#endTime"),
            comment: com.focusPage("#comment")
        }
    };

    com.datetime(constructionPlan.items.startTime);
    com.datetime(constructionPlan.items.endTime);

    com.post(api.data.queryConstructionPace, {}, function(res) {

        constructionPlan.items.name.bindData(res.constructionPaces, "cpid", "name");
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
        field: "createTime",
        name: "创建时间",
        prop: "createTime",
        clazz: "green"
    }, {
        field: "startTime",
        name: "开始时间",
        prop: "startTime",
        clazz: "green"
    }, {
        field: "endTime",
        name: "结束时间",
        prop: "endTime",
        clazz: "green"
    }, {
        field: "comment",
        name: "说明",
        prop: "comment",
        clazz: "grey"
    }];

    var linebtus = [{
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
    }];

    searcher.line("pace.name", lineprops, linebtus).render();

    constructionPlan.btns.createConstructionPlanBtn.on("click", function() {

        constructionPlan.modals.constructionPlanModal.modal("show");
    });

    com.focusPage('#printBtn').on("click", function() {

        params.construction = constructionPlan.construction;

        com.popup("工程施工进度计划表", api.index.constructionPlan2print.url, null, null, true);
    });

    function saveData() {

        if (com.validate('constructionPlanModal'))
            return false;

        var options = {
            "constructionPlan.pace.cpid": constructionPlan.items.name.val(),
            "constructionPlan.orderId": constructionPlan.construction.decoration.orderId,
            "constructionPlan.startTime": constructionPlan.items.startTime.val(),
            "constructionPlan.endTime": constructionPlan.items.endTime.val(),
            "constructionPlan.comment": constructionPlan.items.comment.val(),
        };

        com.post(api.construction.addConstructionPlan, options, function() {

            com.showAlert(com.info, "操作成功");
            searcher.doSearch();
        });

        constructionPlan.modals.constructionPlanModal.modal("hide");
    }

});