
$(function () {

    com.focusPage('#layerAddGoodsStorehouseStock').find('input[name="name"]').typeahead({
        url: api.inventory.queryGoodsByName,
        list: [],
        postData: {},
        source: function (query, process) {
            var params = $.extend({
                "goods.name": query,
                "goods.pinyin": query,
                "goods.no": query
            }, this.options.postData);
            com.post(this.options.url, params, $.proxy(this.options.callback, this));
        }, matcher: function (item) {
            return true;
        }, callback: function (data) {
            this.options.list = data['goodes'];
            this.flprocess(this.options.list, 'gid', 'name');
        },
        isResultTypeMap: true,
        flupdater: function (k, v) {
            //k: key, v:value
            com.focusPage('#layerAddGoodsStorehouseStock').find('input[name="name"]').attr('data-gid', k);
            com.post(api.inventory.queryColorForEnableByGid, {
                "color.gid": k
            }, function (res) {
                com.focusPage('#layerAddGoodsStorehouseStock').find('select[name="color"]').bindData(res.colors, 'cid', 'name');
            });
            com.post(api.inventory.queryFormatForEnableByGid, {
                "format.gid": k
            }, function (res) {
                com.focusPage('#layerAddGoodsStorehouseStock').find('select[name="format"]').bindData(res.formats, 'fid', 'info');
            });

            return v;
        }
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
                [v.storehouse.name,'grey'],
                [v.goods.no,'blue'],
                [v.goods.name,'grey'],
                [v.goods.barcode,'blue'],
                [v.goods.category,'grey'],
                [v.goods.brand,'grey'],
                [v.color.name,'grey'],
                [v.format.info,'grey'],
                [v.goods.measurementUnit,'grey'],
                [v.goods.type == 0 ? "商品" : "套餐",'red'],
                [v.goods.pieceNum,'blue'],
                [v.num,'blue']
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

            var $btnCheck = $('<li></li>').append($('<a></a>').html('盘点'));
            var $btnSplit = $('<li></li>').append($('<a></a>').html('拆分'));
            var $btnMerge = $('<li></li>').append($('<a></a>').html('合并'));

            $btnUl.append($btnCheck);

            if (v.goods.type == 1) {
                $btnUl.append($btnSplit).append($btnMerge);
            }

            $btnGroup.append($btn).append($btnUl).appendTo($cellOption);

            $cellOption.appendTo($optionWrap);

            $liLine.append($indexWrap).append($contentWrap).append($optionWrap);

            $btnCheck.click(function () {

                clearForm('formStore');

                var num = com.focusPage('#layerAddStrore').find('input[name="num"]').val(v.num);

                com.focusPage('#layerAddStrore').attr({
                    'data-gid': v.goods.gid,
                    'data-shid': v.storehouse.shid,
                    'data-cid': v.color.cid,
                    'data-fid': v.format.fid
                });

                openlayer(function () {
                    var gid = com.focusPage('#layerAddStrore').attr('data-gid');
                    var shid = com.focusPage('#layerAddStrore').attr('data-shid');
                    var cid = com.focusPage('#layerAddStrore').attr('data-cid');
                    var fid = com.focusPage('#layerAddStrore').attr('data-fid');
                    if(com.validate('formStore'))
                        return;

                    saveData(gid, shid, cid, fid, function () {
                        com.clearValidator("#newNum", true);
                        com.clearValidator();
                        layer.closeAll();
                    });

                });
            });

            //拆分按钮点击事件
            $btnSplit.click(function () {
                openlayerPackage(v, $btnSplit.text(), "views/manifest/goods2ms.html")
            });

            //合并按钮点击事件
            $btnMerge.click(function () {
                openlayerPackage(v, $btnMerge.text(), "views/manifest/goods2ms.html")
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

    goodsStorehouseSeacher.init(["storehouseName", "goodName", "goodsBarcode"], "condList", api.inventory.pageGoodsStorehouseStock, function (data) {
            displayFunc.init('resultList', data);
        }, "pagenation", "goodsStorehouseStockPostData", null, false, null, function () {

            var $impa = $('<a></a>').addClass('btn btn-minier btn-success pull-left').attr('name', 'import').css('margin-top','-2px');
            var $impi = $('<i></i>').addClass('icon-download-alt bigger-110').appendTo($impa);
            var $impspan = $('<span></span>').text('导出').appendTo($impa);

            var $adda = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('name', 'addQuotationVersion').css({'margin-top':'-2px','margin-left':'4px'});
            var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
            var $addspan = $('<span></span>').text('添加').appendTo($adda);
            //导出点击事件
            $impa.click(function () {
                pageGoodsStorehouseStockImport();
            });

            $adda.click(function () {

                clearForm('formStore2');
                openlayerAdd(function () {
                    if(com.validate('formStore2'))
                        return;

                    addData(function () {
                        com.clearValidator("#name", true);
                        com.clearValidator("#color", true);
                        com.clearValidator("#format", true);
                        com.clearValidator("#storehouse", true);
                        com.clearValidator();
                        layer.closeAll();
                        layer.msg('添加成功');
                    })

                })
            });
            return [$impa, $adda];

        }
    );

    function clearForm(formId){
        var $form = com.focusPage("#"+formId);
        var error = com.focusPage('.alert-error', $form);
        var success = com.focusPage('.alert-success', $form);
        com.focusPage('.control-group').removeClass("success").removeClass("error");
        com.focusPage(".ok").remove();
        com.focusPage(".help-inline").remove();
        success.hide();
        error.hide();
        com.focusPage("span.checked",$form).removeClass("checked");
        com.focusPage("tr.edit-on").removeClass("edit-on");
        $form.removeClass("edit-item");
        com.focusPage(".extra-wrap .control-group:not(.hide)").remove();//去掉辅助项
        com.focusPage('input[type="hidden"]',$form).val('');
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

    //盘点弹窗
    function openlayer(callback) {
        layer.closeAll();
        layer.open({
            type: 1,
            //skin: 'layui-layer-lan',
            title: "盘点",
            content: com.focusPage('#layerAddStrore'),
            area: ( $(window).width() * 0.6 < 620 ? $(window).height() * 0.6 : 620 ) + "px",
            maxmin: false,
            zIndex: 9000,
            btn: ['确定', '取消'],
            yes: function (index, layero) {
                callback(index, layero);
            },
            btn2: function (index, layero) {
                //按钮【按钮二】的回调
                goodsStorehouseSeacher.doSearch();
            },
            cancel: function () {
                //右上角关闭回调
                goodsStorehouseSeacher.doSearch();
            }
        });
    }

    //添加弹窗
    function openlayerAdd(callback) {
        layer.closeAll();
        layer.open({
            type: 1,
            //skin: 'layui-layer-lan',
            title: "添加",
            content: com.focusPage('#layerAddGoodsStorehouseStock'),
            area: ( $(window).width() * 0.6 < 620 ? $(window).height() * 0.6 : 620 ) + "px",
            maxmin: false,
            zIndex: 9000,
            btn: ['确定', '取消'],
            yes: function (index, layero) {
                callback(index, layero);
            },
            btn2: function (index, layero) {
                //按钮【按钮二】的回调
                emptyAdd();
                goodsStorehouseSeacher.doSearch();
            },
            cancel: function () {
                //右上角关闭回调
                emptyAdd();
                goodsStorehouseSeacher.doSearch();
            }
        })
    }
    function emptyAdd(){
        com.focusPage('#layerAddGoodsStorehouseStock').find('select[name="color"]').empty();
        com.focusPage('#layerAddGoodsStorehouseStock').find('select[name="format"]').empty();
    }
    //拆分,合并弹窗
    function openlayerPackage(v, title, url) {

        var $PopUp = com.focusPage('#splitAndMergePopUp');
        params['goodsStorehouseStock'] = v;
        $PopUp.attr({'data-title': title});
        //弹出即全屏
        var index = layer.open({
            type: 1,
            skin: title == "拆分" ? 'layui-layer-molv' : 'layui-layer-lan',
            title: title,
            content: $PopUp,
            area: ["1200px", ( $(window).height() * 0.84 < 800 ? $(window).height() * 0.84 : 800 ) + "px"],
            maxmin: false,
            zIndex: 9000,
            success: function (layer, index) {
                $PopUp.load(url);
            },
            end: function () {
                params['goodsStorehouseStock'] = null;
                $PopUp.attr({'data-title': null});
                $PopUp.empty();
                goodsStorehouseSeacher.doSearch();
            }
        });
    }

    function saveData(gid, shid, cid, fid, callback) {
        var $layer = com.focusPage('#layerAddStrore');
        var num = $layer.find('input[name="num"]').val();
        var newNum = $layer.find('input[name="newNum"]').val();
        com.post(api.inventory.checkGoodsStorehouseStock, {
            "checkList.goods.gid": gid,
            "checkList.storehouse.shid": shid,
            "checkList.color.cid": cid,
            "checkList.format.fid": fid,
            "checkList.type": parseFloat(num) > parseFloat(newNum) ? 1 : 0,
            "checkList.num": Math.abs(parseFloat(num) - parseFloat(newNum))
        }, function (res) {
            callback();
            goodsStorehouseSeacher.doSearch();
        });

    }

    function addData(callback) {
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
        }, function (res) {
            callback();
            emptyAdd();
            goodsStorehouseSeacher.doSearch();
        })
    }

});
