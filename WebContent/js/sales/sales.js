var salesSubOrderPostData = {};

$(function () {
    var salesPostData = {};
    var salesPaymentPostData = [];
    var refundPostData = [];
    var salesPaymentDic = {};
    var salesDic = {};

    var url = api.inventory.pageSales;
    var postData = "salesPostData";

    if (params['urlLoadParams'].type == "advance") {
        url = api.inventory.pageSalesForAdvance;
        postData = "salesForAdvancePostData";
    } else if (params['urlLoadParams'].type == "dompany") {
        url = api.inventory.pageSalesForDompany;
        postData = "salesForDompanyPostData";
    }else if(params['urlLoadParams'].type == "pompany"){
        url = api.inventory.pageSalesForPompany;
        postData = "salesForPompanyPostData";
    }

    var type = {
        depositPayment: 2,         //定金交款
        fullPayment: 3,           //补款交款
        depositPaymentRefund: 7, //定金退款
        fullPaymentRefund: 5   //补款退款
    };

    var salesPostDataString = {
        sid: "sales.sid",
        coupon: "sales.coupon",
        couponInfo: "sales.couponInfo"
    };

    var salesPaymentPostDataString = {
        sid: "salesPayment.sales.sid",
        referMoney: "salesPayment.referMoney",
        type: "salesPayment.type"
    };

    var querySales = {
        fullPaymentBtn: com.focusPage('#fullPaymentBtn'),
        fullPaymentRefundBtn: com.focusPage('#fullPaymentRefundBtn'),
        fullCancelBtn: com.focusPage('#fullCancelBtn'),
        depositPaymentBtn: com.focusPage('#depositPaymentBtn'),
        depositCancelBtn: com.focusPage('#depositCancelBtn'),
        depositRefundBtn: com.focusPage('#depositRefundBtn'),
        couponBtn: com.focusPage('#couponBtn'),
        couponCommitBtn: com.focusPage('#couponCommitBtn'),
        couponCancelBtn: com.focusPage('#couponCancelBtn'),
        couponRefundBtn: com.focusPage('#couponRefundBtn'),
        malingBtn: com.focusPage('#malingBtn'),
        malingCommitBtn: com.focusPage('#malingCommitBtn'),
        malingCancelBtn: com.focusPage('#malingCancelBtn'),

        total: com.focusPage('#total'),
        depositPayment: com.focusPage('#depositPayment'),
        realDepositPayment: com.focusPage('#realDepositPayment'),
        fullPayment: com.focusPage('#fullPayment'),
        realFullPayment: com.focusPage('#realFullPayment'),
        couponInf: com.focusPage('#couponInf'),
        couponType: com.focusPage('#couponType'),
        couponValue: com.focusPage('#couponValue'),
        coupon: com.focusPage('#coupon'),
        maling: com.focusPage('#maling'),
        malingValue: com.focusPage('#malingValue'),

        couponInfoDiv: com.focusPage('#couponInfo'),
        malingInfoDiv: com.focusPage('#malingInfo'),

        depositPaymentInfo: com.focusPage('#depositPaymentInfo'),
        fullPaymentInfo: com.focusPage('#fullPaymentInfo')
    };
    var $layerAdd = com.focusPage('#layerAdd');
    var $layerSubmit = com.focusPage('#layerSubmit');


    var fullPaymentTotal = com.focusPage('#fullPaymentTotal');
    var approver = com.focusPage('#approver');
    var approvalComment = com.focusPage('#approvalComment');


    /**
     * 回调函数必须提供 init(tableId, result.list)方法
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

                    var status = "";
                    var balanceStatus = "";

                    switch (v.status) {
                        case 0:
                            status = "初始";
                            break;
                        case 2:
                            status = "全退";
                            break;
                        case 3:
                            status = "倒单";
                            break;
                        case 4:
                            status = "废单";
                            break;
                        case 5:
                            status = "完结";
                            break;

                    }

                    switch (v.balanceStatus) {
                        case 0:
                            balanceStatus = "初始";
                            break;
                        case 1:
                            balanceStatus = "预结算";
                            break;
                        case 2:
                            balanceStatus = " 厂商结算";
                            break;
                        case 3:
                            balanceStatus = " 结算";
                            break;

                    }
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
                        ["状态:", status, "red"],
                        ["结算状态:", balanceStatus, "red"],
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

                    $btnDiv.append($btnDecoration);
                    if (params['urlLoadParams'].type == "dompany") {
                        $btnDiv.append($btnSub).append($btnCollect).append($btnAct).append($btnRefund).appendTo($h3);
                    }else if(params['urlLoadParams'].type == "pompany"){
                        if (v.fullpayStatus == -1 && v.status != 4) {
                            $btnDiv.append($btnAdd);
                        }else{
                            $btnDiv.append($btnSupplement);
                        }
                        $btnDiv.append($btnSub).append($btnMoney).append($btnCollect).append($btnRefund).append($btnPrint).append($btnAct).appendTo($h3);
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

                    $btnAdd.click(function () {
                        params["sid"] = v.sid;
                        com.switchPage(api.index.addSalesItemsIndex.url);
                    });

                    $btnSub.click(function () {

                        params["sid"] = v.sid;
                        params["fullpayStatus"] = v.fullpayStatus;
                        params["status"] = v.status;
                        params["depositpayStatus"] = v.depositpayStatus;
                        params["dompany"] = params['urlLoadParams'].type;

                        com.switchPage(api.index.salesItemDetialIndex.url);
                    });

                    //补单按钮
                    $btnSupplement.click(function () {
                        params["sid"] = v.sid;
                        params["bid"] = v.bid;
                        params["fullpayStatus"] = v.fullpayStatus;
                        params["status"] = v.status;
                        params["depositpayStatus"] = v.depositpayStatus;
                        params["dompany"] = params['urlLoadParams'].type;
                        com.switchPage(api.index.salesSupplement.url);
                    });

                    $btnCollect.click(function () {
                        params["sid"] = v.sid;
                        com.switchPage(api.index.salesCollectionIndex.url);
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
                            com.focusPage("#decorationInfo").modal("show");
                        });

                    });

                    $btnMoney.click(function () {

                        if (v.fullpayStatus == 3) {
                            com.showAlert(com.warning, "款项正在审批中,无法进行操作");
                            return false;
                        }

                        $layerAdd.attr("data-sid", v.sid);

                        var total = $layerAdd.find('input[id="total"]').val(v.total);
                        var depositPayment = $layerAdd.find('input[id="depositPayment"]').val();
                        var realDepositPayment = $layerAdd.find('input[id="realDepositPayment"]').val();
                        var fullPayment = $layerAdd.find('input[id="fullPayment"]').val();
                        var realFullPayment = $layerAdd.find('input[id="realFullPayment"]').val();
                        var maling = $layerAdd.find('input[id="maling"]').val(v.maling + v.venderMaling);
                        var coupon = $layerAdd.find('input[id="coupon"]').val(v.coupon);
                        var couponInfo = $layerAdd.find('input[id="couponInf"]').val(v.couponInfo.substring(1, v.couponInfo.length - 1));

                        com.post(api.ds.payment, {}, function (res) {
                            com.focusPage("#couponType").bindData(res.materialCouponTypes, 'key', 'value', false);
                        }, null, false);

                        openmoneylayer(function () {

                            layer.closeAll();

                        }, v);

                    });

                    $btnRefund.click(function () {

                        params["sid"] = v.sid;

                        com.switchPage(api.index.refundsItemDetialIndex.url);

                    });

                    $btnAct.click(function () {

                        params["sid"] = v.sid;
                        params["orderId"] = v.orderId;
                        params["no"] = v.no;
                        params["activityId"] = v.activityId;

                        com.switchPage(api.index.salesActivityIndex.url);
                    });

                    /*$btnPrint.click(function () {

                     printPayment(v.orderId, v.sid);

                     });*/

                    if (!salesDic[v.sid]) {
                        salesDic[v.sid] = $.extend({}, v);
                    }

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

    salesSearcher.init(_condArr, "condList", url, function (data) {

        displayFunc.init('resultList', data);


    }, "pagenation", postData, null, false, null);

    initButtons();

    function openmoneylayer(f, v) {

        layer.open({
            type: 1,
            skin: 'layui-layer-lan',
            title: "款项",
            content: $layerAdd,
            area: ($(window).width() * 0.6 < 620 ? $(window).height() * 0.6 : 620) + "px",
            //maxmin: true,
            zIndex: 9000,
            btn: ['确定'],
            success: function (layer, index) {
                hideButtons([querySales.depositPaymentBtn, querySales.depositCancelBtn, querySales.depositRefundBtn,
                    querySales.fullCancelBtn, querySales.fullPaymentBtn, querySales.fullPaymentRefundBtn, querySales.couponBtn,
                    querySales.couponCommitBtn, querySales.couponCancelBtn, querySales.couponRefundBtn,
                    querySales.malingBtn, querySales.malingCancelBtn, querySales.malingCommitBtn
                ]);
                hideDiv([querySales.malingInfoDiv, querySales.couponInfoDiv]);
                addReadonly([querySales.depositPayment, querySales.fullPayment]);
                moneyLayerIn(v);

            },
            end: function () {
                moneyLayerOut();
                salesSearcher.doSearch();
            }
        });
    }

    function openSubmitlayer(callback) {
        layer.closeAll();
        layer.open({
            type: 1,
            skin: 'layui-layer-lan',
            title: "补款审批",
            content: $layerSubmit,
            area: ($(window).width() * 0.6 < 600 ? $(window).height() * 0.6 : 600) + "px",
            //maxmin: true,
            zIndex: 9000,
            btn: ['提交', '取消'],
            yes: function (index, layero) {
                callback(index, layero);
            },
            btn2: function (index, layero) {
                //按钮【按钮二】的回调
                com.clearValidator();
                closefullPaymentlayer();
                com.focusPage('#approver').empty();
            },
            cancel: function () {
                //右上角关闭回调
                com.clearValidator();
                closefullPaymentlayer();
                com.focusPage('#approver').empty();
            }
        });
    }

    function closefullPaymentlayer() {
        approvalComment.val("");
        approver.val("");
        approver.removeAttr('data-typeahead-key');
        salesSearcher.doSearch();
    }


    function initButtons() {

        var despid = "";
        var fuspid = "";
        var despidNew = "";
        var fuspidNew = "";
        var furspid = "";

        //定金
        querySales.depositPaymentBtn.on('click', function () {

            var sales = salesDic[$layerAdd.attr("data-sid")];

            var numRex = /^(\d+|\d+\.[0-9]{1,4})$/;
            if (querySales.depositPayment.val() <= 0 || !numRex.test(querySales.depositPayment.val())) {

                com.showAlert(com.error, "定金输入不正确");

                return false;
            }

            com.post(api.payment.addSalesPaymentForDeposit, makeSalesPaymentPostData(sales.sid, querySales.depositPayment.val(), type.depositPayment), function (res) {

                querySales.realDepositPayment.val(querySales.depositPayment.val());
                hideButtons([querySales.depositPaymentBtn, querySales.fullPaymentBtn]);
                controlSpan(querySales.depositPaymentInfo, "add", "提交中");
                calcFullpayment(sales.total);
                showButtons([querySales.depositCancelBtn, querySales.couponBtn, querySales.malingBtn]);
                despidNew = res.salesPayment.spid;

            }, function (e) {
                com.showAlert(com.error, e.errorMsg);
            }, false);

            return false;
        });

        //定金撤销
        querySales.depositCancelBtn.on('click', function () {

            var sales = salesDic[$layerAdd.attr("data-sid")];

            if (despidNew) {
                despid = despidNew;
            } else if (salesPaymentDic[type.depositPayment]) {
                despid = salesPaymentDic[type.depositPayment].spid;
            }

            com.post(api.payment.cancelSalesPaymentForDeposit, {"salesPayment.spid": despid}, function () {
                hideButtons([querySales.depositCancelBtn]);
                showButtons([querySales.depositPaymentBtn, querySales.fullPaymentBtn]);
                querySales.depositPayment.val(0);
                querySales.realDepositPayment.val(0);
                calcFullpayment(sales.total);
                controlSpan(querySales.depositPaymentInfo, "clear", "");
                removeReadonly([querySales.depositPayment]);

            });

            return false;
        });

        //定金退款
        querySales.depositRefundBtn.on('click', function () {


            var sales = salesDic[$layerAdd.attr("data-sid")];

            com.post(api.payment.refundSalesPaymentForDeposit, {"salesPayment.sales.sid": sales.sid}, function () {

                controlSpan(querySales.depositPaymentInfo, "clear", null);
                querySales.depositPayment.val(0);
                querySales.realDepositPayment.val(0);
                hideButtons([querySales.depositPaymentBtn, querySales.depositCancelBtn, querySales.depositRefundBtn,
                    querySales.fullCancelBtn, querySales.fullPaymentBtn, querySales.fullPaymentRefundBtn, querySales.couponBtn,
                    querySales.couponCommitBtn, querySales.couponCancelBtn, querySales.couponRefundBtn,
                    querySales.malingBtn, querySales.malingCancelBtn, querySales.malingCommitBtn
                ]);
                removeReadonly([querySales.depositPayment]);
                calcFullpayment(sales.total);

            }, function (e) {
                com.showAlert(com.error, e.errorMsg);
            }, false);

            return false;
        });

        //补款
        querySales.fullPaymentBtn.on('click', function () {

            var sales = salesDic[$layerAdd.attr("data-sid")];

            //判断otherStatus状态
            com.post(api.inventory.querySalesBySid, {'sales.sid': sales.sid}, function (res) {

                if (res.sales.otherStatus == 1) {

                    approvalUtils.initqueryApprovalUser('approver', 12);

                    openSubmitlayer(function (index, layero) {

                        var _approval = com.focusPage('#approver');

                        var radios = _approval.find('input:checked').attr('userid');

                        if (com.validate('layerSubmit', 'right')) {
                            return;
                        }

                        if (radios == null || radios == "") {
                            com.showAlert(com.warning, "请选择审批人");
                            return false;
                        }

                        var _options = {};
                        _options['approval.receiver.userId'] = radios;
                        _options['approval.comment'] = approvalComment.val();
                        _options['approvalSalesDiscount.sid'] = sales.sid;
                        _options['approvalSalesDiscount.referMoney'] = fullPaymentTotal.val();

                        com.post(api.approval.submitApprovalForSalesDiscount, _options, function (res) {
                            closefullPaymentlayer();
                            layer.closeAll();
                            com.showAlert(com.warning, "补款申请已提交");
                            com.focusPage('#approver').empty();
                        }, function (e) {
                            com.showAlert(com.error, e.errorMsg);
                        });

                    });
                }
                else {

                    com.post(api.payment.addSalesPaymentForFullpay, makeSalesPaymentPostData(sales.sid, querySales.fullPayment.val(), type.fullPayment), function (res) {

                        querySales.realFullPayment.val(querySales.fullPayment.val());
                        hideButtons([querySales.fullPaymentBtn, querySales.couponBtn, querySales.malingBtn, querySales.depositPaymentBtn, querySales.depositRefundBtn]);
                        hideDiv([querySales.couponInfoDiv, querySales.malingInfoDiv]);
                        showButtons([querySales.fullCancelBtn]);
                        addReadonly([querySales.depositPayment])
                        controlSpan(querySales.fullPaymentInfo, "add", "提交中");

                        fuspidNew = res.salesPayment.spid;

                    }, function (e) {
                        com.showAlert(com.error, e.errorMsg);
                    }, false);

                }

            }, function (e) {
                com.showAlert(com.error, e.errorMsg);
            });

            return false;
        });

        //补款撤销
        querySales.fullCancelBtn.on('click', function () {

            var sales = salesDic[$layerAdd.attr("data-sid")];

            if (fuspidNew || salesPaymentDic[type.fullPayment]) {
                if (fuspidNew) {
                    fuspid = fuspidNew;
                } else if (salesPaymentDic[type.fullPayment]) {
                    fuspid = salesPaymentDic[type.fullPayment].spid;
                }
                com.post(api.payment.cancelSalesPaymentForFullpay, {"salesPayment.spid": fuspid}, function () {

                    hideButtons([querySales.fullCancelBtn]);
                    removeReadonly([querySales.depositPayment]);
                    hideDiv([querySales.couponInfoDiv, querySales.malingInfoDiv]);
                    showButtons([querySales.fullPaymentBtn, querySales.couponBtn, querySales.malingBtn]);
                    querySales.realFullPayment.val(0);
                    controlSpan(querySales.fullPaymentInfo, "clear", "");
                    calcFullpayment(sales.total);
                    fuspidNew = "";

                    if (sales.depositpayStatus == -1) {
                        showButtons([querySales.depositPaymentBtn]);
                    } else {
                        showButtons([querySales.depositRefundBtn]);
                    }

                });
            }

            if (furspid || salesPaymentDic[type.fullPaymentRefund]) {

                if (furspid) {
                    fuspid = furspid;
                } else if (salesPaymentDic[type.fullPaymentRefund]) {
                    fuspid = salesPaymentDic[type.fullPaymentRefund].spid;
                }
                com.post(api.payment.cancelSalesPaymentForFullpay, {"salesPayment.spid": fuspid}, function () {

                    hideButtons([querySales.fullCancelBtn]);
                    removeReadonly([querySales.depositPayment]);
                    hideDiv([querySales.couponInfoDiv, querySales.malingInfoDiv]);
                    showButtons([querySales.fullPaymentRefundBtn, querySales.couponBtn, querySales.malingBtn]);
                    querySales.realFullPayment.val(0);
                    controlSpan(querySales.fullPaymentInfo, "clear", "");
                    calcFullpayment(sales.total);
                    furspid = "";

                    if (sales.depositpayStatus == -1) {
                        showButtons([querySales.depositPaymentBtn]);
                    } else {
                        showButtons([querySales.depositRefundBtn]);
                    }
                });
            }


            return false;
        });

        //补款退款
        querySales.fullPaymentRefundBtn.on('click', function () {

            var sales = salesDic[$layerAdd.attr("data-sid")];

            com.post(api.payment.addSalesPaymentForFullpay, makeSalesPaymentPostData(sales.sid, querySales.fullPayment.val(), type.fullPaymentRefund), function (res) {

                controlSpan(querySales.fullPaymentInfo, "add", "提交中");
                querySales.realFullPayment.val(querySales.fullPayment.val());
                calcFullpayment(sales.total);
                hideButtons([querySales.fullPaymentRefundBtn, querySales.couponBtn, querySales.malingBtn, querySales.depositCancelBtn, querySales.depositPaymentBtn, querySales.depositRefundBtn]);
                showButtons([querySales.fullCancelBtn]);
                addReadonly([querySales.depositPayment]);
                furspid = res.salesPayment.spid;

            }, function (e) {
                com.showAlert(com.error, e.errorMsg);
            }, false);

            return false;
        });

        //券修改
        querySales.couponBtn.on('click', function () {

            showDiv([querySales.couponInfoDiv]);
            hideButtons([querySales.couponBtn]);
            showButtons([querySales.couponCommitBtn, querySales.couponCancelBtn]);

            return false;
        });

        //券提交
        querySales.couponCommitBtn.on('click', function () {

            var sales = salesDic[$layerAdd.attr("data-sid")];

            var numRex = /^(\d+|\d+\.[0-9]{1,4})$/;
            if (querySales.couponValue.val() < 0 || !numRex.test(querySales.couponValue.val())) {

                com.showAlert(com.error, "券值输入不正确");

                return false;
            }

            var couponPostData = {
                "sales.sid": sales.sid,
                "sales.coupon": querySales.couponValue.val(),
                "sales.couponInfo": "#" + querySales.couponType.val() + ":" + querySales.couponValue.val() + "#"
            };

            com.post(api.inventory.updateSalesForCoupon, couponPostData, function () {

                querySales.couponInf.val(querySales.couponType.val() + ":" + querySales.couponValue.val());
                querySales.coupon.val(querySales.couponValue.val());
                hideDiv([querySales.couponInfoDiv]);
                showButtons([querySales.couponBtn]);
                calcFullpayment(sales.total);

            }, function (e) {
                com.showAlert(com.error, e.errorMsg);
            }, false);

            return false;
        });

        //券取消
        querySales.couponCancelBtn.on('click', function () {

            hideDiv([querySales.couponInfoDiv]);
            showButtons([querySales.couponBtn]);

            return false;
        });

        //抹零修改
        querySales.malingBtn.on('click', function () {
            showDiv([querySales.malingInfoDiv]);
            hideButtons([querySales.malingBtn]);
            showButtons([querySales.malingCommitBtn, querySales.malingCancelBtn]);
            return false;
        });

        //抹零提交
        querySales.malingCommitBtn.on('click', function () {

            var sales = salesDic[$layerAdd.attr("data-sid")];
            var numRex = /^(\d+|\d+\.[0-9]{1,4})$/;
            if (querySales.malingValue.val() < 0 || !numRex.test(querySales.malingValue.val())) {

                com.showAlert(com.error, "抹零输入不正确");

                return false;
            }

            var malingPostData = {
                "sales.sid": sales.sid,
                "sales.maling": 0,
                "sales.venderMaling": querySales.malingValue.val()
            };

            com.post(api.inventory.updateSalesForMaling, malingPostData, function () {

                querySales.maling.val(querySales.malingValue.val());
                hideDiv([querySales.malingInfoDiv]);
                querySales.malingValue.val(0);
                showButtons([querySales.malingBtn]);
                calcFullpayment(sales.total);

            }, function (e) {
                com.showAlert(com.error, e.errorMsg);
            }, false);

            return false;
        });

        //抹零取消
        querySales.malingCancelBtn.on('click', function () {

            hideDiv([querySales.malingInfoDiv]);
            showButtons([querySales.malingBtn]);
            querySales.malingValue.val(0);
            return false;
        });
    }

    function moneyLayerIn(sales) {

        //弹窗按钮控制
        querySales.couponValue.on('keydown', function (event) {
            if (event.keyCode == "13") {//keyCode=13是回车键
                return false;
            }
        });

        querySales.malingValue.on('keypress', function (event) {
            if (event.keyCode == "13") {//keyCode=13是回车键
                return false;
            }
        });

        salesPostData = {};
        salesPostData[salesPostDataString.sid] = sales.sid;

        refundPostData = {};
        refundPostData[salesPostDataString.sid] = sales.sid;

        com.post(api.payment.querySalesPaymentBySid, makeSalesPaymentPostData(sales.sid), function (data) {
            $.each(data.salesPayments, function (i, v) {

                if (!salesPaymentDic[v.type]) {
                    salesPaymentDic[v.type] = $.extend({}, v);
                }

            });
        }, null, false);

        //判断区
        if (sales.depositpayStatus == -1 && sales.fullpayStatus == -1) {//未交定金和补款

            showButtons([querySales.depositPaymentBtn, querySales.couponBtn, querySales.malingBtn, querySales.fullPaymentBtn]);
            removeReadonly([querySales.depositPayment]);
            querySales.depositPayment.val(0);
            calcFullpayment(sales.total);

        } else {
            if (sales.depositpayStatus != -1) {
                if (sales.depositpayStatus == 0) {

                    showButtons([querySales.depositCancelBtn, querySales.couponBtn, querySales.malingBtn]);
                    controlSpan(querySales.depositPaymentInfo, "add", "提交中");
                    querySales.depositPayment.val(salesPaymentDic[type.depositPayment].referMoney);
                    querySales.realDepositPayment.val(salesPaymentDic[type.depositPayment].referMoney);
                    calcFullpayment(sales.total);

                } else if (sales.depositpayStatus == 1) {

                    showButtons([querySales.depositRefundBtn, querySales.couponBtn, querySales.malingBtn]);
                    controlSpan(querySales.depositPaymentInfo, "add", "已收款");
                    querySales.depositPayment.val(salesPaymentDic[type.depositPayment].referMoney);
                    querySales.realDepositPayment.val(salesPaymentDic[type.depositPayment].referMoney);
                    calcFullpayment(sales.total);

                } else if (sales.depositpayStatus == 2) {

                    showButtons([querySales.couponBtn, querySales.malingBtn, querySales.depositRefundBtn]);
                    controlSpan(querySales.depositPaymentInfo, "add", "已确认");
                    querySales.depositPayment.val(salesPaymentDic[type.depositPayment].referMoney);
                    querySales.realDepositPayment.val(salesPaymentDic[type.depositPayment].referMoney);
                    calcFullpayment(sales.total);

                }
            } else {
                showButtons([querySales.depositPaymentBtn]);
            }
            if (sales.fullpayStatus != -1) {
                hideButtons([querySales.depositPaymentBtn, querySales.depositRefundBtn, querySales.depositCancelBtn, querySales.couponBtn, querySales.malingBtn]);
                if (sales.fullpayStatus == 0) {

                    showButtons([querySales.fullCancelBtn]);
                    controlSpan(querySales.fullPaymentInfo, "add", "提交中");


                    if (salesPaymentDic[type.fullPayment]) {
                        querySales.fullPayment.val(salesPaymentDic[type.fullPayment].referMoney);
                        querySales.realFullPayment.val(salesPaymentDic[type.fullPayment].referMoney);
                    } else if (salesPaymentDic[type.fullPaymentRefund]) {
                        querySales.fullPayment.val(-salesPaymentDic[type.fullPaymentRefund].referMoney);
                        querySales.realFullPayment.val(-salesPaymentDic[type.fullPaymentRefund].referMoney);
                    }


                } else if (sales.fullpayStatus == 1) {

                    controlSpan(querySales.fullPaymentInfo, "add", "已收款");

                    if (salesPaymentDic[type.fullPayment]) {
                        querySales.fullPayment.val(salesPaymentDic[type.fullPayment].referMoney);
                        querySales.realFullPayment.val(salesPaymentDic[type.fullPayment].referMoney);
                    } else if (salesPaymentDic[type.fullPaymentRefund]) {
                        querySales.fullPayment.val(-salesPaymentDic[type.fullPaymentRefund].referMoney);
                        querySales.realFullPayment.val(-salesPaymentDic[type.fullPaymentRefund].referMoney);
                    }

                } else if (sales.fullpayStatus == 2) {

                    controlSpan(querySales.fullPaymentInfo, "add", "已确认");

                    if (salesPaymentDic[type.fullPayment]) {
                        querySales.fullPayment.val(salesPaymentDic[type.fullPayment].referMoney);
                        querySales.realFullPayment.val(salesPaymentDic[type.fullPayment].referMoney);
                    } else if (salesPaymentDic[type.fullPaymentRefund]) {
                        querySales.fullPayment.val(-salesPaymentDic[type.fullPaymentRefund].referMoney);
                        querySales.realFullPayment.val(-salesPaymentDic[type.fullPaymentRefund].referMoney);
                    }

                }
            } else {
                calcFullpayment(sales.total);
                if (querySales.fullPayment.val() < 0) {
                    if (sales.depositpayStatus != 0) {
                        showButtons([querySales.fullPaymentRefundBtn]);
                    }
                } else {
                    if (sales.depositpayStatus != 0) {
                        showButtons([querySales.fullPaymentBtn]);
                    }

                }
            }


        }

    }

    function moneyLayerOut() {

        hideButtons([querySales.depositPaymentBtn, querySales.depositCancelBtn, querySales.depositRefundBtn,
            querySales.fullCancelBtn, querySales.fullPaymentBtn, querySales.fullPaymentRefundBtn, querySales.couponBtn,
            querySales.couponCommitBtn, querySales.couponCancelBtn, querySales.couponRefundBtn,
            querySales.malingBtn, querySales.malingCancelBtn, querySales.malingCommitBtn
        ]);
        hideDiv([querySales.malingInfoDiv, querySales.couponInfoDiv]);
        addReadonly([querySales.depositPayment, querySales.fullPayment]);
        clearCoupon();
        controlSpan(querySales.depositPaymentInfo, "clear", null);
        controlSpan(querySales.fullPaymentInfo, "clear", null);
        querySales.fullPayment.val("");
        querySales.realFullPayment.val("");
        querySales.depositPayment.val("");
        querySales.realDepositPayment.val("");
        salesPaymentDic = {};
        salesPostData = {};
        salesPaymentPostData = [];
        refundPostData = [];

    }

    function hideButtons(buttons) {
        $.each(buttons, function (i, v) {
            v.addClass('hide');
        });
    }

    function showButtons(buttons) {
        $.each(buttons, function (i, v) {
            v.removeAttr('class', 'hide');
        });
    }

    function hideDiv(divs) {
        $.each(divs, function (i, v) {
            v.css('display', 'none');
        });
    }

    function showDiv(divs) {
        $.each(divs, function (i, v) {
            v.css('display', 'inline');
        });
    }

    function addReadonly(item) {
        $.each(item, function (i, v) {
            v.attr("readonly", "readonly");
        });
    }

    function removeReadonly(item) {
        $.each(item, function (i, v) {
            v.removeAttr("readonly");
        });
    }

    function clearCoupon() {
        querySales.couponInf.val("");
        querySales.couponValue.val(0);
        querySales.malingValue.val(0);
    }

    function controlSpan(span, aoc, string) {
        if (aoc == "add") {
            span.html(string);
        } else if (aoc == "clear") {
            span.html("");
        }
    }

    function makeSalesPaymentPostData(sid, referMoney, type) {
        salesPaymentPostData = {};
        if (sid) {
            salesPaymentPostData[salesPaymentPostDataString.sid] = sid;
        }
        if (referMoney) {
            salesPaymentPostData[salesPaymentPostDataString.referMoney] = referMoney;
        }
        if (type) {
            salesPaymentPostData[salesPaymentPostDataString.type] = type;
        }
        return salesPaymentPostData;
    }

    function calcFullpayment(total) {

        var _total = checkVal(parseFloat(total));
        var depositPaymentVal = parseFloat(checkVal(querySales.depositPayment.val()));
        var couponVal = parseFloat(checkVal(querySales.coupon.val()));
        var malingVal = parseFloat(checkVal(querySales.maling.val()));

        var fullpaymentVal = utils.accSub(utils.accSub(utils.accSub(_total, depositPaymentVal), couponVal), malingVal);
        querySales.fullPayment.val(fullpaymentVal);

        com.focusPage('#fullPaymentTotal').val(fullpaymentVal);

    }

    function checkVal(val) {
        if (val == "") {
            return 0;
        } else {
            if (val < 0) {

                return 0;

            } else {

                return val;
            }

        }
    }

    function printPayment(orderId, sid) {
        params.salesSid = sid;
        // + "?sales.sid=" + sid + "&time=" + params.loginTime
        com.popup("专用合同__装修单号：" + orderId, api.index.salesPrintIndex.url, function () {
            parent.layer.getFrameIndex(window.name);
        }, null, true);


        /* var url = api.index.salesPrintIndex.url + "?sales.sid=" + sid + "&time=" + params.loginTime;
         window.open(url);*/
    }

});
