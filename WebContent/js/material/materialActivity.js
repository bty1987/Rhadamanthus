$(function () {

    var materialActivityItem = {
        items: {},
        activity: {},
    };

    var paramsOrderId = params.orderId;
    var paramsMid = params.mid;
    var paramsNo = params.no;
    var activityId = params.activityId;
    var things = com.focusPage("#things");
    var coupons = com.focusPage("#coupons");
    var activityInfo = com.focusPage("#activityInfo");
    materialActivityItem.activity = com.focusPage("#activity");
    materialActivityItem.items.content = com.focusPage("#approveActivityItemContent");
    materialActivityItem.materialActivityItemModal = com.focusPage("#materialActivityItemModal").on('show.bs.modal', function (e) {
        com.clearValidator();
    });
    materialActivityItem.materialActivityModal = com.focusPage("#materialActivityModal").on('show.bs.modal', function (e) {
        com.clearValidator();
    });
    materialActivityItem.activity.activity = com.focusPage("#activity").on("change", function () {
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

            com.post(api.information.queryActivityForValid, {"activity.type": 1}, function (res) {
                var activitys = res.activitys;

                var _activitys = [];

                for (var i = 0; i < activitys.length; i++) {
                    var _activity = activitys[i];

                    _activitys.push({aid: _activity.aid, activityName: _activity.name, money: _activitys.money});
                }
                materialActivityItem.activity.bindData(_activitys, "aid", "activityName", "money", false);
            });

            approvalUtils.initqueryApprovalUser("approveActivityItemManSel", 8);

            materialActivityItem.materialActivityItemModal.modal("show")
        });

        return $divWarp;
    }

    function materialNo() {

        var $btnSub = $('<a></a>').addClass('btn btn-minier btn-success').html('修改活动');
        var $h4 = $('<h4></h4>').addClass('oid').append($('<small></small>').addClass('blue')).html("主材单号:" + paramsNo);
        var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');
        var $divWarp = com.focusPage("#paramsNo").append($h4);
        $divBtnWrap.append($btnSub).appendTo($h4);

        $btnSub.click(function () {

            com.post(api.information.queryActivityForValid, {"activity.type": 1}, function (res) {

                var activitys = res.activitys;
                var _activitys = [];

                for (var i = 0; i < activitys.length; i++) {
                    var _activity = activitys[i];

                    if (_activity.aid == activityId) {
                        com.focusPage("#activityName").val(_activity.name)
                    }
                    _activitys.push({aid: _activity.aid, activityName: _activity.name, money: _activitys.money});
                }
                activityInfo.bindData(_activitys, "aid", "activityName", "money", false);
            });
            materialActivityItem.materialActivityModal.modal("show")
        });
        return $divWarp
    }

    orderList();
    materialNo();

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
                var moneySpan = $("<span></span>").text(_materialActivity[1]).appendTo(moneyLi);

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

                var pricingSpan = $("<div></div>").addClass("col-sm-3").css({
                    "display": "inline-block",
                    "float": "none"
                }).attr("id", "pricing_" + v.maiid);
                var widgetBox = $("<div></div>").addClass("widget-box pricing-box-small").appendTo(pricingSpan);

                var widgetHeader = $("<div></div>").addClass("widget-header").attr("id", "widgetHeader_" + v.maiid).appendTo(widgetBox);
                var widgetHeaderH5 = $("<h5></h5>").addClass("bigger lighter").appendTo(widgetHeader);

                if (v.type == 0) {
                    widgetHeaderH5.text(v.activity);
                    widgetHeader.addClass("header-color-blue");
                } else if (v.type == 1) {
                    widgetHeaderH5.text(v.activity);
                    widgetHeader.addClass("header-color-green");
                }
                if (v.state == 1) {
                    widgetHeader.addClass("header-color-grey");
                } else if (v.state == 2) {
                    widgetHeader.addClass("header-color-orange");
                }

                var widgetBody = $("<div></div>").addClass("widget-body").appendTo(widgetBox);
                var widgetMain = $("<div></div>").addClass("widget-main no-padding").appendTo(widgetBody);

                var ul = $("<ul></ul>").addClass("list-unstyled list-striped pricing-table").appendTo(widgetMain);
                var nameLi = $("<li></li>").text("物品:").appendTo(ul);
                var nameSpan = $("<span></span>").attr("id", "activityItemName_" + v.maiid).text(v.name).appendTo(nameLi);

                var moneyLi = $("<li></li>").text("金额:").appendTo(ul);
                var moneySpan = $("<span></span>").attr("id", "money_" + v.maiid).text(v.money).appendTo(moneyLi);

                var numLi = $("<li></li>").text("数量:").appendTo(ul);
                var numSpan = $("<span></span>").attr("id", "money_" + v.maiid).text(v.num).appendTo(numLi);

                var stateLi = $("<li></li>").text("状态:").appendTo(ul);
                var stateSpan = $("<span></span>").attr("id", "money_" + v.maiid).text(v.state == 0 ? "有效" : v.state == 1 ? "失效" : "接收").appendTo(stateLi);

                var totalLi = $("<li></li>").text("合计:").appendTo(ul);
                var totalSpan = $("<span></span>").attr("id", "money_" + v.maiid).text(utils.accMul(v.money, v.num)).appendTo(totalLi);

                var uiPgDiv = $("<div></div>").addClass("ui-pg-div").appendTo(widgetBody);
                if (uiBtnMethod != null) {
                    uiBtnMethod(uiPgDiv, v);
                }
                materialActivityContent.append(pricingSpan)
            })
        });
    }

    function uiBtnMethod(uiPgDiv, activityItem) {

        var abateBtn = $("<span></span>").addClass("ui-icon icon-ban-circle red").attr("id", "abate_" + activityItem.maiid).appendTo(uiPgDiv);


        var receiveBtn = $("<span></span>").addClass("ui-icon icon-bookmark").attr("id", "receive_" + activityItem.maiid).appendTo(uiPgDiv);


        if (activityItem.state == 0) {

            abateBtn.on("click", function () {
                abateMaterialActivityItem(activityItem.maiid, activityItem.activity);
            });

            receiveBtn.on("click", function () {
                if (activityItem.state == 2) {
                    com.showAlert(com.warning, "已领取!!");
                } else {
                    receiveMaterialActivityItem(activityItem.maiid, activityItem.activity);
                }
            });
        }
    }

    function abateMaterialActivityItem(maiid, activityItemName) {

        bootbox.confirm("是否确认失效" + activityItemName + "活动物品?", function (result) {
            if (result) {

                var options = {
                    "materialActivityItem.maiid": maiid
                };

                com.post(api.material.abateMaterialActivityItem, options, function (res) {

                    var maiid = res.materialActivityItem.maiid;

                    com.focusPage("#convert_" + maiid).unbind();
                    com.focusPage("#abate_" + maiid).unbind();

                    com.focusPage("#receive_" + maiid).unbind();
                    com.focusPage("#widgetHeader_" + maiid);
                    queryMaterialActivityItem();
                });
            }
        });
    }

    function receiveMaterialActivityItem(maiid, activityItemName) {

        bootbox.confirm("是否确认领取" + activityItemName + "活动物品?", function (result) {
            if (result) {

                var options = {
                    "materialActivityItem.maiid": maiid,
                };

                com.post(api.material.receiveMaterialActivityItem, options, function (res) {

                    var maiid = res.materialActivityItem.maiid;

                    com.focusPage("#convert_" + maiid).unbind();
                    com.focusPage("#abate_" + maiid).unbind();

                    com.focusPage("#receive_" + maiid).unbind();
                    com.focusPage("#widgetHeader_" + maiid);
                    com.showAlert(com.info, "领取成功!");
                    queryMaterialActivityItem();
                })
            }
        });
    }

    //修改活动
    com.focusPage("#submitMaterialActivityBtn").on("click", function () {

        if (com.validate()) {
            return;
        }

        var mid = paramsMid;
        var aid = com.focusPage("#activityInfo").find("option:selected").val();
        var options = {
            "material.mid": mid,
            "material.activityId": aid
        };
        com.post(api.material.updateMaterialForActivity, options, function (res) {
            queryMaterialActivity();
            com.showAlert(com.info, "修改成功")
        });

        materialActivityItem.materialActivityModal.modal("hide");
    });

    //领取物品
    com.focusPage("#submitMaterialActivityItemBtn").on("click", function () {

        if (com.validate()) {
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
        var content = com.focusPage("#approveActivityItemContent").val();

        var index = 0;
        var options = {};

        com.focusPage("[class='search-choice']", $("#things_chosen")).each(function (i, e) {

            var _things = $(e);

            if (!/^\d+$/.test(_things.children('span').children('input').val())) {
                com.showAlert(com.warning, "请填写物品数量");
                submitFlag = false;
            }

            options["materialActivityItems[" + index + "].orderId"] = orderId;
            options["materialActivityItems[" + index + "].aid"] = aid;
            options["materialActivityItems[" + index + "].asid"] = _things.attr("index");
            options["materialActivityItems[" + index + "].activity"] = activityName;
            options["materialActivityItems[" + index + "].name"] = _things.children('span').text().split(" ")[0];
            options["materialActivityItems[" + index + "].type"] = 1;
            options["materialActivityItems[" + index + "].num"] = _things.children('span').children('input').val();
            options["materialActivityItems[" + index + "].money"] = _things.children('span').text().split(" ")[1].split(':')[1];
            options["materialActivityItems[" + index + "].content"] = content;

            index++;
        });

        com.focusPage("[class='search-choice']", $("#coupons_chosen")).each(function (i, e) {

            var _coupons = $(e);

            if (!/^\d+$/.test(_coupons.children('span').children('input').val())) {
                com.showAlert(com.warning, "请填写券数量");
                submitFlag = false;
            }

            options["materialActivityItems[" + index + "].orderId"] = orderId;
            options["materialActivityItems[" + index + "].aid"] = aid;
            options["materialActivityItems[" + index + "].asid"] = _coupons.attr("index");
            options["materialActivityItems[" + index + "].activity"] = activityName;
            options["materialActivityItems[" + index + "].name"] = _coupons.children('span').text().split(" ")[0];
            options["materialActivityItems[" + index + "].type"] = 0;
            options["materialActivityItems[" + index + "].num"] = _coupons.children('span').children('input').val();
            options["materialActivityItems[" + index + "].money"] = _coupons.children('span').text().split(" ")[1].split(':')[1];
            options["materialActivityItems[" + index + "].content"] = content;

            index++;
        });

        if (!submitFlag) {
            return;
        }

        com.post(api.material.addMaterialActivityItem, options, function (res) {
            com.cleanItems(materialActivityItem.items);
            com.clearValidator();
            queryMaterialActivityItem();
        });
        materialActivityItem.materialActivityItemModal.modal("hide");
    });

    //返回
    com.focusPage("#backBtn").on("click", function () {
        com.switchPage(api.index.materialIndex.url);
    });

});