$(function () {

    var salesPaymentForStatus = {};

    var url = api.inventory.pageSalesBalance;
    var postData = "salesBalancePostData";

    if(params['urlLoadParams'].type == "dompany"){
        url = api.inventory.pageSalesBalanceForDompany;
        postData = "salesBalanceForDompanyPostData";
    }

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
                salesPaymentForStatus.cashInfo[v.no] = v.name;
            } else if (v.type == 2) {
                salesPaymentForStatus.bank.push(v);
                salesPaymentForStatus.bankInfo[v.no] = v.name;
            } else if (v.type == 3) {
                salesPaymentForStatus.checkBank.push(v);
                salesPaymentForStatus.checkBankInfo[v.no] = v.name;
            } else if (v.type == 4) {
                salesPaymentForStatus.accounts.push(v);
                salesPaymentForStatus.accountsInfo[v.no] = v.name;
            } else if (v.type == 5) {
                salesPaymentForStatus.couponType.push(v);
                salesPaymentForStatus.couponTypeData[v.no] = [v.no, v.name];
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

                    var $liLine = $('<li></li>').addClass('item-orange clearfix');
                    var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
                    var $h3 = $('<h3></h3>').addClass('oid');
                    var $small = $('<small></small>').addClass('blue').html(v.sales.no);
                    var $btnDiv = $('<div></div>').addClass('action-buttons pull-right');

                    var $btnVbalanceValue = $('<a></a>').addClass('btn btn-minier btn-yellow').html('厂商结算值');
                    var $btnVbalance = $('<a></a>').addClass('btn btn-minier btn-success').html('厂商结算');
                    var $btnBalanceValue = $('<a></a>').addClass('btn btn-minier btn-warning').html('结算值');
                    var $btnBalance = $('<a></a>').addClass('btn btn-minier btn-inverse').html('结算');
                    var $btnPayment = $('<a></a>').addClass('btn btn-minier btn-danger').html('款项');
                    var $btnBalanceItem = $('<a></a>').addClass('btn btn-minier btn-pink').html('子项');

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
                            type = "结算退货";
                            break;

                    }
                    var propertyArr = [
                        ["订单编号:", v.sales.orderId, "blue"],
                        ["楼盘地址:", v.sales.house.village.name + " " + v.sales.house.houseNumber, "grey"],
                        ["品牌:", v.sales.brand, "grey"],
                        ["渠道:", v.sales.salesman.currentName, "grey"],
                        ["归属大区:", v.sales.region.deptName, "grey"],
                        ["归属部门:", v.sales.dept.deptName, "grey"],
                        ["总价:", v.total, "blue"],
                        ["券值:", v.sales.coupon, "blue"],
                        ["券信息:", v.sales.couponInfo, "grey"],
                        ["驻店:", v.sales.instorer.currentName, "grey"],
                        ["预结算值:", v.balance, "blue"],
                        ["预结算时间:", v.createTime, "green"],
                        ["预结算人:", v.creater.currentName, "grey"],
                        ["厂商结算:", v.vbalance, "blue"],
                        ["厂商结算时间:", v.venderTime, "green"],
                        ["结算值:", v.pbalance, "blue"],
                        ["结算时间:", v.postTime, "green"],
                        ["结算人:", v.poster.currentName, "grey"],
                        ["抹零:", v.sales.maling, "blue"],
                        ["厂商抹零:", v.sales.venderMaling, "blue"],
                        ["状态:", status, "red"],
                        ["类型:", type, "red"],

                    ];

                    $.each(propertyArr, function (index, value) {
                        var $liProperty = $('<li></li>');
                        $('<strong></strong>').html(value[0]).appendTo($liProperty);
                        $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                        $liProperty.appendTo($ulProperty);
                    });

                    $liLine.appendTo($ul);
                    $liLine.append($h3).append($ulProperty);

                    if(params['urlLoadParams'].type == "dompany") {
                        $btnDiv.append($btnPayment).append($btnBalanceItem);

                    }else{
                        $btnDiv.append($btnVbalanceValue).append($btnVbalance).append($btnBalanceValue).append($btnBalance).append($btnPayment).append($btnBalanceItem);
                    }
                    $small.appendTo($h3);
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

                            if (com.validate('vbalanceValue','right')==false) {

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

                            if (com.validate('pbalanceValue','right')==false) {

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
    var _condArr = ['sales_balanceOrderId', 'sales_balanceNo', 'sales_balanceBrand', 'sales_balanceVillage', 'sales_balanceRegion', 'sales_balanceDept', 'sales_balanceStatus', 'sales_balanceType', 'sales_balanceFullpayTime', 'sales_balanceCreateTime', 'sales_balanceVenderTime', 'sales_balancePostTiem'];

    var salesBalanceSearcher = new Searcher();

    salesBalanceSearcher.init(_condArr, 'condList', url, function (data) {

        displayFunc.init('resultList', data)

    }, 'pagenation', postData , null, false, null, function () {

        var $addaExportSales = $('<a></a>').addClass('btn btn-minier btn-success pull-left').attr('name', 'importSalesBalance').css('margin-top','-2px');
        var $addaExporti = $('<i></i>').addClass('icon-download-alt bigger-110').appendTo($addaExportSales);
        var $addaExportspan = $('<span></span>').text('导出').appendTo($addaExportSales);

        $addaExportSales.click(function(){
            pageSalesBalanceExport();
        });

        return [$addaExportSales];

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
                com.clearValidator()
                clearinput($line)
            },
            cancel: function () {
                //右上角关闭回调
                com.clearValidator()
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
                com.clearValidator()
                clearinput($line)
            },
            cancel: function () {
                //右上角关闭回调
                com.clearValidator()
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

    //清空弹窗输入框的值
    function clearinput($line) {
        $line.find('input').val('');
    }

    //收款显示
    function viewSalesPaymentLine(tableId, listData) {
        var $tableWrap = $('#' + tableId);
        var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');
        if (listData && listData.salesPayments.length) {
            $.each(listData.salesPayments, function (i, v) {
                var $liLine = $('<li></li>').addClass('item-orange clearfix');
                var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
                var $h3 = $('<h3></h3>').addClass('oid');
                var $small = $('<small></small>').addClass('blue').html(salesCollection.salesPaymentType[v.type]);

                var propertyArr = [
                    ["销售单号:", v.sales.no, "blue"],
                    ["品类：", v.sales.category, "grey"],
                    ["品牌：", v.sales.brand, "grey"],
                    ["应收额：", v.referMoney, "blue"],
                    ["收款时间：", v.salesReceipt.collectTime, "green"],
                    ["确认时间：", v.salesReceipt.confirmTime, "green"],
                    ["状态：", v.status == 0 ? '初始' : v.status == 1 ? '待确认' : '已确认', "red"]
                ];

                $.each(propertyArr, function (index, value) {
                    var $liProperty = $('<li></li>');
                    $('<strong></strong>').html(value[0]).appendTo($liProperty);
                    $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                    $liProperty.appendTo($ulProperty);
                });

                var addPropertyArr = [];
                v.salesReceipt.cash != null && v.salesReceipt.cash != "0" ? addPropertyArr.push(["现金:", v.salesReceipt.cash, "blue"]) : true;
                v.salesReceipt.bank != null && v.salesReceipt.bank != "0" ? addPropertyArr.push(["银行信息：", (function (bank, bankInfo) {

                    var info = bank + ", ";
                    var _s = bankInfo.split('#');
                    for (var i = 1; i < _s.length - 1; i++) {
                        var _i = _s[i].split('|');
                        info += salesPaymentForStatus.bankInfo[_i[0]] + " " + _i[1] + ", ";
                    }

                    return info
                })(v.salesReceipt.bank, v.salesReceipt.bankInfo), "blue"]) : true;
                v.salesReceipt.checkv != null && v.salesReceipt.checkv != "0" ? addPropertyArr.push(["转账:", v.salesReceipt.checkv, "blue"]) : true;
                v.salesReceipt.installment != null && v.salesReceipt.installment != "0" ? addPropertyArr.push(["分期:", v.salesReceipt.installment, "blue"]) : true;
                v.salesReceipt.accounts != null && v.salesReceipt.accounts != "0" ? addPropertyArr.push(["对公帐户:", v.salesReceipt.accounts, "blue"]) : true;
                v.salesReceipt.advance != null && v.salesReceipt.advance != "0" ? addPropertyArr.push(["预付款:", v.salesReceipt.advance, "blue"]) : true;
                v.salesReceipt.coupon != null && v.salesReceipt.coupon != "0" ? addPropertyArr.push(["优惠券:", v.salesReceipt.coupon + v.salesReceipt.couponInfo.split('#').join(' '), "blue"]) : true;

                $.each(addPropertyArr, function (index, value) {
                    var $liPropertys = $('<li></li>');
                    $('<strong></strong>').html(value[0]).appendTo($liPropertys);
                    $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liPropertys);
                    $liPropertys.appendTo($ulProperty);
                });
                $small.appendTo($h3);
                $liLine.append($h3).append($ulProperty).appendTo($ul);
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
                    var $liLine = $('<li></li>').addClass('item-orange clearfix');
                    var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix')
                    var $h3 = $('<h3></h3>').addClass('oid');//.addClass('siid')
                    var $small = $('<small></small>').addClass('blue').html(v.salesItem.goods.name)
                    var $btnDiv = $('<div></div>').addClass('action-buttons pull-right')

                    var propertyArr = [
                        ["商品品类:", v.salesItem.goods.category, "grey", "category"],
                        ["商品颜色:", v.salesItem.color.name, "grey", "color"],
                        ["商品规格:", v.salesItem.format.info, "grey", "format"],
                        ["售价:", v.salesItem.selling, "blue", "selling"],
                        ["折扣价:", v.salesItem.disPrice, "blue", "disPrice"],
                        ["折让价:", v.salesItem.price, "blue", "price"],
                        ["数量:", v.num, "blue", "num"],
                        ["总价:", v.total, "blue", "total"],
                        ["结算方式:", v.ctype==0?"底价":"点位", "red", "ctype"],
                        ["结算值:", v.cvalue, "blue", "cvalue"],
                        ["备注:", v.comment, "grey", "conment"],
                    ];

                    $.each(propertyArr, function (index, value) {
                        var $liProperty = $('<li></li>').css({"border-bottom": "0px"});
                        $('<strong></strong>').attr('name', value[3]).html(value[0]).appendTo($liProperty);
                        $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                        $liProperty.appendTo($ulProperty);
                    });

                    $small.appendTo($h3);
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

    function pageSalesBalanceExport(){

        if ($('span[name="totalRecords"]').text() == 0) {
            com.showAlert(com.warning, "请通过条件进行查询");
            return false;
        }

        if ($('span[name="totalRecords"]').text() > 1000) {
            com.showAlert(com.warning, "查询结果大于阀值 , 不能完成导出动作");
            return false;
        }

        com.post(url, $.extend({}, params['urlLoadParams'].type == "dompany"?params.salesBalanceForDompanyPostData:params.salesBalancePostData, {"paging.noPage": 1}), function (res) {
            $.exceler({
                column: [
                    ['订单编号', 'sales.orderId'],
                    ['楼盘地址',['sales.house.village.name','sales.house.houseNumber']],
                    ['品牌', 'sales.brand'],
                    ['渠道', 'sales.salesman.currentName'],
                    ['渠道ID', 'sales.salesman.userId'],
                    ['归属大区', 'sales.region.deptName'],
                    ['归属部门', 'sales.dept.deptName'],
                    ['总价', 'total'],
                    ["券值:", 'sales.coupon'],
                    ["券信息:", 'sales.couponInfo'],
                    ["驻店:", 'sales.instorer.currentName'],
                    ["预结算值:", 'balance'],
                    ["预结算时间:", 'createTime'],
                    ["预结算人:", 'creater.currentName'],
                    ["厂商结算:", 'vbalance'],
                    ["厂商结算时间:", 'venderTime'],
                    ["结算值:", 'pbalance'],
                    ["结算时间:", 'postTime'],
                    ["结算人:", 'poster.currentName'],
                    ["抹零:", 'sales.maling'],
                    ["厂商抹零:", 'sales.venderMaling'],
                    ["状态:", 'status'],
                    ["类型:", 'type']
                ],
                list: res.paging.data,

            },function(v){
                v.venderTime = v.venderTime == null? '':v.venderTime;
                v.postTime = v.postTime == null? '':v.postTime;
                v.poster.currentName = v.poster.currentName==null? '':v.poster.currentName;
                v.status = v.status == 0 ? '预结算' : v.status == 1 ? "厂商结算" : "结算" ;
                v.type = v.type == 0 ? "购货" : v.type == 1 ? "预结算退货" : "结算退货"
            });

        });
    }

    $('#resultListItem').css({'width': '96%', 'margin': '0 auto'});

});
