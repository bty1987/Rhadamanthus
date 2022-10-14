jQuery(function($) {

    var accountes = {

        btns: {
            saveBtn: com.focusPage("#saveBtn"),
            withdrawBtn: com.focusPage("#withdrawBtn"),
        },

        modals: {
            addAccountModal : com.focusPage("#addAccountModal"),
            withdrawAccountModal : com.focusPage("#withdrawAccountModal"),
        },

        items: {
            money : com.focusPage("#money"),
        },

        addItems: {
            name: com.focusPage("#name"),
            type: com.focusPage("#type"),
            belonger: com.focusPage("#belonger")
        },

        aid: null,
        isAccountType: {},
        isAccountStatus: {}
    };

    accountes.btns.saveBtn.bindClick(saveData);
    accountes.btns.withdrawBtn.bindClick(withdraw);

    accountes.modals.addAccountModal.on("hide.bs.modal", function () {
        com.clearValidator();
        com.cleanTypeahead("belonger");
        com.cleanItems(accountes.addItems);
    });

    accountes.modals.withdrawAccountModal.on("hide.bs.modal", function () {
        com.clearValidator();
        com.cleanItems(accountes.items);
    });

    com.post(api.ds.balance, {}, function (res) {
        accountes.addItems.type.bindData(res.isAccountType, "key", "value");
    }, null, false);

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
                ["归属人:", v.belonger.userName, "grey"],
                ["创建人:", v.creater.currentName, "grey"],
                ["创建时间:", v.createTime, "grey"],
                ["应付额:", v.referMoney, "grey"],
                ["实付额:", v.realMoney, "grey"],
                ["余额:", v.surplus, "grey"],
                ["类型:", constant.balance.account.type.keys[v.type], "red"],
                ["状态:", constant.balance.account.status.keys[v.status], "red"],
            ];

            $.each(propertyArr, function (index, value) {
                var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2] ? value[2] : "").appendTo($liProperty);
                $liProperty.appendTo($ulProperty);
            });

            $divBtnWrap.appendTo($h3);

            $liLine.append($h3).append($ulProperty);

            !v.status && $statusSwitch.prop("checked", true);

            $invalid.click(function() {

                var cvalue = $statusSwitch.prop("checked") ? 0:1;

                updatastatus(v.aid, cvalue);
            });

            $btnWithdraw.click(function() {

                accountes.aid = v.aid;
                accountes.modals.withdrawAccountModal.modal("show");
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

    searcher.init(["balance-account-name", "balance-account-status"], "condList", api.balance.pageAccount, function(data){
        displayFunc.init('resultList', data);
    }, "pagenation", "accountPostData",null, false, null, function() {

        var $adda = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('id', 'addAccount').css("margin", "0px 3px");
        var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
        var $addspan = $('<span></span>').text('添加').appendTo($adda);

        return [$adda];
    });

    com.focusPage('#addAccount', '#pagenation').click(function() {

        accountes.aid = null;

        com.clearValidator();
        com.cleanItems(accountes.addItems);

        accountes.modals.addAccountModal.modal("show");
    });

    function saveData() {

        if (com.validate("addAccountModal")) {
            return false;
        }

        var options = {
            'account.belonger.userId': com.typeahead("belonger"),
            'account.name': accountes.addItems.name.val(),
            'account.type': accountes.addItems.type.val()
        };

        com.post(api.balance.addAccount, options, function(res) {

            com.showAlert(com.info, "操作成功");

            searcher.doSearch();
            accountes.modals.addAccountModal.modal("hide");
        });
    }

    function updatastatus(aid, newstatus) {

        com.post(api.balance.updateAccountForStatus, {"account.aid": aid, "account.status": newstatus}, function() {
            newstatus == 0 ? com.showAlert(com.info, "已启动") : com.showAlert(com.info, "已禁用");

            searcher.doSearch();
        });
    }

    function withdraw() {

        com.post(api.balance.withdrawAccount, {"account.aid": accountes.aid, "account.money": accountes.items.money.val()}, function(){

            com.showAlert(com.info, "操作成功");
            searcher.doSearch();
            accountes.modals.withdrawAccountModal.modal("hide");
        });
    }
});
