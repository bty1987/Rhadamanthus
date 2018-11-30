jQuery(function ($) {
    drawNode.draw(params.viewNode);

    var decorationActivityItem = {
        items: {}
    };
    var ActivityOrderId = params.decorationOrderId;
    var activityInfo = com.focusPage("#activityInfo");
    var things = com.focusPage("#things");
    var coupons = com.focusPage("#coupons");
    decorationActivityItem.activity = com.focusPage("#activity");
    com.focusPage("#activity").on("change", function () {

        var $this = $(this);
        var _things = [];
        var _coupons = [];

        var options = {
            "activity.aid": $this.val()
        };

        com.post(api.information.queryActivityItemByAId, options, function (res) {

            var _ = res.activityItems;

            for (var i = 0; i < _.length; i++) {

                var _activityItem = _[i];

                if (_activityItem.type == 0) {
                    _coupons.push({
                        aiId: _activityItem.aiId,
                        activityItemName: _activityItem.name + " 金额:" + _activityItem.money
                    });
                } else if (_activityItem.type == 1) {
                    _things.push({
                        aiId: _activityItem.aiId,
                        activityItemName: _activityItem.name + " 金额:" + _activityItem.money
                    });
                }
            }

            things.chosen("destroy");
            things.chosen({width: "216px", multi_type: "input"});
            things.bindData(_things, 'aiId', 'activityItemName', false);
            things.trigger("chosen:updated");

            coupons.chosen("destroy");
            coupons.chosen({width: "216px", multi_type: "input"});
            coupons.bindData(_coupons, 'aiId', 'activityItemName', false);
            coupons.trigger("chosen:updated");
        });
    });

    var validator = {
        activityNameVerification: {
            type: "v_NameVerification",
            regex: /^[^ ]*$/,
            errorMsg: "活动名称不能带有空格"
        }
    };
    $.extend(com.validator, validator);

    decorationActivityItem.decorationOrderId = ActivityOrderId;
    decorationActivityItem.items.orderId = com.focusPage("#orderId");
    decorationActivityItem.items.decorationActivityItems = com.focusPage("#decorationActivityItems");
    decorationActivityItem.items.decorationActivityItems1 = com.focusPage("#decorationActivityItems1");
    decorationActivityItem.items.activityItems = com.focusPage("#activityItems");
    decorationActivityItem.activity.couponInfo = com.focusPage("#couponInfo");
    decorationActivityItem.activity.activity = com.focusPage("#activity");

    decorationActivityItem.activity.name = com.focusPage("#activityItemName");
    decorationActivityItem.activity.num = com.focusPage("#activityItemNum");
    decorationActivityItem.activity.money = com.focusPage("#activityItemMoney");

    decorationActivityItem.joinDecorationActivityModal = com.focusPage("#joinDecorationActivityModal").on('show.bs.modal', function (e) {
        com.clearValidator();
    });
    decorationActivityItem.applyDecorationActivityItemModal = com.focusPage("#applyDecorationActivityItemModal").on('show.bs.modal', function (e) {
        com.clearValidator();
    });
    decorationActivityItem.activity.activityType = com.focusPage("#activityType").on("change", function () {
        decorationActivityItem.activity.couponInfo.css("display", "block");
    });

    decorationActivityItem.applySpecialDecorationActivityItemModal = com.focusPage("#applySpecialDecorationActivityItemModal").on('show.bs.modal', function (e) {
        com.clearValidator();
    });

    //初始化
    function initdraw(orderId) {
        decorationUtils.decorationActivityItemInfo(decorationActivityItem.items.activityItems, decorationActivityItem.items.decorationActivityItems1, uiBtnMethod, orderId);
        decorationUtils.decorationActivityInfo(decorationActivityItem.items.decorationActivityItems, activityBtnMethod, orderId);
    }

    initdraw(ActivityOrderId);

    function uiBtnMethod(uiPgDiv, activityItem) {

        var abateBtn = $("<span></span>").addClass("ui-icon icon-ban-circle red").attr("id", "abate_" + activityItem.daiId).appendTo(uiPgDiv);

        if (activityItem.state == 0) {

            abateBtn.on("click", function () {
                abateDecorationActivityItem(activityItem.daiId, activityItem.activityItemName);
            });
        }
    }
    //领取
    function receiveDecorationActivityItem(daiId, activityItemName) {

        bootbox.confirm("是否确认领取" + activityItemName + "活动物品?", function (result) {
            if (result) {

                var options = {
                    "decorationActivityItem.daiId": daiId
                };

                com.post(api.decoration.receiveDecorationActivityItem, options, function (res) {

                    var daiId = res.decorationActivityItem.daiId;

                    com.focusPage("#convert_" + daiId).unbind();
                    com.focusPage("#abate_" + daiId).unbind();
                    com.focusPage("#widgetHeader_" + daiId).addClass("header-color-orange");
                    initdraw(ActivityOrderId);
                });
            }
        });
    }

    //参加活动
    com.focusPage("#joinActivityBtn").on("click", function () {

        com.post(api.information.queryActivityForValid, {}, function (res) {
            var activitys = res.activitys;

            var _activitys = [{aid: -1, activityName: ""}];

            for (var i = 0; i < activitys.length; i++) {
                var _activity = activitys[i];

                _activitys.push({aid: _activity.aid, activityName: _activity.name, money: _activitys.money});
            }
            activityInfo.bindData(_activitys, "aid", "activityName", "money", false);
        });

        decorationActivityItem.joinDecorationActivityModal.modal("show");
    });

    //申领活动物品
    com.focusPage("#applyActivityItemBtn").on("click", function () {

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

        var options = {
            "decorationActivity.orderId": ActivityOrderId
        };

        com.post(api.decoration.queryDecorationActivityByOrderId, options, function (res) {

            var decorationActivitys = res.decorationActivitys;

            var _activitys = [{aid: -1, activityName: ""}];

            for (var i = 0; i < decorationActivitys.length; i++) {
                var _decorationActivity = decorationActivitys[i];

                _activitys.push({
                    aid: _decorationActivity.activity.aid,
                    activityName: _decorationActivity.activity.name,
                    money: _decorationActivity.activity.money
                });
            }
            decorationActivityItem.activity.bindData(_activitys, "aid", "activityName", "money", false);
        }, null, false);

        approvalUtils.initqueryApprovalUser("approveActivityItemManSel", 8);

        decorationActivityItem.applyDecorationActivityItemModal.modal("show");
    });

    //特批活动物品
    com.focusPage("#applySpecialActivityItemBtn").on("click", function () {

        com.post(api.ds.information, {}, function (res) {

            decorationActivityItem.activityItemType = res.activityItemType;
            decorationActivityItem.activity.activityType.bindData(decorationActivityItem.activityItemType, "key", "value");
        });

        decorationActivityItem.activity.couponInfo.css("display", "none");

        approvalUtils.initqueryApprovalUser("approveSpecialActivityItemManSel", 8);

        decorationActivityItem.applySpecialDecorationActivityItemModal.modal("show");
    });

    //保存参加活动
    com.focusPage("#submitDecorationActivityBtn").on(ace.click_event, function () {

        if (com.validate()) {
            return;
        }
        var options = {
            "decorationActivity.orderId": ActivityOrderId,
            "decorationActivity.activity.aid": activityInfo.val()
        };
        com.post(api.decoration.addDecorationActivity, options, function (res) {
            var decorationActivity = res.decorationActivity;
            decorationUtils.addDecorationActivityForDiv(decorationActivityItem.activitys, decorationActivity, activityBtnMethod);
            initdraw(ActivityOrderId);
        });
        decorationActivityItem.joinDecorationActivityModal.modal("hide");
    });

    //保存-申领活动物品
    com.focusPage("#submitDecorationActivityItemBtn").on(ace.click_event, function () {

        if (com.validate()) {
            return;
        }

        var receiverId = com.focusPage("#approveActivityItemManSel").find('input:checked').attr('userid');

        if (receiverId == null || receiverId == "") {
            com.showAlert(com.error, "请选择审批人!");
            return;
        }

        if (things.val() == null && coupons.val() == null) {
            com.showAlert(com.warning, "活动物品或券需要选择才能提交");
            return;
        }

        var submitFlag = true;

        var orderId = ActivityOrderId;
        var activityName = decorationActivityItem.activity.activity.find("option:selected").text();

        var index = 0;
        var options = {
            "approval.receiver.userId": receiverId,
            "approval.comment": "",
            "approvalDecorationActivity.orderId": orderId,
            "approvalDecorationActivity.activityName": activityName
        };

        com.focusPage("[class='search-choice']", $("#things_chosen")).each(function (i, e) {

            var _ = $(e);

            options["approvalDecorationActivityItems[" + index + "].orderId"] = orderId;
            options["approvalDecorationActivityItems[" + index + "].activityName"] = activityName;
            options["approvalDecorationActivityItems[" + index + "].activityItemName"] = _.children('span').text().split(" ")[0];
            options["approvalDecorationActivityItems[" + index + "].type"] = 1;
            options["approvalDecorationActivityItems[" + index + "].num"] = _.children('span').children('input').val();
            options["approvalDecorationActivityItems[" + index + "].money"] = _.children('span').text().split(" ")[1].split(':')[1];
            options["approvalDecorationActivityItems[" + index + "].content"] = "";

            index++;
        });

        com.focusPage("[class='search-choice']", $("#coupons_chosen")).each(function (i, e) {
            var _ = $(e);

            if (!/^\d+$/.test(_.children('span').children('input').val())) {
                com.showAlert(com.warning, "券需要填写数量");
                submitFlag = false;
            }

            options["approvalDecorationActivityItems[" + index + "].orderId"] = orderId;
            options["approvalDecorationActivityItems[" + index + "].activityName"] = activityName;
            options["approvalDecorationActivityItems[" + index + "].activityItemName"] = _.children('span').text().split(" ")[0];
            options["approvalDecorationActivityItems[" + index + "].type"] = 0;
            options["approvalDecorationActivityItems[" + index + "].num"] = _.children('span').children('input').val();
            options["approvalDecorationActivityItems[" + index + "].money"] = _.children('span').text().split(" ")[1].split(':')[1];
            options["approvalDecorationActivityItems[" + index + "].content"] = "";

            index++;
        });

        if (!submitFlag) {
            return;
        }

        com.post(api.approval.submitApprovalForDecorationActivity, options, function (res) {
            com.showAlert(com.info, "提交成功");
        });
        decorationActivityItem.applyDecorationActivityItemModal.modal("hide");
    });

    com.focusPage("#submitSpecialDecorationActivityItemBtn").on(ace.click_event, function () {

        if (com.validate()) {
            return;
        }

        var receiverId = com.focusPage("#approveSpecialActivityItemManSel").find('input:checked').attr('userid');

        if (receiverId == null || receiverId == "") {
            com.showAlert(com.error, "请选择审批人!");
            return;
        }
        var orderId = ActivityOrderId;
        var type = decorationActivityItem.activity.activityType.val();

        var options = {
            "approval.receiver.userId": receiverId,
            "approval.comment": "",
            "approvalDecorationActivity.orderId": orderId,
            "approvalDecorationActivity.activityName": "特批活动物品",
            "approvalDecorationActivityItems[0].orderId": orderId,
            "approvalDecorationActivityItems[0].activityName": "特批活动物品",
            "approvalDecorationActivityItems[0].activityItemName": decorationActivityItem.activity.name.val(),
            "approvalDecorationActivityItems[0].type": type,
            "approvalDecorationActivityItems[0].content": "",
            "approvalDecorationActivityItems[0].num": decorationActivityItem.activity.num.val(),
            "approvalDecorationActivityItems[0].money": decorationActivityItem.activity.money.val()
        };

        com.post(api.approval.submitApprovalForDecorationActivity, options, function (res) {
            com.showAlert(com.info, "提交成功");
        });
        decorationActivityItem.applySpecialDecorationActivityItemModal.modal("hide");
    });

    function activityBtnMethod(uiPgDiv, decorationActivity) {
        
        var deleteBtn = $("<span></span>").addClass("ui-icon icon-ban-circle red").attr("id", "delete_" + decorationActivity.daId).appendTo(uiPgDiv);

        deleteBtn.on("click", function () {
            deleteDecorationActivity(decorationActivity.daId);
        });
    }

    //返回
    com.focusPage("#backBtn").on("click", function () {
        com.switchPage(api.index.decorationIndex.url);
    });

    function deleteDecorationActivity(daId) {

        var options = {
            "decorationActivity.daId": daId
        };

        com.post(api.decoration.deleteDecorationActivity, options, function (res) {
            com.focusPage("#dactivity_" + res.decorationActivity.daId).remove();
            initdraw(ActivityOrderId);
        });
    }

    //失效活动
    function abateDecorationActivityItem(daiId, activityItemName) {

        bootbox.confirm("是否确认失效" + activityItemName + "活动物品?", function (result) {
            if (result) {

                var options = {
                    "decorationActivityItem.daiId": daiId
                };

                com.post(api.decoration.abateDecorationActivityItem, options, function (res) {

                    var daiId = res.decorationActivityItem.daiId;

                    com.focusPage("#convert_" + daiId).unbind();
                    com.focusPage("#abate_" + daiId).unbind();
                    com.focusPage("#widgetHeader_" + daiId).addClass("header-color-grey");
                    initdraw(ActivityOrderId);
                });
            }
        });
    }
});