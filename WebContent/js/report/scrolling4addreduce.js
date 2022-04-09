$(function() {

    var scrolling = {
        scrolling: com.focusPage('#scrolling4addreduce'),
        control: "",
        color: "blue",
        fullscreen: com.focusPage('#fullscreen'),
    };

    scrolling.fullscreen.click(function() {

        scrolling.scrolling.addClass('full-Screen').css({
            "overflow": "hidden",
            "background-color": "#16406b",
            "margin": "0px",
            "padding": "5px 0px"
        });

        com.focusPage('#scrolling4addreduce1').css('color', '#c5e2ff');
        com.focusPage('#scrolling4addreduce2').css('color', '#c5e2ff');
        com.focusPage('#scrolling4addreduce3').css('color', '#c5e2ff');
        scrolling.control = "#c5e2ff";
        scrolling.color = "#c5e2ff";
        scrolling.scrolling.find('small').css('color', '#c5e2ff');
        com.focusPage('#scrolling4addreduce').find('b').addClass('#c5e2ff');
        scrolling.fullscreen.hide();
    });

    $(document).keyup(function(event) {

        if (event.keyCode == 27) {
            scrolling.scrolling.removeClass('full-Screen').css('background-color', '');
            com.focusPage('#scrolling4addreduce1').css('color', '');
            com.focusPage('#scrolling4addreduce2').css('color', '');
            com.focusPage('#scrolling4addreduce3').css('color', '');
            scrolling.scrolling.find('small').css('color', 'blue');
            scrolling.control = "";
            scrolling.color = "blue";
            com.focusPage('#scrolling4addreduce').find('b').removeClass();
            scrolling.fullscreen.show();
        }
    });

    var displayFunc = (function() {

        var renderList = function(tableId, listData) {

            var $tableWrap = com.focusPage('#' + tableId);
            var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');

            if (listData && listData.length) {
                $.each(listData, function(i, v) {

                    creatLine(v).appendTo($ul);
                });

                $ul.appendTo($tableWrap);
            }
        };
        var rankeList = function(tableId, listData) {

            var $tableWrap = com.focusPage('#' + tableId);
            var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');

            if (listData && listData.length) {
                $.each(listData, function(i, v) {

                    creatLines(v).appendTo($ul);
                });

                $ul.appendTo($tableWrap);
            }
        };

        var creatLine = function(v) {

            var $liLine = $('<li></li>').addClass('item item-orange clearfix');

            var supervisor = "监理名称: " + com.checkNull(v.decoration.supervisor.currentName, "") + "  装修单: " + v.decoration.orderId + "  地址: " + v.decoration.house.village.name + " " + v.decoration.house.houseNumber + "  金额: " + v.total;
            var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').css('color', scrolling.color).html(supervisor));
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

            var $invalid = $('<div></div>').addClass('pull-right');

            $divBtnWrap.append($invalid).appendTo($h3);

            var propertyArr = [["装修单: ", v.decoration.orderId, "#7FBF3F"], ["地址: ", v.decoration.house.village.name + " " + v.decoration.house.houseNumber, "#7FBF3F"], ["创建时间: ", v.createTime, "#7FBF3F"], ["金额: ", v.total, "#2ECCFA"], ];

            var $label = $('<label></label>');

            $.each(propertyArr, function(index, value) {

                var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(scrolling.control).css('color', value[2]).appendTo($liProperty);
                $liProperty.appendTo($ulProperty);
            });

            $h3.append($divBtnWrap).append($label);

            $liLine.append($h3).append($ulProperty);

            return $liLine;
        };
        var creatLines = function(v) {

            var $liLine = $('<li></li>').addClass('item item-orange clearfix');

            var supervisor = com.checkNull(v.name, "");
            var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').css('color', scrolling.color).html(supervisor));
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

            var $invalid = $('<div></div>').addClass('pull-right');

            $divBtnWrap.append($invalid).appendTo($h3);

            var propertyArr = [["总数: ", v.count, "#7FBF3F"], ["总额: ", v.total, "#7FBF3F"]];

            var $label = $('<label></label>');

            $.each(propertyArr, function(index, value) {

                var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(scrolling.control).css('color', value[2]).appendTo($liProperty);
                $liProperty.appendTo($ulProperty);
            });

            $h3.append($divBtnWrap).append($label);

            $liLine.append($h3).append($ulProperty);

            return $liLine;
        };

        return {
            drawLine: function(v) {

                return creatLine(v);
            },
            rankeLine: function(v) {

                return creatLines(v);
            },
            renderList: function(tableId, listData) {

                return renderList(tableId, listData);
            },
            rankeList: function(tableId, listData) {

                return rankeList(tableId, listData);
            }
        }
    })();

    function scroll(element, api, rows, limit, start, offset, options, render) {

        options["paging.rows"] = rows;
        options["paging.page"] = start;

        var interval = 0;

        var index = 0;

        com.post(api, options, function(res) {

            render(element, res.paging.data);

            interval = setInterval(function() {

                if ($("#" + element).length == 0) {
                    clearInterval(interval);
                }
                if ($("#" + element).find("li.item-orange").length != 0)
                    $("#" + element).find("li.item-orange")[0].remove();

                if ($("#" + element).find("li.item-orange").length < limit) {

                    options["paging.page"] = options["paging.page"] + offset;

                    com.post(api, options, function(res) {

                        if (res.paging.data.length < res["paging.rows"]) {
                            options["paging.page"] = start;
                        }
                        render(element, res.paging.data);
                    });
                }
            }, 3000);
        });
    }

    function ranks(element, api, rows, limit, start, offset, options, render) {

        options["paging.rows"] = rows;
        options["paging.page"] = start;

        com.post(api, options, function(res) {

            render(element, res.addReduceRankVOs);

            if ($("#" + element).find("li.item-orange").length < limit) {

                options["paging.page"] = options["paging.page"] + offset;

                com.post(api, options, function(res) {

                    if (res.addReduceRankVOs.length < res["paging.rows"]) {
                        options["paging.page"] = start;
                    }
                    render(element, res.addReduceRankVOs);
                });
            }

        });
    }
    scroll("scrolling4addreduce1", api.addReduce.pageAddReduce, 30, 20, 0, 2, {
        "addReduce.type": 0,
        "addReduce.status": 0,
        "addReduce.paytype": 0
    }, displayFunc.renderList);

    scroll("scrolling4addreduce2", api.addReduce.pageAddReduce, 30, 20, 1, 2, {
        "addReduce.type": 0,
        "addReduce.status": 0,
        "addReduce.paytype": 0
    }, displayFunc.renderList);
    ranks("scrolling4addreduce3", api.report.rankAddReduce, 10, 11, 1, 2, {

    }, displayFunc.rankeList);
});