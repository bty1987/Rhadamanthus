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
        updateTerminalStatusModal: null,

        editFlag: false,

        paymentTypes: {},
        violation: com.focusPage("#violation1"),

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
        nodeItems: {
            constructionNodes: com.focusPage("#constructionNodes", "#constructionNodeModal"),
        },
        constructionItems: {
            terminalStatus: com.focusPage("#terminalStatus", "#updateTerminalStatusModal")
        },
        approvalItems: {
            // Select 下拉框
            refundCompany: com.focusPage("#refundCompany"),
            refundPersonnelStatus: com.focusPage("#refundPersonnelStatus"),
            refundPaymentType: com.focusPage("#refundPaymentType"),
            refundCancelType: com.focusPage("#refundCancelType"),

            // Input 输入框
            refundPenaltyAmount: com.focusPage("#refundPenaltyAmount"),
            refundIncurredAmount: com.focusPage("#refundIncurredAmount"),
            refundDrawingCost: com.focusPage("#refundDrawingCost"),
            refundCalculationMethod: com.focusPage("#refundCalculationMethod"),
            refundActualAmount: com.focusPage("#refundActualAmount"),
            refundDiscountDetail: com.focusPage("#refundDiscountDetail"),
            refundReason: com.focusPage("#refundReason"),

            // Span 显示字段
            refundOrderNo: com.focusPage("#refundOrderNo"),
            refundBuildingAddress: com.focusPage("#refundBuildingAddress"),
            refundSignDate: com.focusPage("#refundSignDate"),
            refundPreSignTime: com.focusPage("#refundPreSignTime"),
            refundPreSignAmount: com.focusPage("#refundPreSignAmount"),
            refundSignAmount: com.focusPage("#refundSignAmount"),
            refundReceivedAmount: com.focusPage("#refundReceivedAmount"),
            refundOrderType: com.focusPage("#refundOrderType"),
            refundOrderStatus: com.focusPage("#refundOrderStatus"),
            refundDesigner: com.focusPage("#refundDesigner"),
            refundSalesman: com.focusPage("#refundSalesman"),
            refundActivity: com.focusPage("#refundActivity"),
            refundSupervisor: com.focusPage("#refundSupervisor"),
            refundBankName: com.focusPage("#refundBankName"),
            refundBankAccount: com.focusPage("#refundBankAccount"),
            refundCardHolder: com.focusPage("#refundCardHolder"),
            refundConstructionProgress: com.focusPage("#refundConstructionProgress")
        },

        projectStatusArr: {},
        designStatusArr: {}
    };

    order.saveBtnRepair = com.focusPage("#saveBtnRepair");
    order.contractBtn = com.focusPage("#contractBtn");

    order.decorationModal = com.focusPage("#decorationModal");
    order.agreementModal = com.focusPage("#agreementModal");
    order.drawLineModal = com.focusPage("#drawLineModal");
    order.drawlineScheduleModal = com.focusPage("#drawlineScheduleModal");
    order.constructionNodeModal = com.focusPage("#constructionNodeModal");
    order.refundContractModal = com.focusPage("#refundContractModal");
    order.terminalContractModal = com.focusPage("#terminalContractModal");
    order.customerInfoModal = com.focusPage("#customerInfoModal");
    order.drawContractModal = com.focusPage("#drawContractModal");
    order.prosignModal = com.focusPage("#prosignModal");
    order.repairModal = com.focusPage("#repairModal");
    order.updateTerminalStatusModal = com.focusPage("#updateTerminalStatusModal");

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

    order.drawlineScheduleModal.on('hidden.bs.modal', function(e) {

        com.focusPage('#drawlineScheduleCalendar').fullCalendar('destroy');
    });

    // 合同终止
    order.refundContractModal.on('hide.bs.modal', function(e) {

        com.cleanItems(order.infoItems);
        com.cleanItems(order.approvalItems);
        com.closeTip();
    });

    // 合同终止审批
    order.terminalContractModal.on('hide.bs.modal', function(e) {

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

    // 工程终止
    order.updateTerminalStatusModal.on("hide.bs.modal", function() {

        com.cleanItems(order.constructionItems);
        com.closeTip();
    });

    order.constructionItems.terminalStatus.bindData(constant.construction().construction.terminalStatus.datas, "key", "value");

    com.initTypeahead('supervisor', api.personel.queryUserByPinyin, "pinyinName", {
        "departmentType.name": "工程部",
        "user.status": 0
    }, "autoFillKeyValue", "key", "value", null);

    order.infoItems.conpanyName = com.focusPage("#conpanyName");
    order.infoItems.timeLimit = com.focusPage("#timeLimit");
    order.infoItems.designPeriod = com.focusPage("#designPeriod");
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

    // 完成放线
    com.focusPage("#finishDrawLineBtn").on("click", function() {

        if (com.validate("drawLineModal")) {
            return false;
        }

        var orderId = com.focusPage("#dischargeLineOrderId").val();

        // 显示加载中
        com.showLoading("正在获取施工节点数据...");

        // 1. 获取订单信息（包含房屋面积）
        var decoration = null;
        com.post(api.decoration.queryDecorationForCommonByOrderId, {
            "decoration.orderId": orderId
        }, function(res) {

            decoration = res.decoration;
        }, null, false);

        if (!decoration || !decoration.house) {
            com.hideLoading();
            com.showAlert(com.warning, "获取订单信息失败");
            return false;
        }

        // 2. 获取基础 constructionNode 数据
        var constructionNodes = [];
        com.post(api.data.queryConstructionNode, {}, function(res) {

            constructionNodes = res.constructionNodes || [];
        }, null, false);

        // 过滤出预派节点（proset = 1）
        var preSetNodes = [];
        $.each(constructionNodes, function(i, node) {

            preSetNodes.push(node);
        });

        // 3. 根据面积获取 constructionPace 数据
        var pace = null;
        com.post(api.data.queryConstructionPace, {
            "constructionPace.lowerArea": decoration.house.innerArea
        }, function(res) {

            pace = res.constructionPace;
        }, null, false);

        // 4. 如果有 constructionPace，获取 constructionPaceNode 数据
        if (pace && pace.cpid) {
            com.post(api.data.queryConstructionPaceNode, {
                "constructionPaceNode.cpid": pace.cpid
            }, function(res) {

                var paceNodes = res.constructionPaceNodes || [];

                // 用 constructionPaceNode 数据覆盖基础节点数据
                $.each(paceNodes, function(i, paceNode) {

                    $.each(preSetNodes, function(j, node) {

                        if (node.cnid == paceNode.node.cnid) {
                            // 优先使用 constructionPaceNode 的数据
                            node.prenum = paceNode.prenum;
                            node.postnum = paceNode.postnum;
                            node.timeLimit = paceNode.period || node.timeLimit;
                        }
                    });
                });
            }, null, false);
        }

        // 5. 获取已有的施工计划数据（最高优先级）
        com.post(api.construction.queryConstructionPlanByOrderId, {
            "constructionPlan.orderId": orderId
        }, function(res) {

            var constructionPlans = res.constructionPlans || [];

            // 用已有施工计划数据覆盖
            $.each(constructionPlans, function(i, plan) {

                $.each(preSetNodes, function(j, node) {

                    if (node.cnid == plan.cnid) {
                        node.timeLimit = plan.connum || node.timeLimit;
                    }
                });
            });
        }, null, false);

        com.hideLoading();

        // 6. 构建请求参数
        com.showConfirm("确认完成放线吗?", function() {

            var options = {
                "drawLine.content": order.infoItems.applayDes.val(),
                "drawLine.applayTime": order.infoItems.applayTime.val() + " 00:00:00",
                "drawLine.decoration.orderId": orderId,
            };

            if (order.infoItems.dlmConpany.val()) {
                options["drawLine.decoration.dompany"] = order.infoItems.dlmConpany.val();
            }

            // 添加 constructionNodes 参数
            $.each(preSetNodes, function(i, node) {

                options["constructionNodes[" + i + "].cnid"] = node.cnid;
                options["constructionNodes[" + i + "].sort"] = node.sort;
                options["constructionNodes[" + i + "].timeLimit"] = node.timeLimit || 0;
                options["constructionNodes[" + i + "].prenum"] = node.prenum || 0;
                options["constructionNodes[" + i + "].postnum"] = node.postnum || 0;
            });

            com.post(api.construction.finishDrawLine, options, function(res) {

                com.showAlert(com.info, "开工成功");
                order.drawLineModal.modal("hide");
                // 刷新列表或页面
                if (typeof refreshList === 'function') {
                    refreshList();
                }
            });
        });
    });

    com.focusPage("#saveSuccess").on("click", function() {

        if (com.validate("constructionNodeModal")) {
            return false;
        }

        var $inputs = com.focusPage('input[name="sorts"]:checked', '#constructionNodes');

        var option = {
            "drawLine.decoration.orderId": params.decoration.orderId,
            "drawLine.decoration.supervisor.userId": com.typeahead("supervisor"),
        };

        $.each($inputs, function(i, v) {

            var $input = $(v);

            option["constructionNodes[" + i + "].cnid"] = $input.attr('cnid');
            option["constructionNodes[" + i + "].sort"] = $input.attr('sort');
            option["constructionNodes[" + i + "].timeLimit"] = $("input[text_sort=" + $input.attr('sort') + "]").val();
        });

        com.post(api.construction.pretreatDrawLine, option, function(res) {

            com.showAlert(com.info, "放线成功");

            order.constructionNodeModal.modal("hide");
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

        // 收集表单数据
        var args = [{
            "name": "所属公司",
            "value": com.focusPage("#refundCompany").val() || ""
        }, {
            "name": "订单编号",
            "value": com.focusPage("#refundOrderNo").text() || decoration.orderId
        }, {
            "name": "楼盘地址",
            "value": com.focusPage("#refundBuildingAddress").text() || (decoration.house.village.name + " " + decoration.house.houseNumber)
        }, {
            "name": "签单日期",
            "value": com.focusPage("#refundSignDate").text() || (decoration.status == constant.decoration().decoration.STATUS_PROSIGN_INT ? decoration.precontractTime : decoration.contractTime)
        }, {
            "name": "预签时间",
            "value": com.focusPage("#refundPreSignTime").text() || ""
        }, {
            "name": "预签额",
            "value": com.focusPage("#refundPreSignAmount").text() || ""
        }, {
            "name": "签单额",
            "value": com.focusPage("#refundSignAmount").text() || decoration.orderTotalPrice
        }, {
            "name": "实收额",
            "value": com.focusPage("#refundReceivedAmount").text() || decoration.factPrice
        }, {
            "name": "订单类型",
            "value": com.focusPage("#refundOrderType").text() || constant.decoration().decoration.typeness.keys[decoration.typeness]
        }, {
            "name": "订单状态",
            "value": com.focusPage("#refundOrderStatus").text() || ""
        }, {
            "name": "设计师",
            "value": com.focusPage("#refundDesigner").text() || decoration.designer.currentName
        }, {
            "name": "设计部",
            "value": decoration.designer.dept.name
        }, {
            "name": "设计分区",
            "value": decoration.designer.dept.fatherDept.name
        }, {
            "name": "业务员",
            "value": com.focusPage("#refundSalesman").text() || decoration.salesman.currentName
        }, {
            "name": "人员状态",
            "value": com.focusPage("#refundPersonnelStatus").val() || ""
        }, {
            "name": "参加活动",
            "value": com.focusPage("#refundActivity").text() || ""
        }, {
            "name": "监理姓名",
            "value": com.focusPage("#refundSupervisor").text() || (decoration.supervisor.currentName ? decoration.supervisor.currentName : "")
        }, {
            "name": "退款类型",
            "value": com.focusPage("#refundPaymentType").val() || ""
        }, {
            "name": "开户行银行",
            "value": com.focusPage("#refundBankName").text() || ""
        }, {
            "name": "开户行账号",
            "value": com.focusPage("#refundBankAccount").text() || ""
        }, {
            "name": "持卡人姓名",
            "value": com.focusPage("#refundCardHolder").text() || ""
        }, {
            "name": "施工进度",
            "value": com.focusPage("#refundConstructionProgress").text() || ""
        }, {
            "name": "违约金金额",
            "value": com.focusPage("#refundPenaltyAmount").val() || ""
        }, {
            "name": "已发生项目金额",
            "value": com.focusPage("#refundIncurredAmount").val() || ""
        }, {
            "name": "绘图成本金额",
            "value": com.focusPage("#refundDrawingCost").val() || ""
        }, {
            "name": "退款计算方式",
            "value": com.focusPage("#refundCalculationMethod").val() || ""
        }, {
            "name": "实际退款金额",
            "value": com.focusPage("#refundActualAmount").val() || ""
        }, {
            "name": "退单类型",
            "value": com.focusPage("#refundCancelType").val() || ""
        }, {
            "name": "已办理优惠明细",
            "value": com.focusPage("#refundDiscountDetail").val() || ""
        }, {
            "name": "退单原因",
            "value": com.focusPage("#refundReason").val() || ""
        }, {
            "name": "款项信息",
            "value": details
        }];

        if (com.focusPage("#dingApprove", "#violation").prop("checked")) {
            options["code"] = "PROC-9B7CBC59-96FB-4941-BF01-608DB3E37C5E";
            options["forms"] = JSON.stringify(args);
        }

        com.post(api.approval.submitApprovalForDecorationTerminal, options, function(res) {

            order.refundContractModal.modal("hide");
            com.showAlert(com.info, "提交成功");

            searcher.doSearch();
        });

    });

    com.focusPage("#refundContractBtn1").on("click", function() {

        if (com.validate("terminalContractModal")) {
            return false;
        }

        var options = {
            "decoration.orderId": params.decoration.orderId
        };

        var index = 0;
        var backup = 0;

        $.each(order.paymentTypes, function(i, v) {

            var referMoney = com.focusPage("#backup_" + i).val();

            options["decorationPayments[" + index + "].paymentType"] = v;
            options["decorationPayments[" + index + "].referMoney"] = referMoney;
            index++;

            backup = utils.accAdd(backup, parseFloat(referMoney));
        });

        if (backup > order.paymentValue) {
            com.showAlert(com.error, "退款额大于付款额");
            return false;
        }

        com.post(api.decoration.terminalDecoration, options, function(res) {

            order.terminalContractModal.modal("hide");
            com.showAlert(com.info, "提交成功");

            searcher.doSearch();
        });

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

            com.post(api.decoration.queryDecorationForCommonByOrderId, {
                "decoration.orderId": contract.orderId
            }, function(decorationRes) {

                var decoration = decorationRes.decoration;
                var designPeriodValue = parseInt(order.infoItems.designPeriod.val()) || 0;
                var baseTime = null;

                if (decoration.precontractTime) {
                    baseTime = decoration.precontractTime;
                } else if (decoration.contractTime) {
                    baseTime = decoration.contractTime;
                }

                if (baseTime && designPeriodValue > 0) {
                    var newDesignTime = utils.workDays(baseTime, designPeriodValue);
                    order.infoItems.designTime.val(newDesignTime);
                }

                com.showAlert(com.info, "操作成功");
            }, null, false);
        });
    });

    com.focusPage("#updateDrawline").on("click", function() {

        var options = {
            "constructionInfo.orderId": contract.orderId,
            "constructionInfo.decoration.orderId": contract.orderId,
            "constructionInfo.finishTime": order.infoItems.finishTime.val(),
            "constructionInfo.keyTime": order.infoItems.keyTime.val() ? order.infoItems.keyTime.val() + " 00:00:00" : '',
            "constructionInfo.initDesignTime": order.infoItems.designTime.val() ? order.infoItems.designTime.val() + " 00:00:00" : '',
            "constructionInfo.drawlineTime": order.infoItems.drawlineTime.val() ? order.infoItems.drawlineTime.val() + " 00:00:00" : '',
            "constructionInfo.comment": order.infoItems.comment.val(),
            "constructionInfo.designPeriod": order.infoItems.designPeriod.val(),
            "constructionInfo.isConfirmPricture": 1
        };

        if (order.infoItems.drawlineTime.val()) {
            options["constructionInfo.actuaTime"] = com.dateFormat(new Date(order.infoItems.drawlineTime.val()), "yyyyMMdd");
        }

        if (order.infoItems.dlmConpany.val()) {
            options["constructionInfo.decoration.conpany"] = order.infoItems.dlmConpany.val();
        }

        com.post(api.construction.updateConstructionInfoByOrderId, options, function(res) {

            com.focusPage('#drawlineCalendar').fullCalendar('next');
            com.focusPage('#drawlineCalendar').fullCalendar('prev');

            com.post(api.decoration.queryDecorationForCommonByOrderId, {
                "decoration.orderId": contract.orderId
            }, function(decorationRes) {

                var decoration = decorationRes.decoration;
                var designPeriodValue = parseInt(order.infoItems.designPeriod.val()) || 0;
                var baseTime = null;

                if (decoration.precontractTime) {
                    baseTime = decoration.precontractTime;
                } else if (decoration.contractTime) {
                    baseTime = decoration.contractTime;
                }

                if (baseTime && designPeriodValue > 0) {
                    var newDesignTime = utils.workDays(baseTime, designPeriodValue);
                    order.infoItems.designTime.val(newDesignTime);
                }

                com.showAlert(com.info, "操作成功");
            }, null, false);
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

    // 初始化退款合同模态框的下拉选项
    com.post(api.ds.decoration, {}, function(res) {

        // 绑定所属公司下拉框
        com.focusPage("#refundCompany").bindData(res.refundCompany, "key", "value");
        // 绑定人员状态下拉框
        com.focusPage("#refundPersonnelStatus").bindData(res.refundPersonnelStatus, "key", "value");
        // 绑定退款类型下拉框
        com.focusPage("#refundPaymentType").bindData(res.refundPaymentType, "key", "value");
        // 绑定退单类型下拉框
        com.focusPage("#refundCancelType").bindData(res.refundCancelType, "key", "value");
    });

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
        $('<label for="dingApprove" class="col-sm-3 control-label no-padding-right"></label>').html("钉钉同步").appendTo($div);
        $('<div class="col-sm-9"></div>').append($('<input class="ace ace-switch ace-switch-5" type="checkbox" id="dingApprove"><span class="lbl status-lbl"></span>')).appendTo($div);

        com.focusPage("#violation").append($div);

        // 绑定钉钉审批复选框事件，控制表单详情的显示/隐藏
        com.focusPage("#dingApprove").on("change", function() {

            var $detailContainer = com.focusPage("#refundFormDetailContainer");
            if ($(this).is(":checked")) {
                // 勾选时显示详情容器
                $detailContainer.slideDown(300);
            } else {
                // 取消勾选时隐藏详情容器
                $detailContainer.slideUp(300);
            }
        });

        var $div = $('<div class="form-group"></div>');
        $('<label for="wechatApprove" class="col-sm-3 control-label no-padding-right"></label>').html("企业微信同步").appendTo($div);
        $('<div class="col-sm-9"></div>').append($('<input class="ace ace-switch ace-switch-5" type="checkbox" id="wechatApprove" disabled="disabled"><span class="lbl status-lbl"></span>')).appendTo($div);

        com.focusPage("#violation").append($div);

        var $div = $('<div class="form-group"></div>');
        $('<label for="larkApprove" class="col-sm-3 control-label no-padding-right"></label>').html("飞书同步").appendTo($div);
        $('<div class="col-sm-9"></div>').append($('<input class="ace ace-switch ace-switch-5" type="checkbox" id="larkApprove" disabled="disabled"><span class="lbl status-lbl"></span>')).appendTo($div);

        com.focusPage("#violation").append($div);

        var $div = $('<div class="form-group"></div>');
        $('<label for="fenxApprove" class="col-sm-3 control-label no-padding-right"></label>').html("纷享同步").appendTo($div);
        $('<div class="col-sm-9"></div>').append($('<input class="ace ace-switch ace-switch-5" type="checkbox" id="fenxApprove" disabled="disabled"><span class="lbl status-lbl"></span>')).appendTo($div);

        com.focusPage("#violation").append($div);

    }, null, false);

    /**
     * 回调函数比速提供 init(tableId, result.list)方法 tableId ,用来显示的div的id result.list 列表的json数组
     */
    /**
     * Searcher 标准化改造: 将原 displayFunc IIFE 的 renderList / creatLine 逻辑 拆分为 buildDecorationLineprops / buildDecorationLinebtns, 借助 searcher.line(...).render() 渲染。 IIFE 内其余业务函数 (viewDecoration*, modalDrawLineModal, signOrder 等) 全部上提到模块作用域, 保持原语义。
     */

    var lineprops = (function() {

        var propertyMap = {
            address: {
                field: "address",
                name: "楼盘地址",
                prop: function(v) {

                    return (v.house.village.cityProper.city.name == null ? " " : v.house.village.cityProper.city.name) + " " + (v.house.village.cityProper == null ? " " : v.house.village.cityProper.name) + " " + v.house.village.name + " " + (v.house.houseNumber == null ? " " : v.house.houseNumber);
                },
                clazz: "grey"
            },
            villageName: {
                field: "villageName",
                name: "楼盘",
                prop: function(v) {

                    return (v.house.village.cityProper.city.name == null ? " " : v.house.village.cityProper.city.name) + " " + (v.house.village.cityProper == null ? " " : v.house.village.cityProper.name) + " " + v.house.village.name;
                },
                clazz: "grey",
                click: function($this, v) {

                    tools.village.info($this, v.house.village.no);
                }
            },
            houseNumber: {
                field: "houseNumber",
                name: "楼号",
                prop: function(v) {

                    return v.house.houseNumber == null ? " " : v.house.houseNumber;
                },
                clazz: "grey",
                click: function($this, v) {

                    tools.house.info($this, v.house.hid);
                },
                show: function(v) {

                    return [constant.decoration().decoration.STATUS_PROSIGN_INT, constant.decoration().decoration.STATUS_SIGNED_INT, constant.decoration().decoration.STATUS_RESIGNED_INT, constant.decoration().decoration.STATUS_TERMINATION_INT, constant.decoration().decoration.STATUS_FINAL_INT].contains(v.status);
                }
            },
            customerName: {
                field: "customerName",
                name: "客户名",
                prop: "customer.name",
                clazz: "grey",
                click: function($this, v) {

                    tools.customer.info($this, v.customer.cid);
                }
            },
            designDepartment: {
                field: "designDepartment",
                name: "设计部",
                prop: "designer.dept.name",
                clazz: "grey",
                click: function($this, v) {

                    tools.decoration.belong($this, v.orderId);
                }
            },
            designerName: {
                field: "designerName",
                name: "设计师",
                prop: "designer.currentName",
                clazz: "grey",
                click: function($this, v) {

                    tools.decoration.belong($this, v.orderId);
                }
            },
            escorterName: {
                field: "escorterName",
                name: "方案设计",
                prop: function(v) {

                    return v.escorter ? v.escorter.currentName : '';
                },
                clazz: "grey",
                click: function($this, v) {

                    tools.personel.info($this, v.escorter ? v.escorter.userId : '');
                }
            },
            salesmanDepartment: {
                field: "salesmanDepartment",
                name: "业务部",
                prop: "salesman.dept.name",
                clazz: "grey",
                click: function($this, v) {

                    tools.department.info($this, v.salesman.dept.did);
                }
            },
            salesmanName: {
                field: "salesmanName",
                name: "业务员",
                prop: "salesman.currentName",
                clazz: "grey",
                click: function($this, v) {

                    tools.personel.info($this, v.salesman.userId);
                }
            },
            decorationBusitype: {
                field: "decorationBusitype",
                name: "业务类型",
                prop: function(v) {

                    return order.busitype[v.busitype];
                },
                clazz: "red"
            },
            materialerName: {
                field: "materialerName",
                name: "跟单员",
                prop: function(v) {

                    return v.materialer ? v.materialer.currentName : '';
                },
                clazz: "grey",
                click: function($this, v) {

                    tools.personel.info($this, v.materialer ? v.materialer.userId : '');
                }
            },
            supervisorName: {
                field: "supervisorName",
                name: "监理",
                prop: "supervisor.currentName",
                clazz: "grey",
                click: function($this, v) {

                    tools.personel.info($this, v.supervisor.userId);
                }
            },
            houseArea: {
                field: "houseArea",
                name: "派尺面积",
                prop: "house.buildArea",
                clazz: "blue"
            },
            quoteArea: {
                field: "quoteArea",
                name: "计价面积",
                prop: "house.innerArea",
                clazz: "blue"
            },
            discount: {
                field: "discount",
                name: "折扣",
                prop: function(v) {

                    return com.checkNull(v.discount, 10);
                },
                clazz: "blue"
            },
            precontractPrice: {
                field: "precontractPrice",
                type: "custom",
                render: function($liLine, v, $ulProperty) {

                    var $li = $('<li></li>').appendTo($ulProperty);
                    $('<strong></strong>').html("预签额: ").appendTo($li);
                    $('<b></b>').html(v.precontractPrice).addClass("blue").appendTo($li);

                    if (v.precontractPrice != 0) {
                        $('<i class="icon-info-sign blue" style="padding-left: 2px; cursor: pointer"></i>').appendTo($li).click(function() {

                            netPerformancep($(this), v);
                        });
                    }
                }
            },
            orderTotalPrice: {
                field: "orderTotalPrice",
                type: "custom",
                render: function($liLine, v, $ulProperty) {

                    var $li = $('<li></li>').appendTo($ulProperty);
                    $('<strong></strong>').html("签单额: ").appendTo($li);
                    $('<b></b>').html(v.orderTotalPrice).addClass("blue").appendTo($li);

                    if ([constant.decoration().decoration.STATUS_SIGNED_INT, constant.decoration().decoration.STATUS_RESIGNED_INT, constant.decoration().decoration.STATUS_TERMINATION_INT, constant.decoration().decoration.STATUS_FINAL_INT].contains(v.status)) {
                        $('<i class="icon-info-sign blue" style="padding-left: 2px; cursor: pointer"></i>').appendTo($li).click(function() {

                            netPerformanceo($(this), v);
                        });
                    }
                }
            },
            quotationPrice: {
                field: "quotationPrice",
                type: "custom",
                render: function($liLine, v, $ulProperty) {

                    var $li = $('<li></li>').appendTo($ulProperty);
                    var $text = $('<strong>报价额: </strong>').appendTo($li);
                    $('<b></b>').html(v.quotationPrice).addClass("blue").appendTo($li);
                    $('<i class="icon-info-sign blue" style="padding-left: 2px; cursor: pointer"></i>').appendTo($li).click(function() {

                        com.post(api.quotation.queryQuotationForDefaultByOrderId, {
                            "quotation.orderId": v.orderId
                        }, function(res) {

                            var quotation = res.quotation;

                            beforeTotal = utils.accAdd(utils.accAdd(utils.accAdd(utils.accAdd(quotation.disPrice, quotation.undisPrice), quotation.trafficPrice), quotation.managePrice), quotation.taxPrice);

                            com.showTip($text, "折前总价:" + utils.changeThrDecimal(beforeTotal));
                        });
                    });
                }
            },
            couponCut: {
                field: "couponCut",
                type: "custom",
                render: function($liLine, v, $ulProperty) {

                    var $li = $('<li></li>').appendTo($ulProperty);
                    $('<strong></strong>').html("券优惠: ").appendTo($li);
                    $('<b></b>').html(v.couponCut).addClass("blue").appendTo($li);
                    $('<i class="icon-info-sign blue" style="padding-left: 2px; cursor: pointer"></i>').appendTo($li).click(function() {

                        couponCut($(this), v.orderId);
                    });
                }
            },
            factPrice: {
                field: "factPrice",
                name: "实收额",
                prop: "factPrice",
                clazz: "blue"
            },
            createTime: {
                field: "createTime",
                name: "创建时间",
                prop: "createTime",
                clazz: "green"
            },
            issueTime: {
                field: "issueTime",
                name: "派尺时间",
                prop: "issueTime",
                clazz: "green"
            },
            meetTime: {
                field: "meetTime",
                name: "到店时间",
                prop: "meetTime",
                clazz: "green"
            },
            measureTime: {
                field: "measureTime",
                name: "量房时间",
                prop: "measureTime",
                clazz: "green"
            },
            belongTime: {
                field: "belongTime",
                name: "变更时间",
                prop: "belongTime",
                clazz: "green"
            },
            depositTime: {
                field: "depositTime",
                name: "定金时间",
                prop: "depositTime",
                clazz: "green"
            },
            precontractTime: {
                field: "precontractTime",
                name: "预签时间",
                prop: "precontractTime",
                clazz: "green"
            },
            contractTime: {
                field: "contractTime",
                name: "签单时间",
                prop: "contractTime",
                clazz: "green"
            },
            recontractTime: {
                field: "recontractTime",
                name: "重签时间",
                prop: "recontractTime",
                clazz: "green"
            },
            accountTime: {
                field: "accountTime",
                name: "决算时间",
                prop: "accountTime",
                clazz: "green"
            },
            balanceTime: {
                field: "balanceTime",
                name: "内决时间",
                prop: "balanceTime",
                clazz: "green"
            },
            terminalTime: {
                field: "terminalTime",
                name: "终止时间",
                prop: "terminalTime",
                clazz: "green"
            },
            sdesignTime: {
                field: "sdesignTime",
                name: "确认合同方案时间",
                prop: "sdesignTime",
                clazz: "green"
            },
            edesignTime: {
                field: "edesignTime",
                name: "确认放线方案时间",
                prop: "edesignTime",
                clazz: "green"
            },
            decorationType: {
                field: "decorationType",
                name: "类型",
                prop: function(v) {

                    return order.typeness[v.typeness];
                },
                clazz: "red"
            },
            decorationStatus: {
                field: "decorationStatus",
                type: "custom",
                render: function($liLine, v, $ulProperty) {

                    var $li = $('<li></li>').appendTo($ulProperty);
                    $('<strong></strong>').html("状态: ").appendTo($li);
                    $('<b></b>').html(order.decorationStatus[v.status]).addClass("red").appendTo($li);
                    $('<i class="icon-question-sign blue" style="padding-left: 2px; cursor: pointer"></i>').appendTo($li).click(function() {

                        tools.communion.assistance("decoration_status_information");
                    });
                }
            },
            sourceStatus: {
                field: "sourceStatus",
                type: "custom",
                render: function($liLine, v, $ulProperty) {

                    var $li = $('<li></li>').appendTo($ulProperty);
                    $('<strong></strong>').html("确认状态: ").appendTo($li);
                    $('<b></b>').html(order.sourceStatus[v.sourceStatus]).addClass("red").appendTo($li);
                    $('<i class="icon-question-sign blue" style="padding-left: 2px; cursor: pointer"></i>').appendTo($li).click(function() {

                        tools.communion.assistance("decoration_source_status_informa");
                    });
                }
            },
            projectStatus: {
                field: "projectStatus",
                type: "custom",
                render: function($liLine, v, $ulProperty) {

                    var $li = $('<li></li>').appendTo($ulProperty);
                    $('<strong></strong>').html("工程状态: ").appendTo($li);
                    $('<b></b>').html(order.projectStatusArr[v.projectStatus]).addClass("red").appendTo($li);
                    $('<i class="icon-info-sign blue" style="padding-left: 2px; cursor: pointer"></i>').appendTo($li).click(function() {

                        projectInfo($(this), v.orderId);
                    });
                }
            },
            repairStatus: {
                field: "repairStatus",
                name: "保修状态",
                prop: function(v) {

                    return order.repairStatus[v.repairStatus];
                },
                clazz: "red"
            },
            designStatus: {
                field: "designStatus",
                type: "custom",
                render: function($liLine, v, $ulProperty) {

                    var $li = $('<li></li>').appendTo($ulProperty);
                    $('<strong></strong>').html("设计状态: ").appendTo($li);
                    $('<b></b>').html(order.designStatusArr[v.designStatus]).addClass("red").appendTo($li);
                    $('<i class="icon-question-sign blue" style="padding-left: 2px; cursor: pointer"></i>').appendTo($li).click(function() {

                        tools.communion.assistance("decoration_design_status_informa");
                    });
                }
            },
            balanceStatus: {
                field: "balanceStatus",
                name: "内决状态",
                prop: function(v) {

                    return order.balanceStatus[v.balanceStatus];
                },
                clazz: "red"
            },
            saleScale: {
                field: "saleScale",
                type: "custom",
                show: function(v) {

                    return v.saleScale != 1918;
                },
                render: function($liLine, v, $ulProperty) {

                    var $li = $('<li></li>').appendTo($ulProperty);
                    $('<strong></strong>').html("销售比例: ").appendTo($li);
                    $('<b></b>').html(v.saleScale).addClass("blue").appendTo($li);
                    $('<i class="icon-circle-arrow-down icon-rotate-180 blue" style="padding-left: 2px; cursor: pointer"></i>').appendTo($li).click(function() {

                        com.showConfirm("确定更新销售配比吗", function() {

                            var options = {
                                "decoration.orderId": v.orderId
                            };

                            com.post(api.decoration.updateDecorationForSaleScale, options, function() {

                                com.showAlert(com.info, "操作成功");
                            }, null, false);
                        });
                    });
                }
            },
            payScale: {
                field: "payScale",
                type: "custom",
                render: function($liLine, v, $ulProperty) {

                    var $li = $('<li></li>').appendTo($ulProperty);
                    $('<strong></strong>').html("付款比例: ").appendTo($li);
                    $('<b></b>').html(v.paySacle).addClass("blue").appendTo($li);
                    $('<i class="icon-circle-arrow-down icon-rotate-180 blue" style="padding-left: 2px; cursor: pointer"></i>').appendTo($li).click(function() {

                        com.showConfirm("确定更新付款配比吗", function() {

                            var options = {
                                "decoration.orderId": v.orderId
                            };

                            com.post(api.decoration.updateDecorationForPayScale, options, function() {

                                com.showAlert(com.info, "操作成功");
                            }, null, false);
                        });
                    });
                }
            },
            houseClass: {
                field: "houseClass",
                name: "房屋类型",
                prop: "houseClass",
                clazz: "red"
            },
            houseType: {
                field: "houseType",
                name: "房屋类别",
                prop: "houseType",
                clazz: "red"
            }
        };

        // pageConfig.propertyArr 配置中, sdesignTime 会同时产出两个字段(合同方案时间 + 放线方案时间)
        var props = [];
        $.each(pageConfig.propertyArr, function(i, key) {

            if (key == "sdesignTime") {
                propertyMap["sdesignTime"] && props.push(propertyMap["sdesignTime"]);
                propertyMap["edesignTime"] && props.push(propertyMap["edesignTime"]);
                return true;
            }
            propertyMap[key] && props.push(propertyMap[key]);
        });

        return props;
    })();

    var linebtns = (function() {

        return {
            view: {
                name: "查看",
                clazz: "btn-yellow",
                show: function(v) {

                    return pageConfig.pageBtn.contains("view");
                },
                handle: function(v) {

                    viewDecorationDetail(v);
                }
            },
            prosign: {
                name: "预签单",
                clazz: "btn-pink",
                show: function(v) {

                    return pageConfig.pageBtn.contains("prosign") && [constant.decoration().decoration.STATUS_INIT_INT, constant.decoration().decoration.STATUS_DEPOSIT_INT].indexOf(v.status) != -1;
                },
                handle: function(v) {

                    params.quotation.orderId = v.orderId;
                    com.switchPage("views/quotation/protationIndex.html");
                }
            },
            pcontract: {
                name: "预签",
                clazz: "btn-danger",
                show: function(v) {

                    return pageConfig.pageBtn.contains("pcontract") && [constant.decoration().decoration.STATUS_INIT_INT, constant.decoration().decoration.STATUS_DEPOSIT_INT].indexOf(v.status) != -1;
                },
                handle: function(v) {

                    com.showConfirm("确定进行预签", function() {

                        var options = {
                            "decoration.orderId": v.orderId
                        };
                        com.post(api.decoration.presignDecorationContract, options, function() {

                            com.switchPage("/views/decoration/decoration.html");
                        }, null, false);
                    });
                }
            },
            revie: {
                name: "回访",
                clazz: "btn-success",
                show: function() {

                    return pageConfig.pageBtn.contains("revie");
                },
                handle: function(v) {

                    viewDecorationBackVisitIndex(v.orderId);
                }
            },
            proline: {
                name: "预放线",
                clazz: "btn-warning",
                show: function() {

                    return pageConfig.pageBtn.contains("proline");
                },
                handle: function(v) {

                    pretreat(v);
                }
            },
            line: {
                name: "放线",
                clazz: "btn-warning",
                show: function() {

                    return pageConfig.pageBtn.contains("line");
                },
                handle: function(v) {

                    modalDrawLineModal(v);
                }
            },
            contract: {
                name: "合同",
                clazz: "btn-inverse",
                show: function(v) {

                    return pageConfig.pageBtn.contains("contract") && [constant.decoration().decoration.STATUS_INIT_INT, constant.decoration().decoration.STATUS_DEPOSIT_INT, constant.decoration().decoration.STATUS_PROSIGN_INT, constant.decoration().decoration.STATUS_SIGNED_INT, constant.decoration().decoration.STATUS_RESIGNED_INT, constant.decoration().decoration.STATUS_FINAL_INT, constant.decoration().decoration.STATUS_COMPLETED_INT].indexOf(v.status % 10) != -1;
                },
                handle: function(v) {

                    modalAgreementModal(v.orderId, v.customer.cid, v, "advance");
                }
            },
            contractc: {
                name: "合同",
                clazz: "btn-inverse",
                show: function(v) {

                    return pageConfig.pageBtn.contains("contractc") && [constant.decoration().decoration.STATUS_INIT_INT, constant.decoration().decoration.STATUS_DEPOSIT_INT, constant.decoration().decoration.STATUS_PROSIGN_INT, constant.decoration().decoration.STATUS_SIGNED_INT, constant.decoration().decoration.STATUS_RESIGNED_INT, constant.decoration().decoration.STATUS_FINAL_INT, constant.decoration().decoration.STATUS_COMPLETED_INT].indexOf(v.status % 10) != -1;
                },
                handle: function(v) {

                    modalAgreementModal(v.orderId, v.customer.cid, v, "design");
                }
            },
            scal: {
                name: "扣款",
                clazz: "btn-success",
                show: function() {

                    return pageConfig.pageBtn.contains("scal");
                },
                handle: function(v) {

                    viewDecorationInAudit(v.orderId);
                }
            },
            price: {
                name: "报价单",
                clazz: "btn-pink",
                show: function(v) {

                    return pageConfig.pageBtn.contains("price") && [constant.decoration().decoration.STATUS_INIT_INT, constant.decoration().decoration.STATUS_DEPOSIT_INT, constant.decoration().decoration.STATUS_PROSIGN_INT, constant.decoration().decoration.STATUS_RESIGNED_INT].indexOf(v.status) != -1;
                },
                handle: function(v) {

                    viewDecorationQuotateIndex(v.orderId, v.type, v.typeness);
                }
            },
            extension: {
                name: "扩展项",
                clazz: "btn-pink",
                show: function(v) {

                    return pageConfig.pageBtn.contains("extension") && [constant.decoration().decoration.STATUS_INIT_INT, constant.decoration().decoration.STATUS_DEPOSIT_INT, constant.decoration().decoration.STATUS_PROSIGN_INT, constant.decoration().decoration.STATUS_SIGNED_INT, constant.decoration().decoration.STATUS_RESIGNED_INT, constant.decoration().decoration.STATUS_COMPLETED_INT].indexOf(v.status) != -1;
                },
                handle: function(v) {

                    viewExtension(v.orderId);
                }
            },
            normPart: {
                name: "定额单",
                clazz: "btn-pink",
                show: function() {

                    return pageConfig.pageBtn.contains("normPart");
                },
                handle: function(v) {

                    viewNormPart(v.orderId);
                }
            },
            selection: {
                name: "选材项",
                clazz: "btn-pink",
                show: function() {

                    return pageConfig.pageBtn.contains("selection");
                },
                handle: function(v) {

                    viewSelection(v.orderId);
                }
            },
            btnAddReduce: {
                name: "增减项",
                clazz: "btn-pink",
                show: function(v) {

                    return pageConfig.pageBtn.contains("btnAddReduce") && [constant.decoration().decoration.STATUS_SIGNED_INT, constant.decoration().decoration.STATUS_FINAL_INT, constant.decoration().decoration.STATUS_COMPLETED_INT].indexOf(v.status) != -1;
                },
                handle: function(v) {

                    viewDecorationInDecreaseIndex(v.orderId, v.type, v.typeness, null);
                }
            },
            btnAddReduceD: {
                name: "增减项",
                clazz: "btn-pink",
                show: function(v) {

                    return pageConfig.pageBtn.contains("btnAddReduceD") && [constant.decoration().decoration.STATUS_SIGNED_INT, constant.decoration().decoration.STATUS_FINAL_INT, constant.decoration().decoration.STATUS_COMPLETED_INT].indexOf(v.status) != -1;
                },
                handle: function(v) {

                    viewDecorationInDecreaseIndex(v.orderId, v.type, v.typeness, 1);
                }
            },
            btnAddReduceM: {
                name: "增减项",
                clazz: "btn-pink",
                show: function(v) {

                    return pageConfig.pageBtn.contains("btnAddReduceM") && [constant.decoration().decoration.STATUS_SIGNED_INT, constant.decoration().decoration.STATUS_FINAL_INT, constant.decoration().decoration.STATUS_COMPLETED_INT].indexOf(v.status) != -1;
                },
                handle: function(v) {

                    viewDecorationInDecreaseIndex(v.orderId, v.type, v.typeness, 2);
                }
            },
            consche: {
                name: "工程单",
                clazz: "btn-pink",
                show: function(v) {

                    return pageConfig.pageBtn.contains("consche") && [constant.decoration().decoration.STATUS_INIT_INT, constant.decoration().decoration.STATUS_DEPOSIT_INT, constant.decoration().decoration.STATUS_PROSIGN_INT, constant.decoration().decoration.STATUS_SIGNED_INT, constant.decoration().decoration.STATUS_RESIGNED_INT, constant.decoration().decoration.STATUS_COMPLETED_INT].indexOf(v.status) != -1;
                },
                handle: function(v) {

                    viewConschePart(v.orderId);
                }
            },
            info: {
                name: "详情",
                clazz: "btn-success",
                show: function() {

                    return pageConfig.pageBtn.contains("info");
                },
                handle: function(v) {

                    viewDecorationTimelineIndex(v.orderId);
                }
            },
            cal: {
                name: "决算",
                clazz: "btn-danger",
                show: function(v) {

                    return pageConfig.pageBtn.contains("cal") && [constant.decoration().decoration.STATUS_SIGNED_INT, constant.decoration().decoration.STATUS_FINAL_INT, constant.decoration().decoration.STATUS_COMPLETED_INT].indexOf(v.status) != -1;
                },
                handle: function(v) {

                    viewDecorationFinalSettlement(v.orderId, v.typeness, v.status);
                }
            },
            profile: {
                name: "画像",
                clazz: "btn-success",
                show: function() {

                    return pageConfig.pageBtn.contains("profile");
                },
                handle: function(v) {

                    viewDecorationProfile(v.orderId);
                }
            },
            services: {
                name: "服务",
                clazz: "btn-success",
                show: function() {

                    return pageConfig.pageBtn.contains("services");
                },
                handle: function(v) {

                    viewDecorationService(v.orderId);
                }
            },
            refer: {
                name: "推荐",
                clazz: "btn-success",
                show: function() {

                    return pageConfig.pageBtn.contains("refer");
                },
                handle: function(v) {

                    viewDecorationRefer(v.orderId);
                }
            },
            activity: {
                name: "装修活动",
                clazz: "btn-inverse",
                show: function() {

                    return pageConfig.pageBtn.contains("activity");
                },
                handle: function(v) {

                    viewDecorationActivity(v.orderId);
                }
            },
            sctivity: {
                name: "销售活动",
                clazz: "btn-inverse",
                show: function() {

                    return pageConfig.pageBtn.contains("sctivity");
                },
                handle: function(v) {

                    viewSalesActivity(v.orderId);
                }
            },
            'delete': {
                name: "废单",
                clazz: "btn-danger",
                show: function(v) {

                    return pageConfig.pageBtn.contains("delete") && v.status != constant.decoration().decoration.STATUS_SIGNED_INT && v.status != constant.decoration().decoration.STATUS_WASTE_INT && v.status != constant.decoration().decoration.STATUS_TERMINATION_INT;
                },
                handle: function(v) {

                    obsoleteOrder(v.orderId);
                }
            },
            sign: {
                name: "签约",
                clazz: "btn-danger",
                show: function(v) {

                    return pageConfig.pageBtn.contains("sign") && [constant.decoration().decoration.STATUS_DEPOSIT_INT, constant.decoration().decoration.STATUS_PROSIGN_INT, constant.decoration().decoration.STATUS_RESIGNED_INT].indexOf(v.status) != -1;
                },
                handle: function(v) {

                    signOrder(v.orderId, v.customer.cid, v.orderTotalPrice, v.notSalesmanRate, v.couponCut, v.thingCut);
                }
            },
            terminal: {
                name: "终止",
                clazz: "btn-danger",
                show: function(v) {

                    return pageConfig.pageBtn.contains("terminal") && [constant.decoration().decoration.STATUS_PROSIGN_INT, constant.decoration().decoration.STATUS_SIGNED_INT].indexOf(v.status) != -1;
                },
                handle: function(v) {

                    aerminalOrder(v.orderId, v.status, v.precontractPrice);
                    approvalUtils.initqueryApprovalUser("approveTerminalManSel", 19);
                }
            },
            terminal1: {
                name: "终止",
                clazz: "btn-danger",
                show: function(v) {

                    return pageConfig.pageBtn.contains("terminal1") && [constant.decoration().decoration.STATUS_PROSIGNTERMINABLE_INT, constant.decoration().decoration.STATUS_SIGNEDTERMINABLE_INT].indexOf(v.status) != -1;
                },
                handle: function(v) {

                    terminalOrder(v.orderId, v.status, v.precontractPrice);
                }
            },
            resign: {
                name: "重签",
                clazz: "btn-danger",
                show: function(v) {

                    return pageConfig.pageBtn.contains("resign") && v.status == constant.decoration().decoration.STATUS_SIGNED_INT;
                },
                handle: function(v) {

                    resignOrder(v.orderId);
                }
            },
            balance: {
                name: "内决",
                clazz: "btn-danger",
                show: function() {

                    return pageConfig.pageBtn.contains("balance");
                },
                handle: function(v) {

                    balanceOrder(v.orderId);
                }
            },
            repair: {
                name: "保修",
                clazz: "btn-danger",
                show: function() {

                    return pageConfig.pageBtn.contains("repair");
                },
                handle: function(v) {

                    repairOrder(v.orderId);
                }
            },
            terminalStatus: {
                name: "工程终止",
                clazz: "btn-danger",
                show: function() {

                    return pageConfig.pageBtn.contains("terminalStatus");
                },
                handle: function(v) {

                    terminalStatus(v.orderId);
                }
            },
            hidden: {
                name: "隐藏",
                clazz: "btn-info",
                show: function() {

                    return pageConfig.pageBtn.contains("hidden");
                },
                handle: function(v) {

                    hiddenOrder(v.orderId);
                }
            }
        };
    })();

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

    // 工程
    var viewConschePart = function(orderId) {

        params.construction.orderId = orderId;
        params.urlLoadParams.type = "views"

        com.popup4page("#layerPopUp", "/views/construction/supervision4detail.html?type=views", "查看");
        // com.switchPage(api.index.normPart.url);
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

        com.switchPage(api.index.decorationBackVisitIndex.url);
        // com.popup4page("#layerPopUp", api.index.decorationBackVisitIndex.url, "装修单回访: " + orderId);
    };

    function initPlan() {

        if (order.calendarFlag)
            return false;

        com.focusPage('#drawlineCalendar').fullCalendar('destroy');
        com.focusPage('#drawlineCalendar').fullCalendar('today');

        order.calendar = com.focusPage('#drawlineCalendar').fullCalendar($.extend(com.calendardefault, {
            dayClick: function() {

                return false;
            },
            select: function(start, end, allDay) {

                var time = $.fullCalendar.formatDate(start, "yyyy-MM-dd").toString();
                var end = utils.workDays(time, (order.infoItems.timeLimit.val() ? order.infoItems.timeLimit.val() : 2));

                order.infoItems.drawlineTime.val(time);
                order.infoItems.finishTime.val(end);

                return false;
            },
            eventClick: function(calEvent, jsEvent, view) {

                var time = $.fullCalendar.formatDate(calEvent.start, "yyyy-MM-dd").toString();
                var end = utils.workDays(time, (order.infoItems.timeLimit.val() ? order.infoItems.timeLimit.val() : 2));

                order.infoItems.drawlineTime.val(time);
                order.infoItems.finishTime.val(end);

                return false;
            },
            eventRender: function(event, element) {

                element.off('click');
            },
            viewRender: function(view, element) {

            },
            events: function(start, end, callback) {

                var dates = {}
                var startDate = new Date(start);
                var endDate = new Date(end);

                var currentDate = startDate;

                while (currentDate <= end) {
                    dates[com.dateFormat(currentDate, "yyyyMMdd")] = 0;
                    currentDate.setDate(currentDate.getDate() + 1);
                }

                var startTime = com.dateFormat(new Date(start));
                var endTime = com.dateFormat(new Date(end));

                var options = {
                    "constructionInfo.startTime": startTime,
                    "constructionInfo.endTime": endTime
                };

                com.post(api.construction.countConstructionInfo, options, function(res) {

                    var counts = res.count;
                    var events = [];

                    for ( var i in counts) {

                        var _ = counts[i];
                        var _date = _[0] + "";

                        if (!isNaN(dates[_date])) {
                            dates[_date] += _[1];
                        }

                        var event = {
                            title: "剩余" + (20 - _[1] > 0 ? 20 - _[1] : 0) + "户",
                            start: new Date(_date.substr(0, 4), _date.substr(4, 2) - 1, _date.substr(6, 2)),
                            end: new Date(_date.substr(0, 4), _date.substr(4, 2) - 1, _date.substr(6, 2)),

                            allDay: true
                        };

                    }

                }, null, false);

                var events = [];

                $.each(dates, function(i, v) {

                    var event = {
                        title: "剩余" + (20 - v > 0 ? 20 - v : 0) + "户",
                        start: new Date(i.substr(0, 4), i.substr(4, 2) - 1, i.substr(6, 2)),
                        allDay: true
                    };

                    events.push(event);
                });

                callback(events);

                order.calendarFlag = true;
            }
        }));
    }
    // 放线
    function initDrawlineSchedule() {

        com.focusPage('#drawlineScheduleCalendar').fullCalendar('destroy');
        com.focusPage('#drawlineScheduleCalendar').fullCalendar('today');

        com.focusPage('#drawlineScheduleCalendar').fullCalendar($.extend(com.calendardefault, {
            dayClick: function() {

                return false;
            },
            eventClick: function() {

                return false;
            },
            eventRender: function(event, element) {

                element.off('click');
            },
            events: function(start, end, callback) {

                var dates = {};
                var startDate = new Date(start);
                var endDate = new Date(end);

                var currentDate = startDate;

                while (currentDate <= end) {
                    dates[com.dateFormat(currentDate, "yyyyMMdd")] = 0;
                    currentDate.setDate(currentDate.getDate() + 1);
                }

                var startTime = com.dateFormat(new Date(start));
                var endTime = com.dateFormat(new Date(end));

                // 放线排期展示的是 constructionInfo.actuaTime 维度的排期容量(每天20户),
                // countDrawLine 按 drawline.actualTime 统计的是已放线数据, 与排期日历语义不符.
                var options = {
                    "constructionInfo.startTime": startTime,
                    "constructionInfo.endTime": endTime
                };

                com.post(api.construction.countConstructionInfo, options, function(res) {

                    var counts = res.count;

                    for ( var i in counts) {

                        var _ = counts[i];
                        var _date = _[0] + "";

                        if (!isNaN(dates[_date])) {
                            dates[_date] += _[1];
                        }
                    }

                    var events = [];

                    $.each(dates, function(i, v) {

                        var event = {
                            title: "剩余" + (20 - v > 0 ? 20 - v : 0) + "户",
                            start: new Date(i.substr(0, 4), i.substr(4, 2) - 1, i.substr(6, 2)),
                            allDay: true
                        };

                        events.push(event);
                    });

                    callback(events);
                });
            }
        }));
    }

    var modalDrawLineModal = function(v) {

        var designPeriod = 0;
        var constructionPeriod = 0;

        com.post(api.data.queryConstructionPace, {
            "constructionPace.lowerArea": v.house.innerArea
        }, function(res) {

            designPeriod = res.constructionPace.designPeriod;
            constructionPeriod = res.constructionPace.period;
        }, null, false);

        order.infoItems.drawlineTime.on('blur', function() {

            setTimeout(function() {

                var finishTime = order.infoItems.drawlineTime.val();

                if (finishTime)
                    finishTime = utils.workDays(finishTime, constructionPeriod);

                order.infoItems.finishTime.val(finishTime);

            }, 200);
        });

        order.infoItems.timeLimit.on('blur', function() {

            setTimeout(function() {

                var drawlineTimeValue = order.infoItems.drawlineTime.val();
                var timeLimitValue = parseInt(order.infoItems.timeLimit.val()) || 0;

                if (drawlineTimeValue && timeLimitValue > 0) {
                    var newFinishTime = utils.workDays(drawlineTimeValue, timeLimitValue);
                    order.infoItems.finishTime.val(newFinishTime);
                }

            }, 200);
        });

        order.infoItems.designPeriod.on('blur', function() {

            setTimeout(function() {

                var designPeriodValue = parseInt(order.infoItems.designPeriod.val()) || 0;
                var baseTime = null;

                if (decoration.precontractTime) {
                    baseTime = decoration.precontractTime;
                } else if (decoration.contractTime) {
                    baseTime = decoration.contractTime;
                }

                if (baseTime && designPeriodValue > 0) {
                    var newDesignTime = utils.workDays(baseTime, designPeriodValue);
                    order.infoItems.designTime.val(newDesignTime);
                }

            }, 200);
        });

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

            var designTime = null;

            if (datas.initDesignTime) {
                designTime = datas.initDesignTime;
            } else if (decoration.precontractTime) {
                designTime = utils.workDays(decoration.precontractTime, (datas.designPeriod && datas.designPeriod > 0 ? datas.designPeriod : designPeriod));
            } else if (decoration.contractTime) {
                designTime = utils.workDays(decoration.contractTime, (datas.designPeriod && datas.designPeriod > 0 ? datas.designPeriod : designPeriod));
            }

            var finishTime = null;

            if (datas.drawlineTime && !datas.finishTime) {
                finishTime = utils.workDays(datas.drawlineTime, (constructionPeriod ? constructionPeriod : 0));
            }

            if (datas.timeLimit) {
                constructionPeriod = datas.timeLimit;
            }

            if (datas.designPeriod && datas.designPeriod > 0) {
                designPeriod = datas.designPeriod;
            }

            if (datas.initDesignTime) {
                designTime = datas.initDesignTime;
            }

            if (datas.finishTime) {
                finishTime = datas.finishTime;
            }

            order.infoItems.dlmConpany.val(0);
            order.infoItems.quoteArea.val(decoration.house.innerArea);
            order.infoItems.timeLimit.val(constructionPeriod);
            order.infoItems.designPeriod.val(datas.designPeriod && datas.designPeriod > 0 ? datas.designPeriod : designPeriod);
            order.infoItems.ishovel.val(datas.ishovel);
            order.infoItems.iskey.val(datas.iskey);
            order.infoItems.isCeremony.val(datas.isCeremony);
            order.infoItems.finishTime.val(finishTime ? finishTime : "");
            order.infoItems.keyTime.val(datas.keyTime ? datas.keyTime.substr(0, 10) : "");
            order.infoItems.designTime.val(designTime ? designTime : "");
            order.infoItems.drawlineTime.val(datas.drawlineTime ? datas.drawlineTime.substr(0, 10) : "");
            order.infoItems.comment.val(datas.comment);
        });

        com.cleanItems(order.infoItems);

        com.focusPage("#dischargeLineOrderId").val(v.orderId);

        order.drawLineModal.modal("show");

        order.drawLineModal.on('shown.bs.modal', function(e) {

            initPlan();
        });
    };

    var pretreat = function(v) {

        com.cleanTypeahead("supervisor");

        params.decoration.orderId = v.orderId;

        order.constructionNodeModal.modal("show");
        order.nodeItems.constructionNodes.html("");

        var $uli = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');

        var constructionNodes = {};

        com.post(api.data.queryConstructionNode, {}, function(res) {

            constructionNodes = res.constructionNodes.sort(function(a, b) {

                return a.sort - b.sort;
            });
        }, null, false);

        $.each(constructionNodes, function(index, value) {

            var $liLi = $('<li></li>').addClass('item-blue clearfix');
            var $ulPro = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue'));
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons').css('padding-top', '6px');

            var propertyArr = [["工期: ", null, "grey"]];

            var $label = $('<label></label>').addClass('control-label').css({
                'color': 'grey',
                'font-size': '20px',
                "font-weight": "bold"
            });

            var _label = $('<label></label>');

            var $input = $('<input>').attr({
                "type": "checkbox",
                "name": "sorts",
                "sort": value.sort,
                "cnid": value.cnid,
            }).addClass('ace ace-checkbox-2');

            var $text = $('<input>').attr({
                "type": "text",
                "name": "timeLimits",
                "text_sort": value.sort,
                "value": value.timeLimit,
                "cnid": value.cnid,
            }).addClass('timeLimits ace ace-checkbox-2 v_required');

            var _span = $('<span></span>').addClass('lbl blue bigger-150').css('font-weight', 'normal').html(value.name);

            _label.append($input).append(_span).appendTo($label);

            $.each(propertyArr, function(index, value) {

                var $liProperty = $('<li></li>');
                $('<strong></strong>').attr('style', 'font-weight:normal;font-size:20px').html(value[0]).append($text).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2] ? value[2] : "").appendTo($liProperty);
                $liProperty.appendTo($divBtnWrap);

                $label.appendTo($h3);

                $divBtnWrap.appendTo($h3);

                $liLi.append($h3).append($ulPro);
            });

            $liLi.append($h3).append($ulPro).appendTo($uli);
        });

        $uli.appendTo(order.nodeItems.constructionNodes);

        var period = null;

        com.post(api.data.queryConstructionPeriod, {
            "constructionPeriod.lowerArea": v.house.innerArea
        }, function(res) {

            period = res.constructionPeriod;
        }, null, false);

        if (!period || !period.cpid)
            return false;

        com.post(api.data.queryConstructionPeriodNodeByCpid, {
            "constructionPeriodNode.cpid": period.cpid
        }, function(res) {

            $.each(res.constructionPeriodNodes, function(i, v) {

                com.focusPage("input.timeLimits[cnid='" + v.constructionNode.cnid + "']", "#constructionNodes").val(v.period);
            });
        });
    }

    // 合同
    var modalAgreementModal = function(orderId, cid, data, pagetype) {

        params.decoration.orderId = orderId;
        params.decoration.cid = cid;

        params.urlLoadParams.showtype = pagetype;

        params.historyPage = api.index.decorationIndex.url;

        com.switchPage(api.index.decorationContractIndex.url);
        // com.popup4page("#layerPopUp", api.index.decorationContractIndex.url, "装修单合同: " + orderId);
    };

    // 扩展项
    var viewExtension = function(orderId) {

        params.quotation.orderId = orderId;

        params.historyPage = api.index.decorationIndex.url;

        com.switchPage(api.index.extensionIndex.url);
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

        com.switchPage(api.index.decorationAuditRecordIndex.url);
        // com.popup4page("#layerPopUp", api.index.decorationAuditRecordIndex.url, "装修单扣款: " + orderId);
    };
    // 时间轴
    var viewDecorationTimelineIndex = function(orderId) {

        params.decoration.orderId = orderId;

        params.historyPage = api.index.decorationIndex.url;

        com.switchPage(api.index.decorationTimelineIndex.url);
        // com.popup4page("#layerPopUp", api.index.decorationTimelineIndex.url, "装修单进程: " + orderId);
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

    // 工程信息
    var projectInfo = function(btn, orderId) {

        com.post(api.construction.queryConstructionInfoByOrderId, {
            "constructionInfo.orderId": orderId
        }, function(res) {

            var constructionInfo = res.constructionInfo;
            var handoverStatusText = constant.construction().constructionInfo.handoverStatus.keys[constructionInfo.handoverStatus] || "-";

            com.showTip(btn, " 预计交钥匙时间:" + com.checkNull(constructionInfo.keyTime, "") + "<br\>预计放线时间:" + com.checkNull(constructionInfo.drawlineTime, "") + "<br\>预计完工时间:" + com.checkNull(constructionInfo.finishTime, "") + "<br\>预计设计完成时间:" + com.checkNull(constructionInfo.initDesignTime, "") + "<br\>交接状态:" + handoverStatusText);
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

        var couponCut = 0;
        var thingCut = 0;

        com.post(api.decoration.queryDecorationActivityItem, {
            "decoration.orderId": decoration.orderId
        }, function(res) {

            var decorationActivityItems = res.decorationActivityItems;

            for ( var i = 0; i < decorationActivityItems.length; i++) { // 0: 初始 , 1: 失效 , 2: 已领 , 3: 退货 , 4: 配送 , 5: 未退 , 6: 升级 , 7: 补款

                var item = decorationActivityItems[i];

                if ([constant.decoration().decorationActivityItem.STATUS_INIT_INT, constant.decoration().decorationActivityItem.STATUS_RECEIVE_INT, constant.decoration().decorationActivityItem.STATUS_DELIVERY_INT, constant.decoration().decorationActivityItem.STATUS_WAIT_INT, constant.decoration().decorationActivityItem.STATUS_UPGRADE_INT].indexOf(item.state) == -1)
                    continue;

                if (item.isPrefor != constant.decoration().decorationActivityItem.ISAFFIRM_INITIA_INT)
                    continue;

                if (item.type == 0) {// 0卷, 02456状态, 0计业绩
                    couponCut = utils.accAdd(couponCut, utils.accMul(item.money, item.num));
                } else if (item.type == 1) {// 1物品, 02456状态, 0计业绩
                    thingCut = utils.accAdd(thingCut, utils.accMul(item.money, item.num));
                }

            }
        }, null, false);

        var decorationActivity = {};

        com.post(api.decoration.queryDecorationActivityByOrderId, {
            "decorationActivity.orderId": decoration.orderId
        }, function(res) {

            decorationActivity = (res.decorationActivitys && res.decorationActivitys.length > 0) ? res.decorationActivitys[0] : {};
        }, null, false);

        if (decorationActivity && decorationActivity.activity && decorationActivity.activity.atttype == 1) {
            couponCut = utils.accAdd(couponCut, decoration.factPrice);
        }

        // 净业绩 = 签单额-非业务人员提点金额-优惠券-赠送礼品-线上活动签约额-非计入业绩
        var netPerformance = utils.accSub(utils.accSub(utils.accSub(decoration.orderTotalPrice, notpoint), couponCut), thingCut);

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

        // 获取装修活动数据
        var decorationActivity = {};

        com.post(api.decoration.queryDecorationActivityByOrderId, {
            "decorationActivity.orderId": decoration.orderId
        }, function(res) {

            decorationActivity = (res.decorationActivitys && res.decorationActivitys.length > 0) ? res.decorationActivitys[0] : {};
        }, null, false);

        var couponCut = 0;
        var thingCut = 0;

        if (decorationActivity && decorationActivity.activity && decorationActivity.activity.atttype == 1) {
            thingCut = decoration.factPrice / 100;
        }

        com.post(api.decoration.queryDecorationActivityItem, {
            "decoration.orderId": decoration.orderId
        }, function(res) {

            var decorationActivityItems = res.decorationActivityItems;

            for ( var i = 0; i < decorationActivityItems.length; i++) { // 0: 初始 , 1: 失效 , 2: 已领 , 3: 退货 , 4: 配送 , 5: 未退 , 6: 升级 , 7: 补款

                var item = decorationActivityItems[i];

                if ([constant.decoration().decorationActivityItem.STATUS_INIT_INT, constant.decoration().decorationActivityItem.STATUS_RECEIVE_INT, constant.decoration().decorationActivityItem.STATUS_DELIVERY_INT, constant.decoration().decorationActivityItem.STATUS_WAIT_INT, constant.decoration().decorationActivityItem.STATUS_UPGRADE_INT].indexOf(item.state) == -1)
                    continue;

                if (item.isPrefor != constant.decoration().decorationActivityItem.ISAFFIRM_INITIA_INT)
                    continue;

                if (item.type == 0) { // 0卷, 02456状态, 0计业绩
                    couponCut = utils.accAdd(couponCut, utils.accMul(item.money, item.num));
                } else if (item.type == 1) { // 1物品, 02456状态, 0计业绩
                    thingCut = utils.accAdd(thingCut, utils.accMul(item.money, item.num));
                }
            }
        }, null, false);

        // 净业绩 = 预签额 - 物品金额 - 非提金额
        var netPerformance = utils.accSub(utils.accSub(decoration.precontractPrice, thingCut), notpoint);

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

    // 画像
    function viewDecorationProfile(orderId) {

        params.customer.orderId = orderId;
        params.customer.profile = {
            "orderId": orderId
        }

        // com.switchPage(api.index.customerProfile4detailIndex.url);
        com.popup4page("#layerPopUp", api.index.customerProfile4detailIndex.url, "客户画像: ");
    }

    // 服务
    function viewDecorationService(orderId) {

        params.decoration.orderId = orderId;

        params.historyPage = api.index.decorationIndex.url;

        // com.switchPage(api.index.decorationServiceIndex.url);
        com.popup4page("#layerPopUp", api.index.decorationServiceIndex.url, "装修单服务: " + orderId);
    }

    // 推荐
    function viewDecorationRefer(orderId) {

        // params.decoration.orderId = orderId;
        // params.historyPage = api.index.decorationIndex.url;
        // com.switchPage(api.index.decorationServiceIndex.url);

        params.decoration.orderId = orderId;

        com.popup4page("#layerPopUp", api.index.decorationReferIndex.url, "装修推荐: " + orderId);
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
        }

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

    // 隐藏/显示
    function hiddenOrder(orderId) {

        params.decoration.orderId = orderId;

        com.showConfirm("确认要切换隐藏/显示状态吗?", function() {

            com.post(api.decoration.hiddenDecoration, {
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

    // 合同终止审批
    function aerminalOrder(orderId, status, precontractPrice, rowId) {

        params.decoration.orderId = orderId;

        // 第一步：查询装饰订单完整信息
        com.post(api.decoration.queryDecorationForCommonByOrderId, {
            "decoration.orderId": orderId
        }, function(res) {

            var decoration = res.decoration;

            if (!decoration) {
                com.showAlert(com.error, "装修单不存在");
                return false;
            }

            // 赋值基本信息到 span 字段
            com.focusPage("#refundOrderNo").text(decoration.orderId || "");

            // 楼盘地址
            var buildingAddress = "";
            if (decoration.house && decoration.house.village) {
                buildingAddress = decoration.house.village.name;
                if (decoration.house.houseNumber) {
                    buildingAddress += " " + decoration.house.houseNumber;
                }
            }
            com.focusPage("#refundBuildingAddress").text(buildingAddress);

            // 签单日期（根据状态判断）
            var signDate = "";
            if (decoration.status == constant.decoration().decoration.STATUS_PROSIGN_INT) {
                signDate = decoration.precontractTime;
            } else if (decoration.contractTime) {
                signDate = decoration.contractTime;
            }
            com.focusPage("#refundSignDate").text(signDate);

            // 预签时间
            var preSignTime = decoration.precontractTime;
            com.focusPage("#refundPreSignTime").text(preSignTime);

            // 预签额
            com.focusPage("#refundPreSignAmount").text(decoration.precontractPrice || "");

            // 签单额
            com.focusPage("#refundSignAmount").text(decoration.orderTotalPrice || "");

            // 实收额
            com.focusPage("#refundReceivedAmount").text(decoration.factPrice || "");

            // 订单类型
            var orderType = "";
            if (decoration.typeness !== undefined && constant.decoration().decoration.typeness.keys) {
                orderType = constant.decoration().decoration.typeness.keys[decoration.typeness] || "";
            }
            com.focusPage("#refundOrderType").text(orderType);

            // 订单状态
            var orderStatus = "";
            if (decoration.status !== undefined && constant.decoration().decoration.status.keys) {
                orderStatus = constant.decoration().decoration.status.keys[decoration.status] || "";
            }
            com.focusPage("#refundOrderStatus").text(orderStatus);

            // 设计师
            var designerName = "";
            if (decoration.designer && decoration.designer.currentName) {
                designerName = decoration.designer.currentName;
            }
            com.focusPage("#refundDesigner").text(designerName);

            // 业务员
            var salesmanName = "";
            if (decoration.salesman && decoration.salesman.currentName) {
                salesmanName = decoration.salesman.currentName;
            }
            com.focusPage("#refundSalesman").text(salesmanName);

            // 监理姓名
            var supervisorName = "";
            if (decoration.supervisor && decoration.supervisor.currentName) {
                supervisorName = decoration.supervisor.currentName;
            }
            com.focusPage("#refundSupervisor").text(supervisorName);

            // 开户行银行、账号、持卡人（从客户信息中获取）
            var bankName = "";
            var bankAccount = "";
            var cardHolder = "";
            if (decoration.customer) {
                bankName = decoration.customer.bankName || "";
                bankAccount = decoration.customer.bankAccount || "";
                cardHolder = decoration.customer.name || "";
            }
            com.focusPage("#refundBankName").text(bankName);
            com.focusPage("#refundBankAccount").text(bankAccount);
            com.focusPage("#refundCardHolder").text(cardHolder);

            // 施工进度（如果有施工信息）
            var constructionProgress = "";
            if (decoration.construction && decoration.construction.progress) {
                constructionProgress = decoration.construction.progress;
            }
            com.focusPage("#refundConstructionProgress").text(constructionProgress);

            // 第二步：获取活动物品信息并填充到"已办理优惠明细"
            com.post(api.decoration.queryDecorationActivityItem, {
                "decoration.orderId": orderId
            }, function(res) {

                var discountDetail = "";
                var activityNames = ""; // 参加活动名称列表

                if (res.decorationActivityItems && res.decorationActivityItems.length > 0) {
                    // 拼接活动物品信息
                    $.each(res.decorationActivityItems, function(index, item) {

                        if (discountDetail != "") {
                            discountDetail += "；";
                        }
                        // 格式：物品名称 x 数量 (金额元)
                        discountDetail += item.activity.name;

                        // 收集活动名称
                        if (activityNames.indexOf(item.activity.name) === -1) {
                            if (activityNames != "")
                                activityNames += "、";
                            activityNames += item.activity.name;
                        }

                        if (item.num && item.num > 0) {
                            discountDetail += " x " + item.num;
                        }
                        if (item.money && item.money > 0) {
                            discountDetail += " (" + item.money + "元)";
                        }
                    });
                }

                // 填充到输入框
                com.focusPage("#refundDiscountDetail").val(discountDetail);

                // 填充参加活动
                com.focusPage("#refundActivity").text(activityNames);

            }, function(error) {

                // 即使获取失败也继续显示模态框
                console.log("获取活动物品信息失败", error);
                com.focusPage("#refundDiscountDetail").val("");
                com.focusPage("#refundActivity").text("");
            });

            // 第三步：显示模态框
            order.refundContractModal.modal("show");

        }, function(error) {

            com.showAlert(com.error, "查询订单信息失败: " + (error.errorMsg || ""));
            console.log("查询订单信息失败", error);
        });

    }

    // 合同终止（积分）
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

        com.post(api.decoration.pointDecorationActivityItem, { // 积分
            "decoration.orderId": orderId
        }, function(res) {

            var amount = res.amount;

            com.focusPage("#decorationActivityAmount").html("积分兑换金额: " + amount + "元");
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

            order.terminalContractModal.modal("show");
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

    function terminalStatus(orderId) {

        order.updateTerminalStatusModal.modal("show");

        com.focusPage("#updateTerminalStatusBtn").unbind('click').on("click", function() {

            if (com.validate('updateTerminalStatusModal')) {
                return false;
            }
            ;

            var queryOptions = {
                "construction.orderId": orderId
            };

            com.post(api.construction.queryConstructionByOrderId, queryOptions, function(res) {

                var options = {
                    "construction.cid": res.construction.cid,
                    "construction.terminalStatus": order.constructionItems.terminalStatus.val(),
                };

                com.post(api.construction.updateConstructionByCid, options, function(res) {

                    com.showAlert(com.info, "操作成功");
                    searcher.doSearch();

                    order.updateTerminalStatusModal.modal("hide");
                });

            });

        });
    }

    // 额外参数 控制装修-通用-设计/业务 状态 签约/决算
    var extraParam = {};
    var pageName = params['urlLoadParams'].depage;

    pageConfig.extraParam != null && $.each(pageConfig.extraParam, function(i, v) {

        extraParam["statusas[" + i + "]"] = v;
    });

    if (pageConfig.companyType != null) {
        extraParam["companyType"] = pageConfig.companyType[0];
    }

    var buttons = (function() {

        var btns = [];

        if (pageConfig.pageBtn.contains("create")) {
            btns.push(createToolButton("create", "icon-plus-sign", "创建", "btn-default"));
        }

        if (pageConfig.pageBtn.contains("createAdvance")) {
            btns.push(createToolButton("createAdvance", "icon-hdd", "多单", "btn-info"));
        }

        if (pageConfig.pageBtn.contains("createCountry")) {
            btns.push(createToolButton("createCountry", "icon-flag", "国补", "btn-warning"));
        }

        if (pageConfig.hasExport != "" && pageConfig.hasExport != null) {
            btns.push(createToolButton("import", "icon-download-alt", "导出", "btn-success"));
        }

        btns.push(createToolButton("drawlineSchedule", "icon-calendar", "放线排期", "btn-yellow"));

        return btns;
    })();

    var searcher = new Searcher();

    searcher.set("condList", "pagenation", "resultList", pageConfig.apiPage, extraParam, pageConfig.condArr, pageConfig.postDataName, null, false, buttons);

    searcher.line(function(v) {

        return v.orderId;
    }, lineprops, linebtns).render();

    function createToolButton(name, icon, text, clazz) {

        var $btn = $('<a></a>').addClass('btn btn-minier pull-left').addClass(clazz).attr('name', name).css("margin", "0px 3px");
        var $icon = $('<i></i>').addClass(icon + ' bigger-110').appendTo($btn);
        var $span = $('<span></span>').text(text).appendTo($btn);

        return $btn;
    }

    function openCreateOrder(title, options) {

        var urlLoadParams = $.extend({}, params.urlLoadParams);
        var createParams = $.extend({}, urlLoadParams);
        var restored = false;

        delete createParams.maketype;
        delete createParams.entrytype;

        $.extend(createParams, options);

        function restore() {

            if (restored)
                return;

            restored = true;
            params.urlLoadParams = urlLoadParams;
            searcher.doSearch();
        }

        com.popup4page("#layerPopUp", api.index.createOrderIndex.url, title, null, restore, function() {

            params.urlLoadParams = createParams;
        });
    }

    com.focusPage('a[name="create"]', '#pagenation').click(function() {

        openCreateOrder("创建装修单", {});
    });

    com.focusPage('a[name="createAdvance"]', '#pagenation').click(function() {

        openCreateOrder("创建多单", {
            "maketype": "advance"
        });
    });

    com.focusPage('a[name="createCountry"]', '#pagenation').click(function() {

        openCreateOrder("创建国补", {
            "entrytype": "country"
        });
    });

    com.focusPage('a[name="drawlineSchedule"]', '#pagenation').click(function() {

        order.drawlineScheduleModal.modal("show");
    });

    order.drawlineScheduleModal.on('shown.bs.modal', function(e) {

        initDrawlineSchedule();
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
                column: [["装修单号", "orderId"], ['楼盘', 'house.village.name'], ['楼号', 'house.houseNumber'], ['客户名', 'customer.name'], ['设计部', 'designer.dept.name'], ['设计师编号', 'designer.userId'], ['设计师', 'designer.currentName'], ['业务部', 'salesman.dept.name'], ['业务员编号', 'salesman.userId'], ['业务员', 'salesman.currentName'], ['建筑面积', 'house.buildArea'], ['计价面积', 'house.innerArea'], ['实收额', 'factPrice'], ['预签额', 'precontractPrice'], ['合同报价', 'orderTotalPrice'], ['量房时间', 'measureTime'], ['预签时间', 'precontractTime'], ['签单时间', 'contractTime'], ['状态', 'status'], ['工程状态', 'projectStatus'], ['订单类型', 'typeness'], ['业务类型', 'busitype'], ['房屋类型', 'houseType']],
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
