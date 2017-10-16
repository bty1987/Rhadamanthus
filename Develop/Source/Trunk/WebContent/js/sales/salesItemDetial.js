


$(function () {

    var approvalPostData = {};
    var approvalSalesRefundPostData = {};
    var approvalSalesRefundItemPostData = {};

    var sid = params.sid;
    var fullpayStatus = params.fullpayStatus;
    var depositpayStatus = params.depositpayStatus;
    var status = params.status;

    var refundBtn = $('#refundBtn');
    var refundCommitBtn = $('#refundCommitBtn');
    var refundCancelBtn = $('#refundCancelBtn');
    var fullRefundBtn = $('#fullRefundBtn');
    var reOrderBtn = $('#reOrderBtn');
    var backBtn = $('#backBtn');
    var importBtn = $('#importBtn');

    var refund = $('#refund');
    var approver = $('#approver');
    var refundDes = $('#refundDes');

    var approvalStr = {
        receiverId: "approval.receiverId",
        comment: "approval.comment"
    };

    var approvalSalesRefundStr = {
        sid: "approvalSalesRefund.sid",
        refund: "approvalSalesRefund.refund",
        type: "approvalSalesRefund.type"
    };

    if (fullpayStatus != 2 && status != 4) {
        hideButtons([refundBtn, refundCancelBtn, refundCommitBtn, fullRefundBtn, reOrderBtn]);
    }

    refund.focus(function () {
        refund.popover('destroy');
    });

    /*approver.typeahead({
        url: api.system.queryApproveUserForNameByType,//获取下拉列表的接口
        list: [],
        postData: {
            "approveUser.type": 10
        },//获取下拉列表的参数
        source: function (query, process) {
            var options = $.extend({"user.userNamePinYin": query}, this.options.postData);
            com.post(this.options.url, options, $.proxy(this.options.callback, this));
        }, matcher: function (item) {
            return true;
        }, callback: function (data) {
            this.options.list = data["autoFillKeyValue"];
            this.flprocess(this.options.list, ["key"], ["value"]);
        },
        isResultTypeMap: true //必填值为true,获取key,value的标识,
        , flupdater: function (k, v) {//下拉列表选中时的一些处理,必填对选中项的key和value做处理
            return v;
        }
    });*/

    backBtn.click(function () {
        com.switchPage(api.index.querySalesIndex.url);
    });

    refundBtn.click(function () {

        if (status != 0) {
            com.showAlert(com.error, "该订单状态不能退货");
            return false;
        }

        hideButtons([fullRefundBtn, refundBtn, reOrderBtn, backBtn, importBtn]);
        showButtons([refundCommitBtn, refundCancelBtn]);

        $('#list li.clearfix div.action-buttons a.btn').addClass('hide');
        recordMoney(false);


    });

    refundCommitBtn.click(function () {

        if (calcRefundData(false)) {

            approvalUtils.initqueryApprovalUser("approver",10);

            openRefundlayer(function (index, layero) {

                createApprovalPostData();
                creatapprovalSalesRefundPostData("0");

                var _approval = $('#approver')

                var radios = _approval.find('input:checked').attr('userid');

                if (checkNum(refund, "退货金额错误", "right") && checkApproval(refundDes, "备注不能为空", "right")) {

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
                            $('#approver').empty();
                        }, function (e) {
                            com.showAlert(com.error, e.errorMsg);
                        });
                }

            });
        }
    });

    refundCancelBtn.click(function () {

        showButtons([fullRefundBtn, reOrderBtn, refundBtn, backBtn, importBtn]);
        hideButtons([refundCommitBtn, refundCancelBtn]);

        $('#list div.action-buttons a.btn').removeClass('hide');
        $('#list div.action-buttons label').remove();

    });

    fullRefundBtn.click(function () {

        if (status != 0) {
            com.showAlert(com.error, "该订单状态不能全退");
            return false;
        }

        recordMoney(true);
        calcRefundData(true);

        approvalUtils.initqueryApprovalUser("approver",10);

        openRefundlayer(function (index, layero) {

            var _approval = $('#approver')

            var radio = _approval.find('input:checked').attr('userid');

            if ( radio == null || radio == "") {
                layer.msg('请选择审批人', {time: 3e3});
                return false;
            }

            creatapprovalSalesRefundPostData("2");
            createApprovalPostData();

            if (checkNum(refund, "退货金额错误", "right") && checkApproval(refundDes, "备注不能为空", "right")) {

                com.post(api.approval.submitApprovalForSalesRefund, $.extend(approvalPostData, approvalSalesRefundPostData, approvalSalesRefundItemPostData),
                    function () {
                        status = 2;
                        $('#list div.action-buttons label').remove();
                        refreshPage();
                        refundLayerOut();
                        layer.msg("全退申请已提交.");
                        $('#approver').empty();
                    }, function (e) {
                        com.showAlert(com.error, e.errorMsg);
                    });

            }
        });

    });

    reOrderBtn.click(function () {

        if (status != 0) {
            com.showAlert(com.error, "该订单状态不能倒单");
            return false;
        }

        recordMoney(true);
        calcRefundData(true);

        approvalUtils.initqueryApprovalUser("approver",10);

        openRefundlayer(function (index, layero) {

            var _approval = $('#approver');

            var radio = _approval.find('input:checked').attr('userid');

            if (radio == null || radio == "") {
                layer.msg('请选择审批人', {time: 3e3});

                return false;
            }

            creatapprovalSalesRefundPostData("3");
            createApprovalPostData();

            if (checkNum(refund, "退货金额错误", "right") && checkApproval(refundDes, "备注不能为空", "right")) {
                com.post(api.approval.submitApprovalForSalesRefund, $.extend(approvalPostData, approvalSalesRefundPostData, approvalSalesRefundItemPostData),
                    function () {
                        status = 3;
                        $('#list div.action-buttons label').remove();
                        refreshPage();
                        refundLayerOut();
                        layer.msg("倒单申请已提交.");
                        $('#approver').empty();
                    }, function (e) {
                        com.showAlert(com.error, e.errorMsg);
                    });
            }
        });

    });

    var initList = function (listData) {
        var $tableWrap = $('#list');
        var $ul = $('<ul></ul>').addClass('item-list ui-sortable  fl-table-list');

        if (listData && listData.length) {
            $.each(listData, function (i, v) {

                var $liLine = $('<li></li>').addClass('clearfix');
                var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
                var $h3 = $('<h3></h3>').css({color: "grey", "font-weight": "bold"}).html(' ' + v.goods.name);
                var $btnDiv = $('<div></div>').addClass('action-buttons pull-right').attr('data-num', v.num).attr('data-selling', v.price).attr('data-siid', v.siid);

                var $btnEdit = $('<a></a>').addClass('btn btn-minier').html('编辑');
                var $btnDelete = $('<a></a>').addClass('btn btn-minier').html('删除');

                var propertyArr = [
                    ["商品品类:", v.goods.category, "grey"],
                    ["商品颜色:", v.color.name, "grey"],
                    ["商品规格:", v.format.info, "grey"],
                    ["售价:", v.selling, "grey"],
                    //["折扣:", v.discount, "grey"],
                    ["折扣价:", v.disPrice, "grey"],
                    // ["折让:", v.postDis, "grey"],
                    ["折让价:", v.price, "grey"],
                    ["数量:", v.num, "grey"],
                    ["总价:", v.total, "grey"],
                    //["原结算方式:", v.rawCtype==0?"底价":"点位", "grey"],
                    //["原结算值:", v.rawCvalue, "grey"],
                    //["结算方式:", v.ctype==0?"底价":"点位", "grey"],
                    //["结算值:", v.cvalue, "grey"],
                    ["备注:", v.comment, "grey"],
                ];

                $.each(propertyArr, function (index, value) {
                    var $liProperty = $('<li></li>').css({"border-bottom": "0px"});
                    $('<strong></strong>').html(value[0]).appendTo($liProperty);
                    $('<b></b>').html(value[1]).css({color: value[2]}).appendTo($liProperty);
                    $liProperty.appendTo($ulProperty);
                });

                $liLine.appendTo($ul);
                $liLine.append($h3).append($ulProperty);


                if (fullpayStatus == -1 && status != 4) {
                    $btnDiv.append($btnEdit).append($btnDelete);
                }

                $btnDiv.appendTo($h3);

                $btnDelete.click(function (e) {
                    e.stopPropagation();

                    layer.confirm('确定要删除吗?', {
                        btn: ['确定', '取消'] //按钮
                    }, function (indexo, layero) {
                        com.post(api.inventory.deleteSalesItem, {"salesItem.siid": v.siid}, function () {
                            $('#list ul.item-list').remove();
                            querySalesItemBySid(v.sid);
                        }, function (e) {
                            com.showAlert(com.error, e.errorMsg);
                        });

                        layer.close(indexo);
                    }, function () {

                    });

                });

                $btnEdit.click(function () {

                    $('#num').val(v.num);
                    $('#total').val(v.total);
                    $('#comment').val(v.comment);

                    $('#num').on('change', function () {
                        if(checkRowValue()){
                            $('#total').val(parseFloat($('#num').val()) * parseFloat(v.price));
                        }
                    });
                    openMoneylayer(function (index, layero) {

                        var num = $('#num').val();
                        var total = $('#total').val();
                        var comment = $('#comment').val();

                        var editArr = {
                            "salesItem.siid": v.siid,
                            "salesItem.num": num,
                            "salesItem.total": total,
                            "salesItem.comment": comment
                        };

                        if(checkRowValue()){
                            com.post(api.inventory.updateSalesItem, editArr, function () {
                                $('#list ul.item-list').remove();
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
            content: $('#layerEdit'),
            area: ( $(window).width() * 0.6 < 620 ? $(window).height() * 0.6 : 620 ) + "px",
            maxmin: true,
            zIndex: 9000,
            btn: ['确定', '取消'],
            yes: function (index, layero) {
                callback(index, layero);

            },
            btn2: function (index, layero) {
                //按钮【按钮二】的回调
            },
            cancel: function () {
                //右上角关闭回调
            }
        });
    }

    function openRefundlayer(callback) {
        layer.closeAll();
        layer.open({
            type: 1,
            skin: 'layui-layer-lan',
            title: "退货信息",
            content: $('#layerRefund'),
            area: ( $(window).width() * 0.6 < 620 ? $(window).height() * 0.6 : 620 ) + "px",
            maxmin: true,
            zIndex: 9000,
            btn: ['保存', '取消'],
            yes: function (index, layero) {
                callback(index, layero);

            },
            btn2: function (index, layero) {
                //按钮【按钮二】的回调
                closeRefundlayer();
                $('#approver').empty();

            },
            cancel: function () {
                //右上角关闭回调
                closeRefundlayer();
                $('#approver').empty();
            }
        });
    }

    function closeRefundlayer() {
        $('#refundTotal').val("");
        $('#refund').val("");
        $('#refundDes').val("");
        $('#list li.clearfix div.action-buttons').empty();
        approvalSalesRefundPostData = {}
        approvalSalesRefundItemPostData = {}
    }

    function checkNum($input, message, position) {

        var priceRex = /^\d{1,8}(\.\d{1,2})?$/;
        
        if ($input.attr('max') < parseFloat($input.val()) || $input.attr('min') > $input.val() || $input.val()< 0||!priceRex.test($input.val())) {

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

    function checkApproval($input, message, position) {

        if ($input.val() == "" || $input.val() == null) {

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

        var itemTotal=0;
        
        $('#list input[name="num"]').each(function (i) {

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

        $('#refundTotal').val(total);
        //refund.attr('max', total);

        return flag;
    }

    function createApprovalPostData() {

        approvalPostData[approvalStr.receiverId] = approver.find('input:checked').attr('userid');
        approvalPostData[approvalStr.comment] = refundDes.val();
    }

    function creatapprovalSalesRefundPostData(type) {
        approvalSalesRefundPostData[approvalSalesRefundStr.sid] = sid;
        approvalSalesRefundPostData[approvalSalesRefundStr.refund] = refund.val();
        approvalSalesRefundPostData[approvalSalesRefundStr.type] = type;
    }

    function refundLayerOut() {
        refund.val("");
        refundDes.val("");
        approver.val("");
        layer.closeAll();
    }

    function recordMoney(ishide) {

        $('#list li.clearfix div.action-buttons').each(function (i) {

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
                    ['产品编码','goods.no'],
                    //['商品颜色', 'color.name'],
                    ['产品规格', 'format.info'],
                    //['售价', 'selling'],
                    //['折扣价', 'disPrice'],
                    ['单价', 'price'],
                    ['数量', 'num'],
                    ['金额', 'total'],
                    //["原结算方式:", 'rawCtype'],
                    //["原结算值:", 'rawCvalue'],
                    //["结算方式:", 'ctype'],
                   // ["结算值:", 'cvalue'],
                    ["备注:", 'comment'],
                ],
                list: data.salesItems
            });
        }, function (e) {
            com.showAlert(com.error, e.errorMsg);
        }, false);


    });

    function checkRowValue() {

        var flag = true;

        var num = $('#num');
        var numRex = /^\d+$/;
        if (!(numRex.test(num.val()) && parseFloat(num.val()) > 0)) {
            num.focus().select();
            num.addClass('tooltip-info').attr({
                "data-rel": "popover",
                "data-placement": "top",
                "data-original-title": "",
                "title": "",
                "data-content": "数量输入内容格式错误!"
            }).popover('show');
            flag = false;
        } else {
            num.popover('destroy');
        }

        return flag;
    }

});