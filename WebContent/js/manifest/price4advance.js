
$(function () {

    var goods = {
        gid: params["goods.gid"],
        items :{
            name: com.focusPage("#addPrice").find("#name"),
            purchase: com.focusPage("#addPrice").find("#purchase"),
            selling: com.focusPage("#addPrice").find("#selling"),
            ctype: com.focusPage("#addPrice").find("#ctype"),
            cvalue: com.focusPage("#addPrice").find("#cvalue"),
            type: com.focusPage("#addPrice").find("#type")
        },
        btns:{
            addBtn:com.focusPage("#addBtn"),
            cancelBtn:com.focusPage("#delBtn"),
        }
    };

    var displayFunc = (function () {

        var renderList = function (tableId, listData) {
            var $tableWrap = com.focusPage('#' + tableId);

            if (listData && listData.length) {

                var $ulTitle = createTableTitle();
                var $ulData = $('<ul></ul>').addClass('flex-table');
                $tableWrap.append($ulTitle).append($ulData);

                $.each(listData, function (i, v) {
                    var $liLine = creatLine(i, v, i == listData.length - 1);

                    $liLine.appendTo($ulTitle);
                });
            }
        };

        var createTableTitle = function () {

            var $ulTitle = $('<ul></ul>').addClass('flex-table');
            var $liTitle = $('<li></li>').addClass('line table-title');

            var $indexWrap = $('<div></div>').addClass('line-wrap order').html($('<div></div>').addClass('cell index'));
            var $contentWrap = $('<div></div>').addClass('line-wrap  content col7');

            var titleName = '价格说明,进价,售价,结算类型,结算值,类型';

            $.each(titleName.split(','), function (i, v) {
                var $cell = $('<div></div>').addClass('cell').html(v);
                $cell.appendTo($contentWrap);
            });

            var $optionWrap = $('<div></div>').addClass('line-wrap action').html($('<div>操作</div>').addClass('cell option'));

            $liTitle.append($indexWrap).append($contentWrap).append($optionWrap).appendTo($ulTitle);

            return $ulTitle;
        };

        var creatLine = function (i, v, lastFlag) {

            var $liLine = $('<li></li>').addClass('line');

            var $indexWrap = $('<div></div>').addClass('line-wrap order').html($('<div></div>').addClass('cell index').html(i + 1));
            var $contentWrap = $('<div></div>').addClass('line-wrap  content col7');

            var propertyArr = [
                [v.name,'grey'],
                [v.purchase,'blue'],
                [v.selling,'blue'],
                [v.ctype == "0" ? "底价" : "点位",'red'],
                [v.cvalue,'blue'],
                [v.type == "0" ? "正价" : "特价",'red']
            ];

            $.each(propertyArr, function (i, v) {
                var $cell = $('<div></div>').addClass('cell '+ v[1]).html(v[0]);
                $cell.appendTo($contentWrap);
            });

            var $optionWrap = $('<div></div>').addClass('line-wrap action');
            var $cellOption = $('<div></div>').addClass('cell option');

            var $btnGroup = $('<div></div>').addClass('btn-group');
            var $btn = $('<button></button>').addClass('btn btn-primary dropdown-toggle').attr('data-toggle', 'dropdown').append('操作').append('<i class="icon-angle-down"></i>');
            var $btnUl = $('<ul></ul>').addClass('dropdown-menu').addClass(lastFlag ? 'bottom-up' : '');

            var $btnDelete = $('<li></li>').append($('<a></a>').html('删除'));

            $btnUl.append($btnDelete);

            $btnGroup.append($btn).append($btnUl).appendTo($cellOption);

            $cellOption.appendTo($optionWrap);

            $liLine.append($indexWrap).append($contentWrap).append($optionWrap);

            $btnDelete.click(function () {

                com.post(api.inventory.deletePrice, {"price.pid": v.pid}, function (res) {
                    doSearcher();
                })
            });

            return $liLine;

        };

        return {
            init: function (tableId, listData) {
                com.focusPage('#' + tableId).html(null);
                renderList(tableId, listData);

            },
            drawLine: function (v) {
                return creatLine(v);
            }
        }
    })();

    function doSearcher() {
        com.post(api.inventory.queryPriceByGid, {"price.gid": goods.gid}, function (res) {
            displayFunc.init('resultListPrice', res.prices);
        });
    }

    doSearcher();

    goods.btns.addBtn.click(function(){

        if(com.validate('addPrice', 'bottom')){
            return false;
        }

        if (goods.items.ctype.val() == 1) {
            if (goods.items.cvalue.val() < 0 || goods.items.cvalue.val() > 1) {
                com.showTip(com.focusPage("#cvalue"), "结算值在0-1之间",'bottom');
                return false;
            }
        }

        var options = {
            "price.gid": goods.gid,
            "price.name": goods.items.name.val(),
            "price.purchase": goods.items.purchase.val(),
            "price.selling": goods.items.selling.val(),
            "price.ctype": goods.items.ctype.val(),
            "price.cvalue": goods.items.cvalue.val(),
            "price.type": goods.items.type.val(),
        };

        com.post(api.inventory.addPrice, options, function(){
            com.cleanItems(goods.items);
            doSearcher();
        });
    });

    goods.btns.cancelBtn.click(function(){
        com.cleanItems(goods.items);
    });

});
