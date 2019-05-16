
$(function () {

    var goodsPricePopUp = com.focusPage('#goodsPricePopUp');
    
    var goods = {
    	gid: params["goods.gid"]
    }

    var validator = {
		float3: {
            type: "v_float_3",
            regex: /^([0-9]+|[0-9]+\.[0-9]{1,3})$/,
            errorMsg: "数量格式错误"
        }
    };

    $.extend(com.validator, validator);
    
    com.post(api.inventory.queryPriceByGid, {"price.gid": goods.gid}, function (res) {
        displayFunc.init('resultListPrice', res.prices);
    });

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

            var $indexWrap = $('<div></div>').addClass('line-wrap order').html(
                $('<div></div>').addClass('cell index'));
            var $contentWrap = $('<div></div>').addClass(
                'line-wrap  content col5');

            var titleName = '价格说明,进价,售价,结算类型,结算值';

            $.each(titleName.split(','), function (i, v) {
                var $cell = $('<div></div>').addClass('cell').html(v);
                $cell.appendTo($contentWrap);
            });

            //var $optionWrap = $('<div></div>').addClass('line-wrap action')
            //    .html($('<div>操作</div>').addClass('cell option'));

            $liTitle.append($indexWrap).append($contentWrap).appendTo($ulTitle);//.append($optionWrap)

            return $ulTitle;
        };

        var creatLine = function (i, v, lastFlag) {

            var $liLine = $('<li></li>').addClass('line');

            var $indexWrap = $('<div></div>').addClass('line-wrap order').html($('<div></div>').addClass('cell index').html(i + 1));
            var $contentWrap = $('<div></div>').addClass('line-wrap  content col5');

            var propertyArr = [
                // v.gid,
                [v.name,'grey'],
                [v.purchase,'blue'],
                [v.selling,'blue'],
                [v.ctype == "0" ? "底价" : "点位",'red'],
                [v.cvalue,'blue']
            ];

            $.each(propertyArr, function (i, v) {
                var $cell = $('<div></div>').addClass('cell '+ v[1]).html(v[0]);
                $cell.appendTo($contentWrap);
            });

            //var $optionWrap = $('<div></div>').addClass('line-wrap action');
            var $cellOption = $('<div></div>').addClass('cell option');

            //var $btnGroup = $('<div></div>').addClass('btn-group');
            //var $btn = $('<button></button>').addClass(
            //    'btn btn-primary dropdown-toggle').attr('data-toggle', 'dropdown')
            //    .append('操作').append('<i class="icon-angle-down"></i>');
            //var $btnUl = $('<ul></ul>').addClass('dropdown-menu').addClass(
            //    lastFlag ? 'bottom-up' : '');

            //var $btnDelete = $('<li></li>').append($('<a></a>').html('删除'));

            //$btnUl.append($btnDelete);

            //$btnGroup.append($btn).append($btnUl).appendTo($cellOption);

            //$cellOption.appendTo($optionWrap);

            $liLine.append($indexWrap).append($contentWrap);//.append($optionWrap)

            //$btnDelete.click(function () {
            //    layer.confirm('是否确定删除?', {
            //        btn: ['确定', '取消']
            //        // 按钮
            //    }, function (index, layero) {
            //        deleteManifestTemplate(v.pid, function () {
            //            layer.msg('删除成功', {icon:1});
            //            doSearcher();
            //        });
            //    }, function (e) {
            //        com.showAlert(com.error, e.errorMsg);
            //    });
            //})

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

});
