$(function () {

    var $popUp = com.focusPage('#viewPopUp');

    var sid = $popUp.attr('data-sid');

    var _option = {};

    var displayFuncSalesManifest = (function () {

        var renderList = function (tableId, listData) {

            var $tableWrap = com.focusPage('#' + tableId);
            var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');

            if (listData && listData.length) {
                $.each(listData, function (i, v) {

                    var $liLine = $('<li></li>').addClass('item-orange clearfix');
                    var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
                    var $h3 = $('<h3></h3>').addClass('oid');
                    var $small = $('<small></small>').addClass('blue');//.html(v.sales.orderId);
                    var $btnDiv = $('<div></div>').addClass('pull-right action-buttons');

                    var $btnSalesItem = $('<a></a>').addClass(' btn btn-minier btn-yellow').html('出库单详情');
                    var $iicon = $('<i></i>').addClass('icon-chevron-down').appendTo($btnSalesItem);

                    var $manifestItems = $('<div></div>').attr('data-mid', v.mid).addClass('page-content').hide();
                    var $manifestItemsrow = $('<div></div>').addClass('row').appendTo($manifestItems);
                    var $manifestItemscol = $('<div></div>').addClass('col-xs-12').appendTo($manifestItemsrow);
                    var $manifestItemsid = $('<div id="resultListManifestItem' + v.mid + '"></div>').addClass('clearfix tab-pane active').appendTo($manifestItemscol);

                    var propertyArr = [
                        ["货单号:", v.code, "grey"]
                    ];

                    $.each(propertyArr, function (index, value) {
                        var $liProperty = $('<li></li>');
                        $('<strong></strong>').html(value[0]).appendTo($liProperty);
                        $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                        $liProperty.appendTo($ulProperty);
                    });

                    $btnSalesItem.click(function () {

                        if ($manifestItems.hasClass('open')) {
                            $manifestItems.removeClass('open').hide();
                        } else {

                            if ($manifestItemsid.html() == "") {
                                var displayFuncManifestItem = (function () {

                                    var renderListManifestItem = function (tableId, listData) {

                                        var $tableWrapManifestItem = com.focusPage('#' + tableId);
                                        var $ulManifestItem = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');

                                        if (listData && listData.length) {
                                            $.each(listData, function (i, v) {

                                                var $liLineManifestItem = $('<li></li>').addClass('item-orange clearfix');
                                                var $ulPropertyManifestItem = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
                                                var $h3ManifestItem = $('<h4></h4>').addClass('oid');
                                                var $smallManifestItem = $('<small></small>').addClass('blue').html(v.goods.name +' '+ v.goods.no);
                                                var $btnDivManifestItem = $('<div></div>').addClass('pull-right action-buttons');

                                                var propertyArrManifestItem = [
                                                    ["商品颜色:", v.color.name, "grey"],
                                                    ["商品规格:", v.format.info, "grey"],
                                                    ["单位:", v.goods.measurementUnit, "grey"],
                                                    ["出货仓库:", v.outstorehouse.name, "grey"],
                                                    ["数量:", v.num, "blue"],
                                                    ["件数:", v.goods.pieceNum, "blue"],
                                                    ["价格:", v.outprice, "blue"]
                                                ];

                                                $.each(propertyArrManifestItem, function (index, value) {
                                                    var $liPropertyManifestItem = $('<li></li>');
                                                    $('<strong></strong>').html(value[0]).appendTo($liPropertyManifestItem);
                                                    $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liPropertyManifestItem);
                                                    $liPropertyManifestItem.appendTo($ulPropertyManifestItem);
                                                });
                                                $btnDivManifestItem.appendTo($h3ManifestItem);
                                                $liLineManifestItem.appendTo($ulManifestItem);
                                                $liLineManifestItem.append($h3ManifestItem).append($ulPropertyManifestItem);
                                                $smallManifestItem.appendTo($h3ManifestItem);

                                            });

                                            $ulManifestItem.appendTo($tableWrapManifestItem);

                                        }
                                    };


                                    return {
                                        init: function (tableId, listData) {
                                            com.focusPage('#' + tableId).html(null);
                                            renderListManifestItem(tableId, listData);
                                        }
                                    };


                                })();

                                com.post(api.inventory.queryManifestItemByMid, {
                                    "manifest.mid": v.mid
                                }, function (res) {

                                    displayFuncManifestItem.init('resultListManifestItem' + v.mid, res.manifestItems);
                                });
                            }

                            $manifestItems.addClass('open').show();
                        }

                    });

                    $btnDiv.append($btnSalesItem).appendTo($h3);
                    $liLine.appendTo($ul);
                    $manifestItems.appendTo($ul);
                    $liLine.append($h3).append($ulProperty);
                    $small.appendTo($h3);

                });

                $ul.appendTo($tableWrap);
            }
        };


        return {
            init: function (tableId, listData) {
                com.focusPage('#' + tableId).html(null);
                renderList(tableId, listData);
            }
        };


    })();

    com.post(api.inventory.queryManifestForXGBySid, {
        "sales.sid": sid
    }, function (res) {
        if (res.manifests.length == 0) {
            emptyData('resultListSalesManifest');
        } else {
            displayFuncSalesManifest.init('resultListSalesManifest', res.manifests);
        }

    }, null, false);


    var displayFuncSalesPurchase = (function () {

        var renderList = function (tableId, listData) {

            var $tableWrap = com.focusPage('#' + tableId);
            var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');

            if (listData && listData.length) {
                $.each(listData, function (i, v) {

                    var $liLine = $('<li></li>').addClass('item-orange clearfix');
                    var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
                    var $h3 = $('<h3></h3>').addClass('oid');
                    var $small = $('<small></small>').addClass('blue');//.html(v.sales.orderId);
                    var $btnDiv = $('<div></div>').addClass('pull-right action-buttons');

                    var $btnSalesItem = $('<a></a>').addClass(' btn btn-minier btn-yellow').html('采购单详情');
                    var $iicon = $('<i></i>').addClass('icon-chevron-down').appendTo($btnSalesItem);

                    var $purchaseItems = $('<div></div>').attr('data-pid', v.pid).addClass('page-content').hide();
                    var $purchaseItemsrow = $('<div></div>').addClass('row').appendTo($purchaseItems);
                    var $purchaseItemscol = $('<div></div>').addClass('col-xs-12').appendTo($purchaseItemsrow);
                    var $purchaseItempid = $('<div id="resultListPurchaseItem' + v.pid + '"></div>').addClass('clearfix tab-pane active').appendTo($purchaseItemscol);

                    var propertyArr = [
                        ["采购单号:", v.no, "grey"]
                    ];

                    $.each(propertyArr, function (index, value) {
                        var $liProperty = $('<li></li>');
                        $('<strong></strong>').html(value[0]).appendTo($liProperty);
                        $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                        $liProperty.appendTo($ulProperty);
                    });

                    $btnSalesItem.click(function () {

                        if ($purchaseItems.hasClass('open')) {
                            $purchaseItems.removeClass('open').hide();
                        } else {

                            if ($purchaseItempid.html() == "") {
                                var displayFuncPurchaseItem = (function () {

                                    var renderListPurchaseItem = function (tableId, listData) {

                                        var $tableWrapPurchaseItem = com.focusPage('#' + tableId);
                                        var $ulPurchaseItem = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');

                                        if (listData && listData.length) {
                                            $.each(listData, function (i, v) {

                                                var $liLinePurchaseItem = $('<li></li>').addClass('item-orange clearfix');
                                                var $ulPropertyPurchaseItem = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
                                                var $h3PurchaseItem = $('<h4></h4>').addClass('oid');
                                                var $smallPurchaseItem = $('<small></small>').addClass('blue').html(v.goods.name +' '+ v.goods.no);
                                                var $btnDivPurchaseItem = $('<div></div>').addClass('pull-right action-buttons');

                                                var propertyArrPurchaseItem = [
                                                    ["商品颜色:", v.color.name, "grey"],
                                                    ["商品规格:", v.format.info, "grey"],
                                                    ["单位:", v.goods.measurementUnit, "grey"],
                                                    ["数量:", v.num, "blue"],
                                                    ["件数:", v.goods.pieceNum, "blue"],
                                                    ["价格:", v.inprice, "blue"]
                                                ];

                                                $.each(propertyArrPurchaseItem, function (index, value) {
                                                    var $liPropertyPurchaseItem = $('<li></li>');
                                                    $('<strong></strong>').html(value[0]).appendTo($liPropertyPurchaseItem);
                                                    $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liPropertyPurchaseItem);
                                                    $liPropertyPurchaseItem.appendTo($ulPropertyPurchaseItem);
                                                });
                                                $btnDivPurchaseItem.appendTo($h3PurchaseItem);
                                                $liLinePurchaseItem.appendTo($ulPurchaseItem);
                                                $liLinePurchaseItem.append($h3PurchaseItem).append($ulPropertyPurchaseItem);
                                                $smallPurchaseItem.appendTo($h3PurchaseItem);

                                            });

                                            $ulPurchaseItem.appendTo($tableWrapPurchaseItem);

                                        }
                                    };


                                    return {
                                        init: function (tableId, listData) {
                                            com.focusPage('#' + tableId).html(null);
                                            renderListPurchaseItem(tableId, listData);
                                        }
                                    };


                                })();

                                com.post(api.inventory.queryPurchaseItemByPid, {
                                    "purchase.pid": v.pid
                                }, function (res) {
                                    displayFuncPurchaseItem.init('resultListPurchaseItem' + v.pid, res.purchaseItems);
                                });
                            }

                            $purchaseItems.addClass('open').show();
                        }

                    });

                    $btnDiv.append($btnSalesItem).appendTo($h3);
                    $liLine.appendTo($ul);
                    $purchaseItems.appendTo($ul);
                    $liLine.append($h3).append($ulProperty);
                    $small.appendTo($h3);

                    _option["pids[" + i + "]"] = v.pid;

                });

                $ul.appendTo($tableWrap);

            }
        };

        return {
            init: function (tableId, listData) {
                com.focusPage('#' + tableId).html(null);
                renderList(tableId, listData);
            }
        };

    })();

    com.post(api.inventory.queryPurchaseBySid, {
        "sales.sid": sid
    }, function (res) {
        if (res.purchases.length == 0) {
            emptyData('resultListSalesPurchase');
        } else {
            displayFuncSalesPurchase.init('resultListSalesPurchase', res.purchases);
        }

    }, null, false);

    var displayFuncPurchaseManifest = (function () {

        var renderList = function (tableId, listData) {

            var $tableWrap = com.focusPage('#' + tableId);
            var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');

            if (listData && listData.length) {
                $.each(listData, function (i, v) {

                    var $liLine = $('<li></li>').addClass('item-orange clearfix');
                    var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
                    var $h3 = $('<h3></h3>').addClass('oid');
                    var $small = $('<small></small>').addClass('blue');//.html(v.purchase.no);
                    var $btnDiv = $('<div></div>').addClass('pull-right action-buttons');

                    var $btnSalesItem = $('<a></a>').addClass(' btn btn-minier btn-yellow').html('采购货单详情');
                    var $iicon = $('<i></i>').addClass('icon-chevron-down').appendTo($btnSalesItem);

                    var $purchaseManifestItems = $('<div></div>').attr('data-mid', v.mid).addClass('page-content').hide();
                    var $purchaseManifestItemsrow = $('<div></div>').addClass('row').appendTo($purchaseManifestItems);
                    var $purchaseManifestItemscol = $('<div></div>').addClass('col-xs-12').appendTo($purchaseManifestItemsrow);
                    var $purchaseManifestItemmid = $('<div id="resultListPurchaseManifestItem' + v.mid + '"></div>').addClass('clearfix tab-pane active').appendTo($purchaseManifestItemscol);

                    var propertyArr = [
                        ["货单号:", v.code, "grey"]
                    ];

                    $.each(propertyArr, function (index, value) {
                        var $liProperty = $('<li></li>');
                        $('<strong></strong>').html(value[0]).appendTo($liProperty);
                        $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                        $liProperty.appendTo($ulProperty);
                    });

                    $btnSalesItem.click(function () {

                        if ($purchaseManifestItems.hasClass('open')) {
                            $purchaseManifestItems.removeClass('open').hide();
                        } else {

                            if ($purchaseManifestItemmid.html() == "") {
                                var displayFuncPurchaseManifestItem = (function () {

                                    var renderListPurchaseManifestItem = function (tableId, listData) {

                                        var $tableWrapPurchaseManifestItem = com.focusPage('#' + tableId);
                                        var $ulPurchaseManifestItem = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');

                                        if (listData && listData.length) {
                                            $.each(listData, function (i, v) {

                                                var $liLinePurchaseManifestItem = $('<li></li>').addClass('item-orange clearfix');
                                                var $ulPropertyPurchaseManifestItem = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
                                                var $h3PurchaseManifestItem = $('<h4></h4>').addClass('oid');
                                                var $smallPurchaseManifestItem = $('<small></small>').addClass('blue').html(v.goods.name +' '+ v.goods.no);
                                                var $btnDivPurchaseManifestItem = $('<div></div>').addClass('pull-right action-buttons');

                                                var propertyArrPurchaseManifestItem = [
                                                    ["商品颜色:", v.color.name, "grey"],
                                                    ["商品规格:", v.format.info, "grey"],
                                                    ["单位:", v.goods.measurementUnit, "grey"],
                                                    ["进货仓库:", v.instorehouse.name, "grey"],
                                                    ["数量:", v.num, "blue"],
                                                    ["件数:", v.goods.pieceNum, "blue"],
                                                    ["价格:", v.inprice, "blue"]
                                                ];

                                                $.each(propertyArrPurchaseManifestItem, function (index, value) {
                                                    var $liPropertyPurchaseManifestItem = $('<li></li>');
                                                    $('<strong></strong>').html(value[0]).appendTo($liPropertyPurchaseManifestItem);
                                                    $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liPropertyPurchaseManifestItem);
                                                    $liPropertyPurchaseManifestItem.appendTo($ulPropertyPurchaseManifestItem);
                                                });
                                                $btnDivPurchaseManifestItem.appendTo($h3PurchaseManifestItem);
                                                $liLinePurchaseManifestItem.appendTo($ulPurchaseManifestItem);
                                                $liLinePurchaseManifestItem.append($h3PurchaseManifestItem).append($ulPropertyPurchaseManifestItem);
                                                $smallPurchaseManifestItem.appendTo($h3PurchaseManifestItem);

                                            });

                                            $ulPurchaseManifestItem.appendTo($tableWrapPurchaseManifestItem);

                                        }
                                    };


                                    return {
                                        init: function (tableId, listData) {
                                            com.focusPage('#' + tableId).html(null);
                                            renderListPurchaseManifestItem(tableId, listData);
                                        }
                                    };


                                })();

                                com.post(api.inventory.queryManifestItemByMid, {
                                    "manifest.mid": v.mid
                                }, function (res) {
                                    displayFuncPurchaseManifestItem.init('resultListPurchaseManifestItem' + v.mid, res.manifestItems);
                                });
                            }

                            $purchaseManifestItems.addClass('open').show();
                        }

                    });

                    $btnDiv.append($btnSalesItem).appendTo($h3);
                    $liLine.appendTo($ul);
                    $purchaseManifestItems.appendTo($ul);
                    $liLine.append($h3).append($ulProperty);
                    $small.appendTo($h3);

                });

                $ul.appendTo($tableWrap);


            }
        };


        return {
            init: function (tableId, listData) {
                com.focusPage('#' + tableId).html(null);
                renderList(tableId, listData);
            }
        };


    })();

    com.post(api.inventory.queryManifestForPUByPids, _option, function (res) {
        if (res.manifests.length == 0) {
            emptyData('resultListPurchaseManifest');
        } else {
            displayFuncPurchaseManifest.init('resultListPurchaseManifest', res.manifests);
        }

    }, null, false);

    function emptyData(id) {
        var $resultList = com.focusPage('#' + id).html('');
        var $zone = $('<div></div>').addClass('dropzone dz-clickable').css('margin', '20px').css('border', '0px').appendTo($resultList);
        var $mesg = $('<div></div>').addClass('dz-default dz-message').appendTo($zone);
        var $span = $('<span></span>').text('无可用数据提供').appendTo($mesg);
    }

});