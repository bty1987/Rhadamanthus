/**
 * Created by Administrator on 2017/4/6.
 */

$(function () {

    /**
     * 回调函数必须提供 init(tableId, result.list)方法 tableId ，用来显示的div的id result.list
     * 列表的json数组
     */
    var goodsPricePopUp = $('#goodsPricePopUp')

    var validator = {
        num: {
            type: "v_num",
            regex: /^(\d+|\d+\.[0-9]{1,4})$/,
            errorMsg: "数量输入内容格式错误"
        },
        priceType: {
            type: "v_priceType",
            regex: /^(0([\.]?\d*[0-9]+)|0|1)$/,
            errorMsg: "结算值在0-1之间"
        }
    };

    $.extend(com.validator, validator);


    var displayFunc = (function () {

        var renderList = function (tableId, listData) {
            var $tableWrap = $('#' + tableId);

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

            $liTitle.append($indexWrap).append($contentWrap)
                .appendTo($ulTitle);//.append($optionWrap)

            return $ulTitle;
        };

        var creatLine = function (i, v, lastFlag) {

            var $liLine = $('<li></li>').addClass('line');

            var $indexWrap = $('<div></div>').addClass('line-wrap order').html(
                $('<div></div>').addClass('cell index').html(i + 1));
            var $contentWrap = $('<div></div>').addClass(
                'line-wrap  content col5');

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
            //    layer.confirm('是否确定删除？', {
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
                $('#' + tableId).html(null);
                renderList(tableId, listData);

            },
            drawLine: function (v) {
                return creatLine(v);
            }
        }
    })();

    function doSearcher() {
        com.post(api.inventory.queryPriceByGid, {
            "price.gid": goodsPricePopUp.attr('data-gid')
        }, function (res) {
            displayFunc.init('resultListPrice', res.prices);
        })
    }

    doSearcher();

    $('.layui-layer-content').css('overflow', 'hidden');
    $('#showPrice').css('height', '560px');
    $('#resultListPrice').css({
        'width': '96%',
        'margin': '0 auto',
        'height': '560px',
        'marigin-top': '20px'
    })

});
