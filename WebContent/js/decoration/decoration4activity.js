jQuery(function ($) {

    var decorationActivityItem = {
        items: {},
        identi: {},
        activityItems: {}
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
    decorationActivityItem.activityItems.comment = com.focusPage("#comment");
    

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

            com.selectTypeahead("thingsType", _things, 'asid', 'activityItemName');

            com.focusPage("#thingsAdd").unbind().click(function(){
                if(com.validate("thingsInputs")){
                    return;
                }

                decorationUtils.createCounpon("things", "thingsType", "thingsVal");

                com.cleanItems(decorationActivityItem.activityItems);
            });

            com.selectTypeahead("couponsType", _coupons, 'asid', 'activityItemName');

            com.focusPage("#couponsAdd").unbind().click(function(){
                if(com.validate("couponsInputs")){
                    return;
                }

                decorationUtils.createCounpon("coupons", "couponsType", "couponsVal");

                com.cleanItems(decorationActivityItem.activityItems);
            });

        });
    });
    
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

    initdraw(decorationActivityItem.decorationOrderId);

    //初始化
    function initdraw(orderId) {

        decorationUtils.decorationActivityItemInfo(decorationActivityItem.items.activityItems, decorationActivityItem.items.decorationActivityItems1, uiBtnMethod, orderId);
        decorationUtils.decorationActivityInfo(decorationActivityItem.items.decorationActivityItems, activityBtnMethod, orderId);
    }

    function uiBtnMethod(uiPgDiv, activityItem) {

        var btnViewBtn= $("<a></a>").addClass("btn btn-minier btn-yellow").html("失效").css("margin", "0px 3px").attr("id", "abate_" + activityItem.daiId).appendTo(uiPgDiv);
        var receiveBtn= $("<a></a>").addClass("btn btn-minier btn-success").html("领取").css("margin", "0px 3px").attr("id", "receive_" + activityItem.daiId).appendTo(uiPgDiv);
        var refundBtn= $("<a></a>").addClass("btn btn-minier btn-warning").html("退货").css("margin", "0px 3px").attr("id", "refund_" + activityItem.daiId).appendTo(uiPgDiv);
        var deliveryBtn= $("<a></a>").addClass("btn btn-minier btn-inverse").html("配送").css("margin", "0px 3px").attr("id", "delivery_" + activityItem.daiId).appendTo(uiPgDiv);
        var unrefundBtn= $("<a></a>").addClass("btn btn-minier btn-danger").html("未退").css("margin", "0px 3px").attr("id", "unrefund_" + activityItem.daiId).appendTo(uiPgDiv);
        var expendBtn= $("<a></a>").addClass("btn btn-minier btn-purple ").html("消耗").css("margin", "0px 3px").attr("id", "expend_" + activityItem.daiId).appendTo(uiPgDiv);

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
        	console.log(activityItem.daiId);
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

            var _activitys = [{aid: -1, activityName: ""}];

            for (var i = 0; i < activitys.length; i++) {
                var _activity = activitys[i];

                _activitys.push({aid: _activity.aid, activityName: _activity.name, money: _activitys.money});
            }
            decorationActivityItem.activityItems.activityInfo.bindData(_activitys, "aid", "activityName", "money", false);
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
            "decorationActivity.activity.aid": decorationActivityItem.activityItems.activityInfo.val()
        };
        com.post(api.decoration.addDecorationActivity, options, function (res) {
            var decorationActivity = res.decorationActivity;
            decorationUtils.addDecorationActivityForDiv(decorationActivityItem.items.decorationActivityItems, decorationActivity, activityBtnMethod);
        });
        decorationActivityItem.joinDecorationActivityModal.modal("hide");
    });

    //保存-申领活动物品
    com.focusPage("#submitDecorationActivityItemBtn").on(ace.click_event, function () {

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

        com.focusPage("#things li").each(function (i, e) {

            var _ = $(e);

            options["approvalDecorationActivityItems[" + index + "].orderId"] = orderId;
            options["approvalDecorationActivityItems[" + index + "].activityName"] = activityName;
            options["approvalDecorationActivityItems[" + index + "].activityItemName"] = _.children('span').attr("typename").split(" ")[0];
            options["approvalDecorationActivityItems[" + index + "].type"] = 1;
            options["approvalDecorationActivityItems[" + index + "].num"] = _.children('span').attr('num');
            options["approvalDecorationActivityItems[" + index + "].money"] = _.children('span').attr("typename").split(" ")[1].split(':')[1];
            options["approvalDecorationActivityItems[" + index + "].content"] = "";
            options["approvalDecorationActivityItems[" + index + "].stateType"] = stateType;
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
            options["approvalDecorationActivityItems[" + index + "].stateType"] = stateType;
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
            com.showAlert(com.info, "解锁成功");
            com.focusPage("#state_" + daId.daId).text("初始");
            com.focusPage("#dactivity_" + daId.daId).attr("status", "0");
        });
    }

    //锁定
    function lockDecorationActivity(daId) {

        var options = {
            "decorationActivity.daId": daId
        };

        com.post(api.decoration.lockDecorationActivity, options, function (res) {
            var daId = res.decorationActivity;
            com.showAlert(com.info, "锁定成功");
            com.focusPage("#state_" + daId.daId).text("锁定");
            com.focusPage("#dactivity_" + daId.daId).attr("status", "1");
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
            	
                var daiId = res.decorationActivityItem.daiId;

                com.focusPage("#state_" + daiId).text("失效");

            });
        });
    }

    com.post(api.ds.decoration, {}, function (res) {
        com.focusPage("#receiveTypes").bindData(res.receiveType, "key", "value", false);
    });

    //领取活动物品
    function receiveDecorationActivityItem(daiId) {
    	
        var options = {
            "decorationActivityItem.daiId": daiId,
            "decorationActivityItem.content": decorationActivityItem.activityItems.comment.val(),
        };

        com.post(api.decoration.receiveDecorationActivityItem, options, function (res) {

        	com.showAlert(com.info, "物品领取成功");
        	
            var daiId = res.decorationActivityItem.daiId;

            com.focusPage("#state_" + daiId).text("领取");
          
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
        	
            var daiId = res.decorationActivityItem.daiId;
            com.focusPage("#state_" + daiId).text("配送");

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

        com.showConfirm("是否确认消耗" + activityItemName + "活动物品?", function () {

            var options = {
                "decorationActivityItem.daiId": daiId,
            };

            com.post(api.decoration.expendDecorationActivityItem, options, function (res) {

            	com.showAlert(com.info, "物品消耗成功");
            	
                var daiId = res.decorationActivityItem.daiId;
                com.focusPage("#state_" + daiId).text("消耗");
            });

        });
    }
});