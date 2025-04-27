jQuery(function($) {

    var measure = {

        dmid: null,

        btns: {
            saveInfoBtn: com.focusPage("#saveInfoBtn"),
            saveBtn: com.focusPage("#saveBtn"),
            updateBtn: com.focusPage("#updateBtn"),
        },

        modals: {
            constructionInfoModal: com.focusPage("#constructionInfoModal"),
            applyModal: com.focusPage("#applyModal"),
            editModal: com.focusPage("#editModal"),
            updateModal: com.focusPage("#updateModal")
        },

        items: {

            applayTime: com.focusPage("#applayTime"),

            dmid: com.focusPage("#dlid"),
            actualDate: com.focusPage("#actualDate"),
            startTime: com.focusPage("#startTime"),
            endTime: com.focusPage("#endTime"),

            ishovel: com.focusPage("#ishovel"),
            iskey: com.focusPage("#iskey"),
            timeLimit: com.focusPage("#timeLimit"),
            finishTime: com.focusPage("#finishTime"),
            keyTime: com.focusPage("#keyTime"),
            measureTime: com.focusPage("#measureTime"),
            designTime: com.focusPage("#designTime"),
            isCeremony: com.focusPage("#isCeremony"),
            comment: com.focusPage("#comment")
        }
    };

    measure.btns.saveInfoBtn.bindClick(saveInfoData);
    measure.btns.saveBtn.bindClick(saveData);
    measure.btns.updateBtn.bindClick(updateData);

    measure.modals.constructionInfoModal.on("hide.bs.modal", function() {

        com.cleanItems(measure.items);
        com.closeTip();
    });

    measure.modals.applyModal.on("hide.bs.modal", function() {

        com.cleanItems(measure.items);
        com.closeTip();
    });

    measure.modals.editModal.on("hide.bs.modal", function() {

        com.cleanItems(measure.items);
        com.closeTip();
    });

    measure.modals.updateModal.on("hide.bs.modal", function() {

        com.cleanItems(measure.items);
        com.closeTip();
    });

    com.datetime(measure.items.applayTime);
    com.datetime(measure.items.actualDate);
    com.datetime(measure.items.finishTime);
    com.datetime(measure.items.keyTime);
    com.datetime(measure.items.measureTime);
    com.datetime(measure.items.designTime);
    com.datetime(measure.items.startTime, "time");
    com.datetime(measure.items.endTime, "time");

    measure.items.ishovel.bindData(constant.construction().constructionInfo.isHovel.datas, "key", "value");
    measure.items.iskey.bindData(constant.construction().constructionInfo.isKey.datas, "key", "value");
    measure.items.isCeremony.bindData(constant.construction().constructionInfo.isCeremony.datas, "key", "value");


    var displayFunc = (function() {

        var renderList = function(tableId, listData) {

            var $tableWrap = com.focusPage('#' + tableId);
            var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');

            if (listData && listData.length) {
                $.each(listData, function(i, v) {

                    creatLine(v).appendTo($ul);
                });

                $ul.appendTo($tableWrap);
            }
        };

        var creatLine = function(v) {

            var $liLine = $('<li></li>').addClass('item-orange clearfix');
            var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(v.decoration.orderId));
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');
//            var $btnInfo = $('<a></a>').addClass('btn btn-minier btn-yellow').html("信息");
//            var $btnUpdate = $('<a></a>').addClass('btn btn-minier btn-purple').html("更新");
            var $btnDraw = $('<a></a>').addClass('btn btn-minier btn-success').html('编辑');
            var $btnReset = $('<a></a>').addClass('btn btn-minier btn-inverse').html('重置');

            var propertyArr = [["装修单: ", v.decoration.orderId, "blue", function(btn) {

                tools.decoration.info(btn, v.decoration.orderId);
            }], ["楼盘: ", v.decoration.house.village.name, "grey", function(btn) {

                tools.house.info(btn, v.decoration.house.hid);
            }], ["楼号: ", v.decoration.house.houseNumber, "grey"], ["客户: ", v.decoration.customer.name, "grey", function(btn) {

                tools.customer.info(btn, v.decoration.customer.cid);
            }], ["设计师: ", v.decoration.designer.currentName, "grey", function(btn) {

                tools.personel.info(btn, v.decoration.designer.userId);
            }], ["监理: ", v.decoration.supervisor == null ? "" : v.decoration.supervisor.currentName, "grey", function(btn) {

                tools.personel.info(btn, v.decoration.supervisor.userId);
            }], ["面积: ", v.decoration.house.buildArea, "blue"], 
            
            	["装修业务: ", constant.decoration().decoration.typeness.keys[v.decoration.typeness], "red"],
            	["装修状态: ", constant.decoration().decoration.status.keys[v.decoration.status], "red"],
            	["合同额: ", v.decoration.orderTotalPrice, "blue"], ["报价版本: ", v.decoration.version.name, "grey"], 
            	["申请人: ", v.appler.currentName, "grey", function(btn) {

                    tools.personel.info(btn, v.appler.userId);
                }],
                ["量尺时间: ", v.actualTime, "green"],
                ["开始时间: ", v.startTime, "green"],
                ["结束时间: ", v.endTime, "green"],
                ["状态: ", constant.decoration().measure.status.keys[v.status], "red"],
            	["描述: ", v.content, "grey"]];

            $.each(propertyArr, function(index, value) {

                var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                var $b = $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);

                if (value[3]) {
                    $b.click(function() {

                        value[3]($b);
                    });
                }

                $liProperty.appendTo($ulProperty);
            });

            $divBtnWrap.append($btnDraw).append($btnReset).appendTo($h3);

            $liLine.append($h3).append($ulProperty);

//            $btnInfo.click(function() {
//
//                viewConstructionInfo(v.decoration.orderId);
//            });

            $btnDraw.click(function() {

                showEdit(v);
            });

            $btnReset.click(function() {

                reset(v.dmid);
            });

            return $liLine;
        };

        return {
            init: function(tableId, listData) {

                com.focusPage('#' + tableId).html(null);
                renderList(tableId, listData);
            },
            measure: function(v) {

                return creatLine(v);
            }
        };
    })();

    var searcher = new Searcher();
    searcher.init(['decoration-orderId', 'decoration-village', 'decoration-houseNumber', 'decoration-measure-status', 'decoration-measure-applayTime', 'decoration-measure-actualDate'], "condList", api.decoration.pageDecorationMeasure, function(data) {

        displayFunc.init('resultList', data);
    }, "pagenation", "measureApplyPostData", {"decorationMeasure.status": constant.decoration.measure.STATUS_QUEUE_INT});

//    com.focusPage("#condList").append('<button id="showmeasureApplyInfos" style="marg" class="btn btn-xs btn-yellow btn-search">申请信息</button>');

    function showUpdate(v) {

        com.clearValidator();

        measure.dmid = v.dmid;

        measure.items.applayTime.val(v.applayTime);

        measure.modals.updateModal.modal("show");
    }

    function showEdit(v) {

        com.clearValidator();

        measure.items.dmid.val(v.dmid);
        measure.items.actualDate.val(v.applayTime);
        measure.modals.editModal.modal("show");
    }

    function reset(dmid) {
console.log(dmid);
        com.showConfirm("确认重置申请吗?", function() {

            com.post(api.decoration.failureDecorationMeasure, {
                "decorationMeasure.dmid": dmid
            }, function(res) {

                com.showAlert(com.info, "操作成功");
                searcher.doSearch();
            });
        });
    }

    function updateData() {
console.log("updateData2");
        if (com.validate("updateModal")) {
            return false;
        }

        var options = {
            "decorationMeasure.dmid": measure.dmid,
            "decorationMeasure.applayTime": measure.items.applayTime.val() + " 00:00:00"
        };

        com.post(api.decoration.updateDecorationMeasure, options, function(res) {

            com.showAlert(com.info, "操作成功");
            searcher.doSearch();
        });

        measure.modals.updateModal.modal("hide");
    }

    function saveData() {

        if (com.validate("editModal")) {
            return false;
        }

        var start = Date.parse(measure.items.actualDate.val().replace("-", "/") + " " + measure.items.startTime.val());
        var end = Date.parse(measure.items.actualDate.val().replace("-", "/") + " " + measure.items.endTime.val());

        if (start == NaN || end == NaN || start >= end) {
            com.showAlert(com.info, "起始时间和结束时间非法");
            return;
        }

        var options = {
            "decorationMeasure.dmid": measure.items.dmid.val(),
            "decorationMeasure.startTime": measure.items.actualDate.val() + " " + measure.items.startTime.val(),
            "decorationMeasure.endTime": measure.items.actualDate.val() + " " + measure.items.endTime.val(),
        };

        com.post(api.decoration.applayDecorationMeasure, options, function(res) {

            com.showAlert(com.info, "操作成功");
            searcher.doSearch();
        });

        measure.modals.editModal.modal("hide");
    }

    com.focusPage('#showmeasureApplyInfos').click(function() {

        measure.modals.applyModal.modal("show");
    });

    measure.modals.applyModal.on('shown.bs.modal', function(e) {

        initPlan();
    });

    function initPlan() {

        com.focusPage('#calendar').fullCalendar('destroy');
        com.focusPage('#calendar').fullCalendar('today');

        com.focusPage('#calendar').fullCalendar($.extend(com.calendardefault, {
            events: function(start, end, callback) {

                var startTime = com.dateFormat(new Date(start));
                var endTime = com.dateFormat(new Date(end));

                var options = {
                    "measure.startTime": startTime,
                    "measure.endTime": endTime
                };

                com.post(api.construction.countmeasure, options, function(res) {

                    var counts = res.count;
                    var events = [];

                    for ( var i in counts) {

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

//    function viewConstructionInfo(orderId) {
//
//        com.post(api.construction.queryConstructionInfoByOrderId, {
//            "constructionInfo.orderId": orderId
//        }, function(res) {
//
//            data = res.constructionInfo;
//
//            measure.items.orderId = orderId;
//
//            measure.items.ishovel.val(data.ishovel);
//            measure.items.iskey.val(data.iskey);
//            measure.items.isCeremony.val(data.isCeremony);
//            measure.items.timeLimit.val(data.timeLimit);
//            if (data.finishTime != null) {
//                measure.items.finishTime.val(data.finishTime.substr(0, 10));
//            }
//            if (data.keyTime != null) {
//                measure.items.keyTime.val(data.keyTime.substr(0, 10));
//            }
//            if (data.measureTime != null) {
//                measure.items.measureTime.val(data.measureTime.substr(0, 10));
//            }
//            if (data.designTime != null) {
//                measure.items.designTime.val(data.designTime.substr(0, 10));
//            }
//            measure.items.comment.val(data.comment);
//        });
//        measure.modals.constructionInfoModal.modal("show");
//
//    }

    function saveInfoData() {

        var options = {
            "constructionInfo.orderId": measure.items.orderId,
            "constructionInfo.decoration.orderId": measure.items.orderId,
            "constructionInfo.timeLimit": measure.items.timeLimit.val(),
            "constructionInfo.ishovel": measure.items.ishovel.val(),
            "constructionInfo.iskey": measure.items.iskey.val(),
            "constructionInfo.isCeremony": measure.items.isCeremony.val(),
            "constructionInfo.finishTime": measure.items.finishTime.val() + " 00:00:00",
            "constructionInfo.keyTime": measure.items.keyTime.val() + " 00:00:00",
            "constructionInfo.measureTime": measure.items.measureTime.val() + " 00:00:00",
            "constructionInfo.designTime": measure.items.designTime.val() + " 00:00:00",
            "constructionInfo.comment": measure.items.comment.val()
        };

        com.post(api.construction.updateConstructionInfoByOrderId, options, function(res) {

            com.showAlert(com.info, "操作成功");

            measure.modals.constructionInfoModal.modal("hide");

        });
    }

});
