$(function() {

    var goods = {

        gid: null,
        keyword: null,

        items: {
            no: com.focusPage("#no"),
            type: com.focusPage("#type"),
            name: com.focusPage("#name"),
            alias: com.focusPage("#alias"),
            barcode: com.focusPage("#barcode"),
            category: com.focusPage("#category"),
            brand: com.focusPage("#brand"),
            measurementUnit: com.focusPage("#measurementUnit"),
            purchase: com.focusPage("#purchase"),
            selling: com.focusPage("#selling"),
            confine: com.focusPage("#confine"),
            pieceNum: com.focusPage("#pieceNum"),
            accessoriesType: com.focusPage("#accessoriesType"),
            onekind: com.focusPage("#onekind"),
            twokind: com.focusPage("#twokind"),
            thrkind: com.focusPage("#thrkind"),

            executeTimes: com.focusPage("#executeTimes"),
            executeDates: com.focusPage("#executeDates"),

            filePath: com.focusPage("#filePath")
        },

        btns: {
            submitBtn: com.focusPage("#submitBtn"),
            importBtn: com.focusPage("#importBtn"),
            exportBtn: com.focusPage("#exportBtn")
        },

        modals: {
            drawingGoodsModal: com.focusPage("#drawingGoodsModal")
        },

        pageType: params['urlLoadParams'].type
    };

    com.datetime(goods.items.executeDates, "date", false);
    com.datetime(goods.items.executeTimes, "time", false);

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

    com.post(api.data.queryGoodsKind, {}, function(res) {

        var oneKinds = [];
        var twoKinds = [];
        var thrKinds = [];

        $.each(res.goodsKinds, function(i, v) {

            if (v.status == 0) {
                switch (v.level) {
                    case 1:
                        oneKinds.push({
                            "key": v.gkid,
                            "value": v.name
                        });
                        break;
                    case 2:
                        twoKinds.push({
                            "key": v.gkid,
                            "value": v.name
                        });
                        break;
                    case 3:
                        thrKinds.push({
                            "key": v.gkid,
                            "value": v.name
                        });
                        break;
                }
            }
        });
        goods.items.onekind.bindData(oneKinds, 'key', 'value');
        goods.items.twokind.bindData(twoKinds, 'key', 'value');
        goods.items.thrkind.bindData(thrKinds, 'key', 'value');
    });

    goods.btns.importBtn.click(function() {

        importGoods();
    });

    goods.btns.exportBtn.click(function() {

        exportGoods();
    });

    com.initTypeahead("brand", api.data.queryBrandByPinyin, "brand.pinyin", {}, "brands", "bid", "name", function(list, k, v) {

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

    initUploadBtn();

    var searcher = new Searcher();

    searcher.base("gCondList", "gPagenation", "gResultList", api.data.pageGoods);

    if (goods.pageType == "basic" || goods.pageType == "senior") {
        searcher.base("gCondList", "gPagenation", "gResultList", api.data.pageGoodsForAdvance);
    }

    searcher.condition(['data-goods-no', 'data-goods-name', 'data-goods-barcode', 'data-goods-brand-name', 'data-goods-status']);
    searcher.history("goodsPageDataHistory" + goods.pageType);

    if (goods.pageType == "senior") {

        searcher.button(function() {

            var $btnGroup = $("<div></div>").addClass("btn-group");

            var $adda = $('<a></a>').addClass('btn btn-minier btn-primary').attr('id', 'add').css({
                'margin-left': '4px'
            }).appendTo($btnGroup);
            var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
            var $addspan = $('<span></span>').text('添加').appendTo($adda);

            var $exportGroup = $("<div></div>").addClass("btn-group");
            var $addaExport = $('<a></a>').addClass('btn btn-minier btn-success dropdown-toggle').attr("data-toggle", "dropdown").attr('name', 'importGoods').css({
                'margin-left': '4px'
            }).appendTo($exportGroup);
            $('<i></i>').addClass('icon-cloud-upload bigger-110').appendTo($addaExport);
            $('<span></span>').text('导出').appendTo($addaExport);
            $('<span></span>').addClass('icon-caret-down icon-on-right').appendTo($addaExport);

            var $addExportUl = $("<ul></ul>").addClass("dropdown-menu dropdown-inverse").appendTo($exportGroup);
            var $exportGoods = $("<li></li>").append($("<a></a>").attr("id", "exportGood").text("导出商品")).appendTo($addExportUl);
            var $exportColor = $("<li></li>").append($("<a></a>").attr("id", "exportColor").text("导出颜色")).appendTo($addExportUl);
            var $exportFormat = $("<li></li>").append($("<a></a>").attr("id", "exportFormat").text("导出规格")).appendTo($addExportUl);
            var $exportPrice = $("<li></li>").append($("<a></a>").attr("id", "exportPrice").text("导出价格")).appendTo($addExportUl);

            var $importGroup = $("<div></div>").addClass("btn-group");
            var $addaImport = $('<a></a>').addClass('btn btn-minier btn-warning dropdown-toggle').attr("data-toggle", "dropdown").attr('name', 'importGoods').css({
                'margin-left': '4px'
            }).appendTo($importGroup);
            $('<i></i>').addClass('icon-cloud-upload bigger-110').appendTo($addaImport);
            $('<span></span>').text('导入').appendTo($addaImport);
            $('<span></span>').addClass('icon-caret-down icon-on-right').appendTo($addaImport);

            var $addImportUl = $("<ul></ul>").addClass("dropdown-menu dropdown-inverse").appendTo($importGroup);
            var $importGoods = $("<li></li>").append($("<a></a>").attr("id", "importGoo").text("导入商品")).appendTo($addImportUl);
            var $importColor = $("<li></li>").append($("<a></a>").attr("id", "importCol").text("导入颜色")).appendTo($addImportUl);
            var $importFormat = $("<li></li>").append($("<a></a>").attr("id", "importFor").text("导入规格")).appendTo($addImportUl);
            var $importPrice = $("<li></li>").append($("<a></a>").attr("id", "importPri").text("导入价格")).appendTo($addImportUl);

            var $updateGroup = $("<div></div>").addClass("btn-group");
            var $addaUpdate = $('<a></a>').addClass('btn btn-minier btn-danger dropdown-toggle').attr("data-toggle", "dropdown").attr('name', 'importGoods').css({
                'margin-left': '4px'
            }).appendTo($updateGroup);
            $('<i></i>').addClass('icon-cloud-upload bigger-110').appendTo($addaUpdate);
            $('<span></span>').text('更新').appendTo($addaUpdate);
            $('<span></span>').addClass('icon-caret-down icon-on-right').appendTo($addaUpdate);

            var $addUpdateUl = $("<ul></ul>").addClass("dropdown-menu dropdown-inverse").appendTo($updateGroup);
            var $deleteGoods = $("<li></li>").append($("<a></a>").attr("id", "deletePriceBtn").text("删除商品价格")).appendTo($addUpdateUl);
            var $statusGoods = $("<li></li>").append($("<a></a>").attr("id", "statusGoodsBtn").text("更新商品状态")).appendTo($addUpdateUl);

            return [$btnGroup, $exportGroup, $importGroup, $updateGroup];
        })

    } else {

        searcher.button([{
            id: "add",
            name: "添加",
            clazz: "btn-success",
            icon: "icon-plus"
        }, {
            id: "export",
            name: "导出",
            clazz: "btn-yellow",
            icon: "icon-download-alt"
        }]);
    }

    var lineprops = [{
        field: "path",
        type: "img",
        prop: "path"
    }, {
        field: "no",
        name: "编号",
        prop: "no",
        clazz: "blue"
    }, {
        field: "alias",
        name: "别名",
        prop: "alias",
        clazz: "grey"
    }, {
        field: "barcode",
        name: "条形码",
        prop: "barcode",
        clazz: "blue"
    }, {
        field: "category",
        name: "品类",
        prop: "category",
        clazz: "grey"
    }, {
        field: "brand",
        name: "品牌",
        prop: "brand",
        clazz: "grey"
    }, {
        field: "measurementUnit",
        name: "单位",
        prop: "measurementUnit",
        clazz: "grey"
    }, {
        field: "purchase",
        name: "控价",
        prop: "purchase",
        clazz: "blue"
    }, {
        field: "selling",
        name: "售价",
        prop: "selling",
        clazz: "blue"
    }, {
        field: "confine",
        name: "限价",
        prop: "confine",
        clazz: "blue"
    }, {
        field: "pieceNum",
        name: "件数 ",
        prop: "pieceNum",
        clazz: "blue"
    }, {
        field: "accessoriesType.name",
        name: "辅类",
        prop: "accessoriesType.name",
        clazz: "grey"
    }, {
        field: "type",
        name: "类型 ",
        prop: function(v) {

            return v.type == "0" ? "商品" : "套餐";
        },
        clazz: "red"
    }, {
        field: "onekind.name",
        name: "一类",
        prop: "onekind.name",
        clazz: "grey"
    }, {
        field: "twokind.name",
        name: "二类",
        prop: "twokind.name",
        clazz: "grey"
    }, {
        field: "thrkind.name",
        name: "三类",
        prop: "thrkind.name",
        clazz: "grey"
    }, {
        fieId: "isShow",
        name: "是否出样",
        prop: "isShow",
        clazz: "red",
        dataset: constant.data().goods.isShow.keys
    }, {
        field: "status",
        name: "状态 ",
        prop: function(v) {

            return v.status == "0" ? "启用" : "禁用";
        },
        clazz: "red"
    }];

    var linebtns = [{
        name: "编辑",
        clazz: "btn-primary",
        handle: function(v) {

            readonly("disabled");

            // com.updateTypeahead('brand', v.bid, v.brand);

            goods.gid = v.gid;
            goods.bid = v.bid;

            goods.items.no.val(v.no);
            goods.items.type.val(v.type);
            goods.items.name.val(v.name);
            goods.items.alias.val(v.alias);
            goods.items.barcode.val(v.barcode);
            goods.items.brand.val(v.brand);
            goods.items.category.val(v.category);

            goods.items.measurementUnit.val(v.measurementUnit);
            goods.items.purchase.val(v.purchase);
            goods.items.selling.val(v.selling);
            goods.items.confine.val(v.confine);
            goods.items.pieceNum.val(v.pieceNum);
            goods.items.accessoriesType.val(v.accessoriesType.atid);
            goods.items.onekind.val(v.onekind.gkid);
            goods.items.twokind.val(v.twokind.gkid);
            goods.items.thrkind.val(v.thrkind.gkid);

            com.popup4model("#addLayer", "编辑");
        },
        show: function(v) {

            return goods.pageType == "senior";
        }
    }, {
        name: "颜色",
        clazz: "btn-warning",
        handle: function(v) {

            params.data.goods = v;

            com.popup4page('#layerPopUp', 'views/data/color.html', '颜色');
        }
    }, {
        name: "规格",
        clazz: "btn-yellow",
        handle: function(v) {

            params.data.goods = v;

            com.popup4page('#layerPopUp', 'views/data/format.html', '规格');
        }
    }, {
        name: "价格",
        clazz: "btn-pink",
        handle: function(v) {

            params.data.goods = v;
            params.pageType = goods.pageType;
            com.popup4page('#layerPopUp', 'views/data/price.html', '价格');
        },
        show: function(v) {

            return goods.pageType == "senior" || !goods.pageType;
        }
    }, {
        name: "图片",
        clazz: "btn-success",
        handle: function(v) {

            goods.gid = v.gid;

            com.focusPage('#goodsDrawing').html("");

            com.post(api.communion.queryDataDrawing, {
                "dataDrawing.sid": v.gid,
                "dataDrawing.type": 2
            }, function(data) {

                var dataDrawings = data.dataDrawings;

                if (dataDrawings && dataDrawings.length > 0) {
                    $.each(dataDrawings, function(i, value) {

                        appendGalleryElement("goodsDrawing", value);
                    });
                    com.popup4photos("#goodsDrawing");
                }
            }, null, false);

            goods.modals.drawingGoodsModal.modal("show");
        }
    }, {
        name: "记录",
        clazz: "btn-purple",
        handle: function(v) {

            params.data.goods = v;

            com.popup4page('#layerPopUp', 'views/data/goodsRecord.html', '记录');
        }
    }, {
        name: "状态",
        type: "switch",
        clazz: "status-lbl",
        handle: function(v, check) {

            com.post(api.data.updateGoodsForStatus, {
                "goods.gid": v.gid,
                "goods.status": v.status == 0 ? 1 : 0
            }, function(res) {

                com.showAlert(com.info, "操作成功");
                searcher.doSearch();
            });

            return false;
        },
        init: function(v) {

            return !v.status;
        },
        show: function(v) {

            return goods.pageType == "senior" || !goods.pageType;
        }
    }, {
        name: "是否出样",
        type: "switch",
        clazz: "isOrNot",
        handle: function(v, check) {

            com.post(api.data.showGoods, {
                "goods.gid": v.gid,
                "goods.isShow": v.isShow == 0 ? 1 : 0
            }, function(res) {

                com.showAlert(com.info, "操作成功");
                searcher.doSearch();
            });

            return false;
        },
        init: function(v) {
            return !v.isShow;
        }
    }];

    searcher.line("name", lineprops, linebtns);

    searcher.render();

    com.focusPage('#add', '#gPagenation').on("click", function() {

        com.cleanItems(goods.items);

        readonly(null);

        goods.gid = null;
        goods.bid = null;

        com.popup4model("#addLayer", "添加");
    });

    com.focusPage('#export', '#gPagenation').on("click", function() {

        var total = com.focusPage('span[name="totalRecords"]').text();

        if (total == 0) {
            com.showAlert(com.warning, "请通过条件进行查询");
            return false;
        }

        if (com.focusPage('span[name="totalRecords"]').text() > 1000) {
            com.showAlert(com.warning, "查询结果大于阀值 , 导出失败");
            return false;
        }

        com.post(!goods.pageType ? api.data.pageGoods : api.data.pageGoodsForAdvance, $.extend({}, params["goodsPageDataHistory" + goods.pageType], {
            "paging.noPage": 1
        }), function(res) {

            $.exceler({
                column: [['商品ID', 'gid'], ['商品编码', 'no'], ['商品名称', 'name'], ['别名', 'alias'], ['条形码', 'barcode'], ['品类', 'category'], ['品牌ID', 'bid'], ['品牌', 'brand'], ['单位', 'measurementUnit'], ['件数', 'pieceNum'], ['类型', 'type']],
                list: res.paging.data
            }, function(v) {

                v.type = v.type == "0" ? "商品" : "套餐";
            });
        });
    });

    com.focusPage('#deletePriceBtn', '#gPagenation').on("click", function() {

        goods.keyword = "update_delete_price";

        var form = com.focusPage("#deletePriceForm");

        com.focusPage("#uploaddiv").removeClass("hide").appendTo(form);
        com.focusPage("#fileUpload").removeClass("hide");

        goods.btns.importBtn.removeClass("hide");
        goods.btns.exportBtn.addClass("hide");

        com.popup4model("#deletePrice", "删除价格");
    });

    com.focusPage('#statusGoodsBtn', '#gPagenation').on("click", function() {

        goods.keyword = "update_status_goods";

        var form = com.focusPage("#statusGoodsForm");

        com.focusPage("#uploaddiv").removeClass("hide").appendTo(form);
        com.focusPage("#fileUpload").removeClass("hide");

        goods.btns.importBtn.removeClass("hide");
        goods.btns.exportBtn.addClass("hide");

        com.popup4model("#statusGoods", "更新商品价格");
    });

    com.focusPage('#exportGood', '#gPagenation').on("click", function() {

        var total = com.focusPage('span[name="totalRecords"]').text();

        goods.keyword = "export_inventory_goods";

        var form = com.focusPage("#exportGoodsForm");

        com.focusPage("#uploaddiv").removeClass("hide").appendTo(form);
        com.focusPage("#fileUpload").addClass("hide");

        goods.btns.importBtn.addClass("hide");
        goods.btns.exportBtn.removeClass("hide");

        com.popup4model("#exportGoods", "导出商品");
    });

    com.focusPage('#exportColor', '#gPagenation').on("click", function() {

        var total = com.focusPage('span[name="totalRecords"]').text();

        goods.keyword = "export_goods_color";

        var form = com.focusPage("#exportModalForm");

        com.focusPage("#uploaddiv").removeClass("hide").appendTo(form);
        com.focusPage("#fileUpload").addClass("hide");

        goods.btns.importBtn.addClass("hide");
        goods.btns.exportBtn.removeClass("hide");

        com.popup4model("#exportModal", "导出颜色");
    });

    com.focusPage('#exportFormat', '#gPagenation').on("click", function() {

        var total = com.focusPage('span[name="totalRecords"]').text();

        goods.keyword = "export_goods_format";

        var form = com.focusPage("#exportModalForm");

        com.focusPage("#uploaddiv").removeClass("hide").appendTo(form);
        com.focusPage("#fileUpload").addClass("hide");

        goods.btns.importBtn.addClass("hide");
        goods.btns.exportBtn.removeClass("hide");

        com.popup4model("#exportModal", "导出规格");
    });

    com.focusPage('#exportPrice', '#gPagenation').on("click", function() {

        var total = com.focusPage('span[name="totalRecords"]').text();

        goods.keyword = "export_goods_price";

        var form = com.focusPage("#exportModalForm");

        com.focusPage("#uploaddiv").removeClass("hide").appendTo(form);
        com.focusPage("#fileUpload").addClass("hide");

        goods.btns.importBtn.addClass("hide");
        goods.btns.exportBtn.removeClass("hide");

        com.popup4model("#exportModal", "导出价格");
    });

    com.focusPage('#importGoo', '#gPagenation').on("click", function() {

        goods.keyword = "import_goods";

        var form = com.focusPage("#importGoodsForm");

        com.focusPage("#uploaddiv").removeClass("hide").appendTo(form);
        com.focusPage("#fileUpload").removeClass("hide");

        goods.btns.importBtn.removeClass("hide");
        goods.btns.exportBtn.addClass("hide");

        com.popup4model("#importGoods", "导入商品");
    });

    com.focusPage('#importCol', '#gPagenation').on("click", function() {

        goods.keyword = "import_color";

        var form = com.focusPage("#importColorForm");

        com.focusPage("#uploaddiv").removeClass("hide").appendTo(form);
        com.focusPage("#fileUpload").removeClass("hide");

        goods.btns.importBtn.removeClass("hide");
        goods.btns.exportBtn.addClass("hide");

        com.popup4model("#importColor", "导入颜色");
    });

    com.focusPage('#importFor', '#gPagenation').on("click", function() {

        goods.keyword = "import_format";

        var form = com.focusPage("#importFormatForm");

        com.focusPage("#uploaddiv").removeClass("hide").appendTo(form);
        com.focusPage("#fileUpload").removeClass("hide");

        goods.btns.importBtn.removeClass("hide");
        goods.btns.exportBtn.addClass("hide");

        com.popup4model("#importFormat", "导入规格");
    });

    com.focusPage('#importPri', '#gPagenation').on("click", function() {

        goods.keyword = "import_price";

        var form = com.focusPage("#importPriceForm");

        com.focusPage("#uploaddiv").removeClass("hide").appendTo(form);
        com.focusPage("#fileUpload").removeClass("hide");

        goods.btns.importBtn.removeClass("hide");
        goods.btns.exportBtn.addClass("hide");

        com.popup4model("#importPrice", "导入价格");
    });

    goods.btns.submitBtn.click(function() {

        saveData();
    });

    function saveData() {

        if (com.validate("formGoods", "right")) {
            return false;
        }

        var gid = goods.gid;
        var atid = goods.items.accessoriesType.val();

        var url = api.data.updateGoods;
        var options = {
            "goods.type": goods.items.type.val(),
            "goods.alias": goods.items.alias.val(),
            "goods.purchase": goods.items.purchase.val(),
            "goods.selling": goods.items.selling.val(),
            "goods.confine": goods.items.confine.val(),
            "goods.accessoriesType.atid": atid == null || atid == "" ? "" : atid,
            "goods.onekind.gkid": goods.items.onekind.val(),
            "goods.twokind.gkid": goods.items.twokind.val(),
            "goods.thrkind.gkid": goods.items.thrkind.val()
        };

        if (!gid) {
            url = api.data.addGoods;
            options["goods.no"] = goods.items.no.val();
            options["goods.name"] = goods.items.name.val();
            options["goods.alias"] = goods.items.alias.val();
            options["goods.barcode"] = goods.items.barcode.val();
            options["goods.bid"] = goods.bid;
            options["goods.category"] = goods.items.category.val();
            options["goods.measurementUnit"] = goods.items.measurementUnit.val();
            options["goods.pieceNum"] = goods.items.pieceNum.val();
        } else {
            options["goods.gid"] = goods.gid;
        }

        com.post(url, options, function(res) {

            com.showAlert(com.info, "操作成功");

            com.closePopup();

            searcher.doSearch();
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

    function importGoods() {

        if (com.validate("uploaddiv")) {
            return false;
        }

        var filePath = goods.items.filePath.val();

        if (filePath == null || filePath == "") {
            com.showAlert(com.warning, "上传文件不能为空");
            return false;
        }

        var args = filePath;

        var date = goods.items.executeDates.val();
        var time = goods.items.executeTimes.val();

        var executeTime = date.replace(/-/g, '').substr(2) + time.replace(/:/g, '').substr(0, 4);

        var times = goods.items.executeDates.val() + ' ' + goods.items.executeTimes.val();
        var checkTime = new Date(times);

        if (!planUtils.TimeComparison(checkTime, config.planTimeLimit)) {
            com.showAlert(com.warning, "执行时间请大于当前时间" + config.planTimeLimit + "分钟");
            return false;
        }

        var options = {
            "plan.task.keyWord": goods.keyword,
            "plan.executeTime": executeTime,
            "plan.args": args
        };

        com.post(api.information.createPlan, options, function(res) {

            com.showAlert(com.info, "计划创建成功");
            com.closePopup();
        });

    }

    function exportGoods() {

        if (com.validate("uploaddiv")) {
            return false;
        }

        var filtersName = ['data-goods-no', 'data-goods-name', 'data-goods-barcode', 'data-goods-brand-name', 'data-goods-status'];

        var args = "";

        $.each(filtersName, function(i, v) {

            var val = com.focusPage("[name='" + v + "']").val();
            var columnName = $("[name='" + v + "']").attr("data-rqs");

            if (val != "undefined" && val != null && val != "") {
                args = args + columnName + "-" + val + ",";
            }
        });

        if (args == null || args == "") {
            args = ","
        }

        var date = goods.items.executeDates.val();
        var time = goods.items.executeTimes.val();

        var executeTime = date.replace(/-/g, '').substr(2) + time.replace(/:/g, '').substr(0, 4);

        var times = goods.items.executeDates.val() + ' ' + goods.items.executeTimes.val();
        var checkTime = new Date(times);

        if (!planUtils.TimeComparison(checkTime, config.planTimeLimit)) {
            com.showAlert(com.warning, "执行时间请大于当前时间" + config.planTimeLimit + "分钟");
            return false;
        }

        var options = {
            "plan.task.keyWord": goods.keyword,
            "plan.executeTime": executeTime,
            "plan.args": args
        };

        com.post(api.information.createPlan, options, function(res) {

            com.showAlert(com.info, "计划创建成功");
            com.closePopup();
        });

    }

    com.uploadify("#attachment", "上传文件", api.common.uploadOther, 'btn btn-sm btn-primary lineheight0', "*.xls", {
        'uploadType': 3
    }, 1, function(data) {

        0 == data.errorCode ? com.focusPage("#filePath").val(data.resUrl) : alert(data.errorMsg);
    });

    // 上传图片
    function initUploadBtn() {

        com.uploadify("#goodsUpload", "上传图片", api.common.uploadImg, 'btn btn-success', '*.jpg;*.jpeg;*.gif;*.png', {
            'uploadType': 0
        }, 1, function(data) {

            var options = {};

            options["dataDrawing.sid"] = goods.gid;
            options["dataDrawing.name"] = data.strutsUploadsFileName;
            options["dataDrawing.drawingUrl"] = data.resUrl;
            options["dataDrawing.drawingType"] = 0;
            options["dataDrawing.type"] = 2;
            options["dataDrawing.filesize"] = data.filesize;

            com.post(api.communion.addDataDrawing, options, function(res) {

                var drawing = res.dataDrawing;

                appendGalleryElement("goodsDrawing", drawing);
                com.popup4photos("#goodsDrawing");
            });

            searcher.doSearch();
        });
    }

    function appendGalleryElement(galleryId, value) {

        var gallery = com.focusPage("#" + galleryId);

        var imgLi = $("<li></li>").attr("id", "gallery_li" + value.ddid).addClass("text-center col-sm-4").css("border", "0px").css("border-color", "white").css("padding", "0px").css("height", "150px").css("width", "150px").appendTo(gallery);
        var img = $('<img/>');
        var imgA = $("<a></a>").addClass('cboxElement').attr("target", "_blank").css("height", "150px").append(img).appendTo(imgLi);

        com.showImg(img, value.drawingUrl, 150, 150, value.name, null, value.drawingType);

        var toolsDiv = $("<div></div>").addClass("tools tools-bottom").appendTo(imgLi);

        var toolsA = $("<a></a>").attr("href", "#").on("click", function() {

            com.post(api.communion.deleteDataDrawing, {
                "dataDrawing.ddid": value.ddid
            }, function(res) {

                com.focusPage("#gallery_li" + value.ddid).remove();
            });

        }).appendTo(toolsDiv);

        var goodsUrl = $("<a></a>").attr("href", "#").on("click", function() {

            var option = {
                "goods.gid": goods.gid,
                "goods.path": value.drawingUrl
            };

            com.post(api.data.updateGoods, option, function(e) {

                searcher.doSearch();
                com.showAlert(com.info, "操作成功");
            });

        }).appendTo(toolsDiv);

        $("<i></i>").addClass("icon-remove red").appendTo(toolsA);
        $("<i></i>").addClass("icon-plus green").appendTo(goodsUrl);
    }

});
