$(function () {

    var deposit = {
        saveBtn: null,
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
    deposit.modal = com.focusPage("#transferModal");
    deposit.cancelBtn = com.focusPage("#cancelBtn");

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

            $divBtnWrap.append($cutbtn).append($pushbtn).append($collectbtn).append($drawbtn).append($updatebtn).appendTo($h3);

            $liLine.append($h3).append($ulProperty);

            var uid = v.user.userId;
            var workerdeposit = com.focusPage("#workerBalance");
            workerdeposit.attr('wbid', v.wbid);
            //收取质保金
            $collectbtn.click(function () {
                openlayer($collectbtn.html(), function () {
                    addDeposit(uid);
                });
            });

            //提现质保金
            $drawbtn.click(function () {
                openlayer($drawbtn.html(), function () {
                    drawDeposit(uid);
                });
            });

            //更新质保金上限
            $updatebtn.click(function () {
                updateopenlayer($updatebtn.html(), function () {
                    var workerdeposit = com.focusPage("#updateBalance");
                    workerdeposit.attr('wbid', v.wbid);
                    updateDeposit(v.wbid);
                })
            });

            var workersalary = com.focusPage("#workerSalary");
            workersalary.attr('wbid', v.wbid);
            //发放工费
            $pushbtn.click(function () {
                com.focusPage("#workerUser").val(v.user.currentName);
                openlayerSalary($pushbtn.html(), function () {
                    pushSalary(uid);
                });
            });

            //扣款工费
            $cutbtn.click(function () {
                com.focusPage("#workerUser").val(v.user.currentName);
                openlayerSalary($cutbtn.html(), function () {
                    cutSalary(uid);
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
        });
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
        });
    }

    //更新工人质保金上限
    function updateDeposit(wbid) {
        var toplimit = com.focusPage("#toplimit").val();
        var option = {
            "workerBalance.wbid": wbid,
            "workerBalance.toplimit": toplimit
        };
        com.post(api.salary.updateWorkerBalance, option, function (res) {
            layer.closeAll();
            searcher.doSearch();
            layer.msg('操作成功', {icon: 1});
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
        });
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
        });
    }

    var searcher = new Searcher();

    searcher.init(['jober', 'salaryWorkduty'], "condList", api.salary.pageWorkerBalance, function (data) {
        displayFunc.init('resultList', data);
    }, "pagenation", "workerBalancePostData", null, false, null, function () {

        var $tranbtn = $('<a></a>').addClass('btn btn-minier btn-pink').attr('name', 'tran').css("margin", "0px 3px");
        var $tranbtni = $('<i></i>').addClass('icon-money bigger-110').appendTo($tranbtn);
        var $tranbtnspan = $('<span></span>').text('转款').appendTo($tranbtn);

        var $addsalary = $('<a></a>').addClass('btn btn-minier btn-success').attr('name', 'addsalary').css("margin", "0px 3px");
        var $addsalaryi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($addsalary);
        var $addsalaryspan = $('<span></span>').text('添加工费').appendTo($addsalary);

        return [$tranbtn];
    });

    //转款
    com.focusPage('a[name="tran"]').on('click', function () {

        com.cleanItems(deposit.items);
        com.clearValidator();
        com.focusPage('#transferModal').modal("show");
        com.updateTypeahead("workertransferuser", "", "");
        com.updateTypeahead("workercollectuser", "", "");

        com.initTypeahead('workertransferuser', api.personel.queryUserByPinyin, "pinyinName", {
            "user.status": "0"
        }, "autoFillKeyValue", "key", "value",function(list,key,value){
        	return value;
        });

        com.initTypeahead('workercollectuser', api.personel.queryUserByPinyin, "pinyinName", {
            "user.status": "0"
        }, "autoFillKeyValue", "key", "value",function(list,key,value){
        	return value;
        });
    });

    //转款
    function saveData() {
        if (!com.validate("transferModal")) {
            var transferuser = com.typeahead("workertransferuser");
            var collectuser = com.typeahead("workercollectuser");
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
                com.showAlert(com.info, "操作成功");
            });
            com.focusPage('#transferModal').modal("hide");
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

    function updateopenlayer(type, callback) {
        layer.closeAll();
        var index = layer.open({
            type: 1,
            title: type,
            content: com.focusPage('#updateBalance'),
            area: ["520px", $(window).width() * 0.6 < 320 ? $(window).height() * 0.6 : 320 + "px",],
            maxmin: false,
            zIndex: 9000,
            btn: ['确定', '取消'],
            yes: function (index, layero) {
                if (com.validate('updateBalance')) {
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
        com.focusPage("#workerSalary").removeAttr("wbid");
        com.focusPage("#toplimit").val("");
        com.focusPage("#updateBalance").removeAttr("wbid");
    }
});