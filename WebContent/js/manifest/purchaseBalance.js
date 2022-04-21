$(function() {

    var purchaseBalance = {
        items: {},

        status: {},
        balanceStatus: {},
    };

    com.post(api.ds.manifest, {}, function(res) {

        $.each(res.purchaseStatus, function(i, v) {
            purchaseBalance.status[v.key] = v.value;
        });

        $.each(res.purchaseBalanceStatus, function(i, v) {
            purchaseBalance.balanceStatus[v.key] = v.value;
        });
    }, null, false);

    var displayFunc = (function() {

        var renderList = function(tableId, listData) {
            var $tableWrap = com.focusPage('#' + tableId);

            if (listData && listData.length) {

                var $ulTitle = createTableTitle();
                var $ulData = $('<ul></ul>').addClass('flex-table');
                $tableWrap.append($ulTitle).append($ulData);

                $.each(listData, function(i, v) {
                    var $liLine = creatLine(i, v, i == listData.length - 1);
                    $liLine.appendTo($ulTitle);
                });
            }
        };

        var createTableTitle = function() {

            var $ulTitle = $('<ul></ul>').addClass('flex-table');
            var $liTitle = $('<li></li>').addClass('line table-title');

            var $indexWrap = $('<div></div>').addClass('line-wrap order').html($('<div></div>'));
            var $contentWrap = $('<div></div>').addClass('line-wrap  content col9');

            var titleName = '采购单号,创建人,创建时间,结算时间,交期时间,入库状态,结算状态,说明';

            $.each(titleName.split(','), function(i, v) {
                var $cell = $('<div></div>').addClass('cell').html(v);
                $cell.appendTo($contentWrap);
            });

            var $optionWrap = $('<div></div>').addClass('line-wrap action').html($('<div>操作</div>').addClass('cell option'));

            $liTitle.append($indexWrap).append($contentWrap).append($optionWrap).appendTo($ulTitle);

            return $ulTitle;
        };

        var creatLine = function(i, v, lastFlag) {

            var $liLine = $('<li></li>').addClass('line');

            var $indexWrap = $('<div></div>').addClass('line-wrap order').html($('<div></div>').addClass('cell index').html(i + 1));
            var $indexWrap = $('<div></div>').addClass('line-wrap order').html($('<div></div>').addClass('cell index').html(i + 1).attr({
                "value": v.pid,
                "data-type": v.status
            }));
            var $contentWrap = $('<div></div>').addClass('line-wrap  content col9');

            var propertyArr = [[v.no, 'blue'], [v.user.userName, 'grey'], [v.createTime, 'green'], [v.balanceTime, 'green'], [v.deliveryTime, 'green'], [purchaseBalance.status[v.status], 'red'], [purchaseBalance.balanceStatus[v.balanceStatus], 'red'], [v.comment, 'grey']];

            $.each(propertyArr, function(i, v) {
                $('<div></div>').addClass('cell ' + v[1]).html(v[0]).appendTo($contentWrap);
            });

            var $optionWrap = $('<div></div>').addClass('line-wrap action');
            var $cellOption = $('<div></div>').addClass('cell option');

            var $btnGroup = $('<div></div>').addClass('btn-group');
            var $btn = $('<button></button>').addClass('btn btn-primary dropdown-toggle').attr('data-toggle', 'dropdown').append('操作').append('<i class="icon-angle-down"></i>');
            var $btnUl = $('<ul></ul>').addClass('dropdown-menu').addClass(lastFlag ? 'bottom-up' : '');

            var $btnView = $('<li></li>').append($('<a></a>').html('查看'));
            var $btnBalance = $('<li></li>').append($('<a></a>').html('结算'));
            var $btnFinish = $('<li></li>').append($('<a></a>').html('完结'));

            $btnUl.append($btnView).append($btnBalance).append($btnFinish);
            $btnGroup.append($btn).append($btnUl).appendTo($cellOption);
            $cellOption.appendTo($optionWrap);
            $liLine.append($indexWrap).append($contentWrap).append($optionWrap);

            $btnView.click(function() {
                params.manifest.purchase.pid = v.pid;
                com.popup4page("#layerPopUp", "views/manifest/purchase4view.html", "查看__采购单号 : " + v.no);
            });

            $btnBalance.click(function() {

                params.manifest.purchaseBalance = v;

                com.popup4page("#layerPopUp", "views/manifest/purchaseBalance2balance.html", "结算");
            });

            $btnFinish.click(function(e) {

                if (v.balanceStatus == 2) {
                    com.showAlert(com.warning, "采购单已完结");
                    return false;
                }

                var options = {
                    "purchase.pid": v.pid,
                    "purchase.balanceStatus": 2
                };

                com.showConfirm('确认完结采购单?', function(indexo) {
                    com.post(api.inventory.updatePurchaseForBalanceStatus, options, function(res) {
                        purchaseBalanceSearcher.doSearch();
                    });
                });

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

    var purchaseBalanceSearcher = new Searcher();

    purchaseBalanceSearcher.init(["inventory-purchase-no", "inventory-purchase-createName", "inventory-purchase-createTime", "inventory-purchase-status", "inventory-purchase-balanceStatus"], "condList", api.inventory.pagePurchase, function(data) {
        displayFunc.init('resultList', data);
    }, "pagenation", "purchasePostData", null, false, null, function() {

        // var $batchs = $('<a></a>').addClass('btn mini blue').attr('name', 'addBatch').css('margin-top','-2px').html('批量入库');

        var $impa = $('<a></a>').addClass('btn btn-minier btn-success pull-left').attr('name', 'import').css('margin-top', '-2px');
        var $impi = $('<i></i>').addClass('icon-download-alt bigger-110').appendTo($impa);
        var $impspan = $('<span></span>').text('导出').appendTo($impa);

        // 导出点击事件
        $impa.click(function() {
            exportPurchase();
        });

        return [$impa];
    }, 'resultList');

    // 导出excel
    function exportPurchase() {

        if (com.focusPage('span[name="totalRecords"]').text() == 0) {
            com.showAlert(com.warning, "请通过条件进行查询");
            return false;
        }

        if (com.focusPage('span[name="totalRecords"]').text() > 1000) {
            com.showAlert(com.warning, "查询结果大于阀值 , 不能完成导出动作");
            return false;
        }

        com.post(api.inventory.pagePurchase, $.extend({}, params.purchasePostData, {
            "paging.noPage": 1
        }), function(res) {

            $.each(res.paging.data, function(i, v) {
                v.balanceStatus = (v.balanceStatus == "0" ? "初始" : (v.balanceStatus == "1" ? "已结算" : "已完结"));
                v.status = (v.status == "0" ? "初始" : (v.status == "1" ? "部分入库" : "全部入库"));
            });

            $.exceler({
                column: [['采购单号', 'no'], ['创建人', 'user.userName'], ['创建时间', 'createTime'], ['结算时间', 'balanceTime'], ['交期时间', 'deliveryTime'], ['入库状态', 'status'], ['结算状态', 'balanceStatus'], ['说明', 'comment']],
                list: res.paging.data
            });
        });
    }
});
