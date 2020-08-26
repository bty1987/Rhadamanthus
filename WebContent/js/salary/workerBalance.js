$(function () {

    var deposit = {
        depositBtn: com.focusPage("#depositBtn"),
        goldBtn:com.focusPage("#goldBtn"),
        toplimitBtn: com.focusPage("#toplimitBtn"),
        workerBtn: com.focusPage("#workerBtn"),
        LaborBtn:com.focusPage("#LaborBtn"),
        saveBtn: com.focusPage("#saveBtn"),
        cancelBtn: com.focusPage("#cancelBtn"),
        addworkerBalanceBtn: com.focusPage("#addworkerBalanceBtn"),

        modals:{
            transferModal: com.focusPage("#transferModal"),
            workerBalance: com.focusPage("#workerBalance"),
            workerGold:com.focusPage("#workerGold"),
            updateBalance: com.focusPage("#updateBalance"),
            workerSalary:com.focusPage("#workerSalary"),
            workerLabor:com.focusPage("#workerLabor"),
            addworkerBananceModal:com.focusPage("#addworkerBananceModal")
        },

        items: {
            workertransferuser:com.focusPage("#workertransferuser"),
            workercollectuser:com.focusPage("#workercollectuser"),
            workertransfermoney:com.focusPage("#workertransfermoney"),
            workercomment:com.focusPage("#workercomment"),
            workerUser:com.focusPage("#workerUser"),
            workerUserLabor:com.focusPage("#workerUserLabor"),
            money:com.focusPage("#money"),
            comment:com.focusPage("#comment"),
            moneyLabor:com.focusPage("#moneyLabor"),
            commentLabor:com.focusPage("#commentLabor"),
            salaryMoney:com.focusPage("#salaryMoney"),
            salaryComment:com.focusPage("#salaryComment"),
            moneyGold:com.focusPage("#moneyGold"),
            commentGold:com.focusPage("#commentGold"),
            toplimit:com.focusPage("#toplimit")
        },
        addItem: {
            workerUserName:com.focusPage("#workerUserName")
        },

        statusBalance:{},
        uid: null,
        wbid:null,
        repeatFlg: false
    };

    deposit.depositBtn.bindClick(addDeposit);
    deposit.goldBtn.bindClick(drawDeposit);
    deposit.toplimitBtn.bindClick(updateDeposit);
    deposit.workerBtn.bindClick(pushSalary);
    deposit.LaborBtn.bindClick(cutSalary);
    deposit.saveBtn.bindClick(saveData);
    deposit.addworkerBalanceBtn.bindClick(addworkerBananceData);

    deposit.modals.transferModal.on('hide.bs.modal', function (e) {
        com.cleanTypeahead("workertransferuser");
        com.cleanTypeahead("workercollectuser");
        com.cleanItems(deposit.items);
        com.closeTip();
    });
    deposit.modals.addworkerBananceModal.on('hide.bs.modal', function (e){
        com.cleanTypeahead("workercollectuser");
        com.cleanItems(deposit.addItem);
        com.closeTip();
    });


    com.initTypeahead("workertransferuser", api.personel.queryUserByPinyin, "pinyinName", {"user.status": "0"}, "autoFillKeyValue", "key", "value",function(list,key,value){return value;});

    com.initTypeahead("workercollectuser", api.personel.queryUserByPinyin, "pinyinName", {"user.status": "0"}, "autoFillKeyValue", "key", "value",function(list,key,value){return value;});

    com.initTypeahead("workerUserName", api.personel.queryUserByPinyin, "pinyinName", {"user.status": "0"}, "autoFillKeyValue", "key", "value",function(list,key,value){return value;});

    com.post(api.ds.salary, {}, function (data) {
        deposit.statusBalance=data.statusBalance.split("key", "value");
    }, null, false);

    var displayFunc = (function () {

        var renderList = function (tableId, listData) {
            var $tableWrap = com.focusPage('#' + tableId);
            var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');

            if (listData && listData.length) {
                $.each(listData, function (i, v) {
                    var $liLine = creatLine(v);
                    $liLine.appendTo($ul);
                });
                $ul.appendTo($tableWrap);
            }
        };
        var creatLine = function (v) {
            var $liLine = $('<li></li>').addClass('item-orange clearfix');
            var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue'));
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');
            var $collectbtn = $('<a></a>').addClass('btn btn-minier btn-warning').html('收取质保金');
            var $drawbtn = $('<a></a>').addClass('btn btn-minier btn-inverse').html('提现质保金');
            var $cutbtn = $('<a></a>').addClass('btn btn-minier btn-yellow').html('扣款');
            var $pushbtn = $('<a></a>').addClass('btn btn-minier btn-success').html('发放');
            var $updatebtn = $('<a></a>').addClass('btn btn-minier btn-danger').html('更新上限');

            var $label = $('<label></label>').addClass('control-label').css({
                'color': 'grey',
                'font-size': '20px',
                "font-weight": "bold"
            });

            var _label = $('<label></label>');

            var propertyArr = [
                ["工费:", v.salary, "blue"],
                ["部门:", v.user.dept.name, "grey"],
                ["工种:", v.user.duty.name, "grey"],
                ["质保金:", v.deposit, "blue"],
                ["质保金上限:", v.toplimit, "blue"],
                ["状态:", deposit.statusBalance[v.status], "grey"],
            ];

            $.each(propertyArr, function (index, value) {
                var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                $liProperty.appendTo($ulProperty);
                $label.appendTo($h3);
            });

            var _span = $('<span></span>').addClass('lbl blue bigger-150').html(v.user.currentName);

            _label.append(_span).appendTo($label);

            $divBtnWrap.append($cutbtn).append($pushbtn).append($collectbtn).append($drawbtn).append($updatebtn).appendTo($h3);

            $liLine.append($h3).append($ulProperty);

            //扣款工费
            $cutbtn.click(function () {
                deposit.uid = v.user.userId;
                com.popup4model('#workerLabor', "扣款", function () {
                    com.cleanItems(deposit.items);
                    deposit.items.workerUserLabor.val(v.user.currentName);
                });
            });

            //发放工费
            $pushbtn.click(function () {
                deposit.uid = v.user.userId;
                com.popup4model('#workerSalary', "发放", function () {
                    com.cleanItems(deposit.items);
                    deposit.items.workerUser.val(v.user.currentName);
                });
            });

            //收取质保金
            $collectbtn.click(function () {
                deposit.uid = v.user.userId;
                com.popup4model('#workerBalance', "收取质保金", function () {
                    com.cleanItems(deposit.items);
                });
            });

            //提现质保金
            $drawbtn.click(function () {
                deposit.uid = v.user.userId;
                com.popup4model('#workerGold', "提现质保金", function () {
                    com.cleanItems(deposit.items);
                });
            });

            //更新质保金上限
            $updatebtn.click(function () {
                com.popup4model('#updateBalance', "更新上限", function () {
                    com.cleanItems(deposit.items);
                    deposit.wbid = v.wbid;
                });
            });

            return $liLine;
        };

        return {
            init: function (tableId, listData) {
                com.focusPage('#' + tableId).html(null);
                renderList(tableId, listData);
            },
            drawLine: function (v) {
                return creatLine(v);
            }
        };
    })();


    var searcher = new Searcher();

    searcher.init(['jober', 'salaryWorkduty'], "condList", api.salary.pageWorkerBalance, function (data) {
        displayFunc.init('resultList', data);
    }, "pagenation", "workerBalancePostData", null, false, null, function () {

        var $tranbtn = $('<a></a>').addClass('btn btn-minier btn-pink').attr('name', 'tran').css("margin", "0px 3px");
        var $tranbtni = $('<i></i>').addClass('icon-money bigger-110').appendTo($tranbtn);
        var $tranbtnspan = $('<span></span>').text('转款').appendTo($tranbtn);

        var $addsalary = $('<a></a>').addClass('btn btn-minier btn-success').attr('name', 'addsalary').css("margin", "0px 3px");
        var $addsalaryi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($addsalary);
        var $addsalaryspan = $('<span></span>').text('添加').appendTo($addsalary);

        return [$tranbtn, $addsalary];
    });

    //转款
    com.focusPage('a[name="tran"]').on('click', function () {
        deposit.modals.transferModal.modal("show");
    });

    com.focusPage('a[name="addsalary"]').on('click', function () {
        deposit.modals.addworkerBananceModal.modal("show");
    });

    //扣款工费
    function cutSalary() {
        if (com.validate('workerLabor')) {
            return false;
        }

        var option = {
            "workerSalary.user.userId": deposit.uid,
            "workerSalary.money": deposit.items.moneyLabor.val(),
            "workerSalary.comment": deposit.items.moneyLabor.val()
        };
        com.post(api.salary.cutWorkerSalary, option, function (res) {
            com.closePopup();
            searcher.doSearch();
            com.showAlert(com.info, "操作成功");
        });
    }

    //发放工费
    function pushSalary() {
        if (com.validate('workerSalary')) {
            return false;
        }

        var option = {
            "workerSalary.user.userId": deposit.uid,
            "workerSalary.money": deposit.items.salaryMoney.val(),
            "workerSalary.comment": deposit.items.salaryComment.val()
        };
        com.post(api.salary.payWorkerSalary, option, function (res) {
            com.closePopup();
            searcher.doSearch();
            com.showAlert(com.showAlert,"操作成功");
        });
    }

    // 收取质保金
    function addDeposit() {
        if (com.validate("workerBalance")) {
            return false;
        }

        var option = {
            "workerSalary.user.userId": deposit.uid,
            "workerSalary.money": deposit.items.money.val(),
            "workerSalary.comment": deposit.items.comment.val()
        };
        com.post(api.salary.collectWorkerDeposit, option, function (res) {
            com.closePopup();
            searcher.doSearch();
            com.showAlert(com.info,"收取成功");
        });
    }

    //提现质保金
    function drawDeposit() {
        if (com.validate("workerGold")) {
            return false;
        }

        var option = {
            "workerSalary.user.userId": deposit.uid,
            "workerSalary.money": deposit.items.moneyGold.val(),
            "workerSalary.comment": deposit.items.commentGold.val()
        };
        com.post(api.salary.drawWorkerDeposit, option, function (res) {
            com.closePopup();
            searcher.doSearch();
            com.showAlert(com.info, "提现成功");
        });
    }

    //更新工人质保金上限
    function updateDeposit() {
        if (com.validate('updateBalance')) {
            return false;
        }

        var option = {
            "workerBalance.wbid": deposit.wbid,
            "workerBalance.toplimit": deposit.items.toplimit.val()
        };
        com.post(api.salary.updateWorkerBalance, option, function (res) {
            com.closePopup();
            searcher.doSearch();
            com.showAlert(com.info,"操作成功");
        })
    }

    //转款
    function saveData() {
        if (!com.validate("transferModal")) {

            var option = {
                "sourceId": com.typeahead("workertransferuser"),
                "targetId": com.typeahead("workercollectuser"),
                "workerSalary.money": deposit.items.workertransfermoney.val(),
                "workerSalary.comment": deposit.items.workercomment.val()
            };
            com.post(api.salary.tranWorkerSalary, option, function (res) {
                com.closePopup();
                searcher.doSearch();
                com.showAlert(com.info, "操作成功");
            });
            deposit.modals.transferModal.modal("hide");
        }
    }

    function addworkerBananceData() {

        if (com.validate('addworkerBananceModal')) {
            return false;
        }
        var option = {
            "workerBalance.user.userId": com.typeahead("workerUserName"),
        };

        com.post(api.salary.addWorkerBalance, option, function (res) {
            com.closePopup();
            searcher.doSearch();
            com.showAlert(com.info, "操作成功");
        });
        deposit.modals.addworkerBananceModal.modal("hide");
    }
});