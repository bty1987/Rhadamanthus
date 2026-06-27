$(function() {

    var constructionNodes = {

        modals: {
            constructionInfoModal: com.focusPage("#constructionInfoModal"),
            printQuotationCNModal: com.focusPage("#printQuotationCNModal"),
            printNormtimeCNModal: com.focusPage("#printNormtimeCNModal"),
        },

        btns: {
            saveBtn: com.focusPage("#saveBtn"),
            printNormriceSBtn: com.focusPage("#printNormriceSBtn"),
            printNormriceWBtn: com.focusPage("#printNormriceWBtn"),
            printNormtimeSBtn: com.focusPage("#printNormtimeSBtn"),
            printNormtimeWBtn: com.focusPage("#printNormtimeWBtn"),
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
        constructionNode: com.focusPage("#constructionNode"),
        normtimeConstructionNode: com.focusPage("#normtimeConstructionNode"),
        quotationDetail: {},
        pageType: params.urlLoadParams.type,

    };

    constructionNodes.btns.saveBtn.bindClick(saveData);

    constructionNodes.btns.printNormriceSBtn.bindClick(printNormriceS);
    constructionNodes.btns.printNormriceWBtn.bindClick(printNormriceW);
    constructionNodes.btns.printNormtimeSBtn.bindClick(printNormtimeS);
    constructionNodes.btns.printNormtimeWBtn.bindClick(printNormtimeW);

    constructionNodes.modals.constructionInfoModal.on("hide.bs.modal", function() {

        com.cleanItems(constructionNodes.items);
        com.closeTip();
    });

    com.datetime(constructionNodes.items.finishTime);
    com.datetime(constructionNodes.items.keyTime);
    com.datetime(constructionNodes.items.drawlineTime);
    com.datetime(constructionNodes.items.designTime);

    constructionNodes.constructionNode.bindData(constant.data().construction.node.datas, "key", "value", false);
    constructionNodes.normtimeConstructionNode.bindData(constant.data().construction.node.datas, "key", "value", false);

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
                    viewSupervisionDetail(v.orderId, v.customer.cid);
                }
            },
            addReduce: {
                name: "增减项",
                clazz: "btn-warning",
                handle: function(v) {
                    viewAddReduceIndex(v.orderId, v.type);
                }
            },
            money: {
                name: "扣款",
                clazz: "btn-info",
                handle: function(v) {
                    viewDelGold(v.orderId);
                }
            },
            quota: {
                name: "定额材料",
                clazz: "btn-purple",
                handle: function(v) {
                    params.quotation.orderId = v.orderId;
                    com.popup4page("#stockRecordPopUp", "/views/construction/normtion.html", "定额材料");
                }
            },
            quopt: {
                name: "定额工费",
                clazz: "btn-danger",
                handle: function(v) {
                    constructionNodes.quotationDetail = {};

                    com.post(api.quotation.queryQuotationForDefaultByOrderId, {
                        "quotation.orderId": v.orderId
                    }, function(res) {
                        constructionNodes.quotationDetail.quotation = res.quotation;
                    }, null, false);

                    var quotationId = constructionNodes.quotationDetail.quotation.qid;

                    params.quotation.orderId = v.orderId;
                    params.quotation.orderType = v.type;
                    params.quotation.quotationId = quotationId;
                    params.quotation.subtype = [1];
                    params.quotation.showType = {
                        itemtype: 4
                    };
                    params.quotation.pageType = constructionNodes.pageType;

                    constructionNodes.modals.printQuotationCNModal.modal("show");
                }
            },
            normtime: {
                name: "定额工时",
                clazz: "btn-pink",
                handle: function(v) {
                    constructionNodes.quotationDetail = {};

                    com.post(api.quotation.queryQuotationForDefaultByOrderId, {
                        "quotation.orderId": v.orderId
                    }, function(res) {
                        constructionNodes.quotationDetail.quotation = res.quotation;
                    }, null, false);

                    var quotationId = constructionNodes.quotationDetail.quotation.qid;

                    params.quotation.orderId = v.orderId;
                    params.quotation.orderType = v.type;
                    params.quotation.quotationId = quotationId;
                    params.quotation.subtype = [1];
                    params.quotation.showType = {
                        itemtype: 5
                    };
                    params.quotation.pageType = constructionNodes.pageType;

                    constructionNodes.modals.printNormtimeCNModal.modal("show");
                }
            }
        };
    })();

    var searcher = new Searcher();

    searcher.set("supervisionCondList", "supervisionPagenation", "supervisionResultList", api.construction.pageConstruction, null, ['decoration-orderId', 'decoration-village', 'decoration-houseNumber', 'decoration-designer', 'decoration-projectStatus'], "supervisionSeacherPostData", null, false, null);
    searcher.line("orderId", lineprops, linebtns).render();

    function viewSupervisionDetail(orderId, cid) {

        params.construction.orderId = orderId;

        params.construction.cid = cid;

        com.popup4page("#stockRecordPopUp", "/views/construction/supervision4detail.html", "查看");
    }

    function viewAddReduceIndex(orderId, type) {

        params.quotation.orderId = orderId;

        params.historyPage = api.index.supervisionIndex.url;

        com.switchPage(api.index.addReduceIndex.url);
    }

    function viewReworkIndex(orderId) {

        params.construction.orderId = orderId;

        com.popup4page("#stockRecordPopUp", "/views/construction/supervision4rework.html", "返工");
    }

    function viewDelGold(orderId) {

        params.decoration.orderId = orderId;
        params.decoration.auditStatusType = "select";

        com.popup4page("#stockRecordPopUp", "/views/decoration/audit4record.html", "扣款");
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

    function printNormriceS() {

        params.quotation.type = 1;
        params.quotation.subtype = 0;
        params.quotation.workType = constructionNodes.constructionNode.val();

        var $subtypes = com.focusPage('input[name="type"]:checked', '#subtype');

        $.each($subtypes, function(i, v) {

            params.quotation.subtype = parseInt(params.quotation.subtype) + parseInt($(v).attr('value'));
        });

        com.popup("打印报价", "/views/quotation/normriceOutput.html", null, null, true);

        constructionNodes.modals.printQuotationCNModal.modal("hide");
    }

    function printNormriceW() {

        params.quotation.type = 2;
        params.quotation.subtype = 0;
        params.quotation.workType = constructionNodes.constructionNode.val();

        var $subtypes = com.focusPage('input[name="type"]:checked', '#subtype');

        $.each($subtypes, function(i, v) {

            params.quotation.subtype = parseInt(params.quotation.subtype) + parseInt($(v).attr('value'));
        });

        com.popup("打印报价", "/views/quotation/normriceOutput.html", null, null, true);

        constructionNodes.modals.printQuotationCNModal.modal("hide");
    }

    function printNormtimeS() {

        params.quotation.type = 1;
        params.quotation.subtype = 0;
        params.quotation.workType = constructionNodes.normtimeConstructionNode.val();

        var $subtypes = com.focusPage('input[name="normtimeType"]:checked', '#normtimeSubtype');

        $.each($subtypes, function(i, v) {

            params.quotation.subtype = parseInt(params.quotation.subtype) + parseInt($(v).attr('value'));
        });

        com.popup("打印定额工时", "/views/quotation/normtimeOutput.html", null, null, true);

        constructionNodes.modals.printNormtimeCNModal.modal("hide");
    }

    function printNormtimeW() {

        params.quotation.type = 2;
        params.quotation.subtype = 0;
        params.quotation.workType = constructionNodes.normtimeConstructionNode.val();

        var $subtypes = com.focusPage('input[name="normtimeType"]:checked', '#normtimeSubtype');

        $.each($subtypes, function(i, v) {

            params.quotation.subtype = parseInt(params.quotation.subtype) + parseInt($(v).attr('value'));
        });

        com.popup("打印定额工时", "/views/quotation/normtimeOutput.html", null, null, true);

        constructionNodes.modals.printNormtimeCNModal.modal("hide");
    }

});
