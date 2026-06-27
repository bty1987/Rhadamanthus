var materialSubOrderPostData = {};

jQuery(function($) {

    com.focusPage('#fl-statement').statement("主材子订单", "订单信息列表");

    var materialUrl = api.material.pageMaterialByUserId;
    var materialOrderPostData = "materialOrderPostData";
    if (params['urlLoadParams'].type == 'advance') {

        materialOrderPostData = "materialOrderPostDataAdvancePostData";
        materialUrl = api.material.pageMaterialForAdvance;
    }

    var material = {
        cancellBtn: null,
        modal: null,
        materialSubOrderItems: {},

        materialSubOrderPaymentTypeNameData: {
            "advance": "1",
            "deposit": "2",
            "full": "3",
            "fullRefund": "5"
        },

        materialSaleOrderTypeData: {
            "1": "标准",
            "2": "员工自购",
            "3": "老总关系"
        },
        materialSaleOrderStatusData: {
            "0": "初始",
            "2": "退货",
            "3": "预结",
            "4": "结算"
        },
        materialSaleOrderPaymentStatusData: {
            "0": "初始",
            "1": "预付款",
            "2": "定金",
            "3": "补款",
            "5": "补款退款"
        },
        materialSaleOrderDeliveryStatusData: {
            "0": "未送货",
            "1": "已送货"
        },
        materialSubOrderPaymentStatusData: {
            "1": "提交",
            "2": "已收",
            "3": "已确认",
            "4": "审批中"
        },
        total: 0,
        editFlag: false,
        repeatFlg: false,
    };

    material.cancelBtn = com.focusPage("#cancelBtn");

    material.materialSubOrderMoneyModal = com.focusPage("#materialSubOrderMoneyModal");
    material.approvalMaterialFullPaymentModal = com.focusPage("#approvalMaterialFullPaymentModal");

    material.materialSubOrderItems.realAdvancePayment = com.focusPage("#realAdvancePayment");
    material.materialSubOrderItems.advancePayment = com.focusPage("#advancePayment");
    material.materialSubOrderItems.realDepositPayment = com.focusPage("#realDepositPayment");
    material.materialSubOrderItems.depositPayment = com.focusPage("#depositPayment");
    material.materialSubOrderItems.fullPayment = com.focusPage("#fullPayment");
    material.materialSubOrderItems.realFullPayment = com.focusPage("#realFullPayment");
    material.materialSubOrderItems.couponValue = com.focusPage("#couponValue");
    material.materialSubOrderItems.couponType = com.focusPage("#couponType");
    material.materialSubOrderItems.total = com.focusPage("#total");
    material.materialSubOrderItems.maling = com.focusPage("#maling");
    material.materialSubOrderItems.malingValue = com.focusPage("#malingValue");
    material.materialSubOrderItems.coupon = com.focusPage("#coupon");

    material.materialSubOrderItems.depositPaymentBtn = com.focusPage("#depositPaymentBtn");
    material.materialSubOrderItems.depositCancelBtn = com.focusPage("#depositCancelBtn");
    material.materialSubOrderItems.depositRefundBtn = com.focusPage("#depositRefundBtn");
    material.materialSubOrderItems.fullPaymentBtn = com.focusPage("#fullPaymentBtn");
    material.materialSubOrderItems.fullCancelBtn = com.focusPage("#fullCancelBtn");
    material.materialSubOrderItems.fullRefundBtn = com.focusPage("#fullRefundBtn");
    material.materialSubOrderItems.couponBtn = com.focusPage("#couponBtn");
    material.materialSubOrderItems.couponCommitBtn = com.focusPage("#couponCommitBtn");
    material.materialSubOrderItems.couponRefundBtn = com.focusPage("#couponRefundBtn");
    material.materialSubOrderItems.couponCancelBtn = com.focusPage("#couponCancelBtn");
    material.materialSubOrderItems.malingBtn = com.focusPage("#malingBtn");
    material.materialSubOrderItems.malingCommitBtn = com.focusPage("#malingCommitBtn");
    material.materialSubOrderItems.malingCancelBtn = com.focusPage("#malingCancelBtn");

    material.materialSubOrderItems.depositPaymentInfo = com.focusPage("#depositPaymentInfo");
    material.materialSubOrderItems.fullPaymentInfo = com.focusPage("#fullPaymentInfo");
    material.materialSubOrderItems.couponInfo = com.focusPage("#couponInfo");
    material.materialSubOrderItems.malingInfo = com.focusPage("#malingInfo");

    materialSubOrderPostData["materialSubOrder.orderId"] = params.orderId;
    materialSubOrderPostData["materialSubOrder.customerId"] = params.customerId;
    materialSubOrderPostData["materialSubOrder.customerName"] = params.customerName;
    materialSubOrderPostData["materialSubOrder.designerId"] = params.designerId;
    materialSubOrderPostData["materialSubOrder.designerName"] = params.designerName;

    com.post(api.ds.material, {}, function(res) {

        material.couponType = res.coupons;
        material.materialStatus = res.materialStatus;

        com.focusPage("#couponType").bindData(material.couponType, 'key', 'value', false);
    }, null, false);

    // com.initTypeahead('approveManSel', api.system.queryApproveUserForNameByType, "user.userNamePinYin", {"approveUser.type" : 9}, "autoFillKeyValue", "key", "value",null);

    material.approveSaveBtn = com.focusPage("#approveSaveBtn").on("click", function() {

        var length = com.focusPage('#approveManSel').find('input:checked').length;

        if (length == 0) {
            com.showAlert(com.error, "请选择审批人!");
            return;
        }

        if (com.validate('approvalMaterialFullPaymentModal')) {
            return;
        }

        var options = {
            "approval.receiver.userId": com.focusPage('#approveManSel').find('input:checked').attr('userid'),
            "approval.comment": "",
            "approvalMaterialFullPayment.mid": materialSubOrderPostData["approvalMaterialFullPayemnt.msoId"],
            "approvalMaterialFullPayment.referMoney": materialSubOrderPostData["approvalMaterialFullPayment.referMoney"],
        };

        com.post(api.approval.submitApprovalForMaterialFullPayment, options);

        material.approvalMaterialFullPaymentModal.modal("hide");
        setTimeout(function() {

            searcher.doSearch();
        }, 400);

    });

    var lineprops = (function() {

        return [{
            field: "category",
            name: "品类",
            prop: "category",
            clazz: "grey"
        }, {
            field: "brand",
            name: "品牌",
            prop: "brand",
            clazz: "grey"
        }, {
            field: "type",
            name: "类型",
            prop: function(v) { return material.materialSaleOrderTypeData[v.type]; },
            clazz: "red"
        }, {
            field: "total",
            name: "总价",
            prop: "total",
            clazz: "blue"
        }, {
            field: "distotal",
            name: "折扣总价",
            prop: "distotal",
            clazz: "blue"
        }, {
            field: "depositPayment",
            name: "定金",
            prop: "depositPayment",
            clazz: "blue"
        }, {
            field: "fullPayment",
            name: "补款",
            prop: "fullPayment",
            clazz: "blue"
        }, {
            field: "maling",
            name: "抹零",
            prop: "maling",
            clazz: "blue"
        }, {
            field: "venderMaling",
            name: "厂商抹零",
            prop: "venderMaling",
            clazz: "blue"
        }, {
            field: "coupon",
            name: "券额",
            prop: "coupon",
            clazz: "blue"
        }, {
            field: "couponInfo",
            name: "券信息",
            prop: "couponInfo",
            clazz: "grey"
        }, {
            field: "status",
            name: "状态",
            prop: function(v) { return material.materialStatus[v.status]; },
            clazz: "red"
        }, {
            field: "comment",
            name: "备注",
            prop: "comment",
            clazz: "grey"
        }];
    })();

    var linebtns = (function() {

        var inMainStatus = function(v) { return [0, 1, 2, 3, 4, 5].indexOf(v.status) != -1; };

        return {
            add: {
                name: "添项",
                clazz: "btn-yellow",
                show: function(v) { return inMainStatus(v) && v.fullStatus == 0; },
                handle: function(v) {
                    viewMaterialSubOrderAddIndex(v);
                }
            },
            mend: {
                name: "补货",
                clazz: "btn-danger",
                show: function(v) { return inMainStatus(v) && v.fullStatus == 3; },
                handle: function(v) {
                    viewMaterialSubOrderMendIndex(v);
                }
            },
            sub: {
                name: "子项",
                clazz: "btn-success",
                handle: function(v) {
                    viewMaterialSubOrderDetailIndex(v);
                }
            },
            money: {
                name: "款项",
                clazz: "btn-warning",
                show: inMainStatus,
                handle: function(v) {
                    dialogMaterialSubOrderMoney(v);
                }
            },
            collect: {
                name: "收款",
                clazz: "btn-inverse",
                handle: function(v) {
                    viewMaterialSubOrderCollection(v.mid);
                }
            },
            refund: {
                name: "退货",
                clazz: "btn-pink",
                handle: function(v) {
                    viewMaterialSubOrderRefundIndex(v.mid);
                }
            },
            print: {
                name: "打印",
                clazz: "btn-purple",
                show: inMainStatus,
                handle: function(v) {
                    receiptMaterialSubOrder(v.mid);
                }
            },
            ati: {
                name: "活动",
                clazz: "btn-grey",
                show: inMainStatus,
                handle: function(v) {
                    viewMaterialActivityIndex(v);
                }
            }
        };
    })();

    var buttons = (function() {

        var $adda = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('name', 'back').css("margin", "0px 3px");
        var $addi = $('<i></i>').addClass('icon-mail-forward bigger-110').appendTo($adda);
        var $addspan = $('<span></span>').text('返回').appendTo($adda);

        return [$adda];
    })();

    var searcher = new Searcher();
    var orderId = params.orderId;

    searcher.set("condList", "pagenation", "resultList", materialUrl, {
        "material.orderId": orderId
    }, [], materialOrderPostData, null, false, buttons);
    searcher.line("no", lineprops, linebtns).render();

    com.focusPage('a[name="back"]', '#pagenation').click(function() {

        com.focusPage(".tooltip").remove();
        com.switchPage(api.index.decorationMaterialIndex.url);
    });

    function viewMaterialSubOrderAddIndex(v) {

        if (v.fullStatus == 4) {
            com.showAlert(com.warning, "补款提交正在审批中，不允许添项");
            return;
        }

        materialSubOrderPostData["materialSubOrder.msoId"] = v.mid;
        materialSubOrderPostData["materialSubOrder.materialBrand"] = v.brand;

        params.historyOrderPage = api.index.materialIndex.url;

        com.switchPage(api.index.materialAddIndex.url);
    }

    function viewMaterialSubOrderDetailIndex(v) {

        materialSubOrderPostData["materialSubOrder.msoId"] = v.mid;
        materialSubOrderPostData["materialSubOrder.msoNo"] = v.no;
        materialSubOrderPostData["materialSubOrder.depositStatus"] = v.depositStatus;
        materialSubOrderPostData["materialSubOrder.fullStatus"] = v.fullStatus;
        materialSubOrderPostData["materialSubOrder.customerId"] = v.customer.no;
        // materialSubOrderPostData["materialSubOrder.cid"] = v.customer.cid;
        materialSubOrderPostData["materialSubOrder.customerName"] = v.customer.name;
        materialSubOrderPostData["materialSubOrder.materialBrand"] = v.brand;
        materialSubOrderPostData["materialSubOrder.maling"] = v.maling;
        materialSubOrderPostData["materialSubOrder.venderMaling"] = v.venderMaling;

        materialSubOrderPostData["materialSubOrderItem.msoId"] = v.mid;

        com.switchPage(api.index.materialDetailIndex.url);
    }

    function dialogMaterialSubOrderMoney(v) {

        if (v.fullStatus == 4) {
            com.showAlert(com.msg, "补款正在审批");
            return;
        }

        materialSubOrderPostData["materialSubOrder.msoId"] = v.mid;
        materialSubOrderPostData["materialSubOrder.orderId"] = v.orderId;
        materialSubOrderPostData["materialSubOrder.orderAddr"] = v.house.village.name + " " + v.house.houseNumber;
        materialSubOrderPostData["materialSubOrder.materialType"] = v.category;
        materialSubOrderPostData["materialSubOrder.materialBrand"] = v.brand;

        material.materialSubOrderItems.realDepositPayment.val(v.depositPayment);
        material.materialSubOrderItems.realFullPayment.val(v.fullPayment);

        for ( var name in material.materialSubOrderPaymentTypeNameData) {
            com.focusPage("#" + name + "Payment").val("").removeAttr("readonly");
            com.focusPage("#" + name + "CancelBtn").css("display", "none");
            com.focusPage("#" + name + "PaymentInfo").css("display", "none").html("");
            com.focusPage("#" + name + "PaymentBtn").css("display", "none");
            com.focusPage("#" + name + "RefundBtn").css("display", "none");
        }

        material.materialSubOrderItems.depositRefundBtn.css("display", "none");

        var depositStatus = v.depositStatus;
        var depositPayment = v.depositPayment;
        var fullStatus = v.fullStatus;
        var fullPayment = v.fullPayment;
        var otherStatus = v.otherStatus;
        var total = v.total;
        material.total = total;
        var maling = v.maling;
        var venderMaling = v.venderMaling;
        var coupon = v.coupon;

        materialSubOrderPostData["materialSubOrder.depositStatus"] = depositStatus;
        materialSubOrderPostData["materialSubOrder.fullStatus"] = fullStatus;
        materialSubOrderPostData["materialSubOrder.otherStatus"] = otherStatus;

        material.materialSubOrderItems.total.val(total);

        if (materialSubOrderPostData["materialSubOrder.fullStatus"] == 0) {
            if (materialSubOrderPostData["materialSubOrder.depositStatus"] == 0) {
                material.materialSubOrderItems.depositPayment.val(depositPayment);
                material.materialSubOrderItems.depositCancelBtn.css("display", "none");
                material.materialSubOrderItems.depositPaymentInfo.css("display", "none").text("");
                material.materialSubOrderItems.depositPaymentBtn.css("display", "inline");
                material.materialSubOrderItems.depositRefundBtn.css("display", "none");
            } else {
                if (materialSubOrderPostData["materialSubOrder.depositStatus"] == 1 && materialSubOrderPostData["materialSubOrder.fullStatus"] == 0) {
                    material.materialSubOrderItems.depositCancelBtn.css("display", "inline");
                }

                if (materialSubOrderPostData["materialSubOrder.depositStatus"] == 2 && materialSubOrderPostData["materialSubOrder.fullStatus"] == 0) {
                    material.materialSubOrderItems.depositRefundBtn.css("display", "inline"); // inline
                }

                if (materialSubOrderPostData["materialSubOrder.depositStatus"] == 3 && materialSubOrderPostData["materialSubOrder.fullStatus"] == 0) {
                    material.materialSubOrderItems.depositRefundBtn.css("display", "inline");
                }

                material.materialSubOrderItems.depositPaymentBtn.css("display", "none");
                material.materialSubOrderItems.depositPaymentInfo.text(material.materialSubOrderPaymentStatusData[depositStatus]).css("display", "inline");
                material.materialSubOrderItems.depositPayment.val(depositPayment).attr("readonly", "readonly");
            }
        } else {
            material.materialSubOrderItems.depositPayment.val(depositPayment);
            material.materialSubOrderItems.depositCancelBtn.css("display", "none");
            material.materialSubOrderItems.depositPaymentBtn.css("display", "none");
            material.materialSubOrderItems.depositRefundBtn.css("display", "none");
            material.materialSubOrderItems.malingBtn.css("display", "none");
            material.materialSubOrderItems.couponBtn.css("display", "none");

            if (materialSubOrderPostData["materialSubOrder.depositStatus"] == 0) {
                material.materialSubOrderItems.depositPaymentInfo.css("display", "none").text("");
            } else {
                material.materialSubOrderItems.depositPaymentInfo.text(material.materialSubOrderPaymentStatusData[depositStatus]).css("display", "inline");
            }
        }
        if (total == 0) {
            material.materialSubOrderItems.fullPaymentBtn.css("display", "none");
            material.materialSubOrderItems.fullCancelBtn.css("display", "none");
            material.materialSubOrderItems.fullRefundBtn.css("display", "none");
            material.materialSubOrderItems.couponRefundBtn.css("display", "none");
            material.materialSubOrderItems.fullPayment.val(0).attr("readonly", "readonly");
        } else {
            if (materialSubOrderPostData["materialSubOrder.fullStatus"] == 0) {
                material.materialSubOrderItems.fullCancelBtn.css("display", "none");
                material.materialSubOrderItems.fullPaymentInfo.css("display", "none").text("");

                var _fullPayment = utils.accSub(utils.accSub(utils.accSub(total, depositPayment), utils.accAdd(maling, venderMaling)), coupon);
                material.materialSubOrderItems.fullPayment.val(_fullPayment).attr("readonly", "readonly");

                if (_fullPayment < 0) {
                    if (depositStatus == 2 || depositStatus == 3) {
                        material.materialSubOrderItems.fullRefundBtn.css("display", "inline");
                    }
                    material.materialSubOrderItems.fullPaymentBtn.css("display", "none");
                } else {
                    material.materialSubOrderItems.fullPaymentBtn.css("display", "inline");
                    material.materialSubOrderItems.fullRefundBtn.css("display", "none");
                }
                if (total > 0) {
                    material.materialSubOrderItems.couponBtn.css("display", "inline");
                    material.materialSubOrderItems.malingBtn.css("display", "inline");
                } else {
                    material.materialSubOrderItems.couponBtn.css("display", "none");
                    material.materialSubOrderItems.malingBtn.css("display", "none");
                }

                material.materialSubOrderItems.couponRefundBtn.css("display", "none");
                material.materialSubOrderItems.couponInfo.css("display", "none");

                material.materialSubOrderItems.malingInfo.css("display", "none");
            } else {
                if (materialSubOrderPostData["materialSubOrder.fullStatus"] == 1) {
                    material.materialSubOrderItems.fullCancelBtn.css("display", "inline");
                }

                if (coupon == 0 || materialSubOrderPostData["materialSubOrder.fullStatus"] < 2) {
                    material.materialSubOrderItems.couponRefundBtn.css("display", "none");
                } else if (coupon == 0 && materialSubOrderPostData["materialSubOrder.fullStatus"] > 1) {
                    material.materialSubOrderItems.couponRefundBtn.css("display", "none");
                } else if (coupon != 0 && materialSubOrderPostData["materialSubOrder.fullStatus"] > 1) {
                    material.materialSubOrderItems.couponRefundBtn.css("display", "none");
                    // material.materialSubOrderItems.couponRefundBtn.css("display", "inline");
                }

                material.materialSubOrderItems.depositPayment.attr("readonly", "readonly");
                material.materialSubOrderItems.fullPayment.val(utils.accSub(utils.accSub(utils.accSub(total, depositPayment), utils.accAdd(maling, venderMaling)), coupon)).attr("readonly", "readonly");

                material.materialSubOrderItems.fullPaymentBtn.css("display", "none");
                material.materialSubOrderItems.fullPaymentInfo.text(material.materialSubOrderPaymentStatusData[materialSubOrderPostData["materialSubOrder.fullStatus"]]).css("display", "inline");

                material.materialSubOrderItems.couponBtn.css("display", "none");
                material.materialSubOrderItems.couponInfo.css("display", "none");
                material.materialSubOrderItems.malingBtn.css("display", "none");
                material.materialSubOrderItems.malingInfo.css("display", "none");
            }
        }

        material.materialSubOrderItems.maling.val(utils.accAdd(maling, venderMaling));
        material.materialSubOrderItems.coupon.val(coupon);

        material.materialSubOrderMoneyModal.modal("show");
    }

    function viewMaterialSubOrderCollection(mid) {

        params.historyPage = api.index.materialIndex.url;
        materialSubOrderPostData["materialSubOrder.msoId"] = mid;
        materialSubOrderPostData["flag"] = true;
        com.switchPage(api.index.materialCollectionIndex.url);
    }

    function viewMaterialSubOrderMendIndex(v) {

        materialSubOrderPostData["materialSubOrder.customerId"] = v.customer.cid;
        materialSubOrderPostData["materialSubOrder.customerName"] = v.customer.name;
        materialSubOrderPostData["materialSubOrder.orderId"] = params.orderId;
        materialSubOrderPostData["materialSubOrder.designerId"] = params.designerId;
        materialSubOrderPostData["materialSubOrder.designerName"] = params.designerName;

        params.msoId = v.mid;
        params.saleType = "mend";
        params.hid = v.house.hid;

        params.historyOrderPage = api.index.materialIndex.url;

        com.switchPage(api.index.materialSaleIndex.url);
    }

    function viewMaterialSubOrderRefundIndex(mid) {

        materialSubOrderPostData["materialSubOrder.msoId"] = mid;

        com.switchPage(api.index.materialRefundIndex.url);
    }

    // function deliverMaterialSubOrder(mid) {
    // com.post(api.material.deliverMaterialSubOrder, {"materialSubOrder.msoId": mid});
    // }

    function receiptMaterialSubOrder(mid) {

        params.type = 1;
        params.materialSubOrderMsoId = mid;
        var url = api.index.materialReceipt.url;
        com.popup("主材销售收据", url, function() {

            parent.layer.getFrameIndex(window.name);
        }, null, true);
    }

    function deleteMaterialSubOrder(mid) {

        com.post(api.material.deleteMaterial, {
            "material.mid": mid
        }, function(res) {

            searcher.doSearch();
        });
    }

    // 定金
    material.materialSubOrderItems.depositPaymentBtn.unbind("click").on("click", function() {

        var args = {};

        var fullPayment = material.materialSubOrderItems.fullPayment.val();

        args["materialPayment.material.mid"] = materialSubOrderPostData["materialSubOrder.msoId"];
        args["materialPayment.paymentType"] = 2; // 定金
        args["materialPayment.referMoney"] = material.materialSubOrderItems.depositPayment.val();

        if (args["materialPayment.referMoney"] == 0) {
            com.showAlert(com.warning, "定金款项提交不能为0或者空");
            return false;
        }

        var btn = $(this).button("loading");

        com.post(api.payment.addMaterialPaymentForDeposit, args, function(result) {

            material.materialSubOrderItems.depositPaymentBtn.css("display", "none");
            material.materialSubOrderItems.depositPaymentInfo.css("display", "inline").text(material.materialSubOrderPaymentStatusData[1]);
            material.materialSubOrderItems.depositPayment.val(result.materialPayment.referMoney).attr("readonly", "readonly");
            material.materialSubOrderItems.realDepositPayment.val(result.materialPayment.referMoney);

            materialSubOrderPostData["materialSubOrder.depositStatus"] = 1;

            var _fullPayment = material.materialSubOrderItems.fullPayment.val();

            var _caclFullPayment = utils.accSub(parseFloat(_fullPayment), parseFloat(result.materialPayment.referMoney));
            material.materialSubOrderItems.fullPayment.val(_caclFullPayment);

            if (_caclFullPayment < 0 || material.total == 0) {
                material.materialSubOrderItems.fullPaymentBtn.css("display", "none");
            } else {
                material.materialSubOrderItems.fullPaymentBtn.css("display", "inline");
            }

            material.materialSubOrderItems.depositCancelBtn.css("display", "inline");

            searcher.doSearch();
        }, null, false);

        btn.button("reset");

        return false;
    });

    // 定金撤销
    material.materialSubOrderItems.depositCancelBtn.unbind("click").on("click", function() {

        var options = {};
        options["materialPayment.material.mid"] = materialSubOrderPostData["materialSubOrder.msoId"];
        options["materialPayment.paymentType"] = 2;

        var btn = $(this).button("loading");

        com.post(api.payment.cancelMaterialPaymentForDeposit, options, function(result) {

            if (result.materialPayment.paymentStatus == 0) {

                var _depositPayment = material.materialSubOrderItems.depositPayment.val();
                var _fullPayment = material.materialSubOrderItems.fullPayment.val();

                material.materialSubOrderItems.fullPayment.val(utils.accAdd(parseFloat(_depositPayment), parseFloat(_fullPayment)));

                material.materialSubOrderItems.depositPayment.removeAttr("readonly").val("0");
                material.materialSubOrderItems.depositCancelBtn.css("display", "none");
                material.materialSubOrderItems.depositPaymentBtn.css("display", "inline");
                material.materialSubOrderItems.depositPaymentInfo.css("display", "none").text("");
                material.materialSubOrderItems.realDepositPayment.val(0);

                materialSubOrderPostData["materialSubOrder.depositStatus"] = 0;
                if (material.total == 0) {
                    material.materialSubOrderItems.fullPaymentBtn.css("display", "none");
                    material.materialSubOrderItems.fullRefundBtn.css("display", "none");
                    material.materialSubOrderItems.depositPaymentBtn.css("display", "inline");
                }
                material.materialSubOrderItems.fullPaymentBtn.css("display", "inline");

                searcher.doSearch();
            }
        }, null, false);

        btn.button("reset");

        return false;
    });

    // 定金退款
    material.materialSubOrderItems.depositRefundBtn.unbind("click").on("click", function() {

        var options = {};
        options["materialPayment.material.mid"] = materialSubOrderPostData["materialSubOrder.msoId"];
        // options["materialPayment.paymentType"] = 2;

        var btn = $(this).button("loading");

        com.showConfirm("是否需要进行定金退款动作?", function() {

            com.post(api.payment.refundMaterialPaymentForDeposit, options, function(result) {

                var _depositPayment = material.materialSubOrderItems.depositPayment.val();
                var _fullPayment = material.materialSubOrderItems.fullPayment.val();

                material.materialSubOrderItems.fullPayment.val(utils.accAdd(parseFloat(_depositPayment), parseFloat(_fullPayment)));

                material.materialSubOrderItems.depositPayment.removeAttr("readonly").val("0");
                material.materialSubOrderItems.depositCancelBtn.css("display", "none");
                material.materialSubOrderItems.depositPaymentInfo.css("display", "none").text("");
                material.materialSubOrderItems.realDepositPayment.val(0);

                materialSubOrderPostData["materialSubOrder.depositStatus"] = 0;

                material.materialSubOrderItems.depositPaymentBtn.css("display", "none");
                material.materialSubOrderItems.depositRefundBtn.css("display", "none");
                material.materialSubOrderItems.fullPaymentBtn.css("display", "none");
                material.materialSubOrderItems.fullRefundBtn.css("display", "none");
                material.materialSubOrderItems.couponBtn.css("display", "none");
                material.materialSubOrderItems.malingBtn.css("display", "none");

                searcher.doSearch();
            }, null, false);
        });

        btn.button("reset");

        return false;
    });

    // 补款
    material.materialSubOrderItems.fullPaymentBtn.unbind("click").on("click", function() {

        var args = {};
        var url = api.payment.addMaterialPaymentForFullpay;
        var that = $(this);

        if ((materialSubOrderPostData["materialSubOrder.otherStatus"] & 1) == 1) {

            materialSubOrderPostData["approvalMaterialFullPayemnt.msoId"] = materialSubOrderPostData["materialSubOrder.msoId"];
            materialSubOrderPostData["approvalMaterialFullPayment.referMoney"] = material.materialSubOrderItems.fullPayment.val();

            com.updateTypeahead('approveManSel', '', '');

            approvalUtils.initqueryApprovalUser('approveManSel', 9);
            material.materialSubOrderMoneyModal.modal("hide");
            material.approvalMaterialFullPaymentModal.modal("show");
        } else {
            args["materialPayment.material.mid"] = materialSubOrderPostData["materialSubOrder.msoId"];
            // args["materialPayment.paymentType"] = 3; // 补款
            args["materialPayment.referMoney"] = material.materialSubOrderItems.fullPayment.val();

            var btn = that.button("loading");

            com.post(url, args, function(result) {

                material.materialSubOrderItems.fullPaymentBtn.css("display", "none");
                material.materialSubOrderItems.fullRefundBtn.css("display", "none");
                material.materialSubOrderItems.fullPaymentInfo.text(material.materialSubOrderPaymentStatusData[1]).css("display", "inline");
                material.materialSubOrderItems.fullPayment.val(result.materialPayment.referMoney).attr("readonly", "readonly");
                material.materialSubOrderItems.realFullPayment.val(result.materialPayment.referMoney);

                materialSubOrderPostData["materialSubOrder.fullStatus"] = 1;

                material.materialSubOrderItems.depositCancelBtn.css("display", "none");
                material.materialSubOrderItems.depositRefundBtn.css("display", "none");

                if (materialSubOrderPostData["materialSubOrder.depositStatus"] == 0) {
                    material.materialSubOrderItems.depositPayment.attr("readonly", "readonly");
                    material.materialSubOrderItems.depositCancelBtn.css("display", "none");
                    material.materialSubOrderItems.depositPaymentBtn.css("display", "none");
                }

                material.materialSubOrderItems.couponBtn.css("display", "none");
                material.materialSubOrderItems.couponInfo.css("display", "none");

                material.materialSubOrderItems.malingBtn.css("display", "none");
                material.materialSubOrderItems.malingInfo.css("display", "none");

                material.materialSubOrderItems.fullCancelBtn.css("display", "inline");

                searcher.doSearch();
            }, null, false);

            btn.button("reset");
        }

        return false;
    });

    // 补款退款
    material.materialSubOrderItems.fullRefundBtn.unbind("click").on("click", function() {

        var args = {};

        args["materialPayment.material.mid"] = materialSubOrderPostData["materialSubOrder.msoId"];
        // args["materialPayment.paymentType"] = 5; // 补款退款
        args["materialPayment.referMoney"] = material.materialSubOrderItems.fullPayment.val();

        var btn = $(this).button("loading");

        com.post(api.payment.addMaterialPaymentForFullpay, args, function(result) {

            material.materialSubOrderItems.fullPaymentBtn.css("display", "none");
            material.materialSubOrderItems.fullRefundBtn.css("display", "none");
            material.materialSubOrderItems.fullPaymentInfo.text(material.materialSubOrderPaymentStatusData[1]).css("display", "inline");
            material.materialSubOrderItems.fullPayment.val(result.materialPayment.referMoney).attr("readonly", "readonly");
            material.materialSubOrderItems.realFullPayment.val(result.materialPayment.referMoney);

            materialSubOrderPostData["materialSubOrder.fullStatus"] = 1;

            material.materialSubOrderItems.depositCancelBtn.css("display", "none");
            material.materialSubOrderItems.depositRefundBtn.css("display", "none");

            if (materialSubOrderPostData["materialSubOrder.depositStatus"] == 0) {
                material.materialSubOrderItems.depositPayment.attr("readonly", "readonly");
                material.materialSubOrderItems.depositCancelBtn.css("display", "none");
                material.materialSubOrderItems.depositPaymentBtn.css("display", "none");
            }

            material.materialSubOrderItems.couponBtn.css("display", "none");
            material.materialSubOrderItems.couponInfo.css("display", "none");

            material.materialSubOrderItems.malingBtn.css("display", "none");
            material.materialSubOrderItems.malingInfo.css("display", "none");

            material.materialSubOrderItems.fullCancelBtn.css("display", "inline");

            searcher.doSearch();
        }, null, false);

        btn.button("reset");

        return false;
    });

    // 补款撤销
    material.materialSubOrderItems.fullCancelBtn.unbind("click").on("click", function() {

        var options = {};

        options["materialPayment.material.mid"] = materialSubOrderPostData["materialSubOrder.msoId"];

        var fullPayment = material.materialSubOrderItems.fullPayment.val();

        if (parseFloat(fullPayment) < 0) {
            options["materialPayment.paymentType"] = 5;
        } else {
            options["materialPayment.paymentType"] = 3;
        }
        // options["materialPayment.paymentStatus"] = materialSubOrderPostData["materialSubOrder.fullStatus"];

        var btn = $(this).button("loading");

        com.post(api.payment.cancelMaterialPaymentForFullpay, options, function(result) {

            if (result.materialPayment.paymentStatus == 0) {
                material.materialSubOrderItems.fullCancelBtn.css("display", "none");
                material.materialSubOrderItems.fullPaymentInfo.css("display", "none").text("");
                material.materialSubOrderItems.realFullPayment.val(result.materialPayment.referMoney);

                materialSubOrderPostData["materialSubOrder.fullStatus"] = 0;

                if (material.materialSubOrderItems.fullPayment.val() < 0) {
                    material.materialSubOrderItems.fullPaymentBtn.css("display", "none");
                    material.materialSubOrderItems.fullRefundBtn.css("display", "inline");
                } else {
                    material.materialSubOrderItems.fullPaymentBtn.css("display", "inline");
                    material.materialSubOrderItems.fullRefundBtn.css("display", "none");
                }

                if (materialSubOrderPostData["materialSubOrder.depositStatus"] == 1) {
                    material.materialSubOrderItems.depositCancelBtn.css("display", "inline");
                } else if (materialSubOrderPostData["materialSubOrder.depositStatus"] == 0) {
                    material.materialSubOrderItems.depositPaymentBtn.css("display", "inline");
                    material.materialSubOrderItems.depositPayment.removeAttr("readonly");
                } else if (materialSubOrderPostData["materialSubOrder.depositStatus"] == 2) {
                    material.materialSubOrderItems.depositRefundBtn.css("display", "inline");
                }

                material.materialSubOrderItems.couponBtn.css("display", "inline");
                material.materialSubOrderItems.couponInfo.css("display", "none");

                material.materialSubOrderItems.malingBtn.css("display", "inline");
                material.materialSubOrderItems.malingInfo.css("display", "none");
            }

            searcher.doSearch();
        }, null, false);

        btn.button("reset");

        return false;
    });

    // 券修改
    material.materialSubOrderItems.couponBtn.unbind("click").click(function() {

        materialSubOrderPostData["couponCommitType"] = 1;

        material.materialSubOrderItems.couponBtn.css("display", "none");
        material.materialSubOrderItems.couponInfo.css("display", "inline");
        material.materialSubOrderItems.couponValue.val(0);

        $(this).css("display", "none");

        return false;
    });

    // 退券
    // material.materialSubOrderItems.couponRefundBtn.click(function () {
    //
    // materialSubOrderPostData["couponCommitType"] = 2;
    //
    // material.materialSubOrderItems.couponBtn.css("display", "none");
    // material.materialSubOrderItems.couponInfo.css("display", "inline");
    // material.materialSubOrderItems.couponValue.val(0);
    //
    // $(this).css("display", "none");
    //
    // return false;
    // });

    // 券提交
    material.materialSubOrderItems.couponCommitBtn.unbind("click").click(function() {

        var url = "";
        var couponValue = material.materialSubOrderItems.couponValue.val();
        var couponType = material.materialSubOrderItems.couponType.val();

        var options = {
            "material.mid": materialSubOrderPostData["materialSubOrder.msoId"],
            "material.coupon": couponValue,
            "material.couponInfo": "#" + couponType + ":" + couponValue + "#",
        };

        if (!/^[0-9]+(\.[0-9]{1,2})?$/.test(couponValue) || parseFloat(couponValue) < 0) {
            com.showAlert(com.error, "券金额格式错误");
            return false;
        }

        if (materialSubOrderPostData["couponCommitType"] == 1) {
            url = api.material.updateMaterialForCoupon;
        } else if (materialSubOrderPostData["couponCommitType"] == 2) {
            url = api.payment.refundMaterialPaymentForCoupon;
        }

        var btn = $(this).button("loading");

        com.post(url, options, function(res) {

            var originalCouponValue = material.materialSubOrderItems.coupon.val();
            var fullPaymentValue = material.materialSubOrderItems.fullPayment.val();

            material.materialSubOrderItems.coupon.val(couponValue);
            material.materialSubOrderItems.fullPayment.val(utils.accSub(utils.accAdd(fullPaymentValue, originalCouponValue), couponValue));

            if (materialSubOrderPostData["materialSubOrder.fullStatus"] == 0) {
                material.materialSubOrderItems.couponBtn.css("display", "inline");
            } else {
                if (material.materialSubOrderItems.coupon.val() == 0) {
                    material.materialSubOrderItems.couponRefundBtn.css("display", "none");
                } else {
                    // material.materialSubOrderItems.couponRefundBtn.css("display", "inline");
                    material.materialSubOrderItems.couponRefundBtn.css("display", "none");
                }
            }

            material.materialSubOrderItems.couponInfo.css("display", "none");

            searcher.doSearch();
        }, null, false);

        btn.button("reset");

        return false;
    });

    // 券取消
    material.materialSubOrderItems.couponCancelBtn.unbind("click").click(function() {

        if (materialSubOrderPostData["materialSubOrder.fullStatus"] == 0) {
            material.materialSubOrderItems.couponBtn.css("display", "inline");
        } else if (materialSubOrderPostData["materialSubOrder.fullStatus"] != 0 && materialSubOrderPostData["materialSubOrder.fullStatus"] != 1) {
            // material.materialSubOrderItems.couponRefundBtn.css("display", "inline");
            material.materialSubOrderItems.couponRefundBtn.css("display", "none");
        }

        material.materialSubOrderItems.couponInfo.css("display", "none");

        return false;
    });

    // 抹零
    material.materialSubOrderItems.malingBtn.unbind("click").click(function() {

        material.materialSubOrderItems.malingBtn.css("display", "none");
        material.materialSubOrderItems.malingInfo.css("display", "inline");
        material.materialSubOrderItems.malingValue.val(0);

        return false;
    });

    // 抹零提交
    material.materialSubOrderItems.malingCommitBtn.click(function() {

        var malingValue = material.materialSubOrderItems.malingValue.val();

        var options = {
            "material.mid": materialSubOrderPostData["materialSubOrder.msoId"],
            "material.maling": 0,
            "material.venderMaling": malingValue,
        };

        if (!/^[0-9]+(\.[0-9]{1,2})?$/.test(malingValue)) {
            com.showAlert(com.error, "券金额格式错误");
            return false;
        }

        var btn = $(this).button("loading");

        com.post(api.material.updateMaterialForMaling, options, function() {

            var originalMalingValue = material.materialSubOrderItems.maling.val();
            var fullPaymentValue = utils.accSub(utils.accAdd(material.materialSubOrderItems.fullPayment.val(), originalMalingValue), malingValue);

            material.materialSubOrderItems.maling.val(malingValue);
            material.materialSubOrderItems.fullPayment.val(fullPaymentValue);

            material.materialSubOrderItems.malingBtn.css("display", "inline");
            material.materialSubOrderItems.malingInfo.css("display", "none");

            if (fullPaymentValue >= 0) {
                material.materialSubOrderItems.fullPaymentBtn.css("display", "inline");
                material.materialSubOrderItems.fullRefundBtn.css("display", "none");
            } else {
                material.materialSubOrderItems.fullPaymentBtn.css("display", "none");
                material.materialSubOrderItems.fullRefundBtn.css("display", "inline");
            }

            searcher.doSearch();
        });

        btn.button("reset");

        return false;
    });

    // 抹零取消
    material.materialSubOrderItems.malingCancelBtn.click(function() {

        material.materialSubOrderItems.malingBtn.css("display", "inline");
        material.materialSubOrderItems.malingInfo.css("display", "none");

        return false;
    });

    function viewMaterialActivityIndex(v) {

        params.orderId = v.orderId;
        params.mid = v.mid;
        params.no = v.no;
        params.activityId = v.activityId;

        com.switchPage(api.index.materialActivityIndex.url);
    }

});
