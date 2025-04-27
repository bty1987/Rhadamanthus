$(function() {

    var goodsPool = {

        gpid: null,
        keyword: null,

        items: {
            no: com.focusPage("#no", "#addGoodsPoolLayer"),
            type: com.focusPage("#type", "#addGoodsPoolLayer"),
            name: com.focusPage("#name", "#addGoodsPoolLayer"),
            alias: com.focusPage("#alias", "#addGoodsPoolLayer"),
            barcode: com.focusPage("#barcode", "#addGoodsPoolLayer"),
            category: com.focusPage("#category", "#addGoodsPoolLayer"),
            brand: com.focusPage("#brand", "#addGoodsPoolLayer"),
            measurementUnit: com.focusPage("#measurementUnit", "#addGoodsPoolLayer"),
            purchase: com.focusPage("#purchase", "#addGoodsPoolLayer"),
            selling: com.focusPage("#selling", "#addGoodsPoolLayer"),
            confine: com.focusPage("#confine", "#addGoodsPoolLayer"),
            pieceNum: com.focusPage("#pieceNum", "#addGoodsPoolLayer"),
            accessoriesType: com.focusPage("#accessoriesType", "#addGoodsPoolLayer"),
            onekind: com.focusPage("#onekind", "#addGoodsPoolLayer"),
            twokind: com.focusPage("#twokind", "#addGoodsPoolLayer"),
            thrkind: com.focusPage("#thrkind", "#addGoodsPoolLayer"),
            colorcascade: com.focusPage("#colorcascade", "#addGoodsPoolLayer"),
            formatcascade: com.focusPage("#formatcascade", "#addGoodsPoolLayer"),
            pricecascade: com.focusPage("#pricecascade", "#addGoodsPoolLayer"),
            picturecascade: com.focusPage("#picturecascade", "#addGoodsPoolLayer"),

            executeTimes: com.focusPage("#executeTimes", "#uploadGoodsPoolDiv"),
            executeDates: com.focusPage("#executeDates", "#uploadGoodsPoolDiv"),

            filePath: com.focusPage("#filePath", "#uploadGoodsPoolDiv")
        },

        btns: {
            submitBtn: com.focusPage("#submitBtn", "#addGoodsPoolLayer"),
            importBtn: com.focusPage("#importBtn", "#uploadGoodsPoolDiv"),
            exportBtn: com.focusPage("#exportBtn", "#uploadGoodsPoolDiv")
        },

        modals : {
            drawingGoodsPoolModal: com.focusPage("#drawingGoodsPoolModal")
        }
    };

    com.datetime(goodsPool.items.executeDates, "date", false);
    com.datetime(goodsPool.items.executeTimes, "time", false);

    goodsPool.items.type.bindData(constant.data().goodsPool.type.datas, 'key', 'value');

    com.post(api.data.queryCategory, {}, function(res) {

        goodsPool.items.category.bindData(res.categorys, "categoryName", "categoryName");
    });

    com.post(api.common.queryMeasurementUnit, {}, function(res) {

        goodsPool.items.measurementUnit.bindData(res.measurementUnits, "name", "name");
    });

    com.post(api.data.queryAccessoriesType, {}, function(res) {

        goodsPool.items.accessoriesType.bindData(res.accessoriesTypes, 'atid', 'name', true);
    });

    com.post(api.data.queryGoodsKind, {}, function(res) {
        var oneKinds = [];
        var twoKinds = [];
        var thrKinds = [];

        $.each(res.goodsKinds, function(i, v) {
            if (v.status == 0) {
                switch (v.level) {
                    case 1:
                        oneKinds.push({"key": v.gkid, "value": v.name});
                        break;
                    case 2:
                        twoKinds.push({"key": v.gkid, "value": v.name});
                        break;
                    case 3:
                        thrKinds.push({"key": v.gkid, "value": v.name});
                        break;
                }
            }
        });
        goodsPool.items.onekind.bindData(oneKinds, 'key', 'value');
        goodsPool.items.twokind.bindData(twoKinds, 'key', 'value');
        goodsPool.items.thrkind.bindData(thrKinds, 'key', 'value');
    });

    goodsPool.btns.importBtn.click(function() {

        importGoodsPool();
    });

    goodsPool.btns.exportBtn.click(function() {

        exportGoodsPool();
    });

    com.initTypeahead("brand", api.data.queryBrandByPinyin, "brand.pinyin", {}, "brands", "bid", "name", function(list, k, v) {

        $.each(list, function(index, val) {

            if (val.bid == k) {

                goodsPool.bid = k;

                com.post(api.data.queryBrandByBid, {"brand.bid": k}, function(res) {

                    goodsPool.items.category.val(res.brand.categoryName);
                });
            }
        });

        return v;
    });

    initUploadBtn();

    var searcher = new Searcher();

    searcher.base("condListGoodsPool", "pagenationGoodsPool", "resultListGoodsPool", api.communion.pageGoodsPool);
    searcher.condition(['data-goods-no', 'data-goods-name', 'data-goods-barcode', 'data-goods-brand-name', 'data-goods-status']);
    searcher.history("goodsPoolPageDataHistory");

    searcher.button(function() {

        var $btnGroup = $("<div></div>").addClass("btn-group");

        var $adda = $('<a></a>').addClass('btn btn-minier btn-primary').attr('id', 'add').css({
            'margin-left': '4px'
        }).appendTo($btnGroup);
        var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
        var $addspan = $('<span></span>').text('添加').appendTo($adda);

        var $exportGroup = $("<div></div>").addClass("btn-group hide");
        var $addaExport = $('<a></a>').addClass('btn btn-minier btn-success dropdown-toggle').attr("data-toggle", "dropdown").attr('name', 'importGoodsPool').css({
            'margin-left': '4px'
        }).appendTo($exportGroup);
        $('<i></i>').addClass('icon-cloud-upload bigger-110').appendTo($addaExport);
        $('<span></span>').text('导出').appendTo($addaExport);
        $('<span></span>').addClass('icon-caret-down icon-on-right').appendTo($addaExport);

        var $addExportUl = $("<ul></ul>").addClass("dropdown-menu dropdown-inverse").appendTo($exportGroup);
        var $exportGoodsPool = $("<li></li>").append($("<a></a>").attr("id", "exportGoodsPoolBtn").text("导出商品")).appendTo($addExportUl);
        var $exportColor = $("<li></li>").append($("<a></a>").attr("id", "exportColor").text("导出颜色")).appendTo($addExportUl);
        var $exportFormat = $("<li></li>").append($("<a></a>").attr("id", "exportFormat").text("导出规格")).appendTo($addExportUl);
        var $exportPrice = $("<li></li>").append($("<a></a>").attr("id", "exportPrice").text("导出价格")).appendTo($addExportUl);

        var $importGroup = $("<div></div>").addClass("btn-group hide");
        var $addaImport = $('<a></a>').addClass('btn btn-minier btn-warning dropdown-toggle').attr("data-toggle", "dropdown").attr('name', 'importGoodsPool').css({
            'margin-left': '4px'
        }).appendTo($importGroup);
        $('<i></i>').addClass('icon-cloud-upload bigger-110').appendTo($addaImport);
        $('<span></span>').text('导入').appendTo($addaImport);
        $('<span></span>').addClass('icon-caret-down icon-on-right').appendTo($addaImport);

        var $addImportUl = $("<ul></ul>").addClass("dropdown-menu dropdown-inverse").appendTo($importGroup);
        var $importGoodsPool = $("<li></li>").append($("<a></a>").attr("id", "importGoodPoll").text("导入商品")).appendTo($addImportUl);
        var $importColorGoodsPool = $("<li></li>").append($("<a></a>").attr("id", "importCol").text("导入颜色")).appendTo($addImportUl);
        var $importFormatGoodsPool = $("<li></li>").append($("<a></a>").attr("id", "importFor").text("导入规格")).appendTo($addImportUl);
        var $importPriceGoodsPool = $("<li></li>").append($("<a></a>").attr("id", "importPri").text("导入价格")).appendTo($addImportUl);

        var $updateGroup = $("<div></div>").addClass("btn-group hide");
        var $addaUpdate = $('<a></a>').addClass('btn btn-minier btn-danger dropdown-toggle').attr("data-toggle", "dropdown").attr('name', 'importGoodsPool').css({
            'margin-left': '4px'
        }).appendTo($updateGroup);
        $('<i></i>').addClass('icon-cloud-upload bigger-110').appendTo($addaUpdate);
        $('<span></span>').text('更新').appendTo($addaUpdate);
        $('<span></span>').addClass('icon-caret-down icon-on-right').appendTo($addaUpdate);

        var $addUpdateUl = $("<ul></ul>").addClass("dropdown-menu dropdown-inverse").appendTo($updateGroup);
        var $deleteGoodsPool = $("<li></li>").append($("<a></a>").attr("id", "deletePriceGoodsPoolBtn").text("删除商品价格")).appendTo($addUpdateUl);
        var $statusGoodsPool = $("<li></li>").append($("<a></a>").attr("id", "statusGoodsPoolBtn").text("更新商品状态")).appendTo($addUpdateUl);

        return [$btnGroup, $exportGroup, $importGroup, $updateGroup];
    });

    var lineprops = [{
        type: "img",
        prop: "path"
    },{
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
        prop: "type",
        clazz: "red",
        dataset: constant.data().goods.type.keys
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
        fieId: "colorcascadeStr",
        name: "颜色级联",
        prop: function(v) {
            var str = "";
            $.each(constant.data().goodsPool.cascade.datas, function (i, j) {
                if ((v.colorcascade & j.key) > 0) str = str + j.value + " ";
            });

            return v.colorcascadeStr = str
        },
        clazz: "grey"
    }, {
        fieId: "formatcascadeStr",
        name: "规格级联",
        prop: function(v) {
            var str = "";
            $.each(constant.data().goodsPool.cascade.datas, function (i, j) {
                if ((v.formatcascade & j.key) > 0) str = str + j.value + " ";
            });

            return v.formatcascadeStr = str
        },
        clazz: "grey"
    }, {
        fieId: "pricecascadeStr",
        name: "价格级联",
        prop: function(v) {
            var str = "";
            $.each(constant.data().goodsPool.cascade.datas, function (i, j) {
                if ((v.pricecascade & j.key) > 0) str = str + j.value + " ";
            });

            return v.pricecascadeStr = str
        },
        clazz: "grey"
    }, {
        fieId: "picturecascadeStr",
        name: "图片级联",
        prop: function(v) {
            var str = "";
            $.each(constant.data().goodsPool.cascade.datas, function (i, j) {
                if ((v.picturecascade & j.key) > 0) str = str + j.value + " ";
            });

            return v.picturecascadeStr = str
        },
        clazz: "grey"
    }, {
        fieId: "status",
        name: "状态",
        prop: "status",
        clazz: "red",
        dataset: constant.data().goods.status.keys
    }];

    var linebtns = [{
        name: "编辑",
        clazz: "btn-success",
        handle: function(v) {

            readonly("disabled");

            goodsPool.gpid = v.gpid;
            goodsPool.bid = v.bid;

            goodsPool.items.no.val(v.no);
            goodsPool.items.type.val(v.type);
            goodsPool.items.name.val(v.name);
            goodsPool.items.alias.val(v.alias);
            goodsPool.items.barcode.val(v.barcode);
            goodsPool.items.brand.val(v.brand);
            goodsPool.items.category.val(v.category);

            goodsPool.items.measurementUnit.val(v.measurementUnit);
            goodsPool.items.purchase.val(v.purchase);
            goodsPool.items.selling.val(v.selling);
            goodsPool.items.confine.val(v.confine);
            goodsPool.items.pieceNum.val(v.pieceNum);
            goodsPool.items.accessoriesType.val(v.accessoriesType.atid);
            goodsPool.items.onekind.val(v.onekind.gkid);
            goodsPool.items.twokind.val(v.twokind.gkid);
            goodsPool.items.thrkind.val(v.thrkind.gkid);

            drawRadio(constant.data().goodsPool.cascade.datas, "color", com.focusPage("#colorcascadeDiv"), false, v.colorcascade);
            drawRadio(constant.data().goodsPool.cascade.datas, "format", com.focusPage("#formatcascadeDiv"), false, v.formatcascade);
            drawRadio(constant.data().goodsPool.cascade.datas, "price", com.focusPage("#pricecascadeDiv"), false, v.pricecascade);
            drawRadio(constant.data().goodsPool.cascade.datas, "picture", com.focusPage("#picturecascadeDiv"), false, v.picturecascade);

            com.popup4model("#addGoodsPoolLayer", "编辑");
        }
    }, {
        name: "颜色",
        clazz: "btn-warning",
        handle: function(v) {

            params.data.goodsPool = v;

            com.popup4page('#goodsPoolLayerPopUp', 'views/data/colorPool.html', '颜色池');
        }
    }, {
        name: "规格",
        clazz: "btn-primary",
        handle: function(v) {

            params.data.goodsPool = v;

            com.popup4page('#goodsPoolLayerPopUp', 'views/data/formatPool.html', '规格池');
        }
    }, {
        name: "价格",
        clazz: "btn-pink",
        handle: function(v) {

            params.data.goodsPool = v;

            com.popup4page('#goodsPoolLayerPopUp', 'views/data/pricePool.html', '价格池');
        }
    }, {
        name: "图片",
        clazz: "btn-yellow",
        handle: function(v) {

            goodsPool.gpid = v.gpid;

            com.focusPage('#goodsPoolDrawing').html("");

            com.post(api.communion.queryDataDrawing, {"dataDrawing.sid": v.gpid, "dataDrawing.type": 5}, function(data) {

                var dataDrawings = data.dataDrawings;

                if (dataDrawings && dataDrawings.length > 0) {
                    $.each(dataDrawings, function(i, value) {

                        appendGalleryElement("goodsPoolDrawing", value);
                    });
                    com.popup4photos("#goodsPoolDrawing");
                }
            }, null, false);

            goodsPool.modals.drawingGoodsPoolModal.modal("show");
        }
    }, {
        name: "分配",
        clazz: "btn-danger",
        handle: function (v) {

            params.data.goodsPool = v;

            com.popup4page('#goodsListPopUp', 'views/data/goodsPool2alloce.html', '商品');
        }
    }, {
        name: "状态",
        type: "switch",
        clazz: "status-lbl",
        handle: function(v, check) {

            com.post(api.communion.updateGoodsPoolForStatus, {"goodsPool.gpid": v.gpid, "goodsPool.status": v.status == 0 ? 1 : 0}, function(res) {

                com.showAlert(com.info, "操作成功");
                searcher.doSearch();
            });

            return false;
        },
        init: function(v) {

            return !v.status;
        }
    }];

    searcher.line("name", lineprops, linebtns);

    searcher.render();

    com.focusPage('#add', '#pagenationGoodsPool').on("click", function() {

        com.cleanItems(goodsPool.items);

        readonly(null);

        goodsPool.gpid = null;
        goodsPool.bid = null;

        drawRadio(constant.data().goodsPool.cascade.datas, "color", com.focusPage("#colorcascadeDiv"), true, null);
        drawRadio(constant.data().goodsPool.cascade.datas, "format", com.focusPage("#formatcascadeDiv"), true, null);
        drawRadio(constant.data().goodsPool.cascade.datas, "price", com.focusPage("#pricecascadeDiv"), true, null);
        drawRadio(constant.data().goodsPool.cascade.datas, "picture", com.focusPage("#picturecascadeDiv"), true, null);

        com.popup4model("#addGoodsPoolLayer", "添加");
    });

    com.focusPage('#export', '#pagenationGoodsPool').on("click", function() {

        var total = com.focusPage('span[name="totalRecords"]').text();

        if (total == 0) {
            com.showAlert(com.warning, "请通过条件进行查询");
            return false;
        }

        if (com.focusPage('span[name="totalRecords"]').text() > 1000) {
            com.showAlert(com.warning, "查询结果大于阀值 , 导出失败");
            return false;
        }

        com.post(api.communion.pageGoodsPool, $.extend({}, params["goodsPoolPageDataHistory"], {
            "paging.noPage": 1
        }), function(res) {

            $.exceler({
                column: [['商品ID', 'gpid'], ['商品编码', 'no'], ['商品名称', 'name'], ['别名', 'alias'], ['条形码', 'barcode'], ['品类', 'category'], ['品牌ID', 'bid'], ['品牌', 'brand'], ['单位', 'measurementUnit'], ['件数', 'pieceNum'], ['辅类', 'accessoriesType.name'], ['类型', 'type'], ['一类', 'onekind.name'], ['二类', 'twokind.name'], ['三类', 'thrkind.name']],
                list: res.paging.data
            }, function(v) {

                v.type = v.type == "0" ? "商品" : "套餐";
                v.accessoriesType = v.accessoriesType == null ? {"accessoriesType": ""} : v.accessoriesType;
                v.onekind = v.onekind == null ? {"onekind": ""} : v.onekind;
                v.twokind = v.twokind == null ? {"twokind": ""} : v.twokind;
                v.thrkind = v.thrkind == null ? {"thrkind": ""} : v.thrkind;
            });
        });
    });

    com.focusPage('#deletePriceGoodsPoolBtn', '#pagenationGoodsPool').on("click", function() {

        goodsPool.keyword = "update_delete_price";

        var form = com.focusPage("#deletePriceGoodsPoolForm");

        com.focusPage("#uploadGoodsPoolDiv").removeClass("hide").appendTo(form);
        com.focusPage("#fileUpload").removeClass("hide");

        goodsPool.btns.importBtn.removeClass("hide");
        goodsPool.btns.exportBtn.addClass("hide");

        com.popup4model("#deletePriceGoodsPool", "删除价格");
    });

    com.focusPage('#statusGoodsPoolBtn', '#pagenationGoodsPool').on("click", function() {

        goodsPool.keyword = "update_status_goods";

        var form = com.focusPage("#statusGoodsPoolForm");

        com.focusPage("#uploadGoodsPoolDiv").removeClass("hide").appendTo(form);
        com.focusPage("#fileUpload").removeClass("hide");

        goodsPool.btns.importBtn.removeClass("hide");
        goodsPool.btns.exportBtn.addClass("hide");

        com.popup4model("#statusGoodsPool", "更新商品价格");
    });

    com.focusPage('#exportGoodsPoolBtn', '#pagenationGoodsPool').on("click", function() {

        var total = com.focusPage('span[name="totalRecords"]').text();

        goodsPool.keyword = "export_inventory_goods"; // 导出仓储商品

        var form = com.focusPage("#exportGoodsPoolForm");

        com.focusPage("#uploadGoodsPoolDiv").removeClass("hide").appendTo(form);
        com.focusPage("#fileUpload").addClass("hide");

        goodsPool.btns.importBtn.addClass("hide");
        goodsPool.btns.exportBtn.removeClass("hide");

        com.popup4model("#exportGoodsPool", "导出商品");
    });

    com.focusPage('#exportColor', '#pagenationGoodsPool').on("click", function() {

        var total = com.focusPage('span[name="totalRecords"]').text();

        goodsPool.keyword = "export_goods_color";

        var form = com.focusPage("#exportGoodsPoolModalForm");

        com.focusPage("#uploadGoodsPoolDiv").removeClass("hide").appendTo(form);
        com.focusPage("#fileUpload").addClass("hide");

        goodsPool.btns.importBtn.addClass("hide");
        goodsPool.btns.exportBtn.removeClass("hide");

        com.popup4model("#exportGoodsPoolModal", "导出颜色");
    });

    com.focusPage('#exportFormat', '#pagenationGoodsPool').on("click", function() {

        var total = com.focusPage('span[name="totalRecords"]').text();

        goodsPool.keyword = "export_goods_format";

        var form = com.focusPage("#exportGoodsPoolModalForm");

        com.focusPage("#uploadGoodsPoolDiv").removeClass("hide").appendTo(form);
        com.focusPage("#fileUpload").addClass("hide");

        goodsPool.btns.importBtn.addClass("hide");
        goodsPool.btns.exportBtn.removeClass("hide");

        com.popup4model("#exportGoodsPoolModal", "导出规格");
    });

    com.focusPage('#exportPrice', '#pagenationGoodsPool').on("click", function() {

        var total = com.focusPage('span[name="totalRecords"]').text();

        goodsPool.keyword = "export_goods_price";

        var form = com.focusPage("#exportGoodsPoolModalForm");

        com.focusPage("#uploadGoodsPoolDiv").removeClass("hide").appendTo(form);
        com.focusPage("#fileUpload").addClass("hide");

        goodsPool.btns.importBtn.addClass("hide");
        goodsPool.btns.exportBtn.removeClass("hide");

        com.popup4model("#exportGoodsPoolModal", "导出价格");
    });

    com.focusPage('#importGoodPoll', '#pagenationGoodsPool').on("click", function() {

        goodsPool.keyword = "import_goods";

        var form = com.focusPage("#importGoodsPoolForm");

        com.focusPage("#uploadGoodsPoolDiv").removeClass("hide").appendTo(form);
        com.focusPage("#fileUpload").removeClass("hide");

        goodsPool.btns.importBtn.removeClass("hide");
        goodsPool.btns.exportBtn.addClass("hide");

        com.popup4model("#importGoodsPool", "导入商品");
    });

    com.focusPage('#importCol', '#pagenationGoodsPool').on("click", function() {

        goodsPool.keyword = "import_color";

        var form = com.focusPage("#importColorGoodsPoolForm");

        com.focusPage("#uploadGoodsPoolDiv").removeClass("hide").appendTo(form);
        com.focusPage("#fileUpload").removeClass("hide");

        goodsPool.btns.importBtn.removeClass("hide");
        goodsPool.btns.exportBtn.addClass("hide");

        com.popup4model("#importColorGoodsPool", "导入颜色");
    });

    com.focusPage('#importFor', '#pagenationGoodsPool').on("click", function() {

        goodsPool.keyword = "import_format";

        var form = com.focusPage("#importFormatGoodsPoolForm");

        com.focusPage("#uploadGoodsPoolDiv").removeClass("hide").appendTo(form);
        com.focusPage("#fileUpload").removeClass("hide");

        goodsPool.btns.importBtn.removeClass("hide");
        goodsPool.btns.exportBtn.addClass("hide");

        com.popup4model("#importFormatGoodsPool", "导入规格");
    });

    com.focusPage('#importPri', '#pagenationGoodsPool').on("click", function() {

        goodsPool.keyword = "import_price";

        var form = com.focusPage("#importPriceGoodsPoolForm");

        com.focusPage("#uploadGoodsPoolDiv").removeClass("hide").appendTo(form);
        com.focusPage("#fileUpload").removeClass("hide");

        goodsPool.btns.importBtn.removeClass("hide");
        goodsPool.btns.exportBtn.addClass("hide");

        com.popup4model("#importPriceGoodsPool", "导入价格");
    });

    goodsPool.btns.submitBtn.click(function() {

        saveData();
    });

    function saveData() {

        if (com.validate("formGoodsPool", "right")) {
            return false;
        }

        var gpid = goodsPool.gpid;
        var atid = goodsPool.items.accessoriesType.val();

        var $colorcascades = com.focusPage('input[name="colorcascade"]:checked', '#addGoodsPoolLayer #colorcascadeDiv');
        var $formatcascade = com.focusPage('input[name="formatcascade"]:checked', '#addGoodsPoolLayer #formatcascadeDiv');
        var $pricecascade = com.focusPage('input[name="pricecascade"]:checked', '#addGoodsPoolLayer #pricecascadeDiv');
        var $picturecascade = com.focusPage('input[name="picturecascade"]:checked', '#addGoodsPoolLayer #picturecascadeDiv');

        var colorcascadeVal = 0, formatcascade = 0, pricecascade = 0, picturecascade = 0;

        $.each($colorcascades, function(i, v) {
            colorcascadeVal = utils.accAdd(parseInt(colorcascadeVal), parseInt($(v).attr('value')));
        });

        $.each($formatcascade, function(i, v) {
            formatcascade = utils.accAdd(parseInt(formatcascade), parseInt($(v).attr('value')));
        });

        $.each($pricecascade, function(i, v) {
            pricecascade = utils.accAdd(parseInt(pricecascade), parseInt($(v).attr('value')));
        });

        $.each($picturecascade, function(i, v) {
            picturecascade = utils.accAdd(parseInt(picturecascade), parseInt($(v).attr('value')));
        });

        var url = api.communion.updateGoodsPool;
        var options = {
            "goodsPool.type": goodsPool.items.type.val(),
            "goodsPool.alias": goodsPool.items.alias.val(),
            "goodsPool.purchase": goodsPool.items.purchase.val(),
            "goodsPool.selling": goodsPool.items.selling.val(),
            "goodsPool.confine": goodsPool.items.confine.val(),
            "goodsPool.accessoriesType.atid": atid == null || atid == "" ? "" : atid,
            "goodsPool.onekind.gkid": goodsPool.items.onekind.val(),
            "goodsPool.twokind.gkid": goodsPool.items.twokind.val(),
            "goodsPool.thrkind.gkid": goodsPool.items.thrkind.val(),
            "goodsPool.colorcascade": colorcascadeVal,
            "goodsPool.formatcascade": formatcascade,
            "goodsPool.pricecascade": pricecascade,
            "goodsPool.picturecascade": picturecascade
        };

        if (!gpid) {
            url = api.communion.addGoodsPool;
            options["goodsPool.no"] = goodsPool.items.no.val();
            options["goodsPool.name"] = goodsPool.items.name.val();
            options["goodsPool.alias"] = goodsPool.items.alias.val();
            options["goodsPool.barcode"] = goodsPool.items.barcode.val();
            options["goodsPool.bid"] = goodsPool.bid;
            options["goodsPool.category"] = goodsPool.items.category.val();
            options["goodsPool.measurementUnit"] = goodsPool.items.measurementUnit.val();
            options["goodsPool.pieceNum"] = goodsPool.items.pieceNum.val();
        } else {
            options["goodsPool.gpid"] = goodsPool.gpid;
        }

        com.post(url, options, function(res) {

            com.showAlert(com.info, "操作成功");

            com.closePopup();

            searcher.doSearch();
        });
    }

    function readonly(disabled) {
        com.focusPage("#colorcascadeDiv").html("");
        com.focusPage("#formatcascadeDiv").html("");
        com.focusPage("#pricecascadeDiv").html("");
        com.focusPage("#picturecascadeDiv").html("");

        goodsPool.items.no.attr("disabled", disabled);
        goodsPool.items.type.attr("disabled", disabled);
        goodsPool.items.name.attr("disabled", disabled);
        goodsPool.items.barcode.attr("disabled", disabled);
        goodsPool.items.category.attr("disabled", disabled);
        goodsPool.items.brand.attr("disabled", disabled);
        goodsPool.items.measurementUnit.attr("disabled", disabled);
        goodsPool.items.pieceNum.attr("disabled", disabled);
    }

    function importGoodsPool() {

        if (com.validate("uploadGoodsPoolDiv")) {
            return false;
        }

        var filePath = goodsPool.items.filePath.val();

        if (filePath == null || filePath == "") {
            com.showAlert(com.warning, "上传文件不能为空");
            return false;
        }

        var args = filePath;

        var date = goodsPool.items.executeDates.val();
        var time = goodsPool.items.executeTimes.val();

        var executeTime = date.replace(/-/g, '').substr(2) + time.replace(/:/g, '').substr(0, 4);

        var times = goodsPool.items.executeDates.val() + ' ' + goodsPool.items.executeTimes.val();
        var checkTime = new Date(times);

        if (!planUtils.TimeComparison(checkTime, config.planTimeLimit)) {
            com.showAlert(com.warning, "执行时间请大于当前时间" + config.planTimeLimit + "分钟");
            return false;
        }

        var options = {
            "plan.task.keyWord": goodsPool.keyword,
            "plan.executeTime": executeTime,
            "plan.args": args
        };

        com.post(api.information.createPlan, options, function(res) {

            com.showAlert(com.info, "计划创建成功");
            com.closePopup();
        });

    }

    function exportGoodsPool() {

        if (com.validate("uploadGoodsPoolDiv")) {
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

        var date = goodsPool.items.executeDates.val();
        var time = goodsPool.items.executeTimes.val();

        var executeTime = date.replace(/-/g, '').substr(2) + time.replace(/:/g, '').substr(0, 4);

        var times = goodsPool.items.executeDates.val() + ' ' + goodsPool.items.executeTimes.val();
        var checkTime = new Date(times);

        if (!planUtils.TimeComparison(checkTime, config.planTimeLimit)) {
            com.showAlert(com.warning, "执行时间请大于当前时间" + config.planTimeLimit + "分钟");
            return false;
        }

        var options = {
            "plan.task.keyWord": goodsPool.keyword,
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

        com.uploadify("#goodsPoolUpload", "上传图片", api.common.uploadImg, 'btn btn-success', '*.jpg;*.jpeg;*.gif;*.png', {
            'uploadType': 0
        }, 1, function(data) {

            var options = {};

            options["dataDrawing.sid"] = goodsPool.gpid;
            options["dataDrawing.name"] = data.strutsUploadsFileName;
            options["dataDrawing.drawingUrl"] = data.resUrl;
            options["dataDrawing.drawingType"] = 0;
            options["dataDrawing.type"] = 5;
            options["dataDrawing.filesize"] = data.filesize;

            com.post(api.communion.addDataDrawing, options, function(res) {

                var drawing = res.dataDrawing;

                appendGalleryElement("goodsPoolDrawing", drawing);
                com.popup4photos("#goodsPoolDrawing");
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

            com.post(api.communion.deleteDataDrawing, {"dataDrawing.ddid": value.ddid}, function(res) {
                com.focusPage("#gallery_li" + value.ddid).remove();
            });

        }).appendTo(toolsDiv);

        var goodsPoolUrl = $("<a></a>").attr("href", "#").on("click", function() {

            var option = {
                "goodsPool.gpid": goodsPool.gpid,
                "goodsPool.path": value.drawingUrl
            };

            com.post(api.communion.updateGoodsPool, option, function(e) {

                searcher.doSearch();
                com.showAlert(com.info, "操作成功");
            });

        }).appendTo(toolsDiv);

        $("<i></i>").addClass("icon-remove red").appendTo(toolsA);
        $("<i></i>").addClass("icon-plus green").appendTo(goodsPoolUrl);
    }

    function drawRadio(items, name, div, addFlag, num) {
        $.each(items, function (i, v) {
            var $label = $('<label></label>').addClass('inline').appendTo(div);
            var $input = $('<input />').addClass('ace').attr({'type': 'checkbox', 'value':v.key, 'name': name + 'cascade'}).appendTo($label);
            if (addFlag && i == 0 ) $input.attr('checked', true);
            if (!addFlag && (num & v.key) > 0) $input.attr('checked', true);
            var $span = $('<span></span>').addClass('lbl').css({'margin-right': '10px'}).html(v.value).appendTo($label);
        });
    }

});
