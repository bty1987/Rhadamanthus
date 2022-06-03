$(function() {

    var apportDetail = {

        btns: {
             addApportDetailBtn:com.focusPage("#addApportDetailBtn"),// 添加
             saveBtn:com.focusPage("#saveBtn"),
             cancelBtn:com.focusPage("#cancelBtn"),
        },

        modals: {
            apportDetailModal:com.focusPage("#apportDetailModal"),
        },

        items: {
            money: com.focusPage("#money"),
            comment: com.focusPage("#comment"),
        },

        bid: params.balance.bid,
    };

    apportDetail.modals.apportDetailModal.on("hide.bs.modal", function() {
        com.cleanItems(apportDetail.items);
        com.clearValidator();
        com.closeTip();
    });

    apportDetail.btns.addApportDetailBtn.click(function() {
        com.clearValidator();
        apportDetail.modals.apportDetailModal.modal("show");
    });

    apportDetail.btns.saveBtn.bindClick(saveDate);

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

    queryApportDetailForBalance(apportDetail.bid);

    function queryApportDetailForBalance(bid) {

        com.post(api.balance.queryApportDetailForBalance, {"apportDetail.bid": bid}, function(data) {

            initList(data.apportDetails);
        }, function(e) {
            com.showAlert(com.error, e.errorMsg);
        }, false);
    };

    function saveDate(){
        if (com.validate('apportDetailModal')) {
            return false;
        };

        var options ={
            "apportDetail.bid" : apportDetail.bid,
            "apportDetail.money": apportDetail.items.money.val(),
            "apportDetail.comment": apportDetail.items.comment.val(),
        };

        com.post(api.balance.addApportDetail, options, function() {

            com.showAlert(com.info, "添加成功");
            queryApportDetailForBalance(apportDetail.bid);
        });

        apportDetail.modals.apportDetailModal.modal("hide");
    };

});
