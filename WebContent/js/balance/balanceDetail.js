$(function() {

    var balanceDetail = {

        bid: params.balance.bid
    };

    var initList = function(listData) {

        var $tableWrap = com.focusPage('#list').empty();
        var $ul = $('<ul></ul>').addClass('item-list ui-sortable  fl-table-list');

        if (!listData.length) {

            var $resultList = com.focusPage("#list").addClass('dz-default dz-message').html('');
            var $zone = $('<div></div>').addClass('dropzone dz-clickable').css('margin', '20px').css('border', '0px').appendTo($resultList);
            var $mesg = $('<div></div>').addClass('dz-default dz-message').appendTo($zone);
            var $span = $('<span></span>').text('无可用数据提供').appendTo($mesg);
            return $resultList;

        } else if (listData && listData.length) {

            $.each(listData, function(i, v) {

                var $liLine = $('<li></li>').addClass('item-orange clearfix');
                var $h3 = $('<h3></h3>').addClass('oid');
                var $title = $('<small></small>').addClass('blue').html(' ' + v.account.name);
                var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');

                var propertyArr = [
                    ["归属人:", v.account.belonger.currentName, "grey", function(btn) {

                        tools.personel.info(btn, v.account.belonger.userId);
                    }],
                    ["创建人:", v.account.creater.currentName, "grey", function(btn) {

                        tools.personel.info(btn, v.account.creater.userId);
                    }],
                    ["创建时间:", v.account.createTime, "green"],
                    ["操作人:", v.operater.currentName, "grey", function(btn) {

                        tools.personel.info(btn, v.operater.userId);
                    }],
                    ["操作时间:", v.operateTime, "green"],
                    ["金额:", v.money, "blue"]
                ];

                $.each(propertyArr, function(index, value) {

                    var $liProperty = $('<li></li>');
                    $('<strong></strong>').html(value[0]).appendTo($liProperty);
                    var $b = $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);

                    if (value[3]) {

                        $b.click(function() {

                            value[3]($b);
                        });
                    }

                    $liProperty.appendTo($ulProperty);
                });

                $liLine.appendTo($ul);
                $liLine.append($h3).append($ulProperty);
                $h3.append($title);

            });

            $ul.appendTo($tableWrap);
        }
    };

    queryHardwareByPid(balanceDetail.bid);

    function queryHardwareByPid(bid) {

        com.post(api.balance.queryBalanceDetailForBalance, {
            "balanceDetail.balance.bid": bid
        }, function(data) {

            initList(data.balanceDetails);
        }, function(e) {

            com.showAlert(com.error, e.errorMsg);
        }, false);
    };

});
