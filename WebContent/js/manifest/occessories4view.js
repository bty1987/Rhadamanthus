jQuery(function($) {

    var occessories = {

        oid: params.manifest.oid,
        orderId: params.manifest.orderId,
        pageType: params.urlLoadParams.type,
        isExceed: params.manifest.isExceed, // 保存超阶标识

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

    // 当页面类型为 receive（结算）时，显示结算输入区域
    if (occessories.pageType == "receive") {
        com.focusPage("#balanceInputArea").show();
    }

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

            // 显示费用值（charge 字段单位是厘，需要除以 1000 转换为元）
            var chargeValue = v.charge || 0;
            var chargeText = chargeValue;
            $line.find('div.charge').text(chargeText);

            // 绑定费用按钮点击事件
            $line.find('div.charge').click(function() {
                openChargeViewModal(v.oiid, occessories.isExceed);
            }).css('cursor', 'pointer').attr('title', '点击查看费用详情');

            if (occessories.pageType == "bind" || occessories.pageType == "supplier") {
                $line.find('div.sennum input').val(v.num);
                $line.find('div.rbalance').text(v.rbalance);
                $line.find('div.vbalance').text(v.vbalance);
            } else if (occessories.pageType == "receive") {
                $line.find('div.sennum').text(v.sennum);
                $line.find('div.rbalance').text(v.rbalance);
                $line.find('div.vbalance input').val(v.rbalance);
            } else if (occessories.pageType != "bind" && occessories.pageType != "receive" && occessories.pageType != "supplier") {
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
            // 结算页面：不再从明细项汇总 vbalance，而是从输入框直接获取
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

            // 结算页面：从输入框获取 vbalance 和 rcharge
            var vbalanceValue = com.focusPage('#vbalanceInput').val();
            var rchargeValue = com.focusPage('#rchargeInput').val();

            options["occessories.vbalance"] = vbalanceValue;
            options["occessories.rcharge"] = rchargeValue;

            com.post(api.inventory.balanceOccessories, options, function(data) {

                com.showAlert(com.info, "操作成功");

                com.closePopup();
            })
        }
    });

    function addline(lineindex) {

        var $line = $('<li></li>').addClass('line').appendTo(com.focusPage('#list'));
        var $indexWrap = $('<div></div>').addClass('line-wrap order').append($('<div></div>').addClass('cell index').text(lineindex));
        var $lineInfoWrap = $('<div></div>').addClass('line-wrap content col11');
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
            cellClass: "charge grey", // 费用（显示值，可点击查看详情）
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
     * @param {number} oiid 外辅项ID
     * @param {number} isExceed 超阶标识（0-超阶，1-不超阶）
     */
    function openChargeViewModal(oiid, isExceed) {
        // 清空费用列表
        com.focusPage('#chargeViewTableBody').html('');
        com.focusPage('#chargeTotalAmount').text('0.00');

        // 隐藏合计行
        com.focusPage('#chargeTotalRow').hide();

        com.post(api.inventory.queryOccessoriesCharge, {"occessoriesCharge.occessoriesItem.oiid": oiid}, function(res) {
            if (res && res.occessoriesCharges && res.occessoriesCharges.length > 0) {
                var totalAmount = 0;

                $.each(res.occessoriesCharges, function(i, charge) {
                    var price = charge.price || 0;
                    var surplus = charge.surplus || 0;
                    var num = charge.num || 0;
                    var subtotal;

                    // 根据 isExceed 判断 surplus 是否参与运算
                    // isExceed == 0 时（超阶），surplus 参与运算；否则不参与
                    if (isExceed == 0) {
                        // 超阶：price + surplus
                        subtotal = (price + surplus) * num;
                    } else {
                        // 不超阶：仅 price
                        subtotal = price * num;
                    }

                    totalAmount += subtotal;

                    var $row = $('<tr></tr>');
                    $row.append($('<td></td>').text(i + 1));
                    $row.append($('<td></td>').text(charge.name));
                    $row.append($('<td></td>').text(price.toFixed(3)));
                    $row.append($('<td></td>').text(num.toFixed(0)));
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
