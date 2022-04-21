$(function () {
    var walletran = {
        status: [],
        types: []
    };

    com.post(api.ds.payment, {}, function(res){
        $.each(res.walletranStatus, function(i, v){
            walletran.status[v.key] = v.value;
        });

        $.each(res.walletranType, function(i, v){
            walletran.types[v.key] = v.value;
        });
    }, null, false);

    initRecord();

    var displayFunc = (function () {

        var renderList = function (tableId, listData) {
            var $tableWrap = com.focusPage('#' + tableId);
            var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');
            if (listData && listData.length) {
                $.each(listData, function (i, v) {
                    var $liLine = creatLine(v);
                    $liLine.appendTo($ul);
                });
                $ul.appendTo($tableWrap);
            }
        };

        var creatLine = function (v) {
            var $liLine = $('<li></li>').addClass('item-orange clearfix');
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(walletran.types[v.type]));
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

            var customersArr = [
                ["编号:", v.no, "grey"],
                ["操作钱包:", v.wallet.belonger.currentName, "grey"],
                ["关联钱包:", com.checkNull(v.tallet.belonger.currentName, "无"), "grey"],
                ["金额:", v.amount, "blue"],
                ["状态:", walletran.status[v.status], "red"],
                ["备注:", v.comment, "grey"]
            ];
            $.each(customersArr, function (index, value) {
                var $Lics = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($Lics);
                $('<b></b>').html(value[1]).addClass(value[2]).appendTo($Lics);
                $Lics.appendTo($ulProperty);
            });

            $divBtnWrap.appendTo($h3);

            $liLine.append($h3).append($ulProperty);

            return $liLine;
        };
        return {
            init: function (tableId, listData) {
                com.focusPage('#' + tableId).html(null);
                renderList(tableId, listData);
            },
            drawLine: function (v) {
                return creatLine(v);
            }
        };
    })();

    function initRecord(){
        com.post(api.payment.queryWalletran, {"walletran.wallet.wid": params.payment.wid}, function (res) {
            displayFunc.init('walletranResultList', res.walletrans);
        });
    }

});