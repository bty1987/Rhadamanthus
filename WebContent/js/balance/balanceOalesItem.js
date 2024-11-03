$(function() {

    var balanceOalesItem = {

        boid: params.balance.boid,

        typeList: [],
        statusList: []
    };

    com.focusPage('#fl-statement').statement("结算外销", "明细");

    var seacher = new Searcher();
    var history = "balanceOalesItemPostData";

    seacher.base("condList", "pagenation", "resultList", api.balance.pageBalanceOalesItem);

    seacher.param({
        "balanceOales.boid": balanceOalesItem.boid
    });

    seacher.history(history);

    var lineprops = [{
        fieId: "orderId",
        name: "装修单号",
        prop: "oales.decoration.orderId",
        clazz: "blue",
        click: function(btn, v) {

            tools.decoration.info(btn, v.oales.decoration.orderId);
        }
    }, {
        fieId: "village",
        name: "楼盘",
        prop: "oales.decoration.house.village.name",
        clazz: "grey"
    }, {
        fieId: "houseNumber",
        name: "楼号",
        prop: "oales.decoration.house.houseNumber",
        clazz: "blue"
    }, {
        fieId: "supplier",
        name: "厂商",
        prop: "oales.supplier.currentName",
        clazz: "grey",
        click: function(btn, v) {

            tools.personel.info(btn, v.oales.supplier.userId);
        }
    }, {
        fieId: "creater",
        name: "创建人",
        prop: "oales.creater.currentName",
        clazz: "grey",
        click: function(btn, v) {

            tools.personel.info(btn, v.oales.creater.userId);
        }
    }, {
        fieId: "servicer",
        name: "服务管家",
        prop: "oales.servicer.currentName",
        clazz: "grey",
        click: function(btn, v) {

            tools.personel.info(btn, v.oales.servicer.userId);
        }
    }, {
        fieId: "channer",
        name: "渠道",
        prop: "oales.channer.currentName",
        clazz: "grey",
        click: function(btn, v) {

            tools.personel.info(btn, v.oales.channer.userId);
        }
    }, {
        fieId: "cdept",
        name: "渠道部门",
        prop: "oales.dept.name",
        clazz: "grey"
    }, {
        fieId: "cfatherDept",
        name: "渠道分区",
        prop: "oales.region.name",
        clazz: "grey"
    }, {
        fieId: "materialer",
        name: "主材员",
        prop: "oales.materialer.currentName",
        clazz: "grey",
        click: function(btn, v) {

            tools.personel.info(btn, v.oales.materialer.userId);
        },
        show: function(v) {

            return (v.oales.status == constant.sales().oales.STATUS_CHECK_INT || v.oales.status == constant.sales().oales.STATUS_CONFIRM_INI);
        }
    }, {
        field: "createTime",
        name: "创建时间",
        prop: "oales.createTime",
        clazz: "green"
    }, {
        field: "confirmTime",
        name: "确认时间",
        prop: "oales.confirmTime",
        clazz: "green"
    }, {
        field: "checkTime",
        name: "复核时间",
        prop: "oales.checkTime",
        clazz: "green",
        show: function(v) {

            return (v.oales.status == constant.sales().oales.STATUS_CHECK_INT || v.oales.status == constant.sales().oales.STATUS_CONFIRM_INI);
        }
    }, {
        field: "brand",
        name: "品牌",
        prop: "oales.brand",
        clazz: "grey",
        click: function(btn, v) {

            tools.brand.info(btn, v.oales.bid);
        }
    }, {
        field: "category",
        name: "品类",
        prop: "oales.category",
        clazz: "grey"
    }, {
        field: "atttype",
        name: "类型",
        prop: "oales.atttype",
        clazz: "red",
        dataset: constant.sales().oales.atttype.keys,
    }, {
        field: "awardType",
        name: "奖励类型",
        prop: "oales.awardType",
        clazz: "red",
        dataset: constant.sales().oales.awardType.keys,
    }, {
        field: "total",
        name: "总额",
        prop: "oales.total",
        clazz: "blue"
    }, {
        field: "award",
        name: "奖励",
        prop: "oales.award",
        clazz: "blue"
    }, {
        field: "profit",
        name: "利润",
        prop: "oales.profit",
        clazz: "blue"
    }, {
        field: "cost",
        name: "成本",
        prop: "oales.cost",
        clazz: "blue",
        show: function(v) {

            return (v.oales.status == constant.sales().oales.STATUS_CHECK_INT || v.oales.status == constant.sales().oales.STATUS_CONFIRM_INI);
        }
    }, {
        field: "threshold",
        name: "系数",
        prop: "oales.threshold",
        clazz: "blue",
        show: function(v) {

            return (v.oales.status == constant.sales().oales.STATUS_CHECK_INT || v.oales.status == constant.sales().oales.STATUS_CONFIRM_INI);
        }
    }, {
        fieId: "status",
        name: "状态",
        prop: "oales.status",
        clazz: "red",
        dataset: constant.sales().oales.status.keys,
    }, {
        fieId: "type",
        name: "类型",
        prop: "oales.type",
        clazz: "red",
        dataset: constant.sales().oales.type.keys,
    }];

    var linebtus = [{
        name: "解绑",
        clazz: "btn-success",
        handle: function(v) {

            com.showConfirm("确定解除绑定", function() {

                var options = {};
                
                options["balanceOales.boid"] = balanceOalesItem.boid;
                options["balanceOalesItems[0].boiid"] = v.boiid;

                com.post(api.balance.unbindBalanceOales, options, function(res) {

                    com.showAlert(com.info, "操作成功");
                    seacher.doSearch();
                });
            });

            return false;
        }
    }];

    seacher.line("oales.no", lineprops, linebtus).render();

});
