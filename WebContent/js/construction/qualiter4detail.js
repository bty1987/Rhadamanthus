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

    // 获取页面控制参数(按公司差异化配置)
    var pageConfig = constructionPage.getConfig("qualiter4detail");

    // pageBtn 配置为空时, 所有按钮按原逻辑显示; 否则需在 pageBtn 中存在
    function btnVisible(key) {

        return pageConfig.pageBtn.length == 0 || pageConfig.pageBtn.contains(key);
    }

    var searcher = new Searcher();

    searcher.set("pageltList", "pageltList", "qualiters", pageConfig.apiPage || api.construction.queryQualiter, {
        "qualiter.decoration.orderId": qualiter4detail.orderId
    }, pageConfig.condArr, null, "qualiters", true);

    // 字段定义映射: key 对应配置 propertyArr 中的 value
    var propertyMap = {
        "orderId": {
            field: "orderId",
            name: "装修单",
            prop: "decoration.orderId",
            clazz: "blue",
            click: function(btn, v) {

                tools.decoration.info(btn, v.orderId);
            }
        },
        "creater": {
            field: "creater.currentName",
            name: "创建人",
            prop: "creater.currentName",
            clazz: "grey",
            click: function(btn, v) {

                tools.personel.info(btn, v.creater.userId);
            }
        },
        "createTime": {
            field: "createTime",
            name: "创建时间",
            prop: "createTime",
            clazz: "green"
        },
        "status": {
            fieId: "status",
            name: "状态",
            prop: "status",
            clazz: "red",
            dataset: constant.construction().qualiter.status.keys
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
        },
        show: function() {
            return btnVisible("del");
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