jQuery(function($) {

    var cppoint = {

        btns: {
            saveBtn: com.focusPage("#saveBtn"),
            addCppointBtn: com.focusPage("#addCppointBtn")
        },

        modals: {
            addCppointModal: com.focusPage("#addCppointModal"),
            handleCppointModal: com.focusPage("#handleCppointModal"),
            cppointRecordModal: com.focusPage("#cppointRecordModal"),
        },

        items: {
            cppoint4decoration: com.focusPage("#cppoint4decoration"),
            cppoint4sales: com.focusPage("#cppoint4sales"),
            cppoint4operate: com.focusPage("#cppoint4operate"),
            cppoint4orderId: com.focusPage("#cppoint4orderId"),

            type: com.focusPage("#type"),
            pointType: com.focusPage("#pointType"),
            point: com.focusPage("#point"),

            cppointRecords: com.focusPage("#cppointRecords")
        },

        cid: null,
        orderId: null
    };

    cppoint.items.type.bindData(constant.customer().cppoint.type.datas, "key", "value");
    cppoint.items.pointType.bindData(constant.customer().cppoint.cppointType.datas, "key", "value");

    cppoint.btns.saveBtn.on("click", saveData);

    cppoint.modals.handleCppointModal.on('hide.bs.modal', function(e) {

        com.clearValidator();
        com.cleanItems(cppoint.items);
    });

    var searcher = new Searcher();

    searcher.base("condList", "pagenation", "resultList", api.customer.pageCppoint);
    searcher.condition(["customer-v-name"]);

    searcher.button([{
        name: "创建",
        clazz: "btn-primary",
        id: "createCppoint",
        icon: "icon-plus",
        handle: function() {

            cppoint.modals.addCppointModal.modal("show");
        }
    }]);

    var lineprops = [{
        field: "orderId",
        name: "装修单号",
        prop: "orderId",
        clazz: "grey"
    }, {
        field: "customer.name",
        name: "客户",
        prop: "customer.name",
        clazz: "grey",
        click: function(btn, v) {

            tools.customer.info(btn, v.customer.cid);
        }
    }, {
        field: "customer.gender",
        name: "性别",
        prop: "customer.gender",
        clazz: "grey"
    }, {
        field: "customer.identity",
        name: "身份证号",
        prop: "customer.identity",
        clazz: "grey"
    }, {
        field: "customer.officer",
        name: "军官证",
        prop: "customer.officer",
        clazz: "grey"
    }, {
        field: "customer.passport",
        name: "护照",
        prop: "customer.passport",
        clazz: "grey"
    }, {
        field: "customer.relationshipType",
        name: "客户关系",
        prop: "customer.relationshipType",
        clazz: "grey"
    }, {
        field: "customer.email",
        name: "邮箱",
        prop: "customer.email",
        clazz: "grey"
    }, {
        field: "customer.qq",
        name: "QQ",
        prop: "customer.qq",
        clazz: "grey"
    }, {
        field: "wechat",
        name: "微信",
        prop: "wechat",
        clazz: "grey"
    }, {
        field: "dpoint",
        name: "装修积分",
        prop: "dpoint",
        clazz: "grey"
    }, {
        field: "spoint",
        name: "主材积分",
        prop: "spoint",
        clazz: "grey"
    }, {
        field: "opoint",
        name: "运营积分",
        prop: "opoint",
        clazz: "grey"
    }];

    var linebtns = [{
        name: "操作积分",
        clazz: "btn-warning",
        handle: function(v) {

            handleCppoint(v);

            return false;
        }
    }, {
        name: "积分记录",
        clazz: "btn-inverse",
        handle: function(v) {

            params.customer.cpid = v.cpid;

            com.popup4page("#cppointRecordPopUp", "/views/customer/cppointRecord.html", "积分记录");

            return false;
        }
    }];

    searcher.line("customer.name", lineprops, linebtns).render();

    com.focusPage('#createCppoint', '#pagenation').on("click", function() {

        cppoint.modals.addCppointModal.modal("show");
    });

    function handleCppoint(v) {

        cppoint.items.point.val(0);

        cppoint.cid = v.cid;
        cppoint.orderId = v.orderId;

        cppoint.modals.handleCppointModal.modal("show");
    }

    cppoint.btns.addCppointBtn.click(function() {

        if (com.validate('addCppointModal')) {
            return false;
        }

        var url = api.customer.createCppoint;
        var options = {
            "cppoint.orderId": cppoint.items.cppoint4orderId.val(),
        };

        com.post(url, options, function(e) {

            com.showAlert(com.info, "操作成功");
            searcher.doSearch();

            cppoint.modals.addCppointModal.modal("hide");
        });
    });

    function saveData() {

        if (com.validate("handleCppointModal")) {
            return false;
        }

        var options = {
            "cppoint.orderId": cppoint.orderId,
        }

        var type = cppoint.items.type.val();
        var pointType = cppoint.items.pointType.val();

        var url = pointType == 0 ? api.customer.addupCppoint : api.customer.useupCppoint;

        if (type == 0) {
            options["cppoint.dpoint"] = cppoint.items.point.val();
        }

        if (type == 1) {
            options["cppoint.spoint"] = cppoint.items.point.val();
        }

        if (type == 2) {
            options["cppoint.opoint"] = cppoint.items.point.val();
        }

        com.post(url, options, function(res) {

            com.showAlert(com.info, "操作成功");
            searcher.doSearch();
            cppoint.modals.handleCppointModal.modal("hide");
        });
    }
});
