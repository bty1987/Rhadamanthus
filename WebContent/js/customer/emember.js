$(function () {

    var displayFunc = (function () {

        var renderList = function (tableId, listData) {
            var $tableWrap = com.focusPage('#' + tableId);
            var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');

            if (listData && listData.length) {
                $.each(listData, function (i, v) {
                    var $liLine = creatLine(v);

                    $liLine.appendTo($ul);
                });

                $ul.appendTo($tableWrap);
            }
        };
        var creatLine=function (v) {
            var $liLine = $('<li></li>').addClass('item-orange clearfix');
            var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue'));
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

            var $label = $('<label></label>').addClass('control-label').css({
                'color': 'grey',
                'font-size': '20px',
                "font-weight": "bold"
            });

            var _label = $('<label></label>');

            var propertyArr = [
                ["微信号:", v.unionId, "grey"],
                ["会员编号:", v.no, "grey"],
                ["姓名:", v.name, "grey"],
                ["地址:", v.address, "grey"],
                ["票号:", v.ticket, "grey"],
                ["注册时间:", v.registerTime, "green"]
            ];

            $.each(propertyArr, function (index, value) {
                var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                $liProperty.appendTo($ulProperty);
                $label.appendTo($h3);
            });

            var _span = $('<span></span>').addClass('lbl blue bigger-150').html(v.phone);

            _label.append(_span).appendTo($label);

            $divBtnWrap.appendTo($h3);

            $liLine.append($h3).append($ulProperty);

            return $liLine;
        };

        return {
            init : function(tableId,listData){
                com.focusPage('#' + tableId).html(null);
                renderList(tableId,listData);
            },
            drawLine : function(v){
                return creatLine(v);
            }
        };
    })();

    var seacher = new Searcher();

    seacher.init(["customer-member-no","customer-member-phone"], "condList", api.customer.pageEmember, function (data) {
        displayFunc.init('resultList', data);
    }, "pagenation", "ememeberPostData", null, false, null, function () {

    });
});