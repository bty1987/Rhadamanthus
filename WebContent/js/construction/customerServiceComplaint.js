jQuery(function ($) {

    var complaint = {

        btns: {
            saveBtn: com.focusPage("#saveBtn"),
            cancellBtn: com.focusPage("#cancelBtn"),
            saveHandleBtn: com.focusPage("#saveHandleBtn"),
            canceHandlelBtn: com.focusPage("#cancelBtn")
        },

        modals: {
            modal: com.focusPage("#complaintModal"),
            handleModal: com.focusPage("#complaintHandleModal")
        },

        items: {

            orderId : com.focusPage("#orderId"),
            customerName : com.focusPage("#customerName"),
            complaintLevel : com.focusPage("#complaintLevel"),
            complaintTime : com.focusPage("#complaintTime"),
            complaintDes : com.focusPage("#complaintDes"),
            complaintType : com.focusPage("#complaintType"),

            handleOrderId : com.focusPage("#handleOrderId"),
            handleCustomerName : com.focusPage("#handleCustomerName"),
            handleComplaintLevel : com.focusPage("#handleComplaintLevel"),
            handleComplaintType : com.focusPage("#handleComplaintType"),
            complaintHandleDes : com.focusPage("#complaintHandleDes")
        },

        levelDict: {},
        typeDict: {},

        editFlag: false,
        repeatFlg: false
    };

    com.datetime(complaint.items.complaintTime);
    complaint.btns.saveBtn.bindClick(saveData);
    complaint.btns.saveHandleBtn.bindClick(saveHandleData);

    complaint.modals.modal.on("hide.bs.modal", function(){

        com.cleanItems(complaint.items);
        com.closeTip();
    });

    complaint.modals.handleModal.on("hide.bs.modal", function(){

        com.cleanItems(complaint.items);
        com.closeTip();
    });

    complaint.modals.modal.on('show.bs.modal', function (e) {
        com.clearValidator();
    });
    complaint.modals.handleModal.on('show.bs.modal', function (e) {
        com.clearValidator();
    });

    com.post(api.ds.construction, {}, function (res) {
        complaint.levelDict = res.levelDict.split("key", "value");

        complaint.items.complaintLevel.bindData(res.levelDict, "key", "value", false);
    });

    com.post(api.ds.construction, {}, function (res) {
        complaint.typeDict = res.typeDict.split("key", "value");

        complaint.items.complaintType.bindData(res.typeDict, "key", "value", false);
    });

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
            var $liLine = $('<li></li>').addClass('item-orange clearfix');
            var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(v.orderId));
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

            var $btnEdit = $('<a></a>').addClass('btn btn-minier btn-primary').html("处理");
            var $btnDel = $('<a></a>').addClass('btn btn-minier btn-danger').html("删除");

            var disposeStatus;
            if (v.status == 0) {
                disposeStatus = "未处理";
            } else if (v.status == 1) {
                disposeStatus = "已处理";
            }

            var propertyArr = [
                ["客户名:", v.customerName, "grey"],
                ["创建人:", v.createrName, "grey"],
                ["操作人:", v.operaterName, "grey"],
                ["等级:", complaint.levelDict[v.level], null],
                ["类型:", complaint.typeDict[v.type], "red "],
                ["时间:", v.createTime, "green "],
                ["备注:", v.des, "grey"],
                ["状态:", disposeStatus, "grey"],
                ["处理信息:", v.handle, "grey"]
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
                dialogCustomerServiceComplaintHandle(v);
            });
            $btnDel.click(function () {
                if (v.status == 1) {
                    com.showAlert(com.warning, "当前信息已处理，不能删除");
                    return;
                }
                removeRow(v.cscId);
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
    searcher.init([], "condList", api.construction.pageCustomerServiceComplaint, function (list) {
        displayFunc.init('resultList', list);
    }, "pagenation", "searcherPostData", {
        "customerServiceComplaint.orderId": params.orderId
    }, false, null, function () {

        var $adda = $('<a></a>').addClass('btn btn-minier btn-success pull-left').attr('id', 'add').css("margin", "0px 3px");
        var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
        var $addspan = $('<span></span>').text('添加').appendTo($adda);

        return [$adda];
    });

    com.focusPage('#add', '#pagenation').click(function () {
        complaint.editFlag = false;

        complaint.items.orderId.val(params.orderId);
        complaint.items.customerName.val(params.customerName);

        complaint.items.orderId.attr("disabled", true);
        complaint.items.customerName.attr("disabled", true);
        complaint.items.complaintTime.attr("disabled", false);

        complaint.modals.modal.modal("show");
    });

    function saveData() {
        if (com.validate("complaintModal") || complaint.repeatFlg)
            return;

        var url;
        var options = {
            "customerServiceComplaint.orderId": complaint.items.orderId.val(),
            "customerServiceComplaint.customerName": complaint.items.customerName.val(),
            "customerServiceComplaint.level": complaint.items.complaintLevel.val(),
            "customerServiceComplaint.createTime": complaint.items.complaintTime.val(),
            "customerServiceComplaint.des": complaint.items.complaintDes.val(),
            "customerServiceComplaint.type": complaint.items.complaintType.val()
        };

        if (complaint.editFlag) {

            url = api.construction.updateCustomerServiceComplaint;
            options["customerServiceComplaint.cscId"] = complaint["customerServiceComplaint.cscId"];

        } else {
            url = api.construction.addCustomerServiceComplaint;
        }

        com.post(url, options, successCallback);

        complaint.modals.modal.modal("hide");
    }

    function saveHandleData() {
        if (com.validate())
            return;

        if (complaint["customerServiceComplaint.complaintStatus"] == "1") {
            complaint.modals.handleModal.modal("hide");
            return false;
        }

        var options = {
            "customerServiceComplaint.cscId": complaint["customerServiceComplaint.cscId"],
            "customerServiceComplaint.handle": complaint.items.complaintHandleDes.val()
        };

        com.post(api.construction.handleCustomerServiceComplaint, options, successCallback);

        complaint.modals.handleModal.modal("hide");
    }

    function removeRow(id) {

        com.showConfirm("确认删除投诉吗?", function () {

                com.post(api.construction.deleteCustomerServiceComplaint, {"cscIds[0]": id}, successCallback);
            
        });
    }

    function dialogCustomerServiceComplaintHandle(v) {

        var row = v;

        complaint["customerServiceComplaint.cscId"] = row.cscId;
        complaint["customerServiceComplaint.complaintStatus"] = row.complaintStatus;

        complaint.items.handleOrderId.val(row.orderId).attr('disabled', true);
        complaint.items.handleCustomerName.val(row.customerName).attr('disabled', true);
        complaint.items.handleComplaintLevel.val(row.level).attr('disabled', true);
        complaint.items.handleComplaintType.val(row.type).attr('disabled', true);
        complaint.items.complaintHandleDes.val(row.handle);

        if (row.complaintStatus == "1") {
            complaint.items.complaintHandleDes.attr("disabled", true);
        } else {
            complaint.items.complaintHandleDes.attr("disabled", false);
        }

        complaint.modals.handleModal.modal("show");
    }

    function successCallback(result) {
        searcher.doSearch();
    }

});
