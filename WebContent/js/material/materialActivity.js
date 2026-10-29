$(function () {

    var materialActivityItem = {
        items: {},
        activity: {},
        activityItem: {},
        activityItemMap: {},
        data:{}
    };

    var paramsOrderId = params.orderId;
    var paramsMid = params.mid;
    var paramsNo = params.no;
    var activityId = params.activityId;
    var things = com.focusPage("#things");
    var coupons = com.focusPage("#coupons");
    var activityInfo = com.focusPage("#activityInfo");

    materialActivityItem.name = com.focusPage("#name");
    materialActivityItem.activity = com.focusPage("#activity");
    materialActivityItem.items.thingsName = com.focusPage("#thingsName");
    materialActivityItem.items.thingsNum = com.focusPage("#thingsNum");
    materialActivityItem.items.couponsName = com.focusPage("#couponsName");
    materialActivityItem.items.couponsNum = com.focusPage("#couponsNum");
    materialActivityItem.items.content = com.focusPage("#approveActivityItemContent");
    materialActivityItem.items.comment = com.focusPage("#comment");
    materialActivityItem.commentModal = com.focusPage("#commentModal");

    materialActivityItem.materialActivityItemModal = com.focusPage("#materialActivityItemModal").on('show.bs.modal', function (e) {
        com.clearValidator();
        things.html("");
        coupons.html("");
    });
    materialActivityItem.materialActivityItemModal = com.focusPage("#materialActivityItemModal").on('hide.bs.modal', function (e) {
        com.cleanItems(materialActivityItem.items);
        com.resetTypeahead("thingsName", []);
        com.resetTypeahead("couponsName", []);
    });
    materialActivityItem.materialActivityModal = com.focusPage("#materialActivityModal").on('show.bs.modal', function (e) {
        com.clearValidator();
    });
    materialActivityItem.activity.activity = com.focusPage("#activity");

    com.selectTypeahead("thingsName", [], 'asid', 'activityItemName');
    com.selectTypeahead("couponsName", [], 'asid', 'activityItemName');

    materialActivityItem.activity.activity.on("change", function () {
        var $this = $(this);
        materialActivityItem.items.thingsName.val("");
        materialActivityItem.items.couponsName.val("");
        var _things = [];
        var _coupons = [];
        var options = {
            "activity.aid": $this.val()
        };
        if ($this.val()) {
            com.post(api.information.queryActivityItemByAid, options, function (res) {
                var _ = res.activityItems;

                // 优惠额度物品(type 10/11)按 -10 归入同形态组, 并缓存原始 type 供提交使用(对齐 decoration4detail; 本页无红包组, 12 与 type=2 一致不可见)
                materialActivityItem.activityItemMap = {};

                for (var i = 0; i < _.length; i++) {

                    var _activityItem = _[i];

                    materialActivityItem.activityItemMap[_activityItem.asid] = _activityItem.type;

                    if (_activityItem.type == 0 || _activityItem.type == 10) {
                        _coupons.push({
                            asid: _activityItem.asid,
                            activityItemName: _activityItem.name + " 金额:" + _activityItem.money
                        });
                    } else if (_activityItem.type == 1 || _activityItem.type == 11) {
                        _things.push({
                            asid: _activityItem.asid,
                            activityItemName: _activityItem.name + " 金额:" + _activityItem.money
                        });
                    }
                }
                com.resetTypeahead("thingsName", _things);
                com.resetTypeahead("couponsName", _coupons);
            });
        }
    });

    com.focusPage("#thingsAdd").unbind().click(function () {
        if (com.validate("thingsInputs", "bottom")) {
            return;
        }
        createThings();
        materialActivityItem.items.thingsName.val("");
        materialActivityItem.items.thingsNum.val("");
    });

    com.focusPage("#couponsAdd").unbind().click(function () {
        if (com.validate("couponInputs", "bottom")) {
            return;
        }
        createCoupons();
        materialActivityItem.items.couponsName.val("");
        materialActivityItem.items.couponsNum.val("");
    });

    function createThings() {
        var $li = $("<li></li>").css({"background-color": "#91b8d0", "margin-bottom": "5px", "margin-right": "5px"}).appendTo(com.focusPage("#things"));
        var aisd = com.focusPage("#thingsName").attr("data-typeahead-key");
        var thingsName = com.focusPage("#thingsName").val();
        var num = com.focusPage("#thingsNum").val();
        var $span = $("<span></span>").css({'color': '#fff'}).attr('thingsName', thingsName).attr('num', num).attr('asid', aisd).html(thingsName).appendTo($li);
        var $spanTwo = $("<span></span>").css({'font-size': '16px', 'color': '#fff', 'margin': '0 5px'}).html("数量" + num).appendTo($span);
        var $a = $("<a></a>").addClass("glyphicon glyphicon-remove").css({'color': '#d15b47'}).appendTo($li);
        $a.click(function () {
            $li.remove();
        });
    }

    function createCoupons() {
        var $li = $("<li></li>").css({"background-color": "#91b8d0", "margin-bottom": "5px", "margin-right": "5px"}).appendTo(com.focusPage("#coupons"));
        var couponsName = com.focusPage("#couponsName").val();
        var aisd = com.focusPage("#couponsName").attr("data-typeahead-key");
        var num = com.focusPage("#couponsNum").val();
        var $span = $("<span></span>").css({'color': '#fff'}).attr('couponsName', couponsName).attr('num', num).attr('asid', aisd).html(couponsName).appendTo($li);
        var $spanTwo = $("<span></span>").css({'font-size': '16px', 'color': '#fff', 'margin': '0 5px'}).html("数量" + num).appendTo($span);
        var $a = $("<a></a>").addClass("glyphicon glyphicon-remove").css({'color': '#d15b47'}).appendTo($li);
        $a.click(function () {
            $li.remove();
        });
    }

    function orderList() {

        var $btnSub = $('<a></a>').addClass('btn btn-minier btn-success').html('领取物品');
        var $h4 = $('<h4></h4>').addClass('oid').append($('<small></small>').addClass('blue')).html("装修单号:" + paramsOrderId);
        var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

        var $divWarp = com.focusPage("#paramsOrder").append($h4);

        $divBtnWrap.append($btnSub).appendTo($h4);

        $btnSub.click(function () {

            com.post(api.information.queryActivityForValid, {"activity.type": 2}, function (res) {
                var activitys = res.activitys;

                var _activitys = [];

                for (var i = 0; i < activitys.length; i++) {
                    var _activity = activitys[i];

                    _activitys.push({aid: _activity.aid, activityName: _activity.name});
                }
                materialActivityItem.activity.bindData(_activitys, "aid", "activityName", true, false);
            });

            materialActivityItem.materialActivityItemModal.modal("show")
        });

        return $divWarp;
    }

    com.post(api.information.queryActivityForValid, {"activity.type": 2}, function (res) {
        $.each(res.activitys, function (i, v) {
            materialActivityItem.activityItem[v.aid] = v.name;
        });

    }, null, false);

    function materialNo(aid) {
        var $activityName = com.focusPage("#paramsNo").empty();

        var $btnSub = $('<a></a>').addClass('btn btn-minier btn-success').html('修改活动');
        var $h4 = $('<h4></h4>').addClass('oid').append($('<small></small>').addClass('blue')).html("主材单号:" + paramsNo);
        var $activity = $('<h4></h4>').addClass('oid').append($('<small></small>').addClass('blue')).html(materialActivityItem.activityItem[aid] == null ? "当前活动:无" : "当前活动:" + materialActivityItem.activityItem[aid]);
        var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');
        $activityName.append($h4).append($activity);
        $divBtnWrap.append($btnSub).appendTo($activity);

        $btnSub.click(function () {

            com.post(api.information.queryActivityForValid, {"activity.type": 2}, function (res) {

                var activitys = res.activitys;
                var _activitys = [];

                for (var i = 0; i < activitys.length; i++) {
                    var _activity = activitys[i];
                    _activitys.push({aid: _activity.aid, activityName: _activity.name});
                }
                activityInfo.bindData(_activitys, "aid", "activityName", "money", false);
            });
            materialActivityItem.materialActivityModal.modal("show")
        });
        return $activityName
    }

    orderList();
    materialNo(activityId);

    var options = {
        "orderId": paramsOrderId,
    };

    //查询活动信息
    function queryMaterialActivity() {
        com.post(api.material.queryMaterialActivity, options, function (res) {
            var materialActivity = res.materialActivitys;
            var materialActivityContent = com.focusPage("#materialActivityItem").empty();

            for (var i = 0; i < materialActivity.length; i++) {
                var _materialActivity = materialActivity[i];
                var ul = $("<div></div>").addClass("list-unstyled list-striped pricing-table");
                var nameH2 = $("<h3></h3>").text("活动名称:").appendTo(ul);
                var nameLi = $("<li></li>").appendTo(ul);
                var nameSpan = $("<span></span>").text(_materialActivity[0]).appendTo(nameLi);
                var moneyH2 = $("<h3></h3>").text("总价:").appendTo(ul);
                var moneyLi = $("<li></li>").appendTo(ul);
                var moneySpan = $("<span></span>").text(utils.accDiv(_materialActivity[1], 1000)).appendTo(moneyLi);

                materialActivityContent.append(ul);
            }
        });
    }

    queryMaterialActivity();
    queryMaterialActivityItem();

    //查询活动物品
    function queryMaterialActivityItem() {
        com.post(api.material.queryMaterialActivityItem, options, function (res) {

            var materialActivityItems = res.materialActivityItems;
            var materialActivityContent = com.focusPage("#materialActivityItems").empty();

            $.each(materialActivityItems, function (i, v) {

                var pricingSpan = $("<div></div>").addClass("col-md-6").css("margin", "5px 0px").attr("id", "pricing_" + v.maiid);

                var widgetBox = $("<div></div>").addClass("module_activity_border").appendTo(pricingSpan);

                var widgetBody = $("<div></div>").appendTo(widgetBox);
                var widgetMain = $("<div></div>").addClass("widget-main no-padding").appendTo(widgetBody);

                var widgetHeader = $("<div></div>").attr("id", "widgetHeader_" + v.maiid).appendTo(widgetMain);
                var widgetHeaderH5 = $("<h4></h4>").addClass("bigger lighter").css("padding-left", "12px").appendTo(widgetHeader).text(v.activity);

                var ul = $("<ul></ul>").addClass("list-unstyled fl-inline-list clearfix").css("padding-left", "12px").appendTo(widgetMain);
                var nameLi = $("<li></li>").appendTo(ul);
                var nameStr = $("<strong></strong>").text("物品:").appendTo(nameLi);
                var nameSpan = $("<span></span>").attr("id", "activityItemName_" + v.maiid).text(v.name).appendTo(nameLi);

                var moneyLi = $("<li></li>").appendTo(ul);
                var moneyStr = $("<strong></strong>").text("金额:").appendTo(moneyLi);
                var moneySpan = $("<span></span>").addClass("blue").attr("id", "money_" + v.maiid).text(v.money).appendTo(moneyLi);

                var numLi = $("<li></li>").appendTo(ul);
                var numStr = $("<strong></strong>").text("数量:").appendTo(numLi);
                var numSpan = $("<span></span>").attr("id", "num_" + v.maiid).text(v.num).appendTo(numLi);

                var stateLi = $("<li></li>").appendTo(ul);
                var stateStr = $("<strong></strong>").text("状态:").appendTo(stateLi);
                var stateSpan = $("<span></span>").addClass("red").attr("id", "state_" + v.maiid).text(v.state == 0 ? "初始" : v.state == 1 ? "失效" : v.state == 2 ? "已领" : v.state == 3 ? "退货" : v.state == 4 ? "配送" : v.state == 5 ? "未退" : "补款").appendTo(stateLi);

                var totalLi = $("<li></li>").appendTo(ul);
                var totalStr = $("<strong></strong>").text("合计:").appendTo(totalLi);
                var totalSpan = $("<span></span>").addClass("blue").attr("id", "total_" + v.maiid).text(utils.accMul(v.money, v.num)).appendTo(totalLi);

                var uiPgDiv = $("<div></div>").addClass("ui-pg-div").appendTo(widgetBody);
                if (uiBtnMethod != null) {
                    uiBtnMethod(uiPgDiv, v);
                }
                materialActivityContent.append(pricingSpan)
            })
        });
    }

    function uiBtnMethod(uiPgDiv, activityItem) {

        var abateBtn = $("<span></span>").addClass("btn btn-minier btn-yellow").html("失效").css("margin", "3px 3px").attr("id", "abate_" + activityItem.maiid).appendTo(uiPgDiv);
        var receiveBtn = $("<span></span>").addClass("btn btn-minier btn-success").html("领取").css("margin", "3px 3px").attr("id", "receive_" + activityItem.maiid).appendTo(uiPgDiv);
        var deliveBtn = $("<span></span>").addClass("btn btn-minier btn-warning").html("配送").css("margin", "3px 3px").attr("id", "delive_" + activityItem.maiid).appendTo(uiPgDiv);
        var unredundBtn = $("<span></span>").addClass("btn btn-minier btn-inverse").html("未退").css("margin", "3px 3px").attr("id", "unrefund_" + activityItem.maiid).appendTo(uiPgDiv);
        var refundBtn = $("<span></span>").addClass("btn btn-minier btn-danger").html("退货").css("margin", "3px 3px").attr("id", "refund_" + activityItem.maiid).appendTo(uiPgDiv);
        var expendBtn = $("<span></span>").addClass("btn btn-minier btn-pink").html("补款").css("margin", "3px 3px").attr("id", "expend_" + activityItem.maiid).appendTo(uiPgDiv);

        abateBtn.on("click", function () {
            abateMaterialActivityItem(activityItem.maiid, activityItem.activity);
        });

        deliveBtn.on("click", function () {
            materialActivityItem.name.html("配送" + activityItem.activity + "的活动奖品");
            materialActivityItem.data = activityItem;
            materialActivityItem.commentModal.attr("type", "1");
            materialActivityItem.commentModal.modal("show");
        });

        receiveBtn.on("click", function () {
            materialActivityItem.name.html("领取" + activityItem.activity + "的活动奖品");
            materialActivityItem.data = activityItem;
            materialActivityItem.commentModal.attr("type", "0");
            materialActivityItem.commentModal.modal("show");
        });

        unredundBtn.on("click", function () {
            unredundMaterialActivityItem(activityItem.maiid, activityItem.activity);
        });

        refundBtn.on("click", function () {
            materialActivityItem.name.html("退货" + activityItem.activity + "的活动奖品");
            materialActivityItem.data = activityItem;
            materialActivityItem.commentModal.attr("type", "2");
            materialActivityItem.commentModal.modal("show");
        });

        expendBtn.on("click", function () {
            expendMaterialActivityItem(activityItem.maiid, activityItem.activity);
        });
    }

    function abateMaterialActivityItem(maiid, activityItemName) {

        com.showConfirm("是否确认失效" + activityItemName + "活动物品?", function () {

            var options = {
                "materialActivityItem.maiid": maiid
            };

            com.post(api.material.abateMaterialActivityItem, options, function (res) {
                com.showAlert(com.info, "操作成功!");
                queryMaterialActivityItem();
            });
        });
    }

    function unredundMaterialActivityItem(maiid, activityItemName) {

        com.showConfirm("是否确认未退" + activityItemName + "的活动物品?", function () {

            var options = {
                "materialActivityItem.maiid": maiid,
            };

            com.post(api.material.unrefundMaterialActivityItem, options, function (res) {
                com.showAlert(com.info, "操作成功!");
                queryMaterialActivityItem();
            })
        });
    }

    function expendMaterialActivityItem(maiid, activityItemName) {

        com.showConfirm("是否补款" + activityItemName + "的活动物品?", function () {

            var options = {
                "materialActivityItem.maiid": maiid,
            };

            com.post(api.material.expendMaterialActivityItem, options, function (res) {
                com.showAlert(com.info, "操作成功!");
                queryMaterialActivityItem();
            })
        });
    }

    com.focusPage("#commentBtn").on("click", function () {
        var type = materialActivityItem.commentModal.attr("type");
        var options = {
            "materialActivityItem.maiid": materialActivityItem.data.maiid,
            "materialActivityItem.content": materialActivityItem.items.comment.val()
        };
        var url;
        if (type == 0) {
            url = api.material.receiveMaterialActivityItem
        } else if (type == 1) {
            url = api.material.deliveMaterialActivityItem
        } else if (type == 2) {
            url = api.material.refundMaterialActivityItem
        }
        com.post(url, options, function (res) {
            com.showAlert(com.info, "操作成功!");
            materialActivityItem.commentModal.removeAttr("type");
            queryMaterialActivityItem();
        });
        com.cleanItems(materialActivityItem.items);
        materialActivityItem.commentModal.modal("hide");
    });

    //修改活动
    com.focusPage("#submitMaterialActivityBtn").on("click", function () {

        if (com.validate("materialActivityModal")) {
            return false;
        }

        var mid = paramsMid;
        var aid = com.focusPage("#activityInfo").find("option:selected").val();
        var options = {
            "material.mid": mid,
            "material.activityId": aid
        };
        com.post(api.material.updateMaterialForActivity, options, function (res) {
            queryMaterialActivity();
            materialNo(res.material.activityId);
            com.showAlert(com.info, "修改成功")
        });

        materialActivityItem.materialActivityModal.modal("hide");
    });

    //领取物品
    com.focusPage("#submitMaterialActivityItemBtn").on("click", function () {

        if (things.html() == "" && coupons.html() == "") {
            com.showAlert(com.warning, "活动物品或券需要选择才能提交");
            return;
        }

        var submitFlag = true;

        var orderId = paramsOrderId;
        var activityName = com.focusPage("#activity").find("option:selected").text();
        var aid = com.focusPage("#activity").find("option:selected").val();
        var content = com.focusPage("#approveActivityItemContent").val();
        if (aid == "" || aid == null || aid == undefined) {
            com.showAlert(com.warning, "请选择活动");
            return;
        }
        var index = 0;
        var options = {};

        com.focusPage("#things li").each(function (i, e) {

            var _things = $(e);

            options["materialActivityItems[" + index + "].orderId"] = orderId;
            options["materialActivityItems[" + index + "].aid"] = aid;
            options["materialActivityItems[" + index + "].asid"] = _things.children('span').attr("asid");
            options["materialActivityItems[" + index + "].activity"] = activityName;
            options["materialActivityItems[" + index + "].name"] = _things.children('span').attr("thingsName").split(" ")[0];
            var costType = materialActivityItem.activityItemMap[_things.children('span').attr("asid")];
            options["materialActivityItems[" + index + "].type"] = costType >= 10 ? costType : 1;
            options["materialActivityItems[" + index + "].num"] = _things.children('span').attr("num");
            options["materialActivityItems[" + index + "].money"] = _things.children('span').attr("thingsName").split(" ")[1].split(':')[1];
            options["materialActivityItems[" + index + "].content"] = content;

            index++;
        });

        com.focusPage("#coupons li").each(function (i, e) {

            var _coupons = $(e);

            options["materialActivityItems[" + index + "].orderId"] = orderId;
            options["materialActivityItems[" + index + "].aid"] = aid;
            options["materialActivityItems[" + index + "].asid"] = _coupons.children('span').attr("asid");
            options["materialActivityItems[" + index + "].activity"] = activityName;
            options["materialActivityItems[" + index + "].name"] = _coupons.children('span').attr("couponsName").split(" ")[0];
            var costType = materialActivityItem.activityItemMap[_coupons.children('span').attr("asid")];
            options["materialActivityItems[" + index + "].type"] = costType >= 10 ? costType : 0;
            options["materialActivityItems[" + index + "].num"] = _coupons.children('span').attr("num");
            options["materialActivityItems[" + index + "].money"] = _coupons.children('span').attr("couponsName").split(" ")[1].split(':')[1];
            options["materialActivityItems[" + index + "].content"] = content;

            index++;
        });

        if (!submitFlag) {
            return;
        }

        com.post(api.material.addMaterialActivityItem, options, function (res) {
            com.cleanItems(materialActivityItem.items);
            com.clearValidator();
            things.html("");
            coupons.html("");
            queryMaterialActivityItem();
        });
        materialActivityItem.materialActivityItemModal.modal("hide");
    });

    //返回
    com.focusPage("#backBtn").on("click", function () {
        com.switchPage(api.index.materialIndex.url);
    });

});