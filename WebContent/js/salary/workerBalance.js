$(function () {

    var deposit = {
        saveBtn: null,
        addSaveBtn: null,
        cancelBtn: null,
        modal: null,
        items: {},
        validator: {
            workersalary: {
                type: "v_salary",
                regex: /^-?(([1-9]\d{0,6})|(([1-9]\d{0,6}\.\d{1,3})|(0\.[1-9]{1,3})))$/,
                errorMsg: "请正确输入工人工费，小数点后最多保留3位"
            },
        },
        repeatFlg: false
    };

    deposit.saveBtn = com.focusPage("#saveBtn").on("click", saveData);
    deposit.addSaveBtn = com.focusPage("#addSaveBtn").on("click", addData);
    deposit.modal = com.focusPage("#transferModal");
    deposit.modal = com.focusPage("#workersalaryModal");
    deposit.cancelBtn = com.focusPage("#cancelBtn");

    deposit.items.workersalaryuser = com.focusPage("#workersalaryuser");
    deposit.items.workersalarys = com.focusPage("#workersalarys");
    deposit.items.salaryTwotype = com.focusPage("#salaryTwotype");
    deposit.items.workersalarycomment = com.focusPage("#workersalarycomment");

    deposit.items.workertransferuser = com.focusPage("#workertransferuser");
    deposit.items.workercollectuser = com.focusPage("#workercollectuser");
    deposit.items.workertransfermoney = com.focusPage("#workertransfermoney");
    deposit.items.workercomment = com.focusPage("#workercomment");

    $.extend(com.validator, deposit.validator);

    com.post(api.ds.salary, {}, function (data) {
        var SalaryType = data.SalaryTwoType;

        if (SalaryType && SalaryType.length) {
            $.each(SalaryType, function (i, v) {
                $('<option></option>').attr("value", v.key).html(v.name).appendTo(com.focusPage("#salaryTwotype"));
            });
        }
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
            var $detailbtn = $('<a></a>').addClass('btn btn-minier btn-success').html('明细');
            var $collectbtn = $('<a></a>').addClass('btn btn-minier btn-yellow').html('收取质保金');
            var $drawbtn = $('<a></a>').addClass('btn btn-minier btn-primary').html('提现质保金');
            var $cutbtn = $('<a></a>').addClass('btn btn-minier btn-danger').html('扣款');
            var $pushbtn = $('<a></a>').addClass('btn btn-minier btn-primary').html('发放');

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
                ["状态:", v.status == 0 ? "有效" : "无效", "grey"],
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

            $divBtnWrap.append($cutbtn).append($pushbtn).append($collectbtn).append($drawbtn).appendTo($h3);

            $liLine.append($h3).append($ulProperty);

            $detailbtn.click(function () {
                params.userId = v.user.userId;
                com.switchPage(api.index.workerDetailIndex.url);
            });

            //收取质保金
            $collectbtn.click(function () {
                var workerdeposit = com.focusPage("#workerBalance");
                workerdeposit.attr('wbid', v.wbid);
                var uid = v.user.userId;
                openlayer($collectbtn.html(), function () {
                    addDeposit(uid)
                })
            });

            //提现质保金
            $drawbtn.click(function () {
                var workerdeposit = com.focusPage("#workerBalance");
                workerdeposit.attr('wbid', v.wbid);
                var uid = v.user.userId;
                openlayer($drawbtn.html(), function () {
                    drawDeposit(uid)
                })
            });

            //发放工费
            $pushbtn.click(function () {
                var workersalary = com.focusPage("#workerSalary");
                workersalary.attr('wbid', v.wbid);
                var uid = v.user.userId;
                com.focusPage("#workerUser").val(v.user.currentName);
                openlayerSalary($pushbtn.html(), function () {
                    pushSalary(uid)
                })
            });

            //扣款工费
            $cutbtn.click(function () {
                var workersalary = com.focusPage("#workerSalary");
                workersalary.attr('wbid', v.wbid);
                var uid = v.user.userId;
                com.focusPage("#workerUser").val(v.user.currentName);
                openlayerSalary($cutbtn.html(), function () {
                    cutSalary(uid)
                })
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

    // 收取质保金
    function addDeposit(uid) {
        var money = com.focusPage("#money").val();
        var comment = com.focusPage("#comment").val();
        var option = {
            "workerSalary.user.userId": uid,
            "workerSalary.money": money,
            "workerSalary.comment": comment
        };
        com.post(api.salary.collectWorkerDeposit, option, function (res) {
            layer.closeAll();
            searcher.doSearch();
            layer.msg('收取成功', {icon: 1});
        })
    }

    //提现质保金
    function drawDeposit(uid) {
        var money = com.focusPage("#money").val();
        var comment = com.focusPage("#comment").val();
        var option = {
            "workerSalary.user.userId": uid,
            "workerSalary.money": money,
            "workerSalary.comment": comment
        };
        com.post(api.salary.drawWorkerDeposit, option, function (res) {
            layer.closeAll();
            searcher.doSearch();
            layer.msg('提现成功', {icon: 1});
        })
    }

    //发放工费
    function pushSalary(uid) {
        var money = com.focusPage("#salaryMoney").val();
        var comment = com.focusPage("#salaryComment").val();
        var option = {
            "workerSalary.user.userId": uid,
            "workerSalary.money": money,
            "workerSalary.comment": comment
        };
        com.post(api.salary.payWorkerSalary, option, function (res) {
            layer.closeAll();
            searcher.doSearch();
            layer.msg('操作成功', {icon: 1});
        })
    }

    //扣款工费
    function cutSalary(uid) {
        var money = com.focusPage("#salaryMoney").val();
        var comment = com.focusPage("#salaryComment").val();
        var option = {
            "workerSalary.user.userId": uid,
            "workerSalary.money": money,
            "workerSalary.comment": comment
        };
        com.post(api.salary.cutWorkerSalary, option, function (res) {
            layer.closeAll();
            searcher.doSearch();
            layer.msg('操作成功', {icon: 1});
        })
    }

    var searcher = new Searcher();

    searcher.init(['jober', 'salaryWorkduty'], "condList", api.salary.pageWorkerBalance, function (data) {
        displayFunc.init('resultList', data);
    }, "pagenation", "workerBalancePostData", null, false, null, function () {

        var $adda = $('<a></a>').addClass('btn btn-minier btn-blue').attr('name', 'adda').css("margin", "0px 3px");
        var $addai = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
        var $addaspan = $('<span></span>').text('添加账户').appendTo($adda);

        var $tranbtn = $('<a></a>').addClass('btn btn-minier btn-pink').attr('name', 'tran').css("margin", "0px 3px");
        var $tranbtni = $('<i></i>').addClass('icon-add bigger-110').appendTo($tranbtn);
        var $tranbtnspan = $('<span></span>').text('转款').appendTo($tranbtn);

        var $addsalary = $('<a></a>').addClass('btn btn-minier btn-success').attr('name', 'addsalary').css("margin", "0px 3px");
        var $addsalaryi = $('<i></i>').addClass('icon-add bigger-110').appendTo($addsalary);
        var $addsalaryspan = $('<span></span>').text('添加工费').appendTo($addsalary);

        return [$tranbtn, $addsalary];
    });

    //添加账户
    com.focusPage('a[name="adda"]').on('click',function () {

    });
    //添加工费
    com.focusPage('a[name="addsalary"]').on('click', function () {

        com.cleanItems(deposit.items);

        com.focusPage('#workersalaryModal').modal("show");

        com.initChosen('workersalaryuser', api.personel.queryUserByPinyin, "pinyinName", {
            "user.status": "0"
        }, "autoFillKeyValue", "key", "value");

        com.clearValidator()

    });

    //转款
    com.focusPage('a[name="tran"]').on('click', function () {

        com.cleanItems(deposit.items);
        com.focusPage('#transferModal').modal("show");

        com.initChosen('workertransferuser', api.personel.queryUserByPinyin, "pinyinName", {
            "user.status": "0"
        }, "autoFillKeyValue", "key", "value");

        com.initChosen('workercollectuser', api.personel.queryUserByPinyin, "pinyinName", {
            "user.status": "0"
        }, "autoFillKeyValue", "key", "value");

        com.clearValidator()
    });

    //转款
    function saveData() {
        if (!com.validate("transferModal")) {
            var transferuser = com.focusPage("#workertransferuser").val();
            var collectuser = com.focusPage("#workercollectuser").val();
            var tranmoney = com.focusPage("#workertransfermoney").val();
            var trancomment = com.focusPage("#workercomment").val();

            var option = {
                "sourceId": transferuser,
                "targetId": collectuser,
                "workerSalary.money": tranmoney,
                "workerSalary.comment": trancomment
            };
            com.post(api.salary.tranWorkerSalary, option, function (res) {
                searcher.doSearch();
                com.cleanItems(deposit.items);
                com.clearValidator();

                com.showAlert(com.info, "操作成功");
            });
            com.focusPage('#transferModal').modal("hide");
            com.updateChosen("workertransferuser", "", "");
            com.updateChosen("workercollectuser", "", "");
        }
    }

    //添加工费
    function addData() {
        if (!com.validate("workersalaryModal")) {
            var user = com.focusPage("#workersalaryuser").val();
            var money = com.focusPage("#workersalarys").val();
            var twotype = com.focusPage("#salaryTwotype").val();
            var comment = com.focusPage("#workersalarycomment").val();
            var option = {
                "workerSalary.user.userId": user,
                "workerSalary.money": money,
                "workerSalary.twotype": twotype,
                "workerSalary.comment": comment
            };
            com.post(api.salary.addWorkerSalary, option, function (res) {
                searcher.doSearch();
                com.cleanItems(deposit.items);
                com.clearValidator();
                com.showAlert(com.info, "操作成功");
            });
            com.focusPage('#workersalaryModal').modal("hide");

            com.updateChosen("workersalaryuser", "", "");
        }
    }

    function openlayer(type, callback) {
        layer.closeAll();
        var index = layer.open({
            type: 1,
            title: type,
            content: com.focusPage('#workerBalance'),
            area: ["520px", $(window).width() * 0.6 < 390 ? $(window).height() * 0.6 : 390 + "px",],
            maxmin: false,
            zIndex: 9000,
            btn: ['确定', '取消'],
            yes: function (index, layero) {
                if (com.validate('workerBalance')) {
                    return;
                }
                callback(index, layero);
                closeLayer();
            },
            btn2: function (index, layero) {
                com.clearValidator();
                closeLayer();
            },
            cancel: function () {
                com.clearValidator();
                closeLayer();
            }
        });
    }

    function openlayerSalary(type, callback) {
        layer.closeAll();
        var index = layer.open({
            type: 1,
            title: type,
            content: com.focusPage('#workerSalary'),
            area: ["520px", $(window).width() * 0.6 < 460 ? $(window).height() * 0.6 : 460 + "px",],
            maxmin: false,
            zIndex: 9000,
            btn: ['确定', '取消'],
            yes: function (index, layero) {
                if (com.validate('workerSalary')) {
                    return;
                }
                callback(index, layero);
                closeLayer();
            },
            btn2: function (index, layero) {
                com.clearValidator();
                closeLayer();
            },
            cancel: function () {
                com.clearValidator();
                closeLayer();
            }
        });
    }

    function closeLayer() {
        com.focusPage("#money").val("");
        com.focusPage("#comment").val("");
        com.focusPage("#workerBalance").removeAttr("wbid");
        com.focusPage("#salaryMoney").val("");
        com.focusPage("#salaryComment").val("");
        com.focusPage("#workerSalary").removeAttr("wbid")
    }
});