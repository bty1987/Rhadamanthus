$(function() {

    var balanceSelectionItem = {

        balance: params.balance,
        bsid: params.balance.bsid,

        typeList: [],
        statusList: []
    };

    com.focusPage('#fl-statement').statement("结算选材", "明细");

    var seacher = new Searcher();
    var history = "balanceSelectionItemPostData";

    seacher.base("condList", "pagenation", "resultList", api.balance.pageBalanceSelectionItem);

    seacher.param({
        "balanceSelection.bsid": balanceSelectionItem.bsid
    });

    seacher.condition(["balance-selection-item-orderId"]);

    seacher.history(history);

    seacher.button([{
        id: "checkAll",
        name: "全选",
        clazz: "btn-pink",
        icon: "icon-plus"
    }, {
        id: "unbind",
        name: "解绑",
        clazz: "btn-danger",
        icon: "icon-check"
    }, {
        id: "export",
        name: "业务导出",
        clazz: "btn-yellow",
        icon: "icon-download-alt"
    }, {
        id: "export1",
        name: "财务导出",
        clazz: "btn-yellow",
        icon: "icon-download-alt"
    }]);

    var lineprops = [{
        field: "bsiid",
        name: "多选",
        type: "checkbox",
        prop: "bsiid"
    }, {
        fieId: "selectionItem.goods.brand",
        name: "品牌",
        prop: "selectionItem.goods.brand",
        clazz: "grey"
    }, {
        fieId: "selectionItem.goods.category",
        name: "品类",
        prop: "selectionItem.goods.category",
        clazz: "grey"
    }, {
        fieId: "selectionItem.goods.no",
        name: "商品编号",
        prop: "selectionItem.goods.no",
        clazz: "blue"
    }, {
        fieId: "selectionItem.areaName",
        name: "功能区",
        prop: "selectionItem.areaName",
        clazz: "grey"
    }, {
        fieId: "selectionItem.type",
        name: "类型",
        prop: "selectionItem.type",
        clazz: "red",
        dataset: constant.quotation().selectionItem.type.keys
    }, {
        fieId: "selectionItem.status",
        name: "状态",
        prop: "selectionItem.status",
        clazz: "red",
        dataset: constant.quotation().selectionItem.status.keys
    }, {
        fieId: "selectionItem.postprice",
        name: "结算价",
        prop: "selectionItem.postprice",
        clazz: "blue"
    }, {
        fieId: "selectionItem.preprice",
        name: "预算金额",
        prop: "selectionItem.preprice",
        clazz: "blue"
    }, {
        fieId: "selectionItem.num",
        name: "拆单量",
        prop: function(v) {

            return [2, 4].indexOf(v.selectionItem.type) != -1 ? -v.selectionItem.num : v.selectionItem.num;
        },
        clazz: "blue"
    }, {
        fieId: "selectionItem.refnum",
        name: "退货量",
        prop: "selectionItem.refnum",
        clazz: "blue"
    }, {
        fieId: "selectionItem.initNum",
        name: "预算量",
        prop: "selectionItem.initNum",
        clazz: "blue"
    }, {
        fieId: "selectionItem.utility",
        name: "实用量",
        prop: function(v) {

            var utility = utils.changeThrDecimal(utils.accSub(parseFloat(v.selectionItem.num), parseFloat(v.selectionItem.refnum)))

            return [2, 4].indexOf(v.selectionItem.type) != -1 ? -utility : utility;
        },
        clazz: "blue"
    }, {
        fieId: "selectionItem.price",
        name: "成本",
        prop: function(v) {

            var cost = utils.changeThrDecimal(utils.accMul(utils.accSub(parseFloat(v.selectionItem.num), parseFloat(v.selectionItem.refnum)), parseFloat(v.selectionItem.postprice)));

            return [2, 4].indexOf(v.selectionItem.type) != -1 ? -cost : cost;
        },
        clazz: "blue"
    }, {
        fieId: "selectionItem.balancer.currentName",
        name: "结算人",
        prop: "selectionItem.balancer.currentName",
        clazz: "grey",
        click: function(btn, v) {

            tools.personel.info(btn, v.selectionItem.balancer.userId);
        }
    }, {
        fieId: "selectionItem.createTime",
        name: "拆单时间",
        prop: "selectionItem.createTime",
        clazz: "green"
    }, {
        fieId: "selectionItem.balanceTime",
        name: "结算时间",
        prop: "selectionItem.balanceTime",
        clazz: "green"
    }, {
        type: "newline",
    }, {
        fieId: "selectionItem.decoration.orderId",
        name: "装修单号",
        prop: "selectionItem.decoration.orderId",
        clazz: "blue",
        click: function(btn, v) {

            tools.decoration.info(btn, v.selectionItem.decoration.orderId);
        }
    }, {
        fieId: "selectionItem.decoration.house.village.name",
        name: "楼盘",
        prop: "selectionItem.decoration.house.village.name",
        clazz: "grey",
        click: function(btn, v) {

            tools.house.info(btn, v.selectionItem.decoration.house.hid);
        }
    }, {
        fieId: "selectionItem.decoration.house.houseNumber",
        name: "楼号",
        prop: "selectionItem.decoration.house.houseNumber",
        clazz: "grey"
    }, {
        fieId: "selectionItem.decoration.designer.currentName",
        name: "设计师",
        prop: "selectionItem.decoration.designer.currentName",
        clazz: "grey",
        click: function(btn, v) {

            tools.personel.info(btn, v.selectionItem.decoration.designer.userId);
        }
    }, {
        fieId: "selectionItem.decoration.supervisor.currentName",
        name: "监理",
        prop: "selectionItem.decoration.supervisor.currentName",
        clazz: "grey",
        click: function(btn, v) {

            tools.personel.info(btn, v.selectionItem.decoration.supervisor.userId);
        }
    }];

    var linebtus = [{
        name: "解绑",
        clazz: "btn-success",
        handle: function(v) {

            com.showConfirm("确定解除绑定", function() {

                var options = {};
                var bsiid = v.bsiid;
                var cost = balanceSelectionItem.balance.cost - (v.selectionItem.num - v.selectionItem.refnum) * v.selectionItem.postprice;
                var payment = balanceSelectionItem.balance.payment - (v.selectionItem.num - v.selectionItem.refnum) * v.selectionItem.postprice;

                options["balanceSelection.bsid"] = balanceSelectionItem.bsid;
                options["balanceSelection.income"] = balanceSelectionItem.balance.income;
                options["balanceSelection.cost"] = cost;
                options["balanceSelection.payment"] = payment;
                options["balanceSelection.profit"] = balanceSelectionItem.balance.profit;

                options["balanceSelectionItems[0].bsiid"] = bsiid;

                com.post(api.balance.unbindBalanceSelection, options, function(res) {

                    com.showAlert(com.info, "操作成功");
                    seacher.doSearch();
                });
            });

            return false;
        },
        show: function(v) {

            return (balanceSelectionItem.balance.status == constant.balance().balanceSales.STATUS_INIT_INT);
        }
    }, {
        name: "挂起",
        clazz: "btn-inverse",
        handle: function(v) {

            com.showConfirm("确定挂起", function() {

                var options = {};
                var bsiid = v.bsiid;
                var cost = balanceSelectionItem.balance.cost - (v.selectionItem.num - v.selectionItem.refnum) * v.selectionItem.postprice;
                var payment = balanceSelectionItem.balance.payment - (v.selectionItem.num - v.selectionItem.refnum) * v.selectionItem.postprice;

                options["balanceSelection.bsid"] = balanceSelectionItem.bsid;
                options["balanceSelection.income"] = balanceSelectionItem.balance.income;
                options["balanceSelection.cost"] = cost;
                options["balanceSelection.payment"] = payment;
                options["balanceSelection.profit"] = balanceSelectionItem.balance.profit;

                options["balanceSelectionItem.bsiid"] = bsiid;

                com.post(api.balance.pendingBalanceSelectionItem, options, function(res) {

                    com.showAlert(com.info, "操作成功");
                    seacher.doSearch();
                });
            });

            return false;
        },
        show: function(v) {

            return (balanceSelectionItem.balance.status == constant.balance().balanceSales.STATUS_INIT_INT);
        }
    }];

    seacher.line("selectionItem.goods.name", lineprops, linebtus).render();

    com.focusPage('#export', '#pagenation').on("click", function() {

        exports();
    });

    com.focusPage('#export1', '#pagenation').on("click", function() {

        exports1();
    });

    com.focusPage('#unbind', '#pagenation').on("click", function() {

        var $inputs = com.focusPage('input[type="checkbox"]:checked');

        if (!$inputs.length) {
            com.showAlert(com.warning, "请选择需要解绑数据");
            return false;
        }

        var options = {};

        $.each($inputs, function(i, v) {

            var $input = $(v);

            if ($input.attr('bsiid') != 0) {
                options["balanceSelectionItems[" + i + "].bsiid"] = $input.attr('bsiid');
            }
        });

        options["balanceSelection.bsid"] = balanceSelectionItem.bsid;
        options["balanceSelection.income"] = balanceSelectionItem.balance.income;
        options["balanceSelection.cost"] = 0;
        options["balanceSelection.payment"] = 0;
        options["balanceSelection.profit"] = balanceSelectionItem.balance.profit;

        com.post(api.balance.unbindBalanceSelection, options, function(res) {

            com.showAlert(com.info, "操作成功");

            seacher.doSearch();
        });
    });

    com.focusPage('#checkAll').on("click", function() {

        if (com.focusPage('input[type="checkbox"]').prop('checked')) {
            com.focusPage('input[type="checkbox"]').removeAttr('checked');
            com.focusPage('input[type="checkbox"]').prop('checked', false);
        } else {
            com.focusPage('input[type="checkbox"]').attr('checked', true);
            com.focusPage('input[type="checkbox"]').prop('checked', true);
        }
    });

    function exports1() {

        var total = com.focusPage('span[name="totalRecords"]', "#pagenation").text();

        if (total == 0) {
            com.showAlert(com.warning, "请通过条件进行查询");
            return false;
        }

        if (total > 2000) {
            com.showAlert(com.warning, "查询结果大于阀值 , 导出失败");
            return false;
        }

        com.post(api.balance.pageBalanceSelectionItem, $.extend({}, params[history], {
            "paging.noPage": 1,
            "balanceSelection.bsid": balanceSelectionItem.bsid
        }), function(res) {

            $.exceler({
                column: [//
                ['装修单号', 'selectionItem.decoration.orderId'], // 
                ['楼盘', 'selectionItem.decoration.house.village.name'], //
                ['楼号', 'selectionItem.decoration.house.houseNumber'], //
                ['设计师', 'selectionItem.decoration.designer.currentName'], //
                ['编号', 'selectionItem.goods.no'], //
                ['商品', 'selectionItem.goods.name'], //
                ['品类', 'selectionItem.goods.category'], //
                ['品牌', 'selectionItem.goods.brand'], //
                ['功能区', 'selectionItem.areaName'], //
                ['类型', 'selectionItem.type'], //
                ['状态', 'selectionItem.status'], //
                ['结算价', 'selectionItem.postprice'], //
                ['预算金额', 'selectionItem.preprice'], // 
                ['拆单量', 'num'], //
                ['退货量', 'selectionItem.refnum'], //
                ['预算量', 'selectionItem.initNum'], //
                ['实用量', 'utility'], //
                ['成本', 'price'], //
                ['结算人', 'selectionItem.balancer.currentName'], //
                ['拆单时间', 'selectionItem.createTime'], //
                ['结算时间', 'selectionItem.balanceTime']],
                list: res.paging.data
            }, function(v) {

                v.num = [2, 4].indexOf(v.selectionItem.type) != -1 ? -v.selectionItem.num : v.selectionItem.num;

                var utility = utils.changeThrDecimal(utils.accSub(parseFloat(v.selectionItem.num), parseFloat(v.selectionItem.refnum)));
                v.utility = [2, 4].indexOf(v.selectionItem.type) != -1 ? -utility : utility;

                var cost = utils.changeThrDecimal(utils.accMul(utils.accSub(parseFloat(v.selectionItem.num), parseFloat(v.selectionItem.refnum)), parseFloat(v.selectionItem.postprice)));
                v.price = [2, 4].indexOf(v.selectionItem.type) != -1 ? -cost : cost;

                v.selectionItem.status = constant.quotation().selectionItem.status.keys[v.selectionItem.status];
                v.selectionItem.type = constant.quotation().selectionItem.type.keys[v.selectionItem.type];
            });
        });
    }

    function exports() {

        var total = com.focusPage('span[name="totalRecords"]', "#pagenation").text();

        if (total == 0) {
            com.showAlert(com.warning, "请通过条件进行查询");
            return false;
        }

        if (total > 2000) {
            com.showAlert(com.warning, "查询结果大于阀值 , 导出失败");
            return false;
        }

        com.post(api.balance.pageBalanceSelectionItem, $.extend({}, params[history], {
            "paging.noPage": 1,
            "balanceSelection.bsid": balanceSelectionItem.bsid
        }), function(res) {

            $.exceler({
                column: [//
                ['序号', ''], //
                ['品牌', 'selectionItem.goods.brand'], //
                ['订单编号', 'selectionItem.decoration.orderId'], // 
                ['地址', 'address'], // 
                ['户型', 'selectionItem.decoration.house.houseType'], // 
                ['功能区', 'selectionItem.areaName'], // 
                ['品类', 'selectionItem.goods.category'], // 
                ['一级类别', 'selectionItem.goods.onekind.name'], // 
                ['二级类别', 'selectionItem.goods.twokind.name'], // 
                ['三级类别', 'selectionItem.goods.thrkind.name'], //
                ['型号', 'selectionItem.goods.name'], //
                ['颜色', ''], //
                ['规格', ''], //
                ['单位', 'selectionItem.goods.measurementUnit'], //
                ['数量', 'relnum'], //
                ['单价', 'selectionItem.postprice'], //
                ['结算值', 'totalprice'], //
                ['合计金额', 'totalprice'], //
                ['备注', 'selectionItem.comment'], //
                ['面积', 'selectionItem.decoration.house.innerArea'], //
                ['标配/升级', ''], //
                ],
                list: res.paging.data
            }, function(v) {

                v.num = [2, 4].indexOf(v.selectionItem.type) != -1 ? -v.selectionItem.num : v.selectionItem.num;

                var utility = utils.changeThrDecimal(utils.accSub(parseFloat(v.selectionItem.num), parseFloat(v.selectionItem.refnum)));
                v.utility = [2, 4].indexOf(v.selectionItem.type) != -1 ? -utility : utility;

                var cost = utils.changeThrDecimal(utils.accMul(utils.accSub(parseFloat(v.selectionItem.num), parseFloat(v.selectionItem.refnum)), parseFloat(v.selectionItem.postprice)));
                v.price = [2, 4].indexOf(v.selectionItem.type) != -1 ? -cost : cost;

                v.posttotal = utils.changeThrDecimal(utils.accMul(parseFloat(v.selectionItem.num), parseFloat(v.selectionItem.postprice)));

                v.selectionItem.status = constant.quotation().selectionItem.status.keys[v.selectionItem.status];
                v.selectionItem.type = constant.quotation().selectionItem.type.keys[v.selectionItem.type];

                v.address = v.selectionItem.decoration.house.village.name + " " + v.selectionItem.decoration.house.houseNumber;
                v.relnum = utils.changeThrDecimal(utils.accSub(parseFloat(v.selectionItem.num), parseFloat(v.selectionItem.refnum)))
                v.totalprice = utils.changeThrDecimal(utils.accMul(utils.accSub(parseFloat(v.selectionItem.num), parseFloat(v.selectionItem.refnum)), parseFloat(v.selectionItem.postprice)))
            });
        });
    }

});
