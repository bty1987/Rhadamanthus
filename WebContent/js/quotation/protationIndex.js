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
            content: com.focusPage("#content", "#protationModal"),
            preferPrice: com.focusPage("#preferPrice", "#protationModal"),
            managePrice: com.focusPage("#managePrice", "#protationModal")
        },

        decorationOrderId: params.decorationOrderId,

        editFlg: 0,
        leftflg: false,
        rightflg: false,

    };

    com.post(api.quotation.queryPresignProduce, {}, function(res) {

        protation.items.produce.bindData(res.presignProduces, "ppid", "name");
    })

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

        if (com.validate("protationModal")) {
            return;
        }

        if (protation.editFlg == 0) {
            var options = {
                "protation.ppid": protation.items.produce.val(),
                "protation.orderId": protation.decorationOrderId,
                "protation.name": protation.items.name.val(),
                "protation.content": protation.items.content.val(),
                "protation.preferPrice": protation.items.preferPrice.val(),
                "protation.managePrice": protation.items.managePrice.val()
            };
            com.post(api.quotation.addProtation, options, function(res) {

                protation.modals.protationModal.modal("hide");
                searcher.doSearch();
            }, null, false);
        } else if (protation.editFlg == 1) {
            var options = {
                "protation.orderId": protation.decorationOrderId,
                "protation.pid": protation.items.pid.val(),
                "protation.name": protation.items.name.val(),
                "protation.content": protation.items.content.val(),
                "protation.preferPrice": protation.items.preferPrice.val(),
                "protation.managePrice": protation.items.managePrice.val()
            };

            com.post(api.quotation.updateProtation, options, function(res) {

                var _pid = protation.items.pid.val();
                var name = protation.items.name.val();
                var content = protation.items.content.val();
                var preferPrice = protation.items.preferPrice.val();
                var managePrice = protation.items.managePrice.val();

                com.focusPage("#h4name_" + _pid).text(name);
                com.focusPage("#name_" + _pid).text('名称:' + name);
                com.focusPage("#content_" + _pid).text('备注:' + content);
                com.focusPage('#preferPrice' + _pid).text('优惠价:' + preferPrice);
                com.focusPage('#managePrice' + _pid).text('管理费:' + managePrice);

                com.showAlert(com.info, "操作成功");
                protation.modals.protationModal.modal("hide");
                searcher.doSearch();
            }, null, false);

        }
    });

    initProtationList();

    function initProtationList() {

        var protationList = com.focusPage("#protationList").html("");

        com.post(api.decoration.queryDecorationForCommonByOrderId, {
            "decoration.orderId": protation.decorationOrderId
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

    searcher.set("pageltList", "pageltList", "protationList", api.quotation.queryProtationByOrderId, {
        "protation.orderId": protation.decorationOrderId,
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
        field: "content",
        name: "备注",
        prop: "content"
    }];

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
                protation.items.content.val(res.protation.content);
                protation.items.preferPrice.val(res.protation.preferPrice);
                protation.items.managePrice.val(res.protation.managePrice);

                protation.modals.protationModal.modal("show");
            });
        }
    }, {
        name: "查看",
        clazz: "btn-success",
        handle: function(v) {

            params["orderId"] = v.decorationOrderId;
            params["protationId"] = v.pid;
            com.switchPage("views/quotation/protationPart.html");
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
                    "protation.orderId": protation.decorationOrderId
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
                    "protation.orderId": protation.decorationOrderId,
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

    searcher.card("name", cardprops, cardbtns).render();

});