$(function() {

    var protation = {

        protationList: com.focusPage("#protationList"),
        decorationInfo: com.focusPage("#decorationInfo"),

        modals: {
            protationModal: com.focusPage('#protationModal'),
        },

        items: {
            pid: com.focusPage("#pid", "#protationModal"),
            name: com.focusPage("#name", "#protationModal"),
            produce: com.focusPage("#produce", "#protationModal"),
            comment: com.focusPage("#comment", "#protationModal"),
            preferPrice: com.focusPage("#preferPrice", "#protationModal"),
            managePrice: com.focusPage("#managePrice", "#protationModal"),
            decorationInfo: com.focusPage("#decorationInfo"),
        },

        datasets: {

            status: {},

            decorationStatus: {},
        },

        orderId: params.quotation.orderId,

        pageType: params.urlLoadParams.type,

        editFlg: 0,
        leftflg: false,
        rightflg: false,

    };

    com.post(api.quotation.queryPresignProduce, {}, function(res) {

        protation.items.produce.bindData(res.presignProduces, "ppid", "name");
    });

    com.post(api.ds.decoration, {}, function(res) {

        protation.datasets.decorationStatus = res.decorationOrderStatus.split("key", "value");

    }, null, false);

    com.post(api.ds.quotation, {}, function(res) {

        protation.datasets.status = res.protationStatus.split("key", "value");

    }, null, false);

    com.focusPage('#fl-statement').statement("装修单", "预签");

    com.focusPage('#btnBack').on('click', function() {

        com.switchPage("/views/decoration/decoration.html");
    });

    com.focusPage('#createProtation').on('click', function() {

        protation.editFlg = 0;
        com.clearValidator();
        com.cleanItems(protation.items);
        protation.modals.protationModal.modal("show");
    });

    com.focusPage('#saveBtn').bindClick(function() {

        if (com.validate("protationModal"))
            return false;

        if (protation.editFlg == 0) {
            var options = {
                "protation.ppid": protation.items.produce.val(),
                "protation.orderId": protation.orderId,
                "protation.name": protation.items.name.val(),
                "protation.comment": protation.items.comment.val(),
                "protation.preferPrice": protation.items.preferPrice.val(),
                "protation.managePrice": protation.items.managePrice.val()
            };
            com.post(api.quotation.addProtation, options, function(res) {

                protation.modals.protationModal.modal("hide");
                searcher.doSearch();
            }, null, false);
        } else if (protation.editFlg == 1) {
            var options = {
                "protation.orderId": protation.orderId,
                "protation.pid": protation.items.pid.val(),
                "protation.name": protation.items.name.val(),
                "protation.comment": protation.items.comment.val(),
                "protation.preferPrice": protation.items.preferPrice.val(),
                "protation.managePrice": protation.items.managePrice.val()
            };

            com.post(api.quotation.updateProtation, options, function(res) {

                var _pid = protation.items.pid.val();
                var name = protation.items.name.val();
                var comment = protation.items.comment.val();
                var preferPrice = protation.items.preferPrice.val();
                var managePrice = protation.items.managePrice.val();

                com.focusPage("#h4name_" + _pid).text(name);
                com.focusPage("#name_" + _pid).text('名称:' + name);
                com.focusPage("#comment" + _pid).text('备注:' + comment);
                com.focusPage('#preferPrice' + _pid).text('优惠价:' + preferPrice);
                com.focusPage('#managePrice' + _pid).text('管理费:' + managePrice);

                com.showAlert(com.info, "操作成功");
                protation.modals.protationModal.modal("hide");
                searcher.doSearch();
            }, null, false);

        }
    });

    function initProtationList() {

        var protationList = com.focusPage("#protationList").html("");

        com.post(api.decoration.queryDecorationForCommonByOrderId, {
            "decoration.orderId": protation.orderId
        }, function(res) {

            drawdecoration(res.decoration);
        }, null, false);

    }

    function drawdecoration(decoration) {

        var protationDiv = $('<div></div>').addClass("col-xs-6 col-md-3").attr('id', 'protationDiv_' + pid).prependTo(decorationInfo);
        var protationWidget = $('<div></div>').addClass("widget-box").appendTo(protationDiv);
        var protationWidgetHeader = $('<div></div>').addClass("widget-header header-color-orange").appendTo(protationWidget);

        var name = $('<h4></h4>').attr('id', 'h4name_').text("装修单").appendTo(protationWidgetHeader);

        var protationWidgetBody = $('<div></div>').addClass("widget-body").appendTo(protationWidget);
        var protationWidgetMain = $('<div></div>').addClass("widget-main").appendTo(protationWidgetBody);
        var protationWidgetInfoDiv = $('<div></div>').css("padding", "5px").appendTo(protationWidgetMain);

        var protationWidgetDivOne = $('<div></div>').appendTo(protationWidgetInfoDiv);
        var protationWidgetLabelOne = $('<label></label>').attr('for', 'form-field').attr('id', 'name_' + pid).text('装修单号: ' + decoration.orderId).appendTo(protationWidgetDivOne);
        var protationWidgetDivTwo = $('<div></div>').appendTo(protationWidgetInfoDiv);
        var protationWidgetLabelTwo = $('<label></label>').attr('for', 'form-field').attr('id', 'style_' + pid).text('楼盘地址: ' + decoration.house.village.name + " " + decoration.house.houseNumber).appendTo(protationWidgetDivTwo);
        var protationWidgetDivThr = $('<div></div>').appendTo(protationWidgetInfoDiv);
        var protationWidgetLabelThr = $('<label></label>').attr('for', 'form-field').attr('id', 'time_' + pid).text('报价版本: ' + decoration.version.name).appendTo(protationWidgetDivThr);

    }

    var searcher = new Searcher();

    var cardbtns = [{
        name: "修改",
        clazz: "btn-blue",
        handle: function(v) {

            protation.editFlg = 1;

            com.clearValidator();

            com.post(api.quotation.queryProtationByPid, {
                "protation.pid": v.pid
            }, function(res) {

                protation.items.pid.val(res.protation.pid);
                protation.items.name.val(res.protation.name);
                protation.items.comment.val(res.protation.comment);
                protation.items.preferPrice.val(res.protation.preferPrice);
                protation.items.managePrice.val(res.protation.managePrice);

                protation.modals.protationModal.modal("show");
            });
        }
    }, {
        name: "查看",
        clazz: "btn-success",
        handle: function(v) {

            params.historyPage = api.index.protationIndex.url;

            v.orderId = v.decoration ? v.decoration = v.decoration.orderId : v.orderId;

            params.quotation.protation = v;

            com.switchPage(api.index.protationPart.url);
        }
    }, {
        name: "删除",
        clazz: "btn-danger",
        handle: function(v) {

            if (com.focusPage("#defaultProtation_" + $(this).attr("data-pid")).hasClass("hide")) {
                com.showAlert(com.warning, "默认预签不能删除");
                return false;
            }

            var dataname = v.name;

            com.showConfirm("确定要删除预签: " + dataname, function() {

                com.post(api.quotation.deleteProtation, {
                    "protation.pid": v.pid,
                    "protation.orderId": protation.orderId
                }, function(res) {

                    searcher.doSearch();
                });
            });
        }
    }, {
        name: "默认",
        clazz: "btn-inverse",
        handle: function(v) {

            if (v.defaults == 0) {
                var that = $(this)
                var options = {
                    "protation.pid": v.pid,
                    "protation.orderId": protation.orderId,
                }

                com.post(api.quotation.changeProtationForDefault, options, function(res) {

                    that.addClass("hide");
                    searcher.doSearch();
                    com.focusPage("#presignQuotation_" + that.attr("data-pid")).removeClass("hide");
                });
            }
        },
        show: function(v) {

            return (v.defaults == 0);
        }
    }, {
        name: "锁定",
        clazz: "btn-pink",
        handle: function(v) {

            var that = $(this);
            var pid = v.pid
            var unlockBtn = $("#unlockProtation" + pid)

            var options = {
                "protation.pid": pid
            }

            com.post(api.quotation.lockProtation, options, function(res) {

                com.showAlert(com.info, "锁定成功");
                that.addClass("hide");
                searcher.doSearch();
            });
        },
        show: function(v) {

            return (v.status == 0);
        }
    }, {
        name: "解锁",
        clazz: "btn-info",
        handle: function(v) {

            var that = $(this);
            var pid = v.pid
            var lockBtn = $("#lockProtation" + pid)

            var options = {
                "protation.pid": pid
            }

            com.post(api.quotation.unlockProtation, options, function(res) {

                com.showAlert(com.info, "解锁成功");
                that.addClass("hide");
                searcher.doSearch();
            })
        },
        show: function(v) {

            return (v.status == 2);
        }
    }];

    if (protation.pageType == null) {

        initProtationList();

        searcher.set("pageltList", "pageltList", "resultList", api.quotation.queryProtationByOrderId, {
            "protation.orderId": protation.orderId,
        }, null, null, "protations", true);

        var cardprops = [{
            field: "name",
            name: "名称",
            prop: "name"
        }, {
            field: "createTime",
            name: "时间",
            prop: "createTime"
        }, {
            field: "totalPrice",
            name: "总价",
            prop: "totalPrice"
        }, {
            field: "comment",
            name: "备注",
            prop: "comment"
        }];

        searcher.card("name", cardprops, cardbtns);
    }

    if (protation.pageType == "page") {

        protation.items.decorationInfo.addClass("hide");

        com.focusPage('#fl-statement').addClass("hide");
        com.focusPage('#hr-dotted').addClass("hide");
        com.focusPage('#dotted').addClass("hide");

        searcher.base("condList", "pagenation", "resultList", api.quotation.pageProtation);
        searcher.condition(["quotation-protation-decoration-orderId", "quotation-protation-decoration-village", "quotation-protation-decoration-designer", "quotation-protation-decoration-salesman", "quotation-protation-decoration-status", "quotation-protation-createTime", "quotation-protation-status"]);

        var cardprops = [{
            field: "decoration.orderId",
            name: "装修单号",
            prop: "decoration.orderId",
            clazz: "blue"
        }, {
            field: "name",
            name: "楼盘",
            prop: "decoration.house.village.name",
            clazz: "grey"
        }, {
            field: "houseNumber",
            name: "楼号",
            prop: "decoration.house.houseNumber",
            clazz: "grey"
        }, {
            field: "name",
            name: "客户名",
            prop: "decoration.customer.name",
            clazz: "grey"
        }, {
            field: "currentName",
            name: "设计师",
            prop: "decoration.designer.currentName",
            clazz: "grey"
        }, {
            field: "currentName",
            name: "业务员",
            prop: "decoration.salesman.currentName",
            clazz: "grey"
        }, {
            field: "buildArea",
            name: "面积",
            prop: "decoration.house.buildArea",
            clazz: "blue"
        }, {
            field: "decoration.status",
            name: "订单状态",
            prop: "decoration.status",
            dataset: protation.datasets.decorationStatus,
            clazz: "red"
        }, {
            type: "newline"
        }, {
            field: "name",
            name: "名称",
            prop: "name",
            clazz: "grey"
        }, {
            field: "createTime",
            name: "创建时间",
            prop: "createTime",
            clazz: "green"
        }, {
            field: "creater.currentName",
            name: "创建人",
            prop: "creater.currentName",
            clazz: "grey"
        }, {
            field: "quotePrice",
            name: "起报价",
            prop: "quotePrice",
            clazz: "blue"
        }, {
            field: "quoteArea",
            name: "起报面积",
            prop: "quoteArea",
            clazz: "blue"
        }, {
            field: "unitPrice",
            name: "计价单价",
            prop: "unitPrice",
            clazz: "blue"
        }, {
            field: "profitRate",
            name: "利润率",
            prop: "profitRate",
            clazz: "blue"
        }, {
            field: "basicPrice",
            name: "基础额",
            prop: "basicPrice",
            clazz: "blue"
        }, {
            field: "comdPrice",
            name: "工程额",
            prop: "comdPrice",
            clazz: "blue"
        }, {
            field: "commPrice",
            name: "主材额",
            prop: "commPrice",
            clazz: "blue"
        }, {
            field: "adddPrice",
            name: "增工额",
            prop: "adddPrice",
            clazz: "blue"
        }, {
            field: "addmPrice",
            name: "增主额",
            prop: "addmPrice",
            clazz: "blue"
        }, {
            field: "subdPrice",
            name: "减工额",
            prop: "subdPrice",
            clazz: "blue"
        }, {
            field: "submPrice",
            name: "减主额",
            prop: "submPrice",
            clazz: "blue"
        }, {
            field: "totalPrice",
            name: "总额",
            prop: "totalPrice",
            clazz: "blue"
        }, {
            field: "mostPrice",
            name: "主材成本",
            prop: "mostPrice",
            clazz: "grey"
        }, {
            field: "costRate",
            name: "工程增项成本比例",
            prop: "costRate",
            clazz: "blue"
        }, {
            field: "mostRate",
            name: "主材增项成本比例",
            prop: "mostRate",
            clazz: "blue"
        }, {
            field: "totalCost",
            name: "成本总额",
            prop: "totalCost",
            clazz: "blue"
        }, {
            field: "totalProfit",
            name: "利润总额",
            prop: "totalProfit",
            clazz: "blue"
        }, {
            field: "comment",
            name: "备注",
            prop: "comment",
            clazz: "grey"
        }, {
            field: "status",
            name: "状态",
            prop: "status",
            dataset: protation.datasets.status,
            clazz: "red"
        }];

        searcher.line("decoration.orderId", cardprops, cardbtns);

    }

    searcher.render();
});