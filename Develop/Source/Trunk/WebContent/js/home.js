jQuery(function(){

    $('#moreActivity').click(function(){
        params["notice.type"] = "活动";
        $('.breadcrumb .nav1').empty().append('<i class="icon-bookmark"></i>&nbsp;通知/活动');
        com.switchPage(api.index.moreNoticesIndex.url);
		$('.breadcrumb .nav2').hide();
		$('.breadcrumb .nav3').hide();
    });

    $('#moreNotice').click(function(){
        params["notice.type"] = "通知";
        $('.breadcrumb .nav1').empty().append('<i class="icon-bookmark"></i>&nbsp;通知/活动');
        com.switchPage(api.index.moreNoticesIndex.url);
		$('.breadcrumb .nav2').hide();
		$('.breadcrumb .nav3').hide();
    });

    com.post(api.personel.queryUserForSelfByUserId, {}, function(res){
        $(".user-info .user-name").text(res.user.currentName);

        com.showImg($("#personalPic"), res.user.userPhoto, 180, 180, '');
        com.showImg($("#userImg"), res.user.userPhoto, 30, 30, '');
    });

    com.post(api.common.wmCode, {}, function(res){
        var img = new Image();
        img.src = res.watermark;
        url = 'url("' + img.src + '")'
        $("#fl-container").css('background-size', '300px').css('background-image', url).css('bottom', '0');
    }, null, false);

    /* var img = new Image();
     img.src = params.watermark;
     url = 'url("' + img.src + '")'
     $("#fl-container").css('background-size', '300px').css('background-image', url).css('bottom', '0');*/

    loadNotices();
    loadActivities();
    loadMessageCount();
    loadTopSelf();
    queryTopInfo('decorationDesignerRank', 'designerName')

    /* initialize the calendar
     -----------------------------------------------------------------*/

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
            day: '日',
        },
        header: {
            left: 'prev,next',//prev,next today
            center: 'title',
            right: 'month'//month,agendaWeek,agendaDay
        },
        monthNames: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
        monthNamesShort: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
        dayNames: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"],
        dayNamesShort: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"],
        today: ["今天"],

        titleFormat:{
            month:"yyyy年 MMM",
            week:" yyyy年 MM.dd[ yyyy]{ '&#8212;'[MM].dd}",
            day:"yyyy.MM.dd dddd "
        },
        axisFormat : "H:mm",

        editable: true,//判断该日程能否拖动
        droppable: true, // this allows things to be dropped onto the calendar !!!

        events: [
            {
                title: '当天事件',
                start: new Date(y, m, 1),
                className: 'label-important'
            },
            {
                title: '长期事件',
                start: new Date(y, m, d-5),
                end: new Date(y, m, d-2),
                className: 'label-success'
            },
            {
                title: '其他事件(时间提示)',
                start: new Date(y, m, d-3, 16, 0),
                allDay: false
            }],//初始化事件
        drop: function(date, allDay) {

            // retrieve the dropped element's stored Event Object
            var originalEventObject = $(this).data('eventObject');
            var $extraEventClass = $(this).attr('data-class');

            // we need to copy it, so that multiple events don't have a reference to the same object
            var copiedEventObject = $.extend({}, originalEventObject);

            // assign it the date that was reported
            copiedEventObject.start = date;
            copiedEventObject.allDay = allDay;
            if($extraEventClass) copiedEventObject['className'] = [$extraEventClass];

            // render the event on the calendar
            // the last `true` argument determines if the event "sticks" (http://arshaw.com/fullcalendar/docs/event_rendering/renderEvent/)
            $('#calendar').fullCalendar('renderEvent', copiedEventObject, true);

            // is the "remove after drop" checkbox checked?
            if ($('#drop-remove').is(':checked')) {
                // if so, remove the element from the "Draggable Events" list
                $(this).remove();
            }

        },// this function is called when something is dropped

        selectable: true,
        selectHelper: true,
        select: function(start, end, allDay) {

            bootbox.prompt("New Event Title:", function(title) {
//				if (title !== null) {
                if (title) {
                    calendar.fullCalendar('renderEvent',
                        {
                            title: title,
                            start: start,
                            end: end,
                            allDay: allDay
                        },
                        true // make the event "stick"
                    );
                }
            });

            calendar.fullCalendar('unselect');

        },
        eventClick: function(calEvent, jsEvent, view) {

            var form = $("<form class='form-inline'><label>Change event name &nbsp;</label></form>");
            form.append("<input class='middle' autocomplete=off type=text value='" + calEvent.title + "' /> ");
            form.append("<button type='submit' class='btn btn-sm btn-success'><i class='icon-ok'></i> Save</button>");

            var div = bootbox.dialog({
                message: form,

                buttons: {
                    "delete" : {
                        "label" : "<i class='icon-trash'></i> Delete Event",
                        "className" : "btn-sm btn-danger",
                        "callback": function() {
                            calendar.fullCalendar('removeEvents' , function(ev){
                                return (ev._id == calEvent._id);
                            })
                        }
                    } ,
                    "close" : {
                        "label" : "<i class='icon-remove'></i> Close",
                        "className" : "btn-sm"
                    }
                }
            });

            form.on('submit', function(){
                calEvent.title = form.find("input[type=text]").val();
                calendar.fullCalendar('updateEvent', calEvent);
                div.modal("hide");
                return false;
            });

            //console.log(calEvent.id);
            //console.log(jsEvent);
            //console.log(view);

            // change the border color just for fun
            //$(this).css('border-color', 'red');

        },

        handleWindowResize : true,

        firstDay: 1,

        /*viewDisplay: function (view) {
         var viewStart = $.fullCalendar.formatDate(view.start, "yyyy-MM-dd HH:mm:ss");
         var viewEnd = $.fullCalendar.formatDate(view.end, "yyyy-MM-dd HH:mm:ss");
         $("#calendar").fullCalendar('removeEvents');//清空事件

         console.log(viewStart + ' ' + viewEnd);

         $.getJSON("data/events.json", { start: viewStart, end: viewEnd }, function (data) {

         var resultCollection = data.events;
         $.each(resultCollection, function (index, term) {
         $("#calendar").fullCalendar('renderEvent', term, true);
         });

         }); //把从后台取出的数据进行封装以后在页面上以fullCalendar的方式进行显示
         },*///动态把数据查出，按照月份动态查询

        dayClick: function (date, allDay, jsEvent, view) {
            var selectdate = $.fullCalendar.formatDate(date, "yyyy-MM-dd");//选择当前日期的时间转换

            return false;
        },//日期点击后弹出的jq ui的框，添加日程记录

        loading: function (bool) {
            if (bool) $('#loading').show();
            else $('#loading').hide();
        },

        eventDrop: function(calEvent, dayDelta, minuteDelta, allDay, revertFunc, jsEvent, ui, view){
            alert(1)
            /*
             9.8.1. dayDelta: 保存了这次拖动导致该日程事件移动了多少天, 向前为正数, 向后为负数.
             9.8.2. minuteDelta: 保存了这次拖动导致该日程事件移动了多少分钟, 向前为正数, 向后为负数. 该值只有在agenda view下有效.
             9.8.3. allDay: 如果在month view下移动, 或在agenda view下移动到all-day区域, 则allDay为true, 移动到agenda view的其他区域则为false
             9.8.4. revertFunc: 调用该方法, 可以将刚才的拖动恢复到原状. 这个方法多用于ajax的提交, 移动之后, 提交数据到后台, 如果后台更新失败, 根据返回消息, 调用这个方法, 可以使页面回复原状.
             9.8.5. eventResizeStart, eventResizeStop: function(calEvent, jsEvent, ui, view): 在一个日程事件改变大小之前之后发生(不一定要改变成功.) calEvent保存了日程事件信息(date, title, 等等)
             9.8.6. eventResize: function(calEvent, dayDelta, minuteDelta, revertFunc, jsEvent, ui, view): 在日程事件改变大小并成功后调用, 参数和eventDrop参数用法一致.
             */
        },

        eventResize: function(calEvent, dayDelta, minuteDelta, revertFunc, jsEvent, ui, view){
            alert(2)
        },
        weekMode : 'variable',

    });

    //$('#calendar').fullCalendar('gotoDate', y, m);

    //$('#myTab4 li:eq(0) a').trigger('click');
    
    $('#calendarTab').removeClass('active');
    $('#calendarPage').removeClass('in active');

});

function loadNotices(){

    var img = new Image();
    img.src = params.watermark;
    url = 'url("' + img.src + '")'
    $(".page-content").css('background-size', '300px').css('background-image', url).css('bottom', '0');

    var options = {
        "paging.rows":5,
        "paging.page":1,
        "notice.type": "通知",
    }

    com.post(api.information.pageNoticeForDeptAValid, options, function(res){
        $("#noticeList").empty();
        $.each(res.paging.data, function(i, v){
            getNoticeDOM(v).appendTo($("#noticeList"));
        });
    });
}

function loadActivities(){

    var options = {
        "paging.rows":5,
        "paging.page":1,
        "notice.type": "活动",
    }

    com.post(api.information.pageNoticeForDeptAValid, options, function(res){
        $("#activityList").empty();
        $.each(res.paging.data, function(i, v){
            getNoticeDOM(v).appendTo($("#activityList"));
        });
    });
}

function getNoticeDOM(notice){
    var $wrap = $('<div class="alert alert-info clearfix" style="padding:5px 12px;"></div>');
    var $title = $('<div><i class="icon-hand-right green"></i></div>');
    var $theme = $('<strong style="margin-left:7px;">'+notice.theme+' </strong>').appendTo($title);

    var priorityStyle = "label-warning";

    $('<small class="detail" style="cursor:pointer">  [详细]</small>').on(ace.click_event, function(){
        $.gritter.add({
            title: notice.theme,
            text: notice.contents,
            class_name: 'gritter-info gritter-center'
        });

        return false;
    }).appendTo($theme);

    if(notice.priority == "紧急"){
        priorityStyle = "label-danger";
    }else if(notice.priority == "重要"){
        priorityStyle = "label-warning";
    }else if(notice.priority == "普通"){
        priorityStyle = "label-yellow";
    }

    $('<span class="label arrowed-in pull-right" style="line-height: 17px;">' + notice.priority+'</span>').addClass(priorityStyle).appendTo($title);
    var $contents = $('<div class="col-xs-12"><div style="text-overflow: ellipsis;white-space: nowrap;overflow: hidden;margin-right:50px;">'
        + notice.contentsText+'</div><abbr title="' + notice.contentsText+'"></abbr></div>');
    var $bottomInfo = $('<small><div class="pull-right"><span><i class="icon-time bigger-110"></i>&nbsp;'
        + notice.startTime + ' 至 ' + notice.endTime + '</span>&nbsp;&nbsp;<span><i class="icon-user bigger-110"></i>&nbsp;'
        + notice.user.userName + '</span>&nbsp;&nbsp;</div></small>');
    if(notice.filePath!=undefined && notice.filePath != null && notice.filePath != ""){
        $(".pull-right", $bottomInfo).append('<span><i class="icon-download-alt bigger-110"></i>&nbsp;<a href=' + config.media + notice.filePath + "?t=" + new Date().getTime()+' onclick="window.open(this.href); return false;">下载附件</a></span>');
    }

    $wrap.append($title).append($contents).append($bottomInfo);

    return $wrap;
}

function loadMessageCount(){
    com.post(api.information.countMessage, {}, function(res){
        if(res.messageCount == 0){
            $("#messageCount").remove();
        }else{
            if($("#messageCount").length == 0){
                $("#messageBtn").append("<span id='messageCount' class='badge badge-pink'>"+res.messageCount+"</span>");
            }else{
                $("#messageCount").text(res.messageCount);
            }
        }
    }, function(res){
        console.log("get message count fail...");
    });
}

function queryTopInfo(url, name){
    var url = api.report[url];

    var topTable = $('.top-table').html("");

    com.post(url, {}, function(res){
        var topList = "";

        $.each(res.ranks, function(i, v){

            var _name = v[name];
            var _rank = v["rank"];

            var rankImg = '';

            var rankLi = $("<li></li>");
            var rankSpan = $("<span></span>").addClass("topPic").appendTo(rankLi);
            var rankNameSpan = $("<span></span>").addClass("topName").text(_name).appendTo(rankLi);

            if(_rank != null){
                var rankNameSpan = $("<span></span>").addClass("topValue").text(_rank).appendTo(rankLi);
            }

            if(i == 0){
                rankLi.addClass('bigger-150 orange');
                rankSpan.text('1');
            }else if(i == 1){
                rankLi.addClass('bigger-120 blue');
                rankSpan.text('2');
            }else if(i == 2){
                rankLi.addClass('bigger-120 blue');
                rankSpan.text('3');
            }

            rankLi.appendTo(topTable);
        });
    });
}

function loadTopSelf(opts){
    com.post(api.report.queryRankForPlace, opts, function(res){
        $("#decorationPlace").text(res.decorationPlace);
        $("#decorationRank").text(res.decorationRank);
        $("#materialPlace").text(res.materialPlace);
        $("#materialRank").text(res.materialRank);
        $("#zaterialPlace").text(res.zaterialPlace);
        $("#zaterialRank").text(res.zaterialRank);
    });
}