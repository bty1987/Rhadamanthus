jQuery(function($) {

    var decorationDetail = {
        orderId: null,
        orderStatus: 0,
        orderType: "",
        orderTypeness: "",
        type: {},
        typeness: {},
        decoration: {},
        decorationUser: {},
        customer: {},
        customerAccount: {},
        village: {},
        versionId: "",
        notSalesmanRate: "",// 非业务人员提点
        materialPaymentListGrid: null,
        materialPaymentGridPager: null,

        decorationOrderStatus: {},

        decorationAtttypes: [],
        decorationBusitypes: [],

        reloadFlag: 0,

        btnSaveBasedecorationInfo: null,

        activity: {},

        dsid: null,
        decorationPaymentId: null,
        convertActivityItemId: null,

        items: {},
        houseItems: {},
        customerItems: {},
        customerAccountItems: {},
        userItems: {},
        serviceItems: {},
        decorationActivityItems: {},
        paymentItems: {},
        paymentTypes: [],

        customerTypes: {},

        vRepeatFlg: false,
        cRepeatFlg: false,
        accountFlg: false,
        btnViewFlg: false
    };

    var decorationMachingTypes = {};

    var decorationPayment = {
        postParam: {},

        items: {},
        basePaymentGrid: null,
        otherPaymentGrid: null,
        otherPaymentPager: null,

        editFlag: 0
    };

    var decorationActivity = {
        activityItemType: {},
        stateTypes: {},
        states: {}
    };

    var salesActivityItem = {
        salesActivityItemType: {},
        salesActivityItemState: {}
    };

    drawNode.draw(params.decoration.viewNode);

    decorationDetail.items.orderId = com.focusPage("#orderId");
    decorationDetail.items.customer = com.focusPage("#customer");
    decorationDetail.items.villageName = com.focusPage("#villageName");
    decorationDetail.items.houseNumber = com.focusPage("#houseNumber");
    decorationDetail.items.designer = com.focusPage("#designer");
    decorationDetail.items.salesman = com.focusPage("#salesman");
    decorationDetail.items.designDepartment = com.focusPage("#designDepartment");
    decorationDetail.items.businessDepartment = com.focusPage("#businessDepartment");
    decorationDetail.items.houseTypeClass = com.focusPage("#houseTypeClass");
    decorationDetail.items.houseArea = com.focusPage("#houseArea");
    decorationDetail.items.freeArea = com.focusPage("#freeArea");
    decorationDetail.items.innerArea = com.focusPage("#innerArea");
    decorationDetail.items.totalArea = com.focusPage("#totalArea");
    decorationDetail.items.status = com.focusPage("#status");
    decorationDetail.items.measureTime = com.focusPage("#measureTime");
    decorationDetail.items.decorationDiscount = com.focusPage('#decorationDiscount');

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

    decorationDetail.items.busitype = com.focusPage('#busitype');

    decorationDetail.serviceItems.comment = com.focusPage('#comment');

    decorationDetail.items.quoterId = com.focusPage('#quoterId');
    decorationDetail.items.escorterId = com.focusPage('#escorterId');
    decorationDetail.items.materialerId = com.focusPage('#materialerId');
    decorationDetail.btnSaveBasedecorationInfo = com.focusPage("#btnSaveBasedecorationInfo").on("click", saveBaseDecorationInfo);

    decorationDetail.paymentItems.otherPaymentType = com.focusPage("#otherPaymentType");
    decorationDetail.paymentItems.otherPayment = com.focusPage("#otherPayment");
    decorationDetail.paymentItems.changeReason = com.focusPage('#changeReason');
    decorationDetail.paymentItems.materialPrice = com.focusPage('#materialPrice');
    decorationDetail.paymentItems.collectMoney = com.focusPage("#collectMoney");

    decorationDetail.customerItems.customerName = com.focusPage("#customerName", "#customerChangeModal");
    decorationDetail.customerItems.identity = com.focusPage("#identity", "#customerChangeModal");
    decorationDetail.customerItems.officer = com.focusPage("#officer", "#customerChangeModal");
    decorationDetail.customerItems.passport = com.focusPage("#passport", "#customerChangeModal");
    decorationDetail.customerItems.passhkm = com.focusPage("#passhkm", "#customerChangeModal");
    decorationDetail.customerItems.gender = com.focusPage("#gender").switchBtn("gender", "#customerChangeModal");
    decorationDetail.customerItems.qq = com.focusPage("#qq", "#customerChangeModal");
    decorationDetail.customerItems.wechat = com.focusPage("#wechat", "#customerChangeModal");
    decorationDetail.customerItems.email = com.focusPage("#email", "#customerChangeModal");
    decorationDetail.customerItems.career = com.focusPage("#career", "#customerChangeModal");
    decorationDetail.customerItems.address = com.focusPage("#address", "#customerChangeModal");
    decorationDetail.customerItems.relationshipType = com.focusPage("#relationshipType", "#customerChangeModal");
    decorationDetail.customerItems.addphone = com.focusPage("#addphone", "#customerChangeModal");
    decorationDetail.customerItems.type = com.focusPage("#type", "#customerChangeModal");
    decorationDetail.customerItems.companyNo = com.focusPage("#companyNo", "#customerChangeModal");
    decorationDetail.customerItems.companyName = com.focusPage("#companyName", "#customerChangeModal");
    decorationDetail.customerItems.companyAddr = com.focusPage("#companyAddr", "#customerChangeModal");
    decorationDetail.customerItems.companyPhone = com.focusPage("#companyPhone", "#customerChangeModal");
    decorationDetail.customerItems.companyBank = com.focusPage("#companyBank", "#customerChangeModal");
    decorationDetail.customerItems.companyBankno = com.focusPage("#companyBankno", "#customerChangeModal");
    decorationDetail.customerItems.savePhoneBtn = com.focusPage("#savePhoneBtn", "#customerChangeModal");

    decorationDetail.customerAccountItems.type = com.focusPage("#detailAccountType", "#customerChangeModal");
    decorationDetail.customerAccountItems.no = com.focusPage("#detailAccountNo", "#customerChangeModal");
    decorationDetail.customerAccountItems.name = com.focusPage("#detailAccountName", "#customerChangeModal");
    decorationDetail.customerAccountItems.phone = com.focusPage("#detailAccountPhone", "#customerChangeModal");
    decorationDetail.customerAccountItems.address = com.focusPage("#detailAccountAddress", "#customerChangeModal");
    decorationDetail.customerAccountItems.bank = com.focusPage("#detailAccountBank", "#customerChangeModal");
    decorationDetail.customerAccountItems.bankno = com.focusPage("#detailAccountBankno", "#customerChangeModal");

    decorationDetail.userItems.saveUserBtn = com.focusPage("#saveUserBtn", "#decorationUserModal");

    decorationDetail.btnViewFlg = params.decoration.btnViewFlg == false ? true : false;
    decorationDetail.btnViewFlg == false ? com.focusPage('#btnDisplay').removeAttr("style", "display: none;") : com.focusPage('#btnDisplay').attr("style", "display: none;");

    com.post(api.ds.data, {}, function(res) {

        decorationDetail.relationshipTypes = [];
        $.each(res.relationshipType, function(i, k) {

            decorationDetail.relationshipTypes.push(k.key);
        });

        $.each(res.customerType, function(i, v) {

            decorationDetail.customerTypes[v.key] = v.value;
        });

        decorationDetail.customerItems.type.bindData(res.customerType, "key", "value", false);
        decorationDetail.customerItems.relationshipType.bindData(decorationDetail.relationshipTypes, "key", "value", false);

    }, null, false);

    decorationDetail.houseItems.no = com.focusPage("#no");
    decorationDetail.houseItems.rule = com.focusPage("#rule");

    com.initTypeahead('no', api.data.queryVillageForNameByPinyin, "pinyinName", {}, "autoFillKeyValue", "key", "value", function(list, key, value) {

        deleteVillageData("no");

        com.post(api.data.queryVillageByVid, {
            "village.no": key
        }, function(res) {

            decorationDetail.houseItems.rule.html("推荐楼牌号规则：" + (res.village.rule ? res.village.rule : "暂无推荐规则"));
        }, function() {

            com.show(com.warning, "楼盘信息不存在");
            key = "", value = "";
        }, false);

        return value;
    });

    decorationDetail.houseItems.built = com.focusPage("#built").on("blur", function(e) {

        deleteVillageData("built", decorationDetail.houseItems);
    });
    decorationDetail.houseItems.unit = com.focusPage("#unit").on("blur", function(e) {

        deleteVillageData("unit", decorationDetail.houseItems);
    });
    decorationDetail.houseItems.floor = com.focusPage("#floor").on("blur", function(e) {

        deleteVillageData("floor", decorationDetail.houseItems);
    });
    decorationDetail.houseItems.door = com.focusPage("#door").on("blur", function(e) {

        // 验证房产是否存在
        valiDateHouse(com.typeahead("no"), houseUtils.anytimevalidate(decorationDetail.houseItems, 0, false));
    });
    decorationDetail.houseItems.builtrule = com.focusPage("#builtrule");
    decorationDetail.houseItems.unitrule = com.focusPage("#unitrule");
    decorationDetail.houseItems.floorrule = com.focusPage("#floorrule");
    decorationDetail.houseItems.doorrule = com.focusPage("#doorrule");

    com.post(api.ds.building, {}, function(res) {

        decorationDetail.houseItems.builtrule.bindData(res.buildrule, "key", "value");
        decorationDetail.houseItems.unitrule.bindData(res.buildrule, "key", "value");
        decorationDetail.houseItems.floorrule.bindData(res.buildrule, "key", "value");
        decorationDetail.houseItems.doorrule.bindData(res.buildrule, "key", "value");
    }, null, false);

    // 申请活动
    decorationDetail.activity.activity = com.focusPage("#activity").on("change", function() {

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
                    activityItemName: activityItem.name + " 金额:" + activityItem.money,
                }

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
            return;
        }

        decorationUtils.createCounpon("things", "thingsType", "receiveType", "thingsVal");

        com.cleanItems(decorationDetail.decorationActivityItems);
    });

    com.focusPage("#couponsAdd").unbind().click(function() {

        if (com.validate("couponsInputs")) {
            return false;
        }

        decorationUtils.createCounpon("coupons", "couponsType", "receiveTypes", "couponsVal");

        com.cleanItems(decorationDetail.decorationActivityItems);
    });

    com.focusPage("#papersAdd").unbind().click(function() {

        if (com.validate("papersInputs")) {
            return false;
        }

        decorationUtils.createCounpon("papers", "papersType", "receiveTypess", "papersVal");

        com.cleanItems(decorationDetail.decorationActivityItems);
    });

    decorationDetail.activity.activity = com.focusPage("#activity");
    decorationDetail.activity.things = com.focusPage("#things");
    decorationDetail.activity.coupons = com.focusPage("#coupons");
    decorationDetail.activity.papers = com.focusPage("#papers");

    decorationDetail.decorationActivityItems.activityInfo = com.focusPage("#activityInfo");
    decorationDetail.decorationActivityItems.couponsType = com.focusPage("#couponsType");
    decorationDetail.decorationActivityItems.couponsVal = com.focusPage("#couponsVal");
    decorationDetail.decorationActivityItems.receiveType = com.focusPage("#receiveType");
    decorationDetail.decorationActivityItems.thingsType = com.focusPage("#thingsType");
    decorationDetail.decorationActivityItems.receiveTypes = com.focusPage("#receiveTypes");
    decorationDetail.decorationActivityItems.thingsVal = com.focusPage("#thingsVal");
    decorationDetail.decorationActivityItems.papersType = com.focusPage("#papersType");
    decorationDetail.decorationActivityItems.receiveTypess = com.focusPage("#receiveTypess");
    decorationDetail.decorationActivityItems.papersVal = com.focusPage("#papersVal");

    decorationDetail.activity.activityItemName = com.focusPage("#activityItemName");
    decorationDetail.activity.couponInfo = com.focusPage("#couponInfo");
    decorationDetail.activity.activityItemMoney = com.focusPage("#activityItemMoney");
    decorationDetail.activity.activityItemNum = com.focusPage("#activityItemNum");

    decorationDetail.activitys = com.focusPage("#activitys");
    decorationDetail.activityItems = com.focusPage("#activityItems");
    decorationDetail.activityPriceInfo = com.focusPage("#activityPriceInfo");
    decorationDetail.salesActivityItems = com.focusPage("#salesActivityItems");
    decorationDetail.memberActivityItems = com.focusPage("#memberActivityItems");

    decorationDetail.printPresignModal = com.focusPage("#printPresignModal");
    decorationDetail.printQuotationModal = com.focusPage("#printQuotationModal");
    decorationDetail.printQuotationCNModal = com.focusPage("#printQuotationCNModal");
    decorationDetail.quotationTotalPriceModal = com.focusPage("#quotationTotalPriceModal");
    decorationDetail.createServicetModal = com.focusPage("#createServicetModal");

    decorationDetail.QRcodeModal = com.focusPage("#QRcodeModal");

    decorationDetail.joinDecorationActivityModal = com.focusPage("#joinDecorationActivityModal");
    decorationDetail.applyDecorationActivityItemModal = com.focusPage("#applyDecorationActivityItemModal");

    decorationDetail.refundDecorationPaymentModal = com.focusPage("#refundDecorationPaymentModal");
    decorationDetail.serviceModal = com.focusPage("#serviceModal");
    decorationDetail.otherPaymentModal = com.focusPage("#otherPaymentModal");
    decorationDetail.customerChangeModal = com.focusPage("#customerChangeModal");
    decorationDetail.villageChangeModal = com.focusPage("#villageChangeModal");

    decorationDetail.decorationUserModal = com.focusPage("#decorationUserModal");

    // 参加活动
    decorationDetail.joinDecorationActivityModal.on('hide.bs.modal', function(e) {

        com.cleanItems(decorationDetail.decorationActivityItems);
        com.closeTip();
    });

    // 申领活动物品
    decorationDetail.applyDecorationActivityItemModal.on('hide.bs.modal', function(e) {

        com.cleanItems(decorationDetail.decorationActivityItems);
        com.closeTip();
    });

    // 退款款项信息
    decorationDetail.refundDecorationPaymentModal.on('hide.bs.modal', function(e) {

        com.cleanItems(decorationDetail.paymentItems);
        com.closeTip();
    });

    // 款项信息
    decorationDetail.otherPaymentModal.on('hide.bs.modal', function(e) {

        com.cleanItems(decorationDetail.paymentItems);
        com.closeTip();
    });

    // 客户信息修改
    decorationDetail.customerChangeModal.on('hide.bs.modal', function(e) {

        com.cleanItems(decorationDetail.customerItems);
        clearCustomerAccount();
        com.closeTip();
    });

    // 完成装修服务
    decorationDetail.serviceModal.on('hide.bs.modal', function(e) {

        com.cleanItems(decorationDetail.serviceItems);
        com.closeTip();
    });

    // 房产信息修改
    decorationDetail.villageChangeModal.on('hide.bs.modal', function(e) {

        com.cleanItems(decorationDetail.houseItems);
        com.closeTip();
    });

    decorationUtils.init();

    decorationDetail.orderId = params.decoration.orderId;
    decorationDetail.orderStatus = params.decoration.orderStatus;
    decorationDetail.orderType = params.decoration.orderType;
    decorationDetail.orderTypeness = params.decoration.orderTypeness;
    decorationDetail.versionId = params.decoration.versionId;

    decorationPayment.postParam.orderId = decorationDetail.orderId;
    decorationPayment.postParam["decorationPayment.decoration.orderId"] = decorationDetail.orderId;

    com.post(api.data.queryDecorationAtttype, {}, function(res) {

        $.each(res.decorationAtttypes, function(i, v) {

            if (v.status == 0) {
                decorationDetail.type[v.key] = v.type;
                decorationDetail.decorationAtttypes.push(v);
            }
        });

    }, null, false);

    decorationDetail.items.orderType.bindData(decorationDetail.decorationAtttypes, 'key', 'name');
    decorationDetail.items.houseType.bindData(constant.decoration().decoration.houseType.datas, 'key', 'value');
    decorationDetail.items.houseClass.bindData(constant.decoration().decoration.houseClass.datas, 'key', 'value');
    decorationDetail.items.grade.bindData(constant.decoration().decoration.grade.datas, 'key', 'value');

    decorationDetail.decorationOrderStatus = constant.decoration().decoration.status.keys;
    decorationDetail.typeness = constant.decoration().decoration.typeness.keys;
    decorationActivity.stateTypes = constant.decoration().decorationActivityItem.stateType.keys;
    decorationActivity.states = constant.decoration().decorationActivityItem.status.keys;
    decorationActivity.isStatus = constant.decoration().decorationActivityItem.isStatus.keys;
    decorationActivity.isAffirms = constant.decoration().decorationActivityItem.isAffirm.keys;

    decorationActivity.types = constant.information().awardStock.type.keys;
    salesActivityItem.salesActivityItemType = constant.sales().salesActivityItem.type.keys;

    com.post(api.ds.manifest, {}, function(res) {

        salesActivityItem.salesActivityItemState = res.salesActivityItemType.split("key", "value");
    }, null, false);

    com.post(api.data.queryConstructionNode, {}, function(res) {

        com.focusPage("#quotationCNSelect").bindData(res.constructionNodes, "cnid", "name");
    });

    com.initTypeahead('quoterId', api.personel.queryUserByPinyin, "pinyinName", {
        "user.status": 0,
        "departmentType.name": ""
    }, "autoFillKeyValue", "key", "value");
    com.initTypeahead('escorterId', api.personel.queryUserByPinyin, "pinyinName", {
        "user.status": 0,
        "departmentType.name": ""
    }, "autoFillKeyValue", "key", "value");
    com.initTypeahead('materialerId', api.personel.queryUserByPinyin, "pinyinName", {
        "user.status": 0,
        "departmentType.name": ""
    }, "autoFillKeyValue", "key", "value");
    com.initTypeahead('duUser', api.personel.queryUserByPinyin, "pinyinName", {
        "user.status": "0",
        "departmentType.name": ""
    }, "autoFillKeyValue", "key", "value");

    com.initTypeahead('no', api.data.queryVillageForNameByPinyin, "pinyinName", {}, "autoFillKeyValue", "key", "value");

    com.focusPage('#customerInfosBtn').on("click", function() {

        com.post(api.data.queryCustomerById, {
            "customer.cid": decorationDetail.customer.cid
        }, function(res) {

            decorationDetail.customer = res.customer;

            var customerPhone = "客户电话";

            com.showInfo("客户敏感信息", '邮箱 :' + decorationDetail.customer.email + '<br /> QQ :' + decorationDetail.customer.qq + '<br /> 微信 :' + decorationDetail.customer.wechat + '<br />  电话 : <span id = customerInfosPhone>' + customerPhone + '</span> <br />  客户类型 :' + decorationDetail.customer.relationshipType + '<br />');

            $('#customerInfosPhone').on("click", function() {

                var phoneInfo = $(this);

                if (![3, 7].contains(params.decoration.decoration.status)) {

                    com.post(api.decoration.queryDecorationInfoForCustomer, {
                        "decorationInfo.orderId": decorationDetail.orderId
                    }, function(res) {

                        customerPhone = res.decorationInfo.customerPhone;
                    }, null, false);

                    com.post(api.communion.addCustomerRecord, {
                        "customerRecord.cid": decorationDetail.customer.cid,
                        "customerRecord.type": 0
                    }, function(res) {

                    }, function(res) {

                    });
                } else {
                    com.post(api.data.queryCustomerForPhone, {
                        "customerPhone.cid": decorationDetail.customer.cid,
                        "customerPhone.cpid": 0,
                    }, function(res) {

                        phoneInfo.html(res.customer.phone);
                    });
                }

            });
        });

        return false;
    });

    // 参加活动 保存按钮
    com.focusPage("#submitDecorationActivityBtn").on("click", function() {

        if (com.validate("joinDecorationActivityModal")) {
            return;
        }

        var options = {
            "decorationActivity.orderId": decorationDetail.orderId,
            "decorationActivity.activity.aid": decorationDetail.decorationActivityItems.activityInfo.val(),
        };

        com.post(api.decoration.addDecorationActivity, options, function(res) {

            var decorationActivity = res.decorationActivity;

            decorationUtils.addDecorationActivityForDiv(decorationDetail.activitys, decorationActivity, activityBtnMethod);
        });

        decorationDetail.joinDecorationActivityModal.modal("hide");
    });

    // 申领活动物品 保存按钮
    com.focusPage("#submitDecorationActivityItemBtn").on("click", function() {

        var receiverId = com.focusPage("#approveActivityItemManSel").find('input:checked').attr('userid');

        if (receiverId == null || receiverId == "") {
            com.showAlert(com.error, "请选择审批人!");
            return;
        }

        if (decorationDetail.activity.things.html() == "" && decorationDetail.activity.coupons.html() == "" && decorationDetail.activity.papers.html() == "") {
            com.showAlert(com.error, "活动物品或券需要选择才能提交");
            return;
        }

        var submitFlag = true;

        var orderId = params.decoration.orderId;
        var activityName = decorationDetail.activity.activity.find("option:selected").text();
        var activityId = com.focusPage("#activity").val();

        var index = 0;

        var options = {
            "approval.receiver.userId": receiverId,
            "approval.comment": "",
            "approvalDecorationActivity.activityId": activityId,
            "approvalDecorationActivity.orderId": orderId,
            "approvalDecorationActivity.activityName": activityName,
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

        decorationDetail.applyDecorationActivityItemModal.modal("hide");
    });

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

            decorationDetail.decorationActivityItems.activityInfo.bindData(activityData, "aid", "activityName", "money", false);
        });

        decorationDetail.joinDecorationActivityModal.modal("show");
    });

    // 申领活动物品
    com.focusPage("#applyActivityItemBtn").on("click", function() {

        com.focusPage("#things").html("");
        com.focusPage("#coupons").html("");
        com.focusPage("#papers").html("");

        var options = {
            "decorationActivity.orderId": decorationDetail.orderId
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

            decorationDetail.activity.activity.bindData(decorationActivityData, "aid", "activityName", false);
        }, null, false);

        approvalUtils.initqueryApprovalUser("approveActivityItemManSel", 8);

        binding("receiveType");
        binding("receiveTypes");
        binding("receiveTypess");

        decorationDetail.applyDecorationActivityItemModal.modal("show");
    });

    com.focusPage("#companyAd").hide();
    com.focusPage("#comNo").hide();

    decorationDetail.customerItems.type.change(function() {

        var type = $(this).val();

        com.focusPage("#comName").text(decorationDetail.customerTypes[type] + "名称");
        com.focusPage("#comPhone").text(decorationDetail.customerTypes[type] + "电话");

        if (type == 1) {
            com.focusPage(".companyitem", "#customerChangeModal").show();
        } else {
            com.focusPage(".companyitem", "#customerChangeModal").hide();
        }

    });

    decorationDetail.items.decorationDiscount.change(function() {

        if (decorationDetail.orderType != 0)
            return false;

        var id = $(this).val();
        var decorationMaching = decorationMachingTypes[id];

        if (!decorationMaching) {
            com.focusPage("#forMaterialPrice").addClass('hide');
            return false;
        }

        decorationDetail.paymentItems.materialPrice.val(0);

        if (decorationMaching.material == 0) {
            com.focusPage("#forMaterialPrice").removeClass('hide');
        } else {
            com.focusPage("#forMaterialPrice").addClass('hide');
        }

    });

    decorationDetail.modal = com.focusPage("#customerChangeModal").on('hide.bs.modal', function(e) {

        com.clearValidator();
        com.cleanItems(decorationDetail.customerItems);
        clearCustomerAccount();

        com.focusPage(".companyitem", "#customerChangeModal").hide();
    });

    com.focusPage('#customerChangeBtn').on("click", function() {

        com.clearValidator();
        refreshCustomerInformation(decorationDetail.customer.cid, 1);

        decorationDetail.customerChangeModal.modal("show");
    });

    com.focusPage('#typeChangeBtn').on("click", function() {

        com.clearValidator();
        updateBaseDecorationInfo(com.focusPage("#typeChangeBtn"), "typeness");
    });

    com.focusPage('#notSalesmanRateChangeBtn').on("click", function() {

        com.clearValidator();
        updateBaseDecorationInfo(com.focusPage("#notSalesmanRateChangeBtn"), "notSalesmanRate");
    });

    com.focusPage("#cSaveBtn").on("click", function() {

        saveCustomer();
    });

    com.focusPage("#savePhoneBtn").on("click", function() {

        saveCustomerPhone(decorationDetail.customer.cid, decorationDetail.customerItems.addphone.val());
    });

    com.focusPage("#addphone").on("blur", function() {

        checkPhone(decorationDetail.customer.cid, com.focusPage("#addphone"));
    });

    com.focusPage("#addCustomerAccountBtn", "#customerChangeModal").on("click", function() {

        clearCustomerAccount();
        com.focusPage("#customerAccountForm", "#customerChangeModal").removeClass("hide");
    });

    com.focusPage("#cancelCustomerAccountBtn", "#customerChangeModal").on("click", function() {

        clearCustomerAccount();
    });

    com.focusPage("#saveCustomerAccountBtn", "#customerChangeModal").on("click", function() {

        saveCustomerAccount();
    });

    com.focusPage("#saveUserBtn").on("click", function() {

        saveDecorationUser();
    });

    com.focusPage('#villageChangeBtn').on("click", function() {

        clearHouse();
        decorationDetail.villageChangeModal.modal("show");
    });

    // 点击生成款项按钮
    com.focusPage("#btnSetDecorationPaymentInfo").on('click', function(res) {

        com.clearValidator();

        if ([0, 2].indexOf(decorationDetail.orderType) != -1) { // 半包/半价/满减/捡捡
            com.post(api.data.queryDecorationMatching, {
                "typeness[0]": decorationDetail.orderTypeness
            }, function(res) {

                var machingType = [];

                $.each(res.decorationMatchings, function(i, v) {

                    if ((v['vision'] & 4) != 4)
                        return;

                    decorationMachingTypes[v.dmid] = v;
                    machingType.push(v);
                });

                decorationDetail.items.decorationDiscount.bindData(machingType, "dmid", "name", "请选择");
            });
        }

        var orderType = com.focusPage('#detailOrderType').attr("orderType");
        decorationDetail.items.detailOrderType.html(decorationDetail.typeness[orderType]);
        decorationDetail.items.detailHouseType.html(com.focusPage('#detailHouseType').attr("houseType"));

        if (decorationDetail.orderType == 2) {
            com.focusPage('#forDiscount').removeClass('hide');
        } else if (decorationDetail.orderType == 0) {
            com.focusPage('#forDiscount').removeClass('hide');
            com.focusPage("#forMaterialPrice").addClass('hide');
        }

        com.post(api.data.queryPaymentScale, {
            "paymentScale.psid": 0,
            "paymentScale.atttype": 1
        }, function(res) {

            com.focusPage("#paymentScale").empty();

            $.each(res.paymentScales, function(i, v) {

                if (v.status != 0)
                    return true;

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

    // 点击生成服务款按钮
    com.focusPage("#btnCreateService").on('click', function(res) {

        decorationDetail.paymentItems.collectMoney.val(0);
        decorationDetail.createServicetModal.modal("show");
    });

    queryPaymentType({
        "paymentType.type": 1,
        "paymentType.atttype": 0
    });

    queryPaymentType({
        "paymentType.type": 1,
        "paymentType.atttype": 3
    });

    com.focusPage("#btnOtherPayment").on('click', function(res) {

        decorationDetail.paymentItems.otherPaymentType.bindData(decorationDetail.paymentTypes, "ptid", "name", "请选择");

        decorationDetail.otherPaymentModal.modal("show");
    });

    decorationDetail.paymentItems.otherPaymentType.on("change", function(res) {

        var paymentScaleItem;

        decorationDetail.paymentItems.otherPayment.attr("readonly", "readonly");
        decorationDetail.paymentItems.otherPayment.val("");

        com.post(api.data.queryPaymentScaleItem, {
            "paymentScaleItem.ptid": decorationDetail.paymentItems.otherPaymentType.val(),
            "paymentScale.typeness": params.decoration.decoration.typeness,
            "paymentScale.atttype": 0,
            "paymentScale.dbid": params.decoration.decoration.busitype,
        }, function(res) {

            paymentScaleItem = res.paymentScaleItem;

            if (!paymentScaleItem || !paymentScaleItem.psiid) {
                decorationDetail.paymentItems.otherPayment.removeAttr("readonly");
                return false;
            }

        }, null, false);

        if (decorationDetail.orderType == 0) {

            com.post(api.decoration.queryDecorationMidpack, {
                "decorationMidpack.decoration.orderId": decorationDetail.orderId
            }, function(res) {

                var decorationMidpack = res.decorationMidpack;

                if (!paymentScaleItem || !paymentScaleItem.scale)
                    return false;

                if (!decorationMidpack || !decorationMidpack.dmid) {
                    decorationDetail.paymentItems.otherPayment.removeAttr("readonly");
                    return false;
                }

                decorationDetail.paymentItems.otherPayment.val(parseInt(utils.accMul(decorationMidpack.materialPrice, utils.accDiv(paymentScaleItem.scale, 100))));

            }, null, false);

        } else if (decorationDetail.orderType == 1) {
            decorationDetail.paymentItems.otherPayment.removeAttr("readonly");
        } else if (decorationDetail.orderType == 2) {

            com.post(api.decoration.queryDecorationHolonomy, {
                "decorationHolonomy.decoration.orderId": decorationDetail.orderId
            }, function(res) {

                var decorationHolonomy = res.decorationHolonomy;

                if (!paymentScaleItem || !paymentScaleItem.scale)
                    return false;

                if (!decorationHolonomy || !decorationHolonomy.dhid) {
                    decorationDetail.paymentItems.otherPayment.removeAttr("readonly");
                    return false;
                }

                decorationDetail.paymentItems.otherPayment.val(parseInt(utils.accMul(decorationHolonomy.materialPrice, utils.accDiv(paymentScaleItem.scale, 100))));

            }, null, false);
        }

    });

    com.focusPage("#serviceSaveBtn").on('click', function(res) {

        if (com.validate("serviceModal")) {
            return;
        }

        var options = {};
        options["decorationService.dsid"] = decorationDetail.dsid;
        options["decorationService.comment"] = decorationDetail.serviceItems.comment.val();

        com.post(api.decoration.completeDecorationService, options, function(res) {

            decorationUtils.initService(decorationDetail, decorationDetail.orderId);
            decorationDetail.serviceModal.modal("hide");
        });

    });

    com.focusPage("#saveRefundMoneyBtn").on('click', function(res) {

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

            com.showConfirm("确认要提交退款申请吗?", function() {

                com.post(api.approval.submitApprovalForDecorationRefund, options, function(res) {

                    com.showAlert(com.info, "提交成功");
                    decorationUtils.initPayment(decorationDetail, true);
                });

                decorationDetail.refundDecorationPaymentModal.modal("hide");
            });
        }

        com.focusPage('#changeReason').val("");
    });

    com.focusPage("#saveOtherPaymentBtn").on("click", function(res) {

        if (com.validate("otherPaymentModal")) {
            return false;
        }

        var options = {
            "decorationPayment.decoration.orderId": decorationDetail.orderId,
            "decorationPayment.paymentType": decorationDetail.paymentItems.otherPaymentType.find("option:selected").text(),
            "decorationPayment.ptid": decorationDetail.paymentItems.otherPaymentType.val(),
            "decorationPayment.referMoney": decorationDetail.paymentItems.otherPayment.val()
        };

        com.post(api.payment.addDecorationPayment, options, function(res) {

            decorationUtils.initPayment(decorationDetail, true);

            decorationDetail.otherPaymentModal.modal("hide");
        });
    });

    // 生成三笔款/四笔款
    com.focusPage("#saveGenerateDecorationPaymentBtn").bindClick(function(res) {

        if (com.validate("quotationTotalPriceModal")) {
            return false;
        }

        var psId = com.focusPage("#paymentScale").find('input:checked').attr('psid');

        if (psId == null || psId == "") {
            com.showAlert(com.warning, "请选择款项比例!");
            return false;
        }

        var options = {
            "decorationMidpack.decoration.orderId": decorationDetail.orderId,
            "decorationMidpack.psId": psId,
            "decorationMidpack.materialPrice": decorationDetail.paymentItems.materialPrice.val()
        };

        if (decorationDetail.orderType == 2) { // 半价/满减/捡捡

            var manageRate = 0;
            var trafficRate = 0;
            var taxRate = 0;
            // 通过订单编号获取默认报价信息
            com.post(api.quotation.queryQuotationForDefaultByOrderId, {
                "quotation.orderId": decorationDetail.orderId
            }, function(res) {

                if (res.quotation.manageRate != null && res.quotation.manageRate != 0) {
                    manageRate = res.quotation.manageRate;
                    trafficRate = res.quotation.trafficRate;
                    taxRate = res.quotation.taxRate;
                } else {
                    // 通过报价版本编号查询版本信息
                    com.post(api.quotation.queryQuotationVersionByVersionId, {
                        "quotationVersion.versionId": decorationDetail.versionId
                    }, function(data) {

                        manageRate = data.quotationVersion.manageRate;
                        trafficRate = data.quotationVersion.trafficRate;
                        taxRate = data.quotationVersion.taxRate;
                    }, null, false);
                }
            }, function(e) {

                com.showAlert(com.error, e.errorMsg);
                return false;
            }, false);

            var id = decorationDetail.items.decorationDiscount.val();
            var decorationMaching = decorationMachingTypes[id];

            var serviceRate = decorationMaching.service;// 服务费配比
            var discountBase = decorationMaching.base;// 基数
            var maching = decorationMaching.material;
            var discount = decorationMaching.discount;
            var names = decorationMaching.name;
            var manageDiscount = decorationMaching.manageDiscount;
            var trafficDiscount = decorationMaching.trafficDiscount;
            var taxDiscount = decorationMaching.taxDiscount;

            if (decorationDetail.notSalesmanRate < 1) {
                manageRate = parseFloat(manageRate) + parseFloat(decorationDetail.notSalesmanRate);
            } else {
                manageRate = parseFloat(manageRate);
            }

            options = {
                "decorationHolonomy.decoration.orderId": decorationDetail.orderId,
                "decorationHolonomy.maching": maching, // 主材配比
                "decorationHolonomy.discount": discount,// 折扣
                "decorationHolonomy.manageRate": manageRate,// 管理费比例 非提比例
                "decorationHolonomy.serviceRate": serviceRate,// 服务费配比
                "decorationHolonomy.status": 0,
                "decorationHolonomy.psId": psId,
                "decorationHolonomy.discountBase": discountBase,
                "decorationHolonomy.name": names,
                "decorationHolonomy.manageDiscount": manageDiscount,
                "decorationHolonomy.trafficRate": trafficRate,
                "decorationHolonomy.trafficDiscount": trafficDiscount,
                "decorationHolonomy.taxRate": taxRate,
                "decorationHolonomy.taxDiscount": taxDiscount,
            };

            com.post(api.decoration.makeDecorationHolonomy, options, function(res) {

                com.showAlert(com.info, "保存成功");

                res = res.decorationHolonomy;
                com.focusPage('#projectPrice').html(utils.changeTwoDecimal(utils.accAdd(res.projectPrice, res.managePrice)));
                com.focusPage('#managePrice').html(res.managePrice);
                com.focusPage('#materialPrice').html(res.materialPrice);
                com.focusPage('#servicePrice').html(res.servicePrice);
                com.focusPage('#quotationPrice').html(utils.changeTwoDecimal(res.projectBase));
                var materialPercent = utils.accMul(utils.changeThrDecimal(utils.accDiv(res.materialPaidup == null ? 0 : res.materialPaidup, res.materialPrice)), 100);
                com.focusPage('#materialPercent').html(materialPercent > 100 ? 100 : materialPercent + "%");
                var servicePercent = utils.accMul(utils.changeThrDecimal(utils.accDiv(res.servicePaidup == null ? 0 : res.servicePaidup, res.servicePrice)), 100);
                com.focusPage('#servicePercent').html(servicePercent > 100 ? 100 : servicePercent + "%");

                decorationUtils.initPayment(decorationDetail, true);

            }, function(e) {

                com.showAlert(com.error, e.errorMsg);
            });

        } else if (decorationDetail.orderType == 1) {

            options = {
                "decorationInclusive.decoration.orderId": decorationDetail.orderId,
                "decorationInclusive.psId": psId,
            };

            com.post(api.decoration.makeDecorationInclusive, options, function(res) {

                com.showAlert(com.info, "保存成功");

                res = res.decorationInclusive;

                com.focusPage('#contractPrice').html(res.contractPrice);
                com.focusPage('#projectPrice').html(res.projectPrice);
                com.focusPage('#cdiff').html(res.cdiff);
                com.focusPage('#mdiff').html(res.mdiff);
                com.focusPage('#managePrice').html(res.managePrice);
                com.focusPage('#materialPaidup').html(res.materialPaidup);

                decorationUtils.initPayment(decorationDetail, true);
            }, function(e) {

                com.showAlert(com.error, e.errorMsg);
            });

        } else {

            var id = decorationDetail.items.decorationDiscount.val();
            var decorationMaching = decorationMachingTypes[id];

            options["decorationMidpack.materialRate"] = decorationMaching.material;
            options["decorationMidpack.serviceRate"] = decorationMaching.service;

            com.post(api.decoration.makeDecorationMidpack, options, function(res) {

                com.showAlert(com.info, "保存成功");
                decorationUtils.initPayment(decorationDetail, true);
            });
        }

        decorationDetail.quotationTotalPriceModal.modal("hide");
    }, 3000);

    // 生成服务款
    com.focusPage("#saveGenerateCreateServicetBtn").bindClick(function(res) {

        com.clearValidator();

        if (com.validate("createServicetModal")) {
            return false;
        }

        var options = {
            "servicePayment.decoration.orderId": decorationDetail.orderId,
            "servicePayment.referMoney": decorationDetail.paymentItems.collectMoney.val()
        };

        com.post(api.payment.makeServicePayment, options, function(res) {

            com.showAlert(com.info, "创建成功");
            searcher.doSearch();
        });
        decorationDetail.createServicetModal.modal("hide");
    }, 3000);

    com.focusPage('#btnBack').on("click", function() {

        com.switchPage(params.historyPage);
    });

    com.focusPage("#btnPrintDefaultQuotationInfo").on('click', function(res) {

        decorationDetail.printQuotationModal.modal("show");
    });

    com.focusPage("#btnPrintQuotationCN").on('click', function(res) {

        decorationDetail.printQuotationCNModal.modal("show");
    });

    com.focusPage("#preferBtn").on("click", function() {

        var quotationPrefer = quotationUtils.quotationDetail.quotationPrefer;

        com.focusPage('#produce').val(com.checkNull(quotationPrefer.ppid, 0));
        com.focusPage('#prefer').val(com.checkNull(quotationPrefer.preferPrice, 0));
        com.focusPage('#manage').val(com.checkNull(quotationPrefer.managePrefer, 0));
        com.focusPage('#advance').val(com.checkNull(quotationPrefer.advancePrefer, 0));

        var protation = {
            "quotePrice": 1,
            "preferPrice": 0,
            "managePrice": 0,
            "manageProfit": 0
        };

        com.post(api.quotation.queryProtationForDefaultByOrderId, {
            "protation.orderId": decorationDetail.orderId
        }, function(res) {

            if (res.protation.pid)
                protation = res.protation;
        }, null, false);

        if (decorationDetail.orderType == constant.decoration().decoration.TYPE_INCLUSIVE_INT) {

            _discountValue = utils.changeThrDecimal(utils.accDiv(utils.accSub(protation.quotePrice, protation.preferPrice), protation.quotePrice));
            _manageDiscountValue = utils.changeThrDecimal(utils.accDiv(utils.accSub(protation.managePrice, protation.manageProfit), protation.managePrice));
        } else {

            _discountValue = quotationPrefer.discount;
            _manageDiscountValue = quotationPrefer.manageDiscount;
        }

        _discountValue = _discountValue < 0 ? 0 : _discountValue > 1 ? 1 : _discountValue;
        _manageDiscountValue = _manageDiscountValue < 0 ? 0 : _manageDiscountValue > 1 ? 1 : _manageDiscountValue;

        if (_discountValue == 10) {
            com.focusPage('#prefer').attr("disabled", "disabled");
        } else {
            com.focusPage('#prefer').removeAttr("disabled");
        }

        if (_manageDiscountValue == 10) {
            com.focusPage('#manage').attr("disabled", "disabled");
        } else {
            com.focusPage('#manage').removeAttr("disabled");
        }

        com.focusPage("#quotationPreferModal").modal("show");
    });

    com.focusPage("#btnPrintPresignInfo").on('click', function(res) {

        decorationDetail.printPresignModal.modal("show");
    });

    com.focusPage("#btnDecorationUser").on('click', function(res) {

        com.clearValidator();
        com.cleanTypeahead('duUser');
        com.cleanTypeahead('duContent');
        com.focusPage("#duUser").removeAttr('readonly');
        decorationDetail.decorationUser.status = 0;
        decorationDetail.decorationUserModal.modal("show");
    });

    com.focusPage("#btnPrintDefaultSelectInfo").on('click', function(res) {

        com.post(api.quotation.querySelectionByOrderId, {
            "selection.orderId": decorationDetail.orderId
        }, function(res) {

            params.selection = res.selection;

            com.popup("打印选材", api.index.selectionOutputIndex.url, null, null, true);
        }, null, false);
    });

    initWizard(decorationDetail);

    // 装修合同方案二维码按钮
    com.focusPage("#confirmDesignQRCode").on("click", function() {

        showQRCode(1);
    });

    // 放线方案确认二维码按钮
    com.focusPage("#confirmPrictureQRCode").on("click", function() {

        showQRCode(2);
    });

    // 交接单按钮
    com.focusPage("#handoverProfileBtn").on("click", function() {

        var template = null;

        com.post(api.system.querySystemConfigByKey, {
            "systemConfig.key": "QUOTATION_PROFILE_TEMPLATE"
        }, function(res) {
            template = res.systemConfig.value;
        }, null, false);

        if (!template) {
            com.showAlert(com.error, "交接单模板未配置");
            return;
        }

        com.popup4page("#layerPopUp4detail", api.index.quotationProfile4detailIndex.url, "交接单", null, null, function() {

            params.quotation = { orderId: params.decoration.orderId, type: 3, profile: { type: 3 } };
        });
    });

    // 报价标签按钮
    com.focusPage("#quotationTagProfileBtn").on("click", function() {

        var template = null;

        com.post(api.system.querySystemConfigByKey, {
            "systemConfig.key": "QUOTATION_TAG_PROFILE_TEMPLATE"
        }, function(res) {
            template = res.systemConfig.value;
        }, null, false);

        if (!template) {
            com.showAlert(com.error, "报价标签模板未配置");
            return;
        }

        com.popup4page("#layerPopUp4detail", api.index.quotationProfile4detailIndex.url, "报价标签", null, null, function() {

            params.quotation = { orderId: params.decoration.orderId, type: 4, profile: { type: 4 } };
        });
    });

    // 放线标签按钮
    com.focusPage("#drawlineTagProfileBtn").on("click", function() {

        var template = null;

        com.post(api.system.querySystemConfigByKey, {
            "systemConfig.key": "DRAWLINE_TAG_PROFILE_TEMPLATE"
        }, function(res) {
            template = res.systemConfig.value;
        }, null, false);

        if (!template) {
            com.showAlert(com.error, "放线标签模板未配置");
            return;
        }

        com.popup4page("#layerPopUp4detail", api.index.drawlineProfile4detailIndex.url, "放线标签", null, null, function() {

            params.drawlineProfile = { orderId: params.decoration.orderId, type: 4, profile: { type: 4 } };
        });
    });

    // ==================== 分配沟通功能（popup4page加载独立页面） ====================

    com.focusPage("#assignTalkBtn").on("click", function() {
        var orderId = decorationDetail.orderId;
        if (!orderId) {
            com.showAlert(com.warning, '装修单号不存在');
            return;
        }
        params.quotationAssignTalk = { orderId: orderId };
        com.popup4page("#layerPopUp4talkDecoration", api.index.quotationAssignTalkIndex.url, "分配沟通");
    });

    decorationUtils.initBaseInfo(decorationDetail.orderId, api.decoration.queryDecorationForCommonByOrderId, function(decoration) {

        decorationDetail.items.orderId.val(decoration.orderId);
        decorationDetail.items.customer.val(decoration.customer.name);
        decorationDetail.items.villageName.val(decoration.house.village.name);
        decorationDetail.items.houseNumber.val(decoration.house.houseNumber);
        decorationDetail.items.designDepartment.val(decoration.designer.dept.name);
        decorationDetail.items.designer.val(decoration.designer.currentName);
        decorationDetail.items.businessDepartment.val(decoration.salesman.dept.name);
        decorationDetail.items.salesman.val(decoration.salesman.currentName);
        decorationDetail.items.orderType.val(decoration.typeness);
        decorationDetail.items.houseType.val(decoration.houseType);
        decorationDetail.items.houseClass.val(decoration.houseClass);
        decorationDetail.items.houseTypeClass.val(decoration.house.houseType);
        decorationDetail.items.houseArea.val(decoration.house.buildArea);
        decorationDetail.items.freeArea.val(decoration.house.freeArea);
        decorationDetail.items.innerArea.val(decoration.house.innerArea);
        decorationDetail.items.totalArea.val(decoration.house.totalArea);
        decorationDetail.items.status.val(decorationDetail.decorationOrderStatus[decoration.status]);
        decorationDetail.items.measureTime.val(decoration.measureTime);
        decorationDetail.items.notSalesmanRate.val(decoration.notSalesmanRate);
        decorationDetail.notSalesmanRate = decoration.notSalesmanRate;
        decorationDetail.items.grade.val(decoration.grade);
        decorationDetail.items.quoterId.val(decoration.quoter.currentName);
        decorationDetail.items.escorterId.val(decoration.escorter.currentName);
        decorationDetail.items.materialerId.val(decoration.materialer.currentName);

        com.post(api.data.queryDecorationBusitype, {}, function(res) {

            $.each(res.decorationBusitypes, function(intex, value) {

                if (value.status == 0) {
                    decorationDetail.decorationBusitypes.push(value);
                } else if (value.dbid == decoration.busitype) {
                    decorationDetail.decorationBusitypes.push(value);
                }
            });
            decorationDetail.items.busitype.bindData(decorationDetail.decorationBusitypes, "dbid", "name");
        }, null, false);

        decorationDetail.items.busitype.val(decoration.busitype);

        com.focusPage("#detailOrderType").attr("orderType", decoration.typeness);
        com.focusPage("#detailHouseType").attr("houseType", decoration.houseType);
        com.focusPage('#designStatus').html(decoration.sourceStatus == 0 ? '未确认' : '已确认');
        com.focusPage('#prictureStatus').html(decoration.sourceStatus != 2 ? '未确认' : '已确认');

        if (decoration.status != 7) {
            decorationDetail.accountFlg = true;
        } else {
            decorationDetail.accountFlg = false;
        }

        com.post(api.decoration.queryDecorationInfoByOrderId, {
            "decorationInfo.orderId": decorationDetail.orderId
        }, function(res) {

            res = res.decorationInfo;
            decorationDetail.items.backOrderName.val(res.backOrderName);
            decorationDetail.items.backOrderPhone.val(res.backOrderPhone);
            decorationDetail.items.backOrderContent.val(res.backOrderContent);
            decorationDetail.items.notSalesmanPhone.val(res.notSalesmanPhone);
            decorationDetail.items.notSalesmanName.val(res.notSalesmanName);
            decorationDetail.items.notSalesmanContent.val(res.notSalesmanContent);
        });

        decorationDetail.houseItems.shid = decoration.house.hid;

        com.updateTypeahead('quoterId', decoration.quoter == null ? "" : decoration.quoter.userId, decoration.quoter.currentName == null ? "" : decoration.quoter.currentName);
        com.updateTypeahead('escorterId', decoration.escorter == null ? "" : decoration.escorter.userId, decoration.escorter.currentName == null ? "" : decoration.escorter.currentName);
        com.updateTypeahead('materialerId', decoration.materialer == null ? "" : decoration.materialer.userId, decoration.materialer.currentName == null ? "" : decoration.materialer.currentName);

        decorationDetail.customer.cid = decoration.customer.cid;
        decorationDetail.customer.phone = decoration.customer.phone;
        decorationDetail.customer.qq = decoration.customer.qq;
        decorationDetail.customer.wechat = decoration.customer.wechat;
        decorationDetail.customer.email = decoration.customer.email;
        decorationDetail.customer.relationshipType = decoration.customer.relationshipType;

        decorationDetail.village.villageId = decoration.house.village.villageId;
        decorationDetail.village.villageName = decoration.house.village.villageName;
        decorationDetail.village.houseNumber = decoration.house.houseNumber;

        decorationDetail.decoration.type = decoration.typeness;

        if ([0, 1, 4].indexOf(decoration.status) == -1) {
            decorationDetail.items.orderType.prop("disabled", true);
            com.focusPage("#typeChangeBtn").hide();
        }

        if ([2, 3, 4, 6, 7].indexOf(decoration.status) == -1) {
            decorationDetail.items.houseNumber.val("");
        }

        if ([3, 7].indexOf(decoration.status) != -1) {
            decorationDetail.items.busitype.prop("disabled", true);
        }
    });

    function refreshCustomerInformation(cid, type) {

        com.post(api.data.queryCustomerById, {
            "customer.cid": cid
        }, function(res) {

            res = res.customer;

            if (type == 2)
                decorationDetail.items.customer.val(res.name);

            decorationDetail.customerItems.customerName.val(res.name);
            decorationDetail.customerItems.identity.val(res.identity);
            decorationDetail.customerItems.officer.val(res.officer);
            decorationDetail.customerItems.passport.val(res.passport);
            decorationDetail.customerItems.passhkm.val(res.passhkm);
            decorationDetail.customerItems.qq.val(res.qq);
            decorationDetail.customerItems.wechat.val(res.wechat);
            decorationDetail.customerItems.email.val(res.email);
            decorationDetail.customerItems.career.val(res.career);
            decorationDetail.customerItems.address.val(res.address);
            decorationDetail.customerItems.relationshipType.val(res.relationshipType);
            decorationDetail.customerItems.gender.prop('checked', com.genderType[res.gender]);
            decorationDetail.customerItems.type.val(res.type);
            decorationDetail.customerItems.companyNo.val(res.companyNo);
            decorationDetail.customerItems.companyName.val(res.companyName);
            decorationDetail.customerItems.companyAddr.val(res.companyAddr);
            decorationDetail.customerItems.companyPhone.val(res.companyPhone);
            decorationDetail.customerItems.companyBank.val(res.companyBank);
            decorationDetail.customerItems.companyBankno.val(res.companyBankno);

            com.focusPage("#comName").text(decorationDetail.customerTypes[res.type] + "名称");
            com.focusPage("#comPhone").text(decorationDetail.customerTypes[res.type] + "电话");

            if (res.type == 1) {
                com.focusPage(".companyitem", "#customerChangeModal").show();
            }

            decorationDetail.customer.status = res.status;

            if (res.status != 0) {
                decorationDetail.customerItems.customerName.attr("readonly", "readonly");
                decorationDetail.customerItems.gender.prop("disabled", true);
                decorationDetail.customerItems.identity.attr("readonly", "readonly");
                decorationDetail.customerItems.officer.attr("readonly", "readonly");
                decorationDetail.customerItems.passport.attr("readonly", "readonly");
                decorationDetail.customerItems.passhkm.attr("readonly", "readonly");
                decorationDetail.customerItems.qq.attr("readonly", "readonly");
                decorationDetail.customerItems.wechat.attr("readonly", "readonly");
                decorationDetail.customerItems.email.attr("readonly", "readonly");
                decorationDetail.customerItems.career.attr("readonly", "readonly");
                decorationDetail.customerItems.relationshipType.prop("disabled", true);
                decorationDetail.customerItems.address.attr("readonly", "readonly");
                decorationDetail.customerItems.type.prop("disabled", true);
            } else {
                decorationDetail.customerItems.customerName.removeAttr('readonly');
                decorationDetail.customerItems.gender.removeAttr('disabled');
                decorationDetail.customerItems.identity.removeAttr('readonly');
                decorationDetail.customerItems.officer.removeAttr('readonly');
                decorationDetail.customerItems.passport.removeAttr('readonly');
                decorationDetail.customerItems.passhkm.removeAttr('readonly');
                decorationDetail.customerItems.qq.removeAttr('readonly');
                decorationDetail.customerItems.wechat.removeAttr('readonly');
                decorationDetail.customerItems.email.removeAttr('readonly');
                decorationDetail.customerItems.career.attr("readonly");
                decorationDetail.customerItems.relationshipType.removeAttr('disabled');
                decorationDetail.customerItems.address.removeAttr('readonly');
                decorationDetail.customerItems.type.removeAttr('disabled');
            }
            ;

        });

        com.post(api.data.queryCustomerPhoneByCid, {
            "customerPhone.cid": decorationDetail.customer.cid
        }, function(res) {

            showPhone('phoneList', res.customerPhones);
        }, null, false);

        queryCustomerAccount(decorationDetail.customer.cid);
    }

    function saveBaseDecorationInfo() {

        if (com.validate("step0")) {
            return;
        }

        var btn = com.focusPage("#btnSaveBasedecorationInfo");

        btn.button('loading');

        com.showConfirm("确定要保存基本信息吗?", function() {

            var options = {
                "decoration.orderId": decorationDetail.orderId,
                "decoration.houseType": decorationDetail.items.houseType.val(),
                "decoration.houseClass": decorationDetail.items.houseClass.val(),
                "decorationInfo.notSalesmanName": decorationDetail.items.notSalesmanName.val(),
                "decorationInfo.notSalesmanPhone": decorationDetail.items.notSalesmanPhone.val(),
                "decorationInfo.notSalesmanContent": decorationDetail.items.notSalesmanContent.val(),
                "decoration.busitype": decorationDetail.items.busitype.val(),
                "decoration.house.buildArea": decorationDetail.items.houseArea.val(),
                "decoration.house.innerArea": decorationDetail.items.innerArea.val(),
                "decoration.quoter.userId": com.typeahead("quoterId"),
                "decoration.escorter.userId": com.typeahead("escorterId"),
                "decoration.materialer.userId": com.typeahead("materialerId"),
            };

            com.post(api.decoration.changeDecorationForAdvance, options, function() {

                com.showAlert(com.info, "操作成功");
                btn.button('reset');
            });

        }, function() {

            btn.button('reset');
        });
    }

    function updateBaseDecorationInfo(btn, type) {

        if (com.validate("step0")) {
            return;
        }

        var prompt;

        var options = {
            "decoration.orderId": decorationDetail.orderId
        };

        if (type == "typeness") {
            prompt = "确认更新订单类型";

            options["decoration.type"] = decorationDetail.type[decorationDetail.items.orderType.val()];
            options["decoration.typeness"] = decorationDetail.items.orderType.val();
        }

        if (type == "notSalesmanRate") {

            options["decoration.notSalesmanRate"] = decorationDetail.items.notSalesmanRate.val();

            if (decorationDetail.items.notSalesmanRate.val() > 0 && decorationDetail.items.notSalesmanRate.val() < 1) {
                prompt = "确认非业务人员提点方式";

            } else {
                prompt = "确认非业务人员提成方式";
            }
        }

        com.showConfirm(prompt, function() {

            com.post(api.decoration.updateDecorationForAdvance, options, function() {

                com.showAlert(com.info, "操作成功");
                btn.button('reset');
            });
        }, function() {

            btn.button('reset');
        });

    }

    function initWizard(decorationDetail) {

        var wizard = {
            "activityBtnMethod": null,
            "uiBtnMethod": null,
            "isDesign": false
        };

        switchNode(params.decoration.viewNode[0]);

        com.focusPage('#fuelux-wizard').ace_wizard({
            "status": true
        }).on('change', function(e, info) {

            var curstep = 0;

            info.direction === "previous" ? curstep = info.step - 1 : curstep = info.step;

            var node = params.decoration.viewNode[curstep];

            switchNode(node, wizard);
        }).on('stepclick', function(e, info) {

            var node = params.decoration.viewNode[info.step - 1];

            switchNode(node, wizard);
        }).on('previous', function(e, info) {

            ![3, 7].includes(decorationDetail.orderStatus) && info.step == 1 ? decorationDetail.btnSaveBasedecorationInfo.removeClass("hide") : decorationDetail.btnSaveBasedecorationInfo.addClass("hide");
        }).on('finished', function(e) {

            com.switchPage(params.historyPage);
        });
    }

    function switchNode(node, wizard) {

        switch (node.type) {

            case "quotation":
                quotationUtils.loadQuotationDetail();
                decorationUtils.initQuotationPrint(node);
                break;
            case "select":
                quotationUtils.loadQuotationDetail();
                quotationUtils.initSelectionDetail();
                break;
            case "presign":// 预签信息
                quotationUtils.initPresignDetail(decorationDetail.orderId);
                decorationUtils.initPresignPrint();
                break;
            case "picture":
                decorationUtils.initDecorationPicture("designPictures", "projectPictures", "CADProjectPicture", "ContractPictures", "OriginalPicture", "contractFiles", "designContractPicture", "selfiePicture", "drawingPicture", "livePicture", "720Files", decorationDetail.orderId);
                break;
            case "material":
                decorationUtils.initMaterial(decorationDetail);
                break;
            case "activity":

                if (!$.isEmptyObject(node.wizard))
                    $.extend(true, wizard, node.wizard);

                params.decoration.convertActivityItemId = decorationDetail.convertActivityItemId;// 全局变量活动
                params.decoration.activity = decorationDetail.activity;

                decorationUtils.decorationActivityInfo(decorationDetail.orderId, decorationDetail.activitys, wizard);
                decorationUtils.decorationActivityItemInfo(decorationDetail.orderId, decorationDetail.activityPriceInfo, decorationDetail.activityItems, decorationActivity, wizard);
                decorationUtils.salesActivityItemInfo(decorationDetail.orderId, decorationDetail.salesActivityItems, salesActivityItem, wizard);
                decorationUtils.memberActivityItemInfo(decorationDetail.orderId, decorationDetail.memberActivityItems, decorationActivity, wizard);

                break;
            case "belong":
                decorationUtils.initDecorationBelong(decorationDetail.orderId, 0);
                decorationUtils.initDecorationBelong(decorationDetail.orderId, 1);
                break;
            case "payment":

                if (!$.isEmptyObject(node.wizard))
                    $.extend(true, wizard, node.wizard);

                if (decorationDetail.orderType == 0) {
                    decorationUtils.initDecorationMidpack(decorationDetail, wizard);
                    decorationUtils.initServicePayment(decorationDetail, wizard);
                } else if (decorationDetail.orderType == 1) {
                    decorationUtils.initDecorationInclusive(decorationDetail, wizard);
                } else if (decorationDetail.orderType == 2) {
                    decorationUtils.initDecorationHolonomy(decorationDetail, wizard);
                    decorationUtils.initServicePayment(decorationDetail, wizard);
                }

                decorationUtils.initAdvancePayment(decorationDetail.orderId, wizard);

                decorationUtils.initPayment(decorationDetail, wizard["isDesign"]);

                break;
            case "addreduce":
                decorationUtils.initAddreduce(decorationDetail.orderId, decorationDetail.orderType);
                break;
            case "account":
                decorationUtils.initAccount(decorationDetail.orderId, decorationDetail.accountFlg);
                break;
            case "service":
                decorationUtils.initService(decorationDetail, decorationDetail.orderId);
                break;
            case "users":
                decorationUtils.initUsers(decorationDetail, decorationDetail.orderId);
                break;
        }
    }

    function showQRCode(type) {

        com.focusPage('#QRcode').html("");

        com.focusPage('#QRcode').qrcode({
            render: "canvas",
            width: 150,
            height: 150,
            text: " http://fanglin.vip/wx/drawLine?orderId=" + decorationDetail.orderId + "&type=" + type

        });

        decorationDetail.QRcodeModal.modal('show');

    }

    function activityBtnMethod(uiPgDiv, decorationActivity) {

        var deleteBtn = $("<a></a>").addClass("btn btn-minier btn-yellow").html("删除").css("margin", "0px 3px").attr("id", "delete_" + decorationActivity.daId).appendTo(uiPgDiv);

        deleteBtn.on("click", function() {

            if (com.focusPage("#dactivity_" + decorationActivity.daId).attr("status") == 0) {
                deleteDecorationActivity(decorationActivity.daId);
            }
        });
    }

    function deleteDecorationActivity(daId) {

        var options = {
            "decorationActivity.daId": daId,
        };

        com.post(api.decoration.deleteDecorationActivity, options, function(res) {

            com.focusPage("#dactivity_" + res.decorationActivity.daId).remove();
        });
    }

    function valiDateHouse(no, houseNumber) {

        if (no == "" || houseNumber == "") {
            return;
        }
        var options = {
            "house.village.no": no,
            "house.houseNumber": houseNumber.houseNumber,
            "house.status": 0
        };

        com.post(api.data.queryHouseByNoAHnum, options, function(res) {

            com.post(api.decoration.checkDecoration, {
                "decoration.house.hid": res.house.hid
            }, function(des) {

                if (des.decoration && des.decoration.orderId) {
                    com.showTips($("#door"), "装修单已存在:装修单号:" + des.decoration.orderId + " 所属设计师:" + des.decoration.designer.currentName, true);
                    decorationDetail.repeatFlg = true;

                } else {
                    com.showConfirm("已有该房产信息, 是否绑定?", function() {

                        decorationDetail.houseItems.thid = res.house.hid;
                        decorationDetail.houseItems.villageName = res.house.village.name;
                        decorationDetail.houseItems.houseNumber = res.house.houseNumber;
                        decorationDetail.repeatFlg = false;

                        com.post(api.decoration.changeDecorationForHouse, {
                            "decoration.orderId": decorationDetail.orderId,
                            "decoration.house.hid": decorationDetail.houseItems.thid
                        }, function(fes) {

                            com.showAlert(com.info, "操作成功");
                            decorationDetail.items.villageName.val(decorationDetail.houseItems.villageName);
                            decorationDetail.items.houseNumber.val(decorationDetail.houseItems.houseNumber);
                            decorationDetail.villageChangeModal.modal("hide");

                            var decorationData = {
                                "orderId": decorationDetail.orderId,
                                "houseId": res.house.hid,
                                "address": (res.house.village.cityProper.city.name == null ? " " : res.house.village.cityProper.city.name) + " " + (res.house.village.cityProper == null ? " " : res.house.village.cityProper.name) + " " + res.house.village.name + " " + (res.house.houseNumber == null ? " " : res.house.houseNumber),
                                "drganizationNo": params.company.drganization.no,
                                "drganizationName": params.company.drganization.name
                            };

                            kingdeeUtils.decoration(decorationData);
                        }, null, false);

                    });
                }
            }, null, false);
        }, function() {

            com.showAlert(com.warning, "房产不存在");
        }, false);
    }

    function queryCustomerAccount(cid, callback) {

        com.post(api.communion.queryCustomerAccount, {
            "customerAccount.cid": cid
        }, function(res) {

            showCustomerAccount(res.customerAccounts);

            callback && callback(res.customerAccounts || []);
        }, null, false);
    }

    function showCustomerAccount(listData) {

        com.focusPage('#customerAccountList', '#customerChangeModal').html(null);

        var $tableWrap = com.focusPage('#customerAccountList', '#customerChangeModal');
        var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');

        if (listData && listData.length) {
            $.each(listData, function(i, v) {

                createCustomerAccountLine($ul, v);
            });

            $ul.appendTo($tableWrap);
        } else {
            $('<div></div>').addClass('alert alert-info').css('margin', 0).html('暂无银行账户').appendTo($tableWrap);
        }
    }

    function createCustomerAccountLine($ul, v) {

        var $liLine = $('<li></li>').addClass('item-orange clearfix');
        var $h3 = $('<h3></h3>').addClass('oid');
        var $small = $('<small></small>').addClass('blue').html((v.type == 1 ? '对公' : '对私') + ' - ' + (v.name || '---')).appendTo($h3);
        var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
        var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

        if (v.defaults == 1) {
            $('<span></span>').addClass('label label-success').html('默认').appendTo($divBtnWrap);
        } else {
            $('<a></a>').addClass('btn btn-minier btn-success').html('设为默认').appendTo($divBtnWrap).click(function() {

                com.post(api.communion.setDefaultCustomerAccount, {
                    "customerAccount.caid": v.caid,
                    "customerAccount.cid": decorationDetail.customer.cid
                }, function() {

                    syncCustomerInfoByAccount(v);
                    queryCustomerAccount(decorationDetail.customer.cid);
                });
            });
        }

        $('<a></a>').addClass('btn btn-minier btn-yellow').html('编辑').appendTo($divBtnWrap).click(function() {

            editCustomerAccount(v);
        });

        if (v.defaults != 1) {
            $('<a></a>').addClass('btn btn-minier btn-danger').html('删除').appendTo($divBtnWrap).click(function() {

                com.showConfirm('确认删除该账户?', function() {

                    com.post(api.communion.deleteCustomerAccount, {
                        "customerAccount.caid": v.caid
                    }, function() {

                        queryCustomerAccount(decorationDetail.customer.cid);
                    });
                });
            });
        }

        var accountProps = [{
            name: '开户银行',
            value: v.bank || '---'
        }, {
            name: '银行账号',
            value: v.bankno || '---'
        }, {
            name: '证件号',
            value: v.no || '---'
        }, {
            name: '电话',
            value: v.phone || '---'
        }];

        $.each(accountProps, function(i, prop) {

            var $liProperty = $('<li></li>').appendTo($ulProperty);
            $('<strong></strong>').html(prop.name + ': ').appendTo($liProperty);
            $('<b></b>').addClass('grey').html(prop.value).appendTo($liProperty);
        });

        $divBtnWrap.appendTo($h3);
        $liLine.append($h3).append($ulProperty).appendTo($ul);
    }

    function syncCustomerInfoByAccount(account) {

        // 账户类型: 0=对私(个人), 1=对公(公司); 客户类型: 1=公司, 其他=个人
        decorationDetail.customerItems.type.val(account.type == 1 ? 1 : 0).trigger('change');

        decorationDetail.customerItems.companyNo.val(account.no || "");
        decorationDetail.customerItems.companyName.val(account.name || "");
        decorationDetail.customerItems.companyPhone.val(account.phone || "");
        decorationDetail.customerItems.companyAddr.val(account.address || "");
        decorationDetail.customerItems.companyBank.val(account.bank || "");
        decorationDetail.customerItems.companyBankno.val(account.bankno || "");
    }

    function editCustomerAccount(v) {

        decorationDetail.customerAccount.editFlag = true;
        decorationDetail.customerAccount.caid = v.caid;
        decorationDetail.customerAccount.defaults = v.defaults;

        decorationDetail.customerAccountItems.type.val(v.type);
        decorationDetail.customerAccountItems.no.val(v.no);
        decorationDetail.customerAccountItems.name.val(v.name);
        decorationDetail.customerAccountItems.phone.val(v.phone);
        decorationDetail.customerAccountItems.address.val(v.address);
        decorationDetail.customerAccountItems.bank.val(v.bank);
        decorationDetail.customerAccountItems.bankno.val(v.bankno);

        com.focusPage("#customerAccountForm", "#customerChangeModal").removeClass("hide");
    }

    function saveCustomerAccount() {

        if (com.validate('customerAccountForm')) {
            return false;
        }

        var url = api.communion.addCustomerAccount;
        var options = {
            "customerAccount.cid": decorationDetail.customer.cid,
            "customerAccount.type": decorationDetail.customerAccountItems.type.val(),
            "customerAccount.no": decorationDetail.customerAccountItems.no.val(),
            "customerAccount.name": decorationDetail.customerAccountItems.name.val(),
            "customerAccount.phone": decorationDetail.customerAccountItems.phone.val(),
            "customerAccount.address": decorationDetail.customerAccountItems.address.val(),
            "customerAccount.bank": decorationDetail.customerAccountItems.bank.val(),
            "customerAccount.bankno": decorationDetail.customerAccountItems.bankno.val()
        };

        if (decorationDetail.customerAccount.editFlag) {
            options["customerAccount.caid"] = decorationDetail.customerAccount.caid;
            url = api.communion.updateCustomerAccount;
        }

        com.post(url, options, function(res) {

            queryCustomerAccount(decorationDetail.customer.cid, function(accounts) {

                $.each(accounts, function(i, account) {

                    if (account.defaults == 1) {
                        syncCustomerInfoByAccount(account);
                        return false;
                    }
                });
            });

            clearCustomerAccount();
        });
    }

    function clearCustomerAccount() {

        decorationDetail.customerAccount.editFlag = false;
        decorationDetail.customerAccount.caid = null;

        com.cleanItems(decorationDetail.customerAccountItems);
        decorationDetail.customerAccountItems.type.val(1);

        com.focusPage("#customerAccountForm", "#customerChangeModal").addClass("hide");
    }

    function showPhone(tableId, listData) {

        com.focusPage('#' + tableId).html(null);

        var $tableWrap = com.focusPage('#' + tableId);
        var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');

        if (listData && listData.length) {
            $.each(listData, function(i, v) {

                createLine($ul, v);
            });

            $ul.appendTo($tableWrap);
        }

    }

    function createLine($ul, v) {

        var $liLine = $('<li></li>').addClass('item-blue clearfix');

        var $h3 = $('<h3></h3>').addClass('oid');

        var $small = $('<small></small>').addClass('blue').appendTo($h3);
        var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
        var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

        var $btnStauts = $('<input />').attr("type", "checkbox").prop("disabled", true).addClass('ace ace-switch ace-switch-5').attr("checked", v.status == 0 ? true : false);
        var $btnSpan = $('<span></span>').addClass("lbl status-lbl");

        $divBtnWrap.append($btnStauts).append($btnSpan).appendTo($h3);

        $liLine.append($h3).append($ulProperty);
        if (v.cpid == null) {
            $small.html(v.phone);
        } else {
            $small.html("客户电话");
            $small.one('click', function() {

                var phoneInfo = $(this);

                if (![3, 7].contains(params.decoration.decoration.status)) {

                    var resp = false;

                    com.post(api.decoration.queryDecorationInfoForCustomer, {
                        "decorationInfo.orderId": decorationDetail.orderId
                    }, function(res) {

                        customerPhone = res.decorationInfo.customerPhone;

                        phoneInfo.html(res.decorationInfo.customerPhone);

                        resp = true;
                    }, null, false);

                    if (!resp)
                        return false;

                    com.post(api.communion.addCustomerRecord, {
                        "customerRecord.cid": decorationDetail.customer.cid,
                        "customerRecord.type": 0
                    }, function(res) {

                    }, function(res) {

                    });
                } else {

                    com.post(api.data.queryCustomerForPhone, {
                        "customerPhone.cid": v.cid,
                        "customerPhone.cpid": v.cpid
                    }, function(res) {

                        phoneInfo.html(res.customerPhone.phone);
                    });
                }

                // $btnStauts.prop("disabled", false);
            });
        }

        $btnStauts.click(function() {

            if ($btnStauts.prop("checked")) {
                var option = {
                    "customerPhone.phone": v.phone,
                    "customerPhone.status": 0,
                    "customerPhone.cid": v.cid,
                    "customerPhone.cpid": v.cpid
                };
                // 先查询该电话是否被被人启用
                com.post(api.data.checkCustomerForPhone, option, function(res) {

                    updateCustomerPhoneForStatus(v.cpid, 0, function() {

                        $this.removeAttr("checked");
                    });
                }, function(res) {

                    com.showAlert(com.warning, "该电话已经被其他客户启用");
                    $btnStauts.prop("checked", false);
                }, false);
            } else {
                updateCustomerPhoneForStatus(v.cpid, 1, function() {

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
        }, function() {

        }, function(res) {

            callBack && callBack();
        }, null, false);
    }

    function saveCustomerPhone(cid, phone) {

        if (com.validate("customerForm") || decorationDetail.customer.repeatFlg) {
            return false;
        }

        if (com.focusPage("#addphone").val() == "" || com.focusPage("#addphone").val() == 0) {
            decorationDetail.customer.repeatFlg = true;
            return false;
        }

        var param = {
            "customerPhone.phone": phone,
            "customerPhone.cid": cid,
        };

        com.post(api.data.addCustomerPhone, param, function(res) {

            var $ul = com.focusPage('#phoneList').children('ul');
            res.customerPhone.status = 0;
            createLine($ul, res.customerPhone);
            decorationDetail.customerItems.addphone.val("");
        });
    }

    function checkPhone(cid, $id) {

        if ($id.val() == "") {
            decorationDetail.customer.repeatFlg = true;
        } else {
            com.post(api.data.checkCustomerForPhone, {
                "customerPhone.cid": null,
                "customerPhone.phone": $id.val(),
                "customerPhone.status": null
            }, function(res) {

                decorationDetail.customer.repeatFlg = false;
            }, function(res) {

                decorationDetail.customer.repeatFlg = true;

                com.showConfirm("电话信息已存在,确认要更改装修单归属客户吗?", function() {

                    var options = {
                        "decoration.orderId": decorationDetail.orderId,
                        "decoration.customer.cid": res.customerPhone.cid
                    };

                    com.post(api.decoration.changeDecorationForCustomer, options, function(res) {

                        com.showAlert(com.info, "更改客户成功");
                        decorationDetail.customer.cid = res.decoration.customer.cid;
                        refreshCustomerInformation(decorationDetail.customer.cid, 2);
                    }, null, false);
                });

            }, false);
        }
    }

    function saveCustomer() {

        if (com.validate("customerForm")) {
            return;
        }

        decorationDetail.customer.status == 0 ? url = api.data.updateCustomer : url = api.data.updateCustomerForBase;

        var options = {
            "customer.cid": decorationDetail.customer.cid,
            "customer.name": decorationDetail.customerItems.customerName.val(),
            "customer.address": decorationDetail.customerItems.address.val(),
            "customer.gender": com.genderType[decorationDetail.customerItems.gender.prop("checked")],
            "customer.identity": decorationDetail.customerItems.identity.val(),
            "customer.officer": decorationDetail.customerItems.officer.val(),
            "customer.passport": decorationDetail.customerItems.passport.val(),
            "customer.passhkm": decorationDetail.customerItems.passhkm.val(),
            "customer.qq": decorationDetail.customerItems.qq.val(),
            "customer.wechat": decorationDetail.customerItems.wechat.val(),
            "customer.email": decorationDetail.customerItems.email.val(),
            "customer.career": decorationDetail.customerItems.career.val(),
            "customer.relationshipType": decorationDetail.customerItems.relationshipType.val(),
            "customer.type": decorationDetail.customerItems.type.val(),
            "customer.companyNo": decorationDetail.customerItems.companyNo.val(),
            "customer.companyName": decorationDetail.customerItems.companyName.val(),
            "customer.companyAddr": decorationDetail.customerItems.companyAddr.val(),
            "customer.companyPhone": decorationDetail.customerItems.companyPhone.val(),
            "customer.companyBank": decorationDetail.customerItems.companyBank.val(),
            "customer.companyBankno": decorationDetail.customerItems.companyBankno.val(),
        };

        com.post(url, options, function(res) {

            com.showAlert(com.info, "操作成功");
            decorationDetail.items.customer.val(decorationDetail.customerItems.customerName.val());
            decorationDetail.customerChangeModal.modal("hide");
        });

    }

    function clearHouse() {

        decorationDetail.houseItems.no.prop("disabled", false);
        decorationDetail.houseItems.no.get(0).selectedIndex = 0;
        com.cleanItems(decorationDetail.houseItems);
        com.cleanTypeahead("no");
        com.clearValidator();
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
                break;
        }
    }

    function binding(idName) {

        com.focusPage("#" + idName).bindData(constant.decoration().decorationActivityItem.stateTypeCommon.datas, "key", "value", false);
    }

    function queryPaymentType(options) {

        com.post(api.data.queryPaymentType, options, function(res) {

            $.each(res.paymentTypes, function(i, v) {

                decorationDetail.paymentTypes.push(v);
            });
        }, null, false);
    }

    function saveDecorationUser() {

        if (decorationDetail.decorationUser.status == 0 && com.validate('form')) {
            return false;
        }

        var url, decorationUser = decorationDetail.decorationUser;

        var options = {
            'decorationUser.orderId': decorationDetail.orderId,
            'decorationUser.content': com.focusPage("#duContent").val(),
        };

        if (decorationUser.status == 0) {
            url = api.decoration.addDecorationUser;
            options["decorationUser.user.userId"] = com.typeahead("duUser");
        } else {
            url = api.decoration.updateDecorationUser;
            options["decorationUser.duid"] = decorationUser.duid;
        }

        com.post(url, options, function(res) {

            com.showAlert(com.info, "操作成功");
            if (decorationUser.status == 0) {
                decorationUtils.addDecorationUser(decorationDetail, com.focusPage("#usersInfo"), res.decorationUser);
            } else {
                com.focusPage('#duCon_' + decorationUser.duid).text(res.decorationUser.content ? res.decorationUser.content : "待说明");
            }
        }, null, false);

        decorationDetail.decorationUserModal.modal("hide");
    }

    // ==================== 合同方案批量操作功能 ====================

    /**
     * 批量更新合同方案图片状态
     * @param {Number} status - 目标状态 (1=显示, 4=确认展示, 0=隐藏)
     */
    function batchUpdateDesignStatus(status) {
        var selectedDpids = [];
        var orderId = decorationDetail.orderId;

        // 获取所有选中的图片（仅在designPictures容器内）
        com.focusPage('#designPictures .picture-checkbox:checked').each(function() {
            var $this = $(this);
            var dpId = $this.data('dpid');
            if (dpId) {
                selectedDpids.push(dpId);
            }
        });

        if (selectedDpids.length === 0) {
            com.showAlert(com.warning, '请先选择图片');
            return;
        }

        if (!orderId) {
            com.showAlert(com.warning, '无法获取订单信息');
            return;
        }

        com.showLoading('正在处理...');

        // 构建请求数据
        var requestData = {};
        for (var i = 0; i < selectedDpids.length; i++) {
            requestData['decorationPictures[' + i + '].dpId'] = selectedDpids[i];
            requestData['decorationPictures[' + i + '].orderId'] = orderId;
            requestData['decorationPictures[' + i + '].status'] = status;
        }

        com.post(api.decoration.batchDecorationPicture, requestData, function(res) {
            com.hideLoading();
            if (res.errorCode == 0) {
                com.showAlert(com.info, '操作成功，已更新 ' + selectedDpids.length + ' 张图片状态');
                // 刷新合同方案图片
                decorationUtils.initDecorationPicture("designPictures", "projectPictures", "CADProjectPicture", "ContractPictures", "OriginalPicture", "contractFiles", "designContractPicture", "selfiePicture", "drawingPicture", "livePicture", "720Files", decorationDetail.orderId);
            } else {
                com.showAlert(com.error, res.errorMsg || '操作失败');
            }
        }, function(err) {
            com.hideLoading();
            com.showAlert(com.error, '操作失败');
        });
    }

    // 绑定批量操作按钮事件（使用事件委托，支持动态创建的按钮）
    $(document).on('click', '#detailBatchShow', function() {
        batchUpdateDesignStatus(1);
    });

    $(document).on('click', '#detailBatchConfirm', function() {
        batchUpdateDesignStatus(4);
    });

    $(document).on('click', '#detailBatchHide', function() {
        batchUpdateDesignStatus(0);
    });

});