$(function() {

    var constructionNodes = {

        constructionSchedule: {},

        modals: {
            constructionInfoModal: com.focusPage("#constructionInfoModal")
        },

        btns: {
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

    constructionNodes.btns.saveBtn.bindClick(saveData);

    constructionNodes.modals.constructionInfoModal.on("hide.bs.modal", function() {

        com.cleanItems(constructionNodes.items);
        com.closeTip();
    });

    com.datetime(constructionNodes.items.finishTime);
    com.datetime(constructionNodes.items.keyTime);
    com.datetime(constructionNodes.items.drawlineTime);
    com.datetime(constructionNodes.items.designTime);

    constructionNodes.items.ishovel.bindData(constant.construction().constructionInfo.isHovel.datas, "key", "value");
    constructionNodes.items.iskey.bindData(constant.construction().constructionInfo.isKey.datas, "key", "value");
    constructionNodes.items.isCeremony.bindData(constant.construction().constructionInfo.isCeremony.datas, "key", "value");

    var lineprops = (function() {

        return [{
            field: "orderId",
            name: "装修单",
            prop: "orderId",
            clazz: "blue",
            click: function(btn, v) {
                tools.decoration.info(btn, v.orderId);
            }
        }, {
            field: "house.village.name",
            name: "楼盘",
            prop: "house.village.name",
            clazz: "grey",
            click: function(btn, v) {
                tools.house.info(btn, v.house.hid);
            }
        }, {
            field: "house.houseNumber",
            name: "楼号",
            prop: "house.houseNumber",
            clazz: "grey"
        }, {
            field: "customer.name",
            name: "客户",
            prop: "customer.name",
            clazz: "grey",
            click: function(btn, v) {
                tools.customer.info(btn, v.customer.cid);
            }
        }, {
            field: "designer.userName",
            name: "设计师",
            prop: "designer.userName",
            clazz: "grey",
            click: function(btn, v) {
                tools.personel.info(btn, v.designer.userId);
            }
        }, {
            field: "supervisor.userName",
            name: "监理",
            prop: function(v) { return v.supervisor ? v.supervisor.userName : ""; },
            clazz: "grey",
            click: function(btn, v) {
                tools.personel.info(btn, v.supervisor.userId);
            }
        }, {
            field: "orderTotalPrice",
            name: "总价",
            prop: "orderTotalPrice",
            clazz: "blue"
        }, {
            field: "house.buildArea",
            name: "面积",
            prop: "house.buildArea",
            clazz: "blue"
        }, {
            field: "orderTotalPrice",
            name: "合同额",
            prop: "orderTotalPrice",
            clazz: "blue"
        }, {
            field: "version.name",
            name: "报价版本",
            prop: "version.name",
            clazz: "grey"
        }, {
            field: "projectStatus",
            name: "进度",
            prop: function(v) { return constant.decoration().decoration.projectStatus.keys[v.projectStatus]; },
            clazz: "red"
        }];
    })();

    var linebtns = (function() {

        return {
            qualiter: {
                name: "质检",
                clazz: "btn-warning",
                handle: function(v) {
                    params.construction.orderId = v.orderId;
                    com.popup4page("#stockRecordPopUp", "/views/construction/qualiter4detail.html", "质检");
                }
            },
            info: {
                name: "信息",
                clazz: "btn-yellow",
                handle: function(v) {
                    viewConstructionInfo(v.orderId);
                }
            },
            view: {
                name: "施工节点",
                clazz: "btn-success",
                handle: function(v) {
                    viewworkerAllocationDetail(v.orderId);
                }
            }
        };
    })();

    var searcher = new Searcher();

    searcher.set("condList", "pagenation", "resultList", api.construction.pageConstruction, null, ['decoration-orderId', 'decoration-village', 'decoration-houseNumber', 'decoration-designer', 'decoration-projectStatus'], "workerAllocationSeacherPostData", null, false, null);
    searcher.line("orderId", lineprops, linebtns).render();

    function viewworkerAllocationDetail(orderId) {

        params.construction.orderId = orderId;
        com.popup4page("#stockRecordPopUp", "/views/construction/allocation4detail.html", "查看");
    }

    function viewConstructionInfo(orderId) {

        com.post(api.construction.queryConstructionInfoByOrderId, {
            "constructionInfo.orderId": orderId
        }, function(res) {

            data = res.constructionInfo;

            constructionNodes.items.orderId = orderId;
            constructionNodes.items.ishovel.val(data.ishovel);
            constructionNodes.items.iskey.val(data.iskey);
            constructionNodes.items.isCeremony.val(data.isCeremony);
            constructionNodes.items.timeLimit.val(data.timeLimit);
            if (data.finishTime != null) {
                constructionNodes.items.finishTime.val(data.finishTime.substr(0, 10));
            }
            if (data.keyTime != null) {
                constructionNodes.items.keyTime.val(data.keyTime.substr(0, 10));
            }
            if (data.drawlineTime != null) {
                constructionNodes.items.drawlineTime.val(data.drawlineTime.substr(0, 10));
            }
            if (data.designTime != null) {
                constructionNodes.items.designTime.val(data.designTime.substr(0, 10));
            }
            constructionNodes.items.comment.val(data.comment);
        });

        constructionNodes.modals.constructionInfoModal.modal("show");
    }

    function saveData() {

        var options = {
            "constructionInfo.orderId": constructionNodes.items.orderId,
            "constructionInfo.decoration.orderId": constructionNodes.items.orderId,
            "constructionInfo.timeLimit": constructionNodes.items.timeLimit.val(),
            "constructionInfo.ishovel": constructionNodes.items.ishovel.val(),
            "constructionInfo.iskey": constructionNodes.items.iskey.val(),
            "constructionInfo.isCeremony": constructionNodes.items.isCeremony.val(),
            "constructionInfo.finishTime": constructionNodes.items.finishTime.val() + " 00:00:00",
            "constructionInfo.keyTime": constructionNodes.items.keyTime.val() + " 00:00:00",
            "constructionInfo.drawlineTime": constructionNodes.items.drawlineTime.val() + " 00:00:00",
            "constructionInfo.designTime": constructionNodes.items.designTime.val() + " 00:00:00",
            "constructionInfo.comment": constructionNodes.items.comment.val()
        };

        com.post(api.construction.updateConstructionInfoByOrderId, options, function(res) {

            com.showAlert(com.info, "操作成功");

            constructionNodes.modals.constructionInfoModal.modal("hide");
        });
    }

});
