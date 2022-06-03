jQuery(function($) {

    var balance = {

        btns: {
            addConfirmBtn: com.focusPage("#addConfirmBtn"),
        },

        modals: {
            addModal: com.focusPage("#addModal"),
        },

        items: {
            type: com.focusPage("#type"),
            belongerName: com.focusPage("#belongerName"),
            amount: com.focusPage("#amount"),
        },

        isType: {},
        isStatus: {}
    };

    balance.btns.addConfirmBtn.bindClick(addBalance);

    balance.modals.addModal.on("hide.bs.modal", function() {

        com.cleanItems(balance.items);
        com.clearValidator();
        com.closeTip();
    });

    com.post(api.ds.balance, {}, function(res) {

        balance.items.type.bindData(res.isType, "key", "value");
        balance.isType = res.isType.split("key", "value");
        balance.isStatus = res.isStatus.split("key", "value");
    }, null, false);

    com.initTypeahead('belongerName', api.personel.queryUserByPinyin, "pinyinName", {
        "user.status": 0
    }, "autoFillKeyValue", "key", "value", null);

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
            var $h3 = $('<h3></h3>').addClass('oid')
            var $title = $('<small></small>').addClass('blue').html(' ' + v.no);
            var $btnDiv = $('<div></div>').addClass('action-buttons pull-right');
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');

            var $btnBalance = $("<a></a>").addClass("btn btn-minier btn-yellow").html("结算");
            var $btnPayBalance = $("<a></a>").addClass("btn btn-minier btn-danger").html("出纳");
            var $btnBalanceDetail = $("<a></a>").addClass("btn btn-minier btn-success").html("结算明细");
            var $btnApportDetail = $("<a></a>").addClass("btn btn-minier btn-warning").html("分摊明细");
            var $btnBalanceSales = $("<a></a>").addClass("btn btn-minier btn-inverse").html("结算销售");
            var $btnBalanceCutpay = $("<a></a>").addClass("btn btn-minier btn-yellow").html("结算扣款");

            var propertyArr = [];

            propertyArr.push(["归属人: ", v.belonger.userName, "grey"]);
            propertyArr.push(["创建人: ", v.creater.userName, "grey"]);
            propertyArr.push(["创建时间: ", v.createTime, "green"]);
            propertyArr.push(["金额: ", v.amount, "blue"]);
            propertyArr.push(["扣款总额: ", v.cutpay, "blue"]);
//            propertyArr.push(["余额: ", v.surplus, "blue"]);
            propertyArr.push(["类型: ", balance.isType[v.type], "red"]);
            propertyArr.push(["状态: ", balance.isStatus[v.status], "red"]);

            $.each(propertyArr, function(index, value) {

                var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                $liProperty.appendTo($ulProperty);
            });

            $liLine.append($h3).append($ulProperty);
            $btnDiv.append($btnBalanceSales).append($btnBalanceCutpay);
            $h3.append($title).append($btnDiv);

            $btnBalance.click(function() {

                params.balance.bid = v.bid;
                params.balance.uid = v.belonger.uid;
                params.balance.surplus = v.surplus;

                com.popup4page("#stockRecordPopUp", api.index.balanceBalanceIndex.url, "结算", "", function() {

                    searcher.doSearch();
                });
            });

            $btnPayBalance.click(function() {

                params.balance.bid = v.bid;
                params.balance.uid = v.belonger.uid;
                params.balance.surplus = v.surplus;

                com.popup4page("#stockRecordPopUp", api.index.payBalanceIndex.url, "出纳", "", function() {

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

                params.balance.bid = v.bid;

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
        }
    })();

    var searcher = new Searcher();

    searcher.init(["balance-balance-no", "balance-balance-type", "balance-balance-status"], "condList", api.balance.pageBalance, function(data) {

        displayFunc.init('resultList', data);
    }, "pagenation", "balancePostData", null, false, null, function() {

//        var $adda = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('id', 'addBalance').css("margin", "0px 3px");
//        var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
//        var $addspan = $('<span></span>').text('添加').appendTo($adda);

//        return [$adda];
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
        }

        com.post(api.balance.addBalance, options, function(res) {

            com.showAlert(com.info, "操作成功");
            searcher.doSearch();
        });

        balance.modals.addModal.modal("hide");
    }

})