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

    // 获取页面控制参数(按公司差异化配置)
    var pageConfig = constructionPage.getConfig("customer4guarantee");

    // pageBtn 配置为空时, 所有按钮按原逻辑显示; 否则需在 pageBtn 中存在
    function btnVisible(key) {

        return pageConfig.pageBtn.length == 0 || pageConfig.pageBtn.contains(key);
    }

    // 字段定义映射: key 对应配置 propertyArr 中的 value
    var propertyMap = {
        "customerName": {
            field: "customerName",
            name: "客户名",
            prop: "customerName",
            clazz: "grey"
        },
        "guaranteeTime": {
            field: "guaranteeTime",
            name: "时间",
            prop: "guaranteeTime",
            clazz: "grey"
        },
        "guaranteeDes": {
            field: "guaranteeDes",
            name: "备注",
            prop: "guaranteeDes",
            clazz: "grey"
        }
    };

    // 根据配置 propertyArr 组装列定义, 配置为空则使用全部默认列
    var lineprops = (function() {

        if (pageConfig.propertyArr.length == 0) {

            var all = [];
            $.each(propertyMap, function (key, prop) { all.push(prop); });
            return all;
        }

        var props = [];
        $.each(pageConfig.propertyArr, function (i, key) {

            if (propertyMap[key]) props.push(propertyMap[key]);
        });
        return props;
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
                },
                show: function() {
                    return btnVisible("edit");
                }
            },
            del: {
                name: "删除",
                clazz: "btn-danger",
                handle: function(v) {
                    removeRow(v.csgId);
                },
                show: function() {
                    return btnVisible("del");
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

    searcher.set("condList", "pagenation", "resultList", pageConfig.apiPage || api.construction.pageCustomerServiceGuarantee, {
        "customerServiceGuarantee.orderId": params.construction.orderId
    }, pageConfig.condArr, "searcherPostData", null, false, buttons);
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

