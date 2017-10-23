$(function () {

    var salesPaymentForStatus = {};

    com.post(api.common.queryReceiptType, {}, function (res) {
        salesPaymentForStatus.cash = [];
        salesPaymentForStatus.bank = [];
        salesPaymentForStatus.checkBank = [];
        salesPaymentForStatus.accounts = [];
        salesPaymentForStatus.couponType = [];

        salesPaymentForStatus.cashInfo = {};
        salesPaymentForStatus.bankInfo = {};
        salesPaymentForStatus.checkBankInfo = {};
        salesPaymentForStatus.accountsInfo = {};
        salesPaymentForStatus.couponTypeData = {};

        $.each(res.receiptTypes, function (i, v) {
            if (v.type == 1) {
                salesPaymentForStatus.cash.push(v);
                salesPaymentForStatus.cashInfo[v.key] = v.name;
            } else if (v.type == 2) {
                salesPaymentForStatus.bank.push(v);
                salesPaymentForStatus.bankInfo[v.key] = v.name;
            } else if (v.type == 3) {
                salesPaymentForStatus.checkBank.push(v);
                salesPaymentForStatus.checkBankInfo[v.key] = v.name;
            } else if (v.type == 4) {
                salesPaymentForStatus.accounts.push(v);
                salesPaymentForStatus.accountsInfo[v.key] = v.name;
            } else if (v.type == 5) {
                salesPaymentForStatus.couponType.push(v);
                salesPaymentForStatus.couponTypeData[v.key] = [v.key, v.name];
            }
        });

    }, null, false);


    var salesCollection = {
        salesPaymentType: {"2": "定金", "3": "补款", "4": "退款", "5": "补款退款", "6": "券退款", "7": "定金退款"}
    };


    /**
     * 回调函数必须提供 init(tableId, result.list)方法
     * tableId ,用来显示的div的id
     * result.list 列表的json数组
     * */
    var displayFunc = (function () {

        var renderList = function (tableId, listData) {

            var $tableWrap = $('#' + tableId);
            var $ul = $('<ul></ul>').addClass('item-list ui-sortable  fl-table-list');

            if (listData && listData.length) {
                $.each(listData, function (i, v) {

                    var $liLine = $('<li></li>').addClass('item-blue clearfix');
                    var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
                    var $h3 = $('<h3></h3>').css({color: 'grey', "font-weight": "bold"}).html(' ' + v.sales.no);
                    var $btnDiv = $('<div></div>').addClass('action-buttons pull-right');

                    var $btnVbalanceValue = $('<a></a>').css('margin-right','8px').addClass('btn btn-minier').html('厂商结算值');
                    var $btnVbalance = $('<a></a>').css('margin-right','8px').addClass('btn btn-minier').html('厂商结算');
                    var $btnBalanceValue = $('<a></a>').css('margin-right','8px').addClass('btn btn-minier').html('结算值');
                    var $btnBalance = $('<a></a>').css('margin-right','8px').addClass('btn btn-minier').html('结算');
                    var $btnPayment = $('<a></a>').css('margin-right','8px').addClass('btn btn-minier').html('款项');
                    var $btnBalanceItem = $('<a></a>').css('margin-right','8px').addClass('btn btn-minier').html('子项');

                    var status = "";
                    var type = "";

                    switch (v.status) {
                        case 0:
                            status = "预结算";
                            break;
                        case 1:
                            status = "厂商结算";
                            break;
                        case 2:
                            status = "结算";
                            break;

                    }

                    switch (v.type) {
                        case 0:
                            type = "购货";
                            break;
                        case 1:
                            type = "预结算退货";
                            break;
                        case 2:
                            type = " 结算退货";
                            break;

                    }
                    var propertyArr = [
                        ["订单编号:", v.sales.orderId, "grey"],
                        ["楼盘地址:", v.sales.village.villageName + " " + v.sales.houseNumber, "grey"],
                        ["品牌:", v.sales.brand, "grey"],
                        ["渠道:", v.sales.salesman.userName, "grey"],
                        ["归属大区:", v.sales.region.deptName, "grey"],
                        ["归属部门:", v.sales.dept.deptName, "grey"],
                        ["总价:", v.total, "grey"],
                        ["券值:", v.sales.coupon, "grey"],
                        ["券信息:", v.sales.couponInfo, "grey"],
                        ["驻店:", v.sales.instorer.currentName, "grey"],
                        ["预结算值:", v.balance, "grey"],
                        ["预结算时间:", v.createTime, "grey"],
                        ["预结算人:", v.creater.currentName, "grey"],
                        ["厂商结算:", v.vbalance, "grey"],
                        ["厂商结算时间:", v.venderTime, "grey"],
                        ["结算值:", v.pbalance, "grey"],
                        ["结算时间:", v.postTime, "grey"],
                        ["结算人:", v.poster.currentName, "grey"],
                        ["抹零:", v.sales.maling, "grey"],
                        ["厂商抹零:", v.sales.venderMaling, "grey"],
                        ["状态:", status, "grey"],
                        ["类型:", type, "grey"],

                    ];

                    $.each(propertyArr, function (index, value) {
                        var $liProperty = $('<li></li>').css({"border-bottom": "0px"});
                        $('<strong></strong>').html(value[0]).appendTo($liProperty);
                        $('<b></b>').html(value[1]).css({color: value[2]}).appendTo($liProperty);
                        $liProperty.appendTo($ulProperty);
                    });

                    $liLine.appendTo($ul);
                    $liLine.append($h3).append($ulProperty);

                    $btnDiv.append($btnVbalanceValue).append($btnVbalance).append($btnBalanceValue).append($btnBalance).append($btnPayment).append($btnBalanceItem);

                    $btnDiv.appendTo($h3);

                    $btnVbalanceValue.click(function (e) {
                        e.stopPropagation();

                        if (v.status != 0) {
                            layer.msg('非预结算状态下不允许进行厂商结算.')
                            return
                        }

                        $('#vbalanceValue').find('input[name="total"]').val(v.total);

                        openlayerVbalance($('#vbalanceValue'), function () {

                            var _vBalance = $('#vbalanceValue').find('input[name="vbalanceValue"]').val();

                            if (checkRowValue($('#vbalanceValue'))) {

                                com.post(api.inventory.updateSalesBalanceForVBalance, {
                                    "salesBalance.sbid": v.sbid,
                                    "salesBalance.vbalance": _vBalance
                                }, function (res) {

                                    layer.closeAll();
                                    layer.msg('更新成功')
                                    clearinput($('#vbalanceValue'))
                                    salesBalanceSearcher.doSearch()

                                })

                            }

                        })

                    })

                    $btnVbalance.click(function (e) {
                        e.stopPropagation();

                        if (v.status != 0) {
                            layer.msg('非预结算状态下不允许进行厂商结算.')
                            return
                        }

                        layer.confirm('确定要将单号为 ' + v.sales.no + ' 的销售单进行厂商结算吗?', {
                            btn: ['确定', '取消'] //按钮
                        }, function (index, layero) {

                            com.post(api.inventory.vpostSalesBalance, {
                                "salesBalance.sbid": v.sbid
                            }, function (res) {
                                layer.closeAll();
                                layer.msg('厂商结算成功');
                                salesBalanceSearcher.doSearch();
                            })

                        }, function () {

                            salesBalanceSearcher.doSearch();
                        });


                    })

                    $btnBalanceValue.click(function (e) {
                        e.stopPropagation();

                        if (v.status != 1) {
                            layer.msg('非厂商结算状态下不允许进行结算.')
                            return
                        }

                        $('#pbalanceValue').find('input[name="balanceValue"]').val(v.balance);
                        $('#pbalanceValue').find('input[name="vbalanceValue"]').val(v.vbalance);

                        openlayerPbalance($('#pbalanceValue'), function () {

                            var _pBalance = $('#pbalanceValue').find('input[name="pbalanceValue"]').val();

                            if (checkRowValue($('#pbalanceValue'))) {

                                com.post(api.inventory.updateSalesBalanceForPBalance, {
                                    "salesBalance.sbid": v.sbid,
                                    "salesBalance.pbalance": _pBalance
                                }, function (res) {

                                    layer.closeAll();
                                    layer.msg('更新成功')
                                    clearinput($('#pbalanceValue'))
                                    salesBalanceSearcher.doSearch()

                                })

                            }

                        })

                    })

                    $btnBalance.click(function (e) {

                        e.stopPropagation();

                        if (v.status != 1) {
                            layer.msg('非厂商结算状态下不允许进行结算.')
                            return
                        }

                        layer.confirm('确定要将单号为 ' + v.sales.no + ' 的销售单进行结算吗?', {
                            btn: ['确定', '取消'] //按钮
                        }, function (index, layero) {

                            com.post(api.inventory.postSalesBalance, {
                                "salesBalance.sbid": v.sbid
                            }, function (res) {

                                layer.closeAll();
                                layer.msg('结算成功');
                                salesBalanceSearcher.doSearch();
                            })

                        }, function () {

                            salesBalanceSearcher.doSearch();
                        });

                    })

                    $btnPayment.click(function (e) {

                        e.stopPropagation();

                        viewPopUp(function () {

                            com.post(api.payment.querySalesPaymentBySid, {
                                "salesPayment.sales.sid": v.sales.sid
                            }, function (res) {

                                viewSalesPaymentLine('resultListItem', res);

                            })

                        }, '收款')

                    })

                    $btnBalanceItem.click(function (e) {

                        e.stopPropagation();

                        viewPopUp(function () {

                            com.post(api.inventory.querySalesBalanceItemBySbid,{
                                "salesBalance.sbid":v.sbid
                            },function(res){
                                salesBalanceItemList.init('resultListItem', res.salesBalanceItems);
                            })

                        }, '子项')

                    })


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
    var _condArr = ['salesBalanceOrderId', 'salesBalanceNo', 'salesBalanceBrand', 'salesBalanceVillage', 'salesBalanceRegion', 'salesBalanceDept', 'salesBalanceStatus', 'salesBalanceType', 'salesBalanceFullpayTime', 'salesBalanceCreateTime', 'salesBalanceVenderTime', 'salesBalancePostTiem'];

    var salesBalanceSearcher = new Searcher();

    salesBalanceSearcher.init(_condArr, 'condList', api.inventory.pageSalesBalance, function (data) {

        displayFunc.init('resultList', data)

    }, 'pagenation', 'salesBalancePostData', null, false, null, function () {


    }, 'resultList')


    //厂商结算值弹窗
    function openlayerVbalance($line, callback) {

        layer.closeAll();
        layer.open({
            type: 1,
            skin: 'layui-layer-lan',
            title: "厂商结算值",
            content: $('#vbalanceValue'),
            area: ( $(window).width() * 0.6 < 620 ? $(window).height() * 0.6 : 620 ) + "px",
            //maxmin: true,
            zIndex: 9000,
            btn: ['确定', '取消'],
            yes: function (index, layero) {
                callback(index, layero);
            },
            btn2: function (index, layero) {
                //按钮【按钮二】的回调
                clearinput($line)
            },
            cancel: function () {
                //右上角关闭回调
                clearinput($line)
            }
        });
    }

    //结算值弹窗
    function openlayerPbalance($line, callback) {

        layer.closeAll();
        layer.open({
            type: 1,
            skin: 'layui-layer-lan',
            title: "结算值",
            content: $('#pbalanceValue'),
            area: ( $(window).width() * 0.6 < 620 ? $(window).height() * 0.6 : 620 ) + "px",
            //maxmin: true,
            zIndex: 9000,
            btn: ['确定', '取消'],
            yes: function (index, layero) {
                callback(index, layero);
            },
            btn2: function (index, layero) {
                //按钮【按钮二】的回调
                clearinput($line)
            },
            cancel: function () {
                //右上角关闭回调
                clearinput($line)
            }
        });

    }

    <!--收款查看-->
    <!--子项查看-->
    <!--退款查看-->
    <!--退货查看-->
    function viewPopUp(callback, title) {

        var _popUp = $('#viewPopUp');

        layer.closeAll();
        var index = layer.open({
            type: 1,
            skin: 'layui-layer-lan',
            title: title,
            content: _popUp,
            area: ["1400px", ( $(window).height() * 0.84 < 800 ? $(window).height() * 0.84 : 800 ) + "px"],
            //maxmin: true,
            zIndex: 9000,
            btn: ['确定'],
            success: function (layers, index) {
                callback()
            },
            end: function () {
                _popUp.find('#resultListItem').empty();
                salesBalanceSearcher.doSearch();
            }
        });
    }


    //输入框校验规则
    function checkRowValue($line) {

        var flag = true;

        if ($line.find('input[name="vbalanceValue"]').length!=0) {

            var _vbalanceValue = $line.find('input[name="vbalanceValue"]');
            var _vbalanceValueRex = /^(\d{0,8}|\d{0,8}\.[0-9]{1,2})$|^-(\d{0,8}|\d{0,8}\.[0-9]{1,2})$/;

            if (!(_vbalanceValueRex.test(_vbalanceValue.val())&&_vbalanceValue.val()!="")) {
                _vbalanceValue.focus().select();
                _vbalanceValue.addClass('tooltip-info').attr({
                    "data-rel": "popover",
                    "data-placement": "right",
                    "data-original-title": "",
                    "title": "",
                    "data-content": "厂商结算值输入错误!"
                }).popover('show');
                flag = false;
            } else {
                _vbalanceValue.popover('destroy');
            }
        }

        if ($line.find('input[name="pbalanceValue"]').length!=0) {

            var _pbalanceValue = $line.find('input[name="pbalanceValue"]');
            var _pbalanceValueRex = /^(\d{0,8}|\d{0,8}\.[0-9]{1,2})$|^-(\d{0,8}|\d{0,8}\.[0-9]{1,2})$/;

            if (!(_pbalanceValueRex.test(_pbalanceValue.val())&&_pbalanceValue.val()!="")) {
                _pbalanceValue.focus().select();
                _pbalanceValue.addClass('tooltip-info').attr({
                    "data-rel": "popover",
                    "data-placement": "right",
                    "data-original-title": "",
                    "title": "",
                    "data-content": "结算值输入错误!"
                }).popover('show');

                flag = false;

            } else {
                _pbalanceValue.popover('destroy');
            }

        }


        return flag;
    }


    //清空弹窗输入框的值
    function clearinput($line) {
        $line.find('input').val('');
    }

    //收款显示
    function viewSalesPaymentLine(tableId, listData) {
        var $tableWrap = $('#' + tableId);
        var $ul = $('<ul></ul>').addClass('ui-sortable  fl-table-list');
        if (listData && listData.salesPayments.length) {
            $.each(listData.salesPayments, function (i, v) {
                var $liLine = $('<li></li>').addClass('clearfix').css("list-style-type", "none");
                var $ulProperty = $('<ul></ul>').addClass('fl-inline-list clearfix');
                var $h3 = $('<h3></h3>').html(salesCollection.salesPaymentType[v.type]);

                var propertyArr = [
                    ["销售单号:", v.sales.no, "black"],
                    ["品类：", v.category, "black"],
                    ["品牌：", v.brand, "black"],
                    ["应收额：", v.referMoney, "red"],
                    ["收款时间：", v.salesReceipt.collectTime, "black"],
                    ["确认时间：", v.salesReceipt.confirmTime, "black"],
                    ["状态：", v.status == 0 ? '初始' : v.status == 1 ? '待确认' : '已确认', "black"]
                ];

                $.each(propertyArr, function (index, value) {
                    var $liProperty = $('<li></li>');
                    $('<strong></strong>').html(value[0]).appendTo($liProperty);
                    $('<b></b>').html(value[1]).css({color: value[2]}).appendTo($liProperty);
                    $liProperty.appendTo($ulProperty);
                });

                var addPropertyArr = [];
                v.salesReceipt.cash != null && v.salesReceipt.cash != "0" ? addPropertyArr.push(["现金:", v.salesReceipt.cash, "grey"]) : true;
                v.salesReceipt.bank != null && v.salesReceipt.bank != "0" ? addPropertyArr.push(["银行信息：", (function (bank, bankInfo) {

                    var info = bank + ", ";
                    var _s = bankInfo.split('#');
                    for (var i = 1; i < _s.length - 1; i++) {
                        var _i = _s[i].split('|');
                        info += salesPaymentForStatus.bankInfo[_i[0]] + " " + _i[1] + ", ";
                    }

                    return info
                })(v.salesReceipt.bank, v.salesReceipt.bankInfo), "grey"]) : true;
                v.salesReceipt.checkv != null && v.salesReceipt.checkv != "0" ? addPropertyArr.push(["转账:", v.salesReceipt.checkv, "grey"]) : true;
                v.salesReceipt.installment != null && v.salesReceipt.installment != "0" ? addPropertyArr.push(["分期:", v.salesReceipt.installment, "grey"]) : true;
                v.salesReceipt.accounts != null && v.salesReceipt.accounts != "0" ? addPropertyArr.push(["对公帐户:", v.salesReceipt.accounts, "grey"]) : true;
                v.salesReceipt.advance != null && v.salesReceipt.advance != "0" ? addPropertyArr.push(["预付款:", v.salesReceipt.advance, "grey"]) : true;
                v.salesReceipt.coupon != null && v.salesReceipt.coupon != "0" ? addPropertyArr.push(["优惠券:", v.salesReceipt.coupon + v.salesReceipt.couponInfo.split('#').join(' '), "grey"]) : true;

                $.each(addPropertyArr, function (index, value) {
                    var $liPropertys = $('<li></li>');
                    $('<strong></strong>').html(value[0]).appendTo($liPropertys);
                    $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liPropertys);
                    $liPropertys.appendTo($ulProperty);
                });
                $liLine.append($h3).append($ulProperty).appendTo($ul).css("border-bottom", "solid 1px lightskyblue");
            });

            $ul.appendTo($tableWrap);
        }

    }

    //子项显示
    var salesBalanceItemList = (function () {

        var renderList = function (tableId, listData) {
            var $tableWrap = $('#' + tableId);
            var $ul = $('<ul></ul>').addClass('item-list ui-sortable  fl-table-list');

            if (listData && listData.length) {
                $.each(listData, function (i, v) {
                    var $liLine = $('<li></li>').addClass('clearfix');
                    var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix')
                    var $h3 = $('<h3></h3>').addClass('siid')
                    var $btnDiv = $('<div></div>').addClass('action-buttons pull-right')

                    var propertyArr = [
                        ["商品品类:", v.salesItem.goods.category, "grey", "category"],
                        ["商品颜色:", v.salesItem.color.name, "grey", "color"],
                        ["商品规格:", v.salesItem.format.info, "grey", "format"],
                        ["售价:", v.salesItem.selling, "grey", "selling"],
                        ["折扣价:", v.salesItem.disPrice, "grey", "disPrice"],
                        ["折让价:", v.salesItem.price, "grey", "price"],
                        ["数量:", v.num, "grey", "num"],
                        ["总价:", v.total, "grey", "total"],
                        ["结算方式:", v.ctype==0?"底价":"点位", "grey", "ctype"],
                        ["结算值:", v.cvalue, "grey", "cvalue"],
                        ["备注:", v.comment, "grey", "conment"],
                    ];

                    var $label = $('<label></label>').addClass('control-label').css({
                        'color': 'grey',
                        'font-size': '20px',
                        "font-weight": "bold"
                    });

                    $.each(propertyArr, function (index, value) {
                        var $liProperty = $('<li></li>').css({"border-bottom": "0px"});
                        $('<strong></strong>').attr('name', value[3]).html(value[0]).appendTo($liProperty);
                        $('<b></b>').html(value[1]).css({color: value[2]}).appendTo($liProperty);
                        $liProperty.appendTo($ulProperty);
                    });

                    $label.append(v.salesItem.goods.name).appendTo($h3);

                    $btnDiv.appendTo($h3);

                    $liLine.appendTo($ul);
                    $liLine.append($h3).append($ulProperty);



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

    //退货显示
    var salesRefundsList = function(tableId,listData) {
        var $tableWrap = $('#'+tableId);
        var $ul = $('<ul></ul>').addClass('item-list ui-sortable  fl-table-list');

        if (listData && listData.length) {
            $.each(listData, function (i, v) {

                var $liLine = $('<li></li>').addClass('clearfix');
                var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
                var $h3 = $('<h3></h3>').css({color:"grey","font-weight":"bold"}).html(' ' + v.salesItem.goods.name );
                var $btnDiv = $('<div></div>').addClass('action-buttons pull-right');

                var propertyArr = [
                    ["商品品类:", v.salesItem.goods.category, "grey"],
                    ["商品颜色:", v.salesItem.color.name, "grey"],
                    ["商品规格:", v.salesItem.format.info, "grey"],
                    ["售价:", v.salesItem.selling, "grey"],
                    //["折扣:", v.salesItem.discount, "grey"],
                    ["折扣价:", v.salesItem.disPrice, "grey"],
                    //["折让:", v.salesItem.postDis, "grey"],
                    ["折让价:", v.salesItem.price, "grey"],
                    ["数量:", v.num, "grey"],
                    ["总价:", v.total, "grey"],
                    ["原结算方式:", v.salesItem.rawCtype==0?"底价":"点位", "grey"],
                    ["原结算值:", v.salesItem.rawCvalue, "grey"],
                    ["结算方式:", v.salesItem.ctype==0?"底价":"点位", "grey"],
                    ["结算值:", v.salesItem.cvalue, "grey"],
                    ["备注:", v.salesItem.comment, "grey"],
                ];

                $.each(propertyArr, function (index, value) {
                    var $liProperty = $('<li></li>');
                    $('<strong></strong>').html(value[0]).appendTo($liProperty);
                    $('<b></b>').html(value[1]).css({color:value[2]}).appendTo($liProperty);
                    $liProperty.appendTo($ulProperty);
                });

                $liLine.appendTo($ul);
                $liLine.append($h3).append($ulProperty);

                $btnDiv.appendTo($h3);



            });

            $ul.appendTo($tableWrap);
        }
    };

    $('#resultListItem').css({'width': '96%', 'margin': '0 auto'});

});
