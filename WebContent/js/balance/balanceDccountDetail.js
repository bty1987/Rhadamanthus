$(function() {

    var balanceDccountDetail = {

        bdid: params.balance.bdid,

        btns: {
            saveAddBtn: com.focusPage("#saveAddBtn"),
            cancelBtn:com.focusPage("#cancelBtn"),
        },

        items: {
            name: com.focusPage("#name1"),
            money: com.focusPage("#money"),
            comment: com.focusPage("#comment1"),
        },

        modals: {
            addBalanceCutpayModal:com.focusPage("#addBalanceCutpayModal")
        }
    };

    var seacher = new Searcher();

    seacher.base("condList1", "pagenation1", "resultList1",api.balance.pageBalanceCutpay);

    seacher.param({
        "paging.page": 1,
        "paging.rows": 10,
        "filters[0].data": balanceDccountDetail.bdid,
        "filters[0].field": "dccountId",
        "filters[0].op": "eq"
    });

    seacher.button([{
        id : "addBalanceCutpay",
        name : "添加",
        clazz : "btn-yellow",
        icon : "icon-plus"
    }]);

    seacher.history("balanceDccountDetailPostData");

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
        field: "money",
        name: "金额",
        prop: "money",
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

    var linebtus = [];

    seacher.line("name", lineprops, linebtus).render();

    com.focusPage('#addBalanceCutpay').on("click", function() {

        balanceDccountDetail.modals.addBalanceCutpayModal.modal("show");
    });

    com.focusPage('#saveAddBtn').on("click", function() {

        if (com.validate('addBalanceCutpayModal')) {

            return false;
        };

        var options = {
            "balanceCutpay.dccount.bdid" : balanceDccountDetail.bdid,
            "balanceCutpay.name": balanceDccountDetail.items.name.val(),
            "balanceCutpay.type": constant.balance().balanceCutpay.TYPE_CUTPAY_INT,
            "balanceCutpay.money": balanceDccountDetail.items.money.val(),
            "balanceCutpay.comment": balanceDccountDetail.items.comment.val(),
        };

        com.post(api.balance.addBalanceCutpay, options, function(res) {

            com.showAlert(com.info, "添加成功");
            seacher.doSearch();
        });

        balanceDccountDetail.modals.addBalanceCutpayModal.modal("hide");
    });
});
