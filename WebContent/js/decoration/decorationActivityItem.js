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
    //特殊活动选责绑定
    var type2List = [];//特殊卷
    var type3List = [];//特殊物品
    decorationActivityItem.activity.specialActivity = com.focusPage("#selectAtivity").on("change", function () {
        com.focusPage("#awardStockName").empty();
        type2List = [];
        type3List = [];
        var $this = $(this);
        var options = {
            "activity.aid": $this.val()
        };

        com.post(api.ds.information, {}, function (res) {
            var special_activityItemType = [];
            special_activityItemType.push({"key":"","value":""});
            $.each(res.awardStockType, function (i, v) {
                if (parseInt(v.key) > 1) {
                    special_activityItemType.push(v)
                }
            });
            com.focusPage("#activityType").bindData(special_activityItemType, "key", "value");
        });

        com.post(api.information.queryActivityItemByAid, options, function (res) {
            $.each(res.activityItems, function (i, v) {
                if (v.type == 2) {
                    var data = {
                        "asid": v.asid,
                        "name": v.name
                    };
                    type2List.push(data)
                } else if (v.type == 3) {
                    var data = {
                        "asid": v.asid,
                        "name": v.name
                    };
                    type3List.push(data)
                }
            });
        });

        decorationActivityItem.activity.couponInfo.css("display", "block");
    });

    decorationActivityItem.activity.activityType = com.focusPage("#activityType").on("change", function () {
        decorationActivityItem.activity.couponInfo.css("display", "block");

        var activityType = com.focusPage("#activityType").val();
        var list = [];
        if (activityType == 2) {
            list = type2List
        } else if (activityType == 3) {
            list = type3List
        }
        com.focusPage("#awardStockName").bindData(list, "asid", "name")
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


        var receiveBtn = $("<span></span>").addClass("ui-icon icon-bookmark").attr("id", "receive_" + activityItem.daiId).appendTo(uiPgDiv);


        if (activityItem.state == 0) {

            abateBtn.on("click", function () {
                abateDecorationActivityItem(activityItem.daiId, activityItem.activityItemName);
            });

            receiveBtn.on("click", function () {
                if (activityItem.state == 2) {
                    com.showAlert(com.warning, "已领取!!");
                } else {
                    receiveDecorationActivityItem(activityItem.daiId, activityItem.activityItemName);
                }

            });
        }

    }

    //领取
    function receiveDecorationActivityItem(activityItemName, daiId) {

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

        com.post(api.information.queryActivityForValid, {"activity.type": 0}, function (res) {
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
            decorationActivityItem.activity.bindData(_activitys, "aid", "activityName", false);
        }, null, false);

        approvalUtils.initqueryApprovalUser("approveActivityItemManSel", 8);

        binding("receiveTypes");

        decorationActivityItem.applyDecorationActivityItemModal.modal("show");
    });

    //特批活动物品
    com.focusPage("#applySpecialActivityItemBtn").on("click", function () {
        var options = {
            "decorationActivity.orderId": decorationActivityItem.decorationOrderId
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

            decorationActivityItem.activity.specialActivity.bindData(_activitys, "aid", "activityName", false);
        }, null, false);


        decorationActivityItem.activity.couponInfo.css("display", "none");

        approvalUtils.initqueryApprovalUser("approveSpecialActivityItemManSel", 8);

        binding("receiveType");

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
        var stateType = com.focusPage("#receiveTypes").val();
        var activityId = com.focusPage("#activity").val();
        var index = 0;
        var options = {
            "approval.receiver.userId": receiverId,
            "approval.comment": "",
            "approvalDecorationActivity.activityId":activityId,
            "approvalDecorationActivity.orderId": orderId,
            "approvalDecorationActivity.activityName": activityName
        };

        com.focusPage("[class='search-choice']", $("#things_chosen")).each(function (i, e) {

            var _ = $(e);

            if (!/^\d+$/.test(_.children('span').children('input').val())) {
                com.showAlert(com.warning, "物品需要填写数量");
                submitFlag = false;
            }

            options["approvalDecorationActivityItems[" + index + "].orderId"] = orderId;
            options["approvalDecorationActivityItems[" + index + "].activityName"] = activityName;
            options["approvalDecorationActivityItems[" + index + "].activityItemName"] = _.children('span').text().split(" ")[0];
            options["approvalDecorationActivityItems[" + index + "].type"] = 1;
            options["approvalDecorationActivityItems[" + index + "].num"] = _.children('span').children('input').val();
            options["approvalDecorationActivityItems[" + index + "].money"] = _.children('span').text().split(" ")[1].split(':')[1];
            options["approvalDecorationActivityItems[" + index + "].content"] = "";
            options["approvalDecorationActivityItems[" + index + "].stateType"] = stateType;
            options["approvalDecorationActivityItems[" + index + "].asid"] = _.attr("index");
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
            options["approvalDecorationActivityItems[" + index + "].stateType"] = stateType;
            options["approvalDecorationActivityItems[" + index + "].asid"] = _.attr("index");

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

    //保存-特批活动
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
        var stateType = com.focusPage("#activityType").val();
        var activityItemNames = com.focusPage("#awardStockName").find("option:selected").text();
        var selectAtivity = com.focusPage("#selectAtivity").text();
        var activityId = com.focusPage("#selectAtivity").val();

        var options = {
            "approval.receiver.userId": receiverId,
            "approval.comment": "",
            "approvalDecorationActivity.activityId":activityId,
            "approvalDecorationActivity.orderId": orderId,
            "approvalDecorationActivity.activityName": selectAtivity,
            "approvalDecorationActivityItems[0].stateType": stateType,
            "approvalDecorationActivityItems[0].asid": com.focusPage("#awardStockName").val(),
            "approvalDecorationActivityItems[0].orderId": orderId,
            "approvalDecorationActivityItems[0].activityName": selectAtivity,
            "approvalDecorationActivityItems[0].activityItemName": activityItemNames,
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

                    com.focusPage("#receive_" + daiId).unbind();
                    com.focusPage("#widgetHeader_" + daiId).addClass("header-color-grey");
                    initdraw(ActivityOrderId);
                });
            }
        });
    }

    function binding(idName) {
        com.post(api.ds.decoration, {}, function (res) {
            com.focusPage("#" + idName).bindData(res.receiveType, "key", "value", true)
        });
    }

    function receiveDecorationActivityItem(daiId, activityItemName) {


        bootbox.confirm("是否确认领取" + activityItemName + "活动物品?", function (result) {
            if (result) {

                var options = {
                    "decorationActivityItem.daiId": daiId,
                }

                com.post(api.decoration.receiveDecorationActivityItem, options, function (res) {

                    var daiId = res.decorationActivityItem.daiId;

                    com.focusPage("#convert_" + daiId).unbind();
                    com.focusPage("#abate_" + daiId).unbind();

                    com.focusPage("#receive_" + daiId).unbind();
                    com.focusPage("#widgetHeader_" + daiId).addClass("header-color-orange");
                })
            }
        });
    }
});