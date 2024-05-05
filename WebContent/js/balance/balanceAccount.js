jQuery(function($) {

    var balanceAccountes = {

        btns: {
            saveBtn: com.focusPage("#saveBtn"),
            withdrawBtn: com.focusPage("#withdrawBtn"),
        },

        modals: {
            addBalanceAccountModal : com.focusPage("#addBalanceAccountModal"),
            withdrawBalanceAccountModal : com.focusPage("#withdrawBalanceAccountModal"),
        },

        items: {
            money : com.focusPage("#money"),
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

    balanceAccountes.btns.saveBtn.bindClick(saveData);
    balanceAccountes.btns.withdrawBtn.bindClick(withdraw);

    balanceAccountes.modals.addBalanceAccountModal.on("hide.bs.modal", function () {

        com.clearValidator();
        com.cleanTypeahead("belonger");
        com.cleanItems(balanceAccountes.addItems);
    });

    balanceAccountes.modals.withdrawBalanceAccountModal.on("hide.bs.modal", function () {

        com.clearValidator();
        com.cleanItems(balanceAccountes.items);
    });

    balanceAccountes.addItems.type.bindData(constant.balance().balanceAccount.type.datas, "key", "value");

    com.initTypeahead('belonger', api.personel.queryUserByPinyin, "pinyinName", {"departmentType.name" : "", "user.status" : 0}, "autoFillKeyValue", "key", "value", null);

    var displayFunc  = (function() {

        var renderList = function(tableId,listData) {

            var $tableWrap = com.focusPage('#' + tableId);
            var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');

            if (listData && listData.length) {

                $.each(listData,function(i, v) {

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
            var $statusSwitch = $('<input/>').addClass('ace ace-switch ace-switch-5').prop({"type" : "checkbox"});
            var $span = $('<span></span>').addClass('lbl status-lbl');
            var $btnWithdraw = $('<a></a>').addClass(' btn btn-minier btn-yellow').html('提款');

            $invalid.append($statusSwitch).append($span);
            $divBtnWrap.append($invalid).append($btnWithdraw).appendTo($h3);

            var propertyArr = [
                ["归属人:", v.belonger.userName, "grey", function(btn) {

                    tools.personel.info(btn, v.belonger.userId);
                }],
                ["创建人:", v.creater.currentName, "grey", function(btn) {

                    tools.personel.info(btn, v.creater.userId);
                }],
                ["创建时间:", v.createTime, "grey"],
                ["应付额:", v.referMoney, "grey"],
                ["实付额:", v.realMoney, "grey"],
                ["余额:", v.surplus, "grey"],
                ["类型:", constant.balance().balanceAccount.type.keys[v.type], "red"],
                ["状态:", constant.balance().balanceAccount.status.keys[v.status], "red"],
            ];

            $.each(propertyArr, function (index, value) {

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

                var cvalue = $statusSwitch.prop("checked") ? 0:1;

                updatastatus(v.baid, cvalue);
            });

            $btnWithdraw.click(function() {

                balanceAccountes.baid = v.baid;
                balanceAccountes.modals.withdrawBalanceAccountModal.modal("show");
            });

            return $liLine;
        };

        return {
            init : function(tableId,listData) {

                com.focusPage('#' + tableId).html(null);
                renderList(tableId,listData);
            },
            drawLine : function(v) {

                return creatLine(v);
            }
        };
    })();

    var searcher = new Searcher();

    searcher.init(["balance-balanceAccount-name", "balance-balanceAccount-status"], "condList", api.balance.pageBalanceAccount, function(data){
        displayFunc.init('resultList', data);
    }, "pagenation", "accountPostData",null, false, null, function() {

        var $adda = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('id', 'addBalanceAccount').css("margin", "0px 3px");
        var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
        var $addspan = $('<span></span>').text('添加').appendTo($adda);

        return [$adda];
    });

    com.focusPage('#addBalanceAccount', '#pagenation').click(function() {

        balanceAccountes.baid = null;

        com.clearValidator();
        com.cleanItems(balanceAccountes.addItems);

        balanceAccountes.modals.addBalanceAccountModal.modal("show");
    });

    function saveData() {

        if (com.validate("addBalanceAccountModal")) {
            return false;
        }

        var options = {
            'balanceAccount.belonger.userId': com.typeahead("belonger"),
            'balanceAccount.name': balanceAccountes.addItems.name.val(),
            'balanceAccount.type': balanceAccountes.addItems.type.val()
        };

        com.post(api.balance.addBalanceAccount, options, function(res) {

            com.showAlert(com.info, "操作成功");

            searcher.doSearch();
            balanceAccountes.modals.addBalanceAccountModal.modal("hide");
        });
    }

    function updatastatus(baid, newstatus) {

        com.post(api.balance.updateBalanceAccountForStatus, {"balanceAccount.baid": baid, "balanceAccount.status": newstatus}, function() {
            newstatus == 0 ? com.showAlert(com.info, "已启动") : com.showAlert(com.info, "已禁用");

            searcher.doSearch();
        });
    }

    function withdraw() {

        com.post(api.balance.withdrawBalanceAccount, {"balanceAccount.baid": balanceAccountes.baid, "balanceAccount.money": balanceAccountes.items.money.val()}, function(){

            com.showAlert(com.info, "操作成功");
            searcher.doSearch();
            balanceAccountes.modals.withdrawBalanceAccountModal.modal("hide");
        });
    }
});
