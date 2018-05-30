jQuery(function ($) {

    var drawLineApply = {
        saveBtn: null,
        cancellBtn: null,
        modal: null,
        drawLineApplyItems: {},

        drawLineGroup: null,
        drawLineDateCount: null,
        up: false,
        editFlag: false
    };

    drawLineApply.saveBtn = $("#saveBtn").on("click", saveData);

    drawLineApply.cancelBtn = $("#cancelBtn");

    drawLineApply.drawLineApplyModal = $("#drawLineApplyModal");

    drawLineApply.drawLineModal = $("#drawLineModal");

    drawLineApply.drawLineApplyItems.dlId = $("#dlId");

    drawLineApply.drawLineApplyItems.actualDate = $("#actualDate");

    drawLineApply.drawLineApplyItems.startTime = $("#startTime");

    drawLineApply.drawLineApplyItems.endTime = $("#endTime");

    drawLineApply.drawLineApplyItems.drawLineGroup = $("#drawLineGroup");

    com.post(api.data.queryDrawlineGroup, {}, function (res) {
        if (res.drawLineGroups == null || res.drawLineGroups == "") {
            drawLineApply.up = true;
        }
        drawLineApply.drawLineGroup = res.drawLineGroups;
        drawLineApply.drawLineApplyItems.drawLineGroup.bindData(res.drawLineGroups, 'gid', 'name');
    });

    var displayFunc = (function () {

        var renderList = function (tableId, listData) {
            var $tableWrap = $('#' + tableId);
            var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');

            if (listData && listData.length) {
                $.each(listData, function (i, v) {
                    var $liLine = creatLine(v);

                    $liLine.appendTo($ul);
                });

                $ul.appendTo($tableWrap);
            }
        };

        var creatLine = function (v) {

            var $liLine = $('<li></li>').addClass('item-orange clearfix');
            var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(v.orderId));
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

            var $btnDraw = $('<a></a>').addClass('btn btn-minier btn-yellow').html('放线');

            var propertyArr = [
                ["楼盘地址:", v.village + ' ' + v.houseNumber, "grey"],
                ["设计师:", v.designer, "grey"],
                ["面积:", v.houseArea, "blue"],
                ["申请人:", v.applayUser, "grey"],
                ["申请时间:", v.applayTime, "green"],
                ["放线次数:", v.count, "blue"],
                ["描述:", v.content, "grey"],
            ];

            $.each(propertyArr, function (index, value) {
                var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                $liProperty.appendTo($ulProperty);
            });

            $divBtnWrap.append($btnDraw).appendTo($h3);

            $liLine.append($h3).append($ulProperty);

            $btnDraw.click(function () {
                drawLine(v);
            });

            return $liLine;
        };

        return {
            init: function (tableId, listData) {
                $('#' + tableId).html(null);
                renderList(tableId, listData);
            },
            drawLine: function (v) {
                return creatLine(v);
            }
        }
    })();

    var searcher = new Searcher();
    searcher.init(["c_orderId", "c_designer", "c_salesman"], "condList", api.drawline.pageDrawLineForPlan, function (data) {
        displayFunc.init('resultList', data);
    }, "pagenation", "drawLineApplyPostData");
    $("#condList").append('<button id="showDrawLineApplyInfos" style="marg" class="btn btn-xs btn-yellow btn-search">申请信息</button>');

    function drawLine(v) {

        com.clearValidator();

        com.cleanItems(drawLineApply.drawLineApplyItems);

        drawLineApply.drawLineApplyItems.dlId.val(v.dlId);

        drawLineApply.drawLineApplyItems.actualDate.datepicker('update', v.applayTime);

        drawLineApply.drawLineApplyItems.drawLineGroup.get(0).selectedIndex = 0;

        drawLineApply.drawLineModal.modal("show");
        if (drawLineApply.up) {
            bootbox.alert("无可用放线小组");
        }
    }

    function saveData() {

        bootbox.confirm("确认提交申请吗?", function (res) {
            if (res) {
                if (com.validate("drawLineModal")) {
                    return;
                }

                var start = Date.parse(drawLineApply.drawLineApplyItems.actualDate.val().replace("-", "/") + " " + drawLineApply.drawLineApplyItems.startTime.val());

                var end = Date.parse(drawLineApply.drawLineApplyItems.actualDate.val().replace("-", "/") + " " + drawLineApply.drawLineApplyItems.endTime.val());

                if (start == NaN || end == NaN || start >= end) {
                    bootbox.alert("起始时间和结束时间非法");
                    return;
                }
                var Group = drawLineApply.drawLineApplyItems.drawLineGroup.val();
                if (Group == null || Group == '') {
                    bootbox.alert("放线小组不能为空");
                    return;
                }
                var options = {

                    "drawLine.dlId": drawLineApply.drawLineApplyItems.dlId.val(),

                    "drawLine.actualDate": drawLineApply.drawLineApplyItems.actualDate.val(),

                    "drawLine.startTime": drawLineApply.drawLineApplyItems.startTime.val(),

                    "drawLine.endTime": drawLineApply.drawLineApplyItems.endTime.val(),

                    "drawLine.gid": drawLineApply.drawLineApplyItems.drawLineGroup.val()
                };

                com.post(api.drawline.resetDrawLine, options, function (res) {
                    com.showAlert(com.info, "操作成功");
                    searcher.doSearch();
                });
                drawLineApply.drawLineModal.modal("hide");
            } else {
                return;
            }
        });
    }

    $('#showDrawLineApplyInfos').click(function () {
        drawLineApply.drawLineApplyModal.modal("show");
    });

    $('.date-picker').datepicker().next().on(ace.click_event, function () {
        $(this).prev().focus();
    });

    $('#startTime').timepicker({

        minuteStep: 1,

        showSeconds: false,

        showMeridian: false
    });

    $('#endTime').timepicker({

        minuteStep: 1,

        showSeconds: false,

        showMeridian: false
    });

    drawLineApply.drawLineApplyModal.on('shown.bs.modal', function (e) {

        initPlan();
    });

    function initPlan() {

        $('#calendar').fullCalendar('destroy');

        $('#calendar').fullCalendar('today');

        $('#calendar').fullCalendar({
            buttonText: {
                today: '今天', month: '月', week: '周', day: '日', prev: '上一月', next: '下一月'
            },

            dayNames: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"],

            dayNamesShort: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"],

            monthNames: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],

            eventLimit: true,

            events: function (start, end, callback) {

                var startTime = start.getFullYear() + "-" + (start.getMonth() + 1) + "-" + start.getDate() + " 00:00:00";

                var endTime = end.getFullYear() + "-" + (end.getMonth() + 1) + "-" + end.getDate() + " 23:59:59";

                var options = {
                    "drawLine.startTime": startTime,
                    "drawLine.endTime": endTime,
                }

                com.post(api.drawline.countDrawLineByDate, options, function (res) {

                    drawLineApply.drawLineDateCount = res.drawLineDateCount;

                    var events = [];

                    for (var i in drawLineApply.drawLineDateCount) {

                        var s = i.split('-');
                        var drawLineDateCount = drawLineApply.drawLineDateCount[i];

                        for (var j in drawLineApply.drawLineDateCount[i]) {

                            var _ = drawLineDateCount[j];

                            var event = {
                                title: j + _ + "个",
                                start: new Date(s[0], s[1] - 1, s[2]),
                                allDay: true
                            }

                            events.push(event);
                        }
                    }

                    callback(events);
                });
            }
        });
    }
});
