jQuery(function ($) {

    var drawline = {

        btns: {
            saveInfoBtn : com.focusPage("#saveInfoBtn"),
            saveBtn : com.focusPage("#saveBtn"),
            cancellBtn : com.focusPage("#cancelBtn")
        },

        modals : {
            constructionInfoModal : com.focusPage("#constructionInfoModal"),
            applyModal : com.focusPage("#applyModal"),
            editModal : com.focusPage("#editModal")
        },

        items: {
            dlid: com.focusPage("#dlid"),
            actualDate: com.focusPage("#actualDate"),
            startTime: com.focusPage("#startTime"),
            endTime: com.focusPage("#endTime"),
            drawLineGroup: com.focusPage("#drawLineGroup"),

            ishovel: com.focusPage("#ishovel"),
            iskey: com.focusPage("#iskey"),
            isCeremony: com.focusPage("#isCeremony"),
            comment: com.focusPage("#comment")
        }
    };

    drawline.btns.saveInfoBtn.bindClick(saveInfoData);
    drawline.btns.saveBtn.bindClick(saveData);

    com.datetime(drawline.items.actualDate);
    
    com.datetime(drawline.items.startTime, "time");
    com.datetime(drawline.items.endTime,"time");

    com.post(api.ds.construction, {}, function (res) {
        drawline.items.ishovel.bindData(res.isHovel, "key", "value", false);
        drawline.items.iskey.bindData(res.isKey, "key", "value", false);
        drawline.items.isCeremony.bindData(res.isCeremony, "key", "value", false);

    });

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
            var $btnInfo = $('<a></a>').addClass('btn btn-minier btn-yellow').html("信息");
            var $btnDraw = $('<a></a>').addClass('btn btn-minier btn-success').html('放线');

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

            $divBtnWrap.append($btnInfo).append($btnDraw).appendTo($h3);

            $liLine.append($h3).append($ulProperty);

            $btnInfo.click(function(){
                viewConstructionInfo(v.decoration.orderId);
            });

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
        drawline.items.actualDate.val(v.applayTime);
        drawline.items.drawLineGroup.get(0).selectedIndex = 0;

        drawline.modals.editModal.modal("show");
    }

    function saveData() {

        if (com.validate("editModal")) {
            return false;
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
            "drawLine.group.gid": drawline.items.drawLineGroup.val()

        };
        com.post(api.construction.resetDrawLine, options, function (res) {
            com.showAlert(com.info, "操作成功");
            searcher.doSearch();
        });
        
        drawline.modals.editModal.modal("hide");
    }

    com.focusPage('#showDrawLineApplyInfos').click(function () {
        drawline.modals.applyModal.modal("show");
    });

    drawline.modals.applyModal.on('shown.bs.modal', function (e) {
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

    function viewConstructionInfo(orderId) {

        com.post(api.construction.queryConstructionInfoByOrderId, {"constructionInfo.orderId": orderId}, function (res) {

            data = res.constructionInfo;

            drawline.items.orderId = orderId;

            drawline.items.ishovel.val(data.ishovel);
            drawline.items.iskey.val(data.iskey);
            drawline.items.isCeremony.val(data.isCeremony);
            drawline.items.comment.val(data.comment);
        });

        drawline.modals.constructionInfoModal.modal("show");

    }

    function saveInfoData() {

        var options = {
            "constructionInfo.orderId" : drawline.items.orderId,
            "constructionInfo.ishovel": drawline.items.ishovel.val(),
            "constructionInfo.iskey": drawline.items.iskey.val(),
            "constructionInfo.isCeremony": drawline.items.isCeremony.val(),
            "constructionInfo.comment": drawline.items.comment.val()
        };

        com.post(api.construction.updateConstructionInfoByOrderId, options, function (res) {

            com.showAlert(com.info,"操作成功");

            drawline.modals.constructionInfoModal.modal("hide");

        });
    }

});
