$(function () {
    var today = new Date()
    today.setHours(0)
    today.setMinutes(0)
    today.setSeconds(0)

    var largeScreen = {
        InterfaceRequestsForMouth: $('#InterfaceRequestsForMouth'),
        InterfaceRequestsAll: $('#InterfaceRequestsAll'),
        InterfaceRequestsForDay: $('#InterfaceRequestsForDay'),
        TemperatureTrend: $('#TemperatureTrend'),
        InterfaceRequestsForDayAll: $('#InterfaceRequestsForDayAll'),
        InterfaceRequestsForDayByUserId: $('#InterfaceRequestsForDayByUserId'),
        ApiInterfaceRequestsForDay: $('#ApiInterfaceRequestsForDay'),
        fullScreen: $('#fullScreen'),
        elasticUrl: {
            logstash: 'http://192.168.5.21:9200/logstash-*/_search',
            monitor: 'http://192.168.5.21:9200/monitor-*/_search',
        }
    }

    //开始绘制大屏
    function begin() {

        /*M-4-天级请求数走势*/
        var InterfaceRequestsForMouth = {
            "query": {
                "bool": {
                    "must": [
                        {
                            "query_string": {
                                "analyze_wildcard": true,
                                "query": "*"
                            }
                        },
                        {
                            "query_string": {
                                "analyze_wildcard": true,
                                "query": "*"
                            }
                        },
                        {
                            "range": {
                                "@timestamp": {
                                    "gte": Date.parse(new Date())-5412506000,//1510452005607,
                                    "lte": Date.parse(new Date()),
                                    "format": "epoch_millis"
                                }
                            }
                        }
                    ],
                    "must_not": []
                }
            },
            "size": 0,
            "_source": {
                "excludes": []
            },
            "aggs": {
                "2": {
                    "date_histogram": {
                        "field": "@timestamp",
                        "interval": "1d",
                        "time_zone": "Asia/Shanghai",
                        "min_doc_count": 1
                    }
                }
            },
            "version": true,
            "highlight": {
                "pre_tags": [
                    "@kibana-highlighted-field@"
                ],
                "post_tags": [
                    "@/kibana-highlighted-field@"
                ],
                "fields": {
                    "*": {}
                },
                "fragment_size": 2147483647
            }
        }
        /*M-6-请求数*/
        var InterfaceRequestsAll = {
            "query": {
                "bool": {
                    "must": [
                        {
                            "query_string": {
                                "query": "*",
                                "analyze_wildcard": true
                            }
                        },
                        {
                            "query_string": {
                                "analyze_wildcard": true,
                                "query": "*"
                            }
                        },
                        {
                            "range": {
                                "@timestamp": {
                                    "gte": 1483200000000,
                                    "lte": Date.parse(new Date()),
                                    "format": "epoch_millis"
                                }
                            }
                        }
                    ],
                    "must_not": []
                }
            },
            "size": 0,
            "_source": {
                "excludes": []
            },
            "aggs": {},
            "version": true,
            "highlight": {
                "pre_tags": [
                    "@kibana-highlighted-field@"
                ],
                "post_tags": [
                    "@/kibana-highlighted-field@"
                ],
                "fields": {
                    "*": {}
                },
                "fragment_size": 2147483647
            }
        }
        /*M-1-24小时请求总数*/
        var InterfaceRequestsForDay = {
            "query": {
                "bool": {
                    "must": [
                        {
                            "query_string": {
                                "analyze_wildcard": true,
                                "query": "*"
                            }
                        },
                        {
                            "query_string": {
                                "analyze_wildcard": true,
                                "query": "*"
                            }
                        },
                        {
                            "range": {
                                "@timestamp": {
                                    "gte": Date.parse(today),
                                    "lte": Date.parse(new Date()),
                                    "format": "epoch_millis"
                                }
                            }
                        }
                    ],
                    "must_not": []
                }
            },
            "size": 0,
            "_source": {
                "excludes": []
            },
            "aggs": {
                "2": {
                    "date_range": {
                        "field": "@timestamp",
                        "ranges": [
                            {
                                "from": "now-24h/h",
                                "to": "now"
                            }
                        ]
                    }
                }
            },
            "version": true,
            "highlight": {
                "pre_tags": [
                    "@kibana-highlighted-field@"
                ],
                "post_tags": [
                    "@/kibana-highlighted-field@"
                ],
                "fields": {
                    "*": {}
                },
                "fragment_size": 2147483647
            }
        }
        /*M-5-8小时服务器温度走势*/
        var TemperatureTrend = {
            "query": {
                "bool": {
                    "must": [
                        {
                            "query_string": {
                                "analyze_wildcard": true,
                                "query": "*"
                            }
                        },
                        {
                            "match_phrase": {
                                "_type": {
                                    "query": "TP"
                                }
                            }
                        },
                        {
                            "query_string": {
                                "analyze_wildcard": true,
                                "query": "*"
                            }
                        },
                        {
                            "range": {
                                "timestamp": {
                                    "gte": Date.parse(today),
                                    "lte": Date.parse(new Date()),
                                    "format": "epoch_millis"
                                }
                            }
                        }
                    ],
                    "must_not": []
                }
            },
            "size": 0,
            "_source": {
                "excludes": []
            },
            "aggs": {
                "3": {
                    "terms": {
                        "field": "name.keyword",
                        "size": 10,
                        "order": {
                            "1": "desc"
                        }
                    },
                    "aggs": {
                        "1": {
                            "avg": {
                                "field": "temperature"
                            }
                        },
                        "4": {
                            "date_range": {
                                "field": "timestamp",
                                "ranges": [
                                    {
                                        "from": "now-8h/h",
                                        "to": "now-7h/h"
                                    },
                                    {
                                        "from": "now-9h/h",
                                        "to": "now-8h/h"
                                    },
                                    {
                                        "from": "now-10h/h",
                                        "to": "now-9h/h"
                                    },
                                    {
                                        "from": "now-11h/h",
                                        "to": "now-10h/h"
                                    },
                                    {
                                        "to": "now-11h/h",
                                        "from": "now-12h/h"
                                    },
                                    {
                                        "to": "now-12h/h",
                                        "from": "now-13h/h"
                                    },
                                    {
                                        "to": "now-13h/h",
                                        "from": "now-14h/h"
                                    },
                                    {
                                        "to": "now-14h/h",
                                        "from": "now-15h/h"
                                    }
                                ]
                            },
                            "aggs": {
                                "1": {
                                    "avg": {
                                        "field": "temperature"
                                    }
                                }
                            }
                        }
                    }
                }
            },
            "version": true,
            "highlight": {
                "pre_tags": [
                    "@kibana-highlighted-field@"
                ],
                "post_tags": [
                    "@/kibana-highlighted-field@"
                ],
                "fields": {
                    "*": {}
                },
                "fragment_size": 2147483647
            }
        }
        /*M-2-服务器天级请求总数*/
        var InterfaceRequestsForDayAll = {
            "query": {
                "bool": {
                    "must": [
                        {
                            "query_string": {
                                "query": "*",
                                "analyze_wildcard": true
                            }
                        },
                        {
                            "query_string": {
                                "analyze_wildcard": true,
                                "query": "*"
                            }
                        },
                        {
                            "range": {
                                "@timestamp": {
                                    "gte": Date.parse(new Date())-5412506000,//1510452822303,8145924000
                                    "lte": Date.parse(new Date()),
                                    "format": "epoch_millis"
                                }
                            }
                        }
                    ],
                    "must_not": []
                }
            },
            "size": 0,
            "_source": {
                "excludes": []
            },
            "aggs": {
                "2": {
                    "date_histogram": {
                        "field": "@timestamp",
                        "interval": "1d",
                        "time_zone": "Asia/Shanghai",
                        "min_doc_count": 1
                    },
                    "aggs": {
                        "3": {
                            "terms": {
                                "field": "host.keyword",
                                "size": 10,
                                "order": {
                                    "_count": "desc"
                                }
                            }
                        }
                    }
                }
            },
            "version": true,
            "highlight": {
                "pre_tags": [
                    "@kibana-highlighted-field@"
                ],
                "post_tags": [
                    "@/kibana-highlighted-field@"
                ],
                "fields": {
                    "*": {}
                },
                "fragment_size": 2147483647
            }
        }
        /*M-3-人员天级请求TOP10*/
        var InterfaceRequestsForDayByUserId = {
            "query": {
                "bool": {
                    "must": [
                        {
                            "query_string": {
                                "query": "*",
                                "analyze_wildcard": true
                            }
                        },
                        {
                            "query_string": {
                                "analyze_wildcard": true,
                                "query": "*"
                            }
                        },
                        {
                            "range": {
                                "@timestamp": {
                                    "gte": Date.parse(new Date())-2733418000,//1510452822303,
                                    "lte": Date.parse(new Date()),
                                    "format": "epoch_millis"
                                }
                            }
                        }
                    ],
                    "must_not": []
                }
            },
            "size": 0,
            "_source": {
                "excludes": []
            },
            "aggs": {
                "3": {
                    "terms": {
                        "field": "info.keyword",
                        "size": 10,
                        "order": {
                            "_count": "desc"
                        }
                    },
                    "aggs": {
                        "4": {
                            "date_histogram": {
                                "field": "@timestamp",
                                "interval": "1d",
                                "time_zone": "Asia/Shanghai",
                                "min_doc_count": 1
                            }
                        }
                    }
                }
            },
            "version": true,
            "highlight": {
                "pre_tags": [
                    "@kibana-highlighted-field@"
                ],
                "post_tags": [
                    "@/kibana-highlighted-field@"
                ],
                "fields": {
                    "*": {}
                },
                "fragment_size": 2147483647
            }
        }
        /*M-7-天级API请求数(TOP10)*/
        var ApiInterfaceRequestsForDay = {
            "query": {
                "bool": {
                    "must": [
                        {
                            "query_string": {
                                "query": "*",
                                "analyze_wildcard": true
                            }
                        },
                        {
                            "query_string": {
                                "analyze_wildcard": true,
                                "query": "*"
                            }
                        },
                        {
                            "range": {
                                "@timestamp": {
                                    "gte": Date.parse(new Date())-2733418000,//1510452822303,
                                    "lte": Date.parse(new Date()),
                                    "format": "epoch_millis"
                                }
                            }
                        }
                    ],
                    "must_not": []
                }
            },
            "size": 0,
            "_source": {
                "excludes": []
            },
            "aggs": {
                "2": {
                    "date_histogram": {
                        "field": "@timestamp",
                        "interval": "1d",
                        "time_zone": "Asia/Shanghai",
                        "min_doc_count": 1
                    },
                    "aggs": {
                        "3": {
                            "terms": {
                                "field": "api.keyword",
                                "size": 7,
                                "order": {
                                    "_count": "desc"
                                }
                            }
                        }
                    }
                }
            },
            "version": true,
            "highlight": {
                "pre_tags": [
                    "@kibana-highlighted-field@"
                ],
                "post_tags": [
                    "@/kibana-highlighted-field@"
                ],
                "fields": {
                    "*": {}
                },
                "fragment_size": 2147483647
            }
        }

        var flag = false;

        ajax(largeScreen.elasticUrl.logstash, InterfaceRequestsForMouth, function (res) {
            var data = []
            $.each(res.aggregations['2'].buckets, function (i, v) {
                data.push({
                    times: getMyDate(v.key),
                    count: v.doc_count
                })
            })
            var chart = new G2.Chart({
                container: 'InterfaceRequestsForMouth',
                forceFit: true,
                height: 220,
                padding: [30, 50]
            });
            chart.source(data);
            chart.scale({
                times: {
                    range: [0, 1]
                }
            });
            chart.tooltip({
                crosshairs: {
                    type: 'line'
                }
            });
            chart.area().position('times*count');
            chart.line().position('times*count').size(2);
            chart.render();
        }, function (msg) {
            console.log(msg)
            flag = true;
        })

        ajax(largeScreen.elasticUrl.logstash, InterfaceRequestsAll, function (res) {
            $('#InterfaceRequestsAll').css({
                "text-align": "center",
                "width": "auto",
                "height": "160px",
                "line-height": "140px",
                "font-size": "40px",
                "font-weight": "bold"
            }).html(res.hits.total)
        }, function (msg) {
            console.log(msg)
            flag = true;
        })

        ajax(largeScreen.elasticUrl.logstash, InterfaceRequestsForDay, function (res) {
            $('#InterfaceRequestsForDay').css({
                "text-align": "center",
                "width": "auto",
                "height": "220px",
                "line-height": "180px",
                "font-size": "40px",
                "font-weight": "bold"
            }).html(res.aggregations['2'].buckets[0].doc_count)
        }, function (msg) {
            console.log(msg)
            flag = true;
        })

        ajax(largeScreen.elasticUrl.monitor, TemperatureTrend, function (res) {
            var data = [];
            var _temp = [];
            var computer = [];
            $.each(res.aggregations['3'].buckets, function (i, v) {
                computer.push(v.key)
                $.each(v['4'].buckets, function (index, value) {
                    var temp = {}
                    temp['times'] = getMyDate(value.from)
                    temp[v.key] = value['1'].value
                    _temp.push(temp)
                })

            })
            push(data, _temp, 8)
            var ds = new DataSet();
            var dv = ds.createView().source(data);
            dv.transform({
                type: 'fold',
                fields: computer, // 展开字段集
                key: 'computer', // key字段
                value: 'temperature', // value字段
            });
            var chart = new G2.Chart({
                container: 'TemperatureTrend',
                forceFit: true,
                height: 450
            });
            chart.source(dv, {
                times: {
                    range: [0, 1]
                }
            });
            chart.tooltip({
                crosshairs: {
                    type: 'line'
                }
            });
            chart.axis('temperature', {
                label: {
                    formatter: function (val) {
                        return val + '°C'
                    }
                }
            });
            chart.line().position('times*temperature').color('computer').shape('smooth');
            chart.point().position('times*temperature').color('computer').size(4).shape('circle').style({
                stroke: '#fff',
                lineWidth: 1
            });
            chart.render();
        }, function (msg) {
            console.log(msg)
            flag = true;
        })

        ajax(largeScreen.elasticUrl.logstash, InterfaceRequestsForDayAll, function (res) {
            var data = [];
            var server = [];
            $.each(res.aggregations['2'].buckets, function (i, v) {
                var _data = {};
                _data['times'] = getMyDate(v.key);
                $.each(v['3'].buckets, function (index, value) {
                    server.push(value.key)
                    _data[value.key] = value.doc_count
                })
                data.push(_data)
            })
            $.unique(server)
            var ds = new DataSet();
            var dv = ds.createView().source(data);
            dv.transform({
                type: 'fold',
                fields: server, // 展开字段集
                key: 'server', // key字段
                value: 'requests', // value字段
            });
            var chart = new G2.Chart({
                container: 'InterfaceRequestsForDayAll',
                forceFit: true,
                height: 220
            });
            chart.source(dv, {
                times: {
                    range: [0, 1]
                }
            });
            chart.tooltip({
                crosshairs: {
                    type: 'line'
                }
            });
            chart.axis('requests', {
                label: {
                    formatter: function (val) {
                        return val
                    }
                }
            });
            chart.line().position('times*requests').color('server');
            chart.point().position('times*requests').color('server').size(4).shape('circle').style({
                stroke: '#fff',
                lineWidth: 1
            });
            chart.render();
        }, function (msg) {
            console.log(msg)
            flag = true;
        })

        ajax(largeScreen.elasticUrl.logstash, InterfaceRequestsForDayByUserId, function (res) {
            console.log(res)
            var data = [];
            var _temp = [];
            var userId = [];
            $.each(res.aggregations['3'].buckets, function (i, v) {
                userId.push(v.key)
                $.each(v['4'].buckets, function (index, value) {
                    var temp = {}
                    temp['times'] = getMyDate(value.key)
                    temp[v.key] = value.doc_count
                    _temp.push(temp)
                })

            })
            push(data, _temp, 10)
            var ds = new DataSet();
            var dv = ds.createView().source(data);
            dv.transform({
                type: 'fold',
                fields: userId, // 展开字段集
                key: 'userId', // key字段
                value: 'count', // value字段
            });
            var chart = new G2.Chart({
                container: 'InterfaceRequestsForDayByUserId',
                forceFit: true,
                height: 420
            });
            chart.source(dv, {
                times: {
                    range: [0, 1]
                }
            });
            chart.tooltip({
                crosshairs: {
                    type: 'line'
                }
            });
            chart.axis('count', {
                label: {
                    formatter: function (val) {
                        return val
                    }
                }
            });

            chart.line().position('times*count').color('userId').shape('smooth');
            chart.point().position('times*count').color('userId').size(4).shape('circle').style({
                stroke: '#fff',
                lineWidth: 1
            });
            chart.render();
        }, function (msg) {
            console.log(msg)
            flag = true;
        })

        ajax(largeScreen.elasticUrl.logstash, ApiInterfaceRequestsForDay, function (res) {
            var data = [];
            var api = [];
            $.each(res.aggregations['2'].buckets, function (i, v) {
                var _data = {};
                _data['times'] = getMyDate(v.key);
                $.each(v['3'].buckets, function (index, value) {
                    api.push(value.key)
                    _data[value.key] = value.doc_count
                })
                data.push(_data)
            })
            $.unique(api)
            var ds = new DataSet();
            var dv = ds.createView().source(data);
            dv.transform({
                type: 'fold',
                fields: api, // 展开字段集
                key: 'api', // key字段
                value: 'count', // value字段
            });
            var chart = new G2.Chart({
                container: 'ApiInterfaceRequestsForDay',
                forceFit: true,
                height: 420
            });
            chart.source(dv, {
                times: {
                    range: [0, 1]
                }
            });
            chart.tooltip({
                crosshairs: {
                    type: 'line'
                }
            });
            chart.axis('count', {
                label: {
                    formatter: function (val) {
                        return val
                    }
                }
            });
            chart.line().position('times*count').color('api');//,['red','green','blue','yellow','#FF0088','#33FFFF','#FF3EFF','orange','#00FFFF','#9400D3']
            chart.point().position('times*count').color('api').size(4).shape('circle').style({//,['red','green','blue','yellow','#FF0088','#33FFFF','#FF3EFF','orange','#00FFFF','#9400D3']
                stroke: '#fff',
                lineWidth: 1
            });
            chart.render();

        }, function (msg) {
            console.log(msg)
            flag = true;
        })

        if ($('.page-content').hasClass('full-Screen')) {
            G2.Global.setTheme('dark');
        }

        if (flag) {
            clear(function () {
                begin()
            })
        }

    }

    function ajax(url, data, callback, failcallback) {
        $.ajax({
            url: url,
            data: JSON.stringify(data),
            type: "post",
            dataType: "json",
            async: false, //设为false就是同步请求
            success: function (res) {
                callback(res)

            }, error: function (msg) {
                failcallback(msg)
            }
        })
    }

    largeScreen.fullScreen.click(function () {
        G2.Global.setTheme('dark');
        largeScreen.fullScreen.parents('.page-content').addClass('full-Screen').css('background-color', '#1f1f1f');
        largeScreen.fullScreen.parents('.page-content').find('h3').css('color', '#fff')
        largeScreen.fullScreen.hide();
        $('#InterfaceRequestsAll').css('color', '#fff')
        $('#InterfaceRequestsForDay').css('color', '#fff')
    })

    $(document).keyup(function (event) {
        if (event.keyCode == 27) {
            largeScreen.fullScreen.parents('.page-content').removeClass('full-Screen').css('background-color', '');
            largeScreen.fullScreen.parents('.page-content').find('h3').css('color', '')
            largeScreen.fullScreen.show();
            $('#InterfaceRequestsAll').css('color', '')
            $('#InterfaceRequestsForDay').css('color', '')
            G2.Global.setTheme();
        }
    })

    function clear(callback) {

        $('div[data-type="largeScreen"]').empty()

        callback()
    }

    //数据排序
    function compare(property) {
        return function (a, b) {
            if (a[property] < b[property]) return -1;
            if (a[property] > b[property]) return 1;
        }
    }

    //转换时间
    function getMyDate(str) {
        var oDate = new Date(str),
            oYear = oDate.getFullYear(),
            oMonth = oDate.getMonth() + 1,
            oDay = oDate.getDate(),
            oHour = oDate.getHours(),
            oMin = oDate.getMinutes(),
            oSen = oDate.getSeconds(),
            oTime = oYear + '-' + getzf(oMonth) + '-' + getzf(oDay) + ' ' + getzf(oHour) + ':' + getzf(oMin) + ':' + getzf(oSen);//最后拼接时间
        return oTime;
    };

    //转换日期加0
    function getzf(num) {
        if (parseInt(num) < 10) {
            num = '0' + num;
        }
        return num;
    }

    //数据逻辑转换
    function push(data, temp, count) {
        for (var i = 0; i < count; i++) {
            var varname = "test" + i;
            Object[varname] = {}
        }

        $.each(temp, function (i, v) {
            for (var index = 0; index < count; index++) {
                if (i % 8 == index) $.extend(Object["test" + index], v)
            }
        })

        for (var i = 0; i < count; i++) {
            data.push(Object["test" + i])
        }
    }

    begin()

    $.getJSON('/ds/largeScreen.json', function (res) {

        var mapData = res.mapData;
        var pointData = res.pointData;

        var chart = new G2.Chart({
            container: 'map',
            forceFit: true,
            height: 450,
            padding: [0, 20, 40]
        });
        // force sync scales
        chart.scale({
            x: {sync: true, nice: false},
            y: {sync: true, nice: false}
        });
        chart.coord().reflect();
        chart.legend(false);
        chart.axis(false);

        // style the tooltip
        chart.tooltip({
            showTitle: false,
            containerTpl: '<div class="g2-tooltip">'
            + '<table class="g2-tooltip-list"></table></div>',
            itemTpl: '<tr data-index={index}><td style="padding: 5px; background-color:#545454">{name}</td><td style="padding: 5px; background-color:#fff;color: #000">{value}</td></tr>',
            'g2-tooltip': {
                borderRadius: '2px',
                backgroundColor: '#DDDDDD',
                padding: 0,
                border: '1px solid #333'
            }
        });

        // data set
        var ds = new DataSet();

        // draw the map
        var dv = ds.createView('back')
            .source(mapData, {
                type: 'GeoJSON'
            })
            .transform({
                type: 'geo.projection',
                projection: 'geoMercator',
                as: ['x', 'y', 'centroidX', 'centroidY']
            });
        var bgView = chart.view();
        bgView.source(dv);
        bgView.tooltip(false);
        bgView.polygon()
            .position('x*y')
            .style({
                fill: '#000088',//地图颜色
                stroke: '#b1b1b1',//界线颜色
                lineWidth: 0.5,//线粗细
                fillOpacity: 0.85
            });

        // draw the bubble plot
        var userData = ds.createView().source(pointData);
        userData.transform({
            type: 'map',
            callback: function (obj) {
                var projectedCoord = dv.geoProjectPosition([obj.lng * 1, obj.lat * 1], 'geoMercator');
                obj.x = projectedCoord[0];
                obj.y = projectedCoord[1];
                return obj;
            }
        })
        ;
        var pointView = chart.view();
        pointView.source(userData);
        pointView.point()
            .position('x*y')
            .size('name', [30, 25, 25, 20, 20])//圆的大小
            .label('name', {
                offset: 0,
                textStyle: {
                    textAlign: 'center', // 文本对齐方向，可取值为： start middle end
                    fill: '#fff', // 文本的颜色
                    fontSize: '12', // 文本大小
                    fontWeight: 'bold', // 文本粗细
                }
            })
            .shape('circle')
            .opacity(0.45)
            .color('#33FFFF')
            .tooltip('name*value*lng*lat');

        chart.animate(false)

        var lineData = [{"name": "沈阳", "lng": 123.38, "lat": 41.8}, {"name": "合肥", "lng": 117.27, "lat": 31.86}]
        var lineData1 = [{"name": "沈阳", "lng": 123.38, "lat": 41.8}, {"name": "武汉", "lng": 114.31, "lat": 30.52}]
        var lineData2 = [{"name": "沈阳", "lng": 123.38, "lat": 41.8}, {"name": "天津", "lng": 117.2, "lat": 39.13}]
        var lineData3 = [{"name": "沈阳", "lng": 123.38, "lat": 41.8}, {"name": "重庆", "lng": 106.54, "lat": 29.59}]

        var _linedata = ds.createView().source(lineData);
        _linedata.transform({
            type: 'map',
            callback: function (obj) {
                var projectedCoord = dv.geoProjectPosition([obj.lng * 1, obj.lat * 1], 'geoMercator');
                obj.x = projectedCoord[0];
                obj.y = projectedCoord[1];
                return obj;
            }
        })

        var _linedata1 = ds.createView().source(lineData1);
        _linedata1.transform({
            type: 'map',
            callback: function (obj) {
                var projectedCoord = dv.geoProjectPosition([obj.lng * 1, obj.lat * 1], 'geoMercator');
                obj.x = projectedCoord[0];
                obj.y = projectedCoord[1];
                return obj;
            }
        })

        var _linedata2 = ds.createView().source(lineData2);
        _linedata2.transform({
            type: 'map',
            callback: function (obj) {
                var projectedCoord = dv.geoProjectPosition([obj.lng * 1, obj.lat * 1], 'geoMercator');
                obj.x = projectedCoord[0];
                obj.y = projectedCoord[1];
                return obj;
            }
        })
        var _linedata3 = ds.createView().source(lineData3);
        _linedata3.transform({
            type: 'map',
            callback: function (obj) {
                var projectedCoord = dv.geoProjectPosition([obj.lng * 1, obj.lat * 1], 'geoMercator');
                obj.x = projectedCoord[0];
                obj.y = projectedCoord[1];
                return obj;
            }
        })

        var lineview = chart.view().source(_linedata); // 飞行路线
        var lineview1 = chart.view().source(_linedata1); // 飞行路线
        var lineview2 = chart.view().source(_linedata2); // 飞行路线
        var lineview3 = chart.view().source(_linedata3); // 飞行路线
        var link = lineview.path().position('x*y').color('x*y');
        var link1 = lineview1.path().position('x*y').color('x*y');
        var link2 = lineview2.path().position('x*y').color('x*y');
        var link3 = lineview3.path().position('x*y').color('x*y');

        chart.render();

        var number = 0
        Interval(lineview, lineview1, lineview2, lineview3, link, link1, link2, link3, number);


    });

    function Interval(lineview, lineview1, lineview2, lineview3, link, link1, link2, link3, number) {
        setInterval(function () {


            if (number % 11 == 0) {
                link.style({
                    stroke: 'l(180) 0:#000000 0.1:#ffffff 0.2:#ffffff 0.3:#ffffff 0.4:#ffffff 0.5:#ffffff 0.6:#ffffff 0.7:#ffffff 0.8:#ffffff 0.9:#ffffff 1:#ffffff'
                });
                link1.style({
                    stroke: 'l(180) 0:#000000 0.1:#ffffff 0.2:#ffffff 0.3:#ffffff 0.4:#ffffff 0.5:#ffffff 0.6:#ffffff 0.7:#ffffff 0.8:#ffffff 0.9:#ffffff 1:#ffffff'
                });
                link2.style({
                    stroke: 'l(180) 0:#000000 0.1:#ffffff 0.2:#ffffff 0.3:#ffffff 0.4:#ffffff 0.5:#ffffff 0.6:#ffffff 0.7:#ffffff 0.8:#ffffff 0.9:#ffffff 1:#ffffff'
                });
                link3.style({
                    stroke: 'l(180) 0:#000000 0.1:#ffffff 0.2:#ffffff 0.3:#ffffff 0.4:#ffffff 0.5:#ffffff 0.6:#ffffff 0.7:#ffffff 0.8:#ffffff 0.9:#ffffff 1:#ffffff'
                });
            }
            if (number % 11 == 1) {
                link.style({
                    stroke: 'l(180) 0:#ffffff 0.1:#000000 0.2:#ffffff 0.3:#ffffff 0.4:#ffffff 0.5:#ffffff 0.6:#ffffff 0.7:#ffffff 0.8:#ffffff 0.9:#ffffff 1:#ffffff'
                });
                link1.style({
                    stroke: 'l(180) 0:#ffffff 0.1:#000000 0.2:#ffffff 0.3:#ffffff 0.4:#ffffff 0.5:#ffffff 0.6:#ffffff 0.7:#ffffff 0.8:#ffffff 0.9:#ffffff 1:#ffffff'
                });
                link2.style({
                    stroke: 'l(180) 0:#ffffff 0.1:#000000 0.2:#ffffff 0.3:#ffffff 0.4:#ffffff 0.5:#ffffff 0.6:#ffffff 0.7:#ffffff 0.8:#ffffff 0.9:#ffffff 1:#ffffff'
                });
                link3.style({
                    stroke: 'l(180) 0:#ffffff 0.1:#000000 0.2:#ffffff 0.3:#ffffff 0.4:#ffffff 0.5:#ffffff 0.6:#ffffff 0.7:#ffffff 0.8:#ffffff 0.9:#ffffff 1:#ffffff'
                });
            }
            if (number % 11 == 2) {
                link.style({
                    stroke: 'l(180) 0:#ffffff 0.1:#ffffff 0.2:#000000 0.3:#ffffff 0.4:#ffffff 0.5:#ffffff 0.6:#ffffff 0.7:#ffffff 0.8:#ffffff 0.9:#ffffff 1:#ffffff'
                });
                link1.style({
                    stroke: 'l(180) 0:#ffffff 0.1:#ffffff 0.2:#000000 0.3:#ffffff 0.4:#ffffff 0.5:#ffffff 0.6:#ffffff 0.7:#ffffff 0.8:#ffffff 0.9:#ffffff 1:#ffffff'
                });
                link2.style({
                    stroke: 'l(180) 0:#ffffff 0.1:#ffffff 0.2:#000000 0.3:#ffffff 0.4:#ffffff 0.5:#ffffff 0.6:#ffffff 0.7:#ffffff 0.8:#ffffff 0.9:#ffffff 1:#ffffff'
                });
                link3.style({
                    stroke: 'l(180) 0:#ffffff 0.1:#ffffff 0.2:#000000 0.3:#ffffff 0.4:#ffffff 0.5:#ffffff 0.6:#ffffff 0.7:#ffffff 0.8:#ffffff 0.9:#ffffff 1:#ffffff'
                });
            }
            if (number % 11 == 3) {
                link.style({
                    stroke: 'l(180) 0:#ffffff 0.1:#ffffff 0.2:#ffffff 0.3:#000000 0.4:#ffffff 0.5:#ffffff 0.6:#ffffff 0.7:#ffffff 0.8:#ffffff 0.9:#ffffff 1:#ffffff'
                });
                link1.style({
                    stroke: 'l(180) 0:#ffffff 0.1:#ffffff 0.2:#ffffff 0.3:#000000 0.4:#ffffff 0.5:#ffffff 0.6:#ffffff 0.7:#ffffff 0.8:#ffffff 0.9:#ffffff 1:#ffffff'
                });
                link2.style({
                    stroke: 'l(180) 0:#ffffff 0.1:#ffffff 0.2:#ffffff 0.3:#000000 0.4:#ffffff 0.5:#ffffff 0.6:#ffffff 0.7:#ffffff 0.8:#ffffff 0.9:#ffffff 1:#ffffff'
                });
                link3.style({
                    stroke: 'l(180) 0:#ffffff 0.1:#ffffff 0.2:#ffffff 0.3:#000000 0.4:#ffffff 0.5:#ffffff 0.6:#ffffff 0.7:#ffffff 0.8:#ffffff 0.9:#ffffff 1:#ffffff'
                });
            }
            if (number % 11 == 4) {
                link.style({
                    stroke: 'l(180) 0:#ffffff 0.1:#ffffff 0.2:#ffffff 0.3:#ffffff 0.4:#000000 0.5:#ffffff 0.6:#ffffff 0.7:#ffffff 0.8:#ffffff 0.9:#ffffff 1:#ffffff'
                });
                link1.style({
                    stroke: 'l(180) 0:#ffffff 0.1:#ffffff 0.2:#ffffff 0.3:#ffffff 0.4:#000000 0.5:#ffffff 0.6:#ffffff 0.7:#ffffff 0.8:#ffffff 0.9:#ffffff 1:#ffffff'
                });
                link2.style({
                    stroke: 'l(180) 0:#ffffff 0.1:#ffffff 0.2:#ffffff 0.3:#ffffff 0.4:#000000 0.5:#ffffff 0.6:#ffffff 0.7:#ffffff 0.8:#ffffff 0.9:#ffffff 1:#ffffff'
                });
                link3.style({
                    stroke: 'l(180) 0:#ffffff 0.1:#ffffff 0.2:#ffffff 0.3:#ffffff 0.4:#000000 0.5:#ffffff 0.6:#ffffff 0.7:#ffffff 0.8:#ffffff 0.9:#ffffff 1:#ffffff'
                });
            }
            if (number % 11 == 5) {
                link.style({
                    stroke: 'l(180) 0:#ffffff 0.1:#ffffff 0.2:#ffffff 0.3:#ffffff 0.4:#ffffff 0.5:#000000 0.6:#ffffff 0.7:#ffffff 0.8:#ffffff 0.9:#ffffff 1:#ffffff'
                });
                link1.style({
                    stroke: 'l(180) 0:#ffffff 0.1:#ffffff 0.2:#ffffff 0.3:#ffffff 0.4:#ffffff 0.5:#000000 0.6:#ffffff 0.7:#ffffff 0.8:#ffffff 0.9:#ffffff 1:#ffffff'
                });
                link2.style({
                    stroke: 'l(180) 0:#ffffff 0.1:#ffffff 0.2:#ffffff 0.3:#ffffff 0.4:#ffffff 0.5:#000000 0.6:#ffffff 0.7:#ffffff 0.8:#ffffff 0.9:#ffffff 1:#ffffff'
                });
                link3.style({
                    stroke: 'l(180) 0:#ffffff 0.1:#ffffff 0.2:#ffffff 0.3:#ffffff 0.4:#ffffff 0.5:#000000 0.6:#ffffff 0.7:#ffffff 0.8:#ffffff 0.9:#ffffff 1:#ffffff'
                });
            }
            if (number % 11 == 6) {
                link.style({
                    stroke: 'l(180) 0:#ffffff 0.1:#ffffff 0.2:#ffffff 0.3:#ffffff 0.4:#ffffff 0.5:#ffffff 0.6:#000000 0.7:#ffffff 0.8:#ffffff 0.9:#ffffff 1:#ffffff'
                });
                link1.style({
                    stroke: 'l(180) 0:#ffffff 0.1:#ffffff 0.2:#ffffff 0.3:#ffffff 0.4:#ffffff 0.5:#ffffff 0.6:#000000 0.7:#ffffff 0.8:#ffffff 0.9:#ffffff 1:#ffffff'
                });
                link2.style({
                    stroke: 'l(180) 0:#ffffff 0.1:#ffffff 0.2:#ffffff 0.3:#ffffff 0.4:#ffffff 0.5:#ffffff 0.6:#000000 0.7:#ffffff 0.8:#ffffff 0.9:#ffffff 1:#ffffff'
                });
                link3.style({
                    stroke: 'l(180) 0:#ffffff 0.1:#ffffff 0.2:#ffffff 0.3:#ffffff 0.4:#ffffff 0.5:#ffffff 0.6:#000000 0.7:#ffffff 0.8:#ffffff 0.9:#ffffff 1:#ffffff'
                });
            }
            if (number % 11 == 7) {
                link.style({
                    stroke: 'l(180) 0:#ffffff 0.1:#ffffff 0.2:#ffffff 0.3:#ffffff 0.4:#ffffff 0.5:#ffffff 0.6:#ffffff 0.7:#000000 0.8:#ffffff 0.9:#ffffff 1:#ffffff'
                });
                link1.style({
                    stroke: 'l(180) 0:#ffffff 0.1:#ffffff 0.2:#ffffff 0.3:#ffffff 0.4:#ffffff 0.5:#ffffff 0.6:#ffffff 0.7:#000000 0.8:#ffffff 0.9:#ffffff 1:#ffffff'
                });
                link2.style({
                    stroke: 'l(180) 0:#ffffff 0.1:#ffffff 0.2:#ffffff 0.3:#ffffff 0.4:#ffffff 0.5:#ffffff 0.6:#ffffff 0.7:#000000 0.8:#ffffff 0.9:#ffffff 1:#ffffff'
                });
                link3.style({
                    stroke: 'l(180) 0:#ffffff 0.1:#ffffff 0.2:#ffffff 0.3:#ffffff 0.4:#ffffff 0.5:#ffffff 0.6:#ffffff 0.7:#000000 0.8:#ffffff 0.9:#ffffff 1:#ffffff'
                });
            }
            if (number % 11 == 8) {
                link.style({
                    stroke: 'l(180) 0:#ffffff 0.1:#ffffff 0.2:#ffffff 0.3:#ffffff 0.4:#ffffff 0.5:#ffffff 0.6:#ffffff 0.7:#ffffff 0.8:#000000 0.9:#ffffff 1:#ffffff'
                });
                link1.style({
                    stroke: 'l(180) 0:#ffffff 0.1:#ffffff 0.2:#ffffff 0.3:#ffffff 0.4:#ffffff 0.5:#ffffff 0.6:#ffffff 0.7:#ffffff 0.8:#000000 0.9:#ffffff 1:#ffffff'
                });
                link2.style({
                    stroke: 'l(180) 0:#ffffff 0.1:#ffffff 0.2:#ffffff 0.3:#ffffff 0.4:#ffffff 0.5:#ffffff 0.6:#ffffff 0.7:#ffffff 0.8:#000000 0.9:#ffffff 1:#ffffff'
                });
                link3.style({
                    stroke: 'l(180) 0:#ffffff 0.1:#ffffff 0.2:#ffffff 0.3:#ffffff 0.4:#ffffff 0.5:#ffffff 0.6:#ffffff 0.7:#ffffff 0.8:#000000 0.9:#ffffff 1:#ffffff'
                });
            }
            if (number % 11 == 9) {
                link.style({
                    stroke: 'l(180) 0:#ffffff 0.1:#ffffff 0.2:#ffffff 0.3:#ffffff 0.4:#ffffff 0.5:#ffffff 0.6:#ffffff 0.7:#ffffff 0.8:#ffffff 0.9:#000000 1:#ffffff'
                });
                link1.style({
                    stroke: 'l(180) 0:#ffffff 0.1:#ffffff 0.2:#ffffff 0.3:#ffffff 0.4:#ffffff 0.5:#ffffff 0.6:#ffffff 0.7:#ffffff 0.8:#ffffff 0.9:#000000 1:#ffffff'
                });
                link2.style({
                    stroke: 'l(180) 0:#ffffff 0.1:#ffffff 0.2:#ffffff 0.3:#ffffff 0.4:#ffffff 0.5:#ffffff 0.6:#ffffff 0.7:#ffffff 0.8:#ffffff 0.9:#000000 1:#ffffff'
                });
                link3.style({
                    stroke: 'l(180) 0:#ffffff 0.1:#ffffff 0.2:#ffffff 0.3:#ffffff 0.4:#ffffff 0.5:#ffffff 0.6:#ffffff 0.7:#ffffff 0.8:#ffffff 0.9:#000000 1:#ffffff'
                });
            }
            if (number % 11 == 10) {
                link.style({
                    stroke: 'l(180) 0:#ffffff 0.1:#ffffff 0.2:#ffffff 0.3:#ffffff 0.4:#ffffff 0.5:#ffffff 0.6:#ffffff 0.7:#ffffff 0.8:#ffffff 0.9:#ffffff 1:#000000'
                });
                link1.style({
                    stroke: 'l(180) 0:#ffffff 0.1:#ffffff 0.2:#ffffff 0.3:#ffffff 0.4:#ffffff 0.5:#ffffff 0.6:#ffffff 0.7:#ffffff 0.8:#ffffff 0.9:#ffffff 1:#000000'
                });
                link2.style({
                    stroke: 'l(180) 0:#ffffff 0.1:#ffffff 0.2:#ffffff 0.3:#ffffff 0.4:#ffffff 0.5:#ffffff 0.6:#ffffff 0.7:#ffffff 0.8:#ffffff 0.9:#ffffff 1:#000000'
                });
                link3.style({
                    stroke: 'l(180) 0:#ffffff 0.1:#ffffff 0.2:#ffffff 0.3:#ffffff 0.4:#ffffff 0.5:#ffffff 0.6:#ffffff 0.7:#ffffff 0.8:#ffffff 0.9:#ffffff 1:#000000'
                });
            }

            lineview.repaint();
            lineview1.repaint();
            lineview2.repaint();
            lineview3.repaint();
            number += 1
        }, 150)
    }

    //5分钟重新绘制大屏
    setInterval(function () {
        clear(function () {
            begin()
        })
    }, 300000)

})
