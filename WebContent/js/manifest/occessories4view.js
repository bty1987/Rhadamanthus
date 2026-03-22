jQuery(function($) {

    var occessories = {

        oid: params.manifest.oid,
        orderId: params.manifest.orderId,
        pageType: params.urlLoadParams.type,

        oiid: [],
        sennum: [],
        vbalance: [],

        btns: {
            saveContent: com.focusPage("#saveContent"),
            cancelContent: com.focusPage("#cancelContent"),
        },

        items: {
            content: com.focusPage("#content"),
        },

        modals: {
            miniPopUp: com.focusPage('#miniPopUp'),
        },
    };

    com.focusPage("#saveContent").click(function() {

        savaData();

        com.closePopup();
    });

    com.post(api.inventory.queryOccessoriesItemByOid, {
        "occessoriesItem.oid": occessories.oid
    }, function(res) {

        var $list = com.focusPage('#list');
        var $lines = $list.find('.line');

        $.each(res.occessoriesItems, function(i, v) {

            occessories.oiid[i] = v.oiid;
            var $line = addline(1 + $lines.length).attr({
                'data-oiid': v.oiid,
                'data-selling': v.sennum,
            });

            $line.find('div.no').text(v.goods.no);
            $line.find('div.name').text(v.goods.name);
            $line.find('div.category').text(v.goods.category);
            $line.find('div.brand').text(v.goods.brand);
            $line.find('div.measurementUnit').text(v.goods.measurementUnit);
            $line.find('div.number').text(v.num);
            $line.find('div.pieceNum').text(v.goods.pieceNum);

            // 绑定费用按钮点击事件
            $line.find('div.charge button').click(function() {
                openChargeViewModal(v.oiid);
            });

            if (occessories.pageType == "bind" || occessories.pageType == "supplier") {
                $line.find('div.sennum input').val(v.num);
                $line.find('div.rbalance').text(v.rbalance);
                $line.find('div.vbalance').text(v.vbalance);
            } else if (occessories.pageType == "receive") {
                $line.find('div.sennum').text(v.sennum);
                $line.find('div.rbalance').text(v.rbalance);
                $line.find('div.vbalance input').val(v.rbalance);
            } else if (occessories.pageType != "bind" && ocessories.pageType != "receive" && occessories.pageType != "supplier") {
                $line.find('div.sennum').text(v.sennum);
                $line.find('div.rbalance').text(v.rbalance);
                $line.find('div.vbalance').text(v.vbalance);
            }
        });
    });

    com.focusPage("#occessoriesCancelBtn").click(function() {

        com.closePopup();
    });

    com.focusPage("#submitBtn").click(function() {

        if (occessories.pageType == "bind" || occessories.pageType == "supplier") {

            var b = com.focusPage(".editable");

            $.each(b, function(i, v) {

                occessories.sennum[i] = $(v).val();
            });
        } else if (occessories.pageType == "receive") {

            var a = com.focusPage(".editable");

            $.each(a, function(i, v) {

                occessories.vbalance[i] = $(v).val();
            });
        } else if (occessories.pageType != "bind" && occessories.pageType != "receive" && occessories.pageType != "supplier") {
            com.closePopup();
        }

        var options = {
            "occessories.oid": occessories.oid,
        };

        if (occessories.pageType == "bind") {

            com.popup4mini('#miniPopUp', '#layerEdit', "添加说明");

        } else if (occessories.pageType == "supplier") {

            occessories.oiid && occessories.oiid.length && $.each(occessories.oiid, function(i, v) {

                options["occessoriesItems[" + i + "].oiid"] = v;
                options["occessoriesItems[" + i + "].sennum"] = occessories.sennum[i];
            });

            com.post(api.inventory.deliveOccessories, options, function(data) {

                com.showAlert(com.info, "操作成功");

                com.closePopup();
            })
        } else if (occessories.pageType == "receive") {

            occessories.oiid && occessories.oiid.length && $.each(occessories.oiid, function(i, v) {

                options["occessoriesItems[" + i + "].oiid"] = v;
                options["occessoriesItems[" + i + "].vbalance"] = occessories.vbalance[i];
            });

            com.post(api.inventory.balanceOccessories, options, function(data) {

                com.showAlert(com.info, "操作成功");

                com.closePopup();
            })
        }
    });

    function addline(lineindex) {

        var $line = $('<li></li>').addClass('line').appendTo(com.focusPage('#list'));
        var $indexWrap = $('<div></div>').addClass('line-wrap order').append($('<div></div>').addClass('cell index').text(lineindex));
        var $lineInfoWrap = $('<div></div>').addClass('line-wrap content col10');
        var $optWrap = $('<div></div>').addClass('line-wrap action');

        var _lineInfoSet = [{
            cellClass: "no blue" // 编号
        }, {
            cellClass: "name grey", // 名称
        }, {
            cellClass: "category grey" // 品类
        }, {
            cellClass: "brand grey" // 品牌
        }, {
            cellClass: "measurementUnit grey" // 单位
        }, {
            cellClass: "number grey" // 数量
        }, {
            cellClass: "pieceNum blue" // 件数
        }, {
            cellClass: "sennum blue", // 到货数量
            hasInput: true,
            validate: "v_required v_float_3"
        }, {
            cellClass: "rbalance blue" // 原结算价
        }, {
            cellClass: "vbalance blue", // 结算值
            hasInput: true,
            validate: "v_required v_float_3"
        }, {
            cellClass: "charge grey", // 费用
            isAction: true
        }];

        var $btncheck = $('<a class="green" style="font-size: 18px"><i class="icon-ok"></i></a>');
        var $btndel = $('<a class="red" style="font-size: 18px"><i class=" icon-remove"></i></a>');

        $.each(_lineInfoSet, function(i, v) {

            var $cell = $('<div></div>').addClass('cell ' + v.cellClass);

            if (v.hasInput) {
                $('<input>').prop({
                    'type': 'text',
                    'autocomplete': 'off'
                }).addClass('editable').addClass(v.validate ? v.validate : '').appendTo($cell)
            }

            if (v.isAction) {
                // 添加费用按钮
                var $chargeBtn = $('<button type="button" class="btn btn-xs btn-info">费用</button>');
                $chargeBtn.appendTo($cell);
            }

            $cell.appendTo($lineInfoWrap);
        });

        $line.append($indexWrap).append($lineInfoWrap);

        var options = {
            "orderId": occessories.orderId
        };

        return $line;
    }

    function savaData() {

        if (com.validate('miniPopUp', 'right')) {
            return false;
        }

        var options = {
            "occessories.oid": occessories.oid,
            'occessories.content': com.focusPage('#content').val()
        };

        occessories.oiid && occessories.oiid.length && $.each(occessories.oiid, function(i, v) {

            options["occessoriesItems[" + i + "].oiid"] = v;
            options["occessoriesItems[" + i + "].sennum"] = occessories.sennum[i];
        });

        com.post(api.inventory.deliveOccessories, options, function(res) {

            com.showAlert(com.info, "操作成功");

            com.closePopup();
        });

    }

    /**
     * 打开费用查看弹窗（只读）
     */
    function openChargeViewModal(oiid) {
        // 清空费用列表
        com.focusPage('#chargeViewTableBody').html('');
        com.focusPage('#chargeTotalAmount').text('0.00');

        // 隐藏合计行
        com.focusPage('#chargeTotalRow').hide();

        // 查询费用
        var occessoriesChargeVO = {
            occessoriesItem: {
                oiid: oiid
            }
        };

        com.post(api.inventory.queryOccessoriesCharge, occessoriesChargeVO, function(res) {
            if (res && res.occessoriesCharges && res.occessoriesCharges.length > 0) {
                var totalAmount = 0;

                $.each(res.occessoriesCharges, function(i, charge) {
                    var price = charge.price / 1000; // 转换为元
                    var num = charge.num / 1000; // 转换为实际数量
                    var subtotal = price * num; // 小计

                    totalAmount += subtotal;

                    var $row = $('<tr></tr>');
                    $row.append($('<td></td>').text(i + 1));
                    $row.append($('<td></td>').text(charge.name));
                    $row.append($('<td></td>').text(price.toFixed(3)));
                    $row.append($('<td></td>').text(num.toFixed(3)));
                    $row.append($('<td></td>').addClass('red').text(subtotal.toFixed(3)));

                    com.focusPage('#chargeViewTableBody').append($row);
                });

                // 显示合计
                com.focusPage('#chargeTotalAmount').text(totalAmount.toFixed(3));
                com.focusPage('#chargeTotalRow').show();
            } else {
                // 无费用数据
                var $emptyRow = $('<tr></tr>');
                $emptyRow.append($('<td></td>').attr('colspan', 5).addClass('text-center').text('暂无费用数据'));
                com.focusPage('#chargeViewTableBody').append($emptyRow);
            }

            // 显示弹窗
            com.focusPage('#chargeViewModal').modal('show');
        });
    }

});
