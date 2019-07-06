jQuery(function ($) {
    receipt = {
        paymentTypes: {},
        receiptTypes: {},
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

    com.post(api.ds.payment, {}, function (res) {
        var paymentTypes = res.receiptPaymentType;
        var receiptTypes = res.receiptType;

        $.each(paymentTypes, function (i, v) {
            receipt.paymentTypes[v.key] = v.value;
        });

        $.each(receiptTypes, function (i, v) {
            receipt.receiptTypes[v.key] = v.value;
        });

    }, null, false);

    var displayFunc = (function () {
        var renderList = function (tableId, listData) {
            var $tableWrap = com.focusPage('#' + tableId);
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
            var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(v.type == 0 ? "收款" : "退款"));
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var propertyArr = [
                ["款项类型:", receipt.paymentTypes[v.paymentType], "red"],
                ["收据类型:", receipt.receiptTypes[v.receiptType], "red"],
                ["名称:", v.name == "" ? "无" : v.name, "grey"],
                ["金额:", v.money, "blue"],
                ["收款时间:", v.collectTime, "green"]
            ];

            $.each(propertyArr, function (index, value) {
                var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                $liProperty.appendTo($ulProperty);
            });

            $liLine.append($h3).append($ulProperty);

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

    searcher.init(["r_paymentType", "r_receiptType", "r_collectTime"], "condList", api.payment.pageReceipt, function (data) {
        displayFunc.init('resultList', data);
    }, "pagenation", "receiptPostData", null, false, null, function () {
        var $impa = $('<a></a>').addClass('btn btn-minier btn-success pull-left').attr('name', 'import').css("margin", "0px 3px");
        var $impi = $('<i></i>').addClass('icon-download-alt bigger-110').appendTo($impa);
        var $impspan = $('<span></span>').text('导出').appendTo($impa);

        return [$impa];
    });

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

        var times = receipt.items.executeDates.val() + ' ' + receipt.items.executeTimes.val();
        var executeTime = new Date(times);

        if (planUtils.TimeComparison(executeTime, config.planTimeLimit)) {
            options["plan.executeTime"] = times;
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

