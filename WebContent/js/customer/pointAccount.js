jQuery(function($) {

    var pointAccount = {

        btns: {
            saveBtn: com.focusPage("#saveBtn"),
            addPointAccountBtn: com.focusPage("#addPointAccountBtn")
        },

        modals: {
            addPointAccountModal: com.focusPage("#addPointAccountModal"),
            handlePointAccountModal: com.focusPage("#handlePointAccountModal"),
            pointRecordModal: com.focusPage("#pointRecordModal"),
        },

        items: {
            pointAccount4decoration: com.focusPage("#pointAccount4decoration"),
            pointAccount4sales: com.focusPage("#pointAccount4sales"),
            pointAccount4operate: com.focusPage("#pointAccount4operate"),
            pointAccount4orderId: com.focusPage("#pointAccount4orderId"),

            type: com.focusPage("#type"),
            pointType: com.focusPage("#pointType"),
            point: com.focusPage("#point"),

            pointRecords: com.focusPage("#pointRecords")
        },

        cid: null,
        orderId: null
    };

    pointAccount.items.type.bindData(constant.customer().cppoint.type.datas, "key", "value");
    pointAccount.items.pointType.bindData(constant.customer().cppoint.cppointType.datas, "key", "value");

    pointAccount.btns.saveBtn.on("click", saveData);

    pointAccount.modals.handlePointAccountModal.on('hide.bs.modal', function(e) {

        com.clearValidator();
        com.cleanItems(pointAccount.items);
    });

    var searcher = new Searcher();

    // 获取页面控制参数(按公司差异化配置)
    var pageConfig = customerPage.getConfig("pointAccount");

    // pageBtn 配置为空时, 所有按钮按原逻辑显示; 否则需在 pageBtn 中存在
    function btnVisible(key) {

        return pageConfig.pageBtn.length == 0 || pageConfig.pageBtn.contains(key);
    }

    searcher.base("condList", "pagenation", "resultList", pageConfig.apiPage || api.customer.pagePointAccount);
    searcher.condition(pageConfig.condArr.length > 0 ? pageConfig.condArr : ["customer-v-name"]);

    searcher.button([{
        name: "创建",
        clazz: "btn-primary",
        id: "createPointAccount",
        icon: "icon-plus",
        handle: function() {

            pointAccount.modals.addPointAccountModal.modal("show");
        }
    }]);

    var propertyMap = {
        "orderId": {
            field: "orderId",
            name: "装修单号",
            prop: "orderId",
            clazz: "grey"
        },
        "customer": {
            field: "customer.name",
            name: "客户",
            prop: "customer.name",
            clazz: "grey",
            click: function(btn, v) {

                tools.customer.info(btn, v.customer.cid);
            }
        },
        "gender": {
            field: "customer.gender",
            name: "性别",
            prop: "customer.gender",
            clazz: "grey"
        },
        "identity": {
            field: "customer.identity",
            name: "身份证号",
            prop: "customer.identity",
            clazz: "grey"
        },
        "officer": {
            field: "customer.officer",
            name: "军官证",
            prop: "customer.officer",
            clazz: "grey"
        },
        "passport": {
            field: "customer.passport",
            name: "护照",
            prop: "customer.passport",
            clazz: "grey"
        },
        "relationshipType": {
            field: "customer.relationshipType",
            name: "客户关系",
            prop: "customer.relationshipType",
            clazz: "grey"
        },
        "email": {
            field: "customer.email",
            name: "邮箱",
            prop: "customer.email",
            clazz: "grey"
        },
        "qq": {
            field: "customer.qq",
            name: "QQ",
            prop: "customer.qq",
            clazz: "grey"
        },
        "wechat": {
            field: "wechat",
            name: "微信",
            prop: "wechat",
            clazz: "grey"
        },
        "decorationPoint": {
            field: "decorationPoint",
            name: "装修积分",
            prop: "decorationPoint",
            clazz: "grey"
        },
        "materialPoint": {
            field: "materialPoint",
            name: "主材积分",
            prop: "materialPoint",
            clazz: "grey"
        },
        "operatePoint": {
            field: "operatePoint",
            name: "运营积分",
            prop: "operatePoint",
            clazz: "grey"
        }
    };

    var lineprops = (function () {

        if (pageConfig.propertyArr.length == 0) {

            var all = [];
            $.each(propertyMap, function (key, prop) { all.push(prop); });
            return all;
        }

        var props = [];
        $.each(pageConfig.propertyArr, function (i, key) {

            if (propertyMap[key]) props.push(propertyMap[key]);
        });
        return props;
    })();

    var linebtns = [{
        name: "操作积分",
        clazz: "btn-warning",
        handle: function(v) {

            handlePointAccount(v);

            return false;
        },
        show: function() { return btnVisible("handle"); }
    }, {
        name: "积分记录",
        clazz: "btn-inverse",
        handle: function(v) {

            params.customer.accountId = v.accountId;

            com.popup4page("#pointRecordPopUp", "/views/customer/pointRecord.html", "积分记录");

            return false;
        },
        show: function() { return btnVisible("record"); }
    }];

    searcher.line("customer.name", lineprops, linebtns).render();

    com.focusPage('#createPointAccount', '#pagenation').on("click", function() {

        pointAccount.modals.addPointAccountModal.modal("show");
    });

    function handlePointAccount(v) {

        pointAccount.items.point.val(0);

        pointAccount.cid = v.cid;
        pointAccount.orderId = v.orderId;

        pointAccount.modals.handlePointAccountModal.modal("show");
    }

    pointAccount.btns.addPointAccountBtn.click(function() {

        if (com.validate('addPointAccountModal')) {
            return false;
        }

        var url = api.customer.createPointAccount;
        var options = {
            "pointAccount.orderId": pointAccount.items.pointAccount4orderId.val(),
        };

        com.post(url, options, function(e) {

            com.showAlert(com.info, "操作成功");
            searcher.doSearch();

            pointAccount.modals.addPointAccountModal.modal("hide");
        });
    });

    function saveData() {

        if (com.validate("handlePointAccountModal")) {
            return false;
        }

        var options = {
            "pointAccount.orderId": pointAccount.orderId,
        }

        var type = pointAccount.items.type.val();
        var pointType = pointAccount.items.pointType.val();

        var url = pointType == 0 ? api.customer.grantPoint : api.customer.consumePoint;

        if (type == 0) {
            options["pointAccount.decorationPoint"] = pointAccount.items.point.val();
        }

        if (type == 1) {
            options["pointAccount.materialPoint"] = pointAccount.items.point.val();
        }

        if (type == 2) {
            options["pointAccount.operatePoint"] = pointAccount.items.point.val();
        }

        com.post(url, options, function(res) {

            com.showAlert(com.info, "操作成功");
            searcher.doSearch();
            pointAccount.modals.handlePointAccountModal.modal("hide");
        });
    }
});
