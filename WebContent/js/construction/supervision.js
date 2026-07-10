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

    // 获取页面控制参数(按公司差异化配置)
    var pageConfig = constructionPage.getConfig("supervision");

    // pageBtn 配置为空时, 所有按钮按原逻辑显示; 否则需在 pageBtn 中存在
    function btnVisible(key) {

        return pageConfig.pageBtn.length == 0 || pageConfig.pageBtn.contains(key);
    }

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
            field: "house.village.name",
            name: "楼盘",
            prop: "house.village.name",
            clazz: "grey",
            click: function(btn, v) {
                tools.house.info(btn, v.house.hid);
            }
        },
        "houseNumber": {
            field: "house.houseNumber",
            name: "楼号",
            prop: "house.houseNumber",
            clazz: "grey"
        },
        "customer": {
            field: "customer.name",
            name: "客户",
            prop: "customer.name",
            clazz: "grey",
            click: function(btn, v) {
                tools.customer.info(btn, v.customer.cid);
            }
        },
        "designer": {
            field: "designer.userName",
            name: "设计师",
            prop: "designer.userName",
            clazz: "grey",
            click: function(btn, v) {
                tools.personel.info(btn, v.designer.userId);
            }
        },
        "supervisor": {
            field: "supervisor.userName",
            name: "监理",
            prop: function(v) { return v.supervisor ? v.supervisor.userName : ""; },
            clazz: "grey",
            click: function(btn, v) {
                tools.personel.info(btn, v.supervisor.userId);
            }
        },
        "orderTotalPrice": {
            field: "orderTotalPrice",
            name: "总价",
            prop: "orderTotalPrice",
            clazz: "blue"
        },
        "buildArea": {
            field: "house.buildArea",
            name: "面积",
            prop: "house.buildArea",
            clazz: "blue"
        },
        "version": {
            field: "version.name",
            name: "报价版本",
            prop: "version.name",
            clazz: "grey"
        },
        "projectStatus": {
            field: "projectStatus",
            name: "进度",
            prop: function(v) { return constant.decoration().decoration.projectStatus.keys[v.projectStatus]; },
            clazz: "red"
        }
    };

    // 根据配置 propertyArr 组装列定义, 配置为空则使用全部默认列
    var lineprops = (function() {

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

    var linebtns = (function() {

        return {
            info: {
                name: "信息",
                clazz: "btn-yellow",
                handle: function(v) {
                    viewConstructionInfo(v.orderId);
                },
                show: function() {
                    return btnVisible("info");
                }
            },
            view: {
                name: "施工节点",
                clazz: "btn-success",
                handle: function(v) {
                    viewSupervisionDetail(v.orderId, v.customer.cid);
                },
                show: function() {
                    return btnVisible("view");
                }
            },
            addReduce: {
                name: "增减项",
                clazz: "btn-warning",
                handle: function(v) {
                    viewAddReduceIndex(v.orderId, v.type);
                },
                show: function() {
                    return btnVisible("addReduce");
                }
            },
            money: {
                name: "扣款",
                clazz: "btn-info",
                handle: function(v) {
                    viewDelGold(v.orderId);
                },
                show: function() {
                    return btnVisible("money");
                }
            },
            quota: {
                name: "定额材料",
                clazz: "btn-purple",
                handle: function(v) {
                    params.quotation.orderId = v.orderId;
                    com.popup4page("#stockRecordPopUp", "/views/construction/normtion.html", "定额材料");
                },
                show: function() {
                    return btnVisible("quota");
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
                },
                show: function() {
                    return btnVisible("quopt");
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
                },
                show: function() {
                    return btnVisible("normtime");
                }
            }
        };
    })();

    var searcher = new Searcher();

    searcher.set("supervisionCondList", "supervisionPagenation", "supervisionResultList", pageConfig.apiPage || api.construction.pageConstruction, null, pageConfig.condArr.length > 0 ? pageConfig.condArr : ['decoration-orderId', 'decoration-village', 'decoration-houseNumber', 'decoration-designer', 'decoration-projectStatus'], "supervisionSeacherPostData", null, false, null);
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

        com.popup4page("#stockRecordPopUp", "/views/decoration/decorationAuditRecord.html", "扣款");
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
