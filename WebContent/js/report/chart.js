$(function() {

    // 获得页面参数
    var type = params['urlLoadParams'].type;
    var level = params['urlLoadParams'].level;

    var attendance = function(res, element) {

        var options = res.option;
        var data = options.series.data;

        $.each(data, function(i, v) {

            var m = Math.floor(v[1] / 10);
            var e = Math.floor(v[1] % 10);

            v[2] = v[0] + ": 早" + (m == "1" ? "正常" : (m == "2" ? "迟到" : "未打卡")) + ", 晚" + (e == "1" ? "正常" : (e == "2" ? "早退" : "未打卡"));

            data[i] = {
                "value": [v[0], m > e ? m : e],
                "label": v[2]
            };

        });

        options.visualMap.min = 1;
        options.visualMap.max = 4;

        options.tooltip = {
            position: 'top',
            formatter: function(p) {

                return p.data.label;
            }
        };
    };

    var number = function(res, element) {

        var options = res.option;

        element.html("");

        var clazz = options.length <= 3 ? "grid" : options.length > 3 && options.length <= 6 ? "grid2" : "grid3";

        var $div1 = $('<div></div>').addClass('clearfix').appendTo(element);

        $.each(options, function(index, option) {

            $('<div></div>').addClass(clazz).html('<span class="bigger-250 blue">' + option.value + '</span><br>' + option.key).appendTo($div1);

        });
    };

    var table = function(res, element) {

        var options = res.option;
        var $element = element.html("");

        var widgetbox = $('<div class="widget-box transparent"></div>').appendTo($element);

        var widgeheader = $('<div class="widget-header"></div>').appendTo(widgetbox);
        $('<h4 class="lighter"></h4>').text(res.title).appendTo(widgeheader);

        var widgebody = $('<div class="widget-body"></div>').appendTo(widgetbox);

        var displayFunc = (function() {

            var renderList = function(listData) {

                var $ul = $('<div></div>').addClass('item-list fl-table-list ui-sortable').css("height", $element.height() * 0.7).css("margin-top", "10px").css("overflow", "overlay").appendTo($element);

                if (!listData || listData.length == 0)
                    return false;

                $.each(listData, function(i, v) {

                    creatLine(v).appendTo($ul);
                });

                return $ul;
            };

            var creatLine = function(option) {

                var $liLine = $('<div></div>').addClass('item-orange clearfix');
                var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').append($("<span></span>").text(option.key)).append($("<span></span>").addClass("pull-right").css("padding-right", "25px").text(option.value)));

                $liLine.append($h3);

                return $liLine;
            };

            return {
                init: function(listData) {

                    return renderList(listData);
                },
                drawLine: function(v) {

                    return creatLine(v);
                }
            };
        })();

        var itemcon = displayFunc.init(options);

        if (res.scroll) {

            itemcon.css("overflow", "hidden");

            setInterval(function() {

                var olditem = itemcon.find(".item-orange")[0];
                var newitem = $(olditem).clone();

                $(olditem).remove();

                newitem.appendTo(itemcon);

            }, 10000);
        }
    };

    var methods = {
        "attendance": attendance,
        "number": number,
        "table": table,
    };

    com.post(api.data.queryChart, {
        "chart.type": type,
        "chart.level": level
    }, function(res) {

        var args = {
            "company": params.company.cid
        };

        $.each(res.charts, function(i, v) {

            com.charts("customize", v.no, getApi({
                "api": api
            }, v.api.split(".")), $.extend({}, JSON.parse(v.param), args), getClazz(v.clazz, v.method), JSON.parse(v.style), null, getApi(methods, v.method.split(".")));
        });
    });

    function getApi(o, props) {

        var prop = props.shift();

        if (props.length == 0) {
            return o[prop];
        } else if (o[prop]) {
            return getApi(o[prop], props);
        }
        return "";
    }

    function getClazz(clazz, method) {

        var len;
        var prop = clazz.split("-").pop().split(" ")[0].split("\"").shift();

        if (prop < 6) {
            if (method == "number") {
                len = "col-xs-6 center";
            } else {
                len = "col-xs-6";
            }

        } else {
            len = "col-xs-12";
        }

        return len;
    }

});