jQuery(function ($) {

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

    initdraw(decorationActivityItem.decorationOrderId);

    //初始化
    function initdraw(orderId) {

        decorationUtils.decorationActivityItemInfo(decorationActivityItem.items.activityItems, decorationActivityItem.items.decorationActivityItems1, uiBtnMethod, orderId);
        decorationUtils.decorationActivityInfo(decorationActivityItem.items.decorationActivityItems, activityBtnMethod, orderId);
    }



    function uiBtnMethod(uiPgDiv, activityItem) {

        var btnViewBtn= $("<a></a>").addClass("btn btn-minier btn-yellow").html("失效").css("margin", "0px 3px").attr("id", "abate_" + activityItem.daiId).appendTo(uiPgDiv);
        var receiveBtn= $("<a></a>").addClass("btn btn-minier btn-success").html("领取").css("margin", "0px 3px").attr("id", "receive_" + activityItem.daiId).appendTo(uiPgDiv);
        var refundBtn= $("<a></a>").addClass("btn btn-minier btn-warning").html("退货").css("margin", "0px 3px").attr("id", "receive_" + activityItem.daiId).appendTo(uiPgDiv);
        var deliveryBtn= $("<a></a>").addClass("btn btn-minier btn-inverse").html("配送").css("margin", "0px 3px").attr("id", "receive_" + activityItem.daiId).appendTo(uiPgDiv);
        var unrefundBtn= $("<a></a>").addClass("btn btn-minier btn-danger").html("未退").css("margin", "0px 3px").attr("id", "receive_" + activityItem.daiId).appendTo(uiPgDiv);
        var expendBtn= $("<a></a>").addClass("btn btn-minier btn-purple ").html("消耗").css("margin", "0px 3px").attr("id", "receive_" + activityItem.daiId).appendTo(uiPgDiv);

        if (activityItem.state == 0) {
            btnViewBtn.on("click", function () {
                abateDecorationActivityItem(activityItem.daiId, activityItem.activityItemName);
            });

            receiveBtn.on("click", function () {
                receiveDecorationActivityItem(activityItem.daiId, activityItem.activityItemName);

            });
        }
        refundBtn.on("click", function () {
            refundDecorationActivityItem(activityItem.daiId, activityItem.activityItemName);
        });
        deliveryBtn.on("click", function () {
            deliveDecorationActivityItem(activityItem.daiId, activityItem.activityItemName);
        });
        unrefundBtn.on("click", function () {
            unrefundDecorationActivityItem(activityItem.daiId, activityItem.activityItemName);
        });
        expendBtn.on("click", function () {
            expendDecorationActivityItem(activityItem.daiId, activityItem.activityItemName);
        });

    }

    //参加活动
    com.focusPage("#joinActivityBtn").on("click", function () {

        com.post(api.information.queryActivityForValid, {"activity.type": 1}, function (res) {
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

                if(_decorationActivity.status == 1){
                    continue;
                }

                _activitys.push({
                    aid: _decorationActivity.activity.aid,
                    activityName: _decorationActivity.activity.name,
                    money: _decorationActivity.activity.money
                });
            }
            decorationActivityItem.activity.bindData(_activitys, "aid", "activityName", false);
        }, null, false);

        approvalUtils.initqueryApprovalUser("approveActivityItemManSel", 8);

        decorationActivityItem.applyDecorationActivityItemModal.modal("show");
    });

    //保存参加活动
    com.focusPage("#submitDecorationActivityBtn").on(ace.click_event, function () {

        if (com.validate("joinDecorationActivityModal")) {
            return;
        }
        var options = {
            "decorationActivity.orderId": ActivityOrderId,
            "decorationActivity.activity.aid": activityInfo.val()
        };
        com.post(api.decoration.addDecorationActivity, options, function (res) {
            var decorationActivity = res.decorationActivity;
            decorationUtils.addDecorationActivityForDiv(decorationActivityItem.items.decorationActivityItems, decorationActivity, activityBtnMethod);
        });
        decorationActivityItem.joinDecorationActivityModal.modal("hide");
    });

    //保存-申领活动物品
    com.focusPage("#submitDecorationActivityItemBtn").on(ace.click_event, function () {

        if (com.validate("applyDecorationActivityItemModal")) {
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

    function activityBtnMethod(uiPgDiv, decorationActivity) {

        var deleteBtn = $("<a></a>").addClass("btn btn-minier btn-yellow").html("删除").css("margin", "0px 3px").attr("id", "delete_" + decorationActivity.daId).appendTo(uiPgDiv);
        var unlockBtn = $("<a></a>").addClass("btn btn-minier btn-success").html("解锁").css("margin", "0px 3px").attr("id", "unlock_" + decorationActivity.daId).appendTo(uiPgDiv);
        var lockBtn = $("<a></a>").addClass("btn btn-minier btn-warning").html("锁定").css("margin", "0px 3px").attr("id", "lock_" + decorationActivity.daId).appendTo(uiPgDiv);



        deleteBtn.on("click", function () {
            if(com.focusPage("#dactivity_" + decorationActivity.daId).attr("status") == 0){
            deleteDecorationActivity(decorationActivity.daId);
            }
        });

        unlockBtn.on("click", function () {
            unlockDecorationActivity(decorationActivity.daId);
        });
        lockBtn.on("click", function () {
            lockDecorationActivity(decorationActivity.daId);
        })

    }

    //返回
    com.focusPage("#backBtn").on("click", function () {
        com.switchPage(api.index.decorationIndex.url);
    });

    //删除活动
    function deleteDecorationActivity(daId) {
        var options = {
            "decorationActivity.daId": daId
        };

        com.post(api.decoration.deleteDecorationActivity, options, function (res) {
            com.focusPage("#dactivity_" + res.decorationActivity.daId).remove();
        });
    }

    //解锁
    function unlockDecorationActivity(daId) {

        var options = {
            "decorationActivity.daId": daId
        };

        com.post(api.decoration.unlockDecorationActivity, options, function (res) {
            var daId = res.decorationActivity;
            com.focusPage("#state_" + daId.daId).text("初始")
            com.focusPage("#dactivity_" + daId.daId).attr("status", "0")
        });
    }

    //锁定
    function lockDecorationActivity(daId) {

        var options = {
            "decorationActivity.daId": daId
        };

        com.post(api.decoration.lockDecorationActivity, options, function (res) {
            var daId = res.decorationActivity;
            com.focusPage("#state_" + daId.daId).text("锁定")
            com.focusPage("#dactivity_" + daId.daId).attr("status", "1")
        });
    }

    //失效活动
    function abateDecorationActivityItem(daiId, activityItemName) {

        com.showConfirm("是否确认失效" + activityItemName + "活动物品?", function () {

            var options = {
                "decorationActivityItem.daiId": daiId
            };

            com.post(api.decoration.abateDecorationActivityItem, options, function (res) {

                var daiId = res.decorationActivityItem.daiId;

                com.focusPage("#state_" + daiId).text("失效");

                com.focusPage("#convert_" + daiId).unbind();
                com.focusPage("#abate_" + daiId).unbind();

                com.focusPage("#receive_" + daiId).unbind();
            });
        });
    }

    com.post(api.ds.decoration, {}, function (res) {
        com.focusPage("#receiveTypes").bindData(res.receiveType, "key", "value", true)
    });

    //领取活动物品
    function receiveDecorationActivityItem(daiId, activityItemName) {


        com.showConfirm("是否确认领取" + activityItemName + "活动物品?", function () {

            var options = {
                "decorationActivityItem.daiId": daiId,
            };

            com.post(api.decoration.receiveDecorationActivityItem, options, function (res) {

                var daiId = res.decorationActivityItem.daiId;

                com.focusPage("#state_" + daiId).text("领取");

                com.focusPage("#convert_" + daiId).unbind();
                com.focusPage("#abate_" + daiId).unbind();

                com.focusPage("#receive_" + daiId).unbind();
            })
        });
    }

    //退货装修活动项
    function refundDecorationActivityItem(daiId, activityItemName) {

        com.showConfirm("是否确认退货" + activityItemName + "活动物品?", function () {

            var options = {
                "decorationActivityItem.daiId": daiId,
            };

            com.post(api.decoration.refundDecorationActivityItem, options, function (res) {

                var daiId = res.decorationActivityItem.daiId;
                com.focusPage("#state_" + daiId).text("退货");

                com.focusPage("#convert_" + daiId).unbind();
                com.focusPage("#abate_" + daiId).unbind();

                com.focusPage("#receive_" + daiId).unbind();
            })

        });
    }

    //配送装修活动项
    function deliveDecorationActivityItem(daiId, activityItemName) {

        com.showConfirm("是否确认配送" + activityItemName + "活动物品?", function () {

            var options = {
                "decorationActivityItem.daiId": daiId,
            };

            com.post(api.decoration.deliveDecorationActivityItem, options, function (res) {

                var daiId = res.decorationActivityItem.daiId;
                com.focusPage("#state_" + daiId).text("配送");

                com.focusPage("#convert_" + daiId).unbind();
                com.focusPage("#abate_" + daiId).unbind();

                com.focusPage("#receive_" + daiId).unbind();
            })

        });
    }

    //未退装修活动
    function unrefundDecorationActivityItem(daiId, activityItemName) {

        com.showConfirm("是否确认未退" + activityItemName + "活动物品?", function () {

            var options = {
                "decorationActivityItem.daiId": daiId,
            };

            com.post(api.decoration.unrefundDecorationActivityItem, options, function (res) {

                var daiId = res.decorationActivityItem.daiId;
                com.focusPage("#state_" + daiId).text("未退");

                com.focusPage("#convert_" + daiId).unbind();
                com.focusPage("#abate_" + daiId).unbind();

                com.focusPage("#receive_" + daiId).unbind();
            })

        });
    }

    //消耗装修活动项
    function expendDecorationActivityItem(daiId, activityItemName) {

        com.showConfirm("是否确认消耗" + activityItemName + "活动物品?", function () {

            var options = {
                "decorationActivityItem.daiId": daiId,
            };

            com.post(api.decoration.expendDecorationActivityItem, options, function (res) {

                var daiId = res.decorationActivityItem.daiId;
                com.focusPage("#state_" + daiId).text("消耗");

                com.focusPage("#convert_" + daiId).unbind();
                com.focusPage("#abate_" + daiId).unbind();

                com.focusPage("#receive_" + daiId).unbind();
            })

        });
    }
});