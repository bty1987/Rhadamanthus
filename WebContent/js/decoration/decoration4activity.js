jQuery(function ($) {

    var decorationActivityItem = {
        items: {},
        identi: {},
        activityItems: {}
    };
    
    var decorationActivity = {
        stateTypes: {},
        states: {},
    };
    
    var ActivityOrderId = params.decorationOrderId;
    var things = com.focusPage("#things");
    var coupons = com.focusPage("#coupons");
    decorationActivityItem.activity = com.focusPage("#activity");
    
    decorationActivityItem.activityItems.activityInfo = com.focusPage("#activityInfo");
    decorationActivityItem.activityItems.couponsType = com.focusPage("#couponsType");
    decorationActivityItem.activityItems.couponsVal = com.focusPage("#couponsVal");
    decorationActivityItem.activityItems.thingsType = com.focusPage("#thingsType");
    decorationActivityItem.activityItems.thingsVal = com.focusPage("#thingsVal");
    decorationActivityItem.activityItems.receiveType = com.focusPage("#receiveType");
    decorationActivityItem.activityItems.receiveTypes = com.focusPage("#receiveTypes");
    decorationActivityItem.activityItems.comment = com.focusPage("#comment");
    

    com.focusPage("#activity").on("change", function () {

        var $this = $(this);
        var things = [];
        var coupons = [];

        var options = {
            "activity.aid": $this.val()
        };

        com.post(api.information.queryActivityItemByAid, options, function (res) {

            var activity = res.activityItems;

            for (var i = 0; i < activity.length; i++) {

                var activityItem = activity[i];

                if (activityItem.type == 0) {
                    coupons.push({
                        asid: activityItem.asid,
                        activityItemName: activityItem.name + " 金额:" + activityItem.money
                    });
                } else if (activityItem.type == 1) {
                    things.push({
                        asid: activityItem.asid,
                        activityItemName: activityItem.name + " 金额:" + activityItem.money
                    });
                }
        }

            com.selectTypeahead("thingsType", things, 'asid', 'activityItemName');

            com.focusPage("#thingsAdd").unbind().click(function(){
                if(com.validate("thingsInputs")){
                    return;
                }

                decorationUtils.createCounpon("things", "thingsType", "receiveType", "thingsVal");

                com.cleanItems(decorationActivityItem.activityItems);
            });

            com.selectTypeahead("couponsType", coupons, 'asid', 'activityItemName');

            com.focusPage("#couponsAdd").unbind().click(function(){
                if(com.validate("couponsInputs")){
                    return;
                }

                decorationUtils.createCounpon("coupons", "couponsType", "receiveTypes", "couponsVal");

                com.cleanItems(decorationActivityItem.activityItems);
            });

        });
    });
    
    decorationActivityItem.items.orderId = com.focusPage("#orderId");
    decorationActivityItem.items.decorationActivityItems = com.focusPage("#decorationActivityItems");
    decorationActivityItem.items.decorationActivityItems1 = com.focusPage("#decorationActivityItems1");
    decorationActivityItem.items.activityItems = com.focusPage("#activityItems");
    decorationActivityItem.activity.couponInfo = com.focusPage("#couponInfo");
    decorationActivityItem.activity.activity = com.focusPage("#activity");

    decorationActivityItem.activity.name = com.focusPage("#activityItemName");
    decorationActivityItem.activity.num = com.focusPage("#activityItemNum");
    decorationActivityItem.activity.money = com.focusPage("#activityItemMoney");

    decorationActivityItem.joinDecorationActivityModal = com.focusPage("#joinDecorationActivityModal");
    decorationActivityItem.applyDecorationActivityItemModal = com.focusPage("#applyDecorationActivityItemModal");
    decorationActivityItem.commentActivityModal = com.focusPage("#commentActivityModal");
    
    
    decorationActivityItem.joinDecorationActivityModal.on('hide.bs.modal', function (e) {
    	com.cleanItems(decorationActivityItem.activityItems);
    	com.closeTip();
    });
    
    decorationActivityItem.applyDecorationActivityItemModal.on('hide.bs.modal', function (e) {
    	com.cleanItems(decorationActivityItem.activityItems);
    	com.closeTip();
    });

    initDraw(ActivityOrderId);

    //初始化
    function initDraw(orderId) {

        decorationUtils.decorationActivityItemInfo(decorationActivityItem.items.activityItems, decorationActivityItem.items.decorationActivityItems1, uiBtnMethod, orderId, decorationActivity);
        decorationUtils.decorationActivityInfo(decorationActivityItem.items.decorationActivityItems, activityBtnMethod, orderId);
    }

    function uiBtnMethod(uiPgDiv, activityItem) {

        var btnViewBtn= $("<a></a>").addClass("btn btn-minier btn-yellow").html("失效").css("margin", "0px 3px").attr("id", "abate_" + activityItem.daiId).appendTo(uiPgDiv);
        var receiveBtn= $("<a></a>").addClass("btn btn-minier btn-success").html("领取").css("margin", "0px 3px").attr("id", "receive_" + activityItem.daiId).appendTo(uiPgDiv);
        var refundBtn= $("<a></a>").addClass("btn btn-minier btn-warning").html("退货").css("margin", "0px 3px").attr("id", "refund_" + activityItem.daiId).appendTo(uiPgDiv);
        var deliveryBtn= $("<a></a>").addClass("btn btn-minier btn-inverse").html("配送").css("margin", "0px 3px").attr("id", "delivery_" + activityItem.daiId).appendTo(uiPgDiv);
        var unrefundBtn= $("<a></a>").addClass("btn btn-minier btn-danger").html("未退").css("margin", "0px 3px").attr("id", "unrefund_" + activityItem.daiId).appendTo(uiPgDiv);
        var expendBtn= $("<a></a>").addClass("btn btn-minier btn-purple ").html("补款").css("margin", "0px 3px").attr("id", "expend_" + activityItem.daiId).appendTo(uiPgDiv);

        btnViewBtn.on("click", function () {
            abateDecorationActivityItem(activityItem.daiId, activityItem.activityItemName);
        });

        receiveBtn.on("click", function () {
        	identiData(1, activityItem.daiId);
        	decorationActivityItem.commentActivityModal.modal("show");
        });
        
        refundBtn.on("click", function () {
        	identiData(2, activityItem.daiId);
        	decorationActivityItem.commentActivityModal.modal("show");
        });
        deliveryBtn.on("click", function () {
        	identiData(3, activityItem.daiId);
        	decorationActivityItem.commentActivityModal.modal("show");
        });
        unrefundBtn.on("click", function () {
            unrefundDecorationActivityItem(activityItem.daiId, activityItem.activityItemName);
        });
        expendBtn.on("click", function () {
            expendDecorationActivityItem(activityItem.daiId, activityItem.activityItemName);
        });
    }
    
    function identiData(type, aid){
    	decorationActivityItem.identi.type = type;
    	decorationActivityItem.identi.aid = aid;
    }
    
    com.focusPage("#commentActivityBtn").on("click", function() {
    	
    	var identi = decorationActivityItem.identi;
    	
    	if(identi.type == 1){
    		receiveDecorationActivityItem(identi.aid);
    	}else if(identi.type == 2){
    		refundDecorationActivityItem(identi.aid);
    	}else if(identi.type == 3){
    		deliveDecorationActivityItem(identi.aid);
    	}
    	com.cleanItems(decorationActivityItem.activityItems);
    	decorationActivityItem.commentActivityModal.modal("hide");
	});

    //参加活动
    com.focusPage("#joinActivityBtn").on("click", function () {

        com.post(api.information.queryActivityForValid, {"activity.type": 1}, function (res) {
            var activitys = res.activitys;

            var activityData = [{aid: -1, activityName: ""}];

            for (var i = 0; i < activitys.length; i++) {
                var activity = activitys[i];

                activityData.push({aid: activity.aid, activityName: activity.name, money: activityData.money});
            }
            decorationActivityItem.activityItems.activityInfo.bindData(activityData, "aid", "activityName", "money", false);
        });

        decorationActivityItem.joinDecorationActivityModal.modal("show");
    });

    //申领活动物品
    com.focusPage("#applyActivityItemBtn").on("click", function () {

        com.focusPage("#things").html("");
        com.focusPage("#coupons").html("");

        var options = {
            "decorationActivity.orderId": ActivityOrderId
        };

        com.post(api.decoration.queryDecorationActivityByOrderId, options, function (res) {

            var decorationActivitys = res.decorationActivitys;

            var decorationActivityData = [{aid: -1, activityName: ""}];

            for (var i = 0; i < decorationActivitys.length; i++) {
                var decorationActivity = decorationActivitys[i];

                if(decorationActivity.status == 1){
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

    //保存参加活动
    com.focusPage("#submitDecorationActivityBtn").on("click", function () {

        if (com.validate("joinDecorationActivityModal")) {
            return;
        }
        var options = {
            "decorationActivity.orderId": ActivityOrderId,
            "decorationActivity.activity.aid": decorationActivityItem.activityItems.activityInfo.val()
        };
        com.post(api.decoration.addDecorationActivity, options, function (res) {
            var decorationActivity = res.decorationActivity;
            decorationUtils.addDecorationActivityForDiv(decorationActivityItem.items.decorationActivityItems, decorationActivity, activityBtnMethod);
        });
        decorationActivityItem.joinDecorationActivityModal.modal("hide");
    });

    //保存-申领活动物品
    com.focusPage("#submitDecorationActivityItemBtn").on("click", function () {

        var receiverId = com.focusPage("#approveActivityItemManSel").find('input:checked').attr('userid');

        if (receiverId == null || receiverId == "") {
            com.showAlert(com.error, "请选择审批人!");
            return;
        }

        if (things.html() == "" && coupons.html() == "") {
            com.showAlert(com.error, "活动物品或券需要选择才能提交");
            return;
        }

        var submitFlag = true;

        var orderId = ActivityOrderId;
        var activityName = decorationActivityItem.activity.activity.find("option:selected").text();
        var activityId = com.focusPage("#activity").val();

        var index = 0;
        var options = {
            "approval.receiver.userId": receiverId,
            "approval.comment": "",
            "approvalDecorationActivity.activityId":activityId,
            "approvalDecorationActivity.orderId": orderId,
            "approvalDecorationActivity.activityName": activityName
        };

        com.focusPage("#things li").each(function (i, e) {

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

        com.focusPage("#coupons li").each(function (i, e) {
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
        });

    }

    //返回
    com.focusPage("#backBtn").on("click", function () {
        //com.switchPage(api.index.decorationIndex.url);
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
            var decorationActivity = res.decorationActivity;
            com.showAlert(com.info, "解锁成功");
            com.focusPage("#state_" + decorationActivity.daId).text("初始");
            com.focusPage("#dactivity_" + decorationActivity.daId).attr("status", "0");
        });
    }

    //锁定
    function lockDecorationActivity(daId) {

        var options = {
            "decorationActivity.daId": daId
        };

        com.post(api.decoration.lockDecorationActivity, options, function (res) {
            var decorationActivity = res.decorationActivity;
            com.showAlert(com.info, "锁定成功");
            com.focusPage("#state_" + decorationActivity.daId).text("锁定");
            com.focusPage("#dactivity_" + decorationActivity.daId).attr("status", "1");
        });
    }

    //失效活动
    function abateDecorationActivityItem(daiId, activityItemName) {

        com.showConfirm("是否确认失效" + activityItemName + "活动物品?", function () {

            var options = {
                "decorationActivityItem.daiId": daiId
            };

            com.post(api.decoration.abateDecorationActivityItem, options, function (res) {

            	com.showAlert(com.info, "物品失效成功");

                decorationUtils.countTatol(daiId);

                com.focusPage("#pricing_"+res.decorationActivityItem.daiId).remove();
            });
        });
    }

    com.post(api.ds.decoration, {}, function (res) {
        com.focusPage("#receiveType").bindData(res.receiveType, "key", "value", false);
        com.focusPage("#receiveTypes").bindData(res.receiveType, "key", "value", false);
        
        decorationActivity.stateTypes = res.receiveType.split("key", "value");
        decorationActivity.states = res.activityItemType.split("key", "value");
    }, null, false);
    
    com.post(api.ds.information, {}, function (res) {
        decorationActivity.types = res.activityItemType.split("key", "value");
    }, null, false);

    //领取活动物品
    function receiveDecorationActivityItem(daiId) {
    	
        var options = {
            "decorationActivityItem.daiId": daiId,
            "decorationActivityItem.content": decorationActivityItem.activityItems.comment.val(),
        };

        com.post(api.decoration.receiveDecorationActivityItem, options, function (res) {

        	com.showAlert(com.info, "物品领取成功");
        	
            com.focusPage("#state_" + res.decorationActivityItem.daiId).text("领取");
        });
    }

    //退货装修活动项
    function refundDecorationActivityItem(daiId) {

        var options = {
            "decorationActivityItem.daiId": daiId,
            "decorationActivityItem.content": decorationActivityItem.activityItems.comment.val(),
        };

        com.post(api.decoration.refundDecorationActivityItem, options, function (res) {
        	
        	com.showAlert(com.info, "物品退货成功");
            var daiId = res.decorationActivityItem.daiId;

            decorationUtils.countTatol(daiId);

            com.focusPage("#state_" + daiId).text("退货");
        });
    }

    //配送装修活动项
    function deliveDecorationActivityItem(daiId) {

        var options = {
            "decorationActivityItem.daiId": daiId,
            "decorationActivityItem.content": decorationActivityItem.activityItems.comment.val(),
        };

        com.post(api.decoration.deliveDecorationActivityItem, options, function (res) {

        	com.showAlert(com.info, "物品配送成功");
        	
            com.focusPage("#state_" + res.decorationActivityItem.daiId).text("配送");
        });
    }

    //未退装修活动
    function unrefundDecorationActivityItem(daiId, activityItemName) {

        com.showConfirm("是否确认未退" + activityItemName + "活动物品?", function () {

            var options = {
                "decorationActivityItem.daiId": daiId,
            };

            com.post(api.decoration.unrefundDecorationActivityItem, options, function (res) {
            	
            	com.showAlert(com.info, "物品未退成功");

                var daiId = res.decorationActivityItem.daiId;
                com.focusPage("#state_" + daiId).text("未退");
            });
        });
    }

    //消耗装修活动项
    function expendDecorationActivityItem(daiId, activityItemName) {

        com.showConfirm("是否确认补款" + activityItemName + "活动物品?", function () {

            var options = {
                "decorationActivityItem.daiId": daiId,
            };

            com.post(api.decoration.expendDecorationActivityItem, options, function (res) {

            	com.showAlert(com.info, "物品补款成功");
                var daiId = res.decorationActivityItem.daiId;

                decorationUtils.countTatol(daiId);

                com.focusPage("#state_" + daiId).text("补款");
            });
        });
    }
});