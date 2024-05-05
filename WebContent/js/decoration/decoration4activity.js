jQuery(function($) {

    var decorationActivityItem = {
        items: {},
        identi: {},
        activityItems: {}
    };

    var decorationActivity = {
        stateTypes: {},
        states: {},
    };

    var things = com.focusPage("#things");
    var coupons = com.focusPage("#coupons");
    var papers = com.focusPage("#papers");

    decorationActivityItem.activity = com.focusPage("#activity");

    decorationActivityItem.activityItems.activityInfo = com.focusPage("#activityInfo");
    decorationActivityItem.activityItems.couponsType = com.focusPage("#couponsType");
    decorationActivityItem.activityItems.couponsVal = com.focusPage("#couponsVal");
    decorationActivityItem.activityItems.receiveType = com.focusPage("#receiveType");
    decorationActivityItem.activityItems.thingsType = com.focusPage("#thingsType");
    decorationActivityItem.activityItems.thingsVal = com.focusPage("#thingsVal");
    decorationActivityItem.activityItems.receiveTypes = com.focusPage("#receiveTypes");
    decorationActivityItem.activityItems.papersType = com.focusPage("#papersType");
    decorationActivityItem.activityItems.papersVal = com.focusPage("#papersVal");
    decorationActivityItem.activityItems.receiveTypess = com.focusPage("#receiveTypess");
    decorationActivityItem.activityItems.comment = com.focusPage("#comment", "#commentActivityModal");

    com.focusPage("#activity").on("change", function() {

        var $this = $(this);
        var things = [];
        var coupons = [];
        var papers = [];

        var options = {
            "activity.aid": $this.val()
        };

        com.post(api.information.queryActivityItemByAid, options, function(res) {

            var activity = res.activityItems;

            for ( var i = 0; i < activity.length; i++) {

                var activityItem = activity[i];
                var item = {
                    asid: activityItem.asid,
                    activityItemName: activityItem.name + " 金额:" + activityItem.money
                };

                if (activityItem.type == 0) {
                    coupons.push(item);
                } else if (activityItem.type == 1) {
                    things.push(item);
                } else if (activityItem.type == 2) {
                    papers.push(item);
                }
            }

            com.selectTypeahead("thingsType", things, 'asid', 'activityItemName');
            com.selectTypeahead("couponsType", coupons, 'asid', 'activityItemName');
            com.selectTypeahead("papersType", papers, 'asid', 'activityItemName');
        });
    });

    com.focusPage("#thingsAdd").unbind().click(function() {

        if (com.validate("thingsInputs")) {
            return false;
        }

        decorationUtils.createCounpon("things", "thingsType", "receiveType", "thingsVal");

        com.cleanItems(decorationActivityItem.activityItems);
    });

    com.focusPage("#couponsAdd").unbind().click(function() {

        if (com.validate("couponsInputs")) {
            return false;
        }

        decorationUtils.createCounpon("coupons", "couponsType", "receiveTypes", "couponsVal");

        com.cleanItems(decorationActivityItem.activityItems);
    });

    com.focusPage("#papersAdd").unbind().click(function() {

        if (com.validate("papersInputs")) {
            return false;
        }

        decorationUtils.createCounpon("papers", "papersType", "receiveTypess", "papersVal");

        com.cleanItems(decorationActivityItem.activityItems);
    });

    decorationActivityItem.activityItems.activities = com.focusPage("#activities");
    decorationActivityItem.activityItems.itemType = com.focusPage("#itemType");
    decorationActivityItem.activityItems.itemObj = com.focusPage("#itemObj");
    decorationActivityItem.activityItems.itemNum = com.focusPage("#itemNum");
    decorationActivityItem.activityItems.receiveType1 = com.focusPage("#receiveType1");

    com.selectTypeahead(decorationActivityItem.activityItems.itemObj, [], 'aiid', 'name');

    decorationActivityItem.activityItems.activities.on("change", function() {

        var items = [];

        var activity = decorationActivityItem.activityItems.activities.val();
        var type = decorationActivityItem.activityItems.itemType.val();

        if (!activity || !type)
            return false;

        var options = {
            "activity.aid": activity
        };

        com.post(api.information.queryActivityItemByAid, options, function(res) {

            var activity = res.activityItems;

            for ( var i = 0; i < activity.length; i++) {

                var activityItem = activity[i];

                if (activityItem.type != type)
                    continue;

                items.push({
                    aiid: activityItem.aiid,
                    name: activityItem.name,
                });
            }

            com.resetTypeahead(decorationActivityItem.activityItems.itemObj, items);
        });
    });

    decorationActivityItem.activityItems.itemType.on("change", function() {

        var items = [];

        var activity = decorationActivityItem.activityItems.activities.val();
        var type = decorationActivityItem.activityItems.itemType.val();

        if (!activity || !type)
            return false;

        var options = {
            "activity.aid": activity
        };

        com.post(api.information.queryActivityItemByAid, options, function(res) {

            var activity = res.activityItems;

            for ( var i = 0; i < activity.length; i++) {

                var activityItem = activity[i];

                if (activityItem.type != type)
                    continue;

                items.push({
                    aiid: activityItem.aiid,
                    name: activityItem.name,
                });
            }

            com.resetTypeahead(decorationActivityItem.activityItems.itemObj, items);
        });
    });

    decorationActivityItem.items.orderId = com.focusPage("#orderId");
    decorationActivityItem.items.decorationActivitys = com.focusPage("#decorationActivitys");
    decorationActivityItem.items.decorationActivityItems = com.focusPage("#decorationActivityItems");
    decorationActivityItem.items.activityItems = com.focusPage("#activityItems");
    decorationActivityItem.activity.couponInfo = com.focusPage("#couponInfo");
    decorationActivityItem.activity.activity = com.focusPage("#activity");

    decorationActivityItem.activity.name = com.focusPage("#activityItemName");
    decorationActivityItem.activity.num = com.focusPage("#activityItemNum");
    decorationActivityItem.activity.money = com.focusPage("#activityItemMoney");

    decorationActivityItem.joinDecorationActivityModal = com.focusPage("#joinDecorationActivityModal");
    decorationActivityItem.applyDecorationActivityItemModal = com.focusPage("#applyDecorationActivityItemModal");
    decorationActivityItem.addDecorationActivityItemModal = com.focusPage("#addDecorationActivityItemModal");
    decorationActivityItem.commentActivityModal = com.focusPage("#commentActivityModal");
    decorationActivityItem.QRcodeModal = com.focusPage("#QRcodeModal");

    decorationActivityItem.joinDecorationActivityModal.on('hide.bs.modal', function(e) {

        com.cleanItems(decorationActivityItem.activityItems);
        com.closeTip();
    });

    decorationActivityItem.applyDecorationActivityItemModal.on('hide.bs.modal', function(e) {

        com.cleanItems(decorationActivityItem.activityItems);
        com.closeTip();
    });

    initDraw(params.decoration.orderId);

    // 初始化
    function initDraw(orderId) {

        decorationUtils.decorationActivityItemInfo(orderId, decorationActivityItem.items.activityItems, decorationActivityItem.items.decorationActivityItems, decorationActivity, {
            "uiBtnMethod": uiBtnMethod,
            "content": params.decoration.decorationActivityContent,
            "btnSend": params.decoration.decorationActivityBtnSend
        });
        decorationUtils.decorationActivityInfo(orderId, decorationActivityItem.items.decorationActivitys, {
            "activityBtnMethod": activityBtnMethod,
            "content": params.decoration.decorationActivityContent
        });
    }

    function uiBtnMethod(uiPgDiv, activityItem) {

        var abateBtn = $("<a></a>").addClass("btn btn-minier btn-yellow").html("失效").css("margin", "0px 3px").attr("id", "abate_" + activityItem.daiId);
        var receiveBtn = $("<a></a>").addClass("btn btn-minier btn-success").html("领取").css("margin", "0px 3px").attr("id", "receive_" + activityItem.daiId);
        var refundBtn = $("<a></a>").addClass("btn btn-minier btn-warning").html("退货").css("margin", "0px 3px").attr("id", "refund_" + activityItem.daiId);
        var deliveryBtn = $("<a></a>").addClass("btn btn-minier btn-inverse").html("配送").css("margin", "0px 3px").attr("id", "delivery_" + activityItem.daiId);
        var unrefundBtn = $("<a></a>").addClass("btn btn-minier btn-danger").html("未退").css("margin", "0px 3px").attr("id", "unrefund_" + activityItem.daiId);
        var expendBtn = $("<a></a>").addClass("btn btn-minier btn-pink ").html("补款").css("margin", "0px 3px").attr("id", "expend_" + activityItem.daiId);
        var discountBtn = $("<a></a>").addClass("btn btn-minier btn-purple ").html("抵现").css("margin", "0px 3px").attr("id", "discount_" + activityItem.daiId);
        var purchaseBtn = $("<a></a>").addClass("btn btn-minier btn-yellow ").html("采购").css("margin", "0px 3px").attr("id", "purchase_" + activityItem.daiId);

        abateBtn.on("click", function() {

            identiData(1, activityItem.daiId);
            decorationActivityItem.commentActivityModal.modal("show");
        });

        receiveBtn.on("click", function() {

            identiData(2, activityItem.daiId);
            decorationActivityItem.commentActivityModal.modal("show");
        });

        refundBtn.on("click", function() {

            identiData(3, activityItem.daiId);
            decorationActivityItem.commentActivityModal.modal("show");
        });
        deliveryBtn.on("click", function() {

            identiData(4, activityItem.daiId);
            decorationActivityItem.commentActivityModal.modal("show");
        });
        unrefundBtn.on("click", function() {

            unrefundDecorationActivityItem(activityItem.daiId, activityItem.activityItemName);
        });
        expendBtn.on("click", function() {

            identiData(7, activityItem.daiId);
            decorationActivityItem.commentActivityModal.modal("show");
        });
        discountBtn.on("click", function() {

            identiData(8, activityItem.daiId);
            decorationActivityItem.commentActivityModal.modal("show");
        });
        purchaseBtn.on("click", function() {

            purchaseDecorationActivityItem(activityItem.asid, activityItem.num, activityItem.activityItemName);
        });

        if (activityItem.state == 0) {
            uiPgDiv.append(abateBtn).append(receiveBtn).append(deliveryBtn).append(discountBtn);
        }

        if (activityItem.state == 2) {
            uiPgDiv.append(unrefundBtn);
        }

        if ([2, 4, 5].contains(activityItem.state)) {
            uiPgDiv.append(refundBtn);
        }

        if ([2, 4, 8].contains(activityItem.state)) {
            uiPgDiv.append(expendBtn);
        }

        uiPgDiv.append(purchaseBtn);
    }

    function identiData(type, aid) {

        decorationActivityItem.identi.type = type;
        decorationActivityItem.identi.aid = aid;
    }

    com.focusPage("#commentActivityBtn").on("click", function() {

        var identi = decorationActivityItem.identi;

        if (identi.type == 1) {
            abateDecorationActivityItem(identi.aid);
        } else if (identi.type == 2) {
            receiveDecorationActivityItem(identi.aid);
        } else if (identi.type == 3) {
            refundDecorationActivityItem(identi.aid);
        } else if (identi.type == 4) {
            deliveDecorationActivityItem(identi.aid);
        } else if (identi.type == 7) {
            expendDecorationActivityItem(identi.aid);
        } else if (identi.type == 8) {
            discountDecorationActivityItem(identi.aid);
        }
        com.cleanItems(decorationActivityItem.activityItems);
        decorationActivityItem.commentActivityModal.modal("hide");
    });

    // 参加活动
    com.focusPage("#joinActivityBtn").on("click", function() {

        com.post(api.information.queryActivityForValid, {
            "activity.type": 1
        }, function(res) {

            var activitys = res.activitys;

            var activityData = [{
                aid: -1,
                activityName: ""
            }];

            for ( var i = 0; i < activitys.length; i++) {
                var activity = activitys[i];

                activityData.push({
                    aid: activity.aid,
                    activityName: activity.name,
                    money: activityData.money
                });
            }
            decorationActivityItem.activityItems.activityInfo.bindData(activityData, "aid", "activityName", "money", false);
        });

        decorationActivityItem.joinDecorationActivityModal.modal("show");
    });

    // 申领活动物品
    com.focusPage("#applyActivityItemBtn").on("click", function() {

        com.focusPage("#things").html("");
        com.focusPage("#coupons").html("");

        var options = {
            "decorationActivity.orderId": params.decoration.orderId
        };

        com.post(api.decoration.queryDecorationActivityByOrderId, options, function(res) {

            var decorationActivitys = res.decorationActivitys;

            var decorationActivityData = [{
                aid: -1,
                activityName: ""
            }];

            for ( var i = 0; i < decorationActivitys.length; i++) {
                var decorationActivity = decorationActivitys[i];

                if (decorationActivity.status == 1) {
                    continue;
                }

                decorationActivityData.push({
                    aid: decorationActivity.activity.aid,
                    activityName: decorationActivity.activity.name,
                    money: decorationActivity.activity.money
                });
            }

            decorationActivityItem.activity.bindData(decorationActivityData, "aid", "activityName", false);
        }, null, false);

        approvalUtils.initqueryApprovalUser("approveActivityItemManSel", 8);

        decorationActivityItem.applyDecorationActivityItemModal.modal("show");
    });

    // 添加活动物品
    com.focusPage("#addActivityItemBtn").on("click", function() {

        com.clearValidator();
        com.cleanTypeahead('itemObj');
        com.cleanTypeahead('itemNum');

        if (com.validate("addDecorationActivityItemModal"))
            return false;

        var options = {
            "decorationActivity.orderId": params.decoration.orderId
        };

        com.post(api.decoration.queryDecorationActivityByOrderId, options, function(res) {

            var decorationActivitys = res.decorationActivitys;

            var decorationActivityData = [{
                aid: -1,
                name: ""
            }];

            for ( var i = 0; i < decorationActivitys.length; i++) {
                var decorationActivity = decorationActivitys[i];

                if (decorationActivity.status == 1) {
                    continue;
                }

                decorationActivityData.push({
                    aid: decorationActivity.activity.aid,
                    name: decorationActivity.activity.name,
                    money: decorationActivity.activity.money
                });
            }

            decorationActivityItem.activityItems.activities.bindData(decorationActivityData, "aid", "name", false);
        }, null, false);

        decorationActivityItem.addDecorationActivityItemModal.modal("show");
    });

    // 保存参加活动
    com.focusPage("#submitDecorationActivityBtn").on("click", function() {

        if (com.validate("joinDecorationActivityModal")) {
            return;
        }
        var options = {
            "decorationActivity.orderId": params.decoration.orderId,
            "decorationActivity.activity.aid": decorationActivityItem.activityItems.activityInfo.val()
        };
        com.post(api.decoration.addDecorationActivity, options, function(res) {

            var decorationActivity = res.decorationActivity;
            decorationUtils.addDecorationActivityForDiv(decorationActivityItem.items.decorationActivitys, decorationActivity, activityBtnMethod);
        });
        decorationActivityItem.joinDecorationActivityModal.modal("hide");
    });

    // 保存-申领活动物品
    com.focusPage("#submitDecorationActivityItemBtn").on("click", function() {

        var receiverId = com.focusPage("#approveActivityItemManSel").find('input:checked').attr('userid');

        if (receiverId == null || receiverId == "") {
            com.showAlert(com.error, "请选择审批人!");
            return;
        }

        if (things.html() == "" && coupons.html() == "" && papers.html() == "") {
            com.showAlert(com.error, "活动物品或券需要选择才能提交");
            return;
        }

        var submitFlag = true;

        var orderId = params.decoration.orderId;
        var activityName = decorationActivityItem.activity.activity.find("option:selected").text();
        var activityId = com.focusPage("#activity").val();

        var index = 0;
        var options = {
            "approval.receiver.userId": receiverId,
            "approval.comment": "",
            "approvalDecorationActivity.activityId": activityId,
            "approvalDecorationActivity.orderId": orderId,
            "approvalDecorationActivity.activityName": activityName
        };

        com.focusPage("#things li").each(function(i, e) {

            var _ = $(e);

            options["approvalDecorationActivityItems[" + index + "].orderId"] = orderId;
            options["approvalDecorationActivityItems[" + index + "].activityName"] = activityName;
            options["approvalDecorationActivityItems[" + index + "].activityItemName"] = _.children('span').attr("typename").split(" ")[0];
            options["approvalDecorationActivityItems[" + index + "].type"] = 1;
            options["approvalDecorationActivityItems[" + index + "].num"] = _.children('span').attr('num');
            options["approvalDecorationActivityItems[" + index + "].money"] = _.children('span').attr("typename").split(" ")[1].split(':')[1];
            options["approvalDecorationActivityItems[" + index + "].content"] = "";
            options["approvalDecorationActivityItems[" + index + "].stateType"] = _.children('span').attr('value');
            options["approvalDecorationActivityItems[" + index + "].asid"] = _.children('span').attr("asid");
            index++;
        });

        com.focusPage("#coupons li").each(function(i, e) {

            var _ = $(e);

            options["approvalDecorationActivityItems[" + index + "].orderId"] = orderId;
            options["approvalDecorationActivityItems[" + index + "].activityName"] = activityName;
            options["approvalDecorationActivityItems[" + index + "].activityItemName"] = _.children('span').attr("typename").split(" ")[0];
            options["approvalDecorationActivityItems[" + index + "].type"] = 0;
            options["approvalDecorationActivityItems[" + index + "].num"] = _.children('span').attr('num');
            options["approvalDecorationActivityItems[" + index + "].money"] = _.children('span').attr("typename").split(" ")[1].split(':')[1];
            options["approvalDecorationActivityItems[" + index + "].content"] = "";
            options["approvalDecorationActivityItems[" + index + "].stateType"] = _.children('span').attr('value');
            options["approvalDecorationActivityItems[" + index + "].asid"] = _.children('span').attr("asid");

            index++;
        });

        com.focusPage("#papers li").each(function(i, e) {

            var _ = $(e);

            options["approvalDecorationActivityItems[" + index + "].orderId"] = orderId;
            options["approvalDecorationActivityItems[" + index + "].activityName"] = activityName;
            options["approvalDecorationActivityItems[" + index + "].activityItemName"] = _.children('span').attr("typename").split(" ")[0];
            options["approvalDecorationActivityItems[" + index + "].type"] = 2;
            options["approvalDecorationActivityItems[" + index + "].num"] = _.children('span').attr('num');
            options["approvalDecorationActivityItems[" + index + "].money"] = _.children('span').attr("typename").split(" ")[1].split(':')[1];
            options["approvalDecorationActivityItems[" + index + "].content"] = "";
            options["approvalDecorationActivityItems[" + index + "].stateType"] = _.children('span').attr('value');
            options["approvalDecorationActivityItems[" + index + "].asid"] = _.children('span').attr("asid");

            index++;
        });

        if (!submitFlag) {
            return false;
        }

        com.post(api.approval.submitApprovalForDecorationActivity, options, function(res) {

            com.showAlert(com.info, "提交成功");
        });

        decorationActivityItem.applyDecorationActivityItemModal.modal("hide");
    });

    com.focusPage("#addDecorationActivityItemBtn").on("click", function() {

        var orderId = params.decoration.orderId;
        var activityName = decorationActivityItem.activityItems.activities.find("option:selected").text();
        var activityId = decorationActivityItem.activityItems.activities.val();
        var itemName = decorationActivityItem.activityItems.itemObj.val();
        var activityItem = {};

        com.post(api.information.queryActivityItemByAiid, {
            "activityItem.aiid": com.typeahead(decorationActivityItem.activityItems.itemObj)
        }, function(res) {

            activityItem = res.activityItem;
        }, null, false);

        var options = {
            "decorationActivityItem.orderId": orderId,
            "decorationActivityItem.aid": activityId,
            "decorationActivityItem.activityName": activityName,

            "decorationActivityItem.activityItemName": activityItem.name,
            "decorationActivityItem.type": decorationActivityItem.activityItems.itemType.val(),
            "decorationActivityItem.num": decorationActivityItem.activityItems.itemNum.val(),
            "decorationActivityItem.money": activityItem.money,
            "decorationActivityItem.stateType": decorationActivityItem.activityItems.receiveType1.val(),
            "decorationActivityItem.asid": activityItem.asid,
            "decorationActivityItem.content": "",
        };

        com.post(api.decoration.addDecorationActivityItem, options, function(res) {

            com.showAlert(com.info, "提交成功");

            res.decorationActivityItem.num = decorationActivityItem.activityItems.itemNum.val();
            res.decorationActivityItem.money = activityItem.money;

            decorationUtils.addActivityItemForDiv(decorationActivityItem.items.decorationActivityItems, res.decorationActivityItem, uiBtnMethod, decorationActivity, params.decoration.decorationActivityContent);

            decorationActivityItem.addDecorationActivityItemModal.modal("hide");
        }, null, false);
    });

    function activityBtnMethod(uiPgDiv, decorationActivity) {

        var deleteBtn = $("<a></a>").addClass("btn btn-minier btn-yellow").html("删除").css("margin", "0px 3px").attr("id", "delete_" + decorationActivity.daId).appendTo(uiPgDiv);
        var unlockBtn = $("<a></a>").addClass("btn btn-minier btn-success").html("解锁").css("margin", "0px 3px").attr("id", "unlock_" + decorationActivity.daId).appendTo(uiPgDiv);
        var lockBtn = $("<a></a>").addClass("btn btn-minier btn-warning").html("锁定").css("margin", "0px 3px").attr("id", "lock_" + decorationActivity.daId).appendTo(uiPgDiv);

        deleteBtn.on("click", function() {

            if (com.focusPage("#dactivity_" + decorationActivity.daId).attr("status") == 0) {
                deleteDecorationActivity(decorationActivity.daId);
            }
        });

        unlockBtn.on("click", function() {

            unlockDecorationActivity(decorationActivity.daId);
        });
        lockBtn.on("click", function() {

            lockDecorationActivity(decorationActivity.daId);
        });

    }

    // 删除活动
    function deleteDecorationActivity(daId) {

        var options = {
            "decorationActivity.daId": daId
        };

        com.post(api.decoration.deleteDecorationActivity, options, function(res) {

            com.focusPage("#dactivity_" + res.decorationActivity.daId).remove();
        });
    }

    // 解锁
    function unlockDecorationActivity(daId) {

        var options = {
            "decorationActivity.daId": daId
        };

        com.post(api.decoration.unlockDecorationActivity, options, function(res) {

            var decorationActivity = res.decorationActivity;
            com.showAlert(com.info, "解锁成功");
            com.focusPage("#state_" + decorationActivity.daId).text("初始");
            com.focusPage("#dactivity_" + decorationActivity.daId).attr("status", "0");
        });
    }

    // 锁定
    function lockDecorationActivity(daId) {

        var options = {
            "decorationActivity.daId": daId
        };

        com.post(api.decoration.lockDecorationActivity, options, function(res) {

            var decorationActivity = res.decorationActivity;
            com.showAlert(com.info, "锁定成功");
            com.focusPage("#state_" + decorationActivity.daId).text("锁定");
            com.focusPage("#dactivity_" + decorationActivity.daId).attr("status", "1");
        });
    }

    // 失效活动
    function abateDecorationActivityItem(daiId) {

        var options = {
            "decorationActivityItem.daiId": daiId,
            "decorationActivityItem.content": decorationActivityItem.activityItems.comment.val()
        };

        com.post(api.decoration.abateDecorationActivityItem, options, function(res) {

            com.showAlert(com.info, "物品失效成功");

            decorationUtils.countTatol(daiId);

            com.focusPage("#pricing_" + res.decorationActivityItem.daiId).remove();
        });

    }
    com.focusPage("#receiveType").bindData(constant.decoration().decorationActivityItem.stateType.datas, "key", "value", false);
    com.focusPage("#receiveTypes").bindData(constant.decoration().decorationActivityItem.stateType.datas, "key", "value", false);
    com.focusPage("#receiveTypess").bindData(constant.decoration().decorationActivityItem.stateType.datas, "key", "value", false);
    com.focusPage("#receiveType1").bindData(constant.decoration().decorationActivityItem.stateType.datas, "key", "value", false);

    decorationActivity.stateTypes = constant.decoration().decorationActivityItem.stateType.keys;
    decorationActivity.states = constant.decoration().decorationActivityItem.status.keys;
    decorationActivity.isStatus = constant.decoration().decorationActivityItem.isStatus.keys;
    decorationActivity.isAffirms = constant.decoration().decorationActivityItem.isAffirm.keys;

    decorationActivity.types = constant.information().awardStock.type.keys;

    // 领取活动物品
    function receiveDecorationActivityItem(daiId) {

        var options = {
            "decorationActivityItem.daiId": daiId,
            "decorationActivityItem.content": decorationActivityItem.activityItems.comment.val(),
        };

        com.post(api.decoration.receiveDecorationActivityItem, options, function(res) {

            com.showAlert(com.info, "物品领取成功");

            com.focusPage("#state_" + res.decorationActivityItem.daiId).text("领取");
            com.focusPage("#content_" + res.decorationActivityItem.daiId).text(res.decorationActivityItem.content);
        });
    }

    // 退货装修活动项
    function refundDecorationActivityItem(daiId) {

        var options = {
            "decorationActivityItem.daiId": daiId,
            "decorationActivityItem.comment": decorationActivityItem.activityItems.comment.val(),
        };

        com.post(api.decoration.refundDecorationActivityItem, options, function(res) {

            com.showAlert(com.info, "物品退货成功");
            var daiId = res.decorationActivityItem.daiId;

            decorationUtils.countTatol(daiId);

            com.focusPage("#state_" + daiId).text("退货");
            com.focusPage("#comment_" + res.decorationActivityItem.daiId).text(res.decorationActivityItem.comment);
        });
    }

    // 配送装修活动项
    function deliveDecorationActivityItem(daiId) {

        var options = {
            "decorationActivityItem.daiId": daiId,
            "decorationActivityItem.content": decorationActivityItem.activityItems.comment.val(),
        };

        com.post(api.decoration.deliveDecorationActivityItem, options, function(res) {

            com.showAlert(com.info, "物品配送成功");

            com.focusPage("#state_" + res.decorationActivityItem.daiId).text("配送");
            com.focusPage("#content_" + res.decorationActivityItem.daiId).text(res.decorationActivityItem.content);
        });
    }

    // 未退装修活动
    function unrefundDecorationActivityItem(daiId, activityItemName) {

        com.showConfirm("是否确认未退" + activityItemName + "活动物品?", function() {

            var options = {
                "decorationActivityItem.daiId": daiId,
            };

            com.post(api.decoration.unrefundDecorationActivityItem, options, function(res) {

                com.showAlert(com.info, "物品未退成功");

                var daiId = res.decorationActivityItem.daiId;
                com.focusPage("#state_" + daiId).text("未退");
            });
        });
    }

    // 消耗装修活动项
    function expendDecorationActivityItem(daiId) {

        var options = {
            "decorationActivityItem.daiId": daiId,
            "decorationActivityItem.comment": decorationActivityItem.activityItems.comment.val(),
        };

        com.post(api.decoration.expendDecorationActivityItem, options, function(res) {

            com.showAlert(com.info, "物品补款成功");
            var daiId = res.decorationActivityItem.daiId;

            com.focusPage("#state_" + daiId).text("补款");
            com.focusPage("#comment_" + res.decorationActivityItem.daiId).text(res.decorationActivityItem.comment);
        });

    }

    // 抵现装修活动项
    function discountDecorationActivityItem(daiId) {

        var options = {
            "decorationActivityItem.daiId": daiId,
            "decorationActivityItem.content": decorationActivityItem.activityItems.comment.val(),
        };

        com.post(api.decoration.discountDecorationActivityItem, options, function(res) {

            com.showAlert(com.info, "物品抵现成功");
            var daiId = res.decorationActivityItem.daiId;

            decorationUtils.countTatol(daiId);

            com.focusPage("#state_" + daiId).text("抵现");
            com.focusPage("#content_" + res.decorationActivityItem.daiId).text(res.decorationActivityItem.content);
        });

    }

    // 采购装修活动项
    function purchaseDecorationActivityItem(asid, num, activityItemName) {

        com.showConfirm("是否确认采购" + activityItemName + "活动物品?", function() {

            var options = {
                "awardPurchase.awardStock.asId": asid,
                "awardPurchase.num": num,
            };

            com.post(api.information.addAwardPurchase, options, function(res) {

                com.showAlert(com.info, "物品提交采购成功");
            });
        });
    }

    // 发送按钮
    com.focusPage("#btnNotice").on("click", function() {

        var $inputs = com.focusPage('input[name="daiIds"]:checked');

        if ($inputs.length == 0) {
            com.showAlert(com.warning, "无选中奖品");
            return false;
        }

        var daiids = "";

        $.each($inputs, function(i, v) {

            daiids += $(v).val() + ",";
        });

        var options = {
            "decorationActivityItem.orderId": params.decoration.orderId,
            "decorationActivityItem.content": daiids
        };

        com.showConfirm("是否发送查看通知", function() {

            com.post(api.decoration.sendDecorationActivityItem, options, function(res) {

                com.showAlert(com.info, "操作成功");
            });

        });

    });
    // 二维码按钮
    com.focusPage("#btnNoticeQRCode").on("click", function() {

        com.focusPage('#QRcode').html("");

        var $inputs = com.focusPage('input[name="daiIds"]:checked');

        if ($inputs.length == 0) {
            com.showAlert(com.info, "无选中奖品");
            return false;
        }

        var daiids = "";

        $.each($inputs, function(i, v) {

            daiids += $(v).val() + ",";
        });

        com.focusPage('#QRcode').qrcode({
            render: "canvas",
            width: 150,
            height: 150,
            text: " http://fanglin.vip/wx/activityItem?orderId=" + params.decoration.orderId + "&daiIds=" + daiids

        });

        decorationActivityItem.QRcodeModal.modal('show');

    });
});