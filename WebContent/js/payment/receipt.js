jQuery(function ($) {
    receipt = {
        paymentTypes: constant.payment().receipt.paymentType.keys,
        receiptTypes: constant.payment().receiptType.receiptType.keys,
        items: {
            executeDates: com.focusPage("#executeDates"),
            executeTimes: com.focusPage("#executeTimes")
        },
        modals: {
            receiptModal: com.focusPage("#receiptModal")
        }
    };

    com.datetime(com.focusPage("#executeDates"));

    com.datetime(com.focusPage('#executeTimes'), "time");

    receipt.modals.receiptModal.on('hide.bs.modal', function () {
        com.closeTip();
    });

    var lineprops = (function() {

        return [{
            field: "orderId",
            name: "装修单号",
            prop: "orderId",
            clazz: "blue"
        }, {
            field: "paymentType",
            name: "款项类型",
            prop: function(v) {
                return receipt.paymentTypes[v.paymentType];
            },
            clazz: "red"
        }, {
            field: "paymentName",
            name: "款项名称",
            prop: "paymentName",
            clazz: "red"
        }, {
            field: "receiptType",
            name: "收据类型",
            prop: function(v) {
                return receipt.receiptTypes[v.receiptType];
            },
            clazz: "red"
        }, {
            field: "name",
            name: "名称",
            prop: function(v) {
                return v.name == "" ? "无" : v.name;
            },
            clazz: "grey"
        }, {
            field: "money",
            name: "金额",
            prop: "money",
            clazz: "blue"
        }, {
            field: "collectTime",
            name: "收款时间",
            prop: "collectTime",
            clazz: "green"
        }];
    })();

    var buttons = (function() {

        var $impa = $('<a></a>').addClass('btn btn-minier btn-success pull-left').attr('name', 'import').css("margin", "0px 3px");
        $('<i></i>').addClass('icon-download-alt bigger-110').appendTo($impa);
        $('<span></span>').text('导出').appendTo($impa);

        return [$impa];
    })();

    var searcher = new Searcher();

    searcher.set("condList", "pagenation", "resultList", api.payment.pageReceipt, null, ["payment-paymentType", "payment-receiptType", "payment-collectTime"], "receiptPostData", null, false, buttons);
    searcher.line(function(v) {
        return v.type == 0 ? "收款" : "退款";
    }, lineprops, {}).render();

    com.focusPage('a[name="import"]', '#pagenation').click(function () {
        var setime = com.focusPage("#pluginss");
        setime.empty();
        planUtils.PluginsA("receiptTimes");
        com.focusPage("#idreceiptTimes").attr("class", "date-picker col-xs-10 col-sm-8 v_required");
        com.cleanItems(receipt.items);
        com.clearValidator("receiptModal");
        com.focusPage("#receiptModal").modal("show");
    });

    com.focusPage("#cancelBtn").click(function () {
        com.focusPage("#receiptModal").modal("hide");
    });

    //导出收据
    com.focusPage("#saveBtn").on("click", function () {
        if (com.validate("receiptModal"))
            return;

        if ("export_payment_receipt" == undefined) {
            com.showAlert(com.error, "任务不存在!");
            return;
        }

        var url = api.information.createPlan;
        var options = {
            "plan.task.keyWord": "export_payment_receipt"
        };

        var idreceiptTimes = com.focusPage("#idreceiptTimes").val();
        times = idreceiptTimes.split("-");

        var startTimes = new Date(times[0]);
        var endTimes = new Date(times[1]);
        var days = endTimes - startTimes;

        if ((days / 1000) > 31 * 24 * 60 * 60) {
            com.showAlert(com.warning, "时间范围不能超过31天!");
            return;
        }

        options["plan.args"] = com.focusPage("#idreceiptTimes").val();

        var times = new Date(receipt.items.executeDates.val() + ' ' + receipt.items.executeTimes.val());

        var date = receipt.items.executeDates.val();
        var time = receipt.items.executeTimes.val();
        var executeTime = date.replace(/-/g, '').substr(2) + time.replace(/:/g, '').substr(0, 4);

        if (planUtils.TimeComparison(times, config.planTimeLimit)) {
            options["plan.executeTime"] = executeTime;
        } else {
            com.showAlert(com.warning, "执行时间请大于当前时间" + config.planTimeLimit + "分钟!");
            return;
        }

        com.post(url, options, function (res) {
            com.showAlert(com.info, "计划创建成功!");
            com.focusPage("#receiptModal").modal("hide");
        });
    })
});

