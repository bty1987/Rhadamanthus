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

    var displayFunc = (function() {

        var renderList = function(tableId, listData) {

            var $tableWrap = com.focusPage('#' + tableId);
            var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');

            if (listData && listData.length) {
                $.each(listData, function(i, v) {

                    creatLine(v).appendTo($ul);
                });

                $ul.appendTo($tableWrap);
            }
        };

        var creatLine = function(v) {

            var $liLine = $('<li></li>').addClass('item-orange clearfix');
            var $h3 = $('<h3></h3>').addClass('oid');
            var $btnDiv = $('<div></div>').addClass('action-buttons pull-right');
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');

            var $btnAccount = $("<a></a>").addClass("btn btn-minier btn-yellow").html("结算");
            var $btnBalance = $("<a></a>").addClass("btn btn-minier btn-yellow").html("结算");
            var $btnPayBalance = $("<a></a>").addClass("btn btn-minier btn-danger").html("出纳");
            var $btnBalanceDetail = $("<a></a>").addClass("btn btn-minier btn-success").html("结算明细");
            var $btnApportDetail = $("<a></a>").addClass("btn btn-minier btn-warning").html("分摊明细");
            var $btnBalanceSales = $("<a></a>").addClass("btn btn-minier btn-inverse").html("结算销售");
            var $btnBalanceCutpay = $("<a></a>").addClass("btn btn-minier btn-info").html("结算扣款");

            var $span = $('<span></span>').addClass('lbl blue bigger-150').text(v.no);
            var $label = $('<label></label>');
            var $input = $('<input></input>').attr({
                'class': 'ace ace-checkbox-2',
                'name': 'balance',
                'type': 'checkbox',
                'id': v.bid,
            }).val(v.bid);

            var propertyArr = [];

            propertyArr.push(["归属人: ", v.belonger.userName, "grey", function(btn) {

                tools.personel.info(btn, v.belonger.userId);
            }]);
            propertyArr.push(["创建人: ", v.creater.userName, "grey", function(btn) {

                tools.personel.info(btn, v.creater.userId);
            }]);
            propertyArr.push(["创建时间: ", v.createTime, "green"]);
            propertyArr.push(["结算人: ", v.balancer ? v.balancer.userName : "", "grey", function(btn) {

                tools.personel.info(btn, v.creater.userId);
            }]);
            propertyArr.push(["结算时间: ", v.balanceTime, "green"]);
            propertyArr.push(["付款人: ", v.payeder ? v.payeder.userName : "", "grey", function(btn) {

                tools.personel.info(btn, v.creater.userId);
            }]);
            propertyArr.push(["付款时间: ", v.payedTime, "green"]);
            propertyArr.push(["金额: ", v.amount, "blue"]);
            propertyArr.push(["扣款总额: ", v.cutpay, "blue"]);
            propertyArr.push(["类型: ", constant.balance().balance.type.keys[v.type], "red"]);
            propertyArr.push(["状态: ", constant.balance().balance.status.keys[v.status], "red"]);
            propertyArr.push(["付款标识: ", constant.balance().balance.isPay.keys[v.isPay], "red"]);

            $.each(propertyArr, function(index, value) {

                var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                var $b = $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);

                if (value[3]) {

                    $b.click(function() {

                        value[3]($b);
                    });
                }

                $liProperty.appendTo($ulProperty);
            });

            $input.click(function() {

                var $that = $(this);
                var bid = $that.attr("id");

                var checked = $that.prop("checked");

                if (checked)
                    !balance.selectList.contains(bid) && balance.selectList.push(bid);
                else
                    balance.selectList.contains(bid) && balance.selectList.splice(balance.selectList.indexOf(bid), 1);
            });

            if (balance.selectList.contains(String(v.bid)))
                $input.prop('checked', true).attr("checked", true);

            $liLine.append($h3).append($ulProperty);
            $btnDiv.append($btnPayBalance).append($btnAccount).append($btnBalance).append($btnBalanceDetail).append($btnBalanceCutpay).append($btnApportDetail);
            $h3.append($label.append($input).append($span)).append($btnDiv);

            $btnBalance.click(function() {

                params.balance.bid = v.bid;
                params.balance.uid = v.belonger.uid;
                params.balance.surplus = v.surplus;

                com.popup4page("#stockRecordPopUp", api.index.balance2balanceIndex.url, "结算", "", function() {

                    searcher.doSearch();
                });
            });

            $btnAccount.click(function() {

                balance.balance = v;

                com.clearValidator();
                com.cleanItems(balance.items);
                
                com.post(api.balance.queryBalanceAccount, {
                    "balanceAccount.belonger.uid": v.belonger.uid
                }, function(res) {

                    balance.items.bccount.bindData(res.balanceAccountes, "baid", "name");
                }, null, false);

                balance.modals.balanceModal.modal("show");
            });

            $btnPayBalance.click(function() {

                params.balance.bid = v.bid;
                params.balance.uid = v.belonger.uid;
                params.balance.surplus = v.surplus;

                com.popup4page("#stockRecordPopUp", api.index.balance2accountIndex.url, "出纳", "", function() {

                    searcher.doSearch();
                });
            });

            $btnBalanceDetail.click(function() {

                params.balance.bid = v.bid;

                com.popup4page("#stockRecordPopUp", api.index.balanceDetailIndex.url, "结算明细");
            });

            $btnApportDetail.click(function() {

                params.balance.bid = v.bid;

                com.popup4page("#stockRecordPopUp", api.index.apportDetailIndex.url, "分摊明细");
            });

            $btnBalanceSales.click(function() {

                params.balance.bid = v.bid;

                com.popup4page("#stockRecordPopUp", api.index.balanceSalesIndex.url, "销售单");
            });

            $btnBalanceCutpay.click(function() {

                params.balance = v;
                params.balance.bid = v.bid;
                params.balance.uid = v.belonger.uid;

                com.popup4page("#stockRecordPopUp", api.index.balanceCutpayIndex.url, "结算扣款");
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

    searcher.init(["balance-balance-no", "balance-balance-type", "balance-balance-status", "balance-balance-isPay"], "condList", api.balance.pageBalance, function(data) {

        displayFunc.init('resultList', data);
    }, "pagenation", "balancePostData", null, false, null, function() {

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

    }, 'resultList');

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