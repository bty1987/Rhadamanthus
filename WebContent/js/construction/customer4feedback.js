jQuery(function ($) {

    var backVisit = {

        saveBtn: com.focusPage("#saveBtn"),
        cancellBtn: com.focusPage("#cancelBtn"),

        modals:{
            modal: com.focusPage("#backVisitModal")
        },

        items: {
            orderId : com.focusPage("#orderId"),
            orderAddr : com.focusPage("#orderAddr"),
            customerName : com.focusPage("#customerName"),
            backVisitTime : com.focusPage("#backVisitTime"),
            backVisitType : com.focusPage("#backVisitType"),
            backVisitDes : com.focusPage("#backVisitDes")
        },

        backVisitTypeData: {},
        editFlag: false,
        repeatFlg: false
    };

    backVisit.saveBtn.bindClick(saveData);
    
    com.focusPage('#fl-statement').statement("客服控制", "回访");

    com.datetime(backVisit.items.backVisitTime);

    backVisit.modals.modal.on("hide.bs.modal", function(){

        com.cleanItems(backVisit.items);
        com.closeTip();
    });

    backVisit.items.backVisitType.bindData(constant.construction().customer4feedback.backVisitTypeData.datas,"key","value");

    function buildCustomer4feedbackLineprops() {

        return [{
            field: "orderAddr",
            name: "楼盘地址",
            prop: "orderAddr",
            clazz: "grey"
        }, {
            field: "customerName",
            name: "客户名",
            prop: "customerName",
            clazz: "grey"
        }, {
            field: "backVisitTime",
            name: "时间",
            prop: "backVisitTime",
            clazz: "green"
        }, {
            field: "backVisitType",
            name: "类型",
            prop: function(v) { return constant.construction().customer4feedback.backVisitTypeData.keys[v.backVisitType]; },
            clazz: "red"
        }, {
            field: "backVisitDes",
            name: "备注",
            prop: "backVisitDes",
            clazz: "grey"
        }];
    }

    function buildCustomer4feedbackLinebtns() {

        return {
            edit: {
                name: "编辑",
                clazz: "btn-primary",
                handle: function(v) {
                    backVisit.editFlag = true;
                    var row = v;

                    backVisit.items.orderId.val(params.construction.orderId);
                    backVisit.items.orderAddr.val(params.construction.orderAddr);
                    backVisit.items.customerName.val(params.construction.customerName);
                    backVisit.items.backVisitTime.val(row.backVisitTime);
                    backVisit.items.backVisitType.val(row.backVisitType);
                    backVisit.items.backVisitDes.val(row.backVisitDes);

                    backVisit["customerServiceBackVisit.csbvId"] = row.csbvId;

                    backVisit.items.orderId.attr('disabled', true);
                    backVisit.items.orderAddr.attr("disabled", true);
                    backVisit.items.customerName.attr('disabled', true);

                    backVisit.modals.modal.modal("show");
                }
            },
            del: {
                name: "删除",
                clazz: "btn-danger",
                handle: function(v) {
                    removeRow(v.csbvId);
                }
            }
        };
    }

    function buildCustomer4feedbackButtons() {

        var $adda = $('<a></a>').addClass('btn btn-minier btn-success pull-left').attr('id', 'Add').css("margin", "0px 3px");
        var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
        var $addspan = $('<span></span>').text('添加').appendTo($adda);

        return [$adda];
    }

    var searcher = new Searcher();

    searcher.set("condList", "pagenation", "resultList", api.construction.pageCustomerServiceBackVisit, {
        "customerServiceBackVisit.orderId": params.construction.orderId
    }, [], "customerServiceBackVisitPostData", null, false, buildCustomer4feedbackButtons);
    searcher.line("orderId", buildCustomer4feedbackLineprops(), buildCustomer4feedbackLinebtns()).render();

    com.focusPage('#Add', '#pagenation').click(function () {
        backVisit.editFlag = false;

        backVisit.items.orderId.val(params.construction.orderId);
        backVisit.items.orderAddr.val(params.construction.orderAddr);
        backVisit.items.customerName.val(params.construction.customerName);

        backVisit.items.orderId.attr("disabled", true);
        backVisit.items.orderAddr.attr("disabled", true);
        backVisit.items.customerName.attr("disabled", true);

        backVisit.modals.modal.modal("show");
    });

    function saveData() {
        if (com.validate("backVisitModal") || backVisit.repeatFlg)
            return;

        var url;
        var options = {
            "customerServiceBackVisit.orderId": backVisit.items.orderId.val(),
            "customerServiceBackVisit.orderAddr": backVisit.items.orderAddr.val(),
            "customerServiceBackVisit.customerName": backVisit.items.customerName.val(),
            "customerServiceBackVisit.backVisitTime": backVisit.items.backVisitTime.val(),
            "customerServiceBackVisit.backVisitType": backVisit.items.backVisitType.val(),
            "customerServiceBackVisit.backVisitDes": backVisit.items.backVisitDes.val()
        };

        if (backVisit.editFlag) {
            url = api.construction.updateCustomerServiceBackVisit;
            options["customerServiceBackVisit.csbvId"] = backVisit["customerServiceBackVisit.csbvId"];
        } else {
            url = api.construction.addCustomerServiceBackVisit;
        }

        com.post(url, options, successCallback, failCallback);
        backVisit.modals.modal.modal("hide");
    }

    function removeRow(id) {

        com.showConfirm("确认删除吗?", function () {
            com.post(api.construction.deleteCustomerServiceBackVisit, {"csbvIds[0]": id}, successCallback, failCallback);
        });

    }

    function successCallback(result) {
        searcher.doSearch();
    }

    function failCallback() {

    }

});

