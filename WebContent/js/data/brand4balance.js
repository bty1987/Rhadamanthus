jQuery(function($) {

    var brandBalance = {

        bid: params.data.brand.bid,

        items: {
            bid: com.focusPage('#bid', "#addbrandBalanceModal"),
            name: com.focusPage('#name', "#addbrandBalanceModal"),
            ctype: com.focusPage('#ctype', "#addbrandBalanceModal"),
            cvalue: com.focusPage('#cvalue', "#addbrandBalanceModal"),
            comment: com.focusPage('#comment', "#addbrandBalanceModal")
        },

        modals: {
            addbrandBalanceModal: com.focusPage('#addbrandBalanceModal'),
            addBrandBalanceBtn: com.focusPage('#addBrandBalanceBtn'),
        },

        btns: {
            saveBtn: com.focusPage("#saveBtns").bindClick(saveData),
        },
    };

    brandBalance.items.ctype.bindData(constant.data().brandBalance.ctype.datas, "key", "value");

    brandBalance.modals.addbrandBalanceModal.on("hide.bs.modal", function() {

        com.cleanItems(brandBalance.items);
        com.clearValidator();
        com.closeTip();
    });

    brandBalance.modals.addBrandBalanceBtn.click(function() {

        com.clearValidator();
        brandBalance.modals.addbrandBalanceModal.modal("show");
    });

    queryBrandBalance();

    var initList = function(listData) {

        var $tableWrap = com.focusPage('#list').empty();
        var $ul = $('<ul></ul>').addClass('item-list ui-sortable  fl-table-list');

        if (!listData.length) {

            var $resultList = com.focusPage("#list").addClass('dz-default dz-message').html("");
            var $zone = $('<div></div>').addClass('dropzone dz-clickable').css('margin', '20px').css('border', '0px').appendTo($resultList);
            var $mesg = $('<div></div>').addClass('dz-default dz-message').appendTo($zone);
            var $span = $('<span></span>').text('无可用数据提供').appendTo($mesg);

            return $resultList;
        } else if (listData && listData.length) {

            $.each(listData, function(i, v) {

                var $liLine = $('<li></li>').addClass('item-orange clearfix');
                var $h3 = $('<h3></h3>').addClass('oid');
                var $title = $('<small></small>').addClass('blue').html(v.name);
                var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
                var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');
                var $btnWithdraw = $('<a></a>').addClass(' btn btn-minier btn-yellow').html('删除');

                var propertyArr = [["类型:", constant.data().brandBalance.ctype.keys[v.ctype], "red"], ["结算值:", v.cvalue, "blue"], ["说明:", v.comment, "grey"], ];

                $.each(propertyArr, function(index, value) {

                    var $liProperty = $('<li></li>');
                    $('<strong></strong>').html(value[0]).appendTo($liProperty);
                    $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                    $liProperty.appendTo($ulProperty);
                });

                $divBtnWrap.append($btnWithdraw);
                $liLine.appendTo($ul);
                $liLine.append($h3).append($ulProperty);
                $h3.append($title).append($divBtnWrap);

                $btnWithdraw.click(function() {

                    deleteBrandBalance(v);
                });

            });

            $ul.appendTo($tableWrap);
        }
    };

    function queryBrandBalance() {

        com.post(api.data.queryBrandBalance, {
            "brandBalance.bid": brandBalance.bid
        }, function(res) {

            initList(res.brandBalances);
        });
    }

    function saveData() {

        if (com.validate("addbrandBalanceModal")) {
            return false;
        }

        if (brandBalance.items.ctype.val() == 1) {
            if (brandBalance.items.cvalue.val() < 0 || brandBalance.items.cvalue.val() > 1) {
                com.showTip(com.focusPage("#cvalue"), "结算值在0-1之间", 'bottom');
                return false;
            }
        }

        var options = {
            'brandBalance.bid': brandBalance.bid,
            'brandBalance.name': brandBalance.items.name.val(),
            'brandBalance.ctype': brandBalance.items.ctype.val(),
            'brandBalance.cvalue': brandBalance.items.cvalue.val(),
            'brandBalance.comment': brandBalance.items.comment.val()
        };

        com.post(api.data.addBrandBalance, options, function(res) {

            com.showAlert(com.info, "操作成功");

            queryBrandBalance();

            brandBalance.modals.addbrandBalanceModal.modal("hide");
        });
    }

    function deleteBrandBalance(v) {

        com.showConfirm("是否确定删除", function(reslut) {

            com.post(api.data.deleteBrandBalance, {
                "brandBalance.bbid": v.bbid
            }, function(res) {

                queryBrandBalance();

                com.showAlert(com.info, "操作成功");
            });
        });
    }

});
