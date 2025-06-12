$(function() {

    var quotationRefund = {

        items: {
            replicaOrderId: com.focusPage("#replicaOrderId", "#addQuotationRefundModal"),
            replicaQuotation: com.focusPage("#replicaQuotation", "#addQuotationRefundModal"),
            comment: com.focusPage("#comment", "#addQuotationRefundModal")
        },

        modals: {
            addQuotationRefundModal: com.focusPage('#addQuotationRefundModal')
        },

        pageConfig: null
    };

    quotationRefund.items.replicaOrderId.on("blur", function() {

        var options = {
            "quotation.orderId": $(this).val(),
        };

        com.post(api.quotation.queryQuotationByOrderId, options, function(res) {

            quotationRefund.items.replicaQuotation.bindData(res.quotations, 'qid', 'name');
        });
    });

    var searcher = new Searcher();

    var btnView = {
        name: "查看",
        clazz: "btn-success",
        handle: function(v) {

            params.quotation.quotationRefund = v;

            com.switchPage(api.index.quotationRefundPartIndex.url);
        }
    };

    var btnDelete = {
        name: "删除",
        clazz: "btn-danger",
        handle: function(v) {

            com.post(api.quotation.deleteQuotationRefund, {
                "quotationRefund.qrid": v.qrid,
                "quotationRefund.decoration.orderId": v.decoration.orderId
            }, function(res) {

                searcher.doSearch();
            });
        }
    };

    quotationRefund.pageConfig = getConfig(params['urlLoadParams'].depage, 9);

    var cardbtns = [];

    if (quotationRefund.pageConfig.pageBtn.contains("view"))
        cardbtns.push(btnView);

    if (quotationRefund.pageConfig.pageBtn.contains("delete"))
        cardbtns.push(btnDelete);

    searcher.base("condList", "pagenation", "resultList", quotationRefund.pageConfig.apiPage);
    searcher.condition(quotationRefund.pageConfig.condArr);
    searcher.history("quotationRefundPostData");

    searcher.button([{
        id: "createQuotationRefund",
        name: "创建",
        clazz: "btn-yellow",
        icon: "icon-plus"
    }]);

    var cardprops = [{
        field: "decoration.orderId",
        name: "装修单号",
        prop: "decoration.orderId",
        clazz: "blue",
        click: function(btn, v) {

            tools.decoration.info(btn, v.decoration.orderId);
        },
        show: function(v) {

            return quotationRefund.pageConfig.propertyArr.contains("decorationOrderId");
        }
    }, {
        field: "name",
        name: "楼盘",
        prop: "decoration.house.village.name",
        clazz: "grey",
        show: function(v) {

            return quotationRefund.pageConfig.propertyArr.contains("decorationHouseVillageName");
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

            return quotationRefund.pageConfig.propertyArr.contains("decorationHouseHouseNumber");
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

            return quotationRefund.pageConfig.propertyArr.contains("decorationCustomerName");
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

            return quotationRefund.pageConfig.propertyArr.contains("decorationDesignerCurrentName");
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

            return quotationRefund.pageConfig.propertyArr.contains("decorationSalesmanCurrentName");
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

            return quotationRefund.pageConfig.propertyArr.contains("decorationHouseBuildArea");
        }
    }, {
        field: "decoration.status",
        name: "订单状态",
        prop: "decoration.status",
        dataset: constant.decoration().decoration.status.keys,
        clazz: "red",
        show: function(v) {

            return quotationRefund.pageConfig.propertyArr.contains("decorationStatus");
        }
    }, {
        type: "newline"
    }, {
        field: "quotation.name",
        name: "报价单名称",
        prop: "quotation.name",
        clazz: "grey",
        show: function(v) {

            return quotationRefund.pageConfig.propertyArr.contains("quotationName");
        }
    }, {
        field: "version.name",
        name: "报价版本",
        prop: "version.name",
        clazz: "grey",
        show: function(v) {

            return quotationRefund.pageConfig.propertyArr.contains("version");
        }
    }, {
        field: "creater.currentName",
        name: "创建人",
        prop: "creater.currentName",
        clazz: "grey",
        show: function(v) {

            return quotationRefund.pageConfig.propertyArr.contains("creater");
        },
        click: function(btn, v) {

            tools.personel.info(btn, v.creater.userId);
        }
    }, {
        field: "createTime",
        name: "创建时间",
        prop: "createTime",
        clazz: "green",
        show: function(v) {

            return quotationRefund.pageConfig.propertyArr.contains("createTime");
        }
    }, {
        field: "totalPrice",
        name: "总额",
        prop: "totalPrice",
        clazz: "blue",
        show: function(v) {

            return quotationRefund.pageConfig.propertyArr.contains("totalPrice");
        }
    }, {
        field: "content",
        name: "说明",
        prop: "content",
        clazz: "grey",
        show: function(v) {

            return quotationRefund.pageConfig.propertyArr.contains("content");
        }
    }];

    searcher.line("decoration.orderId", cardprops, cardbtns);

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

    com.focusPage('#createQuotationRefund').click(function() {

        quotationRefund.modals.addQuotationRefundModal.modal("show");
    });

    com.focusPage('#saveQuotationRefundBtn').click(function() {

        if (com.validate('addQuotationRefundModal')) {
            return false;
        }

        var params = {
            "quotationRefund.quotation.qid": quotationRefund.items.replicaQuotation.val(),
            "quotationRefund.decoration.orderId": quotationRefund.items.replicaOrderId.val(),
            "quotationRefund.totalPrice": 0,
            "quotationRefund.content": quotationRefund.items.comment.val(),
        };

        com.post(api.quotation.addQuotationRefund, params, function(res){

            com.showAlert(com.info, "操作成功");

            searcher.doSearch();

            quotationRefund.modals.addQuotationRefundModal.modal("hide");
        });
    });
});