$(function() {

    var balanceSalesBalance = {

        bsid: params.balance.bsid,

        types: {},
        onetypes: {},
        statues: {},
    };

    com.focusPage('#fl-statement').statement("结算销售", "明细");

    balanceSalesBalance.types = constant.sales().salesBalance.type.keys;
    balanceSalesBalance.statues = constant.sales().salesBalance.status.keys;

    com.post(api.balance.queryBalanceSalesByBsid, {
        "balanceSales.bsid": balanceSalesBalance.bsid
    }, function(res) {

        balanceSales = res.balanceSales;
    }, null, false);

    var displayFunc = (function() {

        // 通过数据集完成每行数据对应的展现处理过程 , 利用creatLine完成每行对应数据的渲染
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

        // 行渲染处理方法
        var creatLine = function(v) {

            var $liLine = $('<li></li>').addClass('item-orange clearfix');

            var $h3 = $('<h3></h3>').addClass('oid').appendTo($liLine);
            var $title = $('<small></small>').addClass('blue').html(' ' + v.salesBalance.sales.no).appendTo($h3);
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix').appendTo($liLine);

            var propertyArr = [["装修单号:", v.salesBalance.sales.orderId, "blue"], ["楼盘地址:", v.salesBalance.sales.house.village.name + " " + v.salesBalance.sales.house.houseNumber, "grey"], ["品类:", v.salesBalance.sales.category, "grey"], ["品牌:", v.salesBalance.sales.brand, "grey"], ["类型:", balanceSalesBalance.types[v.salesBalance.type], "red"], ["结算值:", v.salesBalance.pbalance, "blue"], ["一类:", constant.sales().salesBalance.onetype.keys[v.salesBalance.onetype], "red"], ["状态:", constant.balance().balanceSales.status.keys[v.salesBalance.status], "red"], ];

            $.each(propertyArr, function(index, value) {

                var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                $liProperty.appendTo($ulProperty);
            });

            var $ulDetail = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix').appendTo($liLine);

            var oneType = v.salesBalance.onetype;
            var Type = v.salesBalance.type;
            var salesRevenue = null;
            var salesAmount = null;
            var accountsPayable = null;
            var venderMaling = Math.round(v.salesBalance.sales.venderMaling);
            var allowance = Math.round(v.salesBalance.allowance);
            var comProfits = null;

            if (oneType == constant.sales().salesBalance.ONETYPE_INIT_INT) {
                if (Type == constant.sales().salesBalance.TYPE_DEPOSITPAY_INT) {
                    venderMaling = 0;
                    allowance = 0;
                    salesRevenue = v.salesBalance.sales.depositpay;
                    salesAmount = utils.accAdd(salesRevenue, utils.accAdd(venderMaling, allowance));
                    accountsPayable = utils.accSub(v.salesBalance.pbalance, venderMaling);
                } else {
                    salesRevenue = utils.accAdd(v.salesBalance.sales.depositpay, v.salesBalance.sales.fullpay);
                    salesAmount = utils.accAdd(salesRevenue, utils.accAdd(venderMaling, allowance));
                    accountsPayable = utils.accSub(v.salesBalance.pbalance, venderMaling);
                }
                comProfits = utils.accDiv(utils.accSub(salesRevenue, accountsPayable), utils.accAdd(salesRevenue, venderMaling));
            }
            if (oneType == constant.sales().salesBalance.ONETYPE_REFUND_INT) {
                venderMaling = 0;
                salesRevenue = v.salesBalance.total;
                salesAmount = utils.accAdd(v.salesBalance.total, allowance);
                accountsPayable = v.salesBalance.pbalance;
                comProfits = utils.accDiv(utils.accSub(salesRevenue, accountsPayable), utils.accSub(salesRevenue, venderMaling));
            }
            if (oneType == constant.sales().salesBalance.ONETYPE_ALLBACK_INT || oneType == constant.sales().salesBalance.ONETYPE_DBACKORDER_INT) {
                salesRevenue = v.salesBalance.total;
                salesAmount = utils.accAdd(utils.accSub(v.salesBalance.total, venderMaling), allowance);
                accountsPayable = utils.accAdd(v.salesBalance.pbalance, venderMaling);
                comProfits = utils.accDiv(utils.accSub(salesRevenue, accountsPayable), utils.accSub(salesRevenue, venderMaling));
            }

            var detailArr = [["供应商减免金额: ", venderMaling, "blue"], ["折扣/抹零金额: ", allowance, "blue"], ["销售收入: ", utils.changeThrDecimal(salesRevenue), "blue"], ["销售金额: ", utils.changeThrDecimal(salesAmount), "blue"], ["销售成本: ", v.salesBalance.pbalance, "blue"], ["应付账款: ", utils.changeThrDecimal(accountsPayable), "blue"], ["结算利润: ", utils.changeThrDecimal(utils.accSub(salesAmount, v.salesBalance.pbalance)), "blue"], ["公司利润: ", utils.changeThrDecimal(utils.accSub(salesRevenue, accountsPayable)), "blue"], ["收款时间: ", v.salesBalance.createTime, "green"], ["销售成本比例: ", salesAmount == 0 ? 0 : utils.changeTwoDecimal(utils.accDiv(v.salesBalance.pbalance, salesAmount)), "blue"], ["结算利润占比: ", salesAmount == 0 ? 0 : utils.changeTwoDecimal(utils.accDiv(utils.accSub(salesAmount, v.salesBalance.pbalance), salesAmount)), "blue"], ["公司利润占比: ", salesAmount == 0 ? 0 : utils.changeTwoDecimal(comProfits), "blue"],
                ["主材打折占比: ", salesAmount == 0 ? 0 : utils.changeTwoDecimal(utils.accSub(1, utils.accDiv(allowance, salesAmount))), "blue"], ];

            $.each(detailArr, function(index, value) {

                var $liProperty = $('<li></li>').appendTo($ulDetail);
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
            });

            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');
            var $unbound = $('<a></a>').addClass('btn btn-minier btn-yellow').html('解绑');
            $divBtnWrap.append($unbound).appendTo($h3);

            if (balanceSales.status != constant.balance().balanceSales.STATUS_INIT_INT) {
                $divBtnWrap.hide();
            }

            $unbound.click(function() {

                com.showConfirm("确定解除绑定", function() {

                    var options = {};
                    var balanceSales = {};
                    var bsbid = v.bsbid;

                    options["balanceSales.bsid"] = balanceSalesBalance.bsid;

                    com.post(api.balance.queryBalanceSalesByBsid, {
                        "balanceSales.bsid": balanceSalesBalance.bsid
                    }, function(res) {

                        balanceSales = res.balanceSales;
                    }, null, false);

                    options["balanceSales.income"] = utils.accSub(balanceSales.income, salesRevenue);
                    options["balanceSales.cost"] = utils.accSub(balanceSales.cost, v.salesBalance.pbalance);
                    options["balanceSales.payment"] = utils.accSub(balanceSales.payment, accountsPayable);
                    options["balanceSales.profit"] = utils.accSub(balanceSales.profit, utils.accSub(salesRevenue, accountsPayable));

                    options["balanceSalesBalances[0].bsbid"] = bsbid;

                    com.post(api.balance.unbindBalanceSales, options, function(res) {

                        com.showAlert(com.info, "操作成功");
                        searcher.doSearch();
                    });
                });
            });
            return $liLine;
        };
        // 返回结果给searcher , searcher利用返回的方法完成具体分页显示的过程
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

    searcher.init([], "bsbcondList", api.balance.pageBalanceSalesBalance, function(data) {

        displayFunc.init('bsbresultList', data);
    }, "bsbpagenation", "balanceSalesBalancePostData", {
        "balanceSales.bsid": balanceSalesBalance.bsid
    }, false, null, function() {

        var $adda = $('<a></a>').addClass('btn btn-minier btn-yellow pull-left').attr('id', 'addBalance').css("margin", "0px 3px");
        var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
        var $addspan = $('<span></span>').text('明细打印').appendTo($adda);

        var $profitPrint = $('<a></a>').addClass('btn btn-minier btn-success pull-left').attr('name', 'profitPrint').css("margin", "0px 3px");
        var $profitPrinti = $('<i></i>').addClass('icon-plus bigger-110').appendTo($profitPrint);
        var $profitPrintBtn = $('<span></span>').text('利润打印').appendTo($profitPrint);

        $profitPrintBtn.click(function() {

            params.balance.bsid = balanceSalesBalance.bsid;
            params.balance.type = 2;

            com.popup("利润表", api.index.balanceSales2print.url, null, null, true);
        });

        $adda.click(function() {

            params.balance.bsid = balanceSalesBalance.bsid;
            params.balance.type = 1;

            com.popup("明细表", api.index.balanceSales2print.url, null, null, true);
        });

        if (balanceSales.status == constant.balance().balanceSales.STATUS_INIT_INT) {
            $adda.hide();
            $profitPrint.hide();
        }

        return [$adda, $profitPrint];
    }, 'bsbresultList');

});
