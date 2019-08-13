$(function () {

    var salesItem = {
        
        sid: params.sid,
        dompany : params.dompany,
        sales : null,

        items: {
            refundTotal: com.focusPage("#refundTotal"),
            approver : com.focusPage('#salesItemDetialapprover'),
            refundDes : com.focusPage('#refundDes')
        },
        btns:{
            refundBtn : com.focusPage('#refundBtn'),
            refundCommitBtn : com.focusPage('#refundCommitBtn'),
            refundCancelBtn : com.focusPage('#refundCancelBtn'),
            fullRefundBtn : com.focusPage('#fullRefundBtn'),
            reOrderBtn : com.focusPage('#reOrderBtn'),
            importBtn : com.focusPage('#importBtn'),

            editCancelBtn : com.focusPage('#editCancelBtn'),
            approverSaveBtn : com.focusPage("#approverSaveBtn"),
            approverCancelBtn : com.focusPage("#approverCancelBtn")
        },
        
        options: {},
        edit_data:{},
        approvalType: null
    };

    com.post(api.inventory.querySalesBySid, {"sales.sid":salesItem.sid}, function (res) {
        salesItem.sales = res.sales;
    }, null,false);

    if ((salesItem.sales.fullpayStatus != 2 && salesItem.sales.status != 4) || salesItem.dompany == "dompany" || salesItem.dompany == "pompany") {
        hideButtons([salesItem.btns.refundBtn, salesItem.btns.refundCancelBtn, salesItem.btns.refundCommitBtn, salesItem.btns.fullRefundBtn, salesItem.btns.reOrderBtn]);
    }

    var initList = function (listData) {
        var $tableWrap = com.focusPage('#list');
        var $ul = $('<ul></ul>').addClass('item-list ui-sortable  fl-table-list');

        if (listData && listData.length) {
            $.each(listData, function (i, v) {
                var $num = v.num;//数量
                var $price = v.price;//折让价
                var $total = v.total;

                var $liLine = $('<li></li>').addClass('item-orange clearfix');
                var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
                var $h3 = $('<h3></h3>').addClass('oid').attr({"li_Num" : $num, "li_Price" : $price, "li_delTotal" : $total});
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
                    ["类型:", v.priceType == "0" ? "正价" : "特价", "red"],
                    ["备注:", v.comment, "grey"]
                ];

                $.each(propertyArr, function (index, value) {
                    var $liProperty = $('<li></li>');
                    $('<strong></strong>').html(value[0]).appendTo($liProperty);
                    $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                    $liProperty.appendTo($ulProperty);
                });

                $liLine.appendTo($ul);
                $liLine.append($h3).append($ulProperty);

                if(salesItem.dompany!="dompany" && salesItem.dompany!="pompany"){
                    if (salesItem.sales.fullpayStatus == -1 && salesItem.sales.status != 4) {
                        $btnDiv.append($btnEdit).append($btnDelete);
                    }
                }

                $small.appendTo($h3);
                $btnDiv.appendTo($h3);

                $btnDelete.click(function (e) {
                    e.stopPropagation();

                    var $this = $(this);
                    var $delTotal = $this.parents('div').parents('li').find('h3').attr('li_delTotal');

                    var $lis = com.focusPage(".item-orange" ,"#layerPopUp");//拿到每条子项li
                    var priceTotalDel = 0;

                    $lis && $lis.length && $.each($lis, function (i, v) {
                        var $v = $(v);
                        priceTotalDel += utils.changeThrDecimal(parseFloat(utils.accMul($v.find('h3').attr('li_Num'), $v.find('h3').attr('li_Price'))));
                    });

                    priceTotalDel = utils.changeThrDecimal(utils.accSub(priceTotalDel, $delTotal));
                    var ops = {
                        "salesItem.siid": v.siid,
                        "sales.total": priceTotalDel
                    };

                    com.showConfirm('确定要删除吗?', function (indexo, layero) {
                        com.post(api.inventory.deleteSalesItem, ops, function () {

                            $btnDelete.parents('li.clearfix').remove();
                        });
                    });
                });

                $btnEdit.click(function () {
                    salesItem.edit_data = v;

                    com.popup4mini("#miniPopUp", "#layerEdit", "编辑", function () {
                        com.focusPage("#miniPopUp").attr("li_Total", $total);
                        com.focusPage('#salesItemDetialnum').on('change', function () {
                            if (com.validate('miniPopUp', 'right')) {
                                return false;
                            }
                            com.focusPage('#salesItemDetialtotal').val(utils.changeThrDecimal(utils.accMul(parseFloat(com.focusPage('#salesItemDetialnum').val()), parseFloat(v.price))));
                        });
                    }, function () {
                        com.clearValidator();
                    },function () {
                        com.focusPage('#salesItemDetialnum').val(v.num);
                        com.focusPage('#salesItemDetialtotal').val(v.total);
                        com.focusPage('#salesItemDetialcomment').val(v.comment);
                    });
                });
            });

            $ul.appendTo($tableWrap);
        }
    };

    com.post(api.inventory.querySalesItemBySid, {"sales.sid": salesItem.sid}, function (data) {
        initList(data.salesItems);
    }, null, false);

    salesItem.btns.refundBtn.click(function () {

        if (salesItem.sales.status != 0 && salesItem.sales.status != 5) {
            com.showAlert(com.error, "该订单状态不能退货");
            return false;
        }

        hideButtons([salesItem.btns.fullRefundBtn, salesItem.btns.refundBtn, salesItem.btns.reOrderBtn, salesItem.btns.importBtn]);
        showButtons([salesItem.btns.refundCommitBtn, salesItem.btns.refundCancelBtn]);

        com.focusPage('#list li.clearfix div.action-buttons a.btn').addClass('hide');
        recordMoney(false);

    });

    //退货确定按钮
    salesItem.btns.refundCommitBtn.click(function () {

        salesItem.approvalType = 1;

        if (!calcRefundData(false)) return false;
        com.popup4mini("#miniPopUp", "#layerRefund","退货信息", "", function () {
            com.clearValidator();
            closeRefundlayer();
            salesItem.items.approver.empty();
        },function () {
            salesItem.items.refundTotal.val(parseInt(salesItem.items.refundTotal.val()));
            approvalUtils.initqueryApprovalUser("salesItemDetialapprover", 10);
        });
    });

    //全退
    salesItem.btns.fullRefundBtn.click(function () {

        salesItem.approvalType = 2;

        if (salesItem.sales.status != 0 && salesItem.sales.status != 5) {
            com.showAlert(com.error, "该订单状态不能全退");
            return false;
        }

        recordMoney(true);
        if (!calcRefundData(true)) return;

        com.popup4mini("#miniPopUp", "#layerRefund","退货信息", "", function () {
            com.clearValidator();
            closeRefundlayer();
            salesItem.items.approver.empty();
        },function () {
            salesItem.items.refundTotal.val(parseInt(utils.accSub(utils.accSub(salesItem.items.refundTotal.val(), salesItem.sales.coupon), salesItem.sales.venderMaling)));
            approvalUtils.initqueryApprovalUser("salesItemDetialapprover", 10);
        });
    });

    //倒单
    salesItem.btns.reOrderBtn.click(function () {
        salesItem.approvalType = 3;
        if (salesItem.sales.status != 0 && salesItem.sales.status != 5) {
            com.showAlert(com.error, "该订单状态不能倒单");
            return false;
        }

        recordMoney(true);
        if (!calcRefundData(true)) return;

        com.popup4mini("#miniPopUp", "#layerRefund","退货信息","", function () {
            com.clearValidator();
            closeRefundlayer();
            salesItem.items.approver.empty();
        },function () {
            salesItem.items.refundTotal.val(parseInt(utils.accSub(utils.accSub(salesItem.items.refundTotal.val(), salesItem.sales.coupon), salesItem.sales.venderMaling)));
            approvalUtils.initqueryApprovalUser("salesItemDetialapprover", 10);
        });
    });
    //编辑中的确认
    com.focusPage('#editSaveBtn').click(function () {

        if (com.validate('miniPopUp', 'right')){
            return false;
        }

        var num = com.focusPage('#salesItemDetialnum').val();
        var total = com.focusPage('#salesItemDetialtotal').val();
        var comment = com.focusPage('#salesItemDetialcomment').val();

        var $lis = com.focusPage(".item-orange" ,"#layerPopUp");//拿到每条子项li
        var priceTotalEdit = 0;

        $lis && $lis.length && $.each($lis, function (i, v) {
            var $v = $(v);
            priceTotalEdit += utils.changeThrDecimal(parseFloat(utils.accMul($v.find('h3').attr('li_Num'), $v.find('h3').attr('li_Price'))));
        });

        priceTotalEdit = utils.accAdd(utils.accSub(priceTotalEdit, com.focusPage("#miniPopUp").attr("li_Total")), total);

        var editArr = {
            "salesItem.siid": salesItem.edit_data.siid,
            "salesItem.num": num,
            "salesItem.total": total,
            "salesItem.comment": comment,
            "sales.total": priceTotalEdit
        };

        com.post(api.inventory.updateSalesItem, editArr, function () {
            com.focusPage('#list ul.item-list').remove();
            com.clearValidator();
            com.closePopup(com.focusPage("#editSaveBtn"));
            com.post(api.inventory.querySalesItemBySid, {"sales.sid": salesItem.sid}, function (data) {
                initList(data.salesItems);
            }, null, false);
        });

    });
    //编辑中的取消
    salesItem.btns.editCancelBtn.click(function () {
        com.clearValidator();
        com.closePopup(com.focusPage('#editCancelBtn'));
    });
    // 退货审批提交
    salesItem.btns.approverSaveBtn.click(function () {

        if (com.validate('miniPopUp', 'right')) {
            return false;
        }
        var radios = com.focusPage("#salesItemDetialapprover").find('input:checked').attr('userid');
        if (radios == null || radios == "") {
            com.showAlert(com.warning, "请选择审批人");
            return false;
        }

        var options = {
            "approval.receiver.userId": com.focusPage("#salesItemDetialapprover").find('input:checked').attr('userid'),
            "approval.comment": salesItem.items.refundDes.val(),
            "approvalSalesRefund.sid": salesItem.sid,
            "approvalSalesRefund.type": salesItem.approvalType,
            "approvalSalesRefund.refund": parseInt(salesItem.items.refundTotal.val())
        };
        
        com.post(api.approval.submitApprovalForSalesRefund, $.extend(options, salesItem.options), function () {
            salesItem.btns.refundCancelBtn.trigger('click');
            refundLayerOut();
            salesItem.items.approver.empty();
            com.showAlert(com.info, "操作成功");
            com.closePopup(com.focusPage("#approverSaveBtn"));
        });
    });
    
    //取消
    salesItem.btns.approverCancelBtn.click(function () {
        com.clearValidator();
        closeRefundlayer();
        com.closePopup(com.focusPage("#approverCancelBtn"));
        salesItem.items.approver.empty();
    });

    salesItem.btns.refundCancelBtn.click(function () {

        showButtons([salesItem.btns.fullRefundBtn, salesItem.btns.reOrderBtn, salesItem.btns.refundBtn, salesItem.btns.importBtn]);
        hideButtons([salesItem.btns.refundCommitBtn, salesItem.btns.refundCancelBtn]);

        com.focusPage('#list div.action-buttons a.btn').removeClass('hide');
        com.focusPage('#list div.action-buttons label').remove();
    });

    function closeRefundlayer() {
        salesItem.items.refundTotal.val("");
        salesItem.items.refundDes.val("");
        com.focusPage('#list li.clearfix div.action-buttons').empty();
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

    function calcRefundData(isAll, options) {
        
        salesItem.options = {};

        var flag = true;
        var total = 0;
        var itemTotal = 0;

        if(com.validate("list")){
            return false;
        }

        com.focusPage('#list input[name="num"]').each(function (i) {

            var that = $(this);

            var siid = that.attr('data-siid');

            var selling = parseFloat(that.attr('selling'));
            var num = parseFloat(that.val());

            var max = parseFloat(that.attr('max'));
            if(!isAll){

                if(max < num){
                    com.showTip(that,"数量错误!","bottom");
                    total = 0;
                    return false;
                }else {
                    var _total = utils.accMul(selling, num);
                    total += _total;
                    if (max >= num) {
                        salesItem.options["approvalSalesRefundItem[" + i + "].sid"] = salesItem.sid;
                        salesItem.options["approvalSalesRefundItem[" + i + "].salesItem.siid"] = siid;
                        salesItem.options["approvalSalesRefundItem[" + i + "].num"] = num;
                        salesItem.options["approvalSalesRefundItem[" + i + "].total"] = _total;
                    }
                    return true;
                }

            }else {

                itemTotal = utils.accMul(max, selling);
                total += itemTotal;
                salesItem.options["approvalSalesRefundItem[" + i + "].sid"] = salesItem.sid;
                salesItem.options["approvalSalesRefundItem[" + i + "].salesItem.siid"] = siid;
                salesItem.options["approvalSalesRefundItem[" + i + "].num"] = max;
                salesItem.options["approvalSalesRefundItem[" + i + "].total"] = itemTotal;

            }

        });

        if(total == 0){
            com.showAlert(com.warning, "总退款数量为0");
            return false;
        }

        salesItem.items.refundTotal.val(utils.changeThrDecimal(total));
        return flag;

    }

    function refundLayerOut() {
        salesItem.items.refundDes.val("");
        salesItem.items.approver.val("");
    }

    function recordMoney(ishide) {
        com.focusPage('#list li.clearfix div.action-buttons').each(function (i) {
            var $inputNum = $('<input>').addClass('span1 v_float_3').attr('name', 'num').attr('value', '0').attr('type', 'number')
                .attr('min', '0').attr('max', $(this).attr('data-num')).attr('step', '0.001')
                .attr('selling', $(this).attr('data-selling'))
                .attr('data-siid', $(this).attr('data-siid'));

            var $label = $('<label></label>').addClass('span2').html("退货数量:").append($inputNum);
            $(this).append($label);

            if (ishide) {
                hideButtons([$inputNum, $label]);
            }
        });
    }

    //导出点击事件
    salesItem.btns.importBtn.click(function () {

        com.post(api.inventory.querySalesItemBySid, {"sales.sid": salesItem.sid}, function (data) {

            $.exceler({
                column: [
                    ['品牌系列', 'goods.category'],
                    ['产品名称', 'goods.name'],
                    ['产品编码', 'goods.no'],
                    ['产品规格', 'format.info'],
                    ['单价', 'price'],
                    ['数量', 'num'],
                    ['金额', 'total'],
                    ["备注", 'comment']
                ],
                list: data.salesItems
            });
        });
    });
});