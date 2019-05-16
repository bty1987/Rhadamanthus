
jQuery(function ($) {

    var drawline = {
        saveBtn: null,
        cancellBtn: null,

        items: {
            dlid: com.focusPage("#dlid"),
            actualDate: com.focusPage("#actualDate"),
            startTime: com.focusPage("#startTime"),
            endTime: com.focusPage("#endTime"),
            drawLineGroup: com.focusPage("#drawLineGroup")
        }
    };

    drawline.saveBtn = com.focusPage("#saveBtn").on("click", saveData);
    drawline.cancelBtn = com.focusPage("#cancelBtn");

    drawline.applyModal = com.focusPage("#applyModal");
    drawline.editModal = com.focusPage("#editModal");

    com.post(api.data.queryDrawlineGroup, {}, function (res) {
        drawline.items.drawLineGroup.bindData(res.drawLineGroups, 'gid', 'name');
    });

    var displayFunc = (function () {

        var renderList = function (tableId, listData) {
            var $tableWrap = com.focusPage('#' + tableId);
            var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');

            if (listData && listData.length) {
                $.each(listData, function (i, v) {
                    creatLine(v).appendTo($ul);
                });

                $ul.appendTo($tableWrap);
            }
        };

        var creatLine = function (v) {

            var $liLine = $('<li></li>').addClass('item-orange clearfix');
            var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(v.decoration.orderId));
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

            var $btnDraw = $('<a></a>').addClass('btn btn-minier btn-yellow').html('放线');

            var propertyArr = [
                ["楼盘地址:", v.decoration.house.village.name + ' ' + v.decoration.house.houseNumber, "grey"],
                ["设计师:", v.decoration.designer.currentName, "grey"],
                ["面积:", v.decoration.house.buildArea, "blue"],
                ["申请人:", v.appler.currentName, "grey"],
                ["申请时间:", v.applayTime, "green"],
                ["放线次数:", v.count, "blue"],
                ["描述:", v.content, "grey"]
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
                showEdit(v);
            });

            return $liLine;
        };

        return {
            init: function (tableId, listData) {
                com.focusPage('#' + tableId).html(null);
                renderList(tableId, listData);
            },
            drawLine: function (v) {
                return creatLine(v);
            }
        }
    })();

    var searcher = new Searcher();
    searcher.init(["c_orderId", "c_designer", "c_salesman"], "condList", api.construction.pageDrawLineForPlan, function (data) {
        displayFunc.init('resultList', data);
    }, "pagenation", "drawLineApplyPostData");
    com.focusPage("#condList").append('<button id="showDrawLineApplyInfos" style="marg" class="btn btn-xs btn-yellow btn-search">申请信息</button>');

    function showEdit(v) {

        com.clearValidator();

        com.cleanItems(drawline.items);

        drawline.items.dlid.val(v.dlid);
        drawline.items.actualDate.datepicker('update', v.applayTime);
        drawline.items.drawLineGroup.get(0).selectedIndex = 0;

        drawline.editModal.modal("show");
    }

    function saveData() {

        if (com.validate("editModal")) {
            return falsse;
        }

        var start = Date.parse(drawline.items.actualDate.val().replace("-", "/") + " " + drawline.items.startTime.val());
        var end = Date.parse(drawline.items.actualDate.val().replace("-", "/") + " " + drawline.items.endTime.val());

        if (start == NaN || end == NaN || start >= end) {
            com.showAlert(com.info,"起始时间和结束时间非法");
            return;
        }
        
        var Group = drawline.items.drawLineGroup.val();
        if (Group == null || Group == '') {
            com.showAlert(com.info,"放线小组不能为空");
            return false;
        }
        
        var options = {
            "drawLine.dlid": drawline.items.dlid.val(),
            "drawLine.startTime":drawline.items.actualDate.val()+" "+drawline.items.startTime.val(),
            "drawLine.endTime": drawline.items.actualDate.val()+" "+drawline.items.endTime.val(),
            "drawLine.drawLineGroup.gid": drawline.items.drawLineGroup.val()
        };

        com.post(api.construction.resetDrawLine, options, function (res) {
            com.showAlert(com.info, "操作成功");
            searcher.doSearch();
        });
        
        drawline.editModal.modal("hide");
    }

    com.focusPage('#showDrawLineApplyInfos').click(function () {
        drawline.applyModal.modal("show");
    });

    com.focusPage('.date-picker').datepicker().next().on(ace.click_event, function () {
        com.focusPage(this).prev().focus();
    });

    com.focusPage('#startTime').timepicker({
        minuteStep: 1,
        showSeconds: false,
        showMeridian: false
    });

    com.focusPage('#endTime').timepicker({
        minuteStep: 1,
        showSeconds: false,
        showMeridian: false
    });

    drawline.applyModal.on('shown.bs.modal', function (e) {
        initPlan();
    });

    function initPlan() {

        com.focusPage('#calendar').fullCalendar('destroy');
        com.focusPage('#calendar').fullCalendar('today');

        com.focusPage('#calendar').fullCalendar($.extend(com.calendardefault, {
            events: function (start, end, callback) {
                
                var startTime = com.dateFormat(new Date(start));
                var endTime = com.dateFormat(new Date(end));

                var options = {
                    "drawLine.startTime": startTime,
                    "drawLine.endTime": endTime
                };

                com.post(api.construction.countDrawLine, options, function (res) {
                    
                    var counts = res.count;
                    var events = [];

                    for (var i in counts) {

                        var _ = counts[i];
                        var _date = _[1] + "";

                        var event = {
                            title: _[0] + _[2] + "个",
                            start: new Date(_date.substr(0, 4), _date.substr(4, 2) - 1, _date.substr(6, 2)),
                            allDay: true
                        };

                        events.push(event);
                    }

                    callback(events);
                });
            }
        }));
    }
});
