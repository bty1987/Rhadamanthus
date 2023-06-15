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

        pageConfig: null,
    };

    function initDecorationInfo() {

        var quotationList = com.focusPage("#quotationList").html("");

        com.post(api.decoration.queryDecorationForCommonByOrderId, {
            "decoration.orderId": addReduce.orderId
        }, function(res) {

            drawdecoration(res.decoration);

            addReduce.decoration = res.decoration;
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

    var viewbtn = {
        name: "查看",
        clazz: "btn-yellow",
        handle: function(v) {

            params.quotation.addReduce = v;

            viewDetailAddReduce(v);
        }
    };

    var submitbtn = {
        name: "提交",
        clazz: "btn-pink",
        handle: function(v) {

            submit(v);

        },
        show: function(v) {

            return (v.status == constant.quotation().addreduce.STATUS_UNSUBMIT_INT && v.paytype == constant.quotation().addreduce.PAYTYPE_PAY_INT);
        }
    };

    var cancelbtn = {
        name: "撤销",
        clazz: "btn-blue",
        handle: function(v) {

            cancel(v);
        },
        show: function(v) {

            return (v.status == constant.quotation().addreduce.STATUS_SUBMIT_INT);
        }
    };

    var allocationbtn = {
        name: "下拨",
        clazz: "btn-success",
        handle: function(v) {

            unpay(v.arId, 1);
        },
        show: function(v) {

            return (v.status == constant.quotation().addreduce.STATUS_UNSUBMIT_INT && v.paytype == constant.quotation().addreduce.PAYTYPE_PAY_INT && v.type == constant.quotation().addreduce.TYPE_ADD_INT);
        }
    };

    var specialbtn = {
        name: "特批",
        clazz: "btn-info",
        handle: function(v) {

            unpay(v.arId, 2);
        },
        show: function(v) {

            return (v.status == constant.quotation().addreduce.STATUS_UNSUBMIT_INT && v.paytype == constant.quotation().addreduce.PAYTYPE_PAY_INT && v.type == constant.quotation().addreduce.TYPE_ADD_INT);
        }
    };

    var norefundbtn = {
        name: "不退",
        clazz: "btn-success",
        handle: function(v) {

            unpay(v.arId, 3);
        },
        show: function(v) {

            return (v.status == constant.quotation().addreduce.STATUS_UNSUBMIT_INT && v.paytype == constant.quotation().addreduce.PAYTYPE_PAY_INT && v.type == constant.quotation().addreduce.TYPE_REDUCE_INT);
        }
    };

    var affirmbtn = {
        name: "确认",
        clazz: "btn-info",
        handle: function(v) {

            com.showConfirm("是否确认增减单", function() {

                confirm(v.arId);
            });
        },
        show: function(v) {

            return ((v.status == constant.quotation().addreduce.STATUS_UNSUBMIT_INT || v.status == constant.quotation().addreduce.STATUS_SUBMIT_INT) && (v.paytype == constant.quotation().addreduce.PAYTYPE_COM_INT || v.paytype == constant.quotation().addreduce.PAYTYPE_ARO_INT));
        }
    };

    var deletebtn = {
        name: "删除",
        clazz: "btn-danger",
        handle: function(v) {

            com.showConfirm("是否确认删除", function() {

                removeRow(v.arId);
            });
        },
        show: function(v) {

            return (v.status == constant.quotation().addreduce.STATUS_UNSUBMIT_INT || v.status == constant.quotation().addreduce.STATUS_SUBMIT_INT);
        }
    };

    if (addReduce.pageType == null) {

        var linebtns = [viewbtn, submitbtn, cancelbtn, allocationbtn, specialbtn, norefundbtn, affirmbtn, deletebtn, ];

        com.focusPage('#fl-statement').statement("报价", "增减单").show();
        com.focusPage('#decorationInfo').show();

        com.focusPage("#pagenation").hide();

        initDecorationInfo();

        searcher.init("", "condList", api.addReduce.queryAddReduceByOrderId, function(data) {

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
            dataset: constant.quotation().addreduce.type.keys
        }, {
            field: "atttype",
            name: "类型",
            prop: "atttype",
            clazz: "red",
            dataset: constant.quotation().addreduce.atttype.keys
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
            prop: function(v) {

                return v.manageDiscount == constant.quotation().addreduce.MANAGEDISCOUNT_DISCOUNT_INT ? utils.changeThrDecimal(utils.accMul(v.managePrice, utils.accDiv(v.discount, 10))) : v.managePrice;
            },
            clazz: "blue"
        }, {
            field: "taxPrice",
            name: "税金",
            prop: function(v) {

                return v.manageDiscount == constant.quotation().addreduce.MANAGEDISCOUNT_DISCOUNT_INT ? utils.changeThrDecimal(utils.accMul(v.taxPrice, utils.accDiv(v.discount, 10))) : v.taxPrice;
            },
            clazz: "blue"
        }, {
            field: "taxRate",
            name: "税金比例",
            prop: "taxRate",
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
            dataset: constant.quotation().addreduce.status.keys
        }, {
            field: "paytype",
            name: "付款类型",
            prop: "paytype",
            clazz: "red",
            dataset: constant.quotation().addreduce.paytype.keys
        }, {
            field: "isAffirm",
            name: "是否确认",
            prop: "isAffirm",
            clazz: "red",
            dataset: constant.quotation().addreduce.isAffirm.keys
        }, {
            field: "createTime",
            name: "创建时间",
            prop: "createTime",
            clazz: "green"
        }, {
            field: "confirmTime",
            name: "确认时间",
            prop: "confirmTime",
            clazz: "green",
            dataset: addReduce.confirmTime
        }, {
            field: "affirmTime",
            name: "确认时间",
            prop: "affirmTime",
            clazz: "green",
            dataset: addReduce.affirmTime
        }, {
            field: "sendTime",
            name: "推送时间",
            prop: "sendTime",
            clazz: "green",
            dataset: addReduce.sendTime
        }];

        searcher.line("content", lineprops, linebtns);
    }

    if (addReduce.pageType == "page") {

        com.focusPage("#addReducePageContent").removeClass("page-content");

        params.quotation.atttype = params['urlLoadParams'].atttype;

        addReduce.pageConfig = getConfig(params['urlLoadParams'].depage, 6);

        var linebtns = [];

        if (addReduce.pageConfig.pageBtn.contains("view"))
            linebtns.push(viewbtn);

        if (addReduce.pageConfig.pageBtn.contains("submit"))
            linebtns.push(submitbtn);

        if (addReduce.pageConfig.pageBtn.contains("cancel"))
            linebtns.push(cancelbtn);

        if (addReduce.pageConfig.pageBtn.contains("allocation"))
            linebtns.push(allocationbtn);

        if (addReduce.pageConfig.pageBtn.contains("special"))
            linebtns.push(specialbtn);

        if (addReduce.pageConfig.pageBtn.contains("norefund"))
            linebtns.push(norefundbtn);

        if (addReduce.pageConfig.pageBtn.contains("affirm"))
            linebtns.push(affirmbtn);

        if (addReduce.pageConfig.pageBtn.contains("delete"))
            linebtns.push(deletebtn);

        searcher.base("condList", "pagenation", "resultList", api.addReduce.pageAddReduce);
        searcher.condition(addReduce.pageConfig.condArr);
        searcher.history("addReducePostData");

        var lineprops = [];

        $.each(addReduce.pageConfig.propertyArr, function(pi, pv) {

            switch (pv) {
                case "decorationOrderId":
                    lineprops.push({
                        field: "decoration.orderId",
                        name: "装修单号",
                        prop: "decoration.orderId",
                        clazz: "blue",
                        click: function(btn, v) {

                            com.post(api.decoration.queryDecorationForCommonByOrderId, {
                                "decoration.orderId": v.decoration.orderId
                            }, function(res) {

                                var decoration = res.decoration;
                                var address = decoration.house.village.cityProper.city.name + ' ' + decoration.house.village.cityProper.name + ' ' + decoration.house.village.name + ' ' + decoration.house.houseNumber;
                                var typeness = constant.decoration().decoration.typeness.keys[decoration.typeness];

                                com.showTip(btn, "装修单号:" + decoration.orderId + "<br\>楼盘地址:" + address + "<br\>类型:" + typeness + "<br\>等级:" + decoration.grade, "bottom");
                            });
                        }
                    });
                    break;
                case "decorationHouseVillageName":
                    lineprops.push({
                        field: "name",
                        name: "楼盘",
                        prop: "decoration.house.village.name",
                        clazz: "grey"
                    });
                    break;
                case "decorationHouseHouseNumber":
                    lineprops.push({
                        field: "houseNumber",
                        name: "楼号",
                        prop: "decoration.house.houseNumber",
                        clazz: "grey"
                    });
                    break;
                case "decorationCustomerName":
                    lineprops.push({
                        field: "customerName",
                        name: "客户名",
                        prop: "decoration.customer.name",
                        clazz: "grey"
                    });
                    break;
                case "decorationDesignerCurrentName":
                    lineprops.push({
                        field: "currentName",
                        name: "设计师",
                        prop: "decoration.designer.currentName",
                        clazz: "grey"
                    });
                    break;
                case "decorationSalesmanCurrentName":
                    lineprops.push({
                        field: "currentName",
                        name: "业务员",
                        prop: "decoration.salesman.currentName",
                        clazz: "grey"
                    });
                    break;
                case "decorationHouseBuildArea":
                    lineprops.push({
                        field: "buildArea",
                        name: "面积",
                        prop: "decoration.house.buildArea",
                        clazz: "grey"
                    });
                    break;
                case "decorationStatus":
                    lineprops.push({
                        field: "decorationStatus",
                        name: "创建时间",
                        prop: "decoration.status",
                        clazz: "red",
                        dataset: constant.decoration().decoration.status.keys,
                    });
                    break;
                case "decorationCreateTime":
                    lineprops.push({
                        field: "createTime",
                        name: "创建时间",
                        prop: "decoration.createTime",
                        clazz: "green"
                    });
                    break;
                case "decorationHouseClass":
                    lineprops.push({
                        field: "houseClass",
                        name: "房屋类型",
                        prop: "decoration.houseClass",
                        clazz: "grey"
                    });
                    break;
                case "decorationSupervisorCurrentName":
                    lineprops.push({
                        field: "supervisorName",
                        name: "监理",
                        prop: "decoration.supervisor.currentName",
                        clazz: "grey"
                    });
                    break;
                case "decorationSupervisorPhone":
                    lineprops.push({
                        field: "supervisorPhone",
                        name: "监理电话",
                        prop: "decoration.supervisor.phone",
                        clazz: "grey"
                    });
                    break;
                case "decorationEscorterCurrentName":
                    lineprops.push({
                        field: "escorterName",
                        name: "跟单员",
                        prop: "decoration.escorter.currentName",
                        clazz: "grey"
                    });
                    break;
            }
        });

        lineprops.push({
            type: "newline"
        });

        $.each(addReduce.pageConfig.propertyArr, function(pi, pv) {

            switch (pv) {
                case "type":
                    lineprops.push({
                        field: "type",
                        name: "类别",
                        prop: "type",
                        clazz: "red",
                        dataset: constant.quotation().addreduce.type.keys
                    });
                    break;
                case "atttype":
                    lineprops.push({
                        field: "atttype",
                        name: "类型",
                        prop: "atttype",
                        clazz: "red",
                        dataset: constant.quotation().addreduce.atttype.keys
                    });
                    break;
                case "undisPrice":
                    lineprops.push({
                        field: "undisPrice",
                        name: "非打折总额",
                        prop: "undisPrice",
                        clazz: "blue"
                    });
                    break;
                case "disPrice":
                    lineprops.push({
                        field: "disPrice",
                        name: "打折总额",
                        prop: "disPrice",
                        clazz: "blue"
                    });
                    break;
                case "consPrice":
                    lineprops.push({
                        field: "consPrice",
                        name: "工程总额",
                        prop: "consPrice",
                        clazz: "blue"
                    });
                    break;
                case "managePrice":
                    lineprops.push({
                        field: "managePrice",
                        name: "管理费",
                        prop: function(v) {

                            return v.manageDiscount == constant.quotation().addreduce.MANAGEDISCOUNT_DISCOUNT_INT ? utils.changeThrDecimal(utils.accMul(v.managePrice, utils.accDiv(v.discount, 10))) : v.managePrice;
                        },
                        clazz: "blue"
                    });
                    break;
                case "taxPrice":
                    lineprops.push({
                        field: "taxPrice",
                        name: "税金",
                        prop: function(v) {

                            return v.manageDiscount == constant.quotation().addreduce.MANAGEDISCOUNT_DISCOUNT_INT ? utils.changeThrDecimal(utils.accMul(v.taxPrice, utils.accDiv(v.discount, 10))) : v.taxPrice;
                        },
                        clazz: "blue"
                    });
                    break;
                case "taxRate":
                    lineprops.push({
                        field: "taxRate",
                        name: "税金比例",
                        prop: "taxRate",
                        clazz: "blue"
                    });
                    break;
                case "total":
                    lineprops.push({
                        field: "total",
                        name: "总价",
                        prop: "total",
                        clazz: "blue"
                    });
                    break;
                case "status":
                    lineprops.push({
                        field: "status",
                        name: "状态",
                        prop: "status",
                        clazz: "red",
                        dataset: constant.quotation().addreduce.status.keys
                    });
                    break;
                case "paytype":
                    lineprops.push({
                        field: "paytype",
                        name: "付款类型",
                        prop: "paytype",
                        clazz: "red",
                        dataset: constant.quotation().addreduce.paytype.keys
                    });
                    break;
                case "isAffirm":
                    lineprops.push({
                        field: "isAffirm",
                        name: "是否确认",
                        prop: "isAffirm",
                        clazz: "red",
                        dataset: constant.quotation().addreduce.isAffirm.keys
                    });
                    break;
                case "manageDiscount":
                    lineprops.push({
                        field: "manageDiscount",
                        name: "管理费折扣",
                        prop: "manageDiscount",
                        clazz: "red",
                        dataset: constant.quotation().addreduce.manageDiscount.keys
                    });
                    break;
                case "createTime":
                    lineprops.push({
                        field: "createTime",
                        name: "创建时间",
                        prop: "createTime",
                        clazz: "green"
                    });
                    break;
                case "addReduceCreaterCurrentName":
                    lineprops.push({
                        field: "creater.currentName",
                        name: "创建人",
                        prop: "creater.currentName",
                        clazz: "grey"
                    });
                    break;
                case "confirmTime":
                    lineprops.push({
                        field: "confirmTime",
                        name: "确认时间",
                        prop: "confirmTime",
                        clazz: "green",
                        dataset: addReduce.confirmTime
                    });
                    break;
                case "affirmTime":
                    lineprops.push({
                        field: "affirmTime",
                        name: "确认时间",
                        prop: "affirmTime",
                        clazz: "green",
                        dataset: addReduce.affirmTime
                    });
                    break;
                case "sendTime":
                    lineprops.push({
                        field: "sendTime",
                        name: "推送时间",
                        prop: "sendTime",
                        clazz: "green",
                        dataset: addReduce.sendTime
                    });
                    break;
            }
        });

        searcher.line("decoration.orderId", lineprops, linebtns);
    }

    searcher.render();

    // 查看按钮方法
    function viewDetailAddReduce(v) {

        params.quotation.addReduce = v;

        com.switchPage(api.index.addReducePartIndex.url);
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

        var $inputs = searcher.checks();

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

        var $inputs = searcher.checks();
        var arid = $inputs.val();

        if (!$inputs.length)
            return false;

        var options = {
            "addReduce.orderId": addReduce.orderId
        };

        $.each($inputs, function(i, v) {

            options["addReduces[" + i + "].arId"] = parseInt($(v).val());

            var $v = $(v);

            if ($v.val()) {
                if ($inputs.val() != $v.val()) {
                    arid += "," + $v.val();
                }
            }
        });

        options["addReduce.content"] = arid;

        com.showConfirm("是否发送查看通知", function() {

            com.post(api.addReduce.sendAddReduce, options, function(res) {

                com.showAlert(com.info, "操作成功");
                searcher.doSearch();
            });
        });

    });

    // 批量提交按钮
    com.focusPage('#btnSubmit').click(function() {

        var $inputs = searcher.checks();

        var options = {
            "addReduce.orderId": params.quotation.orderId
        };

        if (!$inputs.length)
            return false;

        $.each($inputs, function(i, v) {

            options["addReduces[" + i + "].arId"] = parseInt($(v).val());
        });

        com.post(api.addReduce.submitAddReduce, options, function(res) {

            com.showAlert(com.info, "操作成功");
            searcher.doSearch();
        });
    });

    // 返回按钮
    com.focusPage('#btnBack').click(function() {

        com.switchPage(params.historyPage);
    });

    // 刷新按钮
    com.focusPage('#updated').click(function() {

        searcher.doSearch();
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
        options["addReduce.status"] = constant.quotation().addreduce.STATUS_UNSUBMIT_INT;
        options["addReduce.total"] = 0;
        options["addReduce.managePrice"] = 0;
        options["addReduce.taxPrice"] = 0;

        com.post(url, options, function(res) {

            com.showAlert(com.info, "操作成功");
            searcher.doSearch();

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
            searcher.doSearch();
        });
    }

    function confirm(arid) {

        var options = {
            "addReduce.arId": arid
        };

        com.post(api.addReduce.confirmAddReduce, options, function(res) {

            com.showAlert(com.info, "操作成功");
            searcher.doSearch();
        });
    }

    // 删除按钮方法
    function removeRow(arid) {

        com.post(api.addReduce.deleteAddReduce, {
            "addReduce.arId": arid
        }, function(res) {

            com.showAlert(com.info, "操作成功");
            searcher.doSearch();
        });
    }

    // 提交按钮方法
    function submit(v) {

        com.post(api.addReduce.submitAddReduce, {
            "addReduces[0].arId": v.arId,
            "addReduce.orderId": addReduce.pageType == null ? params.quotation.orderId : v.decoration.orderId
        }, function(res) {

            com.showAlert(com.info, "操作成功");
            searcher.doSearch();
        });
    }

    // 撤销按钮方法
    function cancel(v) {

        com.post(api.addReduce.cancelAddReduce, {
            "addReduce.dpId": v.dpId
        }, function(res) {

            com.showAlert(com.info, "操作成功");
            searcher.doSearch();
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
