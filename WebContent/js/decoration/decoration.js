$(function () {

    var order = {
        saveBtn : null,
        cancellBtn: null,
        saveBtnRepair: null,
        modal: null,
        orderItems: {},
        typeness: {},
        sourceStatus: {},
        decorationOrderStatus: {},
        repairStatus: {},

        orderStatus: [],
        businessDepartments: [],
        postParam: {},
        repairModal: null,

        editFlag: false,
        infoItems: {},
        repairStatusItem: com.focusPage("#repairStatusItem"),

        drawContractItems: {
        	coupon : com.focusPage("#coupon"),
        	thing : com.focusPage("#thing"),
        	netperfor : com.focusPage("#netperfor"),
        	comperfor : com.focusPage("#comperfor")
        },

        projectStatusArr: {},
        designStatusArr: {}

    };

    order.cancelBtn = com.focusPage("#cancelBtn");
    order.saveBtnRepair = com.focusPage("#saveBtnRepair");
    order.decorationModal = com.focusPage("#decorationModal");
    order.agreementModal = com.focusPage("#agreementModal");
    order.drawLineModal = com.focusPage("#drawLineModal");
    order.refundContractModal = com.focusPage("#refundContractModal");
    order.customerInfoModal = com.focusPage("#customerInfoModal");
    order.drawContractModal = com.focusPage("#drawContractModal");
    order.prosignModal = com.focusPage("#prosignModal");
    order.contractBtn = com.focusPage("#contractBtn");
    order.dalanceModal = com.focusPage("#dalanceModal");
    order.repairModal = com.focusPage("#repairModal");

    //签订合同
    order.drawContractModal.on('hide.bs.modal', function (e) {
        com.cleanItems(order.drawContractItems);
        com.closeTip();
    });

    //放线申请
    order.drawLineModal.on('hide.bs.modal', function (e) {
        com.cleanItems(order.infoItems);
        com.closeTip();
    });

    //合同终止
    order.refundContractModal.on('hide.bs.modal', function (e) {
        com.cleanItems(order.infoItems);
        com.closeTip();
    });

    //客户信息修改
    order.customerInfoModal.on('hide.bs.modal', function (e) {
        com.cleanItems(decorationAdvance.items);
        com.closeTip();
    });

    //预签
    order.prosignModal.on('hide.bs.modal', function (e) {
        com.cleanItems(order.infoItems);
        com.closeTip();
    });

    //结算
    order.dalanceModal.on('hide.bs.modal', function (e) {
    	com.cleanItems(order.infoItems);
    	com.closeTip();
    });

    order.infoItems.timeLimit = com.focusPage("#timeLimit");
    order.infoItems.ishovel = com.focusPage("#ishovel");
    order.infoItems.iskey  = com.focusPage("#iskey");
    order.infoItems.isCeremony  = com.focusPage("#isCeremony");
    order.infoItems.finishTime  = com.focusPage("#finishTime");
    order.infoItems.keyTime  = com.focusPage("#keyTime");
    order.infoItems.designTime  = com.focusPage("#designTime");
    order.infoItems.drawlineTime  = com.focusPage("#drawlineTime");
    order.infoItems.comment = com.focusPage("#comment");
    order.infoItems.applayDes = com.focusPage("#applayDes");
    order.infoItems.applayTime = com.focusPage("#applayTime");
    order.infoItems.backup = com.focusPage("#backup");
    order.infoItems.prosignPrice = com.focusPage("#prosignPrice");
    order.infoItems.balance = com.focusPage("#balance");
    order.infoItems.deocBalance = com.focusPage("#deocBalance");

    com.datetime(order.infoItems.finishTime);
    com.datetime(order.infoItems.keyTime);
    com.datetime(order.infoItems.designTime);
    com.datetime(order.infoItems.drawlineTime);

    com.datetime(com.focusPage("#startTime"));
    com.datetime(com.focusPage("#endTime"));
    com.datetime(com.focusPage("#applayTime"));

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
        com.showConfirm("确认申请放线吗?", function () {
            var options = {
                "drawLine.content": order.infoItems.applayDes.val(),
                "drawLine.applayTime": order.infoItems.applayTime.val() + " 00:00:00",
                "drawLine.decoration.orderId": com.focusPage("#dischargeLineOrderId").val(),
            };

            com.post(api.construction.applayDrawLine, options);

            order.drawLineModal.modal("hide");
        });
    });

//    com.focusPage("#additionalInfoBtn").on('click', function (res) {
//
//        com.post(api.decoration.queryDecorationContractByOrderId, {"decorationContract.orderId": contract.decorationOrderId}, function (res) {
//            if (res.decorationContract == null || res.decorationContract.autoId == null) {
//                com.focusPage("#workingDuration").val(0);
//                com.focusPage("#startTime").val("");
//                com.focusPage("#endTime").val("");
//                com.focusPage("#additionalInfo").html("");
//                com.focusPage("#additionalTermsModal").modal("show");
//            } else {
//                com.focusPage("#workingDuration").val(res.decorationContract.workingDuration);
//                com.focusPage("#startTime").val( res.decorationContract.startTime);
//                com.focusPage("#endTime").val(res.decorationContract.endTime);
//                com.focusPage("#additionalInfo").html(res.decorationContract.additionalInfo);
//                com.focusPage("#additionalTermsModal").modal("show");
//            }
//        });
//    });

//     com.focusPage("#saveAdditionalInfoBtn").on('click', function (res) {
//         if (com.validate("additionalTermsModal")) {
//             return;
//         }
//    
//         com.showConfirm("确认要保存合同信息吗?", function () {
//             var options = {
//                 "decorationContract.orderId": contract.decorationOrderId,
//                 "decorationContract.workingDuration": com.focusPage("#workingDuration").val(),
//                 "decorationContract.additionalInfo": com.focusPage("#additionalInfo").val()
//             };
//    
//             com.focusPage("#startTime").val() && (options["decorationContract.startTime"] = com.focusPage("#startTime").val() + " 00:00:00");
//             com.focusPage("#endTime").val() && (options["decorationContract.endTime"] = com.focusPage("#endTime").val() + " 00:00:00");
//    
//             com.post(api.decoration.saveDecorationContract, options, function (res) {
//                 com.showAlert(com.info, "保存成功");
//             });
//    
//             com.focusPage("#additionalTermsModal").modal("hide");
//         });
//     });

    com.focusPage("#refundContractBtn").on("click", function () {
        if (com.validate("refundContractModal")) {
            return;
        }
        var backup = order.infoItems.backup.val();

        var options = {
            "decoration.orderId": params["decoration.orderId"],
            "backup": backup
        };

        if (backup > order.paymentValue) {
            com.showAlert(com.error, "违约金金额大于已付款金额,操作失败");
            return;
        }

        com.post(api.decoration.terminalDecoration, options, function (res) {
            com.showAlert(com.info, "申请成功");
            searcher.doSearch();
            com.focusPage("#" + params["decoration.rowId"] + "_terminalBtn").css("display", "none");
        });

        order.refundContractModal.modal("hide");
    });

    com.focusPage("#customerInfoBtn").on("click", function () {
        
        if (com.validate("customerInfoModal")) {
            return false;
        }

        var cid = params["customer.customerId"];

        var options = {
            "customer.cid": cid,
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
                com.showConfirm("合同金额与报价金额相差大于100，确认签单?", function () {
                    com.post(api.decoration.signDecorationContract, options, function (res) {
                        com.showAlert(com.info, "操作成功");
                        searcher.doSearch();
                    }, null, false);
                    order.customerInfoModal.modal("hide");
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

    com.focusPage("#updateProject").on("click", function () {

        var options = {
            "constructionInfo.orderId" : contract.decorationOrderId,
            "constructionInfo.timeLimit" : order.infoItems.timeLimit.val(),
            "constructionInfo.ishovel": order.infoItems.ishovel.val(),
            "constructionInfo.iskey": order.infoItems.iskey.val(),
            "constructionInfo.isCeremony": order.infoItems.isCeremony.val(),
            "constructionInfo.finishTime": order.infoItems.finishTime.val() + " 00:00:00",
            "constructionInfo.keyTime": order.infoItems.keyTime.val() + " 00:00:00",
            "constructionInfo.designTime": order.infoItems.designTime.val() + " 00:00:00",
            "constructionInfo.drawlineTime": order.infoItems.drawlineTime.val() + " 00:00:00",
            "constructionInfo.comment": order.infoItems.comment.val(),
            "constructionInfo.isConfirmPricture": 1
        };

        com.post(api.construction.updateConstructionInfoByOrderId,options,function (res) {
            com.showAlert(com.info,"操作成功");
        });
    });

    com.post(api.ds.construction, {}, function (res) {
        order.infoItems.ishovel.bindData(res.isHovel, "key", "value", false);
        order.infoItems.iskey.bindData(res.isKey, "key", "value", false);
        order.infoItems.isCeremony.bindData(res.isCeremony, "key", "value", false);

        $.each(res.constructionSchedule, function (i, v) {
            order.projectStatusArr[v.key] = v.value;
        });
    });

    com.post(api.ds.decoration, {}, function (res) {
        order.repairStatusItem.bindData(res.repairStatus, "key", "value");
        $.each(res.decorationOrderStatus, function (i, v) {
            order.decorationOrderStatus[v.key] = v.value;
        });
        $.each(res.typeness, function (i, v) {
            order.typeness[v.key] = v.value;
        });
        $.each(res.sourceStatus, function (i, v) {
            order.sourceStatus[v.key] = v.value;
        });
        $.each(res.designStatus, function (i, v) {
            order.designStatusArr[v.key] = v.value;
        });
        $.each(res.repairStatus, function (i, v) {
            order.repairStatus[v.key] = v.value;
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
                    var btnSelect = $('<a></a>').addClass('btn btn-minier btn-blue').html('选材');
                    var btnAddMinus = $('<a></a>').addClass('btn btn-minier btn-purple').html('增减项');
                    var btnExtension = $('<a></a>').addClass('btn btn-minier btn-yellow').html('扩展项');
                    var btnInfo = $('<a></a>').addClass('btn btn-minier btn-success').html('信息轴');
                    var btnCal = $('<a></a>').addClass('btn btn-minier btn-warning').html('决算');
                    var btnService = $('<a></a>').addClass('btn btn-minier btn-purple').html('服务');
                    var btnDctivity = $('<a></a>').addClass('btn btn-minier btn-inverse').html('装修活动');
                    var btnSctivity = $('<a></a>').addClass('btn btn-minier btn-warning').html('销售活动');
                    var btnDelete = $('<a></a>').addClass('btn btn-minier btn-danger').html('废单');
                    var btnSign = $('<a></a>').addClass('btn btn-minier btn-pink').html('签订合同');
                    var btnTerminal = $('<a></a>').addClass('btn btn-minier btn-purple').html('合同终止');
                    var btnResign = $('<a></a>').addClass('btn btn-minier btn-yellow').html('重签合同');
                    var btnProsign = $('<a></a>').addClass('btn btn-minier btn-blue').html('预签');
                    var btnBalance = $('<a></a>').addClass('btn btn-minier btn-warning').html('结算');
                    var btnRepair = $('<a></a>').addClass('btn btn-minier btn-inverse').html('保修');

                    var propertyArr = [];
                    $.each(pageConfig.propertyArr, function (pi, pv) {
                        switch (pv) {
                            case "address":
                                propertyArr.push(["楼盘地址:",(v.house.village.cityProper.city.name == null ? " " : v.house.village.cityProper.city.name) + " " + (v.house.village.cityProper == null ? " " : v.house.village.cityProper.name) + " " + v.house.village.name + " " + (v.house.houseNumber == null ? " " : v.house.houseNumber), "grey"]);
                                break;
                            case "villageName":
                                propertyArr.push(["楼盘:", (v.house.village.cityProper.city.name == null ? " " : v.house.village.cityProper.city.name) + " " + (v.house.village.cityProper == null ? " " : v.house.village.cityProper.name) + " " + v.house.village.name, "grey"]);
                                break;
                            case "houseNumber":
                                if([2, 3, 4, 6, 7].contains(v.status)){
                                    propertyArr.push(["楼号:", (v.house.houseNumber == null ? " " : v.house.houseNumber), "grey"]);
                                }
                                break;
                            case "customerName":
                                propertyArr.push(["客户名:", v.customer.name, "grey"]);
                                break;
                            case "designDepartment":
                                propertyArr.push(["设计部:", v.designer.dept.name, "grey"]);
                                break;
                            case "designerName":
                                propertyArr.push(["设计师:", v.designer.currentName, "grey"]);
                                break;
                            case "salesmanDepartment":
                                propertyArr.push(["业务部:", v.salesman.dept.name, "grey"]);
                                break;
                            case "salesmanName":
                                propertyArr.push(["业务员:", v.salesman.currentName, "grey"]);
                                break;
                            case "houseArea":
                                propertyArr.push(["面积:", v.house.buildArea, "blue"]);
                                break;
                            case "discount":
                                propertyArr.push(["折扣:", com.checkNull(v.discount, 10), "blue"]);
                                break;
                            case "precontractPrice":
                                propertyArr.push(["预签额:", v.precontractPrice, "blue"]);
                                break;
                            case "orderTotalPrice":
                                propertyArr.push(["签单额:", v.orderTotalPrice, "blue"]);
                                break;
                            case "quotationPrice":
                                propertyArr.push(["报价额:", v.quotationPrice, "blue"]);
                                break;
                            case "couponCut":
                                propertyArr.push(["券优惠:", v.couponCut, "blue"]);
                                break;
                            case "factPrice":
                                propertyArr.push(["实收额:", v.factPrice, "blue"]);
                                break;
                            case "createTime":
                                propertyArr.push(["创建时间:", v.createTime, "green"]);
                                break;
                            case "measureTime":
                                propertyArr.push(["量房时间:", v.measureTime, "green"]);
                                break;
                            case "depositTime":
                                propertyArr.push(["定金时间:", v.depositTime, "green"]);
                                break;
                            case "precontractTime":
                                propertyArr.push(["预签时间:", v.precontractTime, "green"]);
                                break;
                            case "contractTime":
                                propertyArr.push(["签单时间:", v.contractTime, "green"]);
                                break;
                            case "sdesignTime":
                                propertyArr.push(["确认合同方案时间:", v.sdesignTime, "green"]);
                                propertyArr.push(["确认放线方案时间:", v.edesignTime, "green"]);
                                break;
                            case "decorationType":
                                propertyArr.push(["类型:", order.typeness[v.typeness], "red"]);
                                break;
                            case "decorationStatus":
                                propertyArr.push(["状态:", order.decorationOrderStatus[v.status], "red"]);
                                break;
                            case "sourceStatus":
                                propertyArr.push(["确认状态:",  order.sourceStatus[v.sourceStatus], "red"]);
                                break;
                            case "projectStatus":
                                propertyArr.push(["工程状态:", order.projectStatusArr[v.projectStatus], "red"]);
                                break;
                            case "repairStatus":
                                propertyArr.push(["保修状态:", order.repairStatus[v.repairStatus], "red"]);
                                break;
                            case "designStatus":
                                propertyArr.push(["设计状态:", order.designStatusArr[v.designStatus], "red"]);
                                break;
                            case "saleScale":
                                if (v.saleScale != 1918) {
                                    propertyArr.push(["销售比例:", v.saleScale, "blue"]);
                                }
                                break;
                            case "payScale":
                                propertyArr.push(["付款比例:", v.paySacle, "blue"]);
                                break;
                            case "accountTime":
                                propertyArr.push(["决算时间:", v.accountTime, "blue"]);
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
                        viewDecorationDetail(v.orderId, v.type, v.typeness,v.version == null ? null : v.version.versionId, v.notSalesmanRate, v.status);
                    });

                    btnPrice.click(function () {
                        viewDecorationQuotateIndex(v.orderId, v.type, v.typeness);
                    });

                    btnSelect.click(function () {
                        viewSelection(v.orderId);
                    });

                    btnRevie.click(function () {
                        viewDecorationBackVisitIndex(v.orderId);
                    });

                    btnLine.click(function () {
                        modalDrawLineModal(v);
                    });

                    btnContract.click(function () {
                        modalAgreementModal(v.orderId, v.customer.cid, v);
                    });

                    btnAddMinus.click(function () {
                        viewDecorationInDecreaseIndex(v.orderId, v.type, v.typeness);
                    });

                    btnInfo.click(function () {
                        viewDecorationTimelineIndex(v.orderId);
                    });

                    btnScal.click(function () {
                        viewDecorationInAudit(v.orderId);
                    });

                    btnExtension.click(function () {
                        viewExtension(v.orderId);
                    });

                    btnCal.click(function () {
                        viewDecorationFinalSettlement(v.orderId, v.typeness, v.status);
                    });

                    btnService.click(function () {
                        viewDecorationService(v.orderId);
                    });

                    btnDctivity.click(function () {
                        viewDecorationActivity(v.orderId);
                    });
                    
                    btnSctivity.click(function () {
                        viewSalesActivity(v.orderId);
                    });

                    btnDelete.click(function () {
                        obsoleteOrder(v.orderId);
                    });
                    //签订合同
                    btnSign.click(function () {
                        signOrder(v.orderId, v.customer.cid, v.orderTotalPrice, v.notSalesmanRate, v.couponCut, v.thingCut);

                    });

                    btnTerminal.click(function () {
                        terminalOrder(v.orderId, v.status, v.precontractPrice);
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
                    btnRepair.click(function () {
                        repairOrder(v.orderId);

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
                            case "selection":// 选材
                                if ([3, 8].indexOf(v.status) != -1) {
                                    $divBtnWrap.append(btnSelect);
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
                                $divBtnWrap.append(btnDctivity);
                                break;
                            case "sctivity"://活动物品
                                $divBtnWrap.append(btnSctivity);
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
                                if ([2, 3].indexOf(v.status) != -1) {
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
                            case "repair"://保修
                                    $divBtnWrap.append(btnRepair);
                        }
                    });
                    $divBtnWrap.appendTo($h3);
                    $liLine.append($h3).append($ulProperty).append($divBtnBlock).appendTo($ul);
                });

                $ul.appendTo($tableWrap);
            }
        };
        //查看
        var viewDecorationDetail = function (decorationOrderId, type, typeness, versionId, notSalesmanRate, status) {
            params["decorationOrderId"] = decorationOrderId;
            params["orderType"] = type;
            params["orderTypeness"] = typeness;
            params["versionId"] = versionId;
            params["notSalesmanRate"] = notSalesmanRate;
            params["orderStatus"] = status;
            params["viewNode"] = Object.values(pageConfig.nodes);
            
            params.historyPage = api.index.decorationIndex.url;
            com.switchPage(api.index.decorationDetailIndex.url);
            //com.popup4page("#layerPopUp", api.index.decorationDetailIndex.url, "装修单详情: " + decorationOrderId);
        };

        //报价
        var viewDecorationQuotateIndex = function (decorationOrderId, type, typeness) {
            params["decorationOrderId"] = decorationOrderId;
            params["orderType"] = type;
            params["orderTypeness"] = typeness;
            params.historyPage = api.index.decorationIndex.url;
            com.switchPage(api.index.quotationIndex.url);
        };

        var viewSelection = function(decorationOrderId){
            params["editFlg"] = false;
            params["decorationOrderId"] = decorationOrderId;
            params.historyPage = api.index.decorationIndex.url;
            com.switchPage(api.index.selectionIndex.url);
        }

        //回访
        var viewDecorationBackVisitIndex = function (decorationOrderId) {
            
            params["decorationOrderId"] = decorationOrderId;
            
            params.historyPage = api.index.decorationIndex.url;
            com.switchPage(api.index.backVisitIndex.url);
            //com.popup4page("#layerPopUp", api.index.backVisitIndex.url, "装修单回访: " + decorationOrderId);
        };
        //放线
        var modalDrawLineModal = function (v) {
            contract.decorationOrderId = v.orderId;

            com.focusPage("#customerCurrentName").html(v.customer.name == null ? "暂无" : v.customer.name);
            com.focusPage("#identity").html(v.customer.identity == null ? "暂无" : v.customer.identity);

            com.post(api.construction.queryConstructionInfoByOrderId, {"constructionInfo.orderId": v.orderId}, function (result) {
                var datas = result.constructionInfo;

                order.infoItems.timeLimit.val(datas.timeLimit);
                order.infoItems.ishovel.val(datas.ishovel);
                order.infoItems.iskey.val(datas.iskey);
                order.infoItems.isCeremony.val(datas.isCeremony);
                order.infoItems.finishTime.val(datas.finishTime ? datas.finishTime.substr(0,10) : "");
                order.infoItems.keyTime.val(datas.keyTime ? datas.keyTime.substr(0,10) : "");
                order.infoItems.designTime.val(datas.designTime ? datas.designTime.substr(0,10) : "");
                order.infoItems.drawlineTime.val(datas.drawlineTime ? datas.drawlineTime.substr(0,10) : "");
                order.infoItems.comment.val(datas.comment);
            });

            com.cleanItems(order.infoItems);

            com.focusPage("#dischargeLineOrderId").val(v.orderId);

            order.drawLineModal.modal("show");
        };

        //合同
       var modalAgreementModal = function (decorationOrderId, cid , data) {
           
           params.decorationOrderId = decorationOrderId;
           params.cid = cid;
           
           params.historyPage = api.index.decorationIndex.url;
           com.switchPage(api.index.decorationContractIndex.url);
           //com.popup4page("#layerPopUp", api.index.decorationContractIndex.url, "装修单合同: " + decorationOrderId);
       };
        //增减项
        var viewDecorationInDecreaseIndex = function (decorationOrderId, type, typeness) {
            params.decorationOrderId = decorationOrderId;
            params.decorationType = type;
            params.decorationTypeness = typeness;
            params.historyPage = api.index.decorationIndex.url;
            com.switchPage(api.index.addReduceIndex.url);
        };
        //扣款
        var viewDecorationInAudit = function (orderId) {
            
            params.decorationOrderId = orderId;
            params.auditStatusType = 'select';
            
            params['historyPage'] = api.index.decorationIndex.url;
            com.switchPage(api.index.auditRecordIndex.url);
            //com.popup4page("#layerPopUp", api.index.auditRecordIndex.url, "装修单扣款: " + decorationOrderId);
        };
        //时间轴
        var viewDecorationTimelineIndex = function (decorationOrderId) {
            
            params.decorationOrderId = decorationOrderId;
            
            params.historyPage = api.index.decorationIndex.url;
            com.switchPage(api.index.decorationTimelineIndex.url);
            //com.popup4page("#layerPopUp", api.index.decorationTimelineIndex.url, "装修单进程: " + decorationOrderId);
        };
        //扩展项
        var viewExtension = function (decorationOrderId) {
            params.decorationOrderId = decorationOrderId;
            params.historyPage = api.index.decorationIndex.url;
            com.switchPage(api.index.extensionIndex.url);
        };

        //决算
        function viewDecorationFinalSettlement(decorationOrderId, typeness, status) {
            
            params.decorationOrderId = decorationOrderId;
            params.typeness = typeness;
            params.status = status;
            params["viewNode"] = Object.values(pageConfig.nodes);
            
            params.historyPage = api.index.decorationIndex.url;
            com.switchPage(api.index.decorationFinalSettlementIndex.url);
            //com.popup4page("#layerPopUp", api.index.decorationFinalSettlementIndex.url, "装修单决算: " + decorationOrderId);
        }

        //服务
        function viewDecorationService(decorationOrderId) {
            
            params.decorationOrderId = decorationOrderId;
            
            params.historyPage = api.index.decorationIndex.url;
            com.switchPage(api.index.decorationServiceIndex.url);
            //com.popup4page("#layerPopUp", api.index.decorationServiceIndex.url, "装修单服务: " + decorationOrderId);
        }

        //活动物品
        function viewDecorationActivity(decorationOrderId) {
            
            params.decorationOrderId = decorationOrderId;
            
//            com.switchPage(api.index.decorationActivityItemIndex.url);
            com.popup4page("#layerPopUp", api.index.decorationActivityItemIndex.url, "装修活动");
        }
        
        function viewSalesActivity(decorationOrderId){
            params["type"] = "advance";
            params["orderId"] = decorationOrderId;
            com.popup4page("#layerPopUp", "views/sales/sales4activity.html", "销售活动");
        }
        
        //废单
        function obsoleteOrder(orderId) {
            params["decoration.orderId"] = orderId;

            com.showConfirm("确认要废单吗?", function () {
                com.post(api.decoration.obsoleteDecoration, {"decoration.orderId": orderId}, function (res) {
                    com.showAlert(com.info, "操作成功");
                    searcher.doSearch();
                });
            });
        }

        //签订合同
        function signOrder(orderId, customerId, orderTotalPrice, notSalesmanRate, coupon, thing) {

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

                order.drawContractItems.coupon.html("券优惠 : " + coupon);
                order.drawContractItems.thing.html("物品优惠 : " + thing);
            	order.drawContractItems.netperfor.val(netperfor);//净业绩
            	order.drawContractItems.comperfor.val(comperfor);//复合业绩

                com.focusPage("#contractBtn").unbind('click').on("click", function () {
                    if (com.validate("drawContractModal")) {
                        return false;
                    }

                    if (utils.accSub(orderTotalPrice, res.quotation.totalPrice) > 100) {
                        com.showConfirm("合同金额与报价金额相差大于100，确认签单?", function () {
                            com.post(api.decoration.signDecorationContract, options, function (res) {
                                com.showAlert(com.info, "确认成功");
                                order.drawContractModal.modal("hide");
                                searcher.doSearch();
                            }, null, false);
                        });
                    } else {
                        com.showConfirm("确认签单?", function () {
                            com.post(api.decoration.signDecorationContract, options, function (res) {
                                com.showAlert(com.info, "确认成功");
                                order.drawContractModal.modal("hide");
                                searcher.doSearch();
                            }, null, false);
                        });
                    }
                });

            }, function () {
                com.showAlert(com.error, "报价不存在");
                return;
            }, false);
        }

        //合同终止
        function terminalOrder(decorationOrderId, status, precontractPrice, rowId) {

            params["decoration.orderId"] = decorationOrderId;
            params["decoration.rowId"] = rowId;

            com.post(api.payment.queryDecorationPaymentForContractByOrderId, {"decorationPayment.decoration.orderId": decorationOrderId}, function (res) {

                var backup = 0;
                var decorationPaymentInfo = "";
                var decorationPayments = res.decorationPayments;

                for (var i = 0; i < decorationPayments.length; i++) {

                    var decorationPayment = decorationPayments[i];
                    var paymentType = decorationPayment.paymentType;
                    var paymentStatus = decorationPayment.paymentStatus;
                    var referMoney = decorationPayment.referMoney;

                    if (paymentStatus == 1 || paymentStatus == 2) {
                        decorationPaymentInfo += paymentType + ":" + referMoney + "<br/>";
                        backup = utils.accAdd(backup, referMoney);
                    }
                }

                if (decorationPaymentInfo == "") {
                    decorationPaymentInfo = "无付款信息";
                }

                com.focusPage("#decorationStatus").html(order.decorationOrderStatus[status]);
                com.focusPage("#precontractPrice").val(precontractPrice);
                com.focusPage("#decorationPaymentInfo").html(decorationPaymentInfo);
                com.focusPage("#backup").val(0);
                order.paymentValue = status == 2 ? precontractPrice : backup;

                order.refundContractModal.modal("show");
            });
        }

        //重签合同
        function resignOrder(decorationOrderId, rowId) {
            params["decoration.orderId"] = decorationOrderId;
            params["decoration.rowId"] = rowId;

            com.showConfirm("确认要重签合同吗?", function () {
                com.post(api.decoration.resignDecorationContract, {"decorationContract.orderId": decorationOrderId}, function (res) {
                    com.showAlert(com.info, "操作成功");
                    searcher.doSearch();
                });
            });
        }

        //预签
        function prosignOrder(orderId, precontractPrice) {
        	order.infoItems.prosignPrice.val(precontractPrice);
            order.prosignModal.modal("show");

            com.focusPage("#prosignBtn").unbind('click').on("click", function () {
                if (com.validate("prosignModal")) {
                    return false;
                }
                var prosignVal = order.infoItems.prosignPrice.val();

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
                order.dalanceModal.modal("show");
                order.infoItems.deocBalance.val(balance == null ? " " : balance);

                com.focusPage("#saveBtnBalance").on("click", function () {

                    if(com.validate("dalanceModal"))
                        return;

                    var options = {
                        "decorationBalance.decoration.orderId" : orderId,
                        "decorationBalance.balance" : order.infoItems.balance.val()
                    };

                    com.post(api.decoration.makeDecorationBalance, options, function () {
                        com.showAlert(com.info, "编辑成功");
                    });
                    order.dalanceModal.modal("hide");
                });
            });
        }
        function repairOrder(orderId) {

            order.repairModal.modal("show");
            com.focusPage("#saveBtnRepair").unbind('click').on("click", function () {
                if (com.validate('repairModal')) {
                    return false;
                };

                var options = {
                    "decoration.orderId": orderId,
                    "decoration.repairStatus": order.repairStatusItem.val(),
                };

                com.post(api.decoration.changeDecorationForRepairStatus, options, function (res) {
                    com.showAlert(com.info, "操作成功");
                    searcher.doSearch();
                });
                order.repairModal.modal("hide");
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

    pageConfig.extraParam != null && $.each(pageConfig.extraParam, function (i, v) {
        extraParam["statusas["+ i +"]"] = v;
    })

    var searcher = new Searcher();

    searcher.init(pageConfig.condArr, "condList", pageConfig.apiPage, function (data) {
        displayFunc.init('resultList', data);
    }, "pagenation", pageConfig.postDataName, extraParam, false, null, function () {

        if (pageConfig.hasExport != "" && pageConfig.hasExport != null) {
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
                column:[
                    ["装修单号", "orderId"],
                    ['楼盘', 'house.village.name'],
                    ['楼号', 'house.houseNumber'],
                    ['客户名', 'customer.name'],
                    ['设计部', 'designer.dept.name'],
                    ['设计师编号', 'designer.userId'],
                    ['设计师', 'designer.currentName'],
                    ['业务部', 'salesman.dept.name'],
                    ['业务员编号', 'salesman.userId'],
                    ['业务员', 'salesman.currentName'],
                    ['面积', 'house.buildArea'],
                    ['合同报价', 'orderTotalPrice'],
                    ['量房时间', 'measureTime'],
                    ['签单时间', 'contractTime'],
                    ['状态', 'status'],
                    ['工程状态', 'projectStatus']
                ],
                list: res.paging.data
            }, function (v) {
                v.status = order.decorationOrderStatus[v.status];
                v.projectStatus = order.projectStatusArr[v.projectStatus];
                if([2, 3, 4, 6, 7].indexOf(v.status) == -1) v.house.houseNumber = '';
            });

        });
    });

});