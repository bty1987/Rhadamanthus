$(function () {

    var sales = {
        type : {
            depositPayment: 2,         //定金交款
            repositPayment: 8,        //不退交款
            fullPayment: 3,           //补款交款
            depositPaymentRefund: 7, //定金退款
            fullPaymentRefund: 5   //补款退款
        },
        modals: {
            decorationInfo: com.focusPage("#decorationInfo"),
            ascription : com.focusPage("#ascription"),
            repositPaymentModal : com.focusPage("#repositPaymentModal"),
            salesActivitysModal : com.focusPage("#salesActivitysModal")
        },
        items: {
            total: com.focusPage('#total'), //款项中的总价
            depositPayment: com.focusPage('#depositPayment'),//款项中的定金
            realDepositPayment: com.focusPage('#realDepositPayment'),//款项中的实收定金
            fullPayment: com.focusPage('#fullPayment'), //款项中的补款
            realFullPayment: com.focusPage('#realFullPayment'),////款项中的实收补款
            couponInf: com.focusPage('#couponInf'), //款项中的券信息
            couponType: com.focusPage('#couponType'),//款项中的券信息点击修改后的查询劵的input的ID(第一个)
            couponValue: com.focusPage('#couponValue'),//款项中的券信息点击修改后劵数量的input的ID(第二个)
            coupon: com.focusPage('#coupon'),//款项中的券值
            maling: com.focusPage('#maling'),//款项中的抹零
            malingValue: com.focusPage('#malingValue'),//款项中的抹零点击修改后的input的ID

            couponInfoDiv: com.focusPage('#couponInfo'),
            malingInfoDiv: com.focusPage('#malingInfo'),

            depositPaymentInfo: com.focusPage('#depositPaymentInfo'), //实收金额
            fullPaymentInfo: com.focusPage('#fullPaymentInfo'),//实收补款

            layerAdd : com.focusPage('#layerAdd'),//款项按钮的弹窗
            fullPaymentTotal : com.focusPage('#fullPaymentTotal'),//折让审批弹窗中的补款总额
            approver : com.focusPage('#approver'),//折让审批弹窗中的审批人
            approvalComment : com.focusPage('#approvalComment'),//折让审批弹窗中的备注信息
            uSalesman : com.focusPage('#uSalesman'),
            uInstorer : com.focusPage('#uInstorer'),
            uGuider : com.focusPage('#uGuider'),

            activityInfo: com.focusPage("#activityInfo"),
        },
        btns: {
            saveBtn: com.focusPage("#saveBtn"),//确认按钮
            fullPaymentSaveBtn: com.focusPage("#fullPaymentSaveBtn"),//折让提交按钮
            fullPaymentCancelBtn: com.focusPage("#fullPaymentCancelBtn"),//折让取消按钮
            fullPaymentBtn: com.focusPage('#fullPaymentBtn'), //补款交款按钮
            fullPaymentRefundBtn: com.focusPage('#fullPaymentRefundBtn'),//补款退款按钮
            fullCancelBtn: com.focusPage('#fullCancelBtn'), //补款撤销按钮
            depositPaymentBtn: com.focusPage('#depositPaymentBtn'), //定金交款按钮
            depositCancelBtn: com.focusPage('#depositCancelBtn'), //定金撤销按钮
            depositRefundBtn: com.focusPage('#depositRefundBtn'), //定金退款按钮
            repositPaymentBtn: com.focusPage('#repositPaymentBtn'),//不退
            couponBtn: com.focusPage('#couponBtn'), //劵信息修改按钮
            couponCommitBtn: com.focusPage('#couponCommitBtn'), //劵信息提交按钮
            couponCancelBtn: com.focusPage('#couponCancelBtn'),//劵信息取消按钮
            couponRefundBtn: com.focusPage('#couponRefundBtn'), //劵信息退券按钮
            malingBtn: com.focusPage('#malingBtn'), //抹零修改按钮
            malingCommitBtn: com.focusPage('#malingCommitBtn'), //抹零提交按钮
            malingCancelBtn: com.focusPage('#malingCancelBtn'), //抹零取消按钮
            ascriptionBtn: com.focusPage('#ascriptionBtn'),
            depositPrintBtn: com.focusPage('#depositPrintBtn'),
            repositBtns: com.focusPage('#repositBtns'),//不退保存

            submitSalesActivityBtn: com.focusPage("#submitSalesActivityBtn")//保存修改活动
        },
        sales: {},
        statues: {},
        balanceStatuses: {},
        sales: {},
        depositpayStatus : {},
        fullpayStatus : {},
        ctypes : {},
        projectStatus: {},
        postData : "salesPostData",
        pageType : params['urlLoadParams'].type,
        ascriptionBySid: null,
        name: {},
        activity:"",
    };

    var pageConfig = drawNode.getConfig(params['urlLoadParams'].type);
    com.initTypeahead('uSalesman', api.personel.queryUserByPinyin, "pinyinName", {"user.status":0,"departmentType.name":""}, 'autoFillKeyValue', 'key', 'value',null);
    com.initTypeahead('uInstorer', api.personel.queryUserByPinyin, "pinyinName", {"user.status":0,"departmentType.name":""}, 'autoFillKeyValue', 'key', 'value',null);
    com.initTypeahead('uGuider', api.personel.queryUserByPinyin, "pinyinName", {"user.status":0,"departmentType.name":""}, 'autoFillKeyValue', 'key', 'value',null);
    com.initTypeahead('uSupplier', api.personel.queryUserByPinyin, "pinyinName", {"user.status":0,"departmentType.name":""}, 'autoFillKeyValue', 'key', 'value',null);
    //初始化状态/结算状态
    com.post(api.ds.sales, {}, function (res) {
        sales.statues = res.statues.split("key", "value");
        sales.balanceStatuses = res.balanceStatuses.split("key", "value");
        sales.depositpayStatus = res.depositpayStatus.split("key", "value");
        sales.fullpayStatus = res.fullpayStatus.split("key", "value");
    }, null, false);

    com.post(api.ds.data, {}, function (res) {
        sales.ctypes = res.ctypes.split("key", "value");
    });

    com.post(api.ds.construction, {}, function (res) {
        sales.projectStatus = res.constructionSchedule.split("key", "value");
    });

    //活动名
    com.post(api.information.queryActivityForValid, {"activity.type": 3}, function (res) {
        $.each(res.activitys, function (i, v) {
            sales.name[v.aid] = v.name;
        });
    }, null, false);

    sales.modals.salesActivitysModal = com.focusPage("#salesActivitysModal").on('show.bs.modal', function (e) {
        com.clearValidator();
    });

    sales.postData = sales.pageType == "sales" ? sales.postData : ("salesFor" + pageConfig.postDataName);

    sales.btns.repositBtns.bindClick(repositBtnsData);

    var displayFunc = (function () {

        var renderList = function (tableId, listData) {

            var $tableWrap = com.focusPage('#' + tableId);
            var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');

            if (listData && listData.length) {
                $.each(listData, function (i, v) {
                    if(sales.pageType=="activity"){sales.activity = v.activity.name; v = v.sales; }
                    var $liLine = $('<li></li>').addClass('item-orange clearfix');
                    var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
                    var $h3 = $('<h3></h3>').addClass('oid');
                    var $small = $('<small></small>').addClass('blue').html(v.no);
                    var $btnDiv = $('<div></div>').addClass('pull-right action-buttons');

                    var $btnAdd = $('<a></a>').addClass(' btn btn-minier btn-yellow').html('添项');
                    var $btnSub = $('<a></a>').addClass(' btn btn-minier btn-success').html('子项');
                    var $btnSupplement = $('<a></a>').addClass('btn btn-minier btn-primary').html('补单');
                    var $btnMoney = $('<a></a>').addClass(' btn btn-minier btn-warning').html('款项');
                    var $btnCollect = $('<a></a>').addClass(' btn btn-minier btn-inverse').html('收款');
                    var $btnRefund = $('<a></a>').addClass(' btn btn-minier btn-danger').html('退货');
                    var $btnPrint = $('<a></a>').addClass(' btn btn-minier btn-pink').html('打印');
                    var $btnAct = $('<a></a>').addClass(' btn btn-minier btn-grey').html('活动');
                    var $btnActivity = $('<a></a>').addClass('btn btn-minier btn-warning').html('活动归属');
                    var $btnSaleDelivery = $('<a></a>').addClass('btn btn-minier btn-primary').html('配送');
                    var $btnDecoration = $('<a></a>').addClass('btn btn-minier btn-purple').html('装修单');
                    var $inventory = $('<a></a>').addClass('btn btn-minier btn-blue').html('仓储');
                    var $ascription = $('<a></a>').addClass('btn btn-minier btn-inverse').html('归属');
                    var $finish = $('<a></a>').addClass('btn btn-minier btn-inverse').html('完结');
                    var $terminal = $('<a></a>').addClass('btn btn-minier btn-danger').html('废单');
                    var propertyArr = [];
                    $.each(pageConfig.propertyArr, function (pi, pv) {
                        switch (pv) {
                            case "orderId":
                                propertyArr.push(["装修单号:", v.orderId, "blue"]);
                                break;
                            case "address":
                                propertyArr.push(["楼盘地址:", (v.house.village.name + " " + v.house.houseNumber), "grey"]);
                                break;
                            case "customer":
                                propertyArr.push(["客户名:", v.customer.name, "grey"]);
                                break;
                            case "salesman":
                                propertyArr.push(["渠道:", v.salesman.currentName, "grey"]);
                                break;
                            case "dept":
                                propertyArr.push(["部门:", v.dept.name, "grey"]);
                                break;
                            case "region":
                                propertyArr.push(["分区:", v.region.name, "grey"]);
                                break;
                            case "guider":
                                propertyArr.push(["导购:", v.guider.currentName, "grey"]);
                                break;
                            case "instorer":
                                propertyArr.push(["驻店:", v.instorer.currentName, "grey"]);
                                break;
                            case "guideDept":
                                propertyArr.push(["主材部:", v.guideDept.name, "grey"]);
                                break;
                            case "category":
                                propertyArr.push(["品类:", v.category, "grey"]);
                                break;
                            case "brand":
                                propertyArr.push(["品牌:", v.brand, "grey"]);
                                break;
                            case "depositpay":
                                propertyArr.push(["定金:", v.depositpay, "blue"]);
                                break;
                            case "fullpay":
                                propertyArr.push(["补款:", v.fullpay, "blue"]);
                                break;
                            case "createTime":
                                propertyArr.push(["创建时间:", v.createTime, "green"]);
                                break;
                            case "balanceTime":
                                propertyArr.push(["结算时间:", v.balanceTime, "green"]);
                                break;
                            case "fullpayTime":
                                propertyArr.push(["补款时间:", v.fullpayTime, "green"]);
                                break;
                            case "status":
                                propertyArr.push(["状态:", sales.statues[v.status], "red"]);
                                break;
                            case "finisher":
                                propertyArr.push(["完结人:", v.finisher.currentName, "red"]);
                                break;
                            case "finishTime":
                                propertyArr.push(["完结时间:", v.finishTime, "green"]);
                                break;
                            case "balanceStatus":
                                propertyArr.push(["结算状态:", sales.balanceStatuses[v.balanceStatus], "red"]);
                                break;
                            case "depositpayStatus":
                                propertyArr.push(["定金状态:", sales.depositpayStatus[v.depositpayStatus], "red"]);
                                break;
                            case "fullpayStatus":
                                propertyArr.push(["补款状态:", sales.fullpayStatus[v.fullpayStatus], "red"]);
                                break;
                            case "grade":
                                propertyArr.push(["等级:", v.grade, "red"]);
                                break;
                            case "total":
                                propertyArr.push(["总额:", v.total, "blue"]);
                                break;
                            case "amount":
                                propertyArr.push(["当前总额:", v.amount, "blue"]);
                                break;
                            case "maling":
                                propertyArr.push(["抹零:", v.maling, "blue"]);
                                break;
                            case "venderMaling":
                                propertyArr.push(["厂商抹零:", v.venderMaling, "blue"]);
                                break;
                            case "coupon":
                                propertyArr.push(["券值:", v.coupon, "blue"]);
                                break;
                            case "couponInfo":
                                propertyArr.push(["券信息:", v.couponInfo, "grey"]);
                                break;
                            case "comment":
                                propertyArr.push(["备注:", v.comment, "grey"]);
                                break;
                            case "activety":
                                propertyArr.push(["活动归属:", sales.activity, "grey"]);
                                break;
                        }
                    });

                    $.each(propertyArr, function (index, value) {
                        var $liProperty = $('<li></li>');
                        $('<strong></strong>').html(value[0]).appendTo($liProperty);
                        $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                        $liProperty.appendTo($ulProperty);
                    });

                    $liLine.appendTo($ul);
                    $liLine.append($h3).append($ulProperty);
                    $small.appendTo($h3);
                    $.each(pageConfig.pageBtn, function (k, b) {
                        switch (b) {
                            case "decoration":
                                $btnDiv.append($btnDecoration);
                                break;
                            case "ascription":
                                $btnDiv.append($ascription);
                                break;
                            case "inventory":
                                $btnDiv.append($inventory);
                                break;
                            case "sub":
                                $btnDiv.append($btnSub);
                                break;
                            case "collect":
                                $btnDiv.append($btnCollect);
                                break;
                            case "add":
                                if (v.fullpayStatus == -1) {
                                    $btnDiv.append($btnAdd);
                                }
                                break;
                            case "supplement":
                                if (v.fullpayStatus != -1) {
                                    $btnDiv.append($btnSupplement);
                                }
                                break;
                            case "refund":
                                $btnDiv.append($btnRefund);
                                break;
                            case "terminal":
                                if (v.status != 4) {
                                    $btnDiv.append($terminal);
                                }
                                break;
                            case "print":
                                if (v.status != 4) {
                                    $btnDiv.append($btnPrint);
                                }
                                break;
                            case "act":
                                if (v.status != 4) {
                                    $btnDiv.append($btnAct);
                                }
                                break;
                            case "activity":
                                if (v.status != 4) {
                                    $btnDiv.append($btnActivity);
                                }
                                break;
                            case "money":
                                if (v.status != 4) {
                                    $btnDiv.append($btnMoney);
                                }
                                break;
                            case "finish":
                                if (v.status != 4) {
                                    $btnDiv.append($finish);
                                }
                                break;
                            case "saledelivery":
                                if (v.fullpayStatus == 2) {
                                    $btnDiv.append($btnSaleDelivery);
                                }
                                break;
                        }
                    });
                    $btnDiv.appendTo($h3);

                    //归属修改
                    $ascription.click(function () {
                        sales.ascriptionBySid = v.sid;
                        com.updateTypeahead("uSalesman", v.salesman.userId, v.salesman.currentName + "-" + v.salesman.dept.name);
                        com.updateTypeahead("uInstorer", v.instorer.userId, v.instorer.currentName + "-" + v.instorer.dept.name);
                        com.updateTypeahead("uGuider", v.guider.userId, v.guider.currentName + "-" + v.guider.dept.name);
                        com.updateTypeahead("uSupplier", v.supplier.userId, v.supplier.currentName);
                        sales.modals.ascription.modal("show");
                    });

                    $finish.click(function () {

                        com.showConfirm('确定要将单号为 ' + v.no + ' 的销售单更新为完结状态吗?', function () {
                            com.post(api.sales.finishSales, {"sales.sid": v.sid}, function () {
                                com.showAlert(com.info, "更新成功");
                                salesSearcher.doSearch();

                            });
                        });
                    });

                    $inventory.click(function () {
                        params["sid"] = v.sid;
                        com.popup4page("#layerPopUp", "/views/sales/sales4inventory.html", "详情")
                    });

                    $btnAdd.click(function () {
                        params["sid"] = v.sid;
                        com.popup4page("#layerPopUp", "views/sales/sales2add.html", "添项", '', function () {
                            salesSearcher.doSearch();
                        })
                    });

                    $btnSub.click(function () {
                        params["sid"] = v.sid;
                        params["dompany"] = sales.pageType;
                        com.popup4page("#layerPopUp", "views/sales/salesItem.html", "子项", '', function () {
                            salesSearcher.doSearch();
                        })
                    });

                    //补单按钮
                    $btnSupplement.click(function () {
                        params["sid"] = v.sid;
                        params["bid"] = v.bid;
                        params["fullpayStatus"] = v.fullpayStatus;
                        params["status"] = v.status;
                        params["depositpayStatus"] = v.depositpayStatus;
                        params["dompany"] = sales.pageType;
                        com.popup4page("#layerPopUp", "views/sales/sales2supple.html", "补单", "", function () {
                            salesSearcher.doSearch();
                        });
                    });

                    $btnCollect.click(function () {
                        params["sid"] = v.sid;
                        params["type"] = "sales";
                        com.popup4page("#layerPopUp", "views/sales/sales4payment.html", "收款");
                    });

                    //装修单显示详情
                    $btnDecoration.click(function () {

                        com.focusPage("text").css("line-height", "27px");
                        com.post(api.decoration.queryDecorationByOrderId, {"decorationOrderId": v.orderId}, function (res) {
                            var decorationInfo = res.decoration;
                            com.focusPage("#orderId").html(decorationInfo.orderId);//装修单号
                            com.focusPage("#address").html(decorationInfo.house.village.name + '' + decorationInfo.house.houseNumber);//装修楼盘地址
                            com.focusPage("#designer").html(decorationInfo.designer.currentName == null ? "无" : decorationInfo.designer.currentName);//装修设计师
                            com.focusPage("#escorter").html(decorationInfo.escorter.currentName == null ? "无" : decorationInfo.escorter.currentName);//装修跟单员
                            com.focusPage("#supervisor").html(decorationInfo.supervisor.currentName == null ? "无" : decorationInfo.supervisor.currentName);//装修监理
                            com.focusPage("#projectStatus").html(sales.projectStatus[decorationInfo.projectStatus]);
                            sales.modals.decorationInfo.modal("show");
                        });

                    });

                    //款项
                    $btnMoney.click(function () {
                        sales.sales = v;
                        if (v.fullpayStatus == 3) {
                            com.showAlert(com.warning, "款项正在审批中,无法进行操作");
                            return false;
                        }

                        sales.items.layerAdd.attr("data-sid", v.sid);
                        sales.items.total.val(v.total);
                        sales.items.depositPayment.val();
                        sales.items.realDepositPayment.val();
                        sales.items.fullPayment.val();
                        sales.items.realFullPayment.val();
                        sales.items.maling.val(v.maling + v.venderMaling);
                        sales.items.coupon.val(v.coupon);
                        sales.items.couponInf.val(v.couponInfo.substring(1, v.couponInfo.length - 1));

                        com.post(api.ds.payment, {}, function (res) {
                            sales.items.couponType.bindData(res.materialCouponTypes, 'key', 'value', false);
                        }, null, false);

                        com.popup4model('#layerAdd', '款项', function () {
                            initLabel(v.depositpayStatus, v.fullpayStatus, v.total, v.depositpay, v.fullpay, '');
                            sales.items.couponValue.val(0);
                            sales.items.malingValue.val(0);
                        }, function () {
                            reductionLabel();
                            salesSearcher.doSearch();
                        }, function () {
                            reductionLabel();
                        });
                    });

                    $btnRefund.click(function () {
                        params["sid"] = v.sid;
                        params["sales"] = v;
                        com.popup4page("#layerPopUp", "views/sales/refundsItem.html", "退货");

                    });

                    $btnAct.click(function () {
                        params["sid"] = v.sid;
                        params["orderId"] = v.orderId;
                        params["no"] = v.no;
                        params["activityId"] = v.activityId;
                        com.popup4page("#layerPopUp", "views/sales/sales4activity.html", "活动", '', function () {
                            salesSearcher.doSearch();
                        });
                    });

                    //活动归属
                    $btnActivity.click(function () {

                        activityName(v.activityId);

                        params["sid"] = v.sid;

                        com.post(api.information.queryActivityForValid, {"activity.type": 3}, function (res) {

                            var activitys = res.activitys;
                            var _activitys = [];

                            for (var i = 0; i < activitys.length; i++) {

                                var _activity = activitys[i];
                                _activitys.push({
                                    aid: _activity.aid,
                                    activityName: _activity.name,
                                    money: _activitys.money
                                });
                            }
                            sales.items.activityInfo.bindData(_activitys, "aid", "activityName", "money", false);
                        });

                        sales.modals.salesActivitysModal.modal("show");
                    });
                    
                    $btnSaleDelivery.click(function () {
                        com.post(api.sales.deliveSalesDeliveryItem, {"salesDeliveryItem.sales.sid": v.sid}, function () {
                            com.showAlert(com.info, "操作成功");
                            salesSearcher.doSearch();
                        });
                    });

                    $btnPrint.click(function () {

                        printPayment(v.orderId, v.sid, v, "fullPay");

                    });

                    $terminal.click(function () {

                        com.showConfirm('确定要将单号为 ' + v.no + ' 的销售单更新为废单吗?', function () {
                            com.post(api.sales.terminalSales, {"sales.sid": v.sid}, function () {
                                com.showAlert(com.info, "更新成功");
                                salesSearcher.doSearch();
                            });
                        });

                    });

                });

                $ul.appendTo($tableWrap);
            }
        };

        return {
            init: function (tableId, listData) {
                com.focusPage('#' + tableId).html(null);
                renderList(tableId, listData);
            }
        };
    })();

    var salesSearcher = new Searcher();

    salesSearcher.init(pageConfig.condArr, "condList", pageConfig.apiPage, function (data) {

        displayFunc.init('resultList', data);

    }, "pagenation", sales.postData, null, false, null);

    //提交归属
    sales.btns.ascriptionBtn.on('click', function () {

        if (com.validate('ascription', 'bottom')) return false;
        var options = {
            'sales.sid': sales.ascriptionBySid,
            "sales.salesman.userId": com.typeahead("uSalesman"),
            "sales.instorer.userId": com.typeahead("uInstorer"),
            "sales.guider.userId": com.typeahead("uGuider"),
            "sales.supplier.userId": com.typeahead("uSupplier")
        };

        com.post(api.sales.updateSalesForBelong, options, function (res) {
            com.showAlert(com.info, "修改归属成功");
            sales.modals.ascription.modal("hide");
            salesSearcher.doSearch();
        });

    });

    //确定
    sales.btns.saveBtn.on('click', function () {
        reductionLabel();
        com.closePopup();
        salesSearcher.doSearch();
    });

    //提交
    sales.btns.fullPaymentSaveBtn.unbind().click(function () {

        var _approval = com.focusPage('#approver', "#miniPopUp");

        var radios = _approval.find('input:checked').attr('userid');

        if (com.validate('miniPopUp', 'right')) {
            return;
        }

        if (radios == null || radios == "") {
            com.showAlert(com.warning, "请选择审批人");
            return false;
        }

        var _options = {};
        _options['approval.receiver.userId'] = radios;
        _options['approval.comment'] = com.focusPage('#approvalComment', "#miniPopUp").val();
        _options['approvalSalesDiscount.sid'] = sales.sales.sid;
        _options['approvalSalesDiscount.referMoney'] = Math.abs(sales.items.fullPaymentTotal.val());
        _options['approvalSalesDiscount.paymentType'] = sales.items.fullPaymentTotal.val() >= 0 ? sales.type.fullPayment : sales.type.fullPaymentRefund;
        com.post(api.approval.submitApprovalForSalesDiscount, _options, function (res) {
            clearApproval();
            com.closePopup();
            com.showAlert(com.warning, "补款申请已提交");
            sales.items.approver.empty();
        });

    });

    //取消
    sales.btns.fullPaymentCancelBtn.on('click', function () {
        com.clearValidator();
        clearApproval();
        com.closePopup(com.focusPage("#fullPaymentCancelBtn", "#miniPopUp"));
        sales.items.approver.empty();
    });

    function clearApproval() {
        com.focusPage('#approvalComment', "#miniPopUp").val("");
        com.cleanTypeahead("approver");
        salesSearcher.doSearch();
    }

    //定金
    sales.btns.depositPaymentBtn.on('click', function () {

        if (com.validate('layerAdd', 'right')) return false;

        if (sales.items.depositPayment.val() <= 0) {
            com.showAlert(com.error, "定金输入不正确");
            return false;
        }

        var opt = {
            "salesPayment.sales.sid": sales.sales.sid,
            "salesPayment.sales.ctype": 2,
            "salesPayment.sales.cvalue": 0,
            "salesPayment.referMoney": sales.items.depositPayment.val(),
            "salesPayment.type": sales.type.depositPayment
        };

        com.post(api.payment.addSalesPaymentForDeposit, opt, function (res) {
            initLabel(0, -1, sales.sales.total, sales.items.depositPayment.val(), '', '');

        });

        return false;
    });

    //定金撤销
    sales.btns.depositCancelBtn.on('click', function () {

        var opt = {
            "salesPayment.sales.sid": sales.sales.sid,
            "salesPayment.type": sales.type.depositPayment
        };

        com.post(api.payment.cancelSalesPaymentForDeposit, opt, function () {
            initLabel(-1, -1, sales.sales.total, '', '', '');
        });

        return false;
    });

    //定金退款
    sales.btns.depositRefundBtn.on('click', function () {

        com.post(api.payment.refundSalesPaymentForDeposit, {"salesPayment.sales.sid": sales.sales.sid}, function () {
            initLabel('', '', sales.sales.total, '', '', 4);
        });

        return false;
    });

    //定金打印
    sales.btns.depositPrintBtn.on('click', function () {

        var printSales = null;
        com.closePopup(com.focusPage("#layerAdd"));

        com.post(api.sales.querySalesBySid, {"sales.sid": sales.sales.sid}, function (res) {
            printSales = res.sales
        }, null, false);

        printPayment(printSales.orderId, printSales.sid, printSales, "deposit");

        return false;

    });

    //不退
    sales.btns.repositPaymentBtn.on('click', function () {

        if (com.validate('layerAdd', 'right')) return false;

        if (sales.items.depositPayment.val() <= 0) {
            com.showAlert(com.error, "定金输入不正确");
            return false;
        }

        com.closePopup();

        brandBalance(sales.sales.bid);
        sales.modals.repositPaymentModal.modal('show');

        return false;
    });

    //补款
    sales.btns.fullPaymentBtn.on('click', function () {
        //判断otherStatus状态
        com.post(api.sales.querySalesBySid, {'sales.sid': sales.sales.sid}, function (res) {
            if (res.sales.otherStatus == 1) {

                com.popup4mini("#miniPopUp", "#layerSubmit", "补款审批", "", function () {
                    com.closePopup(com.focusPage("#fullPaymentCancelBtn", "#miniPopUp"));
                    com.clearValidator();
                    clearApproval();
                    sales.items.approver.empty();
                }, function () {
                    approvalUtils.initqueryApprovalUser('approver', 12);
                });
            } else {
                var opt = {
                    "salesPayment.sales.sid": sales.sales.sid,
                    "salesPayment.referMoney": sales.items.fullPayment.val(),
                    "salesPayment.type": sales.type.fullPayment
                };
                com.post(api.payment.addSalesPaymentForFullpay, opt, function (data) {
                    initLabel(res.sales.depositpayStatus, 0, sales.sales.total, sales.sales.depositpay, sales.sales.fullpay, '');
                });
            }
        });
        return false;
    });

    //补款撤销
    sales.btns.fullCancelBtn.on('click', function () {

        calcFullpayment(sales.sales.total);
        var flag = sales.items.fullPayment.val() >= 0;
        var opts = {
            "salesPayment.sales.sid": sales.sales.sid,
            "salesPayment.type": flag ? sales.type.fullPayment : sales.type.fullPaymentRefund
        };

        var printSales = null;
        com.post(api.sales.querySalesBySid, {"sales.sid": sales.sales.sid}, function (res) {
            printSales = res.sales
        }, null, false);

        com.post(api.payment.cancelSalesPaymentForFullpay, opts, function () {
            initLabel(printSales.depositpayStatus, -1, sales.sales.total, sales.sales.depositpay, sales.sales.fullpay, '');
        });

        return false;
    });

    //补款退款
    sales.btns.fullPaymentRefundBtn.on('click', function () {

        com.post(api.sales.querySalesBySid, {'sales.sid': sales.sales.sid}, function (res) {
            if (res.sales.otherStatus == 1) {

                com.popup4mini("#miniPopUp", "#layerSubmit", "补款退款审批", "", function () {
                    com.closePopup(com.focusPage("#fullPaymentCancelBtn", "#miniPopUp"));
                    com.clearValidator();
                    clearApproval();
                    sales.items.approver.empty();
                }, function () {
                    approvalUtils.initqueryApprovalUser('approver', 12);
                });

            } else {

                var opt = {
                    "salesPayment.sales.sid": sales.sales.sid,
                    "salesPayment.referMoney": sales.items.fullPayment.val(),
                    "salesPayment.type": sales.type.fullPaymentRefund
                };

                com.post(api.payment.addSalesPaymentForFullpay, opt, function (res) {
                    initLabel(sales.sales.depositpayStatus, 0, sales.sales.total, sales.sales.depositpay, sales.sales.fullpay, '');
                });
            }
        });
        return false;
    });

    //券修改
    sales.btns.couponBtn.on('click', function () {
        sales.items.couponInfoDiv.css('display', 'inline');
        sales.btns.couponBtn.addClass('hide');
        sales.btns.couponCommitBtn.removeAttr('class', 'hide');
        sales.btns.couponCancelBtn.removeAttr('class', 'hide');
        return false;
    });

    //券提交
    sales.btns.couponCommitBtn.on('click', function () {

        var moneyAllOne = utils.accAdd(utils.accAdd(utils.accAdd(parseFloat(checkVal(sales.items.couponValue.val())), parseFloat(checkVal(sales.items.malingValue.val()))), parseFloat(checkVal(sales.items.realDepositPayment.val()))), parseFloat(checkVal(sales.items.maling.val())));

        if (moneyAllOne > sales.sales.total) {
            sales.btns.fullPaymentRefundBtn.removeAttr('class', 'hide');
            sales.btns.fullPaymentBtn.addClass('hide');
        }
        if (moneyAllOne <= sales.sales.total) {
            sales.btns.fullPaymentBtn.removeAttr('class', 'hide');
            sales.btns.fullPaymentRefundBtn.addClass('hide');
        }
        if (com.validate('layerAdd', 'right')) return false;

        var couponPostData = {
            "sales.sid": sales.sales.sid,
            "sales.coupon": sales.items.couponValue.val(),
            "sales.couponInfo": "#" + sales.items.couponType.val() + ":" + sales.items.couponValue.val() + "#"
        };

        com.post(api.sales.updateSalesForCoupon, couponPostData, function () {

            sales.items.couponInf.val(sales.items.couponType.val() + ":" + sales.items.couponValue.val());
            sales.items.coupon.val(sales.items.couponValue.val());
            sales.items.couponValue.val(0);
            sales.items.couponInfoDiv.css('display', 'none');
            sales.btns.couponBtn.removeAttr('class', 'hide');
            calcFullpayment(sales.sales.total);

        });
        return false;
    });

    //券取消
    sales.btns.couponCancelBtn.on('click', function () {
        sales.items.couponInfoDiv.css('display', 'none');
        sales.btns.couponBtn.removeAttr('class', 'hide');
        sales.items.couponValue.val(0);
        return false;
    });

    //抹零修改
    sales.btns.malingBtn.on('click', function () {
        sales.items.malingInfoDiv.css('display', 'inline');
        sales.btns.malingBtn.addClass('hide');
        sales.btns.malingCommitBtn.removeAttr('class', 'hide');
        sales.btns.malingCancelBtn.removeAttr('class', 'hide');
        return false;
    });

    //抹零提交
    sales.btns.malingCommitBtn.on('click', function () {
        var moneyAllTwo = utils.accAdd(utils.accAdd(utils.accAdd(parseFloat(checkVal(sales.items.couponValue.val())), parseFloat(checkVal(sales.items.malingValue.val()))), parseFloat(checkVal(sales.items.realDepositPayment.val()))), parseFloat(checkVal(sales.items.coupon.val())));

        if (moneyAllTwo > sales.sales.total) {
            sales.btns.fullPaymentRefundBtn.removeAttr('class', 'hide');
            sales.btns.fullPaymentBtn.addClass('hide');
        }
        if (moneyAllTwo <= sales.sales.total) {
            sales.btns.fullPaymentBtn.removeAttr('class', 'hide');
            sales.btns.fullPaymentRefundBtn.addClass('hide');
        }

        if (com.validate('layerAdd', 'right')) return false;

        var malingPostData = {
            "sales.sid": sales.sales.sid,
            "sales.maling": 0,
            "sales.venderMaling": sales.items.malingValue.val()
        };

        com.post(api.sales.updateSalesForMaling, malingPostData, function () {
            sales.items.maling.val(sales.items.malingValue.val());
            sales.items.malingInfoDiv.css('display', 'none');
            sales.items.malingValue.val(0);
            sales.btns.malingBtn.removeAttr('class', 'hide');
            calcFullpayment(sales.sales.total);
        });
        return false;
    });

    //抹零取消
    sales.btns.malingCancelBtn.on('click', function () {
        sales.items.malingInfoDiv.css('display', 'none');
        sales.btns.malingBtn.removeAttr('class', 'hide');
        sales.items.malingValue.val(0);
        return false;
    });

    //保存活动
    sales.btns.submitSalesActivityBtn.on('click', function () {
        if (com.validate("salesActivitysModal", "")) {
            return;
        }

        var sid = params["sid"];
        var aid = sales.items.activityInfo.find("option:selected").val();

        var options = {
            "sales.sid": sid,
            "sales.activityId": aid
        };

        com.post(api.sales.updateSalesForActivity, options, function (res) {
            com.showAlert(com.info, "修改成功");
            activityName(res.sales.activityId);
        });

        sales.modals.salesActivitysModal.modal("hide");

    });

    com.focusPage("#salesActivitysModal").on('hide.bs.modal', function () {
        com.clearValidator();
    });

    function activityName(aid) {
        salesSearcher.doSearch();
        com.focusPage("#activitys_").val(sales.name[aid]);
    }

    //还原标签样式
    function reductionLabel() {
        sales.btns.fullPaymentBtn.addClass('hide');//补款交款按钮
        sales.btns.fullPaymentRefundBtn.addClass('hide');//补款退款按钮
        sales.btns.fullCancelBtn.addClass('hide');//补款撤销按钮
        sales.btns.depositPaymentBtn.addClass('hide');//定金交款按钮
        sales.btns.depositCancelBtn.addClass('hide');//定金撤销按钮
        sales.btns.depositPrintBtn.addClass('hide');//定金打印按钮
        sales.btns.depositRefundBtn.addClass('hide');//定金退款按钮
        sales.btns.repositPaymentBtn.addClass('hide');//不退
        sales.btns.couponBtn.addClass('hide');//劵信息修改按钮
        sales.btns.couponCommitBtn.addClass('hide');//劵信息提交按钮
        sales.btns.couponCancelBtn.addClass('hide');//劵信息取消按钮
        sales.btns.couponRefundBtn.addClass('hide');//劵信息退券按钮
        sales.btns.malingBtn.addClass('hide');//抹零修改按钮
        sales.btns.malingCommitBtn.addClass('hide');//抹零提交按钮
        sales.btns.malingCancelBtn.addClass('hide');//抹零取消按钮

        sales.items.depositPayment.attr("readonly", "readonly");
        sales.items.fullPayment.attr("readonly", "readonly");

        sales.items.malingInfoDiv.css('display', 'none');
        sales.items.couponInfoDiv.css('display', 'none');

        sales.items.fullPaymentInfo.html('');
        sales.items.depositPaymentInfo.html('');
    }

    //初始化标签样式
    function initLabel(depositpayStatus, fullpayStatus, total, depositpay, fullpay, status) {
        reductionLabel();
        if (status == 4) {
            sales.items.realDepositPayment.val(0);
            sales.items.depositPayment.val(0);
            calcFullpayment(total);
            return false;
        }

        if (depositpayStatus == -1 && fullpayStatus == -1) { //未交定金和补款
            sales.btns.couponBtn.removeAttr('class', 'hide');//劵信息修改按钮
            sales.btns.malingBtn.removeAttr('class', 'hide');//抹零修改按钮
            sales.btns.depositPaymentBtn.removeAttr('class', 'hide');//定金交款按钮
            sales.btns.repositPaymentBtn.removeAttr('class', 'hide');//不退
            sales.btns.fullPaymentBtn.removeAttr('class', 'hide');//补款交款按钮
            sales.items.depositPayment.removeAttr("readonly");//款项中的定金输入框
            sales.items.depositPayment.val(0);
            sales.items.realDepositPayment.val('');
            sales.items.realFullPayment.val('');
            sales.items.depositPaymentInfo.html("");
            calcFullpayment(total);
        }

        if (depositpayStatus == -1 && fullpayStatus == 0) {
            sales.btns.fullCancelBtn.removeAttr('class', 'hide');
            sales.items.fullPaymentInfo.html("提交中");
            sales.items.depositPayment.val('');
            sales.items.realDepositPayment.val('');
            calcFullpayment(total);
            sales.items.realFullPayment.val(sales.items.fullPayment.val());
        }

        if (depositpayStatus == 0 && fullpayStatus == -1) {
            sales.items.depositPayment.val(depositpay);
            sales.items.realDepositPayment.val(depositpay);
            sales.items.depositPaymentInfo.html("提交中");
            calcFullpayment(total);
            sales.btns.depositCancelBtn.removeAttr('class', 'hide');
            sales.btns.couponBtn.removeAttr('class', 'hide');
            sales.btns.malingBtn.removeAttr('class', 'hide');
        }

        if (depositpayStatus == 1 && fullpayStatus == -1) {
            sales.btns.depositRefundBtn.removeAttr('class', 'hide');
            sales.btns.fullPaymentBtn.removeAttr('class', 'hide');
            sales.btns.couponBtn.removeAttr('class', 'hide');
            sales.btns.malingBtn.removeAttr('class', 'hide');
            sales.items.depositPaymentInfo.html("已收款");
            sales.items.realFullPayment.val('');
            sales.items.depositPayment.val(depositpay);
            sales.items.realDepositPayment.val(depositpay);
            calcFullpayment(total);
        }

        if (depositpayStatus == 2 && fullpayStatus == -1) {
            sales.btns.couponBtn.removeAttr('class', 'hide');
            sales.btns.malingBtn.removeAttr('class', 'hide');
            sales.btns.depositRefundBtn.removeAttr('class', 'hide');
            sales.btns.fullPaymentBtn.removeAttr('class', 'hide');
            sales.items.depositPaymentInfo.html("已确认");
            sales.items.realFullPayment.val('');
            sales.items.depositPayment.val(depositpay);
            sales.items.realDepositPayment.val(depositpay);
            calcFullpayment(total);
        }

        if (fullpayStatus == -1 && depositpayStatus == 1) {
            sales.btns.fullCancelBtn.addClass('hide');
            sales.items.couponInfoDiv.css('display', 'none');
            sales.items.malingInfoDiv.css('display', 'none');
            sales.btns.fullPaymentBtn.removeAttr('class', 'hide');
            sales.btns.couponBtn.removeAttr('class', 'hide');
            sales.btns.malingBtn.removeAttr('class', 'hide');
            sales.items.depositPayment.val(depositpay);
            sales.items.realDepositPayment.val(depositpay);

            sales.items.realFullPayment.val('');
            sales.items.fullPaymentInfo.html("");
            sales.btns.depositRefundBtn.removeAttr('class', 'hide');
            calcFullpayment(total);
        }

        if (fullpayStatus == 0 && depositpayStatus == 1) {
            sales.items.depositPayment.val(depositpay);
            sales.items.realDepositPayment.val(depositpay);
            calcFullpayment(total);
            sales.items.realFullPayment.val(sales.items.fullPayment.val());
            sales.btns.depositRefundBtn.addClass('hide');
            sales.btns.fullPaymentBtn.addClass('hide');
            sales.btns.couponBtn.addClass('hide');
            sales.btns.malingBtn.addClass('hide');

            sales.btns.fullCancelBtn.removeAttr('class', 'hide');
            sales.items.depositPaymentInfo.html("已收款");
            sales.items.fullPaymentInfo.html("提交中");
        }

        if (fullpayStatus == 0 && depositpayStatus == 2) {
            sales.items.depositPayment.val(depositpay);
            sales.items.realDepositPayment.val(depositpay);
            calcFullpayment(total);
            sales.items.realFullPayment.val(sales.items.fullPayment.val());
            sales.btns.depositRefundBtn.addClass('hide');
            sales.btns.fullPaymentBtn.addClass('hide');
            sales.btns.couponBtn.addClass('hide');
            sales.btns.malingBtn.addClass('hide');
            sales.btns.fullCancelBtn.removeAttr('class', 'hide');
            sales.items.depositPaymentInfo.html("已确认");
            sales.items.fullPaymentInfo.html("提交中");
        }

        if (fullpayStatus == 1 && depositpayStatus == -1) {
            sales.items.realDepositPayment.val('');
            sales.items.depositPayment.val('');
            calcFullpayment(total);
            sales.items.realFullPayment.val(sales.items.fullPayment.val());
            sales.items.fullPaymentInfo.html("已收款");
        }

        if (fullpayStatus == 1 && depositpayStatus == 1) {
            sales.items.realDepositPayment.val(depositpay);
            sales.items.depositPayment.val(depositpay);
            calcFullpayment(total);
            sales.items.realFullPayment.val(sales.items.fullPayment.val());
            sales.btns.fullPaymentBtn.addClass('hide');
            sales.btns.depositRefundBtn.addClass('hide');
            sales.btns.depositCancelBtn.addClass('hide');
            sales.btns.couponBtn.addClass('hide');
            sales.btns.malingBtn.addClass('hide');
            sales.items.depositPaymentInfo.html("已收款");
            sales.items.fullPaymentInfo.html("已收款");
        }

        if (fullpayStatus == 1 && depositpayStatus == 2) {
            sales.items.realDepositPayment.val(depositpay);
            sales.items.depositPayment.val(depositpay);
            calcFullpayment(total);
            sales.items.realFullPayment.val(sales.items.fullPayment.val());
            sales.btns.fullPaymentBtn.addClass('hide');
            sales.btns.depositRefundBtn.addClass('hide');
            sales.btns.depositCancelBtn.addClass('hide');
            sales.btns.couponBtn.addClass('hide');
            sales.btns.malingBtn.addClass('hide');
            sales.items.depositPaymentInfo.html("已确认");
            sales.items.fullPaymentInfo.html("已收款");
        }

        if (fullpayStatus == 2 && depositpayStatus == -1) {
            sales.items.realDepositPayment.val('');
            sales.items.depositPayment.val('');
            calcFullpayment(total);
            sales.items.realFullPayment.val(sales.items.fullPayment.val());
            sales.items.fullPaymentInfo.html("已确认");
        }

        if (fullpayStatus == 2 && depositpayStatus == 1) {
            sales.items.realDepositPayment.val(depositpay);
            sales.items.depositPayment.val(depositpay);
            calcFullpayment(total);
            sales.items.realFullPayment.val(sales.items.fullPayment.val());
            sales.btns.fullPaymentBtn.addClass('hide');
            sales.btns.depositRefundBtn.addClass('hide');
            sales.btns.depositCancelBtn.addClass('hide');
            sales.btns.couponBtn.addClass('hide');
            sales.btns.malingBtn.addClass('hide');
            sales.items.depositPaymentInfo.html("已收款");
            sales.items.fullPaymentInfo.html("已确认");
        }

        if (fullpayStatus == 2 && depositpayStatus == 2) {
            sales.items.realDepositPayment.val(depositpay);
            sales.items.depositPayment.val(depositpay);
            calcFullpayment(total);
            sales.items.realFullPayment.val(sales.items.fullPayment.val());
            sales.btns.fullPaymentBtn.addClass('hide');
            sales.btns.depositRefundBtn.addClass('hide');
            sales.btns.depositCancelBtn.addClass('hide');
            sales.btns.couponBtn.addClass('hide');
            sales.btns.malingBtn.addClass('hide');
            sales.items.depositPaymentInfo.html("已确认");
            sales.items.fullPaymentInfo.html("已确认");
        }

        if (fullpayStatus == -1 && sales.items.fullPayment.val() < 0 && depositpayStatus != 0) {
            calcFullpayment(total);
            sales.btns.fullPaymentRefundBtn.removeAttr('class', 'hide');
            sales.btns.fullPaymentBtn.addClass('hide');
        }

        if (depositpayStatus == 0) {
            sales.btns.depositPrintBtn.removeAttr('class', 'hide');
        }

    }

    function calcFullpayment(total) {
        var _total = parseFloat(checkVal(total));
        var depositPaymentVal = parseFloat(checkVal(sales.items.depositPayment.val()));
        var couponVal = parseFloat(checkVal(sales.items.coupon.val()));
        var malingVal = parseFloat(checkVal(sales.items.maling.val()));
        var fullpaymentVal = utils.accSub(utils.accSub(utils.accSub(_total, depositPaymentVal), couponVal), malingVal);

        sales.items.fullPayment.val(fullpaymentVal);
        sales.items.fullPaymentTotal.val(fullpaymentVal);
    }

    function checkVal(val) {
        return val == "" || val < 0 ? 0 : val;
    }

    function printPayment(orderId, sid, v, flag) {
        params.salesSid = sid;
        params.data = v;
        params.flag = flag;
        com.popup("销售购货单: " + orderId, api.index.salesPrintIndex.url, null, null, true);
    }

    function brandBalance(bid) {

        var initList = function (listData) {

            var $tableWrap = com.focusPage('#lists').empty();
            var $ul = $('<ul></ul>').addClass('item-list ui-sortable  fl-table-list');

            if (!listData.length) {
                var $resultList = com.focusPage("#lists").addClass('dz-default dz-message').html('');
                var $zone = $('<div></div>').addClass('dropzone dz-clickable').css('margin', '20px').css('border', '0px').appendTo($resultList);
                var $mesg = $('<div></div>').addClass('dz-default dz-message').appendTo($zone);
                var $span = $('<span></span>').text('无可用数据提供').appendTo($mesg);
                return $resultList;
            } else if (listData && listData.length) {

                $.each(listData, function (i, v) {
                    var $liLine = $('<li></li>').addClass('item-orange clearfix');
                    var $h3 = $('<h3></h3>').addClass('oid');
                    var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');

                    var propertyArr = [
                        ["结算ID:", v.bbid, "grey"],
                        ["品牌ID:", v.bid, "grey"],
                        ["类型:", sales.ctypes[v.ctype], "red"],
                        ["结算值:", v.cvalue, "red"],
                        ["说明:", v.comment, "grey"],
                    ];

                    var $label = $('<label></label>').addClass('control-label').css({
                        'color': 'grey',
                        'font-size': '20px',
                        "font-weight": "bold"
                    });

                    var _label = $('<label></label>');

                    var $input = $('<input>').attr({
                        "type": "checkbox",
                        "name": "bids",
                        "class": "",
                        "data-ctype": v.ctype,
                        "data-cvalue": v.cvalue,
                    }).addClass('ace ace-checkbox-2');

                    var _span = $('<span></span>').addClass('lbl blue bigger-150').html(v.name);

                    _label.append($input).append(_span).appendTo($label);

                    $.each(propertyArr, function (index, value) {
                        var $liProperty = $('<li></li>');
                        $('<strong></strong>').html(value[0]).appendTo($liProperty);
                        $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                        $liProperty.appendTo($ulProperty);
                    });

                    $label.appendTo($h3);
                    $liLine.append($h3).append($ulProperty).appendTo($ul);

                });

                $ul.appendTo($tableWrap);
            }
        };
        com.post(api.data.queryBrandBalance, {"brandBalance.bid": bid}, function (res) {
            initList(res.brandBalances);
        });
    }

    function repositBtnsData() {

        var $inputs = com.focusPage('input[name="bids"]:checked', '#lists');

        var options = {
            "salesPayment.sales.sid" : sales.sales.sid,
            "salesPayment.sales.ctype" : $inputs.attr('data-ctype'),
            "salesPayment.sales.cvalue" : $inputs.attr('data-cvalue'),
            "salesPayment.referMoney" : sales.items.depositPayment.val(),
            "salesPayment.type" : sales.type.repositPayment
        };

        if ($inputs.length >= 2) {
            com.showAlert(com.warning, '品牌结算数量最多一个');
            return false;
        } else if ($inputs.length == 0) {
            com.showAlert(com.warning, '请选择品牌结算');
            return false;
        }

        com.post(api.payment.addSalesPaymentForDeposit, options, function (res) {

            initLabel(0, -1, sales.sales.total, sales.items.depositPayment.val(), '', '');
        });

        reductionLabel();

        salesSearcher.doSearch();

        sales.modals.repositPaymentModal.modal('hide');

    }
});
