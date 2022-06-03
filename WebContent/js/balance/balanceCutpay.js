$(function() {

    var balanceCutpay = {

        btns: {
            addBalanceCutpayBtn:com.focusPage("#addBalanceCutpayBtn"),// 添加
            saveBtn:com.focusPage("#saveBtn"),
            cancelBtn:com.focusPage("#cancelBtn"),
        },

        modals: {
            balanceCutpayModal:com.focusPage("#balanceCutpayModal"),
        },

        items: {
            money: com.focusPage("#money"),
            type: com.focusPage("#types"),
            comment: com.focusPage("#comment"),
        },

        bid: params.balance.bid,
        balanceCutpayType: {}
    };

    balanceCutpay.modals.balanceCutpayModal.on("hide.bs.modal", function() {
        com.cleanItems(balanceCutpay.items);
        com.clearValidator();
        com.closeTip();
    });

    com.post(api.ds.balance, {}, function(res) {
        com.focusPage("#types").bindData(res.balanceCutpayType, "key", "value");
        balanceCutpay.balanceCutpayType = res.balanceCutpayType.split("key", "value");
    }, null, false);

    var searcher = new Searcher();

    searcher.set("pageltList", "pageltList", "balanceCutpays", api.balance.queryBalanceCutpay, {
        "balanceCutpay.balance.bid": balanceCutpay.bid
    }, null, null, "balanceCutpays", true);

    var lineprops = [{
        fieId: "operateTime",
        name: "操作时间",
        prop: "operateTime",
        clazz: "green"
    }, {
        field: "money",
        name: "金额",
        prop: "money",
        clazz: "blue"
    }, {
        fieId: "cutpay",
        name: "总额",
        prop: "cutpay",
        clazz: "blue",
    }, {
        fieId: "type",
        name: "类型",
        prop: "type",
        clazz: "red",
        dataset: balanceCutpay.balanceCutpayType
    }, {
        fieId: "comment",
        name: "说明",
        prop: "comment",
        clazz: "grey"
    },];

    var linebtns = [];

    searcher.line("operater.currentName", lineprops, linebtns).render();

    com.focusPage('#addBalanceCutpayBtn').on("click", function () {

        balanceCutpay.modals.balanceCutpayModal.modal("show");
    });

    balanceCutpay.btns.saveBtn.on("click", function() {

        if (com.validate('balanceCutpayModal')) {
            return false;
        };

        var options ={
            "balanceCutpay.balance.bid" : balanceCutpay.bid,
            "balanceCutpay.type": balanceCutpay.items.type.val(),
            "balanceCutpay.money": balanceCutpay.items.money.val(),
            "balanceCutpay.comment": balanceCutpay.items.comment.val(),
        };

        com.post(api.balance.addBalanceCutpay, options, function(res) {

            com.showAlert(com.info, "添加成功");
            searcher.doSearch();
        });

        balanceCutpay.modals.balanceCutpayModal.modal("hide");
    });

});
