$(function() {

    // 本单信息由父页面(sales.js balanceSales)挂载: params.sales.sales
    var sales4balance = {

        sales: params.sales.sales,

        items: {
            vbalanceValue: com.focusPage('#sales4balanceVbalance')
        },
        btns: {
            supplierSaveBtn: com.focusPage("#sales4balanceSaveBtn")
        },
    };

    var sid = sales4balance.sales.sid;
    var orderId = sales4balance.sales.orderId;

    function getElement(o, props) {

        var prop = props.shift();

        if (props.length == 0) {
            return o[prop];
        } else if (o[prop]) {
            return getElement(o[prop], props);
        }

        return "";
    }

    var displayFunc = (function() {

        var renderList = function(listId, listData) {

            var $wrap = com.focusPage('#' + listId);
            $wrap.empty();

            var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');

            if (!listData || !listData.length) {

                var $emptyLi = $('<li></li>').addClass('item-orange clearfix').append(
                    $('<div></div>').html("暂无结算数据").css({ "text-align": "center", "color": "#999", "padding": "8px" }));

                $ul.append($emptyLi);
            }

            $.each(listData, function(i, v) {

                var $liLine = $('<li></li>').addClass('item-orange clearfix');
                var $h3 = $('<h3></h3>').addClass('oid');
                var $small = $('<small></small>').addClass('blue').html("结算单号: " + v.sbid);
                var $btnDiv = $('<div></div>').addClass('pull-right action-buttons');
                var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');

                var propertyArr = [
                    ["类型:", "type", "red"],
                    ["状态:", "status", "red"],
                    ["结算值:", "total", "blue"],
                    ["厂结值:", "vbalance", "blue"],
                    ["差额:", "difference", "grey"],
                    ["厂结人:", "voster.currentName", "grey"],
                    ["厂结时间:", "venderTime", "green"],
                    ["创建时间:", "createTime", "green"]
                ];

                $.each(propertyArr, function(index, value) {

                    var data = getElement(v, value[1].split('.'));

                    if (value[1] == "type")
                        data = constant.sales().salesBalance.type.keys[data] != null ? constant.sales().salesBalance.type.keys[data] : data;
                    if (value[1] == "status")
                        data = constant.sales().salesBalance.status.keys[data] != null ? constant.sales().salesBalance.status.keys[data] : data;

                    var $liProperty = $('<li></li>');

                    $('<strong></strong>').html(value[0]).appendTo($liProperty);
                    $('<b></b>').html(data == "" ? "-" : data).addClass(value[2]).appendTo($liProperty);

                    $liProperty.appendTo($ulProperty);
                });

                // 仅预结状态开放厂结操作(口径同结算单页面): 先录厂结值, 再厂结
                if (v.status == constant.sales().salesBalance.STATUS_PREBALANCE_INT) {

                    var $btnVbalance = $('<a></a>').addClass('btn btn-minier btn-yellow').html("厂结值");

                    $btnVbalance.click(function() {
                        vbalancevalueBalance(v);
                    });

                    var $btnVpost = $('<a></a>').addClass('btn btn-minier btn-success').html("厂结");

                    $btnVpost.click(function() {
                        vbalanceBalance(v);
                    });

                    $btnDiv.append($btnVbalance).append($btnVpost);
                }

                $h3.append($small).append($btnDiv);
                $liLine.append($h3).append($ulProperty);
                $ul.append($liLine);
            });

            $wrap.append($ul);
        };

        return {
            init: renderList
        }

    })();

    // 录厂结值: popup4model 弹窗, 厂结值默认带出总价(口径同结算单页面 vbalancevalueBalance)
    function vbalancevalueBalance(v) {

        if (v.status != constant.sales().salesBalance.STATUS_PREBALANCE_INT) {
            com.showAlert(com.warning, "非预结状态下不允许进行厂结");
            return false;
        }

        sales4balance.sales = v;

        sales4balance.items.vbalanceValue.find('input[name="total"]').val(v.total);

        com.popup4model("#sales4balanceVbalance", "厂结值", function() {

        }, function() {

            com.clearValidator();
            com.cleanItems(sales4balance.items);
        });
    }

    // 厂结: 口径同结算单页面 vbalanceBalance(预结状态且厂结值已填写)
    function vbalanceBalance(v) {

        if (v.status != constant.sales().salesBalance.STATUS_PREBALANCE_INT) {
            com.showAlert(com.warning, "非预结状态下不允许进行厂结");
            return false;
        }

        if (v.vbalance == 0) {
            com.showAlert(com.warning, "厂结值未填写 , 请检查");
            return false;
        }

        com.showConfirm('确定要将单号为 ' + (sales4balance.sales.no || v.sales.no) + ' 的销售单进行厂结吗?', function() {

            com.post(api.sales.vpostSalesBalance, {
                "salesBalances[0].sbid": v.sbid
            }, function() {

                com.showAlert(com.info, "厂结成功");
                loadBalances();
            }, function() {
                loadBalances();
            });
        }, function() {

            loadBalances();
        });
    }

    // 提交厂结值: 口径同结算单页面 supplierSaveBtn(com.validate 校验 v_required/v_afloat_3)
    sales4balance.btns.supplierSaveBtn.on('click', function() {

        var _vBalance = sales4balance.items.vbalanceValue.find('input[name="vbalanceValue"]').val();

        if (com.validate('sales4balanceVbalance', 'right') == false) {

            com.post(api.sales.updateSalesBalanceForVBalance, {
                "salesBalance.sbid": sales4balance.sales.sbid,
                "salesBalance.vbalance": _vBalance
            }, function(res) {

                com.showAlert(com.info, "更新成功");

                com.closePopup();
                com.cleanItems(sales4balance.items);

                loadBalances();
            });
        }
    });

    var loadBalances = function() {

        com.post(api.sales.querySalesBalanceByOrderId, {
            "salesBalance.sales.orderId": orderId,
            "salesBalance.type": 0,
            "salesBalance.onetype": 0,
            "sid[0]": sid
        }, function(res) {

            var salesBalances = res.salesBalances || [];

            com.focusPage("#sales4balanceInfo").html("销售单号: " + (sales4balance.sales.no || sid) + "&nbsp;&nbsp;&nbsp;&nbsp;装修单号: " + (orderId || "-"));

            displayFunc.init("sales4balanceList", salesBalances);
        });
    };

    loadBalances();
});
