$(function () {

    var settlement = {
        pid: params["purchase.pid"],
        modals: {
            miniPopUp: com.focusPage('#miniPopUp'),
        },
        items: {
            balance: com.focusPage('#balance'),
            comment: com.focusPage('#comment'),
        },
        btns: {
            backBtn: com.focusPage('#backBtn'),
            importBtn: com.focusPage('#importBtn'),
            addBtn: com.focusPage('#addBtn'),
            submitBtn:com.focusPage('#submitBtn')
        }
    };

    settlement.btns.backBtn.click(function () {
        com.closePopup();
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

                if (params.balanceStatus != 2) {
                    if (v.status == 0) {
                        $btnDiv.append($btnEdit).append($btnUpdate);
                    }
                } else if (params.balanceStatus == 2) {
                    settlement.btns.addBtn.addClass("hide");
                }

                $btnDiv.appendTo($h3);

                $btnEdit.click(function () {
                    com.popup4mini('#miniPopUp','#layerEdit', "编辑");
                    com.focusPage('#balance').val(v.balance);
                    com.focusPage('#comment').val(v.comment);
                    settlement.modals.miniPopUp.attr("data-pbid", v.pbid).attr("data-sstu", "0");
                });

                $btnUpdate.click(function (e) {
                    e.stopPropagation();

                    com.showConfirm('确定要修改为已付款状态?', function (index) {
                        if (v.status == 1) {
                            com.showAlert(com.warning, '采购结算状态不可操作')
                        } else if (v.status == 0) {
                            com.post(api.inventory.updatePurchaseBalanceForStatus, {
                                "purchaseBalance.pbid": v.pbid,
                                "purchaseBalance.status": v.status
                            }, function () {
                                com.focusPage('#list ul.item-list').remove();
                                queryPurchaseBalanceByPid(settlement.pid);
                            }, function (e) {
                                com.showAlert(com.error, e.errorMsg);
                            });
                        }
                    });
                });
            });

            $ul.appendTo($tableWrap);
        }
    };

    queryPurchaseBalanceByPid(settlement.pid);

    function queryPurchaseBalanceByPid(pid) {
        com.post(api.inventory.queryPurchaseBalanceByPid, {"purchaseBalance.pid": pid}, function (data) {
            initList(data.purchaseBalances);
        }, null, false);
    }

    //添加点击事件
    settlement.btns.addBtn.click(function () {
        com.popup4mini('#miniPopUp','#layerEdit', "添加");
        com.focusPage('#balance').val("");
        com.focusPage('#comment').val("");
        settlement.modals.miniPopUp.attr('data-sstu', "1");
    });

    settlement.btns.submitBtn.click(function () {
        savaData();
        com.closePopup(com.focusPage("#submitBtn", "#miniPopUp"));
    });

    function savaData() {
        if (com.validate('miniPopUp','right')) {
            return false
        }
        var balance = com.focusPage('#balance').val();
        var comment = com.focusPage('#comment').val();
        var sstu = settlement.modals.miniPopUp.attr('data-sstu');
        var vpid = settlement.modals.miniPopUp.attr('data-pbid');
        var editArr = {
            "purchaseBalance.balance": balance,
            "purchaseBalance.comment": comment
        };
        var url;
        if (sstu == 0) {
            url = api.inventory.updatePurchaseBalance;
            editArr["purchaseBalance.pbid"] = vpid;
        } else if (sstu == 1) {
            url = api.inventory.addPurchaseBalance;
            editArr["purchaseBalance.pid"] = settlement.pid;
        }
        com.post(url, editArr, function () {
            com.showAlert(com.info,"操作成功");
            com.focusPage('#list ul.item-list').remove();
            queryPurchaseBalanceByPid(settlement.pid);
            settlement.modals.miniPopUp.removeAttr('data-sstu');
            settlement.modals.miniPopUp.removeAttr('data-pbid');
        }, function (e) {
            com.showAlert(com.error, e.errorMsg);
        }, false);
    }

    //导出点击事件
    settlement.btns.importBtn.click(function () {

        com.post(api.inventory.queryPurchaseBalanceByPid, {"purchaseBalance.pid": settlement.pid}, function (data) {

            $.exceler({
                column: [
                    ["创建时间:", "createTime"],
                    ["创建人:", "creater.userName"],
                    ["结算值:", "balance"],
                    ["状态:", "status"],
                    ["说明:", "comment"]
                ],
                list: data.purchaseBalances
            }, function (v) {
                v.status = v.status == 0 ? "初始" : "已付款";
            });
        }, function (e) {
            com.showAlert(com.error, e.errorMsg);
        }, false);
    });
});
