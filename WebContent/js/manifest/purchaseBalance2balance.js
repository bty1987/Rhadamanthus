$(function () {

    var pid = params["purchase.pid"];

    var backBtn = com.focusPage('#backBtn');
    var importBtn = com.focusPage('#importBtn');
    var addBtn = com.focusPage('#addBtn');

    var refund = com.focusPage('#refund');
    var approver = com.focusPage('#approver');
    var refundDes = com.focusPage('#refundDes');

    var purchaseBalance = {
    	pid: params["purchase.pid"],
		validator: {
            float3: {
                type: "v_float_3",
                regex: /^(\d+|\d+\.[0-9]{1,3})$/,
                errorMsg: "内容格式错误"
            }
        },
    };

    $.extend(com.validator, purchaseBalance.validator);

    refund.focus(function () {
        refund.popover('destroy');
    });

    backBtn.click(function () {
        com.switchPage(api.index.purchaseBalanceIndex.url);
    });

    var initList = function (listData) {

        var $tableWrap = com.focusPage('#list');
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
                    ["创建时间:", v.createTime, "green"],
                    ["创建人:", v.creater.userName, "grey"],
                    ["结算值:", v.balance, "blue"],
                    ["状态:", balanceStatus, "red"],
                    ["说明:", v.comment, "grey"]
                ];

                $.each(propertyArr, function (index, value) {
                    var $liProperty = $('<li></li>').css({"border-bottom": "0px"});
                    $('<strong></strong>').html(value[0]).appendTo($liProperty);
                    $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
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

                    com.focusPage('#balance').val(v.balance);
                    com.focusPage('#comment').val(v.comment);

                    openMoneylayer(function (index, layero) {

                        var balance = com.focusPage('#balance').val();
                        var comment = com.focusPage('#comment').val();

                        var editArr = {
                            "purchaseBalance.pbid": v.pbid,
                            "purchaseBalance.balance": balance,
                            "purchaseBalance.comment": comment
                        };
                        if(com.validate('layerEdit')){
                            return;
                        }

                        if(v.status == 1){
                            com.showAlert(com.warning,'采购结算状态不可操作');
                        }else if(v.status == 0) {
                            com.post(api.inventory.updatePurchaseBalance, editArr, function () {
                                com.focusPage('#list ul.item-list').remove();
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

                    com.showConfirm('确定要修改为已付款状态?', function(index){
                        if(v.status == 1){
                            com.showAlert(com.warning,'采购结算状态不可操作', )
                        }else if(v.status == 0){
                            com.post(api.inventory.updatePurchaseBalanceForStatus, {"purchaseBalance.pbid": v.pbid,"purchaseBalance.status" : v.status}, function () {
                                com.focusPage('#list ul.item-list').remove();
                                queryPurchaseBalanceByPid(pid);
                            }, function (e) {
                                com.showAlert(com.error, e.errorMsg);
                            });
                        }
                        layer.close(index);
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
        }, null, false);
    }

    function openMoneylayer(callback) {
        layer.closeAll();
        layer.open({
            type: 1,
            title: "编辑",
            content: com.focusPage('#layerEdit'),
            area: ( $(window).width() * 0.6 < 620 ? $(window).height() * 0.6 : 620 ) + "px",
            maxmin: false,
            zIndex: 9000,
            btn: ['确定', '取消'],
            yes: function (index, layero) {
                callback(index, layero);
            },
            btn2: function (index, layero) {
            	layer.closeAll();
            },
            cancel: function () {
            	layer.closeAll();
            }
        });
    }

    function openAddlayer(callback){
        layer.closeAll();
        layer.open({
            type: 1,
            //skin: 'layui-layer-lan',
            title: "添加",
            content: com.focusPage('#layerEdit'),
            area: ( $(window).width() * 0.6 < 620 ? $(window).height() * 0.6 : 620 ) + "px",
            maxmin: false,
            zIndex: 9000,
            btn: ['确定', '取消'],
            yes: function (index, layero) {
                callback(index, layero);
            },
            btn2: function (index, layero) {
            	layer.closeAll();
            },
            cancel: function () {
            	layer.closeAll();
            }
        });
    }


    //添加点击事件
    addBtn.click(function(){

        //com.focusPage('#balance').on('change', function () {
        //    checkRowValue();
        //});

        com.focusPage('#balance').val("");
        com.focusPage('#comment').val("");

        openAddlayer(function (index, layero) {

            var balance = com.focusPage('#balance').val();
            var comment = com.focusPage('#comment').val();

            var editArr = {
                "purchaseBalance.pid": pid,
                "purchaseBalance.balance": balance,
                "purchaseBalance.comment": comment
            };

            if(com.validate('layerEdit')){
                return false;
            }

            com.post(api.inventory.addPurchaseBalance, editArr, function () {

                com.focusPage('#list ul.item-list').remove();
                queryPurchaseBalanceByPid(pid);
                layer.closeAll();

            }, function (e) {
                com.showAlert(com.error, e.errorMsg);
            }, false);
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

});
