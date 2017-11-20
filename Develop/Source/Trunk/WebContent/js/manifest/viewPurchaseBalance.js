


$(function () {

    var approvalPostData = {};
    var approvalSalesRefundPostData = {};
    var approvalSalesRefundItemPostData = {};

    var pid = params.pid;

    var status = params.status;

    var backBtn = $('#backBtn');
    var importBtn = $('#importBtn');
    var addBtn = $('#addBtn');

    var refund = $('#refund');
    var approver = $('#approver');
    var refundDes = $('#refundDes');

    var purchaseBalance = {
        validator: {
            num: {
                type: "v_num",
                regex: /^(([1-9]\d{0,6})|(([1-9]\d{0,6}\.\d{1,3})|(0\.[1-9]{1,3})))$/,
                errorMsg: "结算值输入内容格式错误"
            }
        }
    };

    $.extend(com.validator, purchaseBalance.validator);

    refund.focus(function () {
        refund.popover('destroy');
    });

    backBtn.click(function () {
        com.switchPage(api.index.purchaseBalanceIndex.url);
    });

    var initList = function (listData) {
        var $tableWrap = $('#list');
        var $ul = $('<ul></ul>').addClass('item-list ui-sortable  fl-table-list');

        if (listData && listData.length) {
            $.each(listData, function (i, v) {

                var $liLine = $('<li style="border-bottom: 1px solid #EBEBEB;"></li>').addClass('clearfix');
                var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
                var $h3 = $('<h3></h3>').css({color: "grey", "font-weight": "bold"});
                var $btnDiv = $('<div></div>').addClass('action-buttons pull-right').attr('data-pbid', v.pbid).attr('data-pid', v.pid);

                var $btnEdit = $('<a></a>').addClass('btn btn-minier btn-success pull-left').html('编辑');
                var $btnUpdate = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').html('修改结算状态');

                var balanceStatus = v.status == 0 ? "初始" : "已付款";

                var propertyArr = [
                    ["创建时间:", v.createTime, "grey"],
                    ["创建人:", v.creater.userName, "grey"],
                    ["结算值:", v.balance, "grey"],
                    ["状态:", balanceStatus, "grey"],
                    ["说明:", v.comment, "grey"]

                ];

                $.each(propertyArr, function (index, value) {
                    var $liProperty = $('<li></li>').css({"border-bottom": "0px"});
                    $('<strong></strong>').html(value[0]).appendTo($liProperty);
                    $('<b></b>').html(value[1]).css({color: value[2]}).appendTo($liProperty);
                    $liProperty.appendTo($ulProperty);
                });

                $liLine.appendTo($ul);
                $liLine.append($h3).append($ulProperty);

                if(params.balanceStatus != 2){
                    if (v.status == 0) {
                        $btnDiv.append($btnEdit).append($btnUpdate);
                    }
                }else if(params.balanceStatus == 2){
                    addBtn.addClass("hide");
                }


                $btnDiv.appendTo($h3);

                $btnEdit.click(function () {

                    $('#balance').val(v.balance);
                    $('#comment').val(v.comment);

                    openMoneylayer(function (index, layero) {

                        var balance = $('#balance').val();
                        var comment = $('#comment').val();

                        var editArr = {
                            "purchaseBalance.pbid": v.pbid,
                            "purchaseBalance.balance": balance,
                            "purchaseBalance.comment": comment
                        };
                        if(com.validate('layerEdit')){
                            return;
                        }

                            if(v.status == 1){
                                layer.alert('采购结算状态不可操作', {
                                    icon: 0,
                                    skin: 'layer-ext-moon'
                                });
                            }else if(v.status == 0) {
                                com.post(api.inventory.updatePurchaseBalance, editArr, function () {
                                    $('#list ul.item-list').remove();
                                    queryPurchaseBalanceByPid(pid);
                                    layer.closeAll();

                                }, function (e) {
                                    com.showAlert(com.error, e.errorMsg);
                                }, false);
                            }


                    });

                });

                $btnUpdate.click(function (e) {
                    e.stopPropagation();

                    layer.confirm('确定要修改为已付款状态?', {
                        btn: ['确定', '取消'] //按钮
                    }, function (indexo, layero) {

                        if(v.status == 1){
                            layer.alert('采购结算状态不可操作', {
                                icon: 0,
                                skin: 'layer-ext-moon'
                            });
                        }else if(v.status == 0){
                            com.post(api.inventory.updatePurchaseBalanceForStatus, {"purchaseBalance.pbid": v.pbid,"purchaseBalance.status" : v.status}, function () {
                                $('#list ul.item-list').remove();
                                queryPurchaseBalanceByPid(pid);
                            }, function (e) {
                                com.showAlert(com.error, e.errorMsg);
                            });
                        }

                        layer.close(indexo);

                    }, function () {

                    });

                });

            });

            $ul.appendTo($tableWrap);
        }
    };

    queryPurchaseBalanceByPid(pid);

    function queryPurchaseBalanceByPid(pid) {
        com.post(api.inventory.queryPurchaseBalanceByPid, {"purchaseBalance.pid": pid}, function (data) {

            initList(data.purchaseBalances);
        }, function (e) {
            com.showAlert(com.error, e.errorMsg);
        }, false);
    }

    function openMoneylayer(callback) {
        layer.closeAll();
        layer.open({
            type: 1,
            //skin: 'layui-layer-lan',
            title: "编辑",
            content: $('#layerEdit'),
            area: ( $(window).width() * 0.6 < 620 ? $(window).height() * 0.6 : 620 ) + "px",
            maxmin: false,
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

    function openAddlayer(callback){
        layer.closeAll();
        layer.open({
            type: 1,
            //skin: 'layui-layer-lan',
            title: "添加",
            content: $('#layerEdit'),
            area: ( $(window).width() * 0.6 < 620 ? $(window).height() * 0.6 : 620 ) + "px",
            maxmin: false,
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
            }
        });
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


    //添加点击事件
    addBtn.click(function(){



        //$('#balance').on('change', function () {
        //    checkRowValue();
        //});

        $('#balance').val("");
        $('#comment').val("");

        openAddlayer(function (index, layero) {

            var balance = $('#balance').val();
            var comment = $('#comment').val();

            var editArr = {
                "purchaseBalance.pid": pid,
                "purchaseBalance.balance": balance,
                "purchaseBalance.comment": comment
            };

            if(com.validate('layerEdit')){
                return;
            }
            //if(checkRowValue()){
                com.post(api.inventory.addPurchaseBalance, editArr, function () {
                    $('#list ul.item-list').remove();
                    queryPurchaseBalanceByPid(pid);
                    layer.closeAll();

                }, function (e) {
                    com.showAlert(com.error, e.errorMsg);
                }, false);
            //}

        });

    });



    //导出点击事件
    importBtn.click(function () {

        com.post(api.inventory.queryPurchaseBalanceByPid, {"purchaseBalance.pid": pid}, function (data) {

            $.exceler({
                column: [
                    ["创建时间:", "createTime"],
                    ["创建人:", "creater.userName"],
                    ["结算值:", "balance"],
                    ["状态:", "status"],
                    ["说明:", "comment"]
                ],
                list: data.purchaseBalances
            },function(v){
                v.status = v.status == 0 ? "初始" : "已付款";
            });
        },function (e) {
            com.showAlert(com.error, e.errorMsg);
        }, false);


    });

    //function checkRowValue() {
    //
    //    var flag = true;
    //
    //    var num = $('#balance');
    //    var numRex = /^(([1-9]\d{0,6})|(([1-9]\d{0,6}\.\d{1,3})|(0\.[1-9]{1,3})))$/;
    //    if (!(numRex.test(num.val()) && parseFloat(num.val()) > 0)) {
    //        num.focus().select();
    //        num.addClass('tooltip-info').attr({
    //            "data-rel": "popover",
    //            "data-placement": "top",
    //            "data-original-title": "",
    //            "title": "",
    //            "data-content": "结算值输入内容格式错误!"
    //        }).popover('show');
    //        flag = false;
    //    } else {
    //        num.popover('destroy');
    //    }
    //
    //    return flag;
    //}





});
