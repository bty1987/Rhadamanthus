$(function() {

    var ruotation = {

        items: {
            replicaOrderId: com.focusPage("#replicaOrderId", "#addRuotationModal"),
            replicaQuotation: com.focusPage("#replicaQuotation", "#addRuotationModal"),
            comment: com.focusPage("#comment", "#addRuotationModal")
        },

        modals: {
            addRuotationModal: com.focusPage('#addRuotationModal')
        },

        pageConfig: null
    };

    ruotation.items.replicaOrderId.on("blur", function() {

        var options = {
            "quotation.orderId": $(this).val(),
        };

        com.post(api.quotation.queryQuotationByOrderId, options, function(res) {

            ruotation.items.replicaQuotation.bindData(res.quotations, 'qid', 'name');
        });
    });

    var searcher = new Searcher();

    var btnView = {
        name: "查看",
        clazz: "btn-success",
        handle: function(v) {

            params.quotation.ruotation = v;

            com.switchPage(api.index.ruotationPartIndex.url);
        }
    };

    var btnDelete = {
        name: "删除",
        clazz: "btn-danger",
        handle: function(v) {

            com.post(api.quotation.deleteRuotation, {
                "ruotation.qrid": v.qrid,
                "ruotation.decoration.orderId": v.decoration.orderId
            }, function(res) {

                searcher.doSearch();
            });
        }
    };

    ruotation.pageConfig = getConfig(params['urlLoadParams'].depage, 9);

    var cardbtns = [];

    if (ruotation.pageConfig.pageBtn.contains("view"))
        cardbtns.push(btnView);

    if (ruotation.pageConfig.pageBtn.contains("delete"))
        cardbtns.push(btnDelete);

    searcher.base("condList", "pagenation", "resultList", ruotation.pageConfig.apiPage);
    searcher.condition(ruotation.pageConfig.condArr);
    searcher.history("ruotationPostData");

    searcher.button([{
        id: "createRuotation",
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

            return ruotation.pageConfig.propertyArr.contains("decorationOrderId");
        }
    }, {
        field: "name",
        name: "楼盘",
        prop: "decoration.house.village.name",
        clazz: "grey",
        show: function(v) {

            return ruotation.pageConfig.propertyArr.contains("decorationHouseVillageName");
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

            return ruotation.pageConfig.propertyArr.contains("decorationHouseHouseNumber");
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

            return ruotation.pageConfig.propertyArr.contains("decorationCustomerName");
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

            return ruotation.pageConfig.propertyArr.contains("decorationDesignerCurrentName");
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

            return ruotation.pageConfig.propertyArr.contains("decorationSalesmanCurrentName");
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

            return ruotation.pageConfig.propertyArr.contains("decorationHouseBuildArea");
        }
    }, {
        field: "decoration.status",
        name: "订单状态",
        prop: "decoration.status",
        dataset: constant.decoration().decoration.status.keys,
        clazz: "red",
        show: function(v) {

            return ruotation.pageConfig.propertyArr.contains("decorationStatus");
        }
    }, {
        type: "newline"
    }, {
        field: "quotation.name",
        name: "报价单名称",
        prop: "quotation.name",
        clazz: "grey",
        show: function(v) {

            return ruotation.pageConfig.propertyArr.contains("quotationName");
        }
    }, {
        field: "version.name",
        name: "报价版本",
        prop: "version.name",
        clazz: "grey",
        show: function(v) {

            return ruotation.pageConfig.propertyArr.contains("version");
        }
    }, {
        field: "creater.currentName",
        name: "创建人",
        prop: "creater.currentName",
        clazz: "grey",
        show: function(v) {

            return ruotation.pageConfig.propertyArr.contains("creater");
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

            return ruotation.pageConfig.propertyArr.contains("createTime");
        }
    }, {
        field: "totalPrice",
        name: "总额",
        prop: "totalPrice",
        clazz: "blue",
        show: function(v) {

            return ruotation.pageConfig.propertyArr.contains("totalPrice");
        }
    }, {
        field: "status",
        name: "状态",
        prop: "status",
        dataset: constant.quotation().ruotation.status.keys,
        clazz: "red",
        show: function(v) {

            return ruotation.pageConfig.propertyArr.contains("ruotationStatus");
        }
    }, {
        field: "content",
        name: "说明",
        prop: "content",
        clazz: "grey",
        show: function(v) {

            return ruotation.pageConfig.propertyArr.contains("content");
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

    com.focusPage('#createRuotation').click(function() {

        ruotation.modals.addRuotationModal.modal("show");
    });

    com.focusPage('#saveRuotationBtn').click(function() {

        if (com.validate('addRuotationModal')) {
            return false;
        }

        var params = {
            "ruotation.quotation.qid": ruotation.items.replicaQuotation.val(),
            "ruotation.decoration.orderId": ruotation.items.replicaOrderId.val(),
            "ruotation.totalPrice": 0,
            "ruotation.content": ruotation.items.comment.val(),
        };

        com.post(api.quotation.addRuotation, params, function(res){

            com.showAlert(com.info, "操作成功");

            searcher.doSearch();

            ruotation.modals.addRuotationModal.modal("hide");
        });
    });
});