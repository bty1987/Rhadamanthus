jQuery(function ($) {
    paytran = {
        paymentTypes: {},
        pointStatus: {}
    };

    com.post(api.ds.payment, {}, function (res) {
        $.each(res.receiptPaymentType, function (i, v) {
            paytran.paymentTypes[v.key] = v.value;
        });
        $.each(res.pointStatus, function (i, v) {
            paytran.pointStatus[v.key] = v.value;
        });

    }, null, false);

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
            var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(paytran.paymentTypes[v.type]));
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var propertyArr = [
                ["收据名称:", v.no, "blue"],
                ["机器编号:", v.sn, "blue"],
                ["状态:", paytran.pointStatus[v.status] , "red"],
                ["金额:", v.money, "green"],
                ["创建人:", v.creater.currentName, "grey"],
                ["创建时间:", v.createTime, "green"]
            ];

            $.each(propertyArr, function (index, value) {
                var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                $liProperty.appendTo($ulProperty);
            });

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
        }
    })();

    var searcher = new Searcher();

    searcher.init(["payment-point-sn", "payment-paymentType", "payment-createTime", "payment-point-status", "payment-activity-creater-name"], "condList", api.payment.pagePaytran, function (data) {
        displayFunc.init('resultList', data);
    }, "pagenation", "receiptPostData", null, false, null, null);
});

