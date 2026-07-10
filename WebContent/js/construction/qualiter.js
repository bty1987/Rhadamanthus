jQuery(function($) {

    var quality = {

        userId: "",

        modals: {
            constructionInfoModal: com.focusPage("#constructionInfoModal")
        },

        btns: {
            qualiterBtn: com.focusPage("#qualiterBtn"),
            saveBtn: com.focusPage("#saveBtn")
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
        }
    };

    quality.btns.saveBtn.bindClick(saveData)

    quality.userId = params.userInfo.user.userId;

    quality.modals.constructionInfoModal.on("hide.bs.modal", function() {

        com.cleanItems(quality.items);
        com.closeTip();
    });

    com.datetime(quality.items.finishTime);
    com.datetime(quality.items.keyTime);
    com.datetime(quality.items.drawlineTime);
    com.datetime(quality.items.designTime);

    quality.items.ishovel.bindData(constant.construction().constructionInfo.isHovel.datas, "key", "value");
    quality.items.iskey.bindData(constant.construction().constructionInfo.isKey.datas, "key", "value");
    quality.items.isCeremony.bindData(constant.construction().constructionInfo.isCeremony.datas, "key", "value");

    // 获取页面控制参数(按公司差异化配置)
    var pageConfig = constructionPage.getConfig("qualiter");

    // pageBtn 配置为空时, 所有按钮按原逻辑显示; 否则需在 pageBtn 中存在
    function btnVisible(key) {

        return pageConfig.pageBtn.length == 0 || pageConfig.pageBtn.contains(key);
    }

    var searcher = new Searcher();

    searcher.base("qualityControlCondList", "qualityControlPagenation", "qualityControlResultList", pageConfig.apiPage || api.construction.pageConstructionForQualiter);
    searcher.condition(pageConfig.condArr.length > 0 ? pageConfig.condArr : ["decoration-orderId", "decoration-village", "decoration-houseNumber", "decoration-designer", "decoration-projectStatus"]);
    searcher.history("qualityControlPostData");
    searcher.param({
        "user.userId": quality.userId,
    });

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
            field: "village",
            name: "楼盘",
            prop: "house.village.name",
            clazz: "grey",
            click: function(btn, v) {

                tools.house.info(btn, v.house.hid);
            }
        },
        "houseNumber": {
            field: "houseNumber",
            name: "楼号",
            prop: "house.houseNumber",
            clazz: "grey"
        },
        "customer": {
            field: "customer",
            name: "客户",
            prop: "customer.name",
            clazz: "grey",
            click: function(btn, v) {

                tools.customer.info(btn, v.customer.cid);
            }
        },
        "designer": {
            field: "designer",
            name: "设计师",
            prop: "designer.userName",
            clazz: "grey",
            click: function(btn, v) {

                tools.personel.info(btn, v.designer.userId);
            }
        },
        "user": {
            field: "user",
            name: "施工人员",
            prop: "user.currentName",
            clazz: "grey",
            click: function(btn, v) {

                tools.personel.info(btn, v.user.userId);
            }
        },
        "orderTotalPrice": {
            field: "orderTotalPrice",
            name: "总价",
            prop: "orderTotalPrice",
            clazz: "blue"
        },
        "version": {
            field: "version",
            name: "报价版本",
            prop: "version.name",
            clazz: "grey"
        },
        "buildArea": {
            field: "buildArea",
            name: "面积",
            prop: "house.buildArea",
            clazz: "blue"
        },
        "projectStatus": {
            field: "projectStatus",
            name: "进度",
            prop: "projectStatus",
            dataset: constant.decoration().decoration.projectStatus.keys,
            clazz: "red"
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
            dataset: constant.construction().qualiter.status.keys,
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
        name: "信息",
        clazz: "btn-yellow",
        handle: function(v) {

            com.post(api.construction.queryConstructionInfoByOrderId, {
                "constructionInfo.orderId": v.orderId
            }, function(res) {

                data = res.constructionInfo;

                quality.items.orderId = v.orderId;
                quality.items.ishovel.val(data.ishovel);
                quality.items.iskey.val(data.iskey);
                quality.items.isCeremony.val(data.isCeremony);
                quality.items.timeLimit.val(data.timeLimit);
                if (data.finishTime != null) {
                    quality.items.finishTime.val(data.finishTime.substr(0, 10));
                }
                if (data.keyTime != null) {
                    quality.items.keyTime.val(data.keyTime.substr(0, 10));
                }
                if (data.drawlineTime != null) {
                    quality.items.drawlineTime.val(data.drawlineTime.substr(0, 10));
                }
                if (data.designTime != null) {
                    quality.items.designTime.val(data.designTime.substr(0, 10));
                }
                quality.items.comment.val(data.comment);
            });

            quality.modals.constructionInfoModal.modal("show");

            return false;
        },
        show: function() {

            return btnVisible("info");
        }
    }, {
        name: "施工节点",
        clazz: "btn-success",
        handle: function(v) {

            params.construction.orderId = v.orderId;

            params.construction.cid = v.cid;

            com.popup4page("#stockRecordPopUp", "/views/construction/supervision4detail.html", "查看");

            return false;
        },
        show: function() {

            return btnVisible("view");
        }
    }];

    searcher.line("orderId", lineprops, linebtus).render();

    function saveData() {

        var options = {
            "constructionInfo.orderId": quality.items.orderId,
            "constructionInfo.decoration.orderId": quality.items.orderId,
            "constructionInfo.timeLimit": quality.items.timeLimit.val(),
            "constructionInfo.ishovel": quality.items.ishovel.val(),
            "constructionInfo.iskey": quality.items.iskey.val(),
            "constructionInfo.isCeremony": quality.items.isCeremony.val(),
            "constructionInfo.finishTime": quality.items.finishTime.val() + " 00:00:00",
            "constructionInfo.keyTime": quality.items.keyTime.val() + " 00:00:00",
            "constructionInfo.drawlineTime": quality.items.drawlineTime.val() + " 00:00:00",
            "constructionInfo.designTime": quality.items.designTime.val() + " 00:00:00",
            "constructionInfo.comment": quality.items.comment.val()
        };

        com.post(api.construction.updateConstructionInfoByOrderId, options, function(res) {

            com.showAlert(com.info, "操作成功");

            quality.modals.constructionInfoModal.modal("hide");
        });
    }
});