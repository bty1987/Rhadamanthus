$(function () {
    /**
     * 回调函数必须提供 init(tableId, result.list)方法
     * tableId ，用来显示的div的id
     * result.list 列表的json数组
     * */

    var validator = {
        goods: {
            type: "v_goods",
            regex: /^[0-9]*[1-9][0-9]*$/,
            errorMsg: "数量输入内容格式错误"
        }
    };

    $.extend(com.validator,validator);

    var displayFunc = (function () {

        var renderList = function (tableId, listData) {
            var $tableWrap = $('#' + tableId);

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

        //绘制表格头
        var createTableTitle = function () {

            var $ulTitle = $('<ul></ul>').addClass('flex-table');
            var $liTitle = $('<li></li>').addClass('line table-title');

            var $indexWrap = $('<div></div>').addClass('line-wrap order').html($('<div></div>'));
            var $contentWrap = $('<div></div>').addClass('line-wrap  content col10');

            var titleName = '编号,商品,条形码,品类,品牌,单位,件数,辅类,类型,状态';

            $.each(titleName.split(','), function (i, v) {
                var $cell = $('<div></div>').addClass('cell').html(v);
                $cell.appendTo($contentWrap);
            });

            var $optionWrap = $('<div></div>').addClass('line-wrap action').html($('<div>操作</div>').addClass('cell option'));

            $liTitle.append($indexWrap)
                .append($contentWrap)
                .append($optionWrap)
                .appendTo($ulTitle);

            return $ulTitle;
        };
        //绘制表格体
        var creatLine = function (i, v, lastFlag) {

            var $liLine = $('<li></li>').addClass('line');

            var $indexWrap = $('<div></div>').addClass('line-wrap order').html($('<div></div>').addClass('cell index').html(i + 1));
            var $contentWrap = $('<div></div>').addClass('line-wrap  content col10');
            //显示字段
            var propertyArr = [
                //v.gid,
                [v.no,'blue'],
                [v.name,'grey'],
                [v.barcode,'blue'],
                [v.category,'grey'],
                [v.brand,'grey'],
                [v.measurementUnit,'grey'],
                [v.pieceNum,'blue'],
                [v.accessoriesType.name,'grey'],
                [v.type == "0" ? "商品" : "套餐",'red'],
                [v.status == "0" ? "启用" : "禁用",'red']
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

            //操作按钮下面的选项
            var $btnColor = $('<li></li>').append($('<a></a>').html('颜色'));
            var $btnFormat = $('<li></li>').append($('<a></a>').html('规格'));
            var $btnPrice = $('<li></li>').append($('<a></a>').html('价格'));
            //var $btnSuit = $('<li></li>').append($('<a></a>').html('查看'));
            var $btnStart = $('<li></li>').append($('<a></a>').html('启用'));
            var $btnStop = $('<li></li>').append($('<a></a>').html('禁用'));

            //添加操作按钮下面的选项
            $btnUl
                .append($btnColor)
                .append($btnFormat)
                .append($btnPrice)
                //.append($btnSuit)
                .append($btnStart)
                .append($btnStop);

            $btnGroup
                .append($btn)
                .append($btnUl)
                .appendTo($cellOption);

            $cellOption.appendTo($optionWrap);

            $liLine.append($indexWrap)
                .append($contentWrap)
                .append($optionWrap);

            //颜色点击事件
            $btnColor.click(function () {
                openLayerSwitch('goodsColorPopUp', v.gid, '颜色', 'views/manifest/color.html');
            });
            //规格点击事件
            $btnFormat.click(function () {
                openLayerSwitch('goodsFormatPopUp', v.gid, '规格', 'views/manifest/format.html');
            });
            //价格点击事件
            $btnPrice.click(function () {
                openLayerSwitch('goodsPricePopUp', v.gid, '价格', 'views/manifest/price.html');
            });
            //套装点击事件
            /* $btnSuit.click(function () {
             openLayerSwitch('goodsSuitPopUp', v.gid, '套餐', 'views/data/goodsSuit.html');
             });*/
            //状态启用事件
            $btnStart.click(function () {
                layer.confirm('是否启用？', {
                    btn: ['确定', '取消'] //按钮
                }, function (index, layero) {
                    $('#layerAdd').attr('data-gid', v.gid);
                    $('#layerAdd').attr('data-status', v.status);
                    var id = $('#layerAdd').attr('data-gid');
                    var status = $('#layerAdd').attr('data-status');
                    startGoodsStatus(id, status, function () {
                        layer.closeAll();
                        layer.msg('启用成功', {icon: 1, time: 2e3});
                        $('#layerAdd').attr({'data-gid': null, 'data-status': null});
                    });
                }, function () {

                });
            });
            //状态禁用事件
            $btnStop.click(function () {
                layer.confirm('是否禁用？', {
                    btn: ['确定', '取消'] //按钮
                }, function (index, layero) {
                    $('#layerAdd').attr('data-gid', v.gid);
                    $('#layerAdd').attr('data-status', v.status);
                    var id = $('#layerAdd').attr('data-gid');
                    var status = $('#layerAdd').attr('data-status');
                    stopGoodsStatus(id, status, function () {
                        layer.closeAll();
                        layer.msg('禁用成功', {icon: 1, time: 2e3});
                        $('#layerAdd').attr({'data-gid': null, 'data-status': null});
                    });
                }, function () {

                });
            });

            return $liLine;

        };

        return {
            init: function (tableId, listData) {
                $('#' + tableId).html(null);
                renderList(tableId, listData);

            },
            drawLine: function (v) {
                return creatLine(v);
            }
        };
    })();


    var goodsSeacher = new Searcher();

    var types = [{gid:0,goods : "商品"},{gid:1,goods : "套餐"}];

    $('select[name="type"]').bindData(types, "gid", "goods");

    com.post(api.data.queryCategory, {}, function (res) {
        $('select[name="category"]').bindData(res.categorys, "categoryName", "categoryName");

    });

    com.post(api.common.queryMeasurementUnit, {}, function (res) {
        $('select[name="measurementUnit"]').bindData(res.measurementUnits, "name", "name");
    });

    com.post(api.inventory.queryAccessoriesType, {}, function (res) {
        var accessoriesTypesStatus = [];
        $.each(res.accessoriesTypes,function(i,v){
            if(v.status==0){
                accessoriesTypesStatus.push(v);
            }
        });
        $('select[name="atid"]').bindData(accessoriesTypesStatus, 'atid', 'name', true);
    });

    $('input[name="category"]').val("");
    com.initChosen('brand', api.data.queryBrandForPinYinName, "pinyinName", {}, "brands", "bid", "brandName").on('change', function(e){
        if($(this).val() == "" || $("#brand").val() == "") {
            com.clearValidator("#brand", true);
            $('input[name="category"]').val("");
            return;
        }else{
            var bid = $('#brand').val();
            com.post(api.data.queryBrandByBrandId, {"brand.bid": bid}, function (res) {
                var categoryName = res.brand.categoryName;
                $('input[name="category"]').val(categoryName);
            });
        }
    });

    goodsSeacher.init(['goodsNo', 'goodsName', 'goodsBarcode','goodsBrand'], "condList", api.inventory.pageGoods, function (data) {
        displayFunc.init('resultList', data);
    }, "pagenation", "goodsPostData", null, false, null, function () {

        var $adda = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('name', 'addQuotationVersion').css({'margin-top':'-2px','margin-left':'4px'});
        var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
        var $addspan = $('<span></span>').text('添加').appendTo($adda);

        var $addaExportGoods = $('<a></a>').addClass('btn btn-minier btn-success pull-left').attr('name', 'importGoods').css('margin-top','-2px');
        var $addaExporti = $('<i></i>').addClass('icon-download-alt bigger-110').appendTo($addaExportGoods);
        var $addaExportspan = $('<span></span>').text('商品导出').appendTo($addaExportGoods);

        $adda.click(function () {
            clearForm('form1');
            openlayer(function (index, layero) {
                if(com.validate('form1'))
                    return;

                saveData(null, function () {
                    com.clearValidator("#no", true);
                    com.clearValidator("#type", true);
                    com.clearValidator("#name", true);
                    com.clearValidator("#barcode", true);
                    com.clearValidator("#category", true);
                    com.clearValidator("#brand", true);
                    com.clearValidator("#measurementUnit", true);
                    com.clearValidator("#pieceNum", true);
                    com.clearValidator("#atid", true);
                    com.clearValidator();
                    layer.closeAll();
                });


            });
        });

        $addaExportGoods.click(function(){
            pageGoodsExport();
        });


        return [$addaExportGoods,$adda];

    }, 'resultList');

    function clearForm(formId){
        var $form = $("#"+formId);
        var error = $('.alert-error', $form);
        var success = $('.alert-success', $form);
        $('.control-group').removeClass("success").removeClass("error");
        $(".ok").remove();
        $(".help-inline").remove();
        success.hide();
        error.hide();
        $("span.checked",$form).removeClass("checked");
        $("tr.edit-on").removeClass("edit-on");
        $form.removeClass("edit-item");
        $(".extra-wrap .control-group:not(.hide)").remove();//去掉辅助项
        $('input[type="hidden"]',$form).val('');
        document.getElementById(formId).reset();
    }

    function openlayer(callback) {
        layer.closeAll();
        layer.open({
            type: 1,
            //skin: 'layui-layer-lan',
            title: "添加",
            content: $('#layerAdd'),
            area: ( $(window).width() * 0.6 < 620 ? $(window).height() * 0.6 : 620 ) + "px",
            maxmin: false,
            zIndex: 9000,
            btn: ['确定', '取消'],
            yes: function (index, layero) {
                callback(index, layero);
                closeEditReadOnly();
            },
            btn2: function (index, layero) {
                //按钮【按钮二】的回调
                closeEditReadOnly();
                com.clearValidator();
            },
            cancel: function () {
                //右上角关闭回调
                closeEditReadOnly();
            }
        });
    }

    function openLayerSwitch(id, gid, title, url) {
        var $PopUp = $('#' + id);
        $PopUp.attr({'data-gid': gid});
        //弹出即全屏
        var index = layer.open({
            type: 1,
            skin: 'layui-layer-lan',
            title: title,
            content: $PopUp,
            area: ["1200px", ( $(window).height() * 0.84 < 800 ? $(window).height() * 0.84 : 800 ) + "px"],
            maxmin: false,
            zIndex: 9000,
            success: function (layer, index) {
                $PopUp.load(url);
            },
            end: function () {
                $PopUp.attr({'data-gid': null});
                $PopUp.empty();
                goodsSeacher.doSearch();
            }
        });
    }

    function pageGoodsExport(){

        if ($('span[name="totalRecords"]').text() == 0) {
            com.showAlert(com.warning, "请通过条件进行查询");
            return false;
        }

        if ($('span[name="totalRecords"]').text() > 1000) {
            com.showAlert(com.warning, "查询结果大于阀值 , 不能完成导出动作");
            return false;
        }

        com.post(api.inventory.pageGoods, $.extend({}, params.goodsPostData, {"paging.noPage": 1}), function (res) {

            $.exceler({
                column: [
                    ['商品ID', 'gid'],
                    ['商品编码','no'],
                    ['商品名称', 'name'],
                    ['条形码', 'barcode'],
                    ['品类', 'category'],
                    ['品牌ID', 'bid'],
                    ['品牌', 'brand'],
                    ['单位', 'measurementUnit'],
                    ['件数', 'pieceNum'],
                    ['类型','type']
                ],
                list: res.paging.data,
            });

        });
    }

    //状态启用
    function startGoodsStatus(id, status, callback) {
        if (status == "1") {
            com.post(api.inventory.updateGoodsForStatus, {
                "goods.gid": id,
                "goods.status": "0"
            }, function (res) {
                callback();
                goodsSeacher.doSearch();
            });
        } else {
            layer.alert('已经启用', {
                icon: 0,
                skin: 'layer-ext-moon' //该皮肤由layer.seaning.com友情扩展。关于皮肤的扩展规则，去这里查阅
            });
        }
    }

    //状态禁用
    function stopGoodsStatus(id, status, callback) {
        if (status == "0") {
            com.post(api.inventory.updateGoodsForStatus, {
                "goods.gid": id,
                "goods.status": "1"
            }, function (res) {
                callback();
                goodsSeacher.doSearch();
            });
        } else {
            layer.alert('已经禁用', {
                icon: 0,
                skin: 'layer-ext-moon' //该皮肤由layer.seaning.com友情扩展。关于皮肤的扩展规则，去这里查阅
            });
        }
    }

    function saveData(id, callback) {
        var $layer = $('#layerAdd');
        var no = $layer.find('input[name="no"]').val();
        var goodsType = $layer.find('select[name="type"] option:selected').val();
        var name = $layer.find('input[name="name"]').val();
        var barcode = $layer.find('input[name="barcode"]').val();
        var category = $layer.find('input[name="category"]').val();
        var bid = $('#brand').val();
        var measurementUnit = $layer.find('select[name="measurementUnit"] option:selected').text();
        var pieceNum = $layer.find('input[name="pieceNum"]').val();
        var atid = $layer.find('select[name="atid"] option:selected').val();
        if (!id) {
            //if (checkRowValue($layer)) {
            if(goodsType == 0){
                com.post(api.inventory.addGoods, {
                    "goods.no": no,
                    "goods.name": name,
                    "goods.barcode": barcode,
                    "goods.category": category,
                    "goods.bid": bid,
                    "goods.measurementUnit": measurementUnit,
                    "goods.pieceNum": pieceNum,
                    "goods.accessoriesType.atid": atid == null || atid == "" ? "" : atid
                }, function (res) {
                    layer.closeAll()
                    goodsSeacher.doSearch();
                });
            }else{
                layer.closeAll();
                params["goods"] = {};
                params.goods["goods.no"] = no;
                params.goods["goods.name"] = name;
                params.goods["goods.barcode"] = barcode;
                params.goods["goods.category"] = category;
                params.goods["goods.bid"] = bid;
                params.goods["goods.measurementUnit"] = measurementUnit;
                params.goods["goods.pieceNum"] = pieceNum;
                params.goods["goods.accessoriesType.atid"] = atid == null || atid == "" ? "" : atid;
                openLayerSwitch('goodsSuitPopUp', null, '套餐', 'views/manifest/goodsSuit.html');
            }


            //}
        } else {
            com.post(api.inventory.updateGoods, {
                "goods.gid": id,
                "goods.accessoriesType.atid": atid == null || atid == "" ? "" : atid
            }, function (res) {
                layer.closeAll()
                goodsSeacher.doSearch();
            });

        }

    }

    function editReadOnly() {
        var $layerAdd = $('#layerAdd');
        $layerAdd.find('input[name="no"]').attr('disabled', 'disabled');
        $layerAdd.find('select[name="type"]').attr('disabled','disabled');
        $layerAdd.find('input[name="name"]').attr('disabled', 'disabled');
        $layerAdd.find('input[name="barcode"]').attr('disabled', 'disabled');
        $layerAdd.find('select[name="category"]').attr('disabled', 'disabled');
        $layerAdd.find('input[name="brand"]').attr('disabled', 'disabled');
        $layerAdd.find('select[name="measurementUnit"]').attr('disabled', 'disabled');
        $layerAdd.find('input[name="pieceNum"]').attr('disabled', 'disabled');

    }

    function closeEditReadOnly() {
        var $layerAdd = $('#layerAdd');
        $layerAdd.find('input[name="no"]').removeAttr('disabled');
        $layerAdd.find('select[name="type"]').removeAttr('disabled');
        $layerAdd.find('input[name="name"]').removeAttr('disabled');
        $layerAdd.find('input[name="barcode"]').removeAttr('disabled');
        $layerAdd.find('input[name="category"]').removeAttr('disabled');
        com.updateChosen('brand',"","");
        $layerAdd.find('select[name="measurementUnit"]').removeAttr('disabled');
        $layerAdd.find('input[name="pieceNum"]').removeAttr('disabled');
    }




});
