$(function () {

    var sales = {
        type : {
            depositPayment: 2,         //定金交款
            fullPayment: 3,           //补款交款
            depositPaymentRefund: 7, //定金退款
            fullPaymentRefund: 5   //补款退款
        },
        modals:{
            decorationInfo:com.focusPage("#decorationInfo")
        },
        items:{
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
            approvalComment : com.focusPage('#approvalComment')//折让审批弹窗中的备注信息
        },
        btns:{
            saveBtn : com.focusPage("#saveBtn"),//确认按钮
            fullPaymentSaveBtn : com.focusPage("#fullPaymentSaveBtn"),//折让提交按钮
            fullPaymentCancelBtn : com.focusPage("#fullPaymentCancelBtn"),//折让取消按钮
            fullPaymentBtn: com.focusPage('#fullPaymentBtn'), //补款交款按钮
            fullPaymentRefundBtn: com.focusPage('#fullPaymentRefundBtn'),//补款退款按钮
            fullCancelBtn: com.focusPage('#fullCancelBtn'), //补款撤销按钮
            depositPaymentBtn: com.focusPage('#depositPaymentBtn'), //定金交款按钮
            depositCancelBtn: com.focusPage('#depositCancelBtn'), //定金撤销按钮
            depositRefundBtn: com.focusPage('#depositRefundBtn'), //定金退款按钮
            couponBtn: com.focusPage('#couponBtn'), //劵信息修改按钮
            couponCommitBtn: com.focusPage('#couponCommitBtn'), //劵信息提交按钮
            couponCancelBtn: com.focusPage('#couponCancelBtn'),//劵信息取消按钮
            couponRefundBtn: com.focusPage('#couponRefundBtn'), //劵信息退券按钮
            malingBtn: com.focusPage('#malingBtn'), //抹零修改按钮
            malingCommitBtn: com.focusPage('#malingCommitBtn'), //抹零提交按钮
            malingCancelBtn: com.focusPage('#malingCancelBtn') //抹零取消按钮
        },
        statues: {},
        balanceStatuses: {},
        sales: {},
        url : api.inventory.pageSales,
        postData : "salesPostData",
        pageType : params['urlLoadParams'].type
    };

    //初始化状态/结算状态
    com.post(api.ds.sales, {}, function(res){
        sales.statues = res.statues.split("key", "value");
        sales.balanceStatuses = res.balanceStatuses.split("key", "value");
    }, null, false);

    if (sales.pageType == "advance") {
        sales.url = api.inventory.pageSalesForAdvance;
        sales.postData = "salesForAdvancePostData";
    } else if (sales.pageType == "dompany") {
        sales.url = api.inventory.pageSalesForDompany;
        sales.postData = "salesForDompanyPostData";
    }else if(sales.pageType == "pompany"){
        sales.url = api.inventory.pageSalesForPompany;
        sales.postData = "salesForPompanyPostData";
    }

    var displayFunc = (function () {

        var renderList = function (tableId, listData) {

            var $tableWrap = com.focusPage('#' + tableId);
            var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');

            if (listData && listData.length) {
                $.each(listData, function (i, v) {

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
                    var $btnDecoration = $('<a></a>').addClass('btn btn-minier btn-purple').html('装修单');
                    var $inventory = $('<a></a>').addClass('btn btn-minier btn-blue').html('仓储');

                    var propertyArr = [
                        ["装修单号:", v.orderId, "blue"],
                        ["楼盘地址:", v.house.village.name + " " + v.house.houseNumber, "grey"],
                        ["客户名:", v.customer.name, "grey"],
                        ["渠道:", v.salesman.currentName, "grey"],
                        ["部门:", v.dept.name, "grey"],
                        ["分区:", v.region.name, "grey"],
                        ["导购:", v.guider.currentName, "grey"],
                        ["驻店:", v.instorer.currentName, "grey"],
                        ["主材部:", v.guideDept.name, "grey"],
                        ["品类:", v.category, "grey"],
                        ["品牌:", v.brand, "grey"],
                        ["定金:", v.depositpay, "blue"],
                        ["补款:", v.fullpay, "blue"],
                        ["创建时间:", v.createTime, "green"],
                        ["结算时间:", v.balanceTime, "green"],
                        ["补款时间:", v.fullpayTime, "green"],
                        ["状态:", sales.statues[v.status], "red"],
                        ["结算状态:", sales.balanceStatuses[v.balanceStatus], "red"],
                        ["等级:", v.grade, "red"],
                        ["总额:", v.total, "blue"],
                        ["当前总额:", v.amount, "blue"],
                        ["抹零:", v.maling, "blue"],
                        ["厂商抹零:", v.venderMaling, "blue"],
                        ["券值:", v.coupon, "blue"],
                        ["券信息:", v.couponInfo, "grey"],
                        ["备注:", v.comment, "grey"]
                    ];

                    $.each(propertyArr, function (index, value) {
                        var $liProperty = $('<li></li>');
                        $('<strong></strong>').html(value[0]).appendTo($liProperty);
                        $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                        $liProperty.appendTo($ulProperty);
                    });

                    $liLine.appendTo($ul);
                    $liLine.append($h3).append($ulProperty);
                    $small.appendTo($h3);

                    if(sales.pageType == "advance"){
                        $btnDiv.append($inventory)
                    }

                    $btnDiv.append($btnDecoration);
                    if (sales.pageType == "dompany") {
                        $btnDiv.append($btnSub).append($btnCollect).append($btnAct).append($btnRefund).appendTo($h3);
                    }else if(sales.pageType == "pompany"){

                        if (v.fullpayStatus == -1 && v.status != 4) {
                            $btnDiv.append($btnAdd);
                        }else{
                            $btnDiv.append($btnSupplement);
                        }

                        if(v.status != 4){
                            $btnDiv.append($btnSub).append($btnMoney).append($btnCollect).append($btnRefund).append($btnPrint).append($btnAct);
                        }else {
                            $btnDiv.append($btnSub).append($btnCollect).append($btnRefund);
                        }

                        $btnDiv.appendTo($h3);

                    } else {
                        if (v.fullpayStatus == -1 && v.status != 4) {
                            $btnDiv.append($btnAdd);
                        }else{
                            $btnDiv.append($btnSupplement);
                        }

                        if (v.status != 4) {
                            $btnDiv.append($btnSub).append($btnMoney).append($btnCollect).append($btnRefund).append($btnPrint).append($btnAct).appendTo($h3);
                        } else {
                            $btnDiv.append($btnSub).append($btnCollect).append($btnRefund).appendTo($h3);
                        }
                    }
                    $btnDiv.appendTo($h3);

                    $inventory.click(function () {
                        params["sid"] = v.sid;
                        com.popup4page("#layerPopUp", "/views/sales/sales4inventory.html", "详情")
                    });

                    $btnAdd.click(function () {
                        params["sid"] = v.sid;
                        com.popup4page("#layerPopUp", "views/sales/salesItem2add.html", "添项",'',function () {
                            salesSearcher.doSearch();
                        })
                    });

                    $btnSub.click(function () {
                        params["sid"] = v.sid;
                        params["fullpayStatus"] = v.fullpayStatus;
                        params["status"] = v.status;
                        params["depositpayStatus"] = v.depositpayStatus;
                        params["dompany"] = sales.pageType;
                        com.popup4page("#layerPopUp", "views/sales/salesItem.html", "子项",'',function () {
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
                        com.popup4page("#layerPopUp", "views/sales/sales2supple.html", "补单","", function () {
                            salesSearcher.doSearch();
                        });
                    });

                    $btnCollect.click(function () {
                        params["sid"] = v.sid;
                        com.popup4page("#layerPopUp", "views/sales/sales4payment.html", "收款");
                    });

                    //装修单显示详情
                    $btnDecoration.click(function(){

                        com.focusPage("text").css("line-height", "27px");
                        com.post(api.decoration.queryDecorationByOrderId, {"decorationOrderId" : v.orderId}, function(res){
                            var decorationInfo = res.decoration;
                            com.focusPage("#orderId").html(decorationInfo.orderId);//装修单号
                            com.focusPage("#address").html(decorationInfo.house.village.name +''+ decorationInfo.house.houseNumber);//装修楼盘地址
                            com.focusPage("#designer").html(decorationInfo.designer.currentName);//装修设计师
                            com.focusPage("#supervisor").html(decorationInfo.supervisor.currentName);//装修监理
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

                        com.popup4model('#layerAdd','款项',function(){
                            initLabel(v.depositpayStatus, v.fullpayStatus, v.total, v.depositpay, v.fullpay,'');
                            sales.items.couponValue.val(0);
                            sales.items.malingValue.val(0);
                        }, function () {
                            reductionLabel();
                            salesSearcher.doSearch();
                        },function () {
                            reductionLabel();
                        });
                    });

                    $btnRefund.click(function () {
                        params["sid"] = v.sid;
                        com.popup4page("#layerPopUp", "views/sales/refundsItem.html", "退货");

                    });

                    $btnAct.click(function () {
                        params["sid"] = v.sid;
                        params["orderId"] = v.orderId;
                        params["no"] = v.no;
                        params["activityId"] = v.activityId;
                        com.popup4page("#layerPopUp", "views/sales/salesActivity.html", "活动",'',function () {
                            salesSearcher.doSearch();
                        });
                    });

                    /*$btnPrint.click(function () {

                     printPayment(v.orderId, v.sid);

                     });*/
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

    /*分页*/
    var _condArr = ['sales_no', 'sales_orderId', 'sales_instorer', 'sales_salesman', 'sales_bid',  'sales_deptName'];

    var salesSearcher = new Searcher();

    salesSearcher.init(_condArr, "condList", sales.url , function (data) {

        displayFunc.init('resultList', data);

    }, "pagenation", sales.postData, null, false, null);

    //确定
    sales.btns.saveBtn.on('click',function () {
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
        _options['approvalSalesDiscount.referMoney'] = sales.items.fullPaymentTotal.val();
        _options['approvalSalesDiscount.paymentType'] = sales.items.fullPaymentTotal.val() >= 0 ? sales.type.fullPayment : sales.type.fullPaymentRefund;
        com.post(api.approval.submitApprovalForSalesDiscount, _options, function (res) {
            clearApproval();
            com.closePopup();
            com.showAlert(com.warning, "补款申请已提交");
            sales.items.approver.empty();
        });

    });

    //取消
    sales.btns.fullPaymentCancelBtn.on('click',function () {
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

        if (sales.items.depositPayment.val() <= 0){
            com.showAlert(com.error, "定金输入不正确");
            return false;
        }

        var opt = {
            "salesPayment.sales.sid" : sales.sales.sid,
            "salesPayment.referMoney" : sales.items.depositPayment.val(),
            "salesPayment.type" : sales.type.depositPayment
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
            "salesPayment.type" : sales.type.depositPayment
        };
        com.post(api.payment.cancelSalesPaymentForDeposit, opt, function () {
            initLabel(-1, -1, sales.sales.total, '', '', '');
        });

        return false;
    });

    //定金退款
    sales.btns.depositRefundBtn.on('click', function () {

        com.post(api.payment.refundSalesPaymentForDeposit, {"salesPayment.sales.sid": sales.sales.sid}, function () {
            initLabel('', '', sales.sales.total, '', '',4);
        });

        return false;
    });

    //补款
    sales.btns.fullPaymentBtn.on('click', function () {

        //判断otherStatus状态
        com.post(api.inventory.querySalesBySid, {'sales.sid': sales.sales.sid}, function (res) {
            if (res.sales.otherStatus == 1) {

                com.popup4mini("#miniPopUp", "#layerSubmit","补款审批", "", function () {
                    com.closePopup(com.focusPage("#fullPaymentCancelBtn", "#miniPopUp"));
                    com.clearValidator();
                    clearApproval();
                    sales.items.approver.empty();
                }, function () {
                    approvalUtils.initqueryApprovalUser('approver', 12);
                });
            }
            else {
                var opt = {
                    "salesPayment.sales.sid" : sales.sales.sid,
                    "salesPayment.referMoney" : sales.items.fullPayment.val(),
                    "salesPayment.type" : sales.type.fullPayment
                };
                com.post(api.payment.addSalesPaymentForFullpay, opt, function (data) {
                    initLabel(sales.sales.depositpayStatus, 0, sales.sales.total, sales.sales.depositpay, sales.sales.fullpay,'');
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
            "salesPayment.type" : flag ? sales.type.fullPayment : sales.type.fullPaymentRefund
        };

        com.post(api.payment.cancelSalesPaymentForFullpay, opts, function () {
            initLabel(sales.sales.depositpayStatus, -1, sales.sales.total, sales.sales.depositpay, sales.sales.fullpay,'');
        });
        
        return false;
    });

    //补款退款
    sales.btns.fullPaymentRefundBtn.on('click', function () {

        com.post(api.inventory.querySalesBySid, {'sales.sid': sales.sales.sid}, function (res) {
            if (res.sales.otherStatus == 1) {

                com.popup4mini("#miniPopUp", "#layerSubmit","补款退款审批", "", function () {
                    com.closePopup(com.focusPage("#fullPaymentCancelBtn", "#miniPopUp"));
                    com.clearValidator();
                    clearApproval();
                    sales.items.approver.empty();
                }, function () {
                    approvalUtils.initqueryApprovalUser('approver', 12);
                });

            }else {

                var opt = {
                    "salesPayment.sales.sid" : sales.sales.sid,
                    "salesPayment.referMoney" : sales.items.fullPayment.val(),
                    "salesPayment.type" : sales.type.fullPaymentRefund
                };

                com.post(api.payment.addSalesPaymentForFullpay, opt, function (res) {
                    initLabel(sales.sales.depositpayStatus, 0, sales.sales.total, sales.sales.depositpay, sales.sales.fullpay,'');
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

        var moneyAllOne = utils.accAdd(utils.accAdd(utils.accAdd(parseFloat(checkVal(sales.items.couponValue.val())),parseFloat(checkVal(sales.items.malingValue.val()))), parseFloat(checkVal(sales.items.realDepositPayment.val()))), parseFloat(checkVal(sales.items.maling.val())));

        if(moneyAllOne > sales.sales.total){
            sales.btns.fullPaymentRefundBtn.removeAttr('class', 'hide');
            sales.btns.fullPaymentBtn.addClass('hide');
        }
        if(moneyAllOne <= sales.sales.total){
            sales.btns.fullPaymentBtn.removeAttr('class', 'hide');
            sales.btns.fullPaymentRefundBtn.addClass('hide');
        }
        if (com.validate('layerAdd', 'right')) return false;

        var couponPostData = {
            "sales.sid": sales.sales.sid,
            "sales.coupon": sales.items.couponValue.val(),
            "sales.couponInfo": "#" + sales.items.couponType.val() + ":" + sales.items.couponValue.val() + "#"
        };
        
        com.post(api.inventory.updateSalesForCoupon, couponPostData, function () {

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
        var moneyAllTwo = utils.accAdd(utils.accAdd(utils.accAdd(parseFloat(checkVal(sales.items.couponValue.val())),parseFloat(checkVal(sales.items.malingValue.val()))), parseFloat(checkVal(sales.items.realDepositPayment.val()))), parseFloat(checkVal(sales.items.coupon.val())));

        if(moneyAllTwo > sales.sales.total){
            sales.btns.fullPaymentRefundBtn.removeAttr('class', 'hide');
            sales.btns.fullPaymentBtn.addClass('hide');
        }
        if(moneyAllTwo <= sales.sales.total){
            sales.btns.fullPaymentBtn.removeAttr('class', 'hide');
            sales.btns.fullPaymentRefundBtn.addClass('hide');
        }

        if (com.validate('layerAdd', 'right')) return false;

        var malingPostData = {
            "sales.sid": sales.sales.sid,
            "sales.maling": 0,
            "sales.venderMaling": sales.items.malingValue.val()
        };

        com.post(api.inventory.updateSalesForMaling, malingPostData, function () {
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

    //还原标签样式
    function reductionLabel() {
        sales.btns.fullPaymentBtn.addClass('hide');//补款交款按钮
        sales.btns.fullPaymentRefundBtn.addClass('hide');//补款退款按钮
        sales.btns.fullCancelBtn.addClass('hide');//补款撤销按钮
        sales.btns.depositPaymentBtn.addClass('hide');//定金交款按钮
        sales.btns.depositCancelBtn.addClass('hide');//定金撤销按钮
        sales.btns.depositRefundBtn.addClass('hide');//定金退款按钮
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
    function initLabel(depositpayStatus, fullpayStatus, total, depositpay, fullpay, status){
        reductionLabel();
        if(status == 4){
            sales.items.realDepositPayment.val(0);
            sales.items.depositPayment.val(0);
            calcFullpayment(total);
            return false;
        }

        if (depositpayStatus == -1 && fullpayStatus == -1) { //未交定金和补款
            sales.btns.couponBtn.removeAttr('class', 'hide');//劵信息修改按钮
            sales.btns.malingBtn.removeAttr('class', 'hide');//抹零修改按钮
            sales.btns.depositPaymentBtn.removeAttr('class', 'hide');//定金交款按钮
            sales.btns.fullPaymentBtn.removeAttr('class', 'hide');//补款交款按钮
            sales.items.depositPayment.removeAttr("readonly");//款项中的定金输入框
            sales.items.depositPayment.val(0);
            sales.items.realDepositPayment.val('');
            sales.items.realFullPayment.val('');
            sales.items.depositPaymentInfo.html("");
            calcFullpayment(total);
        }

        if(depositpayStatus == -1 && fullpayStatus == 0){
            sales.btns.fullCancelBtn.removeAttr('class', 'hide');
            sales.items.fullPaymentInfo.html("提交中");
            sales.items.depositPayment.val('');
            sales.items.realDepositPayment.val('');
            calcFullpayment(total);
            sales.items.realFullPayment.val(sales.items.fullPayment.val());
        }

        if(depositpayStatus == 0 && fullpayStatus == -1){
            sales.items.depositPayment.val(depositpay);
            sales.items.realDepositPayment.val(depositpay);
            sales.items.depositPaymentInfo.html("提交中");
            calcFullpayment(total);
            sales.btns.depositCancelBtn.removeAttr('class', 'hide');
            sales.btns.couponBtn.removeAttr('class', 'hide');
            sales.btns.malingBtn.removeAttr('class', 'hide');
        }

        if(depositpayStatus == 1 && fullpayStatus == -1){
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

        if(depositpayStatus == 2 && fullpayStatus == -1){
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

        if(fullpayStatus == -1 && depositpayStatus == 1){
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

        if(fullpayStatus == 0 && depositpayStatus == 1){
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

        if(fullpayStatus == 0 && depositpayStatus == 2){
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

        if(fullpayStatus == 1 && depositpayStatus == -1){
            sales.items.realDepositPayment.val('');
            sales.items.depositPayment.val('');
            calcFullpayment(total);
            sales.items.realFullPayment.val(sales.items.fullPayment.val());
            sales.items.fullPaymentInfo.html("已收款");
        }

        if(fullpayStatus == 1 && depositpayStatus == 1){
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

        if(fullpayStatus == 1 && depositpayStatus == 2) {
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

        if(fullpayStatus == 2 && depositpayStatus == -1){
            sales.items.realDepositPayment.val('');
            sales.items.depositPayment.val('');
            calcFullpayment(total);
            sales.items.realFullPayment.val(sales.items.fullPayment.val());
            sales.items.fullPaymentInfo.html("已确认");
        }

        if(fullpayStatus == 2 && depositpayStatus == 1) {
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

        if(fullpayStatus == 2 && depositpayStatus == 2) {
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

        if(fullpayStatus == -1 && sales.items.fullPayment.val() < 0 && depositpayStatus != 0){
            calcFullpayment(total);
            sales.btns.fullPaymentRefundBtn.removeAttr('class', 'hide');
            sales.btns.fullPaymentBtn.addClass('hide');
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

    function printPayment(orderId, sid) {
        params.salesSid = sid;
        com.popup("专用合同__装修单号：" + orderId, api.index.salesPrintIndex.url, function () {
            parent.layer.getFrameIndex(window.name);
        }, null, true);
    }
});
