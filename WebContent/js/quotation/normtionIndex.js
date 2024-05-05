$(function() {

    var norm = {

        items: {},

        modals: {},

        btns: {},

        datasets: {

            decorationStatus: {},

        },

        pageConfig: null
    };

    norm.pageConfig = getConfig(params['urlLoadParams'].depage, 7);

    var cardbtns = [];

    var btnStatus = {
        name: "状态",
        type: "switch",
        clazz: "status-lbl",
        handle: function(v, check) {

            com.post(api.quotation.updateNormtionForStatus, {
                "normtion.nid": v.nid,
                "normtion.status": check ? 0 : 1
            }, function(res) {

                searcher.doSearch();
            });

            return false;
        },
        init: function(v) {

            return !v.status;
        }
    };

    var btnView = {
        name: "查看",
        clazz: "btn-success",
        handle: function(v) {

            params.quotation.orderId = v.decoration.orderId;
            params.quotation.quotation = v;

            params.historyPage = api.index.normIndex.url;

            com.switchPage(api.index.normPart.url);
        }
    };

    if (norm.pageConfig.pageBtn.contains("btnStatus"))
        cardbtns.push(btnStatus);
    if (norm.pageConfig.pageBtn.contains("view"))
        cardbtns.push(btnView);

    var searcher = new Searcher();

    com.focusPage("#normIndexPageContent").removeClass("page-content");

    searcher.base("condList", "pagenation", "resultList", norm.pageConfig.apiPage);
    searcher.condition(norm.pageConfig.condArr);
    searcher.history("normPostData");

    var normprops = [{
        field: "decoration.orderId",
        name: "装修单号",
        prop: "decoration.orderId",
        clazz: "blue",
        click: function(btn, v) {

            tools.decoration.info(btn, v.decoration.orderId);
        },
        show: function(v) {

            return norm.pageConfig.propertyArr.contains("decorationOrderId");
        }
    }, {
        field: "name",
        name: "楼盘",
        prop: "decoration.house.village.name",
        clazz: "grey",
        show: function(v) {

            return norm.pageConfig.propertyArr.contains("decorationHouseVillageName");
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

            return norm.pageConfig.propertyArr.contains("decorationHouseHouseNumber");
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

            return norm.pageConfig.propertyArr.contains("decorationCustomerName");
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

            return norm.pageConfig.propertyArr.contains("decorationDesignerCurrentName");
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

            return norm.pageConfig.propertyArr.contains("decorationSalesmanCurrentName");
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

            return norm.pageConfig.propertyArr.contains("decorationHouseBuildArea");
        }
    }, {
        field: "decoration.status",
        name: "订单状态",
        prop: "decoration.status",
        dataset: constant.decoration().decoration.status.keys,
        clazz: "red",
        show: function(v) {

            return norm.pageConfig.propertyArr.contains("decorationStatus");
        }
    }, {
        type: "newline"
    }, {
        field: "createTime",
        name: "创建时间",
        prop: "createTime",
        clazz: "green",
        show: function(v) {

            return norm.pageConfig.propertyArr.contains("createTime");
        }
    }, {
        field: "creater.currentName",
        name: "创建人",
        prop: "creater.currentName",
        clazz: "grey",
        show: function(v) {

            return norm.pageConfig.propertyArr.contains("createrCurrentName");
        },
        click: function(btn, v) {

            tools.personel.info(btn, v.creater.userId);
        }
    }, {
        field: "moodTotal",
        name: "材料总额",
        prop: "moodTotal",
        clazz: "blue",
        show: function(v) {

            return norm.pageConfig.propertyArr.contains("moodTotal");
        }
    }, {
        field: "moodPrintNum",
        name: "材料打印次数",
        prop: "moodPrintNum",
        clazz: "blue",
        show: function(v) {

            return norm.pageConfig.propertyArr.contains("moodPrintNum");
        }
    }, {
        field: "mricePriceNum",
        name: "工费打印次数",
        prop: "mricePriceNum",
        clazz: "blue",
        show: function(v) {

            return norm.pageConfig.propertyArr.contains("mricePriceNum");
        }
    }, {
        field: "status",
        name: "状态",
        prop: "status",
        clazz: "red",
        dataset: constant.quotation().normtion.status.keys,
        show: function(v) {

            return norm.pageConfig.propertyArr.contains("status");
        }
    }];

    searcher.line("decoration.orderId", normprops, cardbtns).render();

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