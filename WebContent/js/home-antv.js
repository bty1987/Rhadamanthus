$(function () {

    var Signing = {
        getNoticeDOM: function (notice) {
        	
            var $wrap = $('<div class="alert alert-info clearfix" style="padding: 2px 10x;"></div>');
            var $title = $('<div><i class="icon-hand-right green"></i></div>');
            var $theme = $('<strong style="margin-left:7px;">' + notice.theme + ' </strong>').appendTo($title);

            var priorityText = "重要";
            var priorityStyle = "label-warning";

            $('<small class="detail" style="cursor:pointer">  [详细]</small>').on(ace.click_event, function () {
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
            	var openWin = "com.popup('" + notice.theme + "', '" + config.media + notice.filePath + "');";
            	
                $(".pull-right", $bottomInfo).append('<span><i class="icon-download-alt bigger-110"></i>&nbsp;<a href=' + config.media + notice.filePath + "?t=" + new Date().getTime() + ' onclick="' + openWin + ' return false;">查看附件</a></span>');
            }

            $wrap.append($title).append($contents).append($bottomInfo);

            return $wrap;
        },
        loadNotices: function () {
            
            com.post(api.information.pageNoticeForSeenByType, {"paging.rows": 5, "paging.page": 1, "notice.type": 1}, function (data) {
                if (data.paging.data.length == 0) return;
                
                $.each(data.paging.data, function (i, v) {
                    Signing.getNoticeDOM(v).appendTo($("#noticeList").html(''));
                });
            }, null, false);

        },
        loadActivities: function () {
            
            com.post(api.information.pageNoticeForSeenByType, {"paging.rows": 5, "paging.page": 1, "notice.type": 2}, function (data) {
                if (data.paging.data.length == 0) return;
                
                $.each(data.paging.data, function (i, v) {
                    Signing.getNoticeDOM(v).appendTo($("#activityList").html(''));
                });
            }, null, false);

        },
        noticeOptions:{
        	"deptId": params.userInfo.user.dept.no,
            "company": params.company.no,
            "redis": 0
        }
    };

    Signing.loadNotices();
    Signing.loadActivities();
    
    com.focusPage("h4[name='versionCode']").text(config.versionCode);
    
    com.post(api.ds.system, {}, function(res){
        
        com.focusPage("h4[name='versionCode']").after($(res.versionInfo ? res.versionInfo : "<p>版本信息</p>"));
        
        res.alertInfo && (layer.open({
            type: 1,
            title: false,
            closeBtn: false,
            area: '300px',
            shade: 0.8,
            id: 'homeAlert',
            btn: ['了解了'],
            moveType: 1,
            content: res.alertInfo,
            success: function(layero){
                layero.find('.layui-layer-btn').css('text-align', 'center');
            }
        }));
    });
    
    com.post(api.system.queryModuleForLink, {"module.system": 1}, function(res){
        
        if(res.modules.length == 0) return false;
        
        var linklist = com.focusPage("#linklist").html('');
        
        $.each(res.modules, function(i, v){
            
            if(!v.url || v.url == "") return true;
            if($(".btn-fastlink").length >= 8) return false;
            
            var $a = $('<a></a>').addClass("btn btn-app btn-fastlink no-radius no-hover col-xs-3").attr({href: v.url, mid: v.mid, menutext: v.name, icon: v.icon}).appendTo(linklist);
            var $i = $('<i></i>').addClass(v.icon).appendTo($a);
            var $span = $('<span></span>').text(v.name).appendTo($a);
            
            $a.click(function(){
                params['urlLoadParams'] = com.splitUrl(v.url);
                com.loadPage(v.url, $(this));
                return false;
            });
        });
    });
    
    com.post(api.approval.countApprovalForSend, {}, function(res){
        res.count && $("span[name='approvalSendCount']").text(res.count);
    });
    
    com.post(api.approval.countApprovalForReceive, {}, function(res){
        res.count && $("span[name='approvalReceiveCount']").text(res.count);
    });

    loadMessageCount();

    com.showImg($("#personalPic"), params.userInfo.user.userPhoto, 180, 180, '');
    com.showImg($("#userImg"), params.userInfo.user.userPhoto, 30, 30, '');

    com.post(api.common.wmCode, {}, function (res) {
        var img = new Image();
        img.src = res.watermark;
        url = 'url("' + img.src + '")';
        $("#fl-container").css('background-size', '300px').css('background-image', url).css('bottom', '0');
    }, null, false);
    
    $("#homeTab").click(function() {
        $('.breadcrumb').empty().append('<i class="fa fa-fw icon-home"></i>&nbsp;&nbsp;&nbsp;首页');
    });
    
    $("#calendarTab").click(function() {
        $('.breadcrumb').empty().append('<i class="fa fa-fw icon-calendar"></i>&nbsp;&nbsp;&nbsp;日历');
    });

    $('#moreActivity').click(function () {
        params["notice.type"] = 2;
        com.loadPage(api.index.moreNoticesIndex.url, $(this));
    });

    $('#moreNotice').click(function () {
        params["notice.type"] = 1;
        com.loadPage(api.index.moreNoticesIndex.url, $(this));
    });

    $('#updateNotices').click(function () {
        Signing.loadNotices();
    });
    $('#updateActivities').click(function () {
        Signing.loadActivities();
    });
    
    var date = new Date();
    var d = date.getDate();
    var m = date.getMonth();
    var y = date.getFullYear();
    
    var calendar = $('#calendar').fullCalendar($.extend(com.calendardefault, {
        selectable: true,
        selectHelper: true,
        select: function (start, end, allDay) {
            
            var items = {
                title: com.focusPage('#addEvent [name="title"]'),
                content: com.focusPage('#addEvent [name="content"]'),
            }
            
            com.cleanItems(items);
            
            layer.open({
                type: 1,
                title: false,
                content: com.focusPage("#addEvent"),
                area: "450px",
                btn: ["确认", "取消"],
                yes: function (index) {

                    if (com.validate('addEvent')) {
                        return false;
                    }

                    var params = {
                        "event.title": items.title.val(),
                        "event.content": items.content.val(),
                        "event.showDate": $.fullCalendar.formatDate(start, "yyyy-MM-dd")
                    };

                    com.post(api.information.addEvent, params, function (res) {

                        calendar.fullCalendar('renderEvent',{
                            title: res.event.title,
                            start: new Date(res.event.showDate),

                            className: 'label-success',
                            creater: res.event.creater,
                            createTime: res.event.createTime,
                            content: res.event.content,
                            eid: res.event.eid
                        }, true);
                        
                        layer.close(index)
                    });
                }, 
                btn2: function(index){
                    layer.close(index);
                }
            });

            calendar.fullCalendar('unselect');
        },
        eventClick: function (calEvent, jsEvent, view) {
            
            com.focusPage('#showEvent [name="title"]').html(calEvent.title),
            com.focusPage('#showEvent [name="content"]').html(calEvent.content),
            com.focusPage('#showEvent [name="creater"]').html(calEvent.creater.currentName),
            com.focusPage('#showEvent [name="createTime"]').html(calEvent.createTime)
            
            layer.open({
                type: 1,
                title: false,
                content: com.focusPage("#showEvent"),
                area: "300px",
                btn: ["删除", "取消"],
                yes: function (index) {

                    com.post(api.information.deleteEvent, {
                        "event.eid": calEvent.eid
                    }, function () {
                        calendar.fullCalendar('removeEvents', function (ev) {
                            return (ev._id == calEvent._id);
                        });
                        layer.close(index);
                    });
                }, 
                btn2: function(index){
                    layer.close(index);
                }
            });
        },
        handleWindowResize: true,
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
    }));
    
    $("#closeAllPage").click(function(){
        
        $(".flpage.nav-tab").removeClass("active");
        $(".flpage.tab-pane").removeClass("active");
        $("#home #homeNav.nav.nav-tabs .flpage.nav-tab:gt(1)").remove();
        $("#home .flpage.tab-content div.flpage.tab-pane:gt(1)").remove();
        
        $("#homeNav > #operateTab").removeClass("open");
        $("#homeNav > #homeTab").addClass("active");
        $(".flpage > #homePage").addClass("active");
        
        $.breadcrumb('icon-home', ['首页']);
        
        return false;
    });
    
    $('.flpage.nav-tab').bind({
        contextmenu: function() {
            return false;
        },
        mousedown: function(e) {
            if (3 == e.which) $("#dropdown").css({'top': 1,'left': e.pageX - 190}).addClass('show');  // 右击
        }
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
        $("span[name='messageCount']").text(res.messageCount);
    }, function (res) {
        console.log("get message count fail...");
    });
}