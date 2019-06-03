$(function () {

    var salesActivityItem = {
        items: {},
        activity: {},
        name: {}
    };

    var activityItemType = {};
    var paramsOrderId = params.orderId;
    var ssid = params.sid;
    var salesno = params.no;
    var activityId = params.activityId;
    var things = com.focusPage("#things");
    var coupons = com.focusPage("#coupons");
    var activityInfo = com.focusPage("#activityInfo");
    salesActivityItem.activity = com.focusPage("#activity");
    salesActivityItem.items.content = com.focusPage("#salesActivityItemContent");
    salesActivityItem.salesActivityItemModal = com.focusPage("#salesActivityItemModal").on('show.bs.modal', function (e) {
        com.clearValidator();
    });
    salesActivityItem.salesActivityModal = com.focusPage("#salesActivityModal").on('show.bs.modal', function (e) {
        com.clearValidator();
    });

    com.post(api.ds.manifest, {}, function (res) {
        $.each(res.salesActivityItemType,function(i,v){
            activityItemType[v.key]= v.value;
        })
    }, null, false);

    salesActivityItem.activity.activity = com.focusPage("#activity").on("change", function () {
        var $this = $(this);

        var _things = [];
        var _coupons = [];

        var options = {
            "activity.aid": $this.val()
        };

        com.post(api.information.queryActivityItemByAid, options, function (res) {

            var _ = res.activityItems;

            for (var i = 0; i < _.length; i++) {

                var _activityItem = _[i];

                if (_activityItem.type == 0) {
                    _coupons.push({
                        asid: _activityItem.asid,
                        activityItemName: _activityItem.name + " 金额:" + _activityItem.money
                    });
                } else if (_activityItem.type == 1) {
                    _things.push({
                        asid: _activityItem.asid,
                        activityItemName: _activityItem.name + " 金额:" + _activityItem.money
                    });
                }
            }

            things.chosen("destroy");
            things.chosen({width: "216px", multi_type: "input"});
            things.bindData(_things, 'asid', 'activityItemName', false);
            things.trigger("chosen:updated");

            coupons.chosen("destroy");
            coupons.chosen({width: "216px", multi_type: "input"});
            coupons.bindData(_coupons, 'asid', 'activityItemName', false);
            coupons.trigger("chosen:updated");
        });
    });

    function orderList() {

        var $btnSub = $('<a></a>').addClass('btn btn-minier btn-success').html('领取物品');
        var $h4 = $('<h4></h4>').addClass('oid').append($('<small></small>').addClass('blue')).html("装修单号:" + paramsOrderId);
        var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

        var $divWarp = com.focusPage("#paramsOrder").append($h4);

        $divBtnWrap.append($btnSub).appendTo($h4);

        $btnSub.click(function () {

            var things = com.focusPage("#things");
            things.chosen("destroy");
            things.chosen({width: "42%", multi_type: "input"});
            things.bindData([{aid: -1, activityName: ""}], "aid", "activityName", "money");
            things.trigger("chosen:updated");

            var coupon = com.focusPage("#coupons");
            coupon.chosen("destroy");
            coupon.chosen({width: "42%", multi_type: "input"});
            coupon.bindData([{aid: -1, activityName: ""}], "aid", "activityName", "money");
            coupon.trigger("chosen:updated");

            com.post(api.information.queryActivityForValid, {"activity.type": 3}, function (res) {
                var activitys = res.activitys;

                var _activitys = [];

                for (var i = 0; i < activitys.length; i++) {
                    var _activity = activitys[i];

                    _activitys.push({aid: _activity.aid, activityName: _activity.name, money: _activitys.money});
                }
                salesActivityItem.activity.bindData(_activitys, "aid", "activityName", "money", false);
            });

            salesActivityItem.salesActivityItemModal.modal("show")
        });

        return $divWarp;
    }

    com.post(api.information.queryActivityForValid, {"activity.type": 3}, function (res) {
        $.each(res.activitys, function (i, v) {
            salesActivityItem.name[v.aid] = v.name;
        });
    },null,false);

    orderList();
    salesNo(activityId);

    function salesNo(activityId) {
        var $divWarp = com.focusPage("#paramsNo").empty();
        var $btnSub = $('<a></a>').addClass('btn btn-minier btn-success').html('修改活动');
        var $h4 = $('<h4></h4>').addClass('oid').append($('<small></small>').addClass('blue')).html("销售单号:" + salesno);
        var $h4Name = $('<h4></h4>').addClass('oid').append($('<small></small>').addClass('blue')).html(salesActivityItem.name[activityId] == null ? "当前活动:无" : "当前活动名称:" + salesActivityItem.name[activityId]);
        var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');
        $divWarp.append($h4).append($h4Name);
        $divBtnWrap.append($btnSub).appendTo($h4);

        $btnSub.click(function () {

            com.post(api.information.queryActivityForValid, {"activity.type": 3}, function (res) {

                var activitys = res.activitys;
                var _activitys = [];

                for (var i = 0; i < activitys.length; i++) {

                    var _activity = activitys[i];
                    // if (_activity.aid == activityId) {
                    //     com.focusPage("#activityName").val(_activity.name);
                    // }
                    _activitys.push({aid: _activity.aid, activityName: _activity.name, money: _activitys.money});
                }
                activityInfo.bindData(_activitys, "aid", "activityName", "money", false);
            });
            salesActivityItem.salesActivityModal.modal("show");
        });
        return $divWarp
    }

    var options = {
        "orderId": paramsOrderId
    };

    //查询活动信息
    function querySalesActivity() {
        com.post(api.inventory.querySalesActivity, options, function (res) {
            var salesActivity = res.salesActivitys;
            var salesActivityContent = com.focusPage("#salesActivityItem").empty();

            for (var i = 0; i < salesActivity.length; i++) {
                var _salesActivity = salesActivity[i];
                var ul = $("<div></div>").addClass("list-unstyled list-striped pricing-table");
                var nameH2 = $("<h3></h3>").text("活动名称:").appendTo(ul);
                var nameLi = $("<li></li>").appendTo(ul);
                var nameSpan = $("<span></span>").text(_salesActivity[0]).appendTo(nameLi);
                var moneyH2 = $("<h3></h3>").text("总价:").appendTo(ul);
                var moneyLi = $("<li></li>").appendTo(ul);
                var moneySpan = $("<span></span>").text(_salesActivity[1]).appendTo(moneyLi);

                salesActivityContent.append(ul);
            }
        });
    }

    querySalesActivity();
    querySalesActivityItem();

    //查询活动物品
    function querySalesActivityItem() {
        com.post(api.inventory.querySalesActivityItem, options, function (res) {

            var salesActivityItems = res.saleActivityItems;
            var salesActivityContent = com.focusPage("#salesActivityItems").empty();

            $.each(salesActivityItems, function (i, v) {

                var pricingSpan = $("<div></div>").addClass("col-md-6").css("margin", "5px 0px").attr("id", "pricing_" + v.saiid);

                var widgetBox = $("<div></div>").addClass("module_activity_border").appendTo(pricingSpan);

                var widgetBody = $("<div></div>").appendTo(widgetBox);
                var widgetMain = $("<div></div>").addClass("widget-main no-padding").appendTo(widgetBody);

                var widgetHeader = $("<div></div>").attr("id", "widgetHeader_" + v.saiid).appendTo(widgetMain);
                var widgetHeaderH5 = $("<h4></h4>").addClass("bigger lighter").css("padding-left", "12px").appendTo(widgetHeader).text(v.activity);

                var ul = $("<ul></ul>").addClass("list-unstyled fl-inline-list clearfix").css("padding-left", "12px").appendTo(widgetMain);
                var nameLi = $("<li></li>").appendTo(ul);
                var nameStr = $("<strong></strong>").text("物品:").appendTo(nameLi);
                var nameSpan = $("<span></span>").attr("id", "activityItemName_" + v.saiid).text(v.name).appendTo(nameLi);

                var moneyLi = $("<li></li>").appendTo(ul);
                var moneyStr = $("<strong></strong>").text("金额:").appendTo(moneyLi);
                var moneySpan = $("<span></span>").addClass("blue").attr("id", "money_" + v.saiid).text(v.money).appendTo(moneyLi);

                var numLi = $("<li></li>").appendTo(ul);
                var numStr = $("<strong></strong>").text("数量:").appendTo(numLi);
                var numSpan = $("<span></span>").attr("id", "money_" + v.saiid).text(v.num).appendTo(numLi);

                var stateLi = $("<li></li>").appendTo(ul);
                var stateStr = $("<strong></strong>").text("状态:").appendTo(stateLi);
                var stateSpan = $("<span></span>").addClass("red").attr("id", "money_" + v.saiid).text(activityItemType[v.state]).appendTo(stateLi);

                var totalLi = $("<li></li>").appendTo(ul);
                var totalStr = $("<strong></strong>").text("合计:").appendTo(totalLi);
                var totalSpan = $("<span></span>").addClass("blue").attr("id", "money_" + v.saiid).text(utils.accMul(v.money, v.num)).appendTo(totalLi);

                var uiPgDiv = $("<div></div>").addClass("ui-pg-div").appendTo(widgetBody);
                if (uiBtnMethod != null) {
                    uiBtnMethod(uiPgDiv, v);
                }
                salesActivityContent.append(pricingSpan)
            })
        });
    }

    function uiBtnMethod(uiPgDiv, activityItem) {
        //0: 初始 , 1: 失效 , 2: 已领 , 3: 退货 , 4: 配送 , 5: 未退 , 6: 升级 , 7: 消耗
        //失效
        var abateBtn = $("<span></span>").addClass("btn btn-minier btn-yellow").html("失效").css("margin", "3px").appendTo(uiPgDiv);
        //领取
        var receiveBtn = $("<span></span>").addClass("btn btn-minier btn-success").html("领取").css("margin", "3px").appendTo(uiPgDiv);
        //退货
        var refundBtn = $("<span></span>").addClass("btn btn-minier btn-warning").html("退货").css("margin", "3px").appendTo(uiPgDiv);
        //配送
        var deliveBtn = $("<span></span>").addClass("btn btn-minier btn-inverse").html("配送").css("margin", "3px").appendTo(uiPgDiv);
        //未退
        var unrefundBtn = $("<span></span>").addClass("btn btn-minier btn-danger").html("未退").css("margin", "3px").appendTo(uiPgDiv);
        //消耗
        var expendBtn = $("<span></span>").addClass("btn btn-minier btn-purple").html("消耗").css("margin", "3px").appendTo(uiPgDiv);

        //失效按钮
        abateBtn.on("click", function () {
            abateSalesActivityItem(activityItem.saiid, activityItem.activity);
        });

        //领取按钮
        receiveBtn.on("click", function () {
            if (activityItem.state == 0) {
                receiveSalesActivityItem(activityItem.saiid, activityItem.activity);
            }else{
                com.showAlert(com.warning, "订单活动奖品不可操作!!");
            }
        });

    //点击退货按钮
    refundBtn.click(function () {
        refundSalesActivityItem(activityItem.saiid, activityItem.activity);
    });

    //点击配送按钮
    deliveBtn.click(function () {
        deliveSalesActivityItem(activityItem.saiid, activityItem.activity);
    });

    //点击未退按钮
    unrefundBtn.click(function () {
        unrefundSalesActivityItem(activityItem.saiid, activityItem.activity);
    });

    //点击消耗按钮
    expendBtn.click(function () {
        expendSalesActivityItem(activityItem.saiid, activityItem.activity);
    });

    }
    
    //0: 初始 , 1: 失效 , 2: 已领 , 3: 退货 , 4: 配送 , 5: 未退 , 6: 升级 , 7: 消耗
    //失效
    function abateSalesActivityItem(saiid, activityItemName) {

        com.showConfirm("是否确认失效" + activityItemName + "活动物品?", function () {

            var options = {
                "salesActivityItem.saiid": saiid
            };

            com.post(api.inventory.abateSalesActivityItem, options, function (res) {
                com.showAlert(com.info, "失效成功!");
                querySalesActivityItem();
            });

        });
    }
    //领取
    function receiveSalesActivityItem(saiid, activityItemName) {

        com.showConfirm("是否确认领取" + activityItemName + "活动物品?", function () {

            var options = {
                "salesActivityItem.saiid": saiid
            };

            com.post(api.inventory.receiveSalesActivityItem, options, function (res) {
                com.showAlert(com.info, "领取成功!");
                querySalesActivityItem();
            })
        });
    }
    //退货
    function refundSalesActivityItem(saiid, activityItemName) {
        com.showConfirm("是否确认退货" + activityItemName + "活动物品?", function () {

            var options = {
                "salesActivityItem.saiid": saiid
            };
            com.post(api.inventory.refundSalesActivityItem, options, function (res) {
                com.showAlert(com.info, "退货成功!");
                querySalesActivityItem();
            });

        });
    }
    //配送
    function deliveSalesActivityItem(saiid, activityItemName){
        com.showConfirm("是否确认配送" + activityItemName + "活动物品?", function () {

            var options = {
                "salesActivityItem.saiid": saiid
            };
            com.post(api.inventory.deliveSalesActivityItem, options, function (res) {
                com.showAlert(com.info, "配送成功!");
                querySalesActivityItem();
            });

        });
    }
    //未退
    function unrefundSalesActivityItem(saiid, activityItemName) {
        com.showConfirm("是否确认未退" + activityItemName + "活动物品?", function () {

            var options = {
                "salesActivityItem.saiid": saiid
            };
            com.post(api.inventory.unrefundSalesActivityItem, options, function (res) {
                com.showAlert(com.info, "未退成功!");
                querySalesActivityItem();
            });

        });
    }

    //消耗
    function expendSalesActivityItem(saiid, activityItemName) {
        com.showConfirm("是否确认消耗" + activityItemName + "活动物品?", function () {

            var options = {
                "salesActivityItem.saiid": saiid
            };
            com.post(api.inventory.expendSalesActivityItem, options, function (res) {
                com.showAlert(com.info, "消耗成功!");
                querySalesActivityItem();
            });

        });
    }


    //修改活动
    com.focusPage("#submitSalesActivityBtn").on("click", function () {

        if (com.validate("salesActivityModal","")) {
            return;
        }

        var sid = ssid;
        var aid = com.focusPage("#activityInfo").find("option:selected").val();
        var options = {
            "sales.sid": sid,
            "sales.activityId": aid
        };
        com.post(api.inventory.updateSalesForActivity, options, function (res) {
            querySalesActivity();
            salesNo(res.sales.activityId);
            com.showAlert(com.info, "修改成功")
        });

        salesActivityItem.salesActivityModal.modal("hide");
    });

    //领取物品
    com.focusPage("#submitSalesActivityItemBtn").on("click", function () {

        if (com.validate("salesActivityItemModal", "")) {
            return;
        }
        if (things.val() == null && coupons.val() == null) {
            com.showAlert(com.warning, "活动物品或券需要选择才能提交");
            return;
        }
        var submitFlag = true;

        var orderId = paramsOrderId;
        var activityName = com.focusPage("#activity").find("option:selected").text();
        var aid = com.focusPage("#activity").find("option:selected").val();
        var content = com.focusPage("#salesActivityItemContent").val();

        var index = 0;
        var options = {};

        com.focusPage("[class='search-choice']", $("#things_chosen")).each(function (i, e) {

            var _things = $(e);

            if (!/^\d+$/.test(_things.children('span').children('input').val())) {
                com.showAlert(com.warning, "请填写物品数量");
                submitFlag = false;
            }

            options["saleActivityItems[" + index + "].orderId"] = orderId;
            options["saleActivityItems[" + index + "].aid"] = aid;
            options["saleActivityItems[" + index + "].asid"] = _things.attr("index");
            options["saleActivityItems[" + index + "].activity"] = activityName;
            options["saleActivityItems[" + index + "].name"] = _things.children('span').text().split(" ")[0];
            options["saleActivityItems[" + index + "].type"] = 1;
            options["saleActivityItems[" + index + "].num"] = _things.children('span').children('input').val();
            options["saleActivityItems[" + index + "].money"] = _things.children('span').text().split(" ")[1].split(':')[1];
            options["saleActivityItems[" + index + "].content"] = content;

            index++;
        });

        com.focusPage("[class='search-choice']", $("#coupons_chosen")).each(function (i, e) {

            var _coupons = $(e);

            if (!/^\d+$/.test(_coupons.children('span').children('input').val())) {
                com.showAlert(com.warning, "请填写券数量");
                submitFlag = false;
            }

            options["saleActivityItems[" + index + "].orderId"] = orderId;
            options["saleActivityItems[" + index + "].aid"] = aid;
            options["saleActivityItems[" + index + "].asid"] = _coupons.attr("index");
            options["saleActivityItems[" + index + "].activity"] = activityName;
            options["saleActivityItems[" + index + "].name"] = _coupons.children('span').text().split(" ")[0];
            options["saleActivityItems[" + index + "].type"] = 0;
            options["saleActivityItems[" + index + "].num"] = _coupons.children('span').children('input').val();
            options["saleActivityItems[" + index + "].money"] = _coupons.children('span').text().split(" ")[1].split(':')[1];
            options["saleActivityItems[" + index + "].content"] = content;

            index++;
        });

        if (!submitFlag) {
            return;
        }

        com.post(api.inventory.addSalesActivityItem, options, function (res) {
            com.cleanItems(salesActivityItem.items);
            com.clearValidator();
            querySalesActivityItem();
        });
        salesActivityItem.salesActivityItemModal.modal("hide");
    });

    //返回
    com.focusPage("#backBtn").on("click", function () {
        com.switchPage(api.index.querySalesIndex.url);
    });
});