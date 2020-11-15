$(function () {

    var chainPage = {
        saveBtn: null,
        cancelBtn: null,
        items: {},
    };

    var displayFunc = (function () {

        var renderList = function (tableId, listData) {

            if (listData && listData.length) {
                $.each(listData, function (i, v) {
                    creatLine(tableId,v);
                });
            }
        };

        var  creatLine = function (tableId,v) {

            var $div = $('<div></div>').appendTo(com.focusPage('#' + tableId));
            var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable').appendTo($div);
            var $liLine = $('<li></li>').addClass('item-blue clearfix').appendTo($ul);
            var $h3 = $('<h3 ></h3>').addClass('oid').append($('<small style="font-size:22px;"></small>').addClass('blue')).appendTo($liLine);var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix').css({'margin-top': '10px'}).appendTo($h3);
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons').appendTo($ulProperty);
            var $btnChain = $('<a></a>').addClass('btn btn-minier btn-yellow').html('外链').appendTo($divBtnWrap);

            var propertyArr = [
                ["名称:", v.name, "grey"],
                ["说明:", v.comment, "grey"],
            ];

            $.each(propertyArr, function (index, value) {
                var $liProperty = $('<li></li>');
                $('<strong style="font-size:15px ; padding-bottom: 50px;"  ></strong>').html(value[0]).appendTo($liProperty);
                $('<b style="font-size:15px"></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                $liProperty.appendTo($ulProperty);
            });

            $btnChain.click(function () {
                com.popup(v.name, v.url, null, null, false);
            });
        };

        return {
            init: function (tableId, listData) {
                renderList(tableId, listData);
            },
            drawLine: function (v) {
                return creatLine(v);
            }
        };
    })();


    com.post(api.data.queryChainPageForSelf, {}, function(v){
        
        var $div = $('<div></div>').appendTo(com.focusPage('#resultList'));
        var $h3 = $('<h3 style="font-size:22px;"></h3>').addClass('blue').html("外链").appendTo($div);
        
        displayFunc.init('resultList', v.chainPages);
        
    }, null, false);

});
