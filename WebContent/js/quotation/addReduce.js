jQuery(function($) {

    var addReduce = {

        orderId: params.quotation.orderId,

        arid: null,

        items: {
            addReduceDes: com.focusPage("#addReduceDes"),
            addReduceType: com.focusPage("#addReduceType"),
            atttype: com.focusPage("#addReduceAtttype"),
            paytype: com.focusPage("#paytype"),
        },

        modals: {
            addReduceModal: com.focusPage("#addReduceModal"),
        },

        btns: {
            saveBtn: com.focusPage("#saveBtn").on("click", saveData),
            payBtn: com.focusPage("#payBtn").on("click", unpay)
        },

        editFlag: false,

        types: {},
        atttypes: {},
        paytypes: {},
        statuses: {},
        isAffirms: {},

        pageType: params.urlLoadParams.type,
        atttype: null,
    };

    function initDecorationInfo() {

        var quotationList = com.focusPage("#quotationList").html("");

        com.post(api.decoration.queryDecorationForCommonByOrderId, {
            "decoration.orderId": addReduce.orderId
        }, function(res) {

            drawdecoration(res.decoration);
        }, null, false);

    }

    function drawdecoration(decoration) {

        var $widget1 = $('<div></div>').addClass("col-xs-6 col-md-3").prependTo(decorationInfo);
        var $box1 = $('<div></div>').addClass("widget-box").appendTo($widget1);
        var $header1 = $('<div></div>').addClass("widget-header header-color-green").appendTo($box1);

        var name1 = $('<h4></h4>').attr('id', 'h4name_').text("客户").appendTo($header1);

        var $body1 = $('<div></div>').addClass("widget-body").appendTo($box1);
        var $main1 = $('<div></div>').addClass("widget-main").appendTo($body1);
        var $info1 = $('<div></div>').css("padding", "5px").appendTo($main1);

        $('<div></div>').append($('<label></label>').attr('for', 'form-field').text('姓名: ' + decoration.customer.name)).appendTo($info1);
        $('<div></div>').append($('<label></label>').attr('for', 'form-field').text('电话: ' + (decoration.customer.phone == "" ? "暂无" : decoration.customer.phone))).appendTo($info1);
        $('<div></div>').append($('<label></label>').attr('for', 'form-field').text('地址: ' + (decoration.customer.address == "" ? "暂无" : decoration.customer.address))).appendTo($info1);
        $('<div></div>').append($('<label></label>').attr('for', 'form-field').text('客户关系: ' + decoration.customer.relationshipType)).appendTo($info1);
        $('<div></div>').append($('<label></label>').attr('for', 'form-field').text('身份证: ' + (decoration.customer.identity == "" ? "暂无" : decoration.customer.identity))).appendTo($info1);

        var $widget = $('<div></div>').addClass("col-xs-6 col-md-3").prependTo(decorationInfo);
        var $box = $('<div></div>').addClass("widget-box").appendTo($widget);
        var $header = $('<div></div>').addClass("widget-header header-color-orange").appendTo($box);

        var name = $('<h4></h4>').attr('id', 'h4name_').text("装修单").appendTo($header);

        var $body = $('<div></div>').addClass("widget-body").appendTo($box);
        var $main = $('<div></div>').addClass("widget-main").appendTo($body);
        var $info = $('<div></div>').css("padding", "5px").appendTo($main);

        $('<div></div>').append($('<label></label>').attr('for', 'form-field').text('装修单号: ' + decoration.orderId)).appendTo($info);
        $('<div></div>').append($('<label></label>').attr('for', 'form-field').text('楼盘地址: ' + decoration.house.village.name + " " + decoration.house.houseNumber)).appendTo($info);
        $('<div></div>').append($('<label></label>').attr('for', 'form-field').text('报价版本: ' + decoration.version.name)).appendTo($info);
        $('<div></div>').append($('<label></label>').attr('for', 'form-field').text('设计师: ' + decoration.designer.currentName)).appendTo($info);
        $('<div></div>').append($('<label></label>').attr('for', 'form-field').text('业务员: ' + decoration.salesman.currentName)).appendTo($info);
    }

    com.post(api.ds.quotation, {}, function(res) {

        addReduce.types = res.addReduceType.split("key", "value");
        addReduce.paytypes = res.addReducePaytype.split("key", "value");
        addReduce.statuses = res.addReduceStatus.split("key", "value");
        addReduce.atttypes = res.addReduceAtttype.split("key", "value");
        addReduce.isAffirms = res.addReduceisAffirmDict.split("key", "value");

    }, null, false);

    var search = new Searcher();

    var linebtns = [{
        name: "查看",
        clazz: "btn-yellow",
        handle: function(v) {

            params.historyPage = api.index.addReduceIndex.url;

            params.quotation.addReduce = v;

            viewDetailAddReduce(v);
        }
    }, {
        name: "下拨",
        clazz: "btn-success",
        handle: function(v) {

            unpay(v.arId, 1);
        },
        show: function(v) {

            return ((v.status == 0 || v.status == 1) && v.paytype == 0 && v.type == 0);
        }
    }, {
        name: "特批",
        clazz: "btn-info",
        handle: function(v) {

            unpay(v.arId, 2);
        },
        show: function(v) {

            return ((v.status == 0 || v.status == 1) && v.paytype == 0 && v.type == 0);
        }
    }, {
        name: "不退",
        clazz: "btn-success",
        handle: function(v) {

            unpay(v.arId, 3);
        },
        show: function(v) {

            return ((v.status == 0 || v.status == 1) && v.paytype == 0 && v.type == 1);
        }
    }, {
        name: "确认",
        clazz: "btn-info",
        handle: function(v) {

            com.showConfirm("是否确认增减单", function() {

                confirm(v.arId);
            });
        },
        show: function(v) {

            return ((v.status == 0 || v.status == 1) && (v.paytype == 1 || v.paytype == 2));
        }
    }, {
        name: "删除",
        clazz: "btn-danger",
        handle: function(v) {

            com.showConfirm("是否确认删除", function() {

                removeRow(v.arId);
            });
        },
        show: function(v) {

            return (v.status == 0 || v.status == 1);
        }
    }, ];

    if (addReduce.pageType == null) {

        com.focusPage('#fl-statement').statement("装修单", "增减项").show();

        initDecorationInfo();

        search.init("", "condList", api.addReduce.queryAddReduceByOrderId, function(data) {

        }, null, "addReducePostData", {
            "addReduce.orderId": addReduce.orderId
        }, true, "addReduces");

        var lineprops = [{
            field: "arids",
            name: "多选",
            type: "checkbox",
            prop: "arId"
        }, {
            field: "type",
            name: "类别",
            prop: "type",
            clazz: "red",
            dataset: addReduce.types
        }, {
            field: "atttype",
            name: "类型",
            prop: "atttype",
            clazz: "red",
            dataset: addReduce.atttypes
        }, {
            field: "createTime",
            name: "创建时间",
            prop: "createTime",
            clazz: "green"
        }, {
            field: "undisPrice",
            name: "非打折总额",
            prop: "undisPrice",
            clazz: "blue"
        }, {
            field: "disPrice",
            name: "打折总额",
            prop: "disPrice",
            clazz: "blue"
        }, {
            field: "managePrice",
            name: "管理费",
            prop: "managePrice",
            clazz: "blue"
        }, {
            field: "consPrice",
            name: "工程总额",
            prop: "consPrice",
            clazz: "blue"
        }, {
            field: "houseNumber",
            name: "总价",
            prop: "total",
            clazz: "blue"
        }, {
            field: "status",
            name: "状态",
            prop: "status",
            clazz: "red",
            dataset: addReduce.statuses
        }, {
            field: "paytype",
            name: "付款类型",
            prop: "paytype",
            clazz: "red",
            dataset: addReduce.paytypes
        }, {
            field: "isAffirm",
            name: "是否确认",
            prop: "isAffirm",
            clazz: "red",
            dataset: addReduce.isAffirms
        }];

        search.line("content", lineprops, linebtns);
    }

    if (addReduce.pageType == "page") {

        params.quotation.atttype = params['urlLoadParams'].atttype;

        com.focusPage('#add').addClass("hide");
        com.focusPage('#btnNotice').addClass("hide");
        com.focusPage('#btnBack').addClass("hide");
        com.focusPage('#updated').addClass("hide");
        com.focusPage('#print').addClass("hide");

        search.base("condList", "pagenation", "resultList", api.addReduce.pageAddReduce);
        search.condition(["quotation-addreduce-orderId", "quotation-addreduce-designer", "quotation-addreduce-village", "quotation-addreduce-houseNumber", "quotation-addreduce-houseArea"]);

        var lineprops = [{
            field: "decoration.orderId",
            name: "装修单号",
            prop: "decoration.orderId",
            clazz: "grey"
        }, {
            field: "name",
            name: "楼盘",
            prop: "decoration.house.village.name",
            clazz: "grey"
        }, {
            field: "houseNumber",
            name: "楼号",
            prop: "decoration.house.houseNumber",
            clazz: "grey"
        }, {
            field: "buildArea",
            name: "面积",
            prop: "decoration.house.buildArea",
            clazz: "grey"
        }, {
            field: "currentName",
            name: "设计师",
            prop: "decoration.designer.currentName",
            clazz: "grey"
        }, {
            field: "createTime",
            name: "创建时间",
            prop: "decoration.createTime",
            clazz: "green"
        }, {
            field: "houseClass",
            name: "房屋类型",
            prop: "decoration.houseClass",
            clazz: "grey"
        }, {
            type: "newline"
        }, {
            field: "type",
            name: "类别",
            prop: "type",
            clazz: "red",
            dataset: addReduce.types
        }, {
            field: "atttype",
            name: "类型",
            prop: "atttype",
            clazz: "red",
            dataset: addReduce.atttypes
        }, {
            field: "createTime",
            name: "创建时间",
            prop: "createTime",
            clazz: "green"
        }, {
            field: "undisPrice",
            name: "非打折总额",
            prop: "undisPrice",
            clazz: "blue"
        }, {
            field: "disPrice",
            name: "打折总额",
            prop: "disPrice",
            clazz: "blue"
        }, {
            field: "consPrice",
            name: "工程总额",
            prop: "consPrice",
            clazz: "blue"
        }, {
            field: "managePrice",
            name: "管理费",
            prop: "managePrice",
            clazz: "blue"
        }, {
            field: "total",
            name: "总价",
            prop: "total",
            clazz: "blue"
        }, {
            field: "status",
            name: "状态",
            prop: "status",
            clazz: "red",
            dataset: addReduce.statuses
        }, {
            field: "paytype",
            name: "付款类型",
            prop: "paytype",
            clazz: "red",
            dataset: addReduce.paytypes
        }, {
            field: "isAffirm",
            name: "是否确认",
            prop: "isAffirm",
            clazz: "red",
            dataset: addReduce.isAffirms
        }];
        search.line("decoration.orderId", lineprops, linebtns);
    }

    search.render();

    // 查看按钮方法
    function viewDetailAddReduce(v) {

        params.quotation.addReduce = v;

        com.switchPage(api.index.addReduceDetailIndex.url);
    }

    // 添加按钮
    com.focusPage('#add').click(function() {

        addReduce.editFlag = false;
        com.cleanItems(addReduce.items);

        addReduce.items.addReduceType.attr('disabled', false);

        addReduce.modals.addReduceModal.modal("show");
    });
    // 打印按钮
    com.focusPage('#print').click(function() {

        var $inputs = com.focusPage('input[name="arids"]:checked');

        if (!$inputs.length)
            return false;

        var _addReduceIds = [];

        $.each($inputs, function(i, v) {

            _addReduceIds.push(parseInt($(v).val()));
        });

        params.quotation.arids = _addReduceIds;

        com.popup("增减项打印", api.index.addReduceOutputIndex.url, null, null, true);
    });

    // 发送按钮
    com.focusPage('#btnNotice').click(function() {

        var $inputs = com.focusPage('input[name="arids"]:checked');
        var arid = $inputs.val();

        $.each($inputs, function(i, v) {

            var $v = $(v);

            if ($v.val()) {
                if ($inputs.val() != $v.val()) {
                    arid += "," + $v.val();
                }
            }
        });

        var options = {
            "addReduce.content": arid,
            "addReduce.orderId": addReduce.orderId
        };

        com.showConfirm("是否发送查看通知", function() {

            com.post(api.addReduce.sendAddReduce, options, function(res) {

                com.showAlert(com.info, "操作成功");
                search.doSearch();
            });
        });

    });

    // 返回按钮
    com.focusPage('#btnBack').click(function() {

        com.switchPage(params.historyPage);
    });

    // 刷新按钮
    com.focusPage('#updated').click(function() {

        search.doSearch();
    });

    function saveData() {

        if (com.validate("addReduceModal"))
            return false;

        var url;
        var options = {
            "addReduce.content": addReduce.items.addReduceDes.val(),
            "addReduce.type": addReduce.items.addReduceType.val(),
            "addReduce.atttype": addReduce.items.atttype.val(),
            "addReduce.orderId": addReduce.orderId
        };

        url = api.addReduce.addAddReduce;
        options["addReduce.status"] = 0;
        options["addReduce.total"] = 0;
        options["addReduce.managePrice"] = 0;

        com.post(url, options, function(res) {

            com.showAlert(com.info, "操作成功");
            search.doSearch();

            addReduce.modals.addReduceModal.modal("hide");
        });
    }

    function unpay(arid, paytype) {

        var options = {
            "addReduce.arId": arid,
            "addReduce.paytype": paytype,
        };

        com.post(api.addReduce.unpayAddReduce, options, function(res) {

            com.showAlert(com.info, "操作成功");
            search.doSearch();
        });
    }

    function confirm(arid) {

        var options = {
            "addReduce.arId": arid
        };

        com.post(api.addReduce.confirmAddReduce, options, function(res) {

            com.showAlert(com.info, "操作成功");
            search.doSearch();
        });
    }

    // 删除按钮方法
    function removeRow(arid) {

        com.post(api.addReduce.deleteAddReduce, {
            "addReduce.arId": arid
        }, function(res) {

            com.showAlert(com.info, "操作成功");
            search.doSearch();
        });
    }

});
