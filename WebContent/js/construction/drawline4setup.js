jQuery(function ($) {
    
    var drawline = {
            
        saveBtn: com.focusPage("#saveBtn"),
        cancelBtn: com.focusPage("#cancelBtn"),
        
        deployedBtn: com.focusPage("#deployedBtn"),
        
        orderId: null,
        
        items: {
            
            dlid: com.focusPage("#dlid"),
            
            actualDate: com.focusPage("#actualDate"),
            startTime: com.focusPage("#startTime"),
            endTime: com.focusPage("#endTime"),
            drawLineGroup: com.focusPage("#drawLineGroup"),
            
            orderInfos: com.focusPage("#orderInfos"),
            supervisor: com.focusPage("#supervisor"),

            deployedBtn: com.focusPage("#setupModal"),
            cancelBtn : com.focusPage("#cancelBtn"),

            setupModal : com.focusPage("#setupModal"),

            editModal : com.focusPage("#editModal")


        },
        
        drawLineGroup: [],

        status: {}
    };

        drawline.items.setupModal.on('hide.bs.modal', function () {com.cleanTypeahead("supervisor")});
        drawline.items.setupModal.on('shown.bs.modal', function (e) {initPlan()});


    com.post(api.ds.construction, {}, function(res){
        $.each(res.drawLineStatus, function(i, v){
            drawline.status[v.key] = v.value;
        })
    }, null, false);

    com.post(api.data.queryDrawlineGroup, {}, function (res) {
        com.focusPage("#drawLineGroup").bindData(res.drawLineGroups, 'gid', 'name');

        $.each(res.drawLineGroups, function (i, v) {
            drawline.drawLineGroup.push(v.name);
        });
    }, null, false);

    com.focusPage('.timepicker').timepicker({
        minuteStep: 1,
        showSeconds: false,
        showMeridian: false
    });

    com.initTypeahead('supervisor', api.personel.queryUserByPinyin, "pinyinName", {"departmentType.name": "工程部", "user.status": 0}, "userBases", "userId", "currentName", null);

    var displayFunc = (function () {

        var renderList = function (tableId, listData) {
            if (listData && listData.length) {
                $.each(listData, function (i, v) {
                    creatLine(v);
                });
            }
        };

        var creatLine = function (v) {
            
            var gid = v.group.gid;

            var $tableWrap = com.focusPage("#group" + gid);
            
            if ($tableWrap.length == 0) {
                
                var resultList = com.focusPage("#resultList");
                
                var groupDiv = $("<div></div>").addClass("col-xs-6 col-md-6 widget-container-span ui-sortable").appendTo(resultList);
                var groupWidgetBox = $("<div></div>").addClass("widget-box transparent").appendTo(groupDiv);
                var groupWidgetHeader = $("<div></div>").addClass("widget-header").appendTo(groupWidgetBox);
                
                var groupH5 = $("<h4></h4>").appendTo(groupWidgetHeader);
                var groupStrong = $("<strong></strong>").text(v.group.name).appendTo(groupH5);
                var groupWidgetBody = $("<div></div>").addClass("widget-body").appendTo(groupWidgetBox);
                var groupWidgetBodyInner = $("<div></div>").addClass("widget-body-inner").css("display", "block").appendTo(groupWidgetBody);
                var resultList = $('<div></div>').attr("id", "group" + gid).addClass("clearfix tab-pane active").appendTo(groupWidgetBodyInner);

                $tableWrap = resultList;
            }

            var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable').appendTo($tableWrap);
            var $liLine = $('<li></li>').addClass('item-orange clearfix').appendTo($ul);
            var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(v.decoration.orderId));
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

            var $btnEdit = $('<a></a>').addClass('btn btn-minier btn-yellow').html('编辑');
            var $btnDeplory = $('<a></a>').addClass('btn btn-minier btn-success').html('人员部署');
            var $btnReset = $('<a></a>').addClass('btn btn-minier btn-warning').html('重置');
            var $successBtn = $('<a></a>').addClass('btn btn-minier btn-inverse').html('放线');

            var startTime=v.startTime.substr(11);
            var endTime=v.endTime.substr(11);
            var actualTime=v.actualTime;

            var propertyArr = [
                ["楼盘地址:", v.decoration.house.village.name + ' ' + v.decoration.house.houseNumber, "grey"],
                ["面积:", v.decoration.house.buildArea, "blue"],
                ["合同额:", v.decoration.orderTotalPrice, "blue"],
                ["申请人:", v.appler.currentName, "grey"],
                ["监理:", v.decoration.supervisor.currentName, "grey"],
                ["放线时间:", actualTime, "green"],
                ["开始时间:", startTime, "green"],
                ["结束时间:", endTime, "green"],
                ["报价版本:", v.decoration.version.name, "green"],
                ["状态:", drawline.status[v.status], "red"],
                ["描述:", v.content, "grey"]
            ];

            $.each(propertyArr, function (index, value) {
                var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                $liProperty.appendTo($ulProperty);
            });

            if (v.status == 1) {
                $divBtnWrap.append($btnEdit).append($btnDeplory).append($btnReset).append($successBtn).appendTo($h3);
            }

            $liLine.append($h3).append($ulProperty);

            $btnEdit.click(function () {
                showEdit(v);
            });

            $btnDeplory.click(function () {
                showSetup(v);
            });

            $btnReset.click(function () {
                reset(v.dlid);
            });

            $successBtn.click(function () {
                success(v);
            });
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
    searcher.init(["c_orderId", "c_drawLineStatus", "c_actualDate"], "condList", api.construction.queryDrawLine, function (data) {
        com.focusPage("#resultList").html("");
        displayFunc.init('resultList', data);

    }, "pagenation", "drawLineSetupPostData", null, true, "drawLines");

    com.focusPage("#condList").append('<button id="showDrawLineApplyInfos" style="marg" class="btn btn-xs btn-yellow btn-search">申请信息</button>');
    com.focusPage('#showDrawLineApplyInfos').on('click', function () {
        drawline.items.applyModal.modal("show");
    });

    function showEdit(v) {
        
        drawline.items.dlid.val(v.dlid);
        drawline.items.actualDate.datepicker('update', v.startTime.substr(0,10));
        drawline.items.startTime.val(v.startTime.substr(11, 5));
        drawline.items.endTime.val(v.endTime.substr(11, 5));
        drawline.items.drawLineGroup.val(v.group.gid);
        
        drawline.items.editModal.modal("show");
    }

    function showSetup(v) {
        
        if (com.validate("setupModal")) {
            return false;
        }
        
        var options = {
            "construction.orderId": v.decoration.orderId
        };
        
        com.post(api.construction.queryConstructionByOrderId, options, function (res) {
            
            if(res.construction.supervisor){
                com.updateTypeahead("supervisor", res.construction.supervisor.userId, res.construction.supervisor.userName);
            }else{
                com.cleanTypeahead("supervisor");
            }
        });

        drawline.items.orderInfos.html(v.decoration.orderId + " " + v.decoration.house.village.name);
        
        drawline.orderId = v.decoration.orderId;
        
        drawline.items.setupModal.modal("show");
    }

    function reset(dlid) {
        com.showConfirm("确认重置申请吗?", function(){
            com.post(api.construction.failureDrawLine, {"drawLine.dlid": dlid}, function (res) {
                com.showAlert(com.info, "操作成功");
                searcher.doSearch();
            });
        });
    }

    function saveData() {
        
        if (com.validate("editModal")) {
            return false;
        }
        
        var _date = drawline.items.actualDate.val();
        var _start = drawline.items.startTime.val();
        var _end = drawline.items.endTime.val();

        var start = Date.parse(_date.replace("-", "/") + " " + _start);
        var end = Date.parse(_date.replace("-", "/") + " " + _end);

        if (start == NaN || end == NaN || start >= end) {
            com.showAlert(com.warning, "起始时间和结束时间非法");
            return false;
        }

        var options = {
            "drawLine.dlid": drawline.items.dlid.val(),
            "drawLine.startTime": _date + " " + _start,
            "drawLine.endTime": _date + " " + _end,
            "drawLine.group.gid": drawline.items.drawLineGroup.val()
        };
        
        com.post(api.construction.resetDrawLine, options, function (res) {
            com.showAlert(com.info, "操作成功");
            searcher.doSearch();
            
            drawline.items.editModal.modal("hide");
        });
    }

    function deploved() {
        
        if (com.validate("setupModal")) {
            return false;
        }

        var options = {
            "construction.orderId": drawline.orderId,
            "construction.supervisor.userId": com.typeahead("supervisor")
        };

        com.post(api.construction.updateConstructionByOrderId, options, function (res) {
            com.showAlert(com.info, "操作成功");
            searcher.doSearch();
            
            drawline.items.setupModal.modal("hide");
        });
    }

    function success(v) {

        var option = {"drawLine.dlid": v.dlid};

        com.post(api.construction.successDrawLine, option, function (res) {
            com.showAlert(com.info, "放线成功");
            searcher.doSearch();
        });
    }

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


