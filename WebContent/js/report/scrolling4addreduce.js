$(function () {

    var scrolling = {
        scrolling: com.focusPage('#scrolling4addreduce'),

        fullscreen: com.focusPage('#fullscreen'),
    };

    scrolling.fullscreen.click(function () {
        scrolling.scrolling.addClass('full-Screen').css({"overflow": "hidden", "background-color": "white", "margin": "0px", "padding": "5px 0px"});
        scrolling.fullscreen.hide();
    });

    $(document).keyup(function (event) {
        if (event.keyCode == 27) {
            scrolling.scrolling.removeClass('full-Screen').css('background-color', '');
//            scrolling.scrolling.parents('.page-content').find('h3').css('color', '');
            scrolling.fullscreen.show();
        }
    });

    var displayFunc = (function () {

        var renderList = function (tableId, listData) {
            var $tableWrap = com.focusPage('#' + tableId);
            var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');

            if (listData && listData.length) {
                $.each(listData, function (i, v) {
                    creatLine(v).appendTo($ul);
                });

                $ul.appendTo($tableWrap);
            }
        };

        var creatLine = function (v) {

            var $liLine = $('<li></li>').addClass('item item-orange clearfix');

            var supervisor = (v.decoration.supervisor != null) ? v.decoration.supervisor.currentName : "";

            var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(supervisor));
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

            var $invalid = $('<div></div>').addClass('pull-right');

            $divBtnWrap.append($invalid).appendTo($h3);

            var propertyArr = [
                ["装修单: ", v.decoration.orderId, "gren"],
                ["地址: ", v.decoration.house.village.name + " " + v.decoration.house.houseNumber, "gren"],
                ["金额: ", v.total, "blue"],
            ];

            var $label = $('<label></label>');

            $.each(propertyArr, function (index, value) {
                var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                $liProperty.appendTo($ulProperty);
            });

            $h3.append($divBtnWrap).append($label);

            $liLine.append($h3).append($ulProperty);

            return $liLine;
        };

        return {
            drawLine: function (v) {
                return creatLine(v);
            },
            renderList: function (tableId, listData) {
                return renderList(tableId, listData);
            }
        }
    })();

    function scroll(element, api, rows, limit, start, offset, options, render){

        options["paging.rows"] = rows;
        options["paging.page"] = start;

        var interval = 0;

        var index = 0;

        com.post(api, options, function(res){

            render(element, res.paging.data);

            interval = setInterval(function () {

                if ($("#" + element).length == 0) {
                    clearInterval(interval);
                }

                if($("#" + element).find("li.item-orange").length != 0) $("#" + element).find("li.item-orange")[0].remove();

                if ($("#" + element).find("li.item-orange").length < limit){

                    options["paging.page"] = options["paging.page"] + offset * ++index;

                    com.post(api, options, function (res) {
                        if (res.paging.data.length < res["paging.rows"]){
                            options["paging.page"] = start;
                        }
                        render(element, res.paging.data);
                    });
                }
            }, 3000);
        });
    }

    scroll("scrolling4addreduce1", api.addReduce.pageAddReduce, 30, 20, 0, 3, {"addReduce.type": 0, "addReduce.status": 0, "addReduce.paytype": 0}, displayFunc.renderList);

    scroll("scrolling4addreduce2", api.addReduce.pageAddReduce, 30, 20, 1, 3, {"addReduce.type": 0, "addReduce.status": 0, "addReduce.paytype": 0}, displayFunc.renderList);

    scroll("scrolling4addreduce3", api.addReduce.pageAddReduce, 30, 20, 2, 3, {"addReduce.type": 0, "addReduce.status": 0, "addReduce.paytype": 0}, displayFunc.renderList);

});