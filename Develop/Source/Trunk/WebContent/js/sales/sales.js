$(function () {

    var salesPostData = {};
    var salesPaymentPostData = [];
    var refundPostData = [];
    var salesPaymentDic = {};
    var salesDic = {};

    var type = {
        depositPayment: 2,
        fullPayment: 3,
        depositPaymentRefund: 7,
        fullPaymentRefund: 5
    };

    var salesPayment = {
        depositPaymentMoney: "",
        fullPaymentMoney: ""
    };

    var salesPostDataString = {
        sid: "sales.sid",
        coupon: "sales.coupon",
        couponInfo: "sales.couponInfo"
    };

    var salesPaymentPostDataString = {
        sid: "salesPayment.sid",
        salesid: "salesPayment.sales.sid",
        referMoney: "salesPayment.referMoney",
        category: "salesPayment.category",
        brand: "salesPayment.brand",
        type: "salesPayment.type"
    };

    var querySales = {
        fullPaymentBtn: $('#fullPaymentBtn'),
        fullPaymentRefundBtn: $('#fullPaymentRefundBtn'),
        fullCancelBtn: $('#fullCancelBtn'),
        depositPaymentBtn: $('#depositPaymentBtn'),
        depositCancelBtn: $('#depositCancelBtn'),
        depositRefundBtn: $('#depositRefundBtn'),
        couponBtn: $('#couponBtn'),
        couponCommitBtn: $('#couponCommitBtn'),
        couponCancelBtn: $('#couponCancelBtn'),
        couponRefundBtn: $('#couponRefundBtn'),
        malingBtn: $('#malingBtn'),
        malingCommitBtn: $('#malingCommitBtn'),
        malingCancelBtn: $('#malingCancelBtn'),

        total: $('#total'),
        depositPayment: $('#depositPayment'),
        realDepositPayment: $('#realDepositPayment'),
        fullPayment: $('#fullPayment'),
        realFullPayment: $('#realFullPayment'),
        couponInf: $('#couponInf'),
        couponType: $('#couponType'),
        couponValue: $('#couponValue'),
        coupon: $('#coupon'),
        maling: $('#maling'),
        malingValue: $('#malingValue'),

        couponInfoDiv: $('#couponInfo'),
        malingInfoDiv: $('#malingInfo'),

        depositPaymentInfo: $('#depositPaymentInfo'),
        fullPaymentInfo: $('#fullPaymentInfo')
    };
    var $layerAdd = $('#layerAdd');
    var $layerSubmit = $('#layerSubmit');


    var fullPaymentTotal = $('#fullPaymentTotal');
    var approver = $('#approver');
    var approvalComment = $('#approvalComment');


    /**
     * 回调函数必须提供 init(tableId, result.list)方法
     * tableId ,用来显示的div的id
     * result.list 列表的json数组
     * */
    var displayFunc = (function () {

        var renderList = function (tableId, listData) {

            var $tableWrap = $('#' + tableId);
            //var $ul = $('<ul></ul>').addClass('item-list ui-sortable  fl-table-list');
            var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');

            if (listData && listData.length) {
                $.each(listData, function (i, v) {

                    var $liLine = $('<li></li>').addClass('item-blue clearfix');
                    var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
                    var $h3 = $('<h3></h3>').css({'color': 'grey', "font-weight": "bold"}).html(' ' + v.no);
                    var $btnDiv = $('<div></div>').addClass('action-buttons pull-right');

                    var $btnAdd = $('<a></a>').addClass(' btn btn-minier').html('添项');
                    var $btnSub = $('<a></a>').addClass(' btn btn-minier ').html('子项');
                    var $btnMoney = $('<a></a>').addClass(' btn btn-minier ').html('款项');
                    var $btnCollect = $('<a></a>').addClass(' btn btn-minier ').html('收款');
                    var $btnRefund = $('<a></a>').addClass(' btn btn-minier ').html('退货');
                    var $btnPrint = $('<a></a>').addClass(' btn btn-minier ').html('打印');

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
                        ["订单编号:", v.orderId, "grey"],
                        ["楼盘地址:", v.village.villageName + " " + v.houseNumber, "grey"],
                        ["客户名:", v.customer.customerName, "grey"],
                        ["渠道:", v.salesman.userName, "grey"],
                        ["部门:", v.dept.deptName, "grey"],
                        ["分区:", v.region.deptName, "grey"],
                        ["导购:", v.guider.userName, "grey"],
                        ["驻店:", v.instorer.currentName, "grey"],
                        ["主材部:", v.guideDept.deptName, "grey"],
                        ["品类:", v.category, "grey"],
                        ["品牌:", v.brand, "grey"],
                        ["创建时间:", v.createTime, "grey"],
                        ["结算时间:", v.balanceTime, "grey"],
                        ["补款时间:", v.fullpayTime, "grey"],
                        ["状态:", status, "grey"],
                        ["结算状态:", balanceStatus, "grey"],
                        ["总额:", v.total, "grey"],
                        ["抹零:", v.maling, "grey"],
                        ["厂商抹零:", v.venderMaling, "grey"],
                        ["券值:", v.coupon, "grey"],
                        ["券信息:", v.couponInfo, "grey"],
                        ["备注:", v.comment, "grey"]
                    ];

                    $.each(propertyArr, function (index, value) {
                        var $liProperty = $('<li></li>').css({"border-bottom": "0px"});
                        $('<strong></strong>').html(value[0]).appendTo($liProperty);
                        $('<b></b>').html(value[1]).css({color: value[2]}).appendTo($liProperty);
                        $liProperty.appendTo($ulProperty);
                    });

                    $liLine.appendTo($ul);
                    $liLine.append($h3).append($ulProperty);

                    if (v.fullpayStatus == -1 && v.status != 4) {
                        $btnDiv.append($btnAdd);
                    }

                    if (v.status != 4) {
                        $btnDiv.append($btnSub).append($btnMoney)
                            .append($btnCollect).append($btnRefund).append($btnPrint).appendTo($h3);
                    } else {
                        $btnDiv.append($btnSub)
                            .append($btnCollect).append($btnRefund).appendTo($h3);
                    }


                    $btnAdd.click(function () {
                        params["sid"] = v.sid;
                        com.switchPage(api.index.addSalesItemsIndex.url);
                    });

                    $btnSub.click(function () {

                        params["sid"] = v.sid;
                        params["fullpayStatus"] = v.fullpayStatus;
                        params["status"] = v.status;
                        params["depositpayStatus"] = v.depositpayStatus;

                        com.switchPage(api.index.salesItemDetialIndex.url);
                    });


                    $btnCollect.click(function () {
                        params["sid"] = v.sid;
                        com.switchPage(api.index.salesCollectionIndex.url);
                    });

                    $btnMoney.click(function () {

                        if (v.fullpayStatus == 3) {
                            layer.msg("款项正在审批中,无法进行操作");
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
                            $("#couponType").bindData(res.materialCouponTypes, 'key', 'value', false);
                        }, null, false);

                        openmoneylayer(function () {

                            layer.closeAll();

                        }, v)

                    });

                    $btnRefund.click(function () {

                        params["sid"] = v.sid;


                        com.switchPage(api.index.refundsItemDetialIndex.url);
                    });

                    $btnPrint.click(function () {

                        printPayment(v.orderId, v.sid);

                    });

                    if (!salesDic[v.sid]) {
                        salesDic[v.sid] = $.extend({}, v)
                    }

                });

                $ul.appendTo($tableWrap);
            }
        };


        return {
            init: function (tableId, listData) {
                $('#' + tableId).html(null);
                renderList(tableId, listData);
            }
        };


    })();

    /*分页*/
    var _condArr = ['no', 'orderId', 'instorerId', 'salesmanId', 'salesDeptName'];

    var salesSearcher = new Searcher();

    salesSearcher.init(_condArr, "condList", api.inventory.pageSales, function (data) {

        displayFunc.init('resultList', data);


    }, "pagenation", "salesPostData", null, false, null);

    initButtons();

    function openmoneylayer(f, v) {

        layer.open({
            type: 1,
            skin: 'layui-layer-lan',
            title: "款项",
            content: $layerAdd,
            area: ( $(window).width() * 0.6 < 620 ? $(window).height() * 0.6 : 620 ) + "px",
            maxmin: true,
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
            area: ( $(window).width() * 0.6 < 600 ? $(window).height() * 0.6 : 600 ) + "px",
            maxmin: true,
            zIndex: 9000,
            btn: ['提交', '取消'],
            yes: function (index, layero) {
                callback(index, layero);
            },
            btn2: function (index, layero) {
                //按钮【按钮二】的回调
                closefullPaymentlayer()
                $('#approver').empty();
            },
            cancel: function () {
                //右上角关闭回调
                closefullPaymentlayer()
                $('#approver').empty();
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

        querySales.depositPaymentBtn.on('click', function () {

            var sales = salesDic[$layerAdd.attr("data-sid")];
            var numRex = /^(\d+|\d+\.[0-9]{1,4})$/;
            if (querySales.depositPayment.val() <= 0 || !numRex.test(querySales.depositPayment.val())) {

                com.showAlert(com.error, "定金输入不正确");

                return false;
            }

            com.post(api.payment.addSalesPayment, makeSalesPaymentPostData(sales.sid, null, querySales.depositPayment.val(),
                sales.category, sales.brand, type.depositPayment), function (res) {

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

        querySales.depositCancelBtn.on('click', function () {

            var sales = salesDic[$layerAdd.attr("data-sid")];

            if (despidNew) {
                despid = despidNew;
            } else if (salesPaymentDic[type.depositPayment]) {
                despid = salesPaymentDic[type.depositPayment].spid;
            }

            com.post(api.payment.cancelSalesPayment, {"salesPayment.spid": despid}, function () {
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
        querySales.depositRefundBtn.on('click', function () {

            var sales = salesDic[$layerAdd.attr("data-sid")];

            com.post(api.payment.refundSalesPayment, makeSalesPaymentPostData(sales.sid, null, querySales.depositPayment.val(),
                null, null, type.depositPaymentRefund), function () {

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

        querySales.fullPaymentBtn.on('click', function () {

            var sales = salesDic[$layerAdd.attr("data-sid")];

            //判断otherStatus状态
            com.post(api.inventory.querySalesBySid, {'sales.sid': sales.sid}, function (res) {

                if (res.sales.otherStatus == 1) {

                    approvalUtils.initqueryApprovalUser('approver',12);

                    openSubmitlayer(function (index, layero) {

                        var _approval = $('#approver')

                        var radios = _approval.find('input:checked').attr('userid');

                        //checkApproval(approver, "审批人不能为空", "right")
                        if (!checkApproval(approvalComment, "备注不能为空", "right")) {
                            return;
                        }

                        if ( radios == null || radios == "") {
                            layer.msg('请选择审批人', {time: 3e3});
                            return false;
                        }

                        var _options = {};
                        _options['approval.receiverId'] = radios
                        _options['approval.comment'] = approvalComment.val();
                        _options['approvalSalesDiscount.sid'] = sales.sid;
                        _options['approvalSalesDiscount.referMoney'] = fullPaymentTotal.val();

                        com.post(api.approval.submitApprovalForSalesDiscount, _options,
                            function (res) {
                                closefullPaymentlayer();
                                layer.closeAll();
                                layer.msg("补款申请已提交.")
                                $('#approver').empty();
                            }, function (e) {
                                com.showAlert(com.error, e.errorMsg);
                            })
                    })
                }
                else {

                    com.post(api.payment.addSalesPayment, makeSalesPaymentPostData(sales.sid, null, querySales.fullPayment.val(),
                        sales.category, sales.brand, type.fullPayment), function (res) {

                        querySales.realFullPayment.val(querySales.fullPayment.val());
                        hideButtons([querySales.fullPaymentBtn, querySales.couponBtn, querySales.malingBtn, querySales.depositPaymentBtn, querySales.depositRefundBtn]);
                        hideDiv([querySales.couponInfoDiv, querySales.malingInfoDiv]);
                        showButtons([querySales.fullCancelBtn]);
                        controlSpan(querySales.fullPaymentInfo, "add", "提交中");
                        fuspidNew = res.salesPayment.spid;

                    }, function (e) {
                        com.showAlert(com.error, e.errorMsg);
                    }, false);

                }

            }, function (e) {
                com.showAlert(com.error, e.errorMsg);
            })

            return false;
        });


        querySales.fullCancelBtn.on('click', function () {

            var sales = salesDic[$layerAdd.attr("data-sid")];


            if (fuspidNew || salesPaymentDic[type.fullPayment]) {
                if (fuspidNew) {
                    fuspid = fuspidNew;
                } else if (salesPaymentDic[type.fullPayment]) {
                    fuspid = salesPaymentDic[type.fullPayment].spid;
                }
                com.post(api.payment.cancelSalesPayment, {"salesPayment.spid": fuspid}, function () {

                    hideButtons([querySales.fullCancelBtn]);
                    hideDiv([querySales.couponInfoDiv, querySales.malingInfoDiv]);
                    showButtons([querySales.fullPaymentBtn, querySales.couponBtn, querySales.malingBtn]);
                    querySales.realFullPayment.val(0);
                    controlSpan(querySales.fullPaymentInfo, "clear", "");
                    calcFullpayment(sales.total);

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
                com.post(api.payment.cancelSalesPayment, {"salesPayment.spid": fuspid}, function () {

                    hideButtons([querySales.fullCancelBtn]);
                    hideDiv([querySales.couponInfoDiv, querySales.malingInfoDiv]);
                    showButtons([querySales.fullPaymentRefundBtn, querySales.couponBtn, querySales.malingBtn]);
                    querySales.realFullPayment.val(0);
                    controlSpan(querySales.fullPaymentInfo, "clear", "");
                    calcFullpayment(sales.total);

                    if (sales.depositpayStatus == -1) {
                        showButtons([querySales.depositPaymentBtn]);
                    } else {
                        showButtons([querySales.depositRefundBtn]);
                    }
                });
            }


            return false;
        });
        querySales.fullPaymentRefundBtn.on('click', function () {

            var sales = salesDic[$layerAdd.attr("data-sid")];

            com.post(api.payment.refundSalesPayment, makeSalesPaymentPostData(sales.sid, null, -querySales.fullPayment.val(),
                null, null, type.fullPaymentRefund), function (res) {

                controlSpan(querySales.fullPaymentInfo, "add", "提交中");
                querySales.realFullPayment.val(querySales.fullPaymentInfo.val());
                calcFullpayment(sales.total);
                hideButtons([querySales.fullPaymentRefundBtn, querySales.couponBtn, querySales.malingBtn, querySales.depositCancelBtn, querySales.depositPaymentBtn, querySales.depositRefundBtn]);
                showButtons([querySales.fullCancelBtn]);
                furspid = res.salesPayment.spid;

            }, function (e) {
                com.showAlert(com.error, e.errorMsg);
            }, false);

            return false;
        });

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
                showButtons([querySales.malingBtn]);
                calcFullpayment(sales.total);

            }, function (e) {
                com.showAlert(com.error, e.errorMsg);
            }, false);
            return false;
        });
        querySales.couponBtn.on('click', function () {

            showDiv([querySales.couponInfoDiv]);
            hideButtons([querySales.couponBtn]);
            showButtons([querySales.couponCommitBtn, querySales.couponCancelBtn]);

            return false;
        });


        querySales.couponCancelBtn.on('click', function () {
            hideDiv([querySales.couponInfoDiv]);
            showButtons([querySales.couponBtn]);

            return false;
        });

        querySales.malingBtn.on('click', function () {
            showDiv([querySales.malingInfoDiv]);
            hideButtons([querySales.malingBtn]);
            showButtons([querySales.malingCommitBtn, querySales.malingCancelBtn]);
            return false;
        });

        querySales.malingCancelBtn.on('click', function () {

            hideDiv([querySales.malingInfoDiv]);
            showButtons([querySales.malingBtn]);

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

        com.post(api.payment.querySalesPaymentBySid, makeSalesPaymentPostData(null, sales.sid), function (data) {
            $.each(data.salesPayments, function (i, v) {

                if (!salesPaymentDic[v.type]) {
                    salesPaymentDic[v.type] = $.extend({}, v);
                }

            })
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
                        showButtons([querySales.fullPaymentRefundBtn])
                    }
                } else {
                    if (sales.depositpayStatus != 0) {
                        showButtons([querySales.fullPaymentBtn])
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
        })
    }

    function showButtons(buttons) {
        $.each(buttons, function (i, v) {
            v.removeAttr('class', 'hide');
        })
    }

    function hideDiv(divs) {
        $.each(divs, function (i, v) {
            v.css('display', 'none');
        })
    }

    function showDiv(divs) {
        $.each(divs, function (i, v) {
            v.css('display', 'inline');
        })
    }

    function addReadonly(item) {
        $.each(item, function (i, v) {
            v.attr("readonly", "readonly");
        })
    }

    function removeReadonly(item) {
        $.each(item, function (i, v) {
            v.removeAttr("readonly");
        })
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

    function makeSalesPaymentPostData(sid, salesid, referMoney, category, brand, type) {
        salesPaymentPostData = {};
        if (sid) {
            salesPaymentPostData[salesPaymentPostDataString.sid] = sid
        }
        if (salesid) {
            salesPaymentPostData[salesPaymentPostDataString.salesid] = salesid
        }
        if (referMoney) {
            salesPaymentPostData[salesPaymentPostDataString.referMoney] = referMoney
        }
        if (category) {
            salesPaymentPostData[salesPaymentPostDataString.category] = category
        }
        if (brand) {
            salesPaymentPostData[salesPaymentPostDataString.brand] = brand
        }
        if (type) {
            salesPaymentPostData[salesPaymentPostDataString.type] = type
        }
        return salesPaymentPostData;
    }

    function calcFullpayment(total) {

        var total = checkVal(parseFloat(total));
        var depositPaymentVal = parseFloat(checkVal(querySales.depositPayment.val()));
        var couponVal = parseFloat(checkVal(querySales.coupon.val()));
        var malingVal = parseFloat(checkVal(querySales.maling.val()));

        var fullpaymentVal = total - depositPaymentVal - couponVal - malingVal;

        querySales.fullPayment.val(fullpaymentVal);

        $('#fullPaymentTotal').val(fullpaymentVal);


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

    function checkApproval($input, message, position) {

        var flag = true;

        if ($input.val() == "" || $input.val() == null) {

            $input.focus().select();

            $input.addClass('popover-notitle').attr({
                "data-rel": "popover",
                "data-placement": position,
                "data-original-title": "",
                "title": "",
                "data-content": message

            }).popover('show');

            flag = false;
        } else {
            $input.popover('destroy');

        }

        return flag;
    };

    function printPayment(orderId, sid) {

        com.popup("专用合同__订单编号：" + orderId, api.index.salesPrintIndex.url + "?sales.sid=" + sid + "&time=" + params.loginTime, function () {
            parent.layer.getFrameIndex(window.name);
        }, null, true);


        /* var url = api.index.salesPrintIndex.url + "?sales.sid=" + sid + "&time=" + params.loginTime;
         window.open(url);*/
    }

});
