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
    var lineprops = (function() {

        return [{
            field: "orderAddr",
            name: "楼盘地址",
            prop: "orderAddr",
            clazz: "grey"
        }, {
            field: "operaterName",
            name: "操作人",
            prop: "operaterName",
            clazz: "grey"
        }, {
            field: "startTime",
            name: "开始时间",
            prop: "startTime",
            clazz: "green"
        }, {
            field: "endTime",
            name: "结束时间",
            prop: "endTime",
            clazz: "green"
        }, {
            field: "recordDes",
            name: "备注",
            prop: "recordDes",
            clazz: "grey"
        }];
    })();

    var linebtns = (function() {

        return {
            edit: {
                name: "编辑",
                clazz: "btn-primary",
                handle: function(v) {
                    editRecord(v);
                }
            },
            del: {
                name: "删除",
                clazz: "btn-danger",
                handle: function(v) {
                    delRecord(v.irId);
                }
            }
        };
    })();

    var buttons = (function() {

        var $adda = $('<a></a>').addClass('btn btn-minier btn-success pull-left').attr('name', 'add').css("margin", "0px 3px");
        var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
        var $addspan = $('<span></span>').text('添加').appendTo($adda);

        var $addb = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('name', 'back').css("margin", "0px 3px");
        var $addi = $('<i></i>').addClass('icon-mail-forward bigger-110').appendTo($addb);
        var $addspan = $('<span></span>').text('返回').appendTo($addb);

        return [$addb, $adda];
    })();

    var searcher = new Searcher();

    searcher.set("condList", "pagenation", "resultList", api.construction.pageInspectionRecordByOrderId, {
        "inspectionRecord.orderId": params.construction.orderId
    }, [], "inspectionRecordPostData", null, false, buttons);
    searcher.line("orderId", lineprops, linebtns).render();

    com.focusPage('a[name="add"]', '#pagenation').click(function () {
        record.editFlag = false;

        com.cleanItems(record.items);

        record.items.orderId.val(params.construction.orderId);
        record.items.orderAddr.val(params.construction.orderAddr);

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
