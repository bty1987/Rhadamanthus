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
    var itmes = {};
    itmes.executeTimes = com.focusPage("#executeTimes");
    itmes.executeDates = com.focusPage("#executeDates");
    itmes.filePath = com.focusPage("#filePath");

    var taskContents = {};

    $.extend(com.validator, validator);

    com.focusPage(".date-picker").datepicker({autoclose: !0}).on("show", function () {
        setTimeout(function () {
            com.focusPage(".dropdown-menu").css("z-index", 9999)
        }, 0)
    }).next().on(ace.click_event, function () {
        a(this).prev().focus()
    });

    com.focusPage('#executeTimes').timepicker({
        minuteStep: 1,
        showSeconds: false,
        showMeridian: false
    });

    com.focusPage("#attachment").Huploadify({
        auto: !0,
        successTimeout: 99999,
        formData: {
            username: "用户名",
            rnd: "加密密文",
            uploadType: 3
        },
        buttonText: "上传附件",
        buttonClass: "btn btn-sm btn-primary lineheight0",
        overrideEvents: ["onDialogClose"],
        fileObjName: "strutsUploads",
        uploader: config.media + api.common.uploadOther.url,
        width: "78",
        onSelectError: function (a, b, c) {
            switch (b) {
                case -100:
                    alert("上传的文件数量已经超出系统限制的" + com.focusPage("#file_upload").uploadify("settings", "queueSizeLimit") + "个文件!");
                    break;
                case -110:
                    alert("文件 [" + a.name + "] 大小超出系统限制的" + com.focusPage("#file_upload").uploadify("settings", "fileSizeLimit") + "大小!");
                    break;
                case -120:
                    alert("文件 [" + a.name + "] 大小异常！");
                    break;
                case -130:
                    alert("文件 [" + a.name + "] 类型不正确！")
            }
        },
        onUploadSuccess: function (a, b, c) {
            a = eval("(" + b + ")");
            0 == a.errorCode ? com.focusPage("#filePath").val(a.resUrl) : alert(b)
        },
        itemTemplate: '<div id="${fileID}" class="uploadify-queue-item" style="position:absolute;top:-30px;width:200px;left:-200px;">\r\n\t\t\t<div class="cancel">\r\n\t\t\t\t<a href="javascript:$(\'#${instanceID}\').uploadify(\'cancel\', \'${fileID}\')">X</a>\r\n\t\t\t</div>\r\n\t\t\t<span class="fileName">${fileName} (${fileSize})</span><span class="data"></span>\r\n\t\t\t<div class="uploadify-progress">\r\n\t\t\t\t<div class="uploadify-progress-bar"><!--Progress Bar--></div>\r\n\t\t\t</div>\r\n\t\t</div>'
    });

    var displayFunc = (function () {

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

        //绘制表格头
        var createTableTitle = function () {

            var $ulTitle = $('<ul></ul>').addClass('flex-table');
            var $liTitle = $('<li></li>').addClass('line table-title');

            var $indexWrap = $('<div></div>').addClass('line-wrap order').html($('<div></div>'));
            var $contentWrap = $('<div></div>').addClass('line-wrap  content col12');

            var titleName = '编号,商品,条形码,品类,品牌,单位,进价,售价,件数,辅类,类型,状态';

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
            var $contentWrap = $('<div></div>').addClass('line-wrap  content col12');
            //显示字段
            var propertyArr = [
                //v.gid,
                [v.no, 'blue'],
                [v.name, 'grey'],
                [v.barcode, 'blue'],
                [v.category, 'grey'],
                [v.brand, 'grey'],
                [v.measurementUnit, 'grey'],
                [v.purchase, 'blue'],
                [v.selling, 'blue'],
                [v.pieceNum, 'blue'],
                [v.accessoriesType.name, 'grey'],
                [v.type == "0" ? "商品" : "套餐", 'red'],
                [v.status == "0" ? "启用" : "禁用", 'red']
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
            var $btnEdit = $('<li></li>').append($('<a></a>').html('编辑'));
            var $btnColor = $('<li></li>').append($('<a></a>').html('颜色'));
            var $btnFormat = $('<li></li>').append($('<a></a>').html('规格'));
            var $btnPrice = $('<li></li>').append($('<a></a>').html('价格'));
            var $btnSupplier = $('<li></li>').append($('<a></a>').html('供应商'));
            //var $btnSuit = $('<li></li>').append($('<a></a>').html('查看'));
            var $btnStart = $('<li></li>').append($('<a></a>').html('启用'));
            var $btnStop = $('<li></li>').append($('<a></a>').html('禁用'));

            //添加操作按钮下面的选项
            $btnUl
                .append($btnEdit)
                .append($btnColor)
                .append($btnFormat)
                .append($btnPrice)
                .append($btnSupplier)
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
            //编辑点击事件
            $btnEdit.click(function () {

                editReadOnly();
                var no = com.focusPage('#layerAddAdvance').find('input[name="no"]').val(v.no);
                var type = com.focusPage('#layerAddAdvance').find('select[name="type"]').val(v.type);
                var name = com.focusPage('#layerAddAdvance').find('input[name="name"]').val(v.name);
                var barcode = com.focusPage('#layerAddAdvance').find('input[name="barcode"]').val(v.barcode);
                var category = com.focusPage('#layerAddAdvance').find('input[name="category"]').val(v.category);
                com.updateChosen('brand', v.bid, v.brand);
                var measurementUnit = com.focusPage('#layerAddAdvance').find('select[name="measurementUnit"]').val(v.measurementUnit);
                var purchase = com.focusPage("#layerAddAdvance").find('input[name="purchase"]').val(v.purchase);
                var selling = com.focusPage("#layerAddAdvance").find('input[name="selling"]').val(v.selling);
                var pieceNum = com.focusPage('#layerAddAdvance').find('input[name="pieceNum"]').val(v.pieceNum);
                var atid = com.focusPage('#layerAddAdvance').find('select[name="atid"]').val(v.accessoriesType.atid);

                com.focusPage('#layerAddAdvance').attr('data-gid', v.gid);
                openlayer(function () {
                    var id = com.focusPage('#layerAddAdvance').attr('data-gid');
                    if (com.validate('formAdvance'))
                        return;
                    saveData(id, function () {
                        com.clearValidator("#no", true);
                        com.clearValidator("#type", true);
                        com.clearValidator("#name", true);
                        com.clearValidator("#barcode", true);
                        com.clearValidator("#category", true);
                        com.clearValidator("#brand", true);
                        com.clearValidator("#measurementUnit", true);
                        com.clearValidator("#purchase", true);
                        com.clearValidator("#selling", true);
                        com.clearValidator("#pieceNum", true);
                        com.clearValidator("#atid", true);
                        com.clearValidator();
                        layer.closeAll();
                    });

                });
            });
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
                openLayerSwitch('goodsPricePopUp', v.gid, '价格', 'views/manifest/priceAdvance.html');
            });

            $btnSupplier.click(function () {
                openLayerSwitch('goodsSupplierPopUp', v.gid, '供应商', 'views/manifest/supplier.html');
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
                    com.focusPage('#layerAddAdvance').attr('data-gid', v.gid);
                    com.focusPage('#layerAddAdvance').attr('data-status', v.status);
                    var id = com.focusPage('#layerAddAdvance').attr('data-gid');
                    var status = com.focusPage('#layerAddAdvance').attr('data-status');
                    startGoodsStatus(id, status, function () {
                        layer.closeAll();
                        layer.msg('启用成功', {icon: 1, time: 2e3});
                        com.focusPage('#layerAddAdvance').attr({'data-gid': null, 'data-status': null});
                    });
                }, function () {

                });
            });
            //状态禁用事件
            $btnStop.click(function () {
                layer.confirm('是否禁用？', {
                    btn: ['确定', '取消'] //按钮
                }, function (index, layero) {
                    com.focusPage('#layerAddAdvance').attr('data-gid', v.gid);
                    com.focusPage('#layerAddAdvance').attr('data-status', v.status);
                    var id = com.focusPage('#layerAddAdvance').attr('data-gid');
                    var status = com.focusPage('#layerAddAdvance').attr('data-status');
                    stopGoodsStatus(id, status, function () {
                        layer.closeAll();
                        layer.msg('禁用成功', {icon: 1, time: 2e3});
                        com.focusPage('#layerAddAdvance').attr({'data-gid': null, 'data-status': null});
                    });
                }, function () {

                });
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
        };
    })();

    var goodsSeacher = new Searcher();

    var types = [{gid: 0, goods: "商品"}, {gid: 1, goods: "套餐"}];

    com.focusPage('select[name="type"]').bindData(types, "gid", "goods");

    com.post(api.data.queryCategory, {}, function (res) {
        com.focusPage('select[name="category"]').bindData(res.categorys, "categoryName", "categoryName");

    });

    com.post(api.common.queryMeasurementUnit, {}, function (res) {
        com.focusPage('select[name="measurementUnit"]').bindData(res.measurementUnits, "name", "name");
    });

    com.post(api.inventory.queryAccessoriesType, {}, function (res) {
        var accessoriesTypesStatus = [];
        $.each(res.accessoriesTypes, function (i, v) {
            if (v.status == 0) {
                accessoriesTypesStatus.push(v);
            }
        });
        com.focusPage('select[name="atid"]').bindData(accessoriesTypesStatus, 'atid', 'name', true);
    });

    com.focusPage('input[name="category"]').val("");
    com.initChosen('brand', api.data.queryBrandForPinYinName, "pinyinName", {}, "brands", "bid", "name").on('change', function (e) {
        if ($(this).val() == "" || com.focusPage("#brand").val() == "") {
            com.clearValidator("#brand", true);
            com.focusPage('input[name="category"]').val("");
            return;
        } else {
            var bid = com.focusPage('#brand').val();
            com.post(api.data.queryBrandByBid, {"brand.bid": bid}, function (res) {
                var categoryName = res.brand.categoryName;
                com.focusPage('input[name="category"]').val(categoryName);
            });
        }
    });

    goodsSeacher.init(['goodsNo', 'goodsName', 'goodsBarcode', 'goodsBrand', 'goodsStatus'], "condList", api.inventory.pageGoodsForAdvance, function (data) {
        displayFunc.init('resultList', data);
    }, "pagenation", "goodsAdvancePostData", null, false, null, function () {

        var $adda = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('name', 'addQuotationVersion').css({
            'margin-top': '-2px',
            'margin-left': '4px'
        });
        var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
        var $addspan = $('<span></span>').text('添加').appendTo($adda);

        var $addaImportGood = $('<a></a>').addClass('btn btn-minier btn-warning pull-left').attr('name', 'importGoods').css({
            'margin-top': '-2px',
            'margin-left': '4px'
        });
        var $addaGoodi = $('<i></i>').addClass('icon-cloud-upload bigger-110').appendTo($addaImportGood);
        var $addaGoodspan = $('<span></span>').text('导入商品').appendTo($addaImportGood);

        var $addaImportColor = $('<a></a>').addClass('btn btn-minier btn-danger pull-left').attr('name', 'importGoods').css({
            'margin-top': '-2px',
            'margin-left': '4px'
        });
        var $addaColori = $('<i></i>').addClass('icon-cloud-upload bigger-110').appendTo($addaImportColor);
        var $addaColorspan = $('<span></span>').text('导入颜色').appendTo($addaImportColor);

        var $addaImportFormat = $('<a></a>').addClass('btn btn-minier btn-purple pull-left').attr('name', 'importGoods').css({
            'margin-top': '-2px',
            'margin-left': '4px'
        });
        var $addaFormati = $('<i></i>').addClass('icon-cloud-upload bigger-110').appendTo($addaImportFormat);
        var $addaFormatspan = $('<span></span>').text('导入规格').appendTo($addaImportFormat);

        var $addaImportPrice = $('<a></a>').addClass('btn btn-minier btn-pink pull-left').attr('name', 'importGoods').css({
            'margin-top': '-2px',
            'margin-left': '4px'
        });
        var $addaPricei = $('<i></i>').addClass('icon-cloud-upload bigger-110').appendTo($addaImportPrice);
        var $addaPricespan = $('<span></span>').text('导入价格').appendTo($addaImportPrice);

        var $deleteImportPrice = $('<a></a>').addClass('btn btn-minier btn-inverse pull-left').attr('name', 'importGoods').css({
            'margin-top': '-2px',
            'margin-left': '4px'
        });
        var $deletePricei = $('<i></i>').addClass('icon-cloud-upload bigger-110').appendTo($deleteImportPrice);
        var $deletePricespan = $('<span></span>').text('删除价格').appendTo($deleteImportPrice);

        var $addaExportGoods = $('<a></a>').addClass('btn btn-minier btn-success pull-left').attr('name', 'importGoods').css('margin-top', '-2px');
        var $addaExporti = $('<i></i>').addClass('icon-download-alt bigger-110').appendTo($addaExportGoods);
        var $addaExportspan = $('<span></span>').text('商品导出').appendTo($addaExportGoods);

        $adda.click(function () {
            clearForm('formAdvance');
            var purchase = com.focusPage("#layerAddAdvance").find('input[name="purchase"]').val("0");
            var selling = com.focusPage("#layerAddAdvance").find('input[name="selling"]').val("0");
            closeEditReadOnly();
            openlayer(function (index, layero) {
                if (com.validate('formAdvance'))
                    return;
                saveData(null, function () {
                    com.clearValidator("#no", true);
                    com.clearValidator("#type", true);
                    com.clearValidator("#name", true);
                    com.clearValidator("#barcode", true);
                    com.clearValidator("#category", true);
                    com.clearValidator("#brand", true);
                    com.clearValidator("#measurementUnit", true);
                    com.clearValidator("#purchase", true);
                    com.clearValidator("#selling", true);
                    com.clearValidator("#pieceNum", true);
                    com.clearValidator("#atid", true);
                    com.clearValidator();
                    layer.closeAll();
                });


            });
        });

        $addaImportGood.click(function () {

            openlayerImportGoods();
        });

        $addaImportColor.click(function () {

            openlayerImportColor();
        });

        $addaImportFormat.click(function () {

            openlayerImportFormat();
        });
        $addaImportPrice.click(function () {

            openlayerImportPrice();
        });

        $deleteImportPrice.click(function () {

            openlayerImportDeletePrice();
        });

        $addaExportGoods.click(function () {
            pageGoodsExport();
        });


        return [$addaExportGoods, $addaImportGood, $addaImportColor, $addaImportFormat, $addaImportPrice, $deleteImportPrice, $adda];

    }, 'resultList');

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

    function openlayer(callback) {
        layer.closeAll();
        layer.open({
            type: 1,
            //skin: 'layui-layer-lan',
            title: "添加",
            content: com.focusPage('#layerAddAdvance'),
            area: ($(window).width() * 0.6 < 620 ? $(window).height() * 0.6 : 620) + "px",
            maxmin: false,
            zIndex: 9000,
            btn: ['确定', '取消'],
            yes: function (index, layero) {
                callback(index, layero);
            },
            btn2: function (index, layero) {
                //按钮【按钮二】的回调
                closeEditReadOnly();
                com.clearValidator();
                layer.closeAll();
            },
            cancel: function () {
                //右上角关闭回调
                closeEditReadOnly();
                layer.closeAll();
            }
        });
    }

    //导入商品
    function openlayerImportGoods() {

        var uploaddiv = com.focusPage("#uploaddiv").removeClass("hide");
        var form2 = com.focusPage("#formAdvance2");
        uploaddiv.appendTo(form2);
        com.cleanItems(itmes);
        com.focusPage("#fileUp").removeClass("hide");
        layer.closeAll();
        layer.open({
            type: 1,
            //skin: 'layui-layer-lan',
            title: "导入商品",
            content: com.focusPage('#importGoods'),
            area: ['800px', '680px'],
            maxmin: false,
            zIndex: 9000,
            btn: ['确定', "取消"],
            yes: function () {
                planMission("import_goods");
            },
            success: function (layers, index) {

            },
            end: function () {
                goodsSeacher.doSearch();
            }
        });
    }

    //导入颜色
    function openlayerImportColor() {
        var uploaddiv = com.focusPage("#uploaddiv").removeClass("hide");
        var form3 = com.focusPage("#formAdvance3");
        uploaddiv.appendTo(form3);
        com.cleanItems(itmes);
        com.focusPage("#fileUp").removeClass("hide");
        layer.closeAll();
        layer.open({
            type: 1,
            //skin: 'layui-layer-lan',
            title: "导入颜色",
            content: com.focusPage('#importColor'),
            area: ['800px', '620px'],
            maxmin: false,
            zIndex: 9000,
            btn: ['确定', "取消"],
            yes: function () {
                planMission("export_color");
            },
            success: function (layers, index) {

            },
            end: function () {

            }
        });
    }

    //导入规格
    function openlayerImportFormat() {
        var uploaddiv = com.focusPage("#uploaddiv").removeClass("hide");
        var form4 = com.focusPage("#formAdvance4");
        uploaddiv.appendTo(form4);
        com.cleanItems(itmes);
        com.focusPage("#fileUp").removeClass("hide");
        layer.closeAll();
        layer.open({
            type: 1,
            //skin: 'layui-layer-lan',
            title: "导入规格",
            content: com.focusPage('#importFormat'),
            area: ['800px', '620px'],
            maxmin: false,
            btn: ['确定', "取消"],
            zIndex: 9000,
            yes: function () {
                planMission("export_format");
            },
            success: function (layers, index) {

            },
            end: function () {

            }
        });
    }

    //导入价格
    function openlayerImportPrice() {
        var uploaddiv = com.focusPage("#uploaddiv").removeClass("hide");
        var form5 = com.focusPage("#formAdvance5");
        uploaddiv.appendTo(form5);
        com.cleanItems(itmes);
        com.focusPage("#fileUp").removeClass("hide");
        layer.closeAll();
        layer.open({
            type: 1,
            //skin: 'layui-layer-lan',
            title: "导入价格",
            content: com.focusPage('#importPrice'),
            area: ['800px', '650px'],
            maxmin: false,
            btn: ['确定', "取消"],
            zIndex: 9000,
            yes: function () {
                planMission("export_price");
            },
            success: function (layers, index) {

            },
            end: function () {

            }
        });
    }

    //删除价格
    function openlayerImportDeletePrice() {
        var uploaddiv = com.focusPage("#uploaddiv").removeClass("hide");
        var form6 = com.focusPage("#formAdvance6");
        uploaddiv.appendTo(form6);
        com.cleanItems(itmes);
        com.focusPage("#fileUp").removeClass("hide");
        layer.closeAll();
        layer.open({
            type: 1,
            //skin: 'layui-layer-lan',
            title: "删除价格",
            content: com.focusPage('#deleteImportPrice'),
            area: ['800px', '620px'],
            maxmin: false,
            btn: ['确定', "取消"],
            zIndex: 9000,
            yes: function () {
                planMission("import_delPrice");
            },
            success: function (layers, index) {

            },
            end: function () {

            }
        });
    }

    function openLayerSwitch(id, gid, title, url) {
        var $PopUp = com.focusPage('#' + id);
        $PopUp.attr({'data-gid': gid});
        //弹出即全屏
        var index = layer.open({
            type: 1,
            skin: 'layui-layer-lan',
            title: title,
            content: $PopUp,
            area: ["1200px", ($(window).height() * 0.84 < 800 ? $(window).height() * 0.84 : 800) + "px"],
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

    //导出商品
    function pageGoodsExport() {

        if (com.focusPage('span[name="totalRecords"]').text() == 0) {
            com.showAlert(com.warning, "请通过条件进行查询");
            return false;
        }
        var goodsNo = com.focusPage("[name='goodsNo']").val();
        var goodsName = com.focusPage('[name="goodsName"]').val();
        var goodsBarcode = com.focusPage('[name="goodsBarcode"]').val();
        var goodsBrand = com.focusPage('[name="goodsBrand"]').val();
        var goodsStatus = com.focusPage("[name='goodsStatus']").val();

        if (goodsNo == "" && goodsName == "" && goodsBarcode == "" && goodsBrand == "" && goodsStatus == "") {
            com.showAlert(com.warning, "请通过条件进行查询");
            return false;
        }

        if (com.focusPage('span[name="totalRecords"]').text() > 1000) {
            com.showAlert(com.warning, "查询结果大于阀值 , 不能完成导出动作");
            return false;
        }

        var uploaddiv = com.focusPage("#uploaddiv").removeClass("hide");
        var form99 = com.focusPage("#formAdvance99");
        uploaddiv.appendTo(form99);
        com.cleanItems(itmes);
        com.focusPage("#fileUp").addClass("hide");
        layer.closeAll();
        layer.open({
            type: 1,
            skin: 'layui-layer-lan',
            title: "导出商品",
            content: com.focusPage('#exportGoods'),
            area: ['650px', '350px'],
            maxmin: false,
            btn: ['确定', "取消"],
            zIndex: 9000,
            yes: function () {

                if (com.validate())
                    return;

                if ("export_inventory_goods" == undefined) {
                    com.showAlert(com.error, "任务不存在!");
                    return;
                }

                var url = api.information.createPlan;
                var options = {
                    "plan.task.keyWord": "export_inventory_goods"
                };

                var args = "";
                //goodsNo 商品编号 no
                //goodsName 商品名 name
                //goodsBarcode 条形码 barcode
                //goodsBrand 商品品牌 brand
                //goodsNo 状态 0 启用 1 禁用
                var filtersName = ["goodsNo", "goodsName", "goodsBarcode", "goodsBrand", "goodsStatus"];

                $.each(filtersName, function (i, v) {
                    var val = com.focusPage("[name='" + v + "']").val();
                    var columnName = $("[name='" + v + "']").attr("data-rqs");
                    if (val != "undefined" && val != null && val != "") {
                        args = args + columnName + "-" + val + ",";
                    }

                });

                options["plan.args"] = args;

                var times = itmes.executeDates.val() + ' ' + itmes.executeTimes.val();
                var executeTime = new Date(times);

                if (planUtils.TimeComparison(executeTime, config.planTimeLimit)) {
                    options["plan.executeTime"] = times;
                } else {
                    com.showAlert(com.warning, "执行时间请大于当前时间" + config.planTimeLimit + "分钟!");
                    return
                }

                com.post(url, options, function (res) {
                    com.showAlert(com.info, "计划创建成功!");
                    layer.closeAll();
                });
            },
            success: function (layers, index) {

            },
            end: function () {

            }
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
        var $layer = com.focusPage('#layerAddAdvance');
        var no = $layer.find('input[name="no"]').val();
        var goodsType = $layer.find('select[name="type"] option:selected').val();
        var name = $layer.find('input[name="name"]').val();
        var barcode = $layer.find('input[name="barcode"]').val();
        var category = $layer.find('input[name="category"]').val();
        var bid = com.focusPage('#brand').val();
        var measurementUnit = $layer.find('select[name="measurementUnit"] option:selected').text();
        var purchase = $layer.find('input[name="purchase"]').val();
        var selling = $layer.find('input[name="selling"]').val();
        var pieceNum = $layer.find('input[name="pieceNum"]').val();
        var atid = $layer.find('select[name="atid"] option:selected').val();
        if (!id) {
            if (goodsType == 0) {
                com.post(api.inventory.addGoods, {
                    "goods.no": no,
                    "goods.name": name,
                    "goods.barcode": barcode,
                    "goods.category": category,
                    "goods.bid": bid,
                    "goods.measurementUnit": measurementUnit,
                    "goods.purchase": purchase,
                    "goods.selling": selling,
                    "goods.pieceNum": pieceNum,
                    "goods.accessoriesType.atid": atid == null || atid == "" ? "" : atid
                }, function (res) {
                    layer.closeAll();
                    goodsSeacher.doSearch();
                });
            } else {
                layer.closeAll();
                params["goods"] = {};
                params.goods["goods.no"] = no;
                params.goods["goods.name"] = name;
                params.goods["goods.barcode"] = barcode;
                params.goods["goods.category"] = category;
                params.goods["goods.bid"] = bid;
                params.goods["goods.measurementUnit"] = measurementUnit;
                params.goods["goods.purchase"] = purchase;
                params.goods["goods.selling"] = selling;
                params.goods["goods.pieceNum"] = pieceNum;
                params.goods["goods.accessoriesType.atid"] = atid == null || atid == "" ? "" : atid;
                openLayerSwitch('goodsSuitPopUp', null, '套餐', 'views/manifest/goodsSuit.html');
            }

        } else {
            com.post(api.inventory.updateGoods, {
                "goods.gid": id,
                "goods.purchase": purchase ? purchase : 0,
                "goods.selling": selling ? selling : 0,
                "goods.accessoriesType.atid": atid == null || atid == "" ? "" : atid
            }, function (res) {
                layer.closeAll();
                goodsSeacher.doSearch();
            });

        }

    }

    function editReadOnly() {
        var $layerAdd = com.focusPage('#layerAddAdvance');
        $layerAdd.find('input[name="no"]').attr('disabled', 'disabled');
        $layerAdd.find('select[name="type"]').attr('disabled', 'disabled');
        $layerAdd.find('input[name="name"]').attr('disabled', 'disabled');
        $layerAdd.find('input[name="barcode"]').attr('disabled', 'disabled');
        $layerAdd.find('input[name="category"]').attr('disabled', 'disabled');
        //com.updateChosen('brand',"","");
        $layerAdd.find('select[name="brand"]').attr('disabled', 'disabled');
        $layerAdd.find('select[name="measurementUnit"]').attr('disabled', 'disabled');
        $layerAdd.find('input[name="pieceNum"]').attr('disabled', 'disabled');
    }

    function closeEditReadOnly() {
        var $layerAdd = com.focusPage('#layerAddAdvance');
        $layerAdd.find('input[name="no"]').removeAttr('disabled');
        $layerAdd.find('select[name="type"]').removeAttr('disabled');
        $layerAdd.find('input[name="name"]').removeAttr('disabled');
        $layerAdd.find('input[name="barcode"]').removeAttr('disabled');
        $layerAdd.find('input[name="category"]').removeAttr('disabled');
        com.updateChosen('brand', "", "");
        $layerAdd.find('select[name="brand"]').removeAttr('disabled');
        $layerAdd.find('select[name="measurementUnit"]').removeAttr('disabled');
        $layerAdd.find('input[name="purchase"]').removeAttr('disabled');
        $layerAdd.find('input[name="selling"]').removeAttr('disabled');
        $layerAdd.find('input[name="pieceNum"]').removeAttr('disabled');
    }

    //导入创建计划
    function planMission(num) {

        if (com.validate()) {
            return;
        }

        var url = api.information.createPlan;
        var options = {
            "plan.task.keyWord": num
        };

        var filePaths = com.focusPage("#filePath");

        if (filePaths.val() == null || filePaths.val() == "") {
            com.showAlert(com.warning, "上传文件不能为空!");
            return
        }

        var pathFile = filePaths.val();

        options["plan.args"] = pathFile;

        var times = itmes.executeDates.val() + ' ' + itmes.executeTimes.val();
        var executeTime = new Date(times);


        if (planUtils.TimeComparison(executeTime, config.planTimeLimit)) {
            options["plan.executeTime"] = times;
        } else {
            com.showAlert(com.warning, "执行时间请大于当前时间" + config.planTimeLimit + "分钟!");
            return
        }

        com.post(url, options, function (res) {
            com.showAlert(com.info, "计划创建成功!");
            layer.closeAll();
        });

    }


});
