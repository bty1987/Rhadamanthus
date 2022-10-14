$(function() {

    var chartdefault = {
        toolbox: {
            show: true,
            feature: {
            // saveAsImage : {show: true}
            }
        }
    };

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

    var arr1 = [7, 16, 17, 18, 19, 20, 21, 22, 23, 24];
    $.ajax({
        type: "POST",
        dataType: "json",
        url: "../../queryChart.do",
        async: false,
        data: {
            "chart.type": null,
            "chart.level": null,
            "authentication": "eX3o2SZdrpVOV9HC4UYTRA=="
        },
        success: function(res) {

            if (res.errorCode == 0) {

                $.each(res.charts, function(i, v) {

                    var args = {
                        "company": "FC96a5+pZvFEWIYW5CvxDw=="
                    };

                    if (arr1.includes(v.cid)) {

                        comcharts("resultList", "cs0" + v.cid, $.extend({}, JSON.parse(v.param), args), getClazz(v.method), {
                            "height": "300px"
                        }, null, getApi(methods, v.method.split(".")));
                    }

                });
            } else {
                alert(res.errorMsg);
            }
        }
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

    function getClazz(method) {

        if (method == "number") {
            clazz = "col-xs-12 center";
        } else {
            clazz = "col-xs-12";
        }

        return clazz;
    }

    function comcharts(parentId, elementId, args, clazz, styles, theme, excuter) {

        if (!echarts)
            return false;

        var $parent = $("#" + parentId);

        if (!$parent)
            return false;

        styles = styles ? styles : {};
        theme = theme ? theme : "light";

        var $element = $("<div></div>").attr("id", elementId).addClass(clazz).css(styles).appendTo($parent);

        if ($element.length == 0)
            return false;

        var $options = $.extend({}, chartdefault);
        var $chart = echarts.init($element[0], theme);

        $chart.showLoading();
        args["authentication"] = "IJSFKo2JTaDuehFI2aJSSAM5gB+1v7QpvVDObBD0w21Zdr5FMa2AMJRNYCysY7w2kcbDBZhQnfeKGlmphUIQu2izKHuoc+By/RE84NVz+1anbO8ezuoKwlLqpkk5tM4YSsuY85XSvtLYUTI5ub9lSw==",

        $.ajax({
            type: "POST",
            dataType: "json",
            async: false,
            url: "http://192.168.5.22/library",
            data: args,
            success: function(res) {

                if (res.errorCode == 0) {
                    $chart.hideLoading();
                    if (excuter && typeof (excuter) == 'function')
                        excuter(res, $element);

                    $chart.setOption($.extend($options, res.option));

                } else {
                    alert(res.errorMsg);
                }
            }
        });

        return $chart;
    }

});
