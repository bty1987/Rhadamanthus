jQuery(function ($) {

    var guarantee = {
        saveBtn: com.focusPage("#saveBtn"),
        cancellBtn: com.focusPage("#cancelBtn"),

        modals: {
            modal: com.focusPage("#guaranteeModal")
        },

        items: {
            orderId : com.focusPage("#orderId"),
            customerName : com.focusPage("#customerName"),
            guaranteeTime : com.focusPage("#guaranteeTime"),
            guaranteeDes : com.focusPage("#guaranteeDes")
        },

        editFlag: false,
        repeatFlg: false
    };

    guarantee.saveBtn.bindClick(saveData);

    guarantee.modals.modal.on("hide.bs.modal", function(){

        com.cleanItems(guarantee.items);
        com.closeTip();
    });

    com.focusPage('#fl-statement').statement("客服控制", "保修");

    com.datetime(guarantee.items.guaranteeTime);

    var lineprops = (function() {

        return [{
            field: "customerName",
            name: "客户名",
            prop: "customerName",
            clazz: "grey"
        }, {
            field: "guaranteeTime",
            name: "时间",
            prop: "guaranteeTime",
            clazz: "grey"
        }, {
            field: "guaranteeDes",
            name: "备注",
            prop: "guaranteeDes",
            clazz: "grey"
        }];
    })();

    var linebtns = (function() {

        return {
            edit: {
                name: "编辑",
                clazz: "btn-primary",
                handle: function(v) {
                    guarantee.editFlag = true;
                    var row = v;
                    guarantee.items.orderId.val(row.orderId);
                    guarantee.items.customerName.val(row.customerName);
                    guarantee.items.guaranteeTime.val(row.guaranteeTime);
                    guarantee.items.guaranteeDes.val(row.guaranteeDes);

                    guarantee["customerServiceGuarantee.csgId"] = row.csgId;

                    guarantee.items.orderId.attr('disabled', true);
                    guarantee.items.customerName.attr('disabled', true);
                    guarantee.items.guaranteeTime.attr("disabled", true);

                    guarantee.modals.modal.modal("show");
                }
            },
            del: {
                name: "删除",
                clazz: "btn-danger",
                handle: function(v) {
                    removeRow(v.csgId);
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

    searcher.set("condList", "pagenation", "resultList", api.construction.pageCustomerServiceGuarantee, {
        "customerServiceGuarantee.orderId": params.construction.orderId
    }, [], "searcherPostData", null, false, buttons);
    searcher.line("orderId", lineprops, linebtns).render();

    com.focusPage('#add', '#pagenation').click(function () {
        guarantee.editFlag = false;

        guarantee.items.orderId.val(params.construction.orderId);
        guarantee.items.customerName.val(params.construction.customerName);

        guarantee.items.orderId.attr("disabled", true);
        guarantee.items.customerName.attr("disabled", true);
        guarantee.items.guaranteeTime.attr("disabled", false);

        guarantee.modals.modal.modal("show");
    });

    function saveData() {
        if (com.validate("guaranteeModal") || guarantee.repeatFlg)
            return;

        var url;
        var options = {
            "customerServiceGuarantee.orderId": guarantee.items.orderId.val(),
            "customerServiceGuarantee.customerName": guarantee.items.customerName.val(),
            "customerServiceGuarantee.guaranteeTime": guarantee.items.guaranteeTime.val(),
            "customerServiceGuarantee.guaranteeDes": guarantee.items.guaranteeDes.val()
        };

        if (guarantee.editFlag) {
            url = api.construction.updateCustomerServiceGuarantee;
            options["customerServiceGuarantee.csgId"] = guarantee["customerServiceGuarantee.csgId"];
        } else {
            url = api.construction.addCustomerServiceGuarantee;
        }

        com.post(url, options, successCallback);
        guarantee.modals.modal.modal("hide");
    }

    function removeRow(id) {

        com.showConfirm("确认删除吗?", function () {

            com.post(api.construction.deleteCustomerServiceGuarantee, {"csgIds[0]": id}, successCallback);
        });

    }

    function successCallback(result) {
        searcher.doSearch();
    }

});

