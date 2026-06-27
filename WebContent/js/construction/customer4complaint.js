jQuery(function($) {

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

            orderId: com.focusPage("#orderId"),
            customerName: com.focusPage("#customerName"),
            complaintLevel: com.focusPage("#complaintLevel"),
            complaintTime: com.focusPage("#complaintTime"),
            complaintDes: com.focusPage("#complaintDes"),
            complaintType: com.focusPage("#complaintType"),

            handleOrderId: com.focusPage("#handleOrderId"),
            handleCustomerName: com.focusPage("#handleCustomerName"),
            handleComplaintLevel: com.focusPage("#handleComplaintLevel"),
            handleComplaintType: com.focusPage("#handleComplaintType"),
            complaintHandleDes: com.focusPage("#complaintHandleDes")
        },

        levelDict: {},
        typeDict: {},

        editFlag: false,
        repeatFlg: false
    };

    com.focusPage('#fl-statement').statement("客服控制", "投诉");

    com.datetime(complaint.items.complaintTime);

    complaint.btns.saveBtn.bindClick(saveData);
    complaint.btns.saveHandleBtn.bindClick(saveHandleData);

    complaint.modals.modal.on("hide.bs.modal", function() {

        com.cleanItems(complaint.items);
        com.closeTip();
    });

    complaint.modals.handleModal.on("hide.bs.modal", function() {

        com.cleanItems(complaint.items);
        com.closeTip();
    });

    complaint.modals.modal.on('show.bs.modal', function(e) {

        com.clearValidator();
    });
    complaint.modals.handleModal.on('show.bs.modal', function(e) {

        com.clearValidator();
    });

    var lineprops = (function() {

        return [{
            field: "customerName",
            name: "客户名",
            prop: "customerName",
            clazz: "grey"
        }, {
            field: "createrName",
            name: "创建人",
            prop: "createrName",
            clazz: "grey"
        }, {
            field: "operaterName",
            name: "操作人",
            prop: "operaterName",
            clazz: "grey"
        }, {
            field: "level",
            name: "等级",
            prop: function(v) { return constant.construction().customerServiceComplaint.levelDict.keys[v.level]; },
            clazz: ""
        }, {
            field: "type",
            name: "类型",
            prop: function(v) { return constant.construction().customerServiceComplaint.typeDict.keys[v.type]; },
            clazz: "red"
        }, {
            field: "createTime",
            name: "时间",
            prop: "createTime",
            clazz: "green"
        }, {
            field: "des",
            name: "备注",
            prop: "des",
            clazz: "grey"
        }, {
            field: "status",
            name: "状态",
            prop: function(v) {
                if (v.status == constant.construction().customer4complaint.COMPLAINT_STATUS_TYPE_INIT_INT) {
                    return "未处理";
                } else if (v.status == constant.construction().customer4complaint.COMPLAINT_STATUS_TYPE_HANDLE_INT) {
                    return "已处理";
                }
            },
            clazz: "grey"
        }, {
            field: "handle",
            name: "处理信息",
            prop: "handle",
            clazz: "grey"
        }];
    })();

    var linebtns = (function() {

        return {
            edit: {
                name: "处理",
                clazz: "btn-primary",
                handle: function(v) {
                    dialogCustomerServiceComplaintHandle(v);
                }
            },
            del: {
                name: "删除",
                clazz: "btn-danger",
                show: function(v) {
                    return v.status != constant.construction().customer4complaint.COMPLAINT_STATUS_TYPE_HANDLE_INT;
                },
                handle: function(v) {
                    removeRow(v.cscId);
                }
            }
        };
    })();

    var buttons = (function() {

        var $adda = $('<a></a>').addClass('btn btn-minier btn-success pull-left').attr('id', 'add').css("margin", "0px 3px");
        var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
        var $addspan = $('<span></span>').text('添加').appendTo($adda);

        return [$adda];
    })();

    var searcher = new Searcher();

    searcher.set("condList", "pagenation", "resultList", api.construction.pageCustomerServiceComplaint, {
        "customerServiceComplaint.orderId": params.construction.orderId
    }, [], "searcherPostData", null, false, buttons);
    searcher.line("orderId", lineprops, linebtns).render();

    com.focusPage('#add', '#pagenation').click(function() {

        complaint.editFlag = false;

        complaint.items.orderId.val(params.construction.orderId);
        complaint.items.customerName.val(params.construction.customerName);

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

        if (com.validate("complaintHandleModal"))
            return false;

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

        com.showConfirm("确认删除投诉吗?", function() {

            com.post(api.construction.deleteCustomerServiceComplaint, {
                "cscIds[0]": id
            }, successCallback);

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
