$(function() {

    var salesItem = {

        sid: params.sales.sales.sid,
        dompany: params.sales.dompany,

        sales: null,
        salesItem: null,

        items: {
            refundTotal: com.focusPage("#refundTotal"),
            designDept: com.focusPage("#designDept"),
            loose: com.focusPage("#loose"),
            ruond: com.focusPage("#ruond"),
            approver: com.focusPage('#salesItemDetialapprover'),
            refundDes: com.focusPage('#refundDes')
        },
        btns: {
            refundBtn: com.focusPage('#refundBtn'),
            refundCommitBtn: com.focusPage('#refundCommitBtn'),
            refundCancelBtn: com.focusPage('#refundCancelBtn'),
            fullRefundBtn: com.focusPage('#fullRefundBtn'),
            reOrderBtn: com.focusPage('#reOrderBtn'),
            importBtn: com.focusPage('#importBtn'),

            editCancelBtn: com.focusPage('#editCancelBtn'),
            approverSaveBtn: com.focusPage("#approverSaveBtn"),
            approverCancelBtn: com.focusPage("#approverCancelBtn")
        },
        options: {},
        approvalType: null,

        deliveryStatus: constant.sales().salesDeliveryItem.status.keys
    };

    com.focusPage('#fl-statement').statement("销售单", "子项");

    com.post(api.sales.querySalesBySid, {
        "sales.sid": salesItem.sid
    }, function(res) {

        salesItem.sales = res.sales;
    }, null, false);

    if ((salesItem.sales.fullpayStatus != constant.sales().sales.FULLPAYSTATUS_CONFIRM_SHORT && salesItem.sales.status != constant.sales().sales.STATUS_WAST_INT) || salesItem.dompany == "pompany") {
        hideButtons([salesItem.btns.refundBtn, salesItem.btns.refundCancelBtn, salesItem.btns.refundCommitBtn, salesItem.btns.fullRefundBtn, salesItem.btns.reOrderBtn]);
    }

    if (salesItem.sales.type == 1) {
        hideButtons([salesItem.btns.refundBtn]);
    }

    var initList = function(listData) {

        var $tableWrap = com.focusPage('#list');
        var $ul = $('<ul></ul>').addClass('item-list ui-sortable  fl-table-list');

        if (listData && listData.length) {
            // 组织父子关系
            var itemMap = {};
            var rootItems = [];

            // 第一遍：构建映射
            $.each(listData, function(i, v) {

                itemMap[v.siid] = v;
                v.children = [];
            });

            // 第二遍：组织父子关系
            $.each(listData, function(i, v) {

                if (v.psiid && itemMap[v.psiid]) {
                    // 有父级，添加到父级的children
                    itemMap[v.psiid].children.push(v);
                } else {
                    // 无父级，是根节点
                    rootItems.push(v);
                }
            });

            // 递归渲染函数
            var renderItem = function(v, level) {

                level = level || 0;

                var $num = v.num;// 数量
                var $price = v.price;// 折让价
                var $total = v.total;

                var isPackage = (v.type == 1); // 是否为套餐明细

                var $liLine = $('<li></li>').addClass('item-orange clearfix');

                if (isPackage) {
                    $liLine.addClass('package-child-item');
                    $liLine.css('padding-left', (20 + level * 20) + 'px');
                    $liLine.css('background-color', '#f9f9f9');
                    $liLine.css('border-left', '3px solid #87b87f');
                }

                var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
                var $h3 = $('<h3></h3>').addClass('oid').attr({
                    "li_Num": $num,
                    "li_Price": $price,
                    "li_delTotal": $total
                });

                var namePrefix = (isPackage && v.psiid) ? '<i class="icon-level-up fa-rotate-90 grey"></i> ' : '';
                var $small = $('<small></small>').addClass('blue').html(namePrefix + v.goods.name + ' ' + v.goods.no);
                var $btnDiv = $('<div></div>').addClass('action-buttons pull-right').attr('data-num', v.num).attr('data-selling', v.price).attr('data-siid', v.siid).attr('data-type', v.type || 0).attr('data-psiid', v.psiid);

                var $btnEdit = $('<a></a>').addClass('btn btn-minier btn-yellow').html('编辑');
                var $btnDelete = $('<a></a>').addClass('btn btn-minier btn-success').html('删除');

                // 仅销售单列表页(type=sales)进入显示售价/折扣价/折让价/结算值/结算方式,其余入口(装修详情/活动页等)隐藏
                var priceHide = salesItem.dompany == "sales" ? "" : "hide";

                var propertyArr = [["商品品类:", v.goods.category, "grey"], ["商品颜色:", v.color.name, "grey"], ["商品规格:", v.format.info, "grey"], ["售价:", v.selling, "blue", priceHide], ["折扣价:", v.disPrice, "blue", priceHide], ["折让价:", v.price, "blue", priceHide], ["数量:", v.num, "blue itemnum"], ["总价:", v.total, "blue"], ["结算值:", v.cvalue, "blue", priceHide], ["结算方式:", v.ctype == 0 ? "底价" : "点位", "red", priceHide], ["类型:", v.priceType == "0" ? "正价" : "特价", "red"]];

                // 如果是套餐明细，添加标识
                if (isPackage) {
                    propertyArr.push(["套餐: ", "是", "orange"]);
                }

                propertyArr.push(["配送状态:", constant.sales().salesDeliveryItem.status.keys[v.deliveryStatus], "red"]);
                propertyArr.push(["备注:", v.comment, "grey"]);

                $.each(propertyArr, function(index, value) {

                    var $liProperty = $('<li></li>');

                    if (value[3]) {
                        $liProperty.addClass(value[3]);
                    }

                    $('<strong></strong>').html(value[0]).appendTo($liProperty);
                    $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                    $liProperty.appendTo($ulProperty);
                });

                $liLine.appendTo($ul);
                $liLine.append($h3).append($ulProperty);

                // 套餐明细不显示编辑和删除按钮
                if (salesItem.dompany != "pompany" && !v.psiid) {
                    if (salesItem.sales.fullpayStatus == constant.sales().sales.FULLPAYSTATUS_INIT_SHORT && salesItem.sales.status != constant.sales().sales.STATUS_WAST_INT) {
                        $btnDiv.append($btnEdit).append($btnDelete);
                    }
                }

                $small.appendTo($h3);
                $btnDiv.appendTo($h3);

                // 删除按钮事件
                $btnDelete.click(function(e) {

                    e.stopPropagation();

                    var $this = $(this);
                    var $delTotal = $this.parents('div').parents('li').find('h3').attr('li_delTotal');

                    var $lis = com.focusPage(".item-orange", "#layerPopUp");
                    var priceTotalDel = 0;

                    $lis && $lis.length && $.each($lis, function(i, v) {

                        var $v = $(v);
                        priceTotalDel += utils.changeThrDecimal(parseFloat(utils.accMul($v.find('h3').attr('li_Num'), $v.find('h3').attr('li_Price'))));
                    });

                    priceTotalDel = utils.changeThrDecimal(utils.accSub(priceTotalDel, $delTotal));
                    var ops = {
                        "salesItem.siid": v.siid,
                        "sales.total": priceTotalDel
                    };

                    com.showConfirm('确定要删除吗?', function(indexo, layero) {

                        com.post(api.sales.deleteSalesItem, ops, function() {

                            $btnDelete.parents('li.clearfix').remove();
                            com.focusPage('#list').empty();
                            querySalesItemBySid();
                        });
                    });
                });

                // 编辑按钮事件
                $btnEdit.click(function() {

                    salesItem.salesItem = v;

                    com.popup4mini("#miniPopUp", "#layerEdit", "编辑", function() {

                        com.focusPage("#miniPopUp").attr("li_Total", $total);
                        com.focusPage('#salesItemDetialnum').on('change', function() {

                            if (com.validate('miniPopUp', 'right')) {
                                return false;
                            }
                            com.focusPage('#salesItemDetialtotal').val(utils.changeThrDecimal(utils.accMul(parseFloat(com.focusPage('#salesItemDetialnum').val()), parseFloat(v.price))));
                        });
                    }, function() {

                        com.clearValidator();
                    }, function() {

                        com.focusPage('#salesItemDetialnum').val(v.num);
                        com.focusPage('#salesItemDetialtotal').val(v.total);
                        com.focusPage('#salesItemDetialcomment').val(v.comment);
                    });
                });

                // 递归渲染子项
                if (v.children && v.children.length > 0) {
                    $.each(v.children, function(i, child) {

                        renderItem(child, level + 1);
                    });
                }
            };

            // 渲染根节点
            $.each(rootItems, function(i, v) {

                renderItem(v, 0);
            });

            $ul.appendTo($tableWrap);
        }
    };

    querySalesItemBySid();

    function querySalesItemBySid() {

        var salesItems = [];
        var deliveryItems = {};

        com.post(api.sales.querySalesItemBySid, {
            "sales.sid": salesItem.sid
        }, function(res) {

            salesItems = res.salesItems;
        }, null, false);

        com.post(api.sales.querySalesDeliveryItem, {
            "salesDeliveryItem.sales.sid": salesItem.sid
        }, function(res) {

            $.each(res.salesDeliveryItems, function(i, v) {

                deliveryItems[v.salesItem.siid] = v.status;
            });
        }, null, false);

        $.each(salesItems, function(i, v) {

            if (deliveryItems.hasOwnProperty(v.siid))
                v["deliveryStatus"] = deliveryItems[v.siid];
        });

        if (salesItems.length == 0) {
            emptyData("list");
        } else {
            initList(salesItems);
        }
    }

    salesItem.items.loose.change(function() {

        var refundTotal = salesItem.items.refundTotal.attr("data-refund-total");

        if ($(this).prop("checked")) {
            salesItem.items.refundTotal.val(parseInt(refundTotal));
            com.focusPage("#refundTotal").val(parseInt(refundTotal));
        } else {
            salesItem.items.refundTotal.val(refundTotal);
            com.focusPage("#refundTotal").val(refundTotal);
        }
    });

    salesItem.items.ruond.change(function() {

        var refundTotal = Math.ceil(salesItem.items.refundTotal.attr("data-refund-total"));

        if ($(this).prop("checked")) {
            salesItem.items.refundTotal.val(parseInt(refundTotal));
            com.focusPage("#refundTotal").val(parseInt(refundTotal));
        } else {
            salesItem.items.refundTotal.val(refundTotal);
            com.focusPage("#refundTotal").val(refundTotal);
        }
    });

    salesItem.btns.refundBtn.click(function() {

        if (salesItem.sales.status != constant.sales().sales.STATUS_INIT_INT && salesItem.sales.status != constant.sales().sales.STATUS_END_INT) {
            com.showAlert(com.error, "该订单状态不能退货");
            return false;
        }

        hideButtons([salesItem.btns.fullRefundBtn, salesItem.btns.refundBtn, salesItem.btns.reOrderBtn, salesItem.btns.importBtn]);
        showButtons([salesItem.btns.refundCommitBtn, salesItem.btns.refundCancelBtn]);

        com.focusPage('#list li.clearfix div.action-buttons a.btn').addClass('hide');
        recordMoney(false);

    });

    // 退货确定按钮
    salesItem.btns.refundCommitBtn.click(function() {

        salesItem.approvalType = constant.sales().refunds.STATUS_TYPE_REFUNDS_INT;

        if (!calcRefundData(false))
            return false;

        com.popup4mini("#miniPopUp", "#layerRefund", "退货信息", "", function() {

            com.clearValidator();
            closeRefundlayer();
            salesItem.items.approver.empty();
        }, function() {

            refundTotal = salesItem.items.refundTotal.val();

            salesItem.items.refundTotal.attr("data-refund-total", refundTotal).val(parseInt(refundTotal));
            salesItem.items.designDept.val(salesItem.sales.dept.name);

            approvalUtils.initqueryApprovalUser("salesItemDetialapprover", 10);
        });

    });

    // 全退
    salesItem.btns.fullRefundBtn.click(function() {

        salesItem.approvalType = constant.sales().refunds.STATUS_TYPE_FULLY_INT;

        if (salesItem.sales.status != constant.sales().sales.STATUS_INIT_INT && salesItem.sales.status != constant.sales().sales.STATUS_END_INT) {
            com.showAlert(com.error, "该订单状态不能全退");
            return false;
        }

        recordMoney(true);
        if (!calcRefundData(true))
            return;

        com.popup4mini("#miniPopUp", "#layerRefund", "退货信息", "", function() {

            com.clearValidator();
            closeRefundlayer();
            salesItem.items.approver.empty();
        }, function() {

            refundTotal = utils.accSub(utils.accSub(salesItem.items.refundTotal.val(), salesItem.sales.type == constant.sales().sales.TYPE_STA_INT ? salesItem.sales.coupon : 0), salesItem.sales.venderMaling);

            salesItem.items.refundTotal.attr("data-refund-total", refundTotal).val(parseInt(refundTotal));
            salesItem.items.designDept.val(salesItem.sales.dept.name);

            approvalUtils.initqueryApprovalUser("salesItemDetialapprover", 10);
        });
    });

    // 倒单
    salesItem.btns.reOrderBtn.click(function() {

        salesItem.approvalType = constant.sales().refunds.STATUS_TYPE_RESENDING_INT;
        if (salesItem.sales.status != constant.sales().sales.STATUS_INIT_INT && salesItem.sales.status != constant.sales().sales.STATUS_END_INT) {
            com.showAlert(com.error, "该订单状态不能倒单");
            return false;
        }

        recordMoney(true);
        if (!calcRefundData(true))
            return;

        com.popup4mini("#miniPopUp", "#layerRefund", "退货信息", "", function() {

            com.clearValidator();
            closeRefundlayer();
            salesItem.items.approver.empty();
        }, function() {

            salesItem.items.refundTotal.val(parseInt(utils.accSub(utils.accSub(salesItem.items.refundTotal.val(), salesItem.sales.type == constant.sales().sales.TYPE_STA_INT ? salesItem.sales.coupon : 0), salesItem.sales.venderMaling)));
            salesItem.items.designDept.val(salesItem.sales.dept.name);

            approvalUtils.initqueryApprovalUser("salesItemDetialapprover", 10);
        });
    });

    // 编辑中的确认
    com.focusPage('#editSaveBtn').click(function() {

        if (com.validate('miniPopUp', 'right')) {
            return false;
        }

        var num = utils.changeThrDecimal(com.focusPage('#salesItemDetialnum').val());
        var total = utils.changeThrDecimal(com.focusPage('#salesItemDetialtotal').val());
        var comment = com.focusPage('#salesItemDetialcomment').val();

        var $lis = com.focusPage(".item-orange", "#layerPopUp");// 拿到每条子项li
        var priceTotalEdit = 0;

        $lis && $lis.length && $.each($lis, function(i, v) {

            var $v = $(v);
            priceTotalEdit += utils.changeThrDecimal(parseFloat(utils.accMul($v.find('h3').attr('li_Num'), $v.find('h3').attr('li_Price'))));
        });

        priceTotalEdit = utils.changeThrDecimal(utils.accAdd(utils.accSub(priceTotalEdit, com.focusPage("#miniPopUp").attr("li_Total")), total));

        var editArr = {
            "salesItem.siid": salesItem.salesItem.siid,
            "salesItem.num": num,
            "salesItem.total": total,
            "salesItem.comment": comment,
            "sales.total": priceTotalEdit
        };

        com.post(api.sales.updateSalesItem, editArr, function() {

            com.focusPage('#list ul.item-list').remove();
            com.clearValidator();
            com.closePopup(com.focusPage("#editSaveBtn"));
            com.post(api.sales.querySalesItemBySid, {
                "sales.sid": salesItem.sid
            }, function(data) {

                initList(data.salesItems);
            }, null, false);
        });

    });
    // 编辑中的取消
    salesItem.btns.editCancelBtn.click(function() {

        com.clearValidator();
        com.closePopup(com.focusPage('#editCancelBtn'));
    });
    // 退货审批提交
    salesItem.btns.approverSaveBtn.click(function() {

        if (com.validate('miniPopUp', 'right')) {
            return false;
        }

        var radios = com.focusPage("#salesItemDetialapprover").find('input:checked').attr('userid');

        if (radios == null || radios == "") {
            com.showAlert(com.warning, "请选择审批人");
            return false;
        }

        var args = [{
            "name": "订单号",
            "value": salesItem.sales.orderId
        }, {
            "name": "销售单号",
            "value": salesItem.sales.no
        }, {
            "name": "设计部",
            "value": com.focusPage("#designDept").val()
        }, {
            "name": "品牌",
            "value": salesItem.sales.brand.name
        }, {
            "name": "实退款金额（元）",
            "value": parseInt(salesItem.items.refundTotal.val())
        }, {
            "name": "办理状态",
            "value": constant.sales().refunds.type.keys[salesItem.approvalType]
        }, {
            "name": "结算状态",
            "value": constant.sales().sales.balanceStatus.keys[salesItem.sales.balanceStatus]
        }, {
            "name": "退货原因",
            "value": com.focusPage("#refundDes").val()
        }, {
            "name": "备注",
            "value": salesItem.sales.comment
        }];

        var options = {
            "approval.receiver.userId": com.focusPage("#salesItemDetialapprover").find('input:checked').attr('userid'),
            "approval.comment": com.focusPage("#refundDes").val(),
            "approvalSalesRefund.sid": salesItem.sid,
            "approvalSalesRefund.type": salesItem.approvalType,
            "approvalSalesRefund.refund": salesItem.items.refundTotal.val()
        };

        if (com.focusPage("#dingApprove", "#layerRefund").prop("checked")) {
            options["code"] = "PROC-87776E9E-42E3-4E58-9D98-CDA9B0F28816"; // test
            options["code"] = "PROC-EF6YJDXRN2-2EQFBYULQQ5CPGGVZAUU1-ME75EHVI-9"; // product
            options["forms"] = JSON.stringify(args);
        }

        com.post(api.approval.submitApprovalForSalesRefund, $.extend(options, salesItem.options), function() {

            salesItem.btns.refundCancelBtn.trigger('click');
            refundLayerOut();
            salesItem.items.approver.empty();
            com.showAlert(com.info, "操作成功");
            com.focusPage("#list").empty();
            querySalesItemBySid();
            com.closePopup(com.focusPage("#approverSaveBtn"));
        });
    });

    // 取消
    salesItem.btns.approverCancelBtn.click(function() {

        com.clearValidator();
        closeRefundlayer();
        com.closePopup(com.focusPage("#approverCancelBtn"));
        salesItem.items.approver.empty();
    });

    salesItem.btns.refundCancelBtn.click(function() {

        showButtons([salesItem.btns.fullRefundBtn, salesItem.btns.reOrderBtn, salesItem.btns.refundBtn, salesItem.btns.importBtn]);
        hideButtons([salesItem.btns.refundCommitBtn, salesItem.btns.refundCancelBtn]);

        com.focusPage('#list div.action-buttons a.btn').removeClass('hide');
        com.focusPage('#list div.action-buttons label').remove();
    });

    function closeRefundlayer() {

        salesItem.items.refundTotal.val("");
        salesItem.items.refundDes.val("");
    }

    function hideButtons(buttons) {

        $.each(buttons, function(i, v) {

            v.addClass('hide');
        });
    }

    function showButtons(buttons) {

        $.each(buttons, function(i, v) {

            v.removeClass('hide');
        });
    }

    function calcRefundData(isAll, options) {

        salesItem.options = {};

        var flag = true;
        var total = 0;
        var itemTotal = 0;

        if (com.validate("list")) {
            return false;
        }

        var index = 0;
        var fullRefund = false;// 全退/倒单数量验证
        var partRefund = true;// 部分退货数量验证
        var partZore = false;// 部分退货数量全为0验证

        com.focusPage('#list input[name="num"]').each(function(i) {

            var that = $(this);
            var siid = that.attr('data-siid');
            var psiid = that.attr('data-psiid');
            var selling = parseFloat(that.attr('selling'));
            var num = parseFloat(that.val());
            var max = parseFloat(that.attr('max'));

            if (!isAll) {
                var _total = utils.changeThrDecimal(utils.accMul(selling, num));
                total += _total;
                if (max >= num && num > 0) {
                    salesItem.options["approvalSalesRefundItem[" + index + "].sid"] = salesItem.sid;
                    salesItem.options["approvalSalesRefundItem[" + index + "].salesItem.siid"] = siid;
                    salesItem.options["approvalSalesRefundItem[" + index + "].salesItem.psiid"] = psiid;
                    salesItem.options["approvalSalesRefundItem[" + index + "].num"] = num;
                    salesItem.options["approvalSalesRefundItem[" + index + "].total"] = _total;
                    index += 1;
                }

                fullRefund = true;
                if (num > max)
                    partRefund = false;
                if (num > 0)
                    partZore = true;

            } else {
                itemTotal = utils.changeThrDecimal(utils.accMul(max, selling));
                total += itemTotal;
                partRefund = true;
                partZore = true;

                if (max > 0)
                    fullRefund = true;
                if (max > 0) {
                    salesItem.options["approvalSalesRefundItem[" + index + "].sid"] = salesItem.sid;
                    salesItem.options["approvalSalesRefundItem[" + index + "].salesItem.siid"] = siid;
                    salesItem.options["approvalSalesRefundItem[" + index + "].salesItem.psiid"] = psiid;
                    salesItem.options["approvalSalesRefundItem[" + index + "].num"] = max;
                    salesItem.options["approvalSalesRefundItem[" + index + "].total"] = itemTotal;
                    index += 1;
                }
            }
        });

        if (!fullRefund) {
            com.showAlert(com.warning, "销售项数量有误");
            return false;
        }

        if (!partRefund) {
            com.showAlert(com.warning, "销售项数量有误");
            return false;
        }

        if (!partZore) {
            com.showAlert(com.warning, "请填写销售项数量");
            return false;
        }

        salesItem.items.refundTotal.val(utils.changeThrDecimal(total));

        if (!isAll && utils.changeThrDecimal(parseFloat(utils.accSub(salesItem.sales.amount, utils.accAdd(salesItem.sales.coupon, salesItem.sales.venderMaling)))) < utils.changeThrDecimal(parseFloat(salesItem.items.refundTotal.val()))) {
            com.showAlert(com.warning, "退款金额大于当前总额减劵值减厂商抹零");
            return false;
        }
        return flag;
    }

    function refundLayerOut() {

        salesItem.items.refundDes.val("");
        salesItem.items.approver.val("");
    }

    function recordMoney(ishide) {

        com.focusPage('#list li.clearfix div.action-buttons').each(function(i) {
            
            var $iteminput = $(this);
            
            var type = $iteminput.attr("data-type");
            var siid = $iteminput.attr("data-siid");
            var psiid = $iteminput.attr("data-psiid");
            
            if(psiid == 0 && type == 1) return true;

            $iteminput.html("");
            
            var $inputNum = $('<input>').addClass('span1 v_float_3').attr('name', 'num').attr('value', '0').attr('type', 'number').attr('min', '0').attr('max', $iteminput.attr('data-num')).attr('step', '0.001').attr('selling', $iteminput.attr('data-selling')).attr('data-siid', siid).attr('data-psiid', psiid);

            var $label = $('<label></label>').addClass('span2').html("退货数量:").append($inputNum).appendTo($iteminput);

            if (ishide) {
                hideButtons([$inputNum, $label]);
            }
        });
    }

    function emptyData(id) {

        var $resultList = com.focusPage('#' + id).html('');
        var $zone = $('<div></div>').addClass('dropzone dz-clickable').css('margin', '20px').css('border', '0px').appendTo($resultList);
        var $mesg = $('<div></div>').addClass('dz-default dz-message').appendTo($zone);
        var $span = $('<span></span>').text('无可用数据提供').appendTo($mesg);
    }

    // 导出点击事件
    salesItem.btns.importBtn.click(function() {

        com.post(api.sales.querySalesItemBySid, {
            "sales.sid": salesItem.sid
        }, function(data) {

            $.exceler({
                column: [['品牌', 'goods.category'], ['编码', 'goods.no'], ['产品', 'goods.name'], ['颜色', 'color.name'], ['规格', 'format.info'], ['单价', 'price'], ['数量', 'num'], ['金额', 'total'], ['类型', function(item) {

                    return item.type == 1 ? '套餐明细' : '普通商品';
                }], ["备注", 'comment']],
                list: data.salesItems

            });
        });
    });
});