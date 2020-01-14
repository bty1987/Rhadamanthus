$(function () {

    var goods = {
        gid: null,
        keyword: null,
        items:{
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

            executeTimes: com.focusPage("#executeTimes"),
            executeDates: com.focusPage("#executeDates"),

            filePath: com.focusPage("#filePath"),
        },
        btns:{
            submitBtn: com.focusPage("#submitBtn"),
            importBtn: com.focusPage("#importBtn"),
            exportBtn: com.focusPage("#exportBtn")
        }
    };

    com.datetime(goods.items.executeDates,"date",false);
    com.datetime(goods.items.executeTimes,"time",false);

    goods.items.type.bindData([{gid: 0, goods: "商品"}, {gid: 1, goods: "套餐"}], "gid", "goods");

    com.post(api.data.queryCategory, {}, function (res) {
        goods.items.category.bindData(res.categorys, "categoryName", "categoryName");
    });

    com.post(api.common.queryMeasurementUnit, {}, function (res) {
        goods.items.measurementUnit.bindData(res.measurementUnits, "name", "name");
    });

    com.post(api.data.queryAccessoriesType, {}, function (res) {
        goods.items.accessoriesType.bindData(res.accessoriesTypes, 'atid', 'name', true);
    });

    goods.btns.submitBtn.click(function () {
        saveData();
    });

    goods.btns.importBtn.click(function () {
        planMission("import");
    });

    goods.btns.exportBtn.click(function () {
        planMission("export");
    });

    com.initTypeahead("brand", api.data.queryBrandByPinyin, "pinyinName", {}, "brands", "bid", "name", function (list, k, v) {
        $.each(list, function (index, val) {

            if (val.bid == k) {

                goods.bid = k;

                com.post(api.data.queryBrandByBid, {"brand.bid": k}, function (res) {
                    goods.items.category.val(res.brand.categoryName);
                });
            }
        });

        return v;
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

            $liTitle.append($indexWrap).append($contentWrap).append($optionWrap).appendTo($ulTitle);

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

            var $btnEdit = $('<li></li>').append($('<a></a>').html('编辑'));
            var $btnColor = $('<li></li>').append($('<a></a>').html('颜色'));
            var $btnFormat = $('<li></li>').append($('<a></a>').html('规格'));
            var $btnPrice = $('<li></li>').append($('<a></a>').html('价格'));
            //var $btnSuit = $('<li></li>').append($('<a></a>').html('查看'));
            var $btnStart = $('<li></li>').append($('<a></a>').html('启用'));
            var $btnStop = $('<li></li>').append($('<a></a>').html('禁用'));

            $btnUl.append($btnEdit).append($btnColor).append($btnFormat).append($btnPrice).append($btnStart).append($btnStop);

            $btnGroup.append($btn).append($btnUl).appendTo($cellOption);
            $cellOption.appendTo($optionWrap);

            $liLine.append($indexWrap).append($contentWrap).append($optionWrap);

            $btnEdit.click(function () {

                readonly("disabled");

           	// com.updateTypeahead('brand', v.bid, v.brand);

                goods.gid = v.gid;
                goods.bid = v.bid;

                goods.items.no.val(v.no);
                goods.items.type.val(v.type);
                goods.items.name.val(v.name);
                goods.items.barcode.val(v.barcode);
                goods.items.brand.val(v.brand);
                goods.items.category.val(v.category);

                goods.items.measurementUnit.val(v.measurementUnit);
                goods.items.purchase.val(v.purchase);
                goods.items.selling.val(v.selling);
                goods.items.pieceNum.val(v.pieceNum);
                goods.items.accessoriesType.val(v.accessoriesType.atid);

                // showLayer("编辑", "#addLayer");
                com.popup4model("#addLayer","编辑")
            });

            $btnColor.click(function () {
                params["goods.gid"] = v.gid;
                com.popup4page('#layerPopUp','views/data/color.html','颜色');
            });

            $btnFormat.click(function () {
                params["goods.gid"] = v.gid;
                com.popup4page('#layerPopUp','views/data/format.html','规格');
            });

            $btnPrice.click(function () {
                params["goods.gid"] = v.gid;
                com.popup4page('#layerPopUp','views/data/price4advance.html','价格');
            });

            /* $btnSuit.click(function () {
				 params["goods.gid"] = v.gid;
                 com.popup4page('#layerPopUp','views/data/goods4package.html','套餐');
             });*/

            $btnStart.click(function () {

                if (v.status == 0) {
                    com.showAlert(com.warning, "已启用");
                    return false;
                }

                updateStatus(v.gid, 0);
            });

            $btnStop.click(function () {

                if (v.status == 1) {
                    com.showAlert(com.warning, "已禁用");
                    return false;
                }

                updateStatus(v.gid, 1);
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

    goodsSeacher.init(['goodsNo', 'goodsName', 'goodsBarcode', 'goodsBrand', 'goodsStatus'], "condList", api.data.pageGoodsForAdvance, function (data) {
        displayFunc.init('resultList', data);
    }, "pagenation", "goodsAdvancePostData", null, false, null, function () {

        var $adda = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('name', 'addQuotationVersion').css({'margin-left': '4px'});
        var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
        var $addspan = $('<span></span>').text('添加').appendTo($adda);

        var $addaImportGood = $('<a></a>').addClass('btn btn-minier btn-warning pull-left').attr('name', 'importGoods').css({'margin-left': '4px'});
        var $addaGoodi = $('<i></i>').addClass('icon-cloud-upload bigger-110').appendTo($addaImportGood);
        var $addaGoodspan = $('<span></span>').text('导入商品').appendTo($addaImportGood);

        var $addaImportColor = $('<a></a>').addClass('btn btn-minier btn-danger pull-left').attr('name', 'importGoods').css({'margin-left': '4px'});
        var $addaColori = $('<i></i>').addClass('icon-cloud-upload bigger-110').appendTo($addaImportColor);
        var $addaColorspan = $('<span></span>').text('导入颜色').appendTo($addaImportColor);

        var $addaImportFormat = $('<a></a>').addClass('btn btn-minier btn-purple pull-left').attr('name', 'importGoods').css({'margin-left': '4px'});
        var $addaFormati = $('<i></i>').addClass('icon-cloud-upload bigger-110').appendTo($addaImportFormat);
        var $addaFormatspan = $('<span></span>').text('导入规格').appendTo($addaImportFormat);

        var $addaImportPrice = $('<a></a>').addClass('btn btn-minier btn-pink pull-left').attr('name', 'importGoods').css({'margin-left': '4px'});
        var $addaPricei = $('<i></i>').addClass('icon-cloud-upload bigger-110').appendTo($addaImportPrice);
        var $addaPricespan = $('<span></span>').text('导入价格').appendTo($addaImportPrice);

        var $deleteImportPrice = $('<a></a>').addClass('btn btn-minier btn-inverse pull-left').attr('name', 'importGoods').css({'margin-left': '4px'});
        var $deletePricei = $('<i></i>').addClass('icon-cloud-upload bigger-110').appendTo($deleteImportPrice);
        var $deletePricespan = $('<span></span>').text('删除价格').appendTo($deleteImportPrice);

        var $addaExportGoods = $('<a></a>').addClass('btn btn-minier btn-success pull-left').attr('name', 'importGoods');
        var $addaExporti = $('<i></i>').addClass('icon-download-alt bigger-110').appendTo($addaExportGoods);
        var $addaExportspan = $('<span></span>').text('商品导出').appendTo($addaExportGoods);

        $adda.click(function () {

            com.cleanItems(goods.items);

            readonly(null);

            goods.gid = null;
            goods.bid = null;

            com.popup4model("#addLayer","添加")
        });

        $addaImportGood.click(function () {

            goods.keyword = "import_goods";

            var form = com.focusPage("#importGoodsForm");

            com.focusPage("#uploaddiv").removeClass("hide").appendTo(form);
            com.focusPage("#fileUpload").removeClass("hide");

            goods.btns.importBtn.removeClass("hide");
            goods.btns.exportBtn.addClass("hide");

            com.popup4model("#importGoods","导入商品")
        });

        $addaImportColor.click(function () {

            goods.keyword = "import_color";

            var form = com.focusPage("#importColorForm");

            com.focusPage("#uploaddiv").removeClass("hide").appendTo(form);
            com.focusPage("#fileUpload").removeClass("hide");

            goods.btns.importBtn.removeClass("hide");
            goods.btns.exportBtn.addClass("hide");

            com.popup4model("#importColor","导入颜色")
        });

        $addaImportFormat.click(function () {

            goods.keyword = "import_format";

            var form = com.focusPage("#importFormatForm");

            com.focusPage("#uploaddiv").removeClass("hide").appendTo(form);
            com.focusPage("#fileUpload").removeClass("hide");

            goods.btns.importBtn.removeClass("hide");
            goods.btns.exportBtn.addClass("hide");

            com.popup4model("#importFormat","导入规格")
        });

        $addaImportPrice.click(function () {

            goods.keyword = "import_price";

            var form = com.focusPage("#importPriceForm");

            com.focusPage("#uploaddiv").removeClass("hide").appendTo(form);
            com.focusPage("#fileUpload").removeClass("hide");

            goods.btns.importBtn.removeClass("hide");
            goods.btns.exportBtn.addClass("hide");

            com.popup4model("#importPrice","导入价格")
        });

        $deleteImportPrice.click(function () {

            goods.keyword = "delete_price";

            var form = com.focusPage("#deletePriceForm");

            com.focusPage("#uploaddiv").removeClass("hide").appendTo(form);
            com.focusPage("#fileUpload").removeClass("hide");

            goods.btns.importBtn.removeClass("hide");
            goods.btns.exportBtn.addClass("hide");

            com.popup4model("#deletePrice","删除价格")
        });

        $addaExportGoods.click(function () {

            var total = com.focusPage('span[name="totalRecords"]').text();

            if (total == 0) {
                com.showAlert(com.warning, "请通过条件进行查询");
                return false;
            }

            if (com.focusPage('span[name="totalRecords"]').text() > 1000) {
                com.showAlert(com.warning, "查询结果大于阀值 , 导出失败");
                return false;
            }

            goods.keyword = "export_inventory_goods";

            var form = com.focusPage("#exportGoodsForm");

            com.focusPage("#uploaddiv").removeClass("hide").appendTo(form);
            com.focusPage("#fileUpload").addClass("hide");

            goods.btns.importBtn.addClass("hide");
            goods.btns.exportBtn.removeClass("hide");

            com.popup4model("#exportGoods","导出商品")
        });

        return [$addaExportGoods, $addaImportGood, $addaImportColor, $addaImportFormat, $addaImportPrice, $deleteImportPrice, $adda];
    }, 'resultList');

    function updateStatus(gid, status, callback) {

        var options = {
            "goods.gid": gid,
            "goods.status": status
        };

        com.post(api.data.updateGoodsForStatus, options, function (res) {
            com.showAlert(com.info, "操作成功");
            goodsSeacher.doSearch();
        });
    }

    function saveData() {

        if (com.validate("formAdvance", "right")) {
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

        com.post(url, options, function (res) {
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

    //导入创建计划
    function planMission(type) {

        if (com.validate("uploaddiv")) {
            return false;
        }

        var args = "";

        if (type == "export") {

            var filtersName = ["goodsNo", "goodsName", "goodsBarcode", "goodsBrand", "goodsStatus"];

            $.each(filtersName, function (i, v) {
                var val = com.focusPage("[name='" + v + "']").val();
                var columnName = $("[name='" + v + "']").attr("data-rqs");
                if (val != "undefined" && val != null && val != "") {
                    args = args + columnName + "-" + val + ",";
                }
            });

            if (args == null || args == "") {
                com.showAlert(com.warning, "请通过条件进行查询");
                return false;
            }

        } else if (type == "import") {

            var filePath = goods.items.filePath.val();

            if (filePath == null || filePath == "") {
                com.showAlert(com.warning, "上传文件不能为空");
                return false;
            }

            args = filePath;
        } else {
            return false;
        }

        var times = goods.items.executeDates.val() + ' ' + goods.items.executeTimes.val();
        var executeTime = new Date(times);

        if (!planUtils.TimeComparison(executeTime, config.planTimeLimit)) {
            com.showAlert(com.warning, "执行时间请大于当前时间" + config.planTimeLimit + "分钟");
            return false;
        }

        var options = {
            "plan.task.keyWord": goods.keyword,
            "plan.executeTime": times,
            "plan.args": args
        };

        com.post(api.information.createPlan, options, function (res) {
            com.showAlert(com.info, "计划创建成功");
            com.closePopup();
        });
    }

    com.focusPage("#attachment").Huploadify({
        auto: !0,
        successTimeout: 60000,
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
                    alert("文件 [" + a.name + "] 大小异常!");
                    break;
                case -130:
                    alert("文件 [" + a.name + "] 类型不正确!")
            }
        },
        onUploadSuccess: function (a, b, c) {
            a = eval("(" + b + ")");
            0 == a.errorCode ? com.focusPage("#filePath").val(a.resUrl) : alert(b);
        },
        itemTemplate: '<div id="${fileID}" class="uploadify-queue-item" style="position:absolute;top:-30px;width:200px;left:-200px;">\r\n\t\t\t<div class="cancel">\r\n\t\t\t\t<a href="javascript:$(\'#${instanceID}\').uploadify(\'cancel\', \'${fileID}\')">X</a>\r\n\t\t\t</div>\r\n\t\t\t<span class="fileName">${fileName} (${fileSize})</span><span class="data"></span>\r\n\t\t\t<div class="uploadify-progress">\r\n\t\t\t\t<div class="uploadify-progress-bar"><!--Progress Bar--></div>\r\n\t\t\t</div>\r\n\t\t</div>'
    });

});
