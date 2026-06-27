jQuery(function($) {

    var balance = {

        btns: {
            addConfirmBtn: com.focusPage("#addConfirmBtn"),
            balanceBtn: com.focusPage("#balanceBtn").click(balance),
        },

        modals: {
            addModal: com.focusPage("#addModal"),
            balanceModal: com.focusPage("#balanceModal"),
        },

        items: {
            type: com.focusPage("#type"),
            belongerName: com.focusPage("#belongerName"),
            amount: com.focusPage("#amount"),

            bccount: com.focusPage("#bccount"),
            cccount: com.focusPage("#cccount"),
        },

        isType: {},
        isStatus: {},
        selectList: [],

        balance: null,
    };

    balance.btns.addConfirmBtn.bindClick(addBalance);

    balance.modals.addModal.on("hide.bs.modal", function() {

        com.cleanItems(balance.items);
        com.clearValidator();
        com.closeTip();
    });

    balance.items.type.bindData(constant.balance().balance.type.datas, "key", "value");

    com.initTypeahead('belongerName', api.personel.queryUserByPinyin, "pinyinName", {
        "user.status": 0
    }, "autoFillKeyValue", "key", "value", null);
    
    com.post(api.balance.queryBalanceAccountForTeller, {}, function (res) {

        balance.items.cccount.bindData(res.balanceAccountes, "baid", "name");
    }, null, false);

    var lineprops = (function() {

        return [{
            type: "checkbox",
            field: "id",
            name: "balance",
            prop: "bid",
            clazz: "ace ace-checkbox-2",
            checked: function(v) {
                return balance.selectList.contains(String(v.bid));
            },
            click: function($input, v) {
                var bid = $input.attr("id");
                var checked = $input.prop("checked");

                if (checked)
                    !balance.selectList.contains(bid) && balance.selectList.push(bid);
                else
                    balance.selectList.contains(bid) && balance.selectList.splice(balance.selectList.indexOf(bid), 1);
            }
        }, {
            field: "belonger.userName",
            name: "归属人",
            prop: "belonger.userName",
            clazz: "grey",
            click: function(btn, v) {
                tools.personel.info(btn, v.belonger.userId);
            }
        }, {
            field: "creater.userName",
            name: "创建人",
            prop: "creater.userName",
            clazz: "grey",
            click: function(btn, v) {
                tools.personel.info(btn, v.creater.userId);
            }
        }, {
            field: "createTime",
            name: "创建时间",
            prop: "createTime",
            clazz: "green"
        }, {
            field: "balancer.userName",
            name: "结算人",
            prop: function(v) { return v.balancer ? v.balancer.userName : ""; },
            clazz: "grey",
            click: function(btn, v) {
                tools.personel.info(btn, v.creater.userId);
            }
        }, {
            field: "balanceTime",
            name: "结算时间",
            prop: "balanceTime",
            clazz: "green"
        }, {
            field: "payeder.userName",
            name: "付款人",
            prop: function(v) { return v.payeder ? v.payeder.userName : ""; },
            clazz: "grey",
            click: function(btn, v) {
                tools.personel.info(btn, v.creater.userId);
            }
        }, {
            field: "payedTime",
            name: "付款时间",
            prop: "payedTime",
            clazz: "green"
        }, {
            field: "amount",
            name: "金额",
            prop: "amount",
            clazz: "blue"
        }, {
            field: "cutpay",
            name: "扣款总额",
            prop: "cutpay",
            clazz: "blue"
        }, {
            field: "type",
            name: "类型",
            prop: function(v) { return constant.balance().balance.type.keys[v.type]; },
            clazz: "red"
        }, {
            field: "status",
            name: "状态",
            prop: function(v) { return constant.balance().balance.status.keys[v.status]; },
            clazz: "red"
        }, {
            field: "isPay",
            name: "付款标识",
            prop: function(v) { return constant.balance().balance.isPay.keys[v.isPay]; },
            clazz: "red"
        }];
    })();

    var linebtns = (function() {

        return {
            payBalance: {
                name: "出纳",
                clazz: "btn-danger",
                handle: function(v) {
                    params.balance.bid = v.bid;
                    params.balance.uid = v.belonger.uid;
                    params.balance.surplus = v.surplus;

                    com.popup4page("#stockRecordPopUp", api.index.balance2accountIndex.url, "出纳", "", function() {
                        searcher.doSearch();
                    });
                }
            },
            account: {
                name: "结算",
                clazz: "btn-yellow",
                handle: function(v) {
                    balance.balance = v;

                    com.clearValidator();
                    com.cleanItems(balance.items);

                    com.post(api.balance.queryBalanceAccount, {
                        "balanceAccount.belonger.uid": v.belonger.uid
                    }, function(res) {

                        balance.items.bccount.bindData(res.balanceAccountes, "baid", "name");
                    }, null, false);

                    balance.modals.balanceModal.modal("show");
                }
            },
            balance: {
                name: "结算",
                clazz: "btn-yellow",
                handle: function(v) {
                    params.balance.bid = v.bid;
                    params.balance.uid = v.belonger.uid;
                    params.balance.surplus = v.surplus;

                    com.popup4page("#stockRecordPopUp", api.index.balance2balanceIndex.url, "结算", "", function() {
                        searcher.doSearch();
                    });
                }
            },
            balanceDetail: {
                name: "结算明细",
                clazz: "btn-success",
                handle: function(v) {
                    params.balance.bid = v.bid;
                    com.popup4page("#stockRecordPopUp", api.index.balanceDetailIndex.url, "结算明细");
                }
            },
            balanceCutpay: {
                name: "结算扣款",
                clazz: "btn-info",
                handle: function(v) {
                    params.balance = v;
                    params.balance.bid = v.bid;
                    params.balance.uid = v.belonger.uid;

                    com.popup4page("#stockRecordPopUp", api.index.balanceCutpayIndex.url, "结算扣款");
                }
            },
            apportDetail: {
                name: "分摊明细",
                clazz: "btn-warning",
                handle: function(v) {
                    params.balance.bid = v.bid;
                    com.popup4page("#stockRecordPopUp", api.index.apportDetailIndex.url, "分摊明细");
                }
            }
        };
    })();

    var buttons = (function() {

        var $checka = $('<a></a>').addClass('btn btn-minier btn-yellow pull-left').attr('id', 'checks').css("margin", "0px 3px");
        var $checki = $('<i></i>').addClass('icon-check bigger-110').appendTo($checka);
        var $checkspan = $('<span></span>').text('付款').appendTo($checka);

        $checka.click(function() {

            var options = {};

            if (balance.selectList.length == 0) {
                com.showAlert(com.warning, "请选择需要进行付款的结算单");
                return false;
            }

            $.each(balance.selectList, function(i, v) {

                options["balances[" + i + "].bid"] = v;
            });

            com.post(api.balance.payedBalance, options, function() {

                com.showAlert(com.info, "操作成功");
                searcher.doSearch();
                balance.selectList = [];
            });
        });

        return [$checka];
    })();

    var searcher = new Searcher();

    searcher.set("condList", "pagenation", "resultList", api.balance.pageBalance, null, ["balance-balance-no", "balance-balance-type", "balance-balance-status", "balance-balance-isPay"], "balancePostData", null, false, buttons);
    searcher.line("no", lineprops, linebtns).render();

    com.focusPage("#addBalance").click(function() {

        balance.modals.addModal.modal("show");
    });

    function addBalance() {

        if (com.validate('addModal')) {
            return false;
        }

        var options = {
            "balance.belonger.userId": com.typeahead("belongerName"),
            "balance.amount": balance.items.amount.val(),
            "balance.type": balance.items.type.val()
        };

        com.post(api.balance.addBalance, options, function(res) {

            com.showAlert(com.info, "操作成功");
            searcher.doSearch();
        });

        balance.modals.addModal.modal("hide");
    }
    
    function balance(){
        
        if (com.validate('balanceModal')) {
            return false;
        }
        
        var options = {
            "balance.bid": balance.balance.bid,
            "balanceAccountes[0].money": balance.balance.surplus,
            "balanceAccountes[0].baid": balance.items.bccount.val(),
            "balanceAccountes[1].money": balance.balance.surplus,
            "balanceAccountes[1].baid": balance.items.cccount.val(),
        };
        
        com.post(api.balance.balanceBalance, options, function() {

            com.showAlert(com.info, "操作成功");
            
            balance.modals.balanceModal.modal("hide");
        });
    }

});