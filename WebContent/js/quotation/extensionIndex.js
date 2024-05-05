jQuery(function($) {

    var extension = {

        orderId: params.quotation.orderId,
        qid: null,
        nid: null,

        saveBtn: com.focusPage("#saveBtn").on("click", saveData),
        cancellBtn: com.focusPage("#cancelBtn"),
        modal: com.focusPage("#extensionModal"),

        items: {
            addExtensionDes: com.focusPage("#extensionDes"),
            addExtensionType: com.focusPage("#extensionType"),
            addExtensionAtttype: com.focusPage("#extensionAtttype"),

            decorationInfo: com.focusPage("#decorationInfo"),
        },

        datasets: {

            status: {},
            types: {},

            decorationStatus: {},
        },

        pageType: params.urlLoadParams.type,

        pageConfig: null
    };

    extension.items.addExtensionType.bindData(constant.quotation().extension.type.datas, "key", "value");

    extension.items.addExtensionAtttype.bindData(constant.quotation().extension.atttype.datas, "key", "value");

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

        com.post(api.quotation.queryQuotationForDefaultByOrderId, {
            "quotation.orderId": extension.orderId
        }, function(res) {

            extension.qid = res.quotation.qid;

            drawquotation(res.quotation);
        }, null, false);

        com.post(api.decoration.queryDecorationForCommonByOrderId, {
            "decoration.orderId": extension.orderId
        }, function(res) {

            drawdecoration(res.decoration);
        }, null, false);
    }

    function drawdecoration(decoration) {

        var $widget = $('<div></div>').addClass("col-xs-6 col-md-3").prependTo(decorationInfo);
        var $box = $('<div></div>').addClass("widget-box").appendTo($widget);
        var $header = $('<div></div>').addClass("widget-header header-color-blue").appendTo($box);

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

    function drawquotation(quotation) {

        var $widget = $('<div></div>').addClass("col-xs-6 col-md-3").prependTo(decorationInfo);
        var $box = $('<div></div>').addClass("widget-box").appendTo($widget);
        var $header = $('<div></div>').addClass("widget-header header-color-orange").appendTo($box);

        var name = $('<h4></h4>').attr('id', 'h4name_').text("报价单").appendTo($header);

        var $body = $('<div></div>').addClass("widget-body").appendTo($box);
        var $main = $('<div></div>').addClass("widget-main").appendTo($body);
        var $info = $('<div></div>').css("padding", "5px").appendTo($main);

        $('<div></div>').append($('<label></label>').attr('for', 'form-field').text('报价版本: ' + quotation.version.name)).appendTo($info);
        $('<div></div>').append($('<label></label>').attr('for', 'form-field').text('折扣: ' + quotation.discount)).appendTo($info);
        $('<div></div>').append($('<label></label>').attr('for', 'form-field').text('管理费: ' + quotation.managePrice)).appendTo($info);
        $('<div></div>').append($('<label></label>').attr('for', 'form-field').text('税金: ' + quotation.taxPrice)).appendTo($info);
        $('<div></div>').append($('<label></label>').attr('for', 'form-field').text('总额: ' + quotation.totalPrice)).appendTo($info);
    }

    var searcher = new Searcher();

    var btnView = {
        name: "查看",
        clazz: "btn-success",
        handle: function(v) {

            params.historyPage = api.index.extensionIndex.url;

            params.quotation.extension = v;

            params.quotation.extensionId = v.eid;
            params.quotation.extensionType = v.type;

            com.switchPage(api.index.extensionPartIndex.url);
        }
    };

    var btnDelete = {
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
    };

    var btnMake = {
        name: "定额",
        clazz: "btn-pink",
        handle: function(v) {

            var params = {
                "extension.eid": v.eid,
                "normtion.qid": extension.qid,
                "normtion.orderId": extension.orderId,
                "normtion.moodPrintNum": 0,
                "normtion.moodTotal": 0,
                "normtion.mricePriceNum": 0,
                "normtion.mriceTotal": 0
            };

            com.post(api.quotation.makeNormtionForExtension, params);
        }
    };

    if (extension.pageType == null) {

        com.focusPage('#fl-statement').statement("报价", "扩展").show();
        com.focusPage('#decorationInfo').show();

        com.focusPage("#pagenation").hide();

        initQuotationList();

        var linebtns = [btnMake, btnView, btnDelete];

        var lineprops = [{
            field: "type",
            name: "类型",
            prop: "type",
            clazz: "red",
            dataset: constant.quotation().extension.type.keys,
        }, {
            field: "atttype",
            name: "业务类型",
            prop: "atttype",
            clazz: "red",
            dataset: constant.quotation().extension.atttype.keys,
        }, {
            field: "undisPrice",
            name: "打折项总额",
            prop: "undisPrice",
            clazz: "blue"
        }, {
            field: "manageRate",
            name: "管理费比例",
            prop: "manageRate",
            clazz: "blue"
        }, {
            field: "manageDiscount",
            name: "管理费折扣",
            prop: "manageDiscount",
            clazz: "red",
            dataset: constant.quotation().extension.manageDiscount.keys
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

        extension.pageConfig = getConfig(params['urlLoadParams'].depage, 4);

        com.focusPage("#extensionPageContent").removeClass("page-content");

        com.focusPage('#add').addClass("hide");
        com.focusPage('#btnBack').addClass("hide");
        com.focusPage('#hrdotted').addClass("hide");

        var linebtns = [];

        if (extension.pageConfig.pageBtn.contains("view"))
            linebtns.push(btnView);

        if (extension.pageConfig.pageBtn.contains("delete"))
            linebtns.push(btnDelete);

        searcher.base("condList", "pagenation", "resultList", extension.pageConfig.apiPage);
        searcher.condition(extension.pageConfig.condArr);
        searcher.history("extensionPostData");

        var lineprops = [{
            field: "decoration.orderId",
            name: "装修单号",
            prop: "decoration.orderId",
            clazz: "blue",
            click: function(btn, v) {

                tools.decoration.info(btn, v.decoration.orderId);
            },
            show: function(v) {

                return extension.pageConfig.propertyArr.contains("decorationOrderId");
            }
        }, {
            field: "name",
            name: "楼盘",
            prop: "decoration.house.village.name",
            clazz: "grey",
            show: function(v) {

                return extension.pageConfig.propertyArr.contains("decorationHouseVillageName");
            },
            click: function(btn, v) {

                tools.village.info(btn, v.decoration.house.village.no);
            }
        }, {
            field: "houseNumber",
            name: "楼号",
            prop: "decoration.house.houseNumber",
            clazz: "grey",
            show: function(v) {

                return extension.pageConfig.propertyArr.contains("decorationHouseHouseNumber");
            },
            click: function(btn, v) {

                tools.house.info(btn, v.decoration.house.hid);
            }
        }, {
            field: "name",
            name: "客户名",
            prop: "decoration.customer.name",
            clazz: "grey",
            show: function(v) {

                return extension.pageConfig.propertyArr.contains("decorationCustomerName");
            },
            click: function(btn, v) {

                tools.customer.info(btn, v.decoration.customer.cid);
            }
        }, {
            field: "currentName",
            name: "设计师",
            prop: "decoration.designer.currentName",
            clazz: "grey",
            show: function(v) {

                return extension.pageConfig.propertyArr.contains("decorationDesignerCurrentName");
            },
            click: function(btn, v) {

                tools.personel.info(btn, v.decoration.designer.userId);
            }
        }, {
            field: "currentName",
            name: "业务员",
            prop: "decoration.salesman.currentName",
            clazz: "grey",
            show: function(v) {

                return extension.pageConfig.propertyArr.contains("decorationSalesmanCurrentName");
            },
            click: function(btn, v) {

                tools.personel.info(btn, v.decoration.salesman.userId);
            }
        }, {
            field: "buildArea",
            name: "面积",
            prop: "decoration.house.buildArea",
            clazz: "blue",
            show: function(v) {

                return extension.pageConfig.propertyArr.contains("decorationHouseBuildArea");
            }
        }, {
            field: "decoration.status",
            name: "订单状态",
            prop: "decoration.status",
            dataset: constant.decoration().decoration.status.keys,
            clazz: "red",
            show: function(v) {

                return extension.pageConfig.propertyArr.contains("decorationStatus");
            }
        }, {
            type: "newline"
        }, {
            field: "type",
            name: "类型",
            prop: "type",
            clazz: "red",
            dataset: constant.quotation().extension.type.keys,
            show: function(v) {

                return extension.pageConfig.propertyArr.contains("type");
            }
        }, {
            field: "atttype",
            name: "业务类型",
            prop: "atttype",
            clazz: "red",
            dataset: constant.quotation().extension.atttype.keys,
            show: function(v) {

                return extension.pageConfig.propertyArr.contains("atttype");
            }
        }, {
            field: "undisPrice",
            name: "打折项总额",
            prop: "undisPrice",
            clazz: "blue",
            show: function(v) {

                return extension.pageConfig.propertyArr.contains("undisPrice");
            }
        }, {
            field: "manageRate",
            name: "管理费比例",
            prop: "manageRate",
            clazz: "blue",
            show: function(v) {

                return extension.pageConfig.propertyArr.contains("manageRate");
            }
        }, {
            field: "manageDiscount",
            name: "管理费折扣",
            prop: "manageDiscount",
            clazz: "red",
            dataset: constant.quotation().extension.manageDiscount.keys,
            show: function(v) {

                return extension.pageConfig.propertyArr.contains("manageDiscount");
            }
        }, {
            field: "managePrice",
            name: "管理费",
            prop: "managePrice",
            clazz: "blue",
            show: function(v) {

                return extension.pageConfig.propertyArr.contains("managePrice");
            }
        }, {
            field: "total",
            name: "总价",
            prop: "total",
            clazz: "blue",
            show: function(v) {

                return extension.pageConfig.propertyArr.contains("total");
            }
        }, {
            field: "createTime",
            name: "创建时间",
            prop: "createTime",
            clazz: "green",
            show: function(v) {

                return extension.pageConfig.propertyArr.contains("createTime");
            }
        }, {
            field: "creater.currentName",
            name: "创建人",
            prop: "creater.currentName",
            clazz: "grey",
            show: function(v) {

                return extension.pageConfig.propertyArr.contains("createrCurrentName");
            },
            click: function(btn, v) {

                tools.personel.info(btn, v.creater.userId);
            }
        }, {
            field: "status",
            name: "状态",
            prop: "status",
            dataset: constant.quotation().extension.status.keys,
            clazz: "red",
            show: function(v) {

                return extension.pageConfig.propertyArr.contains("status");
            }
        }, {
            field: "content",
            name: "说明",
            prop: "content",
            clazz: "grey",
            show: function(v) {

                return extension.pageConfig.propertyArr.contains("content");
            }
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
            "extension.total": 0,
            "extension.atttype": extension.items.addExtensionAtttype.val(),
        };

        com.post(url, options, function(res) {

            com.showAlert(com.info, "操作成功");

            searcher.doSearch();

            extension.modal.modal("hide");
        });
    }

    function getConfig(page, type) {

        var pageConfig = {
            "apiPage": null,
            "pageBtn": [],
            "postDataName": page + "PostData",
            "condArr": [],
            "extraParam": [],
            "propertyArr": []
        };

        function packageConfig(o, props, value, subtype) {

            var prop = props.shift();
            if (props.length != 0) {
                if (!o[prop])
                    o[prop] = {};
                packageConfig(o[prop], props, value, subtype);
                return;
            }

            if (subtype == 0) {
                o[prop] = value;
            } else if (subtype == 1 && !o[prop]) {
                o[prop] = [value];
            } else if (subtype == 1 && o[prop]) {
                o[prop].push(value);
            }
        }

        function getApi(o, props) {

            var prop = props.shift();

            if (props.length == 0) {
                return o[prop];
            } else if (o[prop]) {
                return getApi(o[prop], props);
            }
            return "";
        }

        com.post(api.right.queryQuotationFunctionRight, {
            "quotationFunctionRight.name": page,
            "quotationFunctionRight.type": type
        }, function(res) {

            var rights = res.quotationFunctionRights.sort(function(a, b) {

                return a.quotationFunction.sort - b.quotationFunction.sort;
            });

            $.each(rights, function(i, v) {

                var data = v.quotationFunction;

                if (data.type == 1)
                    data.value = getApi({
                        "api": api
                    }, data.value.split("."));

                packageConfig(pageConfig, data.key.split("."), data.value, data.subtype);
            });
        }, null, false);

        return pageConfig;
    }
});
