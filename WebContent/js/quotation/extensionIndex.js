jQuery(function($) {

    var extension = {

        orderId: params.quotation.orderId,

        saveBtn: com.focusPage("#saveBtn").on("click", saveData),
        cancellBtn: com.focusPage("#cancelBtn"),
        modal: com.focusPage("#extensionModal"),

        items: {
            addExtensionDes: com.focusPage("#extensionDes"),
            addExtensionType: com.focusPage("#extensionType"),

            decorationInfo: com.focusPage("#decorationInfo"),
        },

        datasets: {

            status: {},
            types: {},

            decorationStatus: {},
        },

        pageType: params.urlLoadParams.type,
    };

    function initDecorationInfo() {

        var quotationList = com.focusPage("#quotationList").html("");

        com.post(api.decoration.queryDecorationForCommonByOrderId, {
            "decoration.orderId": extension.orderId
        }, function(res) {

            drawdecoration(res.decoration);
        }, null, false);

    }

    var extraParams = {
        "extension.orderId": extension.orderId
    };

    function initQuotationList() {

        com.post(api.decoration.queryDecorationForCommonByOrderId, {
            "decoration.orderId": extension.orderId
        }, function(res) {

            drawdecoration(res.decoration);
        }, null, false);
    }

    function drawdecoration(decoration) {

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
    var searcher = new Searcher();

    var linebtns = [{
        name: "查看",
        clazz: "btn-success",
        handle: function(v) {

            params.historyPage = api.index.extensionIndex.url;

            params.quotation.extension = v;

            params.quotation.extensionId = v.eid;
            params.quotation.extensionType = v.type;

            com.switchPage(api.index.extensionPartIndex.url);
        }
    }, {
        name: "删除",
        clazz: "btn-danger",
        handle: function(v) {

            com.showConfirm("是否确认删除", function() {

                com.post(api.quotation.deleteExtension, {
                    "extension.eid": v.eid
                }, function(res) {

                    com.showAlert(com.info, "操作成功");

                    searcher.doSearch();
                });
            });
        }
    }];

    if (extension.pageType == null) {

        com.focusPage('#fl-statement').statement("报价", "扩展").show();
        com.focusPage('#decorationInfo').show();

        com.focusPage("#pagenation").hide();

        initQuotationList();

        var lineprops = [{
            field: "type",
            name: "类型",
            prop: "type",
            clazz: "red",
            dataset: constant.quotation().extension.type.keys,
        }, {
            field: "undisPrice",
            name: "打折项总额",
            prop: "undisPrice",
            clazz: "blue"
        }, {
            field: "total",
            name: "总价",
            prop: "total",
            clazz: "blue"
        }, {
            field: "createTime",
            name: "创建时间",
            prop: "createTime",
            clazz: "green"
        }, {
            field: "creater.currentName",
            name: "创建人",
            prop: "creater.currentName",
            clazz: "grey"
        }, {
            field: "status",
            name: "状态",
            prop: "status",
            dataset: constant.quotation().extension.status.keys,
            clazz: "red"
        }, {
            field: "content",
            name: "说明",
            prop: "content",
            clazz: "grey"
        }];

        searcher.set("condList", "pagenation", "resultList", api.quotation.queryExtensionByOrderId, extraParams, null, null, "extensions", true);

        searcher.line("content", lineprops, linebtns);
    }

    if (extension.pageType == "page") {

        com.focusPage("#extensionPageContent").removeClass("page-content");

        com.focusPage('#add').addClass("hide");
        com.focusPage('#btnBack').addClass("hide");
        com.focusPage('#hrdotted').addClass("hide");

        searcher.base("condList", "pagenation", "resultList", api.quotation.pageExtension);
        searcher.condition(["quotation-extension-decoration-orderId", "quotation-extension-decoration-village", "quotation-extension-decoration-designer", "quotation-extension-decoration-salesman", "quotation-extension-decoration-status", "quotation-extension-createTime", "quotation-extension-status"]);
        searcher.history("extensionPostData");

        var lineprops = [{
            field: "decoration.orderId",
            name: "装修单号",
            prop: "decoration.orderId",
            clazz: "blue"
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
            field: "name",
            name: "客户名",
            prop: "decoration.customer.name",
            clazz: "grey"
        }, {
            field: "currentName",
            name: "设计师",
            prop: "decoration.designer.currentName",
            clazz: "grey"
        }, {
            field: "currentName",
            name: "业务员",
            prop: "decoration.salesman.currentName",
            clazz: "grey"
        }, {
            field: "buildArea",
            name: "面积",
            prop: "decoration.house.buildArea",
            clazz: "blue"
        }, {
            field: "decoration.status",
            name: "订单状态",
            prop: "decoration.status",
            dataset: constant.decoration().decoration.status.keys,
            clazz: "red"
        }, {
            type: "newline"
        }, {
            field: "type",
            name: "类型",
            prop: "type",
            clazz: "red",
            dataset: constant.quotation().extension.type.keys,
        }, {
            field: "undisPrice",
            name: "打折项总额",
            prop: "undisPrice",
            clazz: "blue"
        }, {
            field: "total",
            name: "总价",
            prop: "total",
            clazz: "blue"
        }, {
            field: "createTime",
            name: "创建时间",
            prop: "createTime",
            clazz: "green"
        }, {
            field: "creater.currentName",
            name: "创建人",
            prop: "creater.currentName",
            clazz: "grey"
        }, {
            field: "status",
            name: "状态",
            prop: "status",
            dataset: constant.quotation().extension.status.keys,
            clazz: "red"
        }, {
            field: "content",
            name: "说明",
            prop: "content",
            clazz: "grey"
        }];

        searcher.line("decoration.orderId", lineprops, linebtns);
    }

    searcher.render();

    com.focusPage('#btnBack').click(function() {

        com.switchPage("/views/decoration/decoration.html");
    });

    com.focusPage('#add').click(function() {

        com.cleanItems(extension.items);

        extension.items.addExtensionType.attr('disabled', false);

        extension.modal.modal("show");
    });

    function viewDetailExtension(extensionId, type) {

        params.quotation.extensionId = extensionId;
        params.quotation.extensionType = type;

        com.switchPage(api.index.extensionDetailIndex.url);
    }

    function removeRow(eid) {

        com.post(api.quotation.deleteExtension, {
            "extension.eid": eid
        }, function(res) {

            com.showAlert(com.info, "操作成功!");
            searcher.doSearch();
        });
    }

    function saveData() {

        if (com.validate("extensionModal"))
            return false;

        var url = api.quotation.addExtension;
        var options = {
            "extension.content": extension.items.addExtensionDes.val(),
            "extension.type": extension.items.addExtensionType.val(),
            "extension.orderId": extension.orderId,
            "extension.status": constant.quotation().extension.STATUS_INIT_SHORT,
            "extension.total": 0
        };

        com.post(url, options, function(res) {

            com.showAlert(com.info, "操作成功");

            searcher.doSearch();

            extension.modal.modal("hide");
        });
    }
});
