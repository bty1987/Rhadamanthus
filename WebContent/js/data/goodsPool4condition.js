$(function () {
    var claimGoods = {

        btns: {

        },
        modals: {

        },
        items: {

        }
    };

    var searcher = new Searcher();

    searcher.base("condListGoodsPool", "pagenationGoodsPool", "resultListGoodsPool", api.communion.pageGoodsPool);
    searcher.condition(['data-goods-no', 'data-goods-name', 'data-goods-barcode', 'data-goods-brand-name', 'data-goods-status']);
    searcher.history("goodsPoolPageDataHistory");
    searcher.param({
        "goodsPool.atttype": params.atttype
    });

    searcher.button([{
        id: "addGoods",
        name: "添加商品",
        clazz: "btn-success",
        icon: "icon-plus"
    }, {
        id: "checkAll",
        name: "全选",
        clazz: "btn-pink",
        icon: "icon-plus"
    },]);

    var lineprops = [{
        field: "gpid",
        type: "checkbox",
        prop: "gpid"
    }, {
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
        prop: "type",
        clazz: "red",
        dataset: constant.data().goods.type.keys
    }, {
        field: "zerokind.name",
        name: "统计类别",
        prop: "zerokind.name",
        clazz: "grey"
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
        prop: function (v) {

            var str = "";
            $.each(constant.data().goodsPool.cascade.datas, function (i, j) {

                if ((v.colorcascade & j.key) > 0)
                    str = str + j.value + " ";
            });

            return v.colorcascadeStr = str
        },
        clazz: "grey"
    }, {
        fieId: "formatcascadeStr",
        name: "规格级联",
        prop: function (v) {

            var str = "";
            $.each(constant.data().goodsPool.cascade.datas, function (i, j) {

                if ((v.formatcascade & j.key) > 0)
                    str = str + j.value + " ";
            });

            return v.formatcascadeStr = str
        },
        clazz: "grey"
    }, {
        fieId: "pricecascadeStr",
        name: "价格级联",
        prop: function (v) {

            var str = "";
            $.each(constant.data().goodsPool.cascade.datas, function (i, j) {

                if ((v.pricecascade & j.key) > 0)
                    str = str + j.value + " ";
            });

            return v.pricecascadeStr = str
        },
        clazz: "grey"
    }, {
        fieId: "picturecascadeStr",
        name: "图片级联",
        prop: function (v) {

            var str = "";
            $.each(constant.data().goodsPool.cascade.datas, function (i, j) {

                if ((v.picturecascade & j.key) > 0)
                    str = str + j.value + " ";
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
    }, {
        field: "series",
        name: "系列",
        prop: "series",
        clazz: "grey"
    }, {
        field: "elevel",
        name: "环保级别",
        prop: "elevel",
        clazz: "grey"
    }, {
        field: "material",
        name: "材质",
        prop: "material",
        clazz: "grey"
    }, {
        field: "quality",
        name: "特性",
        prop: "quality",
        clazz: "grey"
    }, {
        field: "color",
        name: "颜色",
        prop: "color",
        clazz: "grey"
    }, {
        field: "format",
        name: "规格",
        prop: "format",
        clazz: "grey"
    }, {
        field: "model",
        name: "型号",
        prop: "model",
        clazz: "grey"
    }, {
        fieId: "atttype",
        name: "装修类型",
        prop: "atttype",
        clazz: "red",
        dataset: constant.data().goodsPool.atttype.keys
    }];


    searcher.line("name", lineprops, "");

    searcher.render();

    com.focusPage('#addGoods').on("click", function () {

        var $inputs = com.focusPage('input[gpid][type="checkbox"]:checked');

        if (!$inputs.length) {
            com.showAlert(com.warning, "请选择需要添加的商品");
            return false;
        }

        var option = {};

        $.each($inputs, function (i, v) {

            var $input = $(v);

            if ($input.attr('goodsPool.gpid') != 0) {

                option["goodsPools[" + i + "].gpid"] = $input.attr('gpid');
            }

        });

        com.post(api.communion.batchAddFromPool, option, function () {

            com.showAlert(com.info, "操作成功");

            searcher.doSearch();

            com.closePopup();
        });
    });

    com.focusPage('#checkAll').on("click", function () {

        if (com.focusPage('input[type="checkbox"][gpid]').prop('checked')) {
            com.focusPage('input[type="checkbox"][gpid]').removeAttr('checked');
            com.focusPage('input[type="checkbox"][gpid]').prop('checked', false);
        } else {
            com.focusPage('input[type="checkbox"][gpid]').attr('checked', true);
            com.focusPage('input[type="checkbox"][gpid]').prop('checked', true);
        }
    });

});