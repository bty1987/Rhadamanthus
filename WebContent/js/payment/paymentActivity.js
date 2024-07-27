$(function() {

    var paymentActivity = {
        types: constant.payment().receipt.paymentType.keys,
        items: {
            type: com.focusPage("#type", "#updatePaymentActivityModal"),
            activity: com.focusPage("#activity", "#updatePaymentActivityModal"),
            comment: com.focusPage("#comment", "#updatePaymentActivityModal")
        },
        modals: {
            updatePaymentActivityModal: com.focusPage("#updatePaymentActivityModal")
        },
        btns: {
            saveBtn: com.focusPage("#saveBtn").on("click", saveData)
        },
        currentPaid: null
    };

    paymentActivity.items.type.bindData(constant.information().activity.type.datas, "key", "value");

    com.post(api.information.queryActivityForValid, {"activity.type": paymentActivity.items.type.val()}, function(res) {

        paymentActivity.items.activity.bindData(res.activitys, "aid", "name");
    });

    paymentActivity.items.type.on("change", function() {

        com.post(api.information.queryActivityForValid, {"activity.type": paymentActivity.items.type.val()}, function(res) {

            paymentActivity.items.activity.bindData(res.activitys, "aid", "name");
        });
    });

    var searcher = new Searcher();

    searcher.base("condList", "pagenation", "resultList", api.payment.pagePaymentActivity);

    searcher.condition(["payment-orderId", "payment-paymentActivity-type", "payment-createTime"]);

    searcher.history("paymentActivityPostData");

    var lineprops = [{
        fieId: "type",
        name: "类型",
        prop: "type",
        clazz: "red",
        dataset: paymentActivity.types
    }, {
        fieId: "activityName",
        name: "活动名称",
        prop: "activity.name",
        clazz: "grey"
    }, {
        fieId: "realMoney",
        name: "实付额",
        prop: "realMoney",
        clazz: "blue"
    }, {
        fieId: "multiple",
        name: "倍数",
        prop: "multiple",
        clazz: "blue"
    }, {
        fieId: "createTime",
        name: "创建时间",
        prop: "createTime",
        clazz: "green"
    }, {
        fieId: "comment",
        name: "说明",
        prop: "comment",
        clazz: "grey"
    }];

    var linebtns = [{
        name: "更新",
        clazz: "btn-yellow",
        handle: function(v) {

            com.cleanItems(paymentActivity.items);

            paymentActivity.currentPaid = v.paid;

            paymentActivity.modals.updatePaymentActivityModal.modal("show");

            return false;
        }
    }];

    searcher.line("orderId", lineprops, linebtns).render();

    function saveData() {

        if (com.validate('updatePaymentActivityModal'))
            return false;

        var url = api.payment.updatePaymentActivity;
        var options = {
            "paymentActivity.paid": paymentActivity.currentPaid,
            "paymentActivity.activity.aid": paymentActivity.items.activity.val(),
            "paymentActivity.comment": paymentActivity.items.comment.val()
        };

        com.post(url, options, function() {

            searcher.doSearch();
            paymentActivity.modals.updatePaymentActivityModal.modal("hide");
        });
    }
});
