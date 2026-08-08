$(function() {

    var Signing = {

        getNoticeDOM: function(notice) {

            var $wrap = $('<div class="alert alert-info clearfix" style="padding: 2px 10x;"></div>');
            var $title = $('<div><i class="icon-hand-right green"></i></div>');
            var $theme = $('<strong style="margin-left:7px;">' + notice.theme + ' </strong>').appendTo($title);

            var priorityText = "重要";
            var priorityStyle = "label-warning";

            $('<small class="detail" style="cursor:pointer">  [详细]</small>').on(ace.click_event, function() {

                com.showInfo(notice.theme, notice.contents);
                return false;
            }).appendTo($theme);

            if (notice.priority == 2) {
                priorityText = "紧急";
                priorityStyle = "label-danger";
            } else if (notice.priority == 1) {
                priorityText = "重要";
                priorityStyle = "label-warning";
            } else if (notice.priority == 0) {
                priorityText = "标准";
                priorityStyle = "label-yellow";
            }

            $('<span class="label arrowed-in pull-right" style="line-height: 17px;">' + priorityText + '</span>').addClass(priorityStyle).appendTo($title);
            var $contents = $('<div class="col-xs-12"><div style="text-overflow: ellipsis;white-space: nowrap;overflow: hidden;margin-right:50px;">' + notice.contents + '</div><abbr title="' + notice.contents + '"></abbr></div>');
            var $bottomInfo = $('<small><div class="pull-right"><span><i class="icon-time bigger-110"></i>&nbsp;' + notice.startTime + ' 至 ' + notice.endTime + '</span>&nbsp;&nbsp;<span><i class="icon-user bigger-110"></i>&nbsp;' + notice.creater.userName + '</span>&nbsp;&nbsp;</div></small>');
            if (notice.filePath != undefined && notice.filePath != null && notice.filePath != "") {
                var openWin = "com.popup('" + notice.theme + "', '" + config.media + notice.filePath + "');";

                $(".pull-right", $bottomInfo).append('<span><i class="icon-download-alt bigger-110"></i>&nbsp;<a href=' + config.media + notice.filePath + "?t=" + new Date().getTime() + ' onclick="' + openWin + ' return false;">查看附件</a></span>');
            }

            $wrap.append($title).append($contents).append($bottomInfo);

            return $wrap;
        },
        loadNotices: function() {

            com.post(api.information.pageNoticeForSeenByType, {
                "paging.rows": 5,
                "paging.page": 1,
                "notice.type": 1
            }, function(data) {

                if (data.paging.data && data.paging.data.length > 0) {
                    $.each(data.paging.data, function(i, v) {

                        Signing.getNoticeDOM(v).appendTo($("#noticeList").html(''));
                    });
                } else {
                    var $zone = $('<div></div>').addClass('dropzone dz-clickable').css('margin', '20px').css('border', '0px').appendTo($("#noticeList").html(''));
                    var $mesg = $('<div></div>').addClass('dz-default dz-message').appendTo($zone);
                    var $span = $('<span></span>').text('无可用数据提供').appendTo($mesg);
                }
            }, function() {
                // 通知接口失败时静默降级,避免首页弹出全局"网络异常"
            }, false);

        },
        loadActivities: function() {

            com.post(api.information.pageNoticeForSeenByType, {
                "paging.rows": 5,
                "paging.page": 1,
                "notice.type": 2
            }, function(data) {

                if (data.paging.data && data.paging.data.length > 0) {
                    $.each(data.paging.data, function(i, v) {

                        Signing.getNoticeDOM(v).appendTo($("#activityList").html(''));
                    });
                } else {
                    var $zone = $('<div></div>').addClass('dropzone dz-clickable').css('margin', '20px').css('border', '0px').appendTo($("#activityList").html(''));
                    var $mesg = $('<div></div>').addClass('dz-default dz-message').appendTo($zone);
                    var $span = $('<span></span>').text('无可用数据提供').appendTo($mesg);
                }

            }, function() {
                // 活动接口失败时静默降级,避免首页弹出全局"网络异常"
            }, false);

        },
        noticeOptions: {
            "deptId": params.userInfo.user.dept.no,
            "company": params.company.no,
            "redis": 0
        }
    };

    Signing.loadNotices();
    Signing.loadActivities();

    com.focusPage("h4[name='versionCode']").text(config.versionCode);
    com.post(api.ds.system, {}, function(res) {

        var ablockList = com.focusPage("#ablockList");

        $.each(res.ablocks, function(i, v) {

            var $div = $('<div></div>').addClass(v[0]).html(v[1]).appendTo(ablockList);
            var $button = $('<button></button>').addClass('close').attr({
                'data-dismiss': 'alert',
                'type': 'button'
            }).appendTo($div);
            var $i_remove = $('<i></i>').addClass('icon-remove').appendTo($button);

        });

        var advertList = com.focusPage("#advertList");

        $.each(res.adverts, function(i, v) {

            var $div = $('<div style="background: #fff;"></div>').html(v).appendTo(advertList.find("div:first"));
        });

        carousel.render({
            elem: advertList,
            width: "100%",
            height: "180px",
            anim: "fade",
            interval: 4000,
            arrow: "none",
            indicator: "none"
        });

        com.focusPage("#updateBook").click(function() {

            setTimeout(function() {

                com.focusPage(".lead").html(res.tips[Math.floor(Math.random() * res.tips.length)]);
            }, 1580);

        });

        com.focusPage("h4[name='versionCode']").after($(res.versionInfo ? res.versionInfo : "<p>版本信息</p>"));

        com.focusPage(".lead").html(res.tips[Math.floor(Math.random() * res.tips.length)]);

        com.focusPage("#moreMainMaterial").click(function() {

            com.showInfo('选材', '正在筹建中 , 敬请期待');
        });

        com.focusPage("#moreFuMaterial").click(function() {

            com.showInfo('选材', '正在筹建中 , 敬请期待');
        });

        res.power && (layer.open({
            type: 1,
            title: false,
            closeBtn: false,
            area: '300px',
            shade: 0.8,
            id: 'homeAlert',
            btn: ['祝福'],
            moveType: 1,
            content: res.power,
            success: function(layero) {

                layero.find('.layui-layer-btn').css('text-align', 'center');
            }
        }));
    }, function() {
        // 系统配置接口失败时静默降级,避免单接口故障导致首页弹出全局"网络异常"
    });

    com.post(api.system.queryModuleForLink, {
        "module.system": 1
    }, function(res) {

        var data = res.modules;
        var arry = [], datas = [];
        var length = $('.submenu li a').length;

        for ( var i = 0; i < length; i++) {
            var menutext = $('.submenu li a:eq(' + i + ')').attr('menutext');
            var url = $('.submenu li a:eq(' + i + ')').attr('href');
            var mid = $('.submenu li a:eq(' + i + ')').attr('mid');
            var icon = $('.submenu li a:eq(' + i + ') i').attr('class');
            arry.push({
                "name": menutext,
                "url": url,
                "mid": mid,
                "icon": icon
            });
        }

        var array = arry.slice(0, 8);

        if (data.length < 8) {
            if (data.length == 0) {
                num = array;
            } else {
                $.each(data, function(i, v) {

                    if (!v.url || v.url == "")
                        return true;
                    datas.push(v)
                    num = datas.concat(array.slice(0, 8 - datas.length))
                });
            }
        } else {
            num = data;
        }

        $.each(num, function(i, v) {

            if ($(".btn-fastlink").length >= 8)
                return false;

            var $div = $('<div></div>').addClass('col-sm-3 col-xs-6').appendTo(linklist);
            var $a = $('<a></a>').addClass("btn btn-app btn-fastlink no-radius no-hover").attr({
                href: v.url,
                mid: v.mid,
                menutext: v.name,
                icon: v.icon
            }).appendTo($div);

            var $i = $('<i></i>').addClass(v.icon).appendTo($a);
            var $span = $('<span></span>').text(v.name).appendTo($a);

            $a.click(function() {

                com.post(api.system.checkModule, {
                    "module.mid": v.mid
                }, function(res) {

                    var module = res.module

                    if (module) {

                        params.urlLoadParams = com.splitUrl(module.url);

                        if (params.urlLoadParams.open && params.urlLoadParams.open == "popup") {
                            com.popup4frame(module.name, module.url);
                            return false;
                        }

                        if (params.urlLoadParams.open && params.urlLoadParams.open == "window") {
                            window.open(module.url);
                            return false;
                        }

                        com.loadPage(module.url, $a);
                    } else {
                        com.showAlert(com.warning, "无操作权限")
                    }

                });

                return false;
            });
        });
    }, function() {
        // 快捷链接接口失败时静默降级,保留默认首页入口即可
    });

    com.post(api.approval.countApprovalForSend, {}, function(res) {

        res.count && $("span[name='approvalSendCount']").text(res.count);
    }, function() {
        // 审批计数接口失败时不影响首页其他模块
    });

    com.post(api.approval.countApprovalForReceive, {}, function(res) {

        res.count && $("span[name='approvalReceiveCount']").text(res.count);
    }, function() {
        // 审批计数接口失败时不影响首页其他模块
    });

    com.charts("designtop", "designtop", api.home.library, $.extend({}, {
        "redis": 1,
        "type": 0,
        "api": "report.decoration.cs8",
        "company": params.company.cid,
    }), "", {}, null, params.reporter.top);

    com.charts("salestop", "salestop", api.home.library, $.extend({}, {
        "redis": 1,
        "type": 1,
        "api": "report.decoration.cs8",
        "company": params.company.cid,
    }), "", {}, null, params.reporter.top);

    com.charts("worktop", "worktop", api.home.library, $.extend({}, {
        "redis": 1,
        "api": "report.construction.ccs10",
        "company": params.company.cid,
    }), "", {}, null, params.reporter.top);

    loadMessageCount();

    com.showImg($("#personalPic"), params.userInfo.user.userPhoto, 180, 180, '');
    com.showImg($("#userImg"), params.userInfo.user.userPhoto, 30, 30, '');

    $("#homeTab").click(function() {

        $('.breadcrumb').empty().append('<i class="fa fa-fw icon-home"></i>&nbsp;&nbsp;&nbsp;首页');
    });

    // GPT标签已隐藏
    // $("#chatGptTab").click(function() {
    //     $("#chatGptPage").load("/views/data/chatGpt.html");
    //     $('.breadcrumb').empty().append('<i class="fa fa-fw icon-calendar"></i>&nbsp;&nbsp;&nbsp;chatGPT');
    // });

    $("#worksheetTab").click(function() {

        params.urlLoadParams.pageType = "creater";
        $("#worksheetPage").load("/views/information/worksheet.html");

        $('.breadcrumb').empty().append('<i class="fa fa-fw icon-calendar"></i>&nbsp;&nbsp;&nbsp;工单');
    });

    $("#calendarTab").click(function() {

        $('.breadcrumb').empty().append('<i class="fa fa-fw icon-calendar"></i>&nbsp;&nbsp;&nbsp;日历');
    });

    $('#moreActivity').click(function() {

        params["notice.type"] = 2;
        com.loadPage(api.index.moreNoticesIndex.url, $(this));
    });

    $('#moreNotice').click(function() {

        params["notice.type"] = 1;
        com.loadPage(api.index.moreNoticesIndex.url, $(this));
    });

    $('#updateNotices').click(function() {

        Signing.loadNotices();
    });
    $('#updateActivities').click(function() {

        Signing.loadActivities();
    });

    var date = new Date();
    var d = date.getDate();
    var m = date.getMonth();
    var y = date.getFullYear();

    var calendar = $('#calendar').fullCalendar($.extend(com.calendardefault, {
        selectable: true,
        selectHelper: true,
        select: function(start, end, allDay) {

            var items = {
                title: com.focusPage('#addEvent [name="title"]'),
                content: com.focusPage('#addEvent [name="content"]'),
            };

            com.cleanItems(items);

            layer.open({
                type: 1,
                title: false,
                content: com.focusPage("#addEvent"),
                area: "450px",
                btn: ["确认", "取消"],
                yes: function(index) {

                    if (com.validate('addEvent')) {
                        return false;
                    }
                    var time = $.fullCalendar.formatDate(start, "yyyy-MM-dd").toString();

                    var times = time.replace(/-/g, '');
                    var params = {
                        "event.title": items.title.val(),
                        "event.content": items.content.val(),
                        "event.showDate": times
                    };
                    com.post(api.information.addEvent, params, function(res) {

                        var str = (res.event.showDate).toString();
                        var Str = str.replace(/(.{4})/, "$1-");
                        var newStr = Str.replace(/(.{7})/, "$1-");
                        calendar.fullCalendar('renderEvent', {

                            title: res.event.title,
                            start: new Date(newStr),

                            className: 'label-success',
                            creater: res.event.creater,
                            createTime: res.event.createTime,
                            content: res.event.content,
                            eid: res.event.eid
                        }, true);

                        layer.close(index)
                    });
                },
                btn2: function(index) {

                    layer.close(index);
                }
            });

            calendar.fullCalendar('unselect');
        },
        eventClick: function(calEvent, jsEvent, view) {

            com.focusPage('#showEvent [name="title"]').html(calEvent.title);
            com.focusPage('#showEvent [name="content"]').html(calEvent.content);
            com.focusPage('#showEvent [name="creater"]').html(calEvent.creater.currentName);
            com.focusPage('#showEvent [name="createTime"]').html(calEvent.createTime);

            layer.open({
                type: 1,
                title: false,
                content: com.focusPage("#showEvent"),
                area: "300px",
                btn: ["删除", "取消"],
                yes: function(index) {

                    com.post(api.information.deleteEvent, {
                        "event.eid": calEvent.eid
                    }, function() {

                        calendar.fullCalendar('removeEvents', function(ev) {

                            return (ev._id == calEvent._id);
                        });
                        layer.close(index);
                    });
                },
                btn2: function(index) {

                    layer.close(index);
                }
            });
        },
        handleWindowResize: true,
        events: function(start, end, callback) {

            var viewStart = $.fullCalendar.formatDate(start, "yyyy-MM-dd");
            var viewEnd = $.fullCalendar.formatDate(end, "yyyy-MM-dd");
            $("#calendar").fullCalendar('removeEvents');// 清空事件

            var timeSrart = viewStart.toString();
            var timeStarts = timeSrart.replace(/-/g, '');
            var timeEnd = viewEnd.toString();
            var timeEnds = timeEnd.replace(/-/g, '');

            com.post(api.information.queryEvent, {
                "event.beginDate": Number(timeStarts),
                "event.endDate": Number(timeEnds)
            }, function(data) {

                var resultCollection = data.events;
                if (!resultCollection.length)
                    return false;

                var events = [];

                $.each(resultCollection, function(index, term) {

                    var str = (term.showDate).toString();
                    var Str = str.replace(/(.{4})/, "$1-");
                    var newStr = Str.replace(/(.{7})/, "$1-");

                    var start = new Date(newStr);
                    var end = new Date(newStr || newStr);

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
            }, function() {
                // 日历事件接口失败时静默降级,避免弹出全局"网络异常"
            });// 把从后台取出的数据进行封装以后在页面上以fullCalendar的方式进行显示
        },

        viewDisplay: function(view) {

        },// 动态把数据查出,按照月份动态查询
        dayClick: function(date, allDay, jsEvent, view) {

            var selectdate = $.fullCalendar.formatDate(date, "yyyy-MM-dd");// 选择当前日期的时间转换
            return false;
        },// 日期点击后弹出的jq ui的框,添加日程记录
        loading: function(bool) {

            if (bool) {
                $('#loading').show();
            } else {
                $('#loading').hide();
            }
        },
        weekMode: 'variable'
    }));

    $("#closeAllPage").click(function() {

        $(".flpage.nav-tab").removeClass("active");
        $(".flpage.tab-pane").removeClass("active");
        $( "#home #homeNav.nav.nav-tabs .flpage.nav-tab:gt(2)" ).remove();
        $( "#home .flpage.tab-content div.flpage.tab-pane:gt(2)" ).remove();

        $("#homeNav > #operateTab").removeClass("open");
        $("#homeNav > #homeTab").addClass("active");
        $(".flpage > #homePage").addClass("active");

        $.breadcrumb('icon-home', ['首页']);

        return false;
    });

    var $contextMenu = $('<ul class="dropdown-menu tab-context-menu"></ul>').css({
        'position': 'fixed',
        'z-index': 9999,
        'display': 'none',
        'min-width': '120px'
    }).appendTo('body');

    $('<li><a href="javascript:void(0)" data-action="refresh"><i class="icon-refresh"></i> 刷新</a></li>').appendTo($contextMenu);
    $('<li><a href="javascript:void(0)" data-action="close"><i class="icon-remove"></i> 关闭</a></li>').appendTo($contextMenu);
    $('<li class="divider"></li>').appendTo($contextMenu);
    $('<li><a href="javascript:void(0)" data-action="closeLeft"><i class="icon-chevron-left"></i> 关闭左侧所有</a></li>').appendTo($contextMenu);
    $('<li><a href="javascript:void(0)" data-action="closeRight"><i class="icon-chevron-right"></i> 关闭右侧所有</a></li>').appendTo($contextMenu);
    $('<li><a href="javascript:void(0)" data-action="closeOthers"><i class="icon-ban-circle"></i> 关闭其他</a></li>').appendTo($contextMenu);
    $('<li><a href="javascript:void(0)" data-action="closeAll"><i class="icon-trash"></i> 关闭所有</a></li>').appendTo($contextMenu);

    var closeTabSet = function($tabs) {

        $tabs.each(function() {
            var $t = $(this);
            var _pageId = $t.find('a').attr('href');
            $(_pageId).remove();
            $t.remove();
        });
    };

    var activateTab = function($tab) {

        var _pageId = $tab.find('a').attr('href');
        var _pane = $(_pageId);

        $(".flpage.nav-tab").removeClass("active");
        $(".flpage.tab-pane").removeClass("active");
        $tab.addClass("active");
        _pane.addClass("active");

        params['urlLoadParams'] = com.splitUrl($tab.attr('data-page'));

        var temp = [];
        if (_pane.attr('parentText')) temp.push(_pane.attr('parentText'));
        if (_pane.attr('text')) temp.push(_pane.attr('text'));
        $.breadcrumb(_pane.attr('icon'), temp);
    };

    $('#homeNav').on('contextmenu', '.flpage.nav-tab', function(e) {

        e.preventDefault();

        var $tab = $(this);

        if (!$tab.attr('data-page')) {
            $contextMenu.hide();
            return false;
        }

        $contextMenu.data('tab', $tab);
        $contextMenu.css({
            'top': e.clientY,
            'left': e.clientX,
            'display': 'block'
        });

        return false;
    });

    $contextMenu.on('click', 'a[data-action]', function(e) {

        e.preventDefault();
        e.stopPropagation();

        var action = $(this).attr('data-action');
        var $tab = $contextMenu.data('tab');

        $contextMenu.hide();

        if (!$tab || !$tab.length)
            return;

        var _pageId = $tab.find('a').attr('href');
        var _page = $(_pageId);
        var page = $tab.attr('data-page');

        if (action == 'refresh') {

            if (!$tab.hasClass("active")) {
                activateTab($tab);
            }

            _page.load(page);
            layer.closeAll("tips");

        } else if (action == 'close') {

            if ($tab.hasClass("active")) {
                params['urlLoadParams'] = com.splitUrl($tab.prev().attr('data-page'));
                $tab.prev('li.flpage').addClass('active');
                _page.prev('div.flpage').addClass('active');
            }

            $tab.remove();
            _page.remove();

        } else if (action == 'closeLeft') {

            var $leftTabs = $tab.prevAll('.flpage.nav-tab[data-page]');
            var activeInSet = $leftTabs.filter('.active').length > 0;
            closeTabSet($leftTabs);
            if (activeInSet) activateTab($tab);

        } else if (action == 'closeRight') {

            var $rightTabs = $tab.nextAll('.flpage.nav-tab[data-page]');
            var activeInSet = $rightTabs.filter('.active').length > 0;
            closeTabSet($rightTabs);
            if (activeInSet) activateTab($tab);

        } else if (action == 'closeOthers') {

            var $otherTabs = $('#homeNav .flpage.nav-tab[data-page]').not($tab);
            closeTabSet($otherTabs);
            if (!$tab.hasClass("active")) activateTab($tab);

        } else if (action == 'closeAll') {

            closeTabSet($('#homeNav .flpage.nav-tab[data-page]'));
            $(".flpage.nav-tab").removeClass("active");
            $(".flpage.tab-pane").removeClass("active");
            $("#homeTab").addClass("active");
            $("#homePage").addClass("active");
            $.breadcrumb('icon-home', ['首页']);
        }
    });

    $(document).on('click', function() {
        $contextMenu.hide();
    });
    $('#calendarTab').removeClass('active');
    $('#calendarPage').removeClass('in active');
    $('#calendarTab').click(function() {

        setTimeout("$('#calendar').fullCalendar('rerenderEvents')", 500)
    });

    drawWeather();

    function drawWeather() {

        var $weatherList = $('#weatherList');

        com._post_(api.home.library, {
            "redis": 0,
            "api": "system.login.weather",
            "loginTime": window.loginTime,
            "code": params.company.code,
        }, function(res) {

            if (typeof res == 'string')
                var data = JSON.parse(res)
            else if (typeof res == 'object')
                var data = res

            var v = data;

            var $item = $('<div></div>').addClass('message-bar weather item center col-sm-12').css("float", "none").appendTo($weatherList);
            var $title = $('<span></span>').addClass('blue bigger-200 weather title').text(v.name).appendTo($item);
            $('<div class="hr hr5 hr-dotted"></div>').appendTo($item);
            var $content = $('<span></span>').addClass('grey bigger-120').html(v.weather.text).appendTo($item);
            $('<br></br>').appendTo($item);
            var $content = $('<span></span>').addClass('grey bigger-120').html('温度: ' + v.weather.temp + '°C' + '&nbsp;&nbsp;').appendTo($item);
            var $content = $('<span></span>').addClass('grey bigger-120').html('湿度: ' + v.weather.rh + "%" + '&nbsp;&nbsp;').appendTo($item);
            $('<br></br>').appendTo($item);
            var $content = $('<span></span>').addClass('grey bigger-120').html(v.weather.wind_dir + v.weather.wind_class).appendTo($item);

            return false;
        });
    }

});

function loadMessageCount() {

    com.post(api.information.countMessage, {}, function(res) {

        if (res.messageCount == 0) {
            $("#messageCount").remove();
        } else {

            var count = res.messageCount > 99 ? "99+" : res.messageCount;

            if ($("#messageCount").length == 0) {
                $("#messageBtn").append("<span id='messageCount' class='badge badge-pink'>" + count + "</span>");
            } else {
                $("#messageCount").text(count);
            }
        }
        $("span[name='messageCount']").text(res.messageCount);
    }, function(res) {

        console.log("get message count fail...");
    });

}
