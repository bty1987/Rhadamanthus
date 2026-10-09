$(function() {

    // 本单信息由父页面(sales.js balanceSales)挂载: params.sales.sales
    var sales = params.sales.sales;

    var sid = sales.sid;
    var orderId = sales.orderId;

    var salesBalances = [];

    var render = function() {

        com.focusPage("#sales4balanceInfo").html("销售单号: " + (sales.no || sid) + "&nbsp;&nbsp;&nbsp;&nbsp;装修单号: " + (orderId || "-"));

        var $tbody = com.focusPage("#sales4balanceTable tbody");

        $tbody.empty();

        if (!salesBalances.length) {

            $tbody.append('<tr><td colspan="10" style="text-align: center; color: #999;">暂无结算数据</td></tr>');

            return;
        }

        $.each(salesBalances, function(i, v) {

            var _type = constant.sales().salesBalance.type.keys[v.type] != null ? constant.sales().salesBalance.type.keys[v.type] : v.type;
            var _status = constant.sales().salesBalance.status.keys[v.status] != null ? constant.sales().salesBalance.status.keys[v.status] : v.status;

            // 仅预结算(status=0)行开放厂结操作: 厂结值录入 + 厂商结算
            var _operate = '';

            if (v.status == 0) {

                _operate = '<input type="text" name="vbalanceInput" data-sbid="' + v.sbid + '" value="' + (v.vbalance == null ? 0 : v.vbalance) + '" style="width: 90px; margin-right: 4px;">' +
                    '<button type="button" class="btn btn-minier btn-success" data-action="vpost" data-sbid="' + v.sbid + '">厂结</button>';
            }

            $tbody.append('<tr>' +
                '<td>' + v.sbid + '</td>' +
                '<td>' + _type + '</td>' +
                '<td>' + _status + '</td>' +
                '<td>' + (v.total == null ? "-" : v.total) + '</td>' +
                '<td>' + (v.vbalance == null ? "-" : v.vbalance) + '</td>' +
                '<td>' + (v.difference == null ? "-" : v.difference) + '</td>' +
                '<td>' + (v.voster == null || v.voster.currentName == null ? "-" : v.voster.currentName) + '</td>' +
                '<td>' + (v.venderTime == null ? "-" : v.venderTime) + '</td>' +
                '<td>' + (v.createTime == null ? "-" : v.createTime) + '</td>' +
                '<td>' + (_operate == '' ? "-" : _operate) + '</td>' +
                '</tr>');
        });

        // 厂结: 先保存厂结值(updateSalesBalanceForVBalance), 成功后提交厂商结算(vpostSalesBalance)
        $tbody.find('button[data-action="vpost"]').off('click').on('click', function() {

            var sbid = $(this).attr('data-sbid');
            var $input = $tbody.find('input[name="vbalanceInput"][data-sbid="' + sbid + '"]');
            var vbalance = $input.length ? $input.val() : null;

            if (vbalance == null || vbalance === '' || isNaN(vbalance)) {
                com.showAlert(com.warning, "厂结值未填写, 请先填写厂结值");
                return false;
            }

            com.showConfirm('确认对结算记录(' + sbid + ')进行厂结?', function() {

                com.post(api.sales.updateSalesBalanceForVBalance, {
                    "salesBalance.sbid": sbid,
                    "salesBalance.vbalance": vbalance
                }, function() {

                    com.post(api.sales.vpostSalesBalance, {
                        "salesBalances[0].sbid": sbid
                    }, function() {

                        com.showAlert(com.info, "厂结成功");
                        loadBalances();
                    });
                });
            });
        });
    };

    var loadBalances = function() {

        com.post(api.sales.querySalesBalanceByOrderId, {
            "salesBalance.sales.orderId": orderId,
            "salesBalance.type": 0,
            "salesBalance.onetype": 0,
            "sid[0]": sid
        }, function(res) {

            salesBalances = res.salesBalances || [];

            render();
        });
    };

    loadBalances();
});
