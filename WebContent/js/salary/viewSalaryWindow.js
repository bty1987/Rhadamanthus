jQuery(function ($) {

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

            var $indexWrap = $('<div></div>').addClass('line-wrap order').html($('<div></div>').addClass('cell index'));
            var $contentWrap = $('<div></div>').addClass('line-wrap  content col4');

            var titleName = '薪资,状态,创建时间,备注';

            $.each(titleName.split(','), function (i, v) {
                var $cell = $('<div></div>').addClass('cell').html(v);
                $cell.appendTo($contentWrap);
            });

            $liTitle.append($indexWrap)
                .append($contentWrap)
                .appendTo($ulTitle);

            return $ulTitle;
        };

        var creatLine = function (i, v, lastFlag) {

            var $liLine = $('<li></li>').addClass('line');

            var $indexWrap = $('<div></div>').addClass('line-wrap order').html($('<div></div>').addClass('cell index').html(i + 1));
            var $contentWrap = $('<div></div>').addClass('line-wrap  content col4');
            var propertyArr = [
                v.salary,
                v.status == 0 ? "初始" : v.status == 1 ? "通过" : "驳回",
                v.createTime,
                v.comment,
            ];

            $.each(propertyArr, function (i, v) {
                var $cell = $('<div></div>').addClass('cell').html(v);
                $cell.appendTo($contentWrap);
            });

            var $cellOption = $('<div></div>').addClass('cell option');

            var $btnGroup = $('<div></div>').addClass('btn-group');
            var $btnUl = $('<ul></ul>').addClass('dropdown-menu').addClass(lastFlag ? 'bottom-up' : '');
            $btnGroup
                .append($btnUl)
                .appendTo($cellOption);
            $liLine.append($indexWrap)
                .append($contentWrap);
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

    var $popup = $('#viewPopUp');

    var userId = $popup.attr('data-userId');
    var startTime = $popup.attr('data-startTime');
    var endTime = $popup.attr('data-endTime');

    var startTime = startTime.replace(/\//g, '-');
    var endTime = endTime.replace(/\//g, '-');
    var opt ={
        "filters[0].field": "userId",
        "filters[0].data": userId,
        "filters[1].field": "startTime",
        "filters[1].data": startTime + " 00:00:00",
        "filters[2].field": "endTime",
        "filters[2].data": endTime + " 23:59:59",
    };

    var searcher = new Searcher();
    searcher.init([], "", api.salary.pageWorkerSalaryByUserId, function (list) {
        displayFunc.init('resultList1', list);
    }, "pagenation", "inspectionRecordPostData", opt, false, null,null,"resultList1");

    //弹出内容许些样式
    $('#resultList1').css({'width': '96%', 'margin': '0 auto'});
});