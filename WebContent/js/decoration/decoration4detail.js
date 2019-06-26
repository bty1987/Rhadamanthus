jQuery(function ($) {

    var decorationDetail = {
        decorationOrderId: null,
        orderType: "",

        type: {
            "半包": 0,
            "全包": 1,
            "半价": 2,
            "满减": 3,
            "减上捡": 4
        },
        decoration: {},
        customer: {},
        village: {},
        versionId: "",
        notSalesmanRate: "",//非业务人员提点
        materialPaymentListGrid: null,
        materialPaymentGridPager: null,

        decorationOrderStatus: {},

        reloadFlag: 0,

        btnSaveBasedecorationInfo: null,

        activity: {},

        dsid: null,
        decorationPaymentId: null,
        convertActivityItemId: null,

        items: {},
        houseItems: {},
        customerItems: {},
        serviceItems: {},

        vRepeatFlg: false,
        cRepeatFlg: false,
        accountFlg: false
    };

    var validator = {
        activityNameVerification: {
            type: "v_NameVerification",
            regex: /^[^ ]*$/,
            errorMsg: "活动名称不能带有空格"
        }
    };
    $.extend(com.validator, validator);

    var decorationMachingTypes = {};
    drawNode.draw(params.viewNode);

    var decorationPayment = {
        postParam: {},

        items: {},
        basePaymentGrid: null,
        otherPaymentGrid: null,
        otherPaymentPager: null,

        editFlag: 0
    };

    decorationDetail.items.orderId = com.focusPage("#orderId");
    decorationDetail.items.customer = com.focusPage("#customer");
    decorationDetail.items.houseAddr = com.focusPage("#houseAddr");
    decorationDetail.items.designer = com.focusPage("#designer");
    decorationDetail.items.salesman = com.focusPage("#salesman");
    decorationDetail.items.designDepartment = com.focusPage("#designDepartment");
    decorationDetail.items.businessDepartment = com.focusPage("#businessDepartment");

    decorationDetail.items.houseArea = com.focusPage("#houseArea");
    decorationDetail.items.status = com.focusPage("#status");
    decorationDetail.items.measureTime = com.focusPage("#measureTime");

    decorationDetail.items.houseType = com.focusPage('#houseType');
    decorationDetail.items.houseClass = com.focusPage('#houseClass');
    decorationDetail.items.orderType = com.focusPage('#orderType');
    decorationDetail.items.grade = com.focusPage('#grade');
    decorationDetail.items.detailOrderType = com.focusPage('#detailOrderType');
    decorationDetail.items.detailHouseType = com.focusPage('#detailHouseType');


    decorationDetail.items.backOrderName = com.focusPage('#backOrderName');
    decorationDetail.items.backOrderPhone = com.focusPage('#backOrderPhone');
    decorationDetail.items.backOrderContent = com.focusPage('#backOrderContent');

    decorationDetail.items.notSalesmanName = com.focusPage('#notSalesmanName');
    decorationDetail.items.notSalesmanPhone = com.focusPage('#notSalesmanPhone');
    decorationDetail.items.notSalesmanRate = com.focusPage('#notSalesmanRate');
    decorationDetail.items.notSalesmanContent = com.focusPage('#notSalesmanContent');

    decorationDetail.items.salesmanType = com.focusPage('#salesmanType');

    decorationDetail.serviceItems.comment = com.focusPage('#comment');

    decorationDetail.items.quoterId = com.focusPage('#quoterId');
    decorationDetail.items.escorterId = com.focusPage('#escorterId');
    decorationDetail.btnSaveBasedecorationInfo = com.focusPage("#btnSaveBasedecorationInfo").on("click", saveBasedecorationInfo);
    decorationDetail.otherPaymentType = com.focusPage("#otherPaymentType");
    decorationDetail.otherPayment = com.focusPage("#otherPayment");

    decorationDetail.customerItems.customerName = com.focusPage("#customerName");
    decorationDetail.customerItems.identity = com.focusPage("#identity");
    decorationDetail.customerItems.officer = com.focusPage("#officer");
    decorationDetail.customerItems.passport = com.focusPage("#passport");
    decorationDetail.customerItems.gender = com.focusPage("#gender").switchBtn("gender");
    decorationDetail.customerItems.qq = com.focusPage("#qq");
    decorationDetail.customerItems.wechat = com.focusPage("#wechat");
    decorationDetail.customerItems.email = com.focusPage("#email");
    decorationDetail.customerItems.address = com.focusPage("#address");
    decorationDetail.customerItems.relationshipType = com.focusPage("#relationshipType");
    decorationDetail.customerItems.addphone = com.focusPage("#addphone");
    decorationDetail.customerItems.savePhoneBtn = com.focusPage("#savePhoneBtn");


    com.post(api.ds.data, {}, function (res) {
        decorationDetail.customerItems.relationshipTypes = [];
        $.each(res.relationshipType, function (i, k) {
            decorationDetail.customerItems.relationshipTypes.push(k.key);
        });
        decorationDetail.customerItems.relationshipType.bindData(decorationDetail.customerItems.relationshipTypes, "key", "value", false);

    }, null, false);

    decorationDetail.houseItems.no = com.focusPage("#no");
    decorationDetail.houseItems.rule = com.focusPage("#rule");
    decorationDetail.houseItems.errMsg = com.focusPage("#errMsg");

    com.initTypeahead('no', api.data.queryVillageForNameByPinyin,"pinyinName", {}, "autoFillKeyValue", "key", "value", function(list, key, value){

        deleteVillageData("no");

        com.post(api.data.queryVillageById, {"village.no": key}, function (res) {
            decorationDetail.houseItems.rule.html("推荐楼牌号规则：" + (res.village.rule ? res.village.rule : "暂无推荐规则"));
        }, function(){
            com.show(com.warning, "楼盘信息不存在");
            key = "", value = "";
        }, false);

        return value;
    });
    decorationDetail.houseItems.built = com.focusPage("#built").on("blur", function (e) {
        deleteVillageData("built", decorationDetail.houseItems);
    });
    decorationDetail.houseItems.unit = com.focusPage("#unit").on("blur", function (e) {
        deleteVillageData("unit", decorationDetail.houseItems);
    });
    decorationDetail.houseItems.floor = com.focusPage("#floor").on("blur", function (e) {
        deleteVillageData("floor", decorationDetail.houseItems);
    });
    decorationDetail.houseItems.door = com.focusPage("#door").on("blur", function (e) {
        //验证房产是否存在
        validatehouse(com.typeahead("no"), houseUtils.anytimevalidate(decorationDetail.houseItems, 0, false));
    });
    decorationDetail.houseItems.builtrule = com.focusPage("#builtrule");
    decorationDetail.houseItems.unitrule = com.focusPage("#unitrule");
    decorationDetail.houseItems.floorrule = com.focusPage("#floorrule");
    decorationDetail.houseItems.doorrule = com.focusPage("#doorrule");

    com.post(api.ds.building, {}, function (res) {
        decorationDetail.houseItems.builtrule.bindData(res.buildrule, "key", "value");
        decorationDetail.houseItems.unitrule.bindData(res.buildrule, "key", "value");
        decorationDetail.houseItems.floorrule.bindData(res.buildrule, "key", "value");
        decorationDetail.houseItems.doorrule.bindData(res.buildrule, "key", "value");
    }, null, false);

    decorationDetail.printQuotationModal = com.focusPage("#printQuotationModal");
    //申请活动
    decorationDetail.activity.activity = com.focusPage("#activity").on("change", function () {
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
                        activityItemName: _activityItem.name + " 金额:" + _activityItem.money,
                    });
                } else if (_activityItem.type == 1) {
                    _things.push({
                        asid: _activityItem.asid,
                        activityItemName: _activityItem.name + " 金额:" + _activityItem.money
                    });
                }
            }

            com.selectTypeahead("thingsType", _things, 'asid', 'activityItemName');
            com.selectTypeahead("couponsType", _coupons, 'asid', 'activityItemName');
        });
    });

    com.focusPage("#thingsAdd").unbind().click(function(){
        if(com.validate("thingsInputs")){
            return;
        }

        decorationUtils.createCounpon("things", "thingsType", "thingsVal");

        com.focusPage("#thingsType").val('');
        com.focusPage("#thingsVal").val('');
    });

    com.focusPage("#couponsAdd").unbind().click(function(){
        if(com.validate("couponsInputs")){
            return;
        }

        decorationUtils.createCounpon("coupons", "couponsType", "couponsVal");


        com.focusPage("#couponsType").val('');
        com.focusPage("#couponsVal").val('');
    });

    decorationDetail.activity.activityInfo = com.focusPage("#activityInfo");
    decorationDetail.activity.activity = com.focusPage("#activity");
    decorationDetail.activity.things = com.focusPage("#things");
    decorationDetail.activity.coupons = com.focusPage("#coupons");

    decorationDetail.activity.couponsType = com.focusPage("#couponsType");
    decorationDetail.activity.couponsVal = com.focusPage("#couponsVal");
    decorationDetail.activity.thingsType = com.focusPage("#thingsType");
    decorationDetail.activity.thingsVal = com.focusPage("#thingsVal");

    decorationDetail.activity.activityItemName = com.focusPage("#activityItemName");
    decorationDetail.activity.couponInfo = com.focusPage("#couponInfo");
    decorationDetail.activity.activityItemMoney = com.focusPage("#activityItemMoney");
    decorationDetail.activity.activityItemNum = com.focusPage("#activityItemNum");

    decorationDetail.activitys = com.focusPage("#activitys");
    decorationDetail.activityItems = com.focusPage("#activityItems");
    decorationDetail.activityPriceInfo = com.focusPage("#activityPriceInfo");

    decorationDetail.printQuotationModal = com.focusPage("#printQuotationModal");
    decorationDetail.quotationTotalPriceModal = com.focusPage("#quotationTotalPriceModal");
    decorationDetail.joinDecorationActivityModal = com.focusPage("#joinDecorationActivityModal").on('show.bs.modal', function (e) {
        com.clearValidator();
    });
    decorationDetail.applyDecorationActivityItemModal = com.focusPage("#applyDecorationActivityItemModal").on('show.bs.modal', function (e) {
        com.clearValidator();
    });

    decorationDetail.refundDecorationPaymentModal = com.focusPage("#refundDecorationPaymentModal");
    decorationDetail.serviceModal = com.focusPage("#serviceModal");
    decorationDetail.otherPaymentModal = com.focusPage("#otherPaymentModal");

    decorationUtils.init();

    decorationDetail.decorationOrderId = params.decorationOrderId;
    decorationDetail.orderType = params.orderType;
    decorationDetail.versionId = params.versionId;

    decorationPayment.postParam.decorationOrderId = decorationDetail.decorationOrderId;
    decorationPayment.postParam["decorationPayment.decoration.orderId"] = decorationDetail.decorationOrderId;

    com.post(api.ds.decoration, {}, function (res) {
        decorationDetail.items.orderType.bindData(res.type, 'key', 'value');
        decorationDetail.items.houseType.bindData(res.houseType, 'key', 'value');
        decorationDetail.items.houseClass.bindData(res.houseClass, 'key', 'value');
        decorationDetail.items.grade.bindData(res.orderGrade, 'key', 'value');

    }, null, false);

    com.initTypeahead('quoterId', api.personel.queryUserByPinyin, "pinyinName", {
        "user.status": 0,
        "departmentType.name": ""
    }, "autoFillKeyValue", "key", "value");
    com.initTypeahead('escorterId', api.personel.queryUserByPinyin, "pinyinName", {
        "user.status": 0,
        "departmentType.name": ""
    }, "autoFillKeyValue", "key", "value");
    com.initTypeahead('no', api.data.queryVillageForNameByPinyin, "pinyinName", {}, "autoFillKeyValue", "key", "value");

    if ([2, 3, 4].indexOf(decorationDetail.orderType) != -1 ) { // 半价/满减/捡捡
        decorationUtils.initDecorationHolonomy(decorationDetail.decorationOrderId);
    }
    if (decorationDetail.orderType == 0) {
        decorationUtils.initDecorationInclusive(decorationDetail.decorationOrderId);
    }

    com.post(api.ds.decoration, {}, function (res) {
        $.each(res.decorationOrderStatus, function (i, v) {
            decorationDetail.decorationOrderStatus[v.key] = v.value;
        });
    }, null, false);

    com.focusPage('#customerInfosBtn').on(ace.click_event, function () {
            com.post(api.data.queryCustomerById, {"customer.cid": decorationDetail.customer.cid}, function (res) {
                decorationDetail.customer = res.customer;
                com.showInfo("客户敏感信息", '邮箱 :' + decorationDetail.customer.email + '<br /> QQ:' + decorationDetail.customer.qq + '<br /> 微信:' + decorationDetail.customer.wechat + '<br />  电话 :' + decorationDetail.customer.phone + '<br />  客户类型:' + decorationDetail.customer.relationshipType + '<br />')
            });

        return false;
    });
    //参加活动 保存按钮
    com.focusPage("#submitDecorationActivityBtn").on(ace.click_event, function () {

        if (com.validate("joinDecorationActivityModal")) {
            return;
        }

        var options = {
            "decorationActivity.orderId": decorationDetail.decorationOrderId,
            "decorationActivity.activity.aid": decorationDetail.activity.activityInfo.val(),
        };

        com.post(api.decoration.addDecorationActivity, options, function (res) {

            var decorationActivity = res.decorationActivity;

            decorationUtils.addDecorationActivityForDiv(decorationDetail.activitys, decorationActivity, activityBtnMethod);
        });

        decorationDetail.joinDecorationActivityModal.modal("hide");
    });

    // 申领活动物品 保存按钮
    com.focusPage("#submitDecorationActivityItemBtn").on(ace.click_event, function () {


        var receiverId = com.focusPage("#approveActivityItemManSel").find('input:checked').attr('userid');

        if (receiverId == null || receiverId == "") {
            com.showAlert(com.error, "请选择审批人!");
            return;
        }

        if (decorationDetail.activity.things.html() == "" && decorationDetail.activity.coupons.html() == "") {
            com.showAlert(com.error, "活动物品或券需要选择才能提交");
            return;
        }

        var submitFlag = true;

        var orderId = params.decorationOrderId;
        var activityName = decorationDetail.activity.activity.find("option:selected").text();
        var stateType = com.focusPage("#receiveTypes").val();
        var activityId = com.focusPage("#activity").val();

        var index = 0;

        var options = {
            "approval.receiver.userId": receiverId,
            "approval.comment": "",
            "approvalDecorationActivity.activityId": activityId,
            "approvalDecorationActivity.orderId": orderId,
            "approvalDecorationActivity.activityName": activityName,
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
        decorationDetail.applyDecorationActivityItemModal.modal("hide");

    });

    com.focusPage("#joinActivityBtn").on("click", function () {

        com.post(api.information.queryActivityForValid, {"activity.type": 1}, function (res) {
            var activitys = res.activitys;

            var _activitys = [{aid: -1, activityName: ""}];

            for (var i = 0; i < activitys.length; i++) {
                var _activity = activitys[i];

                _activitys.push({aid: _activity.aid, activityName: _activity.name, money: _activitys.money});
            }

            decorationDetail.activity.activityInfo.bindData(_activitys, "aid", "activityName", "money", false);
        });

        decorationDetail.joinDecorationActivityModal.modal("show");
    });

    //申领活动
    com.focusPage("#applyActivityItemBtn").on("click", function () {

        com.focusPage("#things").html("");
        com.focusPage("#coupons").html('');

        var options = {
            "decorationActivity.orderId": decorationDetail.decorationOrderId
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

            decorationDetail.activity.activity.bindData(_activitys, "aid", "activityName", false);
        }, null, false);


        approvalUtils.initqueryApprovalUser("approveActivityItemManSel", 8);
        //新增类型
        binding("receiveTypes");
        decorationDetail.applyDecorationActivityItemModal.modal("show");
    });

    com.focusPage('#customerChangeBtn').on("click", function () {
        com.clearValidator();
        com.post(api.data.queryCustomerById, {"customer.cid": decorationDetail.customer.cid}, function (res) {
            res = res.customer;

            decorationDetail.customerItems.customerName.val(res.name);
            decorationDetail.customerItems.identity.val(res.identity);
            decorationDetail.customerItems.officer.val(res.officer);
            decorationDetail.customerItems.passport.val(res.passport);
            decorationDetail.customerItems.qq.val(res.qq);
            decorationDetail.customerItems.wechat.val(res.wechat);
            decorationDetail.customerItems.email.val(res.email);
            decorationDetail.customerItems.address.val(res.address);
            decorationDetail.customerItems.relationshipType.val(res.relationshipType);
            decorationDetail.customerItems.gender.prop('checked', com.genderType[res.gender]);
        });
        com.post(api.data.queryCustomerPhoneByCid, {"customerPhone.cid": decorationDetail.customer.cid}, function (res) {
            showPhone('phoneList', res.customerPhones);
        }, null, false);

        com.focusPage("#customerChangeModal").modal("show");
    });

    com.focusPage("#cSaveBtn").on("click", function () {
        saveCustomer();
    });

    com.focusPage("#savePhoneBtn").on("click", function () {
        savecustomerPhone(decorationDetail.customer.cid, decorationDetail.customerItems.addphone.val());
    });

    com.focusPage("#addphone").on("blur", function () {
        checkPhone(decorationDetail.customer.cid, com.focusPage("#addphone"));
    });

    com.focusPage('#villageChangeBtn').on("click", function () {
        com.clearValidator();
        clearHouse();
        com.focusPage("#villageChangeModal").modal("show");
    });


    //点击生成款项按钮
    com.focusPage("#btnSetDecorationPaymentInfo").on('click', function (res) {
        com.clearValidator();

        if ([2, 3, 4].indexOf(decorationDetail.orderType) != -1) { // 半价/满减/捡捡
            com.post(api.decoration.queryDecorationConfig, {"decoration.type": decorationDetail.orderType}, function (res) {

                com.focusPage('#decorationDiscount').bindData(res.config.machingType, "id", "dd", false, null, '');

                $.each(res.config.machingType, function(i, v){
                    decorationMachingTypes[v.id] = v;
                })
            });
        }

        var orderType = com.focusPage('#detailOrderType').attr("orderType")
        decorationDetail.items.detailOrderType.html(orderType == 0 ? "半包" : (orderType == 1 ? "全包" : (orderType == 2 ? "半价" : (orderType == 3 ? "满减" : "减上捡"))));
        decorationDetail.items.detailHouseType.html(com.focusPage('#detailHouseType').attr("houseType"));

        com.focusPage("#decorationTotalMoney").val("");

        if ([2, 3, 4].indexOf(decorationDetail.orderType) != -1) { // 半价/满减/捡捡
            com.focusPage('#forDiscount').removeClass('hide');
        }

        com.post(api.data.queryPaymentScaleByCid, {"paymentScale.cid": params.company.cid}, function (res) {
            com.focusPage("#paymentScale").empty();
            $.each(res.paymentScales, function (i, v) {
                var $approvaler = $('<label></label>');
                var $div = $('<div></div>').addClass("radio no-padding").attr("style", "margin-bottom:10px");
                var $input = $('<input>').attr({
                    "type": "radio",
                    "name": "form-field-radio",
                    "class": "ace",
                    "psid": v.psid
                });

                if (i == 0) {
                    $input.attr('checked', 'true');
                }

                var $span = $('<span></span>').addClass('lbl').html($('<label></label>').attr('style', 'display:inline-block;width:105px;margin-left:10px').text(v.name));
                var $comment = $('<span></span>').addClass("lbl").text(v.comment == null ? " " : v.comment).attr("style", "margin-left:27px");
                $input.appendTo($approvaler);
                $span.appendTo($approvaler);
                $('<br/>').appendTo($approvaler);
                $comment.appendTo($approvaler);
                $approvaler.appendTo($div);
                $div.appendTo(com.focusPage("#paymentScale"));

            });

        });

        decorationDetail.quotationTotalPriceModal.modal("show");

    });

    com.focusPage("#btnOtherPayment").on('click', function (res) {
        com.clearValidator();

        com.post(api.ds.decoration, {}, function (res) {
            decorationDetail.otherPaymentType.bindData(res.paymentType, "key", "value", false);
        });

        decorationDetail.otherPaymentModal.modal("show");
    });

    com.focusPage("#serviceSaveBtn").on('click', function (res) {

        if (com.validate("serviceModal")) {
            return;
        }

        var options = {};
        options["decorationService.dsid"] = decorationDetail.dsid;
        options["decorationService.comment"] = decorationDetail.serviceItems.comment.val();

        com.post(api.decoration.completeDecorationService, options, function (res) {
            decorationUtils.initService(decorationDetail, decorationDetail.decorationOrderId);
            decorationDetail.serviceModal.modal("hide");
        });

    });

    com.focusPage("#saveRefundMoneyBtn").on('click', function (res) {

        if (com.validate("refundDecorationPaymentModal")) {
            return;
        }

        var receiverId = com.focusPage("#refundApproveManSel").find('input:checked').attr('userid');

        if (receiverId == null || receiverId == "") {
            com.showAlert(com.error, "请选择审批人!");
            return;
        }

        if (decorationPayment.editFlag == 0) {

            var options = {
                "approval.receiver.userId": receiverId,
                "approval.comment": com.focusPage("#changeReason").val(),
                "approvalDecorationRefund.paymentId": com.focusPage('#autoId').val(),
            };

            com.showConfirm("确认要提交退款申请吗?", function () {
                com.post(api.approval.submitApprovalForDecorationRefund, options, function (res) {
                    com.showAlert(com.info, "提交成功");
                    decorationUtils.initPayment(decorationDetail, true);
                });

                decorationDetail.refundDecorationPaymentModal.modal("hide");
            });
        }

        com.focusPage('#changeReason').val("");
    });

    com.focusPage("#saveOtherPaymentBtn").on("click", function (res) {
        if (com.validate("otherPaymentModal")) {
            return;
        }

        var type = decorationDetail.otherPaymentType.val().split('-');

        var options = {
            "decorationPayment.decoration.orderId": decorationDetail.decorationOrderId,
            "decorationPayment.paymentType": decorationDetail.otherPaymentType.find("option:selected").text(),
            "decorationPayment.oneType": type[0],
            "decorationPayment.twoType": type[1],
            "decorationPayment.referMoney": decorationDetail.otherPayment.val()
        };

        com.post(api.payment.addDecorationPayment, options, function (res) {

            decorationUtils.initPayment(decorationDetail, true);

            decorationDetail.otherPaymentModal.modal("hide");
        });
    });

    //生成三笔款/四笔款
    com.focusPage("#saveGenerateDecorationPaymentBtn").bindClick(function (res) {

        if (com.validate("quotationTotalPriceModal")) {
            return;
        }

        if (parseFloat(com.focusPage("#decorationTotalMoney").val()) <= 0.0000001) {
            com.showAlert(com.warning,"合同款不能小于1元");
            return;
        }

        var psId = com.focusPage("#paymentScale").find('input:checked').attr('psid');

        if (psId == null || psId == "") {
            com.showAlert(com.warning, "请选择款项比例!");
            return;
        }

        var options = {
            "decorationMidpack.decoration.orderId": decorationDetail.decorationOrderId,
            "decorationMidpack.psId": psId
        };


        if ([2, 3, 4].indexOf(decorationDetail.orderType) != -1) { // 半价/满减/捡捡

            var manageRate = 0;
            //通过订单编号获取默认报价信息
            com.post(api.quotation.queryQuotationForDefaultByOrderId, {"quotation.orderId": decorationDetail.decorationOrderId}, function (res) {

                if (res.quotation.manageRate != null && res.quotation.manageRate != 0) {
                    manageRate = res.quotation.manageRate;
                } else {
                    //通过报价版本编号查询版本信息
                    com.post(api.quotation.queryQuotationVersionByVersionId, {"quotationVersion.versionId": decorationDetail.versionId}, function (data) {
                        manageRate = data.quotationVersion.manageRate;
                    }, null, false);
                }
            }, function (e) {
                com.showAlert(com.error, e.errorMsg);
                return;
            }, false);

            var id = com.focusPage('#decorationDiscount').val();//maching
            var discout = com.focusPage('#decorationDiscount').find("option:selected").text();

            var dict = decorationMachingTypes[id];

            var serviceRate = dict.sr;//服务费配比
            var discountBase = dict.db;//基数
            var maching = dict.mm;
            var names = dict.n;

            options = {
                "decorationHolonomy.decoration.orderId": decorationDetail.decorationOrderId,
                "decorationHolonomy.maching": maching,  // 主材配比
                "decorationHolonomy.discount": discout,//折扣
                "decorationHolonomy.manageRate": parseFloat(manageRate) + parseFloat(decorationDetail.notSalesmanRate),//管理费比例   非提比例
                "decorationHolonomy.serviceRate": serviceRate,// 服务费配比
                "decorationHolonomy.status": 0,
                "decorationHolonomy.psId": psId,
                "decorationHolonomy.discountBase": discountBase,
                "decorationHolonomy.name": names
            };

            com.post(api.decoration.makeDecorationHolonomy, options, function (res) {
                com.showAlert(com.info, "保存成功");

                res = res.decorationHolonomy;
                com.focusPage('#projectPrice').html(utils.changeTwoDecimal(utils.accAdd(res.projectPrice , res.managePrice)));
                com.focusPage('#managePrice').html(res.managePrice);
                com.focusPage('#materialPrice').html(res.materialPrice);
                com.focusPage('#servicePrice').html(res.servicePrice);
                com.focusPage('#quotationPrice').html(utils.changeTwoDecimal(res.projectBase));
                var materialPercent = utils.accMul(utils.changeThrDecimal(utils.accDiv(res.materialPaidup == null ? 0 : res.materialPaidup, res.materialPrice)), 100);
                com.focusPage('#materialPercent').html(materialPercent > 100 ? 100 : materialPercent + "%");
                var servicePercent = utils.accMul(utils.changeThrDecimal(utils.accDiv(res.servicePaidup == null ? 0 : res.servicePaidup, res.servicePrice)), 100);
                com.focusPage('#servicePercent').html(servicePercent > 100 ? 100 : servicePercent + "%");

                decorationUtils.initPayment(decorationDetail, true);

            }, function (e) {
                com.showAlert(com.error, e.errorMsg);
            });

        } else if (decorationDetail.orderType == 1) {

            options = {
                "decorationInclusive.decoration.orderId": decorationDetail.decorationOrderId,
                "decorationInclusive.contractPrice": com.focusPage("#decorationTotalMoney").val(),
                "decorationInclusive.psId": psId,
            };

            com.post(api.decoration.makeDecorationInclusive, options, function (res) {
                com.showAlert(com.info, "保存成功");

                res = res.decorationInclusive;

                com.focusPage('#contractPrice').html(res.contractPrice);
                com.focusPage('#projectPrice').html(res.projectPrice);
                com.focusPage('#cdiff').html(res.cdiff);
                com.focusPage('#mdiff').html(res.mdiff);
                com.focusPage('#managePrice').html(res.managePrice);
                com.focusPage('#materialPaidup').html(res.materialPaidup);

                decorationUtils.initPayment(decorationDetail, true);
            }, function (e) {
                com.showAlert(com.error, e.errorMsg);
            });
        } else {
            com.post(api.decoration.makeDecorationMidpack, options, function (res) {
                com.showAlert(com.info, "保存成功");
                decorationUtils.initPayment(decorationDetail, true);
            });
        }


        decorationDetail.quotationTotalPriceModal.modal("hide");
    });

    com.focusPage('#btnBack').on(ace.click_event, function () {
        com.switchPage(params.historyPage);
    });

    com.focusPage("#btnPrintDefaultQuotationInfo").on('click', function (res) {
        decorationDetail.printQuotationModal.modal("show");
    });

    initWizard(decorationDetail);

    decorationUtils.initBaseInfo(decorationDetail.decorationOrderId, api.decoration.queryDecorationForCommonByOrderId, function (decoration) {

        decorationDetail.items.orderId.val(decoration.orderId);
        decorationDetail.items.customer.val(decoration.customer.name);
        decorationDetail.items.houseAddr.val(decoration.house.village.name + decoration.house.houseNumber);
        decorationDetail.items.designDepartment.val(decoration.designer.dept.name);
        decorationDetail.items.designer.val(decoration.designer.currentName);
        decorationDetail.items.businessDepartment.val(decoration.salesman.dept.name);
        decorationDetail.items.salesman.val(decoration.salesman.currentName);
        decorationDetail.items.orderType.val(decoration.type);
        decorationDetail.items.houseType.val(decoration.houseType);
        decorationDetail.items.houseClass.val(decoration.houseClass);
        decorationDetail.items.houseArea.val(decoration.house.buildArea);
        decorationDetail.items.status.val(decorationDetail.decorationOrderStatus[decoration.status]);
        decorationDetail.items.measureTime.val(decoration.measureTime);
        decorationDetail.items.notSalesmanRate.val(decoration.notSalesmanRate);
        decorationDetail.notSalesmanRate = decoration.notSalesmanRate;
        decorationDetail.items.grade.val(decoration.grade);
        decorationDetail.items.quoterId.val(decoration.quoter.currentName);
        decorationDetail.items.escorterId.val(decoration.escorter.currentName);
        com.focusPage("#detailOrderType").attr("orderType", decoration.type);
        com.focusPage("#detailHouseType").attr("houseType", decoration.houseType);

        if (decoration.status != 7) {
            decorationDetail.accountFlg = true;
        } else {
            decorationDetail.accountFlg = false;
        }
        com.post(api.decoration.queryDecorationInfoByOrderId, {"orderId": decorationDetail.decorationOrderId}, function (res) {
            res = res.decorationInfo;
            decorationDetail.items.backOrderName.val(res.backOrderName);
            decorationDetail.items.backOrderPhone.val(res.backOrderPhone);
            decorationDetail.items.backOrderContent.val(res.backOrderContent);
            decorationDetail.items.notSalesmanPhone.val(res.notSalesmanPhone);
            decorationDetail.items.notSalesmanName.val(res.notSalesmanName);
            decorationDetail.items.notSalesmanContent.val(res.notSalesmanContent);
        });


        decorationDetail.houseItems.shid = decoration.house.hid;

        decorationDetail.items.salesmanType.val(decoration.salesmanType);
        com.updateTypeahead('quoterId', decoration.quoter == null ? "" : decoration.quoter.userId, decoration.quoter.currentName == null ? "" : decoration.quoter.currentName);
        com.updateTypeahead('escorterId', decoration.escorter == null ? "" : decoration.escorter.userId, decoration.escorter.currentName == null ? "" : decoration.escorter.currentName);

        decorationDetail.customer.cid = decoration.customer.cid;
        decorationDetail.customer.phone = decoration.customer.phone;
        decorationDetail.customer.qq = decoration.customer.qq;
        decorationDetail.customer.wechat = decoration.customer.wechat;
        decorationDetail.customer.email = decoration.customer.email;
        decorationDetail.customer.relationshipType = decoration.customer.relationshipType;

        decorationDetail.village.villageId = decoration.house.village.villageId;
        decorationDetail.village.villageName = decoration.house.village.villageName;
        decorationDetail.village.houseNumber = decoration.house.houseNumber;

        decorationDetail.decoration.type = decoration.type;
    });

    function saveBasedecorationInfo() {
        if (com.validate("step1")) {
            return;
        }

        var btn = com.focusPage("#btnSaveBasedecorationInfo");
        btn.button('loading');
        com.showConfirm("确定要保存基本信息吗?", function () {
            var options = {
                "decoration.orderId": decorationDetail.decorationOrderId,
                "decoration.type": decorationDetail.items.orderType.val(),
                "decoration.houseType": decorationDetail.items.houseType.val(),
                "decoration.houseClass": decorationDetail.items.houseClass.val(),
                "decoration.notSalesmanRate": decorationDetail.items.notSalesmanRate.val(),
                "decorationInfo.notSalesmanName": decorationDetail.items.notSalesmanName.val(),
                "decorationInfo.notSalesmanPhone": decorationDetail.items.notSalesmanPhone.val(),
                "decorationInfo.notSalesmanContent": decorationDetail.items.notSalesmanContent.val(),
                "decoration.quoter.userId": com.typeahead("quoterId"),
                "decoration.escorter.userId": com.typeahead("escorterId"),
            };
            com.post(api.decoration.changeDecorationForAdvance, options, function () {
                com.showAlert(com.info, "操作成功");
                btn.button('reset');
            });
        }, function () {
            btn.button('reset');
        });
    }

    function downloadFile(picturePath, uploadFileName) {
        window.open(config.media + api.common.downloadFile.url + "?downloadFilePath=" + picturePath + "&fileName=" + uploadFileName);
    }

    function initWizard(decorationDetail) {
        var wizard = {"activityBtnMethod": null, "uiBtnMethod": null, "isDesign": false};

        decorationUtils.initDecorationPicture("designPictures", "projectPictures", "CADProjectPicture", "ContractPictures", "OriginalPicture", decorationDetail.decorationOrderId);

        com.focusPage('#fuelux-wizard').ace_wizard({"status": true}).on('change', function (e, info) {
            var curstep = 0;

            info.direction === "previous" ? curstep = info.step - 1 : curstep = info.step;

            curstep == 1 ? decorationDetail.btnSaveBasedecorationInfo.removeClass("hide") : decorationDetail.btnSaveBasedecorationInfo.addClass("hide");

            switch (params.viewNode[curstep].type) {

                case "quotaion":
                    quotationUtils.loadQuotationDetail();
                    break;
                case "picture":
                    if (!$.isEmptyObject(params.viewNode[curstep].wizard)) $.extend(true, wizard, params.viewNode[curstep].wizard);
                    decorationUtils.initDecorationPicture("designPictures", "projectPictures", "CADProjectPicture", "ContractPictures", "OriginalPicture", decorationDetail.decorationOrderId);
                    break;
                case "material":
                    decorationUtils.initMaterial(decorationDetail);
                    break;
                case "activity":
                    if (!$.isEmptyObject(params.viewNode[curstep].wizard)) $.extend(true, wizard, params.viewNode[curstep].wizard);
                    params.convertActivityItemId = decorationDetail.convertActivityItemId;
                    params.activity = decorationDetail.activity;
                    decorationUtils.decorationActivityInfo(decorationDetail.activitys, wizard["activityBtnMethod"], decorationDetail.decorationOrderId);
                    decorationUtils.decorationActivityItemInfo(decorationDetail.activityPriceInfo, decorationDetail.activityItems, wizard["uiBtnMethod"], decorationDetail.decorationOrderId);
                    break;
                case "belong":
                    decorationUtils.initDecorationBelong(decorationDetail.decorationOrderId);
                    break;
                case "payment":
                    if (!$.isEmptyObject(params.viewNode[curstep].wizard)) $.extend(true, wizard, params.viewNode[curstep].wizard);
                    decorationUtils.initPayment(decorationDetail, wizard["isDesign"]);
                    break;
                case "addreduce":
                    decorationUtils.initAddreduce(decorationDetail.decorationOrderId, decorationDetail.orderType);
                    break;
                case "account":
                    decorationUtils.initAccount(decorationDetail.decorationOrderId, decorationDetail.accountFlg);
                    break;
                case "service":
                    decorationUtils.initService(decorationDetail, decorationDetail.decorationOrderId);
                    break;
            }
        }).on('stepclick', function (e, info) {
            info.step == 1 ? decorationDetail.btnSaveBasedecorationInfo.removeClass("hide") : decorationDetail.btnSaveBasedecorationInfo.addClass("hide");
            switch (params.viewNode[info.step - 1].type) {

                case "quotaion":
                    quotationUtils.loadQuotationDetail();
                    break;
                case "picture":
                    if (!$.isEmptyObject(params.viewNode[info.step - 1].wizard)) $.extend(true, wizard, params.viewNode[info.step - 1].wizard);
                    decorationUtils.initDecorationPicture("designPictures", "projectPictures", "CADProjectPicture", "ContractPictures", "OriginalPicture", decorationDetail.decorationOrderId);
                    break;
                case "material":
                    decorationUtils.initMaterial(decorationDetail);
                    break;
                case "activity":
                    if (!$.isEmptyObject(params.viewNode[info.step - 1].wizard)) $.extend(true, wizard, params.viewNode[info.step - 1].wizard);
                    params.convertActivityItemId = decorationDetail.convertActivityItemId;
                    params.activity = decorationDetail.activity;
                    decorationUtils.decorationActivityInfo(decorationDetail.activitys, wizard["activityBtnMethod"], decorationDetail.decorationOrderId);
                    decorationUtils.decorationActivityItemInfo(decorationDetail.activityPriceInfo, decorationDetail.activityItems, wizard["uiBtnMethod"], decorationDetail.decorationOrderId);
                    break;
                case "belong":
                    decorationUtils.initDecorationBelong(decorationDetail.decorationOrderId);
                    break;
                case "payment":
                    if (!$.isEmptyObject(params.viewNode[info.step - 1].wizard)) $.extend(true, wizard, params.viewNode[info.step - 1].wizard);
                    decorationUtils.initPayment(decorationDetail, wizard["isDesign"]);
                    break;
                case "addreduce":
                    decorationUtils.initAddreduce(decorationDetail.decorationOrderId, decorationDetail.orderType);
                    break;
                case "account":
                    decorationUtils.initAccount(decorationDetail.decorationOrderId, decorationDetail.accountFlg);
                    break;
                case "service":
                    decorationUtils.initService(decorationDetail, decorationDetail.decorationOrderId);
                    break;
            }
        }).on('previous', function (e, info) {
            info.step == 1 ? decorationDetail.btnSaveBasedecorationInfo.removeClass("hide") : decorationDetail.btnSaveBasedecorationInfo.addClass("hide");
        }).on('finished', function (e) {
            com.switchPage(params.historyPage);
        });
    }

    function activityBtnMethod(uiPgDiv, decorationActivity) {

        var deleteBtn = $("<a></a>").addClass("btn btn-minier btn-yellow").html("删除").css("margin", "0px 3px").attr("id", "delete_" + decorationActivity.daId).appendTo(uiPgDiv);

        deleteBtn.on("click", function () {
            if(com.focusPage("#dactivity_" + decorationActivity.daId).attr("status") == 0){
                deleteDecorationActivity(decorationActivity.daId);
            }
        });
    }

    function uiBtnMethod(uiPgDiv, activityItem) {

        var btnViewBtn= $("<a></a>").addClass("btn btn-minier btn-yellow").html("失效").css("margin", "0px 3px").attr("id", "abate_" + activityItem.daiId).appendTo(uiPgDiv);


        btnViewBtn.on("click", function () {
            abateDecorationActivityItem(activityItem.daiId, activityItem.activityItemName);
        });

    }

    function deleteDecorationActivity(daId) {

        var options = {
            "decorationActivity.daId": daId,
        };

        com.post(api.decoration.deleteDecorationActivity, options, function (res) {
            com.focusPage("#dactivity_" + res.decorationActivity.daId).remove();
        });
    }


    function abateDecorationActivityItem(daiId, activityItemName) {

        com.showConfirm("是否确认失效" + activityItemName + "活动物品?", function () {

            var options = {
                "decorationActivityItem.daiId": daiId,
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

    function houseNumbervali(houseNumber, regex, errorMsg) {

        if (new RegExp(regex).test(houseNumber)) {
            com.focusPage("#errMsg").popover("destroy");

            return true;
        } else {
            com.focusPage("#errMsg").focus().select();
            com.focusPage("#errMsg").removeAttr("data-placement").attr({
                "data-rel": "popover",
                "data-placement": "right",
                "data-content": errorMsg
            }).removeAttr("data-toggle").popover('show');

            return false;

        }
    }

    function changetohousenum(temp, arr) {
        var str = temp;
        if (arr.trim() != "" && arr.trim() != "0") {
            if (temp.indexOf("{}") != -1) {
                var num = temp.indexOf("{}");
                str = temp.substring(0, num) + arr + temp.substring(num + 2);
            }
            else {
                str = str + "-" + arr;
            }
        }
        return str;
    }

    function validatehouse(no, houseNumber) {

        if (no == "" || houseNumber == "") {
            return;
        }
        var options = {
            "house.village.no": no,
            "house.houseNumber": houseNumber.houseNumber,
            "house.status": 0
        };

        com.post(api.data.queryHouseByNoAHnum, options, function (res) {
            com.post(api.decoration.checkDecoration, {
                "filters[0].data": res.house.hid,
                "filters[0].field": "houseId",
                "filters[0].op": "eq"
            }, function (des) {
                if (des.decoration && des.decoration.orderId) {
                    com.showTips($("#door"), "订单已存在:订单号:" + des.decoration.orderId + " 订单所属设计师:" + des.decoration.designer.currentName, true);
                    decorationDetail.repeatFlg = true;

                } else {
                    com.showConfirm("已有该房产信息，是否绑定?", function () {
                        decorationDetail.houseItems.thid = res.house.hid;
                        decorationDetail.houseItems.villageName = res.house.village.name;
                        decorationDetail.houseItems.houseNumber = res.house.houseNumber;
                        decorationDetail.repeatFlg = false;

                        com.post(api.decoration.changeDecorationForHouse, {
                            "decoration.orderId": decorationDetail.decorationOrderId,
                            "decoration.house.hid": decorationDetail.houseItems.thid
                        }, function (res) {
                            com.showAlert(com.info, "操作成功");
                            decorationDetail.items.houseAddr.val(decorationDetail.houseItems.villageName + decorationDetail.houseItems.houseNumber);
                            com.focusPage("#villageChangeModal").modal("hide");
                        }, null, false);

                    });
                }
            }, null, false);
        }, function () {
            com.showAlert(com.warning, "房产不存在");
            com.focusPage("#door").css("border", "1px solid #d5d5d5").popover("destroy");
        }, false);

    }

    function showPhone(tableId, listData) {
        com.focusPage('#' + tableId).html(null);

        var $tableWrap = com.focusPage('#' + tableId);
        var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');

        if (listData && listData.length) {
            $.each(listData, function (i, v) {
                createLine($ul, v);
            });

            $ul.appendTo($tableWrap);
        }

    }

    function createLine($ul, v) {
        var $liLine = $('<li></li>').addClass('item-blue clearfix');
        var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(v.phone));
        var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
        var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

        var $btnStauts = $('<input />').attr("type", "checkbox").addClass('ace ace-switch ace-switch-5').attr("checked", v.status == 0 ? true : false);
        var $btnSpan = $('<span></span>').addClass("lbl status-lbl");


        $divBtnWrap.append($btnStauts).append($btnSpan).appendTo($h3);

        $liLine.append($h3).append($ulProperty);

        $btnStauts.click(function () {

            if ($btnStauts.prop("checked")) {
                var option = {
                    "customerPhone.phone": v.phone,
                    "customerPhone.status": 0,
                    "customerPhone.cid": v.cid,
                    "customerPhone.cpid": v.cpid
                };
                //先查询该电话是否被被人启用
                com.post(api.data.checkCustomerForPhone, option, function (res) {
                    updateCustomerPhoneForStatus(v.cpid, 0, function () {
                        $this.removeAttr("checked");
                    });
                }, function (res) {
                    com.showAlert(com.warning, "该电话已经被其他客户启用");
                    $btnStauts.prop("checked", false);
                }, false);
            } else {
                updateCustomerPhoneForStatus(v.cpid, 1, function () {
                    $this.prop("checked");
                });
            }

        });

        $liLine.appendTo($ul);
    }

    function updateCustomerPhoneForStatus(cpid, status, callBack) {
        com.post(api.data.updateCustomerPhoneForStatus, {
            "customerPhone.cpid": cpid,
            "customerPhone.status": status
        }, function () {
        }, function (res) {
            callBack && callBack();

        }, null, false);
    }

    function savecustomerPhone(cid, phone) {

        if (decorationDetail.customer.repeatFlg) {
            return;
        }

        if (com.focusPage("#addphone").val() == "" || com.focusPage("#addphone").val() == 0) {
            decorationDetail.customer.repeatFlg = true;
            com.showPopover($("#addphone"), {errorMsg: "电话号码不能为空"}, "right");
            return
        }
        var reg = /^((1[3|4|5|6|7|8|9][0-9]{9})|(0[0-9]{10}))((#((1[3|4|5|6|7|8|9][0-9]{9})|(0[0-9]{10})))){0,4}$/;

        if (reg.test(com.focusPage("#addphone").val()) == false) {
            decorationDetail.customer.repeatFlg = true;
            com.showPopover($("#addphone"), {errorMsg: "请输入正确的手机号或固定电话!!"}, "right");
            return
        }

        var param = {
            "customerPhone.phone": phone,
            "customerPhone.cid": cid,
        };
        var $ul = com.focusPage('#phoneList').children('ul');

        com.post(api.data.addCustomerPhone, param, function (res) {
            var $ul = com.focusPage('#phoneList').children('ul');
            res.customerPhone.status = 0;
            createLine($ul, res.customerPhone);
            decorationDetail.customerItems.addphone.val("");
        });

    }

    function checkPhone(cid, $id) {

        var reg = /^((1[0-9]{10})|(0[0-9]{10}))((#((1[0-9]{10})|(0[0-9]{10})))){0,4}$/;

        if ($id.val() == "" || $id.val() == 0) {
            decorationDetail.customer.repeatFlg = true;
            com.showPopover($id, {errorMsg: "电话号码不能为空"}, "bottom");
        } else {
            if (reg.test($id.val()) == false) {
                decorationDetail.customer.repeatFlg = true;
                com.showPopover($id, {errorMsg: "请输入正确的手机号或固定电话!!"}, "bottom");
            } else {
                com.post(api.data.checkCustomerForPhone, {
                    "customerPhone.cid": cid,
                    "customerPhone.phone": $id.val(),
                    "customerPhone.status": null
                }, function (res) {
                    decorationDetail.customer.repeatFlg = false;
                    $id.css("border", "1px solid #d5d5d5").popover("destroy");
                }, function (res) {
                    decorationDetail.customer.repeatFlg = true;
                    com.showPopover($id, {errorMsg: "电话信息已存在"}, "bottom");
                }, false);
            }
        }
    }

    function saveCustomer() {
        com.clearValidator();
        if (com.validate("customerChangeModal")) {
            return;
        }
        var url;
        var options = {
            "customer.cid": decorationDetail.customer.cid,
            "customer.name": decorationDetail.customerItems.customerName.val(),
            "customer.gender": com.genderType[decorationDetail.customerItems.gender.prop("checked")],
            "customer.identity": decorationDetail.customerItems.identity.val(),
            "customer.officer": decorationDetail.customerItems.officer.val(),
            "customer.passport": decorationDetail.customerItems.passport.val(),
            "customer.qq": decorationDetail.customerItems.qq.val(),
            "customer.wechat": decorationDetail.customerItems.wechat.val(),
            "customer.email": decorationDetail.customerItems.email.val(),
            "customer.relationshipType": decorationDetail.customerItems.relationshipType.val(),
            "customer.address": decorationDetail.customerItems.address.val()
        };

        url = api.data.updateCustomer;

        com.post(url, options, function (res) {
            com.showAlert(com.info, "操作成功");
            com.focusPage("#customerChangeModal").modal("hide");
        });

    }

    function clearHouse() {
        decorationDetail.houseItems.no.prop("disabled", false);
        decorationDetail.houseItems.no.get(0).selectedIndex = 0;
        com.cleanItems(decorationDetail.houseItems);
        com.cleanTypeahead("no");
        com.clearValidator();
        com.focusPage("#errMsg").css("border", "0px");
    }

    function deleteVillageData(paramFlag, items) {
        switch (paramFlag) {
            case "built":
                decorationDetail.houseItems.unit.val("");
                decorationDetail.houseItems.floor.val("");
                decorationDetail.houseItems.door.val("");
                break;
            case "unit":
                decorationDetail.houseItems.floor.val("");
                decorationDetail.houseItems.door.val("");
                break;
            case "floor":
                decorationDetail.houseItems.door.val("");
                break;
            case "no":
                decorationDetail.houseItems.built.val("");
                decorationDetail.houseItems.unit.val("");
                decorationDetail.houseItems.floor.val("");
                decorationDetail.houseItems.door.val("");
                decorationDetail.houseItems.builtrule.get(0).selectedIndex = 0;
                decorationDetail.houseItems.unitrule.get(0).selectedIndex = 0;
                decorationDetail.houseItems.floorrule.get(0).selectedIndex = 0;
                decorationDetail.houseItems.doorrule.get(0).selectedIndex = 0;
                com.focusPage("#door").css("border", "1px solid #d5d5d5").popover("destroy");
                com.focusPage("#errMsg").popover("destroy");
                break;
        }
    }

    function binding(idName) {
        com.post(api.ds.decoration, {}, function (res) {
            com.focusPage("#" + idName).bindData(res.receiveType, "key", "value", true)
        });
    }
});