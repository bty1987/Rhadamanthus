jQuery(function($) {

    var decorationDetail = {
        decorationOrderId:null,
        orderType:"",

        type:{
            "半包":0,
            "全包":1,
            "半价":2,
        },
        decoration: {},
        customer:{},
        village:{},
        versionId: "",
        notSalesmanRate: "",
        materialPaymentListGrid: null,
        materialPaymentGridPager: null,

        decorationOrderStatus: {},

        reloadFlag: 0,

        btnSaveBasedecorationInfo:null,

        activity: {},

        dsid:null,
        decorationPaymentId: null,
        convertActivityItemId: null,

        items: {},
        houseItems: {},
        customerItems: {},
        serviceItems:{},

        vRepeatFlg: false,
        cRepeatFlg: false,
        accountFlg:false,
    };

    drawNode.draw(params.viewNode);

    var decorationPayment = {
        postParam:{},

        items:{},
        basePaymentGrid:null,
        otherPaymentGrid:null,
        otherPaymentPager:null,

        editFlag:0,
    };

    decorationDetail.items.orderId = $("#orderId");
    decorationDetail.items.customer = $("#customer");
    decorationDetail.items.houseAddr = $("#houseAddr");
    decorationDetail.items.designer = $("#designer");
    decorationDetail.items.salesman = $("#salesman");
    decorationDetail.items.designDepartment = $("#designDepartment");
    decorationDetail.items.businessDepartment = $("#businessDepartment");

    decorationDetail.items.houseArea = $("#houseArea");
    decorationDetail.items.freeArea = $("#freeArea");
    decorationDetail.items.status = $("#status");
    decorationDetail.items.measureTime = $("#measureTime");

    decorationDetail.items.houseType = $('#houseType');
    decorationDetail.items.houseClass = $('#houseClass');
    decorationDetail.items.orderType = $('#orderType');

    decorationDetail.items.backOrderName = $('#backOrderName');
    decorationDetail.items.backOrderPhone = $('#backOrderPhone');
    decorationDetail.items.backOrderContent = $('#backOrderContent');

    decorationDetail.items.notSalesmanName = $('#notSalesmanName');
    decorationDetail.items.notSalesmanPhone = $('#notSalesmanPhone');
    decorationDetail.items.notSalesmanRate = $('#notSalesmanRate');
    decorationDetail.items.notSalesmanContent = $('#notSalesmanContent');

    decorationDetail.items.salesmanType = $('#salesmanType');

    decorationDetail.serviceItems.comment = $('#comment');

    decorationDetail.items.quoterId = $('#quoterId');
    decorationDetail.items.escorterId = $('#escorterId');
    decorationDetail.btnSaveBasedecorationInfo = $("#btnSaveBasedecorationInfo").on("click", saveBasedecorationInfo);
    decorationDetail.otherPaymentType = $("#otherPaymentType");
    decorationDetail.otherPayment = $("#otherPayment");

    decorationDetail.customerItems.customerName = $("#customerName");
    decorationDetail.customerItems.identity = $("#identity");
    decorationDetail.customerItems.officer = $("#officer");
    decorationDetail.customerItems.passport = $("#passport");
    decorationDetail.customerItems.gender = $("#gender").switchBtn("gender");
    decorationDetail.customerItems.qq = $("#qq");
    decorationDetail.customerItems.wechat = $("#wechat");
    decorationDetail.customerItems.email = $("#email");
    decorationDetail.customerItems.address = $("#address");
    decorationDetail.customerItems.relationshipType = $("#relationshipType");
    decorationDetail.customerItems.addphone = $("#addphone");
    decorationDetail.customerItems.savePhoneBtn = $("#savePhoneBtn");


    com.post(api.ds.data, {}, function(res){
        decorationDetail.customerItems.relationshipTypes = [];
        $.each(res.relationshipType, function(i, k){
            decorationDetail.customerItems.relationshipTypes.push(k.key);
        });
        decorationDetail.customerItems.relationshipType.bindData(decorationDetail.customerItems.relationshipTypes);

    },null,false);

    decorationDetail.houseItems.no = $("#no");
    decorationDetail.houseItems.rule = $("#rule");
    decorationDetail.houseItems.errMsg = $("#errMsg");
    decorationDetail.houseItems.no.on('change', function () {
        deleteVillageData("no",decorationDetail.houseItems);
        com.post(api.data.queryVillageById, {"village.no": decorationDetail.houseItems.no.val()}, function (res) {
            decorationDetail.houseItems.rule.html("推荐楼牌号规则：" + res.village.rule);
        }, null, false)
    });
    decorationDetail.houseItems.built = $("#built").on("blur", function (e) {
        deleteVillageData("built",decorationDetail.houseItems);
    });
    decorationDetail.houseItems.unit = $("#unit").on("blur", function (e) {
        deleteVillageData("unit",decorationDetail.houseItems);
    });
    decorationDetail.houseItems.floor = $("#floor").on("blur", function (e) {
        deleteVillageData("floor",decorationDetail.houseItems);
    });
    decorationDetail.houseItems.door = $("#door").on("blur", function (e) {
        //验证房产是否存在
        validatehouse(decorationDetail.houseItems.no.val(),houseUtils.anytimevalidate(decorationDetail.houseItems, 0 ,false));
    });
    decorationDetail.houseItems.builtrule = $("#builtrule");
    decorationDetail.houseItems.unitrule = $("#unitrule");
    decorationDetail.houseItems.floorrule = $("#floorrule");
    decorationDetail.houseItems.doorrule = $("#doorrule");

    com.post(api.ds.building, {}, function (res) {
        decorationDetail.houseItems.builtrule.bindData(res.buildrule, "key", "value");
        decorationDetail.houseItems.unitrule.bindData(res.buildrule, "key", "value");
        decorationDetail.houseItems.floorrule.bindData(res.buildrule, "key", "value");
        decorationDetail.houseItems.doorrule.bindData(res.buildrule, "key", "value");
    }, null, false);

    decorationDetail.printQuotationModal = $("#printQuotationModal");

    decorationDetail.activity.activity = $("#activity").on("change", function(){
        var $this = $(this);

        var _things = [];
        var _coupons = [];

        var options = {
            "activity.aid": $this.val(),
        }

        com.post(api.information.queryActivityItemByAId, options, function(res){
            var _ = res.activityItems;

            for(var i=0;i<_.length;i++){

                var _activityItem = _[i];

                if(_activityItem.type == 0){
                    _coupons.push({aiId:_activityItem.aiId, activityItemName:_activityItem.name + " 金额:" + _activityItem.money});
                }else if(_activityItem.type == 1){
                    _things.push({aiId:_activityItem.aiId, activityItemName:_activityItem.name + " 金额:" + _activityItem.money});
                }
            }

            decorationDetail.activity.things.chosen("destroy");
            decorationDetail.activity.things.chosen({width: "216px",multi_type: "input"});
            decorationDetail.activity.things.bindData(_things, 'aiId', 'activityItemName', false);
            decorationDetail.activity.things.trigger("chosen:updated");

            decorationDetail.activity.coupons.chosen("destroy");
            decorationDetail.activity.coupons.chosen({width: "216px", multi_type: "input"});
            decorationDetail.activity.coupons.bindData(_coupons, 'aiId', 'activityItemName', false);
            decorationDetail.activity.coupons.trigger("chosen:updated");
        });
    });

    decorationDetail.activity.activityInfo = $("#activityInfo");
    decorationDetail.activity.activity = $("#activity");
    decorationDetail.activity.things = $("#things");
    decorationDetail.activity.coupons = $("#coupons");
    decorationDetail.activity.convertActivityItemName = $("#convertActivityItemName");
    decorationDetail.activity.convertActivityItemMoney = $("#convertActivityItemMoney");
    decorationDetail.activity.activityType = $("#activityType").on("change", function(){
        decorationDetail.activity.couponInfo.css("display", "block")
    });
    decorationDetail.activity.activityItemName = $("#activityItemName");
    decorationDetail.activity.couponInfo = $("#couponInfo");
    decorationDetail.activity.activityItemMoney = $("#activityItemMoney");
    decorationDetail.activity.activityItemNum = $("#activityItemNum");

    decorationDetail.activity.things.chosen({width: "216px"});
    decorationDetail.activity.coupons.chosen({width: "216px"});

    decorationDetail.activitys = $("#activitys");
    decorationDetail.activityItems = $("#activityItems");
    decorationDetail.activityPriceInfo = $("#activityPriceInfo");

    decorationDetail.printQuotationModal = $("#printQuotationModal");
    decorationDetail.quotationTotalPriceModal = $("#quotationTotalPriceModal");
    decorationDetail.joinDecorationActivityModal = $("#joinDecorationActivityModal").on('show.bs.modal', function(e){
        com.clearValidator();
    });
    decorationDetail.applyDecorationActivityItemModal = $("#applyDecorationActivityItemModal").on('show.bs.modal', function(e){
        com.clearValidator();
    });

    decorationDetail.applySpecialDecorationActivityItemModal = $("#applySpecialDecorationActivityItemModal").on('show.bs.modal', function(e){
        com.clearValidator();
    });
    decorationDetail.refundDecorationPaymentModal = $("#refundDecorationPaymentModal");
    decorationDetail.serviceModal = $("#serviceModal");
    decorationDetail.otherPaymentModal = $("#otherPaymentModal");

    decorationUtils.init();

    decorationDetail.decorationOrderId = params.decorationOrderId;
    decorationDetail.orderType = params.orderType;
    decorationDetail.versionId = params.versionId;

    decorationPayment.postParam.decorationOrderId = decorationDetail.decorationOrderId;
    decorationPayment.postParam["decorationPayment.decoration.orderId"] = decorationDetail.decorationOrderId;

    com.post(api.ds.decoration, {}, function(res){
        decorationDetail.items.orderType.bindData(res.type, 'key', 'value');
        decorationDetail.items.houseType.bindData(res.houseType, 'key', 'value');
        decorationDetail.items.houseClass.bindData(res.houseClass, 'key', 'value');
    }, null, false);

    com.initChosen('quoterId', api.personel.queryUserByPinyin, "pinyinName", {"user.status":0,"departmentType.name":""}, "autoFillKeyValue", "key", "value");
    com.initChosen('escorterId', api.personel.queryUserByPinyin, "pinyinName", {"user.status":0,"departmentType.name":""}, "autoFillKeyValue", "key", "value");
    com.initChosen('no', api.data.queryVillageForNameByPinyin, "pinyinName", {}, "autoFillKeyValue", "key", "value")

    if(decorationDetail.orderType == decorationDetail.type["半价"]){
        decorationUtils.initDecorationHolonomy(decorationDetail.decorationOrderId);
    }
    if(decorationDetail.orderType == decorationDetail.type["全包"]){
        decorationUtils.initDecorationInclusive(decorationDetail.decorationOrderId);
    }

    com.post(api.ds.decoration, {}, function (res) {
        $.each(res.decorationOrderStatus, function(i,v){
            decorationDetail.decorationOrderStatus[v.key] = v.value;
        })
    }, null, false);

    $('#customerInfosBtn').on(ace.click_event, function(){
        if(decorationDetail.showCustomerInfoFlag==undefined || decorationDetail.showCustomerInfoFlag==0 ){
            com.post(api.data.queryCustomerById,{ "customer.cid": decorationDetail.customer.cid},function (res) {
                decorationDetail.customer = res.customer;
                $.gritter.add({
                    title: '客户敏感信息',
                    text: '邮箱 :'+decorationDetail.customer.email+'<br /> QQ:'+decorationDetail.customer.qq+'<br /> 微信:'+decorationDetail.customer.wechat+'<br />  电话 :'+decorationDetail.customer.phone+'<br />  客户类型:'+decorationDetail.customer.relationshipType+'<br /> ',
                    class_name: 'gritter-info gritter-center gritter-light',
                    after_close: function(e, manual_close){
                        decorationDetail.showCustomerInfoFlag = 0;
                    }
                });
            })
            decorationDetail.showCustomerInfoFlag = 1;
        }

        return false;
    });

    $("#submitDecorationActivityBtn").on(ace.click_event, function(){

        if(com.validate()){
            return;
        }

        var options = {
            "decorationActivity.orderId": decorationDetail.decorationOrderId,
            "decorationActivity.activity.aid": decorationDetail.activity.activityInfo.val(),
        }

        com.post(api.decoration.addDecorationActivity, options, function(res){

            var decorationActivity = res.decorationActivity;

            decorationUtils.addDecorationActivityForDiv(decorationDetail.activitys, decorationActivity, activityBtnMethod);
        });

        decorationDetail.joinDecorationActivityModal.modal("hide");
    });

    $("#submitDecorationActivityItemBtn").on(ace.click_event, function(){

        if(com.validate()){
            return;
        }

        var receiverId = $("#approveActivityItemManSel").find('input:checked').attr('userid');

        if(receiverId == null || receiverId == ""){
            com.showAlert(com.error,"请选择审批人!");
            return;
        }

        if(decorationDetail.activity.things.val() == null && decorationDetail.activity.coupons.val() == null){
            com.showAlert(com.warning, "活动物品或券需要选择才能提交");
            return;
        }

        var submitFlag = true;

        var orderId = params.decorationOrderId
        var activityName = decorationDetail.activity.activity.find("option:selected").text();

        var index = 0;
        var options = {
            "approval.receiver.userId": receiverId,
            "approval.comment": "",
            "approvalDecorationActivity.orderId": orderId,
            "approvalDecorationActivity.activityName": activityName,
        };

        $("[class='search-choice']", $("#things_chosen")).each(function(i, e){

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

        $("[class='search-choice']", $("#coupons_chosen")).each(function(i, e){
            var _ = $(e);

            if(!/^\d+$/.test(_.children('span').children('input').val())){
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

        if(!submitFlag){
            return;
        }

        com.post(api.approval.submitApprovalForDecorationActivity, options, function(res){
            com.showAlert(com.info, "提交成功");
        });

        decorationDetail.applyDecorationActivityItemModal.modal("hide");
    });

    $("#submitSpecialDecorationActivityItemBtn").on(ace.click_event, function(){

        if(com.validate()){
            return;
        }

        var receiverId = $("#approveSpecialActivityItemManSel").find('input:checked').attr('userid');

        if(receiverId == null || receiverId == ""){
            com.showAlert(com.error,"请选择审批人!");
            return;
        }

        var orderId = decorationDetail.decorationOrderId;
        var type = decorationDetail.activity.activityType.val();

        var options = {
            "approval.receiver.userId": receiverId,
            "approval.comment": "",
            "approvalDecorationActivity.orderId": orderId,
            "approvalDecorationActivity.activityName": "特批活动物品",
            "approvalDecorationActivityItems[0].orderId": orderId,
            "approvalDecorationActivityItems[0].activityName": "特批活动物品",
            "approvalDecorationActivityItems[0].activityItemName": decorationDetail.activity.activityItemName.val(),
            "approvalDecorationActivityItems[0].type": type,
            "approvalDecorationActivityItems[0].content": "",
            "approvalDecorationActivityItems[0].num":decorationDetail.activity.activityItemNum.val(),
            "approvalDecorationActivityItems[0].money":decorationDetail.activity.activityItemMoney.val(),
        }

        com.post(api.approval.submitApprovalForDecorationActivity, options, function(res){
            com.showAlert(com.info, "提交成功");
        });

        decorationDetail.applySpecialDecorationActivityItemModal.modal("hide");
    });

    $("#joinActivityBtn").on("click", function(){

        com.post(api.information.queryActivityForValid, {}, function(res){
            var activitys = res.activitys;

            var _activitys = [{aid:-1, activityName: ""}];

            for(var i=0;i<activitys.length;i++){
                var _activity = activitys[i];

                _activitys.push({aid:_activity.aid, activityName:_activity.name,money:_activitys.money});
            }

            decorationDetail.activity.activityInfo.bindData(_activitys, "aid", "activityName","money", false);
        });

        decorationDetail.joinDecorationActivityModal.modal("show");
    });

    $("#applyActivityItemBtn").on("click", function(){

        decorationDetail.activity.things.chosen("destroy");
        decorationDetail.activity.things.chosen({width: "42%",multi_type: "input"});
        decorationDetail.activity.things.bindData([{aid:-1, activityName: ""}], "aid", "activityName","money");
        decorationDetail.activity.things.trigger("chosen:updated");

        decorationDetail.activity.coupons.chosen("destroy");
        decorationDetail.activity.coupons.chosen({width: "42%", multi_type: "input"});
        decorationDetail.activity.coupons.bindData([{aid:-1, activityName: ""}], "aid", "activityName","money");
        decorationDetail.activity.coupons.trigger("chosen:updated");

        var options = {
            "decorationActivity.orderId": decorationDetail.decorationOrderId,
        }

        com.post(api.decoration.queryDecorationActivityByOrderId, options, function(res){

            var decorationActivitys = res.decorationActivitys;

            var _activitys = [{aid:-1, activityName: ""}];

            for(var i=0;i<decorationActivitys.length;i++){
                var _decorationActivity = decorationActivitys[i];

                _activitys.push({aid:_decorationActivity.activity.aid, activityName:_decorationActivity.activity.name,money:_decorationActivity.activity.money})
            }

            decorationDetail.activity.activity.bindData(_activitys, "aid", "activityName","money", false);
        }, null, false);

        approvalUtils.initqueryApprovalUser("approveActivityItemManSel",8);

        decorationDetail.applyDecorationActivityItemModal.modal("show");
    });

    $("#applySpecialActivityItemBtn").on("click", function(){

        com.post(api.ds.information, {}, function(res){
            decorationDetail.activityItemType = res.activityItemType;

            decorationDetail.activity.activityType.bindData(decorationDetail.activityItemType, "key", "value");
        });

        decorationDetail.activity.couponInfo.css("display", "none");

        approvalUtils.initqueryApprovalUser("approveSpecialActivityItemManSel",8);

        decorationDetail.applySpecialDecorationActivityItemModal.modal("show");
    });

    $('#customerChangeBtn').on("click", function(){
        com.clearValidator();
        com.post(api.data.queryCustomerById,{ "customer.cid": decorationDetail.customer.cid},function (res) {
            res = res.customer;

            decorationDetail.customerItems.customerName.val(res.name);
            decorationDetail.customerItems.identity.val(res.identity);
            decorationDetail.customerItems.officer.val(res.officer);
            decorationDetail.customerItems.passport.val(res.passport) ;
            decorationDetail.customerItems.qq.val(res.qq);
            decorationDetail.customerItems.wechat.val(res.wechat);
            decorationDetail.customerItems.email.val(res.email);
            decorationDetail.customerItems.address.val(res.address);
            decorationDetail.customerItems.relationshipType.val(res.relationshipType);
            decorationDetail.customerItems.gender.prop('checked', com.genderType[res.gender]);
        })
        com.post(api.data.queryCustomerPhoneByCid,{"customerPhone.cid": decorationDetail.customer.cid},function (res) {
            showPhone('phoneList',res.customerPhones)
        },null,false)

        $("#customerChangeModal").modal("show");
    });

    $("#cSaveBtn").on("click", function(){
        saveCustomer();
    });

    $("#savePhoneBtn").on("click", function() {
        savecustomerPhone(decorationDetail.customer.cid,decorationDetail.customerItems.addphone.val())
    });

    $("#addphone").on("blur",function(){
        checkPhone(decorationDetail.customer.cid,$("#addphone"))
    });

    $('#villageChangeBtn').on("click", function(){
        com.clearValidator();
        clearHouse();
        $("#villageChangeModal").modal("show");
    });

    $("#vSaveBtn").on("click", function(){

        if(decorationDetail.vRepeatFlg || decorationDetail.houseItems.thid == null){
            return;
        }

        com.post(api.decoration.changeDecorationForHouse,{"decoration.orderId":decorationDetail.decorationOrderId,"decoration.house.hid":decorationDetail.houseItems.thid},function (res) {
            com.showAlert(com.info,"操作成功")
            decorationDetail.items.houseAddr.val(decorationDetail.houseItems.villageName + decorationDetail.houseItems.houseNumber);
            $("#customerChangeModal").modal("hide");
        },null,false)

        $("#villageChangeModal").modal("hide");
    });

    $("#btnSetDecorationPaymentInfo").on('click', function(res) {
        com.clearValidator();

        com.post(api.decoration.queryDecorationConfig,{},function (res) {
            $('#decorationDiscount').bindData(res.config.machingType,"key","value");
        });

        $("#decorationTotalMoney").val("");

        if(decorationDetail.orderType == decorationDetail.type["半价"]){
            $('#forDiscount').removeClass('hide');
        }

        com.post(api.data.queryPaymentScaleByCid, {"paymentScale.cid": params.company.cid}, function (res) {
            $("#paymentScale").empty();
            $.each(res.paymentScales,function (i,v) {
                var $approvaler = $('<label></label>');
                var $div = $('<div></div>').addClass("radio no-padding").attr("style", "margin-bottom:10px");
                var $input = $('<input>').attr({
                    "type": "radio",
                    "name": "form-field-radio",
                    "class": "ace",
                    "psid": v.psid
                });

                if(i == 0){
                    $input.attr('checked','true');
                }

                var $span = $('<span></span>').addClass('lbl').html($('<label></label>').attr('style', 'display:inline-block;width:105px;margin-left:10px').text(v.name));
                var $comment = $('<span></span>').addClass("lbl").text(v.comment == null ? " " : v.comment).attr("style", "margin-left:27px");
                $input.appendTo($approvaler);
                $span.appendTo($approvaler);
                $('<br/>').appendTo($approvaler)
                $comment.appendTo($approvaler);
                $approvaler.appendTo($div);
                $div.appendTo($("#paymentScale"));

            })

        });

        decorationDetail.quotationTotalPriceModal.modal("show");

    });

    $("#btnOtherPayment").on('click', function(res){
        com.clearValidator();

        com.post(api.ds.decoration, {}, function(res){
            decorationDetail.otherPaymentType.bindData(res.paymentType, "key", "value", false);
        });

        decorationDetail.otherPaymentModal.modal("show");
    });

    $("#serviceSaveBtn").on('click',function(res){

        if(com.validate("serviceModal")){
            return;
        }

        var options = {};
        options["decorationService.dsid"] = decorationDetail.dsid;
        options["decorationService.comment"] = decorationDetail.serviceItems.comment.val();

        com.post(api.decoration.completeDecorationService,options,function(res){
            decorationUtils.initService(decorationDetail,decorationDetail.decorationOrderId);
            decorationDetail.serviceModal.modal("hide");
        });

    })

    $("#saveRefundMoneyBtn").on('click', function(res){

        if(com.validate("refundDecorationPaymentModal")){
            return;
        }

        var receiverId = $("#refundApproveManSel").find('input:checked').attr('userid');

        if(receiverId == null || receiverId == ""){
            com.showAlert(com.error,"请选择审批人!");
            return;
        }

        if(decorationPayment.editFlag == 0){

            var options = {
                "approval.receiver.userId": receiverId,
                "approval.comment": $("#changeReason").val(),
                "approvalDecorationRefund.paymentId": $('#autoId').val(),
            }

            bootbox.confirm("确认要提交退款申请吗?", function(res) {
                if(res){
                    com.post(api.approval.submitApprovalForDecorationRefund, options, function(res){
                        com.showAlert(com.info, "提交成功");
                        decorationUtils.initPayment(decorationDetail, true);
                    });
                }

                decorationDetail.refundDecorationPaymentModal.modal("hide");
            });
        }

        $('#changeReason').val("")
    });



    $("#saveOtherPaymentBtn").on("click", function(res){
        if(com.validate("otherPaymentModal")){
            return;
        }

        var type = decorationDetail.otherPaymentType.val().split('-');

        var options = {
            "decorationPayment.decoration.orderId": decorationDetail.decorationOrderId,
            "decorationPayment.paymentType": decorationDetail.otherPaymentType.find("option:selected").text(),
            "decorationPayment.oneType": type[0],
            "decorationPayment.twoType": type[1],
            "decorationPayment.referMoney": decorationDetail.otherPayment.val()
        }

        com.post(api.payment.addDecorationPayment, options, function(res){

            decorationUtils.initPayment(decorationDetail, true);

            decorationDetail.otherPaymentModal.modal("hide");
        })
    });

    $("#saveGenerateDecorationPaymentBtn").bindClick(function(res){

        if(com.validate("quotationTotalPriceModal")){
            return;
        }

        if(parseFloat($("#decorationTotalMoney").val()) <= 0.0000001){
            bootbox.alert("合同款不能小于1元");
            return;
        }

        var psId = $("#paymentScale").find('input:checked').attr('psid');

        if(psId == null || psId == ""){
            com.showAlert(com.error,"请选择款项比例!");
            return;
        }

        var options = {
            "decorationPayment.referMoney": $("#decorationTotalMoney").val(),
            "decorationPayment.decoration.orderId": decorationDetail.decorationOrderId,
            "decorationPayment.psId": psId,
        }

        if(decorationDetail.orderType == decorationDetail.type["半价"]){

            var manageRate = 0;

            com.post(api.quotation.queryQuotationForDefaultByOrderId,{"quotation.orderId":decorationDetail.decorationOrderId},function (res) {

                if (res.quotation.manageRate != null && res.quotation.manageRate != 0){
                    manageRate = res.quotation.manageRate;
                }else{
                    com.post(api.quotation.queryQuotationVersionByVersionId,{ "quotationVersion.versionId": decorationDetail.versionId},function (data) {
                        manageRate = data.quotationVersion.manageRate;
                    },null,false);
                }
            },function (e) {
                com.showAlert(com.error,e.errorMsg);
                return;
            },false);

            var maching = $('#decorationDiscount').val();
            var discout = $('#decorationDiscount').find("option:selected").text();
            var projectPrice = Math.ceil(parseFloat($("#decorationTotalMoney").val()));
            var serviceRate = config.serviceRate;

            options = {
                "decorationHolonomy.decoration.orderId": decorationDetail.decorationOrderId,
                "decorationHolonomy.maching": maching,
                "decorationHolonomy.discount": discout,
                "decorationHolonomy.projectPrice": projectPrice,
                "decorationHolonomy.manageRate": parseFloat(manageRate) + parseFloat(decorationDetail.notSalesmanRate),
                "decorationHolonomy.serviceRate": serviceRate,
                "decorationHolonomy.status": 0,
                "decorationHolonomy.psId": psId,
            };

            com.post(api.decoration.makeDecorationHolonomy,options,function (res) {
                com.showAlert(com.info,"保存成功");

                res = res.decorationHolonomy;
                $('#projectPrice').html(res.projectPrice + res.managePrice);
                $('#managePrice').html(res.managePrice);
                $('#materialPrice').html(res.materialPrice);
                $('#servicePrice').html(res.servicePrice);
                $('#quotationPrice').html(utils.changeThrDecimal(utils.accAdd(utils.accDiv(res.projectPrice,utils.accDiv(res.discount,10)),res.managePrice)));
                var materialPercent = utils.accMul(utils.changeThrDecimal(utils.accDiv(res.materialPaidup == null? 0:res.materialPaidup,res.materialPrice)),100);
                $('#materialPercent').html(materialPercent > 100 ? 100:materialPercent + "%");
                var servicePercent = utils.accMul(utils.changeThrDecimal(utils.accDiv(res.servicePaidup == null? 0:res.servicePaidup,res.servicePrice)),100);
                $('#servicePercent').html(servicePercent > 100 ? 100:servicePercent + "%");

                decorationUtils.initPayment(decorationDetail, true);

            },function (e) {
                com.showAlert(com.error,e.errorMsg);
            })

        }else if(decorationDetail.orderType == decorationDetail.type["全包"]){

            options = {
                "decorationInclusive.decoration.orderId": decorationDetail.decorationOrderId,
                "decorationInclusive.contractPrice": $("#decorationTotalMoney").val(),
                "decorationInclusive.psId": psId,
            };

            com.post(api.decoration.makeDecorationInclusive,options,function (res) {
                com.showAlert(com.info,"保存成功");

                res = res.decorationInclusive;

                $('#contractPrice').html(res.contractPrice);
                $('#projectPrice').html(res.projectPrice);
                $('#cdiff').html(res.cdiff);
                $('#mdiff').html(res.mdiff);
                $('#managePrice').html(res.managePrice);
                $('#materialPaidup').html(res.materialPaidup);

                decorationUtils.initPayment(decorationDetail, true);
            },function (e) {
                com.showAlert(com.error,e.errorMsg);
            })
        }else {
            com.post(api.payment.makeDecorationPayment, options, function(res){
                decorationUtils.initPayment(decorationDetail, true);
            });
        }


        decorationDetail.quotationTotalPriceModal.modal("hide");
    });

    $('#btnBack').on(ace.click_event, function(){
        com.switchPage(params.historyPage);
    });

    $("#btnPrintDefaultQuotationInfo").on('click', function(res) {
        decorationDetail.printQuotationModal.modal("show");
    });

    initWizard(decorationDetail);

    decorationUtils.initBaseInfo(decorationDetail.decorationOrderId, api.decoration.queryDecorationForCommonByOrderId, function(decoration){

        decorationDetail.items.orderId.val(decoration.orderId);
        decorationDetail.items.customer.val(decoration.customer.name);
        decorationDetail.items.houseAddr.val(decoration.house.village.name + decoration.house.houseNumber);
        decorationDetail.items.designDepartment.val(decoration.designer.dept.deptName);
        decorationDetail.items.designer.val(decoration.designer.currentName);
        decorationDetail.items.businessDepartment.val(decoration.salesman.dept.deptName);
        decorationDetail.items.salesman.val(decoration.salesman.currentName);
        decorationDetail.items.orderType.val(decoration.type);
        decorationDetail.items.houseType.val(decoration.houseType);
        decorationDetail.items.houseClass.val(decoration.houseClass);
        decorationDetail.items.houseArea.val(decoration.house.buildArea);
        decorationDetail.items.freeArea.val(decoration.freeArea);
        decorationDetail.items.status.val(decorationDetail.decorationOrderStatus[decoration.status]);
        decorationDetail.items.measureTime.val(decoration.measureTime);
        decorationDetail.items.notSalesmanRate.val(decoration.notSalesmanRate);
        decorationDetail.notSalesmanRate = decoration.notSalesmanRate;

        if (decoration.status != 6) {
            decorationDetail.accountFlg = true;
        }else {
            decorationDetail.accountFlg = false;
        }
        com.post(api.decoration.queryDecorationInfoByOrderId,{"orderId":decorationDetail.decorationOrderId},function (res) {
            res = res.decorationInfo;
            decorationDetail.items.backOrderName.val(res.backOrderName);
            decorationDetail.items.backOrderPhone.val(res.backOrderPhone);
            decorationDetail.items.backOrderContent.val(res.backOrderContent);
            decorationDetail.items.notSalesmanPhone.val(res.notSalesmanPhone);
            decorationDetail.items.notSalesmanName.val(res.notSalesmanName);
            decorationDetail.items.notSalesmanContent.val(res.notSalesmanContent);
        })


        decorationDetail.houseItems.shid = decoration.house.hid;

        decorationDetail.items.salesmanType.val(decoration.salesmanType);
        com.updateChosen('quoterId',decoration.quoter == null ? "": decoration.quoter.userId, decoration.quoter.currentName == null ? "":decoration.quoter.currentName);
        com.updateChosen('escorterId', decoration.escorter == null ? "": decoration.escorter.userId, decoration.escorter.currentName == null ? "":decoration.escorter.currentName);

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

    function saveBasedecorationInfo(){
        if(com.validate("step1")){
            return;
        }

        var btn = $("#btnSaveBasedecorationInfo");
        btn.button('loading');

        bootbox.confirm("确定要保存基本信息吗?", function(result) {
            if(result) {
                var options = {
                    "decoration.orderId": decorationDetail.decorationOrderId,
                    "decoration.type": decorationDetail.items.orderType.val(),
                    "decoration.houseType": decorationDetail.items.houseType.val(),
                    "decoration.houseClass": decorationDetail.items.houseClass.val(),
                    "decoration.freeArea": decorationDetail.items.freeArea.val(),
                    "decoration.notSalesmanRate": decorationDetail.items.notSalesmanRate.val(),
                    "decorationInfo.notSalesmanName": decorationDetail.items.notSalesmanName.val(),
                    "decorationInfo.notSalesmanPhone": decorationDetail.items.notSalesmanPhone.val(),
                    "decorationInfo.notSalesmanContent": decorationDetail.items.notSalesmanContent.val(),
                    "decoration.quoter.userId": decorationDetail.items.quoterId.val(),
                    "decoration.escorter.userId": decorationDetail.items.escorterId.val(),
                };

                com.post(api.decoration.changeDecorationForAdvance, options, function(){
                    com.showAlert(com.info, "操作成功");
                    btn.button('reset');
                });
            }
        });
    }

    function downloadFile(picturePath,uploadFileName){
        window.open(config.media + api.common.downloadFile.url + "?downloadFilePath="+picturePath+"&fileName="+uploadFileName);
    }

    function initWizard(decorationDetail) {
        var wizard = {"activityBtnMethod":null,"uiBtnMethod":null,"isDesign":false,"editPicture":false};

        $('#fuelux-wizard').ace_wizard({"status": true}).on('change', function(e, info) {

            var curstep = 0;

            info.direction === "previous" ? curstep = info.step - 1 : curstep = info.step;

            curstep == 1 ? decorationDetail.btnSaveBasedecorationInfo.removeClass("hide") : decorationDetail.btnSaveBasedecorationInfo.addClass("hide")

            switch (params.viewNode[curstep].type){
                case "quotaion":
                    quotationUtils.loadQuotationDetail();
                    break;
                case "picture":
                    if(!$.isEmptyObject(params.viewNode[curstep].wizard)) $.extend(true,wizard,params.viewNode[curstep].wizard);
                    decorationUtils.initDecorationPicture("designPictures", "projectPictures", "CADProjectPicture", "ContractPictures",decorationDetail.decorationOrderId,wizard["editPicture"]);
                    break;
                case "material":
                    decorationUtils.initMaterial(decorationDetail);
                    break;
                case "activity":
                    if(!$.isEmptyObject(params.viewNode[curstep].wizard)) $.extend(true,wizard,params.viewNode[curstep].wizard);
                    params.convertActivityItemId = decorationDetail.convertActivityItemId;
                    params.activity = decorationDetail.activity;
                    decorationUtils.decorationActivityInfo(decorationDetail.activitys, wizard["activityBtnMethod"], decorationDetail.decorationOrderId);
                    decorationUtils.decorationActivityItemInfo(decorationDetail.activityPriceInfo,decorationDetail.activityItems, wizard["uiBtnMethod"], decorationDetail.decorationOrderId);
                    break;
                case "belong":
                    decorationUtils.initDecorationBelong(decorationDetail.decorationOrderId);
                    break;
                case "payment":
                    if(!$.isEmptyObject(params.viewNode[curstep].wizard)) $.extend(true,wizard,params.viewNode[curstep].wizard);
                    decorationUtils.initPayment(decorationDetail,wizard["isDesign"]);
                    break;
                case "addreduce":
                    decorationUtils.initAddreduce(decorationDetail.decorationOrderId,decorationDetail.orderType)
                    break;
                case "account":
                    decorationUtils.initAccount(decorationDetail.decorationOrderId,decorationDetail.accountFlg);
                    break;
                case "service":
                    decorationUtils.initService(decorationDetail,decorationDetail.decorationOrderId);
                    break;
            }
        }).on('stepclick', function(e,info){

            info.step == 1 ? decorationDetail.btnSaveBasedecorationInfo.removeClass("hide") : decorationDetail.btnSaveBasedecorationInfo.addClass("hide")

            switch (params.viewNode[info.step-1].type){

                case "quotaion":
                    quotationUtils.loadQuotationDetail();
                    break;
                case "picture":
                    if(!$.isEmptyObject(params.viewNode[info.step-1].wizard)) $.extend(true,wizard,params.viewNode[info.step-1].wizard);
                    decorationUtils.initDecorationPicture("designPictures", "projectPictures", "CADProjectPicture", "ContractPictures", decorationDetail.decorationOrderId,wizard["editPicture"]);
                    break;
                case "material":
                    decorationUtils.initMaterial(decorationDetail);
                    break;
                case "activity":
                    if(!$.isEmptyObject(params.viewNode[info.step-1].wizard)) $.extend(true,wizard,params.viewNode[info.step-1].wizard);
                    params.convertActivityItemId = decorationDetail.convertActivityItemId;
                    params.activity = decorationDetail.activity;
                    decorationUtils.decorationActivityInfo(decorationDetail.activitys, wizard["activityBtnMethod"], decorationDetail.decorationOrderId);
                    decorationUtils.decorationActivityItemInfo(decorationDetail.activityPriceInfo,decorationDetail.activityItems, wizard["uiBtnMethod"], decorationDetail.decorationOrderId);
                    break;
                case "belong":
                    decorationUtils.initDecorationBelong(decorationDetail.decorationOrderId);
                    break;
                case "payment":
                    if(!$.isEmptyObject(params.viewNode[info.step-1].wizard)) $.extend(true,wizard,params.viewNode[info.step-1].wizard);
                    decorationUtils.initPayment(decorationDetail,wizard["isDesign"]);
                    break;
                case "addreduce":
                    decorationUtils.initAddreduce(decorationDetail.decorationOrderId,decorationDetail.orderType)
                    break;
                case "account":
                    decorationUtils.initAccount(decorationDetail.decorationOrderId,decorationDetail.accountFlg);
                    break;
                case "service":
                    decorationUtils.initService(decorationDetail,decorationDetail.decorationOrderId);
                    break;
            }
        }).on('previous', function(e, info) {
            info.step == 1 ? decorationDetail.btnSaveBasedecorationInfo.removeClass("hide") : decorationDetail.btnSaveBasedecorationInfo.addClass("hide")
        }).on('finished', function(e) {
            com.switchPage(params.historyPage);
        });
    }
    function activityBtnMethod(uiPgDiv, decorationActivity){

        var deleteBtn = $("<span></span>").addClass("ui-icon icon-ban-circle red").attr("id", "delete_" + decorationActivity.daId).appendTo(uiPgDiv);

        deleteBtn.on("click", function(){
            deleteDecorationActivity(decorationActivity.daId);
        });
    }

    function uiBtnMethod(uiPgDiv, activityItem){

        var abateBtn = $("<span></span>").addClass("ui-icon icon-ban-circle red").attr("id", "abate_" + activityItem.daiId).appendTo(uiPgDiv);

        if(activityItem.state == 0){

            abateBtn.on("click", function(){
                abateDecorationActivityItem(activityItem.daiId, activityItem.activityItemName);
            });
        }
    }
    function deleteDecorationActivity(daId){

        var options = {
            "decorationActivity.daId": daId,
        }

        com.post(api.decoration.deleteDecorationActivity, options, function(res){
            $("#dactivity_" + res.decorationActivity.daId).remove();
        });
    }

    function abateDecorationActivityItem(daiId, activityItemName){

        bootbox.confirm("是否确认失效" + activityItemName + "活动物品?", function(result) {
            if(result){

                var options = {
                    "decorationActivityItem.daiId": daiId,
                }

                com.post(api.decoration.abateDecorationActivityItem, options, function(res){

                    var daiId = res.decorationActivityItem.daiId;

                    $("#convert_" + daiId).unbind();
                    $("#abate_" + daiId).unbind();
                    $("#widgetHeader_" + daiId).addClass("header-color-grey");
                })
            }
        });
    }

    function houseNumbervali(houseNumber,regex,errorMsg){

        if (new RegExp(regex).test(houseNumber)) {
            $("#errMsg").popover("destroy")

            return true
        }else{
            $("#errMsg").focus().select();
            $("#errMsg").removeAttr("data-placement").attr({
                "data-rel":"popover",
                "data-placement": "right",
                "data-content": errorMsg
            }).removeAttr("data-toggle").popover('show');

            return false

        }
    }

    function changetohousenum( temp,arr){
        var str =temp;
        if(arr.trim() != "" && arr.trim() != "0" ){
            if(temp.indexOf("{}") != -1){
                var num=temp.indexOf("{}");
                str=temp.substring(0,num)+ arr +temp.substring(num+2);
            }
            else{
                str =str+"-"+arr;
            }
        }
        return str;
    }

    function validatehouse(no,houseNumber){

        if( no== "" || houseNumber == ""){
            return;
        }
        var options = {
            "house.village.no": no,
            "house.houseNumber": houseNumber.houseNumber,
            "house.status" : 0
        };

        com.post(api.data.queryHouseByNoAHnum,options,function (res) {
            com.post(api.decoration.checkDecoration, {"filters[0].data":res.house.hid,"filters[0].field":"houseId","filters[0].op":"eq"}, function(des){
                if(des.decoration&&des.decoration.orderId){
                    com.showTips($("#door"), "订单已存在：订单号："+des.decoration.orderId+" 订单所属设计师:"+des.decoration.designer.currentName, true);
                    decorationDetail.repeatFlg = true;

                }else{
                    bootbox.confirm("已有该房产信息，是否绑定？", function(yes) {
                        if(yes){
                            decorationDetail.houseItems.thid = res.house.hid;
                            decorationDetail.houseItems.villageName = res.house.village.name;
                            decorationDetail.houseItems.houseNumber = res.house.houseNumber;
                            decorationDetail.repeatFlg = false;
                        }
                    });
                }
            }, null, false);
        },function () {
            com.showAlert(com.warning,"房产不存在");
            $("#door").css("border", "1px solid #d5d5d5").popover("destroy")
        },false);

    }
    function showPhone(tableId,listData) {
        $('#' + tableId).html(null);

        var $tableWrap = $('#' + tableId);
        var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');

        if (listData && listData.length) {
            $.each(listData, function (i, v) {
                createLine($ul, v)
            });

            $ul.appendTo($tableWrap);
        }

    }

    function createLine($ul,v) {
        var $liLine = $('<li></li>').addClass('item-blue clearfix');
        var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(v.phone));
        var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
        var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

        var $btnStauts = $('<input />').attr("type", "checkbox").addClass('ace ace-switch ace-switch-5').attr("checked", v.status == 0 ? true : false);
        var $btnSpan = $('<span></span>').addClass("lbl status-lbl");


        $divBtnWrap.append($btnStauts).append($btnSpan).appendTo($h3);

        $liLine.append($h3).append($ulProperty);

        $btnStauts.click(function () {
            com.sealJournal("info","in");
            if($btnStauts.prop("checked")){
                var option = {
                    "customerPhone.phone":v.phone,
                    "customerPhone.status":0,
                    "customerPhone.cid":v.cid,
                    "customerPhone.cpid":v.cpid
                }
                //先查询该电话是否被被人启用
                com.post(api.data.checkCustomerForPhone, option, function(res){
                    updateCustomerPhoneForStatus(v.cpid, 0, function(){$this.removeAttr("checked")})
                },function(res){
                    com.showAlert(com.warning, "该电话已经被其他客户启用");
                    $btnStauts.prop("checked", false);
                },false);
            }else{
                updateCustomerPhoneForStatus(v.cpid, 1,function(){$this.prop("checked")})
            }

        });

        $liLine.appendTo($ul);
    }

    function updateCustomerPhoneForStatus(cpid, status, callBack){
        com.post(api.data.updateCustomerPhoneForStatus, {"customerPhone.cpid":cpid,"customerPhone.status" : status}, function(){
        },function(res){
            callBack && callBack();

        },null,false);
    }

    function savecustomerPhone(cid,phone){

        if(decorationDetail.customer.repeatFlg){
            return;
        }

        if ($("#addphone").val() == "" || $("#addphone").val() == 0) {
            decorationDetail.customer.repeatFlg = true;
            com.showPopover($("#addphone"), {errorMsg: "电话号码不能为空"}, "right")
            return
        }
        var reg = /^((1[3|4|5|6|7|8|9][0-9]{9})|(0[0-9]{10}))((#((1[3|4|5|6|7|8|9][0-9]{9})|(0[0-9]{10})))){0,4}$/;

        if (reg.test($("#addphone").val()) == false) {
            decorationDetail.customer.repeatFlg =  true;
            com.showPopover($("#addphone"), {errorMsg: "请输入正确的手机号或固定电话!!"}, "right");
            return
        }

        var param={
            "customerPhone.phone":phone,
            "customerPhone.cid":cid,
        }
        var $ul = $('#phoneList').children('ul')

        com.post(api.data.addCustomerPhone, param,function(res){
            var $ul = $('#phoneList').children('ul')
            res.customerPhone.status = 0;
            createLine($ul,res.customerPhone);
            decorationDetail.customerItems.addphone.val("");
        })

    }

    function checkPhone(cid,$id) {

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

    function saveCustomer(){
        com.clearValidator();
        if(com.validate()){
            return;
        }
        var url;
        var options = {
            "customer.cid": decorationDetail.customer.cid,
            "customer.name": decorationDetail.customerItems.customerName.val(),
            "customer.gender": com.genderType[decorationDetail.customerItems.gender.prop("checked")],
            "customer.identity":decorationDetail.customerItems.identity.val(),
            "customer.officer":decorationDetail.customerItems.officer.val(),
            "customer.passport":decorationDetail.customerItems.passport.val() ,
            "customer.qq": decorationDetail.customerItems.qq.val(),
            "customer.wechat": decorationDetail.customerItems.wechat.val(),
            "customer.email": decorationDetail.customerItems.email.val(),
            "customer.relationshipType": decorationDetail.customerItems.relationshipType.val(),
            "customer.address": decorationDetail.customerItems.address.val()
        };

        url = api.data.updateCustomer;

        com.post(url, options, function(res){
            com.showAlert(com.info, "操作成功");
            $("#customerChangeModal").modal("hide");
        });

    }
    function clearHouse() {
        decorationDetail.houseItems.no.prop("disabled", false);
        decorationDetail.houseItems.no.get(0).selectedIndex = 0;
        com.cleanItems(decorationDetail.houseItems);
        com.updateChosen("no", '', '');
        com.clearValidator();
        $("#errMsg").css("border", "0px");
    }
    function deleteVillageData(paramFlag,items) {
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
                $("#door").css("border", "1px solid #d5d5d5").popover("destroy");
                $("#errMsg").popover("destroy");
                break;
        }
    }
});



