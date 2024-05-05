jQuery(function($) {

    var qualiter4detail = {

        cid: null,
        orderId: params.construction.orderId,

        modals: {
            qualiterModal: com.focusPage("#qualiterModal")
        },

        btns: {
            qualiterBtn: com.focusPage("#qualiterBtn"),
            saveBtn: com.focusPage("#saveBtn1")
        },

        items: {
            user: com.focusPage("#user")
        }
    };

    qualiter4detail.modals.qualiterModal.on("hide.bs.modal", function () {

        com.clearValidator();
        com.cleanTypeahead("user");
        com.cleanItems(qualiter4detail.items);
    });

    com.initTypeahead('user', api.personel.queryUserByPinyin, "pinyinName", {"departmentType.name" : "", "user.status" : 0}, "autoFillKeyValue", "key", "value", null);

    com.post(api.construction.queryConstructionByOrderId, {
        "construction.orderId": qualiter4detail.orderId
    }, function(res) {

        qualiter4detail.cid = res.construction.cid;
    });

    var searcher = new Searcher();

    searcher.set("pageltList", "pageltList", "qualiters", api.construction.queryQualiter, {
        "qualiter.decoration.orderId": qualiter4detail.orderId
    }, null, null, "qualiters", true);

    var lineprops = [{
        field: "orderId",
        name: "装修单",
        prop: "decoration.orderId",
        clazz: "blue",
        click: function(btn, v) {

            tools.decoration.info(btn, v.orderId);
        }
    }, {
        field: "creater.currentName",
        name: "创建人",
        prop: "creater.currentName",
        clazz: "grey",
        click: function(btn, v) {

            tools.personel.info(btn, v.creater.userId);
        }
    }, {
        field: "createTime",
        name: "创建时间",
        prop: "createTime",
        clazz: "green"
    }, {
        fieId: "status",
        name: "状态",
        prop: "status",
        clazz: "red",
        dataset: constant.construction().qualiter.status.keys,
    }];

    var linebtus = [{
        name: "删除",
        clazz: "btn-danger",
        handle: function(v) {

            com.post(api.construction.deleteQualiter, {
                "qualiter.qid": v.qid
            }, function() {

                com.showAlert(com.info, "删除成功");
                searcher.doSearch();
            });

            return false;
        }
    }];

    searcher.line("user.currentName", lineprops, linebtus).render();

    qualiter4detail.btns.qualiterBtn.on("click", function() {

        qualiter4detail.modals.qualiterModal.modal("show");
    });

    com.focusPage("#saveBtn1").bindClick(saveData);

    function saveData() {

        if (com.validate('qualiterModal'))
            return false;

        var options = {
            "qualiter.decoration.orderId": qualiter4detail.orderId,
            "qualiter.cid": qualiter4detail.cid,
            "qualiter.schedule": 0,
            "qualiter.rate": 0,
            "qualiter.user.userId": com.typeahead("user")
        };

        com.post(api.construction.addQualiter, options, function() {

            com.showAlert(com.info, "操作成功");
            searcher.doSearch();
        });

        qualiter4detail.modals.qualiterModal.modal("hide");
    }

});