jQuery(function($) {

    var occessories = {
        oid: params.manifest.oid,
        isExceed: params.manifest.isExceed
    };

    // 查询外辅单项明细并显示
    com.post(api.inventory.queryOccessoriesItemByOid, {
        "occessoriesItem.oid": occessories.oid
    }, function(res) {

        var $list = com.focusPage('#list');
        var $lines = $list.find('.line');

        $.each(res.occessoriesItems, function(i, v) {

            var $line = addline(1 + $lines.length).attr({
                'data-oiid': v.oiid,
                'data-is-exceed': occessories.isExceed
            });

            $line.find('div.no').text(v.goods.no);
            $line.find('div.name').text(v.goods.name);
            $line.find('div.category').text(v.goods.category);
            $line.find('div.brand').text(v.goods.brand);
            $line.find('div.measurementUnit').text(v.goods.measurementUnit);
            $line.find('div.number').text(v.num);
            $line.find('div.pieceNum').text(v.goods.pieceNum);
            $line.find('div.sennum').text(v.sennum);
            $line.find('div.rbalance').text(v.rbalance);
            $line.find('div.vbalance').text(v.vbalance);

            // 显示费用值
            // 注意：queryOccessoriesItemByOid 的 tranargs 已将 charge 从分转为元，直接显示
            $line.find('div.charge').text(v.charge);

            // 绑定费用点击事件
            $line.find('div.charge').click(function() {
                openChargeViewModal(v.oiid, occessories.isExceed);
            }).css('cursor', 'pointer').attr('title', '点击查看费用详情');
        });
    });

    // 关闭按钮
    com.focusPage("#occessoriesCancelBtn").click(function() {
        com.closePopup();
    });

    // 确定按钮（仅关闭弹窗）
    com.focusPage("#submitBtn").click(function() {
        com.closePopup();
    });

    /**
     * 添加明细行
     */
    function addline(lineindex) {

        var $line = $('<li></li>').addClass('line').appendTo(com.focusPage('#list'));
        var $indexWrap = $('<div></div>').addClass('line-wrap order').append($('<div></div>').addClass('cell index').text(lineindex));
        var $lineInfoWrap = $('<div></div>').addClass('line-wrap content col11');

        var _lineInfoSet = [{
            cellClass: "no blue"          // 编号
        }, {
            cellClass: "name grey"        // 名称
        }, {
            cellClass: "category grey"    // 品类
        }, {
            cellClass: "brand grey"       // 品牌
        }, {
            cellClass: "measurementUnit grey"  // 单位
        }, {
            cellClass: "number grey"      // 数量
        }, {
            cellClass: "pieceNum blue"    // 件数
        }, {
            cellClass: "sennum blue"      // 到货数量
        }, {
            cellClass: "rbalance blue"    // 原结算价
        }, {
            cellClass: "vbalance blue"    // 结算值
        }, {
            cellClass: "charge grey"      // 费用
        }];

        $.each(_lineInfoSet, function(i, v) {
            $('<div></div>').addClass('cell ' + v.cellClass).appendTo($lineInfoWrap);
        });

        $line.append($indexWrap).append($lineInfoWrap);
        return $line;
    }

    /**
     * 打开费用查看弹窗（只读）
     */
    function openChargeViewModal(oiid, isExceed) {
        com.focusPage('#chargeViewTableBody').html('');
        com.focusPage('#chargeTotalAmount').text('0.000');
        com.focusPage('#chargeTotalRow').hide();

        com.post(api.inventory.queryOccessoriesCharge, {
            "occessoriesCharge.occessoriesItem.oiid": oiid
        }, function(res) {
            if (res && res.occessoriesCharges && res.occessoriesCharges.length > 0) {
                var totalAmount = 0;

                $.each(res.occessoriesCharges, function(i, charge) {
                    // tranargs 已将 price、surplus、num 从千分之一单位转为正常值
                    var price = charge.price || 0;
                    var surplus = charge.surplus || 0;
                    var num = charge.num || 0;
                    var displayPrice, subtotal;

                    // 根据 isExceed 判断 surplus 是否参与运算
                    // isExceed == 0 (ISEXCEED_EXCEED_INT) 表示超阶，surplus 参与运算
                    if (isExceed == 0) {
                        displayPrice = price + surplus;
                        subtotal = displayPrice * num;
                    } else {
                        displayPrice = price;
                        subtotal = price * num;
                    }

                    totalAmount += subtotal;

                    var $row = $('<tr></tr>');
                    $row.append($('<td></td>').text(i + 1));
                    $row.append($('<td></td>').text(charge.name));
                    $row.append($('<td></td>').text(displayPrice.toFixed(3)));
                    $row.append($('<td></td>').text(num));
                    $row.append($('<td></td>').addClass('red').text(subtotal.toFixed(3)));

                    com.focusPage('#chargeViewTableBody').append($row);
                });

                com.focusPage('#chargeTotalAmount').text(totalAmount.toFixed(3));
                com.focusPage('#chargeTotalRow').show();
            } else {
                var $emptyRow = $('<tr></tr>');
                $emptyRow.append($('<td></td>').attr('colspan', 5).addClass('text-center').text('暂无费用数据'));
                com.focusPage('#chargeViewTableBody').append($emptyRow);
            }

            com.focusPage('#chargeViewModal').modal('show');
        });
    }

});
