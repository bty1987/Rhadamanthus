jQuery(function($) {

    var customerChance = {
        modals: {
            issueModal: com.focusPage("#issueModal"),
            changeModal: com.focusPage("#changeModal"),
        },
        items: {
            region: com.focusPage("#region"),
            department: com.focusPage("#department"),
            belonger: com.focusPage("#belonger"),
            busitype: com.focusPage("#busitype"),

            houseType: com.focusPage("#houseType", "#changeModal"),
            houseClass: com.focusPage("#houseClass", "#changeModal"),
            orderType: com.focusPage("#orderType", "#changeModal"),
            resourceType: com.focusPage("#resourceType", "#changeModal"),

            infolist: com.focusPage("#infolist"),
        },
        btns: {
            issueSaveBtn: com.focusPage("#saveBtn", "#issueModal").on("click", issue),
            changeBtn: com.focusPage("#changeBtn", "#changeModal").on("click", change),
        },

        atttypes: [],

        decoration: {
            "types": {}
        },

        ccid: null

    };

    customerChance.items.houseType.bindData(constant.decoration().decoration.houseType.datas, 'key', 'value');
    customerChance.items.houseClass.bindData(constant.decoration().decoration.houseClass.datas, 'key', 'value');
    customerChance.items.resourceType.bindData(constant.decoration().decoration.resourceType.datas, 'key', 'value');

    com.post(api.data.queryDecorationAtttype, {}, function(res) {

        $.each(res.decorationAtttypes, function(i, v) {

            customerChance.decoration.types[v.key] = v.type;

            if (v.status == 0) {
                customerChance.atttypes.push(v);
            }
        });

        customerChance.items.orderType.bindData(customerChance.atttypes, 'key', 'name');
    });

    function drawInfo() {

        var $widget = $('<div></div>').addClass("widget-container-span col-xs-6 col-md-3").prependTo(customerChance.items.infolist);
        var $box = $('<div></div>').addClass("widget-box").appendTo($widget);
        var $header = $('<div></div>').addClass("widget-header header-color-green").appendTo($box);

        var $name = $('<h4></h4>').attr('id', 'h4name_').text("分配规则").appendTo($header);
        var $body = $('<div></div>').addClass("widget-body").appendTo($box);
        var $main = $('<div></div>').addClass("widget-main").appendTo($body);
        var $info = $('<div></div>').css("padding", "5px").appendTo($main);

        $('<div></div>').append($('<label></label>').attr('for', 'form-field').text('得分: ' + "0.5")).appendTo($info);
        $('<div></div>').append($('<label></label>').attr('for', 'form-field').text('机会数: ' + "0.3")).appendTo($info);
        $('<div></div>').append($('<label></label>').attr('for', 'form-field').text('轮询数: ' + "0.2")).appendTo($info);
    }

    drawInfo();

    var searcher = new Searcher();

    searcher.base("condList", "pagenation", "resultList", api.customer.pageCustomerChance);

    searcher.condition(["customer-customerChance-createTime", "customer-customerChance-type", "customer-customerChance-status"]);

    searcher.history("customerChancePostData");

    var lineprops = [{
        field: "source",
        name: "客户姓名",
        prop: "source.name",
        clazz: "grey"
    }, {
        field: "busitype",
        name: "业务类型",
        prop: "busitype.name",
        clazz: "red",
    }, {
        field: "creater",
        name: "创建人",
        prop: "creater.currentName",
        clazz: "grey"
    }, {
        field: "issuer",
        name: "分配人",
        prop: "issuer.currentName",
        clazz: "grey"
    }, {
        field: "createTime",
        name: "创建时间",
        prop: "createTime",
        clazz: "green"
    }, {
        field: "issueTime",
        name: "分配时间",
        prop: "issueTime",
        clazz: "green"
    }, {
        field: "confirmTime",
        name: "确认时间",
        prop: "confirmTime",
        clazz: "green"
    }, {
        field: "belonger",
        name: "归属人",
        prop: "belonger.currentName",
        clazz: "grey"
    }, {
        field: "department",
        name: "归属部门",
        prop: "department.name",
        clazz: "grey"
    }, {
        field: "region",
        name: "归属分区",
        prop: "region.name",
        clazz: "grey"
    }, {
        field: "type",
        name: "类型",
        prop: "type",
        clazz: "red",
        dataset: constant.customer().customerChance.type.keys
    }, {
        field: "status",
        name: "状态",
        prop: "status",
        clazz: "red",
        dataset: constant.customer().customerChance.status.keys,
    }, {
        field: "comment",
        name: "备注",
        prop: "comment",
        clazz: "grey"
    }];

    var linebtns = [{
        name: "分配",
        clazz: "btn-yellow",
        handle: function(v) {

            com.cleanTypeahead('region');
            com.cleanTypeahead('belonger');
            com.cleanTypeahead('busitype');

            customerChance.ccid = v.ccid;

            customerChance.modals.issueModal.modal("show");

        },
        show: function(v) {

            return v.status == constant.customer().customerChance.STATUS_INIT_INT;
        },
    }, {
        name: "失效",
        clazz: "btn-success",
        handle: function(v) {

            disable(v.ccid);
        },
        show: function(v) {

            return v.status == constant.customer().customerChance.STATUS_INIT_INT;
        },
    }, {
        name: "推送",
        clazz: "btn-warning",
        handle: function(v) {

            send(v.ccid);
        },
    }, {
        name: "确认",
        clazz: "btn-inverse",
        handle: function(v) {

            confirm(v.ccid);
        },
    }, {
        name: "转换",
        clazz: "btn-danger",
        handle: function(v) {

            customerChance.ccid = v.ccid;

            customerChance.modals.changeModal.modal("show");
        },
    }];

    searcher.line("source.name", lineprops, linebtns).render();

    com.post(api.communion.queryDepartment, {
        "dept.type.dtid": 1
    }, function(res) {

        customerChance.items.region.bindData(res.deptList, "did", "name", true);
    });

    com.post(api.communion.queryDepartment, {
        "dept.type.dtid": 2
    }, function(res) {

        customerChance.items.department.bindData(res.deptList, "did", "name", true);
    });

    com.initTypeahead('belonger', api.personel.queryUserByPinyin, "pinyinName", {
        "user.status": 0
    }, "autoFillKeyValue", "key", "value");

    com.post(api.data.queryDecorationBusitype, {}, function(res) {

        var $arr = [];

        $.each(res.decorationBusitypes, function(intex, value) {

            if (value.status == 0) {
                $arr.push(value);
            }
        });

        customerChance.items.busitype.bindData($arr, "dbid", "name", true);
    });

    function issue() {

        if (com.validate("issueModal")) {
            return;
        }

        var options = {
            "customerChance.ccid": customerChance.ccid,
            "customerChance.region.did": customerChance.items.region.val(),
            "customerChance.department.did": customerChance.items.department.val(),
            "customerChance.belonger.userId": com.typeahead("belonger"),
            "customerChance.busitype.dbid": customerChance.items.busitype.val(),
        };

        com.post(api.customer.issueCustomerChance, options, function(res) {

            searcher.doSearch();
            com.showAlert(com.info, "操作成功");
        });

        customerChance.modals.issueModal.modal("hide");
    }

    function disable(ccid) {

        var options = {
            "customerChance.ccid": ccid,
        };

        com.showConfirm("确认失效机会", function() {

            com.post(api.customer.disableCustomerChance, options, function(res) {

                searcher.doSearch();
                com.showAlert(com.info, "操作成功");
            });
        });

    }

    function send(ccid) {

        var options = {
            "customerChance.ccid": ccid,
        };

        com.showConfirm("确认推送信息", function() {

            com.post(api.customer.sendCustomerChance, options, function(res) {

                searcher.doSearch();
                com.showAlert(com.info, "推送成功");
            });
        });

    }

    function confirm(ccid) {

        var options = {
            "customerChance.ccid": ccid,
        };

        com.showConfirm("确认机会信息", function() {

            com.post(api.customer.confirmCustomerChange, options, function(res) {

                searcher.doSearch();
                com.showAlert(com.info, "确认成功!");
            });
        });
    }

    function change() {

        var options = {
            "customerChance.ccid": customerChance.ccid,
            "decoration.type": customerChance.decoration.types[customerChance.items.orderType.val()],
            "decoration.typeness": customerChance.items.orderType.val(),
            "decoration.resourceType": customerChance.items.resourceType.val(),
            "decoration.houseType": customerChance.items.houseType.val(),
            "decoration.houseClass": customerChance.items.houseClass.val(),
        };

        com.post(api.customer.changeCustomerChance, options, function(res) {

            searcher.doSearch();

            com.showAlert(com.info, "转换成功!");
        });
    }

});
