jQuery(function ($) {

    $('#fl-statement').statement("巡检控制", "巡检记录");

    var record = {
        saveBtn: null,
        cancellBtn: null,
        modal: null,
        recordItems: {},

        editFlag: false,
        repeatFlg: false,
    };

    record.saveBtn = $("#saveBtn").on("click", saveData);
    record.cancelBtn = $("#cancelBtn");
    record.modal = $("#recordModal").on('show.bs.modal', function (e) {
        com.clearValidator();
    });

    record.recordItems.orderId = $("#orderId");
    record.recordItems.orderAddr = $("#orderAddr");
    record.recordItems.startDate = $("#startDate");
    record.recordItems.startTime = $("#startTime");
    record.recordItems.endDate = $("#endDate");
    record.recordItems.endTime = $("#endTime");
    record.recordItems.recordDes = $("#recordDes");

    $('.date-picker').datepicker({autoclose: true});
    record.recordItems.startTime.timepicker({minuteStep: 1, showSeconds: true, showMeridian: false});
    record.recordItems.endTime.timepicker({minuteStep: 1, showSeconds: true, showMeridian: false});

    var displayFunc = (function () {
        var renderList = function (tableId, listData) {
            var $tableWrap = $('#' + tableId).empty();
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
            var that = this;
            var $liLine = $('<li></li>').addClass('item-orange clearfix');
            var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(v.orderId));
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

            var $btnEdit = $('<a></a>').addClass('btn btn-minier btn-primary').html("编辑");
            var $btnDel = $('<a></a>').addClass('btn btn-minier btn-danger').html("删除");

            var propertyArr = [
                ["楼盘地址:", v.orderAddr, "grey"],
                ["操作人:", v.operaterName, "grey"],
                ["开始时间:", v.startTime, "green "],
                ["结束时间:", v.endTime, "green"],
                ["备注:", v.recordDes, "grey"],
            ];

            $.each(propertyArr, function (index, value) {
                var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2] ? value[2] : "").appendTo($liProperty);
                $liProperty.appendTo($ulProperty);
            });

            $divBtnWrap.append($btnEdit).append($btnDel).appendTo($h3);

            $liLine.append($h3).append($ulProperty);

            $btnEdit.click(function () {
                editRecord(v);
            });

            $btnDel.click(function () {
                delRecord(v.irId);
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
    searcher.init([], "condList", api.construction.pageInspectionRecordByOrderId, function (list) {
        displayFunc.init('resultList', list);
    }, "pagenation", "inspectionRecordPostData", {
        "inspectionRecord.orderId": params.orderId
    }, false, null, function () {

        var $adda = $('<a></a>').addClass('btn btn-minier btn-success pull-left').attr('name', 'add').css("margin", "0px 3px");
        var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
        var $addspan = $('<span></span>').text('添加').appendTo($adda);

        var $addb = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('name', 'back').css("margin", "0px 3px");
        var $addi = $('<i></i>').addClass('icon-mail-forward bigger-110').appendTo($addb);
        var $addspan = $('<span></span>').text('返回').appendTo($addb);

        return [$addb, $adda];
    });

    $('a[name="add"]', '#pagenation').click(function () {
        record.editFlag = false;

        com.cleanItems(record.recordItems);

        record.recordItems.orderId.val(params.orderId);
        record.recordItems.orderAddr.val(params.orderAddr);

        record.recordItems.orderId.attr('disabled', true);
        record.recordItems.orderAddr.attr('disabled', true);

        record.modal.modal("show");
    });

    $('a[name="back"]', '#pagenation').click(function () {
        com.switchPage(api.index.inspectionIndex.url);
    });

    function editRecord(v) {
        record.editFlag = true;

        record.recordItems.orderId.val(v.orderId);
        record.recordItems.orderAddr.val(v.orderAddr);
        record.recordItems.startDate.val(v.startTime.split(' ')[0]);
        record.recordItems.startTime.val(v.startTime.split(' ')[1]);
        record.recordItems.endDate.val(v.endTime.split(' ')[0]);
        record.recordItems.endTime.val(v.endTime.split(' ')[1]);
        record.recordItems.recordDes.val(v.recordDes);

        record["inspectionRecord.irId"] = v.irId;

        record.recordItems.orderId.attr('disabled', true);
        record.recordItems.orderAddr.attr('disabled', true);

        record.modal.modal("show");
    }

    function delRecord(irId) {
        bootbox.confirm("确认删除吗?", function (res) {
            if (res) {
                com.post(api.construction.deleteInspectionRecord, {"irIds[0]": irId}, function (res) {
                    searcher.doSearch();
                });
            }
        });
    }

    function saveData() {
        if (com.validate("inspectionRecord")) {
            return;
        }

        var url;
        var options = {
            "inspectionRecord.orderId": record.recordItems.orderId.val(),
            "inspectionRecord.orderAddr": record.recordItems.orderAddr.val(),
            "inspectionRecord.startTime": record.recordItems.startDate.val() + " " + record.recordItems.startTime.val(),
            "inspectionRecord.endTime": record.recordItems.endDate.val() + " " + record.recordItems.endTime.val(),
            "inspectionRecord.recordDes": record.recordItems.recordDes.val(),
        };

        if (options["inspectionRecord.startTime"] > options["inspectionRecord.endTime"]) {
            com.showAlert(com.warning, "开始时间需要小于结束时间");
            return false;
        }

        if (record.editFlag) {
            url = api.construction.updateInspectionRecord;
            options["inspectionRecord.irId"] = record["inspectionRecord.irId"];
        } else {
            url = api.construction.addInspectionRecord;
        }

        com.post(url, options, function (res) {
            searcher.doSearch();
        });

        record.modal.modal("hide");
    }

});
