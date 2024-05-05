$(function() {

    var balanceCutpay = {

        btns: {
            addBalanceCutpayBtn:com.focusPage("#balanceCutpayBtn"),// 添加
            saveBtn:com.focusPage("#saveBtn"),
            cancelBtn:com.focusPage("#cancelBtn"),
            saveDeductBtn:com.focusPage("#saveDeductBtn"),
            addBalanceDccountBtn:com.focusPage("#addBalanceCutpayBtn"),
            saveAddBtn:com.focusPage("#saveAddBtn"),
            printBtn:com.focusPage("#printBtn"),
        },

        modals: {
            balanceCutpayModal:com.focusPage("#balanceCutpayModal"),
            deductBalanceCutpayModal:com.focusPage("#deductBalanceCutpayModal"),
            addBalanceCutpayModal:com.focusPage("#addBalanceCutpayModal")
        },

        items: {
            money: com.focusPage("#money"),
            comment: com.focusPage("#comment"),
            name: com.focusPage("#name"),
            deductMoney: com.focusPage("#deductMoney"),
            deductComment: com.focusPage("#deductComment"),
            balanceCutpayName: com.focusPage("#balanceCutpayName"),
            balanceDccountName: com.focusPage("#balanceDccountName"),
            balanceDccountSurplus: com.focusPage("#balanceDccountSurplus"),
            balanceDccountCutpay: com.focusPage("#balanceDccountCutpay"),
            balanceCutpayMoney: com.focusPage("#balanceCutpayMoney"),
            balanceCutpayComment: com.focusPage("#balanceCutpayComment"),
        },

        uid: params.balance.uid,
        bcid: null,
        deductName: null,
        bid: params.balance.bid,
        balance: params.balance,
        balanceCutpayType: {}
    };

    balanceCutpay.modals.balanceCutpayModal.on("hide.bs.modal", function() {

        com.cleanItems(balanceCutpay.items);
        com.clearValidator();
        com.closeTip();
    });

    balanceCutpay.modals.addBalanceCutpayModal.on("hide.bs.modal", function(e) {

        com.clearValidator();
        com.cleanTypeahead("name1");
        com.cleanItems(balanceCutpay.items);
    });

    com.post(api.balance.queryBalanceDccount, {"balanceDccount.belonger.uid": balanceCutpay.uid}, function(res) {

        var balanceDccountes = [];
        balanceDccountes.push({name:" "});

        $.each(res.balanceDccountes, function(i, v) {

            if (v.status == 0){

                balanceDccountes.push(v);
            }
        });

        com.focusPage("#balanceDccountName").bindData(balanceDccountes, "bdid", "name");
    }, null, false);

    balanceCutpay.items.balanceDccountName.on('change', function() {

        com.post(api.balance.queryBalanceDccount, {"balanceDccount.belonger.uid": balanceCutpay.uid}, function(res) {

            $.each(res.balanceDccountes, function(i, v) {

                if(com.focusPage("#balanceDccountName").val() == v.bdid){

                    com.focusPage("#balanceDccountSurplus").val(v.surplus);
                    com.focusPage("#balanceDccountCutpay").val(v.cutpay);
                }
            });
        });
    });

    var searcher = new Searcher();

    searcher.set("pageltList", "pageltList", "balanceCutpays", api.balance.queryBalanceCutpay, {
        "balanceCutpay.balance.bid": balanceCutpay.bid
    }, null, null, "balanceCutpays", true);

    var lineprops = [{
        fieId: "operater.currentName",
        name: "操作人",
        prop: "operater.currentName",
        clazz: "grey",
        click: function(btn, v) {

            tools.personel.info(btn, v.operater.userId);
        }
    }, {
        fieId: "operateTime",
        name: "操作时间",
        prop: "operateTime",
        clazz: "green",
    }, {
        field: "cutpay.name",
        name: "关联扣款",
        prop: "cutpay.name",
        clazz: "grey",
    }, {
        field: "dccount.name",
        name: "关联扣款账户",
        prop: "dccount.name",
        clazz: "grey",
    }, {
        field: "money",
        name: "金额",
        prop: "money",
        clazz: "blue",
    }, {
        fieId: "total",
        name: "总额",
        prop: "total",
        clazz: "blue",
    }, {
        fieId: "type",
        name: "类型",
        prop: "type",
        clazz: "red",
        dataset: constant.balance().balanceCutpay.type.keys,
    }, {
        fieId: "comment",
        name: "说明",
        prop: "comment",
        clazz: "grey",
    }];

    var linebtns = [{
        name: "抵扣",
        clazz: "btn-yellow",
        handle: function(v) {

            balanceCutpay.deductName = v.name;
            balanceCutpay.bcid = v.bcid;
            deductBalanceCutpay(v);
            return false;
        }
    }];

    searcher.line("name", lineprops, linebtns).render();

    com.focusPage('#balanceCutpayBtn').on("click", function () {

        balanceCutpay.modals.balanceCutpayModal.modal("show");
    });

    com.focusPage('#addBalanceCutpayBtn').on("click", function () {

        balanceCutpay.modals.addBalanceCutpayModal.modal("show");
    });

    com.focusPage('#printBtn').on("click", function () {

        params.balance = balanceCutpay.balance;

        com.popup("扣款明细表", api.index.balanceCutpay2print.url, null, null, true);
    });

    function deductBalanceCutpay(v) {

        balanceCutpay.modals.deductBalanceCutpayModal.modal("show");
    };

    balanceCutpay.btns.saveBtn.on("click", function() {

        if (com.validate('balanceCutpayModal')) {

            return false;
        };

        var options ={
            "balanceCutpay.balance.bid" : balanceCutpay.bid,
            "balanceCutpay.name": balanceCutpay.items.name.val(),
            "balanceCutpay.type": constant.balance().balanceCutpay.TYPE_CUTPAY_INT,
            "balanceCutpay.money": balanceCutpay.items.money.val(),
            "balanceCutpay.comment": balanceCutpay.items.comment.val(),
        };

        com.post(api.balance.addBalanceCutpay, options, function(res) {

            com.showAlert(com.info, "添加成功");
            searcher.doSearch();
        });

        balanceCutpay.modals.balanceCutpayModal.modal("hide");
    });

    balanceCutpay.btns.saveDeductBtn.on("click", function() {

        if (com.validate('deductBalanceCutpayModal')) {

            return false;
        };

        var options ={
            "balanceCutpay.balance.bid": balanceCutpay.bid,
            "balanceCutpay.bcid": balanceCutpay.bcid,
            "balanceCutpay.name": balanceCutpay.deductName,
            "balanceCutpay.type": constant.balance().balanceCutpay.TYPE_UNCUTPAY_INT,
            "balanceCutpay.money": balanceCutpay.items.deductMoney.val(),
            "balanceCutpay.comment": balanceCutpay.items.deductComment.val(),
        };

        com.post(api.balance.deductBalanceCutpay, options, function(res) {

            com.showAlert(com.info, "操作成功");
            searcher.doSearch();
        });

        balanceCutpay.modals.deductBalanceCutpayModal.modal("hide");
    });

    balanceCutpay.btns.saveAddBtn.on("click", function() {

        if (com.validate('addBalanceCutpayModal')) {

            return false;
        };

        var options ={
            "balanceCutpay.balance.bid" : balanceCutpay.bid,
            "balanceCutpay.dccount.bdid" : balanceCutpay.items.balanceDccountName.val(),
            "balanceCutpay.name": balanceCutpay.items.balanceCutpayName.val(),
            "balanceCutpay.type": constant.balance().balanceCutpay.TYPE_CUTPAY_INT,
            "balanceCutpay.money": balanceCutpay.items.balanceCutpayMoney.val(),
            "balanceCutpay.comment": balanceCutpay.items.balanceCutpayComment.val(),
        };

        com.post(api.balance.addBalanceCutpay, options, function(res) {

            com.showAlert(com.info, "添加成功");
            searcher.doSearch();
        });

        balanceCutpay.modals.addBalanceCutpayModal.modal("hide");
    });
});
