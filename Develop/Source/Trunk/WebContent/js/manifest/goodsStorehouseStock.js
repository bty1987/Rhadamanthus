/**
 * Created by Administrator on 2016/9/20.
 */
$(function () {
    /**
     * 回调函数必须提供 init(tableId, result.list)方法
     * tableId ，用来显示的div的id
     * result.list 列表的json数组
     * */

    $('#layerAddGoodsStorehouseStock').find('input[name="name"]').typeahead({
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
        isResultTypeMap: true
        , flupdater: function (k, v) {
            //k: key, v:value
            $('#layerAddGoodsStorehouseStock').find('input[name="name"]').attr('data-gid', k);
            com.post(api.inventory.queryColorForEnableByGid, {
                "color.gid": k
            }, function (res) {
                $('#layerAddGoodsStorehouseStock').find('select[name="color"]').bindData(res.colors, 'cid', 'name');
            });
            com.post(api.inventory.queryFormatForEnableByGid, {
                "format.gid": k
            }, function (res) {
                $('#layerAddGoodsStorehouseStock').find('select[name="format"]').bindData(res.formats, 'fid', 'info');
            });

            return v;
        }

    })

    com.post(api.inventory.queryStorehouseForSelf, {}, function (res) {
        var storehousesStatus = [];

        $.each(res.storehouses, function (i, v) {
            if (v.status == 0) {
                storehousesStatus.push(v);
            }
        })
        $('#layerAddGoodsStorehouseStock').find('select[name="storehouse"]').bindData(storehousesStatus, 'shId', 'name');
    }, null, false);

    var displayFunc = (function () {
        /*表格样式*/

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

        /*表格头*/
        var createTableTitle = function () {
            var $ulTitle = $('<ul></ul>').addClass('flex-table');
            var $liTitle = $('<li></li>').addClass('line table-title');
            var $indexWrap = $('<div></div>').addClass('line-wrap order').html($('<div></div>'));
            var $contentWrap = $('<div></div>').addClass('line-wrap  content col12');
            var titleName = '仓库名称,商品编号,商品名称,条形码,品类,品牌,颜色,规格,单位,套餐,件数,数量';
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

        /*表格体*/
        var creatLine = function (i, v, lastFlag) {
            var $liLine = $('<li></li>').addClass('line');
            var $indexWrap = $('<div></div>').addClass('line-wrap order').html($('<div></div>').addClass('cell index').html(i + 1));
            var $contentWrap = $('<div></div>').addClass('line-wrap  content col12');
            var propertyArr = [
                //v.storehouse.code,
                v.storehouse.name,
                v.goods.no,
                v.goods.name,
                v.goods.barcode,
                v.goods.category,
                v.goods.brand,
                v.color.name,
                v.format.info,
                v.goods.measurementUnit,
                v.goods.type == 0 ? "商品" : "套餐",
                v.goods.pieceNum,
                v.num
            ];
            $.each(propertyArr, function (i, v) {
                var $cell = $('<div></div>').addClass('cell').html(v);
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

            $btnGroup
                .append($btn)
                .append($btnUl)
                .appendTo($cellOption);

            $cellOption.appendTo($optionWrap);

            $liLine.append($indexWrap)
                .append($contentWrap)
                .append($optionWrap);

            $btnCheck.click(function () {

                clearForm('form1');

                var num = $('#layerAdd').find('input[name="num"]').val(v.num);

                $('#layerAdd').attr({
                    'data-gid': v.goods.gid,
                    'data-shId': v.storehouse.shId,
                    'data-cid': v.color.cid,
                    'data-fid': v.format.fid
                });

                openlayer(function () {
                    var gid = $('#layerAdd').attr('data-gid');
                    var shId = $('#layerAdd').attr('data-shId');
                    var cid = $('#layerAdd').attr('data-cid');
                    var fid = $('#layerAdd').attr('data-fid');
                    if(com.validate('form1'))
                        return;

                    saveData(gid, shId, cid, fid, function () {
                        com.clearValidator("#newNum", true);
                        com.clearValidator();
                        layer.closeAll();
                    });

                });
            });

            //拆分按钮点击事件
            $btnSplit.click(function () {
                openlayerPackage(v, $btnSplit.text(), "views/manifest/splitAndMerge.html")
            })

            //合并按钮点击事件
            $btnMerge.click(function () {
                openlayerPackage(v, $btnMerge.text(), "views/manifest/splitAndMerge.html")
            })

            return $liLine;
        };

        return {
            init: function (tableId, listData) {
                $('#' + tableId).html(null);
                renderList(tableId, listData);
            },
            drawLine: function (i, v) {
                return creatLine(i, v);
            }
        };
    })();

    /*分页*/

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

                clearForm('form2');
                openlayerAdd(function () {
                    if(com.validate('form2'))
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
            })
            return [$impa, $adda];

        }
    );

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

    //导出
    function pageGoodsStorehouseStockImport() {

        if ($('span[name="totalRecords"]').text() == 0) {
            com.showAlert(com.warning, "请通过条件进行查询");
            return false;
        }

        if ($('span[name="totalRecords"]').text() > 1000) {
            com.showAlert(com.warning, "查询结果大于阀值 , 不能完成导出动作");
            return false;
        }

        com.post(api.inventory.pageGoodsStorehouseStock, $.extend({}, params.GoodsStorehouseStockPostData, {"paging.noPage": 1}), function (res) {
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
                    ['数量', 'num'],
                ],
                list: res.paging.data,
            });

        });
    };

    //盘点弹窗
    function openlayer(callback) {
        layer.closeAll();
        layer.open({
            type: 1,
            //skin: 'layui-layer-lan',
            title: "盘点",
            content: $('#layerAdd'),
            area: ( $(window).width() * 0.6 < 620 ? $(window).height() * 0.6 : 620 ) + "px",
            maxmin: true,
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
            content: $('#layerAddGoodsStorehouseStock'),
            area: ( $(window).width() * 0.6 < 620 ? $(window).height() * 0.6 : 620 ) + "px",
            maxmin: true,
            zIndex: 9000,
            btn: ['确定', '取消'],
            yes: function (index, layero) {
                callback(index, layero);
            },
            btn2: function (index, layero) {
                //按钮【按钮二】的回调
                emptyAdd()
                goodsStorehouseSeacher.doSearch();
            },
            cancel: function () {
                //右上角关闭回调
                emptyAdd()
                goodsStorehouseSeacher.doSearch();
            }
        })
    }
    function emptyAdd(){
        $('#layerAddGoodsStorehouseStock').find('select[name="color"]').empty();
        $('#layerAddGoodsStorehouseStock').find('select[name="format"]').empty();
    }
    //拆分,合并弹窗
    function openlayerPackage(v, title, url) {

        var $PopUp = $('#splitAndMergePopUp');
        params['goodsStorehouseStock'] = v;
        $PopUp.attr({'data-title': title});
        //弹出即全屏
        var index = layer.open({
            type: 1,
            skin: title == "拆分" ? 'layui-layer-molv' : 'layui-layer-lan',
            title: title,
            content: $PopUp,
            area: ["1200px", ( $(window).height() * 0.84 < 800 ? $(window).height() * 0.84 : 800 ) + "px"],
            maxmin: true,
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

    /*登录表单校验*/
    var submitValidate = function () {
        $("#form1 .alert-error").hide();

        var validator = com.validate("#form1", {
            //一些校验规则
            messages: {
                uewNum: {
                    isAllDigit: "请输入数字."
                }
            },
            success: function (label) {
                label.closest('.control-group').removeClass('error');
                label.remove();
            },
            errorPlacement: function (error, element) {
                error.addClass('help-small no-left-padding').insertAfter(element);
            }
        });
        return validator;
    };
    //添加表单校验
    var submitValidataGoodsStorehouseStock = function () {
        $("#form2 .alert-error").hide();

        var validator = com.validate("#form2", {
            //一些校验规则
            messages: {
                name: {
                    required: "请输入数字."
                },
                color: {
                    required: "请选择颜色."
                },
                format: {
                    required: "请选择规格."
                },
                storehouse: {
                    required: "请选择仓库."
                }
            },
            success: function (label) {
                label.closest('.control-group').removeClass('error');
                label.remove();
            },
            errorPlacement: function (error, element) {
                error.addClass('help-small no-left-padding').insertAfter(element);
            }
        });
        return validator;
    }

    function saveData(gid, shId, cid, fid, callback) {
        var $layer = $('#layerAdd');
        var num = $layer.find('input[name="num"]').val();
        var newNum = $layer.find('input[name="newNum"]').val();
        com.post(api.inventory.checkGoodsStorehouseStock, {
            "checkList.goods.gid": gid,
            "checkList.storehouse.shId": shId,
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
        var $layer = $('#layerAddGoodsStorehouseStock');
        var gid = $layer.find('input[name="name"]').attr('data-gid');
        var cid = $layer.find('select[name="color"] option:selected').val();
        var fid = $layer.find('select[name="format"] option:selected').val();
        var shId = $layer.find('select[name="storehouse"] option:selected').val();

        com.post(api.inventory.makeGoodsStorehouseStock, {
            "goodsStorehouseStock.goods.gid": gid,
            "goodsStorehouseStock.color.cid": cid,
            "goodsStorehouseStock.format.fid": fid,
            "goodsStorehouseStock.storehouse.shId": shId
        }, function (res) {
            callback();
            emptyAdd()
            goodsStorehouseSeacher.doSearch();
        })
    }

});
