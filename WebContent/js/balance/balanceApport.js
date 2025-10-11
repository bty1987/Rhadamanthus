$(function() {

    var balanceApport = {

        btns: {
             addBalanceApportBtn:com.focusPage("#addBalanceApportBtn"),// 添加
             saveBtn:com.focusPage("#saveBtn"),
             cancelBtn:com.focusPage("#cancelBtn"),
        },

        modals: {
            balanceApportModal:com.focusPage("#balanceApportModal"),
        },

        items: {
            money: com.focusPage("#money"),
            comment: com.focusPage("#comment"),
        },

        bid: params.balance.bid
    };

    balanceApport.modals.balanceApportModal.on("hide.bs.modal", function() {

        com.cleanItems(balanceApport.items);
        com.clearValidator();
        com.closeTip();
    });

    balanceApport.btns.addBalanceApportBtn.click(function() {

        com.clearValidator();
        balanceApport.modals.balanceApportModal.modal("show");
    });

    balanceApport.btns.saveBtn.bindClick(saveDate);

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
                var $title = $('<small></small>').addClass('blue').html(' '+ v.creater.currentName);
                var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');

                var propertyArr = [
//                    ["创建人:", v.creater.currentName, "grey"],
                    ["创建时间:", v.createTime, "green"],
                    ["金额:", v.money, "blue"],
                    ["说明:",v.comment,"grey" ],
                ];

                $.each(propertyArr, function(index, value) {

                    var $liProperty = $('<li></li>');
                    $('<strong></strong>').html(value[0]).appendTo($liProperty);
                    $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                    $liProperty.appendTo($ulProperty);
                });

                $liLine.appendTo($ul);
                $liLine.append($h3).append($ulProperty);
                $h3.append($title);

            });
            $ul.appendTo($tableWrap);

        }
    };

    queryBalanceApportForBalance(balanceApport.bid);

    function queryBalanceApportForBalance(bid) {

        com.post(api.balance.queryBalanceApportForBalance, {"balanceApport.bid": bid}, function(data) {

            initList(data.balanceApports);
        }, function(e) {

            com.showAlert(com.error, e.errorMsg);
        }, false);
    };

    function saveDate(){
        if (com.validate('balanceApportModal')) {

            return false;
        };

        var options ={
            "balanceApport.bid" : balanceApport.bid,
            "balanceApport.money": balanceApport.items.money.val(),
            "balanceApport.comment": balanceApport.items.comment.val(),
        };

        com.post(api.balance.addBalanceApport, options, function() {

            com.showAlert(com.info, "添加成功");
            queryBalanceApportForBalance(balanceApport.bid);
        });

        balanceApport.modals.balanceApportModal.modal("hide");
    };

});
