$(function () {

    var salesInventory = {
        sid :  params["sid"],
        items:{
            items : com.focusPage('#items')
        },
        manifestType : {},
        manifestStatus : {},
        purchaseBalanceStatus : {},
        purchaseStatus :{},
        propertyArr :[],
        propertyArrItem :[],
        manifestItemsid :null
    };
    
    var _option = {};
    salesInventory.items.items.empty();

    com.post(api.ds.manifest, {}, function(res){
        salesInventory.manifestType = res.manifestType.split("key", "value");
        salesInventory.manifestStatus = res.manifestStatus.split("key", "value");
        salesInventory.purchaseBalanceStatus = res.purchaseBalanceStatus.split("key", "value");
        salesInventory.purchaseStatus = res.purchaseStatus.split("key", "value");
    }, null, false);

    var displayFuncSalesManifest = (function () {

        var renderList = function (tableId, listData, leftTitle, leftTitlebtn, rightTitle, manifestItemsid, propertyArrs, url, xgOrpuOrpuManifestID) {
            var $tableWrap = com.focusPage('#' + tableId);
            var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');

            if (listData && listData.length) {
                $.each(listData, function (i, v) {
                    var oddNumbers;
                    if(tableId == "resultListSalesPurchase"){
                        oddNumbers = v.no;
                    }else {
                        oddNumbers = v.code;
                    }

                    var $liLine = $('<li></li>').addClass('item-orange clearfix');
                    var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
                    var $h3 = $('<h3></h3>').addClass('oid');
                    var $small = $('<small></small>').addClass('blue').html(leftTitle+": "+oddNumbers);
                    var $btnDiv = $('<div></div>').addClass('pull-right action-buttons');
                    var $btnSalesItem = $('<a></a>').addClass(' btn btn-minier btn-yellow').html(leftTitlebtn);
                    var code = $('<div></div>').html($small);
                    var $manifestItemsrow = $('<div></div>').addClass('row').attr('data-mid', v.mid);
                    var $manifestItemscol = $('<div></div>').addClass('col-xs-12').appendTo($manifestItemsrow);
                    var $manifestItemsid = manifestItemsid.appendTo($manifestItemscol);

                    $.each(propertyArrs, function (index, value) {
                        var $liProperty = $('<li></li>');
                        $('<strong></strong>').html(value[0]).appendTo($liProperty);
                        $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                        $liProperty.appendTo($ulProperty);
                    });

                    $btnSalesItem.click(function () {

                        salesInventory.items.items.empty();
                        com.focusPage("#details").find("strong").text(rightTitle+": "+oddNumbers);
                        if ($manifestItemsid.html() == "") {
                            if(tableId!="resultListSalesPurchase"){
                                com.post(url, {
                                    "manifest.mid": v.mid
                                }, function (res) {
                                    displayFuncManifestItem.init(xgOrpuOrpuManifestID + v.mid, res.manifestItems, tableId);
                                });
                            }else{
                                com.post(url, {
                                    "purchase.pid": v.pid
                                }, function (res) {
                                    displayFuncManifestItem.init(xgOrpuOrpuManifestID + v.pid, res.purchaseItems, tableId);
                                });
                            }
                        }
                    });
                    $btnDiv.append($btnSalesItem).appendTo(code);
                    code.appendTo($h3);
                    $liLine.appendTo($ul);
                    $liLine.append($h3).append($ulProperty);
                    $small.appendTo($h3);

                    if(tableId == "resultListSalesPurchase"){
                        _option["pids[" + i + "]"] = v.pid;
                    }
                });
                $ul.appendTo($tableWrap);
            }
        };
        return {
            init: function (tableId, listData, leftTitle, leftTitlebtn, rightTitle, manifestItemsid, propertyArr, url, xgOrpuOrpuManifestID) {
                com.focusPage('#' + tableId).html(null);
                renderList(tableId, listData, leftTitle, leftTitlebtn, rightTitle, manifestItemsid, propertyArr, url, xgOrpuOrpuManifestID);
            }
        };
    })();

    var displayFuncManifestItem = (function () {

        var renderListManifestItem = function (tableId, listData, identification) {
            var $tableWrapManifestItem = com.focusPage('#' + tableId);
            var $ulManifestItem = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');

            if (listData && listData.length) {
                $.each(listData, function (i, v) {
                    var $liLineManifestItem = $('<li></li>').addClass('item-orange clearfix');
                    var $ulPropertyManifestItem = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
                    var $h3ManifestItem = $('<h3></h3>').addClass('oid');
                    var $smallManifestItem = $('<small></small>').addClass('blue').html(v.goods.name +' '+ v.goods.no);
                    var $btnDivManifestItem = $('<div></div>').addClass('pull-right action-buttons');

                    var propertyArrManifestItem = judge(v, identification);

                    $.each(propertyArrManifestItem, function (index, value) {
                        var $liPropertyManifestItem = $('<li></li>');
                        $('<strong></strong>').html(value[0]).appendTo($liPropertyManifestItem);
                        $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liPropertyManifestItem);
                        $liPropertyManifestItem.appendTo($ulPropertyManifestItem);
                    });
                    $btnDivManifestItem.appendTo($h3ManifestItem);
                    $liLineManifestItem.appendTo(salesInventory.items.items);
                    $liLineManifestItem.append($h3ManifestItem).append($ulPropertyManifestItem);
                    $smallManifestItem.appendTo($h3ManifestItem);

                });
                $ulManifestItem.appendTo($tableWrapManifestItem);
            }
        };
        return {
            init: function (tableId, listData, identification) {
                com.focusPage('#' + tableId).html(null);
                renderListManifestItem(tableId, listData, identification);
            }
        };
    })();

    function judge(v, identification) {
        var propertyArrManifestItem = [];
        if(identification == "resultListSalesManifest"){
            propertyArrManifestItem = [
                ["商品颜色:", v.color.name, "grey"],
                ["商品规格:", v.format.info, "grey"],
                ["单位:", v.goods.measurementUnit, "grey"],
                ["出货仓库:", v.outstorehouse.name, "grey"],
                ["数量:", v.num, "blue"],
                ["件数:", v.goods.pieceNum, "blue"],
                ["价格:", v.outprice, "blue"]
            ];
        }

        if(identification == "resultListSalesPurchase"){
            propertyArrManifestItem = [
                ["商品颜色:", v.color.name, "grey"],
                ["商品规格:", v.format.info, "grey"],
                ["单位:", v.goods.measurementUnit, "grey"],
                ["数量:", v.num, "blue"],
                ["件数:", v.goods.pieceNum, "blue"],
                ["价格:", v.inprice, "blue"]
            ];
        }

        if(identification == "resultListPurchaseManifest"){
            propertyArrManifestItem = [
                ["商品颜色:", v.color.name, "grey"],
                ["商品规格:", v.format.info, "grey"],
                ["单位:", v.goods.measurementUnit, "grey"],
                ["进货仓库:", v.instorehouse.name, "grey"],
                ["数量:", v.num, "blue"],
                ["件数:", v.goods.pieceNum, "blue"],
                ["价格:", v.inprice, "blue"]
            ];
        }
        return propertyArrManifestItem;
    }

    com.post(api.inventory.queryManifestForXGBySid, {
        "sales.sid": salesInventory.sid
    }, function (res) {
        if (res.manifests.length == 0) {
            emptyData('resultListSalesManifest');
        } else {
            $.each(res.manifests, function (i, v) {
                salesInventory.manifestItemsid = $('<div id="resultListManifestItem' + v.mid + '"></div>').addClass('clearfix tab-pane active');
                salesInventory.propertyArr = [
                    ["创建人:", v.creater.currentName, "grey"],
                    ["创建时间:", v.createTime, "green"],
                    ["货单时间:", v.manifestTime, "green"],
                    ["类型:", salesInventory.manifestType[v.type], "red"],
                    ["状态:", salesInventory.manifestStatus[v.status], "red"]
                ];
            });

            var url = api.inventory.queryManifestItemByMid;
            displayFuncSalesManifest.init('resultListSalesManifest', res.manifests, "货单号", "出库单详情", "出库详情", salesInventory.manifestItemsid, salesInventory.propertyArr, url, "resultListManifestItem");
        }
    }, null, false);

    com.post(api.inventory.queryPurchaseBySid, {
        "sales.sid": salesInventory.sid
    }, function (res) {
        if (res.purchases.length == 0) {
            emptyData('resultListSalesPurchase');
        } else {
            $.each(res.purchases, function (i, v) {
                salesInventory.manifestItemsid = $('<div id="resultListPurchaseItem' + v.pid + '"></div>').addClass('clearfix tab-pane active');
                salesInventory.propertyArr = [
                    ["创建人:", v.user.currentName, "grey"],
                    ["创建时间:", v.createTime, "green"],
                    ["结算时间:", v.balanceTime, "green"],
                    ["交付时间:", v.deliveryTime, "green"],
                    ["状态:", salesInventory.purchaseStatus[v.status], "red"]
                ];
            });
            var url = api.inventory.queryPurchaseItemByPid;
            displayFuncSalesManifest.init('resultListSalesPurchase', res.purchases, "采购单号", "采购单详情", "采购详情", salesInventory.manifestItemsid, salesInventory.propertyArr, url, "resultListPurchaseItem");
        }
    }, null, false);

    com.post(api.inventory.queryManifestForPUByPids, _option, function (res) {
        if (res.manifests.length == 0) {
            emptyData('resultListPurchaseManifest');
        } else {
            $.each(res.manifests, function (i, v) {
                salesInventory.manifestItemsid = $('<div id="resultListPurchaseManifestItem' + v.mid + '"></div>').addClass('clearfix tab-pane active');
                salesInventory.propertyArr = [
                    ["创建人:", v.creater.currentName, "grey"],
                    ["创建时间:", v.createTime, "green"],
                    ["货单时间:", v.manifestTime, "green"],
                    ["类型:", salesInventory.manifestType[v.type], "red"],
                    ["状态:", salesInventory.manifestStatus[v.status], "red"]
                ];
            });
            var url = api.inventory.queryManifestItemByMid;
            displayFuncSalesManifest.init('resultListPurchaseManifest', res.manifests, "货单号", "采购货单详情", "入库详情", salesInventory.manifestItemsid, salesInventory.propertyArr, url, "resultListPurchaseManifestItem");
        }
    }, null, false);

    function emptyData(id) {
        var $resultList = com.focusPage('#' + id).html('');
        var $zone = $('<div></div>').addClass('dropzone dz-clickable').css('margin', '20px').css('border', '0px').appendTo($resultList);
        var $mesg = $('<div></div>').addClass('dz-default dz-message').appendTo($zone);
        var $span = $('<span></span>').text('无可用数据提供').appendTo($mesg);
    }
});