$(function() {

    var order = {
        saveBtn: null,
        cancellBtn: null,
        saveBtnRepair: null,

        modal: null,

        typeness: {},
        sourceStatus: {},
        decorationStatus: {},
        repairStatus: {},
        balanceStatus: {},
        busitype: {},

        orderStatus: [],
        businessDepartments: [],
        postParam: {},

        repairModal: null,

        editFlag: false,

        paymentTypes: {},
        violation: com.focusPage("#violation"),

        signItems: {
            coupon: com.focusPage("#coupon"),
            thing: com.focusPage("#thing"),
            netperfor: com.focusPage("#netperfor"),
            comperfor: com.focusPage("#comperfor"),
            conpanyName: com.focusPage("#conpanyName", "#drawContractModal"),
            conpany: com.focusPage("#conpany", "#drawContractModal"),
        },
        orderItems: {},
        infoItems: {},
        repairItems: {
            status: com.focusPage("#repairStatus"),
        },

        projectStatusArr: {},
        designStatusArr: {}
    
    };

    order.saveBtnRepair = com.focusPage("#saveBtnRepair");
    order.contractBtn = com.focusPage("#contractBtn");

    order.decorationModal = com.focusPage("#decorationModal");
    order.agreementModal = com.focusPage("#agreementModal");
    order.drawLineModal = com.focusPage("#drawLineModal");
    order.refundContractModal = com.focusPage("#refundContractModal");
    order.customerInfoModal = com.focusPage("#customerInfoModal");
    order.drawContractModal = com.focusPage("#drawContractModal");
    order.prosignModal = com.focusPage("#prosignModal");
    order.repairModal = com.focusPage("#repairModal");

    // 签订合同
    order.drawContractModal.on('hide.bs.modal', function(e) {

        com.cleanItems(order.signItems);
        com.closeTip();
    });

    // 放线申请
    order.drawLineModal.on('hide.bs.modal', function(e) {

        com.cleanItems(order.infoItems);
        com.closeTip();
    });

    // 合同终止
    order.refundContractModal.on('hide.bs.modal', function(e) {

        com.cleanItems(order.infoItems);
        com.closeTip();
    });

    // 客户信息修改
    order.customerInfoModal.on('hide.bs.modal', function(e) {

        com.cleanItems(decorationAdvance.items);
        com.closeTip();
    });

    // 预签
    order.prosignModal.on('hide.bs.modal', function(e) {

        com.cleanItems(order.infoItems);
        com.closeTip();
    });

    order.infoItems.conpanyName = com.focusPage("#conpanyName");
    order.infoItems.timeLimit = com.focusPage("#timeLimit");
    order.infoItems.quoteArea = com.focusPage("#quoteArea");
    order.infoItems.ishovel = com.focusPage("#ishovel");
    order.infoItems.iskey = com.focusPage("#iskey");
    order.infoItems.isCeremony = com.focusPage("#isCeremony");
    order.infoItems.finishTime = com.focusPage("#finishTime");
    order.infoItems.keyTime = com.focusPage("#keyTime");
    order.infoItems.designTime = com.focusPage("#designTime");
    order.infoItems.drawlineTime = com.focusPage("#drawlineTime");
    order.infoItems.comment = com.focusPage("#comment");
    order.infoItems.applayDes = com.focusPage("#applayDes");
    order.infoItems.applayTime = com.focusPage("#applayTime");
    order.infoItems.backup = com.focusPage("#backup");
    order.infoItems.prosignPrice = com.focusPage("#prosignPrice");
    order.infoItems.balance = com.focusPage("#balance");
    order.infoItems.deocBalance = com.focusPage("#deocBalance");
    order.infoItems.dlmConpany = com.focusPage("#dlmConpany");

    com.datetime(order.infoItems.finishTime);
    com.datetime(order.infoItems.keyTime);
    com.datetime(order.infoItems.designTime);
    com.datetime(order.infoItems.drawlineTime);

    com.datetime(com.focusPage("#startTime"));
    com.datetime(com.focusPage("#endTime"));
    com.datetime(com.focusPage("#applayTime"));

    var contract = {
        orderId: null
    };

    var decorationAdvance = {
        items: {}
    };

    decorationAdvance.items.customerName = com.focusPage('#customerName');
    decorationAdvance.items.phone = com.focusPage('#phone');

    // 获得页面控制参数
    var pageConfig = drawNode.getConfig(params['urlLoadParams'].depage);

    // 放线
    com.focusPage("#applayDrawLineBtn").on("click", function() {

        if (com.validate("drawLineModal")) {
            return false;
        }
        com.showConfirm("确认申请放线吗?", function() {

            var options = {
                "drawLine.content": order.infoItems.applayDes.val(),
                "drawLine.applayTime": order.infoItems.applayTime.val() + " 00:00:00",
                "drawLine.decoration.orderId": com.focusPage("#dischargeLineOrderId").val(),
            };

            if (order.infoItems.dlmConpany.val()) {
                options["drawLine.decoration.dompany"] = order.infoItems.dlmConpany.val();
            }

            com.post(api.construction.applayDrawLine, options);

            order.drawLineModal.modal("hide");
        });
    });

    // com.focusPage("#additionalInfoBtn").on('click', function (res) {
    //
    // com.post(api.decoration.queryDecorationContractByOrderId, {"decorationContract.orderId": contract.orderId}, function (res) {
    // if (res.decorationContract == null || res.decorationContract.autoId == null) {
    // com.focusPage("#workingDuration").val(0);
    // com.focusPage("#startTime").val("");
    // com.focusPage("#endTime").val("");
    // com.focusPage("#additionalInfo").html("");
    // com.focusPage("#additionalTermsModal").modal("show");
    // } else {
    // com.focusPage("#workingDuration").val(res.decorationContract.workingDuration);
    // com.focusPage("#startTime").val( res.decorationContract.startTime);
    // com.focusPage("#endTime").val(res.decorationContract.endTime);
    // com.focusPage("#additionalInfo").html(res.decorationContract.additionalInfo);
    // com.focusPage("#additionalTermsModal").modal("show");
    // }
    // });
    // });

    // com.focusPage("#saveAdditionalInfoBtn").on('click', function (res) {
    // if (com.validate("additionalTermsModal")) {
    // return;
    // }
    //    
    // com.showConfirm("确认要保存合同信息吗?", function () {
    // var options = {
    // "decorationContract.orderId": contract.orderId,
    // "decorationContract.workingDuration": com.focusPage("#workingDuration").val(),
    // "decorationContract.additionalInfo": com.focusPage("#additionalInfo").val()
    // };
    //    
    // com.focusPage("#startTime").val() && (options["decorationContract.startTime"] = com.focusPage("#startTime").val() + " 00:00:00");
    // com.focusPage("#endTime").val() && (options["decorationContract.endTime"] = com.focusPage("#endTime").val() + " 00:00:00");
    //    
    // com.post(api.decoration.saveDecorationContract, options, function (res) {
    // com.showAlert(com.info, "保存成功");
    // });
    //    
    // com.focusPage("#additionalTermsModal").modal("hide");
    // });
    // });

    com.focusPage("#refundContractBtn").on("click", function() {

        var receiverId = com.focusPage("#approveTerminalManSel").find('input:checked').attr('userid');

        if (receiverId == null || receiverId == "") {
            com.showAlert(com.error, "请选择审批人!");
            return false;
        }

        if (com.validate("refundContractModal")) {
            return false;
        }

        var options = {
            "approval.receiver.userId": receiverId,
            "approval.comment": "",

            "approvalDecorationTerminal.orderId": params.decoration.orderId
        };

        var index = 0;
        var backup = 0;

        $.each(order.paymentTypes, function(i, v) {

            var referMoney = com.focusPage("#backup_" + i).val();

            options["approvalDecorationTerminalItems[" + index + "].paymentType"] = v;
            options["approvalDecorationTerminalItems[" + index + "].referMoney"] = referMoney;
            index++;

            backup = utils.accAdd(backup, parseFloat(referMoney));
        });

        if (backup > order.paymentValue) {
            com.showAlert(com.error, "退款额大于付款额");
            return false;
        }

        var decoration = null;
        var items = [];
        var details = "";

        com.post(api.decoration.queryDecorationForCommonByOrderId, {
            "decoration.orderId": params.decoration.orderId
        }, function(res) {

            decoration = res.decoration;
        }, null, false);

        if (!decoration) {
            com.showAlert(com.error, "装修单不存在");
            return false;
        }

        $.each(order.paymentTypes, function(i, v) {

            details = details + v + ": " + com.focusPage("#backup_" + i).val() + "\n";
        });

        var args = [{
            "name": "装修单号",
            "value": decoration.orderId
        }, {
            "name": "城市",
            "value": decoration.house.village.cityProper.city.name
        }, {
            "name": "城区",
            "value": decoration.house.village.cityProper.name
        }, {
            "name": "地址",
            "value": decoration.house.village.name + " " + decoration.house.houseNumber
        }, {
            "name": "签单时间",
            "value": decoration.status == constant.decoration().decoration.STATUS_PROSIGN_INT ? decoration.precontractTime : decoration.contractTime
        }, {
            "name": "签单额",
            "value": decoration.orderTotalPrice
        }, {
            "name": "实收额",
            "value": decoration.factPrice
        }, {
            "name": "装修单类型",
            "value": constant.decoration().decoration.typeness.keys[decoration.typeness]
        }, {
            "name": "设计师",
            "value": decoration.designer.currentName
        }, {
            "name": "设计部",
            "value": decoration.designer.dept.name
        }, {
            "name": "设计分区",
            "value": decoration.designer.dept.fatherDept.name
        }, {
            "name": "业务员",
            "value": decoration.salesman.currentName
        }, {
            "name": "参与活动",
            "value": ""
        }, {
            "name": "监理",
            "value": decoration.supervisor.currentName ? decoration.supervisor.currentName : ""
        }, {
            "name": "款项信息",
            "value": details
        }, ];

        if (com.focusPage("#dingApprove", "#violation").prop("checked")) {
            options["code"] = "PROC-9B7CBC59-96FB-4941-BF01-608DB3E37C5E";
            options["forms"] = JSON.stringify(args);
        }

        com.post(api.approval.submitApprovalForDecorationTerminal, options, function(res) {

            com.showAlert(com.info, "提交成功");
        });

        order.refundContractModal.modal("hide");
    });

    com.focusPage("#customerInfoBtn").on("click", function() {

        if (com.validate("customerInfoModal")) {
            return false;
        }

        var cid = params.decoration.customerId;

        var options = {
            "customer.cid": cid,
            "customer.name": com.focusPage("#customerName").val(),
            "customer.phone": com.focusPage("#phone").val(),
            "decorationContract.orderId": params.decoration.orderId,
        };

        com.post(api.data.checkCustomerForPhone, {
            "customerPhone.phone": com.focusPage("#phone").val(),
            "customerPhone.status": 0
        }, function(res) {

        }, function(res) {

            com.showAlert(com.error, "客户电话已经存在");
            return false;
        }, false);

        com.post(api.quotation.queryQuotationForDefaultByOrderId, {
            "quotation.orderId": params.decoration.orderId
        }, function(res) {

            if (utils.accSub(com.focusPage("#customerInfoDialog").attr("totalPrice"), res.quotation.totalPrice) > 100) {
                com.showConfirm("合同金额与报价金额相差大于100, 确认签单?", function() {

                    com.post(api.decoration.signDecorationContract, options, function(res) {

                        com.showAlert(com.info, "操作成功");
                        searcher.doSearch();
                    }, null, false);
                    order.customerInfoModal.modal("hide");
                });
            } else {
                com.post(api.decoration.signDecorationContract, options, function(res) {

                    searcher.doSearch();
                }, null, false);
                order.customerInfoModal.modal("hide");
            }
        }, function() {

            com.showAlert(com.error, "报价不存在");
            return;
        }, false);
    });

    com.focusPage("#updateProject").on("click", function() {

        var options = {
            "constructionInfo.orderId": contract.orderId,
            "constructionInfo.decoration.orderId": contract.orderId,
            "constructionInfo.decoration.house.quoteArea": order.infoItems.quoteArea.val(),
            "constructionInfo.timeLimit": order.infoItems.timeLimit.val(),
            "constructionInfo.ishovel": order.infoItems.ishovel.val(),
            "constructionInfo.iskey": order.infoItems.iskey.val(),
            "constructionInfo.isCeremony": order.infoItems.isCeremony.val(),
            "constructionInfo.isConfirmPricture": 1
        };

        if (order.infoItems.dlmConpany.val()) {
            options["constructionInfo.decoration.conpany"] = order.infoItems.dlmConpany.val();
        }

        com.post(api.construction.updateConstructionInfoByOrderId, options, function(res) {

            com.showAlert(com.info, "操作成功");
        });
    });
    
    com.focusPage("#updateDrawline").on("click", function() {

        var options = {
            "constructionInfo.orderId": contract.orderId,
            "constructionInfo.decoration.orderId": contract.orderId,
            "constructionInfo.finishTime": order.infoItems.finishTime.val() ? order.infoItems.finishTime.val() + " 00:00:00" : '',
            "constructionInfo.keyTime": order.infoItems.keyTime.val() ? order.infoItems.keyTime.val() + " 00:00:00" : '',
            "constructionInfo.designTime": order.infoItems.designTime.val() ? order.infoItems.designTime.val() + " 00:00:00" : '',
            "constructionInfo.drawlineTime": order.infoItems.drawlineTime.val() ? order.infoItems.drawlineTime.val() + " 00:00:00" : '',
            "constructionInfo.comment": order.infoItems.comment.val(),
            "constructionInfo.isConfirmPricture": 1
        };

        if (order.infoItems.dlmConpany.val()) {
            options["constructionInfo.decoration.conpany"] = order.infoItems.dlmConpany.val();
        }

        com.post(api.construction.updateConstructionInfoByOrderId, options, function(res) {

            com.showAlert(com.info, "操作成功");
        });
    });

    order.infoItems.ishovel.bindData(constant.construction().constructionInfo.isHovel.datas, "key", "value", false);
    order.infoItems.iskey.bindData(constant.construction().constructionInfo.isKey.datas, "key", "value", false);
    order.infoItems.isCeremony.bindData(constant.construction().constructionInfo.isCeremony.datas, "key", "value", false);
    order.projectStatusArr = constant.decoration().decoration.projectStatus.keys;

    com.post(api.system.queryCompany, {
        "company.atttype": "3"
    }, function(res) {

        order.infoItems.dlmConpany.bindData(res.companys, "cid", "name", true);
        order.signItems.conpany.bindData(res.companys, "cid", "name", true);
    });

    com.post(api.data.queryDecorationBusitype, {}, function(res) {

        $.each(res.decorationBusitypes, function(i, v) {

            order.busitype[v.dbid] = v.name;

        });
    });

    order.repairItems.status.bindData(constant.decoration().decoration.repairStatus.datas, "key", "value");

    order.decorationStatus = constant.decoration().decoration.status.keys;
    order.typeness = constant.decoration().decoration.typeness.keys;
    order.sourceStatus = constant.decoration().decoration.sourceStatus.keys;
    order.designStatusArr = constant.decoration().decoration.designStatus.keys;
    order.repairStatus = constant.decoration().decoration.repairStatus.keys;
    order.balanceStatus = constant.decoration().decoration.balanceStatus.keys;

    // 合同终止内违约金显示
    com.post(api.data.queryPaymentType, {
        "paymentType.type": 1,
        "paymentType.atttype": 4
    }, function(res) {

        $.each(res.paymentTypes, function(i, v) {

            var $div = $('<div class="form-group"></div>');

            $('<label for="refundValue" class="col-sm-3 control-label no-padding-right"></label>').html(v.name).appendTo($div);
            $('<div class="col-sm-9"></div>').append($('<input id="backup_' + v.ptid + '" class="col-xs-10 col-sm-6 v_required v_float_3" type="text" data-toggle="popover" data-trigger="manual"/>')).appendTo($div);

            order.violation.append($div);
            order.paymentTypes[v.ptid] = v.name;
            order.infoItems["backup_" + v.ptid] = com.focusPage("#backup_" + v.ptid);

        });

        var $div = $('<div class="form-group"></div>');
        $('<label for="refundValue" class="col-sm-3 control-label no-padding-right"></label>').html("审批人").appendTo($div);
        $('<div class="col-sm-9"></div>').append($('<div id="approveTerminalManSel" class="col-xs-10 col-sm-6 "></div>')).appendTo($div);
        order.violation.append($div);

        var $div = $('<div class="form-group"></div>');
        $('<label for="dingApprove" class="col-sm-3 control-label no-padding-right"></label>').html("钉钉同步").appendTo($div);
        $('<div class="col-sm-9"></div>').append($('<input class="ace ace-switch ace-switch-5" type="checkbox" id="dingApprove"><span class="lbl status-lbl"></span>')).appendTo($div);

        order.violation.append($div);

        var $div = $('<div class="form-group"></div>');
        $('<label for="wechatApprove" class="col-sm-3 control-label no-padding-right"></label>').html("企业微信同步").appendTo($div);
        $('<div class="col-sm-9"></div>').append($('<input class="ace ace-switch ace-switch-5" type="checkbox" id="wechatApprove" disabled="disabled"><span class="lbl status-lbl"></span>')).appendTo($div);

        order.violation.append($div);

        var $div = $('<div class="form-group"></div>');
        $('<label for="larkApprove" class="col-sm-3 control-label no-padding-right"></label>').html("飞书同步").appendTo($div);
        $('<div class="col-sm-9"></div>').append($('<input class="ace ace-switch ace-switch-5" type="checkbox" id="larkApprove" disabled="disabled"><span class="lbl status-lbl"></span>')).appendTo($div);

        order.violation.append($div);

        var $div = $('<div class="form-group"></div>');
        $('<label for="fenxApprove" class="col-sm-3 control-label no-padding-right"></label>').html("纷享同步").appendTo($div);
        $('<div class="col-sm-9"></div>').append($('<input class="ace ace-switch ace-switch-5" type="checkbox" id="fenxApprove" disabled="disabled"><span class="lbl status-lbl"></span>')).appendTo($div);

        order.violation.append($div);

    }, null, false);

    /**
     * 回调函数比速提供 init(tableId, result.list)方法 tableId ,用来显示的div的id result.list 列表的json数组
     */
    var displayFunc = (function() {

        var renderList = function(tableId, listData) {

            var $tableWrap = com.focusPage('#' + tableId);
            var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');

            if (listData && listData.length) {
                $.each(listData, function(i, v) {

                    var $liLine = $('<li></li>').addClass('item-orange clearfix');
                    var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(v.orderId));
                    var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
                    var $divBtnBlock = $('<div></div>').addClass('clearfix col-sm-12');
                    var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

                    var btnView = $('<a></a>').addClass('btn btn-minier btn-yellow').html('查看');

                    var btnService = $('<a></a>').addClass('btn btn-minier btn-success').html('服务');
                    var btnRevie = $('<a></a>').addClass('btn btn-minier btn-success').html('回访');
                    var btnInfo = $('<a></a>').addClass('btn btn-minier btn-success').html('详情');
                    var btnScal = $('<a></a>').addClass('btn btn-minier btn-success').html('扣款');

                    var btnLine = $('<a></a>').addClass('btn btn-minier btn-warning').html('放线');
                    var btnContract = $('<a></a>').addClass('btn btn-minier btn-inverse').html('合同');
                    var btnContractc = $('<a></a>').addClass('btn btn-minier btn-inverse').html('合同');

                    var btnProsign = $('<a></a>').addClass('btn btn-minier btn-pink').html('预签单');
                    var btnPrice = $('<a></a>').addClass('btn btn-minier btn-pink').html('报价单');
                    var btnExtension = $('<a></a>').addClass('btn btn-minier btn-pink').html('扩展项');
                    var btnNormood = $('<a></a>').addClass('btn btn-minier btn-pink').html('定额单');
                    var btnSelect = $('<a></a>').addClass('btn btn-minier btn-pink').html('选材项');
                    var btnAddReduce = $('<a></a>').addClass('btn btn-minier btn-pink').html('增减项');
                    var btnAddReduceD = $('<a></a>').addClass('btn btn-minier btn-pink').html('增减项');
                    var btnAddReduceM = $('<a></a>').addClass('btn btn-minier btn-pink').html('增减项');

                    var btnDctivity = $('<a></a>').addClass('btn btn-minier btn-inverse').html('装修活动');
                    var btnSctivity = $('<a></a>').addClass('btn btn-minier btn-inverse').html('销售活动');

                    var btnPcontract = $('<a></a>').addClass('btn btn-minier btn-danger').html('预签');
                    var btnSign = $('<a></a>').addClass('btn btn-minier btn-danger').html('签约');
                    var btnTerminal = $('<a></a>').addClass('btn btn-minier btn-danger').html('终止');
                    var btnResign = $('<a></a>').addClass('btn btn-minier btn-danger').html('重签');
                    var btnCal = $('<a></a>').addClass('btn btn-minier btn-danger').html('决算');
                    var btnBalance = $('<a></a>').addClass('btn btn-minier btn-danger').html('内决');
                    var btnRepair = $('<a></a>').addClass('btn btn-minier btn-danger').html('保修');
                    var btnDelete = $('<a></a>').addClass('btn btn-minier btn-danger').html('废单');

                    var propertyArr = [];
                    $.each(pageConfig.propertyArr, function(pi, pv) {

                        switch (pv) {
                            case "address":
                                propertyArr.push(["楼盘地址:", (v.house.village.cityProper.city.name == null ? " " : v.house.village.cityProper.city.name) + " " + (v.house.village.cityProper == null ? " " : v.house.village.cityProper.name) + " " + v.house.village.name + " " + (v.house.houseNumber == null ? " " : v.house.houseNumber), "grey"]);
                                break;
                            case "villageName":
                                propertyArr.push(["楼盘:", (v.house.village.cityProper.city.name == null ? " " : v.house.village.cityProper.city.name) + " " + (v.house.village.cityProper == null ? " " : v.house.village.cityProper.name) + " " + v.house.village.name, "grey", tools.village.info, v.house.village.no]);
                                break;
                            case "houseNumber":// 2, 3, 4, 6, 7
                                if ([constant.decoration().decoration.STATUS_PROSIGN_INT, constant.decoration().decoration.STATUS_SIGNED_INT, constant.decoration().decoration.STATUS_RESIGNED_INT, constant.decoration().decoration.STATUS_TERMINATION_INT, constant.decoration().decoration.STATUS_FINAL_INT].contains(v.status)) {
                                    propertyArr.push(["楼号:", (v.house.houseNumber == null ? " " : v.house.houseNumber), "grey", tools.house.info, v.house.hid]);
                                }
                                break;
                            case "customerName":
                                propertyArr.push(["客户名:", v.customer.name, "grey", tools.customer.info, v.customer.cid]);
                                break;
                            case "designDepartment":
                                propertyArr.push(["设计部:", v.designer.dept.name, "grey", tools.decoration.belong, v.orderId]);
                                break;
                            case "designerName":
                                propertyArr.push(["设计师:", v.designer.currentName, "grey", tools.decoration.belong, v.orderId]);
                                break;
                            case "salesmanDepartment":
                                propertyArr.push(["业务部:", v.salesman.dept.name, "grey", tools.department.info, v.salesman.dept.did]);
                                break;
                            case "salesmanName":
                                propertyArr.push(["业务员:", v.salesman.currentName, "grey", tools.personel.info, v.salesman.userId]);
                                break;
                            case "houseArea":
                                propertyArr.push(["面积:", v.house.buildArea, "blue"]);
                                break;
                            case "quoteArea":
                                propertyArr.push(["计价面积:", v.house.quoteArea, "blue"]);
                                break;
                            case "discount":
                                propertyArr.push(["折扣:", com.checkNull(v.discount, 10), "blue"]);
                                break;
                            case "precontractPrice":
                                var _text = $("<text>预签额:</text>");
                                var _info = null;

                                if (v.precontractPrice != 0) {
                                    _info = $('<i class="icon-info-sign blue" style="padding-left: 2px; cursor: pointer"></i>').click(function() {

                                        netPerformancep(_text, v);
                                    });
                                }
                                propertyArr.push([_text, v.precontractPrice, "blue", _info]);
                                break;
                            case "orderTotalPrice":
                                var _text = $("<text>签单额:</text>");
                                var _info = null;

                                if ([constant.decoration().decoration.STATUS_SIGNED_INT, constant.decoration().decoration.STATUS_RESIGNED_INT, constant.decoration().decoration.STATUS_TERMINATION_INT, constant.decoration().decoration.STATUS_FINAL_INT].contains(v.status)) {
                                    _info = $('<i class="icon-info-sign blue" style="padding-left: 2px; cursor: pointer"></i>').click(function() {

                                        netPerformanceo(_text, v);
                                    });
                                }
                                propertyArr.push([_text, v.orderTotalPrice, "blue", _info]);
                                break;
                            case "quotationPrice":

                                var _text = $("<text>报价额:</text>");
                                var _info = $('<i class="icon-info-sign blue" style="padding-left: 2px; cursor: pointer"></i>').click(function() {

                                    com.post(api.quotation.queryQuotationForDefaultByOrderId, {
                                        "quotation.orderId": v.orderId
                                    }, function(res) {

                                        var quotation = res.quotation;

                                        beforeTotal = utils.accAdd(utils.accAdd(utils.accAdd(utils.accAdd(quotation.disPrice, quotation.undisPrice), quotation.trafficPrice), quotation.managePrice), quotation.taxPrice);

                                        com.showTip(_text, "折前总价:" + utils.changeThrDecimal(beforeTotal));

                                    });
                                });

                                propertyArr.push([_text, v.quotationPrice, "blue", _info]);
                                break;
                            case "couponCut":
                                var _text = $("<text>券优惠:</text>");
                                var _info = $('<i class="icon-info-sign blue" style="padding-left: 2px; cursor: pointer"></i>').click(function() {

                                    couponCut(_text, v.orderId);
                                });
                                propertyArr.push([_text, v.couponCut, "blue", _info]);
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
                            case "accountTime":
                                propertyArr.push(["决算时间:", v.accountTime, "green"]);
                                break;
                            case "balanceTime":
                                propertyArr.push(["内决时间:", v.balanceTime, "green"]);
                                break;
                            case "terminalTime":
                                propertyArr.push(["终止时间:", v.terminalTime, "green"]);
                                break;
                            case "sdesignTime":
                                propertyArr.push(["确认合同方案时间:", v.sdesignTime, "green"]);
                                propertyArr.push(["确认放线方案时间:", v.edesignTime, "green"]);
                                break;
                            case "decorationType":
                                propertyArr.push(["类型:", order.typeness[v.typeness], "red"]);
                                break;
                            case "decorationStatus":
                                var _text = $("<text>状态:</text>");
                                var _info = $('<i class="icon-question-sign blue" style="padding-left: 2px; cursor: pointer"></i>').click(function() {

                                    tools.communion.assistance("decoration_status_information");
                                });
                                propertyArr.push([_text, order.decorationStatus[v.status], "red", _info]);
                                break;
                            case "sourceStatus":
                                var _text = $("<text>确认状态:</text>");
                                var _info = $('<i class="icon-question-sign blue" style="padding-left: 2px; cursor: pointer"></i>').click(function() {

                                    tools.communion.assistance("decoration_source_status_informa");
                                });
                                propertyArr.push([_text, order.sourceStatus[v.sourceStatus], "red", _info]);
                                break;
                            case "projectStatus":
                                propertyArr.push(["工程状态:", order.projectStatusArr[v.projectStatus], "red"]);
                                break;
                            case "repairStatus":
                                propertyArr.push(["保修状态:", order.repairStatus[v.repairStatus], "red"]);
                                break;
                            case "designStatus":
                                var _text = $("<text>设计状态:</text>");
                                var _info = $('<i class="icon-question-sign blue" style="padding-left: 2px; cursor: pointer"></i>').click(function() {

                                    tools.communion.assistance("decoration_design_status_informa");
                                });
                                propertyArr.push([_text, order.designStatusArr[v.designStatus], "red", _info]);
                                break;
                            case "balanceStatus":
                                propertyArr.push(["内决状态:", order.balanceStatus[v.balanceStatus], "red"]);
                                break;
                            case "saleScale":
                                var _text = $("<text>销售比例:</text>");
                                var _info = $('<i class="icon-circle-arrow-down icon-rotate-180 blue" style="padding-left: 2px; cursor: pointer"></i>').click(function() {

                                    com.showConfirm("确定更新销售配比吗", function() {

                                        var options = {
                                            "decoration.orderId": v.orderId
                                        };

                                        com.post(api.decoration.updateDecorationForSaleScale, options, function() {

                                            com.showAlert(com.info, "操作成功");
                                        }, null, false);
                                    });
                                });
                                if (v.saleScale != 1918) {
                                    propertyArr.push([_text, v.saleScale, "blue", _info]);
                                }
                                break;
                            case "payScale":
                                var _text = $("<text>付款比例:</text>");
                                var _info = $('<i class="icon-circle-arrow-down icon-rotate-180 blue" style="padding-left: 2px; cursor: pointer"></i>').click(function() {

                                    com.showConfirm("确定更新付款配比吗", function() {

                                        var options = {
                                            "decoration.orderId": v.orderId
                                        };

                                        com.post(api.decoration.updateDecorationForPayScale, options, function() {

                                            com.showAlert(com.info, "操作成功");
                                        }, null, false);
                                    });
                                });
                                propertyArr.push([_text, v.paySacle, "blue", _info]);
                                break;
                        }
                    });

                    $.each(propertyArr, function(index, value) {

                        var $liProperty = $('<li></li>').appendTo($ulProperty);

                        $('<strong></strong>').html(value[0]).appendTo($liProperty);
                        $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);

                        if (value.length == 4)
                            $('<span></span>').html(value[3]).appendTo($liProperty);

                        if (value.length == 5) {
                            $liProperty.click(function() {

                                value[3]($liProperty, value[4]);

                            }).css("cursor", "pointer");
                        }
                    });

                    btnView.click(function() {

                        viewDecorationDetail(v);
                    });

                    btnPrice.click(function() {

                        viewDecorationQuotateIndex(v.orderId, v.type, v.typeness);
                    });

                    btnNormood.click(function() {

                        viewNormPart(v.orderId);
                    });

                    btnSelect.click(function() {

                        viewSelection(v.orderId);
                    });

                    btnRevie.click(function() {

                        viewDecorationBackVisitIndex(v.orderId);
                    });

                    btnLine.click(function() {

                        modalDrawLineModal(v);
                    });

                    btnContract.click(function() {

                        modalAgreementModal(v.orderId, v.customer.cid, v, "advance");
                    });

                    btnContractc.click(function() {

                        modalAgreementModal(v.orderId, v.customer.cid, v, "design");
                    });

                    btnAddReduce.click(function() {

                        viewDecorationInDecreaseIndex(v.orderId, v.type, v.typeness, null);
                    });

                    btnAddReduceD.click(function() {

                        viewDecorationInDecreaseIndex(v.orderId, v.type, v.typeness, 1);
                    });

                    btnAddReduceM.click(function() {

                        viewDecorationInDecreaseIndex(v.orderId, v.type, v.typeness, 2);
                    });

                    btnInfo.click(function() {

                        viewDecorationTimelineIndex(v.orderId);
                    });

                    btnScal.click(function() {

                        viewDecorationInAudit(v.orderId);
                    });

                    btnExtension.click(function() {

                        viewExtension(v.orderId);
                    });

                    btnCal.click(function() {

                        viewDecorationFinalSettlement(v.orderId, v.typeness, v.status);
                    });

                    btnService.click(function() {

                        viewDecorationService(v.orderId);
                    });

                    btnDctivity.click(function() {

                        viewDecorationActivity(v.orderId);
                    });

                    btnSctivity.click(function() {

                        viewSalesActivity(v.orderId);
                    });

                    btnDelete.click(function() {

                        obsoleteOrder(v.orderId);
                    });
                    // 签订合同
                    btnSign.click(function() {

                        signOrder(v.orderId, v.customer.cid, v.orderTotalPrice, v.notSalesmanRate, v.couponCut, v.thingCut);

                    });

                    // 合同终止
                    btnTerminal.click(function() {

                        terminalOrder(v.orderId, v.status, v.precontractPrice);
                        approvalUtils.initqueryApprovalUser("approveTerminalManSel", 19);
                    });

                    btnResign.click(function() {

                        resignOrder(v.orderId);
                    });

                    // 预签
                    btnProsign.click(function() {

                        params.quotation.orderId = v.orderId;

                        com.switchPage("views/quotation/protationIndex.html");
                    });
                    btnPcontract.click(function() {

                        com.showConfirm("确定进行预签", function() {

                            var options = {
                                "decoration.orderId": v.orderId
                            };

                            com.post(api.decoration.presignDecorationContract, options, function() {

                                com.switchPage("/views/decoration/decoration.html");
                            }, null, false);
                        });
                    });

                    btnBalance.click(function() {

                        balanceOrder(v.orderId);
                    });

                    btnRepair.click(function() {

                        repairOrder(v.orderId);
                    });

                    $.each(pageConfig.pageBtn, function(k, b) {

                        switch (b) {
                            case "view":// 查看
                                $divBtnWrap.append(btnView);
                                break;
                            case "prosign":// 预签 (1 ,2)
                                if ([constant.decoration().decoration.STATUS_INIT_INT, constant.decoration().decoration.STATUS_DEPOSIT_INT].indexOf(v.status) != -1) {
                                    $divBtnWrap.append(btnProsign);
                                }
                                break;
                            case "pcontract":// 预签合同 (1 ,2)
                                if ([constant.decoration().decoration.STATUS_INIT_INT, constant.decoration().decoration.STATUS_DEPOSIT_INT].indexOf(v.status) != -1) {
                                    $divBtnWrap.append(btnPcontract);
                                }
                                break;
                            case "revie":// 回访
                                $divBtnWrap.append(btnRevie);
                                break;
                            case "line":// 放线
                                $divBtnWrap.append(btnLine);
                                break;
                            case "contract":// 合同 (0, 1, 2, 3, 4, 7, 8)
                                if ([constant.decoration().decoration.STATUS_INIT_INT, constant.decoration().decoration.STATUS_DEPOSIT_INT, constant.decoration().decoration.STATUS_PROSIGN_INT, constant.decoration().decoration.STATUS_SIGNED_INT, constant.decoration().decoration.STATUS_RESIGNED_INT, constant.decoration().decoration.STATUS_FINAL_INT, constant.decoration().decoration.STATUS_COMPLETED_INT].indexOf(v.status) != -1) {
                                    $divBtnWrap.append(btnContract);
                                }
                                break;
                            case "contractc":// 合同(设计) (0, 1, 2, 3, 4, 7, 8)
                                if ([constant.decoration().decoration.STATUS_INIT_INT, constant.decoration().decoration.STATUS_DEPOSIT_INT, constant.decoration().decoration.STATUS_PROSIGN_INT, constant.decoration().decoration.STATUS_SIGNED_INT, constant.decoration().decoration.STATUS_RESIGNED_INT, constant.decoration().decoration.STATUS_FINAL_INT, constant.decoration().decoration.STATUS_COMPLETED_INT].indexOf(v.status) != -1) {
                                    $divBtnWrap.append(btnContractc);
                                }
                                break;
                            case "scal":// 扣款
                                $divBtnWrap.append(btnScal);
                                break;
                            case "price":// 报价 (0, 1, 2, 4)
                                if ([constant.decoration().decoration.STATUS_INIT_INT, constant.decoration().decoration.STATUS_DEPOSIT_INT, constant.decoration().decoration.STATUS_PROSIGN_INT, constant.decoration().decoration.STATUS_RESIGNED_INT].indexOf(v.status) != -1) {
                                    $divBtnWrap.append(btnPrice);
                                }
                                break;
                            case "normPart":// 定额
                                $divBtnWrap.append(btnNormood);
                                break;
                            case "selection":// 选材
                                $divBtnWrap.append(btnSelect);
                                break;
                            case "btnAddReduce":// 增减项 (3, 7, 8)
                                if ([constant.decoration().decoration.STATUS_SIGNED_INT, constant.decoration().decoration.STATUS_FINAL_INT, constant.decoration().decoration.STATUS_COMPLETED_INT].indexOf(v.status) != -1) {
                                    $divBtnWrap.append(btnAddReduce);
                                }
                                break;
                            case "btnAddReduceD":// 增减项 (3, 7, 8)
                                if ([constant.decoration().decoration.STATUS_SIGNED_INT, constant.decoration().decoration.STATUS_FINAL_INT, constant.decoration().decoration.STATUS_COMPLETED_INT].indexOf(v.status) != -1) {
                                    $divBtnWrap.append(btnAddReduceD);
                                }
                                break;
                            case "btnAddReduceM":// 增减项 (3, 7, 8)
                                if ([constant.decoration().decoration.STATUS_SIGNED_INT, constant.decoration().decoration.STATUS_FINAL_INT, constant.decoration().decoration.STATUS_COMPLETED_INT].indexOf(v.status) != -1) {
                                    $divBtnWrap.append(btnAddReduceM);
                                }
                                break;
                            case "extension":// 扩展项 (0, 1, 2, 3, 4, 8)
                                if ([constant.decoration().decoration.STATUS_INIT_INT, constant.decoration().decoration.STATUS_DEPOSIT_INT, constant.decoration().decoration.STATUS_PROSIGN_INT, constant.decoration().decoration.STATUS_SIGNED_INT, constant.decoration().decoration.STATUS_RESIGNED_INT, constant.decoration().decoration.STATUS_COMPLETED_INT].indexOf(v.status) != -1) {
                                    $divBtnWrap.append(btnExtension);
                                }
                                break;
                            case "info":// 信息周
                                $divBtnWrap.append(btnInfo);
                                break;
                            case "cal":// 决算 (3, 7, 8)
                                if ([constant.decoration().decoration.STATUS_SIGNED_INT, constant.decoration().decoration.STATUS_FINAL_INT, constant.decoration().decoration.STATUS_COMPLETED_INT].indexOf(v.status) != -1) {
                                    $divBtnWrap.append(btnCal);
                                }
                                break;
                            case "services":// 服务
                                $divBtnWrap.append(btnService);
                                break;
                            case "activity":// 活动物品
                                $divBtnWrap.append(btnDctivity);
                                break;
                            case "sctivity":// 活动物品
                                $divBtnWrap.append(btnSctivity);
                                break;
                            case "delete":// 废单 (3, 5, 6)
                                if (v.status != constant.decoration().decoration.STATUS_SIGNED_INT && v.status != constant.decoration().decoration.STATUS_WASTE_INT && v.status != constant.decoration().decoration.STATUS_TERMINATION_INT) {
                                    $divBtnWrap.append(btnDelete);
                                }
                                break;
                            case "sign":// 签订合同 (1, 2, 4)
                                if ([constant.decoration().decoration.STATUS_DEPOSIT_INT, constant.decoration().decoration.STATUS_PROSIGN_INT, constant.decoration().decoration.STATUS_RESIGNED_INT].indexOf(v.status) != -1) {
                                    $divBtnWrap.append(btnSign);
                                }
                                break;
                            case "terminal":// 合同终止 (2, 3)
                                if ([constant.decoration().decoration.STATUS_PROSIGN_INT, constant.decoration().decoration.STATUS_SIGNED_INT].indexOf(v.status) != -1) {
                                    $divBtnWrap.append(btnTerminal);
                                }
                                break;
                            case "resign":// 重新签合同 (3)
                                if (v.status == constant.decoration().decoration.STATUS_SIGNED_INT) {
                                    $divBtnWrap.append(btnResign);
                                }
                                break;
                            case "balance":// 重新签合同
                                $divBtnWrap.append(btnBalance);
                                break;
                            case "repair":// 保修
                                $divBtnWrap.append(btnRepair);
                        }
                    });
                    $divBtnWrap.appendTo($h3);
                    $liLine.append($h3).append($ulProperty).append($divBtnBlock).appendTo($ul);
                });

                $ul.appendTo($tableWrap);
            }
        };
        // 查看
        var viewDecorationDetail = function(v) {

            params.decoration.decoration = v;

            params.decoration.orderId = v.orderId;
            params.decoration.orderType = v.type;
            params.decoration.orderTypeness = v.typeness;
            params.decoration.versionId = v.version.no;
            params.decoration.notSalesmanRate = v.notSalesmanRate;

            params.decoration.viewNode = Object.values(pageConfig.nodes);

            params.quotation.orderId = v.orderId;

            params.historyPage = api.index.decorationIndex.url;

            com.switchPage(api.index.decorationDetailIndex.url);
            // com.popup4page("#layerPopUp", api.index.decorationDetailIndex.url, "装修单详情: " + v.orderId);
        };

        // 报价
        var viewDecorationQuotateIndex = function(orderId, type, typeness) {

            params.quotation.orderId = orderId;
            params.quotation.orderType = type;
            params.quotation.orderTypeness = typeness;

            params.historyPage = api.index.decorationIndex.url;

            com.switchPage(api.index.quotationIndex.url);
        };

        // 定额
        var viewNormPart = function(orderId) {

            params.quotation.editFlg = false;
            params.quotation.orderId = orderId;

            params.historyPage = api.index.decorationIndex.url;

            com.switchPage(api.index.normPart.url);
        };

        var viewSelection = function(orderId) {

            params.quotation.orderId = orderId;

            params.historyPage = api.index.decorationIndex.url;

            com.switchPage(api.index.selectionPartIndex.url);
        };

        // 回访
        var viewDecorationBackVisitIndex = function(orderId) {

            params.decoration.orderId = orderId;

            params.historyPage = api.index.decorationIndex.url;

            com.switchPage(api.index.backVisitIndex.url);
            // com.popup4page("#layerPopUp", api.index.backVisitIndex.url, "装修单回访: " + orderId);
        };
        // 放线
        var modalDrawLineModal = function(v) {

            contract.orderId = v.orderId;

            com.focusPage("#customerCurrentName").html(v.customer.name == null ? "暂无" : v.customer.name);
            com.focusPage("#identity").html(v.customer.identity == null ? "暂无" : v.customer.identity);

            com.focusPage("#orderId").html(v.orderId == null ? "暂无" : v.orderId);
            com.focusPage("#address").html((v.house.village.cityProper.city.name == null ? " " : v.house.village.cityProper.city.name) + " " + (v.house.village.cityProper == null ? " " : v.house.village.cityProper.name) + " " + v.house.village.name + " " + (v.house.houseNumber == null ? " " : v.house.houseNumber) == null ? "暂无" : (v.house.village.cityProper.city.name == null ? " " : v.house.village.cityProper.city.name) + " " + (v.house.village.cityProper == null ? " " : v.house.village.cityProper.name) + " " + v.house.village.name + " " + (v.house.houseNumber == null ? " " : v.house.houseNumber));
            com.focusPage("#designerName").html(v.designer.currentName == null ? "暂无" : v.designer.currentName);
            com.focusPage("#salesmanName").html(v.salesman.currentName == null ? "暂无" : v.salesman.currentName);

            var decoration = null;

            com.post(api.decoration.queryDecorationForCommonByOrderId, {
                "decoration.orderId": v.orderId
            }, function(res) {

                decoration = res.decoration;
            }, null, false);

            com.post(api.system.queryCompanyByCid, {
                "company.cid": decoration.conpany
            }, function(res) {

                com.focusPage("#conpanyName").html(res.company.name);
            });

            com.post(api.construction.queryConstructionInfoByOrderId, {
                "constructionInfo.orderId": v.orderId
            }, function(result) {

                var datas = result.constructionInfo;

                order.infoItems.dlmConpany.val(0);
                order.infoItems.quoteArea.val(decoration.house.quoteArea);
                order.infoItems.timeLimit.val(datas.timeLimit);
                order.infoItems.ishovel.val(datas.ishovel);
                order.infoItems.iskey.val(datas.iskey);
                order.infoItems.isCeremony.val(datas.isCeremony);
                order.infoItems.finishTime.val(datas.finishTime ? datas.finishTime.substr(0, 10) : "");
                order.infoItems.keyTime.val(datas.keyTime ? datas.keyTime.substr(0, 10) : "");
                order.infoItems.designTime.val(datas.designTime ? datas.designTime.substr(0, 10) : "");
                order.infoItems.drawlineTime.val(datas.drawlineTime ? datas.drawlineTime.substr(0, 10) : "");
                order.infoItems.comment.val(datas.comment);
            });

            com.cleanItems(order.infoItems);

            com.focusPage("#dischargeLineOrderId").val(v.orderId);

            order.drawLineModal.modal("show");
        };

        // 合同
        var modalAgreementModal = function(orderId, cid, data, pagetype) {

            params.decoration.orderId = orderId;
            params.decoration.cid = cid;

            params.urlLoadParams.showtype = pagetype;

            params.historyPage = api.index.decorationIndex.url;

            com.switchPage(api.index.decorationContractIndex.url);
            // com.popup4page("#layerPopUp", api.index.decorationContractIndex.url, "装修单合同: " + orderId);
        };
        // 增减项
        var viewDecorationInDecreaseIndex = function(orderId, type, typeness, atttype) {

            params.quotation.orderId = orderId;
            params.quotation.decorationType = type;
            params.quotation.decorationTypeness = typeness;
            params.quotation.atttype = atttype;
            
            params.urlLoadParams.type = null;

            params.historyPage = api.index.decorationIndex.url;

            com.switchPage(api.index.addReduceIndex.url);
        };
        // 扣款
        var viewDecorationInAudit = function(orderId) {

            params.decoration.orderId = orderId;
            params.decoration.auditStatusType = 'select';

            params.historyPage = api.index.decorationIndex.url;

            com.switchPage(api.index.auditRecordIndex.url);
            // com.popup4page("#layerPopUp", api.index.auditRecordIndex.url, "装修单扣款: " + orderId);
        };
        // 时间轴
        var viewDecorationTimelineIndex = function(orderId) {

            params.decoration.orderId = orderId;

            params.historyPage = api.index.decorationIndex.url;

            com.switchPage(api.index.decorationTimelineIndex.url);
            // com.popup4page("#layerPopUp", api.index.decorationTimelineIndex.url, "装修单进程: " + orderId);
        };
        // 扩展项
        var viewExtension = function(orderId) {

            params.quotation.orderId = orderId;

            params.historyPage = api.index.decorationIndex.url;

            com.switchPage(api.index.extensionIndex.url);
        };

        // 券优惠
        var couponCut = function(btn, orderId) {

            com.post(api.decoration.queryDecorationActivityItem, {
                "decoration.orderId": orderId
            }, function(res) {

                var decorationActivityItems = res.decorationActivityItems;

                var couponCut1 = 0;
                var couponCut2 = 0;
                var couponCut3 = 0;
                var couponCut4 = 0;
                var thingCut = 0;

                for ( var i = 0; i < decorationActivityItems.length; i++) { // 0: 初始 , 1: 失效 , 2: 已领 , 3: 退货 , 4: 配送 , 5: 未退 , 6: 升级 , 7: 补款

                    var item = decorationActivityItems[i];

                    if (item.type == 0 && [constant.decoration().decorationActivityItem.STATUS_INIT_INT, constant.decoration().decorationActivityItem.STATUS_RECEIVE_INT, constant.decoration().decorationActivityItem.STATUS_DELIVERY_INT, constant.decoration().decorationActivityItem.STATUS_WAIT_INT, constant.decoration().decorationActivityItem.STATUS_UPGRADE_INT].indexOf(item.state) != -1 && item.isPrefor == constant.decoration().decorationActivityItem.ISAFFIRM_INITIA_INT) {// 0卷, 02456状态, 0计业绩
                        couponCut1 = utils.accAdd(couponCut1, utils.accMul(item.money, item.num));
                    } else if (item.type == 1 && [constant.decoration().decorationActivityItem.STATUS_INIT_INT, constant.decoration().decorationActivityItem.STATUS_RECEIVE_INT, constant.decoration().decorationActivityItem.STATUS_DELIVERY_INT, constant.decoration().decorationActivityItem.STATUS_WAIT_INT, constant.decoration().decorationActivityItem.STATUS_UPGRADE_INT].indexOf(item.state) != -1 && item.isPrefor == constant.decoration().decorationActivityItem.ISAFFIRM_INITIA_INT) {// 1物品, 02456状态, 0计业绩
                        thingCut = utils.accAdd(thingCut, utils.accMul(item.money, item.num));
                    }

                    // 0卷, 02456状态, 0计金额 (计入金额类型)
                    if (item.type == 0 && [constant.decoration().decorationActivityItem.STATUS_INIT_INT, constant.decoration().decorationActivityItem.STATUS_RECEIVE_INT, constant.decoration().decorationActivityItem.STATUS_DELIVERY_INT, constant.decoration().decorationActivityItem.STATUS_WAIT_INT, constant.decoration().decorationActivityItem.STATUS_UPGRADE_INT].indexOf(item.state) != -1 && item.isPayment == constant.decoration().decorationActivityItem.ISAFFIRM_INITIA_INT) {
                        couponCut2 = utils.accAdd(couponCut2, utils.accMul(item.money, item.num));
                    }
                    // 0卷, 02456状态, 1不计金额 (不计入金额类型)
                    if (item.type == 0 && [constant.decoration().decorationActivityItem.STATUS_INIT_INT, constant.decoration().decorationActivityItem.STATUS_RECEIVE_INT, constant.decoration().decorationActivityItem.STATUS_DELIVERY_INT, constant.decoration().decorationActivityItem.STATUS_WAIT_INT, constant.decoration().decorationActivityItem.STATUS_UPGRADE_INT].indexOf(item.state) != -1 && item.isPayment == constant.decoration().decorationActivityItem.ISSTATUS_UNCAL_INT) {
                        couponCut3 = utils.accAdd(couponCut3, utils.accMul(item.money, item.num));
                    }
                    // 0卷, 02456状态, 1不计业绩 (不计入业绩类型)
                    if (item.type == 0 && [constant.decoration().decorationActivityItem.STATUS_INIT_INT, constant.decoration().decorationActivityItem.STATUS_RECEIVE_INT, constant.decoration().decorationActivityItem.STATUS_DELIVERY_INT, constant.decoration().decorationActivityItem.STATUS_WAIT_INT, constant.decoration().decorationActivityItem.STATUS_UPGRADE_INT].indexOf(item.state) != -1 && item.isPrefor == constant.decoration().decorationActivityItem.ISSTATUS_UNCAL_INT) {
                        couponCut4 = utils.accAdd(couponCut4, utils.accMul(item.money, item.num));
                    }

                }

                com.showTip(btn, "券优惠:" + couponCut1 + "<br\>物品优惠:" + thingCut + "<br\>优惠总额:" + utils.accAdd(couponCut1, thingCut) + "<br\>计入金额类型:" + couponCut2 + "<br\>不计入金额类型:" + couponCut3 + "<br\>计入业绩类型:" + couponCut1 + "<br\>不计入业绩类型:" + couponCut4);

            });
        };

        // 签单额净业绩
        var netPerformanceo = function(btn, decoration) {

            var quotation = {};
            com.post(api.quotation.queryQuotationForDefaultByOrderId, {
                "quotation.orderId": decoration.orderId
            }, function(res) {

                quotation = res.quotation;
            }, null, false);
            var notpoint = 0;// 非业务人员提点金额

            if (decoration.notSalesmanRate > 0 && decoration.notSalesmanRate < 1) {
                notpoint = utils.accMul(utils.accAdd(quotation.disPrice, utils.accAdd(quotation.undisPrice, quotation.trafficPrice)), decoration.notSalesmanRate);
            } else {
                notpoint = decoration.notSalesmanRate;
            }

            // 净业绩 = 签单额-非业务人员提点金额-优惠券-赠送礼品-非计入业绩
            var netPerformance = utils.accSub(utils.accSub(utils.accSub(decoration.orderTotalPrice, notpoint), decoration.couponCut), decoration.thingCut);
            com.showTip(btn, "净业绩:" + netPerformance);
        };

        // 预签额净业绩
        var netPerformancep = function(btn, decoration) {

            var quotation = {};
            com.post(api.quotation.queryQuotationForDefaultByOrderId, {
                "quotation.orderId": decoration.orderId
            }, function(res) {

                quotation = res.quotation;
            }, null, false);

            var notpoint = 0;

            if (decoration.notSalesmanRate > 0 && decoration.notSalesmanRate < 1) {
                notpoint = utils.accMul(utils.accAdd(quotation.disPrice, utils.accAdd(quotation.undisPrice, quotation.trafficPrice)), decoration.notSalesmanRate);
            } else {
                notpoint = decoration.notSalesmanRate;
            }

            // 净业绩 = 预签额 - 物品金额 - 非提金额
            var netPerformance = utils.accSub(utils.accSub(decoration.precontractPrice, decoration.thingCut), notpoint);
            com.showTip(btn, "净业绩:" + netPerformance);
        };

        // 决算
        function viewDecorationFinalSettlement(orderId, typeness, status) {

            params.quotation.orderId = orderId;
            params.decoration.orderId = orderId;
            params.decoration.typeness = typeness;
            params.decoration.status = status;
            params.decoration.viewNode = Object.values(pageConfig.nodes);

            params.historyPage = api.index.decorationIndex.url;

            com.switchPage(api.index.decorationFinalSettlementIndex.url);
            // com.popup4page("#layerPopUp", api.index.decorationFinalSettlementIndex.url, "装修单决算: " + orderId);
        }

        // 服务
        function viewDecorationService(orderId) {

            params.decoration.orderId = orderId;

            params.historyPage = api.index.decorationIndex.url;

            com.switchPage(api.index.decorationServiceIndex.url);
            // com.popup4page("#layerPopUp", api.index.decorationServiceIndex.url, "装修单服务: " + orderId);
        }

        // 活动物品
        function viewDecorationActivity(orderId) {

            params.decoration.orderId = orderId;

            params.decoration.decorationActivityBtnSend = null;
            params.decoration.decorationActivityContent = null;

            var activity = pageConfig.nodes.activity;

            if (activity != null && activity.wizard != null) {
                params.decoration.decorationActivityBtnSend = pageConfig.nodes.activity.wizard.btnSendD;
                params.decoration.decorationActivityContent = pageConfig.nodes.activity.wizard.content;

            }

            com.popup4page("#layerPopUp", api.index.decorationActivityItemIndex.url, "装修活动");
        }

        function viewSalesActivity(orderId) {

            params.sales.type = "advance";
            params.sales.sales = {
                "orderId": orderId
            };

            com.popup4page("#layerPopUp", "views/sales/sales4activity.html", "销售活动");
        }

        // 废单
        function obsoleteOrder(orderId) {

            params.decoration.orderId = orderId;

            com.showConfirm("确认要废单吗?", function() {

                com.post(api.decoration.obsoleteDecoration, {
                    "decoration.orderId": orderId
                }, function(res) {

                    com.showAlert(com.info, "操作成功");
                    searcher.doSearch();
                });
            });
        }

        // 签订合同
        function signOrder(orderId, customerId, orderTotalPrice, notSalesmanRate, coupon, thing) {

            order.signItems.conpany.val(0);
            var cId = params.decoration.customerId;

            var decoration = null;

            com.post(api.decoration.queryDecorationForCommonByOrderId, {
                "decoration.orderId": orderId
            }, function(res) {

                decoration = res.decoration;
            }, null, false);

            com.post(api.system.queryCompanyByCid, {
                "company.cid": decoration.conpany
            }, function(res) {

                order.signItems.conpanyName.html(res.company.name);
            });

            com.post(api.quotation.queryQuotationForDefaultByOrderId, {
                "quotation.orderId": orderId
            }, function(res) {
            	
                var netperfor = 0;
                var comperfor = 0;

                if (res.quotation.qid == null) {
                    com.showAlert(com.error, "报价不存在");
                    return false;
                }
                order.drawContractModal.modal("show");

                var contract = utils.accAdd(utils.accAdd(utils.accMul(res.quotation.disPrice, 0.88), res.quotation.undisPrice), utils.accAdd(res.quotation.trafficPrice, res.quotation.managePrice));
                var notpoint = 0;

                if (notSalesmanRate > 0 && notSalesmanRate < 1) {
                    notpoint = utils.accMul(utils.accAdd(utils.accAdd(res.quotation.disPrice, res.quotation.undisPrice), res.quotation.trafficPrice), notSalesmanRate);
                } else {
                    notpoint = notSalesmanRate;
                }

                var Offer = utils.accAdd(coupon, thing);
                netperfor = utils.accSub(utils.accSub(orderTotalPrice, utils.accAdd(coupon, thing)), notpoint);
                comperfor = utils.changeTwoDecimal(utils.accDiv(utils.accAdd(utils.accSub(utils.accMul(utils.accSub(contract, notpoint), 0.38), Offer), utils.accSub(orderTotalPrice, contract)), 0.38));

                var options = {
                    "decoration.orderId": orderId
                };

                order.signItems.coupon.html("券优惠 : " + coupon);
                order.signItems.thing.html("物品优惠 : " + thing);
                order.signItems.netperfor.val(netperfor);// 净业绩
                order.signItems.comperfor.val(comperfor);// 复合业绩

                com.focusPage("#contractBtn").unbind('click').on("click", function() {

                    if (com.validate("drawContractModal")) {
                        return false;
                    }

                    options["decoration.dompany"] = order.signItems.conpany.val();

                    if (utils.accSub(orderTotalPrice, res.quotation.totalPrice) > 100) {
                        com.showConfirm("合同金额与报价金额相差大于100, 确认签单?", function() {

                            com.post(api.decoration.signDecorationContract, options, function(res) {

                                com.showAlert(com.info, "确认成功");
                                order.drawContractModal.modal("hide");
                                searcher.doSearch();
                            }, null, false);
                        });
                    } else {
                        com.showConfirm("确认签单?", function() {

                            com.post(api.decoration.signDecorationContract, options, function(res) {

                                com.showAlert(com.info, "确认成功");
                                order.drawContractModal.modal("hide");
                                searcher.doSearch();
                            }, null, false);
                        });
                    }
                });

            }, function() {

                com.showAlert(com.error, "报价不存在");
                return false;
            }, false);
        }

        // 合同终止
        function terminalOrder(orderId, status, precontractPrice, rowId) {

            params.decoration.orderId = orderId;
            params.decoration.rowId = rowId;

            var backup = 0;

            com.post(api.payment.queryAdvancePaymentByOrderId, {
                "advancePayment.decoration.orderId": orderId
            }, function(res) {

                var advancePayment = "";
                var balanceAdvance = res.balanceAdvance;

                advancePayment += "合同: " + balanceAdvance + "<br/>";

                backup = utils.accAdd(backup, balanceAdvance);

                com.focusPage("#advancePayment").html(advancePayment);
            }, null, false);

            com.post(api.payment.queryDecorationPaymentForContractByOrderId, {
                "decorationPayment.decoration.orderId": orderId
            }, function(res) {

                var decorationPaymentInfo = "";
                var decorationPayments = res.decorationPayments;

                for ( var i = 0; i < decorationPayments.length; i++) {

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

                com.focusPage("#decorationStatus").html(order.decorationStatus[status]);
                com.focusPage("#precontractPrice").val(precontractPrice);
                com.focusPage("#decorationPaymentInfo").html(decorationPaymentInfo);
                com.focusPage("#backup").val(0);
                order.paymentValue = backup;

                order.refundContractModal.modal("show");
            }, null, false);

        }

        // 重签合同
        function resignOrder(orderId, rowId) {

            params.decoration.orderId = orderId;
            params.decoration.rowId = rowId;

            com.showConfirm("确认要重签合同吗?", function() {

                com.post(api.decoration.resignDecorationContract, {
                    "decorationContract.orderId": orderId
                }, function(res) {

                    com.showAlert(com.info, "操作成功");
                    searcher.doSearch();
                });
            });
        }

        // 预签
        function prosignOrder(orderId, precontractPrice) {

            order.infoItems.prosignPrice.val(precontractPrice);
            order.prosignModal.modal("show");

            com.focusPage("#prosignBtn").unbind('click').on("click", function() {

                if (com.validate("prosignModal")) {
                    return false;
                }
                var prosignVal = order.infoItems.prosignPrice.val();

                var options = {
                    "decoration.orderId": orderId,
                    "decoration.precontractPrice": prosignVal
                };

                com.post(api.decoration.presignDecorationContract, options, function() {

                    order.prosignModal.modal("hide");
                    com.showAlert(com.info, "操作成功");
                    searcher.doSearch();
                }, null, false);
            });
        }

        function balanceOrder(orderId) {

            com.showConfirm("确认要内决吗?", function() {

                var options = {
                    "decorationBalance.decoration.orderId": orderId,
                    "decorationBalance.balance": 0
                };

                com.post(api.decoration.makeDecorationBalance, options, function() {

                    com.showAlert(com.info, "内决成功");
                });
            });
        }
        function repairOrder(orderId) {

            order.repairModal.modal("show");
            com.focusPage("#saveBtnRepair").unbind('click').on("click", function() {

                if (com.validate('repairModal')) {
                    return false;
                }
                ;

                var options = {
                    "decoration.orderId": orderId,
                    "decoration.repairStatus": order.repairItems.status.val(),
                };

                com.post(api.decoration.changeDecorationForRepairStatus, options, function(res) {

                    com.showAlert(com.info, "操作成功");
                    searcher.doSearch();
                });
                order.repairModal.modal("hide");
            });
        }

        return {
            init: function(tableId, listData) {

                com.focusPage('#' + tableId).html(null);
                renderList(tableId, listData);
            }
        };
    })();
    // 额外参数 控制装修-通用-设计/业务 状态 签约/决算
    var extraParam = {};
    var pageName = params['urlLoadParams'].depage;

    pageConfig.extraParam != null && $.each(pageConfig.extraParam, function(i, v) {

        extraParam["statusas[" + i + "]"] = v;
    });

    if (pageConfig.companyType != null) {
        extraParam["companyType"] = pageConfig.companyType[0];
    }

    var searcher = new Searcher();

    searcher.init(pageConfig.condArr, "condList", pageConfig.apiPage, function(data) {

        displayFunc.init('resultList', data);
    }, "pagenation", pageConfig.postDataName, extraParam, false, null, function() {

        if (pageConfig.hasExport != "" && pageConfig.hasExport != null) {
            var $impa = $('<a></a>').addClass('btn btn-minier btn-success pull-left').attr('name', 'import').css("margin", "0px 3px");
            var $impi = $('<i></i>').addClass('icon-download-alt bigger-110').appendTo($impa);
            var $impspan = $('<span></span>').text('导出').appendTo($impa);

            return [$impa];
        }
    });

    com.focusPage('a[name="import"]', '#pagenation').click(function() {

        if (com.focusPage('span[name="totalRecords"]').text() == 0) {
            com.showAlert(com.warning, "请通过条件进行查询");
            return false;
        }

        if (com.focusPage('span[name="totalRecords"]').text() > 200) {
            com.showAlert(com.warning, "查询结果大于阀值 , 不能完成导出动作");
            return false;
        }

        com.post(pageConfig.apiPage, $.extend({}, params[pageConfig.postDataName], {
            "paging.noPage": 1
        }), function(res) {

            $.exceler({
                column: [["装修单号", "orderId"], ['楼盘', 'house.village.name'], ['楼号', 'house.houseNumber'], ['客户名', 'customer.name'], ['设计部', 'designer.dept.name'], ['设计师编号', 'designer.userId'], ['设计师', 'designer.currentName'], ['业务部', 'salesman.dept.name'], ['业务员编号', 'salesman.userId'], ['业务员', 'salesman.currentName'], ['面积', 'house.buildArea'], ['实收额', 'factPrice'], ['预签额', 'precontractPrice'], ['合同报价', 'orderTotalPrice'], ['量房时间', 'measureTime'], ['预签时间', 'precontractTime'], ['签单时间', 'contractTime'], ['状态', 'status'], ['工程状态', 'projectStatus'], ['订单类型', 'typeness'], ['业务类型', 'busitype']],
                list: res.paging.data
            }, function(v) {

                v.status = order.decorationStatus[v.status];
                v.projectStatus = order.projectStatusArr[v.projectStatus];
                v.typeness = order.typeness[v.typeness];
                v.busitype = order.busitype[v.busitype];
                if ([constant.decoration().decoration.STATUS_PROSIGN_INT, constant.decoration().decoration.STATUS_SIGNED_INT, constant.decoration().decoration.STATUS_RESIGNED_INT, constant.decoration().decoration.STATUS_TERMINATION_INT, constant.decoration().decoration.STATUS_FINAL_INT].indexOf(v.status) == -1)
                    v.house.houseNumber = '';
            });

        });
    });

});