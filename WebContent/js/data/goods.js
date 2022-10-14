$(function() {

    var goods = {

        gid: null,
        keyword: null,
        items: {
            no: com.focusPage("#no"),
            type: com.focusPage("#type"),
            name: com.focusPage("#name"),
            barcode: com.focusPage("#barcode"),
            category: com.focusPage("#category"),
            brand: com.focusPage("#brand"),
            measurementUnit: com.focusPage("#measurementUnit"),
            purchase: com.focusPage("#purchase"),
            selling: com.focusPage("#selling"),
            pieceNum: com.focusPage("#pieceNum"),
            accessoriesType: com.focusPage("#accessoriesType"),
        },
        submitBtn: com.focusPage("#submitBtn")
    };

    goods.items.type.bindData([{
        gid: 0,
        goods: "商品"
    }, {
        gid: 1,
        goods: "套餐"
    }], "gid", "goods");

    com.post(api.data.queryCategory, {}, function(res) {

        goods.items.category.bindData(res.categorys, "categoryName", "categoryName");
    });

    com.post(api.common.queryMeasurementUnit, {}, function(res) {

        goods.items.measurementUnit.bindData(res.measurementUnits, "name", "name");
    });

    com.post(api.data.queryAccessoriesType, {}, function(res) {

        goods.items.accessoriesType.bindData(res.accessoriesTypes, 'atid', 'name', true);
    });

    com.initTypeahead("brand", api.data.queryBrandByPinyin, "pinyinName", {}, "brands", "bid", "name", function(list, k, v) {

        $.each(list, function(index, val) {

            if (val.bid == k) {

                goods.bid = k;

                com.post(api.data.queryBrandByBid, {
                    "brand.bid": k
                }, function(res) {

                    goods.items.category.val(res.brand.categoryName);
                });
            }
        });
        return v;

    });

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

        // 绘制表格头
        var createTableTitle = function() {

            var $ulTitle = $('<ul></ul>').addClass('flex-table');
            var $liTitle = $('<li></li>').addClass('line table-title');

            var $indexWrap = $('<div></div>').addClass('line-wrap order').html($('<div></div>'));
            var $contentWrap = $('<div></div>').addClass('line-wrap  content col12');

            var titleName = '编号,商品,条形码,品类,品牌,单位,控价,售价,件数,辅类,类型,状态';

            $.each(titleName.split(','), function(i, v) {

                var $cell = $('<div></div>').addClass('cell').html(v);
                $cell.appendTo($contentWrap);
            });

            var $optionWrap = $('<div></div>').addClass('line-wrap action').html($('<div>操作</div>').addClass('cell option'));

            $liTitle.append($indexWrap).append($contentWrap).append($optionWrap).appendTo($ulTitle);

            return $ulTitle;
        };
        // 绘制表格体
        var creatLine = function(i, v, lastFlag) {

            var $liLine = $('<li></li>').addClass('line');

            var $indexWrap = $('<div></div>').addClass('line-wrap order').html($('<div></div>').addClass('cell index').html(i + 1));
            var $contentWrap = $('<div></div>').addClass('line-wrap  content col12');

            var propertyArr = [[v.no, 'blue'], [v.name, 'grey'], [v.barcode, 'blue'], [v.category, 'grey'], [v.brand, 'grey'], [v.measurementUnit, 'grey'], [v.purchase, 'blue'], [v.selling, 'blue'], [v.pieceNum, 'blue'], [v.accessoriesType.name, 'grey'], [v.type == "0" ? "商品" : "套餐", 'red'], [v.status == "0" ? "启用" : "禁用", 'red']];

            $.each(propertyArr, function(i, v) {

                var $cell = $('<div></div>').addClass('cell ' + v[1]).html(v[0]);
                $cell.appendTo($contentWrap);
            });

            var $optionWrap = $('<div></div>').addClass('line-wrap action');
            var $cellOption = $('<div></div>').addClass('cell option');

            var $btnGroup = $('<div></div>').addClass('btn-group');
            var $btn = $('<button></button>').addClass('btn btn-primary dropdown-toggle').attr('data-toggle', 'dropdown').append('操作').append('<i class="icon-angle-down"></i>');
            var $btnUl = $('<ul></ul>').addClass('dropdown-menu').addClass(lastFlag ? 'bottom-up' : '');

            var $btnColor = $('<li></li>').append($('<a></a>').html('颜色'));
            var $btnFormat = $('<li></li>').append($('<a></a>').html('规格'));
            var $btnPrice = $('<li></li>').append($('<a></a>').html('价格'));
            var $btnSuit = $('<li></li>').append($('<a></a>').html('查看'));
            var $btnStart = $('<li></li>').append($('<a></a>').html('启用'));
            var $btnStop = $('<li></li>').append($('<a></a>').html('禁用'));

            $btnUl.append($btnColor).append($btnFormat).append($btnPrice).append($btnStart).append($btnStop);

            $btnGroup.append($btn).append($btnUl).appendTo($cellOption);

            $cellOption.appendTo($optionWrap);

            $liLine.append($indexWrap).append($contentWrap).append($optionWrap);

            $btnColor.click(function() {

                params.data.goods = v;

                com.popup4page('#layerPopUp', 'views/data/color.html', '颜色');
            });

            $btnFormat.click(function() {

                params.data.goods = v;

                com.popup4page('#layerPopUp', 'views/data/format.html', '规格');
            });

            $btnPrice.click(function() {

                params.data.goods = v;

                com.popup4page('#layerPopUp', 'views/data/price.html', '价格');
            });

            $btnSuit.click(function() {

                params.data.goods = v;

                com.popup4page('#layerPopUp', 'views/data/goods4package.html', '套餐');
            });

            $btnStart.click(function() {

                if (v.status == 0) {
                    com.showAlert(com.warning, "已启用");
                    return false;
                }

                updateStatus(v.gid, 0);
            });

            $btnStop.click(function() {

                if (v.status == 1) {
                    com.showAlert(com.warning, "已禁用");
                    return false;
                }

                updateStatus(v.gid, 1);
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

    var goodsSeacher = new Searcher();

    goodsSeacher.init(['data-goods-no', 'data-goods-name', 'data-goods-barcode', 'data-goods-brand-name', 'data-goods-status'], "condList", api.data.pageGoods, function(data) {

        displayFunc.init('resultList', data);
    }, "pagenation", "goodsPostData", null, false, null, function() {

        var $adda = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('name', 'addQuotationVersion').css({
            'margin-left': '4px'
        });
        var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
        var $addspan = $('<span></span>').text('添加').appendTo($adda);

        var $addaExportGoods = $('<a></a>').addClass('btn btn-minier btn-success pull-left').attr('name', 'importGoods');
        var $addaExporti = $('<i></i>').addClass('icon-download-alt bigger-110').appendTo($addaExportGoods);
        var $addaExportspan = $('<span></span>').text('导出').appendTo($addaExportGoods);

        $adda.click(function() {

            com.cleanItems(goods.items);

            readonly(null);

            goods.gid = null;
            goods.bid = null;

            com.popup4model("#addLayer", "添加")
        });

        $addaExportGoods.click(function() {

            var total = com.focusPage('span[name="totalRecords"]').text();

            if (total == 0) {
                com.showAlert(com.warning, "请通过条件进行查询");
                return false;
            }

            if (com.focusPage('span[name="totalRecords"]').text() > 1000) {
                com.showAlert(com.warning, "查询结果大于阀值 , 导出失败");
                return false;
            }

            com.post(api.data.pageGoods, $.extend({}, params.goodsPostData, {
                "paging.noPage": 1
            }), function(res) {

                $.exceler({
                    column: [['商品ID', 'gid'], ['商品编码', 'no'], ['商品名称', 'name'], ['条形码', 'barcode'], ['品类', 'category'], ['品牌ID', 'bid'], ['品牌', 'brand'], ['单位', 'measurementUnit'], ['件数', 'pieceNum'], ['类型', 'type']],
                    list: res.paging.data
                });
            });

        });

        return [$addaExportGoods, $adda];

    }, 'resultList');

    goods.submitBtn.click(function() {

        saveData();
    });

    function updateStatus(gid, status) {

        var options = {
            "goods.gid": gid,
            "goods.status": status
        };

        com.post(api.data.updateGoodsForStatus, options, function(res) {

            com.showAlert(com.info, "操作成功");
            goodsSeacher.doSearch();
        });
    }

    function saveData() {

        if (com.validate("formGoods", "right")) {
            return false;
        }

        var gid = goods.gid;
        var atid = goods.items.accessoriesType.val();

        var url = api.data.updateGoods;
        var options = {
            "goods.type": goods.items.type.val(),
            "goods.purchase": goods.items.purchase.val(),
            "goods.selling": goods.items.selling.val(),
            "goods.accessoriesType.atid": atid == null || atid == "" ? "" : atid
        };

        if (!gid) {
            url = api.data.addGoods;
            options["goods.no"] = goods.items.no.val();
            options["goods.name"] = goods.items.name.val();
            options["goods.barcode"] = goods.items.barcode.val();
            options["goods.bid"] = goods.bid;
            options["goods.category"] = goods.items.category.val();
            options["goods.measurementUnit"] = goods.items.measurementUnit.val();
            options["goods.pieceNum"] = goods.items.pieceNum.val();
        } else {
            options["goods.gid"] = goods.gid;
        }

        com.post(url, options, function(res) {

            com.closePopup();
            goodsSeacher.doSearch();
        });

    }

    function readonly(disabled) {

        goods.items.no.attr("disabled", disabled);
        goods.items.type.attr("disabled", disabled);
        goods.items.name.attr("disabled", disabled);
        goods.items.barcode.attr("disabled", disabled);
        goods.items.category.attr("disabled", disabled);
        goods.items.brand.attr("disabled", disabled);
        goods.items.measurementUnit.attr("disabled", disabled);
        goods.items.pieceNum.attr("disabled", disabled);
    }

});
