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

    loadNotices();
    loadActivities();
    loadMessageCount();
    loadTopSelf();
    queryTopInfo('decorationDesignerRank', 'designerName', '设计分区业绩排名');

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

                    "save" : {
                        "label" : "<i class='icon-check'></i> 确认",
                        "className" : "btn-sm btn-success",
                        "callback": function() {

                            var validator = com.validate('eventadding');
                            if(validator){
                                return false;
                            }

                            var params = {
                                "event.title": $('[name="title"]', form).val(),
                                "event.content": $('[name="content"]', form).val(),
                                "event.showDate": $.fullCalendar.formatDate(start, "yyyy-MM-dd")
                            };

                            com.post(api.information.addEvent, params, function(res){

                                calendar.fullCalendar('renderEvent',
                                    {
                                        title: res.event.title,
                                        start: new Date(res.event.showDate),

                                        className: 'label-success',
                                        creater : res.event.creater,
                                        createTime : res.event.createTime,
                                        content : res.event.content,
                                        eid : res.event.eid
                                    },
                                    true // make the event "stick"
                                );
                            });
                        }
                    } ,
                    "close" : {
                        "label" : "<i class='icon-remove'></i> 取消",
                        "className" : "btn-sm"
                    }
                }
            });

            calendar.fullCalendar('unselect');

        },
        eventClick: function(calEvent, jsEvent, view) {

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

                    "delete" : {
                        "label" : "<i class='icon-trash'></i> 删除",
                        "className" : "btn-sm btn-danger",
                        "callback": function() {

                             com.post(api.information.deleteEvent, {
                                 "event.eid": calEvent.eid
                             }, function(){
                                 calendar.fullCalendar('removeEvents' , function(ev){
                                     return (ev._id == calEvent._id);
                                 })
                             });


                        }
                    } ,
                    "close" : {
                        "label" : "<i class='icon-remove'></i> 取消",
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
        },

        handleWindowResize : true,

        firstDay: 1,

        events: function(start, end, callback){

            var viewStart = $.fullCalendar.formatDate(start, "yyyy-MM-dd");
            var viewEnd = $.fullCalendar.formatDate(end, "yyyy-MM-dd");
            $("#calendar").fullCalendar('removeEvents');//清空事件

            com.post(api.information.queryEvent, {"event.beginDate" : viewStart, "event.endDate" :  viewEnd}, function(data){

                var resultCollection = data.events;

                if(!resultCollection.length) return;

                var events = [];

                $.each(resultCollection, function (index, term) {

                    var start = new Date(term.showDate);
                    var end = new Date(term.endDate || term.showDate);

                    events.push({
                        title: term.title,
                        start: start,

                        className: term.type == 1? 'label-info' : term.type == 3 ? 'label-danger' : 'label-success',
                        creater : term.creater,
                        createTime : term.createTime,
                        content : term.content,
                        eid : term.eid
                    });
                });

                callback(events);

            }, null);//把从后台取出的数据进行封装以后在页面上以fullCalendar的方式进行显示
        },

        viewDisplay: function (view) {

        },//动态把数据查出，按照月份动态查询

        dayClick: function (date, allDay, jsEvent, view) {
            var selectdate = $.fullCalendar.formatDate(date, "yyyy-MM-dd");//选择当前日期的时间转换

            return false;
        },//日期点击后弹出的jq ui的框，添加日程记录

        loading: function (bool) {
            if (bool) $('#loading').show();
            else $('#loading').hide();
        },
        weekMode : 'variable',

    });

    //$('#calendar').fullCalendar('gotoDate', y, m);
    //$('#myTab4 li:eq(0) a').trigger('click');

    $('#calendarTab').removeClass('active');
    $('#calendarPage').removeClass('in active');

    $('#calendarTab').click(function(){
        setTimeout("$('#calendar').fullCalendar('rerenderEvents')", 500)
    });

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

function queryTopInfo(url, name, info){
	var url = api.report[url];
	
	var topTable = $('.top-table').html("");
	
	$('.nowTopType').html(info);
	
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
				$('<i></i>').addClass('icon-trophy').appendTo(rankSpan);
			}else if(i == 1){
				rankLi.addClass('bigger-120 blue');
				$('<i></i>').addClass('icon-trophy').appendTo(rankSpan);
			}else if(i == 2){
				rankLi.addClass('bigger-120 blue');
				$('<i></i>').addClass('icon-trophy').appendTo(rankSpan);
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