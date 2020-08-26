jQuery(function ($) {

    var repairPay = {
        aid: params.aid,
        repairPayData: com.focusPage("#repairPayData"),
        addRepairPay: com.focusPage("#addRepairPay"),
        items: {
            type: com.focusPage("#type"),
            money: com.focusPage("#money")
        },
        submitBtn: com.focusPage("#submitBtn")
    };

    com.post(api.ds.customer, {}, function (data) {
        repairPay.items.type.bindData(data.repairPayType, "key", "value", true, false);
    }, null, false);

    function renderList() {
        com.post(api.customer.queryRepairpay, {"repairpay.aid": repairPay.aid}, function (data) {
            displayFunc.init(repairPay.repairPayData, data.repairpays);
        });
    }

    renderList();

    var displayFunc = (function () {

        var renderList = function (tableId, listData) {

            var $tableWrap = tableId.empty();
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

            var $liLine = $('<li></li>').addClass('item-blue clearfix');
            var $span = $('<small></small>').addClass('oid blue').css('padding-left', '10px').html(v.money);
            var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(v.type == 0 ? "款项" : v.status == 1 ? "扣款" : "成本")).append($span);
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

            var $btnDel = $('<a></a>').addClass('btn btn-minier btn-danger').html('删除');

            var propertyArr = [
                ["创建人:", v.creater.currentName, "grey"],
                ["创建时间:", v.createTime, "grey"],
                ["类型:", v.type==0? "款项" : v.status == 1 ? "扣款" : "成本", "red"],
                ["金额:", v.money, "blue"],
                ["状态:", v.status == 0 ? "初始" : v.status == 1 ? "已付款" : "已确认", "red"]
            ];

            $.each(propertyArr, function (index, value) {
                var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                $liProperty.appendTo($ulProperty);
            });

            $divBtnWrap.append($btnDel).appendTo($h3);

            $liLine.append($h3).append($ulProperty);

            $btnDel.click(function () {
                delFunction(v.rpid);
            });

            return $liLine;
        };

        return {
            init: function (tableId, listData) {
                if (!listData.length) {
                    var $resultList = repairPay.repairPayData.addClass('dz-default dz-message').html('');
                    var $zone = $('<div></div>').addClass('dropzone dz-clickable').css('margin', '20px').css('border', '0px').appendTo($resultList);
                    var $mesg = $('<div></div>').addClass('dz-default dz-message').appendTo($zone);
                    var $span = $('<span></span>').text('无可用数据提供').appendTo($mesg);
                    return $resultList;
                } else {
                    tableId.html(null);
                    renderList(tableId, listData);
                }
            },
            drawLine: function (v) {
                return creatLine(v);
            }
        };
    })();

    repairPay.addRepairPay.click(function () {
        com.popup4mini('#layerPopUpRepairPay', '#layerRepairPay', "添加维修款");
        com.focusPage('#type','#layerPopUpRepairPay').val("");
        com.focusPage('#money','#layerPopUpRepairPay').val("");
    });

    repairPay.submitBtn.click(function () {
        saveFunction();
        com.closePopup(com.focusPage("#submitBtn", "#layerPopUpRepairPay"));
    });

    function saveFunction() {

        if (com.validate('layerPopUpRepairPay', 'right')) {
            return false
        }

        var type = com.focusPage('#type','#layerPopUpRepairPay').val();
        var money = com.focusPage('#money','#layerPopUpRepairPay').val();

        var option = {
            "repairpay.aid": repairPay.aid,
            "repairpay.type": type,
            "repairpay.money": money
        };

        com.post(api.customer.addRepairpay, option, function (res) {
            com.showAlert(com.info, '添加成功');
            renderList();
        })
    }

    function delFunction(rpid) {

        var option = {
            "repairpay.rpid": rpid
        };
        com.post(api.customer.deleteRepairpay, option, function () {
            com.showAlert(com.info, '删除成功');
            renderList();
        })
    }

});