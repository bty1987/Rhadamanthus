jQuery(function($) {

    var balanceAccount = {

        btns: {
            saveBtn: com.focusPage("#saveBtn"),
            withdrawBtn: com.focusPage("#withdrawBtn"),

            saveBccountBtn: com.focusPage("#saveBccountBtn"),
            saveCccountBtn: com.focusPage("#saveCccountBtn"),
        },

        modals: {
            addBalanceAccountModal: com.focusPage("#addBalanceAccountModal"),
            withdrawBalanceAccountModal: com.focusPage("#withdrawBalanceAccountModal"),

            addBccountModal: com.focusPage("#addBccountModal"),
            addCccountModal: com.focusPage("#addCccountModal"),
        },

        items: {
            money: com.focusPage("#money"),

            bname: com.focusPage("#name", "#addBccountModal"),
            buser: com.focusPage("#bccount", "#addBccountModal"),

            cname: com.focusPage("#name", "#addCccountModal"),
        },

        addItems: {
            name: com.focusPage("#name"),
            type: com.focusPage("#type"),
            belonger: com.focusPage("#belonger")
        },

        baid: null,
        isBalanceAccountType: {},
        isBalanceAccountStatus: {}
    };

    balanceAccount.btns.saveBtn.bindClick(saveData);
    balanceAccount.btns.withdrawBtn.bindClick(withdraw);
    balanceAccount.btns.saveBccountBtn.bindClick(addBccount);
    balanceAccount.btns.saveCccountBtn.bindClick(addCccount);

    balanceAccount.modals.addBalanceAccountModal.on("hide.bs.modal", function() {

        com.clearValidator();
        com.cleanTypeahead("belonger");
        com.cleanItems(balanceAccount.addItems);
    });

    balanceAccount.modals.withdrawBalanceAccountModal.on("hide.bs.modal", function() {

        com.clearValidator();
        com.cleanItems(balanceAccount.items);
    });

    balanceAccount.addItems.type.bindData(constant.balance().balanceAccount.type.datas, "key", "value");

    com.initTypeahead('belonger', api.personel.queryUserByPinyin, "pinyinName", {
        "departmentType.name": "",
        "user.status": 0
    }, "autoFillKeyValue", "key", "value", null);

    com.initTypeahead('bccount', api.personel.querySupplierByPinyin, "supplier.pinYin", {
        "departmentType.name": "",
        "user.status": 0
    }, "suppliers", "userId", "currentName", null);

    var displayFunc = (function() {

        var renderList = function(tableId, listData) {

            var $tableWrap = com.focusPage('#' + tableId);
            var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');

            if (listData && listData.length) {

                $.each(listData, function(i, v) {

                    var $liLine = creatLine(v);

                    $liLine.appendTo($ul);
                });

                $ul.appendTo($tableWrap);
            }
        };

        var creatLine = function(v) {

            var $liLine = $('<li></li>').addClass('item-orange clearfix');
            var $h3 = $('<h3></h3>').addClass("oid").append($('<small></small>').addClass('blue').html(v.name));
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

            var $invalid = $('<div></div>').addClass('pull-right');
            var $statusSwitch = $('<input/>').addClass('ace ace-switch ace-switch-5').prop({
                "type": "checkbox"
            });
            var $span = $('<span></span>').addClass('lbl status-lbl');
            var $btnWithdraw = $('<a></a>').addClass(' btn btn-minier btn-yellow').html('提款');

            $invalid.append($statusSwitch).append($span);
            $divBtnWrap.append($invalid).append($btnWithdraw).appendTo($h3);

            var propertyArr = [["归属人:", v.belonger.userName, "grey", function(btn) {

                tools.personel.info(btn, v.belonger.userId);
            }], ["创建人:", v.creater.currentName, "grey", function(btn) {

                tools.personel.info(btn, v.creater.userId);
            }], ["创建时间:", v.createTime, "grey"], ["应付额:", v.referMoney, "grey"], ["实付额:", v.realMoney, "grey"], ["余额:", v.surplus, "grey"], ["类型:", constant.balance().balanceAccount.type.keys[v.type], "red"], ["状态:", constant.balance().balanceAccount.status.keys[v.status], "red"], ];

            $.each(propertyArr, function(index, value) {

                var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                var $b = $('<b></b>').html(value[1]).addClass(value[2] ? value[2] : "").appendTo($liProperty);

                if (value[3]) {

                    $b.click(function() {

                        value[3]($b);
                    });
                }

                $liProperty.appendTo($ulProperty);
            });

            $divBtnWrap.appendTo($h3);

            $liLine.append($h3).append($ulProperty);

            !v.status && $statusSwitch.prop("checked", true);

            $invalid.click(function() {

                var cvalue = $statusSwitch.prop("checked") ? 0 : 1;

                updatastatus(v.baid, cvalue);
            });

            $btnWithdraw.click(function() {

                balanceAccount.baid = v.baid;
                balanceAccount.modals.withdrawBalanceAccountModal.modal("show");
            });

            return $liLine;
        };

        return {
            init: function(tableId, listData) {

                com.focusPage('#' + tableId).html(null);
                renderList(tableId, listData);
            },
            drawLine: function(v) {

                return creatLine(v);
            }
        };
    })();

    var searcher = new Searcher();

    searcher.init(["balance-balanceAccount-name", "balance-balanceAccount-type", "balance-balanceAccount-status"], "condList", api.balance.pageBalanceAccount, function(data) {

        displayFunc.init('resultList', data);
    }, "pagenation", "accountPostData", null, false, null, function() {

        var $adda = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('id', 'addBalanceAccount').css("margin", "0px 3px");
        var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
        var $addspan = $('<span></span>').text('添加').appendTo($adda);

        var $badda = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('id', 'addBccount').css("margin", "0px 3px");
        var $baddi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($badda);
        var $baddspan = $('<span></span>').text('添加结算').appendTo($badda);

        var $cadda = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('id', 'addCccount').css("margin", "0px 3px");
        var $caddi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($cadda);
        var $caddspan = $('<span></span>').text('添加出纳').appendTo($cadda);

        return [$adda, $badda, $cadda];
    });

    com.focusPage('#addBalanceAccount', '#pagenation').click(function() {

        balanceAccount.baid = null;

        com.clearValidator();
        com.cleanItems(balanceAccount.addItems);

        balanceAccount.modals.addBalanceAccountModal.modal("show");
    });

    com.focusPage('#addBccount', '#pagenation').click(function() {

        balanceAccount.baid = null;

        com.clearValidator();
        com.cleanItems(balanceAccount.items);
        
        balanceAccount.modals.addBccountModal.modal("show");
    });

    com.focusPage('#addCccount', '#pagenation').click(function() {

        balanceAccount.baid = null;

        com.clearValidator();
        com.cleanItems(balanceAccount.items);

        balanceAccount.modals.addCccountModal.modal("show");
    });

    function saveData() {

        if (com.validate("addBalanceAccountModal")) {
            return false;
        }

        var options = {
            'balanceAccount.belonger.userId': com.typeahead("belonger"),
            'balanceAccount.name': balanceAccount.addItems.name.val(),
            'balanceAccount.type': balanceAccount.addItems.type.val()
        };

        com.post(api.balance.addBalanceAccount, options, function(res) {

            com.showAlert(com.info, "操作成功");

            searcher.doSearch();
            balanceAccount.modals.addBalanceAccountModal.modal("hide");
        });
    }

    function addBccount() {

        if (com.validate("addBccountModal")) {
            return false;
        }

        var options = {
            'balanceAccount.belonger.userId': com.typeahead("bccount"),
            'balanceAccount.name': balanceAccount.items.bname.val(),
            'balanceAccount.type': 0
        };
        
        com.post(api.balance.addBalanceAccount, options, function(res) {

            com.showAlert(com.info, "操作成功");

            searcher.doSearch();
            accountes.modals.addBccountModal.modal("hide");
        });
    }

    function addCccount() {

        if (com.validate("addCccountModal")) {
            return false;
        }

        var options = {
            'balanceAccount.belonger.userId': params.userInfo.user.userId,
            'balanceAccount.name': balanceAccount.items.cname.val(),
            'balanceAccount.type': 1
        };

        com.post(api.balance.addBalanceAccount, options, function(res) {

            com.showAlert(com.info, "操作成功");

            searcher.doSearch();

            balanceAccount.modals.addCccountModal.modal("hide");
        });
    }

    function updatastatus(baid, newstatus) {

        com.post(api.balance.updateBalanceAccountForStatus, {
            "balanceAccount.baid": baid,
            "balanceAccount.status": newstatus
        }, function() {

            newstatus == 0 ? com.showAlert(com.info, "已启动") : com.showAlert(com.info, "已禁用");

            searcher.doSearch();
        });
    }

    function withdraw() {

        com.post(api.balance.withdrawBalanceAccount, {
            "balanceAccount.baid": balanceAccount.baid,
            "balanceAccount.money": balanceAccount.items.money.val()
        }, function() {

            com.showAlert(com.info, "操作成功");

            searcher.doSearch();

            balanceAccount.modals.withdrawBalanceAccountModal.modal("hide");
        });
    }
});
