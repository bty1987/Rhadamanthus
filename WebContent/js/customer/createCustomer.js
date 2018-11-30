jQuery(function ($) {

    var createcustomerOrigin = {

        grade: ["A", "B", "C", "D"],
        cardType: ["身份证", "军官证", "护照"],
        items: {},
        createCustomerSaveBtn: null,
        customerItems: {},
        repeatFlg: null,
        saveBtn: null,
        cancelBtn: null
    };

    com.initChosen('userId', api.personel.queryUserByPinyin, "pinyinName", {"user.status": 0}, 'userBases', 'uid', 'currentName').on("change", function (e) {
        if ($(this).val() == "" || com.focusPage("#userId").val() == "") {
            com.clearValidator("#userId", true);
            createcustomerOrigin.repeatCustomerFlg = false;
            return;
        }
    });

    com.initChosen('customerId', api.data.queryCustomerForName, "pinyinName", {}, "autoFillCustomer", "key", "value").on("change", function (e) {
        if ($(this).val() == "" || com.focusPage("#customerId").val() == "") {
            com.clearValidator("#customerId", true);
            createcustomerOrigin.repeatCustomerFlg = false;
            return;
        }
    });

    com.post(api.ds.data, {}, function (res) {
        createcustomerOrigin.customerItems.relationshipType.bindData(res.relationshipType, "key", "value");
    });

    createcustomerOrigin.saveBtn = com.focusPage("#saveBtn").on("click", addcustomerOrigin);
    createcustomerOrigin.cancelBtn = com.focusPage("#cancelBtn").on("click", deleteDate);
    createcustomerOrigin.items.customerId = com.focusPage("#customerId");
    createcustomerOrigin.items.phone = com.focusPage("#phone");
    createcustomerOrigin.items.purpose = com.focusPage("#purpose");
    createcustomerOrigin.items.intention = com.focusPage("#intention");
    createcustomerOrigin.items.price = com.focusPage("#price");
    createcustomerOrigin.items.grade = com.focusPage("#grade");
    createcustomerOrigin.items.userId = com.focusPage("#userId");
    createcustomerOrigin.items.comment = com.focusPage("#comment");

    createcustomerOrigin.items.grade.bindData(createcustomerOrigin.grade);

    createcustomerOrigin.createCustomerSaveBtn = com.focusPage("#createCustomerSaveBtn").on("click", customer);

    createcustomerOrigin.customerItems.cardType = com.focusPage("#cardType").bindData(createcustomerOrigin.cardType);
    createcustomerOrigin.customerItems.gender = com.focusPage("#gender").switchBtn("gender");
    createcustomerOrigin.customerItems.customerName = com.focusPage("#customerName");
    createcustomerOrigin.customerItems.cardType = com.focusPage("#cardType");
    createcustomerOrigin.customerItems.cardNum = com.focusPage("#cardNum");
    createcustomerOrigin.customerItems.gender = com.focusPage("#gender");
    createcustomerOrigin.customerItems.qq = com.focusPage("#qq");
    createcustomerOrigin.customerItems.wechat = com.focusPage("#wechat");
    createcustomerOrigin.customerItems.email = com.focusPage("#email");
    createcustomerOrigin.customerItems.relationshipType = com.focusPage("#relationshipType");
    createcustomerOrigin.customerItems.address = com.focusPage("#address");
    createcustomerOrigin.customerItems.phone = com.focusPage("#phones");


    createcustomerOrigin.customerItems.phone = com.focusPage("#phones").on("blur", function () {
        $this = $(this);
        void 0 == $this.val() || "" == $this.val().trim() ? (com.showPopover(com.focusPage("#phones"), {errorMsg: "电话号码不能为空"}, "right"), createcustomerOrigin.repeatFlg = false) : com.post(api.data.checkCustomerForPhone, {
            "customerPhone.phone": $this.val(),
            "customerPhone.status": 0
        }, function (res) {
            createcustomerOrigin.customerRepeatFlg = false;
            com.focusPage("#phones").css("border", "1px solid #d5d5d5").popover("destroy");
        }, function (res) {
            createcustomerOrigin.customerRepeatFlg = true;
            com.showPopover(com.focusPage("#phones"),{errorMsg: "电话号码已存在"}, "right");
        });
    });

    com.focusPage('#fl-statement').statement("客源", "创建客源");

    // 创建客户模态框
    com.focusPage("#customer").click(function(){
        com.cleanItems(createcustomerOrigin.customerItems);
        com.focusPage("#customerModal").modal("show");
    });

    // 创建客户
    function customer() {
        if(createcustomerOrigin.customerItems.cardType.val() == "身份证"){
            regCard(createcustomerOrigin.customerItems.cardNum, /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/);
        }else if(createcustomerOrigin.customerItems.cardType.val() == "军官证"){
            regCard(createcustomerOrigin.customerItems.cardNum, /^[\u4e00-\u9fa5]{3}\d{8}[\u4e00-\u9fa5]$/);
        }

        if(com.validate("customerModal") || createcustomerOrigin.customerRepeatFlg || createcustomerOrigin.cardFlag){
            if(createcustomerOrigin.customerRepeatFlg){
                com.showPopover(com.focusPage("#phones"),{errorMsg: "电话号码已存在"}, "right");
            }
            return;
        }

        var customerOptions = {};
        switch(com.focusPage("#cardType").val())
        {
            case "身份证":
                customerOptions["customer.identity"]  = com.focusPage("#cardNum").val();
                break;
            case "军官证":
                customerOptions["customer.officer"] = com.focusPage("#cardNum").val();
                break;
            case "护照":
                customerOptions["customer.passport"] = com.focusPage("#cardNum").val();
                break;
        }

        customerOptions["customer.name"] =  createcustomerOrigin.customerItems.customerName.val();
        customerOptions["customer.gender"] = com.genderType[createcustomerOrigin.customerItems.gender.prop("checked")];
        customerOptions["customer.qq"] = createcustomerOrigin.customerItems.qq.val();
        customerOptions["customer.wechat"] = createcustomerOrigin.customerItems.wechat.val();
        customerOptions["customer.email"] = createcustomerOrigin.customerItems.email.val();
        customerOptions["customer.relationshipType"] = createcustomerOrigin.customerItems.relationshipType.val();
        customerOptions["customer.address"] =  createcustomerOrigin.customerItems.address.val();
        customerOptions["customer.phone"] =  createcustomerOrigin.customerItems.phone.val();

        com.post(api.data.addCustomer, customerOptions, function (res) {
            com.showAlert(com.info, "创建用户成功");
            createcustomerOrigin.customerId = res.customer.cid;

            com.focusPage("#customerId").html('<option value="' + res.customer.cid + '">' + res.customer.name + '</option>');
            com.focusPage("#customerId").trigger("chosen:updated");
            com.focusPage("#customerModal").modal("hide");

        }, function (e) {
            com.showAlert(com.warning, "客户电话已存在！");
        }, false);
    }

    function addcustomerOrigin() {
        if (com.validate())
            return;
        var options = {};
        options["customerOrigin.customer.cid"] = createcustomerOrigin.items.customerId.val();
        options["customerOrigin.phone"] = createcustomerOrigin.items.phone.val();
        options["customerOrigin.purpose"] = createcustomerOrigin.items.purpose.val();
        options["customerOrigin.intention"] = createcustomerOrigin.items.intention.val();
        options["customerOrigin.price"] = createcustomerOrigin.items.price.val();
        options["customerOrigin.grade"] = createcustomerOrigin.items.grade.val();
        options["customerOrigin.belonger.uid"] = createcustomerOrigin.items.userId.val();
        options["customerOrigin.comment"] = createcustomerOrigin.items.comment.val();

        com.post(api.customer.addCustomerOrigin, options, function (res) {
            com.showAlert(com.info, "客源创建成功！");
            deleteDate();
        });
    }


    function regCard(cardParam, reg) {
        if (cardParam.val() != "") {
            if (reg.test(cardParam.val()) == false) {
                createcustomerOrigin.cardFlag = true;
                com.showPopover(cardParam, {errorMsg: "请输入正确的证件号码！"}, "right");
            } else {
                createcustomerOrigin.cardFlag = false;
                cardParam.css("border", "1px solid #d5d5d5").popover("destroy");
            }
        } else {
            createcustomerOrigin.cardFlag = false;
            cardParam.css("border", "1px solid #d5d5d5").popover("destroy");
        }
    }

    function deleteDate() {
        com.updateChosen("customerId", "", "");
        com.updateChosen("userId", "", "");
        com.cleanItems(createcustomerOrigin.items);
        com.cleanItems(createcustomerOrigin.customerItems);
        com.clearValidator();
    }
});
