$(function () {

    var Signing = {
        emergeWidget: function (titleName, main, i, css, flag, content) {
            var $brink = $('<div id="'+main+'Div"></div>');
            var $box = $('<div class="widget-box transparent"></div>');

            if (css) $brink.addClass(css);
            else $brink.attr('class', "col-xs-12 col-sm-6");

            var $header = $('<div class="widget-header widget-header-flat"></div>');
            var $body = $('<div class="widget-body"></div>');

            var $lighter = $('<h4 class="lighter"><i class="' + i + '">   ' + titleName + '</i></h4>');
           
            var $main = $('<div class="widget-main padding-4"></div>').append();

            if (flag){
                $main.append(Signing.emergeAmount(content));
            }else{
                $main.append($('<div id="' + main + '"></div>'));
            }
            $brink.append($box.append($header.append($lighter)).append($body.append($main)));

            return $brink;
        },
        emergeAmount: function (content) {
            var $cont = $('<div></div>');
            $.each(content, function (i, v) {
                var $piece = $('<div class="amount-font" id="' + i + '"></div>').appendTo($cont);
                $('<span class="col-sm-12">本月' + v + '</span>').appendTo($piece);
                $('<b class="amount-b"></b>').appendTo($piece);
            });
            return $cont;
        },
        getNoticeDOM: function (notice) {
            var $wrap = $('<div class="alert alert-info clearfix" style="padding: 1px 12px;"></div>');
            var $title = $('<div><i class="icon-hand-right green"></i></div>');
            var $theme = $('<strong style="margin-left:7px;">' + notice.theme + ' </strong>').appendTo($title);

            var priorityText = "重要";
            var priorityStyle = "label-warning";

            $('<small class="detail" style="cursor:pointer">  [详细]</small>').on(ace.click_event, function () {
                $.gritter.add({
                    title: notice.theme,
                    text: notice.contents,
                    class_name: 'gritter-info gritter-center'
                });

                return false;
            }).appendTo($theme);

            if (notice.priority == 2) {
                priorityText = "紧急";
                priorityStyle = "label-danger";
            } else if (notice.priority == 1) {
                priorityText = "重要";
                priorityStyle = "label-warning";
            } else if (notice.priority == 0) {
                priorityText = "普通";
                priorityStyle = "label-yellow";
            }

            $('<span class="label arrowed-in pull-right" style="line-height: 17px;">' + priorityText + '</span>').addClass(priorityStyle).appendTo($title);
            var $contents = $('<div class="col-xs-12"><div style="text-overflow: ellipsis;white-space: nowrap;overflow: hidden;margin-right:50px;">'
                + notice.contents + '</div><abbr title="' + notice.contents + '"></abbr></div>');
            var $bottomInfo = $('<small><div class="pull-right"><span><i class="icon-time bigger-110"></i>&nbsp;'
                + notice.startTime + ' 至 ' + notice.endTime + '</span>&nbsp;&nbsp;<span><i class="icon-user bigger-110"></i>&nbsp;'
                + notice.creater.userName + '</span>&nbsp;&nbsp;</div></small>');
            if (notice.filePath != undefined && notice.filePath != null && notice.filePath != "") {
                $(".pull-right", $bottomInfo).append('<span><i class="icon-download-alt bigger-110"></i>&nbsp;<a href=' + config.media + notice.filePath + "?t=" + new Date().getTime() + ' onclick="window.open(this.href); return false;">下载附件</a></span>');
            }

            $wrap.append($title).append($contents).append($bottomInfo);

            return $wrap;
        },
        loadNotices: function () {
            com._post_(api.home.library, $.extend({}, {"noticeType": 1, "api": "information.notice.getNotice"}, Signing.noticeOptions), function (e) {
                console.log(e)
                if(e == "null" || e == null){
                    com.post(api.information.pageNoticeForSeenByType, {"paging.rows": 5, "paging.page": 1, "notice.type": 1}, function (data) {
                        e = JSON.stringify(data.paging.data);
                        //com._post_(api.home.library, $.extend({}, {"noticeType": 1, "api": "information.notice.setNotice", "ntoiceResult": JSON.stringify(data)}, Signing.noticeOptions));
                    }, null, false)
                }
                
                e = JSON.parse(e);
                $("#noticeList").empty();
                $.each(e, function(i, v){
                	Signing.getNoticeDOM(v).appendTo($("#noticeList"));
                });
            });
        },
        loadActivities: function () {
            com._post_(api.home.library, $.extend({}, {"noticeType": 2, "api": "information.notice.getNotice"}, Signing.noticeOptions), function (e) {

            	if(e == "null"|| e == null){
                    com.post(api.information.pageNoticeForSeenByType, {"paging.rows": 5, "paging.page": 1, "notice.type": 2}, function (data) {
                        e = JSON.stringify(data.paging.data);
                        //com._post_(api.home.library, $.extend({}, {"noticeType": 2, "api": "information.notice.setNotice", "ntoiceResult": JSON.stringify(data)}, Signing.noticeOptions));
                    }, null, false)
                }

                e = JSON.parse(e);
                $("#activityList").empty();
                $.each(e, function (i, v) {
                    Signing.getNoticeDOM(v).appendTo($("#activityList"));
                });
            });
        },
        getZF: function (num) {     //转换日期加0
            if (parseInt(num) < 10) {
                num = '0' + num;
            }
            return num;
        },
        convertDate: function (str) {   //转换时间
            var oDate = new Date(str),
                oYear = oDate.getFullYear(),
                oMonth = oDate.getMonth() + 1,
                oDay = oDate.getDate(),
                oHour = oDate.getHours(),
                oMin = oDate.getMinutes(),
                oSen = oDate.getSeconds(),
                oTime = oYear + '-' + Signing.getZF(oMonth) + '-' + Signing.getZF(oDay) + ' ' + Signing.getZF(oHour) + ':' + Signing.getZF(oMin) + ':' + Signing.getZF(oSen); //最后拼接时间
        	return oTime;
        },
        convert: function (data, temp, count) {   //数据逻辑转换
            for (var i = 0; i < count; i++) {
                var varname = "test" + i;
                Object[varname] = {}
            }
            $.each(temp, function (i, v) {
                for (var index = 0; index < count; index++) {
                    if (i % 8 == index) $.extend(Object["test" + index], v)
                }
            });
            for (var i = 0; i < count; i++) {
                data.push(Object["test" + i])
            }
        },
        toThousands: function (num) {
            return (num || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
        },
        toDecimalPlaces: function (num) {
            return (num || 0).toString().replace(/([0-9]+\.[0-9]{2})[0-9]*/g, "$1");
        },
        /**
        * 配置设计
        */
        deploy_amount_ds: function(){
            $("#customize").append(Signing.emergeWidget('数据统计', 'amount_ds', 'icon-twitter', 'col-sm-6', true, {'billingAmount': '设计师签单额', 'billingCreate': '设计师量尺数', 'billingNumber': '设计师签单数'}));

            var contractTotalAmount = {api: "decoration.index.contractTotalAmount"};
            com._post_(api.home.library, $.extend({}, contractTotalAmount, Signing.options), function (e) {
                $("#billingAmount").find("b").html(Signing.toThousands(eval("(" + e + ")").aggregations["1"].value));
            }, function (ex) {
                console.log(ex)
            });

            var createTotalNumber = {api: "decoration.index.createTotalNumber"};
            com._post_(api.home.library, $.extend({}, createTotalNumber, Signing.options), function (e) {
                $("#billingCreate").find("b").html(Signing.toThousands(eval("(" + e + ")").aggregations["1"].value));
            }, function (ex) {
                console.log(ex);
            });

            var contractTotalNumber = {api: "decoration.index.contractTotalNumber"};
            com._post_(api.home.library, $.extend({}, contractTotalNumber, Signing.options), function (e) {
                $("#billingNumber").find("b").html(Signing.toThousands(eval("(" + e + ")").aggregations["1"].value));
            }, function (ex) {
                console.log(ex);
            });
        },
        deploy_ranking_ds: function(){
            $("#customize").append(Signing.emergeWidget('设计师业绩TOP10', 'designerTotal', 'icon-signal', 'col-sm-3 amount-col'));

            var designerAmount = {api: "decoration.index.amount"};
            com._post_(api.home.library, $.extend({}, designerAmount, Signing.options), function (e) {
                var data = [];
                $.each(eval("(" + e + ")").aggregations['2'].buckets, function (i, v) {
                    data.push({"designerName": v.key, "designerAmount": Signing.toDecimalPlaces(v["1"].value)});
                });

                var $ul = $('<ul class="list-unstyled list-striped top-table amount-li"></ul>');
                $.each(data, function (i, e) {
                    if (i < 3){
                        var $li = $('<li><i class="icon-trophy orange"></i>' + e['designerName'] + '<div>' + e['designerAmount'] + '</div></li>');
                    }else{
                        var $li = $('<li><span style="width: 35.5px;"></span>' + e['designerName'] + '<div>' + e['designerAmount'] + '</div></li>');
                    }
                    $li.appendTo($ul);
                });
                $("#designerTotal").append($ul);

            }, function (ex) {
                console.log(ex);
            });
        },
        deploy_ranking_dept_ds: function(){
            $("#customize").append(Signing.emergeWidget('设计师部门业绩TOP10', 'designerDept', 'icon-signal', 'col-sm-3 amount-col'));

            var designerDeptAmount = {api: "decoration.index.deptAmount"};
            com._post_(api.home.library, $.extend({}, designerDeptAmount, Signing.options), function (e) {
                var data = [];
                $.each(eval("(" + e + ")").aggregations['2'].buckets, function (i, v) {
                    data.push({"deptName": v.key, "deptAmount": Signing.toDecimalPlaces(v["1"].value)});
                });

                var $ul = $('<ul class="list-unstyled list-striped top-table amount-li"></ul>');
                $.each(data, function (i, e) {
                    if (i < 3) {
                        var $li = $('<li><i class="icon-trophy orange"></i>' + e['deptName'] + '<div>' + e['deptAmount'] + '</div></li>');
                    }else{
                        var $li = $('<li><span style="width: 35.5px;"></span>' + e['deptName'] + '<div>' + e['deptAmount'] + '</div></li>');
                    }
                    $li.appendTo($ul);
                });
                $("#designerDept").append($ul);

            }, function (ex) {
                console.log(ex);
            });
        },
        deploy_trend_ds: function () {
            $("#customize").append(Signing.emergeWidget('设计师天级量尺量&签单量', 'designerSigning', 'icon-signal', 'col-sm-6'));

            var createNumber = {api: "decoration.index.createNumber"};
            com._post_(api.home.library, $.extend({}, createNumber, Signing.options), function (o) {
                var dataCreate = [];
                var userId = [];
                $.each(eval("(" + o + ")").aggregations['2'].buckets, function (i, v) {
                    userId.push(v.key);
                    $.each(v['3'].buckets, function (index, value) {
                        var temp = {};
                        temp['times'] = Signing.convertDate(v.key);
                        temp['量尺'] = value.doc_count;
                        temp['签单'] = 0;
                        dataCreate.push(temp)
                    })
                });

                var contractNumber = {api: "decoration.index.contractNumber"};
                com._post_(api.home.library, $.extend({}, contractNumber, Signing.options), function (e) {
                    var dataSign = [];
                    $.each(eval("(" + e + ")").aggregations['2'].buckets, function (i, v) {
                        var _data = {};
                        _data['times'] = Signing.convertDate(v.key);
                        $.each(v['3'].buckets, function (index, value) {
                            _data['量尺'] = 0;
                            _data['签单'] = value.doc_count;
                        });
                        dataSign.push(_data)
                    });

                    var data = dataSign.concat(dataCreate);
                    var temp = [];
                    for (var i in data) {
                        if (data[i]['times'] != undefined) {
                            var key = data[i]['times'];
                            if (temp[key]) {
                                temp[key]['量尺'] += data[i]['量尺'];
                                temp[key]['签单'] += data[i]['签单'];
                                temp[key]['times'] = data[i]['times'];
                            } else {
                                temp[key] = {};
                                temp[key]['量尺'] = data[i]['量尺'];
                                temp[key]['签单'] = data[i]['签单'];
                                temp[key]['times'] = data[i]['times'];
                            }
                        }
                    }
                    var _data = [];
                    for(var i in temp){
                        _data.push(temp[i])
                    }

                    var ds = new DataSet();
                    var dv = ds.createView().source(_data);
                    dv.transform({
                        type: 'fold',
                        fields: ['量尺', '签单'], // 展开字段集
                        key: 'dsName', // key字段
                        value: 'temperature' // value字段
                    });
                    var chart = new G2.Chart({
                        container: 'designerSigning',
                        forceFit: true,
                        height: 250
                    });
                    chart.source(dv, {
                        month: {
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
                                return val;
                            }
                        }
                    });
                    chart.line().position('times*temperature').color('dsName').shape('smooth');
                    chart.point().position('times*temperature').color('dsName').size(4).shape('circle').style({
                        stroke: '#fff',
                        lineWidth: 1
                    });
                    chart.render();
                }, function (ex) {
                    console.log(ex);
                });

            }, function (ex) {
                console.log(ex);
            });
        },
        /**
         * 配置业务
         */
        deploy_amount_sm: function () {
            $("#customize").append(Signing.emergeWidget('数据统计', 'amount_sm', 'icon-twitter', 'col-sm-6', true, {'salesmanAmount': '业务员签单额', 'salesmanCreate': '业务员量尺数', 'salesmanNumber': '业务员签单数'}));

            var contractTotalAmount = {api: "decoration.index.contractTotalAmount", "salesman": true};
            com._post_(api.home.library, $.extend({}, contractTotalAmount, Signing.options), function (e) {
                $("#salesmanAmount").find("b").html(Signing.toThousands(eval("(" + e + ")").aggregations["1"].value));
            }, function (ex) {
                console.log(ex)
            });

            var createTotalNumber = {api: "decoration.index.createTotalNumber", "salesman": true};
            com._post_(api.home.library, $.extend({}, createTotalNumber, Signing.options), function (e) {
                $("#salesmanCreate").find("b").html(Signing.toThousands(eval("(" + e + ")").aggregations["1"].value));
            }, function (ex) {
                console.log(ex);
            });

            var contractTotalNumber = {api: "decoration.index.contractTotalNumber", "salesman": true};
            com._post_(api.home.library, $.extend({}, contractTotalNumber, Signing.options), function (e) {
                $("#salesmanNumber").find("b").html(Signing.toThousands(eval("(" + e + ")").aggregations["1"].value));
            }, function (ex) {
                console.log(ex);
            });
        },
        deploy_ranking_sm: function () {
            $("#customize").append(Signing.emergeWidget('业务员业绩TOP10', 'salesmanTotal', 'icon-signal', 'col-sm-3 amount-col'));

            var designerAmount = {api: "decoration.index.amount", "salesman": true};
            com._post_(api.home.library, $.extend({}, designerAmount, Signing.options), function (e) {
                var data = [];
                $.each(eval("(" + e + ")").aggregations['2'].buckets, function (i, v) {
                    data.push({"salesmanName": v.key, "salesmanAmount": Signing.toDecimalPlaces(v["1"].value)});
                });

                var $ul = $('<ul class="list-unstyled list-striped top-table amount-li"></ul>');
                $.each(data, function (i, e) {
                    if (i < 3) {
                        var $li = $('<li><i class="icon-trophy orange"></i>' + e['salesmanName'] + '<div>' + e['salesmanAmount'] + '</div></li>');
                    } else {
                        var $li = $('<li><span style="width: 35.5px;"></span>' + e['salesmanName'] + '<div>' + e['salesmanAmount'] + '</div></li>');
                    }
                    $li.appendTo($ul);
                });
                $("#salesmanTotal").append($ul);

            }, function (ex) {
                console.log(ex);
            });
        },
        deploy_ranking_dept_sm: function () {
            $("#customize").append(Signing.emergeWidget('业务员部门业绩TOP10', 'salesmanDept', 'icon-signal', 'col-sm-3 amount-col'));

            var designerDeptAmount = {api: "decoration.index.deptAmount", "salesman": true};
            com._post_(api.home.library, $.extend({}, designerDeptAmount, Signing.options), function (e) {
                var data = [];
                $.each(eval("(" + e + ")").aggregations['2'].buckets, function (i, v) {
                    data.push({"deptName": v.key, "deptAmount": Signing.toDecimalPlaces(v["1"].value)});
                });

                var $ul = $('<ul class="list-unstyled list-striped top-table amount-li"></ul>');
                $.each(data, function (i, e) {
                    if (i < 3) {
                        var $li = $('<li><i class="icon-trophy orange"></i>' + e['deptName'] + '<div>' + e['deptAmount'] + '</div></li>');
                    } else {
                        var $li = $('<li><span style="width: 35.5px;"></span>' + e['deptName'] + '<div>' + e['deptAmount'] + '</div></li>');
                    }
                    $li.appendTo($ul);
                });
                $("#salesmanDept").append($ul);

            }, function (ex) {
                console.log(ex);
            });
        },
        deploy_trend_sm: function () {
            $("#customize").append(Signing.emergeWidget('业务员天级量尺量&签单量', 'salesmanSigning', 'icon-signal', 'col-sm-6'));

            var createNumber = {api: "decoration.index.createNumber", "salesman": true};
            com._post_(api.home.library, $.extend({}, createNumber, Signing.options), function (o) {
                var dataCreate = [];
                var userId = [];
                $.each(eval("(" + o + ")").aggregations['2'].buckets, function (i, v) {
                    userId.push(v.key);
                    $.each(v['3'].buckets, function (index, value) {
                        var temp = {};
                        temp['times'] = Signing.convertDate(v.key);
                        temp['量尺'] = value.doc_count;
                        temp['签单'] = 0;
                        dataCreate.push(temp)
                    });
                });

                var contractNumber = {api: "decoration.index.contractNumber", "salesman": true};
                com._post_(api.home.library, $.extend({}, contractNumber, Signing.options), function (e) {
                    var dataSign = [];
                    $.each(eval("(" + e + ")").aggregations['2'].buckets, function (i, v) {
                        var _data = {};
                        _data['times'] = Signing.convertDate(v.key);
                        $.each(v['3'].buckets, function (index, value) {
                            _data['量尺'] = 0;
                            _data['签单'] = value.doc_count;
                        });
                        dataSign.push(_data);
                    });

                    var data = dataSign.concat(dataCreate);
                    var temp = [];
                    for (var i in data) {
                        if (data[i]['times'] != undefined) {
                            var key = data[i]['times'];
                            if (temp[key]) {
                                temp[key]['量尺'] += data[i]['量尺'];
                                temp[key]['签单'] += data[i]['签单'];
                                temp[key]['times'] = data[i]['times'];
                            } else {
                                temp[key] = {};
                                temp[key]['量尺'] = data[i]['量尺'];
                                temp[key]['签单'] = data[i]['签单'];
                                temp[key]['times'] = data[i]['times'];
                            }
                        }
                    }
                    var _data = [];
                    for (var i in temp) {
                        _data.push(temp[i]);
                    }

                    var ds = new DataSet();
                    var dv = ds.createView().source(_data);
                    dv.transform({
                        type: 'fold',
                        fields: ['量尺', '签单'], // 展开字段集
                        key: 'dsName', // key字段
                        value: 'temperature' // value字段
                    });
                    var chart = new G2.Chart({
                        container: 'salesmanSigning',
                        forceFit: true,
                        height: 250
                    });
                    chart.source(dv, {
                        month: {
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
                                return val;
                            }
                        }
                    });
                    chart.line().position('times*temperature').color('dsName').shape('smooth');
                    chart.point().position('times*temperature').color('dsName').size(4).shape('circle').style({
                        stroke: '#fff',
                        lineWidth: 1
                    });
                    chart.render();
                }, function (ex) {
                    console.log(ex);
                });

            }, function (ex) {
                console.log(ex);
            });
        },
        setCookie: function(name, value) {
            var val = com.getCookie(name);
            if (val != null) {
                document.cookie = name + "=" + val + value + ";";
            } else {
                document.cookie = name + "=" + value + ";";
            }
        },
        baseClick: function(){
            var $input = $('input[type="checkbox"]','#ace-settings-box');
            $.each($input, function (i, v) {
                var $v = $(v);
                $v.click(function () {
                    var id = $v.attr('key') + "Div";

                    if ($v.is(':checked')) {
                        var method = $v.attr('id');
                        Signing.call("Signing.deploy_"+ method);
                        Signing.storageCookie();
                    } else {
                        $("#" + id).remove();
                        com.deleteCookie("userDisplay");
                        Signing.storageCookie();
                    }
                });
            });
        },
        call: function(functionName){
            eval(functionName+"()");
        },
        transferDeploy: function() {
            if(com.getCookie("userDisplay") == null){ return; }
            var list = com.getCookie("userDisplay").split(",");

            $.each(list, function (i, e) {
                $.each($('input[type="checkbox"]','#ace-settings-box'), function (i, v) {
                    if (e == $(v).val()){
                        $(v).attr('checked',"checked");
                    }
                })
            });

            $.each($('input[type="checkbox"]','#ace-settings-box'), function (i, b) {
                var $b = $(b);
                if ($b.is(':checked')) {
                    var method = $b.attr('id');
                    Signing.call("Signing.deploy_" + method);
                }
            })
        },
        storageCookie: function() {
            $.each($('input[type="checkbox"]','#ace-settings-box'), function (i, k) {
                var $k = $(k);
                if ($k.is(':checked')) {
                    Signing.setCookie("userDisplay", $k.val()+",")
                }
            });
        },
        options: {
            "user": params.userInfo.user.uid,
            "companyName": params.company.name,
            "mc": true,
            "es": true
        },
        noticeOptions:{
        	"deptId": params.userInfo.user.dept.deptId,
            "companyName": params.company.name,
            "mc": true
        }
    };

    Signing.transferDeploy();
    Signing.baseClick();

    Signing.loadNotices();
    Signing.loadActivities();

    loadMessageCount();

    com.showImg($("#personalPic"), params.userInfo.user.userPhoto, 180, 180, '');
    com.showImg($("#userImg"), params.userInfo.user.userPhoto, 30, 30, '');

    com.post(api.common.wmCode, {}, function (res) {
        var img = new Image();
        img.src = res.watermark;
        url = 'url("' + img.src + '")';
        $("#fl-container").css('background-size', '300px').css('background-image', url).css('bottom', '0');
    }, null, false);

    $('#moreActivity').click(function () {
        params["notice.type"] = 2;
        $('.breadcrumb .nav1').empty().append('<i class="icon-bookmark"></i>&nbsp;通知/活动');
        com.switchPage(api.index.moreNoticesIndex.url);
        $('.breadcrumb .nav2').hide();
        $('.breadcrumb .nav3').hide();
    });

    $('#moreNotice').click(function () {
        params["notice.type"] = 1;
        $('.breadcrumb .nav1').empty().append('<i class="icon-bookmark"></i>&nbsp;通知/活动');
        com.switchPage(api.index.moreNoticesIndex.url);
        $('.breadcrumb .nav2').hide();
        $('.breadcrumb .nav3').hide();
    });

    $('a[name="updateNotices"]').click(function () {
        Signing.loadNotices();
    });
    $('a[name="updateActivities"]').click(function () {
        Signing.loadActivities();
    });

    var date = new Date();
    var d = date.getDate();
    var m = date.getMonth();
    var y = date.getFullYear();
    var calendar = $('#calendar').fullCalendar({
        buttonText: {
            prev: '<i class="icon-chevron-left"></i>',
            next: '<i class="icon-chevron-right"></i>',
            today: '今天',
            month: '月',
            week: '周',
            day: '日'
        },
        header: {
            left: 'prev,next',
            center: 'title',
            right: 'month'
        },
        monthNames: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
        monthNamesShort: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
        dayNames: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"],
        dayNamesShort: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"],
        today: ["今天"],
        titleFormat: {
            month: "yyyy年 MMM",
            week: " yyyy年 MM.dd[ yyyy]{ '&#8212;'[MM].dd}",
            day: "yyyy.MM.dd dddd "
        },
        axisFormat: "H:mm",
        editable: true, //判断该日程能否拖动
        droppable: true,
        drop: function (date, allDay) {
            var originalEventObject = $(this).data('eventObject');
            var $extraEventClass = $(this).attr('data-class');
            var copiedEventObject = $.extend({}, originalEventObject);

            copiedEventObject.start = date;
            copiedEventObject.allDay = allDay;
            if ($extraEventClass) copiedEventObject['className'] = [$extraEventClass];

            $('#calendar').fullCalendar('renderEvent', copiedEventObject, true);

            if ($('#drop-remove').is(':checked')) {
                $(this).remove();
            }
        },
        selectable: true,
        selectHelper: true,
        select: function (start, end, allDay) {

            var form = $("<form class='form-horizontal' id='eventadding' style='margin-top:20px'></form>");

            var $g1 = $('<div></div>').addClass('form-group');
            $g1.append('<label class="col-sm-3 control-label no-padding-right no-padding" for="form-field-1"> 标题 </label>');
            $g1.append('<div class="col-sm-9"><input class="col-xs-10 col-sm-6 v_required" autocomplete="off" type="text" name="title" data-toggle="popover" data-trigger="manual"/></div>');

            var $g2 = $('<div></div>').addClass('form-group');
            $g2.append('<label class="col-sm-3 control-label no-padding-right no-padding" for="form-field-1"> 内容 </label>');
            $g2.append('<div class="col-sm-9"><textarea class="col-xs-10 col-sm-6 v_required" name="content" data-toggle="popover" data-trigger="manual"></textarea></div>');

            form.append($g1).append($g2);

            var div = bootbox.dialog({
                message: form,

                buttons: {

                    "save": {
                        "label": "<i class='icon-check'></i> 确认",
                        "className": "btn-sm btn-success",
                        "callback": function () {

                            var validator = com.validate('eventadding');
                            if (validator) {
                                return false;
                            }

                            var params = {
                                "event.title": $('[name="title"]', form).val(),
                                "event.content": $('[name="content"]', form).val(),
                                "event.showDate": $.fullCalendar.formatDate(start, "yyyy-MM-dd")
                            };

                            com.post(api.information.addEvent, params, function (res) {

                                calendar.fullCalendar('renderEvent',
                                    {
                                        title: res.event.title,
                                        start: new Date(res.event.showDate),

                                        className: 'label-success',
                                        creater: res.event.creater,
                                        createTime: res.event.createTime,
                                        content: res.event.content,
                                        eid: res.event.eid
                                    },
                                    true
                                );
                            });
                        }
                    },
                    "close": {
                        "label": "<i class='icon-remove'></i> 取消",
                        "className": "btn-sm"
                    }
                }
            });
            calendar.fullCalendar('unselect');
        },
        eventClick: function (calEvent, jsEvent, view) {

            var form = $("<form class='form-horizontal'  style='margin-top:20px'></form>");

            var $g1 = $('<div></div>').addClass('form-group');
            $g1.append('<label class="col-sm-3 control-label no-padding-right no-padding" for="form-field-1"> 标题 </label>');
            $g1.append('<div class="col-sm-9"><span class="col-xs-10 col-sm-10">' + calEvent.title + '</span></div>');

            var $g2 = $('<div></div>').addClass('form-group');
            $g2.append('<label class="col-sm-3 control-label no-padding-right no-padding" for="form-field-1"> 内容 </label>');
            $g2.append('<div class="col-sm-9"><span class="col-xs-10 col-sm-10">' + calEvent.content + '</span></div>');

            var $g3 = $('<div></div>').addClass('form-group');
            $g3.append('<label class="col-sm-3 control-label no-padding-right no-padding" for="form-field-1"> 创建人 </label>');
            $g3.append('<div class="col-sm-9"><span class="col-xs-10 col-sm-10">' + (calEvent.creater.currentName != null ? calEvent.creater.currentName : '无') + '</span></div>');

            var $g4 = $('<div></div>').addClass('form-group');
            $g4.append('<label class="col-sm-3 control-label no-padding-right no-padding" for="form-field-1"> 创建时间 </label>');
            $g4.append('<div class="col-sm-9"><span class="col-xs-10 col-sm-10" >' + (calEvent.createTime && calEvent.createTime.split('T')[0].toString()) + '</span></div>');

            form.append($g1).append($g2).append($g3).append($g4);

            var div = bootbox.dialog({
                message: form,
                buttons: {

                    "delete": {
                        "label": "<i class='icon-trash'></i> 删除",
                        "className": "btn-sm btn-danger",
                        "callback": function () {

                            com.post(api.information.deleteEvent, {
                                "event.eid": calEvent.eid
                            }, function () {
                                calendar.fullCalendar('removeEvents', function (ev) {
                                    return (ev._id == calEvent._id);
                                })
                            });
                        }
                    },
                    "close": {
                        "label": "<i class='icon-remove'></i> 取消",
                        "className": "btn-sm"
                    }
                }
            });
            form.on('submit', function () {
                calEvent.title = form.find("input[type=text]").val();
                calendar.fullCalendar('updateEvent', calEvent);
                div.modal("hide");
                return false;
            });
        },
        handleWindowResize: true,
        firstDay: 1,
        events: function (start, end, callback) {

            var viewStart = $.fullCalendar.formatDate(start, "yyyy-MM-dd");
            var viewEnd = $.fullCalendar.formatDate(end, "yyyy-MM-dd");
            $("#calendar").fullCalendar('removeEvents');//清空事件

            com.post(api.information.queryEvent, {
                "event.beginDate": viewStart,
                "event.endDate": viewEnd
            }, function (data) {

                var resultCollection = data.events;

                if (!resultCollection.length) return;

                var events = [];

                $.each(resultCollection, function (index, term) {

                    var start = new Date(term.showDate);
                    var end = new Date(term.endDate || term.showDate);

                    events.push({
                        title: term.title,
                        start: start,

                        className: term.type == 1 ? 'label-info' : term.type == 3 ? 'label-danger' : 'label-success',
                        creater: term.creater,
                        createTime: term.createTime,
                        content: term.content,
                        eid: term.eid
                    });
                });
                callback(events);
            }, null);//把从后台取出的数据进行封装以后在页面上以fullCalendar的方式进行显示
        },
        viewDisplay: function (view) {
        },//动态把数据查出,按照月份动态查询
        dayClick: function (date, allDay, jsEvent, view) {
            var selectdate = $.fullCalendar.formatDate(date, "yyyy-MM-dd");//选择当前日期的时间转换
            return false;
        },//日期点击后弹出的jq ui的框,添加日程记录
        loading: function (bool) {
            if (bool) $('#loading').show();
            else $('#loading').hide();
        },
        weekMode: 'variable'
    });

    $('#calendarTab').removeClass('active');
    $('#calendarPage').removeClass('in active');
    $('#calendarTab').click(function () {
        setTimeout("$('#calendar').fullCalendar('rerenderEvents')", 500)
    });
});

function loadMessageCount() {
    com.post(api.information.countMessage, {}, function (res) {
        if (res.messageCount == 0) {
            $("#messageCount").remove();
        } else {
            if ($("#messageCount").length == 0) {
                $("#messageBtn").append("<span id='messageCount' class='badge badge-pink'>" + res.messageCount + "</span>");
            } else {
                $("#messageCount").text(res.messageCount);
            }
        }
    }, function (res) {
        console.log("get message count fail...");
    });
}