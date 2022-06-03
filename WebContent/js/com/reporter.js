$(function() {

    var attendance = function(res) {

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

    var hello = function() {

        com.showAlert(com.info, "你好");
    }

    var methods = {
        "attendance": attendance,
        "hello": hello,
    }

    com.post(api.data.queryChartForLogin, {}, function(res) {

        var args = {
            "company": params.company.cid
        };

        $.each(res.charts, function(i, v) {

            com.charts("customize", v.no, getApi({
                "api": api
            }, v.api.split(".")), $.extend({}, JSON.parse(v.param), args), JSON.parse(v.clazz), JSON.parse(v.style), null, getApi(methods, v.method.split(".")));

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

});