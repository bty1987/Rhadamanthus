$(function () {

    /**
     * 回调函数必须提供 init(tableId, result.list)方法
     * tableId ，用来显示的div的id
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
                    var $h3 = $('<h3></h3>').addClass('sid');
                    var $btnDiv = $('<div></div>').addClass('action-buttons pull-right').css('margin-right', '2%');

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


                    var $btnSwitch = $('<a></a>').addClass('btn btn-minier').html('查看');
                    var $btnPre = $('<a></a>').css('margin-left', '3px').addClass('btn btn-minier').html('预结算');

                    var propertyArr = [
                        ["订单编号:", v.orderId, "grey"],
                        ["楼盘地址:", v.village.villageName + " " + v.houseNumber, "grey"],
                        ["客户名:", v.customer.customerName, "grey"],
                        ["渠道:", v.salesman.userName, "grey"],
                        ["部门:", v.dept.deptName, "grey"],
                        ["分区:", v.region.deptName, "grey"],
                        ["导购:", v.guider.userName, "grey"],
                        ["品牌:", v.brand, "grey"],
                        ["总额:", v.total, "grey"],
                        ["抹零:", v.maling, "grey"],
                        ["厂商抹零:", v.venderMaling, "grey"],
                        ["券值:", v.coupon, "grey"],
                        ["券信息:", v.couponInfo, "grey"],
                        ["创建时间:", v.createTime, "grey"],
                        ["结算时间:", v.balanceTime, "grey"],
                        ["补款时间:", v.fullpayTime, "grey"],
                        ["备注:", v.comment, "grey"]
                    ];

                    var $label = $('<label></label>').addClass('control-label').css({
                        'color': 'grey',
                        'font-size': '20px',
                        "font-weight": "bold"
                    });


                    var _label = $('<label></label>');

                    var $input = $('<input>').attr({
                        "type": "checkbox",
                        "name": "sids",
                        "class": "",
                        "data-sid": v.sid,
                        "data-no": v.no,
                        "data-orderId": v.orderId,
                        "data-fullPayStatus": v.fullpayStatus
                    }).addClass('ace ace-checkbox-2');

                    var _span = $('<span style="font-weight: bold"></span>').addClass('lbl blue bigger-130').html(v.no);

                    _label.append($input).append(_span).appendTo($label)

                    $.each(propertyArr, function (index, value) {
                        var $liProperty = $('<li></li>').css({"border-bottom": "0px"});
                        $('<strong></strong>').html(value[0]).appendTo($liProperty);
                        $('<b></b>').html(value[1]).css({color: value[2]}).appendTo($liProperty);
                        $liProperty.appendTo($ulProperty);
                    });

                    $label.appendTo($h3);

                    $btnDiv.append($btnSwitch).append($btnPre).appendTo($h3);

                    $liLine.appendTo($ul);
                    $liLine.append($h3).append($ulProperty);

                    $btnSwitch.click(function () {

                        openlayerView(v.sid, v.no);

                    })

                    $btnPre.click(function () {

                        var _option = {};

                        _option["sid[0]"] = v.sid;

                        layer.confirm('确定要将单号为 ' + v.no + ' 的销售单进行预结算吗?', {
                            btn: ['确定', '取消'] //按钮
                        }, function (index, layero) {

                            com.post(api.inventory.preSalesBalance, _option, function (res) {
                                layer.closeAll();
                                layer.msg('预结算成功');
                                salesPreBalance.doSearch();
                            })

                        }, function () {

                            salesPreBalance.doSearch();
                        });


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

    var _condArr = ['no', 'orderId', 'instorerId', 'salesmanId', 'salesDeptName', 'fullpayTimeRange'];

    var salesPreBalance = new Searcher();

    salesPreBalance.init(_condArr, 'condList', api.inventory.pageSalesForBalance, function (data) {

        displayFunc.init('resultList', data)

    }, 'pagenation', 'salesPreBalancePostData', null, false, null, function () {

        var $adda = $('<a></a>').addClass('btn btn-minier btn-info pull-left').attr('name', 'collects').css("margin", "0px 3px");
        var $addi = $('<i></i>').addClass('icon-ok bigger-110').appendTo($adda);
        var $addspan = $('<span></span>').text('批量预结算').appendTo($adda);

        var $addaEnd = $('<a></a>').addClass('btn btn-minier btn-danger pull-left').attr('name', 'collects').css("margin", "0px 3px");
        var $addiEnd = $('<i></i>').addClass('icon-ok bigger-110').appendTo($addaEnd);
        var $addspanEnd = $('<span></span>').text('完结').appendTo($addaEnd);


        $adda.click(function (e) {

            e.stopPropagation()

            var _option = {};

            var $inputs = $('input[name="sids"]:checked', '#resultList');

            if (!$inputs.length) {

                layer.msg('请选择需要进行预结算的销售单.');

                return;

            }

            $.each($inputs, function (i, v) {

                var $this = $(v);

                _option["sid[" + i + "]"] = $this.attr('data-sid');

            })

            layer.confirm('确定要将选中的销售单进行预结算吗?', {
                btn: ['确定', '取消'] //按钮
            }, function (index, layero) {

                com.post(api.inventory.preSalesBalance, _option, function (res) {

                    layer.closeAll();
                    layer.msg('操作成功');
                    salesPreBalance.doSearch();

                })


            }, function () {

                salesPreBalance.doSearch();
            });


        })

        $addaEnd.click(function (e) {
            e.stopPropagation()

            var _option = {};

            var $inputs = $('input[name="sids"]:checked', '#resultList');

            if (!$inputs.length) {

                layer.msg('请选择需要进行完结的销售单.');

                return;

            }

            $.each($inputs, function (i, v) {

                var $this = $(v);

                _option["sid[" + i + "]"] = $this.attr('data-sid');

            })

            layer.confirm('确定要将选中的销售单进行完结吗?', {
                btn: ['确定', '取消'] //按钮
            }, function (index, layero) {

                com.post(api.inventory.passSalesBalance, _option, function (res) {

                    layer.closeAll();
                    layer.msg('操作成功');
                    salesPreBalance.doSearch();

                })


            }, function () {

                salesPreBalance.doSearch();
            });


        })
        return [$adda, $addaEnd]

    }, 'resultList')


    //查看弹窗
    function openlayerView(sid, no) {
        layer.closeAll();
        var $popup = $('#viewPopUp');
        $popup.attr({'data-sid': sid});
        //弹出即全屏
        var index = layer.open({
            type: 1,
            skin: 'layui-layer-molv',
            title: "预结算销售单号" + no,
            content: $popup,
            area: ["1400px", ( $(window).height() * 0.84 < 700 ? $(window).height() * 0.84 : 700 ) + "px"],
            maxmin: true,
            zIndex: 9000,
            success: function (layer, index) {
                $popup.load("views/sales/viewSalesItemPreBalance.html");
            },
            end: function () {
                $popup.attr({'data-sid': null});
                $popup.empty();
                salesPreBalance.doSearch();
            }
        })
    }

})


