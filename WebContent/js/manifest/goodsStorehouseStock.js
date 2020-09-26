$(function () {

    var goodsStorehouseStock = {
        goods: null,
        submitBtn: com.focusPage("#submitBtn"),
        confirm: com.focusPage("#confirm")
    };
    goodsStorehouseStock.confirm.bindClick(saveData);
    goodsStorehouseStock.formStore = com.focusPage('#formStore');
    com.initTypeahead("name", api.data.queryGoodsByName, "goods.name", {}, "goodes", "gid", "name", function (list, k, v) {
        com.focusPage('#layerAddGoodsStorehouseStock').find('input[name="name"]').attr('data-gid', k);
        com.post(api.data.queryColorForEnableByGid, {
            "color.gid": k
        }, function (res) {
            com.focusPage('#layerAddGoodsStorehouseStock').find('select[name="color"]').bindData(res.colors, 'cid', 'name');
        });
        com.post(api.data.queryFormatForEnableByGid, {
            "format.gid": k
        }, function (res) {
            com.focusPage('#layerAddGoodsStorehouseStock').find('select[name="format"]').bindData(res.formats, 'fid', 'info');
        });

        return v;
    });

    goodsStorehouseStock.submitBtn.click(function () {
        addData()
    });

    com.post(api.inventory.queryStorehouseForSelf, {}, function (res) {
        var storehousesStatus = [];

        $.each(res.storehouses, function (i, v) {
            if (v.status == 0) {
                storehousesStatus.push(v);
            }
        });
        com.focusPage('#layerAddGoodsStorehouseStock').find('select[name="storehouse"]').bindData(storehousesStatus, 'shid', 'name');
    }, null, false);

    var displayFunc = (function () {
        /*表格样式*/

        var renderList = function (tableId, listData) {
            var $tableWrap = com.focusPage('#' + tableId);
            if (listData && listData.length) {

                var $ulTitle = createTableTitle();

                var $ulData = $('<ul></ul>').addClass('flex-table');

                $tableWrap.append($ulTitle).append($ulData);

                $.each(listData, function (i, v) {
                    var $liLine = creatLine(i, v, i == listData.length - 1);
                    $liLine.appendTo($ulTitle);
                });
            }
        };

        var createTableTitle = function () {

            var $ulTitle = $('<ul></ul>').addClass('flex-table');
            var $liTitle = $('<li></li>').addClass('line table-title');
            var $indexWrap = $('<div></div>').addClass('line-wrap order').html($('<div></div>'));
            var $contentWrap = $('<div></div>').addClass('line-wrap  content col12');

            var titleName = '仓库名称,商品编号,商品名称,条形码,品类,品牌,颜色,规格,单位,类型,件数,数量';

            $.each(titleName.split(','), function (i, v) {
                var $cell = $('<div></div>').addClass('cell').html(v);
                $cell.appendTo($contentWrap);
            });

            var $optionWrap = $('<div></div>').addClass('line-wrap action').html($('<div>操作</div>').addClass('cell option'));
            $liTitle.append($indexWrap).append($contentWrap).append($optionWrap).appendTo($ulTitle);

            return $ulTitle;
        };

        var creatLine = function (i, v, lastFlag) {

            var $liLine = $('<li></li>').addClass('line');
            var $indexWrap = $('<div></div>').addClass('line-wrap order').html($('<div></div>').addClass('cell index').html(i + 1));
            var $contentWrap = $('<div></div>').addClass('line-wrap  content col12');

            var propertyArr = [
                //v.storehouse.code,
                [v.storehouse.name, 'grey'],
                [v.goods.no, 'blue'],
                [v.goods.name, 'grey'],
                [v.goods.barcode, 'blue'],
                [v.goods.category, 'grey'],
                [v.goods.brand, 'grey'],
                [v.color.name, 'grey'],
                [v.format.info, 'grey'],
                [v.goods.measurementUnit, 'grey'],
                [v.goods.type == 0 ? "商品" : "套餐", 'red'],
                [v.goods.pieceNum, 'blue'],
                [v.num, 'blue']
            ];

            $.each(propertyArr, function (i, v) {
                var $cell = $('<div></div>').addClass('cell ' + v[1]).html(v[0]);
                $cell.appendTo($contentWrap);
            });

            var $optionWrap = $('<div></div>').addClass('line-wrap action');
            var $cellOption = $('<div></div>').addClass('cell option');
            var $btnGroup = $('<div></div>').addClass('btn-group');

            var $btn = $('<button></button>').addClass('btn btn-primary dropdown-toggle').attr('data-toggle', 'dropdown').append('操作').append('<i class="icon-angle-down"></i>');
            var $btnUl = $('<ul></ul>').addClass('dropdown-menu').addClass(lastFlag ? 'bottom-up' : '');

            var $btnCP = $('<li></li>').append($('<a></a>').html('盘盈'));
            var $btnCL = $('<li></li>').append($('<a></a>').html('盘亏'));
            var $btnSplit = $('<li></li>').append($('<a></a>').html('拆分'));
            var $btnMerge = $('<li></li>').append($('<a></a>').html('合并'));

            $btnUl.append($btnCP).append($btnCL);

            if (v.goods.type == 1) {
                $btnUl.append($btnSplit).append($btnMerge);
            }

            $btnGroup.append($btn).append($btnUl).appendTo($cellOption);
            $cellOption.appendTo($optionWrap);
            $liLine.append($indexWrap).append($contentWrap).append($optionWrap);

            $btnCP.click(function () {

                clearForm('formStore');

                com.focusPage('#layerAddStrore').find('input[name="num"]').val(v.num);
                com.popup4model('#layerAddStrore', '盘盈');
                goodsStorehouseStock.formStore.attr('_data-type', '0');
                goodsStorehouseStock.goods = v;
            });

            $btnCL.click(function () {

                clearForm('formStore');

                com.focusPage('#layerAddStrore').find('input[name="num"]').val(v.num);
                com.popup4model('#layerAddStrore', '盘亏');
                goodsStorehouseStock.formStore.attr('_data-type', '1');
                goodsStorehouseStock.goods = v;
            });

            //拆分按钮点击事件
            $btnSplit.click(function () {
                params['goodsStorehouseStock'] = v;
                com.focusPage('#splitAndMergePopUp').attr('data-title', $btnSplit.text());
                com.popup4page('#splitAndMergePopUp', "views/manifest/goods2ms.html", "拆分", function () {
                    goodsStorehouseSeacher.doSearch();
                });
            });

            //合并按钮点击事件
            $btnMerge.click(function () {
                params['goodsStorehouseStock'] = v;
                com.focusPage('#splitAndMergePopUp').attr('data-title', $btnMerge.text());
                com.popup4page('#splitAndMergePopUp', "views/manifest/goods2ms.html", "合并", function () {
                    goodsStorehouseSeacher.doSearch();
                });
            });

            return $liLine;
        };

        return {
            init: function (tableId, listData) {
                com.focusPage('#' + tableId).html(null);
                renderList(tableId, listData);
            },
            drawLine: function (i, v) {
                return creatLine(i, v);
            }
        };
    })();

    var goodsStorehouseSeacher = new Searcher();

    goodsStorehouseSeacher.init(["inventory-storehouse-name", 'inventory-goods-name', 'inventory-goods-barcode'], "condList", api.inventory.pageGoodsStorehouseStock, function (data) {
            displayFunc.init('resultList', data);
        }, "pagenation", "goodsStorehouseStockPostData", null, false, null, function () {

            var $impa = $('<a></a>').addClass('btn btn-minier btn-success pull-left').attr('name', 'import').css('margin-top', '-2px');
            var $impi = $('<i></i>').addClass('icon-download-alt bigger-110').appendTo($impa);
            var $impspan = $('<span></span>').text('导出').appendTo($impa);

            var $adda = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('name', 'addQuotationVersion').css({
                'margin-top': '-2px',
                'margin-left': '4px'
            });
            var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
            var $addspan = $('<span></span>').text('添加').appendTo($adda);
            //导出点击事件
            $impa.click(function () {
                pageGoodsStorehouseStockImport();
            });

            $adda.click(function () {

                clearForm('formStore2');
                emptyAdd();
                com.clearValidator();
                com.popup4model('#layerAddGoodsStorehouseStock', "添加");
            });
            return [$impa, $adda];

        }
    );

    function clearForm(formId) {
        var $form = com.focusPage("#" + formId);
        var error = com.focusPage('.alert-error', $form);
        var success = com.focusPage('.alert-success', $form);
        com.focusPage('.control-group').removeClass("success").removeClass("error");
        com.focusPage(".ok").remove();
        com.focusPage(".help-inline").remove();
        success.hide();
        error.hide();
        com.focusPage("span.checked", $form).removeClass("checked");
        com.focusPage("tr.edit-on").removeClass("edit-on");
        $form.removeClass("edit-item");
        com.focusPage(".extra-wrap .control-group:not(.hide)").remove();//去掉辅助项
        com.focusPage('input[type="hidden"]', $form).val('');
        document.getElementById(formId).reset();
    }

    //导出
    function pageGoodsStorehouseStockImport() {

        if (com.focusPage('span[name="totalRecords"]').text() == 0) {
            com.showAlert(com.warning, "请通过条件进行查询");
            return false;
        }

        if (com.focusPage('span[name="totalRecords"]').text() > 2000) {
            com.showAlert(com.warning, "查询结果大于阀值 , 不能完成导出动作");
            return false;
        }

        com.post(api.inventory.pageGoodsStorehouseStock, $.extend({}, params.goodsStorehouseStockPostData, {"paging.noPage": 1}), function (res) {
            $.exceler({
                column: [
                    ['仓库名称', 'storehouse.name'],
                    ['商品编号', 'goods.no'],
                    ['商品名称', 'goods.name'],
                    ['条形码', 'goods.barcode'],
                    ['品类', 'goods.category'],
                    ['品牌', 'goods.brand'],
                    ['颜色', 'color.name'],
                    ['规格', 'format.info'],
                    ['单位', 'goods.measurementUnit'],
                    ['套餐', 'goods.type'],
                    ['件数', 'goods.pieceNum'],
                    ['数量', 'num']
                ],
                list: res.paging.data
            });
        });
    }

    function saveData() {

        if (com.validate('formStore', "right")) {
            return false;
        }
        var $layer = com.focusPage('#layerAddStrore');
        var type = com.focusPage('#formStore').attr('_data-type');
        var newNum = $layer.find('input[name="newNum"]').val();
        var url;
        var option = {
            "goodsStorehouseStock.goods.gid": goodsStorehouseStock.goods.goods.gid,
            "goodsStorehouseStock.storehouse.shid": goodsStorehouseStock.goods.storehouse.shid,
            "goodsStorehouseStock.color.cid": goodsStorehouseStock.goods.color.cid,
            "goodsStorehouseStock.format.fid": goodsStorehouseStock.goods.format.fid,
            "goodsStorehouseStock.num": Math.abs(parseFloat(newNum))
        };

        if (type == 0) {
            url = api.inventory.plusGoodsStorehouseStock
        } else if (type == 1) {
            url = api.inventory.loseGoodsStorehouseStock
        }

        com.post(url, option, function (res) {
            com.clearValidator("#newNum", true);
            com.focusPage('#formStore').removeAttr('_data-type');
            com.closePopup();
            goodsStorehouseSeacher.doSearch();
        });

    }

    function addData() {
        if (com.validate("formStore2", "right")) {
            return false;
        }
        var $layer = com.focusPage('#layerAddGoodsStorehouseStock');
        var gid = $layer.find('input[name="name"]').attr('data-gid');
        var cid = $layer.find('select[name="color"] option:selected').val();
        var fid = $layer.find('select[name="format"] option:selected').val();
        var shid = $layer.find('select[name="storehouse"] option:selected').val();

        com.post(api.inventory.makeGoodsStorehouseStock, {
            "goodsStorehouseStock.goods.gid": gid,
            "goodsStorehouseStock.color.cid": cid,
            "goodsStorehouseStock.format.fid": fid,
            "goodsStorehouseStock.storehouse.shid": shid
        }, function () {
            com.showAlert(com.info, "操作成功");
            com.closePopup();
            goodsStorehouseSeacher.doSearch();
        })
    }

    function emptyAdd() {
        com.focusPage("#name").val("");
        com.focusPage("#color").find("option").remove();
        com.focusPage("#format").find("option").remove();
    }
});
