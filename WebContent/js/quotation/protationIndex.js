$(function() {

    var protation = {

        protation: null,

        protationList: com.focusPage("#protationList"),
        decorationInfo: com.focusPage("#decorationInfo"),

        modals: {
            protationModal: com.focusPage('#protationModal'),
        },

        items: {
            pid: com.focusPage("#pid", "#protationModal"),
            name: com.focusPage("#name", "#protationModal"),
            version: com.focusPage("#version", "#protationModal"),
            produce: com.focusPage("#produce", "#protationModal"),
            comment: com.focusPage("#comment", "#protationModal"),
            quoteArea: com.focusPage("#quoteArea", "#protationModal"),
            preferPrice: com.focusPage("#preferPrice", "#protationModal"),
            decorationInfo: com.focusPage("#decorationInfo"),
        },

        datasets: {
            "quotationLimit": 3,
            "quotationNum": 0,
        },

        orderId: params.quotation.orderId,

        pageType: params.urlLoadParams.type,

    };

    protation.modals.protationModal.on('hide.bs.modal', function() {

        com.clearValidator();
        com.cleanItems(protation.items);
    });

    com.post(api.quotation.queryPresignProduce, {}, function(res) {

        protation.items.produce.bindData(res.presignProduces, "ppid", "name");
    });

    com.post(api.quotation.queryQuotationVersion, {}, function(res) {

        protation.items.version.bindData(res.quotationVersions, "qvId", "name", "无");
    });

    com.focusPage('#btnBack').on('click', function() {

        com.switchPage("/views/decoration/decoration.html");
    });

    com.focusPage('#createProtation').on('click', function() {

        protation.protation = null;

        com.focusPage("#versionGroup", "#protationModal").hide();

        protation.items.produce.removeAttr("disabled");
        protation.items.quoteArea.removeAttr("disabled");
        protation.items.preferPrice.removeAttr("disabled");

        com.clearValidator();
        com.cleanItems(protation.items);

        protation.modals.protationModal.modal("show");
    });

    com.focusPage('#saveBtn').bindClick(function() {

        if (com.validate("protationModal"))
            return false;

        if (protation.protation == null) {

            var options = {
                "protation.ppid": protation.items.produce.val(),
                "protation.orderId": protation.orderId,
                "protation.name": protation.items.name.val(),
                "protation.preferPrice": protation.items.preferPrice.val(),
                "protation.managePrice": 0,
                "protation.quoteArea": protation.items.quoteArea.val(),
                "protation.comment": protation.items.comment.val(),
            };
            com.post(api.quotation.addProtation, options, function(res) {

                protation.modals.protationModal.modal("hide");

                searcher.doSearch();
            });
        } else {

            var options = {
                "protation.orderId": protation.orderId,
                "protation.pid": protation.protation.pid,
                "protation.name": protation.items.name.val(),
                "protation.version.qvId": protation.items.version.val(),
                "protation.comment": protation.items.comment.val(),
            };

            com.post(api.quotation.updateProtation, options, function(res) {

                com.showAlert(com.info, "操作成功");

                protation.modals.protationModal.modal("hide");

                searcher.doSearch();
            });
        }
    });

    function initProtationList() {

        var protationList = com.focusPage("#protationList").html("");

        com.post(api.decoration.queryDecorationForCommonByOrderId, {
            "decoration.orderId": protation.orderId
        }, function(res) {

            drawquotation(res.decoration);
            drawdecoration(res.decoration);
        }, null, false);

    }

    function drawdecoration(decoration) {

        var protationDiv = $('<div></div>').addClass("col-xs-6 col-md-3").attr('id', 'protationDiv_' + pid).prependTo(protation.decorationInfo);
        var protationWidget = $('<div></div>').addClass("widget-box").appendTo(protationDiv);
        var protationWidgetHeader = $('<div></div>').addClass("widget-header header-color-blue").appendTo(protationWidget);

        var name = $('<h4></h4>').attr('id', 'h4name_').text("装修单").appendTo(protationWidgetHeader);

        var protationWidgetBody = $('<div></div>').addClass("widget-body").appendTo(protationWidget);
        var protationWidgetMain = $('<div></div>').addClass("widget-main").appendTo(protationWidgetBody);
        var protationWidgetInfoDiv = $('<div></div>').css("padding", "5px").appendTo(protationWidgetMain);

        var protationWidgetDivOne = $('<div></div>').appendTo(protationWidgetInfoDiv);
        var protationWidgetLabelOne = $('<label></label>').attr('for', 'form-field').attr('id', 'name_' + pid).text('装修单号: ' + decoration.orderId).appendTo(protationWidgetDivOne);
        var protationWidgetDivTwo = $('<div></div>').appendTo(protationWidgetInfoDiv);
        var protationWidgetLabelTwo = $('<label></label>').attr('for', 'form-field').attr('id', 'style_' + pid).text('楼盘地址: ' + decoration.house.village.name + " " + decoration.house.houseNumber).appendTo(protationWidgetDivTwo);
        var protationWidgetDivThr = $('<div></div>').appendTo(protationWidgetInfoDiv);
        var protationWidgetLabelThr = $('<label></label>').attr('for', 'form-field').attr('id', 'time_' + pid).text('报价版本: ' + decoration.version.name).appendTo(protationWidgetDivThr);

    }

    function drawquotation(decoration) {

        com.post(api.system.querySystemConfigByKey, {
            "systemConfig.key": "protationlimit"
        }, function(res) {

            if (res.systemConfig.value)
                protation.datasets.quotationLimit = res.systemConfig.value;
        }, null, false);

        var $widget = $('<div></div>').addClass("col-xs-6 col-md-3").prependTo(protation.decorationInfo);
        var $box = $('<div></div>').addClass("widget-box").appendTo($widget);
        var $header = $('<div></div>').addClass("widget-header header-color-orange").appendTo($box);
        var name = $('<h4></h4>').attr('id', 'worksheet4content').text("预签单").appendTo($header);
        var $body = $('<div></div>').addClass("widget-body").appendTo($box);
        var $main = $('<div></div>').addClass("widget-main").appendTo($body);

        $('<div></div>').append($('<label></label>').attr('for', 'form-field').text('可用数量: ' + protation.datasets.quotationLimit)).appendTo($main);
        $('<div></div>').append($('<label></label>').attr('id', 'quotationNum').attr('for', 'form-field').text('已用数量: ')).appendTo($main);
        $('<div></div>').append($('<label></label>').attr('id', 'subNum').attr('for', 'form-field').text('剩余数量: ')).appendTo($main);
    }

    var searcher = new Searcher();

    var btnUpdate = {
        name: "修改",
        clazz: "btn-blue",
        handle: function(v) {

            protation.protation = v;

            com.clearValidator();

            com.focusPage("#versionGroup", "#protationModal").show();

            protation.items.produce.attr("disabled", "disabled");
            protation.items.quoteArea.attr("disabled", "disabled");
            protation.items.preferPrice.attr("disabled", "disabled");

            if (protation.pageType == null) {
                protation.items.version.attr("disabled", "disabled");
            }

            if (protation.pageType == "page") {
                protation.items.version.removeAttr("disabled");
            }

            com.post(api.quotation.queryProtationByPid, {
                "protation.pid": v.pid
            }, function(res) {

                protation.items.pid.val(res.protation.pid);
                protation.items.name.val(res.protation.name);
                protation.items.comment.val(res.protation.comment);
                protation.items.produce.val(res.protation.ppid);
                protation.items.quoteArea.val(res.protation.quoteArea);
                protation.items.preferPrice.val(res.protation.preferPrice);

                if (res.protation.version && res.protation.version.qvId) {
                    protation.items.version.val(res.protation.version.qvId);
                }

                protation.protation = res.protation;

                protation.modals.protationModal.modal("show");
            });
        }
    };

    var btnView = {
        name: "查看",
        clazz: "btn-success",
        handle: function(v) {

            params.historyPage = api.index.protationIndex.url;

            v.orderId = v.decoration ? v.decoration = v.decoration.orderId : v.orderId;

            params.quotation.protation = v;

            com.switchPage(api.index.protationPart.url);
        }
    };

    var btnDelete = {
        name: "删除",
        clazz: "btn-danger",
        handle: function(v) {

            if (com.focusPage("#defaultProtation_" + $(this).attr("data-pid")).hasClass("hide")) {
                com.showAlert(com.warning, "默认预签不能删除");
                return false;
            }

            var dataname = v.name;

            com.showConfirm("确定要删除预签: " + dataname, function() {

                com.post(api.quotation.deleteProtation, {
                    "protation.pid": v.pid,
                    "protation.orderId": protation.pageType != null ? v.decoration.orderId : protation.orderId,
                }, function(res) {

                    searcher.doSearch();
                });
            });
        }
    };

    var btnDefault = {
        name: "默认",
        clazz: "btn-inverse",
        handle: function(v) {

            if (v.defaults == constant.quotation().protation.DEFAULT_COMMON_INT) {
                var that = $(this)
                var options = {
                    "protation.pid": v.pid,
                    "protation.orderId": protation.pageType != null ? v.decoration.orderId : protation.orderId,
                }

                com.post(api.quotation.changeProtationForDefault, options, function(res) {

                    that.addClass("hide");
                    searcher.doSearch();
                    com.focusPage("#presignQuotation_" + that.attr("data-pid")).removeClass("hide");
                });
            }
        },
        show: function(v) {

            return (v.defaults == constant.quotation().protation.DEFAULT_COMMON_INT);
        }
    };

    var btnLock = {
        name: "锁定",
        clazz: "btn-pink",
        handle: function(v) {

            var that = $(this);
            var pid = v.pid
            var unlockBtn = $("#unlockProtation" + pid)

            var options = {
                "protation.pid": pid
            }

            com.post(api.quotation.lockProtation, options, function(res) {

                com.showAlert(com.info, "锁定成功");
                that.addClass("hide");
                searcher.doSearch();
            });
        },
        show: function(v) {

            return (v.status == constant.quotation().protation.STATUS_INIT_INT);
        }
    };

    var btnUnlock = {
        name: "解锁",
        clazz: "btn-info",
        handle: function(v) {

            var that = $(this);
            var pid = v.pid
            var lockBtn = $("#lockProtation" + pid)

            var options = {
                "protation.pid": pid
            }

            com.post(api.quotation.unlockProtation, options, function(res) {

                com.showAlert(com.info, "解锁成功");
                that.addClass("hide");
                searcher.doSearch();
            })
        },
        show: function(v) {

            return (v.status == constant.quotation().protation.STATUS_LOCK_INT);
        }
    };

    if (protation.pageType == null) {

        com.focusPage('#fl-statement').statement("报价", "预签").show();
        com.focusPage('#decorationInfo').show();

        com.focusPage("#pagenation").hide();

        initProtationList();

        var cardbtns = [btnUpdate, btnView, btnDelete, btnDefault, btnLock, btnUnlock];

        searcher.set("pageltList", "pageltList", "resultList", api.quotation.queryProtationByOrderId, {
            "protation.orderId": protation.orderId,
        }, null, null, "protations", true);

        var cardprops = [{
            field: "name",
            name: "名称",
            prop: "name"
        }, {
            fieId: "version.name",
            name: "版本",
            prop: function(v) {

                return v.version.qvId ? v.version.name : "无";
            }
        }, {
            field: "product",
            name: "产品",
            prop: "product"
        }, {
            field: "createTime",
            name: "时间",
            prop: "createTime"
        }, {
            field: "totalPrice",
            name: "总价",
            prop: "totalPrice"
        }, {
            field: "comment",
            name: "备注",
            prop: "comment"
        }];

        searcher.card("name", cardprops, cardbtns).render(function() {

            protation.datasets.quotationNum = com.focusPage("#resultList").find("div.widget-box").length;

            var sub = protation.datasets.quotationLimit - protation.datasets.quotationNum;

            com.focusPage("#quotationNum").text('已用数量: ' + protation.datasets.quotationNum);
            com.focusPage("#subNum").text('剩余数量: ' + sub);
        });
    }

    if (protation.pageType == "page") {

        protation.pageConfig = getConfig(params['urlLoadParams'].depage, 2);

        com.focusPage("#protationIndexPageContent").removeClass("page-content");

        var cardbtns = [];

        if (protation.pageConfig.pageBtn.contains("update"))
            cardbtns.push(btnUpdate);

        if (protation.pageConfig.pageBtn.contains("view"))
            cardbtns.push(btnView);

        if (protation.pageConfig.pageBtn.contains("delete"))
            cardbtns.push(btnDelete);

        if (protation.pageConfig.pageBtn.contains("default"))
            cardbtns.push(btnDefault);

        if (protation.pageConfig.pageBtn.contains("lock"))
            cardbtns.push(btnLock);

        if (protation.pageConfig.pageBtn.contains("unlock"))
            cardbtns.push(btnUnlock);

        searcher.base("condList", "pagenation", "resultList", protation.pageConfig.apiPage);
        searcher.condition(protation.pageConfig.condArr);
        searcher.history("protationPostData");

        var cardprops = [{
            field: "decoration.orderId",
            name: "装修单号",
            prop: "decoration.orderId",
            clazz: "blue",
            click: function(btn, v) {

                tools.decoration.info(btn, v.decoration.orderId);
            },
            show: function(v) {

                return protation.pageConfig.propertyArr.contains("decorationOrderId");
            }
        }, {
            field: "name",
            name: "楼盘",
            prop: "decoration.house.village.name",
            clazz: "grey",
            show: function(v) {

                return protation.pageConfig.propertyArr.contains("decorationHouseVillageName");
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

                return protation.pageConfig.propertyArr.contains("decorationHouseHouseNumber");
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

                return protation.pageConfig.propertyArr.contains("decorationCustomerName");
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

                return protation.pageConfig.propertyArr.contains("decorationDesignerCurrentName");
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

                return protation.pageConfig.propertyArr.contains("decorationSalesmanCurrentName");
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

                return protation.pageConfig.propertyArr.contains("decorationHouseBuildArea");
            }
        }, {
            field: "decoration.status",
            name: "订单状态",
            prop: "decoration.status",
            dataset: constant.decoration().decoration.status.keys,
            clazz: "red",
            show: function(v) {

                return protation.pageConfig.propertyArr.contains("decorationStatus");
            }
        }, {
            type: "newline"
        }, {
            field: "name",
            name: "名称",
            prop: "name",
            clazz: "grey",
            show: function(v) {

                return protation.pageConfig.propertyArr.contains("name");
            }
        }, {
            fieId: "version.name",
            name: "版本",
            prop: function(v) {

                return v.version.qvId ? v.version.name : "无";
            },
            clazz: "grey",
        }, {
            field: "createTime",
            name: "创建时间",
            prop: "createTime",
            clazz: "green",
            show: function(v) {

                return protation.pageConfig.propertyArr.contains("createTime");
            }
        }, {
            field: "creater.currentName",
            name: "创建人",
            prop: "creater.currentName",
            clazz: "grey",
            show: function(v) {

                return protation.pageConfig.propertyArr.contains("createrCurrentName");
            },
            click: function(btn, v) {

                tools.personel.info(btn, v.creater.userId);
            }
        }, {
            field: "quotePrice",
            name: "起报价",
            prop: "quotePrice",
            clazz: "blue",
            show: function(v) {

                return protation.pageConfig.propertyArr.contains("quotePrice");
            }
        }, {
            field: "quoteArea",
            name: "面积",
            prop: "quoteArea",
            clazz: "blue",
            show: function(v) {

                return protation.pageConfig.propertyArr.contains("quoteArea");
            }
        }, {
            field: "unitPrice",
            name: "计价单价",
            prop: "unitPrice",
            clazz: "blue",
            show: function(v) {

                return protation.pageConfig.propertyArr.contains("unitPrice");
            }
        }, {
            field: "profitRate",
            name: "利润率",
            prop: "profitRate",
            clazz: "blue",
            show: function(v) {

                return protation.pageConfig.propertyArr.contains("profitRate");
            }
        }, {
            field: "basicPrice",
            name: "基础额",
            prop: "basicPrice",
            clazz: "blue",
            show: function(v) {

                return protation.pageConfig.propertyArr.contains("basicPrice");
            }
        }, {
            field: "comdPrice",
            name: "工程额",
            prop: "comdPrice",
            clazz: "blue",
            show: function(v) {

                return protation.pageConfig.propertyArr.contains("comdPrice");
            }
        }, {
            field: "commPrice",
            name: "主材额",
            prop: "commPrice",
            clazz: "blue",
            show: function(v) {

                return protation.pageConfig.propertyArr.contains("commPrice");
            }
        }, {
            field: "adddPrice",
            name: "增工额",
            prop: "adddPrice",
            clazz: "blue",
            show: function(v) {

                return protation.pageConfig.propertyArr.contains("adddPrice");
            }
        }, {
            field: "addmPrice",
            name: "增主额",
            prop: "addmPrice",
            clazz: "blue",
            show: function(v) {

                return protation.pageConfig.propertyArr.contains("addmPrice");
            }
        }, {
            field: "subdPrice",
            name: "减工额",
            prop: "subdPrice",
            clazz: "blue",
            show: function(v) {

                return protation.pageConfig.propertyArr.contains("subdPrice");
            }
        }, {
            field: "submPrice",
            name: "减主额",
            prop: "submPrice",
            clazz: "blue",
            show: function(v) {

                return protation.pageConfig.propertyArr.contains("submPrice");
            }
        }, {
            field: "totalPrice",
            name: "总额",
            prop: "totalPrice",
            clazz: "blue",
            show: function(v) {

                return protation.pageConfig.propertyArr.contains("totalPrice");
            }
        }, {
            field: "mostPrice",
            name: "主材成本",
            prop: "mostPrice",
            clazz: "blue",
            show: function(v) {

                return protation.pageConfig.propertyArr.contains("mostPrice");
            }
        }, {
            field: "costRate",
            name: "工程增项成本比例",
            prop: "costRate",
            clazz: "blue",
            show: function(v) {

                return protation.pageConfig.propertyArr.contains("costRate");
            }
        }, {
            field: "mostRate",
            name: "主材增项成本比例",
            prop: "mostRate",
            clazz: "blue",
            show: function(v) {

                return protation.pageConfig.propertyArr.contains("mostRate");
            }
        }, {
            field: "totalCost",
            name: "成本总额",
            prop: "totalCost",
            clazz: "blue",
            show: function(v) {

                return protation.pageConfig.propertyArr.contains("totalCost");
            }
        }, {
            field: "totalProfit",
            name: "利润总额",
            prop: "totalProfit",
            clazz: "blue",
            show: function(v) {

                return protation.pageConfig.propertyArr.contains("totalProfit");
            }
        }, {
            field: "discount",
            name: "折扣",
            prop: "discount",
            clazz: "blue",
            show: function(v) {

                return protation.pageConfig.propertyArr.contains("discount");
            }
        }, {
            field: "manageRate",
            name: "管理费比例",
            prop: "manageRate",
            clazz: "blue",
            show: function(v) {

                return protation.pageConfig.propertyArr.contains("manageRate");
            }
        }, {
            field: "managePrice",
            name: "管理费",
            prop: "managePrice",
            clazz: "blue",
            show: function(v) {

                return protation.pageConfig.propertyArr.contains("managePrice");
            }
        }, {
            field: "preferPrice",
            name: "优惠价",
            prop: "preferPrice",
            clazz: "blue",
            show: function(v) {

                return protation.pageConfig.propertyArr.contains("preferPrice");
            }
        }, {
            field: "comment",
            name: "备注",
            prop: "comment",
            clazz: "grey",
            show: function(v) {

                return protation.pageConfig.propertyArr.contains("comment");
            }
        }, {
            field: "status",
            name: "状态",
            prop: "status",
            dataset: constant.quotation().protation.status.keys,
            clazz: "red",
            show: function(v) {

                return protation.pageConfig.propertyArr.contains("status");
            }
        }];

        searcher.line("decoration.orderId", cardprops, cardbtns);

    }

    searcher.render();

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