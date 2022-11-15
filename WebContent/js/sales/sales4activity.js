$(function() {

    var salesActivityItem = {

        orderId: params.sales.sales.orderId,
        pagetype: params.sales.type,

        items: {
            things: com.focusPage("#things"),
            coupons: com.focusPage("#coupons"),
            paper: com.focusPage("#paper"),
            thingsName: com.focusPage("#thingsName"),
            thingsNum: com.focusPage("#thingsNum"),
            paperName: com.focusPage("#paperName"),
            paperNum: com.focusPage("#paperNum"),
            couponsName: com.focusPage("#couponsName"),
            couponsNum: com.focusPage("#couponsNum"),
            activity: com.focusPage("#activity"),
            commentName: com.focusPage("#commentName"),
            salesActivityComment: com.focusPage("#salesActivityComment")
        },
        modal: {
            salesActivityCommentModal: com.focusPage("#salesActivityCommentModal"),
        },
        btn: {
            submitSalesActivityCommentBtn: com.focusPage("#submitSalesActivityCommentBtn"),
            cancelCommentBtn: com.focusPage("#cancelCommentBtn"),
            activityTab: com.focusPage("#activityTab")
        },

        activity: {},
        activityItemType: constant.decoration().decorationActivityItem.status.keys,
        depositpayStatus: constant.sales().sales.depositpayStatus.keys,
        fullpayStatus: constant.sales().sales.fullpayStatus.keys,
        type: constant.sales().salesActivityItem.type.keys,
        isAffirm: constant.sales().salesActivityItem.isAffirm.keys,

        saiid: null,
        url: null,
        info: null
    };

    com.focusPage("#activitys").removeClass("active");

    salesActivityItem.items.content = com.focusPage("#salesActivityItemContent");
    salesActivityItem.salesActivityItemModal = com.focusPage("#salesActivityItemModal").on('show.bs.modal', function(e) {

        com.resetTypeahead("thingsName", []);
        com.resetTypeahead("couponsName", []);
        com.resetTypeahead("paperName", []);
        com.clearValidator();
    });

    com.focusPage("#thingsAdd").unbind().click(function() {

        if (com.validate("thingsInputs", "bottom")) {
            return;
        }
        createOne("things");
        salesActivityItem.items.thingsName.val("");
        salesActivityItem.items.thingsNum.val("");
    });

    com.focusPage("#couponsAdd").unbind().click(function() {

        if (com.validate("couponInputs", "bottom")) {
            return;
        }
        createOne("coupons");
        salesActivityItem.items.couponsName.val("");
        salesActivityItem.items.couponsNum.val("");
    });
    com.focusPage("#paperAdd").unbind().click(function() {

        if (com.validate("paperInputs", "bottom")) {
            return;
        }
        createOne("paper");
        salesActivityItem.items.paperName.val("");
        salesActivityItem.items.paperNum.val("");
    });

    function createOne(oneString) {

        var $li = $("<li></li>").css({
            "background-color": "#91b8d0",
            "margin-bottom": "5px",
            "margin-right": "5px"
        }).appendTo(com.focusPage("#" + oneString));
        var aisd = com.focusPage("#" + oneString + "Name").attr("data-typeahead-key");
        var name = com.focusPage("#" + oneString + "Name").val();
        var num = com.focusPage("#" + oneString + "Num").val();
        var $span = $("<span></span>").css({
            'color': '#fff'
        }).attr(oneString + 'Name', name).attr('num', num).attr('asid', aisd).html(name).appendTo($li);
        var $spanTwo = $("<span></span>").css({
            'font-size': '16px',
            'color': '#fff',
            'margin': '0 5px'
        }).html(" 数量:" + num).appendTo($span);
        var $a = $("<a></a>").addClass("glyphicon glyphicon-remove").css({
            'color': '#d15b47'
        }).appendTo($li);
        $a.click(function() {

            $li.remove();
        });
    }

    com.selectTypeahead("thingsName", [], 'asid', 'activityItemName');
    com.selectTypeahead("couponsName", [], 'asid', 'activityItemName');
    com.selectTypeahead("paperName", [], 'asid', 'activityItemName');
    salesActivityItem.items.activity.on("change", function() {

        salesActivityItem.items.thingsName.val('');
        salesActivityItem.items.thingsNum.val('');
        salesActivityItem.items.couponsName.val('');
        salesActivityItem.items.couponsNum.val('');
        salesActivityItem.items.paperName.val('');
        salesActivityItem.items.paperNum.val('');

        var $this = $(this);

        var _things = [];
        var _coupons = [];
        var _paper = [];

        var options = {
            "activity.aid": $this.val()
        };

        com.post(api.information.queryActivityItemByAid, options, function(res) {

            var _ = res.activityItems;

            for ( var i = 0; i < _.length; i++) {

                var _activityItem = _[i];

                if (_activityItem.type == 0) {
                    _coupons.push({
                        asid: _activityItem.asid,
                        activityItemName: _activityItem.name + " 金额:" + _activityItem.money + " 积分:" + _activityItem.integral
                    });
                } else if (_activityItem.type == 1) {
                    _things.push({
                        asid: _activityItem.asid,
                        activityItemName: _activityItem.name + " 金额:" + _activityItem.money + " 积分:" + _activityItem.integral
                    });
                } else if (_activityItem.type == 2) {
                    _paper.push({
                        asid: _activityItem.asid,
                        activityItemName: _activityItem.name + " 金额:" + _activityItem.money + " 积分:" + _activityItem.integral
                    });
                }

            }

            com.resetTypeahead("thingsName", _things);
            com.resetTypeahead("couponsName", _coupons);
            com.resetTypeahead("paperName", _paper);
        });
    });

    function orderList() {

        var $btnSub = $('<a></a>').addClass('btn btn-minier btn-success').html('领取物品');
        var $h4 = $('<h4></h4>').addClass('oid').append($('<small></small>').addClass('blue')).html("装修单号:" + salesActivityItem.orderId);
        var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

        var $btnImport = $('<a></a>').addClass('btn btn-minier btn-dark').html('导出').appendTo($divBtnWrap);
        var $btnSend = $('<a></a>').addClass('btn btn-minier btn-info').html('发送').appendTo($divBtnWrap);

        var $divWarp = com.focusPage("#paramsOrder").append($h4);

        $divBtnWrap.append($btnSub).appendTo($h4);

        $btnSub.click(function() {

            com.post(api.information.queryActivityForValid, {
                "activity.type": 3
            }, function(res) {

                var activitys = res.activitys;

                var _activitys = [];

                for ( var i = 0; i < activitys.length; i++) {
                    var _activity = activitys[i];

                    _activitys.push({
                        aid: _activity.aid,
                        activityName: _activity.name,
                        money: _activitys.money
                    });
                }
                salesActivityItem.items.activity.bindData(_activitys, "aid", "activityName", "money", false);
            });

            salesActivityItem.salesActivityItemModal.modal("show")
        });

        $btnImport.click(function() {

            imports();
        });

        $btnSend.click(function() {

            sends();
        });

        return $divWarp;
    }

    orderList();

    salesNo();

    function salesNo() {

        var $divWarp = com.focusPage("#paramsNo").empty();
        var amountPayment = $('<h4 id="payment"></h4>').addClass('oid').append($('<small></small>').addClass('blue'));
        var amountActivity = $('<h4 id="activity_"></h4>').addClass('oid').append($('<small></small>').addClass('blue'));
        var amount = $('<h4 id="num"></h4>').addClass('oid').append($('<small></small>').addClass('blue'));
        var amountSalesPayment = $('<h4 id="amountSalesPayment"></h4>').addClass('oid').append($('<small></small>').addClass('blue'));

        $divWarp.append(amountPayment).append(amountActivity).append(amount).append(amountSalesPayment);

        return $divWarp
    }

    // 活动积分
    function amountSalesActivityForActivity() {

        com.post(api.sales.amountSalesActivityForActivity, {
            "salesActivity.sales.orderId": salesActivityItem.orderId
        }, function(res) {

            com.focusPage("#activity_").html("使用积分: " + res.salesActivity.amount).attr("integral", res.salesActivity.amount);
        }, null, false);
    }

    // 款项积分
    function amountSalesActivityForPayment() {

        com.post(api.sales.amountSalesActivityForPayment, {
            "salesActivity.sales.orderId": salesActivityItem.orderId
        }, function(res) {

            com.focusPage("#payment").html("总积分: " + res.salesActivity.amount).attr("integral", res.salesActivity.amount);
        }, null, false);
    }

    function integral() {

        $('#num').html("剩余积分: " + utils.accSub(parseFloat(com.focusPage("#payment").attr("integral")), parseFloat(com.focusPage("#activity_").attr("integral"))));
    }

    // 销售实付
    function amountSalesPayment() {

        com.post(api.payment.amountSalesPayment, {
            "salesPayment.sales.orderId": salesActivityItem.orderId
        }, function(res) {

            com.focusPage("#amountSalesPayment").html("销售实付: " + res.amount).attr("amount", res.amount);
        }, null, false);
    }

    var options = {
        "orderId": salesActivityItem.orderId
    };

    // 查询活动信息
    function querySalesActivity() {

        com.post(api.sales.amountSalesActivity, options, function(res) {

            var salesActivity = res.salesActivitys;
            var salesActivityContent = com.focusPage("#salesActivityItem").empty();

            for ( var i = 0; i < salesActivity.length; i++) {
                var _salesActivity = salesActivity[i];
                var ul = $("<div></div>").addClass("list-unstyled list-striped pricing-table");
                var nameH2 = $("<h3></h3>").text("活动名称:").appendTo(ul);
                var nameLi = $("<li></li>").appendTo(ul);
                var nameSpan = $("<span></span>").text(_salesActivity.activity.name).appendTo(nameLi);
                var moneyH2 = $("<h3></h3>").text("交款金额:").appendTo(ul);
                var moneyLi = $("<li></li>").appendTo(ul);
                var moneySpan = $("<span></span>").text(utils.accDiv(_salesActivity.amount, 1000)).appendTo(moneyLi);

                salesActivityContent.append(ul);
            }
        }, null, false);
    }

    var displayFunc = (function() {

        var renderList = function(tableId, listData) {

            var $tableWrap = com.focusPage('#' + tableId);
            var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');

            if (listData && listData.length) {
                $.each(listData, function(i, v) {

                    var $liLine = creatLine(v);

                    $liLine.appendTo($ul);
                });

                $ul.appendTo($tableWrap);
            }
        };

        var creatLine = function(v) {

            var $liLine = $('<li></li>').addClass('item-orange clearfix');
            var $h3 = $('<h3></h3>').addClass("oid").append($('<small></small>').addClass('blue').html(v.activity.name));
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var propertyArr = [["装修单号:", v.sales.orderId, "grey"], ["楼盘地址:", v.sales.house.village.name + " " + v.sales.house.houseNumber, "grey"], ["客户名:", v.sales.customer.name, "grey"], ["品类:", v.sales.category, "grey"], ["品牌:", v.sales.brand, "grey"], ["定金:", v.sales.depositpay, "blue"], ["补款:", v.sales.fullpay, "blue"], ["定金状态:", salesActivityItem.depositpayStatus[v.sales.depositpayStatus], "red"], ["补款状态:", salesActivityItem.fullpayStatus[v.sales.fullpayStatus], "red"], ["总额:", v.sales.total, "blue"]];

            $.each(propertyArr, function(index, value) {

                var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2] ? value[2] : "").appendTo($liProperty);
                $liProperty.appendTo($ulProperty);
            });

            $liLine.append($h3).append($ulProperty);

            return $liLine;
        };

        return {
            init: function(tableId, listData) {

                com.focusPage('#' + tableId).html(null);
                renderList(tableId, listData);
            },
            drawLine: function(v) {

                return creatLine(v);
            }
        };
    })();

    var searcher = new Searcher();

    searcher.init(["sales-activity", "sales-activity-category-name", "sales-activity-brand-name"], "condLists", api.sales.pageSalesActivity, function(data) {

        displayFunc.init('resultLists', data);
    }, "pagenations", "sales4activityPostData", options, false, null, null, "resultLists");

    // 查询活动物品
    function querySalesActivityItem() {

        com.post(api.sales.querySalesActivityItem, options, function(res) {

            salesActivityItem.salesActivityItems = res.salesActivityItems;
            var salesActivityItems = res.salesActivityItems;

            var salesActivityContent = com.focusPage("#salesActivityItems").empty();

            $.each(salesActivityItems, function(i, v) {

                if (v.state == constant.sales().salesActivityItem.STATUS_UNVALID_INT)
                    return true;

                var pricingSpan = $("<div></div>").addClass("col-md-6").css({
                    "margin": "5px 0px",
                    "min-height": "127px"
                }).attr("id", "pricing_" + v.saiid);
                var widgetBox = $("<div></div>").appendTo(pricingSpan);

                // var widgetBody = $("<div></div>").appendTo(widgetBox);
                // var widgetMain = $("<div></div>").addClass("widget-main no-padding").appendTo(widgetBody);

                var widgetBody = $("<ul class='item-list fl-table-list ui-sortable'></ul>").attr("data-type", v.type).appendTo(widgetBox);
                var widgetMain = $('<li class="item-orange clearfix"></li>').appendTo(widgetBody);

                // var widgetHeader = $("<div></div>").attr("id", "widgetHeader_" + v.saiid).appendTo(widgetMain);

                var widgetHeader = $("<h3 class='oid'></h3>").attr("id", "widgetHeader_" + v.saiid).appendTo(widgetMain);
                var title = $('<small class="blue"></small>').text(v.name);

                var $span = $('<span></span>').addClass('lbl blue bigger-150');
                var $label = $('<label></label>');
                var $input = $('<input></input>').attr({
                    "type": "checkbox",
                    "name": "saiids",
                    "class": "ace ace-checkbox-2"
                }).val(v.saiid);

                widgetHeader.append($label.append($input).append($span)).append(title);

                var ul = $("<ul></ul>").addClass("list-unstyled fl-inline-list clearfix").css("padding-left", "12px").appendTo(widgetMain);
                var nameLi = $("<li></li>").appendTo(ul);
                var nameStr = $("<strong></strong>").text("活动名:").appendTo(nameLi);
                var nameSpan = $("<span></span>").attr("id", "activityItemName_" + v.saiid).text(v.activity).appendTo(nameLi);

                var typeLi = $("<li></li>").appendTo(ul);
                var typeStr = $("<strong></strong>").text("类型:").appendTo(typeLi);
                var typeSpan = $("<span></span>").addClass("red").attr("id", "money_" + v.saiid).text(salesActivityItem.type[v.type]).appendTo(typeLi);

                var moneyLi = $("<li></li>").appendTo(ul);
                var moneyStr = $("<strong></strong>").text("金额:").appendTo(moneyLi);
                var moneySpan = $("<span></span>").addClass("blue").attr("id", "money_" + v.saiid).text(v.money).appendTo(moneyLi);

                var integralLi = $("<li></li>").appendTo(ul);
                var integralStr = $("<strong></strong>").text("积分:").appendTo(integralLi);
                var integralSpan = $("<span></span>").addClass("red").attr("id", "money_" + v.saiid).text(v.integral).appendTo(integralLi);

                var numLi = $("<li></li>").appendTo(ul);
                var numStr = $("<strong></strong>").text("数量:").appendTo(numLi);
                var numSpan = $("<span></span>").attr("id", "money_" + v.saiid).text(v.num).appendTo(numLi);

                var stateLi = $("<li></li>").appendTo(ul);
                var stateStr = $("<strong></strong>").text("状态:").appendTo(stateLi);
                var stateSpan = $("<span></span>").addClass("red").attr("id", "money_" + v.saiid).text(salesActivityItem.activityItemType[v.state]).appendTo(stateLi);

                var totalLi = $("<li></li>").appendTo(ul);
                var totalStr = $("<strong></strong>").text("合计:").appendTo(totalLi);
                var totalSpan = $("<span></span>").addClass("blue").attr("id", "money_" + v.saiid).text(utils.accMul(v.money, v.num)).appendTo(totalLi);

                var isAffirmLi = $("<li></li>").appendTo(ul);
                var isAffirmState = $("<strong></strong>").text("是否确认:").appendTo(isAffirmLi);
                var isAffirmSpan = $("<span></span>").addClass("red").attr("id", "money_" + v.saiid).text(salesActivityItem.isAffirm[v.isAffirm]).appendTo(isAffirmLi);

                var uiPgDiv = $("<div></div>").addClass("ui-pg-div").appendTo(widgetMain);

                if (uiBtnMethod != null) {
                    uiBtnMethod(uiPgDiv, v);
                }

                salesActivityContent.append(pricingSpan)
            });
        });
    }

    amountSalesActivityForActivity();
    amountSalesActivityForPayment();
    integral();
    amountSalesPayment();
    querySalesActivity();
    querySalesActivityItem();

    function uiBtnMethod(uiPgDiv, activityItem) {

        // 失效
        var abateBtn = $("<span></span>").addClass("btn btn-minier btn-yellow").html("失效").css("margin", "3px");
        // 领取
        var receiveBtn = $("<span></span>").addClass("btn btn-minier btn-success").html("领取").css("margin", "3px");
        // 退货
        var refundBtn = $("<span></span>").addClass("btn btn-minier btn-warning").html("退货").css("margin", "3px");
        // 配送
        var deliveBtn = $("<span></span>").addClass("btn btn-minier btn-inverse").html("配送").css("margin", "3px");
        // 未退
        var unrefundBtn = $("<span></span>").addClass("btn btn-minier btn-danger").html("未退").css("margin", "3px");
        // 补款
        var expendBtn = $("<span></span>").addClass("btn btn-minier btn-purple").html("补款").css("margin", "3px");
        // 抵现
        var discountBtn = $("<span></span").addClass("btn btn-minier btn-pink").html("抵现").css("margin", "3px");

        if (salesActivityItem.pagetype == "advance" || salesActivityItem.pagetype == "activity") {
            uiPgDiv.append(abateBtn).append(receiveBtn).append(refundBtn).append(deliveBtn).append(unrefundBtn).append(expendBtn).append(discountBtn);
        }
        if (salesActivityItem.pagetype == "dompany") {
            uiPgDiv.append(abateBtn);
        }

        // 失效按钮
        abateBtn.on("click", function() {

            abateSalesActivityItem(activityItem.saiid, activityItem.activity);
        });

        // 领取按钮
        receiveBtn.on("click", function() {

            if (activityItem.state == 0) {
                salesActivityItem.items.commentName.html("领取");
                salesActivityItem.saiid = activityItem.saiid;
                salesActivityItem.url = api.sales.receiveSalesActivityItem;
                salesActivityItem.info = "领取成功!";
                salesActivityItem.modal.salesActivityCommentModal.modal("show");
            } else {
                com.showAlert(com.warning, "订单活动奖品不可操作!!");
            }
        });

        // 点击退货按钮
        refundBtn.click(function() {

            salesActivityItem.items.commentName.html("退货");
            salesActivityItem.saiid = activityItem.saiid;
            salesActivityItem.url = api.sales.refundSalesActivityItem;
            salesActivityItem.info = "退货成功!";
            salesActivityItem.modal.salesActivityCommentModal.modal("show");
        });

        // 点击配送按钮
        deliveBtn.click(function() {

            salesActivityItem.items.commentName.html("配送");
            salesActivityItem.saiid = activityItem.saiid;
            salesActivityItem.url = api.sales.deliveSalesActivityItem;
            salesActivityItem.info = "配送成功!";
            salesActivityItem.modal.salesActivityCommentModal.modal("show");
        });

        // 点击未退按钮
        unrefundBtn.click(function() {

            unrefundSalesActivityItem(activityItem.saiid, activityItem.activity);
        });

        // 点击补款按钮
        expendBtn.click(function() {

            expendSalesActivityItem(activityItem.saiid, activityItem.activity);
        });

        // 点击抵现按钮
        discountBtn.click(function() {

            discountSalesActivityItem(activityItem.saiid, activityItem.activity);
        });

    }

    // 0: 初始 , 1: 失效 , 2: 已领 , 3: 退货 , 4: 配送 , 5: 未退 , 6: 升级 , 7: 补款 , 8: 抵现
    // 失效
    function abateSalesActivityItem(saiid, activityItemName) {

        com.showConfirm("是否确认失效" + activityItemName + "活动物品?", function() {

            com.post(api.sales.abateSalesActivityItem, {
                "salesActivityItem.saiid": saiid
            }, function(res) {

                com.showAlert(com.info, "失效成功!");
                querySalesActivityItem();
                amountSalesActivityForActivity();
                integral();
            });

        });
    }

    // 未退
    function unrefundSalesActivityItem(saiid, activityItemName) {

        com.showConfirm("是否确认未退" + activityItemName + "活动物品?", function() {

            com.post(api.sales.unrefundSalesActivityItem, {
                "salesActivityItem.saiid": saiid
            }, function(res) {

                com.showAlert(com.info, "未退成功!");
                querySalesActivityItem();
            });

        });
    }

    // 消耗
    function expendSalesActivityItem(saiid, activityItemName) {

        com.showConfirm("是否确认补款" + activityItemName + "活动物品?", function() {

            com.post(api.sales.expendSalesActivityItem, {
                "salesActivityItem.saiid": saiid
            }, function(res) {

                com.showAlert(com.info, "补款成功!");
                querySalesActivityItem();
                amountSalesActivityForActivity();
                integral();
            });
        });
    }

    // 抵现
    function discountSalesActivityItem(saiid, activityItemName) {

        com.showConfirm("是否确认抵现" + activityItemName + "活动物品?", function() {

            com.post(api.sales.discountSalesActivityItem, {
                "salesActivityItem.saiid": saiid
            }, function(res) {

                com.showAlert(com.info, "抵现成功!");
                querySalesActivityItem();
                amountSalesActivityForActivity();
                integral();
            });
        });
    }

    function imports() {

        com.post(api.decoration.queryDecorationByOrderId, {
            "decorationOrderId": salesActivityItem.orderId
        }, function(res) {

            decoration = res.decoration;
        }, null, false);

        com.post(api.sales.querySalesActivityItem, {
            "orderId": salesActivityItem.orderId
        }, function(res) {

            $.exceler({
                column: [['装修单号', 'orderId'], ['活动名称', 'activity'], ['奖品名称', 'name'], ['类型', 'type'], ['状态', 'state'], ['金额', 'money'], ['数量', 'num'], ['总额', 'sum'], ['备注', 'content'], ['是否确认', 'isAffirm'], ['操作人', 'userName'], ['操作时间', 'operateTime'], ],
                list: res.salesActivityItems

            }, function(v) {

                v.userName = v.operater.currentName;
                v.type = salesActivityItem.type[v.type];
                v.state = salesActivityItem.activityItemType[v.state];
                v.isAffirm = salesActivityItem.isAffirm[v.isAffirm];
                v.sum = v.money * v.num;
            });

        });

    }

    function sends() {

        var $inputs = com.focusPage('input[name="saiids"]:checked');

        var saiid = "";

        $.each($inputs, function(i, v) {

            saiid += $(v).val() + ",";
        });

        var options = {
            "orderId": salesActivityItem.orderId,
            "salesActivityItem.orderId": salesActivityItem.orderId,
            "salesActivityItem.content": saiid,
        };

        com.showConfirm("是否发送查看通知", function() {

            com.post(api.sales.sendSalesActivityItem, options, function(res) {

                com.showAlert(com.info, "操作成功");
                searcher.doSearch();
            });
        });
    }

    // 领取物品
    com.focusPage("#submitSalesActivityItemBtn").on("click", function() {

        if (salesActivityItem.items.things.html() == "" && salesActivityItem.items.coupons.html() == "" && salesActivityItem.items.paper.html() == "") {
            com.showAlert(com.warning, "活动物品或券或红包需要选择才能提交");
            return;
        }

        var submitFlag = true;

        var orderId = salesActivityItem.orderId;
        var activityName = salesActivityItem.items.activity.find("option:selected").text();
        var aid = salesActivityItem.items.activity.find("option:selected").val();
        var content = com.focusPage("#salesActivityItemContent").val();

        var index = 0;
        var amount = 0;

        var options = {
            "salesActivity.sales.orderId": orderId
        };

        com.focusPage("#things li").each(function(i, e) {

            var _things = $(e);

            options["salesActivityItems[" + index + "].aid"] = aid;
            options["salesActivityItems[" + index + "].asid"] = _things.children('span').attr("asid");
            options["salesActivityItems[" + index + "].activity"] = activityName;
            options["salesActivityItems[" + index + "].name"] = _things.children('span').attr("thingsName").split(" ")[0];
            options["salesActivityItems[" + index + "].type"] = 1;
            options["salesActivityItems[" + index + "].num"] = _things.children('span').attr("num");
            options["salesActivityItems[" + index + "].money"] = _things.children('span').attr("thingsName").split(" ")[1].split(':')[1];
            options["salesActivityItems[" + index + "].content"] = content;
            options["salesActivityItems[" + index + "].integral"] = _things.children('span').attr("thingsName").split(" ")[2].split(':')[1];

            amount = amount + utils.accMul(parseFloat(_things.children('span').attr("thingsName").split(" ")[2].split(':')[1]), _things.children('span').attr("num"));

            index++;
        });

        com.focusPage("#coupons li").each(function(i, e) {

            var _coupons = $(e);

            options["salesActivityItems[" + index + "].aid"] = aid;
            options["salesActivityItems[" + index + "].asid"] = _coupons.children('span').attr("asid");
            options["salesActivityItems[" + index + "].activity"] = activityName;
            options["salesActivityItems[" + index + "].name"] = _coupons.children('span').attr("couponsName").split(" ")[0];
            options["salesActivityItems[" + index + "].type"] = 0;
            options["salesActivityItems[" + index + "].num"] = _coupons.children('span').attr("num");
            options["salesActivityItems[" + index + "].money"] = _coupons.children('span').attr("couponsName").split(" ")[1].split(':')[1];
            options["salesActivityItems[" + index + "].content"] = content;
            options["salesActivityItems[" + index + "].integral"] = _coupons.children('span').attr("couponsName").split(" ")[2].split(':')[1];

            amount = amount + utils.accMul(parseFloat(_coupons.children('span').attr("couponsName").split(" ")[2].split(':')[1]), _coupons.children('span').attr("num"));

            index++;
        });

        com.focusPage("#paper li").each(function(i, e) {

            var _paper = $(e);

            options["salesActivityItems[" + index + "].aid"] = aid;
            options["salesActivityItems[" + index + "].asid"] = _paper.children('span').attr("asid");
            options["salesActivityItems[" + index + "].activity"] = activityName;
            options["salesActivityItems[" + index + "].name"] = _paper.children('span').attr("paperName").split(" ")[0];
            options["salesActivityItems[" + index + "].type"] = 2;
            options["salesActivityItems[" + index + "].num"] = _paper.children('span').attr("num");
            options["salesActivityItems[" + index + "].money"] = _paper.children('span').attr("paperName").split(" ")[1].split(':')[1];
            options["salesActivityItems[" + index + "].content"] = content;
            options["salesActivityItems[" + index + "].integral"] = _paper.children('span').attr("paperName").split(" ")[2].split(':')[1];

            amount = amount + utils.accMul(parseFloat(_paper.children('span').attr("paperName").split(" ")[2].split(':')[1]), _paper.children('span').attr("num"));

            index++;
        });

        if (!submitFlag) {
            return;
        }

        options["salesActivity.amount"] = amount;

        com.post(api.sales.addSalesActivityItem, options, function(res) {

            querySalesActivityItem();
            amountSalesActivityForActivity();
            integral();
        });
        salesActivityItem.salesActivityItemModal.modal("hide");
    });

    salesActivityItem.btn.submitSalesActivityCommentBtn.on('click', function() {

        var ops = {
            "salesActivityItem.saiid": salesActivityItem.saiid,
            "salesActivityItem.content": salesActivityItem.items.salesActivityComment.val()
        };

        com.post(salesActivityItem.url, ops, function(res) {

            com.showAlert(com.info, salesActivityItem.info);
            querySalesActivityItem();
            amountSalesActivityForActivity();
            integral();
        });

        com.cleanItems(salesActivityItem.items);
        salesActivityItem.modal.salesActivityCommentModal.modal("hide");
    });

    com.focusPage("#salesActivityItemModal").on('hide.bs.modal', function() {

        salesActivityItem.items.things.html("");
        salesActivityItem.items.coupons.html("");
        com.cleanItems(salesActivityItem.items);
        com.clearValidator();
    });

});