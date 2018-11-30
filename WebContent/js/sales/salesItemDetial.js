$(function () {

    var approvalPostData = {};
    var approvalSalesRefundPostData = {};
    var approvalSalesRefundItemPostData = {};

    var sid = params.sid;
    var fullpayStatus = params.fullpayStatus;
    var status = params.status;
    var dompany = params.dompany;

    var refundBtn = com.focusPage('#refundBtn');
    var refundCommitBtn = com.focusPage('#refundCommitBtn');
    var refundCancelBtn = com.focusPage('#refundCancelBtn');
    var fullRefundBtn = com.focusPage('#fullRefundBtn');
    var reOrderBtn = com.focusPage('#reOrderBtn');
    var backBtn = com.focusPage('#backBtn');
    var importBtn = com.focusPage('#importBtn');

    var refund = com.focusPage('#refund');
    var refundTotal = com.focusPage('#refundTotal');
    var approver = com.focusPage('#approver');
    var refundDes = com.focusPage('#refundDes');

    var approvalStr = {
        receiverId: "approval.receiver.userId",
        comment: "approval.comment"
    };

    var approvalSalesRefundStr = {
        sid: "approvalSalesRefund.sid",
        refund: "approvalSalesRefund.refund",
        refundTotal:"approvalSalesRefund.refundTotal",
        type: "approvalSalesRefund.type"
    };

    if ((fullpayStatus != 2 && status != 4) || dompany == "dompany") {
        hideButtons([refundBtn, refundCancelBtn, refundCommitBtn, fullRefundBtn, reOrderBtn]);
    }

    refund.focus(function () {
        refund.popover('destroy');
    });

    backBtn.click(function () {
        com.switchPage(api.index.querySalesIndex.url);
    });

    refundBtn.click(function () {

        if (status != 0 && status != 5) {
            com.showAlert(com.error, "该订单状态不能退货");
            return false;
        }

        hideButtons([fullRefundBtn, refundBtn, reOrderBtn, backBtn, importBtn]);
        showButtons([refundCommitBtn, refundCancelBtn]);

        com.focusPage('#list li.clearfix div.action-buttons a.btn').addClass('hide');
        recordMoney(false);

    });

    refundCommitBtn.click(function () {

        if (!calcRefundData(false)) return

        approvalUtils.initqueryApprovalUser("approver", 10);

        openRefundlayer(function (index, layero) {

            createApprovalPostData();
            creatapprovalSalesRefundPostData("0");

            var _approval = com.focusPage('#approver');

            var radios = _approval.find('input:checked').attr('userid');

            if (!com.validate('layerRefund', 'right')) {

                if (!checkNum(refund, "退货金额错误", "right")) {
                    return false;
                }

                if (radios == null || radios == "") {
                    layer.msg('请选择审批人', {time: 3e3});
                    return false;
                }

                com.post(api.approval.submitApprovalForSalesRefund, $.extend(approvalPostData, approvalSalesRefundPostData, approvalSalesRefundItemPostData),
                    function () {
                        refundCancelBtn.trigger('click');
                        refreshPage();
                        refundLayerOut();
                        layer.msg("退货申请已提交.");
                        com.focusPage('#approver').empty();
                    }, function (e) {
                        com.showAlert(com.error, e.errorMsg);
                    });
            }

        });
    });

    refundCancelBtn.click(function () {

        showButtons([fullRefundBtn, reOrderBtn, refundBtn, backBtn, importBtn]);
        hideButtons([refundCommitBtn, refundCancelBtn]);

        com.focusPage('#list div.action-buttons a.btn').removeClass('hide');
        com.focusPage('#list div.action-buttons label').remove();

    });

    fullRefundBtn.click(function () {

        if (status != 0 && status != 5) {
            com.showAlert(com.error, "该订单状态不能全退");
            return false;
        }

        recordMoney(true);
        if (!calcRefundData(true)) return

        approvalUtils.initqueryApprovalUser("approver", 10);

        openRefundlayer(function (index, layero) {

            var _approval = com.focusPage('#approver');

            var radio = _approval.find('input:checked').attr('userid');

            if (radio == null || radio == "") {
                layer.msg('请选择审批人', {time: 3e3});
                return false;
            }

            creatapprovalSalesRefundPostData("2");
            createApprovalPostData();

            if (!com.validate('layerRefund', 'right')) {

                if (!checkNum(refund, "退货金额错误", "right")) {
                    return false;
                }

                com.post(api.approval.submitApprovalForSalesRefund, $.extend(approvalPostData, approvalSalesRefundPostData, approvalSalesRefundItemPostData),
                    function () {
                        status = 2;
                        com.focusPage('#list div.action-buttons label').remove();
                        refreshPage();
                        refundLayerOut();
                        layer.msg("全退申请已提交.");
                        com.focusPage('#approver').empty();
                    }, function (e) {
                        com.showAlert(com.error, e.errorMsg);
                    });

            }
        });

    });

    reOrderBtn.click(function () {

        if (status != 0 && status != 5) {
            com.showAlert(com.error, "该订单状态不能倒单");
            return false;
        }

        recordMoney(true);
        console.log(calcRefundData(true));
        if (!calcRefundData(true)) return

        approvalUtils.initqueryApprovalUser("approver", 10);

        openRefundlayer(function (index, layero) {

            var _approval = com.focusPage('#approver');

            var radio = _approval.find('input:checked').attr('userid');

            if (radio == null || radio == "") {
                layer.msg('请选择审批人', {time: 3e3});

                return false;
            }

            creatapprovalSalesRefundPostData("3");
            createApprovalPostData();
            if (!com.validate('layerRefund', 'right')) {
                if (!checkNum(refund, "退货金额错误", "right")) {
                    return false;
                }

                com.post(api.approval.submitApprovalForSalesRefund, $.extend(approvalPostData, approvalSalesRefundPostData, approvalSalesRefundItemPostData),
                    function () {
                        status = 3;
                        com.focusPage('#list div.action-buttons label').remove();
                        refreshPage();
                        refundLayerOut();
                        layer.msg("倒单申请已提交.");
                        com.focusPage('#approver').empty();
                    }, function (e) {
                        com.showAlert(com.error, e.errorMsg);
                    });
            }
        });

    });

    var initList = function (listData) {
        var $tableWrap = com.focusPage('#list');
        var $ul = $('<ul></ul>').addClass('item-list ui-sortable  fl-table-list');

        if (listData && listData.length) {
            $.each(listData, function (i, v) {

                var $liLine = $('<li></li>').addClass('item-orange clearfix');
                var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
                var $h3 = $('<h3></h3>').addClass('oid');
                var $small = $('<small></small>').addClass('blue').html(v.goods.name + ' ' + v.goods.no);
                var $btnDiv = $('<div></div>').addClass('action-buttons pull-right').attr('data-num', v.num).attr('data-selling', v.price).attr('data-siid', v.siid);

                var $btnEdit = $('<a></a>').addClass('btn btn-minier btn-yellow').html('编辑');
                var $btnDelete = $('<a></a>').addClass('btn btn-minier btn-success').html('删除');

                var propertyArr = [
                    ["商品品类:", v.goods.category, "grey"],
                    ["商品颜色:", v.color.name, "grey"],
                    ["商品规格:", v.format.info, "grey"],
                    ["售价:", v.selling, "blue"],
                    ["折扣价:", v.disPrice, "blue"],
                    ["折让价:", v.price, "blue"],
                    ["数量:", v.num, "blue"],
                    ["总价:", v.total, "blue"],
                    ["备注:", v.comment, "grey"],
                ];

                $.each(propertyArr, function (index, value) {
                    var $liProperty = $('<li></li>');
                    $('<strong></strong>').html(value[0]).appendTo($liProperty);
                    $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                    $liProperty.appendTo($ulProperty);
                });

                $liLine.appendTo($ul);
                $liLine.append($h3).append($ulProperty);

                if(dompany!="dompany"){
                    if (fullpayStatus == -1 && status != 4) {
                        $btnDiv.append($btnEdit).append($btnDelete);
                    }
                }

                $small.appendTo($h3);
                $btnDiv.appendTo($h3);

                $btnDelete.click(function (e) {
                    e.stopPropagation();

                    layer.confirm('确定要删除吗?', {
                        btn: ['确定', '取消'] //按钮
                    }, function (indexo, layero) {
                        com.post(api.inventory.deleteSalesItem, {"salesItem.siid": v.siid}, function () {

                            $btnDelete.parents('li.clearfix').remove();

                        }, function (e) {
                            com.showAlert(com.error, e.errorMsg);
                        });

                        layer.close(indexo);
                    }, function () {

                    });

                });

                $btnEdit.click(function () {

                    com.focusPage('#num').val(v.num);
                    com.focusPage('#total').val(v.total);
                    com.focusPage('#comment').val(v.comment);

                    com.focusPage('#num').on('change', function () {
                        if (com.validate('layerEdit', 'right') == false) {
                            com.focusPage('#total').val(parseFloat(com.focusPage('#num').val()) * parseFloat(v.price));
                        }
                    });
                    openMoneylayer(function (index, layero) {

                        var num = com.focusPage('#num').val();
                        var total = com.focusPage('#total').val();
                        var comment = com.focusPage('#comment').val();

                        var editArr = {
                            "salesItem.siid": v.siid,
                            "salesItem.num": num,
                            "salesItem.total": total,
                            "salesItem.comment": comment
                        };

                        if (com.validate('layerEdit', 'right') == false) {
                            com.post(api.inventory.updateSalesItem, editArr, function () {
                                com.focusPage('#list ul.item-list').remove();
                                querySalesItemBySid(v.sid);
                                layer.closeAll();
                            }, function (e) {
                                com.showAlert(com.error, e.errorMsg);
                            }, false);
                        }


                    });

                });

            });

            $ul.appendTo($tableWrap);
        }
    };

    querySalesItemBySid(sid);

    function querySalesItemBySid(sid) {
        com.post(api.inventory.querySalesItemBySid, {"sales.sid": sid}, function (data) {
            initList(data.salesItems);
        }, function (e) {
            com.showAlert(com.error, e.errorMsg);
        }, false);
    }

    function openMoneylayer(callback) {
        layer.closeAll();
        layer.open({
            type: 1,
            skin: 'layui-layer-lan',
            title: "编辑",
            content: com.focusPage('#layerEdit'),
            area: ( $(window).width() * 0.6 < 620 ? $(window).height() * 0.6 : 620 ) + "px",
            //maxmin: true,
            zIndex: 9000,
            btn: ['确定', '取消'],
            yes: function (index, layero) {
                callback(index, layero);

            },
            btn2: function (index, layero) {
                //按钮【按钮二】的回调
                com.clearValidator();
            },
            cancel: function () {
                //右上角关闭回调
                com.clearValidator();
            }
        });
    }

    function openRefundlayer(callback) {
        layer.closeAll();
        layer.open({
            type: 1,
            skin: 'layui-layer-lan',
            title: "退货信息",
            content: com.focusPage('#layerRefund'),
            area: ( $(window).width() * 0.6 < 620 ? $(window).height() * 0.6 : 620 ) + "px",
            //maxmin: true,
            zIndex: 9000,
            btn: ['保存', '取消'],
            yes: function (index, layero) {
                callback(index, layero);

            },
            btn2: function (index, layero) {
                //按钮【按钮二】的回调
                com.clearValidator();
                closeRefundlayer();
                com.focusPage('#approver').empty();

            },
            cancel: function () {
                //右上角关闭回调
                com.clearValidator();
                closeRefundlayer();
                com.focusPage('#approver').empty();
            }
        });
    }

    function closeRefundlayer() {
        refundTotal.val("");
        com.focusPage('#refund').val("");
        com.focusPage('#refundDes').val("");
        com.focusPage('#list li.clearfix div.action-buttons').empty();
        approvalSalesRefundPostData = {};
        approvalSalesRefundItemPostData = {};
    }

    function checkNum($input, message, position) {

        var priceRex = /^\d{1,8}(\.\d{1,3})?$/;

        if ($input.attr('max') < parseFloat($input.val()) || $input.attr('min') > $input.val() || $input.val() < 0 || !priceRex.test($input.val())) {

            $input.focus().select();

            $input.addClass('popover-notitle').attr({
                "data-rel": "popover",
                "data-placement": position,
                "data-original-title": "",
                "title": "",
                "data-content": message

            }).popover('show');

            return false;
        } else {
            $input.popover('destroy');

            return true;
        }
    }

    function hideButtons(buttons) {
        $.each(buttons, function (i, v) {
            v.addClass('hide');
        });
    }

    function showButtons(buttons) {
        $.each(buttons, function (i, v) {
            v.removeClass('hide');
        });
    }

    function createapprovalSalesRefundItemPostData(i, sid, siid, num, itemTotal) {

        approvalSalesRefundItemPostData["approvalSalesRefundItem[" + i + "].sid"] = sid;
        approvalSalesRefundItemPostData["approvalSalesRefundItem[" + i + "].salesItem.siid"] = siid;
        approvalSalesRefundItemPostData["approvalSalesRefundItem[" + i + "].num"] = num;
        approvalSalesRefundItemPostData["approvalSalesRefundItem[" + i + "].total"] = itemTotal;

    }

    function calcRefundData(isAll) {

        var flag = true;

        var total = 0;

        var itemTotal = 0;

        com.focusPage('#list input[name="num"]').each(function (i) {

            if (typeof($(this)) != "undefined") {
                if (!isAll) {

                    if (!checkNum($(this), "数量错误", "bottom")) {
                        flag = false;
                    }

                    itemTotal = parseFloat($(this).val()) * parseFloat($(this).attr('selling'));
                    total += itemTotal;
                    if ($(this).val() != 0) {
                        createapprovalSalesRefundItemPostData(i, sid, $(this).attr('data-siid'), $(this).val(), itemTotal);
                    }

                } else {

                    itemTotal = parseFloat($(this).attr('max')) * parseFloat($(this).attr('selling'));
                    total += itemTotal;

                    createapprovalSalesRefundItemPostData(i, sid, $(this).attr('data-siid'), $(this).attr('max'), itemTotal);
                }
            }
        });


        if (!checkZeroForReturn(total)) {
            return false;
        }

        refundTotal.val(total);

        return flag;
    }

    function createApprovalPostData() {

        approvalPostData[approvalStr.receiverId] = approver.find('input:checked').attr('userid');
        approvalPostData[approvalStr.comment] = refundDes.val();
    }

    function creatapprovalSalesRefundPostData(type) {
        approvalSalesRefundPostData[approvalSalesRefundStr.sid] = sid;
        approvalSalesRefundPostData[approvalSalesRefundStr.refund] = refund.val();
        approvalSalesRefundPostData[approvalSalesRefundStr.refundTotal] = refundTotal.val();
        approvalSalesRefundPostData[approvalSalesRefundStr.type] = type;
    }

    function refundLayerOut() {
        refund.val("");
        refundDes.val("");
        approver.val("");
        layer.closeAll();
    }

    function recordMoney(ishide) {

        com.focusPage('#list li.clearfix div.action-buttons').each(function (i) {

            var $inputNum = $('<input>').addClass('span1').attr('name', 'num').attr('value', '0').attr('type', 'number')
                .attr('min', '0').attr('max', $(this).attr('data-num')).attr('step', '0.001')
                .attr('selling', $(this).attr('data-selling'))
                .attr('data-siid', $(this).attr('data-siid'));

            var $label = $('<label></label>').addClass('span2').html("退货数量：").append($inputNum);

            $(this).append($label);

            if (ishide) {

                hideButtons([$inputNum, $label]);
            }

        });
    }

    function refreshPage() {
        salesPostData = {};
        salesPostData["sid"] = sid;
        salesPostData["fullpayStatus"] = fullpayStatus;
        salesPostData["status"] = status;
        com.switchPage(api.index.salesItemDetialIndex.url);
    }

    function checkZeroForReturn(val) {
        if (val == 0) {
            com.showAlert(com.error, "总退款数量为0!");
            return false;
        } else {
            return true;
        }
    }

    //导出点击事件
    importBtn.click(function () {

        com.post(api.inventory.querySalesItemBySid, {"sales.sid": sid}, function (data) {

            $.exceler({
                column: [
                    ['品牌系列', 'goods.category'],
                    ['产品名称', 'goods.name'],
                    ['产品编码', 'goods.no'],
                    ['产品规格', 'format.info'],
                    ['单价', 'price'],
                    ['数量', 'num'],
                    ['金额', 'total'],
                    ["备注", 'comment'],
                ],
                list: data.salesItems
            });
        }, function (e) {
            com.showAlert(com.error, e.errorMsg);
        }, false);


    });

});