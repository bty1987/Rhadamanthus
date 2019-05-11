$(function () {

    var order = {
        saveBtn: null,
        cancellBtn: null,
        modal: null,
        orderItems: {},
        type: {0: "半包", 1: "套餐", 2: "半价", 3: "满减", 4: "减上捡"},

        decorationOrderStatus: {},

        orderStatus: [],
        businessDepartments: [],
        postParam: {},

        editFlag: false,
        projectStatusArr: {
            0: '初始',
            1: '开工',
            2: '已完工'
        }
    };
    var decorationRegular = {
        validator: {
            decorationNumberAll: {
                type: "v_decorationNumberAll",
                regex: /^(\d{0,8}|\d{0,8}\.[0-9]{1,3})$|^-(\d{0,8}|\d{0,8}\.[0-9]{1,3})$/,
                errorMsg: "请输入正确的数字,可保留小数点后三位."
            }// 正数或负数 小数三位
        }
    };

    $.extend(com.validator, decorationRegular.validator);

    com.focusPage("#drawContractModal").on('show.bs.modal', function (e) {
        com.clearValidator();
    });

    order.cancelBtn = com.focusPage("#cancelBtn");
    order.decorationModal = com.focusPage("#decorationModal");
    order.agreementModal = com.focusPage("#agreementModal");
    order.drawLineModal = com.focusPage("#drawLineModal");
    order.refundContractModal = com.focusPage("#refundContractModal");
    order.customerInfoModal = com.focusPage("#customerInfoModal");
    order.drawContractModal = com.focusPage("#drawContractModal");
    order.prosignModal = com.focusPage("#prosignModal");
    order.contractBtn = com.focusPage("#contractBtn");

    var contract = {
        decorationOrderId: null
    };

    var decorationAdvance = {
        items: {}
    };

    decorationAdvance.items.customerName = com.focusPage('#customerName');
    decorationAdvance.items.phone = com.focusPage('#phone');
    //获得页面控制参数
    var pageConfig = drawNode.getConfig(params['urlLoadParams'].depage);

    //放线
    com.focusPage("#applayDrawLineBtn").on("click", function () {
        if (com.validate("drawLineModal")) {
            return;
        }
        bootbox.confirm("确认申请放线吗?", function (res) {
            if (res) {
                var options = {
                    "drawLine.content": com.focusPage("#applayDes").val(),
                    "drawLine.applayTime": com.focusPage("#applayTime").val() + " 00:00:00",
                    "drawLine.decoration.orderId": com.focusPage("#dischargeLineOrderId").val(),
                };

                com.post(api.decoration.applayDrawLine, options);
            }

            order.drawLineModal.modal("hide");
        });
    });

    com.focusPage('.date-picker').datepicker({
        format: 'yyyy-mm-dd',
        autoclose: true,
        todayBtn: true,
        todayHighlight: true
    }).next().on(ace.click_event, function () {
        $(this).prev().focus();
    });

    com.focusPage("#additionalInfoBtn").on('click', function (res) {

        com.post(api.decoration.queryDecorationContractByOrderId, {"decorationContract.orderId": contract.decorationOrderId}, function (res) {
            if (res.decorationContract == null || res.decorationContract.autoId == null) {
                com.focusPage("#workingDuration").val(0);
                com.focusPage("#startTime").val("");
                com.focusPage("#endTime").val("");
                com.focusPage("#additionalInfo").html("");
                com.focusPage("#additionalTermsModal").modal("show");
            } else {
                com.focusPage("#workingDuration").val(res.decorationContract.workingDuration);
                com.focusPage("#startTime").datepicker('update', res.decorationContract.startTime);
                com.focusPage("#endTime").datepicker('update', res.decorationContract.endTime);
                com.focusPage("#additionalInfo").html(res.decorationContract.additionalInfo);
                com.focusPage("#additionalTermsModal").modal("show");
            }
        });
    });

    com.focusPage("#saveAdditionalInfoBtn").on('click', function (res) {
        if (com.validate("additionalTermsModal")) {
            return;
        }

        bootbox.confirm("确认要保存合同信息吗?", function (result) {
            if (result) {
                var options = {
                    "decorationContract.orderId": contract.decorationOrderId,
                    "decorationContract.workingDuration": com.focusPage("#workingDuration").val(),
                    "decorationContract.additionalInfo": com.focusPage("#additionalInfo").html()
                };

                com.focusPage("#startTime").val() && (options["decorationContract.startTime"] = com.focusPage("#startTime").val() + " 00:00:00");
                com.focusPage("#endTime").val() && (options["decorationContract.endTime"] = com.focusPage("#endTime").val() + " 00:00:00");

                com.post(api.decoration.saveDecorationContract, options, function (res) {
                    if (res.errorCode == 0) {
                        com.showAlert(com.info, "保存成功");
                    }
                });

                com.focusPage("#additionalTermsModal").modal("hide");
            }
        });
    });

    com.focusPage("#refundContractBtn").on("click", function () {
        if (com.validate("refundContractModal")) {
            return;
        }
        var refundValue = com.focusPage("#refundValue").val();

        var options = {
            "decoration.orderId": params["decoration.orderId"],
            "refundValue": refundValue,
            "paymentValue": order.paymentValue,
        };

        if (refundValue > order.paymentValue) {
            bootbox.confirm("请注意:退款金额大于已付款金额!", function (result) {
                if (result) {
                    com.post(api.decoration.terminalDecoration, options, function (res) {
                        com.showAlert(com.info, "申请成功");
                        searcher.doSearch();
                        com.focusPage("#" + params["decoration.rowId"] + "_terminalBtn").css("display", "none");
                    });
                }
            });
        } else {
            com.post(api.decoration.terminalDecoration, options, function (res) {
                com.showAlert(com.info, "申请成功");
                searcher.doSearch();
                com.focusPage("#" + params["decoration.rowId"] + "_terminalBtn").css("display", "none");
            });
        }

        order.refundContractModal.modal("hide");
    });

    com.focusPage("#customerInfoBtn").on("click", function () {
        if (com.validate()) {
            return;
        }

        var cId = params["customer.customerId"];

        var options = {
            "customer.cid": cId,
            "customer.name": com.focusPage("#customerName").val(),
            "customer.phone": com.focusPage("#phone").val(),
            "decorationContract.orderId": params["decoration.orderId"],
        };

        com.post(api.data.checkCustomerForPhone, {
            "customerPhone.phone": com.focusPage("#phone").val(),
            "customerPhone.status": 0
        }, function (res) {

        }, function (res) {
            com.showAlert(com.error, "客户电话已经存在");
            return false;
        }, false);

        com.post(api.quotation.queryQuotationForDefaultByOrderId, {"quotation.orderId": params["decoration.orderId"]}, function (res) {
            if (utils.accSub(com.focusPage("#customerInfoDialog").attr("totalPrice"), res.quotation.totalPrice) > 100) {
                bootbox.confirm("合同金额与报价金额相差大于100，确认签单？", function (yes) {
                    if (yes) {
                        com.post(api.decoration.signDecorationContract, options, function (res) {
                            searcher.doSearch();
                        }, null, false);
                        order.customerInfoModal.modal("hide");
                    }
                });
            } else {
                com.post(api.decoration.signDecorationContract, options, function (res) {
                    searcher.doSearch();
                }, null, false);
                order.customerInfoModal.modal("hide");
            }
        }, function () {
            com.showAlert(com.error, "报价不存在");
            return;
        }, false);


    });

    initializeContent();

    com.focusPage('.date-picker').datepicker({
        format: 'yyyy-mm-dd',
        autoclose: true,
        todayBtn: true,
        todayHighlight: true
    }).next().on(ace.click_event, function () {
        com.focusPage(this).prev().focus();
    });

    com.post(api.data.queryConstructionNode, {}, function (res) {
        $.each(res.constructionNodes, function (i, v) {
            order.projectStatusArr[v.sort] = v.name;
        });
    }, null, false);

    com.post(api.ds.decoration, {}, function (res) {
        $.each(res.decorationOrderStatus, function (i, v) {
            order.decorationOrderStatus[v.key] = v.value;
        });
    }, null, false);

    /**
     * 回调函数比速提供 init(tableId, result.list)方法
     * tableId ,用来显示的div的id
     * result.list 列表的json数组
     * */
    var displayFunc = (function () {

        var renderList = function (tableId, listData) {
            var $tableWrap = com.focusPage('#' + tableId);
            var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');

            if (listData && listData.length) {
                $.each(listData, function (i, v) {
                    var $liLine = $('<li></li>').addClass('item-orange clearfix');
                    var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(v.orderId));
                    var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
                    var $divBtnBlock = $('<div></div>').addClass('clearfix col-sm-12');
                    var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

                    var btnView = $('<a></a>').addClass('btn btn-minier btn-yellow').html('查看');
                    var btnRevie = $('<a></a>').addClass('btn btn-minier btn-success').html('回访');
                    var btnLine = $('<a></a>').addClass('btn btn-minier btn-warning').html('放线');
                    var btnContract = $('<a></a>').addClass('btn btn-minier btn-inverse').html('合同');
                    var btnScal = $('<a></a>').addClass('btn btn-minier btn-danger').html('扣款');
                    var btnPrice = $('<a></a>').addClass('btn btn-minier btn-pink').html('报价');
                    var btnAddMinus = $('<a></a>').addClass('btn btn-minier btn-purple').html('增减项');
                    var btnExtension = $('<a></a>').addClass('btn btn-minier btn-yellow').html('扩展项');
                    var btnInfo = $('<a></a>').addClass('btn btn-minier btn-success').html('信息轴');
                    var btnCal = $('<a></a>').addClass('btn btn-minier btn-warning').html('决算');
                    var btnService = $('<a></a>').addClass('btn btn-minier btn-purple').html('服务');
                    var btnActivity = $('<a></a>').addClass('btn btn-minier btn-inverse').html('活动物品');
                    var btnDelete = $('<a></a>').addClass('btn btn-minier btn-danger').html('废单');
                    var btnSign = $('<a></a>').addClass('btn btn-minier btn-pink').html('签订合同');
                    var btnTerminal = $('<a></a>').addClass('btn btn-minier btn-purple').html('合同终止');
                    var btnResign = $('<a></a>').addClass('btn btn-minier btn-yellow').html('重签合同');
                    var btnProsign = $('<a></a>').addClass('btn btn-minier btn-blue').html('预签');
                    var btnBalance = $('<a></a>').addClass('btn btn-minier btn-warning').html('结算');

                    var propertyArr = [];

                    $.each(pageConfig.propertyArr, function (pi, pv) {
                        switch (pv) {
                            case "楼盘地址":
                                propertyArr.push(["楼盘地址:", (v.house.village.cityProper == null ? "" : v.house.village.cityProper.name) + " " + v.house.village.name + " " + (v.house.houseNumber == null ? "" : v.house.houseNumber), "grey"]);
                                break;
                            case "客户名":
                                propertyArr.push(["客户名:", v.customer.name, "grey"]);
                                break;
                            case "设计部":
                                propertyArr.push(["设计部:", v.designer.dept.name, "grey"]);
                                break;
                            case "设计师":
                                propertyArr.push(["设计师:", v.designer.currentName, "grey"]);
                                break;
                            case "业务部":
                                propertyArr.push(["业务部:", v.salesman.dept.name, "grey"]);
                                break;
                            case "业务员":
                                propertyArr.push(["业务员:", v.salesman.currentName, "grey"]);
                                break;
                            case "面积":
                                propertyArr.push(["面积:", v.house.buildArea, "blue"]);
                                break;
                            case "折扣":
                                propertyArr.push(["折扣:", com.checkNull(v.discount, 10), "blue"]);
                                break;
                            case "预签额":
                                propertyArr.push(["预签额:", v.precontractPrice, "blue"]);
                                break;
                            case "签单额":
                                propertyArr.push(["签单额:", v.orderTotalPrice, "blue"]);
                                break;
                            case "报价额":
                                propertyArr.push(["报价额:", v.quotationPrice, "blue"]);
                                break;
                            case "券优惠":
                                propertyArr.push(["券优惠:", v.couponCut, "blue"]);
                                break;
                            case "实收额":
                                propertyArr.push(["实收额:", v.factPrice, "blue"]);
                                break;
                            case "创建时间":
                                propertyArr.push(["创建时间:", v.createTime, "green"]);
                                break;
                            case "量房时间":
                                propertyArr.push(["量房时间:", v.measureTime, "green"]);
                                break;
                            case "定金时间":
                                propertyArr.push(["定金时间:", v.depositTime, "green"]);
                                break;
                            case "预签时间":
                                propertyArr.push(["预签时间:", v.precontractTime, "green"]);
                                break;
                            case "签单时间":
                                propertyArr.push(["签单时间:", v.contractTime, "green"]);
                                break;
                            case "类型":
                                propertyArr.push(["类型:", order.type[v.type], "red"]);
                                break;
                            case "状态":
                                propertyArr.push(["状态:", order.decorationOrderStatus[v.status], "red"]);
                                break;
                            case "工程状态":
                                propertyArr.push(["工程状态:", order.projectStatusArr[v.projectStatus], "red"]);
                                break;
                        }
                    });

                    $.each(propertyArr, function (index, value) {
                        var $liProperty = $('<li></li>');
                        $('<strong></strong>').html(value[0]).appendTo($liProperty);
                        $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                        $liProperty.appendTo($ulProperty);
                    });

                    btnView.click(function () {
                        viewdecorationDetail(v.orderId, v.type, v.version == null ? null : v.version.versionId, v.notSalesmanRate, order.decorationOrderStatus[v.status]);
                    });

                    btnPrice.click(function () {
                        viewDecorationQuotateIndex(v.orderId, v.type);
                    });

                    btnRevie.click(function () {
                        viewdecorationBackVisitIndex(v.orderId);
                    });

                    btnLine.click(function () {
                        modalDrawLineModal(v.orderId);
                    });

                    btnContract.click(function () {
                        modalAgreementModal(v.orderId);
                    });

                    btnAddMinus.click(function () {
                        viewdecorationInDecreaseIndex(v.orderId, v.type);
                    });

                    btnInfo.click(function () {
                        viewdecorationTimelineIndex(v.orderId);
                    });

                    btnScal.click(function () {
                        viewdecorationInAudit(v.orderId);
                    });

                    btnExtension.click(function () {
                        viewExtension(v.orderId);
                    });

                    btnCal.click(function () {
                        viewDecorationFinalSettlement(v.orderId, v.type, v.status);
                    });

                    btnService.click(function () {
                        viewDecorationService(v.orderId);
                    });

                    btnActivity.click(function () {
                        viewDecorationActivityItem(v.orderId);
                    });

                    btnDelete.click(function () {
                        obsoleteOrder(v.orderId);
                    });
                    //签订合同
                    btnSign.click(function () {
                        signOrder(v.orderId, v.customer.cid, v.orderTotalPrice, v.notSalesmanRate, v.couponCut, v.thingCut);

                    });

                    btnTerminal.click(function () {
                        terminalOrder(v.orderId);
                    });

                    btnResign.click(function () {
                        resignOrder(v.orderId);
                    });

                    //预签
                    btnProsign.click(function () {
                        prosignOrder(v.orderId, v.precontractPrice);
                    });

                    btnBalance.click(function () {
                        balanceOrder(v.orderId);

                    });
                    $.each(pageConfig.pageBtn, function (k, b) {
                        switch (b) {
                            case "view"://查看
                                $divBtnWrap.append(btnView);
                                break;
                            case "prosign"://预签
                                if ([0, 1, 2].indexOf(v.status) != -1) {
                                    $divBtnWrap.append(btnProsign);
                                }
                                break;
                            case "revie"://回访
                                $divBtnWrap.append(btnRevie);
                                break;
                            case "line"://放线
                                $divBtnWrap.append(btnLine);
                                break;
                            case "contract"://合同
                                if ([0, 1, 2, 3, 4, 8].indexOf(v.status) != -1) {
                                    $divBtnWrap.append(btnContract);
                                }
                                break;
                            case "scal"://扣款
                                $divBtnWrap.append(btnScal);
                                break;
                            case "price"://报价
                                if ([0, 1, 2, 4].indexOf(v.status) != -1) {
                                    $divBtnWrap.append(btnPrice);
                                }
                                break;
                            case "addminus"://增减项
                                if ([3, 8].indexOf(v.status) != -1) {
                                    $divBtnWrap.append(btnAddMinus);
                                }
                                break;
                            case "extension"://扩展项
                                if ([0, 1, 2, 3, 4, 8].indexOf(v.status) != -1) {
                                    $divBtnWrap.append(btnExtension);
                                }
                                break;
                            case "info"://信息周
                                $divBtnWrap.append(btnInfo);
                                break;
                            case "cal"://决算
                                if ([3, 7, 8].indexOf(v.status) != -1) {
                                    $divBtnWrap.append(btnCal);
                                }
                                break;
                            case "services"://服务
                                $divBtnWrap.append(btnService);
                                break;
                            case "activity"://活动物品
                                $divBtnWrap.append(btnActivity);
                                break;
                            case "delete"://废单
                                if (v.status != 3 && v.status != 5 && v.status != 6) {
                                    $divBtnWrap.append(btnDelete);
                                }
                                break;
                            case "sign"://签订合同
                                if ([1, 2, 4].indexOf(v.status) != -1) {
                                    $divBtnWrap.append(btnSign);
                                }
                                break;
                            case "terminal"://合同终止
                                if (v.status == 3) {
                                    $divBtnWrap.append(btnTerminal);
                                }
                                break;
                            case "resign"://重新签合同
                                if (v.status == 3) {
                                    $divBtnWrap.append(btnResign);
                                }
                                break;
                            case "balance"://重新签合同
                                    $divBtnWrap.append(btnBalance);
                                break;
                        }
                    });
                    $divBtnWrap.appendTo($h3);
                    $liLine.append($h3).append($ulProperty).append($divBtnBlock).appendTo($ul);
                });

                $ul.appendTo($tableWrap);
            }
        };
        //查看
        var viewdecorationDetail = function (decorationOrderId, type, versionId, notSalesmanRate, status) {
            params["decorationOrderId"] = decorationOrderId;
            params["orderType"] = type;
            params["versionId"] = versionId;
            params["notSalesmanRate"] = notSalesmanRate;
            params["orederStatus"] = status;
            params["viewNode"] = pageConfig.nodes;
            params.historyPage = api.index.decorationIndex.url;
            com.switchPage(api.index.decorationDetailIndex.url);
        };

        //报价
        var viewDecorationQuotateIndex = function (decorationOrderId, type) {
            params["decorationOrderId"] = decorationOrderId;
            params["orderType"] = type;
            params.historyPage = api.index.decorationIndex.url;
            com.switchPage(api.index.quotationIndex.url);
        };
        //回访
        var viewdecorationBackVisitIndex = function (decorationOrderId) {
            params["decorationOrderId"] = decorationOrderId;
            params.historyPage = api.index.decorationIndex.url;
            com.focusPage("#decorationPageContent").load(api.index.backVisitIndex.url);
        };
        //放线
        var modalDrawLineModal = function (decorationOrderId, company) {
            com.clearValidator();

            com.focusPage("#applayDes").val("");
            com.focusPage("#applayTime").val("");
            com.focusPage("#dischargeLineOrderId").val(decorationOrderId);
            order.drawLineModal.modal("show");
        };
        //合同
        var modalAgreementModal = function (decorationOrderId) {
            contract.decorationOrderId = decorationOrderId;

            com.post(api.decoration.queryDecorationContractByOrderId, {"decorationContract.orderId": contract.decorationOrderId}, function (res) {

                var decorationContract = res.decorationContract;

                if (res.decorationContract == null || res.decorationContract.autoId == null) {
                    com.focusPage("#printContractBtn").attr("disabled", true);
                } else {
                    com.focusPage("#printContractBtn").attr("disabled", false).off("click").on("click", function () {

                        params.orderId = contract.decorationOrderId;

                        com.popup("打印合同", '/views/contract/' + res.decorationContract.templateHtml, null, null, true);
                    });
                }

                order.agreementModal.modal("show");
            });
        };
        //增减项
        var viewdecorationInDecreaseIndex = function (decorationOrderId, type) {
            params.decorationOrderId = decorationOrderId;
            params.decorationType = type;
            params.historyPage = api.index.decorationIndex.url;
            com.switchPage(api.index.addReduceIndex.url);
        };
        //扣款
        var viewdecorationInAudit = function (orderId) {
            params['decorationOrderId'] = orderId;
            params['auditStatusType'] = 'select';
            params['historyPage'] = api.index.decorationIndex.url;
            com.switchPage(api.index.auditRecordIndex.url);
        };
        //时间轴
        var viewdecorationTimelineIndex = function (orderId) {
            params.decorationOrderId = orderId;
            params.historyPage = api.index.decorationIndex.url;
            com.switchPage(api.index.decorationTimelineIndex.url);
        };
        //扩展项
        var viewExtension = function (decorationOrderId) {
            params.decorationOrderId = decorationOrderId;
            params.historyPage = api.index.decorationIndex.url;
            com.switchPage(api.index.extensionIndex.url);
        };

        //决算
        function viewDecorationFinalSettlement(decorationOrderId, type, status) {
            params.decorationOrderId = decorationOrderId;
            params.type = type;
            params.status = status;
            params.historyPage = api.index.decorationIndex.url;
            com.switchPage(api.index.decorationFinalSettlementIndex.url);
        }

        //服务
        function viewDecorationService(decorationOrderId) {
            params.decorationOrderId = decorationOrderId;
            params.historyPage = api.index.decorationIndex.url;
            com.switchPage(api.index.decorationServiceIndex.url);
        }

        //活动物品
        function viewDecorationActivityItem(decorationOrderId) {
            params.decorationOrderId = decorationOrderId;
            com.switchPage(api.index.decorationActivityItemIndex.url);
        }

        //废单
        function obsoleteOrder(orderId) {
            params["decoration.orderId"] = orderId;

            bootbox.confirm("确认要废单吗?", function (result) {
                if (result) {
                    com.post(api.decoration.obsoleteDecoration, {"decoration.orderId": orderId}, function (res) {
                        com.showAlert(com.info, "操作成功");
                        searcher.doSearch();
                    });
                }
            });
        }

        //签订合同
        function signOrder(orderId, customerId, orderTotalPrice, notSalesmanRate, coupon, thing) {
            // params["decoration.orderId"] = orderId;
            // params["customer.customerId"] = customerId;
            // $("#customerInfoDialog").attr("totalPrice",orderTotalPrice);

            // com.cleanItems(decorationAdvance.items);
            //
            // order.customerInfoModal.modal("show");

            var cId = params["customer.customerId"];
            //通过订单编号获取默认报价信息
            com.post(api.quotation.queryQuotationForDefaultByOrderId, {"quotation.orderId": orderId}, function (res) {

                var netperfor = 0;
                var comperfor = 0;
                if (res.quotation.qid == null) {
                    com.showAlert(com.error, "报价不存在");
                    return;
                }
                order.drawContractModal.modal("show");

                var contract = utils.accAdd(utils.accAdd(utils.accMul(res.quotation.disPrice, 0.88), res.quotation.undisPrice), utils.accAdd(res.quotation.trafficPrice, res.quotation.managePrice));
                var notpoint = utils.accMul(utils.accAdd(utils.accAdd(res.quotation.disPrice, res.quotation.undisPrice), res.quotation.trafficPrice), notSalesmanRate);

                var Offer = utils.accAdd(coupon, thing);
                netperfor = utils.accSub(utils.accSub(orderTotalPrice, utils.accAdd(coupon, thing)), utils.accMul(utils.accAdd(res.quotation.undisPrice, utils.accAdd(res.quotation.trafficPrice, res.quotation.disPrice)), notSalesmanRate));
                comperfor = utils.changeTwoDecimal(utils.accDiv(utils.accAdd(utils.accSub(utils.accMul(utils.accSub(contract, notpoint), 0.38), Offer), utils.accSub(orderTotalPrice, contract)), 0.38));

                var options = {
                    "decorationContract.orderId": orderId
                };

                com.focusPage("#coupon").html("券优惠 : " + coupon);
                com.focusPage("#thing").html("物品优惠 : " + thing);
                com.focusPage("#netperfor").val(netperfor);//净业绩
                com.focusPage("#comperfor").val(comperfor);//复合业绩
                //com.focusPage("#netperfor").html("净业绩 : "+ netperfor);
                //com.focusPage("#comperfor").html("复合业绩 : "+ comperfor);

                com.focusPage("#contractBtn").unbind('click').on("click", function () {
                    if (com.validate()) {
                        return false;
                    }

                    netperfor = com.focusPage("#netperfor").val();//净业绩
                    comperfor = com.focusPage("#comperfor").val();//复合业绩

                    options["decorationContract.netperfor"] = netperfor;
                    options["decorationContract.comperfor"] = comperfor;

                    if (utils.accSub(orderTotalPrice, res.quotation.totalPrice) > 100) {
                        bootbox.confirm("合同金额与报价金额相差大于100，确认签单？", function (yes) {
                            if (yes) {
                                com.post(api.decoration.signDecorationContract, options, function (res) {
                                    order.drawContractModal.modal("hide");
                                    searcher.doSearch();
                                }, null, false);
                            }
                        });
                    } else {
                        bootbox.confirm("确认签单？", function (yes) {
                            if (yes) {
                                com.post(api.decoration.signDecorationContract, options, function (res) {
                                    order.drawContractModal.modal("hide");
                                    searcher.doSearch();
                                }, null, false);
                            }
                        });
                    }
                });

            }, function () {
                com.showAlert(com.error, "报价不存在");
                return;
            }, false);

        }

        //合同终止
        function terminalOrder(decorationOrderId, rowId) {

            params["decoration.orderId"] = decorationOrderId;
            params["decoration.rowId"] = rowId;

            com.post(api.payment.queryDecorationPaymentForContractByOrderId, {"decorationPayment.decoration.orderId": decorationOrderId}, function (res) {

                var refundValue = 0;
                var decorationPaymentInfo = "";
                var decorationPayments = res.decorationPayments;

                for (var i = 0; i < decorationPayments.length; i++) {

                    var decorationPayment = decorationPayments[i];
                    var paymentType = decorationPayment.paymentType;
                    var paymentStatus = decorationPayment.paymentStatus;
                    var referMoney = decorationPayment.referMoney;

                    if (paymentStatus == 1 || paymentStatus == 2) {
                        decorationPaymentInfo += paymentType + ":" + referMoney + "<br/>";
                        refundValue = utils.accAdd(refundValue, referMoney);
                    }
                }

                if (decorationPaymentInfo == "") {
                    decorationPaymentInfo == "无付款信息";
                }

                com.focusPage("#decorationPaymentInfo").html(decorationPaymentInfo);
                com.focusPage("#refundValue").val(refundValue);
                com.focusPage("#paymentValue").val(refundValue);
                order.paymentValue = refundValue;

                com.clearValidator();

                order.refundContractModal.modal("show");
            });
        }

        //重签合同
        function resignOrder(decorationOrderId, rowId) {
            params["decoration.orderId"] = decorationOrderId;
            params["decoration.rowId"] = rowId;

            bootbox.confirm("确认要重签合同吗?", function (result) {
                if (result) {
                    com.post(api.decoration.resignDecorationContract, {"decorationContract.orderId": decorationOrderId}, function (res) {
                        com.showAlert(com.info, "操作成功");
                        searcher.doSearch();
                    });
                }
            });
        }

        //预签
        function prosignOrder(orderId, precontractPrice) {
            com.focusPage("#prosignPrice").val(precontractPrice);
            order.prosignModal.modal("show");

            com.focusPage("#prosignBtn").unbind('click').on("click", function () {
                if (com.validate()) {
                    return false;
                }
                var prosignVal = com.focusPage("#prosignPrice").val();

                var options = {
                    "decoration.orderId": orderId,
                    "decoration.precontractPrice": prosignVal
                };

                com.post(api.decoration.presignDecorationContract, options, function () {
                    order.prosignModal.modal("hide");
                    com.showAlert(com.info, "操作成功");
                    searcher.doSearch();
                }, null, false);
            });
        }

        function balanceOrder(orderId) {
            com.post(api.decoration.queryDecorationBalance, {"decoration.orderId" : orderId}, function (data) {
                var balance = data.decorationBalance.balance;
                com.focusPage("#dalanceModal").modal("show");
                com.focusPage("#deocBalance").val(balance == null ? " " : balance);

                com.focusPage("#saveBtnBalance").on("click", function () {

                    if(com.validate())
                        return;

                    var options = {
                        "decorationBalance.decoration.orderId" : orderId,
                        "decorationBalance.balance" : com.focusPage("#balance").val()
                    };

                    com.post(api.decoration.makeDecorationBalance, options, function () {
                        com.showAlert(com.info, "编辑成功");
                    });
                    com.focusPage("#dalanceModal").modal("hide");
                })
                com.clearValidator();
            })
        }

        return {
            init: function (tableId, listData) {
                com.focusPage('#' + tableId).html(null);
                renderList(tableId, listData);
            }
        };
    })();
    //额外参数 控制装修-通用-设计/业务 状态 签约/决算
    var extraParam = {};
    var pageName = params['urlLoadParams'].depage;

    if (pageName == "streamlinedDesign" || pageName == "streamlinedBusiness") {
        extraParam["statusas[0]"] = 3;//签约
        extraParam["statusas[1]"] = 7;//决算
    }
    var searcher = new Searcher();

    searcher.init(pageConfig.condArr, "condList", pageConfig.apiPage, function (data) {
        displayFunc.init('resultList', data);
    }, "pagenation", pageConfig.postDataName, extraParam, false, null, function () {
        if (pageConfig.hasExport) {
            var $impa = $('<a></a>').addClass('btn btn-minier btn-success pull-left').attr('name', 'import').css("margin", "0px 3px");
            var $impi = $('<i></i>').addClass('icon-download-alt bigger-110').appendTo($impa);
            var $impspan = $('<span></span>').text('导出').appendTo($impa);

            return [$impa];
        }
    });

    com.focusPage('a[name="import"]', '#pagenation').click(function () {

        if (com.focusPage('span[name="totalRecords"]').text() == 0) {
            com.showAlert(com.warning, "请通过条件进行查询");
            return false;
        }

        if (com.focusPage('span[name="totalRecords"]').text() > 200) {
            com.showAlert(com.warning, "查询结果大于阀值 , 不能完成导出动作");
            return false;
        }

        com.post(pageConfig.apiPage, $.extend({}, params[pageConfig.postDataName], {"paging.noPage": 1}), function (res) {

            $.exceler({
                column: pageConfig.column,
                list: res.paging.data
            }, function (v) {
                v.status = order.decorationOrderStatus[v.status];
            });

        });
    });

    //-----------------------------------------------------合同-----------------------------------------
    function initializeContent() {
        com.focusPage('#additionalInfo').ace_wysiwyg({
            toolbar: ['font', null, 'fontSize', null, {name: 'bold', className: 'btn-info'}, {
                name: 'italic',
                className: 'btn-info'
            }, {name: 'strikethrough', className: 'btn-info'},
                {name: 'underline', className: 'btn-info'}, null, {
                    name: 'insertunorderedlist',
                    className: 'btn-success'
                }, {name: 'insertorderedlist', className: 'btn-success'},
                {name: 'outdent', className: 'btn-purple'}, {
                    name: 'indent',
                    className: 'btn-purple'
                }, null, {name: 'justifyleft', className: 'btn-primary'},
                {name: 'justifycenter', className: 'btn-primary'}, {
                    name: 'justifyright',
                    className: 'btn-primary'
                }, {name: 'justifyfull', className: 'btn-inverse'}, null,
                null, null, null, null, null, 'foreColor', null, {name: 'undo', className: 'btn-grey'},
                {name: 'redo', className: 'btn-grey'}],
            'wysiwyg': {fileUploadError: showErrorAlert}
        }).prev().addClass('wysiwyg-style2');

        if (typeof jQuery.ui !== 'undefined' && /applewebkit/.test(navigator.userAgent.toLowerCase())) {
            var lastResizableImg = null;

            function destroyResizable() {
                if (lastResizableImg == null) return;
                lastResizableImg.resizable("destroy");
                lastResizableImg.removeData('resizable');
                lastResizableImg = null;
            }

            var enableImageResize = function () {
                com.focusPage('.wysiwyg-editor').on('mousedown', function (e) {
                    var target = $(e.target);
                    if (e.target instanceof HTMLImageElement) {
                        if (!target.data('resizable')) {
                            target.resizable({
                                aspectRatio: e.target.width / e.target.height
                            });
                            target.data('resizable', true);

                            if (lastResizableImg != null) { // disable previous resizable image
                                lastResizableImg.resizable("destroy");
                                lastResizableImg.removeData('resizable');
                            }
                            lastResizableImg = target;
                        }
                    }
                }).on('click', function (e) {
                    if (lastResizableImg != null && !(e.target instanceof HTMLImageElement)) {
                        destroyResizable();
                    }
                }).on('keydown', function () {
                    destroyResizable();
                });
            };
            enableImageResize();
        }
    }

    function showErrorAlert(reason, detail) {
        var msg = '';
        if (reason === 'unsupported-file-type') {
            msg = "Unsupported format " + detail;
        }
        $('<div class="alert"> <button type="button" class="close" data-dismiss="alert">&times;</button><strong>File upload error</strong> ' + msg + ' </div>').prependTo(com.focusPage('#alerts'));
    }

});