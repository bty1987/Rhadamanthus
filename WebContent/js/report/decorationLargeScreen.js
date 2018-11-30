$(function () {
    var today = new Date()
    today.setHours(0)
    today.setMinutes(0)
    today.setSeconds(0)

    var largeScreen = {
        CompanyDaysLevelScaleRuleTrend: com.focusPage('#CompanyDaysLevelScaleRuleTrend'),
        CompanyDaysToSignASingleNumberOfTrends: com.focusPage('#CompanyDaysToSignASingleNumberOfTrends'),
        TheTotalNumberOfRuler: com.focusPage('#TheTotalNumberOfRuler'),
        TheTotalNumberOfSignings: com.focusPage('#TheTotalNumberOfSignings'),
        TheTotalNumberOfCompanySignings: com.focusPage('#TheTotalNumberOfCompanySignings'),
        TheTotalNumberOfCompanyScale: com.focusPage('#TheTotalNumberOfCompanyScale'),
        DesignerSignNumberTOP10: com.focusPage('#DesignerSignNumberTOP10'),
        SalesmanSignedNumberTOP10: com.focusPage('#SalesmanSignedNumberTOP10'),
        PropertySignedOrdersTOP10: com.focusPage('#PropertySignedOrdersTOP10'),
        fullScreen: com.focusPage('#fullScreen'),
        elasticUrl: {
            create: 'http://192.168.5.22:9200/decoration-create-*/_search',
            contract: 'http://192.168.5.22:9200/decoration-contract-*/_search',
        }
    }

    //开始绘制大屏
    function begin() {

        /*F-3-公司天级量尺数走势*/
        var CompanyDaysLevelScaleRuleTrend = {
            "size": 0,
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
                            "range": {
                                "createTime": {
                                    "gte": Date.parse(new Date(2017, 01, 01)),
                                    "lte": Date.parse(new Date()),
                                    "format": "epoch_millis"
                                }
                            }
                        }
                    ],
                    "must_not": []
                }
            },
            "_source": {
                "excludes": []
            },
            "aggs": {
                "2": {
                    "date_histogram": {
                        "field": "createTime",
                        "interval": "1d",
                        "time_zone": "Asia/Shanghai",
                        "min_doc_count": 1
                    },
                    "aggs": {
                        "3": {
                            "terms": {
                                "field": "company.keyword",
                                "size": 5,
                                "order": {
                                    "1": "desc"
                                }
                            },
                            "aggs": {
                                "1": {
                                    "sum": {
                                        "field": "designerRate"
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        /*F-4-公司天级签单数走势*/
        var CompanyDaysToSignASingleNumberOfTrends = {
            "size": 0,
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
                            "range": {
                                "contractTime": {
                                    "gte": Date.parse(new Date(2017, 01, 01)),
                                    "lte": Date.parse(new Date()),
                                    "format": "epoch_millis"
                                }
                            }
                        }
                    ],
                    "must_not": []
                }
            },
            "_source": {
                "excludes": []
            },
            "aggs": {
                "2": {
                    "date_histogram": {
                        "field": "contractTime",
                        "interval": "1d",
                        "time_zone": "Asia/Shanghai",
                        "min_doc_count": 1
                    },
                    "aggs": {
                        "3": {
                            "terms": {
                                "field": "company.keyword",
                                "size": 10,
                                "order": {
                                    "1": "desc"
                                }
                            },
                            "aggs": {
                                "1": {
                                    "sum": {
                                        "field": "designerRate"
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        /*F-1-量尺总数*/
        var TheTotalNumberOfRuler = {
            "size": 0,
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
                            "range": {
                                "createTime": {
                                    "gte": Date.parse(new Date(2017, 01, 01)),
                                    "lte": Date.parse(new Date()),
                                    "format": "epoch_millis"
                                }
                            }
                        }
                    ],
                    "must_not": []
                }
            },
            "_source": {
                "excludes": []
            },
            "aggs": {
                "1": {
                    "sum": {
                        "field": "designerRate"
                    }
                }
            }
        }
        /*F-2-签单总数*/
        var TheTotalNumberOfSignings = {
            "size": 0,
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
                            "range": {
                                "contractTime": {
                                    "gte": Date.parse(new Date(2017, 01, 01)),
                                    "lte": Date.parse(new Date()),
                                    "format": "epoch_millis"
                                }
                            }
                        }
                    ],
                    "must_not": []
                }
            },
            "_source": {
                "excludes": []
            },
            "aggs": {
                "1": {
                    "sum": {
                        "field": "designerRate"
                    }
                }
            }
        }
        /*F-5-公司量尺总数*/
        var TheTotalNumberOfCompanyScale = {
            "size": 0,
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
                            "match_phrase": {
                                "company.keyword": {
                                    "query": params.company.name
                                }
                            }
                        },
                        {
                            "range": {
                                "createTime": {
                                    "gte": Date.parse(new Date(2017, 01, 01)),
                                    "lte": Date.parse(new Date()),
                                    "format": "epoch_millis"
                                }
                            }
                        }
                    ],
                    "must_not": []
                }
            },
            "_source": {
                "excludes": []
            },
            "aggs": {
                "2": {
                    "terms": {
                        "field": "company.keyword",
                        "size": 5,
                        "order": {
                            "1": "desc"
                        }
                    },
                    "aggs": {
                        "1": {
                            "sum": {
                                "field": "designerRate"
                            }
                        }
                    }
                }
            }
        }
        /*F-6-公司签单总数*/
        var TheTotalNumberOfCompanySignings = {
            "size": 0,
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
                            "match_phrase": {
                                "company.keyword": {
                                    "query": params.company.name
                                }
                            }
                        },
                        {
                            "range": {
                                "contractTime": {
                                    "gte": Date.parse(new Date(2017, 01, 01)),
                                    "lte": Date.parse(new Date()),
                                    "format": "epoch_millis"
                                }
                            }
                        }
                    ],
                    "must_not": []
                }
            },
            "_source": {
                "excludes": []
            },
            "aggs": {
                "2": {
                    "terms": {
                        "field": "company.keyword",
                        "size": 5,
                        "order": {
                            "1": "desc"
                        }
                    },
                    "aggs": {
                        "1": {
                            "sum": {
                                "field": "designerRate"
                            }
                        }
                    }
                }
            }
        }
        /*F-7-设计师签单数TOP10*/
        var DesignerSignNumberTOP10 = {
            "size": 0,
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
                            "range": {
                                "contractTime": {
                                    "gte": Date.parse(new Date(2017, 01, 01)),
                                    "lte": Date.parse(new Date()),
                                    "format": "epoch_millis"
                                }
                            }
                        }
                    ],
                    "must_not": []
                }
            },
            "_source": {
                "excludes": []
            },
            "aggs": {
                "2": {
                    "terms": {
                        "field": "designerName.keyword",
                        "size": 10,
                        "order": {
                            "1": "desc"
                        }
                    },
                    "aggs": {
                        "1": {
                            "sum": {
                                "field": "designerRate"
                            }
                        }
                    }
                }
            }
        }
        /*F-8-业务员签单数TOP10*/
        var SalesmanSignedNumberTOP10 = {
            "size": 0,
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
                            "range": {
                                "contractTime": {
                                    "gte": Date.parse(new Date(2017, 01, 01)),
                                    "lte": Date.parse(new Date()),
                                    "format": "epoch_millis"
                                }
                            }
                        }
                    ],
                    "must_not": []
                }
            },
            "_source": {
                "excludes": []
            },
            "aggs": {
                "2": {
                    "terms": {
                        "field": "salesmanName.keyword",
                        "size": 10,
                        "order": {
                            "1": "desc"
                        }
                    },
                    "aggs": {
                        "1": {
                            "sum": {
                                "field": "designerRate"
                            }
                        }
                    }
                }
            }
        }
        /*F-9-楼盘签单额TOP10*/
        var PropertySignedOrdersTOP10 = {
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
                                "contractTime": {
                                    "gte": Date.parse(new Date(2017, 01, 01)),
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
                    "terms": {
                        "field": "villageName.keyword",
                        "size": 10,
                        "order": {
                            "1": "desc"
                        }
                    },
                    "aggs": {
                        "1": {
                            "sum": {
                                "field": "orderTotalPrice"
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

        ajax(largeScreen.elasticUrl.create, CompanyDaysLevelScaleRuleTrend, function (res) {
            var data = [];
            var time = [];
            $.each(res.aggregations['2'].buckets, function (i, v) {
                var _data = {};
                _data['times'] = getMyDate(v.key);
                $.each(v['3'].buckets, function (index, value) {
                    time.push(value.key)
                    _data[value.key] = value.doc_count
                })
                data.push(_data)
            })
            $.unique(time)
            var ds = new DataSet();
            var dv = ds.createView().source(data);
            dv.transform({
                type: 'fold',
                fields: time, // 展开字段集
                key: 'company', // key字段
                value: 'create', // value字段
            });
            var chart = new G2.Chart({
                container: 'CompanyDaysLevelScaleRuleTrend',
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
            chart.axis('create', {
                label: {
                    formatter: function (val) {
                        return val;
                    }
                }
            });
            chart.line().position('times*create').color('company');
            chart.point().position('times*create').color('company').size(2).shape('circle').style({
                stroke: '#fff',
                lineWidth: 0.5
            });
            chart.render();
        }, function (msg) {
            console.log(msg)
            flag = true;
        })

        ajax(largeScreen.elasticUrl.contract, CompanyDaysToSignASingleNumberOfTrends, function (res) {
            var data = [];
            var time = [];
            $.each(res.aggregations['2'].buckets, function (i, v) {
                var _data = {};
                _data['times'] = getMyDate(v.key);
                $.each(v['3'].buckets, function (index, value) {
                    time.push(value.key)
                    _data[value.key] = value.doc_count
                })
                data.push(_data);
            })
            $.unique(time)
            var ds = new DataSet();
            var dv = ds.createView().source(data);
            dv.transform({
                type: 'fold',
                fields: time, // 展开字段集
                key: 'company', // key字段
                value: 'contract', // value字段
            });
            var chart = new G2.Chart({
                container: 'CompanyDaysToSignASingleNumberOfTrends',
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
            chart.axis('contract', {
                label: {
                    formatter: function (val) {
                        return val;
                    }
                }
            });
            chart.line().position('times*contract').color('company');
            chart.point().position('times*contract').color('company').size(2).shape('circle').style({
                stroke: '#fff',
                lineWidth: 0.5
            });
            chart.render();

        }, function (msg) {
            console.log(msg)
            flag = true;
        })

        ajax(largeScreen.elasticUrl.create, TheTotalNumberOfRuler, function (res) {
            com.focusPage('#TheTotalNumberOfRuler').css({
                "text-align": "center",
                "width": "auto",
                "height": "220px",
                "line-height": "220px",
                "font-size": "40px",
                "font-weight": "bold"
            }).html(res.aggregations['1'].value)
        }, function (msg) {
            console.log(msg)
            flag = true;
        })

        ajax(largeScreen.elasticUrl.contract, TheTotalNumberOfSignings, function (res) {
            com.focusPage('#TheTotalNumberOfSignings').css({
                "text-align": "center",
                "width": "auto",
                "height": "220px",
                "line-height": "180px",
                "font-size": "40px",
                "font-weight": "bold"
            }).html(res.aggregations['1'].value.toFixed(2))
        }, function (msg) {
            console.log(msg)
            flag = true;
        })

        ajax(largeScreen.elasticUrl.create, TheTotalNumberOfCompanyScale, function (res) {
            console.log(res)
            var data = [];
            $.each(res.aggregations['2'].buckets, function (i, v) {
                data.push({company: v.key, create: v['1'].value});
            });

            var ds = new DataSet();
            var dv = ds.createView().source(data);
            dv.transform({
                type: 'percent',
                field: 'create',
                dimension: 'company',
                as: 'percent'
            });
            var chart = new G2.Chart({
                container: 'TheTotalNumberOfCompanyScale',
                forceFit: true,
                height: 220
            });
            chart.source(dv, {
                percent: {
                    formatter: function (val) {
                        val = parseFloat(val * 100).toFixed(2) + '%';
                        return val;
                    }
                }
            });
            chart.coord('theta');
            chart.tooltip({
                showTitle: false,
                itemTpl: '<li><span style="background-color:{color};" class="g2-tooltip-marker"></span>{name}: {value}</li>'
            });
            chart.intervalStack()
                .position('percent')
                .color('company')
                .tooltip('company*create*percent', function (company, create, percent) {
                    return {
                        name: company,
                        value: create + '[' + parseFloat(percent * 100).toFixed(2) + '%]'
                    };
                })
                .style({
                    lineWidth: 1,
                    stroke: '#fff'
                });
            chart.render();
        }, function (msg) {
            console.log(msg)
            flag = true;
        })

        ajax(largeScreen.elasticUrl.contract, TheTotalNumberOfCompanySignings, function (res) {
            var data = [];
            $.each(res.aggregations['2'].buckets, function (i, v) {
                data.push({company: v.key, create: v['1'].value});
            });

            var ds = new DataSet();
            var dv = ds.createView().source(data);
            dv.transform({
                type: 'percent',
                field: 'create',
                dimension: 'company',
                as: 'percent'
            });
            var chart = new G2.Chart({
                container: 'TheTotalNumberOfCompanySignings',
                forceFit: true,
                height: 220
            });
            chart.source(dv, {
                percent: {
                    formatter: function (val) {
                        val = parseFloat(val * 100).toFixed(2) + '%';
                        return val;
                    }
                }
            });
            chart.coord('theta');
            chart.tooltip({
                showTitle: false,
                itemTpl: '<li><span style="background-color:{color};" class="g2-tooltip-marker"></span>{name}: {value}</li>'
            });
            chart.intervalStack()
                .position('percent')
                .color('company')
                .tooltip('company*create*percent', function (company, create, percent) {
                    return {
                        name: company,
                        value: create + '[' + parseFloat(percent * 100).toFixed(2) + '%]'
                    };
                })
                .style({
                    lineWidth: 1,
                    stroke: '#fff'
                });
            chart.render();
        }, function (msg) {
            console.log(msg)
            flag = true;
        })

        ajax(largeScreen.elasticUrl.contract, DesignerSignNumberTOP10, function (res) {
            console.log(res)
            var data = []
            $.each(res.aggregations['2'].buckets, function (i, v) {
                data.push({designer: v.key, contract: v['1'].value});
            })
            var ds = new DataSet();
            var dv = ds.createView().source(data);
            dv.source(data)
                .transform({
                    type: 'sort',
                    callback: function (a, b) { // 排序依据，和原生js的排序callback一致
                        return a.contract - b.contract;
                    }
                });
            var chart = new G2.Chart({
                container: 'DesignerSignNumberTOP10',
                forceFit: true,
                height: 460,
                padding: [20, 0, 20, 50]
            });
            chart.source(dv);
            chart.axis('designer', {
                label: {
                    offset: 12
                }
            });
            chart.coord().transpose();
            chart.interval().position('designer*contract');
            chart.render();
        }, function (msg) {
            console.log(msg)
            flag = true;
        })

        ajax(largeScreen.elasticUrl.contract, SalesmanSignedNumberTOP10, function (res) {
            console.log(res)
            var data = []
            $.each(res.aggregations['2'].buckets, function (i, v) {
                data.push({salesman: v.key, contract: v['1'].value});
            })
            var ds = new DataSet();
            var dv = ds.createView().source(data);
            dv.source(data)
                .transform({
                    type: 'sort',
                    callback: function (a, b) { // 排序依据，和原生js的排序callback一致
                        return a.contract - b.contract;
                    }
                });
            var chart = new G2.Chart({
                container: 'SalesmanSignedNumberTOP10',
                forceFit: true,
                height: 460,
                padding: [20, 0, 20, 50]
            });
            chart.source(dv);
            chart.axis('salesman', {
                label: {
                    offset: 12
                }
            });
            chart.coord().transpose();
            chart.interval().position('salesman*contract');
            chart.render();
        }, function (msg) {
            console.log(msg)
            flag = true;
        })

        /*ajax(largeScreen.elasticUrl.contract, PropertySignedOrdersTOP10, function (res) {
            var data = []
            $.each(res.aggregations['2'].buckets, function (i, v) {
                data.push({property: v.key, contract: v['1'].value});
            })
            var ds = new DataSet();
            var dv = ds.createView().source(data);
            dv.source(data)
                .transform({
                    type: 'sort',
                    callback: function (a, b) { // 排序依据，和原生js的排序callback一致
                        return a.contract - b.contract;
                    }
                });
            var chart = new G2.Chart({
                container: 'PropertySignedOrdersTOP10',
                forceFit: true,
                height: 460,
                padding: [20, 0, 20, 120]
            });
            chart.source(dv);
            chart.axis('property', {
                label: {
                    offset: 12
                }
            });
            chart.coord().transpose();
            chart.interval().position('property*contract');
            chart.render();
        }, function (msg) {
            console.log(msg)
            flag = true;
        })*/

        if (com.focusPage('.page-content').hasClass('full-Screen')) {
            G2.Global.setTheme('dark');
        }

        if (flag) {
            clear(function () {
                begin();
            });
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
                callback(res);

            }, error: function (msg) {
                failcallback(msg);
            }
        });
    }

    largeScreen.fullScreen.click(function () {
        largeScreen.fullScreen.parents('.page-content').addClass('full-Screen').css('background-color', '#1f1f1f');
        largeScreen.fullScreen.parents('.page-content').find('h3').css('color', '#fff');
        largeScreen.fullScreen.hide();
        $('div[data-font="dark"]').css('color', '#fff');
        G2.Global.setTheme('dark');
    })

    $(document).keyup(function (event) {
        if (event.keyCode == 27) {
            largeScreen.fullScreen.parents('.page-content').removeClass('full-Screen').css('background-color', '');
            largeScreen.fullScreen.parents('.page-content').find('h3').css('color', '');
            largeScreen.fullScreen.show();
            $('div[data-font="dark"]').css('color', '')
            G2.Global.setTheme();
        }
    })

    function clear(callback) {

        $('div[data-type="largeScreen"]').empty()

        callback()
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

    begin()

    //5分钟重新绘制大屏
    setInterval(function () {
        clear(function () {
            begin()
        })
    }, 300000)

})
