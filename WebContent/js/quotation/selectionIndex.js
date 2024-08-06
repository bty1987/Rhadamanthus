$(function() {

    var selection = {

        items: {},

        modals: {},

        btns: {},

        datasets: {

            status: {},

            decorationStatus: {},

        },
        pageConfig: null
    };

    selection.pageConfig = getConfig(params['urlLoadParams'].depage, 7);

    var btnView = {
        name: "查看",
        clazz: "btn-success",
        handle: function(v) {

            params.quotation.orderId = v.decoration.orderId;

            params.historyPage = api.index.selectionIndex.url;

            com.switchPage(api.index.selectionPartIndex.url);
        }
    };

    var cardbtns = [];

    if (selection.pageConfig.pageBtn.contains("view"))
        cardbtns.push(btnView);

    var searcher = new Searcher();

    com.focusPage("#selectionIndexPageContent").removeClass("page-content");

    searcher.base("condList", "pagenation", "resultList", selection.pageConfig.apiPage);
    searcher.condition(selection.pageConfig.condArr);
    searcher.history("selectionPostData");

    var selecprops = [{
        field: "decoration.orderId",
        name: "装修单号",
        prop: "decoration.orderId",
        clazz: "blue",
        click: function(btn, v) {

            tools.decoration.info(btn, v.decoration.orderId);
        },
        show: function(v) {

            return selection.pageConfig.propertyArr.contains("decorationOrderId");
        }
    }, {
        field: "name",
        name: "楼盘",
        prop: "decoration.house.village.name",
        clazz: "grey",
        show: function(v) {

            return selection.pageConfig.propertyArr.contains("decorationHouseVillageName");
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

            return selection.pageConfig.propertyArr.contains("decorationHouseHouseNumber");
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

            return selection.pageConfig.propertyArr.contains("decorationCustomerName");
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

            return selection.pageConfig.propertyArr.contains("decorationDesignerCurrentName");
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

            return selection.pageConfig.propertyArr.contains("decorationSalesmanCurrentName");
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

            return selection.pageConfig.propertyArr.contains("decorationHouseBuildArea");
        }
    }, {
        field: "decoration.status",
        name: "订单状态",
        prop: "decoration.status",
        dataset: constant.decoration().decoration.status.keys,
        clazz: "red",
        show: function(v) {

            return selection.pageConfig.propertyArr.contains("decorationStatus");
        }
    }, {
        type: "newline"
    }, {
        field: "createTime",
        name: "创建时间",
        prop: "createTime",
        clazz: "green",
        show: function(v) {

            return selection.pageConfig.propertyArr.contains("createTime");
        }
    }, {
        field: "affirmTime",
        name: "确认时间",
        prop: "affirmTime",
        clazz: "green",
        show: function(v) {

            return selection.pageConfig.propertyArr.contains("affirmTime");
        }
    }, {
        field: "creater.currentName",
        name: "创建人",
        prop: "creater.currentName",
        clazz: "grey",
        show: function(v) {

            return selection.pageConfig.propertyArr.contains("createrCurrentName");
        },
        click: function(btn, v) {

            tools.personel.info(btn, v.creater.userId);
        }
    }, {
        field: "total",
        name: "总额",
        prop: "total",
        clazz: "blue",
        show: function(v) {

            return selection.pageConfig.propertyArr.contains("total");
        }
    }, {
        field: "quotationTotal",
        name: "报价总额",
        prop: "quotationTotal",
        clazz: "blue",
        show: function(v) {

            return selection.pageConfig.propertyArr.contains("quotationTotal");
        }
    }, {
        field: "extensionAddTotal",
        name: "拓展增总额",
        prop: "extensionAddTotal",
        clazz: "blue",
        show: function(v) {

            return selection.pageConfig.propertyArr.contains("extensionAddTotal");
        }
    }, {
        field: "extensionReduceTotal",
        name: "拓展减总额",
        prop: "extensionReduceTotal",
        clazz: "blue",
        show: function(v) {

            return selection.pageConfig.propertyArr.contains("extensionReduceTotal");
        }
    }, {
        field: "addReduceAddTotal",
        name: "增减增总额",
        prop: "addReduceAddTotal",
        clazz: "blue",
        show: function(v) {

            return selection.pageConfig.propertyArr.contains("addReduceAddTotal");
        }
    }, {
        field: "addReduceMinusTotal",
        name: "增减减总额",
        prop: "addReduceMinusTotal",
        clazz: "blue",
        show: function(v) {

            return selection.pageConfig.propertyArr.contains("addReduceMinusTotal");
        }
    }, {
        field: "status",
        name: "状态",
        prop: "status",
        dataset: constant.quotation().selection.status.keys,
        clazz: "red",
        show: function(v) {

            return selection.pageConfig.propertyArr.contains("status");
        }
    }, {
        field: "isAffirm",
        name: "确认状态",
        prop: function(v){
            if(v.affirmTime < v.sendTime && v.affirmTime != null && v.sendTime != null){
                return '已变更';
            }else{
                return constant.quotation().selection.isAffirm.keys[v.isAffirm];
            }
        },
        clazz: "red",
        show: function(v) {

            return selection.pageConfig.propertyArr.contains("isAffirm");
        }
    }];

    searcher.line("decoration.orderId", selecprops, cardbtns).render();

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