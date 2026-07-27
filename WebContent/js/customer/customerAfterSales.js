jQuery(function($) {

    var customerAfterSales = {
        modals: {
            addModal: com.focusPage("#customerAfterSalesModal"),
            operationModal: com.focusPage("#operationModal"),
            detailModal: com.focusPage("#detailModal"),
            refModal: com.focusPage("#refModal")
        },
        items: {
            type: com.focusPage("#type"),
            priority: com.focusPage("#priority"),
            orderId: com.focusPage("#orderId"),
            csid: com.focusPage("#csid"),
            cid: com.focusPage("#cid"),
            contactName: com.focusPage("#contactName"),
            phone: com.focusPage("#phone"),
            owner: com.focusPage("#owner"),
            did: com.focusPage("#did"),
            content: com.focusPage("#content"),
            comment: com.focusPage("#comment"),
            operationOwner: com.focusPage("#operationOwner"),
            operationComment: com.focusPage("#operationComment"),
            operationTitle: com.focusPage("#operationTitle"),
            operationOwnerGroup: com.focusPage("#operationOwnerGroup"),
            detailInfo: com.focusPage("#detailInfo"),
            recordList: com.focusPage("#recordList"),
            refList: com.focusPage("#refList"),
            refType: com.focusPage("#refType"),
            refId: com.focusPage("#refId")
        },
        btns: {
            saveBtn: com.focusPage("#saveBtn"),
            operationBtn: com.focusPage("#operationBtn"),
            refBtn: com.focusPage("#refBtn")
        },
        operation: null,
        asid: null,
        searcher: null
    };

    var types = [{
        key: 0,
        value: "反馈"
    }, {
        key: 1,
        value: "投诉"
    }, {
        key: 2,
        value: "报修"
    }, {
        key: 3,
        value: "维修"
    }, {
        key: 4,
        value: "建议"
    }, {
        key: 5,
        value: "表扬"
    }, {
        key: 6,
        value: "退款"
    }];

    var sources = [{
        key: 0,
        value: "手工"
    }];

    var priorities = [{
        key: 0,
        value: "普通"
    }, {
        key: 1,
        value: "重要"
    }, {
        key: 2,
        value: "紧急"
    }];

    var statuses = [{
        key: 0,
        value: "初始"
    }, {
        key: 1,
        value: "已接收"
    }, {
        key: 2,
        value: "已派工"
    }, {
        key: 3,
        value: "处理中"
    }, {
        key: 4,
        value: "待确认"
    }, {
        key: 5,
        value: "已完成"
    }, {
        key: 6,
        value: "已关闭"
    }, {
        key: 7,
        value: "已取消"
    }, {
        key: 8,
        value: "已挂起"
    }, {
        key: 9,
        value: "已升级"
    }, {
        key: 10,
        value: "已重开"
    }];

    var recordTypes = [{
        key: 0,
        value: "创建"
    }, {
        key: 1,
        value: "接收"
    }, {
        key: 2,
        value: "派工"
    }, {
        key: 3,
        value: "处理"
    }, {
        key: 4,
        value: "转交"
    }, {
        key: 5,
        value: "完成"
    }, {
        key: 6,
        value: "关闭"
    }, {
        key: 7,
        value: "取消"
    }, {
        key: 8,
        value: "挂起"
    }, {
        key: 9,
        value: "升级"
    }, {
        key: 10,
        value: "重开"
    }, {
        key: 11,
        value: "备注"
    }];

    var refTypes = [{
        key: 0,
        value: "反馈"
    }, {
        key: 1,
        value: "反馈投诉"
    }, {
        key: 2,
        value: "反馈维修"
    }, {
        key: 3,
        value: "老维修"
    }, {
        key: 4,
        value: "维修"
    }, {
        key: 5,
        value: "投诉"
    }, {
        key: 6,
        value: "投诉明细"
    }, {
        key: 7,
        value: "回访"
    }, {
        key: 8,
        value: "调研"
    }];

    var operationMap = {
        receive: {
            title: "接收售后",
            api: api.customer.receiveCustomerAfterSales,
            success: "接收成功",
            owner: true,
            ownerRequired: false
        },
        dispatch: {
            title: "派工售后",
            api: api.customer.dispatchCustomerAfterSales,
            success: "派工成功",
            owner: true,
            ownerRequired: false
        },
        handle: {
            title: "处理售后",
            api: api.customer.handleCustomerAfterSales,
            success: "处理成功",
            owner: true,
            ownerRequired: false
        },
        tran: {
            title: "转交售后",
            api: api.customer.tranCustomerAfterSales,
            success: "转交成功",
            owner: true,
            ownerRequired: true
        },
        hold: {
            title: "挂起售后",
            api: api.customer.holdCustomerAfterSales,
            success: "挂起成功",
            owner: true,
            ownerRequired: false
        },
        upgrade: {
            title: "升级售后",
            api: api.customer.upgradeCustomerAfterSales,
            success: "升级成功",
            owner: true,
            ownerRequired: false
        },
        finish: {
            title: "完成售后",
            api: api.customer.finishCustomerAfterSales,
            success: "完成成功",
            owner: false,
            ownerRequired: false
        },
        close: {
            title: "关闭售后",
            api: api.customer.closeCustomerAfterSales,
            success: "关闭成功",
            owner: false,
            ownerRequired: false
        },
        cancel: {
            title: "取消售后",
            api: api.customer.cancelCustomerAfterSales,
            success: "取消成功",
            owner: false,
            ownerRequired: false
        },
        reopen: {
            title: "重开售后",
            api: api.customer.reopenCustomerAfterSales,
            success: "重开成功",
            owner: true,
            ownerRequired: false
        },
        record: {
            title: "追加记录",
            api: api.customer.addCustomerAfterSalesRecord,
            success: "记录成功",
            owner: false,
            ownerRequired: false,
            record: true
        }
    };

    customerAfterSales.items.type.bindData(types, "key", "value");
    customerAfterSales.items.priority.bindData(priorities, "key", "value");
    customerAfterSales.items.refType.bindData(refTypes, "key", "value");

    com.initTypeahead("owner", api.personel.queryUserByPinyin, "pinyinName", {
        "user.status": "0"
    }, "autoFillKeyValue", "key", "value");

    com.initTypeahead("operationOwner", api.personel.queryUserByPinyin, "pinyinName", {
        "user.status": "0"
    }, "autoFillKeyValue", "key", "value");

    customerAfterSales.btns.saveBtn.on("click", saveData);
    customerAfterSales.btns.operationBtn.on("click", submitOperation);
    customerAfterSales.btns.refBtn.on("click", saveRef);

    customerAfterSales.modals.addModal.on("hide.bs.modal", function() {
        com.clearValidator("customerAfterSalesModal");
        com.cleanItems(customerAfterSales.items);
        com.cleanTypeahead("owner");
        customerAfterSales.items.type.val(0);
        customerAfterSales.items.priority.val(0);
    });

    customerAfterSales.modals.operationModal.on("hide.bs.modal", function() {
        com.clearValidator("operationModal");
        customerAfterSales.operation = null;
        customerAfterSales.asid = null;
        customerAfterSales.items.operationComment.val("");
        com.cleanTypeahead("operationOwner");
        customerAfterSales.items.operationOwner.removeClass("v_required");
    });

    customerAfterSales.modals.refModal.on("hide.bs.modal", function() {
        com.clearValidator("refModal");
        customerAfterSales.asid = null;
        customerAfterSales.items.refType.val(0);
        customerAfterSales.items.refId.val("");
    });

    var lineprops = [{
        field: "asNo",
        name: "售后编号",
        prop: "asNo",
        clazz: "blue"
    }, {
        field: "orderId",
        name: "装修单号",
        prop: "orderId",
        clazz: "blue",
        click: function($b, v) {
            v.orderId && tools.decoration.info($b, v.orderId);
        }
    }, {
        field: "contactName",
        name: "联系人",
        prop: "contactName",
        clazz: "grey"
    }, {
        field: "phone",
        name: "电话",
        prop: "phone",
        clazz: "grey"
    }, {
        field: "type",
        name: "类型",
        prop: function(v) { return keyValue(types, v.type); },
        clazz: "red"
    }, {
        field: "priority",
        name: "优先级",
        prop: function(v) { return keyValue(priorities, v.priority); },
        clazz: "orange"
    }, {
        field: "status",
        name: "状态",
        prop: function(v) { return keyValue(statuses, v.status); },
        clazz: "red"
    }, {
        field: "owner.currentName",
        name: "负责人",
        prop: function(v) { return username(v.owner); },
        clazz: "grey"
    }, {
        field: "creater.currentName",
        name: "创建人",
        prop: function(v) { return username(v.creater); },
        clazz: "grey"
    }, {
        field: "createTime",
        name: "创建时间",
        prop: "createTime",
        clazz: "green"
    }, {
        field: "updateTime",
        name: "更新时间",
        prop: "updateTime",
        clazz: "green"
    }, {
        field: "content",
        name: "问题描述",
        prop: "content",
        clazz: "grey"
    }];

    var linebtns = [{
        name: "详情",
        clazz: "btn-inverse",
        handle: function(v) {
            showDetail(v.asid);
        }
    }, {
        name: "记录",
        clazz: "btn-yellow",
        handle: function(v) {
            openOperation("record", v.asid);
        }
    }, {
        name: "关联",
        clazz: "btn-purple",
        handle: function(v) {
            openRef(v.asid);
        }
    }, {
        name: "接收",
        clazz: "btn-success",
        // customerAfterSales.status(售后工单状态): 库无专属常量, PO枚举待确认, 暂保留。
        show: function(v) { return v.status == 0; },
        handle: function(v) {
            openOperation("receive", v.asid);
        }
    }, {
        name: "派工",
        clazz: "btn-primary",
        show: function(v) { return [0, 1, 10].indexOf(v.status) != -1; },
        handle: function(v) {
            openOperation("dispatch", v.asid);
        }
    }, {
        name: "处理",
        clazz: "btn-info",
        show: function(v) { return [1, 2, 3, 8, 9, 10].indexOf(v.status) != -1; },
        handle: function(v) {
            openOperation("handle", v.asid);
        }
    }, {
        name: "转交",
        clazz: "btn-warning",
        show: function(v) { return !isFinal(v.status); },
        handle: function(v) {
            openOperation("tran", v.asid);
        }
    }, {
        name: "挂起",
        clazz: "btn-pink",
        show: function(v) { return [1, 2, 3, 8, 9, 10].indexOf(v.status) != -1; },
        handle: function(v) {
            openOperation("hold", v.asid);
        }
    }, {
        name: "升级",
        clazz: "btn-danger",
        show: function(v) { return [1, 2, 3, 8, 9, 10].indexOf(v.status) != -1; },
        handle: function(v) {
            openOperation("upgrade", v.asid);
        }
    }, {
        name: "完成",
        clazz: "btn-success",
        show: function(v) { return [3, 4].indexOf(v.status) != -1; },
        handle: function(v) {
            openOperation("finish", v.asid);
        }
    }, {
        name: "关闭",
        clazz: "btn-grey",
        show: function(v) { return v.status == 5; },
        handle: function(v) {
            openOperation("close", v.asid);
        }
    }, {
        name: "取消",
        clazz: "btn-danger",
        show: function(v) { return !isFinal(v.status) && v.status != 5; },
        handle: function(v) {
            openOperation("cancel", v.asid);
        }
    }, {
        name: "重开",
        clazz: "btn-primary",
        show: function(v) { return [5, 6].indexOf(v.status) != -1; },
        handle: function(v) {
            openOperation("reopen", v.asid);
        }
    }];

    customerAfterSales.searcher = new Searcher();
    customerAfterSales.searcher.base("condList", "pagenation", "resultList", api.customer.pageCustomerAfterSales);
    customerAfterSales.searcher.condition(["customer-aftersales-asNo", "customer-aftersales-orderId", "customer-aftersales-csid", "customer-aftersales-cid", "customer-aftersales-type", "customer-aftersales-source", "customer-aftersales-priority", "customer-aftersales-status", "customer-aftersales-owner", "customer-aftersales-creater"]);
    customerAfterSales.searcher.history("customerAfterSalesPostData");
    customerAfterSales.searcher.button([{
        name: "创建",
        clazz: "btn-primary",
        id: "createCustomerAfterSales",
        icon: "icon-plus"
    }]);
    customerAfterSales.searcher.line(function(v) {
        return v.asNo || ("售后单#" + v.asid);
    }, lineprops, linebtns).render();

    com.focusPage("#createCustomerAfterSales", "#pagenation").on("click", function() {
        com.cleanItems(customerAfterSales.items);
        com.cleanTypeahead("owner");
        customerAfterSales.items.type.val(0);
        customerAfterSales.items.priority.val(0);
        customerAfterSales.modals.addModal.modal("show");
    });

    function saveData() {

        if (com.validate("customerAfterSalesModal")) {
            return false;
        }

        var options = {
            "customerAfterSales.type": customerAfterSales.items.type.val(),
            "customerAfterSales.priority": customerAfterSales.items.priority.val(),
            "customerAfterSales.orderId": customerAfterSales.items.orderId.val(),
            "customerAfterSales.csid": customerAfterSales.items.csid.val() || 0,
            "customerAfterSales.cid": customerAfterSales.items.cid.val() || 0,
            "customerAfterSales.contactName": customerAfterSales.items.contactName.val(),
            "customerAfterSales.phone": customerAfterSales.items.phone.val(),
            "customerAfterSales.did": customerAfterSales.items.did.val() || 0,
            "customerAfterSales.content": customerAfterSales.items.content.val(),
            "customerAfterSales.comment": customerAfterSales.items.comment.val()
        };

        var owner = com.typeahead("owner");

        if (owner) {
            options["customerAfterSales.owner.userId"] = owner;
        }

        com.post(api.customer.addCustomerAfterSales, options, function() {
            com.showAlert(com.info, "创建成功");
            customerAfterSales.modals.addModal.modal("hide");
            customerAfterSales.searcher.doSearch();
        });
    }

    function openOperation(type, asid) {

        var operation = operationMap[type];

        customerAfterSales.operation = type;
        customerAfterSales.asid = asid;
        customerAfterSales.items.operationTitle.text(operation.title);
        customerAfterSales.items.operationComment.val("");
        com.cleanTypeahead("operationOwner");

        operation.owner ? customerAfterSales.items.operationOwnerGroup.show() : customerAfterSales.items.operationOwnerGroup.hide();
        operation.ownerRequired ? customerAfterSales.items.operationOwner.addClass("v_required") : customerAfterSales.items.operationOwner.removeClass("v_required");

        customerAfterSales.modals.operationModal.modal("show");
    }

    function submitOperation() {

        var operation = operationMap[customerAfterSales.operation];

        if (!operation) {
            return false;
        }

        if (com.validate("operationModal")) {
            return false;
        }

        var options = {};

        if (operation.record) {
            options["customerAfterSalesRecord.customerAfterSales.asid"] = customerAfterSales.asid;
            options["customerAfterSalesRecord.comment"] = customerAfterSales.items.operationComment.val();
        } else {
            options["customerAfterSales.asid"] = customerAfterSales.asid;
            options["customerAfterSales.comment"] = customerAfterSales.items.operationComment.val();

            if (operation.owner) {
                var owner = com.typeahead("operationOwner");

                if (operation.ownerRequired && !owner) {
                    com.showTip(customerAfterSales.items.operationOwner, "请选择负责人", "top");
                    return false;
                }

                if (owner) {
                    options["customerAfterSales.owner.userId"] = owner;
                }
            }
        }

        com.post(operation.api, options, function() {
            com.showAlert(com.info, operation.success);
            customerAfterSales.modals.operationModal.modal("hide");
            customerAfterSales.searcher.doSearch();
        });
    }

    function openRef(asid) {

        customerAfterSales.asid = asid;
        customerAfterSales.items.refType.val(0);
        customerAfterSales.items.refId.val("");
        customerAfterSales.modals.refModal.modal("show");
    }

    function saveRef() {

        if (com.validate("refModal")) {
            return false;
        }

        com.post(api.customer.addCustomerAfterSalesRef, {
            "customerAfterSalesRef.customerAfterSales.asid": customerAfterSales.asid,
            "customerAfterSalesRef.type": customerAfterSales.items.refType.val(),
            "customerAfterSalesRef.refId": customerAfterSales.items.refId.val()
        }, function() {
            com.showAlert(com.info, "关联成功");
            customerAfterSales.modals.refModal.modal("hide");
        });
    }

    function showDetail(asid) {

        customerAfterSales.asid = asid;
        customerAfterSales.items.detailInfo.empty();
        customerAfterSales.items.recordList.empty();
        customerAfterSales.items.refList.empty();

        com.post(api.customer.queryCustomerAfterSalesByAsid, {
            "customerAfterSales.asid": asid
        }, function(res) {
            renderInfo(res.customerAfterSales || {});
        }, null, false);

        com.post(api.customer.queryCustomerAfterSalesRecord, {
            "customerAfterSalesRecord.customerAfterSales.asid": asid
        }, function(res) {
            renderRecords(res.customerAfterSalesRecords || []);
        }, null, false);

        com.post(api.customer.queryCustomerAfterSalesRef, {
            "customerAfterSalesRef.customerAfterSales.asid": asid
        }, function(res) {
            renderRefs(res.customerAfterSalesRefs || []);
        }, null, false);

        customerAfterSales.modals.detailModal.modal("show");
    }

    function renderInfo(v) {

        var infos = [["售后编号", v.asNo, "blue"], ["装修单号", v.orderId, "blue"], ["客源ID", empty(v.csid), "grey"], ["客户ID", empty(v.cid), "grey"], ["联系人", v.contactName, "grey"], ["电话", v.phone, "grey"], ["类型", keyValue(types, v.type), "red"], ["来源", keyValue(sources, v.source), "grey"], ["优先级", keyValue(priorities, v.priority), "orange"], ["状态", keyValue(statuses, v.status), "red"], ["负责人", username(v.owner), "grey"], ["创建人", username(v.creater), "grey"], ["创建时间", v.createTime, "green"], ["更新时间", v.updateTime, "green"], ["接收时间", v.receiveTime, "green"], ["处理时间", v.handleTime, "green"], ["完成时间", v.finishTime, "green"], ["关闭时间", v.closeTime, "green"], ["响应时限", v.responseDeadline, "green"], ["完成时限", v.finishDeadline, "green"], ["责任部门ID", empty(v.did), "grey"], ["问题描述", v.content, "grey"]];

        $.each(infos, function(i, value) {
            var $li = $("<li></li>").appendTo(customerAfterSales.items.detailInfo);
            $("<strong></strong>").html(value[0] + ": ").appendTo($li);
            $("<b></b>").html(empty(value[1])).addClass(value[2]).appendTo($li);
        });
    }

    function renderRecords(records) {

        if (!records.length) {
            emptyBlock(customerAfterSales.items.recordList);
            return;
        }

        var $ul = $("<ul></ul>").addClass("item-list fl-table-list ui-sortable").appendTo(customerAfterSales.items.recordList);

        $.each(records, function(i, v) {
            var $li = $("<li></li>").addClass("item-blue clearfix").appendTo($ul);
            var $h3 = $("<h3></h3>").addClass("oid").appendTo($li);
            $("<small></small>").addClass("blue").html(keyValue(recordTypes, v.type)).appendTo($h3);

            var $props = $("<ul></ul>").addClass("list-unstyled fl-inline-list clearfix").appendTo($li);
            var props = [["操作人", username(v.operator), "grey"], ["操作时间", v.operateTime, "green"], ["原状态", keyValue(statuses, v.oldStatus), "grey"], ["新状态", keyValue(statuses, v.newStatus), "red"], ["说明", v.comment, "grey"]];

            appendProps($props, props);
        });
    }

    function renderRefs(refs) {

        if (!refs.length) {
            emptyBlock(customerAfterSales.items.refList);
            return;
        }

        var $ul = $("<ul></ul>").addClass("item-list fl-table-list ui-sortable").appendTo(customerAfterSales.items.refList);

        $.each(refs, function(i, v) {
            var $li = $("<li></li>").addClass("item-orange clearfix").appendTo($ul);
            var $h3 = $("<h3></h3>").addClass("oid").appendTo($li);
            $("<small></small>").addClass("blue").html(keyValue(refTypes, v.type)).appendTo($h3);

            var $props = $("<ul></ul>").addClass("list-unstyled fl-inline-list clearfix").appendTo($li);
            appendProps($props, [["引用ID", v.refId, "blue"], ["创建时间", v.createTime, "green"]]);
        });
    }

    function appendProps($ul, props) {

        $.each(props, function(i, value) {
            var $li = $("<li></li>").appendTo($ul);
            $("<strong></strong>").html(value[0] + ": ").appendTo($li);
            $("<b></b>").html(empty(value[1])).addClass(value[2]).appendTo($li);
        });
    }

    function emptyBlock($wrap) {

        var $zone = $("<div></div>").addClass("dropzone dz-clickable").css("margin", "10px").css("border", "0px").appendTo($wrap);
        var $msg = $("<div></div>").addClass("dz-default dz-message").appendTo($zone);
        $("<span></span>").text("无可用数据提供").appendTo($msg);
    }

    function keyValue(datas, key) {

        var result = "";

        $.each(datas, function(i, v) {
            if (String(v.key) == String(key)) {
                result = v.value;
                return false;
            }
        });

        return result || empty(key);
    }

    function username(user) {

        if (!user) {
            return "";
        }

        return user.currentName || user.userName || user.loginId || user.userId || "";
    }

    function empty(value) {

        return value == null || value == undefined || value === "" ? "-" : value;
    }

    function isFinal(status) {

        return [5, 6, 7].indexOf(status) != -1;
    }

});
