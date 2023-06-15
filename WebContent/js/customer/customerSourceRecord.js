$(function() {

    var createCustomerSource = {
        record: com.focusPage("#record"),
        items: {
            comments: com.focusPage("#comments")
        }
    };

    createCustomerSource.record.bindClick(record);

    initRecord();

    var displayFunc = (function() {

        var renderList = function(tableId, listData) {

            var $tableWrap = com.focusPage('#' + tableId);
            var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');
            if (listData && listData.length) {
                $.each(listData, function(i, v) {

                    var $liLine = creatLine(v);
                    $liLine.appendTo($ul);
                });
                $ul.appendTo($tableWrap);
            }
        };

        var creatLine = function(v) {

            var $liLine = $('<li></li>').addClass('item-orange clearfix ');
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(v.comment));
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

            var customersArr = [["操作人:", v.operater.userName, "grey"], ["记录时间:", v.operatTime, "green"]];
            $.each(customersArr, function(index, value) {

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
            init: function(tableId, listData) {

                com.focusPage('#' + tableId).html(null);
                renderList(tableId, listData);
            },
            drawLine: function(v) {

                return creatLine(v);
            }
        };
    })();

    function record() {

        if (com.validate('form'))
            return false;

        var options = {
            'customerOriginRecord.csid': params.customer.csid,
            'customerOriginRecord.comment': createCustomerSource.items.comments.val()
        };

        com.post(api.customer.addCustomerOriginRecord, options, function(res) {

            com.cleanItems(createCustomerSource.items);
            initRecord();
            com.showAlert(com.info, "记录创建成功");
        });
    }

    function initRecord() {

        com.post(api.customer.queryCustomerOriginRecord, {
            "customerOriginRecord.csid": params.customer.csid
        }, function(res) {

            displayFunc.init('resultList1', res.customerOriginRecords);
        });
    }

});