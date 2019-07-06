jQuery(function ($) {

    com.focusPage('#fl-statement').statement("巡检控制", "巡检记录");

    var record = {
        saveBtn: com.focusPage("#saveBtn"),
        cancellBtn: com.focusPage("#cancelBtn"),
        modal: com.focusPage("#recordModal").on('show.bs.modal', function (e) {
            com.clearValidator();
        }),

        items: {
            orderId : com.focusPage("#orderId"),
            orderAddr : com.focusPage("#orderAddr"),
            startDate : com.focusPage("#startDate"),
            startTime : com.focusPage("#startTime"),
            endDate : com.focusPage("#endDate"),
            endTime : com.focusPage("#endTime"),
            recordDes : com.focusPage("#recordDes")
        },

        editFlag: false,
        repeatFlg: false
    };

    record.saveBtn.on("click", saveData);

    com.datetime(record.items.startDate);
    com.datetime(record.items.endDate);

    com.datetime(record.items.startTime, "time");
    com.datetime(record.items.endTime, "time");
    var displayFunc = (function () {
        var renderList = function (tableId, listData) {
            var $tableWrap = com.focusPage('#' + tableId).empty();
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
                ["备注:", v.recordDes, "grey"]
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
                com.focusPage('#' + tableId).html(null);
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

    com.focusPage('a[name="add"]', '#pagenation').click(function () {
        record.editFlag = false;

        com.cleanItems(record.items);

        record.items.orderId.val(params.orderId);
        record.items.orderAddr.val(params.orderAddr);

        record.items.orderId.attr('disabled', true);
        record.items.orderAddr.attr('disabled', true);

        record.modal.modal("show");
    });

    com.focusPage('a[name="back"]', '#pagenation').click(function () {
        com.switchPage(api.index.inspectionIndex.url);
    });

    function editRecord(v) {
        record.editFlag = true;

        record.items.orderId.val(v.orderId);
        record.items.orderAddr.val(v.orderAddr);
        record.items.startDate.val(v.startTime.split(' ')[0]);
        record.items.startTime.val(v.startTime.split(' ')[1]);
        record.items.endDate.val(v.endTime.split(' ')[0]);
        record.items.endTime.val(v.endTime.split(' ')[1]);
        record.items.recordDes.val(v.recordDes);

        record["inspectionRecord.irId"] = v.irId;

        record.items.orderId.attr('disabled', true);
        record.items.orderAddr.attr('disabled', true);

        record.modal.modal("show");
    }

    function delRecord(irId) {
        com.showConfirm("确认删除吗?", function () {

                com.post(api.construction.deleteInspectionRecord, {"irIds[0]": irId}, function (res) {
                    searcher.doSearch();
                });

        });
    }

    function saveData() {
        if (com.validate("inspectionRecord")) {
            return;
        }

        var url;
        var options = {
            "inspectionRecord.orderId": record.items.orderId.val(),
            "inspectionRecord.orderAddr": record.items.orderAddr.val(),
            "inspectionRecord.startTime": record.items.startDate.val() + " " + record.items.startTime.val(),
            "inspectionRecord.endTime": record.items.endDate.val() + " " + record.items.endTime.val(),
            "inspectionRecord.recordDes": record.items.recordDes.val()
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
