jQuery(function($) {

    var balance = {
        btns: {
            addConfirmBtn: com.focusPage("#addConfirmBtn"),
        },

        modals: {
            addModal: com.focusPage("#addModal"),
        },

        items: {
            type : com.focusPage("#type"),
            belongerName: com.focusPage("#belongerName"),
            amount: com.focusPage("#amount"),
        },

        isType: {},
        isStatus: {}
    };

    balance.btns.addConfirmBtn.bindClick(addBalance);

    balance.modals.addModal.on("hide.bs.modal", function () {
        com.cleanItems(balance.items);
        com.clearValidator();
        com.closeTip();
    });

    com.post(api.ds.balance, {}, function (res) {
        balance.items.type.bindData(res.isType, "key", "value");
        balance.isType = res.isType.split("key", "value");
        balance.isStatus = res.isStatus.split("key", "value");
    }, null, false);

    com.initTypeahead('belongerName', api.personel.queryUserByPinyin, "pinyinName", {"user.status" : 0}, "autoFillKeyValue", "key", "value", null);

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
            var $h3 = $('<h3></h3>').addClass('oid')
            var $title = $('<small></small>').addClass('blue').html(' ' + v.no);
            var $btnDiv = $('<div></div>').addClass('action-buttons pull-right');
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');

            var $btnBalance = $("<a></a>").addClass("btn btn-minier btn-yellow").html("结算");
            var $btnPayBalance = $("<a></a>").addClass("btn btn-minier btn-danger").html("出纳");
            var $btnBalanceDetail = $("<a></a>").addClass("btn btn-minier btn-success").html("结算明细");
            var $btnApportDetail = $("<a></a>").addClass("btn btn-minier btn-warning").html("分摊明细");
            var $btnBalanceSales = $("<a></a>").addClass("btn btn-minier btn-inverse").html("结算销售");

            var propertyArr = [
                ["归属人: ", v.belonger.userName, "grey"],
                ["创建人: ", v.creater.userName, "grey"],
                ["创建时间: ", v.createTime, "grey"],
                ["金额: ", v.amount, "blue"],
                ["余额: ", v.surplus, "blue"],
                ["类型: ", balance.isType[v.type], "red"],
                ["状态: ", balance.isStatus[v.status], "red"],
            ];

            $.each(propertyArr, function (index, value) {
                var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                $liProperty.appendTo($ulProperty);
            });

            $liLine.append($h3).append($ulProperty);
            $btnDiv.append($btnBalance).append($btnPayBalance).append($btnBalanceDetail).append($btnApportDetail).append($btnBalanceSales);
            $h3.append($title).append($btnDiv);

            $btnBalance.click(function () {
                params['uid'] = v.belonger.uid;
                params['bid'] = v.bid;
                params['surplus'] = v.surplus;
                com.popup4page("#stockRecordPopUp","/views/balance/balanceBalance.html","结算", "", function () {
                    balanceSearcher.doSearch();
                });
            });

            $btnPayBalance.click(function () {
                params['uid'] = v.belonger.uid;
                params['bid'] = v.bid;
                params['surplus'] = v.surplus;
                com.popup4page("#stockRecordPopUp","/views/balance/payBalance.html","出纳", "", function () {
                    balanceSearcher.doSearch();
                });
            });

            $btnBalanceDetail.click(function () {
                params['bid'] = v.bid;
                com.popup4page("#stockRecordPopUp","/views/balance/balanceDetail.html","结算明细");
            });

            $btnApportDetail.click(function () {
                params['bid'] = v.bid;
                com.popup4page("#stockRecordPopUp","/views/balance/apportDetail.html","分摊明细");
            });

            $btnBalanceSales.click(function () {
                params['bid'] = v.bid;
                com.popup4page("#stockRecordPopUp","/views/balance/balanceSales.html","销售单");
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
        }
    })();

    var balanceSearcher = new Searcher();

    balanceSearcher.init( ["balanceNo", "balanceType", "balanStatus"], "condList", api.balance.pageBalance, function(data){
        displayFunc.init('resultList' ,data);
    }, "pagenation", "balancePostData", null, false, null,function(){

        var $adda = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('id', 'addBalance').css("margin", "0px 3px");
        var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
        var $addspan = $('<span></span>').text('添加').appendTo($adda);

        return [$adda];
    },'resultList');

    com.focusPage("#addBalance").click(function() {
        balance.modals.addModal.modal("show");
    });

    function addBalance() {

        if (com.validate('addModal')) {
            return false;
        };

        var options = {
            "balance.belonger.userId":com.typeahead("belongerName"),
            "balance.amount": balance.items.amount.val(),
            "balance.type" : balance.items.type.val()
        }

        com.post(api.balance.addBalance ,options ,function(res){
            com.showAlert(com.info, "操作成功");
            balanceSearcher.doSearch();
        });

        balance.modals.addModal.modal("hide");
    }

})

